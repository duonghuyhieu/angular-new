/**
 * runner.js — gắn nút "Chạy thử trên StackBlitz" vào những block code
 * có dạng Angular component standalone với inline template.
 *
 * Phát hiện block runnable:
 *   - Có @Component({...})
 *   - Có template: `...` (inline, không phải templateUrl)
 *   - Có ít nhất một @Component có thuộc tính selector
 *   - Có export class
 *
 * Khi user click → tải StackBlitz SDK (lần đầu) → dựng project Angular 17
 * tối thiểu chứa snippet → mở tab mới.
 */

(function () {
  const SDK_URL = 'https://unpkg.com/@stackblitz/sdk@1/bundles/sdk.umd.js';

  // ---------- Phát hiện ----------

  function isRunnable(code) {
    if (!/@Component\s*\(/.test(code)) return false;
    if (!/template\s*:\s*`/.test(code)) return false;
    if (!/export\s+(?:abstract\s+)?class\s+\w+/.test(code)) return false;
    // Phải có ít nhất một @Component có selector — nếu không thì là fragment minh hoạ.
    if (!/@Component\s*\(\s*\{[\s\S]*?selector\s*:\s*['"]/.test(code)) return false;
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
      const hasInlineTemplate = /template\s*:\s*`/.test(meta);
      out.push({
        className,
        selector: sel ? sel[1] : null,
        hasInlineTemplate,
      });
    }
    return out;
  }

  // ---------- Dựng project ----------

  const PACKAGE_JSON = JSON.stringify({
    name: 'angular-snippet',
    version: '0.0.0',
    scripts: {
      start: 'ng serve --port 4200 --host 0.0.0.0',
    },
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
    compilerOptions: {
      outDir: './out-tsc/app',
      types: [],
    },
    files: ['src/main.ts'],
    include: ['src/**/*.ts'],
  }, null, 2);

  const STYLES_CSS = `body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; padding: 24px; line-height: 1.6; }
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

  function buildFiles(snippetCode, title) {
    const components = parseComponents(snippetCode);
    if (components.length === 0) {
      throw new Error('Không tìm thấy @Component nào trong snippet.');
    }

    const root = components.find((c) => c.selector === 'app-root' && c.hasInlineTemplate);

    let mainTs;
    let appComponentTs;
    let snippetTs = null;

    const banner = `// === Snippet trích từ "Tóm tắt Angular Core Deep Dive" ===
// Lưu ý: nếu snippet là một đoạn minh hoạ, có thể bạn cần bổ sung
//        @Input mặc định, import CommonModule/FormsModule, hoặc dữ liệu mẫu.
`;

    if (root) {
      // Snippet đã có app-root → dùng trực tiếp làm AppComponent
      appComponentTs = banner + snippetCode;
      mainTs = `import { bootstrapApplication } from '@angular/platform-browser';
import { ${root.className} } from './app/app.component';

bootstrapApplication(${root.className}).catch((err) => console.error(err));
`;
    } else {
      // Wrap: tạo AppComponent mới, render selector của component cuối
      const usable = components.filter((c) => c.hasInlineTemplate && c.selector);
      const target = usable.length ? usable[usable.length - 1] : components[components.length - 1];
      const importNames = components.map((c) => c.className).join(', ');
      const sel = target.selector || 'app-snippet';

      snippetTs = banner + snippetCode;

      appComponentTs = `import { Component } from '@angular/core';
import { ${importNames} } from './snippet';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [${importNames}],
  template: \`<${sel}></${sel}>\`,
})
export class AppComponent {}
`;
      mainTs = `import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch((err) => console.error(err));
`;
    }

    const files = {
      'package.json': PACKAGE_JSON,
      'angular.json': ANGULAR_JSON,
      'tsconfig.json': TSCONFIG,
      'tsconfig.app.json': TSCONFIG_APP,
      'src/index.html': indexHtml(title),
      'src/styles.css': STYLES_CSS,
      'src/main.ts': mainTs,
      'src/app/app.component.ts': appComponentTs,
    };
    if (snippetTs) files['src/app/snippet.ts'] = snippetTs;
    return files;
  }

  // ---------- StackBlitz SDK ----------

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

  async function runSnippet(code, title) {
    const sdk = await loadSdk();
    const files = buildFiles(code, title);
    sdk.openProject(
      {
        title,
        description: 'Snippet trích từ Tóm tắt Angular Core Deep Dive',
        template: 'node',
        files,
      },
      { newWindow: true, openFile: 'src/app/snippet.ts,src/app/app.component.ts' },
    );
  }

  // ---------- Inject UI ----------

  function injectButtons(scope) {
    const root = scope || document;
    const pres = root.querySelectorAll('.lesson pre');
    pres.forEach((pre) => {
      if (pre.dataset.runScanned === '1') return;
      pre.dataset.runScanned = '1';

      const codeEl = pre.querySelector('code');
      if (!codeEl) return;
      const text = codeEl.textContent || '';
      if (!isRunnable(text)) return;

      // Wrap pre vào .code-wrap để định vị nút tương đối với khối, không scroll cùng code
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
      btn.title = 'Mở snippet này trên StackBlitz (tab mới)';
      btn.innerHTML = '<span class="run-btn-icon">▶</span><span class="run-btn-label">Chạy thử</span>';

      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const lesson = pre.closest('.lesson');
        const lessonTitle = lesson?.querySelector('h2')?.textContent?.trim() || 'Angular snippet';

        const original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="run-btn-icon">⏳</span><span class="run-btn-label">Đang mở…</span>';

        try {
          await runSnippet(text, lessonTitle);
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

  // ---------- Helpers ----------

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
  window.AngularSnippetRunner = { injectButtons, runSnippet };

  // Tự chạy lần đầu khi DOM sẵn sàng (index.html cũng có thể gọi lại sau khi render)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => injectButtons());
  } else {
    injectButtons();
  }
})();
