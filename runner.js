/**
 * runner.js — gắn nút "Chạy thử trên StackBlitz" vào những block code
 * có dạng Angular component standalone (template inline hoặc templateUrl).
 *
 * Khi user click → gom toàn bộ block code trong cùng bài học (TS/HTML/CSS),
 * tách thành nhiều file đúng chuẩn Angular, auto-import các symbol Angular
 * built-in còn thiếu (Component, CommonModule, Signal, RouterLink…),
 * mở StackBlitz tab mới với project Angular 17 đầy đủ ngữ cảnh.
 *
 * Resolution check: nếu block tham chiếu component/symbol KHÔNG nằm trong bài
 * (cross-lesson dep, Material UI…) → ẩn nút Run, tránh UX click rồi báo lỗi.
 */

(function () {
  const SDK_URL = 'https://unpkg.com/@stackblitz/sdk@1/bundles/sdk.umd.js';

  // ==================== Phát hiện ====================

  function isRunnableBlock(code) {
    if (!/@Component\s*\(/.test(code)) return false;
    if (!/export\s+(?:abstract\s+)?class\s+\w+/.test(code)) return false;
    // Phải có ít nhất một @Component có selector — tránh các fragment chỉ minh hoạ
    if (!/@Component\s*\(\s*\{[\s\S]*?selector\s*:\s*['"]/.test(code)) return false;
    // Có inline template HOẶC có templateUrl (bài học có thể tách HTML ra block khác)
    if (!/template\s*:\s*`/.test(code) && !/templateUrl\s*:/.test(code)) return false;
    return true;
  }

  function parseComponents(code) {
    const out = [];
    const re = /@Component\s*\(\s*\{([\s\S]*?)\}\s*\)\s*export\s+(?:abstract\s+)?class\s+(\w+)/g;
    let m;
    while ((m = re.exec(code))) {
      const meta = m[1];
      const className = m[2];
      const sel = meta.match(/selector\s*:\s*['"]([^'"]+)['"]/);
      const tplUrl = meta.match(/templateUrl\s*:\s*['"]\.?\/?([\w./-]+)['"]/);
      const stUrl = meta.match(/styleUrls?\s*:\s*\[?\s*['"]\.?\/?([\w./-]+)['"]/);
      const tplInline = meta.match(/template\s*:\s*`([\s\S]*?)`/);
      out.push({
        className,
        selector: sel ? sel[1] : null,
        hasInlineTemplate: !!tplInline,
        templateInline: tplInline ? tplInline[1] : null,
        templateUrl: tplUrl ? tplUrl[1] : null,
        styleUrl: stUrl ? stUrl[1] : null,
      });
    }
    return out;
  }

  function parseExportedClasses(code) {
    const out = [];
    const re = /export\s+(?:abstract\s+)?class\s+(\w+)/g;
    let m;
    while ((m = re.exec(code))) out.push(m[1]);
    return out;
  }

  /**
   * Block TS có phải là FILE hoàn chỉnh không, hay chỉ là method/fragment?
   * Chỉ những block self-contained mới đáng đưa vào project StackBlitz.
   *
   * Hợp lệ:
   *   - Có @Component/@Directive/@Pipe/@Injectable/@NgModule kèm class
   *   - Có top-level `export class|interface|function|const|let|type|enum`
   * Không hợp lệ (fragment):
   *   - Chỉ method body (vd `uploadFile(file: File) { ... }`)
   *   - Chỉ decorator field (vd `@Output() progress = ...`)
   *   - Chỉ `import` mà không có gì sau
   */
  function isCompleteTsFile(code) {
    if (/@(?:Component|Directive|Pipe|Injectable|NgModule)\s*\(/.test(code)) return true;
    if (/^\s*export\s+(?:abstract\s+)?(?:class|interface|function|const|let|var|type|enum)\s/m.test(code)) return true;
    return false;
  }

  // ==================== Phân loại block ====================

  function classifyBlock(text) {
    const t = text.trim();
    if (!t) return 'empty';

    // Shell command
    if (/^(?:\s*[#$])?\s*(?:ng|npm|pnpm|yarn|node|cd|mkdir|cat|touch|rm|cp|mv|export|set|brew)\b/m.test(t.split('\n')[0])) {
      return 'shell';
    }
    // File tree (├ └ ─ │)
    if (/[├└─│]/.test(t)) return 'tree';

    // TS code
    if (
      /@(?:Component|Directive|Pipe|Injectable|NgModule|Input|Output|HostListener|HostBinding|ViewChild|ContentChild)\b/.test(t) ||
      /\bexport\s+(?:abstract\s+)?(?:class|interface|function|const|type|enum)\b/.test(t) ||
      /\bimport\s+\{[^}]*\}\s+from\s+['"](?:@angular|rxjs)/.test(t) ||
      /\b(?:bootstrapApplication|inject)\s*\(/.test(t)
    ) {
      return 'ts';
    }

    // JSON config
    if (/^\s*\{[\s\S]*\}\s*$/.test(t) && /["']\w+["']\s*:/.test(t) && !/<\w+/.test(t)) {
      return 'json';
    }

    // CSS/SCSS — selectors + braces
    if (/^[\s\S]*\{[\s\S]*?:[\s\S]*?\}/.test(t) && /^\s*(?:\.[\w-]+|#[\w-]+|[\w-]+|:host)/.test(t.split('\n').find((l) => l.trim()) || '') && !/<\w+/.test(t)) {
      return 'css';
    }

    // HTML — có thẻ
    if (/<\w+[\s/>]/.test(t) || /^\s*&lt;/.test(t)) return 'html';

    return 'other';
  }

  // ==================== Suy đoán tên file ====================

  function camelToKebab(s) {
    return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  function inferTsFilename(code, components) {
    // Ưu tiên comment kiểu "// foo.component.ts"
    const m = code.match(/^\s*\/\/\s*([\w.-]+\.ts)\b/m);
    if (m) return m[1];

    // Suy từ component cuối cùng có selector
    const target = [...components].reverse().find((c) => c.selector) || components[components.length - 1];
    if (!target) return 'snippet.ts';

    const c = target.className;
    if (/Component$/.test(c)) return camelToKebab(c.replace(/Component$/, '')) + '.component.ts';
    if (/Directive$/.test(c)) return camelToKebab(c.replace(/Directive$/, '')) + '.directive.ts';
    if (/Pipe$/.test(c)) return camelToKebab(c.replace(/Pipe$/, '')) + '.pipe.ts';
    if (/Service$/.test(c)) return camelToKebab(c.replace(/Service$/, '')) + '.service.ts';
    return camelToKebab(c) + '.ts';
  }

  // ==================== Gom ngữ cảnh bài học ====================

  function gatherLessonContext(clickedPre) {
    const lesson = clickedPre.closest('.lesson');
    if (!lesson) return null;

    const allPres = [...lesson.querySelectorAll('pre')];
    const clickedIdx = allPres.indexOf(clickedPre);
    if (clickedIdx < 0) return null;

    // Lấy TOÀN BỘ block trong bài — để có thể ghép HTML/CSS xuất hiện sau block click
    const blocks = allPres.map((pre, i) => {
      const codeEl = pre.querySelector('code');
      const text = codeEl ? codeEl.textContent || '' : '';
      return { idx: i, kind: classifyBlock(text), text };
    });

    return { lesson, blocks, clickedIdx };
  }

  // ==================== Whitelist Angular built-ins ====================

  const ANGULAR_TAG_WHITELIST = new Set([
    'ng-content', 'ng-container', 'ng-template', 'router-outlet',
  ]);

  // Symbol → module path để auto-import (chỉ gồm Angular core/common/forms/router + rxjs)
  const ANGULAR_SYMBOL_MODULE = (() => {
    const m = {};
    const add = (mod, syms) => syms.forEach((s) => (m[s] = mod));

    add('@angular/core', [
      'Component', 'Directive', 'Pipe', 'Injectable', 'NgModule',
      'Input', 'Output', 'ViewChild', 'ViewChildren', 'ContentChild', 'ContentChildren',
      'HostBinding', 'HostListener', 'EventEmitter',
      'inject', 'signal', 'computed', 'effect', 'untracked',
      'ChangeDetectionStrategy', 'ChangeDetectorRef',
      'ElementRef', 'TemplateRef', 'ViewContainerRef', 'Renderer2', 'NgZone',
      'OnInit', 'OnChanges', 'OnDestroy', 'DoCheck',
      'AfterViewInit', 'AfterViewChecked', 'AfterContentInit', 'AfterContentChecked',
      'SimpleChanges', 'SimpleChange',
      'forwardRef', 'InjectionToken', 'Inject', 'Optional', 'Self', 'SkipSelf', 'Host',
      'PipeTransform', 'QueryList', 'EmbeddedViewRef', 'ApplicationRef',
      'enableProdMode', 'isDevMode', 'inputBinding', 'outputBinding',
      'WritableSignal', 'Signal', 'InputSignal',
    ]);
    add('@angular/common', [
      'CommonModule',
      'NgIf', 'NgFor', 'NgForOf', 'NgSwitch', 'NgSwitchCase', 'NgSwitchDefault',
      'NgClass', 'NgStyle', 'NgComponentOutlet', 'NgTemplateOutlet',
      'NgPlural', 'NgPluralCase',
      'AsyncPipe', 'DatePipe', 'CurrencyPipe', 'JsonPipe', 'PercentPipe', 'DecimalPipe',
      'SlicePipe', 'TitleCasePipe', 'UpperCasePipe', 'LowerCasePipe', 'KeyValuePipe',
      'I18nPluralPipe', 'I18nSelectPipe', 'Location',
    ]);
    add('@angular/common/http', [
      'HttpClient', 'HttpClientModule', 'HttpHeaders', 'HttpParams',
      'HttpErrorResponse', 'HttpResponse', 'HttpRequest', 'HttpEvent', 'HttpInterceptor',
      'provideHttpClient', 'withInterceptors',
    ]);
    add('@angular/forms', [
      'FormsModule', 'ReactiveFormsModule',
      'FormControl', 'FormGroup', 'FormBuilder', 'FormArray', 'FormRecord', 'Validators',
      'NgForm', 'NgModel', 'AbstractControl', 'ValidatorFn', 'AsyncValidatorFn',
    ]);
    add('@angular/router', [
      'RouterModule', 'RouterOutlet', 'RouterLink', 'RouterLinkActive', 'RouterLinkWithHref',
      'Router', 'ActivatedRoute', 'ActivatedRouteSnapshot', 'RouterStateSnapshot',
      'NavigationEnd', 'NavigationStart', 'Routes', 'Route',
      'CanActivate', 'CanActivateFn', 'CanDeactivate', 'Resolve', 'ResolveFn',
      'provideRouter', 'withComponentInputBinding',
    ]);
    add('@angular/platform-browser', [
      'bootstrapApplication', 'BrowserModule',
    ]);
    add('rxjs', [
      'Observable', 'Subject', 'BehaviorSubject', 'ReplaySubject', 'AsyncSubject',
      'Subscription', 'of', 'from', 'EMPTY', 'NEVER',
      'combineLatest', 'merge', 'concat', 'forkJoin', 'interval', 'timer', 'fromEvent',
      'map', 'filter', 'tap', 'catchError', 'finalize',
      'mergeMap', 'switchMap', 'concatMap', 'exhaustMap',
      'debounceTime', 'throttleTime', 'distinctUntilChanged',
      'take', 'takeUntil', 'takeWhile', 'first', 'last', 'skip',
      'startWith', 'shareReplay', 'share', 'scan', 'reduce', 'pluck', 'pairwise',
      'withLatestFrom', 'delay', 'retry', 'retryWhen',
    ]);
    return m;
  })();

  function getImportedNames(code) {
    const names = new Set();
    const re = /import\s+\{([^}]+)\}\s+from\s+['"][^'"]+['"]/g;
    let m;
    while ((m = re.exec(code))) {
      m[1].split(',').forEach((n) => names.add(n.replace(/\s/g, '').replace(/\/\/.*$/, '').split(' as ')[0]));
    }
    return names;
  }

  function ensureAngularImports(code) {
    const importedNames = getImportedNames(code);
    const toAdd = {}; // module → [names]
    for (const [sym, mod] of Object.entries(ANGULAR_SYMBOL_MODULE)) {
      if (importedNames.has(sym)) continue;
      if (new RegExp(`\\b${sym}\\b`).test(code)) {
        if (!toAdd[mod]) toAdd[mod] = [];
        toAdd[mod].push(sym);
      }
    }
    if (Object.keys(toAdd).length === 0) return code;
    const lines = [];
    for (const [mod, names] of Object.entries(toAdd)) {
      lines.push(`import { ${names.join(', ')} } from '${mod}';`);
    }
    return lines.join('\n') + '\n' + code;
  }

  /**
   * Auto-import các class định nghĩa ở file khác trong cùng project.
   * Vd: app.component.ts có `imports: [CourseCardComponent]` nhưng thiếu
   * `import { CourseCardComponent } from './course-card.component';`
   * → hàm này tự thêm vào.
   */
  function ensureLocalImports(code, classToFile, currentFilename) {
    const importedNames = getImportedNames(code);
    const toAdd = {}; // path → [classNames]
    for (const [className, filename] of Object.entries(classToFile)) {
      if (filename === currentFilename) continue;
      if (importedNames.has(className)) continue;
      if (!new RegExp(`\\b${className}\\b`).test(code)) continue;
      const path = './' + filename.replace(/\.ts$/, '');
      if (!toAdd[path]) toAdd[path] = [];
      toAdd[path].push(className);
    }
    if (Object.keys(toAdd).length === 0) return code;
    const lines = [];
    for (const [path, names] of Object.entries(toAdd)) {
      lines.push(`import { ${names.join(', ')} } from '${path}';`);
    }
    return lines.join('\n') + '\n' + code;
  }

  // ==================== Type shims ====================

  const TS_BUILTIN_TYPES = new Set([
    // Primitives
    'string', 'number', 'boolean', 'bigint', 'symbol', 'object', 'never', 'unknown', 'void', 'any', 'undefined', 'null',
    'String', 'Number', 'Boolean', 'BigInt', 'Symbol', 'Object', 'Function',
    // Built-ins
    'Array', 'Date', 'Error', 'TypeError', 'RangeError', 'RegExp', 'Map', 'Set', 'WeakMap', 'WeakSet',
    'Promise', 'Iterator', 'IterableIterator', 'Iterable', 'Generator', 'AsyncGenerator', 'PromiseLike',
    'JSON', 'Math', 'Reflect',
    // Utility types
    'Partial', 'Required', 'Readonly', 'Pick', 'Omit', 'Record', 'Exclude', 'Extract', 'NonNullable',
    'ReturnType', 'Parameters', 'ConstructorParameters', 'InstanceType', 'ThisType', 'OmitThisParameter',
    'ThisParameterType', 'Awaited', 'Uppercase', 'Lowercase', 'Capitalize', 'Uncapitalize',
    'NoInfer', 'Mutable',
    // Typed arrays
    'ArrayBuffer', 'ArrayBufferLike', 'SharedArrayBuffer', 'DataView',
    'Uint8Array', 'Uint8ClampedArray', 'Int8Array', 'Uint16Array', 'Int16Array', 'Uint32Array', 'Int32Array',
    'Float32Array', 'Float64Array', 'BigInt64Array', 'BigUint64Array',
    // DOM core
    'File', 'FileReader', 'FileList', 'Blob',
    'Element', 'HTMLElement', 'HTMLInputElement', 'HTMLButtonElement', 'HTMLDivElement', 'HTMLFormElement',
    'HTMLImageElement', 'HTMLAnchorElement', 'HTMLCanvasElement', 'HTMLAudioElement', 'HTMLVideoElement',
    'HTMLTableElement', 'HTMLSelectElement', 'HTMLOptionElement', 'HTMLTextAreaElement', 'HTMLLabelElement',
    'HTMLSpanElement', 'HTMLParagraphElement', 'HTMLHeadingElement', 'HTMLUListElement', 'HTMLLIElement',
    'Document', 'Window', 'Node', 'NodeList', 'NamedNodeMap', 'Attr', 'Text', 'Comment',
    'DocumentFragment', 'ShadowRoot',
    // DOM events
    'Event', 'MouseEvent', 'KeyboardEvent', 'TouchEvent', 'PointerEvent', 'InputEvent',
    'FocusEvent', 'DragEvent', 'WheelEvent', 'AnimationEvent', 'TransitionEvent',
    'CustomEvent', 'EventTarget', 'EventListener', 'EventListenerObject', 'EventInit',
    'AddEventListenerOptions', 'EventListenerOptions',
    // Network/browser APIs
    'URL', 'URLSearchParams', 'FormData', 'Headers', 'Request', 'Response', 'AbortController', 'AbortSignal',
    'WebSocket', 'XMLHttpRequest', 'XMLHttpRequestEventTarget',
    'Storage', 'CookieStore', 'IDBDatabase', 'IDBObjectStore',
    // Drawing/observers
    'CanvasRenderingContext2D', 'WebGLRenderingContext', 'OffscreenCanvas',
    'MutationObserver', 'IntersectionObserver', 'ResizeObserver', 'PerformanceObserver',
    'CSSStyleDeclaration', 'DOMRect', 'DOMRectReadOnly', 'DOMTokenList', 'DOMException', 'DOMMatrix',
    // Misc
    'Console', 'Performance', 'PerformanceEntry', 'Navigator', 'Location', 'History',
  ]);

  function findReferencedTypes(code) {
    const refs = new Set();
    const patterns = [
      /:\s*([A-Z]\w*)/g,
      /<\s*([A-Z]\w*)/g,
      /\bextends\s+([A-Z]\w*)/g,
      /\bimplements\s+([A-Z]\w*)/g,
      /\bas\s+([A-Z]\w*)/g,
    ];
    for (const pat of patterns) {
      let m;
      while ((m = pat.exec(code))) refs.add(m[1]);
    }
    return refs;
  }

  function collectDefinedSymbols(tsFiles) {
    const names = new Set();
    for (const f of tsFiles) {
      [...f.text.matchAll(/(?:export\s+)?(?:abstract\s+)?(?:class|interface|type|enum)\s+(\w+)/g)]
        .forEach((m) => names.add(m[1]));
      [...f.text.matchAll(/import\s+\{([^}]+)\}\s+from\s+['"][^'"]+['"]/g)]
        .forEach((m) => m[1].split(',').forEach((n) => {
          const clean = n.replace(/\s/g, '').replace(/\sas\s.*/, '').split(' as ')[0];
          if (clean) names.add(clean);
        }));
    }
    Object.keys(ANGULAR_SYMBOL_MODULE).forEach((s) => names.add(s));
    return names;
  }

  function generateTypeShims(tsFiles) {
    const defined = collectDefinedSymbols(tsFiles);
    const referenced = new Set();
    for (const f of tsFiles) {
      findReferencedTypes(f.text).forEach((n) => referenced.add(n));
    }
    const unresolved = [...referenced].filter((n) => !TS_BUILTIN_TYPES.has(n) && !defined.has(n));
    if (unresolved.length === 0) return null;
    return [
      '// Auto-generated type shims — các type tham chiếu trong bài nhưng',
      '// không được khai báo. Cho phép snippet compile; thay bằng type thật khi cần.',
      ...unresolved.map((n) => `declare interface ${n} { [key: string]: any; }`),
      '',
    ].join('\n');
  }

  // ==================== Resolution check ====================

  function checkResolution(blocks) {
    const tsItems = blocks
      .filter((b) => b.kind === 'ts' && isCompleteTsFile(b.text))
      .map((b) => ({ ...b, components: parseComponents(b.text), exportedClasses: parseExportedClasses(b.text) }));

    const definedSelectors = new Set(tsItems.flatMap((it) => it.components.map((c) => c.selector).filter(Boolean)));
    const definedNames = new Set();
    tsItems.forEach((it) => it.exportedClasses.forEach((c) => definedNames.add(c)));
    // Symbol đã import từ @angular/* được coi là defined
    for (const it of tsItems) {
      const re = /import\s+\{([^}]+)\}\s+from\s+['"]@angular[^'"]*['"]/g;
      let m;
      while ((m = re.exec(it.text))) {
        m[1].split(',').forEach((n) => definedNames.add(n.replace(/\s/g, '').replace(/\/\/.*$/, '')));
      }
    }
    // Symbol Angular built-in (cho dù chưa import — runner.js sẽ tự thêm)
    Object.keys(ANGULAR_SYMBOL_MODULE).forEach((s) => definedNames.add(s));

    const issues = [];

    // Check selectors trong inline templates
    for (const it of tsItems) {
      for (const c of it.components) {
        if (!c.templateInline) continue;
        const refs = [...c.templateInline.matchAll(/<\s*((?:app-|[a-z][\w-]*-)[\w-]+)/g)].map((m) => m[1]);
        for (const r of refs) {
          if (ANGULAR_TAG_WHITELIST.has(r)) continue;
          if (!definedSelectors.has(r)) issues.push(`SEL:${r}`);
        }
      }
    }

    // Check imports: [...] array (strip line/block comment trước khi split)
    for (const it of tsItems) {
      const m = it.text.match(/imports\s*:\s*\[([^\]]*)\]/);
      if (!m) continue;
      const cleaned = m[1]
        .replace(/\/\/[^\n]*/g, '')      // line comments
        .replace(/\/\*[\s\S]*?\*\//g, ''); // block comments
      const names = cleaned.split(',').map((s) => s.replace(/\s/g, '')).filter(Boolean);
      for (const name of names) {
        if (!definedNames.has(name)) issues.push(`IMP:${name}`);
      }
    }

    return issues;
  }

  // ==================== Dựng project files ====================

  const PACKAGE_JSON = JSON.stringify({
    name: 'angular-snippet',
    version: '0.0.0',
    scripts: { start: 'ng serve --port 4200 --host 0.0.0.0' },
    dependencies: {
      '@angular/animations': '^17.3.0',
      '@angular/common': '^17.3.0',
      '@angular/compiler': '^17.3.0',
      '@angular/core': '^17.3.0',
      '@angular/forms': '^17.3.0',
      '@angular/platform-browser': '^17.3.0',
      '@angular/platform-browser-dynamic': '^17.3.0',
      '@angular/router': '^17.3.0',
      rxjs: '~7.8.0',
      tslib: '^2.3.0',
      'zone.js': '~0.14.4',
    },
    devDependencies: {
      '@angular-devkit/build-angular': '^17.3.0',
      '@angular/cli': '^17.3.0',
      '@angular/compiler-cli': '^17.3.0',
      typescript: '~5.4.0',
    },
  }, null, 2);

  const ANGULAR_JSON = JSON.stringify({
    $schema: './node_modules/@angular/cli/lib/config/schema.json',
    version: 1,
    newProjectRoot: 'projects',
    projects: {
      demo: {
        projectType: 'application',
        root: '',
        sourceRoot: 'src',
        prefix: 'app',
        architect: {
          build: {
            builder: '@angular-devkit/build-angular:application',
            options: {
              outputPath: 'dist/demo',
              index: 'src/index.html',
              browser: 'src/main.ts',
              polyfills: ['zone.js'],
              tsConfig: 'tsconfig.app.json',
              styles: ['src/styles.css'],
            },
          },
          serve: {
            builder: '@angular-devkit/build-angular:dev-server',
            options: { buildTarget: 'demo:build' },
          },
        },
      },
    },
  }, null, 2);

  const TSCONFIG = JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      module: 'ES2022',
      moduleResolution: 'node',
      experimentalDecorators: true,
      useDefineForClassFields: false,
      esModuleInterop: true,
      strict: false,
      skipLibCheck: true,
      lib: ['ES2022', 'DOM'],
    },
    angularCompilerOptions: {
      strictTemplates: false,
      strictInjectionParameters: false,
    },
  }, null, 2);

  const TSCONFIG_APP = JSON.stringify({
    extends: './tsconfig.json',
    compilerOptions: { outDir: './out-tsc/app', types: [] },
    files: ['src/main.ts'],
    include: ['src/**/*.ts'],
  }, null, 2);

  const STYLES_CSS = `body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; padding: 24px; line-height: 1.6; color: #1d1d1f; }
h1, h2, h3 { letter-spacing: -0.01em; }
button { font-family: inherit; }
`;

  function indexHtml(title) {
    return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <app-root></app-root>
</body>
</html>
`;
  }

  function buildProject(context, title) {
    const { blocks } = context;

    // Lọc TS blocks — CHỈ những block là FILE hoàn chỉnh (có @Component hoặc export top-level).
    // Fragment kiểu method body sẽ bị bỏ qua (không thể compile thành .ts riêng).
    const tsItems = [];
    for (const b of blocks) {
      if (b.kind !== 'ts') continue;
      if (!isCompleteTsFile(b.text)) continue;
      const components = parseComponents(b.text);
      const exportedClasses = parseExportedClasses(b.text);
      tsItems.push({
        idx: b.idx,
        text: b.text,
        components,
        exportedClasses,
      });
    }

    if (tsItems.length === 0) {
      throw new Error('Không tìm thấy block TypeScript nào trong bài học.');
    }

    // Map className → idx của lần định nghĩa cuối cùng
    const lastDefIdx = new Map();
    tsItems.forEach((it, i) => {
      it.exportedClasses.forEach((c) => lastDefIdx.set(c, i));
    });

    // Giữ TS blocks: có ít nhất 1 class là "định nghĩa cuối", HOẶC không export class nào (helper code)
    const keptTs = tsItems.filter((it, i) => {
      if (it.exportedClasses.length === 0) return true;
      return it.exportedClasses.some((c) => lastDefIdx.get(c) === i);
    });

    // Gán filename cho mỗi TS block
    const tsFiles = keptTs.map((it) => ({
      ...it,
      filename: inferTsFilename(it.text, it.components),
    }));

    // Đảm bảo unique filename — nếu trùng, suffix _2, _3…
    const filenameCount = new Map();
    tsFiles.forEach((f) => {
      const base = f.filename;
      const n = (filenameCount.get(base) || 0) + 1;
      filenameCount.set(base, n);
      if (n > 1) {
        f.filename = base.replace(/\.ts$/, `_${n}.ts`);
      }
    });

    // Tìm bootstrap component: AppComponent ưu tiên, kế đó selector 'app-root', kế đó component cuối có selector
    const allComps = tsFiles.flatMap((f) => f.components.map((c) => ({ ...c, file: f.filename })));
    let bootstrap = allComps.find((c) => c.className === 'AppComponent');
    if (!bootstrap) bootstrap = allComps.find((c) => c.selector === 'app-root');
    if (!bootstrap) bootstrap = [...allComps].reverse().find((c) => c.selector);

    let mainTsContent;
    let needsWrapper = false;

    if (bootstrap && bootstrap.selector === 'app-root') {
      // Bootstrap trực tiếp class này
      const importPath = './app/' + bootstrap.file.replace(/\.ts$/, '');
      mainTsContent = `import { bootstrapApplication } from '@angular/platform-browser';
import { ${bootstrap.className} } from '${importPath}';

bootstrapApplication(${bootstrap.className}).catch((err) => console.error(err));
`;
    } else if (bootstrap) {
      // Tạo wrapper AppComponent dùng selector của target
      needsWrapper = true;
      mainTsContent = `import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch((err) => console.error(err));
`;
    } else {
      throw new Error('Không tìm được component nào có selector để bootstrap.');
    }

    // Tạo files
    const banner = `// === Trích từ "Tóm tắt Angular Core Deep Dive" ===
// Tự động gom các block code liên quan trong cùng bài học.
`;

    const files = {
      'package.json': PACKAGE_JSON,
      'angular.json': ANGULAR_JSON,
      'tsconfig.json': TSCONFIG,
      'tsconfig.app.json': TSCONFIG_APP,
      'src/index.html': indexHtml(title),
      'src/styles.css': STYLES_CSS,
      'src/main.ts': mainTsContent,
    };

    // Map className → filename để auto-import class local giữa các file
    const classToFile = {};
    for (const f of tsFiles) {
      for (const cls of f.exportedClasses) classToFile[cls] = f.filename;
    }

    // Ghi mỗi TS file: auto-import Angular built-ins + class local còn thiếu
    tsFiles.forEach((f, i) => {
      let processed = ensureAngularImports(f.text);
      processed = ensureLocalImports(processed, classToFile, f.filename);
      const content = i === 0 ? banner + processed : processed;
      files['src/app/' + f.filename] = content;
    });

    // Sinh types.d.ts cho các type tham chiếu nhưng không khai báo (Course, User…)
    const shims = generateTypeShims(tsFiles);
    if (shims) files['src/types.d.ts'] = shims;

    // Ghép HTML/CSS cho các templateUrl/styleUrl
    // Ưu tiên block có comment khớp với filename (vd "<!-- course-card.component.html -->")
    // Fallback: HTML/CSS block đầu tiên xuất hiện sau TS. Nếu vẫn không có, tạo placeholder.
    for (const f of tsFiles) {
      for (const c of f.components) {
        if (c.templateUrl) {
          const path = 'src/app/' + cleanRelPath(c.templateUrl);
          if (!files[path]) {
            const block = findMatchingBlock(blocks, f.idx, 'html', cleanRelPath(c.templateUrl));
            files[path] = block
              ? block.text
              : `<!-- Template ${cleanRelPath(c.templateUrl)} không có sẵn trong bài học -->
<div style="padding:14px;border:2px dashed #c2410c;border-radius:8px;background:#fff1ea;color:#c2410c;font-family:system-ui,-apple-system,sans-serif">
  <strong>⚠ Template chưa cung cấp</strong>
  <p style="margin:6px 0 0;font-size:13px;line-height:1.5">Bài học này không bao gồm block HTML cho <code>${cleanRelPath(c.templateUrl)}</code>. Bạn có thể thêm template vào đây để xem demo, hoặc chuyển sang <code>template:</code> inline trong file <code>.ts</code>.</p>
</div>
`;
          }
        }
        if (c.styleUrl) {
          const path = 'src/app/' + cleanRelPath(c.styleUrl);
          if (!files[path]) {
            const block = findMatchingBlock(blocks, f.idx, 'css', cleanRelPath(c.styleUrl));
            files[path] = block
              ? block.text
              : `/* Style ${cleanRelPath(c.styleUrl)} không có trong bài học. */\n`;
          }
        }
      }
    }

    // Tạo wrapper AppComponent nếu cần
    if (needsWrapper) {
      const importLines = [];
      const importNames = [];
      for (const f of tsFiles) {
        const names = f.exportedClasses.filter((n) => f.components.some((c) => c.className === n));
        if (names.length === 0) continue;
        importLines.push(`import { ${names.join(', ')} } from './${f.filename.replace(/\.ts$/, '')}';`);
        importNames.push(...names);
      }
      const targetSel = bootstrap.selector;

      // Smart wrapper: tự sinh demo data cho @Input bắt buộc của target component
      // để runtime có dữ liệu, không bị throw {{ field.prop of undefined }}
      const targetTsFile = tsFiles.find((f) => f.components.some((c) => c.className === bootstrap.className));
      const demo = targetTsFile ? buildDemoBindings(bootstrap, targetTsFile, blocks) : { dataDecls: [], bindings: [] };

      const bindingsAttr = demo.bindings.length ? ' ' + demo.bindings.join(' ') : '';
      const classBody = demo.dataDecls.length ? '\n' + demo.dataDecls.join('\n') + '\n' : '';

      files['src/app/app.component.ts'] = `import { Component } from '@angular/core';
${importLines.join('\n')}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [${importNames.join(', ')}],
  template: \`<${targetSel}${bindingsAttr}></${targetSel}>\`,
})
export class AppComponent {${classBody}}
`;
    }

    return files;
  }

  /**
   * Sinh `[input]="demo_input"` + class field tương ứng cho mỗi @Input
   * BẮT BUỘC của target component (có dấu `!:`, không có default).
   * Property của object demo được suy từ template (vd `{{ course.title }}`
   * → `{ title: 'Demo title' }`).
   */
  function buildDemoBindings(target, targetTsFile, blocks) {
    const classText = targetTsFile.text;
    const inputs = [];
    const re = /@Input\s*\(\s*[^)]*\)\s+(\w+)(!?)\s*(?::\s*([\w<>\[\]|.]+))?\s*(=\s*[^;\n]+)?/g;
    let m;
    while ((m = re.exec(classText))) {
      inputs.push({
        name: m[1],
        required: m[2] === '!',
        type: m[3] || 'any',
        hasDefault: !!m[4],
      });
    }
    if (inputs.length === 0) return { dataDecls: [], bindings: [] };

    let template = target.templateInline || '';
    if (!template && target.templateUrl) {
      const block = findMatchingBlock(blocks, targetTsFile.idx, 'html', cleanRelPath(target.templateUrl));
      if (block) template = block.text;
    }

    const dataDecls = [];
    const bindings = [];

    for (const input of inputs) {
      // Skip nếu đã có default (chạy được mà không cần wrapper truyền)
      if (input.hasDefault && !input.required) continue;

      const propRefs = [...template.matchAll(new RegExp('\\b' + input.name + '\\s*\\.\\s*(\\w+)', 'g'))]
        .map((mm) => mm[1]);
      const uniqueProps = [...new Set(propRefs)];

      let demoVal;
      if (uniqueProps.length > 0) {
        const props = uniqueProps.map((p) => `${p}: 'Demo ${p}'`).join(', ');
        demoVal = `{ ${props} }`;
      } else if (/string/i.test(input.type)) demoVal = `'Demo'`;
      else if (/number/i.test(input.type)) demoVal = '0';
      else if (/boolean/i.test(input.type)) demoVal = 'false';
      else if (/\[\]$/.test(input.type) || /^Array</.test(input.type)) demoVal = '[]';
      else demoVal = '{} as any';

      dataDecls.push(`  demo_${input.name} = ${demoVal};`);
      bindings.push(`[${input.name}]="demo_${input.name}"`);
    }

    return { dataDecls, bindings };
  }

  function findMatchingBlock(blocks, fromIdx, kind, expectedFilename) {
    let firstSeen = null;
    for (let j = fromIdx + 1; j < blocks.length; j++) {
      if (blocks[j].kind !== kind) continue;
      const firstLine = (blocks[j].text.split('\n')[0] || '').trim();
      if (expectedFilename && firstLine.includes(expectedFilename)) {
        return blocks[j];
      }
      if (!firstSeen) firstSeen = blocks[j];
    }
    return firstSeen;
  }

  function cleanRelPath(p) {
    return p.replace(/^\.\//, '').replace(/^\.\.\//, '');
  }

  // ==================== StackBlitz SDK ====================

  let sdkPromise = null;

  function loadSdk() {
    if (window.StackBlitzSDK) return Promise.resolve(window.StackBlitzSDK);
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = SDK_URL;
      s.async = true;
      s.onload = () => {
        if (window.StackBlitzSDK) resolve(window.StackBlitzSDK);
        else reject(new Error('StackBlitz SDK đã load nhưng không expose globally.'));
      };
      s.onerror = () => reject(new Error('Không tải được StackBlitz SDK.'));
      document.head.appendChild(s);
    });
    return sdkPromise;
  }

  async function runFromContext(context, title) {
    const sdk = await loadSdk();
    const files = buildProject(context, title);

    // Open file ưu tiên là app.component.ts hoặc file có AppComponent, kế đến file đầu tiên
    const preferOpen = ['src/app/app.component.ts', ...Object.keys(files).filter((k) => k.startsWith('src/app/') && k.endsWith('.ts'))];
    const openFile = preferOpen.find((p) => files[p]) || 'src/main.ts';

    sdk.openProject(
      {
        title,
        description: 'Snippet trích từ Tóm tắt Angular Core Deep Dive',
        template: 'node',
        files,
      },
      { newWindow: true, openFile },
    );
  }

  // ==================== Inject UI ====================

  function injectButtons(scope) {
    const root = scope || document;
    const pres = root.querySelectorAll('.lesson pre');
    pres.forEach((pre) => {
      if (pre.dataset.runScanned === '1') return;
      pre.dataset.runScanned = '1';

      const codeEl = pre.querySelector('code');
      if (!codeEl) return;
      const text = codeEl.textContent || '';
      if (!isRunnableBlock(text)) return;

      // Resolution check: gom toàn bộ ngữ cảnh bài học và xem có symbol nào unresolvable
      const ctx = gatherLessonContext(pre);
      if (ctx) {
        const unresolved = checkResolution(ctx.blocks);
        if (unresolved.length > 0) {
          // Block tham chiếu component/symbol không nằm trong bài → không show nút
          // (vd: cross-lesson deps, Material UI…)
          return;
        }
      }

      // Wrap pre vào .code-wrap
      let wrap = pre.parentElement;
      if (!wrap || !wrap.classList.contains('code-wrap')) {
        wrap = document.createElement('div');
        wrap.className = 'code-wrap';
        pre.parentNode.insertBefore(wrap, pre);
        wrap.appendChild(pre);
      }

      const btn = document.createElement('button');
      btn.className = 'run-btn';
      btn.type = 'button';
      btn.title = 'Mở snippet này trên StackBlitz (gom đủ ngữ cảnh trong bài, tab mới)';
      btn.innerHTML = '<span class="run-btn-icon">▶</span><span class="run-btn-label">Chạy thử</span>';

      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const lesson = pre.closest('.lesson');
        const lessonTitle = lesson?.querySelector('h2')?.textContent?.trim() || 'Angular snippet';

        const original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="run-btn-icon">⏳</span><span class="run-btn-label">Đang mở…</span>';

        try {
          const ctx = gatherLessonContext(pre);
          if (!ctx) throw new Error('Không tìm thấy ngữ cảnh bài học.');
          await runFromContext(ctx, lessonTitle);
        } catch (err) {
          console.error(err);
          btn.innerHTML = '<span class="run-btn-icon">⚠</span><span class="run-btn-label">Lỗi</span>';
          setTimeout(() => {
            btn.innerHTML = original;
            btn.disabled = false;
          }, 1800);
          return;
        }

        setTimeout(() => {
          btn.innerHTML = original;
          btn.disabled = false;
        }, 1200);
      });

      wrap.appendChild(btn);
    });
  }

  // ==================== Helpers ====================

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[c]));
  }

  // Public API
  window.AngularSnippetRunner = { injectButtons };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => injectButtons());
  } else {
    injectButtons();
  }
})();
