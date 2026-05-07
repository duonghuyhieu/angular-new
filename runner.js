/**
 * runner.js — gắn nút "Chạy thử trên StackBlitz" vào những block code
 * có dạng Angular component standalone với inline template.
 *
 * Khi user click → gom TOÀN BỘ block code liên quan trong cùng bài học
 * (từ đầu bài đến block được click) → tách thành nhiều file (.ts/.html/.scss)
 * → mở StackBlitz tab mới với project Angular 17 đầy đủ ngữ cảnh.
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
      out.push({
        className,
        selector: sel ? sel[1] : null,
        hasInlineTemplate: /template\s*:\s*`/.test(meta),
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

    // Lấy block 0..clickedIdx
    const blocks = [];
    for (let i = 0; i <= clickedIdx; i++) {
      const codeEl = allPres[i].querySelector('code');
      const text = codeEl ? codeEl.textContent || '' : '';
      blocks.push({ idx: i, kind: classifyBlock(text), text });
    }

    return { lesson, blocks, clickedIdx };
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

    // Lọc TS blocks
    const tsItems = [];
    for (const b of blocks) {
      if (b.kind !== 'ts') continue;
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

    // Ghi mỗi TS file
    tsFiles.forEach((f, i) => {
      const content = i === 0 ? banner + f.text : f.text;
      files['src/app/' + f.filename] = content;
    });

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
              : `<!-- Template ${cleanRelPath(c.templateUrl)} không có trong bài học. -->\n`;
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
      files['src/app/app.component.ts'] = `import { Component } from '@angular/core';
${importLines.join('\n')}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [${importNames.join(', ')}],
  template: \`<${targetSel}></${targetSel}>\`,
})
export class AppComponent {}
`;
    }

    return files;
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
