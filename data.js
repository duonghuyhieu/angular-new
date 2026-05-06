// Tóm tắt khoá Angular Core Deep Dive — bản tiếng Việt sâu, nhiều ví dụ.
const COURSE = {
  title: "Angular Core Deep Dive",
  subtitle: "Bản tóm tắt tiếng Việt — đọc nhanh, hiểu sâu, đầy ví dụ",
  sections: [
/* =================== SECTION 01 =================== */
{
  id: "s01", n: "01", title: "Giới thiệu khoá học",
  lessons: [
    {
      id: "01-01", n: "01",
      title: "Angular Core Deep Dive — Giới thiệu",
      html: `
<p>Khoá học này không phải là “Angular cho người mới bắt đầu”. Mục tiêu của nó là đi <strong>sâu vào các khối lõi</strong>: cách Angular thực sự hoạt động bên trong, vì sao API được thiết kế như vậy, và làm thế nào để dùng đúng trong các kiến trúc lớn. Học xong, bạn không chỉ <em>biết viết</em> mà còn <em>biết tại sao</em> — đọc được mã nguồn Angular, tự debug runtime, và đưa ra quyết định kiến trúc có cơ sở.</p>

<h3>Đối tượng phù hợp</h3>
<ul>
  <li>Đã viết Angular vài tháng, muốn vượt khỏi mức "biết dùng".</li>
  <li>Đang maintain dự án Angular doanh nghiệp lớn và gặp các vấn đề khó: <code>ExpressionChangedAfterItHasBeenCheckedError</code>, hiệu năng change detection, lifecycle phức tạp.</li>
  <li>Đến từ React/Vue và muốn nắm tư duy "Angular cách" thay vì cố ép idiom của framework cũ.</li>
</ul>

<h3>Khoá học sẽ đi theo trục nào?</h3>
<ol>
  <li><strong>Component</strong> → cách Angular biến class TypeScript thành thẻ HTML có hành vi.</li>
  <li><strong>Template & Directive</strong> → cú pháp template đầy đủ, structural directive, content projection.</li>
  <li><strong>Dependency Injection</strong> → "trái tim" của Angular — phân cấp injector, provider, token.</li>
  <li><strong>Change Detection & Lifecycle</strong> → thứ làm Angular nhanh (hoặc chậm).</li>
  <li><strong>Tính năng hiện đại</strong> → Standalone, Signals, @defer, Control flow mới — định hình Angular tương lai.</li>
</ol>

<div class="callout"><strong>Lộ trình đề xuất:</strong> nếu bạn cần kết quả nhanh nhất, hãy đi theo: Component → Template → Directive → DI → Change Detection → Signal → @defer. Sau đó quay lại Modules, i18n, View Encapsulation khi cần.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Đây là khoá <em>chiều sâu</em>, không phải chiều rộng — đừng vội nhảy chương.</li>
    <li>Mỗi chương có thể đọc độc lập; nhưng DI + Change Detection nên đọc liền mạch.</li>
    <li>Code mẫu trong tài liệu này dùng Angular 17+ (standalone + control-flow + signals).</li>
  </ul>
</div>`
    },
    {
      id: "01-03", n: "03",
      title: "Thiết lập môi trường phát triển",
      html: `
<p>Để theo khoá học, bạn cần đúng <strong>3 thứ</strong>: Node.js (LTS), một package manager (npm/pnpm), và Angular CLI. Đa số lỗi setup mà người mới gặp đến từ Node phiên bản cũ — kiểm tra trước khi cài bất cứ thứ gì.</p>

<div class="example-label">Ví dụ — kiểm tra phiên bản</div>
<pre><code>node --version    <span class="c-comment"># cần ≥ 18.13 hoặc ≥ 20</span>
npm --version
ng version        <span class="c-comment"># nếu chưa có sẽ báo lệnh không tồn tại</span></code></pre>

<div class="example-label">Ví dụ — cài Angular CLI toàn cục</div>
<pre><code>npm install -g @angular/cli@latest

<span class="c-comment"># Kiểm tra:</span>
ng version</code></pre>

<div class="example-label">Ví dụ — tạo project mới (Angular 17+)</div>
<pre><code>ng new angular-course \\
  --standalone \\
  --routing \\
  --style=scss \\
  --strict \\
  --ssr=false

cd angular-course
ng serve --open</code></pre>

<p><code>--standalone</code> tạo project hoàn toàn không có NgModule — đây là chế độ mặc định từ Angular 17, và là phong cách của khoá học. <code>--strict</code> bật tất cả flag TypeScript nghiêm ngặt nhất ngay từ đầu — bắt được rất nhiều bug ở compile-time.</p>

<h3>Cấu hình tsconfig khuyến nghị</h3>
<pre><code><span class="c-comment">// tsconfig.json — phần quan trọng</span>
{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "useDefineForClassFields": false   <span class="c-comment">// quan trọng cho DI hoạt động đúng</span>
  },
  "angularCompilerOptions": {
    "strictTemplates": true,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true
  }
}</code></pre>

<div class="tip"><strong>Vì sao bật <code>strictTemplates</code>?</strong> Angular sẽ kiểm tra kiểu dữ liệu trong template y như TypeScript kiểm tra trong file <code>.ts</code>. Nếu bạn viết <code>{{ user.nameTypo }}</code> mà <code>User</code> không có thuộc tính đó — báo lỗi ngay. Trước đây bug như vậy chỉ phát hiện ở runtime.</div>

<h3>IDE — VS Code</h3>
<p>Nên cài extension <strong>Angular Language Service</strong> (do Angular team duy trì). Nó cho IntelliSense template, đi đến định nghĩa của directive/pipe, hover hiển thị kiểu dữ liệu — gần như "không thể thiếu".</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Node ≥ 18 LTS, nếu không CLI sẽ chạy lung tung.</li>
    <li><code>ng new</code> với <code>--standalone --strict</code> để bắt đầu đúng cách.</li>
    <li>Bật <code>strictTemplates</code> ngay từ đầu — fix bug trên template ở compile-time, không phải runtime.</li>
    <li>Cài Angular Language Service trong VS Code.</li>
  </ul>
</div>`
    },
    {
      id: "01-05", n: "05",
      title: "Angular là gì? Custom HTML element, Model vs View",
      html: `
<p>Trình duyệt sinh ra với một bộ thẻ HTML cố định: <code>&lt;div&gt;</code>, <code>&lt;input&gt;</code>, <code>&lt;form&gt;</code>… Mỗi thẻ có hành vi và giao diện được Web Platform định nghĩa. Khi xây ứng dụng, bạn rất nhanh chóng cần thẻ <em>không tồn tại</em>: <code>&lt;course-card&gt;</code>, <code>&lt;data-table&gt;</code>, <code>&lt;date-picker&gt;</code>.</p>

<p>Angular cho phép bạn <strong>sáng tác bộ thẻ HTML riêng</strong>. Mỗi thẻ tuỳ biến ấy là một <strong>component</strong>, gồm hai phần khớp nhau:</p>

<table class="compare-table">
<tr><th>Phần</th><th>Bản chất</th><th>Vai trò</th></tr>
<tr><td>Model</td><td>Class TypeScript</td><td>Lưu dữ liệu, xử lý logic, gọi API</td></tr>
<tr><td>View</td><td>Template HTML</td><td>Hiển thị dữ liệu, lắng nghe sự kiện người dùng</td></tr>
</table>

<p>Angular đồng bộ Model ↔ View qua một thứ gọi là <strong>data binding</strong>. Khi model đổi, view tự cập nhật. Khi user gõ vào input, model nhận giá trị. Bạn không tự tay viết <code>document.querySelector(...)</code> để cập nhật DOM nữa.</p>

<div class="example-label">Ví dụ 1 — component đơn giản nhất</div>
<pre><code><span class="c-keyword">import</span> { Component } <span class="c-keyword">from</span> <span class="c-string">'@angular/core'</span>;

@Component({
  selector: <span class="c-string">'app-greet'</span>,
  standalone: <span class="c-keyword">true</span>,
  template: \`&lt;h1&gt;Xin chào, {{ name }}!&lt;/h1&gt;\`
})
<span class="c-keyword">export class</span> GreetComponent {
  name = <span class="c-string">'Hieu'</span>;   <span class="c-comment">// Model — biến của class</span>
}</code></pre>

<p><code>{{ name }}</code> là cú pháp <em>interpolation</em> — Angular đọc giá trị thuộc tính <code>name</code> của instance và đặt vào DOM. Nếu sau này bạn viết <code>this.name = 'Lan'</code>, Angular tự cập nhật <code>&lt;h1&gt;</code>.</p>

<div class="example-label">Ví dụ 2 — đầy đủ ba phần (TS / HTML / SCSS)</div>
<pre><code><span class="c-comment">// course-card.component.ts</span>
@Component({
  selector: <span class="c-string">'app-course-card'</span>,
  standalone: <span class="c-keyword">true</span>,
  templateUrl: <span class="c-string">'./course-card.component.html'</span>,
  styleUrl: <span class="c-string">'./course-card.component.scss'</span>
})
<span class="c-keyword">export class</span> CourseCardComponent {
  title = <span class="c-string">'Angular Core Deep Dive'</span>;
  iconUrl = <span class="c-string">'/assets/angular.png'</span>;
  studentCount = 12450;
}</code></pre>

<pre><code><span class="c-comment">&lt;!-- course-card.component.html --&gt;</span>
&lt;<span class="c-tag">div</span> <span class="c-attr">class</span>=<span class="c-string">"card"</span>&gt;
  &lt;<span class="c-tag">img</span> [<span class="c-attr">src</span>]=<span class="c-string">"iconUrl"</span> [<span class="c-attr">alt</span>]=<span class="c-string">"title"</span> /&gt;
  &lt;<span class="c-tag">h2</span>&gt;{{ title }}&lt;/<span class="c-tag">h2</span>&gt;
  &lt;<span class="c-tag">p</span>&gt;{{ studentCount }} học viên&lt;/<span class="c-tag">p</span>&gt;
&lt;/<span class="c-tag">div</span>&gt;</code></pre>

<pre><code><span class="c-comment">// course-card.component.scss</span>
.card {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  img { width: 64px; }
}</code></pre>

<h3>Dưới mui xe</h3>
<p>Khi Angular bootstrap, nó <em>quét DOM</em> tìm thẻ trùng <code>selector</code>. Mỗi thẻ tìm được, Angular:</p>
<ol>
  <li>Tạo một instance của class component.</li>
  <li>Render template vào DOM, thay thế nội dung của thẻ.</li>
  <li>Theo dõi mọi binding (<code>{{ }}</code>, <code>[prop]</code>, <code>(event)</code>) và cập nhật khi cần.</li>
</ol>

<div class="callout"><strong>Tinh thần:</strong> component = thẻ HTML mở rộng. Bạn không "đập vỡ DOM rồi xây lại"; bạn <em>khai báo</em> "tôi muốn thẻ <code>&lt;app-course-card&gt;</code> trông như sau, hành vi như sau". Angular lo phần còn lại.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Component = class (model) + template (view), kết nối qua data binding.</li>
    <li><code>{{ x }}</code> = đọc giá trị; <code>[prop]="x"</code> = bind property; <code>(evt)="fn()"</code> = nghe sự kiện.</li>
    <li>Bạn không touch DOM trực tiếp — khai báo, để Angular thực thi.</li>
  </ul>
</div>`
    },
    {
      id: "01-06", n: "06",
      title: "Vì sao chọn Angular? Các tính năng cốt lõi",
      html: `
<p>Trong thế giới frontend, mỗi framework có "triết lý" riêng. React chọn cách <em>nhỏ gọn, ai muốn ghép gì thì ghép</em>. Vue chọn <em>thân thiện, học nhanh</em>. Angular chọn cách hoàn toàn khác: <strong>opinionated full-stack frontend</strong> — gói sẵn mọi thứ một dự án doanh nghiệp cần, và yêu cầu bạn theo idiom của nó.</p>

<h3>Năm điểm tạo nên "Angular cách"</h3>

<h4>1. TypeScript là công dân hạng nhất</h4>
<p>Khác với React/Vue (TS optional, "đính kèm" sau), Angular được viết <strong>bằng</strong> TypeScript. Decorator như <code>@Component</code>, <code>@Input</code>, <code>@Injectable</code> đều dựa vào tính năng TS. Bật <code>strictTemplates</code> và bạn có thể có an toàn kiểu dữ liệu xuyên suốt đến tận DOM binding — điều mà các framework khác phải dùng plugin phụ.</p>

<h4>2. Dependency Injection cấp framework</h4>
<p>Angular là <strong>framework duy nhất hiện nay có DI mạnh tới mức như Spring/Guice trong Java</strong>. DI cho phép:</p>
<ul>
  <li>Tách logic ra khỏi component → unit test cực dễ.</li>
  <li>Thay implementation ở runtime (mock cho test, prod khác staging).</li>
  <li>State riêng cho từng phần ứng dụng nhờ provider hierarchy.</li>
</ul>

<h4>3. RxJS gắn liền</h4>
<p>HttpClient trả Observable. Router event là Observable. ReactiveForms là Observable. Bạn không "có lựa chọn" dùng RxJS — bạn dùng nó. Đây là điểm gây tranh cãi: học nhiều hơn, nhưng khi đã quen sẽ xử lý async cực mượt.</p>

<h4>4. Tooling chuẩn hoá</h4>
<p>CLI làm hết: <code>ng generate</code>, <code>ng test</code>, <code>ng build</code>, <code>ng update</code>. Khi nâng từ Angular 16 lên 17, một câu lệnh tự chạy migration tới 80% code base — không phải framework nào cũng đầu tư cho việc này.</p>

<h4>5. Hệ sinh thái Material/CDK chuẩn UX</h4>
<p>Angular Material được Google duy trì, follow Material Design. CDK (Component Dev Kit) cung cấp các <em>primitive</em> như Overlay, Drag&amp;Drop, Virtual Scroll mà bạn xây UI riêng dựa lên — không bị khoá vào theme.</p>

<h3>Khi nào KHÔNG nên chọn Angular?</h3>
<ul>
  <li>Trang landing page nhỏ-một-trang → quá nặng. Astro/Svelte/HTML thuần phù hợp hơn.</li>
  <li>Đội solo / cá nhân làm prototype nhanh → React/Vue khởi động nhanh hơn nhiều.</li>
  <li>Mobile-first PWA cần bundle siêu nhỏ → cân nhắc Preact/SolidJS.</li>
</ul>

<h3>Khi NÊN chọn Angular?</h3>
<ul>
  <li>Dashboard doanh nghiệp, ERP, admin panel — vòng đời dài, đội nhiều người, nhiều chức năng phức tạp.</li>
  <li>Dự án cần cấu trúc rõ ràng để 5 năm sau dev mới vẫn hiểu.</li>
  <li>Team đã quen Java/.NET — tư duy DI, decorator dễ chuyển qua.</li>
</ul>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Angular là full-stack frontend opinionated, không phải thư viện.</li>
    <li>Điểm mạnh: TS-first, DI mạnh, tooling chuẩn, ecosystem nhất quán.</li>
    <li>Điểm yếu: bundle lớn hơn, learning curve dốc hơn (đặc biệt RxJS).</li>
    <li>Phù hợp dự án doanh nghiệp; quá nặng cho prototype/landing page.</li>
  </ul>
</div>`
    }
  ]
},

/* =================== SECTION 02 =================== */
{
  id: "s02", n: "02", title: "Components, Core Directives & Pipes",
  lessons: [
    {
      id: "02-01", n: "01",
      title: "Mở chương: Components và Core Directives",
      html: `
<p>Đây là chương <strong>nền móng</strong>. Mọi thứ về sau (DI, lifecycle, signal, defer…) đều đứng trên hai khái niệm chính của chương này: <em>component</em> và <em>directive lõi</em>. Bạn sẽ học:</p>
<ol>
  <li>Tạo component, truyền dữ liệu vào (<code>@Input</code>), phát sự kiện ra (<code>@Output</code>).</li>
  <li>Render điều kiện và lặp với cú pháp <strong>control-flow mới</strong> (Angular 17): <code>@if</code>, <code>@for</code>, <code>@switch</code>.</li>
  <li>Học cả cú pháp <em>cũ</em> (<code>*ngIf</code>, <code>*ngFor</code>) — vì 80% code Angular hiện hữu vẫn dùng nó.</li>
  <li>Xử lý CSS động (<code>ngClass</code>, <code>ngStyle</code>), template wrapper (<code>ng-container</code>), và pipe biến đổi giá trị.</li>
</ol>
<div class="callout"><strong>Cách đọc chương:</strong> theo tuần tự. Các bài về sau tham chiếu khái niệm bài trước (vd: <code>@for</code> ở bài 6 dựa trên hiểu biết về <code>@Input</code> bài 3).</div>`
    },
    {
      id: "02-02", n: "02",
      title: "Xây dựng component đầu tiên",
      html: `
<p>Có hai cách tạo component: dùng CLI (<code>ng g c course-card</code>) hoặc viết tay. Trong dự án thật, dùng CLI vì nó tự sinh đủ 4 file (.ts/.html/.scss/.spec.ts), update <code>app.config.ts</code> nếu cần, và cấu hình test sẵn.</p>

<div class="example-label">Bước 1 — sinh component bằng CLI</div>
<pre><code>ng generate component course-card
<span class="c-comment"># hoặc viết tắt:</span>
ng g c course-card</code></pre>

<p>CLI sẽ tạo:</p>
<pre><code>src/app/course-card/
├── course-card.component.ts
├── course-card.component.html
├── course-card.component.scss
└── course-card.component.spec.ts</code></pre>

<div class="example-label">Bước 2 — cấu trúc file .ts</div>
<pre><code><span class="c-keyword">import</span> { Component } <span class="c-keyword">from</span> <span class="c-string">'@angular/core'</span>;

@Component({
  selector: <span class="c-string">'app-course-card'</span>,
  standalone: <span class="c-keyword">true</span>,
  imports: [],
  templateUrl: <span class="c-string">'./course-card.component.html'</span>,
  styleUrl: <span class="c-string">'./course-card.component.scss'</span>
})
<span class="c-keyword">export class</span> CourseCardComponent {
  title = <span class="c-string">'Angular Core Deep Dive'</span>;
  description = <span class="c-string">'Đi sâu vào core API của Angular.'</span>;
  iconUrl = <span class="c-string">'/assets/angular.png'</span>;
}</code></pre>

<p>Bốn trường quan trọng trong decorator <code>@Component</code>:</p>
<table class="compare-table">
<tr><th>Trường</th><th>Ý nghĩa</th></tr>
<tr><td><code>selector</code></td><td>Tên thẻ HTML để dùng component (<code>&lt;app-course-card&gt;</code>)</td></tr>
<tr><td><code>standalone: true</code></td><td>Component tự khai báo dependency, không cần NgModule</td></tr>
<tr><td><code>imports</code></td><td>Liệt kê component/directive/pipe khác mà template cần</td></tr>
<tr><td><code>templateUrl/styleUrl</code></td><td>Đường dẫn HTML/CSS rời (hoặc dùng <code>template</code>/<code>styles</code> inline)</td></tr>
</table>

<div class="example-label">Bước 3 — template HTML</div>
<pre><code>&lt;<span class="c-tag">div</span> <span class="c-attr">class</span>=<span class="c-string">"card"</span>&gt;
  &lt;<span class="c-tag">img</span> [<span class="c-attr">src</span>]=<span class="c-string">"iconUrl"</span> /&gt;
  &lt;<span class="c-tag">div</span> <span class="c-attr">class</span>=<span class="c-string">"body"</span>&gt;
    &lt;<span class="c-tag">h2</span>&gt;{{ title }}&lt;/<span class="c-tag">h2</span>&gt;
    &lt;<span class="c-tag">p</span>&gt;{{ description }}&lt;/<span class="c-tag">p</span>&gt;
  &lt;/<span class="c-tag">div</span>&gt;
&lt;/<span class="c-tag">div</span>&gt;</code></pre>

<div class="example-label">Bước 4 — sử dụng từ cha</div>
<pre><code><span class="c-comment">// app.component.ts</span>
@Component({
  selector: <span class="c-string">'app-root'</span>,
  standalone: <span class="c-keyword">true</span>,
  imports: [CourseCardComponent],     <span class="c-comment">// ← bắt buộc với standalone</span>
  template: \`
    &lt;app-course-card/&gt;
    &lt;app-course-card/&gt;
    &lt;app-course-card/&gt;
  \`
})
<span class="c-keyword">export class</span> AppComponent {}</code></pre>

<p>Lúc này 3 thẻ trông giống hệt nhau vì đều dùng dữ liệu hard-code. Bài tiếp theo sẽ truyền dữ liệu khác nhau qua <code>@Input</code>.</p>

<div class="warn"><strong>Lỗi thường gặp:</strong> quên thêm component vào mảng <code>imports</code> của cha. Lúc đó Angular hiển thị thẻ <code>&lt;app-course-card&gt;</code> như HTML rỗng, không có lỗi rõ — chỉ thấy "không render được" — đây là một trong các lỗi gây bối rối nhất với người mới.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Dùng <code>ng g c &lt;name&gt;</code>, đừng tự tay tạo file.</li>
    <li>Selector phải có prefix (<code>app-</code> hoặc tên tổ chức) để tránh đụng độ với custom element của thư viện khác.</li>
    <li>Standalone component phải tự khai báo <code>imports</code> mọi thứ template dùng.</li>
  </ul>
</div>`
    },
    {
      id: "02-03", n: "03",
      title: "@Input — truyền dữ liệu từ ngoài vào component",
      html: `
<p>Component không nên hard-code dữ liệu. Nó phải <em>nhận</em> dữ liệu từ cha qua <code>@Input</code>, biến nó thành <strong>API công khai</strong> của component.</p>

<div class="example-label">Ví dụ 1 — input cơ bản với type rõ ràng</div>
<pre><code><span class="c-keyword">import</span> { Component, Input } <span class="c-keyword">from</span> <span class="c-string">'@angular/core'</span>;

<span class="c-keyword">export interface</span> Course {
  id: number;
  title: string;
  description: string;
  iconUrl: string;
  category: <span class="c-string">'beginner'</span> | <span class="c-string">'intermediate'</span> | <span class="c-string">'advanced'</span>;
}

@Component({
  selector: <span class="c-string">'app-course-card'</span>,
  standalone: <span class="c-keyword">true</span>,
  templateUrl: <span class="c-string">'./course-card.component.html'</span>
})
<span class="c-keyword">export class</span> CourseCardComponent {
  @Input() course!: Course;
  @Input() index = 0;
}</code></pre>

<p>Cú pháp <code>course!:</code> nói với TS "tôi cam kết giá trị này sẽ được Angular set trước khi đọc, đừng đòi initializer". Nếu không dùng dấu <code>!</code>, TS sẽ báo lỗi với <code>strictPropertyInitialization</code>.</p>

<div class="example-label">Ví dụ 2 — bind từ cha</div>
<pre><code><span class="c-comment">// app.component.ts</span>
<span class="c-keyword">export class</span> AppComponent {
  courses: Course[] = [
    { id: 1, title: <span class="c-string">'Angular Core'</span>, description: <span class="c-string">'...'</span>, iconUrl: <span class="c-string">'...'</span>, category: <span class="c-string">'advanced'</span> },
    { id: 2, title: <span class="c-string">'RxJS Mastery'</span>, description: <span class="c-string">'...'</span>, iconUrl: <span class="c-string">'...'</span>, category: <span class="c-string">'intermediate'</span> }
  ];
}</code></pre>

<pre><code>&lt;<span class="c-tag">app-course-card</span>
  [<span class="c-attr">course</span>]=<span class="c-string">"courses[0]"</span>
  [<span class="c-attr">index</span>]=<span class="c-string">"0"</span>&gt;&lt;/<span class="c-tag">app-course-card</span>&gt;

&lt;<span class="c-tag">app-course-card</span>
  [<span class="c-attr">course</span>]=<span class="c-string">"courses[1]"</span>
  [<span class="c-attr">index</span>]=<span class="c-string">"1"</span>&gt;&lt;/<span class="c-tag">app-course-card</span>&gt;</code></pre>

<h3>Hai cú pháp bind: có ngoặc và không</h3>
<table class="compare-table">
<tr><th>Cú pháp</th><th>Ý nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>[prop]="x"</code></td><td>x là biểu thức TS, đánh giá rồi gán</td><td><code>[index]="i + 1"</code></td></tr>
<tr><td><code>prop="x"</code></td><td>x là chuỗi literal</td><td><code>title="Hello"</code></td></tr>
</table>

<div class="warn"><strong>Bẫy thường gặp:</strong> <code>[index]="0"</code> và <code>index="0"</code> KHÁC nhau. Cái đầu truyền số <code>0</code>; cái sau truyền chuỗi <code>"0"</code>. Khi component khai báo <code>index: number</code>, cú pháp sai sẽ làm runtime nhận chuỗi.</div>

<div class="example-label">Ví dụ 3 — input bắt buộc (Angular 16+)</div>
<pre><code>@Input({ required: <span class="c-keyword">true</span> }) course!: Course;</code></pre>
<p>Nếu cha quên truyền <code>[course]</code>, compiler báo lỗi build — không cần <code>!</code> hay null check.</p>

<div class="example-label">Ví dụ 4 — alias và transform</div>
<pre><code><span class="c-keyword">import</span> { booleanAttribute, numberAttribute } <span class="c-keyword">from</span> <span class="c-string">'@angular/core'</span>;

@Input({ alias: <span class="c-string">'data'</span> }) payload!: Course;

@Input({ transform: booleanAttribute }) disabled = <span class="c-keyword">false</span>;
@Input({ transform: numberAttribute })  count = 0;

<span class="c-comment">// custom transform</span>
@Input({ transform: (v: string) =&gt; v.trim().toLowerCase() }) email = <span class="c-string">''</span>;</code></pre>

<p>Cha có thể viết:</p>
<pre><code>&lt;<span class="c-tag">app-x</span> <span class="c-attr">disabled</span>             <span class="c-comment">// → true</span>
       <span class="c-attr">count</span>=<span class="c-string">"5"</span>            <span class="c-comment">// → number 5, không phải "5"</span>
       [<span class="c-attr">data</span>]=<span class="c-string">"selectedCourse"</span>&gt;</code></pre>

<h3>Setter input — phản ứng khi giá trị đổi</h3>
<pre><code><span class="c-keyword">private</span> _course!: Course;

@Input() <span class="c-keyword">set</span> course(c: Course) {
  <span class="c-keyword">this</span>._course = c;
  <span class="c-keyword">this</span>.recomputeMetadata(c);   <span class="c-comment">// chạy mỗi khi cha truyền course mới</span>
}
<span class="c-keyword">get</span> course() { <span class="c-keyword">return this</span>._course; }</code></pre>

<div class="tip"><strong>Khi nào setter, khi nào ngOnChanges?</strong> Setter gọn hơn khi chỉ cần phản ứng một input cụ thể. <code>ngOnChanges</code> tốt khi cần biết nhiều input cùng đổi (so sánh giá trị cũ-mới). Với code mới, ưu tiên <strong>signal input</strong> + <code>computed</code> (chương 18) — thanh lịch nhất.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>@Input()</code> biến field thành "API" mà cha truyền dữ liệu vào.</li>
    <li><code>[prop]="x"</code> = expression; <code>prop="x"</code> = literal string.</li>
    <li>Dùng <code>{ required: true }</code> để bắt buộc, <code>{ transform }</code> để chuẩn hoá kiểu.</li>
    <li>Setter input để phản ứng khi value đổi; với code mới ưu tiên signal input.</li>
  </ul>
</div>`
    },
    {
      id: "02-04", n: "04",
      title: "@Output — phát sự kiện tuỳ biến",
      html: `
<p>Component con không nên gọi trực tiếp method của cha — đó là phá vỡ sự cô lập. Thay vào đó, con <strong>phát ra sự kiện</strong>; cha lắng nghe nếu muốn xử lý. Đây là pattern "smart parent / dumb child" — con càng "ngu" càng dễ tái sử dụng.</p>

<div class="example-label">Ví dụ 1 — sự kiện đơn giản</div>
<pre><code><span class="c-keyword">import</span> { Component, Input, Output, EventEmitter } <span class="c-keyword">from</span> <span class="c-string">'@angular/core'</span>;

@Component({
  selector: <span class="c-string">'app-course-card'</span>,
  standalone: <span class="c-keyword">true</span>,
  template: \`
    &lt;h2&gt;{{ course.title }}&lt;/h2&gt;
    &lt;button (click)="onLike()"&gt;❤ Thích&lt;/button&gt;
    &lt;button (click)="onEnroll()"&gt;Đăng ký&lt;/button&gt;
  \`
})
<span class="c-keyword">export class</span> CourseCardComponent {
  @Input() course!: Course;

  @Output() liked = <span class="c-keyword">new</span> EventEmitter&lt;Course&gt;();
  @Output() enrolled = <span class="c-keyword">new</span> EventEmitter&lt;{ course: Course; timestamp: number }&gt;();

  onLike() { <span class="c-keyword">this</span>.liked.emit(<span class="c-keyword">this</span>.course); }
  onEnroll() {
    <span class="c-keyword">this</span>.enrolled.emit({ course: <span class="c-keyword">this</span>.course, timestamp: Date.now() });
  }
}</code></pre>

<div class="example-label">Ví dụ 2 — cha lắng nghe</div>
<pre><code>&lt;<span class="c-tag">app-course-card</span>
  [<span class="c-attr">course</span>]=<span class="c-string">"c"</span>
  (<span class="c-attr">liked</span>)=<span class="c-string">"onLike(\$event)"</span>
  (<span class="c-attr">enrolled</span>)=<span class="c-string">"onEnroll(\$event)"</span>&gt;&lt;/<span class="c-tag">app-course-card</span>&gt;</code></pre>

<pre><code>onLike(course: Course) {
  console.log(<span class="c-string">'User đã like'</span>, course.title);
}
onEnroll(payload: { course: Course; timestamp: number }) {
  <span class="c-keyword">this</span>.enrollService.create(payload);
}</code></pre>

<p><code>$event</code> là <strong>biến đặc biệt</strong> trong template — nó chứa giá trị mà <code>EventEmitter.emit()</code> đã truyền. Nếu emit không có tham số, <code>$event</code> = <code>undefined</code>.</p>

<h3>Dưới mui xe: EventEmitter là gì?</h3>
<p><code>EventEmitter</code> mở rộng <code>Subject</code> của RxJS. Khi bạn <code>emit()</code>, mọi subscriber đều nhận. Cú pháp <code>(eventName)="handler($event)"</code> chỉ là đường tắt; tương đương:</p>
<pre><code><span class="c-comment">// ngOnInit của cha (cách dài, không nên dùng)</span>
@ViewChild(CourseCardComponent) child!: CourseCardComponent;
ngAfterViewInit() {
  <span class="c-keyword">this</span>.child.liked.subscribe(c =&gt; <span class="c-keyword">this</span>.onLike(c));
}</code></pre>

<div class="warn"><strong>Tránh:</strong> đừng dùng <code>EventEmitter</code> bên trong service. Mặc dù về kỹ thuật chạy được, nó là class chuyên cho component output. Trong service, dùng <code>Subject</code> hoặc <code>BehaviorSubject</code> trực tiếp — code rõ ràng, không gây nhầm.</div>

<div class="example-label">Ví dụ 3 — emit nhiều giá trị theo thời gian</div>
<pre><code>@Output() progress = <span class="c-keyword">new</span> EventEmitter&lt;number&gt;();

uploadFile(file: File) {
  <span class="c-keyword">const</span> reader = <span class="c-keyword">new</span> FileReader();
  reader.onprogress = (e) =&gt; {
    <span class="c-keyword">if</span> (e.lengthComputable) {
      <span class="c-keyword">this</span>.progress.emit(Math.round(e.loaded / e.total * 100));
    }
  };
  reader.readAsArrayBuffer(file);
}</code></pre>

<p>Cha nhận stream giá trị (0, 5, 12, 47, 100…), không chỉ một lần.</p>

<h3>Two-way binding: <code>[(x)]</code></h3>
<p>Là combo của <code>[x]</code> + <code>(xChange)</code>. Quy ước: nếu component có <code>@Input() value</code> và <code>@Output() valueChange</code>, cha có thể viết:</p>
<pre><code>&lt;<span class="c-tag">app-counter</span> [(<span class="c-attr">value</span>)]=<span class="c-string">"count"</span>&gt;&lt;/<span class="c-tag">app-counter</span>&gt;
<span class="c-comment">&lt;!-- tương đương --&gt;</span>
&lt;<span class="c-tag">app-counter</span> [<span class="c-attr">value</span>]=<span class="c-string">"count"</span> (<span class="c-attr">valueChange</span>)=<span class="c-string">"count = \$event"</span>&gt;</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Con phát event, cha lắng nghe — không bao giờ con gọi method cha trực tiếp.</li>
    <li><code>EventEmitter</code> là <code>Subject</code> RxJS, chỉ dùng cho <code>@Output</code>.</li>
    <li><code>$event</code> trong handler = giá trị emit truyền vào.</li>
    <li>Two-way binding <code>[(x)]</code> chỉ là syntax sugar của <code>[x]</code>+<code>(xChange)</code>.</li>
  </ul>
</div>`
    },
    {
      id: "02-05", n: "05",
      title: "Cú pháp control-flow Angular 17",
      html: `
<p>Angular 17 giới thiệu cú pháp control-flow ngay <strong>trong template</strong>: <code>@if</code>, <code>@for</code>, <code>@switch</code>. Chúng KHÔNG phải directive — chúng là <em>block syntax</em> mà compiler hiểu trực tiếp. Vì thế:</p>

<ul>
  <li><strong>Không cần import gì</strong> — kể cả <code>CommonModule</code>.</li>
  <li><strong>Nhanh hơn</strong> 30–90% trong các benchmark (do compiler tối ưu trực tiếp, không qua directive runtime).</li>
  <li><strong>Bundle nhỏ hơn</strong> — không kéo theo <code>NgIf</code>, <code>NgFor</code>, <code>NgSwitch</code> directive.</li>
  <li><strong>Dễ đọc hơn</strong> — không có cú pháp microsyntax bí ẩn của <code>*ngFor="let x of arr; trackBy: ..."</code>.</li>
</ul>

<div class="example-label">Ví dụ 1 — tổng hợp</div>
<pre><code>@<span class="c-keyword">if</span> (loading) {
  &lt;app-spinner/&gt;
} @<span class="c-keyword">else if</span> (error) {
  &lt;p class="err"&gt;{{ error }}&lt;/p&gt;
} @<span class="c-keyword">else</span> {
  &lt;app-list [data]="data"/&gt;
}

@<span class="c-keyword">for</span> (course <span class="c-keyword">of</span> courses; track course.id) {
  &lt;app-course-card [course]="course"/&gt;
} @<span class="c-keyword">empty</span> {
  &lt;p&gt;Chưa có khoá học nào&lt;/p&gt;
}

@<span class="c-keyword">switch</span> (user.role) {
  @<span class="c-keyword">case</span> <span class="c-string">'admin'</span>:   { &lt;app-admin-panel/&gt; }
  @<span class="c-keyword">case</span> <span class="c-string">'student'</span>: { &lt;app-student-dashboard/&gt; }
  @<span class="c-keyword">default</span>:           { &lt;p&gt;Không xác định&lt;/p&gt; }
}</code></pre>

<h3>Khác biệt cơ bản với cú pháp cũ</h3>
<table class="compare-table">
<tr><th>Đặc điểm</th><th>Cú pháp mới (@if/@for)</th><th>Cú pháp cũ (*ngIf/*ngFor)</th></tr>
<tr><td>Cần import</td><td>Không</td><td>Có (<code>CommonModule</code> hoặc <code>NgIf</code>)</td></tr>
<tr><td>Lồng nhau nhiều cấp</td><td>Mỗi block là khối {} riêng — rõ ràng</td><td>Phải dùng <code>ng-container</code> phụ</td></tr>
<tr><td>Tracking trong @for</td><td>Bắt buộc</td><td>Tuỳ chọn (<code>trackBy</code>)</td></tr>
<tr><td>Rỗng (empty)</td><td><code>@empty</code> sẵn có</td><td>Phải kết hợp <code>*ngIf="!arr.length"</code></td></tr>
<tr><td>Hiệu năng</td><td>Tối ưu compiler-level</td><td>Qua runtime directive</td></tr>
</table>

<div class="callout"><strong>Khuyến nghị thực dụng:</strong> code mới — luôn dùng @if/@for/@switch. Code cũ — không cần migrate ngay; Angular cung cấp schematic <code>ng generate @angular/core:control-flow</code> để chuyển hàng loạt khi bạn sẵn sàng.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Control-flow mới là block syntax, không phải directive — không cần import.</li>
    <li>Dùng cho code mới; code cũ vẫn hoạt động bình thường, không cần vội đổi.</li>
    <li>Có schematic tự động chuyển: <code>ng g @angular/core:control-flow</code>.</li>
  </ul>
</div>`
    },
    {
      id: "02-06", n: "06",
      title: "@for chi tiết — vì sao track là bắt buộc",
      html: `
<p>Đây là điểm khác biệt then chốt với <code>*ngFor</code>: <strong>track là bắt buộc</strong> với <code>@for</code>. Đây không phải sự rườm rà — đây là <em>biện pháp an toàn</em> mà Angular team cố tình áp đặt để tránh một loại bug hiệu năng phổ biến.</p>

<h3>Vấn đề mà track giải quyết</h3>
<p>Khi mảng đổi (vd: thêm/xoá phần tử, sort, filter), Angular cần biết: <em>phần tử mới</em> ứng với phần tử cũ nào? Nếu không biết, nó sẽ huỷ toàn bộ DOM cũ và tạo lại — chậm và mất state DOM (focus của input, vị trí scroll, animation đang chạy).</p>

<p>Track expression nói: "định danh duy nhất của mỗi item là cái này". Angular dùng nó để <em>diff</em> hai phiên bản mảng và chỉ thay đổi DOM tương ứng — y hệt React key.</p>

<div class="example-label">Ví dụ 1 — track theo id (chuẩn nhất)</div>
<pre><code>@<span class="c-keyword">for</span> (user <span class="c-keyword">of</span> users; track user.id) {
  &lt;li&gt;{{ user.name }}&lt;/li&gt;
}</code></pre>

<div class="example-label">Ví dụ 2 — mảng string thuần</div>
<pre><code><span class="c-comment">// items = ['Apple', 'Banana', 'Cherry']</span>
@<span class="c-keyword">for</span> (fruit <span class="c-keyword">of</span> items; track fruit) {
  &lt;li&gt;{{ fruit }}&lt;/li&gt;
}</code></pre>
<p>Track theo chính giá trị — hợp lý vì string là primitive, so sánh bằng giá trị.</p>

<div class="example-label">Ví dụ 3 — dùng $index khi không có id</div>
<pre><code>@<span class="c-keyword">for</span> (line <span class="c-keyword">of</span> logLines; track \$index) {
  &lt;p&gt;{{ \$index + 1 }}. {{ line }}&lt;/p&gt;
}</code></pre>
<div class="warn"><strong>Cảnh báo:</strong> track $index <em>không thực sự</em> tracking. Nếu bạn sort lại mảng, mọi DOM đều "phải vẽ lại" vì $index không di chuyển theo phần tử. Chỉ dùng khi mảng <em>không bao giờ sort/insert giữa</em> — chỉ append cuối hoặc replace toàn bộ.</div>

<div class="example-label">Ví dụ 4 — track theo nhiều thuộc tính</div>
<pre><code><span class="c-comment">// component .ts</span>
trackByUser = (i: number, u: User) =&gt; \`\${u.firstName}-\${u.lastName}\`;</code></pre>
<pre><code>@<span class="c-keyword">for</span> (u <span class="c-keyword">of</span> users; track trackByUser(\$index, u)) {
  &lt;app-user-card [user]="u"/&gt;
}</code></pre>

<h3>Dưới mui xe</h3>
<p>Khi mảng đổi, Angular xây <em>map</em> từ track-key cũ sang DOM cũ, rồi duyệt mảng mới. Với mỗi item:</p>
<ol>
  <li>Tính track-key của item mới.</li>
  <li>Nếu key đã có trong map cũ → tái sử dụng DOM, chỉ update binding.</li>
  <li>Nếu key chưa có → tạo DOM mới.</li>
  <li>Sau cùng, mọi DOM cũ chưa được "claim" → xoá.</li>
</ol>

<div class="tip"><strong>Quy tắc:</strong> track-key càng <em>ổn định và duy nhất</em>, hiệu năng càng tốt. Tránh tạo object/array mới làm key (vd <code>track [u.a, u.b]</code>) — mỗi lần sẽ là reference khác, Angular nghĩ mọi item đều mới.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Track bắt buộc, là biện pháp an toàn ngăn bug hiệu năng.</li>
    <li>Ưu tiên: <code>track item.id</code> > <code>track item</code> (cho primitive) > <code>track $index</code> (chỉ khi append-only).</li>
    <li>Track sai → DOM bị tạo lại, mất focus/state, chậm.</li>
  </ul>
</div>`
    },
    {
      id: "02-07", n: "07",
      title: "@for: @empty, $index và biến phụ",
      html: `
<p>Bên trong <code>@for</code>, bạn có quyền dùng <strong>5 biến cục bộ</strong>:</p>
<table class="compare-table">
<tr><th>Biến</th><th>Ý nghĩa</th></tr>
<tr><td><code>$index</code></td><td>Vị trí (số nguyên, 0-based)</td></tr>
<tr><td><code>$first</code></td><td><code>true</code> nếu là phần tử đầu</td></tr>
<tr><td><code>$last</code></td><td><code>true</code> nếu là phần tử cuối</td></tr>
<tr><td><code>$even</code> / <code>$odd</code></td><td>True/false theo chỉ số chẵn/lẻ</td></tr>
<tr><td><code>$count</code></td><td>Tổng số phần tử trong mảng</td></tr>
</table>

<div class="example-label">Ví dụ — bảng có hàng zebra + đường phân cách</div>
<pre><code>&lt;table&gt;
  @<span class="c-keyword">for</span> (row <span class="c-keyword">of</span> rows; track row.id) {
    &lt;tr [class.zebra]="\$even" [class.last-row]="\$last"&gt;
      &lt;td&gt;{{ \$index + 1 }} / {{ \$count }}&lt;/td&gt;
      &lt;td&gt;{{ row.label }}&lt;/td&gt;
    &lt;/tr&gt;
  } @<span class="c-keyword">empty</span> {
    &lt;tr&gt;&lt;td colspan="2"&gt;Trống&lt;/td&gt;&lt;/tr&gt;
  }
&lt;/table&gt;</code></pre>

<div class="example-label">Alias rõ ràng (tương đương cú pháp cũ)</div>
<pre><code>@<span class="c-keyword">for</span> (row <span class="c-keyword">of</span> rows; track row.id; let i = \$index, last = \$last) {
  &lt;tr [class.last]="last"&gt;{{ i }} — {{ row.label }}&lt;/tr&gt;
}</code></pre>

<p><code>@empty</code> render khi mảng rỗng — gọn hơn rất nhiều so với:</p>
<pre><code><span class="c-comment">&lt;!-- cách cũ phải kết hợp 2 directive --&gt;</span>
&lt;ul *ngIf="rows.length; else emptyTpl"&gt;
  &lt;li *ngFor="let r of rows"&gt;...&lt;/li&gt;
&lt;/ul&gt;
&lt;ng-template #emptyTpl&gt;&lt;p&gt;Trống&lt;/p&gt;&lt;/ng-template&gt;</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Biến tự nhiên: <code>$index, $first, $last, $even, $odd, $count</code>.</li>
    <li>Có thể alias: <code>let i = $index</code> nếu muốn tên riêng.</li>
    <li><code>@empty</code> là một block riêng, không cần kết hợp <code>@if</code>.</li>
  </ul>
</div>`
    },
    {
      id: "02-08", n: "08",
      title: "Tracking function — khi cần định danh phức tạp",
      html: `
<p>Hầu hết trường hợp, <code>track item.id</code> là đủ. Nhưng khi item không có ID duy nhất, hoặc khi định danh là tổ hợp của nhiều thuộc tính, bạn viết <strong>tracking function</strong>.</p>

<div class="example-label">Ví dụ 1 — tổ hợp họ + tên</div>
<pre><code><span class="c-keyword">export class</span> UserList {
  trackByName = (i: number, u: User) =&gt; \`\${u.firstName}-\${u.lastName}\`;
}</code></pre>

<pre><code>@<span class="c-keyword">for</span> (u <span class="c-keyword">of</span> users; track trackByName(\$index, u)) {
  &lt;app-user-card [user]="u"/&gt;
}</code></pre>

<div class="example-label">Ví dụ 2 — track string mảng (mỗi string là item)</div>
<pre><code><span class="c-comment">// Khi mảng là string thuần, dùng giá trị làm key luôn</span>
@<span class="c-keyword">for</span> (tag <span class="c-keyword">of</span> tags; track tag) {
  &lt;span class="chip"&gt;{{ tag }}&lt;/span&gt;
}</code></pre>

<h3>Tránh các sai lầm phổ biến</h3>

<div class="warn"><strong>Sai 1: track một object.</strong>
<pre><code><span class="c-comment">// ❌ XẤU</span>
@<span class="c-keyword">for</span> (u <span class="c-keyword">of</span> users; track u) { ... }</code></pre>
Mỗi lần mảng tạo mới (vd qua <code>map</code>/<code>filter</code>), object trong đó cũng có thể là reference mới → mọi DOM bị tái tạo.</div>

<div class="warn"><strong>Sai 2: tạo array làm key.</strong>
<pre><code><span class="c-comment">// ❌ XẤU — mỗi lần render array literal là reference mới</span>
@<span class="c-keyword">for</span> (u <span class="c-keyword">of</span> users; track [u.firstName, u.lastName]) { ... }</code></pre>
</div>

<div class="warn"><strong>Sai 3: track $index cho mảng có sort.</strong>
<pre><code><span class="c-comment">// ❌ XẤU nếu users.sort() được gọi đâu đó</span>
@<span class="c-keyword">for</span> (u <span class="c-keyword">of</span> users; track \$index) { ... }</code></pre>
Sau sort, item ở index 0 đã đổi nhưng DOM index 0 vẫn giữ — Angular tưởng "vẫn item cũ".</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Function tracking chỉ cần khi key là tổ hợp.</li>
    <li>Tránh: track object, track array literal, track $index khi có sort.</li>
    <li>Quy tắc vàng: key phải là <em>primitive ổn định gắn liền</em> với item.</li>
  </ul>
</div>`
    },
    {
      id: "02-09", n: "09",
      title: "Tiếp theo: directive *ngFor (cú pháp cũ)",
      html: `
<p>Trước Angular 17, vòng lặp dùng <code>*ngFor</code>. Bạn vẫn cần biết vì:</p>
<ol>
  <li>Đa số dự án doanh nghiệp hiện hữu vẫn dùng cú pháp này.</li>
  <li>Một số directive bên thứ ba (vd <code>cdkVirtualFor</code>, <code>cdkDragFor</code>) chỉ hỗ trợ cú pháp star — chưa có block syntax tương đương.</li>
</ol>

<div class="example-label">Ví dụ cơ bản</div>
<pre><code>&lt;<span class="c-tag">li</span> *<span class="c-attr">ngFor</span>=<span class="c-string">"let item of items"</span>&gt;{{ item.name }}&lt;/<span class="c-tag">li</span>&gt;</code></pre>

<p>Để dùng <code>*ngFor</code> trong standalone component, phải import <code>NgFor</code> hoặc <code>CommonModule</code>:</p>

<pre><code><span class="c-keyword">import</span> { NgFor } <span class="c-keyword">from</span> <span class="c-string">'@angular/common'</span>;
<span class="c-comment">// hoặc:</span>
<span class="c-keyword">import</span> { CommonModule } <span class="c-keyword">from</span> <span class="c-string">'@angular/common'</span>;

@Component({
  standalone: <span class="c-keyword">true</span>,
  imports: [CommonModule]   <span class="c-comment">// hoặc [NgFor] cụ thể hơn</span>
})</code></pre>

<div class="tip"><strong>CommonModule vs Specific imports:</strong> import <code>CommonModule</code> là cách nhanh — kéo đầy đủ NgIf/NgFor/NgSwitch + tất cả pipe (date/currency/json…). Import từng cái cụ thể giúp tree-shaking nhỏ hơn nhưng lằng nhằng. Trong project thường dùng <code>CommonModule</code>; thư viện UI mới ưu tiên import cụ thể.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>*ngFor</code> vẫn còn dùng nhiều — không "lỗi thời".</li>
    <li>Standalone component phải import <code>NgFor</code> hoặc <code>CommonModule</code>.</li>
    <li>Một số thư viện CDK chỉ hỗ trợ cú pháp star → chưa thể bỏ hoàn toàn.</li>
  </ul>
</div>`
    },
    {
      id: "02-10", n: "10",
      title: "*ngFor chi tiết — index, last, trackBy",
      html: `
<p>Cú pháp <code>*ngFor</code> trông phức tạp vì là <em>microsyntax</em> — Angular parse chuỗi đặc biệt với nhiều phần ngăn bằng <code>;</code>:</p>

<pre><code>*<span class="c-attr">ngFor</span>=<span class="c-string">"let item of items; let i = index; let isLast = last; trackBy: trackById"</span></code></pre>

<table class="compare-table">
<tr><th>Phần</th><th>Ý nghĩa</th></tr>
<tr><td><code>let item of items</code></td><td>Lặp <code>items</code>, mỗi vòng item nhận giá trị</td></tr>
<tr><td><code>let i = index</code></td><td>Tạo biến <code>i</code> = chỉ số hiện tại</td></tr>
<tr><td><code>let isLast = last</code></td><td>Biến boolean cho phần tử cuối</td></tr>
<tr><td><code>trackBy: trackById</code></td><td>Hàm tracking (component method)</td></tr>
</table>

<p>Các biến tự nhiên có sẵn (gán bằng <code>let x = ...</code>): <code>index</code>, <code>first</code>, <code>last</code>, <code>even</code>, <code>odd</code>, <code>count</code>.</p>

<div class="example-label">Ví dụ — trackBy hàm</div>
<pre><code><span class="c-keyword">export class</span> UserList {
  users: User[] = [];
  trackById = (_: number, u: User) =&gt; u.id;
}</code></pre>

<pre><code>&lt;<span class="c-tag">li</span> *<span class="c-attr">ngFor</span>=<span class="c-string">"let u of users; trackBy: trackById; let last = last"</span>
    [<span class="c-attr">class.divider</span>]=<span class="c-string">"!last"</span>&gt;
  {{ u.name }}
&lt;/<span class="c-tag">li</span>&gt;</code></pre>

<div class="warn"><strong>Bẫy thường gặp:</strong> không thể đặt 2 structural directive cùng phần tử. Code sau sẽ KHÔNG biên dịch:
<pre><code><span class="c-comment">&lt;!-- ❌ SAI --&gt;</span>
&lt;li *ngFor="..." *ngIf="..."&gt;</code></pre>
Phải dùng <code>ng-container</code> để tách:
<pre><code>&lt;ng-container *ngFor="let u of users"&gt;
  &lt;li *ngIf="u.active"&gt;{{ u.name }}&lt;/li&gt;
&lt;/ng-container&gt;</code></pre>
</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Microsyntax: ngăn bằng <code>;</code>, alias bằng <code>let x = ...</code>.</li>
    <li>Các biến phụ: <code>index, first, last, even, odd, count</code>.</li>
    <li>Không đặt 2 structural directive trên cùng phần tử — dùng <code>ng-container</code> để tách.</li>
  </ul>
</div>`
    },
    {
      id: "02-11", n: "11",
      title: "@for vs *ngFor — khi nào dùng cái nào",
      html: `
<table class="compare-table">
<tr><th>Tiêu chí</th><th>@for (mới)</th><th>*ngFor (cũ)</th></tr>
<tr><td>Phải import gì?</td><td>Không</td><td><code>NgFor</code>/<code>CommonModule</code></td></tr>
<tr><td>Track expression</td><td>Bắt buộc</td><td>Tuỳ chọn (qua <code>trackBy</code>)</td></tr>
<tr><td>Empty state</td><td><code>@empty</code> sẵn có</td><td>Phải kết hợp với <code>*ngIf</code></td></tr>
<tr><td>Hiệu năng</td><td>Tối ưu compiler</td><td>Qua runtime directive</td></tr>
<tr><td>Bundle size</td><td>~0 thêm vào</td><td>Có (kéo NgFor logic)</td></tr>
<tr><td>Đọc code</td><td>Block syntax tường minh</td><td>Microsyntax (cần học)</td></tr>
<tr><td>Tích hợp CDK</td><td>Một số chưa hỗ trợ</td><td>Hỗ trợ đầy đủ (vd <code>cdkVirtualFor</code>)</td></tr>
</table>

<h3>Quyết định</h3>
<ul>
  <li><strong>Code mới:</strong> dùng <code>@for</code>. Luôn luôn.</li>
  <li><strong>Cần CDK Virtual Scroll:</strong> dùng <code>*cdkVirtualFor</code> (chưa có block syntax tương đương — Angular team đang làm).</li>
  <li><strong>Code cũ:</strong> không cần migrate vội. Khi rảnh, chạy schematic:</li>
</ul>

<pre><code>ng generate @angular/core:control-flow</code></pre>

<p>Schematic này chuyển toàn bộ <code>*ngIf</code>/<code>*ngFor</code>/<code>*ngSwitch</code> sang block syntax tự động, an toàn, kèm format đẹp. Đa số dự án migrate xong trong 1-2 giờ.</p>

<div class="callout"><strong>Tips migration:</strong> chạy schematic trên một feature module nhỏ trước, review diff, kiểm tra UI vẫn chạy đúng, rồi mới làm lớn. Đừng migrate cả repo trong 1 commit khổng lồ.</div>`
    },
    {
      id: "02-12", n: "12",
      title: "@if — mở đầu",
      html: `
<p><code>@if</code> render điều kiện một block. Cú pháp giống JavaScript thuần — không có "phép thuật" microsyntax như <code>*ngIf</code>.</p>

<pre><code>@<span class="c-keyword">if</span> (condition) {
  &lt;p&gt;Hiển thị khi true&lt;/p&gt;
}

@<span class="c-keyword">if</span> (loading) {
  &lt;app-spinner/&gt;
} @<span class="c-keyword">else if</span> (error) {
  &lt;p class="err"&gt;{{ error }}&lt;/p&gt;
} @<span class="c-keyword">else</span> {
  &lt;app-list [data]="data"/&gt;
}</code></pre>

<div class="callout"><strong>Đặc biệt mạnh:</strong> hỗ trợ <code>@else if</code> nhiều cấp tự nhiên. Trước đây, lồng nhiều <code>*ngIf</code> phải kết hợp <code>ng-template</code> + <code>else</code> rất rườm rà.</div>`
    },
    {
      id: "02-13", n: "13",
      title: "@if với alias (as)",
      html: `
<p>Cú pháp <code>(expr; as alias)</code> đánh giá biểu thức một lần và gắn vào biến cục bộ. Đặc biệt hữu ích với <code>async</code> pipe và signal — tránh gọi nhiều lần và tránh check null lặp.</p>

<div class="example-label">Ví dụ 1 — với async pipe</div>
<pre><code>@<span class="c-keyword">if</span> (user\$ | <span class="c-keyword">async</span>; as u) {
  &lt;p&gt;Chào {{ u.fullName }}, mã: {{ u.id }}&lt;/p&gt;
  &lt;p&gt;Email: {{ u.email }}&lt;/p&gt;
}</code></pre>
<p>Nếu không có <code>as u</code>, mỗi <code>{{ user$ | async }}.fullName</code> là một subscription riêng — gọi API nhiều lần (trừ khi pipe có cache).</p>

<div class="example-label">Ví dụ 2 — với signal</div>
<pre><code>@<span class="c-keyword">if</span> (currentUser(); as u) {
  &lt;p&gt;Tên: {{ u.name }}&lt;/p&gt;
  &lt;p&gt;Vai trò: {{ u.role }}&lt;/p&gt;
}</code></pre>

<div class="warn"><strong>Khác biệt với *ngIf:</strong> trong <code>@if</code>, alias chỉ tồn tại trong <strong>nhánh true</strong>. Ở nhánh <code>@else</code>, biến không có. Cú pháp <code>*ngIf</code> cũ cho phép alias tồn tại cả 2 nhánh thông qua context — nhưng hiếm khi cần.</div>

<div class="example-label">Ví dụ 3 — kết hợp toán tử</div>
<pre><code>@<span class="c-keyword">if</span> (form.value.email?.trim().length &gt; 0; as hasEmail) {
  &lt;button&gt;Submit&lt;/button&gt;
}</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>(expr; as alias)</code> đánh giá một lần, gắn vào biến — tránh gọi lặp.</li>
    <li>Alias chỉ có ở nhánh true; ở @else không tồn tại.</li>
    <li>Pattern phổ biến nhất: kết hợp với <code>async</code> pipe hoặc signal getter.</li>
  </ul>
</div>`
    },
    {
      id: "02-14", n: "14",
      title: "Tiếp theo: directive *ngIf",
      html: `
<p><code>*ngIf</code> là cú pháp cũ. Cấu trúc cơ bản:</p>
<pre><code>&lt;<span class="c-tag">div</span> *<span class="c-attr">ngIf</span>=<span class="c-string">"isLoggedIn"</span>&gt;Đã đăng nhập&lt;/<span class="c-tag">div</span>&gt;</code></pre>

<p>Có <code>else</code>, nhưng phải qua một <code>ng-template</code> trung gian:</p>
<pre><code>&lt;<span class="c-tag">div</span> *<span class="c-attr">ngIf</span>=<span class="c-string">"isLoggedIn; else login"</span>&gt;
  Chào {{ user.name }}
&lt;/<span class="c-tag">div</span>&gt;
&lt;<span class="c-tag">ng-template</span> #<span class="c-attr">login</span>&gt;
  &lt;a routerLink="/login"&gt;Đăng nhập&lt;/a&gt;
&lt;/<span class="c-tag">ng-template</span>&gt;</code></pre>

<p>Có <code>then</code> + <code>else</code> để render template hoàn toàn ngoài:</p>
<pre><code>&lt;<span class="c-tag">div</span> *<span class="c-attr">ngIf</span>=<span class="c-string">"isLoggedIn; then content; else login"</span>&gt;&lt;/<span class="c-tag">div</span>&gt;
&lt;<span class="c-tag">ng-template</span> #<span class="c-attr">content</span>&gt;Chào {{ user.name }}&lt;/<span class="c-tag">ng-template</span>&gt;
&lt;<span class="c-tag">ng-template</span> #<span class="c-attr">login</span>&gt;&lt;a routerLink="/login"&gt;Đăng nhập&lt;/a&gt;&lt;/<span class="c-tag">ng-template</span>&gt;</code></pre>

<div class="callout">Cú pháp này khá rườm rà. Đó chính là lý do <code>@if</code> ra đời.</div>`
    },
    {
      id: "02-15", n: "15",
      title: "*ngIf với toán tử Elvis (?.)",
      html: `
<p>Khi truy cập sâu vào object có thể null/undefined, dùng <strong>safe navigation operator</strong> <code>?.</code> để tránh crash:</p>

<pre><code>&lt;p&gt;{{ user?.address?.city }}&lt;/p&gt;</code></pre>

<p>Mỗi cấp <code>?</code> kiểm tra null — nếu là null/undefined, biểu thức trả về undefined thay vì throw.</p>

<h3>Pattern: <code>*ngIf="x as y"</code></h3>
<p>Khi cần truy cập nhiều thuộc tính của object có thể null, đừng viết <code>?.</code> mỗi dòng. Thay vào đó:</p>
<pre><code>&lt;<span class="c-tag">section</span> *<span class="c-attr">ngIf</span>=<span class="c-string">"user?.profile as p"</span>&gt;
  &lt;<span class="c-tag">h2</span>&gt;{{ p.title }}&lt;/<span class="c-tag">h2</span>&gt;
  &lt;<span class="c-tag">p</span>&gt;{{ p.bio }}&lt;/<span class="c-tag">p</span>&gt;
  &lt;<span class="c-tag">img</span> [<span class="c-attr">src</span>]=<span class="c-string">"p.avatar"</span> /&gt;
&lt;/<span class="c-tag">section</span>&gt;</code></pre>

<p>Bên trong block, <code>p</code> được TS coi là không-null → không cần <code>?.</code> nữa.</p>

<div class="example-label">Ví dụ — kết hợp với async pipe</div>
<pre><code>&lt;<span class="c-tag">div</span> *<span class="c-attr">ngIf</span>=<span class="c-string">"user\$ | async as u; else loading"</span>&gt;
  &lt;<span class="c-tag">h2</span>&gt;{{ u.name }}&lt;/<span class="c-tag">h2</span>&gt;
  &lt;<span class="c-tag">p</span>&gt;{{ u.email }}&lt;/<span class="c-tag">p</span>&gt;
&lt;/<span class="c-tag">div</span>&gt;
&lt;<span class="c-tag">ng-template</span> #<span class="c-attr">loading</span>&gt;Đang tải…&lt;/<span class="c-tag">ng-template</span>&gt;</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>?.</code> cho an toàn 1 lần truy cập; <code>*ngIf="x as y"</code> cho block dài.</li>
    <li>Cú pháp <code>x as y</code> thu hẹp kiểu — TS biết <code>y</code> không null trong block.</li>
  </ul>
</div>`
    },
    {
      id: "02-16", n: "16",
      title: "@if vs *ngIf — so sánh",
      html: `
<table class="compare-table">
<tr><th>Đặc điểm</th><th>@if (mới)</th><th>*ngIf (cũ)</th></tr>
<tr><td>Cần import</td><td>Không</td><td>Có (<code>NgIf</code>/<code>CommonModule</code>)</td></tr>
<tr><td>else</td><td><code>@else</code> tự nhiên</td><td>Phải qua <code>ng-template</code></td></tr>
<tr><td>else if</td><td><code>@else if (...)</code></td><td>Phải lồng nhiều <code>ng-template</code></td></tr>
<tr><td>Alias</td><td>Chỉ ở nhánh true</td><td>Cả 2 nhánh (qua context)</td></tr>
<tr><td>Cú pháp</td><td>Block (giống JS)</td><td>Microsyntax đặc thù</td></tr>
</table>

<h3>Khi nào còn dùng *ngIf?</h3>
<ul>
  <li>Maintain code legacy lớn — chưa migrate.</li>
  <li>Pattern đặc biệt: cần alias ở cả 2 nhánh (rất hiếm).</li>
  <li>Tích hợp với một số directive cũ chỉ chấp nhận template ref.</li>
</ul>

<p>Mọi tình huống khác — dùng <code>@if</code>.</p>`
    },
    {
      id: "02-17", n: "17",
      title: "ngClass — gắn class động",
      html: `
<p>Có nhiều cách bind class trong Angular. Hiểu cả 4 vì project doanh nghiệp thường trộn lẫn:</p>

<h3>Cách 1: class binding đơn — <code>[class.x]</code></h3>
<pre><code>&lt;<span class="c-tag">div</span> [<span class="c-attr">class.active</span>]=<span class="c-string">"isActive"</span>&gt;...&lt;/<span class="c-tag">div</span>&gt;
&lt;<span class="c-tag">div</span> [<span class="c-attr">class.warning</span>]=<span class="c-string">"hasError"</span>
     [<span class="c-attr">class.disabled</span>]=<span class="c-string">"isDisabled"</span>&gt;...&lt;/<span class="c-tag">div</span>&gt;</code></pre>
<p>Sạch và rõ — <strong>ưu tiên cách này</strong> khi chỉ có 1-3 class.</p>

<h3>Cách 2: ngClass với chuỗi</h3>
<pre><code>&lt;<span class="c-tag">div</span> [<span class="c-attr">ngClass</span>]=<span class="c-string">"someStringExpression"</span>&gt;...&lt;/<span class="c-tag">div</span>&gt;
<span class="c-comment">// vd: "card primary featured"</span></code></pre>

<h3>Cách 3: ngClass với mảng</h3>
<pre><code>&lt;<span class="c-tag">div</span> [<span class="c-attr">ngClass</span>]=<span class="c-string">"['card', isActive ? 'active' : 'idle']"</span>&gt;...&lt;/<span class="c-tag">div</span>&gt;</code></pre>

<h3>Cách 4: ngClass với object (phổ biến nhất)</h3>
<pre><code>&lt;<span class="c-tag">div</span> [<span class="c-attr">ngClass</span>]=<span class="c-string">"{
  'is-loading': loading,
  'is-error':   !!error,
  'is-ready':   ready,
  'is-large':   size === 'lg'
}"</span>&gt;...&lt;/<span class="c-tag">div</span>&gt;</code></pre>

<p>Class được áp dụng khi value là <em>truthy</em>.</p>

<h3>Pattern khuyến nghị: gọi method trả object</h3>
<p>Khi logic class phức tạp, đừng nhét vào template — chuyển vào component method:</p>

<pre><code><span class="c-keyword">export class</span> CourseCard {
  @Input() course!: Course;
  @Input() selected = <span class="c-keyword">false</span>;

  cardClasses() {
    <span class="c-keyword">return</span> {
      <span class="c-string">'card'</span>: <span class="c-keyword">true</span>,
      <span class="c-string">'card-selected'</span>: <span class="c-keyword">this</span>.selected,
      <span class="c-string">'card-beginner'</span>: <span class="c-keyword">this</span>.course.category === <span class="c-string">'beginner'</span>,
      <span class="c-string">'card-advanced'</span>: <span class="c-keyword">this</span>.course.category === <span class="c-string">'advanced'</span>
    };
  }
}</code></pre>

<pre><code>&lt;<span class="c-tag">div</span> [<span class="c-attr">ngClass</span>]=<span class="c-string">"cardClasses()"</span>&gt;...&lt;/<span class="c-tag">div</span>&gt;</code></pre>

<h3>Quy tắc thực dụng</h3>
<ul>
  <li><strong>Class luôn áp dụng:</strong> đặt vào <code>class</code> HTML thường.
    <pre><code>&lt;div class="card"&gt;</code></pre>
  </li>
  <li><strong>1-3 class điều kiện:</strong> dùng <code>[class.x]="cond"</code>.</li>
  <li><strong>4+ class điều kiện:</strong> dùng <code>[ngClass]="{...}"</code> hoặc method.</li>
</ul>

<div class="warn"><strong>Đừng nhét class cố định vào ngClass.</strong>
<pre><code><span class="c-comment">// ❌ Class 'card' luôn áp dụng — sao phải nhét vào ngClass?</span>
&lt;div [ngClass]="{ card: true, active: isActive }"&gt;

<span class="c-comment">// ✓ Tách rõ ràng</span>
&lt;div class="card" [class.active]="isActive"&gt;</code></pre>
</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Class cố định → <code>class="..."</code>. Class điều kiện → <code>[class.x]</code> hoặc <code>[ngClass]</code>.</li>
    <li>Logic phức tạp → method trả object, đừng nhét vào template.</li>
    <li>Dùng <code>[ngClass]</code> cho <strong>điều kiện</strong>, không phải để thay <code>class</code>.</li>
  </ul>
</div>`
    },
    {
      id: "02-18", n: "18",
      title: "ngStyle — set style trực tiếp",
      html: `
<p>Tương tự ngClass nhưng cho CSS inline:</p>

<h3>Cách 1: style binding đơn</h3>
<pre><code>&lt;<span class="c-tag">div</span> [<span class="c-attr">style.width.px</span>]=<span class="c-string">"width"</span>
     [<span class="c-attr">style.color</span>]=<span class="c-string">"isHot ? 'red' : 'gray'"</span>
     [<span class="c-attr">style.background-color</span>]=<span class="c-string">"bgColor"</span>&gt;
&lt;/<span class="c-tag">div</span>&gt;</code></pre>

<p>Cú pháp <code>[style.unit.px]</code> rất tiện — Angular tự append "px".</p>

<h3>Cách 2: ngStyle với object</h3>
<pre><code>&lt;<span class="c-tag">div</span> [<span class="c-attr">ngStyle</span>]=<span class="c-string">"{
  'background-color': bg,
  'font-size.px': size,
  'transform': isExpanded ? 'scale(1.05)' : 'scale(1)',
  'transition': 'all 0.3s'
}"</span>&gt;...&lt;/<span class="c-tag">div</span>&gt;</code></pre>

<h3>Khi nào dùng ngStyle, khi nào CSS class?</h3>
<table class="compare-table">
<tr><th>Tình huống</th><th>Dùng gì?</th></tr>
<tr><td>Style cố định</td><td>CSS class</td></tr>
<tr><td>Toggle giữa các trạng thái rời rạc</td><td>CSS class + <code>[class.x]</code></td></tr>
<tr><td>Giá trị động liên tục (vd: width = 67%)</td><td><code>[style.width.%]</code></td></tr>
<tr><td>Theme rất phức tạp</td><td>CSS variable + class</td></tr>
</table>

<div class="warn"><strong>Tránh:</strong> đừng nhét theme/colour scheme vào <code>[ngStyle]</code> khắp nơi. Sẽ rất khó maintain. Pattern đúng: định nghĩa CSS variable, đổi qua class, để CSS làm phần "vẽ":</p>

<pre><code><span class="c-comment">// styles.scss</span>
.theme-dark { --bg: #111; --ink: #fafafa; }
.theme-light { --bg: #fff; --ink: #111; }

body { background: var(--bg); color: var(--ink); }</code></pre>

<pre><code><span class="c-comment">// component template</span>
&lt;body [class]="'theme-' + theme()"&gt;...&lt;/body&gt;</code></pre>
</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>[style.x.unit]</code> đẹp cho 1-2 thuộc tính động.</li>
    <li><code>[ngStyle]</code> cho nhiều thuộc tính cùng lúc.</li>
    <li>Theme phức tạp → CSS variable + class, đừng dùng ngStyle.</li>
  </ul>
</div>`
    },
    {
      id: "02-19", n: "19",
      title: "@switch — mở đầu",
      html: `
<p>Tương đương <code>switch/case</code> JavaScript. Phù hợp khi có nhiều nhánh rời rạc — sạch hơn nhiều <code>@if/@else if</code> nối tiếp.</p>

<pre><code>@<span class="c-keyword">switch</span> (variable) {
  @<span class="c-keyword">case</span> value1 { ... }
  @<span class="c-keyword">case</span> value2 { ... }
  @<span class="c-keyword">default</span> { ... }
}</code></pre>

<p>Khác switch JS, KHÔNG có "fall-through": mỗi case tự đóng. Không cần break.</p>`
    },
    {
      id: "02-20", n: "20",
      title: "@switch trong thực tế",
      html: `
<div class="example-label">Ví dụ 1 — render theo loại bài học</div>
<pre><code>@<span class="c-keyword">switch</span> (lesson.type) {
  @<span class="c-keyword">case</span> <span class="c-string">'video'</span>:    { &lt;app-video [src]="lesson.url"/&gt; }
  @<span class="c-keyword">case</span> <span class="c-string">'reading'</span>:  { &lt;app-article [md]="lesson.body"/&gt; }
  @<span class="c-keyword">case</span> <span class="c-string">'quiz'</span>:     { &lt;app-quiz [data]="lesson.q"/&gt; }
  @<span class="c-keyword">default</span>:              { &lt;p&gt;Loại bài chưa hỗ trợ&lt;/p&gt; }
}</code></pre>

<div class="example-label">Ví dụ 2 — kết hợp discriminated union TypeScript</div>
<pre><code><span class="c-keyword">type</span> Notification =
  | { kind: <span class="c-string">'info'</span>;    text: string }
  | { kind: <span class="c-string">'warn'</span>;    text: string; severity: number }
  | { kind: <span class="c-string">'error'</span>;   error: Error };

@Component({
  template: \`
    @<span class="c-keyword">switch</span> (notification.kind) {
      @<span class="c-keyword">case</span> 'info'  { &lt;p&gt;{{ notification.text }}&lt;/p&gt; }
      @<span class="c-keyword">case</span> 'warn'  { &lt;p [class.severity-high]="notification.severity &gt; 5"&gt;{{ notification.text }}&lt;/p&gt; }
      @<span class="c-keyword">case</span> 'error' { &lt;p&gt;Lỗi: {{ notification.error.message }}&lt;/p&gt; }
    }
  \`
})</code></pre>

<div class="callout"><strong>Mẹo TypeScript:</strong> trong mỗi <code>@case 'kind'</code>, TS thu hẹp kiểu <em>tự động</em>. Trong <code>case 'warn'</code>, <code>notification.severity</code> hợp lệ; trong <code>case 'info'</code>, truy cập <code>severity</code> sẽ báo lỗi compile-time. Đây là sức mạnh khi kết hợp với strictTemplates.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Không có fall-through — không cần break.</li>
    <li>Kết hợp với discriminated union TS để có an toàn kiểu trong từng case.</li>
    <li>Ưu tiên @switch khi có ≥3 nhánh rời rạc; dùng @if/@else if cho 2 nhánh.</li>
  </ul>
</div>`
    },
    {
      id: "02-21", n: "21",
      title: "ngSwitch — directive cũ",
      html: `
<pre><code>&lt;<span class="c-tag">div</span> [<span class="c-attr">ngSwitch</span>]=<span class="c-string">"status"</span>&gt;
  &lt;<span class="c-tag">app-spinner</span> *<span class="c-attr">ngSwitchCase</span>=<span class="c-string">"'loading'"</span>&gt;&lt;/<span class="c-tag">app-spinner</span>&gt;
  &lt;<span class="c-tag">p</span> *<span class="c-attr">ngSwitchCase</span>=<span class="c-string">"'error'"</span>&gt;Lỗi&lt;/<span class="c-tag">p</span>&gt;
  &lt;<span class="c-tag">app-list</span> *<span class="c-attr">ngSwitchDefault</span>&gt;&lt;/<span class="c-tag">app-list</span>&gt;
&lt;/<span class="c-tag">div</span>&gt;</code></pre>

<p>Lưu ý: <code>*ngSwitchCase</code> nhận <strong>biểu thức</strong>, vì vậy chuỗi phải có quote bên trong: <code>"'loading'"</code>. Đây là điểm dễ nhầm.</p>

<p>Trong code mới — luôn dùng <code>@switch</code>.</p>`
    },
    {
      id: "02-22", n: "22",
      title: "ng-container — “thẻ vô hình”",
      html: `
<p><code>&lt;ng-container&gt;</code> là một thẻ <strong>không sinh DOM</strong>. Nó chỉ tồn tại như "vùng chứa" để áp dụng directive cấu trúc.</p>

<h3>Use case 1: tránh wrapper div thừa</h3>
<pre><code><span class="c-comment">&lt;!-- ❌ thừa div --&gt;</span>
&lt;<span class="c-tag">div</span> *<span class="c-attr">ngIf</span>=<span class="c-string">"user"</span>&gt;
  &lt;<span class="c-tag">h2</span>&gt;{{ user.name }}&lt;/<span class="c-tag">h2</span>&gt;
  &lt;<span class="c-tag">p</span>&gt;{{ user.email }}&lt;/<span class="c-tag">p</span>&gt;
&lt;/<span class="c-tag">div</span>&gt;

<span class="c-comment">&lt;!-- ✓ không có wrapper --&gt;</span>
&lt;ng-container *<span class="c-attr">ngIf</span>=<span class="c-string">"user"</span>&gt;
  &lt;<span class="c-tag">h2</span>&gt;{{ user.name }}&lt;/<span class="c-tag">h2</span>&gt;
  &lt;<span class="c-tag">p</span>&gt;{{ user.email }}&lt;/<span class="c-tag">p</span>&gt;
&lt;/ng-container&gt;</code></pre>

<h3>Use case 2: 2 structural directive lồng nhau</h3>
<pre><code>&lt;ng-container *<span class="c-attr">ngFor</span>=<span class="c-string">"let user of users"</span>&gt;
  &lt;<span class="c-tag">li</span> *<span class="c-attr">ngIf</span>=<span class="c-string">"user.active"</span>&gt;{{ user.name }}&lt;/<span class="c-tag">li</span>&gt;
&lt;/ng-container&gt;</code></pre>

<h3>Use case 3: ngTemplateOutlet</h3>
<pre><code>&lt;ng-container *<span class="c-attr">ngTemplateOutlet</span>=<span class="c-string">"rowTpl; context: { \$implicit: data }"</span>&gt;&lt;/ng-container&gt;</code></pre>

<h3>Use case 4: select trong ng-content</h3>
<pre><code>&lt;<span class="c-tag">app-card</span>&gt;
  &lt;ng-container card-title&gt;Tiêu đề có nhiều phần&lt;/ng-container&gt;
&lt;/<span class="c-tag">app-card</span>&gt;</code></pre>

<div class="callout"><strong>Với cú pháp mới (Angular 17+):</strong> <code>@if</code>/<code>@for</code>/<code>@switch</code> không tạo wrapper, vì vậy bạn ít cần <code>ng-container</code> hơn. Nhưng nó vẫn có ích cho <code>ngTemplateOutlet</code> và content projection select.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>&lt;ng-container&gt;</code> không sinh DOM — pure logical wrapper.</li>
    <li>Use case chính: tránh div thừa, nhóm 2 structural directive, content projection.</li>
    <li>Block syntax mới (@if/@for) tự nhiên không cần wrapper, giảm nhu cầu ng-container.</li>
  </ul>
</div>`
    },
    {
      id: "02-23", n: "23",
      title: "Catalog Pipes built-in",
      html: `
<p>Pipe biến đổi giá trị ngay trong template: <code>{{ value | pipeName : args }}</code>. Angular ship sẵn rất nhiều — không cần viết tay nhiều như nghĩ.</p>

<h3>Pipe số/tiền tệ</h3>
<pre><code>{{ price | <span class="c-fn">currency</span>:<span class="c-string">'VND'</span>:<span class="c-string">'symbol'</span>:<span class="c-string">'1.0-0'</span> }}     <span class="c-comment">// 1.250.000 ₫</span>
{{ ratio | <span class="c-fn">percent</span>:<span class="c-string">'1.0-1'</span> }}                       <span class="c-comment">// 12.5%</span>
{{ value | <span class="c-fn">number</span>:<span class="c-string">'1.2-2'</span> }}                        <span class="c-comment">// 1,234.56</span></code></pre>

<p>Cú pháp <code>'minIntDigits.minFracDigits-maxFracDigits'</code>: <code>'1.0-0'</code> = 1 chữ số nguyên tối thiểu, 0 chữ số thập phân (làm tròn).</p>

<h3>Pipe ngày giờ</h3>
<pre><code>{{ now | <span class="c-fn">date</span>:<span class="c-string">'dd/MM/yyyy'</span> }}                <span class="c-comment">// 06/05/2026</span>
{{ now | <span class="c-fn">date</span>:<span class="c-string">'HH:mm'</span> }}                       <span class="c-comment">// 14:09</span>
{{ now | <span class="c-fn">date</span>:<span class="c-string">'medium'</span> }}                      <span class="c-comment">// May 6, 2026, 2:09:47 PM</span>
{{ now | <span class="c-fn">date</span>:<span class="c-string">'shortDate'</span> }}                   <span class="c-comment">// 5/6/26</span></code></pre>

<h3>Pipe chuỗi</h3>
<pre><code>{{ name | <span class="c-fn">uppercase</span> }}    <span class="c-comment">// HIEU</span>
{{ name | <span class="c-fn">lowercase</span> }}    <span class="c-comment">// hieu</span>
{{ name | <span class="c-fn">titlecase</span> }}    <span class="c-comment">// Hieu Duong</span>
{{ list | <span class="c-fn">slice</span>:0:5 }}    <span class="c-comment">// 5 phần tử đầu</span>
{{ str  | <span class="c-fn">slice</span>:0:30 }}   <span class="c-comment">// 30 ký tự đầu</span></code></pre>

<h3>Pipe debug</h3>
<pre><code>{{ obj | <span class="c-fn">json</span> }}            <span class="c-comment">// in JSON dễ đọc — debug nhanh</span>
{{ obj | <span class="c-fn">json</span>:2 }}          <span class="c-comment">// indent 2 space</span></code></pre>

<h3>Async pipe — quan trọng nhất</h3>
<pre><code>{{ data\$ | <span class="c-fn">async</span> }}          <span class="c-comment">// Observable hoặc Promise</span>
{{ count() }}                <span class="c-comment">// signal — gọi như hàm, không cần pipe</span></code></pre>

<h3>i18n pipe</h3>
<pre><code>{{ count | <span class="c-fn">i18nPlural</span>:countMapping }}
{{ gender | <span class="c-fn">i18nSelect</span>:genderMapping }}</code></pre>

<div class="example-label">Chuỗi pipe — kết hợp nhiều</div>
<pre><code>{{ user.email | <span class="c-fn">lowercase</span> | <span class="c-fn">slice</span>:0:30 }}
{{ data\$ | <span class="c-fn">async</span> | <span class="c-fn">json</span> }}</code></pre>

<h3>Hiệu năng pipe — quan trọng</h3>
<p>Hầu hết pipe built-in là <strong>pure</strong> — chỉ chạy lại khi tham số đổi tham chiếu. Nếu bạn truyền array/object mới ở mỗi tick CD, pipe sẽ chạy lại — ảnh hưởng hiệu năng.</p>

<div class="warn"><strong>Bẫy:</strong>
<pre><code><span class="c-comment">&lt;!-- BAD: tạo array mới mỗi tick --&gt;</span>
&lt;p&gt;{{ items.filter(x =&gt; x.active) | json }}&lt;/p&gt;</code></pre>
<p><code>filter</code> tạo array mới mỗi lần Angular check template. Tốt hơn:</p>
<pre><code><span class="c-comment">// component</span>
activeItems = computed(() =&gt; <span class="c-keyword">this</span>.items().filter(x =&gt; x.active));</code></pre>
<pre><code>&lt;p&gt;{{ activeItems() | json }}&lt;/p&gt;</code></pre>
</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Có pipe built-in: <code>currency, date, number, percent, uppercase, lowercase, titlecase, slice, json, async, i18nPlural, i18nSelect</code>.</li>
    <li>Đa số pipe pure: chỉ chạy lại khi reference đổi.</li>
    <li>Tránh gọi method/filter trực tiếp trong template — tạo array mới mỗi tick.</li>
  </ul>
</div>`
    }
  ]
},
/* =================== SECTION 03 =================== */
{
  id: "s03", n: "03", title: "Local Template Querying",
  lessons: [
    {
      id: "03-01", n: "01",
      title: "@ViewChild — truy vấn phần tử trong template",
      html: `
<p><code>@ViewChild</code> cho phép component truy cập một phần tử/component con trong <em>template của chính nó</em>. Khi nào cần? Khi bạn cần làm việc gì đó <strong>imperative</strong> mà data binding không làm được:</p>
<ul>
  <li>Focus một input khi component xuất hiện.</li>
  <li>Đo kích thước/vị trí phần tử để tính toán layout.</li>
  <li>Gọi method của component con (vd: <code>modal.open()</code>, <code>player.play()</code>).</li>
  <li>Tích hợp với thư viện DOM bên ngoài (Chart.js, D3, Mapbox…).</li>
</ul>

<div class="example-label">Ví dụ 1 — focus input khi mount</div>
<pre><code>@Component({
  template: \`&lt;input #email type="email" [(ngModel)]="form.email"&gt;\`
})
<span class="c-keyword">export class</span> SignupForm {
  @ViewChild(<span class="c-string">'email'</span>) emailRef!: ElementRef&lt;HTMLInputElement&gt;;

  ngAfterViewInit() {
    <span class="c-keyword">this</span>.emailRef.nativeElement.focus();
  }
}</code></pre>

<div class="example-label">Ví dụ 2 — gọi method của component con</div>
<pre><code>@Component({
  template: \`
    &lt;app-modal #infoModal&gt;...&lt;/app-modal&gt;
    &lt;button (click)="open()"&gt;Mở&lt;/button&gt;
  \`
})
<span class="c-keyword">export class</span> Page {
  @ViewChild(<span class="c-string">'infoModal'</span>) modal!: ModalComponent;
  open() { <span class="c-keyword">this</span>.modal.show(); }
}</code></pre>

<div class="example-label">Ví dụ 3 — query bằng class component (không cần template ref)</div>
<pre><code>@ViewChild(ModalComponent) modal!: ModalComponent;</code></pre>
<p>Cách này lấy instance đầu tiên của <code>ModalComponent</code> trong template. Tiện khi chỉ có một.</p>

<h3>3 dạng query khác nhau</h3>
<table class="compare-table">
<tr><th>Cú pháp</th><th>Lấy gì</th><th>Use case</th></tr>
<tr><td><code>@ViewChild('ref')</code></td><td>Element/Directive theo template ref</td><td>Khi có nhiều component cùng loại</td></tr>
<tr><td><code>@ViewChild(MyComponent)</code></td><td>Instance đầu tiên của class</td><td>Khi chỉ có 1 — sạch nhất</td></tr>
<tr><td><code>@ViewChild('ref', { read: ElementRef })</code></td><td>ElementRef của #ref (không phải instance)</td><td>Khi muốn DOM element của một component</td></tr>
</table>

<div class="callout"><strong>Lúc nào sẵn sàng?</strong> ViewChild có giá trị từ lifecycle <code>ngAfterViewInit</code>, KHÔNG phải <code>ngOnInit</code>. Truy cập trong constructor hoặc ngOnInit sẽ là <code>undefined</code>.</div>

<div class="warn"><strong>Bẫy structural directive:</strong> nếu phần tử nằm dưới <code>*ngIf</code>/<code>@if</code>, nó CHỈ tồn tại khi điều kiện true. Trước đó, <code>@ViewChild</code> trả về <code>undefined</code>. Phải tự bảo vệ bằng <code>?.</code> hoặc check trước khi dùng.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>ViewChild = truy cập "imperative" (gọi method, focus, đo DOM).</li>
    <li>Available từ <code>ngAfterViewInit</code>, không phải <code>ngOnInit</code>.</li>
    <li>Nếu phần tử dưới @if, có thể là undefined → check trước khi dùng.</li>
    <li>Với code mới — dùng <code>viewChild()</code> signal-based (chương 18).</li>
  </ul>
</div>`
    },
    {
      id: "03-02", n: "02",
      title: "ViewChild — các tuỳ chọn cấu hình",
      html: `
<p>Decorator nhận tuỳ chọn thứ hai để thay đổi cách query.</p>

<h3>{ static: true | false }</h3>
<table class="compare-table">
<tr><th>Giá trị</th><th>Khi nào available</th><th>Khi nào dùng</th></tr>
<tr><td><code>static: true</code></td><td><code>ngOnInit</code> (trước CD đầu tiên)</td><td>Khi phần tử <strong>không</strong> ở dưới structural directive</td></tr>
<tr><td><code>static: false</code> (mặc định)</td><td><code>ngAfterViewInit</code></td><td>Mặc định — luôn an toàn</td></tr>
</table>

<div class="example-label">Ví dụ — static: true</div>
<pre><code>@Component({
  template: \`&lt;canvas #canvas&gt;&lt;/canvas&gt;\`   <span class="c-comment">// luôn render, không có @if</span>
})
<span class="c-keyword">export class</span> ChartComp {
  @ViewChild(<span class="c-string">'canvas'</span>, { static: <span class="c-keyword">true</span> }) canvas!: ElementRef&lt;HTMLCanvasElement&gt;;

  ngOnInit() {                <span class="c-comment">// có thể truy cập từ đây</span>
    <span class="c-keyword">const</span> ctx = <span class="c-keyword">this</span>.canvas.nativeElement.getContext(<span class="c-string">'2d'</span>);
    ctx?.fillRect(0, 0, 100, 100);
  }
}</code></pre>

<div class="warn"><strong>Tránh static: true</strong> nếu phần tử ở dưới <code>*ngIf</code> hoặc render điều kiện. Sẽ throw runtime.</div>

<h3>{ read: ... } — chọn loại token muốn lấy</h3>

<p>Khi query một component, mặc định lấy <strong>instance</strong>. Nhưng bạn có thể muốn:</p>
<ul>
  <li><code>ElementRef</code> — DOM element của component</li>
  <li><code>TemplateRef</code> — nếu là <code>&lt;ng-template #ref&gt;</code></li>
  <li><code>ViewContainerRef</code> — chỗ chứa template động</li>
  <li>Một directive khác cùng selector</li>
</ul>

<div class="example-label">Ví dụ 1 — lấy ElementRef của component</div>
<pre><code>@ViewChild(MyComponent, { read: ElementRef }) el!: ElementRef;
<span class="c-comment">// el.nativeElement là DOM của &lt;app-my-component&gt;</span></code></pre>

<div class="example-label">Ví dụ 2 — lấy TemplateRef</div>
<pre><code>&lt;<span class="c-tag">ng-template</span> #<span class="c-attr">tpl</span>&gt;Xin chào&lt;/<span class="c-tag">ng-template</span>&gt;</code></pre>
<pre><code>@ViewChild(<span class="c-string">'tpl'</span>, { read: TemplateRef }) tpl!: TemplateRef&lt;unknown&gt;;</code></pre>

<div class="example-label">Ví dụ 3 — lấy directive instance</div>
<pre><code>&lt;<span class="c-tag">div</span> <span class="c-attr">myHighlight</span>&gt;...&lt;/<span class="c-tag">div</span>&gt;</code></pre>
<pre><code>@ViewChild(HighlightDirective) highlight!: HighlightDirective;</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>{ static: true }</code> chỉ khi chắc chắn phần tử không ở dưới structural directive.</li>
    <li><code>{ read: X }</code> để chọn cụ thể loại token muốn lấy.</li>
    <li>Mặc định <code>static: false</code> — query trong <code>ngAfterViewInit</code>.</li>
  </ul>
</div>`
    },
    {
      id: "03-03", n: "03",
      title: "ngAfterViewInit — query sâu đến đâu?",
      html: `
<p>Điểm quan trọng cần hiểu: <code>@ViewChild</code> chỉ nhìn thấy <strong>phần tử trong template của component đang query</strong>. Nó <em>KHÔNG</em> đi xuyên qua các component con để tìm phần tử bên trong chúng. Đây là cô lập (encapsulation): mỗi component có view của riêng nó, cha không nên xâm nhập trực tiếp.</p>

<div class="example-label">Ví dụ — chỉ lấy được app-child, không lấy được nội dung bên trong</div>
<pre><code>@Component({
  selector: <span class="c-string">'app-child'</span>,
  template: \`&lt;h1 #title&gt;Tôi là child&lt;/h1&gt;\`
})
<span class="c-keyword">export class</span> ChildComponent {}</code></pre>

<pre><code>@Component({
  selector: <span class="c-string">'app-parent'</span>,
  template: \`&lt;app-child&gt;&lt;/app-child&gt;\`,
  imports: [ChildComponent]
})
<span class="c-keyword">export class</span> ParentComponent <span class="c-keyword">implements</span> AfterViewInit {
  @ViewChild(ChildComponent) child!: ChildComponent;             <span class="c-comment">// ✓ OK</span>
  @ViewChild(<span class="c-string">'title'</span>) title!: ElementRef;                       <span class="c-comment">// ✗ undefined</span>

  ngAfterViewInit() {
    console.log(<span class="c-keyword">this</span>.child);  <span class="c-comment">// ChildComponent instance</span>
    console.log(<span class="c-keyword">this</span>.title);  <span class="c-comment">// undefined — vì #title nằm trong template của child</span>
  }
}</code></pre>

<p>Nếu thật sự cần truy cập đến <code>#title</code>, expose nó qua API của child:</p>

<pre><code><span class="c-keyword">export class</span> ChildComponent {
  @ViewChild(<span class="c-string">'title'</span>) titleRef!: ElementRef;
  <span class="c-keyword">get</span> titleEl() { <span class="c-keyword">return this</span>.titleRef?.nativeElement; }
}

<span class="c-comment">// trong cha:</span>
<span class="c-keyword">this</span>.child.titleEl   <span class="c-comment">// truy cập gián tiếp, không phá encapsulation</span></code></pre>

<h3>Cảnh báo về ExpressionChangedAfterItHasBeenCheckedError</h3>
<p>Đừng <strong>thay đổi state</strong> trong <code>ngAfterViewInit</code> mà template đang phụ thuộc — sẽ dính lỗi nổi tiếng:</p>

<div class="warn">
<pre><code><span class="c-comment">// ❌ SAI</span>
ngAfterViewInit() {
  <span class="c-keyword">this</span>.title = <span class="c-keyword">this</span>.child.titleRef.nativeElement.textContent;
  <span class="c-comment">// nếu template binding {{ title }}, Angular sẽ throw:</span>
  <span class="c-comment">// ExpressionChangedAfterItHasBeenCheckedError</span>
}</code></pre>
<p><strong>Lý do:</strong> Angular vừa hoàn tất CD pass, value đã được commit vào DOM. Nếu bạn đổi state ngay đó, ở lần check kế tiếp Angular thấy "khác lúc trước" → throw.</p>
<p><strong>Cách xử lý:</strong> đẩy việc set state ra microtask bằng <code>setTimeout(...,0)</code> hoặc dùng <code>Promise.resolve().then(...)</code>. Hoặc thiết kế lại để không cần đo DOM.</p>
</div>

<div class="example-label">Cách an toàn</div>
<pre><code>ngAfterViewInit() {
  setTimeout(() =&gt; {
    <span class="c-keyword">this</span>.title = <span class="c-keyword">this</span>.child.titleRef.nativeElement.textContent;
  });
}</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>ViewChild chỉ thấy phần tử trong template của <em>chính component</em>, không xuyên xuống con.</li>
    <li>Truy cập sâu hơn → expose qua API của child, đừng phá encapsulation.</li>
    <li>Đừng modify state trong <code>ngAfterViewInit</code> mà template phụ thuộc → ExpressionChangedAfterItHasBeenCheckedError.</li>
    <li>Workaround: <code>setTimeout(() =&gt; ..., 0)</code> để đẩy ra microtask kế tiếp.</li>
  </ul>
</div>`
    },
    {
      id: "03-04", n: "04",
      title: "@ViewChildren và QueryList",
      html: `
<p>Khi cần truy vấn <strong>nhiều</strong> phần tử cùng loại — vd nhiều tab trong một tabs container, nhiều card trong một list — dùng <code>@ViewChildren</code>. Kết quả là một <code>QueryList&lt;T&gt;</code> reactive.</p>

<h3>QueryList — không phải Array thuần</h3>
<table class="compare-table">
<tr><th>Method/Property</th><th>Mô tả</th></tr>
<tr><td><code>.toArray()</code></td><td>Chuyển sang mảng JavaScript</td></tr>
<tr><td><code>.first / .last</code></td><td>Phần tử đầu / cuối</td></tr>
<tr><td><code>.length</code></td><td>Tổng số phần tử</td></tr>
<tr><td><code>.forEach(fn)</code></td><td>Lặp qua từng phần tử</td></tr>
<tr><td><code>.changes</code></td><td>Observable — phát mỗi khi danh sách thay đổi</td></tr>
</table>

<div class="example-label">Ví dụ — Tabs container quản lý nhiều Tab</div>
<pre><code>@Component({
  selector: <span class="c-string">'app-tab'</span>,
  template: \`
    &lt;div class="tab-content" [class.active]="active"&gt;
      &lt;ng-content/&gt;
    &lt;/div&gt;
  \`
})
<span class="c-keyword">export class</span> TabComponent {
  @Input() label = <span class="c-string">''</span>;
  active = <span class="c-keyword">false</span>;
  activate() { <span class="c-keyword">this</span>.active = <span class="c-keyword">true</span>; }
  deactivate() { <span class="c-keyword">this</span>.active = <span class="c-keyword">false</span>; }
}

@Component({
  selector: <span class="c-string">'app-tabs'</span>,
  template: \`
    &lt;nav&gt;
      @for (tab of tabs.toArray(); track \$index) {
        &lt;button (click)="select(\$index)"&gt;{{ tab.label }}&lt;/button&gt;
      }
    &lt;/nav&gt;
    &lt;ng-content/&gt;
  \`
})
<span class="c-keyword">export class</span> TabsComponent <span class="c-keyword">implements</span> AfterViewInit {
  @ContentChildren(TabComponent) tabs!: QueryList&lt;TabComponent&gt;;

  ngAfterContentInit() {
    <span class="c-keyword">this</span>.tabs.first?.activate();
    <span class="c-keyword">this</span>.tabs.changes.subscribe(() =&gt; console.log(<span class="c-string">'Tab list changed'</span>));
  }

  select(i: number) {
    <span class="c-keyword">this</span>.tabs.forEach(t =&gt; t.deactivate());
    <span class="c-keyword">this</span>.tabs.toArray()[i]?.activate();
  }
}</code></pre>

<h3>changes Observable — quan trọng</h3>
<p>QueryList không tự cập nhật trong template Angular — bạn phải subscribe vào <code>.changes</code> để biết khi danh sách đổi (vd: <code>@for</code> render thêm/bớt tab).</p>

<pre><code>ngAfterViewInit() {
  <span class="c-keyword">this</span>.tabs.changes.subscribe((list: QueryList&lt;TabComponent&gt;) =&gt; {
    console.log(<span class="c-string">'Số tab hiện tại:'</span>, list.length);
  });
}</code></pre>

<div class="callout"><strong>Code mới:</strong> Angular 17+ có <code>viewChildren()</code> và <code>contentChildren()</code> dạng signal — bỏ luôn QueryList.changes, tự reactive.</p>
<pre><code>tabs = viewChildren(TabComponent);
firstLabel = computed(() =&gt; <span class="c-keyword">this</span>.tabs()[0]?.label);</code></pre>
</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>@ViewChildren</code> trả về <code>QueryList</code>, không phải Array.</li>
    <li>Dùng <code>.toArray()</code> để chuyển; <code>.changes</code> để subscribe khi list đổi.</li>
    <li>Code mới: dùng <code>viewChildren()</code> / <code>contentChildren()</code> signal-based.</li>
  </ul>
</div>`
    }
  ]
},

/* =================== SECTION 04 =================== */
{
  id: "s04", n: "04", title: "Content Projection",
  lessons: [
    {
      id: "04-01", n: "01",
      title: "ng-content — truyền nội dung từ ngoài vào",
      html: `
<p>Content projection là cách <em>cha nhét HTML/component vào trong template của con</em>. Đây là pattern then chốt để xây các "container component" như Modal, Card, Drawer, Tabs.</p>

<h3>Cú pháp cơ bản</h3>
<pre><code><span class="c-comment">// component con</span>
@Component({
  selector: <span class="c-string">'app-card'</span>,
  template: \`
    &lt;div class="card"&gt;
      &lt;ng-content&gt;&lt;/ng-content&gt;
    &lt;/div&gt;
  \`
})
<span class="c-keyword">export class</span> CardComponent {}</code></pre>

<pre><code><span class="c-comment">// cha sử dụng</span>
&lt;<span class="c-tag">app-card</span>&gt;
  &lt;<span class="c-tag">h2</span>&gt;Tiêu đề&lt;/<span class="c-tag">h2</span>&gt;
  &lt;<span class="c-tag">p</span>&gt;Nội dung&lt;/<span class="c-tag">p</span>&gt;
&lt;/<span class="c-tag">app-card</span>&gt;</code></pre>

<p>Mọi thứ cha đặt giữa thẻ mở và đóng <code>&lt;app-card&gt;</code> sẽ được "chiếu" vào vị trí <code>&lt;ng-content&gt;</code> trong template con.</p>

<h3>Multi-slot projection — chiếu nhiều vùng</h3>
<p>Dùng <code>select</code> với CSS selector để chọn HTML cụ thể vào slot tương ứng:</p>

<div class="example-label">Card với header / body / footer</div>
<pre><code>@Component({
  selector: <span class="c-string">'app-card'</span>,
  template: \`
    &lt;div class="card"&gt;
      &lt;header&gt;&lt;ng-content select="[card-title]"&gt;&lt;/ng-content&gt;&lt;/header&gt;
      &lt;section&gt;&lt;ng-content&gt;&lt;/ng-content&gt;&lt;/section&gt;     &lt;!-- mặc định: nhận mọi thứ chưa khớp --&gt;
      &lt;footer&gt;&lt;ng-content select="[card-actions]"&gt;&lt;/ng-content&gt;&lt;/footer&gt;
    &lt;/div&gt;
  \`
})
<span class="c-keyword">export class</span> CardComponent {}</code></pre>

<pre><code>&lt;<span class="c-tag">app-card</span>&gt;
  &lt;<span class="c-tag">h2</span> <span class="c-attr">card-title</span>&gt;Khoá Angular&lt;/<span class="c-tag">h2</span>&gt;
  &lt;<span class="c-tag">p</span>&gt;Đi sâu vào core API…&lt;/<span class="c-tag">p</span>&gt;
  &lt;<span class="c-tag">div</span> <span class="c-attr">card-actions</span>&gt;
    &lt;<span class="c-tag">button</span>&gt;Đăng ký&lt;/<span class="c-tag">button</span>&gt;
    &lt;<span class="c-tag">button</span>&gt;Hủy&lt;/<span class="c-tag">button</span>&gt;
  &lt;/<span class="c-tag">div</span>&gt;
&lt;/<span class="c-tag">app-card</span>&gt;</code></pre>

<p>Selector accept bất kỳ CSS valid: <code>[attribute]</code>, <code>.class</code>, <code>tag</code>, kết hợp.</p>

<h3>Use case khác</h3>

<div class="example-label">Dialog component</div>
<pre><code>@Component({
  selector: <span class="c-string">'app-dialog'</span>,
  template: \`
    &lt;div class="overlay"&gt;
      &lt;div class="dialog"&gt;
        &lt;header class="dialog-header"&gt;
          &lt;ng-content select="[dialog-title]"&gt;&lt;/ng-content&gt;
          &lt;button (click)="close.emit()"&gt;✕&lt;/button&gt;
        &lt;/header&gt;
        &lt;div class="dialog-body"&gt;&lt;ng-content&gt;&lt;/ng-content&gt;&lt;/div&gt;
        &lt;footer&gt;&lt;ng-content select="[dialog-buttons]"&gt;&lt;/ng-content&gt;&lt;/footer&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  \`
})
<span class="c-keyword">export class</span> DialogComponent {
  @Output() close = <span class="c-keyword">new</span> EventEmitter&lt;<span class="c-keyword">void</span>&gt;();
}</code></pre>

<pre><code>&lt;<span class="c-tag">app-dialog</span> (<span class="c-attr">close</span>)=<span class="c-string">"showDialog = false"</span>&gt;
  &lt;<span class="c-tag">h3</span> <span class="c-attr">dialog-title</span>&gt;Xác nhận xoá&lt;/<span class="c-tag">h3</span>&gt;
  &lt;<span class="c-tag">p</span>&gt;Bạn có chắc?&lt;/<span class="c-tag">p</span>&gt;
  &lt;<span class="c-tag">div</span> <span class="c-attr">dialog-buttons</span>&gt;
    &lt;<span class="c-tag">button</span>&gt;Đồng ý&lt;/<span class="c-tag">button</span>&gt;
    &lt;<span class="c-tag">button</span>&gt;Huỷ&lt;/<span class="c-tag">button</span>&gt;
  &lt;/<span class="c-tag">div</span>&gt;
&lt;/<span class="c-tag">app-dialog</span>&gt;</code></pre>

<div class="callout"><strong>Tinh thần:</strong> component "container" chỉ định khung hình + hành vi (open/close, animation, accessibility). Cha cung cấp <em>nội dung cụ thể</em>. Đây là cách viết component cực kỳ tái sử dụng.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>&lt;ng-content&gt;</code> là "khe" để cha nhét HTML/component vào.</li>
    <li><code>select="..."</code> nhận CSS selector để chia nhiều slot.</li>
    <li><code>&lt;ng-content&gt;</code> không có select sẽ nhận mọi thứ chưa khớp.</li>
    <li>Pattern này là nền tảng của các container component như Modal, Card, Drawer.</li>
  </ul>
</div>`
    },
    {
      id: "04-02", n: "02",
      title: "@ContentChild — truy vấn nội dung được truyền vào",
      html: `
<p>Khác với <code>@ViewChild</code> (xem template của <em>chính</em> component), <code>@ContentChild</code> truy vấn các phần tử mà <strong>cha đã chiếu vào</strong> qua <code>ng-content</code>. Hữu ích khi container cần "biết" có cái gì bên trong nó.</p>

<div class="example-label">Ví dụ — Tabs cho phép cha định nghĩa header tuỳ chỉnh</div>
<pre><code>@Component({
  selector: <span class="c-string">'app-tabs'</span>,
  template: \`
    &lt;div class="tabs"&gt;
      @if (customHeader) {
        &lt;ng-container *ngTemplateOutlet="customHeader"&gt;&lt;/ng-container&gt;
      } @else {
        &lt;header class="default"&gt;&lt;h3&gt;Tabs&lt;/h3&gt;&lt;/header&gt;
      }
      &lt;ng-content&gt;&lt;/ng-content&gt;
    &lt;/div&gt;
  \`
})
<span class="c-keyword">export class</span> TabsComponent {
  @ContentChild(<span class="c-string">'customHeader'</span>) customHeader?: TemplateRef&lt;unknown&gt;;
}</code></pre>

<pre><code>&lt;<span class="c-tag">app-tabs</span>&gt;
  &lt;<span class="c-tag">ng-template</span> #<span class="c-attr">customHeader</span>&gt;
    &lt;<span class="c-tag">header</span> <span class="c-attr">class</span>=<span class="c-string">"fancy"</span>&gt;⭐ Header tuỳ biến&lt;/<span class="c-tag">header</span>&gt;
  &lt;/<span class="c-tag">ng-template</span>&gt;
  &lt;!-- nội dung tab --&gt;
&lt;/<span class="c-tag">app-tabs</span>&gt;</code></pre>

<h3>Available từ ngAfterContentInit</h3>
<p>Tương tự <code>@ViewChild</code> dùng <code>ngAfterViewInit</code>, <code>@ContentChild</code> available từ <code>ngAfterContentInit</code>. Hai lifecycle này chạy ở thời điểm khác nhau.</p>

<table class="compare-table">
<tr><th>Decorator</th><th>Lifecycle</th><th>Quét gì</th></tr>
<tr><td><code>@ViewChild</code></td><td><code>ngAfterViewInit</code></td><td>Phần tử trong template của chính component</td></tr>
<tr><td><code>@ContentChild</code></td><td><code>ngAfterContentInit</code></td><td>Phần tử mà cha đã chiếu vào qua ng-content</td></tr>
</table>

<div class="example-label">Ví dụ — input bắt buộc chiếu</div>
<pre><code>@Component({
  selector: <span class="c-string">'app-form-field'</span>,
  template: \`
    &lt;div class="form-field"&gt;
      &lt;label&gt;{{ label }}&lt;/label&gt;
      &lt;ng-content select="input,select,textarea"&gt;&lt;/ng-content&gt;
      @if (showError) { &lt;p class="err"&gt;{{ errorMsg }}&lt;/p&gt; }
    &lt;/div&gt;
  \`
})
<span class="c-keyword">export class</span> FormFieldComponent <span class="c-keyword">implements</span> AfterContentInit {
  @Input() label = <span class="c-string">''</span>;
  @ContentChild(NgControl) control?: NgControl;
  showError = <span class="c-keyword">false</span>;
  errorMsg = <span class="c-string">''</span>;

  ngAfterContentInit() {
    <span class="c-keyword">this</span>.control?.statusChanges?.subscribe(s =&gt; {
      <span class="c-keyword">this</span>.showError = s === <span class="c-string">'INVALID'</span> && (<span class="c-keyword">this</span>.control?.touched ?? <span class="c-keyword">false</span>);
    });
  }
}</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>ContentChild = phần tử cha chiếu vào, ViewChild = template của chính component.</li>
    <li>Available từ <code>ngAfterContentInit</code>.</li>
    <li>Pattern phổ biến: container component "tự thích nghi" theo input từ cha.</li>
  </ul>
</div>`
    },
    {
      id: "04-03", n: "03",
      title: "@ContentChildren và AfterContentInit",
      html: `
<p>Khi container có <strong>nhiều</strong> child cùng loại được chiếu vào (vd: nhiều <code>&lt;app-tab&gt;</code> trong <code>&lt;app-tabs&gt;</code>), dùng <code>@ContentChildren</code>.</p>

<div class="example-label">Ví dụ — Accordion với nhiều Panel</div>
<pre><code><span class="c-comment">// panel.component.ts</span>
@Component({
  selector: <span class="c-string">'app-panel'</span>,
  template: \`
    &lt;div class="panel"&gt;
      &lt;header (click)="toggle()"&gt;{{ title }}&lt;/header&gt;
      @if (open) { &lt;div class="body"&gt;&lt;ng-content/&gt;&lt;/div&gt; }
    &lt;/div&gt;
  \`
})
<span class="c-keyword">export class</span> PanelComponent {
  @Input() title = <span class="c-string">''</span>;
  open = <span class="c-keyword">false</span>;
  toggle() { <span class="c-keyword">this</span>.open = !<span class="c-keyword">this</span>.open; }
  show() { <span class="c-keyword">this</span>.open = <span class="c-keyword">true</span>; }
  hide() { <span class="c-keyword">this</span>.open = <span class="c-keyword">false</span>; }
}</code></pre>

<pre><code><span class="c-comment">// accordion.component.ts</span>
@Component({
  selector: <span class="c-string">'app-accordion'</span>,
  template: \`&lt;ng-content/&gt;\`
})
<span class="c-keyword">export class</span> AccordionComponent <span class="c-keyword">implements</span> AfterContentInit {
  @ContentChildren(PanelComponent) panels!: QueryList&lt;PanelComponent&gt;;
  @Input() multiOpen = <span class="c-keyword">false</span>;

  ngAfterContentInit() {
    <span class="c-comment">// Mở panel đầu tiên</span>
    <span class="c-keyword">this</span>.panels.first?.show();

    <span class="c-comment">// Trừ khi multiOpen, chỉ một panel mở tại một thời điểm</span>
    <span class="c-keyword">if</span> (!<span class="c-keyword">this</span>.multiOpen) {
      <span class="c-keyword">this</span>.panels.forEach(panel =&gt; {
        <span class="c-keyword">const</span> originalToggle = panel.toggle.bind(panel);
        panel.toggle = () =&gt; {
          <span class="c-keyword">this</span>.panels.forEach(p =&gt; p !== panel && p.hide());
          originalToggle();
        };
      });
    }

    <span class="c-comment">// Khi danh sách panel đổi (vd cha thêm bớt qua @for), đăng ký lại</span>
    <span class="c-keyword">this</span>.panels.changes.subscribe(() =&gt; <span class="c-keyword">this</span>.refreshIndices());
  }

  refreshIndices() {  <span class="c-comment">/* ... */</span>  }
}</code></pre>

<pre><code>&lt;<span class="c-tag">app-accordion</span>&gt;
  &lt;<span class="c-tag">app-panel</span> <span class="c-attr">title</span>=<span class="c-string">"Câu hỏi 1"</span>&gt;Trả lời 1&lt;/<span class="c-tag">app-panel</span>&gt;
  &lt;<span class="c-tag">app-panel</span> <span class="c-attr">title</span>=<span class="c-string">"Câu hỏi 2"</span>&gt;Trả lời 2&lt;/<span class="c-tag">app-panel</span>&gt;
  &lt;<span class="c-tag">app-panel</span> <span class="c-attr">title</span>=<span class="c-string">"Câu hỏi 3"</span>&gt;Trả lời 3&lt;/<span class="c-tag">app-panel</span>&gt;
&lt;/<span class="c-tag">app-accordion</span>&gt;</code></pre>

<div class="warn"><strong>Đừng nhầm:</strong> <code>AfterViewInit</code> (cho ViewChild) và <code>AfterContentInit</code> (cho ContentChild) là 2 hook khác nhau. Truy cập sai hook → undefined.</div>

<h3>Pattern đặc biệt: query content từ con cháu</h3>
<p>Mặc định, <code>@ContentChildren</code> chỉ tìm <em>direct children</em>. Để tìm sâu hơn:</p>
<pre><code>@ContentChildren(PanelComponent, { descendants: <span class="c-keyword">true</span> })
panels!: QueryList&lt;PanelComponent&gt;;</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>ContentChildren cho nhiều phần tử; QueryList có <code>.changes</code>, <code>.first</code>, <code>.toArray()</code>.</li>
    <li>Lifecycle: <code>ngAfterContentInit</code>.</li>
    <li><code>{ descendants: true }</code> nếu cần tìm cháu chắt.</li>
  </ul>
</div>`
    }
  ]
},

/* =================== SECTION 05 =================== */
{
  id: "s05", n: "05", title: "Templates In Depth",
  lessons: [
    {
      id: "05-01", n: "01",
      title: "ng-template — template chưa render",
      html: `
<p><code>&lt;ng-template&gt;</code> đại diện <strong>một đoạn template chưa được render</strong>. Bạn có thể "giữ" nó như khuôn, sau đó render lúc nào tuỳ ý — bao nhiêu lần tuỳ ý.</p>

<div class="example-label">Ví dụ — template như khuôn</div>
<pre><code>&lt;<span class="c-tag">ng-template</span> #<span class="c-attr">empty</span>&gt;
  &lt;<span class="c-tag">p</span> <span class="c-attr">class</span>=<span class="c-string">"empty-state"</span>&gt;
    Không có dữ liệu để hiển thị.
  &lt;/<span class="c-tag">p</span>&gt;
&lt;/<span class="c-tag">ng-template</span>&gt;</code></pre>

<p>Bản thân <code>&lt;ng-template&gt;</code> KHÔNG render gì cả. Nó chỉ in DOM khi có lệnh thực thi:</p>
<ul>
  <li>Một structural directive (vd <code>*ngIf else</code>).</li>
  <li><code>ngTemplateOutlet</code>.</li>
  <li>Tự gọi <code>viewContainer.createEmbeddedView(tplRef)</code>.</li>
</ul>

<h3>Use case 1: else branch của *ngIf</h3>
<pre><code>&lt;<span class="c-tag">div</span> *<span class="c-attr">ngIf</span>=<span class="c-string">"items.length; else empty"</span>&gt;
  ... danh sách ...
&lt;/<span class="c-tag">div</span>&gt;
&lt;<span class="c-tag">ng-template</span> #<span class="c-attr">empty</span>&gt;
  &lt;<span class="c-tag">p</span>&gt;Trống&lt;/<span class="c-tag">p</span>&gt;
&lt;/<span class="c-tag">ng-template</span>&gt;</code></pre>

<h3>Use case 2: Template tham số (context)</h3>
<pre><code>&lt;<span class="c-tag">ng-template</span> #<span class="c-attr">row</span> <span class="c-attr">let-name</span>=<span class="c-string">"name"</span> <span class="c-attr">let-i</span>=<span class="c-string">"index"</span>&gt;
  &lt;<span class="c-tag">tr</span>&gt;
    &lt;<span class="c-tag">td</span>&gt;{{ i }}&lt;/<span class="c-tag">td</span>&gt;
    &lt;<span class="c-tag">td</span>&gt;{{ name }}&lt;/<span class="c-tag">td</span>&gt;
  &lt;/<span class="c-tag">tr</span>&gt;
&lt;/<span class="c-tag">ng-template</span>&gt;</code></pre>

<p><code>let-x</code> khai báo biến cục bộ — sẽ nhận giá trị từ context object khi instantiate.</p>

<h3>Dưới mui xe</h3>
<p>Cú pháp <code>*ngIf="cond"</code> chỉ là syntactic sugar. Compiler dịch nó thành:</p>
<pre><code>&lt;<span class="c-tag">ng-template</span> [<span class="c-attr">ngIf</span>]=<span class="c-string">"cond"</span>&gt;
  ... nội dung ...
&lt;/<span class="c-tag">ng-template</span>&gt;</code></pre>

<p>Đó là lý do <code>*ngIf</code> và <code>*ngFor</code> không thể đặt cùng một phần tử — chỉ có một template gốc, và mỗi structural directive đều tạo ra <code>ng-template</code> riêng.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>&lt;ng-template&gt;</code> là khuôn, không tự render — phải có ai đó instantiate.</li>
    <li><code>let-x</code> khai báo biến nhận giá trị từ context khi render.</li>
    <li>Mọi structural directive (<code>*ngIf, *ngFor, *ngSwitch</code>) đều dịch ra <code>ng-template</code>.</li>
  </ul>
</div>`
    },
    {
      id: "05-02", n: "02",
      title: "ngTemplateOutlet — instantiate template với context",
      html: `
<p><code>ngTemplateOutlet</code> là directive cho phép bạn "render" một template ở vị trí muốn — và truyền dữ liệu vào qua context.</p>

<div class="example-label">Ví dụ 1 — render template nhiều lần</div>
<pre><code>&lt;<span class="c-tag">ng-template</span> #<span class="c-attr">greeting</span> <span class="c-attr">let-name</span>=<span class="c-string">"name"</span>&gt;
  &lt;<span class="c-tag">p</span>&gt;Xin chào {{ name }}!&lt;/<span class="c-tag">p</span>&gt;
&lt;/<span class="c-tag">ng-template</span>&gt;

&lt;ng-container *<span class="c-attr">ngTemplateOutlet</span>=<span class="c-string">"greeting; context: { name: 'Hieu' }"</span>&gt;&lt;/ng-container&gt;
&lt;ng-container *<span class="c-attr">ngTemplateOutlet</span>=<span class="c-string">"greeting; context: { name: 'Lan' }"</span>&gt;&lt;/ng-container&gt;
&lt;ng-container *<span class="c-attr">ngTemplateOutlet</span>=<span class="c-string">"greeting; context: { name: 'Minh' }"</span>&gt;&lt;/ng-container&gt;</code></pre>

<p>Render ra:</p>
<pre><code>&lt;p&gt;Xin chào Hieu!&lt;/p&gt;
&lt;p&gt;Xin chào Lan!&lt;/p&gt;
&lt;p&gt;Xin chào Minh!&lt;/p&gt;</code></pre>

<h3>Cú pháp let-x: variable mapping</h3>
<p>Trong template:</p>
<pre><code>&lt;<span class="c-tag">ng-template</span> #<span class="c-attr">myTpl</span> <span class="c-attr">let-username</span>=<span class="c-string">"name"</span> <span class="c-attr">let-userAge</span>=<span class="c-string">"age"</span>&gt;
  Hi {{ username }}, {{ userAge }} tuổi.
&lt;/<span class="c-tag">ng-template</span>&gt;</code></pre>

<p>Khi instantiate:</p>
<pre><code>&lt;ng-container *<span class="c-attr">ngTemplateOutlet</span>=<span class="c-string">"myTpl; context: { name: 'Hieu', age: 30 }"</span>&gt;&lt;/ng-container&gt;</code></pre>

<p><code>let-username="name"</code> nói: "tạo biến <code>username</code> trong template, gán bằng property <code>name</code> của context object".</p>

<h3>$implicit — biến mặc định</h3>
<p>Nếu chỉ truyền 1 giá trị, dùng <code>$implicit</code>:</p>

<pre><code>&lt;<span class="c-tag">ng-template</span> #<span class="c-attr">item</span> <span class="c-attr">let-data</span>&gt;       <span class="c-comment">&lt;!-- không có "=..." → nhận $implicit --&gt;</span>
  &lt;<span class="c-tag">p</span>&gt;{{ data.name }}&lt;/<span class="c-tag">p</span>&gt;
&lt;/<span class="c-tag">ng-template</span>&gt;

&lt;ng-container *<span class="c-attr">ngTemplateOutlet</span>=<span class="c-string">"item; context: { \$implicit: course }"</span>&gt;&lt;/ng-container&gt;</code></pre>

<h3>Điểm quan trọng: scope của biểu thức</h3>
<p>Biểu thức trong <code>context: {...}</code> được đánh giá theo <strong>component chứa <code>ngTemplateOutlet</code></strong>, KHÔNG phải component định nghĩa <code>ng-template</code>.</p>

<div class="callout"><strong>Vì sao quan trọng?</strong> Khi component A định nghĩa template, component B nhận template đó qua <code>@Input</code> rồi instantiate — <code>course.description</code> trong context sẽ là biến của B, không phải A.</div>

<div class="example-label">Ví dụ thực tế — generic list</div>
<pre><code>@Component({
  selector: <span class="c-string">'app-list'</span>,
  template: \`
    @for (item of items; track item.id) {
      &lt;ng-container *ngTemplateOutlet="rowTpl; context: { \$implicit: item, index: \$index }"&gt;&lt;/ng-container&gt;
    }
  \`
})
<span class="c-keyword">export class</span> ListComponent&lt;T&gt; {
  @Input() items: T[] = [];
  @Input() rowTpl!: TemplateRef&lt;{ \$implicit: T; index: number }&gt;;
}</code></pre>

<pre><code><span class="c-comment">&lt;!-- cha sử dụng --&gt;</span>
&lt;<span class="c-tag">app-list</span> [<span class="c-attr">items</span>]=<span class="c-string">"users"</span> [<span class="c-attr">rowTpl</span>]=<span class="c-string">"userRow"</span>&gt;&lt;/<span class="c-tag">app-list</span>&gt;

&lt;<span class="c-tag">ng-template</span> #<span class="c-attr">userRow</span> <span class="c-attr">let-u</span> <span class="c-attr">let-i</span>=<span class="c-string">"index"</span>&gt;
  &lt;<span class="c-tag">div</span>&gt;{{ i + 1 }}. {{ u.name }} — {{ u.email }}&lt;/<span class="c-tag">div</span>&gt;
&lt;/<span class="c-tag">ng-template</span>&gt;</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>*ngTemplateOutlet</code> render <code>ng-template</code> + truyền context.</li>
    <li><code>let-x="key"</code> bind biến cục bộ; <code>let-x</code> không key → nhận <code>$implicit</code>.</li>
    <li>Biểu thức trong <code>context</code> đánh giá theo component chứa outlet, không phải component định nghĩa template.</li>
    <li>Dùng <code>&lt;ng-container&gt;</code> để tránh thêm DOM thừa.</li>
  </ul>
</div>`
    },
    {
      id: "05-03", n: "03",
      title: "Template như Input của Component",
      html: `
<p>Pattern này tạo nên các component <strong>cực kỳ linh hoạt</strong>: component nhận template từ ngoài qua <code>@Input</code>, để consumer quyết định cách render. Material Table, CDK Virtual Scroll, nhiều UI lib lớn dùng pattern này.</p>

<div class="example-label">Ví dụ 1 — Generic List Component</div>
<pre><code>@Component({
  selector: <span class="c-string">'app-list'</span>,
  template: \`
    @if (items.length === 0 && emptyTpl) {
      &lt;ng-container *ngTemplateOutlet="emptyTpl"&gt;&lt;/ng-container&gt;
    }
    @for (item of items; track trackFn(\$index, item)) {
      &lt;ng-container *ngTemplateOutlet="rowTpl; context: { \$implicit: item, index: \$index }"&gt;&lt;/ng-container&gt;
    }
  \`
})
<span class="c-keyword">export class</span> ListComponent&lt;T&gt; {
  @Input() items: T[] = [];
  @Input({ required: <span class="c-keyword">true</span> }) rowTpl!: TemplateRef&lt;{ \$implicit: T; index: number }&gt;;
  @Input() emptyTpl?: TemplateRef&lt;unknown&gt;;
  @Input() trackFn: (i: number, item: T) =&gt; unknown = (i, item: any) =&gt; item.id ?? i;
}</code></pre>

<div class="example-label">Cha sử dụng</div>
<pre><code>&lt;<span class="c-tag">app-list</span> [<span class="c-attr">items</span>]=<span class="c-string">"users"</span> [<span class="c-attr">rowTpl</span>]=<span class="c-string">"userRow"</span> [<span class="c-attr">emptyTpl</span>]=<span class="c-string">"noUsers"</span>&gt;&lt;/<span class="c-tag">app-list</span>&gt;

&lt;<span class="c-tag">ng-template</span> #<span class="c-attr">userRow</span> <span class="c-attr">let-user</span> <span class="c-attr">let-i</span>=<span class="c-string">"index"</span>&gt;
  &lt;<span class="c-tag">div</span> <span class="c-attr">class</span>=<span class="c-string">"user-row"</span>&gt;
    &lt;<span class="c-tag">img</span> [<span class="c-attr">src</span>]=<span class="c-string">"user.avatar"</span>&gt;
    &lt;<span class="c-tag">span</span>&gt;{{ i + 1 }}. {{ user.name }}&lt;/<span class="c-tag">span</span>&gt;
    &lt;<span class="c-tag">span</span>&gt;{{ user.email }}&lt;/<span class="c-tag">span</span>&gt;
  &lt;/<span class="c-tag">div</span>&gt;
&lt;/<span class="c-tag">ng-template</span>&gt;

&lt;<span class="c-tag">ng-template</span> #<span class="c-attr">noUsers</span>&gt;
  &lt;<span class="c-tag">p</span> <span class="c-attr">class</span>=<span class="c-string">"empty"</span>&gt;Chưa có người dùng nào.&lt;/<span class="c-tag">p</span>&gt;
&lt;/<span class="c-tag">ng-template</span>&gt;</code></pre>

<div class="example-label">Ví dụ 2 — Tooltip có nội dung tuỳ biến</div>
<pre><code>@Component({
  selector: <span class="c-string">'app-tooltip'</span>,
  template: \`
    &lt;div class="trigger" (mouseenter)="show=true" (mouseleave)="show=false"&gt;
      &lt;ng-content/&gt;
    &lt;/div&gt;
    @if (show) {
      &lt;div class="tooltip-content"&gt;
        @if (contentTpl) {
          &lt;ng-container *ngTemplateOutlet="contentTpl; context: { \$implicit: data }"&gt;&lt;/ng-container&gt;
        } @else {
          {{ text }}
        }
      &lt;/div&gt;
    }
  \`
})
<span class="c-keyword">export class</span> TooltipComponent {
  @Input() text = <span class="c-string">''</span>;
  @Input() contentTpl?: TemplateRef&lt;unknown&gt;;
  @Input() data: unknown;
  show = <span class="c-keyword">false</span>;
}</code></pre>

<pre><code>&lt;<span class="c-tag">app-tooltip</span> [<span class="c-attr">contentTpl</span>]=<span class="c-string">"richTooltip"</span> [<span class="c-attr">data</span>]=<span class="c-string">"user"</span>&gt;
  &lt;<span class="c-tag">button</span>&gt;Hover tôi&lt;/<span class="c-tag">button</span>&gt;
&lt;/<span class="c-tag">app-tooltip</span>&gt;

&lt;<span class="c-tag">ng-template</span> #<span class="c-attr">richTooltip</span> <span class="c-attr">let-u</span>&gt;
  &lt;<span class="c-tag">div</span>&gt;
    &lt;<span class="c-tag">strong</span>&gt;{{ u.name }}&lt;/<span class="c-tag">strong</span>&gt;
    &lt;<span class="c-tag">br</span>&gt;
    &lt;<span class="c-tag">small</span>&gt;{{ u.role }}&lt;/<span class="c-tag">small</span>&gt;
  &lt;/<span class="c-tag">div</span>&gt;
&lt;/<span class="c-tag">ng-template</span>&gt;</code></pre>

<h3>Khi nào dùng pattern này?</h3>
<ul>
  <li>Component "container" muốn để consumer tự do render nội dung — vd Table, List, Dropdown.</li>
  <li>Cần loop một template ở nhiều chỗ với data khác nhau.</li>
  <li>Muốn API "slot" không gò bó như <code>ng-content</code>.</li>
</ul>

<div class="callout"><strong>Pattern này chuyên nghiệp hoá component.</strong> Material Table dùng <code>matCellDef</code>, <code>matRowDef</code> để consumer định nghĩa cell/row template. Đây là cách viết component bậc cao trong hệ sinh thái Angular.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Template có thể là Input — consumer quyết định nội dung render.</li>
    <li>Pattern này là nền tảng của các thư viện UI mạnh.</li>
    <li>Phải khai báo type chuẩn: <code>TemplateRef&lt;{ $implicit: T; ... }&gt;</code> để IntelliSense hoạt động.</li>
  </ul>
</div>`
    }
  ]
},

/* =================== SECTION 06 =================== */
{
  id: "s06", n: "06", title: "Directives In Depth",
  lessons: [
    {
      id: "06-01", n: "01",
      title: "Attribute Directive — giới thiệu",
      html: `
<p>Có 3 loại directive trong Angular:</p>
<table class="compare-table">
<tr><th>Loại</th><th>Đặc điểm</th><th>Ví dụ</th></tr>
<tr><td>Component</td><td>Có template riêng (sub-class của Directive)</td><td>Mọi component bạn viết</td></tr>
<tr><td>Attribute Directive</td><td>Đổi giao diện/hành vi của một thẻ có sẵn</td><td><code>ngClass, ngStyle, ngModel</code></td></tr>
<tr><td>Structural Directive</td><td>Thêm/bớt phần tử khỏi DOM</td><td><code>*ngIf, *ngFor, *ngSwitch</code></td></tr>
</table>

<div class="example-label">Ví dụ 1 — Highlight directive đơn giản</div>
<pre><code>@Directive({
  selector: <span class="c-string">'[appHighlight]'</span>,
  standalone: <span class="c-keyword">true</span>
})
<span class="c-keyword">export class</span> HighlightDirective {
  <span class="c-keyword">constructor</span>(<span class="c-keyword">private</span> el: ElementRef) {
    el.nativeElement.style.backgroundColor = <span class="c-string">'yellow'</span>;
  }
}</code></pre>

<pre><code><span class="c-comment">&lt;!-- sử dụng --&gt;</span>
&lt;<span class="c-tag">p</span> <span class="c-attr">appHighlight</span>&gt;Đoạn này nền vàng&lt;/<span class="c-tag">p</span>&gt;</code></pre>

<h3>Selector của directive</h3>
<table class="compare-table">
<tr><th>Selector</th><th>Match phần tử</th></tr>
<tr><td><code>[appHighlight]</code></td><td>Có attribute <code>appHighlight</code></td></tr>
<tr><td><code>app-button[primary]</code></td><td>Thẻ <code>app-button</code> có attribute <code>primary</code></td></tr>
<tr><td><code>.btn</code></td><td>Có class <code>btn</code> (hiếm dùng)</td></tr>
<tr><td><code>app-card</code></td><td>Component có thẻ <code>app-card</code> (dùng cho component)</td></tr>
</table>

<div class="example-label">Ví dụ 2 — directive với input</div>
<pre><code>@Directive({
  selector: <span class="c-string">'[appHighlight]'</span>,
  standalone: <span class="c-keyword">true</span>
})
<span class="c-keyword">export class</span> HighlightDirective <span class="c-keyword">implements</span> OnInit {
  @Input() appHighlight = <span class="c-string">'yellow'</span>;   <span class="c-comment">// trùng tên selector</span>

  <span class="c-keyword">constructor</span>(<span class="c-keyword">private</span> el: ElementRef) {}

  ngOnInit() {
    <span class="c-keyword">this</span>.el.nativeElement.style.backgroundColor = <span class="c-keyword">this</span>.appHighlight;
  }
}</code></pre>

<pre><code>&lt;<span class="c-tag">p</span> <span class="c-attr">appHighlight</span>=<span class="c-string">"#fef9c3"</span>&gt;Vàng nhạt&lt;/<span class="c-tag">p</span>&gt;
&lt;<span class="c-tag">p</span> [<span class="c-attr">appHighlight</span>]=<span class="c-string">"theme === 'dark' ? '#1a1a1a' : '#fef9c3'"</span>&gt;Theo theme&lt;/<span class="c-tag">p</span>&gt;</code></pre>

<div class="callout"><strong>Quy ước đặt tên:</strong> selector luôn có prefix (<code>app-</code> hoặc tên tổ chức) để tránh đụng độ. Tên input nên trùng selector để cú pháp <code>appHighlight="..."</code> tự nhiên.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>3 loại: Component, Attribute, Structural — đều là Directive ở mức trừu tượng.</li>
    <li>Selector dạng <code>[name]</code> match attribute; có thể kết hợp với tag/class.</li>
    <li>Input cùng tên selector → cú pháp ngắn <code>name="value"</code> hoặc <code>[name]="expr"</code>.</li>
  </ul>
</div>`
    },
    {
      id: "06-02", n: "02",
      title: "@HostBinding — Property vs Attribute",
      html: `
<p>Một điểm tinh tế nhưng quan trọng: <strong>HTML attribute</strong> và <strong>DOM property</strong> không giống nhau. Hiểu nhầm sẽ dẫn đến bug khó debug.</p>

<table class="compare-table">
<tr><th></th><th>HTML attribute</th><th>DOM property</th></tr>
<tr><td>Có ở đâu</td><td>Trong markup HTML</td><td>Trên đối tượng DOM (sau parse)</td></tr>
<tr><td>Đọc bằng</td><td><code>el.getAttribute('x')</code></td><td><code>el.x</code></td></tr>
<tr><td>Đổi tự động?</td><td>Một số có (vd <code>id</code>, <code>class</code>); nhiều không</td><td>Luôn có hiệu lực ngay</td></tr>
<tr><td>Ví dụ khác biệt</td><td><code>&lt;input value="abc"&gt;</code> giữ "abc" mãi</td><td><code>input.value</code> đổi theo user gõ</td></tr>
</table>

<h3>HostBinding mặc định bind PROPERTY</h3>
<pre><code>@Directive({ selector: <span class="c-string">'[appSelectable]'</span>, standalone: <span class="c-keyword">true</span> })
<span class="c-keyword">export class</span> SelectableDirective {
  @Input() selected = <span class="c-keyword">false</span>;

  <span class="c-comment">// bind class — đây là property "className"</span>
  @HostBinding(<span class="c-string">'class.is-selected'</span>) <span class="c-keyword">get</span> css() { <span class="c-keyword">return this</span>.selected; }

  <span class="c-comment">// bind style — đây là property "style.opacity"</span>
  @HostBinding(<span class="c-string">'style.opacity'</span>) <span class="c-keyword">get</span> opacity() {
    <span class="c-keyword">return this</span>.selected ? 1 : 0.5;
  }
}</code></pre>

<h3>Bind ATTRIBUTE — dùng tiền tố attr.</h3>
<pre><code>@HostBinding(<span class="c-string">'attr.aria-selected'</span>) <span class="c-keyword">get</span> aria() {
  <span class="c-keyword">return this</span>.selected;
}

@HostBinding(<span class="c-string">'attr.role'</span>) role = <span class="c-string">'button'</span>;
@HostBinding(<span class="c-string">'attr.tabindex'</span>) tabindex = <span class="c-string">'0'</span>;</code></pre>

<div class="warn"><strong>Khi nào cần attr.?</strong> Khi viết HTML cho ARIA / accessibility. <code>aria-*</code> không có DOM property tương ứng, phải bind qua attribute.</div>

<h3>Quan trọng: phải dùng getter, không phải method</h3>
<pre><code><span class="c-comment">// ❌ SAI — method không trigger CD đúng</span>
@HostBinding(<span class="c-string">'class.active'</span>) isActive() { <span class="c-keyword">return this</span>.selected; }

<span class="c-comment">// ✓ ĐÚNG — getter</span>
@HostBinding(<span class="c-string">'class.active'</span>) <span class="c-keyword">get</span> isActive() { <span class="c-keyword">return this</span>.selected; }

<span class="c-comment">// ✓ ĐÚNG — property thường</span>
@HostBinding(<span class="c-string">'class.active'</span>) isActive = <span class="c-keyword">false</span>;</code></pre>

<div class="example-label">Ví dụ thực tế — Button directive</div>
<pre><code>@Directive({ selector: <span class="c-string">'[appButton]'</span>, standalone: <span class="c-keyword">true</span> })
<span class="c-keyword">export class</span> ButtonDirective {
  @Input() variant: <span class="c-string">'primary'</span> | <span class="c-string">'secondary'</span> | <span class="c-string">'danger'</span> = <span class="c-string">'primary'</span>;
  @Input() disabled = <span class="c-keyword">false</span>;

  @HostBinding(<span class="c-string">'class'</span>) <span class="c-keyword">get</span> css() {
    <span class="c-keyword">return</span> [\`btn\`, \`btn-\${<span class="c-keyword">this</span>.variant}\`].join(<span class="c-string">' '</span>);
  }
  @HostBinding(<span class="c-string">'attr.disabled'</span>) <span class="c-keyword">get</span> disabledAttr() {
    <span class="c-keyword">return this</span>.disabled ? <span class="c-string">''</span> : <span class="c-keyword">null</span>;   <span class="c-comment">// null sẽ remove attribute</span>
  }
  @HostBinding(<span class="c-string">'attr.aria-disabled'</span>) <span class="c-keyword">get</span> aria() {
    <span class="c-keyword">return this</span>.disabled;
  }
}</code></pre>

<pre><code>&lt;<span class="c-tag">button</span> <span class="c-attr">appButton</span> <span class="c-attr">variant</span>=<span class="c-string">"danger"</span> [<span class="c-attr">disabled</span>]=<span class="c-string">"loading"</span>&gt;Xoá&lt;/<span class="c-tag">button</span>&gt;</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>HostBinding mặc định bind <strong>property</strong>; tiền tố <code>attr.</code> để bind attribute.</li>
    <li>Phải dùng getter (hoặc property) — KHÔNG phải method thường.</li>
    <li>ARIA, role, tabindex phải dùng <code>attr.</code> vì không có property tương ứng.</li>
    <li>Set property bằng <code>null</code> sẽ xoá attribute (hữu ích cho disabled).</li>
  </ul>
</div>`
    },
    {
      id: "06-03", n: "03",
      title: "@HostListener — lắng nghe event trên host",
      html: `
<p>Cùng cặp với <code>@HostBinding</code>, <code>@HostListener</code> cho directive lắng nghe sự kiện trên host element — không cần truy cập DOM trực tiếp.</p>

<div class="example-label">Ví dụ 1 — Hover directive</div>
<pre><code>@Directive({ selector: <span class="c-string">'[appHover]'</span>, standalone: <span class="c-keyword">true</span> })
<span class="c-keyword">export class</span> HoverDirective {
  @HostBinding(<span class="c-string">'class.hovered'</span>) hovered = <span class="c-keyword">false</span>;

  @HostListener(<span class="c-string">'mouseenter'</span>) onEnter() { <span class="c-keyword">this</span>.hovered = <span class="c-keyword">true</span>; }
  @HostListener(<span class="c-string">'mouseleave'</span>) onLeave() { <span class="c-keyword">this</span>.hovered = <span class="c-keyword">false</span>; }
}</code></pre>

<div class="example-label">Ví dụ 2 — nhận tham số $event</div>
<pre><code>@HostListener(<span class="c-string">'click'</span>, [<span class="c-string">'\$event'</span>])
onClick(e: MouseEvent) {
  console.log(<span class="c-string">'Click tại'</span>, e.clientX, e.clientY);
  e.preventDefault();
}</code></pre>

<p>Tham số thứ 2 là mảng <strong>chuỗi tên tham số</strong> sẽ truyền vào method. <code>'$event'</code> là biến đặc biệt = đối tượng event.</p>

<div class="example-label">Ví dụ 3 — bắt key tổ hợp</div>
<pre><code>@HostListener(<span class="c-string">'keydown.enter'</span>, [<span class="c-string">'\$event'</span>]) onEnter(e: KeyboardEvent) {
  e.preventDefault();
  <span class="c-keyword">this</span>.submit();
}

@HostListener(<span class="c-string">'keydown.escape'</span>) onEscape() { <span class="c-keyword">this</span>.cancel(); }
@HostListener(<span class="c-string">'keydown.control.s'</span>, [<span class="c-string">'\$event'</span>]) onSave(e: KeyboardEvent) {
  e.preventDefault();
  <span class="c-keyword">this</span>.save();
}</code></pre>

<div class="example-label">Ví dụ 4 — lắng nghe event trên window/document</div>
<pre><code>@HostListener(<span class="c-string">'document:click'</span>, [<span class="c-string">'\$event.target'</span>])
onDocClick(target: HTMLElement) {
  <span class="c-keyword">if</span> (!<span class="c-keyword">this</span>.host.nativeElement.contains(target)) {
    <span class="c-keyword">this</span>.close();   <span class="c-comment">// click ngoài → đóng dropdown</span>
  }
}

@HostListener(<span class="c-string">'window:resize'</span>) onResize() {
  <span class="c-keyword">this</span>.recalcLayout();
}</code></pre>

<h3>Hiệu năng — cảnh báo quan trọng</h3>

<div class="warn"><strong>Tránh gắn HostListener cho event tần suất cao</strong> như <code>scroll</code>, <code>mousemove</code>, <code>resize</code>. Mỗi event sẽ trigger Angular CD trên toàn cây — gây lag rõ rệt.</div>

<p>Cách xử lý: chạy listener <em>ngoài</em> Zone, throttle/debounce, chỉ trigger CD khi cần:</p>

<pre><code>@Directive({ selector: <span class="c-string">'[appScrollSpy]'</span>, standalone: <span class="c-keyword">true</span> })
<span class="c-keyword">export class</span> ScrollSpyDirective <span class="c-keyword">implements</span> OnInit, OnDestroy {
  <span class="c-keyword">private</span> zone = inject(NgZone);
  <span class="c-keyword">private</span> el = inject(ElementRef);
  <span class="c-keyword">private</span> handler!: (e: Event) =&gt; void;

  ngOnInit() {
    <span class="c-keyword">this</span>.zone.runOutsideAngular(() =&gt; {
      <span class="c-keyword">this</span>.handler = throttle((e: Event) =&gt; {
        <span class="c-comment">// xử lý nặng</span>
        <span class="c-keyword">if</span> (shouldUpdateUI) {
          <span class="c-keyword">this</span>.zone.run(() =&gt; <span class="c-keyword">this</span>.activeIndex = newIndex);
        }
      }, 100);
      window.addEventListener(<span class="c-string">'scroll'</span>, <span class="c-keyword">this</span>.handler);
    });
  }

  ngOnDestroy() {
    window.removeEventListener(<span class="c-string">'scroll'</span>, <span class="c-keyword">this</span>.handler);
  }
}</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Cú pháp: <code>@HostListener('event', ['$event'])</code>.</li>
    <li>Hỗ trợ key combinations: <code>keydown.control.s</code>.</li>
    <li>Có thể nghe trên window/document: <code>'window:resize'</code>, <code>'document:click'</code>.</li>
    <li>Tránh event tần suất cao — dùng <code>NgZone.runOutsideAngular</code> + throttle.</li>
  </ul>
</div>`
    },
    {
      id: "06-04", n: "04",
      title: "exportAs — dùng directive như tham chiếu",
      html: `
<p><code>exportAs</code> cho phép template gán directive instance vào biến tham chiếu cục bộ — sau đó truy cập như object thuần.</p>

<div class="example-label">Ví dụ 1 — Counter directive</div>
<pre><code>@Directive({
  selector: <span class="c-string">'[appCounter]'</span>,
  standalone: <span class="c-keyword">true</span>,
  exportAs: <span class="c-string">'counter'</span>
})
<span class="c-keyword">export class</span> CounterDirective {
  count = 0;
  inc() { <span class="c-keyword">this</span>.count++; }
  dec() { <span class="c-keyword">this</span>.count--; }
  reset() { <span class="c-keyword">this</span>.count = 0; }
}</code></pre>

<pre><code>&lt;<span class="c-tag">div</span> <span class="c-attr">appCounter</span> #<span class="c-attr">c</span>=<span class="c-string">"counter"</span>&gt;
  &lt;<span class="c-tag">button</span> (click)=<span class="c-string">"c.inc()"</span>&gt;+&lt;/<span class="c-tag">button</span>&gt;
  &lt;<span class="c-tag">button</span> (click)=<span class="c-string">"c.dec()"</span>&gt;-&lt;/<span class="c-tag">button</span>&gt;
  &lt;<span class="c-tag">span</span>&gt;Bạn đã bấm: {{ c.count }} lần&lt;/<span class="c-tag">span</span>&gt;
  &lt;<span class="c-tag">button</span> (click)=<span class="c-string">"c.reset()"</span>&gt;Reset&lt;/<span class="c-tag">button</span>&gt;
&lt;/<span class="c-tag">div</span>&gt;</code></pre>

<h3>Đây cũng là cơ chế của ngForm/ngModel</h3>
<pre><code>&lt;<span class="c-tag">form</span> #<span class="c-attr">f</span>=<span class="c-string">"ngForm"</span>&gt;                   <span class="c-comment">&lt;!-- gán FormGroup directive --&gt;</span>
  &lt;<span class="c-tag">input</span> #<span class="c-attr">name</span>=<span class="c-string">"ngModel"</span> <span class="c-attr">ngModel</span>&gt;     <span class="c-comment">&lt;!-- gán NgModel directive --&gt;</span>
  &lt;<span class="c-tag">p</span> *<span class="c-attr">ngIf</span>=<span class="c-string">"name.invalid"</span>&gt;Lỗi&lt;/<span class="c-tag">p</span>&gt;
  &lt;<span class="c-tag">button</span> [<span class="c-attr">disabled</span>]=<span class="c-string">"!f.valid"</span>&gt;Submit&lt;/<span class="c-tag">button</span>&gt;
&lt;/<span class="c-tag">form</span>&gt;</code></pre>

<p>Trong source Angular: directive <code>NgForm</code> có <code>exportAs: 'ngForm'</code>; <code>NgModel</code> có <code>exportAs: 'ngModel'</code>.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>exportAs</code> + <code>#var="exportName"</code> = template lấy được directive instance.</li>
    <li>Pattern này là cách Angular Forms hoạt động (<code>#f="ngForm"</code>).</li>
    <li>Hữu ích khi muốn expose API directive cho template (counter, accordion control, etc.).</li>
  </ul>
</div>`
    },
    {
      id: "06-05", n: "05",
      title: "Structural Directive — hiểu cú pháp dấu *",
      html: `
<p>Cú pháp <code>*ngIf="cond"</code> trông đặc biệt vì có dấu <code>*</code>. Nhưng đó chỉ là <strong>syntactic sugar</strong> — Angular dịch nó ra cú pháp dài hơn với <code>ng-template</code>.</p>

<h3>Cú pháp dài tương đương</h3>
<pre><code><span class="c-comment">// Cú pháp ngắn</span>
&lt;<span class="c-tag">div</span> *<span class="c-attr">ngIf</span>=<span class="c-string">"cond"</span>&gt;...&lt;/<span class="c-tag">div</span>&gt;

<span class="c-comment">// Tương đương:</span>
&lt;<span class="c-tag">ng-template</span> [<span class="c-attr">ngIf</span>]=<span class="c-string">"cond"</span>&gt;
  &lt;<span class="c-tag">div</span>&gt;...&lt;/<span class="c-tag">div</span>&gt;
&lt;/<span class="c-tag">ng-template</span>&gt;</code></pre>

<p>Dấu <code>*</code> nói với compiler: "wrap nội dung này trong ng-template, rồi pass cho directive cùng tên".</p>

<h3>Cú pháp microsyntax phức tạp hơn</h3>
<p><code>*ngFor</code> phức tạp hơn vì có nhiều phần:</p>
<pre><code><span class="c-comment">// Cú pháp ngắn</span>
&lt;<span class="c-tag">li</span> *<span class="c-attr">ngFor</span>=<span class="c-string">"let item of items; let i = index; trackBy: trackById"</span>&gt;
  {{ item.name }}
&lt;/<span class="c-tag">li</span>&gt;

<span class="c-comment">// Compiler dịch thành:</span>
&lt;<span class="c-tag">ng-template</span>
  <span class="c-attr">ngFor</span>
  [<span class="c-attr">ngForOf</span>]=<span class="c-string">"items"</span>
  [<span class="c-attr">ngForTrackBy</span>]=<span class="c-string">"trackById"</span>
  <span class="c-attr">let-item</span>
  <span class="c-attr">let-i</span>=<span class="c-string">"index"</span>&gt;
  &lt;<span class="c-tag">li</span>&gt;{{ item.name }}&lt;/<span class="c-tag">li</span>&gt;
&lt;/<span class="c-tag">ng-template</span>&gt;</code></pre>

<h3>Vì sao chỉ được 1 structural directive trên cùng phần tử?</h3>
<p>Vì mỗi structural directive cần wrap phần tử trong <code>ng-template</code> riêng. Nếu có 2, không rõ ai wrap ai trước:</p>

<pre><code><span class="c-comment">// ❌ SAI — không biên dịch</span>
&lt;<span class="c-tag">li</span> *<span class="c-attr">ngFor</span>=<span class="c-string">"let u of users"</span> *<span class="c-attr">ngIf</span>=<span class="c-string">"u.active"</span>&gt;
  {{ u.name }}
&lt;/<span class="c-tag">li</span>&gt;

<span class="c-comment">// ✓ Đúng — tách bằng ng-container</span>
&lt;ng-container *<span class="c-attr">ngFor</span>=<span class="c-string">"let u of users"</span>&gt;
  &lt;<span class="c-tag">li</span> *<span class="c-attr">ngIf</span>=<span class="c-string">"u.active"</span>&gt;{{ u.name }}&lt;/<span class="c-tag">li</span>&gt;
&lt;/ng-container&gt;</code></pre>

<h3>Cú pháp mới (@if/@for) không có giới hạn này</h3>
<pre><code>@<span class="c-keyword">for</span> (u <span class="c-keyword">of</span> users; track u.id) {
  @<span class="c-keyword">if</span> (u.active) {
    &lt;li&gt;{{ u.name }}&lt;/li&gt;
  }
}</code></pre>

<p>Đây là một trong nhiều lý do block syntax mới sạch hơn rõ rệt.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Dấu <code>*</code> = syntactic sugar cho <code>ng-template</code>.</li>
    <li>2 structural directive trên cùng phần tử KHÔNG hoạt động — phải tách bằng <code>ng-container</code>.</li>
    <li>Block syntax mới không có giới hạn này.</li>
  </ul>
</div>`
    },
    {
      id: "06-06", n: "06",
      title: "Tự viết structural directive — *appUnless",
      html: `
<p>Để hiểu sâu structural directive, hãy tự viết một cái: <code>*appUnless</code> — render khi điều kiện <em>false</em> (đảo của <code>*ngIf</code>).</p>

<h3>3 thứ phải inject</h3>
<ul>
  <li><strong>TemplateRef</strong> — đại diện template gốc (nội dung sẽ render).</li>
  <li><strong>ViewContainerRef</strong> — chỗ để instantiate template vào DOM.</li>
  <li><strong>Input</strong> — biểu thức điều kiện.</li>
</ul>

<div class="example-label">Implementation đầy đủ</div>
<pre><code>@Directive({
  selector: <span class="c-string">'[appUnless]'</span>,
  standalone: <span class="c-keyword">true</span>
})
<span class="c-keyword">export class</span> UnlessDirective {
  <span class="c-keyword">private</span> rendered = <span class="c-keyword">false</span>;
  <span class="c-keyword">private</span> tpl = inject(TemplateRef);
  <span class="c-keyword">private</span> vc = inject(ViewContainerRef);

  @Input() <span class="c-keyword">set</span> appUnless(condition: boolean) {
    <span class="c-keyword">if</span> (!condition && !<span class="c-keyword">this</span>.rendered) {
      <span class="c-keyword">this</span>.vc.createEmbeddedView(<span class="c-keyword">this</span>.tpl);
      <span class="c-keyword">this</span>.rendered = <span class="c-keyword">true</span>;
    } <span class="c-keyword">else if</span> (condition && <span class="c-keyword">this</span>.rendered) {
      <span class="c-keyword">this</span>.vc.clear();
      <span class="c-keyword">this</span>.rendered = <span class="c-keyword">false</span>;
    }
  }
}</code></pre>

<pre><code>&lt;<span class="c-tag">p</span> *<span class="c-attr">appUnless</span>=<span class="c-string">"loggedIn"</span>&gt;Bạn chưa đăng nhập&lt;/<span class="c-tag">p</span>&gt;</code></pre>

<h3>3 điểm tinh tế cần hiểu</h3>

<h4>1. Tên input PHẢI trùng selector</h4>
<p>Cú pháp <code>*appUnless="condition"</code> compiler dịch thành <code>&lt;ng-template [appUnless]="condition"&gt;</code>. Để mapping đúng, input phải tên <code>appUnless</code>.</p>

<h4>2. Setter, không phải property</h4>
<p>Setter cho phép chạy logic mỗi lần input đổi. Nếu dùng property thường, bạn cần override <code>ngOnChanges</code> — phức tạp hơn.</p>

<h4>3. Cờ <code>rendered</code> để tránh duplicate</h4>
<p>Setter có thể được Angular gọi nhiều lần (mỗi CD). Nếu không có cờ:</p>
<ul>
  <li>Mỗi lần <code>condition === false</code> → <code>createEmbeddedView</code> → tạo nhiều copy DOM.</li>
  <li>Mỗi lần <code>condition === true</code> → <code>clear</code> view rỗng (vô hại nhưng phí CPU).</li>
</ul>

<div class="example-label">Mở rộng — directive với context (như *ngIf else)</div>
<pre><code>@Directive({ selector: <span class="c-string">'[appIfRole]'</span>, standalone: <span class="c-keyword">true</span> })
<span class="c-keyword">export class</span> IfRoleDirective {
  <span class="c-keyword">private</span> tpl = inject(TemplateRef);
  <span class="c-keyword">private</span> vc = inject(ViewContainerRef);
  <span class="c-keyword">private</span> auth = inject(AuthService);

  @Input() <span class="c-keyword">set</span> appIfRole(roles: string[]) {
    <span class="c-keyword">this</span>.vc.clear();
    <span class="c-keyword">if</span> (roles.includes(<span class="c-keyword">this</span>.auth.currentUser.role)) {
      <span class="c-keyword">this</span>.vc.createEmbeddedView(<span class="c-keyword">this</span>.tpl);
    }
  }
}</code></pre>

<pre><code>&lt;<span class="c-tag">section</span> *<span class="c-attr">appIfRole</span>=<span class="c-string">"['admin', 'editor']"</span>&gt;
  Nội dung chỉ admin/editor thấy
&lt;/<span class="c-tag">section</span>&gt;</code></pre>

<h3>Gotcha — phải clear khi destroy</h3>
<p>Nếu directive không tự cleanup, view vẫn nằm trong ViewContainerRef cũ — sẽ được Angular destroy tự động khi component cha hủy. Trong hầu hết trường hợp không cần manual cleanup.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Inject <code>TemplateRef</code> + <code>ViewContainerRef</code>; input setter để phản ứng giá trị.</li>
    <li>Tên input PHẢI trùng tên selector (<code>appUnless</code> ↔ <code>appUnless</code>).</li>
    <li>Cờ <code>rendered</code> để tránh duplicate khi setter gọi nhiều lần.</li>
    <li>Cú pháp <code>*x="y"</code> dịch thành <code>&lt;ng-template [x]="y"&gt;</code>.</li>
  </ul>
</div>`
    }
  ]
},
/* =================== SECTION 07 =================== */
{
  id: "s07", n: "07", title: "View Encapsulation",
  lessons: [
    {
      id: "07-01", n: "01",
      title: "View Encapsulation — bên trong hoạt động ra sao",
      html: `
<p>Khi viết CSS trong file <code>.scss</code> của component, làm sao Angular bảo đảm style đó <strong>không leak</strong> sang component khác? Trình duyệt không có tính năng này built-in (trừ Shadow DOM thật, hơi nặng). Angular tự cài cơ chế "giả lập" — đây gọi là <strong>view encapsulation</strong>.</p>

<h3>Cách Angular giả lập encapsulation (chế độ Emulated — mặc định)</h3>
<p>Angular thực hiện 2 việc khi build:</p>
<ol>
  <li><strong>Gắn attribute độc nhất</strong> vào mọi phần tử trong template: <code>_ngcontent-c0</code>, <code>_ngcontent-c1</code>… Mỗi component có một số khác nhau.</li>
  <li><strong>Rewrite CSS selectors</strong> để chỉ match phần tử có attribute đó.</li>
</ol>

<div class="example-label">Bạn viết</div>
<pre><code><span class="c-comment">// course-card.component.scss</span>
h1 { color: red; }
.title { font-weight: bold; }</code></pre>

<div class="example-label">Angular biên dịch thành</div>
<pre><code>h1[_ngcontent-c0] { color: red; }
.title[_ngcontent-c0] { font-weight: bold; }</code></pre>

<div class="example-label">DOM render ra</div>
<pre><code>&lt;div _ngcontent-c0&gt;
  &lt;h1 _ngcontent-c0&gt;Tiêu đề&lt;/h1&gt;
  &lt;p _ngcontent-c0 class="title"&gt;...&lt;/p&gt;
&lt;/div&gt;</code></pre>

<p>Selector <code>h1</code> trong CSS chỉ match phần tử có <code>_ngcontent-c0</code>. Component khác có <code>_ngcontent-c1</code>, không match → CSS không leak.</p>

<h3>3 chế độ encapsulation</h3>
<table class="compare-table">
<tr><th>Mode</th><th>Mô tả</th><th>Khi nào dùng</th></tr>
<tr><td><code>Emulated</code> (default)</td><td>Attribute giả lập, mọi browser hỗ trợ</td><td>99% trường hợp</td></tr>
<tr><td><code>None</code></td><td>Không cô lập — CSS trở thành global</td><td>Khi cần style xuyên qua nhiều component (rất hiếm)</td></tr>
<tr><td><code>ShadowDom</code></td><td>Shadow DOM thật của trình duyệt</td><td>Khi xây Angular Element nhúng vào trang khác</td></tr>
</table>

<pre><code><span class="c-keyword">import</span> { Component, ViewEncapsulation } <span class="c-keyword">from</span> <span class="c-string">'@angular/core'</span>;

@Component({
  encapsulation: ViewEncapsulation.None,    <span class="c-comment">// hoặc ShadowDom</span>
  /* ... */
})</code></pre>

<h3>Một điểm tinh tế: nội dung được project</h3>
<p>Khi cha "chiếu" HTML qua <code>ng-content</code>, HTML đó có attribute của <strong>cha</strong> (nơi viết HTML), không phải con. Vì thế CSS của con KHÔNG style được nội dung đã chiếu — đây là một quirk hay làm người mới bối rối.</p>

<div class="example-label">Ví dụ minh hoạ</div>
<pre><code><span class="c-comment">// app-card component scss — sẽ KHÔNG style nội dung được chiếu</span>
h2 { color: red; }   <span class="c-comment">// chỉ style h2 trong template của card, không style h2 cha chiếu vào</span></code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Mặc định <code>Emulated</code>: Angular gắn attribute giả lập + rewrite CSS — không cần Shadow DOM thật.</li>
    <li>CSS của component chỉ áp dụng cho phần tử <em>thuộc template của chính component</em>.</li>
    <li>Nội dung được project mang attribute của cha → CSS con không style được.</li>
  </ul>
</div>`
    },
    {
      id: "07-02", n: "02",
      title: ":host — chính component element",
      html: `
<p><code>:host</code> là pseudo-class CSS cho phép style <strong>chính phần tử của component</strong> (vd: thẻ <code>&lt;app-card&gt;</code> mà CSS bên trong không thể style trực tiếp).</p>

<div class="example-label">Ví dụ — set display và border cho host</div>
<pre><code><span class="c-comment">// course-card.component.scss</span>
:host {
  display: block;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}</code></pre>

<p>Render ra:</p>
<pre><code>&lt;app-course-card style="display: block; ..."&gt;...&lt;/app-course-card&gt;</code></pre>

<h3>Vì sao cần :host?</h3>
<p>Custom element mặc định là <code>display: inline</code>. Nếu không set <code>display: block</code>, layout sẽ rất kỳ — margin không hoạt động, height không có. <code>:host { display: block }</code> là dòng CSS đầu tiên gần như mọi component đều cần.</p>

<h3>:host(.class) — style theo class do cha gắn</h3>
<pre><code>:host { border: 1px solid #ccc; }
:host(.featured) { border-color: gold; border-width: 2px; }
:host(.disabled) { opacity: 0.5; pointer-events: none; }</code></pre>

<pre><code><span class="c-comment">// cha sử dụng</span>
&lt;<span class="c-tag">app-course-card</span> <span class="c-attr">class</span>=<span class="c-string">"featured"</span>&gt;...&lt;/<span class="c-tag">app-course-card</span>&gt;
&lt;<span class="c-tag">app-course-card</span> <span class="c-attr">class</span>=<span class="c-string">"disabled"</span>&gt;...&lt;/<span class="c-tag">app-course-card</span>&gt;</code></pre>

<h3>:host([attribute])</h3>
<pre><code>:host([disabled]) { opacity: 0.5; }
:host([variant="primary"]) { background: blue; color: white; }</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>:host</code> = thẻ component element (vd <code>&lt;app-card&gt;</code>).</li>
    <li>Hầu hết component cần <code>:host { display: block; }</code>.</li>
    <li><code>:host(.x)</code>, <code>:host([x])</code> match theo class/attribute mà cha gắn.</li>
  </ul>
</div>`
    },
    {
      id: "07-03", n: "03",
      title: "::ng-deep — phá encapsulation (deprecated)",
      html: `
<p>Đôi khi bạn cần style <em>bên trong</em> một component con hoặc thư viện bên thứ ba. <code>::ng-deep</code> phá encapsulation, áp dụng selector "xuyên qua" component boundary.</p>

<pre><code>:host ::ng-deep .third-party-class {
  color: red !important;
  font-size: 14px !important;
}</code></pre>

<p><code>:host</code> ở đầu giới hạn phạm vi xuống cây con của component này — KHÔNG để leak ra ngoài. Nhưng nó vẫn tồn tại trong global stylesheet sau build.</p>

<div class="warn"><strong>Cảnh báo:</strong> <code>::ng-deep</code> đã deprecated từ Angular 9. Vẫn chạy nhưng có thể bị bỏ trong tương lai. Lý do: nó đi ngược triết lý encapsulation, dễ tạo bug "không hiểu sao style này áp dụng được".</div>

<h3>Lựa chọn thay thế</h3>

<h4>1. CSS variables — pattern hiện đại</h4>
<p>Component thư viện expose CSS variable; bạn chỉ cần override:</p>
<pre><code>:host {
  --mat-button-bg: #c2410c;
  --mat-button-radius: 12px;
}</code></pre>

<h4>2. encapsulation: None cho component cụ thể</h4>
<p>Nếu component thật sự cần style global (vd: layout/theme component):</p>
<pre><code>@Component({
  encapsulation: ViewEncapsulation.None,
  /* ... */
})</code></pre>

<h4>3. Style global trong styles.scss</h4>
<p>File <code>src/styles.scss</code> không bị encapsulation. Đặt override ở đây:</p>
<pre><code><span class="c-comment">// src/styles.scss</span>
.mat-button.danger { background: red; }</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>::ng-deep</code> vẫn chạy nhưng deprecated — tránh dùng cho code mới.</li>
    <li>Lựa chọn tốt hơn: CSS variables, <code>encapsulation: None</code>, hoặc style global.</li>
    <li>Đặt <code>:host</code> ở đầu để giới hạn phạm vi.</li>
  </ul>
</div>`
    },
    {
      id: "07-04", n: "04",
      title: ":host-context — theming use case",
      html: `
<p><code>:host-context(selector)</code> apply style khi <strong>tổ tiên</strong> của host khớp selector. Cực kỳ hữu ích cho dark mode / theming.</p>

<div class="example-label">Ví dụ — dark mode</div>
<pre><code>:host {
  background: #fff;
  color: #1a1a1a;
}

:host-context(.dark) {
  background: #1a1a1a;
  color: #fafafa;
}

:host-context(.dark) .border {
  border-color: #555;
}</code></pre>

<pre><code>&lt;<span class="c-tag">body</span> [<span class="c-attr">class.dark</span>]=<span class="c-string">"isDark"</span>&gt;
  &lt;<span class="c-tag">app-card</span>&gt;...&lt;/<span class="c-tag">app-card</span>&gt;     &lt;!-- card đổi màu theo body --&gt;
&lt;/<span class="c-tag">body</span>&gt;</code></pre>

<div class="example-label">Ví dụ — high contrast theme</div>
<pre><code>:host-context(body.high-contrast) {
  outline: 2px solid yellow;
  font-weight: bold;
}</code></pre>

<h3>Khi nào dùng :host-context vs CSS variable?</h3>
<table class="compare-table">
<tr><th>Tình huống</th><th>Dùng gì?</th></tr>
<tr><td>2-3 theme cố định</td><td><code>:host-context</code></td></tr>
<tr><td>Theme có nhiều biến (50+ tokens)</td><td>CSS variables</td></tr>
<tr><td>Theme cho phép user tuỳ biến runtime</td><td>CSS variables</td></tr>
<tr><td>Theme legacy (đã có class)</td><td><code>:host-context</code></td></tr>
</table>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>:host-context(x)</code> match khi tổ tiên của host có class/selector x.</li>
    <li>Use case chính: dark mode / theming.</li>
    <li>Với theme phức tạp, ưu tiên CSS variables.</li>
  </ul>
</div>`
    },
    {
      id: "07-05", n: "05",
      title: "Default vs Shadow DOM",
      html: `
<table class="compare-table">
<tr><th></th><th>Emulated (default)</th><th>ShadowDom</th></tr>
<tr><td>Cô lập</td><td>Giả lập (attribute)</td><td>Thật (Shadow DOM API)</td></tr>
<tr><td>Tương thích</td><td>Mọi trình duyệt</td><td>Modern browsers</td></tr>
<tr><td>CSS global tác động</td><td>Có (Tailwind, Bootstrap…)</td><td>Không (cô lập tuyệt đối)</td></tr>
<tr><td>Debug DevTools</td><td>Bình thường</td><td>Phải mở Shadow Root</td></tr>
<tr><td>Form/event behavior</td><td>Bình thường</td><td>Một số quirk (event retargeting)</td></tr>
</table>

<div class="example-label">Bật Shadow DOM</div>
<pre><code>@Component({
  encapsulation: ViewEncapsulation.ShadowDom,
  /* ... */
})</code></pre>

<h3>Khi nào nên dùng ShadowDom?</h3>
<ul>
  <li><strong>Build widget nhúng</strong>: Angular Element được nhúng vào website của bên khác. Bạn không muốn CSS của họ "rớt" vào widget.</li>
  <li><strong>Component thư viện độc lập</strong>: muốn miễn nhiễm với mọi global CSS.</li>
</ul>

<h3>Khi nào KHÔNG nên?</h3>
<ul>
  <li><strong>Dùng Tailwind/Bootstrap toàn app</strong>: Shadow DOM cô lập sẽ chặn class utility. Phải import CSS riêng vào component, mất hết lợi ích.</li>
  <li><strong>Theming toàn app qua CSS variable global</strong>: Variables vẫn cascade vào Shadow DOM nhưng class không. Phải tính toán cẩn thận.</li>
  <li><strong>Form library bên thứ ba</strong>: nhiều thư viện không hoạt động đúng trong Shadow DOM (event không bubble qua boundary đúng cách).</li>
</ul>

<div class="callout"><strong>Quy tắc thực dụng:</strong> 99% dự án dùng <code>Emulated</code>. Chỉ chuyển <code>ShadowDom</code> cho <em>component cụ thể</em> bạn xuất ra Angular Element. Đừng đổi cả app.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Emulated: nhanh, tương thích, đủ tốt cho 99% app.</li>
    <li>ShadowDom: cô lập thật, hữu ích cho widget độc lập / Angular Element.</li>
    <li>None: phá cô lập hoàn toàn — chỉ dùng cho theme/layout component đặc biệt.</li>
  </ul>
</div>`
    }
  ]
},

/* =================== SECTION 08 =================== */
{
  id: "s08", n: "08", title: "Injectable Services",
  lessons: [
    {
      id: "08-01", n: "01",
      title: "Mở chương Service",
      html: `
<p>Component nên <strong>mỏng</strong>: chỉ giữ state UI và handle event. Mọi logic "nặng" — gọi API, biến đổi data, lưu trạng thái dài hạn — nên đặt trong <strong>service</strong>. Service là class TypeScript thuần, được Angular DI tự khởi tạo và inject vào component khi cần.</p>

<h3>Vì sao cần service?</h3>
<ul>
  <li><strong>Tái sử dụng</strong>: 5 component dùng cùng API → 1 service, không copy logic.</li>
  <li><strong>Test dễ</strong>: service không phụ thuộc DOM/template → unit test thuần TS.</li>
  <li><strong>State chia sẻ</strong>: service singleton giữ state mà nhiều component đọc/ghi.</li>
  <li><strong>Mock dễ</strong>: thay implementation cho test mà không sửa component.</li>
</ul>

<h3>Trong chương này bạn sẽ học</h3>
<ol>
  <li>Dùng <code>HttpClient</code> built-in để gọi REST API (GET/POST/PUT/DELETE).</li>
  <li><code>async</code> pipe — cách "đẹp" nhất truyền Observable vào view.</li>
  <li>Tạo service tuỳ biến với <code>@Injectable</code>.</li>
  <li>Pattern fetch + cache + share data giữa nhiều component.</li>
</ol>`
    },
    {
      id: "08-02", n: "02",
      title: "HttpClient — GET với query params",
      html: `
<p><code>HttpClient</code> là service built-in của Angular (module <code>@angular/common/http</code>). Trả về Observable, hỗ trợ interceptor, hỗ trợ JSON tự parse.</p>

<h3>Bước 1: Provide HttpClient</h3>
<pre><code><span class="c-comment">// main.ts (standalone)</span>
<span class="c-keyword">import</span> { provideHttpClient } <span class="c-keyword">from</span> <span class="c-string">'@angular/common/http'</span>;

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient()
  ]
});</code></pre>

<h3>Bước 2: Inject và gọi</h3>
<pre><code>@Component({ /* ... */ })
<span class="c-keyword">export class</span> CoursesComponent {
  <span class="c-keyword">private</span> http = inject(HttpClient);

  load() {
    <span class="c-keyword">this</span>.http.get&lt;Course[]&gt;(<span class="c-string">'/api/courses'</span>).subscribe(courses =&gt; {
      console.log(courses);
    });
  }
}</code></pre>

<h3>Truyền query params</h3>

<div class="example-label">Cách 1 — object literal</div>
<pre><code><span class="c-keyword">this</span>.http.get&lt;Course[]&gt;(<span class="c-string">'/api/courses'</span>, {
  params: {
    search: <span class="c-string">'angular'</span>,
    page: 1,
    size: 20,
    sort: <span class="c-string">'createdAt,desc'</span>
  }
}).subscribe(...);</code></pre>

<p>URL kết quả: <code>/api/courses?search=angular&page=1&size=20&sort=createdAt,desc</code></p>

<div class="example-label">Cách 2 — HttpParams chained</div>
<pre><code><span class="c-keyword">import</span> { HttpParams } <span class="c-keyword">from</span> <span class="c-string">'@angular/common/http'</span>;

<span class="c-keyword">const</span> params = <span class="c-keyword">new</span> HttpParams()
  .set(<span class="c-string">'search'</span>, filter)
  .set(<span class="c-string">'page'</span>, page)
  .append(<span class="c-string">'tag'</span>, <span class="c-string">'angular'</span>)
  .append(<span class="c-string">'tag'</span>, <span class="c-string">'rxjs'</span>);     <span class="c-comment">// nhiều giá trị cùng key</span>

<span class="c-keyword">this</span>.http.get&lt;Course[]&gt;(<span class="c-string">'/api/courses'</span>, { params }).subscribe(...);</code></pre>

<p><code>HttpParams</code> immutable — mỗi <code>.set()</code> trả instance mới. Hữu ích cho code chained kiểu fluent.</p>

<h3>Type safety</h3>
<p><code>this.http.get&lt;Course[]&gt;</code>: type generic nói với TS "response sẽ có shape này". Không có type, response sẽ là <code>unknown</code>/<code>Object</code>.</p>

<div class="warn"><strong>Quan trọng:</strong> type generic chỉ là <em>khẳng định</em> với compiler — không validate ở runtime. Nếu API trả khác type bạn khai báo, code sẽ chạy nhưng có thể crash later. Với app nghiêm túc, dùng zod/io-ts để validate runtime.</div>

<h3>Headers</h3>
<pre><code><span class="c-keyword">this</span>.http.get(url, {
  headers: {
    <span class="c-string">'Authorization'</span>: \`Bearer \${token}\`,
    <span class="c-string">'X-Request-Id'</span>: crypto.randomUUID()
  }
})</code></pre>

<h3>Response type khác</h3>
<pre><code><span class="c-comment">// nhận text thay vì JSON</span>
<span class="c-keyword">this</span>.http.get(<span class="c-string">'/api/csv'</span>, { responseType: <span class="c-string">'text'</span> })

<span class="c-comment">// nhận blob (download file)</span>
<span class="c-keyword">this</span>.http.get(<span class="c-string">'/api/file'</span>, { responseType: <span class="c-string">'blob'</span> })

<span class="c-comment">// nhận full response (status, headers, body)</span>
<span class="c-keyword">this</span>.http.get(url, { observe: <span class="c-string">'response'</span> })</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Provide <code>provideHttpClient()</code> ở root.</li>
    <li>HTTP method trả Observable — phải subscribe để gửi request.</li>
    <li>Type generic: <code>http.get&lt;T&gt;(url)</code> — chỉ là TS hint, không validate runtime.</li>
    <li>Params có 2 cách: object literal (đơn giản) hoặc HttpParams (chained, immutable).</li>
  </ul>
</div>`
    },
    {
      id: "08-03", n: "03",
      title: "async pipe — cách tốt nhất truyền Observable vào view",
      html: `
<p>Có 2 cách dùng Observable trong template:</p>

<h3>Cách "tay": tự subscribe</h3>
<pre><code>@Component({ template: <span class="c-string">'&lt;p&gt;{{ count }}&lt;/p&gt;'</span> })
<span class="c-keyword">export class</span> Counter <span class="c-keyword">implements</span> OnDestroy {
  count = 0;
  <span class="c-keyword">private</span> sub?: Subscription;

  ngOnInit() {
    <span class="c-keyword">this</span>.sub = interval(1000).subscribe(v =&gt; <span class="c-keyword">this</span>.count = v);
  }
  ngOnDestroy() { <span class="c-keyword">this</span>.sub?.unsubscribe(); }
}</code></pre>

<h3>Cách "auto": async pipe</h3>
<pre><code>@Component({
  template: <span class="c-string">'&lt;p&gt;{{ count\$ | async }}&lt;/p&gt;'</span>,
  imports: [AsyncPipe]
})
<span class="c-keyword">export class</span> Counter {
  count\$ = interval(1000);   <span class="c-comment">// chỉ một dòng!</span>
}</code></pre>

<h3>async pipe làm gì?</h3>
<ol>
  <li>Subscribe vào Observable/Promise khi component init.</li>
  <li>Mỗi lần phát giá trị → set vào template + gọi <code>markForCheck()</code> (an toàn với OnPush).</li>
  <li><strong>Tự unsubscribe</strong> khi component destroy → không leak memory.</li>
</ol>

<div class="callout"><strong>Quy tắc:</strong> nếu có thể dùng async pipe, dùng nó. Subscribe tay chỉ cần khi:
<ul>
<li>Phải xử lý side-effect ngoài render (vd: gọi router.navigate).</li>
<li>Cần kết hợp giá trị với state local.</li>
<li>Phải debug timing.</li>
</ul></div>

<div class="example-label">Pattern phổ biến — load + show</div>
<pre><code>@Component({
  template: \`
    @if (courses\$ | async; as courses) {
      @for (c of courses; track c.id) { &lt;app-card [c]="c"/&gt; }
    } @else {
      &lt;app-spinner/&gt;
    }
  \`,
  imports: [AsyncPipe, CardComponent, SpinnerComponent]
})
<span class="c-keyword">export class</span> Page {
  courses\$ = inject(CoursesService).load();
}</code></pre>

<p><code>as courses</code> tránh subscribe nhiều lần — pipe chỉ gọi 1 lần, gắn vào biến cục bộ.</p>

<h3>Bẫy: gọi async nhiều lần cho cùng Observable</h3>
<pre><code><span class="c-comment">// ❌ XẤU — mỗi {{ x | async }} là một subscription riêng</span>
&lt;p&gt;{{ user\$ | async }}&lt;/p&gt;
&lt;p&gt;{{ (user\$ | async)?.email }}&lt;/p&gt;
&lt;p&gt;{{ (user\$ | async)?.role }}&lt;/p&gt;

<span class="c-comment">// ✓ ĐÚNG — subscribe 1 lần với "as"</span>
@if (user\$ | async; as user) {
  &lt;p&gt;{{ user.name }}&lt;/p&gt;
  &lt;p&gt;{{ user.email }}&lt;/p&gt;
  &lt;p&gt;{{ user.role }}&lt;/p&gt;
}</code></pre>

<p>Mỗi subscription gọi API riêng (trừ khi service có cache). Pattern <code>as</code> tránh điều này.</p>

<h3>So sánh với signal</h3>
<p>Angular 17+ có signal — đọc thẳng trong template như <code>{{ count() }}</code>, không cần pipe. Khi nào dùng signal vs Observable?</p>
<table class="compare-table">
<tr><th>Tình huống</th><th>Dùng</th></tr>
<tr><td>State local đồng bộ</td><td>Signal</td></tr>
<tr><td>HTTP response</td><td>Observable + async pipe</td></tr>
<tr><td>Stream phức tạp (debounce, switchMap)</td><td>Observable</td></tr>
<tr><td>Form value</td><td>Cả hai (toSignal/toObservable convert được)</td></tr>
</table>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>async pipe tự subscribe + tự unsubscribe — luôn dùng nếu được.</li>
    <li>Pattern <code>x$ | async; as x</code> để tránh subscribe nhiều lần.</li>
    <li>Code mới với state đồng bộ → ưu tiên signal; HTTP/stream → Observable.</li>
  </ul>
</div>`
    },
    {
      id: "08-04", n: "04",
      title: "@Injectable — service tuỳ biến",
      html: `
<p>Để Angular DI có thể inject một class, class đó phải đánh dấu <code>@Injectable</code>.</p>

<div class="example-label">Service cơ bản</div>
<pre><code>@Injectable({ providedIn: <span class="c-string">'root'</span> })
<span class="c-keyword">export class</span> CoursesService {
  <span class="c-keyword">private</span> http = inject(HttpClient);

  load() {
    <span class="c-keyword">return this</span>.http.get&lt;Course[]&gt;(<span class="c-string">'/api/courses'</span>);
  }

  byId(id: string) {
    <span class="c-keyword">return this</span>.http.get&lt;Course&gt;(\`/api/courses/\${id}\`);
  }
}</code></pre>

<h3>providedIn: 'root' = singleton + tree-shakable</h3>
<p>Đây là cách <em>khuyến nghị nhất</em> để cung cấp service:</p>
<ul>
  <li><strong>Singleton</strong>: một instance toàn ứng dụng. Nhiều component inject cùng nhận một thằng.</li>
  <li><strong>Tree-shakable</strong>: nếu service không bao giờ inject ở đâu, bundler bỏ khỏi bundle production. Bạn không "trả phí" cho service không dùng.</li>
</ul>

<h3>Sử dụng từ component</h3>
<pre><code>@Component({ /* ... */ })
<span class="c-keyword">export class</span> CoursesPage {
  <span class="c-keyword">private</span> courses = inject(CoursesService);
  data\$ = <span class="c-keyword">this</span>.courses.load();
}</code></pre>

<p>Hoặc cách cũ qua constructor:</p>
<pre><code><span class="c-keyword">constructor</span>(<span class="c-keyword">private</span> courses: CoursesService) {}</code></pre>

<h3>inject() vs constructor — chọn cái nào?</h3>
<table class="compare-table">
<tr><th>Đặc điểm</th><th>inject()</th><th>constructor</th></tr>
<tr><td>Dùng được trong field initializer</td><td>Có</td><td>Không (chưa có "this")</td></tr>
<tr><td>Cần extends</td><td>Không phụ thuộc thứ tự</td><td>Phải gọi <code>super()</code> trước</td></tr>
<tr><td>Ngắn gọn</td><td>Hơn</td><td>Dài hơn 1 dòng</td></tr>
<tr><td>Custom hooks (composables)</td><td>Hỗ trợ tốt</td><td>Khó</td></tr>
<tr><td>Available trong Angular</td><td>≥14</td><td>Mọi version</td></tr>
</table>

<p>Code mới: <strong>luôn dùng <code>inject()</code></strong>. Constructor injection chỉ còn cho legacy.</p>

<h3>Custom composable function</h3>
<pre><code><span class="c-comment">// auto-cleanup interval helper</span>
<span class="c-keyword">export function</span> useInterval(ms: number, fn: () =&gt; void) {
  <span class="c-keyword">const</span> destroyRef = inject(DestroyRef);
  <span class="c-keyword">const</span> id = setInterval(fn, ms);
  destroyRef.onDestroy(() =&gt; clearInterval(id));
}

<span class="c-comment">// trong component:</span>
<span class="c-keyword">export class</span> MyComp {
  <span class="c-keyword">constructor</span>() {
    useInterval(1000, () =&gt; <span class="c-keyword">this</span>.tick++);
  }
}</code></pre>

<p><code>inject()</code> hoạt động trong "injection context" — cho phép bạn viết hàm tái sử dụng kiểu hook React.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>@Injectable({ providedIn: 'root' })</code> = singleton + tree-shakable, mặc định nên dùng.</li>
    <li><code>inject()</code> > constructor injection cho code mới.</li>
    <li><code>inject()</code> mở ra pattern composable function (như hook React/Vue).</li>
  </ul>
</div>`
    },
    {
      id: "08-05", n: "05",
      title: "Service fetch dữ liệu — pattern thực tế",
      html: `
<p>Service load data thường có vài "đặc tính" cần xử lý: cache, share giữa nhiều subscriber, error handling, retry. RxJS operator giúp giải quyết gọn gàng.</p>

<div class="example-label">Service load + cache + handle error</div>
<pre><code>@Injectable({ providedIn: <span class="c-string">'root'</span> })
<span class="c-keyword">export class</span> CoursesService {
  <span class="c-keyword">private</span> http = inject(HttpClient);
  <span class="c-keyword">private</span> cache\$?: Observable&lt;Course[]&gt;;

  load() {
    <span class="c-keyword">if</span> (!<span class="c-keyword">this</span>.cache\$) {
      <span class="c-keyword">this</span>.cache\$ = <span class="c-keyword">this</span>.http.get&lt;Course[]&gt;(<span class="c-string">'/api/courses'</span>).pipe(
        retry({ count: 2, delay: 1000 }),
        shareReplay({ bufferSize: 1, refCount: <span class="c-keyword">false</span> }),
        catchError(err =&gt; {
          console.error(<span class="c-string">'Lỗi tải courses'</span>, err);
          <span class="c-keyword">return</span> of([]);
        })
      );
    }
    <span class="c-keyword">return this</span>.cache\$;
  }

  refresh() {
    <span class="c-keyword">this</span>.cache\$ = <span class="c-keyword">undefined</span>;   <span class="c-comment">// xoá cache, lần load tới sẽ gọi API</span>
  }

  byId(id: string) {
    <span class="c-keyword">return this</span>.load().pipe(
      map(courses =&gt; courses.find(c =&gt; c.id === id))
    );
  }
}</code></pre>

<h3>Operator quan trọng giải thích</h3>
<table class="compare-table">
<tr><th>Operator</th><th>Vai trò</th></tr>
<tr><td><code>shareReplay(1)</code></td><td>Chia sẻ 1 request cho nhiều subscriber + replay giá trị mới nhất</td></tr>
<tr><td><code>retry({ count, delay })</code></td><td>Tự retry n lần khi lỗi, có delay</td></tr>
<tr><td><code>catchError(fn)</code></td><td>Bắt lỗi, trả Observable fallback</td></tr>
<tr><td><code>map(fn)</code></td><td>Biến đổi giá trị</td></tr>
<tr><td><code>tap(fn)</code></td><td>Side-effect (log, debug) không đổi giá trị</td></tr>
</table>

<h3>Component sử dụng</h3>
<pre><code>@Component({
  template: \`
    @if (courses\$ | async; as courses) {
      @for (c of courses; track c.id) { &lt;app-card [c]="c"/&gt; }
    }
  \`
})
<span class="c-keyword">export class</span> CoursesPage {
  courses\$ = inject(CoursesService).load();
}</code></pre>

<h3>Pattern signal-based (Angular 17+)</h3>
<pre><code>@Injectable({ providedIn: <span class="c-string">'root'</span> })
<span class="c-keyword">export class</span> CoursesStore {
  <span class="c-keyword">private</span> http = inject(HttpClient);
  <span class="c-keyword">private</span> _courses = signal&lt;Course[]&gt;([]);
  <span class="c-keyword">private</span> _loading = signal(<span class="c-keyword">false</span>);

  courses = <span class="c-keyword">this</span>._courses.asReadonly();
  loading = <span class="c-keyword">this</span>._loading.asReadonly();
  count = computed(() =&gt; <span class="c-keyword">this</span>._courses().length);

  load() {
    <span class="c-keyword">this</span>._loading.set(<span class="c-keyword">true</span>);
    <span class="c-keyword">this</span>.http.get&lt;Course[]&gt;(<span class="c-string">'/api/courses'</span>).subscribe({
      next: cs =&gt; <span class="c-keyword">this</span>._courses.set(cs),
      error: e =&gt; console.error(e),
      complete: () =&gt; <span class="c-keyword">this</span>._loading.set(<span class="c-keyword">false</span>)
    });
  }
}</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>shareReplay(1)</code> để cache 1 request cho nhiều subscriber.</li>
    <li><code>catchError</code> + <code>retry</code> cho resilience.</li>
    <li>Pattern signal-based store là alternative gọn cho state management nhỏ-vừa.</li>
  </ul>
</div>`
    },
    {
      id: "08-06", n: "06",
      title: "PUT / POST / DELETE — sửa dữ liệu",
      html: `
<div class="example-label">PUT — update toàn bộ resource</div>
<pre><code>save(course: Course) {
  <span class="c-keyword">return this</span>.http.put&lt;Course&gt;(
    \`/api/courses/\${course.id}\`,
    course
  );
}</code></pre>

<div class="example-label">PATCH — update một phần</div>
<pre><code>updateTitle(id: string, title: string) {
  <span class="c-keyword">return this</span>.http.patch&lt;Course&gt;(
    \`/api/courses/\${id}\`,
    { title }
  );
}</code></pre>

<div class="example-label">POST — tạo mới</div>
<pre><code>create(course: Omit&lt;Course, <span class="c-string">'id'</span>&gt;) {
  <span class="c-keyword">return this</span>.http.post&lt;Course&gt;(
    <span class="c-string">'/api/courses'</span>,
    course
  );
}</code></pre>

<div class="example-label">DELETE</div>
<pre><code>remove(id: string) {
  <span class="c-keyword">return this</span>.http.delete&lt;<span class="c-keyword">void</span>&gt;(\`/api/courses/\${id}\`);
}</code></pre>

<h3>Component handle response</h3>
<pre><code>save() {
  <span class="c-keyword">this</span>.svc.save(<span class="c-keyword">this</span>.form.value).subscribe({
    next: c =&gt; {
      <span class="c-keyword">this</span>.router.navigate([<span class="c-string">'/courses'</span>, c.id]);
      <span class="c-keyword">this</span>.toast.success(<span class="c-string">'Đã lưu!'</span>);
    },
    error: e =&gt; <span class="c-keyword">this</span>.toast.error(\`Lỗi: \${e.message}\`)
  });
}</code></pre>

<h3>Optimistic update — UI phản hồi tức thì</h3>
<pre><code>@Injectable({ providedIn: <span class="c-string">'root'</span> })
<span class="c-keyword">export class</span> TodosService {
  <span class="c-keyword">private</span> _todos = signal&lt;Todo[]&gt;([]);
  todos = <span class="c-keyword">this</span>._todos.asReadonly();

  <span class="c-keyword">private</span> http = inject(HttpClient);

  toggle(todo: Todo) {
    <span class="c-comment">// 1. update UI ngay</span>
    <span class="c-keyword">const</span> optimistic = { ...todo, done: !todo.done };
    <span class="c-keyword">this</span>._todos.update(arr =&gt;
      arr.map(t =&gt; t.id === todo.id ? optimistic : t)
    );

    <span class="c-comment">// 2. gọi API; nếu thất bại, rollback</span>
    <span class="c-keyword">this</span>.http.patch&lt;Todo&gt;(\`/api/todos/\${todo.id}\`, { done: optimistic.done })
      .subscribe({
        error: () =&gt; {
          <span class="c-keyword">this</span>._todos.update(arr =&gt;
            arr.map(t =&gt; t.id === todo.id ? todo : t)
          );
          <span class="c-keyword">this</span>.toast.error(<span class="c-string">'Không lưu được'</span>);
        }
      });
  }
}</code></pre>

<p>UX: user thấy phản hồi tức thì; chỉ rollback nếu API thất bại — rất hiếm.</p>

<h3>HTTP Interceptor — auth token tự động</h3>
<pre><code><span class="c-comment">// auth.interceptor.ts</span>
<span class="c-keyword">export const</span> authInterceptor: HttpInterceptorFn = (req, next) =&gt; {
  <span class="c-keyword">const</span> token = inject(AuthService).token;
  <span class="c-keyword">if</span> (token) {
    req = req.clone({
      headers: req.headers.set(<span class="c-string">'Authorization'</span>, \`Bearer \${token}\`)
    });
  }
  <span class="c-keyword">return</span> next(req);
};

<span class="c-comment">// main.ts</span>
provideHttpClient(withInterceptors([authInterceptor]))</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>POST/PUT/PATCH/DELETE đều trả Observable — phải subscribe.</li>
    <li>Optimistic update: update UI trước, rollback nếu API fail.</li>
    <li>Interceptor: nơi đặt cross-cutting concerns (auth token, log, retry).</li>
  </ul>
</div>`
    }
  ]
},

/* =================== SECTION 09 =================== */
{
  id: "s09", n: "09", title: "Dependency Injection",
  lessons: [
    {
      id: "09-01", n: "01",
      title: "Hệ thống DI — giới thiệu sâu",
      html: `
<p>DI là <strong>trái tim của Angular</strong>. Hiểu DI là điều kiện cần để viết app Angular nghiêm túc — không hiểu, bạn sẽ gặp đủ kiểu bug "không hiểu sao instance này khác lúc trước".</p>

<h3>DI là gì? Trong 1 câu:</h3>
<p>"Class nói tôi cần X, framework tự tìm và đưa cho." Bạn không tự <code>new</code> service — Angular làm thay.</p>

<h3>Tại sao tốt hơn tự new?</h3>
<table class="compare-table">
<tr><th></th><th>Tự new (không DI)</th><th>DI</th></tr>
<tr><td>Test</td><td>Khó (phải mock import)</td><td>Dễ (override provider)</td></tr>
<tr><td>Singleton</td><td>Tự quản lý</td><td>Tự động</td></tr>
<tr><td>Đổi implementation</td><td>Sửa import nhiều chỗ</td><td>Sửa 1 dòng provider</td></tr>
<tr><td>Lifecycle</td><td>Tự xử lý</td><td>Angular xử lý</td></tr>
<tr><td>Configuration</td><td>Hard-code</td><td>Inject token</td></tr>
</table>

<h3>2 cách inject — chọn inject()</h3>

<div class="example-label">Cách cũ — constructor injection</div>
<pre><code>@Component({ /* ... */ })
<span class="c-keyword">export class</span> Page {
  <span class="c-keyword">constructor</span>(
    <span class="c-keyword">private</span> svc: CoursesService,
    <span class="c-keyword">private</span> router: Router,
    <span class="c-keyword">private</span> route: ActivatedRoute
  ) {}
}</code></pre>

<div class="example-label">Cách mới — inject() function</div>
<pre><code>@Component({ /* ... */ })
<span class="c-keyword">export class</span> Page {
  <span class="c-keyword">private</span> svc = inject(CoursesService);
  <span class="c-keyword">private</span> router = inject(Router);
  <span class="c-keyword">private</span> route = inject(ActivatedRoute);
}</code></pre>

<p><code>inject()</code> tốt hơn vì:</p>
<ul>
  <li>Field initializer — không cần boilerplate constructor.</li>
  <li>Không phụ thuộc thứ tự hoặc <code>super()</code> khi inheritance.</li>
  <li>Dùng được trong factory function, custom hook, route guard.</li>
  <li>Type-safe với generic: <code>inject(MY_TOKEN)</code> tự suy ra type.</li>
</ul>

<h3>Khi nào KHÔNG dùng được inject()?</h3>
<p>Trong "non-injection context" — ngoài constructor, ngoài lifecycle hook đầu, ngoài provider factory. Vd: bên trong setTimeout, async callback, RxJS operator. Lỗi:</p>
<pre><code>NG0203: inject() must be called from an injection context</code></pre>

<p>Cách workaround: lưu reference từ injection context, dùng sau:</p>
<pre><code><span class="c-keyword">export class</span> Page {
  <span class="c-keyword">private</span> http = inject(HttpClient);

  later() {
    setTimeout(() =&gt; {
      <span class="c-keyword">this</span>.http.get(...).subscribe(...);   <span class="c-comment">// OK, http đã inject ở context đúng</span>
    }, 1000);
  }
}</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>DI = framework tìm và inject dependency, bạn không tự new.</li>
    <li>Code mới: dùng <code>inject()</code>; constructor injection chỉ cho legacy.</li>
    <li><code>inject()</code> phải gọi trong injection context — không được trong async callback.</li>
  </ul>
</div>`
    },
    {
      id: "09-02", n: "02",
      title: "Provider và Injection Token",
      html: `
<p>Để DI biết "khi ai đó hỏi X thì đưa cái gì", bạn khai báo <strong>provider</strong>. Provider có 2 phần: <em>token</em> (định danh) và <em>recipe</em> (cách tạo).</p>

<h3>Token là gì?</h3>
<table class="compare-table">
<tr><th>Loại token</th><th>Khi nào dùng</th></tr>
<tr><td>Class</td><td>Service, component (phổ biến nhất)</td></tr>
<tr><td>Abstract class</td><td>Interface-style, swap implementation</td></tr>
<tr><td><code>InjectionToken</code></td><td>Config value, primitive (không phải class)</td></tr>
</table>

<h3>4 dạng provider phổ biến</h3>

<div class="example-label">1. useClass — token là class, recipe cũng là class</div>
<pre><code>{ provide: Logger, useClass: ConsoleLogger }
<span class="c-comment">// "khi inject(Logger), tạo instance ConsoleLogger"</span></code></pre>

<div class="example-label">2. useValue — token là gì cũng được, recipe là giá trị tĩnh</div>
<pre><code>{ provide: API_URL, useValue: <span class="c-string">'https://api.example.com'</span> }
{ provide: FEATURES, useValue: { newCheckout: <span class="c-keyword">true</span> } }</code></pre>

<div class="example-label">3. useExisting — alias đến token khác</div>
<pre><code>{ provide: Auth, useExisting: AuthServiceImpl }
<span class="c-comment">// "khi inject(Auth), trả về CÙNG instance như AuthServiceImpl"</span></code></pre>

<div class="example-label">4. useFactory — tạo bằng function (động)</div>
<pre><code>{
  provide: Storage,
  useFactory: () =&gt; window.localStorage ? <span class="c-keyword">new</span> LocalStore() : <span class="c-keyword">new</span> MemoryStore(),
  deps: []   <span class="c-comment">// nếu factory cần dependency khác</span>
}</code></pre>

<h3>InjectionToken — cho config / primitive</h3>
<p>Bạn KHÔNG thể dùng string làm token (TS không thể bảo đảm uniqueness). Thay vào đó tạo <code>InjectionToken</code>:</p>

<pre><code><span class="c-comment">// app.tokens.ts</span>
<span class="c-keyword">import</span> { InjectionToken } <span class="c-keyword">from</span> <span class="c-string">'@angular/core'</span>;

<span class="c-keyword">export interface</span> AppConfig {
  apiUrl: string;
  enableLogging: boolean;
  pageSize: number;
}

<span class="c-keyword">export const</span> APP_CONFIG = <span class="c-keyword">new</span> InjectionToken&lt;AppConfig&gt;(<span class="c-string">'APP_CONFIG'</span>);</code></pre>

<pre><code><span class="c-comment">// main.ts</span>
bootstrapApplication(App, {
  providers: [
    {
      provide: APP_CONFIG,
      useValue: { apiUrl: <span class="c-string">'/api'</span>, enableLogging: <span class="c-keyword">true</span>, pageSize: 20 }
    }
  ]
});</code></pre>

<pre><code><span class="c-comment">// service sử dụng</span>
@Injectable({ providedIn: <span class="c-string">'root'</span> })
<span class="c-keyword">export class</span> CoursesService {
  <span class="c-keyword">private</span> cfg = inject(APP_CONFIG);
  <span class="c-keyword">private</span> http = inject(HttpClient);

  load() {
    <span class="c-keyword">return this</span>.http.get(\`\${<span class="c-keyword">this</span>.cfg.apiUrl}/courses\`);
  }
}</code></pre>

<h3>Multi token — gom nhiều giá trị cùng token</h3>
<pre><code>{ provide: ROUTES, useValue: authRoutes, multi: <span class="c-keyword">true</span> },
{ provide: ROUTES, useValue: dashboardRoutes, multi: <span class="c-keyword">true</span> },
{ provide: ROUTES, useValue: settingsRoutes, multi: <span class="c-keyword">true</span> }

<span class="c-comment">// inject(ROUTES) trả về [authRoutes, dashboardRoutes, settingsRoutes]</span></code></pre>

<p>Pattern này dùng cho: nhiều interceptor, nhiều validator, nhiều route group.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Provider gồm 2 phần: token (định danh) + recipe (cách tạo).</li>
    <li>4 recipe: <code>useClass</code>, <code>useValue</code>, <code>useExisting</code>, <code>useFactory</code>.</li>
    <li>Cho config: dùng <code>InjectionToken&lt;T&gt;</code>, không bao giờ dùng string.</li>
    <li><code>multi: true</code> để gom nhiều giá trị cùng token.</li>
  </ul>
</div>`
    },
    {
      id: "09-03", n: "03",
      title: "Cấu hình provider rút gọn",
      html: `
<p>Khi token là class và recipe là chính nó, có cách viết tắt:</p>

<pre><code>providers: [
  CoursesService,                   <span class="c-comment">// = { provide: CoursesService, useClass: CoursesService }</span>
  Logger                            <span class="c-comment">// = { provide: Logger, useClass: Logger }</span>
]</code></pre>

<p>Cú pháp dài cần khi <em>swap implementation</em>:</p>
<pre><code>providers: [
  { provide: Logger, useClass: ConsoleLogger },        <span class="c-comment">// dev</span>
  <span class="c-comment">// hoặc:</span>
  { provide: Logger, useClass: RemoteLogger },         <span class="c-comment">// prod</span>
]</code></pre>

<h3>providedIn — cách "modern" hơn</h3>
<p>Thay vì khai báo provider ở root, tự service đánh dấu chính nó:</p>

<pre><code>@Injectable({ providedIn: <span class="c-string">'root'</span> })
<span class="c-keyword">export class</span> CoursesService { /* ... */ }</code></pre>

<p>Lúc này không cần thêm vào <code>providers</code> array nữa. Đây là cách <strong>khuyến nghị</strong> vì:</p>
<ul>
  <li>Tree-shakable: nếu không ai inject, bundler bỏ.</li>
  <li>Tự tài liệu: nhìn vào service biết ngay scope của nó.</li>
  <li>Không cần edit file <code>app.config.ts</code> mỗi lần thêm service.</li>
</ul>

<h3>Khi nào dùng cách dài (providers array)?</h3>
<ul>
  <li>Cần <code>useClass</code> / <code>useValue</code> / <code>useFactory</code> tuỳ biến.</li>
  <li>Service từ thư viện bên ngoài, không thể sửa decorator của nó.</li>
  <li>Cần multi token, <code>useExisting</code>.</li>
  <li>Cấp độ component (provider scope theo component).</li>
</ul>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Class + chính nó: viết tắt <code>providers: [CoursesService]</code>.</li>
    <li>Service tự khai báo <code>providedIn: 'root'</code> là pattern tốt nhất.</li>
    <li>Cú pháp dài chỉ khi cần swap, multi, hoặc factory.</li>
  </ul>
</div>`
    },
    {
      id: "09-04", n: "04",
      title: "Hierarchical DI — DI phân cấp",
      html: `
<p>Đây là phần "ma thuật" của DI Angular và cũng là phần dễ gây nhầm lẫn nhất. Hiểu nó là điều kiện để xây kiến trúc Angular tốt.</p>

<h3>Mỗi component có injector riêng</h3>
<p>Khi Angular bootstrap, nó tạo một cây <strong>injector</strong> song song với cây component:</p>
<pre><code>RootInjector
  └─ AppComponent injector
       └─ DashboardComponent injector
            └─ CourseListComponent injector
                 └─ CourseCardComponent injector</code></pre>

<p>Khi bạn <code>inject(CoursesService)</code> trong <code>CourseCardComponent</code>, Angular tìm theo thứ tự:</p>
<ol>
  <li>Provider của <code>CourseCardComponent</code> → có không?</li>
  <li>Nếu không → leo lên <code>CourseListComponent</code> → có không?</li>
  <li>Tiếp tục leo… đến tận <code>RootInjector</code>.</li>
  <li>Tìm thấy → tạo (hoặc trả lại) instance, đưa cho.</li>
  <li>Không tìm thấy → throw <code>NullInjectorError</code>.</li>
</ol>

<h3>Khai báo provider ở component-level → instance riêng</h3>
<pre><code>@Component({
  selector: <span class="c-string">'app-tab'</span>,
  providers: [TabStore],   <span class="c-comment">// MỖI &lt;app-tab&gt; có một TabStore riêng</span>
  /* ... */
})</code></pre>

<p>Nếu cha có 5 thẻ <code>&lt;app-tab&gt;</code>, có 5 instance <code>TabStore</code> độc lập. State của tab này không lẫn với tab khác. Đây là cách bạn có "store cục bộ" mà không cần thư viện ngoài.</p>

<div class="example-label">Ví dụ thực tế — form wizard</div>
<pre><code>@Component({
  selector: <span class="c-string">'app-wizard'</span>,
  providers: [WizardStore],
  template: \`
    &lt;app-step1/&gt;
    &lt;app-step2/&gt;
    &lt;app-step3/&gt;
  \`
})
<span class="c-keyword">export class</span> WizardComponent {}</code></pre>

<p>Mọi <code>app-stepN</code> bên trong wizard đều inject cùng <code>WizardStore</code> — vì trong cây injector chỉ có 1 cái. Nhưng nếu có 2 wizard trên cùng trang, mỗi wizard có store riêng — state không lẫn.</p>

<h3>Lifecycle: instance theo component</h3>
<p>Khi component bị hủy, injector của nó cũng bị hủy. Mọi service được tạo ở đó cũng bị garbage collect. Service singleton ở root tồn tại đến hết app.</p>

<div class="example-label">Service tự cleanup khi component destroy</div>
<pre><code>@Injectable()
<span class="c-keyword">export class</span> WizardStore <span class="c-keyword">implements</span> OnDestroy {
  <span class="c-keyword">private</span> sub = interval(5000).subscribe(() =&gt; <span class="c-keyword">this</span>.autosave());

  ngOnDestroy() {
    <span class="c-keyword">this</span>.sub.unsubscribe();   <span class="c-comment">// gọi khi WizardComponent destroy</span>
  }
}</code></pre>

<h3>Quy tắc thực dụng</h3>
<ul>
  <li><strong>State app-wide</strong> (current user, theme, settings): <code>providedIn: 'root'</code></li>
  <li><strong>State theo feature</strong> (wizard, modal): <code>providers: [...]</code> ở component cha của feature</li>
  <li><strong>State theo item</strong> (mỗi card có store riêng): <code>providers: [...]</code> ngay component item</li>
</ul>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Cây injector song song với cây component.</li>
    <li>Resolve dependency: tìm tại chỗ → leo lên cha → đến root.</li>
    <li>Provider ở component-level = instance riêng cho mỗi instance component đó.</li>
    <li>Service "scope feature" hoặc "scope item" = pattern store cục bộ không cần lib.</li>
  </ul>
</div>`
    },
    {
      id: "09-05", n: "05",
      title: "Tree-shakable providers",
      html: `
<p><code>providedIn</code> có 3 giá trị quan trọng — mỗi cái có scope khác nhau:</p>

<table class="compare-table">
<tr><th>providedIn</th><th>Scope</th><th>Khi nào</th></tr>
<tr><td><code>'root'</code></td><td>Singleton toàn app</td><td>99% trường hợp — mặc định nên dùng</td></tr>
<tr><td><code>'platform'</code></td><td>Chia sẻ giữa nhiều Angular app cùng platform</td><td>Microfrontend, đa-app</td></tr>
<tr><td><code>'any'</code></td><td>Mỗi lazy module có instance riêng</td><td>Hiếm — lazy module isolation</td></tr>
<tr><td><code>SomeComponent</code></td><td>Scope theo component</td><td>State riêng theo feature</td></tr>
</table>

<div class="example-label">Service scope theo component — bằng providedIn</div>
<pre><code><span class="c-comment">// Cách 1: trong service</span>
@Injectable({ providedIn: WizardComponent })
<span class="c-keyword">export class</span> WizardStore { /* ... */ }

<span class="c-comment">// Cách 2: trong component (cũng OK)</span>
@Component({
  providers: [WizardStore]
})
<span class="c-keyword">export class</span> WizardComponent {}</code></pre>

<p>Cách 2 phổ biến hơn vì rõ ràng — đọc component biết ngay nó "sở hữu" service nào.</p>

<h3>Vì sao tree-shakable matters?</h3>
<p>Trước đây (Angular 5-), mọi service đăng ký trong <code>NgModule.providers</code>. Nếu module được import (kể cả không dùng service), service vẫn vào bundle.</p>

<p>Với <code>providedIn: 'root'</code>: nếu không ai <code>inject()</code> service, bundler thấy service "chết" → bỏ khỏi production bundle. App nhỏ hơn.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Mặc định: <code>providedIn: 'root'</code> — singleton, tree-shakable.</li>
    <li>Cần state cô lập theo component → <code>providers: [...]</code> ở component đó.</li>
    <li><code>'platform'</code>, <code>'any'</code> chỉ cho use case microfrontend đặc biệt.</li>
  </ul>
</div>`
    },
    {
      id: "09-06", n: "06",
      title: "InjectionToken — chi tiết",
      html: `
<p><code>InjectionToken</code> là cách <strong>type-safe</strong> tạo token cho giá trị không phải class — config, constants, factory result.</p>

<div class="example-label">Tạo token đơn giản</div>
<pre><code><span class="c-keyword">export const</span> MAX_RETRIES = <span class="c-keyword">new</span> InjectionToken&lt;number&gt;(<span class="c-string">'MAX_RETRIES'</span>);
<span class="c-keyword">export const</span> API_URL = <span class="c-keyword">new</span> InjectionToken&lt;string&gt;(<span class="c-string">'API_URL'</span>);
<span class="c-keyword">export const</span> FEATURE_FLAGS = <span class="c-keyword">new</span> InjectionToken&lt;Record&lt;string, boolean&gt;&gt;(<span class="c-string">'FEATURE_FLAGS'</span>);</code></pre>

<p>Tham số string là <em>description</em> — chỉ dùng cho debug, không phải định danh thực sự (định danh là chính object).</p>

<h3>Token có default value (factory)</h3>
<pre><code><span class="c-keyword">export const</span> MAX_RETRIES = <span class="c-keyword">new</span> InjectionToken&lt;number&gt;(<span class="c-string">'MAX_RETRIES'</span>, {
  providedIn: <span class="c-string">'root'</span>,
  factory: () =&gt; 3   <span class="c-comment">// nếu không ai provide khác, default 3</span>
});</code></pre>

<p>Factory chạy khi inject lần đầu. Có thể dùng <code>inject()</code> bên trong:</p>
<pre><code><span class="c-keyword">export const</span> CURRENT_USER = <span class="c-keyword">new</span> InjectionToken&lt;User&gt;(<span class="c-string">'CURRENT_USER'</span>, {
  providedIn: <span class="c-string">'root'</span>,
  factory: () =&gt; inject(AuthService).currentUser
});</code></pre>

<h3>Multi token — gom nhiều provider</h3>
<pre><code><span class="c-keyword">export const</span> VALIDATORS = <span class="c-keyword">new</span> InjectionToken&lt;Validator[]&gt;(<span class="c-string">'VALIDATORS'</span>);

providers: [
  { provide: VALIDATORS, useValue: requiredValidator, multi: <span class="c-keyword">true</span> },
  { provide: VALIDATORS, useValue: emailValidator, multi: <span class="c-keyword">true</span> },
  { provide: VALIDATORS, useValue: minLengthValidator, multi: <span class="c-keyword">true</span> }
]</code></pre>

<pre><code>@Injectable({ providedIn: <span class="c-string">'root'</span> })
<span class="c-keyword">export class</span> FormValidator {
  <span class="c-keyword">private</span> validators = inject(VALIDATORS);

  validate(value: unknown) {
    <span class="c-keyword">return this</span>.validators.every(v =&gt; v(value));
  }
}</code></pre>

<p>Đây là pattern Angular Router dùng cho <code>ROUTES</code>, HttpClient dùng cho interceptor.</p>

<h3>Optional inject</h3>
<pre><code><span class="c-keyword">const</span> debug = inject(DEBUG_FLAG, { optional: <span class="c-keyword">true</span> }) ?? <span class="c-keyword">false</span>;</code></pre>

<p>Nếu không ai provide DEBUG_FLAG, trả về <code>null</code> (không throw).</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>InjectionToken&lt;T&gt;</code> cho config / primitive, type-safe.</li>
    <li><code>factory</code> default value để tránh phải provide tay.</li>
    <li><code>multi: true</code> để gom nhiều provider thành mảng.</li>
    <li><code>optional: true</code> nếu inject có thể null.</li>
  </ul>
</div>`
    },
    {
      id: "09-07", n: "07",
      title: "@Optional, @Self, @SkipSelf",
      html: `
<p>3 modifier điều khiển <em>cách</em> Angular tìm provider khi inject. Mặc định Angular leo cả cây injector — đa số trường hợp đúng. 3 decorator này thay đổi hành vi:</p>

<table class="compare-table">
<tr><th>Modifier</th><th>Hành vi</th><th>Khi nào</th></tr>
<tr><td><code>@Optional()</code></td><td>Không có cũng không sao (null)</td><td>Plugin, optional config</td></tr>
<tr><td><code>@Self()</code></td><td>Chỉ tìm trong injector của chính component</td><td>Đảm bảo dùng provider local</td></tr>
<tr><td><code>@SkipSelf()</code></td><td>Bỏ qua chính mình, tìm tổ tiên</td><td>Khi cần "bố tôi", không phải "tôi"</td></tr>
<tr><td><code>@Host()</code></td><td>Chỉ tìm đến host component</td><td>Directive scope theo host</td></tr>
</table>

<h3>Cú pháp với inject() (khuyến nghị)</h3>
<pre><code><span class="c-keyword">private</span> log = inject(Logger, { optional: <span class="c-keyword">true</span> });
<span class="c-keyword">private</span> parent = inject(TabStore, { skipSelf: <span class="c-keyword">true</span> });
<span class="c-keyword">private</span> own = inject(MyService, { self: <span class="c-keyword">true</span> });
<span class="c-keyword">private</span> hostOnly = inject(FormGroup, { host: <span class="c-keyword">true</span> });

<span class="c-comment">// kết hợp:</span>
<span class="c-keyword">private</span> debug = inject(DEBUG_FLAG, { optional: <span class="c-keyword">true</span>, skipSelf: <span class="c-keyword">true</span> });</code></pre>

<h3>Ví dụ thực tế — @Optional</h3>
<pre><code>@Injectable({ providedIn: <span class="c-string">'root'</span> })
<span class="c-keyword">export class</span> AnalyticsService {
  <span class="c-keyword">private</span> logger = inject(Logger, { optional: <span class="c-keyword">true</span> });

  track(event: string) {
    <span class="c-keyword">this</span>.logger?.log(\`Tracked: \${event}\`);
    <span class="c-comment">// Vẫn chạy được dù không có Logger</span>
  }
}</code></pre>

<h3>Ví dụ thực tế — @SkipSelf cho parent store</h3>
<pre><code>@Injectable()
<span class="c-keyword">export class</span> NestedTabStore {
  <span class="c-keyword">private</span> parent = inject(NestedTabStore, { skipSelf: <span class="c-keyword">true</span>, optional: <span class="c-keyword">true</span> });

  notify(data: unknown) {
    <span class="c-comment">// xử lý local, sau đó báo cha</span>
    <span class="c-keyword">this</span>.parent?.notify(data);
  }
}</code></pre>

<h3>Ví dụ thực tế — @Self cho component bắt buộc cấu hình</h3>
<pre><code>@Component({
  selector: <span class="c-string">'app-form-field'</span>,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: FormFieldComponent }]
})
<span class="c-keyword">export class</span> FormFieldComponent {
  <span class="c-keyword">private</span> control = inject(NgControl, { self: <span class="c-keyword">true</span>, optional: <span class="c-keyword">true</span> });
}</code></pre>

<div class="callout"><strong>Cảnh báo từ giảng viên:</strong> 99% trường hợp bạn KHÔNG cần các modifier này — DI mặc định đủ. Chỉ dùng khi có lý do kiến trúc rất cụ thể. Lạm dụng → code khó hiểu.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Mặc định Angular leo cả cây — đúng 99% trường hợp.</li>
    <li><code>{ optional: true }</code> để tránh crash khi không có.</li>
    <li><code>{ skipSelf: true }</code> để skip chính mình, lấy từ cha.</li>
    <li>Ưu tiên cú pháp <code>inject(X, { ... })</code> hơn decorator riêng lẻ.</li>
  </ul>
</div>`
    },
    {
      id: "09-08", n: "08",
      title: "@Host và kết chương DI",
      html: `
<p><code>@Host()</code> giới hạn việc tra cứu đến component <strong>chứa directive</strong> (host) — không leo cao hơn. Hữu ích khi viết directive muốn dùng service do host định nghĩa, không "trèo" lên đến grandparent.</p>

<div class="example-label">Ví dụ — directive cần FormGroup từ host</div>
<pre><code>@Directive({ selector: <span class="c-string">'[appFieldHelper]'</span>, standalone: <span class="c-keyword">true</span> })
<span class="c-keyword">export class</span> FieldHelperDirective {
  <span class="c-keyword">constructor</span>(@Host() <span class="c-keyword">private</span> form: FormGroupDirective) {
    <span class="c-comment">// chỉ chấp nhận form trực tiếp chứa directive này</span>
  }
}</code></pre>

<h3>Kết chương DI — checklist hiểu sâu</h3>
<p>Sau chương này, bạn nên:</p>
<ol>
  <li>Hiểu DI là gì và tại sao tốt hơn tự new.</li>
  <li>Biết 4 dạng provider (useClass/useValue/useExisting/useFactory).</li>
  <li>Biết InjectionToken, multi token.</li>
  <li>Hiểu cây injector phân cấp và quy tắc resolve.</li>
  <li>Biết khi nào provide ở root vs component-level.</li>
  <li>Biết @Optional, @Self, @SkipSelf — và biết khi nào KHÔNG dùng.</li>
  <li>Dùng được <code>inject()</code> cho code mới.</li>
</ol>

<div class="callout"><strong>Pattern thực tế quan trọng nhất từ chương DI:</strong>
<ul>
  <li>Service singleton: <code>@Injectable({ providedIn: 'root' })</code></li>
  <li>Store cục bộ theo feature: <code>@Component({ providers: [FeatureStore] })</code></li>
  <li>Config: <code>InjectionToken</code> với factory default</li>
  <li>Plugin: multi token với <code>multi: true</code></li>
  <li>Custom hook: function dùng <code>inject()</code> bên trong</li>
</ul>
</div>`
    }
  ]
},
/* =================== SECTION 10 =================== */
{
  id: "s10", n: "10", title: "Change Detection",
  lessons: [
    {
      id: "10-01", n: "01",
      title: "Default Change Detection — hoạt động ra sao",
      html: `
<p>Câu hỏi cốt lõi của framework reactive: <em>khi state đổi, làm sao DOM cập nhật?</em></p>

<p>Angular dùng cách rất khác React/Vue. Không phải dirty checking thủ công, không phải proxy reactive — Angular chạy <strong>change detection (CD)</strong> sau MỌI sự kiện browser. Cơ chế này dựa trên <strong>Zone.js</strong>.</p>

<h3>Zone.js là gì?</h3>
<p>Khi app start, Zone.js <strong>patch</strong> mọi async API của browser:</p>
<ul>
  <li><code>setTimeout</code>, <code>setInterval</code></li>
  <li><code>addEventListener</code> (mọi DOM event)</li>
  <li><code>XMLHttpRequest</code>, <code>fetch</code></li>
  <li><code>Promise.then</code></li>
  <li>WebSocket message, IndexedDB callback…</li>
</ul>

<p>Khi bất kỳ async nào hoàn tất, Zone báo cho Angular: "có sự kiện xảy ra". Angular phản ứng bằng cách chạy <strong>tick()</strong>:</p>

<ol>
  <li>Bắt đầu từ root component.</li>
  <li>Duyệt cây component <em>theo thứ tự DFS</em>.</li>
  <li>Với mỗi component: đánh giá lại mọi binding trong template, so sánh với giá trị cũ.</li>
  <li>Nếu khác → cập nhật DOM tương ứng.</li>
</ol>

<h3>Vì sao mọi binding đều phải check?</h3>
<p>JavaScript object là mutable. Nếu user click button và button-handler set <code>this.user.name = 'New'</code>, Angular không thể biết "user đã đổi" — không có proxy, không có observer. Vì thế <strong>cách an toàn duy nhất</strong>: check tất cả binding sau mỗi event.</p>

<div class="example-label">Visualize</div>
<pre><code>User click → Zone báo Angular → tick()
  ├─ AppComponent: check {{ x }}, [y]="z"
  ├─ HeaderComponent: check {{ user.name }}
  └─ DashboardComponent
       ├─ check {{ count }}
       └─ ChartComponent: check [data]="chartData"</code></pre>

<h3>Nhanh hay chậm?</h3>
<p>Đa số app đủ nhanh. Cây 100-300 component, mỗi component vài binding — tick chạy &lt;5ms, người dùng không cảm nhận được.</p>

<p>Bottleneck xuất hiện khi:</p>
<ul>
  <li>Cây 1000+ component (data table khổng lồ).</li>
  <li>Binding gọi method nặng: <code>{{ heavyCalculation() }}</code> (chạy lại MỖI tick).</li>
  <li>Event tần suất cao: scroll, mousemove, animation frame.</li>
</ul>

<div class="callout"><strong>Lời khuyên giảng viên:</strong> đừng vội chuyển sang OnPush. Default CD đủ tốt cho 90% app. Chỉ tối ưu khi có bằng chứng (profile cho thấy CD &gt;16ms).</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Zone.js patch mọi async → báo Angular chạy tick sau mỗi event.</li>
    <li>Mỗi tick: duyệt cả cây component, đánh giá binding.</li>
    <li>Default CD đủ nhanh cho hầu hết app — đừng tối ưu sớm.</li>
  </ul>
</div>`
    },
    {
      id: "10-02", n: "02",
      title: "OnPush Change Detection",
      html: `
<p>OnPush là chiến lược "lười" hơn: component <strong>không tự động check</strong>. Chỉ check khi:</p>
<ol>
  <li><strong>@Input đổi tham chiếu</strong> (không phải đổi nội bộ).</li>
  <li><strong>Event xảy ra trong template của component</strong> (vd: click trên button của nó).</li>
  <li><strong>async pipe phát giá trị mới</strong>.</li>
  <li>Bạn gọi <code>ChangeDetectorRef.markForCheck()</code> thủ công.</li>
  <li>(Angular 17+) Một <strong>signal</strong> mà template phụ thuộc đổi giá trị.</li>
</ol>

<h3>Cách bật OnPush</h3>
<pre><code><span class="c-keyword">import</span> { Component, ChangeDetectionStrategy } <span class="c-keyword">from</span> <span class="c-string">'@angular/core'</span>;

@Component({
  selector: <span class="c-string">'app-card'</span>,
  changeDetection: ChangeDetectionStrategy.OnPush,
  /* ... */
})</code></pre>

<h3>Bẫy lớn: mutate object input không trigger update</h3>
<pre><code>@Component({
  selector: <span class="c-string">'app-card'</span>,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`&lt;p&gt;{{ user.name }}&lt;/p&gt;\`
})
<span class="c-keyword">export class</span> Card {
  @Input() user!: User;
}

<span class="c-comment">// trong cha:</span>
update() {
  <span class="c-keyword">this</span>.user.name = <span class="c-string">'New name'</span>;   <span class="c-comment">// ❌ MUTATE — OnPush không phát hiện!</span>
  <span class="c-comment">// app-card vẫn hiển thị tên cũ.</span>
}</code></pre>

<p>Cách đúng — tạo object mới:</p>
<pre><code>update() {
  <span class="c-keyword">this</span>.user = { ...<span class="c-keyword">this</span>.user, name: <span class="c-string">'New name'</span> };   <span class="c-comment">// ✓ object mới, OnPush check</span>
}</code></pre>

<h3>Vì sao OnPush nhanh?</h3>
<p>Nếu một nhánh không có input đổi và không có event — cả nhánh đó được <strong>skip</strong> trong tick. Cây 1000 component, có 50 OnPush — chỉ 50 cây con cần check. Còn lại bypass.</p>

<div class="example-label">Visualize</div>
<pre><code>tick() bắt đầu...
├─ App (default)        → check
│   ├─ Header (default) → check
│   └─ Dashboard (OnPush, không có input đổi) → SKIP toàn bộ subtree
│         ├─ Chart      ← không check
│         └─ Table      ← không check</code></pre>

<h3>Quy tắc xây OnPush component</h3>
<ol>
  <li><strong>Immutable input</strong>: dùng <code>{...obj}</code>, <code>[...arr]</code> khi đổi.</li>
  <li><strong>Async pipe</strong> cho mọi Observable.</li>
  <li><strong>Signal</strong> cho local state (Angular 17+).</li>
  <li><strong>Tránh side effect</strong> trong template (<code>{{ method() }}</code> chạy mỗi tick).</li>
</ol>

<div class="callout"><strong>Chiến lược hiện đại:</strong> mọi component mới → OnPush + signal. App nhanh hơn nhiều, hành vi dễ đoán hơn (không "mysterious re-render").</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>OnPush chỉ check khi: input đổi reference, event trong template, async pipe phát, markForCheck, signal đổi.</li>
    <li>Mutate object input → OnPush không trigger. Phải tạo object mới.</li>
    <li>Cách viết: input immutable + async pipe + signal.</li>
  </ul>
</div>`
    },
    {
      id: "10-03", n: "03",
      title: "OnPush + Observable — async pipe đồng hành",
      html: `
<p>OnPush hoạt động "đẹp" với Observable + async pipe vì:</p>
<ul>
  <li>async pipe gọi <code>markForCheck()</code> mỗi khi Observable phát.</li>
  <li>Không phải tự subscribe → không lo unsubscribe.</li>
  <li>Mỗi giá trị mới là reference mới → OnPush check tự nhiên.</li>
</ul>

<div class="example-label">Pattern chuẩn</div>
<pre><code>@Component({
  selector: <span class="c-string">'app-courses-page'</span>,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, CardComponent, SpinnerComponent],
  template: \`
    @if (courses\$ | async; as courses) {
      @for (c of courses; track c.id) {
        &lt;app-card [course]="c"/&gt;
      }
    } @else {
      &lt;app-spinner/&gt;
    }
  \`
})
<span class="c-keyword">export class</span> CoursesPage {
  courses\$ = inject(CoursesService).load();
}</code></pre>

<h3>So sánh: tự subscribe + OnPush</h3>
<pre><code><span class="c-comment">// ❌ Phải gọi markForCheck() tay</span>
@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
<span class="c-keyword">export class</span> Bad <span class="c-keyword">implements</span> OnInit {
  courses: Course[] = [];
  <span class="c-keyword">private</span> svc = inject(CoursesService);
  <span class="c-keyword">private</span> cd = inject(ChangeDetectorRef);

  ngOnInit() {
    <span class="c-keyword">this</span>.svc.load().subscribe(cs =&gt; {
      <span class="c-keyword">this</span>.courses = cs;
      <span class="c-keyword">this</span>.cd.markForCheck();   <span class="c-comment">// nếu quên → view không update!</span>
    });
  }
}

<span class="c-comment">// ✓ async pipe lo hết</span>
@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
<span class="c-keyword">export class</span> Good {
  courses\$ = inject(CoursesService).load();
}</code></pre>

<h3>Combo signal + OnPush (Angular 17+)</h3>
<pre><code>@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    @for (c of courses(); track c.id) {
      &lt;app-card [course]="c"/&gt;
    }
  \`
})
<span class="c-keyword">export class</span> CoursesPage {
  <span class="c-keyword">private</span> store = inject(CoursesStore);
  courses = <span class="c-keyword">this</span>.store.courses;   <span class="c-comment">// signal</span>
}</code></pre>

<p>Signal tự trigger OnPush check — không cần markForCheck, không cần async pipe.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>OnPush + async pipe + Observable = pattern chuẩn cho data từ HTTP.</li>
    <li>OnPush + signal = pattern chuẩn cho state local.</li>
    <li>Nếu phải tự subscribe trong OnPush → đừng quên <code>markForCheck()</code>.</li>
  </ul>
</div>`
    },
    {
      id: "10-04", n: "04",
      title: "@Attribute decorator",
      html: `
<p>Khác với <code>@Input</code>, <code>@Attribute</code> đọc giá trị HTML attribute <strong>chỉ một lần</strong> tại thời điểm tạo component, không reactive.</p>

<div class="example-label">Ví dụ</div>
<pre><code>@Component({ selector: <span class="c-string">'app-button'</span>, /* ... */ })
<span class="c-keyword">export class</span> Button {
  <span class="c-keyword">constructor</span>(@Attribute(<span class="c-string">'role'</span>) <span class="c-keyword">public</span> role: string) {}
}</code></pre>

<pre><code>&lt;<span class="c-tag">app-button</span> <span class="c-attr">role</span>=<span class="c-string">"primary"</span>&gt;OK&lt;/<span class="c-tag">app-button</span>&gt;</code></pre>

<h3>Khi nào dùng?</h3>
<p>Khi config KHÔNG bao giờ đổi sau init — như vai trò ngữ nghĩa, ID DOM, label tĩnh. Vì không reactive, Angular không track → tiết kiệm CPU.</p>

<table class="compare-table">
<tr><th></th><th>@Input</th><th>@Attribute</th></tr>
<tr><td>Reactive</td><td>Có</td><td>Không (đọc 1 lần)</td></tr>
<tr><td>Tham gia CD</td><td>Có</td><td>Không</td></tr>
<tr><td>Bind expression</td><td><code>[role]="x"</code></td><td>Chỉ static <code>role="primary"</code></td></tr>
<tr><td>Type</td><td>Bất kỳ</td><td>Luôn string</td></tr>
</table>

<div class="warn">Trong thực tế <code>@Attribute</code> rất ít dùng. <code>@Input</code> đủ cho gần như mọi tình huống.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>@Attribute</code> = đọc 1 lần, không reactive.</li>
    <li>Use case hẹp: config tĩnh, role/aria không đổi.</li>
    <li>Mặc định ưu tiên <code>@Input</code>.</li>
  </ul>
</div>`
    },
    {
      id: "10-05", n: "05",
      title: "ChangeDetectorRef — kiểm soát thủ công",
      html: `
<p>Khi cần kiểm soát CD ở mức thấp, inject <code>ChangeDetectorRef</code>. 4 method quan trọng:</p>

<table class="compare-table">
<tr><th>Method</th><th>Vai trò</th></tr>
<tr><td><code>markForCheck()</code></td><td>Đánh dấu component cần check ở tick kế tiếp</td></tr>
<tr><td><code>detectChanges()</code></td><td>Chạy CD ngay lập tức cho subtree (đồng bộ)</td></tr>
<tr><td><code>detach()</code></td><td>Tách component khỏi CD — không bao giờ check tự động</td></tr>
<tr><td><code>reattach()</code></td><td>Gắn lại sau detach</td></tr>
</table>

<div class="example-label">Ví dụ 1 — markForCheck với OnPush</div>
<pre><code>@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
<span class="c-keyword">export class</span> Live {
  <span class="c-keyword">private</span> cd = inject(ChangeDetectorRef);
  count = 0;

  <span class="c-keyword">constructor</span>() {
    <span class="c-comment">// Update từ ngoài Angular zone (vd: WebSocket, BroadcastChannel)</span>
    setInterval(() =&gt; {
      <span class="c-keyword">this</span>.count++;
      <span class="c-keyword">this</span>.cd.markForCheck();
    }, 1000);
  }
}</code></pre>

<div class="example-label">Ví dụ 2 — detach để tối ưu cực mạnh</div>
<p>Component vẽ canvas 60fps — không cần Angular check binding gì. Detach hoàn toàn:</p>
<pre><code>@Component({ /* ... */ })
<span class="c-keyword">export class</span> CanvasGame <span class="c-keyword">implements</span> OnInit {
  <span class="c-keyword">private</span> cd = inject(ChangeDetectorRef);

  ngOnInit() {
    <span class="c-keyword">this</span>.cd.detach();   <span class="c-comment">// Angular không bao giờ check component này</span>
    <span class="c-keyword">this</span>.startGameLoop();
  }

  showResult() {
    <span class="c-keyword">this</span>.cd.reattach();
    <span class="c-keyword">this</span>.cd.detectChanges();   <span class="c-comment">// chỉ check 1 lần khi cần</span>
  }
}</code></pre>

<div class="example-label">Ví dụ 3 — throttle update từ data nhiều</div>
<p>Backend đẩy data 100 lần/giây. Không cần render 100 lần — render 1 lần/giây là đủ:</p>
<pre><code>@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
<span class="c-keyword">export class</span> ThrottledLive <span class="c-keyword">implements</span> OnInit, OnDestroy {
  <span class="c-keyword">private</span> cd = inject(ChangeDetectorRef);
  data: Item[] = [];
  <span class="c-keyword">private</span> sub?: Subscription;

  ngOnInit() {
    <span class="c-keyword">this</span>.sub = <span class="c-keyword">this</span>.feed.stream\$.pipe(
      tap(item =&gt; <span class="c-keyword">this</span>.data.unshift(item)),
      throttleTime(1000)
    ).subscribe(() =&gt; <span class="c-keyword">this</span>.cd.markForCheck());
  }

  ngOnDestroy() { <span class="c-keyword">this</span>.sub?.unsubscribe(); }
}</code></pre>

<div class="warn"><strong>Cảnh báo:</strong> ChangeDetectorRef là "công cụ cuối cùng". Trong 95% trường hợp, dùng async pipe + signal đủ rồi. Lạm dụng <code>detach</code>/<code>detectChanges</code> dẫn đến code khó debug.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>markForCheck()</code>: hẹn check ở tick kế tiếp.</li>
    <li><code>detectChanges()</code>: chạy CD ngay (đồng bộ).</li>
    <li><code>detach()/reattach()</code>: tách subtree khỏi CD — cho hiệu năng cực cao.</li>
    <li>Đây là last resort — ưu tiên async pipe / signal trước.</li>
  </ul>
</div>`
    }
  ]
},

/* =================== SECTION 11 =================== */
{
  id: "s11", n: "11", title: "Lifecycle Hooks",
  lessons: [
    {
      id: "11-01", n: "01",
      title: "ngOnInit và ngOnDestroy",
      html: `
<p>2 lifecycle hook dùng nhiều nhất. Hiểu chính xác khi nào chạy là điều kiện để viết component không leak.</p>

<h3>ngOnInit</h3>
<p>Chạy <strong>1 lần</strong>, sau:</p>
<ul>
  <li>Constructor đã chạy.</li>
  <li>Mọi @Input đã được set.</li>
  <li>Trước CD đầu tiên (template chưa render xong).</li>
</ul>

<p>Là nơi đặt logic init phụ thuộc input — vd: load data dựa trên @Input userId.</p>

<div class="example-label">Pattern phổ biến</div>
<pre><code>@Component({ /* ... */ })
<span class="c-keyword">export class</span> UserProfile <span class="c-keyword">implements</span> OnInit {
  @Input() userId!: string;
  user: User | <span class="c-keyword">null</span> = <span class="c-keyword">null</span>;

  <span class="c-keyword">private</span> svc = inject(UserService);

  ngOnInit() {
    <span class="c-keyword">this</span>.svc.load(<span class="c-keyword">this</span>.userId).subscribe(u =&gt; <span class="c-keyword">this</span>.user = u);
  }
}</code></pre>

<h3>ngOnDestroy</h3>
<p>Chạy <strong>1 lần</strong> ngay trước khi component bị xoá khỏi DOM. Là nơi cleanup:</p>
<ul>
  <li>Unsubscribe Observable.</li>
  <li><code>clearInterval / clearTimeout</code>.</li>
  <li>Disconnect WebSocket / BroadcastChannel.</li>
  <li>Remove event listener trên window/document.</li>
</ul>

<div class="example-label">Cleanup subscription</div>
<pre><code>@Component({ /* ... */ })
<span class="c-keyword">export class</span> Live <span class="c-keyword">implements</span> OnInit, OnDestroy {
  <span class="c-keyword">private</span> sub?: Subscription;

  ngOnInit() {
    <span class="c-keyword">this</span>.sub = interval(1000).subscribe(t =&gt; console.log(<span class="c-string">'tick'</span>, t));
  }

  ngOnDestroy() {
    <span class="c-keyword">this</span>.sub?.unsubscribe();
  }
}</code></pre>

<h3>Cách hiện đại — takeUntilDestroyed (Angular 16+)</h3>
<pre><code>@Component({ /* ... */ })
<span class="c-keyword">export class</span> Live {
  ngOnInit() {
    interval(1000)
      .pipe(takeUntilDestroyed(<span class="c-keyword">this</span>.destroyRef))
      .subscribe(t =&gt; console.log(<span class="c-string">'tick'</span>, t));
  }

  <span class="c-keyword">private</span> destroyRef = inject(DestroyRef);
}</code></pre>

<p>Hoặc thậm chí gọi từ field initializer (constructor context):</p>
<pre><code>@Component({ /* ... */ })
<span class="c-keyword">export class</span> Live {
  count\$ = interval(1000).pipe(takeUntilDestroyed());
  <span class="c-comment">// Tự cleanup, không cần OnDestroy</span>
}</code></pre>

<div class="callout"><strong>Code hiện đại:</strong> ưu tiên <code>takeUntilDestroyed()</code> hoặc <code>async</code> pipe — không phải tự khai báo OnDestroy. Nhưng vẫn cần OnDestroy cho cleanup không phải Observable (timer, listener, third-party).</div>

<h3>Bẫy: gọi inject() trong ngOnInit?</h3>
<p>KHÔNG. <code>inject()</code> chỉ dùng được trong injection context (constructor, field initializer, factory). Trong ngOnInit là <strong>quá muộn</strong> — phải lưu ref từ constructor.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>ngOnInit chạy 1 lần sau khi @Input set, trước CD đầu.</li>
    <li>ngOnDestroy: unsubscribe, clearInterval, remove listener.</li>
    <li>Code mới: dùng <code>takeUntilDestroyed</code> để tránh boilerplate OnDestroy.</li>
    <li>inject() trong ngOnInit không hoạt động — phải gọi từ constructor.</li>
  </ul>
</div>`
    },
    {
      id: "11-02", n: "02",
      title: "ngOnChanges",
      html: `
<p>Chạy <strong>mỗi khi</strong> bất kỳ <code>@Input</code> nào đổi tham chiếu. Object <code>SimpleChanges</code> chứa thông tin về từng input đã đổi.</p>

<div class="example-label">Cú pháp</div>
<pre><code>ngOnChanges(changes: SimpleChanges) {
  <span class="c-keyword">if</span> (changes[<span class="c-string">'userId'</span>]) {
    <span class="c-keyword">const</span> { previousValue, currentValue, firstChange } = changes[<span class="c-string">'userId'</span>];
    console.log(<span class="c-string">'userId đổi từ'</span>, previousValue, <span class="c-string">'thành'</span>, currentValue);

    <span class="c-keyword">if</span> (!firstChange) {
      <span class="c-keyword">this</span>.load(currentValue);
    }
  }
}</code></pre>

<p><code>SimpleChange</code> có 3 thuộc tính:</p>
<ul>
  <li><code>previousValue</code> — giá trị cũ</li>
  <li><code>currentValue</code> — giá trị mới</li>
  <li><code>firstChange</code> — true nếu đây là lần set đầu</li>
</ul>

<h3>ngOnChanges chạy TRƯỚC ngOnInit</h3>
<pre><code>ngOnChanges(c) { console.log(<span class="c-string">'ngOnChanges'</span>); }   <span class="c-comment">// 1</span>
ngOnInit() { console.log(<span class="c-string">'ngOnInit'</span>); }              <span class="c-comment">// 2</span></code></pre>

<p>Vì thế nếu cần khởi tạo data dựa trên input, có thể dùng ngOnChanges (thay vì ngOnInit):</p>

<pre><code>ngOnChanges(c: SimpleChanges) {
  <span class="c-keyword">if</span> (c[<span class="c-string">'userId'</span>]) {
    <span class="c-keyword">this</span>.load(<span class="c-keyword">this</span>.userId);
  }
}
<span class="c-comment">// Khi userId đổi, tự load. Không cần ngOnInit.</span></code></pre>

<h3>Bẫy: chỉ trigger khi reference đổi</h3>
<pre><code><span class="c-comment">// Trong cha:</span>
<span class="c-keyword">this</span>.user.name = <span class="c-string">'New'</span>;   <span class="c-comment">// ❌ ngOnChanges KHÔNG chạy — cùng object reference</span>
<span class="c-keyword">this</span>.user = { ...<span class="c-keyword">this</span>.user, name: <span class="c-string">'New'</span> };   <span class="c-comment">// ✓ object mới, ngOnChanges chạy</span></code></pre>

<h3>So sánh với input setter</h3>
<table class="compare-table">
<tr><th></th><th>ngOnChanges</th><th>Input setter</th></tr>
<tr><td>Một input cụ thể</td><td>Phải <code>if (changes['x'])</code></td><td>Setter chạy thẳng</td></tr>
<tr><td>Nhiều input cùng đổi</td><td>Bắt được trong cùng call</td><td>Mỗi setter chạy riêng</td></tr>
<tr><td>Có previousValue</td><td>Có</td><td>Không tự nhiên</td></tr>
<tr><td>Đẹp với 1-2 input</td><td>Hơi rườm</td><td>Sạch hơn</td></tr>
</table>

<div class="warn"><strong>Code mới — tránh ngOnChanges.</strong> Dùng <em>signal input</em> + <code>computed</code> hoặc <code>effect</code> (chương 18). Sạch hơn rất nhiều — không có magic SimpleChanges, không nhầm firstChange.</div>

<div class="example-label">Cách hiện đại</div>
<pre><code>userId = input.required&lt;string&gt;();
user   = computed(() =&gt; <span class="c-keyword">this</span>.svc.load(<span class="c-keyword">this</span>.userId()));   <span class="c-comment">// reactive tự nhiên</span></code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>ngOnChanges chạy mỗi lần @Input đổi <em>tham chiếu</em>.</li>
    <li>Phải check <code>changes['propName']</code> trước khi xử lý.</li>
    <li>Mutate object → ngOnChanges KHÔNG chạy.</li>
    <li>Code mới ưu tiên signal input + computed/effect.</li>
  </ul>
</div>`
    },
    {
      id: "11-03", n: "03",
      title: "ngAfterContentChecked — bẫy thường gặp",
      html: `
<p>Chạy sau mỗi lần <em>nội dung được chiếu (content)</em> được check. Tức là chạy <strong>nhiều lần</strong> trong vòng đời component — sau MỖI tick có ảnh hưởng đến nội dung chiếu.</p>

<div class="example-label">Khi nào chạy</div>
<pre><code>1. Sau khi @ContentChild được set lần đầu  → ngAfterContentInit (1 lần) → ngAfterContentChecked
2. Mỗi tick CD ảnh hưởng đến content      → ngAfterContentChecked</code></pre>

<h3>Bẫy lớn: ExpressionChangedAfterItHasBeenCheckedError</h3>
<p>Không bao giờ <strong>thay đổi state mà template/content đang phụ thuộc</strong> trong hook này — sẽ throw lỗi nổi tiếng.</p>

<div class="warn">
<pre><code><span class="c-comment">// ❌ SAI — gây vòng lặp vô tận hoặc lỗi</span>
ngAfterContentChecked() {
  <span class="c-keyword">this</span>.itemCount = <span class="c-keyword">this</span>.items.length;   <span class="c-comment">// nếu template có {{ itemCount }} → throw</span>
}</code></pre>
<p><strong>Lý do:</strong> Angular vừa hoàn tất CD pass và commit value cũ. Bạn đổi ngay → vòng kế thấy "khác lúc trước" → throw để chống vòng lặp.</p>
</div>

<h3>Use case hợp lệ — read-only đo đạc</h3>
<pre><code>ngAfterContentChecked() {
  <span class="c-comment">// Chỉ đo, không sửa state mà template phụ thuộc</span>
  console.log(<span class="c-string">'Số tab hiện tại:'</span>, <span class="c-keyword">this</span>.tabs.length);
}</code></pre>

<h3>Workaround khi cần đổi state</h3>
<pre><code>ngAfterContentChecked() {
  setTimeout(() =&gt; {
    <span class="c-keyword">this</span>.itemCount = <span class="c-keyword">this</span>.items.length;   <span class="c-comment">// đẩy ra microtask</span>
  });
}</code></pre>

<p>Hoặc dùng <code>ChangeDetectorRef.detectChanges()</code> để force CD chạy lại trước khi value commit. Nhưng cách này tốn CPU.</p>

<div class="callout"><strong>Lời khuyên thực dụng:</strong> hiếm khi bạn cần ngAfterContentChecked. Nếu thấy mình dùng nó, hãy hỏi: liệu computed signal hoặc Observable.pipe(map(...)) có giải quyết được không?</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Chạy sau MỖI tick có content check — rất thường xuyên.</li>
    <li>KHÔNG modify state mà template phụ thuộc → ExpressionChangedError.</li>
    <li>Hợp lệ chỉ cho đo/log; modify phải qua setTimeout.</li>
    <li>95% trường hợp KHÔNG cần hook này.</li>
  </ul>
</div>`
    },
    {
      id: "11-04", n: "04",
      title: "ngAfterViewChecked — bẫy thường gặp",
      html: `
<p>Anh em sinh đôi của <code>ngAfterContentChecked</code>, nhưng cho <em>view</em> (template của chính component). Cùng nguy hiểm.</p>

<h3>Khi nào chạy</h3>
<ol>
  <li>Sau khi ViewChild được set lần đầu → <code>ngAfterViewInit</code> (1 lần) → <code>ngAfterViewChecked</code>.</li>
  <li>Mỗi tick CD ảnh hưởng đến view → <code>ngAfterViewChecked</code>.</li>
</ol>

<h3>Use case hợp lệ duy nhất</h3>
<p>Đo DOM thực — cần biết kích thước/vị trí element <em>sau khi</em> Angular đã commit DOM:</p>

<pre><code>@Component({ /* ... */ })
<span class="c-keyword">export class</span> AutoResize <span class="c-keyword">implements</span> AfterViewChecked {
  @ViewChild(<span class="c-string">'box'</span>) box!: ElementRef;
  prevHeight = 0;

  ngAfterViewChecked() {
    <span class="c-keyword">const</span> h = <span class="c-keyword">this</span>.box.nativeElement.offsetHeight;
    <span class="c-keyword">if</span> (h !== <span class="c-keyword">this</span>.prevHeight) {
      <span class="c-keyword">this</span>.prevHeight = h;
      <span class="c-keyword">this</span>.layoutChanged.emit(h);   <span class="c-comment">// emit, không set state</span>
    }
  }
}</code></pre>

<h3>Pitfall: gọi setTimeout liên tục</h3>
<pre><code><span class="c-comment">// ❌ TỆ — chạy mỗi tick, có thể 60 lần/giây</span>
ngAfterViewChecked() {
  setTimeout(() =&gt; <span class="c-keyword">this</span>.height = <span class="c-keyword">this</span>.measure());
}</code></pre>

<p>Tốt hơn: dùng <code>ResizeObserver</code> hoặc <code>IntersectionObserver</code> ngoài Angular zone.</p>

<div class="callout"><strong>Code hiện đại:</strong> với Angular 17+, dùng <code>afterRender()</code> / <code>afterNextRender()</code> — API mới được thiết kế đúng cho post-render measurement, an toàn hơn ngAfterViewChecked.</div>

<pre><code><span class="c-keyword">import</span> { afterNextRender, afterRender } <span class="c-keyword">from</span> <span class="c-string">'@angular/core'</span>;

<span class="c-keyword">export class</span> Comp {
  <span class="c-keyword">constructor</span>() {
    afterNextRender(() =&gt; {
      <span class="c-comment">// Chạy 1 lần sau render đầu</span>
      <span class="c-keyword">const</span> h = <span class="c-keyword">this</span>.boxRef.nativeElement.offsetHeight;
    });

    afterRender(() =&gt; {
      <span class="c-comment">// Chạy sau MỖI render — như ngAfterViewChecked nhưng safer</span>
    });
  }
}</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Chạy sau mỗi tick có view check — rất thường xuyên.</li>
    <li>Use case duy nhất: đo DOM thực (height, width, position).</li>
    <li>KHÔNG modify state mà view phụ thuộc → ExpressionChangedError.</li>
    <li>Code mới: dùng <code>afterRender</code> / <code>afterNextRender</code> (Angular 17+).</li>
  </ul>
</div>`
    },
    {
      id: "11-05", n: "05",
      title: "Lifecycle Hooks — tổng quan thứ tự",
      html: `
<h3>Vòng đời đầy đủ — chạy theo thứ tự</h3>
<ol>
  <li><strong>constructor</strong> — chỉ DI/inject, không xử lý logic.</li>
  <li><strong>ngOnChanges</strong> — nếu component có @Input.</li>
  <li><strong>ngOnInit</strong> — init logic dựa trên input.</li>
  <li><strong>ngDoCheck</strong> — custom CD (rất hiếm dùng).</li>
  <li><strong>ngAfterContentInit</strong> — content (ng-content) đã có.</li>
  <li><strong>ngAfterContentChecked</strong> — sau mỗi check content.</li>
  <li><strong>ngAfterViewInit</strong> — template của chính component đã render.</li>
  <li><strong>ngAfterViewChecked</strong> — sau mỗi check view.</li>
  <li><em>… mỗi tick CD lặp lại 4-8 …</em></li>
  <li><strong>ngOnDestroy</strong> — trước khi component bị xoá.</li>
</ol>

<h3>Bảng tóm tắt — khi nào dùng cái nào</h3>
<table class="compare-table">
<tr><th>Hook</th><th>Tần suất</th><th>Dùng khi</th></tr>
<tr><td><code>ngOnInit</code></td><td>1 lần</td><td>Init logic, gọi service load data</td></tr>
<tr><td><code>ngOnChanges</code></td><td>Mỗi @Input đổi</td><td>Phản ứng với input thay đổi (cũ — ưu tiên signal input)</td></tr>
<tr><td><code>ngAfterViewInit</code></td><td>1 lần</td><td>Truy cập @ViewChild, init thư viện DOM</td></tr>
<tr><td><code>ngAfterContentInit</code></td><td>1 lần</td><td>Truy cập @ContentChild</td></tr>
<tr><td><code>ngOnDestroy</code></td><td>1 lần</td><td>Cleanup subscription, listener, timer</td></tr>
<tr><td><code>ngDoCheck</code></td><td>Mỗi tick</td><td>Hiếm — custom CD cho deep object</td></tr>
<tr><td><code>ngAfterViewChecked</code></td><td>Mỗi tick</td><td>Đo DOM (chỉ đo, không sửa)</td></tr>
<tr><td><code>ngAfterContentChecked</code></td><td>Mỗi tick</td><td>Tương tự, cho content</td></tr>
</table>

<div class="callout"><strong>Quy tắc thực dụng:</strong> 90% component bạn viết chỉ cần <code>ngOnInit</code> + <code>ngOnDestroy</code>. Các hook khác là last resort. Với code hiện đại (signal, takeUntilDestroyed, async pipe), nhiều hook có thể tránh hoàn toàn.</div>

<h3>Khác biệt: Init vs Checked</h3>
<table class="compare-table">
<tr><th></th><th>Init</th><th>Checked</th></tr>
<tr><td>Chạy mấy lần</td><td>1 lần</td><td>Mỗi tick</td></tr>
<tr><td>Khi nào</td><td>Sau setup đầu</td><td>Sau mỗi check</td></tr>
<tr><td>An toàn modify state</td><td>Tương đối</td><td>Rất nguy hiểm</td></tr>
</table>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Thứ tự: constructor → ngOnChanges → ngOnInit → AfterContentInit → AfterViewInit.</li>
    <li>90% chỉ cần ngOnInit + ngOnDestroy.</li>
    <li>Mọi *Checked hook chạy mỗi tick — cảnh giác hiệu năng và ExpressionChangedError.</li>
    <li>Code hiện đại (signal, takeUntilDestroyed, afterRender) tránh được nhiều hook.</li>
  </ul>
</div>`
    }
  ]
},

/* =================== SECTION 12 =================== */
{
  id: "s12", n: "12", title: "Modules",
  lessons: [
    {
      id: "12-01", n: "01",
      title: "NgModule — giới thiệu (legacy)",
      html: `
<p>Trước Angular 14, mọi component phải khai báo trong một <code>NgModule</code>. Module gom 4 loại "thứ":</p>
<ul>
  <li><code>declarations</code> — component, directive, pipe thuộc module</li>
  <li><code>imports</code> — module khác mà module này phụ thuộc</li>
  <li><code>providers</code> — service providers</li>
  <li><code>exports</code> — declaration nào public cho module khác dùng</li>
</ul>

<div class="example-label">Module chuẩn cũ</div>
<pre><code>@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HighlightDirective,
    FileSizePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AuthModule
  ],
  providers: [
    { provide: APP_CONFIG, useValue: { apiUrl: <span class="c-string">'/api'</span> } },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: <span class="c-keyword">true</span> }
  ],
  bootstrap: [AppComponent]
})
<span class="c-keyword">export class</span> AppModule {}</code></pre>

<h3>Vì sao Angular bỏ NgModule?</h3>
<ul>
  <li><strong>Boilerplate</strong>: thêm component → 3 chỗ phải sửa (declarations, imports component cha cần, có khi exports).</li>
  <li><strong>Khó tree-shake</strong>: import module = kéo vào tất cả declarations dù dùng hay không.</li>
  <li><strong>Khó test</strong>: phải set up TestBed với module phức tạp.</li>
  <li><strong>Học cao hơn</strong>: người mới phải hiểu khái niệm "module" trước khi viết được component đầu tiên.</li>
</ul>

<p>Standalone component (Angular 14+) loại bỏ tất cả vấn đề này. Từ Angular 17, nó là mặc định.</p>

<h3>Khi nào còn cần biết NgModule?</h3>
<ul>
  <li>Maintain code base lớn chưa migrate.</li>
  <li>Đọc tài liệu thư viện cũ (Material trước v15, NgRx trước v15…).</li>
  <li>Hiểu nguồn gốc một số khái niệm (forRoot, forChild, etc.).</li>
</ul>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Cú pháp <code>@NgModule</code> — 4 trường: declarations, imports, providers, exports.</li>
    <li>Bị thay thế bởi standalone component (chương 16).</li>
    <li>Code mới không cần module; legacy thì vẫn dùng.</li>
  </ul>
</div>`
    },
    {
      id: "12-02", n: "02",
      title: "Feature Modules và lazy loading",
      html: `
<p>Trong app NgModule cũ, chia thành nhiều module theo chức năng (auth, dashboard, settings…). Lợi ích:</p>
<ul>
  <li><strong>Lazy load</strong>: route đến mới load module → bundle initial nhỏ.</li>
  <li><strong>Tách team</strong>: mỗi team owner một module.</li>
  <li><strong>Reuse</strong>: shared module gom directive/pipe dùng nhiều nơi.</li>
</ul>

<div class="example-label">Feature module</div>
<pre><code>@NgModule({
  declarations: [LoginComponent, RegisterComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,    <span class="c-comment">// chứa &lt;router-outlet&gt; và route con</span>
    SharedModule          <span class="c-comment">// directive/pipe dùng chung</span>
  ],
  providers: [AuthService]
})
<span class="c-keyword">export class</span> AuthModule {}</code></pre>

<h3>Lazy load route</h3>
<pre><code><span class="c-comment">// app-routing.module.ts</span>
<span class="c-keyword">const</span> routes: Routes = [
  { path: <span class="c-string">''</span>, redirectTo: <span class="c-string">'home'</span>, pathMatch: <span class="c-string">'full'</span> },
  { path: <span class="c-string">'home'</span>, component: HomeComponent },
  {
    path: <span class="c-string">'auth'</span>,
    loadChildren: () =&gt;
      <span class="c-keyword">import</span>(<span class="c-string">'./auth/auth.module'</span>).then(m =&gt; m.AuthModule)
  },
  {
    path: <span class="c-string">'admin'</span>,
    loadChildren: () =&gt;
      <span class="c-keyword">import</span>(<span class="c-string">'./admin/admin.module'</span>).then(m =&gt; m.AdminModule),
    canMatch: [adminGuard]
  }
];</code></pre>

<p>Khi user vào <code>/auth/login</code> lần đầu, Angular fetch chunk <code>auth-module.js</code>, parse, tạo module, render. Trang chính KHÔNG phải tải auth code — bundle initial gọn.</p>

<h3>Cách hiện đại — không cần module</h3>
<pre><code><span class="c-comment">// auth.routes.ts (chỉ là file routes thuần)</span>
<span class="c-keyword">export const</span> AUTH_ROUTES: Routes = [
  { path: <span class="c-string">'login'</span>, component: LoginComponent },
  { path: <span class="c-string">'register'</span>, component: RegisterComponent }
];

<span class="c-comment">// app.routes.ts</span>
<span class="c-keyword">export const</span> APP_ROUTES: Routes = [
  {
    path: <span class="c-string">'auth'</span>,
    loadChildren: () =&gt; <span class="c-keyword">import</span>(<span class="c-string">'./auth/auth.routes'</span>).then(m =&gt; m.AUTH_ROUTES)
  }
];</code></pre>

<p>Standalone + route file = ít boilerplate hơn nhiều, lazy load vẫn hoạt động.</p>

<h3>Migration NgModule → Standalone</h3>
<p>Angular cung cấp schematic tự động:</p>
<pre><code>ng generate @angular/core:standalone</code></pre>

<p>3 bước:</p>
<ol>
  <li>Convert mọi declaration sang standalone.</li>
  <li>Loại bỏ NgModule không cần thiết.</li>
  <li>Refactor bootstrap (xem chương 16).</li>
</ol>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Feature module + lazy loading = pattern cũ để tách bundle.</li>
    <li>Standalone + route file = cách mới, ít boilerplate hơn.</li>
    <li>Schematic tự động chuyển đổi: <code>ng g @angular/core:standalone</code>.</li>
  </ul>
</div>`
    }
  ]
},

/* =================== SECTION 13 =================== */
{
  id: "s13", n: "13", title: "Pipes In Depth",
  lessons: [
    {
      id: "13-01", n: "01",
      title: "Custom Pipe — từng bước",
      html: `
<p>Pipe biến đổi giá trị trong template. Khi pipe built-in không đủ, viết pipe riêng — 1 file, 1 class implement <code>PipeTransform</code>.</p>

<div class="example-label">Pipe đơn giản — fileSize</div>
<pre><code>@Pipe({ name: <span class="c-string">'fileSize'</span>, standalone: <span class="c-keyword">true</span> })
<span class="c-keyword">export class</span> FileSizePipe <span class="c-keyword">implements</span> PipeTransform {
  transform(bytes: number, fraction = 1): string {
    <span class="c-keyword">if</span> (bytes &lt; 1024) <span class="c-keyword">return</span> bytes + <span class="c-string">' B'</span>;
    <span class="c-keyword">if</span> (bytes &lt; 1024 ** 2) <span class="c-keyword">return</span> (bytes / 1024).toFixed(fraction) + <span class="c-string">' KB'</span>;
    <span class="c-keyword">if</span> (bytes &lt; 1024 ** 3) <span class="c-keyword">return</span> (bytes / 1024 ** 2).toFixed(fraction) + <span class="c-string">' MB'</span>;
    <span class="c-keyword">return</span> (bytes / 1024 ** 3).toFixed(fraction) + <span class="c-string">' GB'</span>;
  }
}</code></pre>

<pre><code>&lt;<span class="c-tag">p</span>&gt;{{ file.size | <span class="c-fn">fileSize</span> }}&lt;/<span class="c-tag">p</span>&gt;
&lt;<span class="c-tag">p</span>&gt;{{ file.size | <span class="c-fn">fileSize</span>:2 }}&lt;/<span class="c-tag">p</span>&gt;</code></pre>

<div class="example-label">Pipe nhiều tham số — truncate</div>
<pre><code>@Pipe({ name: <span class="c-string">'truncate'</span>, standalone: <span class="c-keyword">true</span> })
<span class="c-keyword">export class</span> TruncatePipe <span class="c-keyword">implements</span> PipeTransform {
  transform(s: string | <span class="c-keyword">null</span> | <span class="c-keyword">undefined</span>, len = 80, suffix = <span class="c-string">'…'</span>): string {
    <span class="c-keyword">if</span> (!s) <span class="c-keyword">return</span> <span class="c-string">''</span>;
    <span class="c-keyword">return</span> s.length &lt;= len ? s : s.slice(0, len) + suffix;
  }
}</code></pre>

<pre><code>{{ description | <span class="c-fn">truncate</span>:120 }}
{{ tweet | <span class="c-fn">truncate</span>:280:<span class="c-string">'…đọc thêm'</span> }}</code></pre>

<div class="example-label">Pipe có dependency injection</div>
<pre><code>@Pipe({ name: <span class="c-string">'localCurrency'</span>, standalone: <span class="c-keyword">true</span> })
<span class="c-keyword">export class</span> LocalCurrencyPipe <span class="c-keyword">implements</span> PipeTransform {
  <span class="c-keyword">private</span> locale = inject(LOCALE_ID);

  transform(value: number): string {
    <span class="c-keyword">return new</span> Intl.NumberFormat(<span class="c-keyword">this</span>.locale, {
      style: <span class="c-string">'currency'</span>,
      currency: <span class="c-keyword">this</span>.locale === <span class="c-string">'vi'</span> ? <span class="c-string">'VND'</span> : <span class="c-string">'USD'</span>
    }).format(value);
  }
}</code></pre>

<h3>Sử dụng pipe trong standalone</h3>
<pre><code>@Component({
  standalone: <span class="c-keyword">true</span>,
  imports: [FileSizePipe, TruncatePipe]
})
<span class="c-keyword">export class</span> Page {}</code></pre>

<h3>Sử dụng pipe trong .ts (không qua template)</h3>
<pre><code>@Component({ /* ... */ })
<span class="c-keyword">export class</span> Page {
  <span class="c-keyword">private</span> truncate = inject(TruncatePipe);   <span class="c-comment">// nếu pipe đã providedIn: root</span>

  shorten(s: string) {
    <span class="c-keyword">return this</span>.truncate.transform(s, 50);
  }
}</code></pre>

<div class="callout"><strong>Mẹo type safety:</strong> nếu input có thể là <code>null/undefined</code>, khai báo signature đúng và xử lý đầu hàm — Angular template strict sẽ bắt buộc bạn làm vậy.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Pipe = class implement <code>PipeTransform</code>, có method <code>transform()</code>.</li>
    <li>Standalone pipe + import vào <code>imports</code> của component.</li>
    <li>Tham số: dấu <code>:</code> trong template — <code>{{ x | pipe:arg1:arg2 }}</code>.</li>
    <li>Có thể inject service trong pipe nếu cần.</li>
  </ul>
</div>`
    },
    {
      id: "13-02", n: "02",
      title: "Impure Pipe — cẩn thận hiệu năng",
      html: `
<p>Mặc định pipe là <strong>pure</strong>:</p>
<ul>
  <li>Chỉ chạy <code>transform()</code> khi input đổi <em>tham chiếu</em> hoặc đổi giá trị primitive.</li>
  <li>Mutate object/array bên trong → pipe KHÔNG re-run.</li>
  <li>Hiệu năng tốt — Angular cache kết quả.</li>
</ul>

<p><code>pure: false</code> biến nó thành <strong>impure</strong>:</p>
<ul>
  <li>Chạy <strong>mỗi tick CD</strong>, bất kể input có đổi hay không.</li>
  <li>Cho phép pipe phản ứng với mutation hoặc thời gian.</li>
  <li>Rất tốn — dễ trở thành bottleneck.</li>
</ul>

<div class="example-label">Ví dụ impure — live time</div>
<pre><code>@Pipe({ name: <span class="c-string">'liveTime'</span>, standalone: <span class="c-keyword">true</span>, pure: <span class="c-keyword">false</span> })
<span class="c-keyword">export class</span> LiveTimePipe <span class="c-keyword">implements</span> PipeTransform {
  transform(): string {
    <span class="c-keyword">return new</span> Date().toLocaleTimeString();
  }
}</code></pre>

<pre><code>&lt;<span class="c-tag">p</span>&gt;Bây giờ là {{ <span class="c-string">''</span> | <span class="c-fn">liveTime</span> }}&lt;/<span class="c-tag">p</span>&gt;</code></pre>

<p>Vấn đề: pipe này chạy MỖI tick CD. Mỗi click, mỗi event → recalculate. Tệ.</p>

<div class="warn"><strong>Đừng dùng impure pipe cho "live" data.</strong> Cách tốt hơn:
<ul>
  <li>Dùng signal cập nhật mỗi giây + computed pipe pure.</li>
  <li>Dùng Observable + async pipe.</li>
</ul>
</div>

<div class="example-label">Cách đúng — signal + computed</div>
<pre><code>@Component({
  template: \`&lt;p&gt;Bây giờ là {{ time() }}&lt;/p&gt;\`
})
<span class="c-keyword">export class</span> Clock {
  <span class="c-keyword">private</span> _now = signal(<span class="c-keyword">new</span> Date());
  time = computed(() =&gt; <span class="c-keyword">this</span>._now().toLocaleTimeString());

  <span class="c-keyword">constructor</span>() {
    setInterval(() =&gt; <span class="c-keyword">this</span>._now.set(<span class="c-keyword">new</span> Date()), 1000);
  }
}</code></pre>

<p>Chỉ update mỗi giây, không phải mỗi tick.</p>

<h3>Khi nào impure pipe hợp lệ?</h3>
<ul>
  <li>async pipe (Angular built-in) — phải impure để theo dõi Observable emission.</li>
  <li>Pipe filter cho mảng <em>mà không thể nào tạo array mới</em> (extreme edge case).</li>
</ul>

<p>Hầu như không bao giờ. Nếu thấy cần impure, hãy nghĩ lại pattern.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Pipe pure: chạy lại khi input đổi reference — hiệu năng tốt.</li>
    <li>Pipe impure: chạy MỖI tick — cẩn thận hiệu năng.</li>
    <li>Đừng dùng impure cho "live" data — dùng signal/Observable thay thế.</li>
  </ul>
</div>`
    }
  ]
},
/* =================== SECTION 14 =================== */
{
  id: "s14", n: "14", title: "Internationalization (i18n)",
  lessons: [
    {
      id: "14-01", n: "01",
      title: "Giới thiệu Angular i18n",
      html: `
<p>Angular i18n built-in cho phép dịch app sang nhiều ngôn ngữ <strong>tại build time</strong> — mỗi ngôn ngữ là một bundle riêng. Khác với i18n runtime (như ngx-translate), build-time i18n có ưu điểm:</p>
<ul>
  <li>Không có overhead runtime — text đã ở DOM.</li>
  <li>SEO tốt hơn — mỗi locale có HTML riêng.</li>
  <li>Bundle size nhỏ hơn (không kèm data dịch không dùng).</li>
</ul>

<p>Nhược: phải build lại để đổi text. Đối với app có dịch giả thay đổi text liên tục, xemxét runtime i18n.</p>

<h3>Đánh dấu chuỗi cần dịch</h3>
<pre><code>&lt;<span class="c-tag">h1</span> <span class="c-attr">i18n</span>&gt;Chào mừng đến với Angular&lt;/<span class="c-tag">h1</span>&gt;
&lt;<span class="c-tag">p</span> <span class="c-attr">i18n</span>=<span class="c-string">"Mô tả khóa học"</span>&gt;Đi sâu vào core API&lt;/<span class="c-tag">p</span>&gt;</code></pre>

<p>Attribute <code>i18n</code> tạm hiểu "dịch nội dung này". Tham số bên trong là <em>description</em> cho dịch giả.</p>

<h3>Dịch attribute</h3>
<pre><code>&lt;<span class="c-tag">img</span> [<span class="c-attr">src</span>]=<span class="c-string">"avatar"</span> <span class="c-attr">i18n-alt</span> <span class="c-attr">alt</span>=<span class="c-string">"Ảnh đại diện"</span>&gt;
&lt;<span class="c-tag">input</span> <span class="c-attr">i18n-placeholder</span> <span class="c-attr">placeholder</span>=<span class="c-string">"Nhập email"</span>&gt;</code></pre>

<p>Cú pháp <code>i18n-attrName</code>: dịch giá trị của attribute đó.</p>

<h3>Trích xuất file dịch</h3>
<pre><code>ng extract-i18n --output-path src/locale</code></pre>

<p>Tạo ra <code>messages.xlf</code> chứa mọi chuỗi. Bạn copy file thành <code>messages.en.xlf</code>, <code>messages.ja.xlf</code>… và giao cho dịch giả điền.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Angular i18n là build-time, mỗi locale là bundle riêng.</li>
    <li>Đánh dấu bằng attribute <code>i18n</code> hoặc <code>i18n-attrName</code>.</li>
    <li>Trích xuất bằng <code>ng extract-i18n</code>.</li>
  </ul>
</div>`
    },
    {
      id: "14-02", n: "02",
      title: "Unique ID cho chuỗi dịch",
      html: `
<p>Mặc định Angular tự tạo ID hash cho mỗi chuỗi — dựa trên text + meaning. Mỗi lần text đổi (kể cả thêm dấu chấm), ID đổi → file dịch coi như chuỗi mới, mất bản dịch cũ.</p>

<p>Để tránh, đặt ID cố định bằng <code>@@</code>:</p>

<pre><code>&lt;<span class="c-tag">h1</span> <span class="c-attr">i18n</span>=<span class="c-string">"@@homeTitle"</span>&gt;Chào mừng&lt;/<span class="c-tag">h1</span>&gt;
&lt;<span class="c-tag">p</span> <span class="c-attr">i18n</span>=<span class="c-string">"User greeting@@userGreeting"</span>&gt;Hi {{ name }}&lt;/<span class="c-tag">p</span>&gt;</code></pre>

<h3>Cú pháp đầy đủ</h3>
<p><code>i18n="meaning|description@@id"</code></p>
<table class="compare-table">
<tr><th>Phần</th><th>Ý nghĩa</th></tr>
<tr><td><code>meaning</code></td><td>Phân biệt nếu cùng text mang nghĩa khác (vd "back" động từ vs danh từ)</td></tr>
<tr><td><code>description</code></td><td>Hướng dẫn dịch giả (vd "Tooltip on save button")</td></tr>
<tr><td><code>id</code></td><td>ID cố định để giữ bản dịch khi text thay đổi</td></tr>
</table>

<div class="example-label">Ví dụ — cùng text, nghĩa khác</div>
<pre><code>&lt;<span class="c-tag">a</span> <span class="c-attr">i18n</span>=<span class="c-string">"verb|Action button@@backVerb"</span>&gt;Back&lt;/<span class="c-tag">a</span>&gt;
&lt;<span class="c-tag">span</span> <span class="c-attr">i18n</span>=<span class="c-string">"noun|Body part@@backNoun"</span>&gt;Back&lt;/<span class="c-tag">span</span>&gt;</code></pre>

<p>Tiếng Anh giống nhau, nhưng tiếng Việt khác (Quay lại / Lưng) → cần 2 ID phân biệt.</p>

<div class="callout"><strong>Best practice:</strong> luôn đặt ID rõ ràng (<code>@@homeTitle</code>) ngay từ đầu cho chuỗi quan trọng. Đỡ phải xử lý merge dịch khi refactor copy text.</div>`
    },
    {
      id: "14-03", n: "03",
      title: "Hỗ trợ số nhiều (plural)",
      html: `
<p>Cú pháp ICU MessageFormat để xử lý số ít/nhiều:</p>

<pre><code>&lt;<span class="c-tag">p</span> <span class="c-attr">i18n</span>&gt;
  {count, plural,
    =0 {không có khoá nào}
    =1 {có 1 khoá}
    other {có {{ count }} khoá}}
&lt;/<span class="c-tag">p</span>&gt;</code></pre>

<p>Tham số:</p>
<table class="compare-table">
<tr><th>Token</th><th>Ý nghĩa</th></tr>
<tr><td><code>=0, =1, =2…</code></td><td>Match chính xác con số</td></tr>
<tr><td><code>zero, one, two, few, many</code></td><td>Plural category (theo CLDR — phụ thuộc ngôn ngữ)</td></tr>
<tr><td><code>other</code></td><td>Mặc định — bắt buộc có</td></tr>
</table>

<h3>Vì sao cần plural categories?</h3>
<p>Tiếng Anh chỉ có 2 dạng: 1 vs nhiều. Tiếng Nga, Ả Rập có 5+ dạng tuỳ con số. CLDR (Common Locale Data Repository) định nghĩa rule cho mỗi ngôn ngữ.</p>

<div class="example-label">Tiếng Nga</div>
<pre><code>{count, plural,
  one  {1 курс}              <span class="c-comment">// 1, 21, 31...</span>
  few  {{{ count }} курса}    <span class="c-comment">// 2-4, 22-24...</span>
  many {{{ count }} курсов}   <span class="c-comment">// 5-20, 25-30...</span>
  other {{{ count }} курса}}</code></pre>

<p>Tiếng Việt đơn giản hơn — chỉ có <code>other</code>:</p>
<pre><code>{count, plural,
  =0 {chưa có gì}
  other {{{ count }} mục}}</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Cú pháp ICU MessageFormat — chuẩn quốc tế.</li>
    <li>Phải có nhánh <code>other</code>.</li>
    <li>Plural categories khác nhau theo ngôn ngữ — Angular tự pick đúng theo locale.</li>
  </ul>
</div>`
    },
    {
      id: "14-04", n: "04",
      title: "Alternative expressions (select)",
      html: `
<p>ICU <code>select</code> chọn nhánh dựa trên giá trị enum/string:</p>

<pre><code>&lt;<span class="c-tag">p</span> <span class="c-attr">i18n</span>&gt;
  {gender, select,
    male {Anh ấy đã đăng ký}
    female {Cô ấy đã đăng ký}
    other {Họ đã đăng ký}}
&lt;/<span class="c-tag">p</span>&gt;</code></pre>

<div class="example-label">Use case khác — role-based message</div>
<pre><code>&lt;<span class="c-tag">div</span> <span class="c-attr">i18n</span>&gt;
  {user.role, select,
    admin {Bạn có toàn quyền truy cập}
    editor {Bạn có thể chỉnh sửa nội dung}
    viewer {Bạn chỉ có thể xem}
    other {Vai trò không xác định}}
&lt;/<span class="c-tag">div</span>&gt;</code></pre>

<h3>Lồng plural và select</h3>
<pre><code>&lt;<span class="c-tag">p</span> <span class="c-attr">i18n</span>&gt;
  {gender, select,
    male {Anh ấy có {count, plural, =0 {không có khoá nào} other {{{count}} khoá}}}
    female {Cô ấy có {count, plural, =0 {không có khoá nào} other {{{count}} khoá}}}
    other {Họ có {count, plural, =0 {không có khoá nào} other {{{count}} khoá}}}}
&lt;/<span class="c-tag">p</span>&gt;</code></pre>

<p>Phức tạp nhưng cần thiết cho ngôn ngữ có biến cách giới + số (vd Pháp, Đức, Nga).</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>{var, select, ...}</code> chọn theo string/enum.</li>
    <li>Có thể lồng <code>plural</code> và <code>select</code> sâu.</li>
    <li>Phải có nhánh <code>other</code> default.</li>
  </ul>
</div>`
    },
    {
      id: "14-05", n: "05",
      title: "Build và serve nhiều ngôn ngữ",
      html: `
<h3>Cấu hình angular.json</h3>
<pre><code>{
  "projects": {
    "my-app": {
      "i18n": {
        "sourceLocale": "vi",
        "locales": {
          "en": "src/locale/messages.en.xlf",
          "ja": "src/locale/messages.ja.xlf",
          "fr": {
            "translation": "src/locale/messages.fr.xlf",
            "baseHref": "/fr/"
          }
        }
      },
      "architect": {
        "build": {
          "options": {
            "localize": true     <span class="c-comment">// build mọi locale</span>
          }
        }
      }
    }
  }
}</code></pre>

<h3>Build production</h3>
<pre><code>ng build --localize</code></pre>

<p>Output:</p>
<pre><code>dist/my-app/
├── vi/    (mặc định — sourceLocale)
├── en/
├── ja/
└── fr/</code></pre>

<p>Mỗi thư mục là 1 bundle hoàn chỉnh — chỉ kèm bản dịch của locale đó. Không có overhead "kho dịch" trong runtime.</p>

<h3>Dev với một locale</h3>
<pre><code>ng serve --configuration=en
ng serve --configuration=ja</code></pre>

<h3>Triển khai</h3>
<p>Web server (Nginx/Apache) detect language theo URL hoặc Accept-Language header và phục vụ folder tương ứng:</p>
<pre><code>location /en/ { try_files \$uri /en/index.html; }
location /ja/ { try_files \$uri /ja/index.html; }
location /    { try_files \$uri /vi/index.html; }   <span class="c-comment"># default</span></code></pre>

<div class="callout"><strong>Lựa chọn khác:</strong> nếu cần switch language runtime mà không reload, dùng <em>ngx-translate</em> hoặc <em>transloco</em>. Angular built-in không hỗ trợ runtime switch.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Build với <code>--localize</code> tạo bundle riêng cho mỗi locale.</li>
    <li>Triển khai: server route theo URL prefix.</li>
    <li>Cần switch runtime → dùng thư viện ngoài (transloco).</li>
  </ul>
</div>`
    }
  ]
},

/* =================== SECTION 15 =================== */
{
  id: "s15", n: "15", title: "Angular Elements",
  lessons: [
    {
      id: "15-01", n: "01",
      title: "Angular Elements — đóng gói component thành Custom Element",
      html: `
<p>Angular Elements cho phép bạn convert một component Angular thành <strong>Custom HTML Element</strong> chuẩn — sau đó nhúng vào bất kỳ trang nào: WordPress, React, Vue, HTML thuần.</p>

<h3>Use case</h3>
<ul>
  <li>Build "embed widget" cho khách hàng (chat box, calculator, video player).</li>
  <li>Migrate dần từ AngularJS / framework cũ — giữ component Angular mới như "đảo" trong app cũ.</li>
  <li>Microfrontend — mỗi team xuất ra một custom element độc lập.</li>
</ul>

<h3>Bước 1: cài</h3>
<pre><code>ng add @angular/elements</code></pre>

<h3>Bước 2: tạo component</h3>
<pre><code>@Component({
  selector: <span class="c-string">'my-counter'</span>,
  standalone: <span class="c-keyword">true</span>,
  encapsulation: ViewEncapsulation.ShadowDom,   <span class="c-comment">// quan trọng — cô lập CSS</span>
  template: \`
    &lt;div class="counter"&gt;
      &lt;p&gt;Count: {{ count() }}&lt;/p&gt;
      &lt;button (click)="inc()"&gt;+&lt;/button&gt;
      &lt;button (click)="dec()"&gt;-&lt;/button&gt;
    &lt;/div&gt;
  \`,
  styles: [\`
    .counter { padding: 16px; border: 1px solid #ccc; }
  \`]
})
<span class="c-keyword">export class</span> CounterWidget {
  @Input() initial = 0;
  count = signal(0);

  ngOnInit() { <span class="c-keyword">this</span>.count.set(<span class="c-keyword">this</span>.initial); }

  inc() { <span class="c-keyword">this</span>.count.update(v =&gt; v + 1); }
  dec() { <span class="c-keyword">this</span>.count.update(v =&gt; v - 1); }
}</code></pre>

<h3>Bước 3: register làm custom element</h3>
<pre><code><span class="c-comment">// main.ts</span>
<span class="c-keyword">import</span> { createApplication } <span class="c-keyword">from</span> <span class="c-string">'@angular/platform-browser'</span>;
<span class="c-keyword">import</span> { createCustomElement } <span class="c-keyword">from</span> <span class="c-string">'@angular/elements'</span>;
<span class="c-keyword">import</span> { CounterWidget } <span class="c-keyword">from</span> <span class="c-string">'./counter-widget'</span>;

(<span class="c-keyword">async</span> () =&gt; {
  <span class="c-keyword">const</span> app = <span class="c-keyword">await</span> createApplication({ providers: [] });
  <span class="c-keyword">const</span> el = createCustomElement(CounterWidget, { injector: app.injector });
  customElements.define(<span class="c-string">'my-counter'</span>, el);
})();</code></pre>

<h3>Bước 4: build và sử dụng ở bất kỳ đâu</h3>
<pre><code>ng build --output-hashing=none
<span class="c-comment"># gộp vào 1 file:</span>
cat dist/my-app/runtime.js dist/my-app/main.js &gt; widget.js</code></pre>

<pre><code>&lt;<span class="c-tag">!DOCTYPE</span> html&gt;
&lt;<span class="c-tag">html</span>&gt;
  &lt;<span class="c-tag">body</span>&gt;
    &lt;<span class="c-tag">my-counter</span> <span class="c-attr">initial</span>=<span class="c-string">"5"</span>&gt;&lt;/<span class="c-tag">my-counter</span>&gt;
    &lt;<span class="c-tag">script</span> <span class="c-attr">src</span>=<span class="c-string">"widget.js"</span>&gt;&lt;/<span class="c-tag">script</span>&gt;
  &lt;/<span class="c-tag">body</span>&gt;
&lt;/<span class="c-tag">html</span>&gt;</code></pre>

<h3>Truyền data 2 chiều</h3>
<p><strong>Vào</strong>: HTML attribute → @Input. <strong>Ra</strong>: @Output → CustomEvent. JavaScript bên ngoài listen được như event chuẩn.</p>

<pre><code>@Output() countChanged = <span class="c-keyword">new</span> EventEmitter&lt;number&gt;();</code></pre>

<pre><code>&lt;<span class="c-tag">script</span>&gt;
  document.querySelector(<span class="c-string">'my-counter'</span>).addEventListener(<span class="c-string">'countChanged'</span>, e =&gt; {
    console.log(<span class="c-string">'Count is now'</span>, e.detail);
  });
&lt;/<span class="c-tag">script</span>&gt;</code></pre>

<div class="warn"><strong>Cảnh báo size:</strong> bundle Angular Elements ít nhất ~120KB gzipped (kèm framework). Cho widget nhỏ, có thể nặng hơn cần thiết. Cân nhắc Lit, Stencil, hoặc Web Components vanilla nếu chỉ cần widget đơn giản.</div>

<div class="callout"><strong>Mẹo: dùng ShadowDom encapsulation.</strong> Khi nhúng vào trang khác, CSS của họ có thể "rơi" vào widget. ShadowDom cô lập triệt để.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Angular Elements = component Angular → Custom HTML Element chuẩn.</li>
    <li>Use case: widget nhúng, microfrontend, migration dần.</li>
    <li>Bundle nặng (~120KB) — cân nhắc framework nhẹ hơn cho use case nhỏ.</li>
    <li>Dùng <code>ShadowDom</code> để cô lập CSS.</li>
  </ul>
</div>`
    }
  ]
},

/* =================== SECTION 16 =================== */
{
  id: "s16", n: "16", title: "Standalone Components",
  lessons: [
    {
      id: "16-01", n: "01",
      title: "Mở chương Standalone Components",
      html: `
<p>Standalone là <strong>thay đổi lớn nhất</strong> của Angular trong 5 năm qua. Từ Angular 14 (2022): tuỳ chọn. Từ Angular 17 (2023): mặc định khi <code>ng new</code>.</p>

<h3>Tóm gọn ý tưởng</h3>
<p>Component <strong>tự khai báo dependency</strong> — không cần NgModule. Dependency = component khác, directive, pipe.</p>

<div class="example-label">Trước (NgModule)</div>
<pre><code><span class="c-comment">// app.module.ts</span>
@NgModule({
  declarations: [AppComponent, HeaderComponent, ButtonDirective, FileSizePipe],
  imports: [CommonModule, RouterModule, FormsModule],
  bootstrap: [AppComponent]
})
<span class="c-keyword">export class</span> AppModule {}

<span class="c-comment">// app.component.ts — không tự khai báo dependency</span>
@Component({ /* ... */ })
<span class="c-keyword">export class</span> AppComponent {}</code></pre>

<div class="example-label">Sau (Standalone)</div>
<pre><code>@Component({
  selector: <span class="c-string">'app-root'</span>,
  standalone: <span class="c-keyword">true</span>,
  imports: [
    HeaderComponent,
    RouterOutlet,
    ButtonDirective,
    FileSizePipe,
    AsyncPipe,
    FormsModule
  ],
  template: \`
    &lt;app-header/&gt;
    &lt;router-outlet/&gt;
  \`
})
<span class="c-keyword">export class</span> AppComponent {}</code></pre>

<p>Mọi thứ component dùng đều liệt kê trong <code>imports</code>. Không có module trung gian.</p>

<h3>Lợi ích</h3>
<ul>
  <li><strong>Boilerplate ít hơn</strong>: không phải sửa 3 file mỗi khi thêm component.</li>
  <li><strong>Tree-shake tốt hơn</strong>: bundler thấy rõ đâu dùng đâu không.</li>
  <li><strong>Lazy load đơn giản</strong>: <code>loadComponent: () =&gt; import(...)</code> thay vì lazy module.</li>
  <li><strong>Test dễ</strong>: <code>TestBed.configureTestingModule({ imports: [MyComponent] })</code> — không cần module phụ.</li>
  <li><strong>Học dễ</strong>: người mới viết được component đầu tiên không cần hiểu module.</li>
</ul>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Standalone là mặc định từ Angular 17 — code mới nên luôn dùng.</li>
    <li>Component khai báo <code>standalone: true</code> + liệt kê <code>imports</code>.</li>
    <li>Schematic <code>ng g @angular/core:standalone</code> tự migrate code cũ.</li>
  </ul>
</div>`
    },
    {
      id: "16-02", n: "02",
      title: "Migrate bước 1 — Import dependency vào component",
      html: `
<p>Bước đầu của migration: convert từng component thành standalone, kèm theo dependency khai báo trực tiếp.</p>

<div class="example-label">Trước</div>
<pre><code>@NgModule({
  declarations: [CourseCardComponent],
  imports: [CommonModule, RouterModule, MatButtonModule],
  exports: [CourseCardComponent]
})
<span class="c-keyword">export class</span> CourseCardModule {}

<span class="c-comment">// course-card.component.ts</span>
@Component({ /* không có standalone */ })
<span class="c-keyword">export class</span> CourseCardComponent {}</code></pre>

<div class="example-label">Sau</div>
<pre><code>@Component({
  selector: <span class="c-string">'app-course-card'</span>,
  standalone: <span class="c-keyword">true</span>,
  imports: [
    CommonModule,        <span class="c-comment">// hoặc cụ thể: NgIf, NgFor, AsyncPipe</span>
    RouterLink,
    MatButton
  ],
  templateUrl: <span class="c-string">'./course-card.component.html'</span>
})
<span class="c-keyword">export class</span> CourseCardComponent {}</code></pre>

<h3>Schematic tự động</h3>
<pre><code>ng generate @angular/core:standalone</code></pre>

<p>3 lựa chọn:</p>
<ol>
  <li><strong>Convert all components</strong> — convert mọi component thành standalone.</li>
  <li><strong>Remove unnecessary modules</strong> — xoá module không cần thiết.</li>
  <li><strong>Bootstrap the application using standalone APIs</strong> — refactor main.ts.</li>
</ol>

<p>Chạy lần lượt từng bước, commit sau mỗi bước, test app vẫn chạy.</p>

<h3>Tips: import cụ thể thay vì CommonModule</h3>
<p>Để tree-shake tốt nhất, import từng directive/pipe thay vì cả CommonModule:</p>
<pre><code><span class="c-comment">// ❌ kéo cả NgIf, NgFor, NgSwitch, AsyncPipe, DatePipe...</span>
imports: [CommonModule]

<span class="c-comment">// ✓ chỉ kéo cái cần</span>
imports: [NgIf, NgFor, AsyncPipe]</code></pre>

<p>Nhưng quản lý mệt hơn. Trade-off: <code>CommonModule</code> tiện cho phát triển nhanh; cụ thể cho lib nhỏ.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Convert component: thêm <code>standalone: true</code> + chuyển dependency từ module sang <code>imports</code>.</li>
    <li>Schematic làm tự động — chạy theo 3 bước.</li>
    <li>Tree-shake tốt nhất: import cụ thể, không phải CommonModule.</li>
  </ul>
</div>`
    },
    {
      id: "16-03", n: "03",
      title: "Migrate bước 2 — Loại bỏ module không cần",
      html: `
<p>Sau khi mọi component đã standalone, các <code>NgModule</code> chỉ còn rỗng (không declarations). Schematic phát hiện và đề nghị xoá:</p>

<div class="example-label">Trước</div>
<pre><code>@NgModule({
  declarations: [],   <span class="c-comment">// đã rỗng vì component đều standalone</span>
  imports: [CommonModule, MatButtonModule],
  exports: []
})
<span class="c-keyword">export class</span> CourseCardModule {}</code></pre>

<p>→ Module này không còn ý nghĩa. Xoá.</p>

<h3>Trường hợp đặc biệt: shared module</h3>
<p>Nhiều dự án có <code>SharedModule</code> gom mọi pipe/directive dùng chung:</p>
<pre><code>@NgModule({
  declarations: [HighlightDirective, FileSizePipe, TruncatePipe],
  exports: [HighlightDirective, FileSizePipe, TruncatePipe]
})
<span class="c-keyword">export class</span> SharedModule {}</code></pre>

<p>Sau migration, các directive/pipe này standalone luôn. Mỗi nơi cần thì import trực tiếp:</p>
<pre><code>imports: [HighlightDirective, FileSizePipe]</code></pre>

<p><code>SharedModule</code> không còn cần.</p>

<h3>Tránh anti-pattern: "barrel module"</h3>
<p>Một số người tạo module <em>chỉ để</em> gom imports:</p>
<pre><code><span class="c-comment">// ❌ ANTI-PATTERN ở Angular hiện đại</span>
@NgModule({
  imports: [HighlightDirective, FileSizePipe, MatButton, MatCard, RouterLink],
  exports: [HighlightDirective, FileSizePipe, MatButton, MatCard, RouterLink]
})
<span class="c-keyword">export class</span> UiSharedModule {}</code></pre>

<p>Cách hiện đại: tạo file <code>ui-imports.ts</code> export array:</p>
<pre><code><span class="c-keyword">export const</span> UI_IMPORTS = [
  HighlightDirective, FileSizePipe, MatButton, MatCard, RouterLink
] as const;</code></pre>

<pre><code>@Component({
  imports: [...UI_IMPORTS, OtherComponent]
})</code></pre>

<p>Đơn giản hơn, không cần tạo class module rỗng.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Sau khi standalone, mọi NgModule rỗng → xoá.</li>
    <li>SharedModule → standalone trực tiếp + import trong component cần.</li>
    <li>Cần gom imports tái sử dụng → dùng const array, không phải module.</li>
  </ul>
</div>`
    },
    {
      id: "16-04", n: "04",
      title: "Migrate bước 3 — Bootstrap mới",
      html: `
<p>Trước: <code>platformBrowserDynamic().bootstrapModule(AppModule)</code>. Sau: <code>bootstrapApplication(AppComponent, { providers: [...] })</code>.</p>

<div class="example-label">main.ts cũ</div>
<pre><code><span class="c-keyword">import</span> { platformBrowserDynamic } <span class="c-keyword">from</span> <span class="c-string">'@angular/platform-browser-dynamic'</span>;
<span class="c-keyword">import</span> { AppModule } <span class="c-keyword">from</span> <span class="c-string">'./app/app.module'</span>;

platformBrowserDynamic().bootstrapModule(AppModule);</code></pre>

<div class="example-label">main.ts mới</div>
<pre><code><span class="c-keyword">import</span> { bootstrapApplication } <span class="c-keyword">from</span> <span class="c-string">'@angular/platform-browser'</span>;
<span class="c-keyword">import</span> { provideRouter } <span class="c-keyword">from</span> <span class="c-string">'@angular/router'</span>;
<span class="c-keyword">import</span> { provideHttpClient, withInterceptors } <span class="c-keyword">from</span> <span class="c-string">'@angular/common/http'</span>;
<span class="c-keyword">import</span> { provideAnimations } <span class="c-keyword">from</span> <span class="c-string">'@angular/platform-browser/animations'</span>;
<span class="c-keyword">import</span> { AppComponent } <span class="c-keyword">from</span> <span class="c-string">'./app/app.component'</span>;
<span class="c-keyword">import</span> { routes } <span class="c-keyword">from</span> <span class="c-string">'./app/app.routes'</span>;
<span class="c-keyword">import</span> { authInterceptor } <span class="c-keyword">from</span> <span class="c-string">'./app/auth/auth.interceptor'</span>;

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    { provide: APP_CONFIG, useValue: { apiUrl: <span class="c-string">'/api'</span> } }
  ]
});</code></pre>

<h3>Mỗi NgModule thư viện có hàm provideX() tương đương</h3>
<table class="compare-table">
<tr><th>Module cũ</th><th>Function mới</th></tr>
<tr><td><code>RouterModule.forRoot(routes)</code></td><td><code>provideRouter(routes)</code></td></tr>
<tr><td><code>HttpClientModule</code></td><td><code>provideHttpClient()</code></td></tr>
<tr><td><code>BrowserAnimationsModule</code></td><td><code>provideAnimations()</code></td></tr>
<tr><td><code>NoopAnimationsModule</code></td><td><code>provideNoopAnimations()</code></td></tr>
<tr><td><code>ServiceWorkerModule.register(...)</code></td><td><code>provideServiceWorker(...)</code></td></tr>
<tr><td><code>StoreModule.forRoot(...)</code></td><td><code>provideStore(...)</code></td></tr>
</table>

<h3>Nâng cấp dần — không cần làm hết một lúc</h3>
<p>Có thể giữ một số NgModule và mix với standalone — Angular hỗ trợ song song. Migration dần dần là tốt nhất:</p>
<ol>
  <li>Tuần 1: convert leaf component (không có con).</li>
  <li>Tuần 2: convert middle component.</li>
  <li>Tuần 3: convert root + bootstrap mới.</li>
  <li>Tuần 4: xoá module trống.</li>
</ol>

<h3>config file (Angular 17+)</h3>
<pre><code><span class="c-comment">// app.config.ts</span>
<span class="c-keyword">export const</span> appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
};

<span class="c-comment">// main.ts</span>
bootstrapApplication(AppComponent, appConfig);</code></pre>

<p>Tách config ra file riêng cho gọn.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>bootstrapApplication(Component, config)</code> thay <code>bootstrapModule</code>.</li>
    <li>Mỗi <code>X.forRoot()</code> có hàm <code>provideX()</code> tương đương.</li>
    <li>Migration dần — không cần làm hết một lúc.</li>
    <li>Tách config vào <code>app.config.ts</code> cho clean.</li>
  </ul>
</div>`
    }
  ]
},

/* =================== SECTION 17 =================== */
{
  id: "s17", n: "17", title: "@defer — tải template từng phần",
  lessons: [
    {
      id: "17-01", n: "01",
      title: "Mở chương @defer",
      html: `
<p><code>@defer</code> là một trong những tính năng <strong>được mong đợi nhất</strong> của Angular 17. Vấn đề nó giải quyết: <em>code splitting cấp template</em>.</p>

<h3>Vấn đề trước @defer</h3>
<p>Bundle initial của một trang gồm code mọi component user có thể thấy. Trang dashboard có:</p>
<ul>
  <li>Header, navigation — user thấy ngay.</li>
  <li>Main content — user thấy ngay.</li>
  <li>Charts ở giữa trang — user phải scroll xuống mới thấy.</li>
  <li>Modal "Settings" — user click button mới mở.</li>
  <li>Footer — user scroll đến cuối mới thấy.</li>
</ul>

<p>Trước Angular 17, mọi thứ trong template = trong bundle initial. User phải tải Charts code dù chưa cần. → bundle to → TTI chậm.</p>

<h3>Cách cũ: lazy route</h3>
<p>Trước, code splitting chỉ ở mức route — bundle theo trang. Tiến bộ nhưng không đủ: trong cùng trang có thể có Chart và Modal nặng.</p>

<h3>@defer giải quyết</h3>
<pre><code>@<span class="c-keyword">defer</span> {
  &lt;app-heavy-chart/&gt;
}</code></pre>

<p>Compiler tách <code>HeavyChart</code> + dependency của nó ra <strong>chunk JS riêng</strong>. Khi điều kiện kích hoạt → fetch chunk + render. Bundle initial nhỏ hơn rõ rệt.</p>

<h3>Trigger phong phú</h3>
<ul>
  <li><code>on idle</code> — khi browser rảnh (mặc định)</li>
  <li><code>on viewport</code> — khi cuộn vào tầm nhìn</li>
  <li><code>on interaction</code> — click/keydown</li>
  <li><code>on hover</code></li>
  <li><code>on timer</code> — sau X ms</li>
  <li><code>on immediate</code> — load ngay sau bundle chính</li>
  <li><code>when condition</code> — boolean tuỳ biến</li>
</ul>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>@defer = code splitting cấp template, không cần route lazy.</li>
    <li>Compiler tách chunk tự động.</li>
    <li>Trigger đa dạng: idle, viewport, interaction, hover, timer, custom.</li>
  </ul>
</div>`
    },
    {
      id: "17-02", n: "02",
      title: "@defer hoạt động ra sao",
      html: `
<p>Khi compiler gặp <code>@defer { ... }</code>:</p>
<ol>
  <li>Phân tích nội dung trong block — tìm mọi component, directive, pipe được dùng.</li>
  <li>Tách những thứ đó (và transitive deps) ra <strong>chunk JS riêng</strong>.</li>
  <li>Bundle initial chỉ có "placeholder" + code load chunk khi cần.</li>
  <li>Khi trigger kích hoạt → browser fetch chunk → component khởi tạo → render.</li>
</ol>

<h3>Hai loại trigger độc lập</h3>
<p>Đây là khái niệm quan trọng: <code>@defer</code> có 2 trigger riêng biệt.</p>

<table class="compare-table">
<tr><th></th><th>"on" trigger</th><th>"prefetch" trigger</th></tr>
<tr><td>Vai trò</td><td>Khi nào <em>render</em> block</td><td>Khi nào <em>tải</em> chunk JS</td></tr>
<tr><td>Cú pháp</td><td><code>@defer (on idle) { ... }</code></td><td><code>@defer (prefetch on hover; on click) { ... }</code></td></tr>
<tr><td>Mặc định</td><td>on idle</td><td>= "on" trigger nếu không có</td></tr>
</table>

<p>Vì sao tách 2 trigger? Để bạn có thể tải sớm + render muộn — UX cực mượt:</p>

<pre><code>@<span class="c-keyword">defer</span> (prefetch on hover(link); on viewport) {
  &lt;app-profile-page/&gt;
}</code></pre>

<p>User hover qua link → tải chunk (chưa render). Sau cuộn xuống thấy block → render <em>tức thì</em> (chunk đã có sẵn).</p>

<h3>Ví dụ đơn giản nhất</h3>
<pre><code>@<span class="c-keyword">defer</span> {
  &lt;app-heavy-chart [data]="chartData"/&gt;
}</code></pre>

<p>Mặc định: <code>on idle</code>. Sau khi browser tải xong tài nguyên ban đầu → idle → fetch chunk → render.</p>

<h3>Block phải tự đóng</h3>
<pre><code><span class="c-comment">// ❌ Sai cú pháp</span>
@<span class="c-keyword">defer</span>
  &lt;app-x/&gt;

<span class="c-comment">// ✓ Đúng</span>
@<span class="c-keyword">defer</span> {
  &lt;app-x/&gt;
}</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Compiler tách block @defer ra chunk JS riêng.</li>
    <li>2 trigger: <code>on</code> (render) và <code>prefetch on</code> (load).</li>
    <li>Mặc định <code>on idle</code> — sau khi browser rảnh.</li>
  </ul>
</div>`
    },
    {
      id: "17-03", n: "03",
      title: "@placeholder — hiển thị khi block chưa render",
      html: `
<p>Trước khi <code>@defer</code> render, đặt <code>@placeholder</code> để show skeleton/giữ chỗ:</p>

<pre><code>@<span class="c-keyword">defer</span> {
  &lt;app-heavy-chart/&gt;
} @<span class="c-keyword">placeholder</span> {
  &lt;div class="skeleton" style="height: 400px"&gt;&lt;/div&gt;
}</code></pre>

<h3>minimum — tránh chớp</h3>
<p>Nếu chunk load nhanh (vd 50ms), placeholder chớp xong rồi biến → cảm giác "chật vật". Dùng <code>minimum</code> để giữ placeholder ít nhất X giây:</p>

<pre><code>@<span class="c-keyword">defer</span> {
  &lt;app-heavy-chart/&gt;
} @<span class="c-keyword">placeholder</span> (minimum 500ms) {
  &lt;div class="skeleton"&gt;&lt;/div&gt;
}</code></pre>

<p>Render chuyển từ placeholder → block diễn ra ít nhất 500ms — chuyển êm hơn.</p>

<h3>Khác @loading thế nào?</h3>
<p>@placeholder hiển thị khi chunk <em>chưa được fetch</em>. @loading hiển thị khi chunk <em>đang fetch</em>. Cả hai có thể đồng thời:</p>

<pre><code>@<span class="c-keyword">defer</span> (on viewport) {
  &lt;app-comments/&gt;
} @<span class="c-keyword">placeholder</span> {
  &lt;p&gt;Cuộn xuống để xem bình luận&lt;/p&gt;
} @<span class="c-keyword">loading</span> (after 200ms; minimum 1s) {
  &lt;app-spinner/&gt;
}</code></pre>

<p>Flow: user thấy "Cuộn xuống…" → cuộn vào tầm nhìn → fetch bắt đầu → 200ms sau hiển thị spinner → load xong, render.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>@placeholder: hiển thị trước khi trigger kích hoạt.</li>
    <li><code>minimum X</code>: giữ placeholder ít nhất X (tránh flicker).</li>
    <li>Khác @loading: placeholder = chưa load, loading = đang load.</li>
  </ul>
</div>`
    },
    {
      id: "17-04", n: "04",
      title: "@loading — UX mượt",
      html: `
<p><code>@loading</code> hiển thị trong lúc fetch chunk. Có 2 tham số chính:</p>
<ul>
  <li><code>after Xms</code> — chỉ hiện loading sau X ms (tránh flicker khi fetch nhanh).</li>
  <li><code>minimum Xms</code> — hiện ít nhất X ms (tránh chớp).</li>
</ul>

<pre><code>@<span class="c-keyword">defer</span> (on viewport) {
  &lt;app-comments/&gt;
} @<span class="c-keyword">loading</span> (after 100ms; minimum 1s) {
  &lt;app-spinner/&gt;
} @<span class="c-keyword">placeholder</span> {
  &lt;p&gt;Bình luận sẽ hiện khi cuộn đến&lt;/p&gt;
}</code></pre>

<h3>Logic timing</h3>
<table class="compare-table">
<tr><th>Tình huống</th><th>after</th><th>minimum</th><th>Hành vi</th></tr>
<tr><td>Fetch &lt; 100ms</td><td>Bỏ qua loading</td><td>—</td><td>Render thẳng từ placeholder</td></tr>
<tr><td>Fetch 100-1000ms</td><td>Hiện loading</td><td>Giữ ít nhất 1s</td><td>Spinner ít nhất 1s rồi render</td></tr>
<tr><td>Fetch &gt; 1s</td><td>Hiện loading</td><td>Đã đủ</td><td>Spinner suốt đến khi xong</td></tr>
</table>

<h3>Kết hợp đầy đủ — UX hoàn hảo</h3>
<pre><code>@<span class="c-keyword">defer</span> (prefetch on hover(link); on viewport) {
  &lt;app-rich-content/&gt;
} @<span class="c-keyword">loading</span> (after 200ms; minimum 500ms) {
  &lt;app-skeleton/&gt;
} @<span class="c-keyword">placeholder</span> (minimum 100ms) {
  &lt;div class="ghost"/&gt;
} @<span class="c-keyword">error</span> {
  &lt;p&gt;Không tải được. &lt;a (click)="retry()"&gt;Thử lại&lt;/a&gt;&lt;/p&gt;
}</code></pre>

<p>Flow:</p>
<ol>
  <li>Hiển thị ghost (placeholder).</li>
  <li>User hover qua link bên trái → prefetch chunk (background).</li>
  <li>User cuộn xuống → trigger render.</li>
  <li>Nếu chunk đã có (prefetched) → render thẳng.</li>
  <li>Nếu chunk chưa có → fetch, sau 200ms hiện skeleton.</li>
  <li>Hoặc lỗi → @error block.</li>
</ol>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>after Xms</code>: tránh chớp loading khi fetch nhanh.</li>
    <li><code>minimum Xms</code>: tránh chớp khi vừa hiện đã ẩn.</li>
    <li>Kết hợp prefetch + loading + placeholder cho UX tốt nhất.</li>
  </ul>
</div>`
    },
    {
      id: "17-05", n: "05",
      title: "Trigger idle và immediate",
      html: `
<h3>on idle (mặc định)</h3>
<pre><code>@<span class="c-keyword">defer</span> { ... }
@<span class="c-keyword">defer</span> (on idle) { ... }   <span class="c-comment">// tương đương</span></code></pre>

<p>Browser sử dụng API <code>requestIdleCallback</code> để biết khi nào "rảnh" — không có user input đang xử lý, không có animation, không có script chạy. Đây là thời điểm an toàn để tải code phụ.</p>

<p>Đa số use case: dùng <code>on idle</code>. App khởi động nhanh, code phụ tải background.</p>

<h3>on immediate</h3>
<pre><code>@<span class="c-keyword">defer</span> (on immediate) {
  &lt;app-secondary-content/&gt;
}</code></pre>

<p>Tải <strong>ngay sau khi bundle chính render xong</strong> — không đợi idle. Nhanh hơn idle nhưng có thể "đè" lên render khác.</p>

<p>Use case: nội dung quan trọng-nhì (above-the-fold không phải hero) mà bạn muốn vào DOM gần như tức thì.</p>

<table class="compare-table">
<tr><th>Trigger</th><th>Khi nào tải</th><th>Use case</th></tr>
<tr><td><code>on idle</code> (default)</td><td>Browser rảnh sau initial</td><td>Đa số — không cần ngay</td></tr>
<tr><td><code>on immediate</code></td><td>Ngay sau bundle chính</td><td>Quan trọng-nhì, không thể chờ idle</td></tr>
</table>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>on idle</code> mặc định, dùng cho 80% trường hợp.</li>
    <li><code>on immediate</code> nhanh hơn nhưng có thể đè render khác.</li>
  </ul>
</div>`
    },
    {
      id: "17-06", n: "06",
      title: "Trigger timer + prefetch — pattern UX nâng cao",
      html: `
<p><code>on timer(Xs)</code> render block sau X giây kể từ khi component mount. Hữu ích cho UI chậm chạp có chủ ý.</p>

<div class="example-label">Ví dụ — banner xuất hiện sau 5 giây</div>
<pre><code>@<span class="c-keyword">defer</span> (on timer(5s)) {
  &lt;app-newsletter-popup/&gt;
}</code></pre>

<h3>Kết hợp prefetch để render mượt</h3>
<p>Power-pattern: prefetch chunk lúc khác, render lúc khác. Cả hai timer đếm độc lập từ component mount:</p>

<pre><code>@<span class="c-keyword">defer</span> (prefetch on timer(2s); on timer(5s)) {
  &lt;app-modal/&gt;
}</code></pre>

<p>Flow:</p>
<ul>
  <li><code>0s</code>: component mount.</li>
  <li><code>2s</code>: bắt đầu fetch chunk modal (background).</li>
  <li><code>~3s</code>: chunk có sẵn (giả sử 1s tải).</li>
  <li><code>5s</code>: trigger render — chunk đã sẵn → render <em>tức thì</em>.</li>
</ul>

<h3>Pattern khác — prefetch idle, render viewport</h3>
<pre><code>@<span class="c-keyword">defer</span> (prefetch on idle; on viewport) {
  &lt;app-rich-comments/&gt;
}</code></pre>

<p>Browser rảnh → tải chunk. User cuộn xuống → render mượt vì chunk có rồi.</p>

<h3>Prefetch on hover — kiểu link preload</h3>
<pre><code>&lt;<span class="c-tag">a</span> #<span class="c-attr">profileLink</span>&gt;Xem profile&lt;/<span class="c-tag">a</span>&gt;

@<span class="c-keyword">defer</span> (prefetch on hover(profileLink); on interaction(profileLink)) {
  &lt;app-profile-detail/&gt;
}</code></pre>

<p>User hover (chuột chưa click) → preload. Click → render thẳng tức thì. Cảm giác "siêu nhanh".</p>

<div class="callout"><strong>Pattern phổ biến nhất trong production:</strong>
<pre><code>prefetch on idle; on viewport
<span class="c-comment">// hoặc</span>
prefetch on hover(link); on interaction(link)</code></pre>
Cả hai đều cho UX rất mượt — chunk sẵn trước khi user cần.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>2 timer độc lập: prefetch (tải) và on (render).</li>
    <li>Cả 2 đếm từ thời điểm component mount.</li>
    <li>Pattern UX: <code>prefetch on idle; on viewport</code> hoặc <code>prefetch on hover; on interaction</code>.</li>
  </ul>
</div>`
    },
    {
      id: "17-07", n: "07",
      title: "@error — xử lý lỗi tải chunk",
      html: `
<p>Network có thể fail. Browser có thể chặn. Khi chunk không tải được, <code>@error</code> render thay block:</p>

<pre><code>@<span class="c-keyword">defer</span> (on viewport) {
  &lt;app-heavy-chart [data]="data"/&gt;
} @<span class="c-keyword">error</span> {
  &lt;div class="error-card"&gt;
    &lt;p&gt;Không tải được biểu đồ.&lt;/p&gt;
    &lt;button (click)="retry()"&gt;Thử lại&lt;/button&gt;
  &lt;/div&gt;
}</code></pre>

<h3>Retry pattern</h3>
<pre><code><span class="c-keyword">export class</span> Page {
  retry() {
    location.reload();   <span class="c-comment">// đơn giản: reload trang</span>
  }
}</code></pre>

<p>Hoặc tinh tế hơn: dùng signal để force re-render block:</p>
<pre><code>retryToken = signal(0);

retry() { <span class="c-keyword">this</span>.retryToken.update(v =&gt; v + 1); }</code></pre>

<pre><code>@<span class="c-keyword">if</span> (retryToken() &gt;= 0) {
  @<span class="c-keyword">defer</span> (on viewport) {
    &lt;app-heavy-chart/&gt;
  } @<span class="c-keyword">error</span> {
    &lt;button (click)="retry()"&gt;Thử lại&lt;/button&gt;
  }
}</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>@error chạy khi chunk fail (network, parse error...).</li>
    <li>Cung cấp UI fallback — đừng để user thấy "không gì".</li>
    <li>Pattern retry: reload hoặc force re-render bằng signal.</li>
  </ul>
</div>`
    },
    {
      id: "17-08", n: "08",
      title: "Trigger viewport — IntersectionObserver",
      html: `
<p><code>on viewport</code> render khi block vào tầm nhìn user. Bên dưới Angular dùng <code>IntersectionObserver</code> — API native, hiệu năng tốt.</p>

<h3>Trigger với element làm anchor</h3>
<pre><code>&lt;<span class="c-tag">div</span> #<span class="c-attr">marker</span>&gt;&lt;/<span class="c-tag">div</span>&gt;

@<span class="c-keyword">defer</span> (on viewport(marker)) {
  &lt;app-comments/&gt;
}</code></pre>

<p>Khi <code>#marker</code> vào tầm nhìn → trigger. <code>marker</code> có thể là element bất kỳ trong template hoặc tham chiếu khác.</p>

<h3>Trigger không có anchor</h3>
<pre><code>@<span class="c-keyword">defer</span> (on viewport) {
  &lt;app-comments/&gt;
}</code></pre>

<p>Khi không truyền anchor, Angular dùng <code>@placeholder</code> làm anchor. Nếu không có placeholder → throw lỗi compile.</p>

<h3>Pattern thực tế — infinite scroll</h3>
<pre><code>@<span class="c-keyword">for</span> (page <span class="c-keyword">of</span> pages; track page.id; let last = \$last) {
  &lt;app-page-content [page]="page"/&gt;

  @<span class="c-keyword">if</span> (last && hasMore()) {
    &lt;div #loadMore&gt;&lt;/div&gt;
    @<span class="c-keyword">defer</span> (on viewport(loadMore)) {
      &lt;ng-container *ngTemplateOutlet="loadNextPage"&gt;&lt;/ng-container&gt;
    }
  }
}</code></pre>

<p>Khi user cuộn đến cuối trang cuối cùng → trigger load page kế.</p>

<h3>Pattern — lazy section</h3>
<pre><code>&lt;<span class="c-tag">section</span>&gt;Hero&lt;/<span class="c-tag">section</span>&gt;
&lt;<span class="c-tag">section</span>&gt;About&lt;/<span class="c-tag">section</span>&gt;

&lt;<span class="c-tag">section</span> #<span class="c-attr">testimonialsAnchor</span>&gt;
  &lt;<span class="c-tag">h2</span>&gt;Khách hàng nói&lt;/<span class="c-tag">h2</span>&gt;
  @<span class="c-keyword">defer</span> (on viewport(testimonialsAnchor); prefetch on idle) {
    &lt;app-testimonials-carousel/&gt;
  } @<span class="c-keyword">placeholder</span> {
    &lt;div class="skeleton-carousel"&gt;&lt;/div&gt;
  }
&lt;/<span class="c-tag">section</span>&gt;

&lt;<span class="c-tag">section</span>&gt;Footer&lt;/<span class="c-tag">section</span>&gt;</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>on viewport</code> dùng IntersectionObserver dưới mui xe.</li>
    <li>Anchor: element bất kỳ với template ref, hoặc dùng @placeholder làm anchor mặc định.</li>
    <li>Pattern phổ biến: lazy section + prefetch on idle để mượt.</li>
  </ul>
</div>`
    },
    {
      id: "17-09", n: "09",
      title: "Trigger interaction — click/keydown",
      html: `
<p><code>on interaction</code> render khi user click hoặc keydown vào element anchor.</p>

<pre><code>&lt;<span class="c-tag">button</span> #<span class="c-attr">btn</span>&gt;Hiện chi tiết&lt;/<span class="c-tag">button</span>&gt;

@<span class="c-keyword">defer</span> (on interaction(btn)) {
  &lt;app-details/&gt;
}</code></pre>

<h3>Use case: modal hiếm dùng</h3>
<p>Modal "Settings" trên dashboard — đa số user không bao giờ mở. Nếu kèm vào bundle chính → phí. Defer:</p>

<pre><code>&lt;<span class="c-tag">button</span> #<span class="c-attr">settingsBtn</span> (click)=<span class="c-string">"showSettings = true"</span>&gt;Cài đặt&lt;/<span class="c-tag">button</span>&gt;

@<span class="c-keyword">if</span> (showSettings) {
  @<span class="c-keyword">defer</span> (on interaction(settingsBtn); prefetch on hover(settingsBtn)) {
    &lt;app-settings-modal (close)=<span class="c-string">"showSettings = false"</span>/&gt;
  } @<span class="c-keyword">loading</span> {
    &lt;app-modal-skeleton/&gt;
  }
}</code></pre>

<p>Hover để prefetch, click để render — tức thì.</p>

<h3>Use case: tab nội dung</h3>
<pre><code>@<span class="c-keyword">for</span> (tab <span class="c-keyword">of</span> tabs; track tab.id) {
  &lt;button #<span class="c-string">"tab-{{ tab.id }}"</span> (click)=<span class="c-string">"active = tab.id"</span>&gt;{{ tab.label }}&lt;/button&gt;
}

@<span class="c-keyword">switch</span> (active) {
  @<span class="c-keyword">case</span> <span class="c-string">'overview'</span> { &lt;app-overview/&gt; }
  @<span class="c-keyword">case</span> <span class="c-string">'analytics'</span> {
    @<span class="c-keyword">defer</span> { &lt;app-analytics-charts/&gt; }
  }
  @<span class="c-keyword">case</span> <span class="c-string">'export'</span> {
    @<span class="c-keyword">defer</span> { &lt;app-export-tools/&gt; }
  }
}</code></pre>

<p>Tab "analytics" và "export" chỉ tải khi user click vào.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Click hoặc keydown đều trigger.</li>
    <li>Pattern: kết hợp prefetch on hover + on interaction cho UX nhanh.</li>
    <li>Use case: modal hiếm, tab nặng, dialog form lớn.</li>
  </ul>
</div>`
    },
    {
      id: "17-10", n: "10",
      title: "Trigger hover",
      html: `
<p><code>on hover</code> render khi user hover chuột qua element. Hữu ích nhất khi <strong>kết hợp prefetch</strong>:</p>

<pre><code>&lt;<span class="c-tag">a</span> #<span class="c-attr">profileLink</span> <span class="c-attr">routerLink</span>=<span class="c-string">"/profile"</span>&gt;Xem profile&lt;/<span class="c-tag">a</span>&gt;

@<span class="c-keyword">defer</span> (on hover(profileLink); prefetch on hover(profileLink)) {
  &lt;app-profile-preview/&gt;
}</code></pre>

<h3>Pattern phổ biến: prefetch trên hover, render khi vào trang</h3>
<pre><code>&lt;<span class="c-tag">a</span> #<span class="c-attr">link</span> <span class="c-attr">routerLink</span>=<span class="c-string">"/heavy-page"</span>&gt;Heavy Page&lt;/<span class="c-tag">a</span>&gt;

<span class="c-comment">// Trên trang đích, có @defer của HeavyContent</span>
<span class="c-comment">// Khi user hover link, chunk HeavyContent đã tải sẵn</span>
<span class="c-comment">// User click → navigate → trang HeavyContent render gần như tức thì</span></code></pre>

<p>Đây là kỹ thuật mà Next.js / Remix đã làm từ lâu — Angular giờ có built-in.</p>

<div class="warn"><strong>Mobile:</strong> không có hover. Trên mobile, trigger này không kích hoạt → fallback sang trigger khác. Vì thế thường kết hợp <code>on hover; on interaction</code>.</div>

<pre><code>@<span class="c-keyword">defer</span> (on hover(link); on interaction(link); prefetch on hover(link)) {
  &lt;app-tooltip/&gt;
}</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Hover trigger lý tưởng cho prefetch.</li>
    <li>Mobile không có hover — kết hợp on interaction để fallback.</li>
  </ul>
</div>`
    },
    {
      id: "17-11", n: "11",
      title: "Custom Trigger với when",
      html: `
<p><code>when expr</code> trigger theo biểu thức boolean tuỳ biến — tích hợp sạch với signal hoặc property.</p>

<pre><code>showDetails = signal(<span class="c-keyword">false</span>);

@<span class="c-keyword">defer</span> (when showDetails()) {
  &lt;app-details/&gt;
}</code></pre>

<h3>Khi nào dùng when?</h3>
<ul>
  <li>Logic trigger phức tạp không khớp với <code>on idle/viewport/hover/...</code>.</li>
  <li>Phụ thuộc vào state app (vd: chỉ render khi user đã verify email).</li>
  <li>Trigger từ event không phải DOM (vd: WebSocket message).</li>
</ul>

<div class="example-label">Ví dụ — render conditional theo logic phức tạp</div>
<pre><code><span class="c-keyword">export class</span> Page {
  user = inject(AuthService).user;
  isPremium = computed(() =&gt; <span class="c-keyword">this</span>.user()?.plan === <span class="c-string">'premium'</span>);
  hasFeature = computed(() =&gt; <span class="c-keyword">this</span>.user()?.features.includes(<span class="c-string">'advanced'</span>) ?? <span class="c-keyword">false</span>);

  shouldLoadAdvanced = computed(() =&gt;
    <span class="c-keyword">this</span>.isPremium() && <span class="c-keyword">this</span>.hasFeature()
  );
}</code></pre>

<pre><code>@<span class="c-keyword">defer</span> (when shouldLoadAdvanced()) {
  &lt;app-advanced-tools/&gt;
}</code></pre>

<h3>Kết hợp nhiều trigger</h3>
<pre><code>@<span class="c-keyword">defer</span> (on idle; on viewport; when isReady()) {
  &lt;app-x/&gt;
}</code></pre>

<p>Render khi <strong>bất kỳ</strong> điều kiện nào thoả. Trong ví dụ trên: idle hoặc cuộn vào viewport hoặc <code>isReady()</code> đổi sang true — cái nào tới trước.</p>

<h3>Tóm tắt mọi trigger</h3>
<table class="compare-table">
<tr><th>Trigger</th><th>Cú pháp</th><th>Khi kích hoạt</th></tr>
<tr><td>idle</td><td><code>on idle</code></td><td>Browser rảnh</td></tr>
<tr><td>immediate</td><td><code>on immediate</code></td><td>Sau bundle chính</td></tr>
<tr><td>timer</td><td><code>on timer(5s)</code></td><td>Sau X giây</td></tr>
<tr><td>viewport</td><td><code>on viewport(ref?)</code></td><td>Vào tầm nhìn</td></tr>
<tr><td>interaction</td><td><code>on interaction(ref)</code></td><td>Click hoặc keydown</td></tr>
<tr><td>hover</td><td><code>on hover(ref)</code></td><td>Mouseover</td></tr>
<tr><td>when</td><td><code>when expr</code></td><td>Biểu thức true</td></tr>
</table>

<div class="callout"><strong>Best practice:</strong> đa số block @defer chỉ cần <code>(on idle)</code> hoặc <code>(on viewport)</code> + <code>prefetch on idle</code>. Chỉ dùng custom trigger khi thật sự cần. Đừng over-engineer.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>when expr</code> cho logic trigger tuỳ biến.</li>
    <li>Có thể kết hợp nhiều trigger — <em>bất kỳ</em> nào kích hoạt thì render.</li>
    <li>Đa số trường hợp: <code>on idle</code> hoặc <code>on viewport</code> đủ.</li>
  </ul>
</div>`
    }
  ]
},
/* =================== SECTION 18 =================== */
{
  id: "s18", n: "18", title: "Signals",
  lessons: [
    {
      id: "18-01", n: "01",
      title: "Mở chương Signals",
      html: `
<p>Signals là <strong>thay đổi reactive lớn nhất của Angular</strong> trong 10 năm. Chính thức stable từ Angular 17. Khác RxJS Observable, signals đồng bộ, đơn giản, và quan trọng nhất — <em>tích hợp sâu với change detection</em>.</p>

<h3>Vì sao có Signals?</h3>
<p>Trước Signals, Angular dựa hoàn toàn vào Zone.js. Vấn đề:</p>
<ul>
  <li><strong>Bundle to</strong>: Zone.js ~25KB gzipped.</li>
  <li><strong>Hiệu năng</strong>: mỗi event trigger CD trên cả cây.</li>
  <li><strong>Khó debug</strong>: "vì sao component này re-render?" — không có câu trả lời rõ.</li>
  <li><strong>Khó tối ưu</strong>: phải hiểu OnPush + immutable + manual markForCheck.</li>
</ul>

<p>Signals giải quyết tất cả: <em>chỉ component đọc signal đó mới re-render khi nó đổi</em>. Granular đến mức binding cụ thể.</p>

<h3>3 API cốt lõi</h3>
<table class="compare-table">
<tr><th>API</th><th>Vai trò</th></tr>
<tr><td><code>signal(value)</code></td><td>State có thể đọc/ghi</td></tr>
<tr><td><code>computed(() => ...)</code></td><td>Derived value, tự động cache</td></tr>
<tr><td><code>effect(() => ...)</code></td><td>Side effect khi signal đổi</td></tr>
</table>

<h3>So với RxJS</h3>
<table class="compare-table">
<tr><th>Đặc điểm</th><th>Signal</th><th>Observable</th></tr>
<tr><td>Đồng bộ</td><td>Có</td><td>Không (luôn async)</td></tr>
<tr><td>Có giá trị hiện tại</td><td>Có (gọi <code>x()</code>)</td><td>Không (phải subscribe)</td></tr>
<tr><td>Cleanup</td><td>Tự động</td><td>Phải unsubscribe</td></tr>
<tr><td>Operator phong phú</td><td>Có hạn (computed/effect)</td><td>Rất nhiều (RxJS 100+ operator)</td></tr>
<tr><td>Dùng cho</td><td>Local state</td><td>Stream, async, event</td></tr>
</table>

<div class="callout"><strong>Không thay thế RxJS:</strong> Signals và Observable bổ sung nhau. State đồng bộ → signal. Stream/HTTP → Observable. Có API <code>toSignal()</code> và <code>toObservable()</code> để convert.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Signals = primitive reactive đồng bộ, granular CD.</li>
    <li>3 API: <code>signal</code>, <code>computed</code>, <code>effect</code>.</li>
    <li>Không thay thế RxJS — bổ sung nhau.</li>
  </ul>
</div>`
    },
    {
      id: "18-02", n: "02",
      title: "Tạo signal đầu tiên",
      html: `
<div class="example-label">Tạo và dùng</div>
<pre><code><span class="c-keyword">import</span> { signal } <span class="c-keyword">from</span> <span class="c-string">'@angular/core'</span>;

@Component({
  template: \`
    &lt;p&gt;Đếm: {{ count() }}&lt;/p&gt;
    &lt;button (click)="inc()"&gt;+&lt;/button&gt;
  \`
})
<span class="c-keyword">export class</span> Counter {
  count = signal(0);

  inc() { <span class="c-keyword">this</span>.count.set(<span class="c-keyword">this</span>.count() + 1); }
}</code></pre>

<h3>Cú pháp quan trọng</h3>
<table class="compare-table">
<tr><th>Thao tác</th><th>Cú pháp</th></tr>
<tr><td>Tạo</td><td><code>const x = signal(initial)</code></td></tr>
<tr><td>Đọc</td><td><code>x()</code> — gọi như hàm!</td></tr>
<tr><td>Ghi (replace)</td><td><code>x.set(newValue)</code></td></tr>
<tr><td>Ghi (theo giá trị cũ)</td><td><code>x.update(prev => prev + 1)</code></td></tr>
</table>

<h3>Đọc trong template</h3>
<pre><code>{{ count() }}                         <span class="c-comment">// gọi như hàm</span>
[disabled]="loading()"
@if (user(); as u) { ... }</code></pre>

<p>Trong template, <code>count()</code> với cặp ngoặc — KHÔNG phải <code>count</code>. Gọi-như-hàm đăng ký template thành consumer của signal.</p>

<h3>Đọc trong component class</h3>
<pre><code>increment() {
  console.log(<span class="c-keyword">this</span>.count());   <span class="c-comment">// đọc giá trị</span>
  <span class="c-keyword">this</span>.count.set(<span class="c-keyword">this</span>.count() + 1);
}</code></pre>

<div class="example-label">Type rõ ràng</div>
<pre><code>name = signal&lt;string&gt;(<span class="c-string">''</span>);
user = signal&lt;User | <span class="c-keyword">null</span>&gt;(<span class="c-keyword">null</span>);
items = signal&lt;Item[]&gt;([]);
status = signal&lt;<span class="c-string">'idle'</span> | <span class="c-string">'loading'</span> | <span class="c-string">'error'</span>&gt;(<span class="c-string">'idle'</span>);</code></pre>

<p>Type được TS suy ra từ giá trị initial; có thể khai báo rõ với generic.</p>

<h3>Dưới mui xe</h3>
<p>Signal là một function. Khi gọi:</p>
<ol>
  <li>Trả về giá trị hiện tại.</li>
  <li>Nếu đang trong "tracking context" (template render, computed, effect) → đăng ký consumer.</li>
  <li>Khi <code>.set()</code> được gọi sau đó → notify mọi consumer.</li>
</ol>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Tạo: <code>signal(initial)</code>. Đọc: <code>x()</code>. Ghi: <code>x.set(v)</code>.</li>
    <li>Trong template phải có cặp ngoặc <code>x()</code>.</li>
    <li>Type được suy ra từ initial value.</li>
  </ul>
</div>`
    },
    {
      id: "18-03", n: "03",
      title: "update() và readonly signal",
      html: `
<h3>update() — đẹp hơn set()</h3>
<pre><code><span class="c-comment">// Cách dài</span>
count.set(count() + 1);

<span class="c-comment">// Cách đẹp</span>
count.update(v =&gt; v + 1);</code></pre>

<p>Khi giá trị mới phụ thuộc giá trị cũ — luôn dùng <code>update()</code>. Lý do:</p>
<ul>
  <li>Atomic: <code>set</code> đọc rồi ghi — race nếu có concurrent update.</li>
  <li>Đọc dễ: <code>v =&gt; v + 1</code> rõ "tăng 1" hơn <code>x.set(x() + 1)</code>.</li>
</ul>

<h3>Pattern object/array</h3>
<pre><code>todos.update(arr =&gt; [...arr, newTodo]);
todos.update(arr =&gt; arr.filter(t =&gt; t.id !== id));
user.update(u =&gt; u ? { ...u, name: <span class="c-string">'New'</span> } : <span class="c-keyword">null</span>);</code></pre>

<h3>asReadonly() — bảo vệ state</h3>
<p>Pattern phổ biến trong service:</p>

<pre><code>@Injectable({ providedIn: <span class="c-string">'root'</span> })
<span class="c-keyword">export class</span> CartStore {
  <span class="c-keyword">private</span> _items = signal&lt;CartItem[]&gt;([]);
  items = <span class="c-keyword">this</span>._items.asReadonly();   <span class="c-comment">// public, không thể .set/update</span>

  add(item: CartItem) {
    <span class="c-keyword">this</span>._items.update(arr =&gt; [...arr, item]);
  }

  remove(id: string) {
    <span class="c-keyword">this</span>._items.update(arr =&gt; arr.filter(i =&gt; i.id !== id));
  }
}</code></pre>

<p>Component chỉ đọc <code>items()</code>, không thể tự ý sửa. Mọi thay đổi phải qua method service — controlled mutation.</p>

<pre><code>@Component({ /* ... */ })
<span class="c-keyword">export class</span> CartView {
  <span class="c-keyword">private</span> store = inject(CartStore);

  items = <span class="c-keyword">this</span>.store.items;
  count = computed(() =&gt; <span class="c-keyword">this</span>.items().length);

  <span class="c-comment">// items.set(...) — TS error: items is readonly</span>
  add(item: CartItem) { <span class="c-keyword">this</span>.store.add(item); }
}</code></pre>

<h3>So sánh với RxJS BehaviorSubject</h3>
<pre><code><span class="c-comment">// RxJS pattern cũ</span>
<span class="c-keyword">private</span> _items\$ = <span class="c-keyword">new</span> BehaviorSubject&lt;CartItem[]&gt;([]);
items\$ = <span class="c-keyword">this</span>._items\$.asObservable();
<span class="c-comment">// thêm: this._items$.next([...this._items$.value, item])</span>

<span class="c-comment">// Signal pattern</span>
<span class="c-keyword">private</span> _items = signal&lt;CartItem[]&gt;([]);
items = <span class="c-keyword">this</span>._items.asReadonly();
<span class="c-comment">// thêm: this._items.update(arr =&gt; [...arr, item])</span></code></pre>

<p>Signal: ngắn hơn, đồng bộ, không cần subscribe. Mọi component đọc <code>store.items()</code> được giá trị tức thì.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>update(prev =&gt; new)</code> đẹp hơn <code>set(x() + 1)</code>.</li>
    <li><code>asReadonly()</code> để expose signal mà bên ngoài không thể sửa.</li>
    <li>Pattern store: <code>private _x = signal(...)</code> + <code>x = _x.asReadonly()</code>.</li>
  </ul>
</div>`
    },
    {
      id: "18-04", n: "04",
      title: "Object/Array — KHÔNG mutate trực tiếp",
      html: `
<p>Đây là gotcha lớn nhất của signals. Hiểu sai → bug "không hiểu sao UI không update".</p>

<h3>Vấn đề</h3>
<pre><code>todos = signal&lt;Todo[]&gt;([{ id: 1, done: <span class="c-keyword">false</span> }]);

<span class="c-comment">// ❌ MUTATE — signal không phát hiện</span>
<span class="c-keyword">this</span>.todos()[0].done = <span class="c-keyword">true</span>;

<span class="c-comment">// ❌ PUSH — mảng vẫn cùng reference</span>
<span class="c-keyword">this</span>.todos().push(newTodo);</code></pre>

<p>Cả hai trông như "có hiệu lực" với default change detection (vì CD quét toàn bộ template). Nhưng signal KHÔNG biết — vì so sánh tham chiếu thấy "vẫn là mảng/object cũ".</p>

<h3>Hậu quả</h3>
<ul>
  <li>Component reading signal qua <code>computed</code>, <code>effect</code>, OnPush component → KHÔNG re-evaluate.</li>
  <li>Code "may mắn chạy được" trong dev (Default CD), nhưng vỡ trong production khi chuyển OnPush hoặc dùng zone-less.</li>
  <li>Bug rất khó debug — UI hiển thị một số nơi đúng, một số nơi sai.</li>
</ul>

<h3>Cách đúng — luôn tạo object/array mới</h3>

<div class="example-label">Toggle todo</div>
<pre><code>toggle(id: number) {
  <span class="c-keyword">this</span>.todos.update(list =&gt;
    list.map(t =&gt; t.id === id ? { ...t, done: !t.done } : t)
  );
}</code></pre>

<div class="example-label">Add</div>
<pre><code>add(todo: Todo) {
  <span class="c-keyword">this</span>.todos.update(list =&gt; [...list, todo]);
}</code></pre>

<div class="example-label">Remove</div>
<pre><code>remove(id: number) {
  <span class="c-keyword">this</span>.todos.update(list =&gt; list.filter(t =&gt; t.id !== id));
}</code></pre>

<div class="example-label">Update field nested object</div>
<pre><code>updateUserCity(city: string) {
  <span class="c-keyword">this</span>.user.update(u =&gt; u ? {
    ...u,
    address: { ...u.address, city }
  } : u);
}</code></pre>

<h3>Tại sao Angular chọn so sánh tham chiếu?</h3>
<p>Để hiệu năng. So sánh deep object mỗi lần update sẽ rất tốn — tệ hơn cả Default CD. Reference equality là O(1).</p>

<p>Đây là quy tắc đã quen với React/Redux/Vuex. Nếu bạn từ React đến → đã biết. Nếu chưa → học một lần là xong.</p>

<h3>Mẹo: nếu state phức tạp, dùng Immer</h3>
<pre><code><span class="c-keyword">import</span> { produce } <span class="c-keyword">from</span> <span class="c-string">'immer'</span>;

<span class="c-keyword">this</span>.state.update(draft =&gt; produce(draft, d =&gt; {
  d.user.address.city = <span class="c-string">'Hanoi'</span>;
  d.todos.push(newTodo);
  <span class="c-comment">// viết "mutate" nhưng Immer tạo immutable update</span>
}));</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>KHÔNG mutate — luôn tạo object/array mới.</li>
    <li>Mutate "may mắn chạy" với Default CD nhưng phá granular reactivity.</li>
    <li>Pattern phổ biến: <code>{ ...obj }</code>, <code>[...arr]</code>, <code>.map()</code>, <code>.filter()</code>.</li>
    <li>State sâu phức tạp → Immer giúp viết mutate-style nhưng tạo immutable.</li>
  </ul>
</div>`
    },
    {
      id: "18-05", n: "05",
      title: "computed() — derived signal",
      html: `
<p><code>computed()</code> tạo signal <em>phái sinh</em> từ signal khác. Nó tự nhớ cache, chỉ tính lại khi dependency đổi.</p>

<div class="example-label">Ví dụ cơ bản</div>
<pre><code>price    = signal(100);
qty      = signal(2);

total    = computed(() =&gt; <span class="c-keyword">this</span>.price() * <span class="c-keyword">this</span>.qty());
withVat  = computed(() =&gt; <span class="c-keyword">this</span>.total() * 1.1);
formatted = computed(() =&gt; <span class="c-keyword">this</span>.withVat().toLocaleString(<span class="c-string">'vi'</span>) + <span class="c-string">' đ'</span>);</code></pre>

<pre><code>&lt;p&gt;Tổng: {{ formatted() }}&lt;/p&gt;</code></pre>

<h3>Đặc tính quan trọng</h3>

<h4>1. Cache thông minh</h4>
<p>Lần đầu gọi <code>total()</code>: chạy hàm, nhớ kết quả. Lần sau gọi: trả thẳng cache. Chỉ khi <code>price</code> hoặc <code>qty</code> đổi → cache invalid → tính lại.</p>

<h4>2. Lazy</h4>
<p>Computed KHÔNG tính ngay khi tạo. Chỉ tính khi có người gọi nó. Nếu không ai dùng → không tốn CPU.</p>

<h4>3. Dependency tự động</h4>
<p>Bạn không khai báo dependency. Angular phát hiện bằng cách track signal nào được gọi trong hàm:</p>
<pre><code>visible = computed(() =&gt; {
  <span class="c-keyword">if</span> (<span class="c-keyword">this</span>.user()) {       <span class="c-comment">// dep: user</span>
    <span class="c-keyword">return</span> <span class="c-keyword">this</span>.todos();    <span class="c-comment">// dep: todos</span>
  }
  <span class="c-keyword">return</span> [];
});</code></pre>

<h3>Read-only — không thể set</h3>
<pre><code>total.set(123);   <span class="c-comment">// ❌ TS error: computed signals are readonly</span></code></pre>

<p>Đây là tính năng — đảm bảo derived value luôn nhất quán với source.</p>

<h3>Use case thực tế</h3>

<div class="example-label">Filter list</div>
<pre><code>todos = signal&lt;Todo[]&gt;([]);
filter = signal&lt;<span class="c-string">'all'</span> | <span class="c-string">'done'</span> | <span class="c-string">'pending'</span>&gt;(<span class="c-string">'all'</span>);

filteredTodos = computed(() =&gt; {
  <span class="c-keyword">const</span> all = <span class="c-keyword">this</span>.todos();
  <span class="c-keyword">switch</span> (<span class="c-keyword">this</span>.filter()) {
    <span class="c-keyword">case</span> <span class="c-string">'done'</span>: <span class="c-keyword">return</span> all.filter(t =&gt; t.done);
    <span class="c-keyword">case</span> <span class="c-string">'pending'</span>: <span class="c-keyword">return</span> all.filter(t =&gt; !t.done);
    <span class="c-keyword">default</span>: <span class="c-keyword">return</span> all;
  }
});</code></pre>

<div class="example-label">Validation</div>
<pre><code>email = signal(<span class="c-string">''</span>);
password = signal(<span class="c-string">''</span>);

isValid = computed(() =&gt;
  <span class="c-keyword">this</span>.email().includes(<span class="c-string">'@'</span>) && <span class="c-keyword">this</span>.password().length &gt;= 8
);
canSubmit = computed(() =&gt; <span class="c-keyword">this</span>.isValid() && !<span class="c-keyword">this</span>.submitting());</code></pre>

<pre><code>&lt;button [disabled]="!canSubmit()"&gt;Đăng ký&lt;/button&gt;</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Computed = derived signal, lazy + cached.</li>
    <li>Dependency tự động phát hiện — không khai báo.</li>
    <li>Read-only — không thể set/update.</li>
    <li>Use case: filter, format, validation, derive trạng thái UI.</li>
  </ul>
</div>`
    },
    {
      id: "18-06", n: "06",
      title: "Cách dependency hình thành — chú ý!",
      html: `
<p>Đây là điểm tinh tế nhưng cực kỳ quan trọng. Hiểu sai sẽ gây bug "computed không update".</p>

<h3>Nguyên tắc: dependency được track tại runtime</h3>
<p>Khi computed chạy lần đầu, Angular ghi nhận <strong>signal nào đã được gọi</strong>. Đó là dependency. Nếu code rẽ nhánh → một số signal có thể không được gọi → KHÔNG là dependency.</p>

<div class="example-label">Vấn đề</div>
<pre><code>visible = signal(<span class="c-keyword">true</span>);
todos   = signal&lt;Todo[]&gt;([]);

filtered = computed(() =&gt; {
  <span class="c-keyword">if</span> (!<span class="c-keyword">this</span>.visible()) <span class="c-keyword">return</span> [];   <span class="c-comment">// nếu visible=false → return sớm</span>
  <span class="c-keyword">return</span> <span class="c-keyword">this</span>.todos().filter(t =&gt; !t.done);
});</code></pre>

<p>Phân tích:</p>
<ul>
  <li>Lần đầu: <code>visible() = true</code>. Code chạy hết → đăng ký dep <code>visible</code> + <code>todos</code>. ✓</li>
  <li>Lần đầu: <code>visible() = false</code>. Code return sớm → CHỈ đăng ký dep <code>visible</code>. ✗ <code>todos</code> không là dep.</li>
</ul>

<p>Vấn đề: nếu sau đó <code>todos.update(...)</code> → filtered không update vì <code>todos</code> không là dep. Nhưng khi <code>visible</code> đổi sang true → code chạy lại, lúc đó dep set đúng.</p>

<p>Trong thực tế, đây không phải bug nghiêm trọng — vì khi visible=false, filtered=[] không quan trọng. Khi visible=true mới cần filter. Nhưng đôi khi gây "delay" cảm giác.</p>

<h3>Sai lầm phổ biến</h3>

<div class="warn">
<pre><code>name = signal(<span class="c-string">'Hieu'</span>);
greeting = computed(() =&gt; {
  <span class="c-keyword">if</span> (Date.now() &gt; 0) {
    <span class="c-keyword">return</span> <span class="c-string">'Chào'</span>;          <span class="c-comment">// nhánh chạy</span>
  } <span class="c-keyword">else</span> {
    <span class="c-keyword">return</span> \`Chào \${<span class="c-keyword">this</span>.name()}\`;   <span class="c-comment">// nhánh không bao giờ chạy → name không là dep</span>
  }
});</code></pre>
<p>Chạy <code>name.set('Lan')</code> → <code>greeting()</code> KHÔNG đổi vì name không là dep.</p>
</div>

<h3>Quy tắc vàng</h3>
<p>Đọc tất cả signal nguồn ở <strong>đầu hàm</strong> computed, ngoài mọi nhánh điều kiện:</p>

<pre><code>filtered = computed(() =&gt; {
  <span class="c-comment">// đọc TẤT CẢ deps trước</span>
  <span class="c-keyword">const</span> visible = <span class="c-keyword">this</span>.visible();
  <span class="c-keyword">const</span> todos = <span class="c-keyword">this</span>.todos();

  <span class="c-comment">// rồi mới rẽ nhánh</span>
  <span class="c-keyword">if</span> (!visible) <span class="c-keyword">return</span> [];
  <span class="c-keyword">return</span> todos.filter(t =&gt; !t.done);
});</code></pre>

<p>Cách này: cả <code>visible</code> và <code>todos</code> luôn là dep — bất kể nhánh nào chạy.</p>

<h3>Đối lập: untracked() để bỏ qua dependency</h3>
<p>Đôi khi bạn muốn đọc giá trị signal mà KHÔNG đăng ký làm dep:</p>
<pre><code><span class="c-keyword">import</span> { untracked } <span class="c-keyword">from</span> <span class="c-string">'@angular/core'</span>;

logged = computed(() =&gt; {
  <span class="c-keyword">const</span> count = <span class="c-keyword">this</span>.count();   <span class="c-comment">// dep: count</span>
  <span class="c-keyword">const</span> log = untracked(() =&gt; <span class="c-keyword">this</span>.audit());   <span class="c-comment">// đọc audit nhưng không track</span>
  <span class="c-keyword">return</span> { count, log };
});</code></pre>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Dependency được track ở runtime — chỉ những signal thực sự được gọi mới là dep.</li>
    <li>Đọc trong nhánh if có thể bỏ sót dep.</li>
    <li>Quy tắc: đọc tất cả signal nguồn ở đầu hàm, rồi mới rẽ nhánh.</li>
    <li><code>untracked(() =&gt; ...)</code> để đọc mà không track.</li>
  </ul>
</div>`
    },
    {
      id: "18-07", n: "07",
      title: "effect() — side effect khi signal đổi",
      html: `
<p><code>effect()</code> chạy hàm khi signal phụ thuộc đổi. Khác với computed:</p>
<ul>
  <li><strong>computed</strong> trả VALUE — pure function.</li>
  <li><strong>effect</strong> chạy SIDE EFFECT — log, save, gọi API analytics.</li>
</ul>

<div class="example-label">Ví dụ — sync với localStorage</div>
<pre><code>theme = signal&lt;<span class="c-string">'light'</span> | <span class="c-string">'dark'</span>&gt;(localStorage.getItem(<span class="c-string">'theme'</span>) <span class="c-keyword">as any</span> ?? <span class="c-string">'light'</span>);

<span class="c-keyword">constructor</span>() {
  effect(() =&gt; {
    <span class="c-keyword">const</span> t = <span class="c-keyword">this</span>.theme();
    document.body.classList.toggle(<span class="c-string">'dark'</span>, t === <span class="c-string">'dark'</span>);
    localStorage.setItem(<span class="c-string">'theme'</span>, t);
    console.log(<span class="c-string">'Theme đã đổi:'</span>, t);
  });
}</code></pre>

<p>Mỗi lần <code>theme</code> đổi → effect chạy lại. Browser body class + localStorage tự cập nhật.</p>

<h3>Cú pháp</h3>
<pre><code>effect(() =&gt; {
  <span class="c-comment">// đọc signal → tự động là dep</span>
  console.log(<span class="c-keyword">this</span>.x());
});</code></pre>

<h3>Khi nào effect chạy?</h3>
<ol>
  <li><strong>Một lần</strong> sau khi tạo, để xác lập dependency.</li>
  <li>Mỗi lần signal phụ thuộc đổi giá trị.</li>
  <li>Chạy <em>sau</em> CD pass hiện tại — không đồng bộ với nơi <code>.set()</code> được gọi.</li>
</ol>

<h3>Batching — nhiều set, 1 effect run</h3>
<pre><code>x = signal(0);
y = signal(0);

<span class="c-keyword">constructor</span>() {
  effect(() =&gt; console.log(<span class="c-keyword">this</span>.x(), <span class="c-keyword">this</span>.y()));
}

doStuff() {
  <span class="c-keyword">this</span>.x.set(1);
  <span class="c-keyword">this</span>.y.set(2);
  <span class="c-keyword">this</span>.x.set(3);
  <span class="c-comment">// effect chạy 1 lần, in: 3 2</span>
}</code></pre>

<p>Angular gom các update lại — effect chạy 1 lần với giá trị cuối. Hiệu năng tốt + tránh trạng thái trung gian.</p>

<h3>Cảnh báo: KHÔNG set signal trong effect</h3>

<div class="warn"><strong>Mặc định Angular ném lỗi nếu bạn cố .set() signal trong effect.</strong> Vì có thể tạo vòng lặp vô hạn.</div>

<pre><code>effect(() =&gt; {
  <span class="c-comment">// ❌ Throw lỗi: writeSignal in effect requires allowSignalWrites</span>
  <span class="c-keyword">this</span>.derived.set(<span class="c-keyword">this</span>.x() * 2);
});</code></pre>

<p>Để đổi state dựa trên signal, dùng <code>computed</code> — đó là tool đúng:</p>
<pre><code>derived = computed(() =&gt; <span class="c-keyword">this</span>.x() * 2);   <span class="c-comment">// ✓ tự động</span></code></pre>

<h3>Khi thật sự cần ghi signal trong effect</h3>
<pre><code>effect(() =&gt; {
  <span class="c-keyword">this</span>.something.set(value);
}, { allowSignalWrites: <span class="c-keyword">true</span> });</code></pre>

<p>Có flag, nhưng <strong>cảnh báo từ Angular team</strong>: nếu bạn cần dùng nó, có thể thiết kế đang sai. Hầu hết case nên là <code>computed</code> hoặc method.</p>

<h3>Cleanup khi destroy</h3>
<p>Effect trong injection context (constructor, field initializer) tự destroy khi component huỷ. Không cần cleanup tay.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Effect cho side effect — không phải transform value (đó là computed).</li>
    <li>Tự track dependency, chạy sau CD.</li>
    <li>KHÔNG set signal trong effect — Angular ném lỗi để chống vòng lặp.</li>
    <li>Tự cleanup khi component destroy.</li>
  </ul>
</div>`
    },
    {
      id: "18-08", n: "08",
      title: "Cleanup effect thủ công",
      html: `
<p>Nếu effect tạo "tài nguyên ngoài" (timer, listener, subscription), cần cleanup khi effect rerun hoặc destroy:</p>

<div class="example-label">Cleanup pattern</div>
<pre><code>effect((onCleanup) =&gt; {
  <span class="c-keyword">const</span> id = setInterval(() =&gt; {
    console.log(<span class="c-keyword">this</span>.tick());
  }, 1000);

  onCleanup(() =&gt; {
    clearInterval(id);
    console.log(<span class="c-string">'Effect cleanup'</span>);
  });
});</code></pre>

<p>Hàm <code>onCleanup</code> chạy:</p>
<ol>
  <li>Trước mỗi lần effect rerun (vì dep đổi).</li>
  <li>Khi effect bị destroy (component huỷ hoặc gọi <code>.destroy()</code>).</li>
</ol>

<h3>Use case: WebSocket theo userId</h3>
<pre><code>userId = signal&lt;string | <span class="c-keyword">null</span>&gt;(<span class="c-keyword">null</span>);

<span class="c-keyword">constructor</span>() {
  effect((onCleanup) =&gt; {
    <span class="c-keyword">const</span> id = <span class="c-keyword">this</span>.userId();
    <span class="c-keyword">if</span> (!id) <span class="c-keyword">return</span>;

    <span class="c-keyword">const</span> ws = <span class="c-keyword">new</span> WebSocket(\`wss://api/users/\${id}/feed\`);
    ws.onmessage = (e) =&gt; <span class="c-keyword">this</span>.onMessage(e);

    onCleanup(() =&gt; ws.close());
  });
}</code></pre>

<p>Khi <code>userId</code> đổi: cleanup gọi → đóng WebSocket cũ → effect chạy lại → mở WebSocket mới. Khi component destroy: cleanup gọi → đóng WebSocket. Không leak.</p>

<h3>Manual destroy</h3>
<pre><code><span class="c-keyword">const</span> ref = effect(() =&gt; { /* ... */ });

ref.destroy();   <span class="c-comment">// dừng effect không liên quan đến component lifecycle</span></code></pre>

<p>Hữu ích khi effect không cần đến hết đời component — vd: effect chạy cho đến khi điều kiện thoả.</p>

<h3>So sánh với takeUntilDestroyed</h3>
<pre><code><span class="c-comment">// Effect — đẹp hơn cho signal</span>
effect((onCleanup) =&gt; {
  <span class="c-keyword">const</span> id = setInterval(...);
  onCleanup(() =&gt; clearInterval(id));
});

<span class="c-comment">// RxJS — cho Observable</span>
interval(1000).pipe(takeUntilDestroyed()).subscribe(...);</code></pre>

<p>Đều an toàn lifecycle. Chọn theo loại reactive: signal → effect; Observable → takeUntilDestroyed.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>onCleanup chạy trước rerun và khi destroy.</li>
    <li>Use case: timer, WebSocket, listener — bất cứ tài nguyên ngoài.</li>
    <li>Effect tự destroy khi component huỷ — không cần cleanup tay.</li>
    <li>Manual <code>.destroy()</code> khi cần dừng effect sớm.</li>
  </ul>
</div>`
    },
    {
      id: "18-09", n: "09",
      title: "Signal-based Service",
      html: `
<p>Signals biến service thành một dạng "Redux lite" rất gọn. Dưới đây là pattern chuẩn để xây store cho state management nhỏ-vừa.</p>

<div class="example-label">Pattern store cơ bản</div>
<pre><code>@Injectable({ providedIn: <span class="c-string">'root'</span> })
<span class="c-keyword">export class</span> CartStore {
  <span class="c-comment">// Private writable signals</span>
  <span class="c-keyword">private</span> _items = signal&lt;CartItem[]&gt;([]);
  <span class="c-keyword">private</span> _coupon = signal&lt;string | <span class="c-keyword">null</span>&gt;(<span class="c-keyword">null</span>);

  <span class="c-comment">// Public readonly views</span>
  items = <span class="c-keyword">this</span>._items.asReadonly();
  coupon = <span class="c-keyword">this</span>._coupon.asReadonly();

  <span class="c-comment">// Computed derived state</span>
  count = computed(() =&gt; <span class="c-keyword">this</span>._items().reduce((s, i) =&gt; s + i.qty, 0));
  subtotal = computed(() =&gt; <span class="c-keyword">this</span>._items().reduce((s, i) =&gt; s + i.price * i.qty, 0));
  discount = computed(() =&gt; <span class="c-keyword">this</span>._coupon() ? <span class="c-keyword">this</span>.subtotal() * 0.1 : 0);
  total = computed(() =&gt; <span class="c-keyword">this</span>.subtotal() - <span class="c-keyword">this</span>.discount());
  isEmpty = computed(() =&gt; <span class="c-keyword">this</span>._items().length === 0);

  <span class="c-comment">// Actions (methods that mutate state)</span>
  add(item: CartItem) {
    <span class="c-keyword">this</span>._items.update(arr =&gt; {
      <span class="c-keyword">const</span> existing = arr.find(i =&gt; i.id === item.id);
      <span class="c-keyword">if</span> (existing) {
        <span class="c-keyword">return</span> arr.map(i =&gt;
          i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
        );
      }
      <span class="c-keyword">return</span> [...arr, item];
    });
  }

  remove(id: string) {
    <span class="c-keyword">this</span>._items.update(arr =&gt; arr.filter(i =&gt; i.id !== id));
  }

  setCoupon(c: string | <span class="c-keyword">null</span>) { <span class="c-keyword">this</span>._coupon.set(c); }

  clear() {
    <span class="c-keyword">this</span>._items.set([]);
    <span class="c-keyword">this</span>._coupon.set(<span class="c-keyword">null</span>);
  }
}</code></pre>

<h3>Sử dụng từ component</h3>
<pre><code>@Component({
  selector: <span class="c-string">'app-cart-summary'</span>,
  template: \`
    @if (cart.isEmpty()) {
      &lt;p&gt;Giỏ trống&lt;/p&gt;
    } @else {
      &lt;p&gt;{{ cart.count() }} sản phẩm&lt;/p&gt;
      &lt;p&gt;Tạm tính: {{ cart.subtotal() | currency }}&lt;/p&gt;
      @if (cart.coupon()) {
        &lt;p&gt;Giảm: {{ cart.discount() | currency }}&lt;/p&gt;
      }
      &lt;p&gt;Tổng: &lt;strong&gt;{{ cart.total() | currency }}&lt;/strong&gt;&lt;/p&gt;
    }
  \`
})
<span class="c-keyword">export class</span> CartSummary {
  cart = inject(CartStore);
}</code></pre>

<h3>Persistence — sync với localStorage</h3>
<pre><code>@Injectable({ providedIn: <span class="c-string">'root'</span> })
<span class="c-keyword">export class</span> CartStore {
  <span class="c-keyword">private</span> _items = signal&lt;CartItem[]&gt;(JSON.parse(localStorage.getItem(<span class="c-string">'cart'</span>) ?? <span class="c-string">'[]'</span>));

  <span class="c-keyword">constructor</span>() {
    effect(() =&gt; {
      localStorage.setItem(<span class="c-string">'cart'</span>, JSON.stringify(<span class="c-keyword">this</span>._items()));
    });
  }

  <span class="c-comment">// ... actions như trên</span>
}</code></pre>

<p>Mỗi lần items đổi → effect tự sync localStorage. Đẹp.</p>

<h3>Khi nào dùng store, khi nào dùng NgRx?</h3>
<table class="compare-table">
<tr><th>Tình huống</th><th>Đủ dùng</th></tr>
<tr><td>State nhỏ-vừa, 1-2 service</td><td>Signal store</td></tr>
<tr><td>State phức tạp, 10+ entity</td><td>NgRx (hoặc NgRx Signal Store)</td></tr>
<tr><td>Cần time-travel debug</td><td>NgRx + Redux DevTools</td></tr>
<tr><td>Team đã quen Redux pattern</td><td>NgRx</td></tr>
<tr><td>App POC / nhỏ</td><td>Signal store, không cần lib</td></tr>
</table>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Pattern: <code>private _x = signal(...)</code>, <code>x = _x.asReadonly()</code>.</li>
    <li>Computed cho derived state — không tự lưu, không bị stale.</li>
    <li>Method = action; thay đổi state qua method, không truy cập <code>_x</code> ngoài.</li>
    <li>Effect để sync với external (localStorage, API, broadcast).</li>
  </ul>
</div>`
    },
    {
      id: "18-10", n: "10",
      title: "Signal Inputs vs @Input — so sánh đầy đủ",
      html: `
<p>Angular 17.1 ra signal-based input — thay thế <code>@Input</code> với API hiện đại hơn nhiều.</p>

<div class="example-label">Cú pháp</div>
<pre><code><span class="c-keyword">import</span> { input } <span class="c-keyword">from</span> <span class="c-string">'@angular/core'</span>;

@Component({ /* ... */ })
<span class="c-keyword">export class</span> Card {
  course = input.required&lt;Course&gt;();         <span class="c-comment">// bắt buộc</span>
  size   = input&lt;<span class="c-string">'sm'</span> | <span class="c-string">'md'</span> | <span class="c-string">'lg'</span>&gt;(<span class="c-string">'md'</span>);   <span class="c-comment">// có default</span>
  showActions = input(<span class="c-keyword">true</span>);                  <span class="c-comment">// type suy ra: boolean</span>
}</code></pre>

<p>Trong template: gọi như signal, có cặp ngoặc.</p>
<pre><code>&lt;h2&gt;{{ course().title }}&lt;/h2&gt;
&lt;div [class]="'card-' + size()"&gt;</code></pre>

<h3>So sánh đầy đủ</h3>
<table class="compare-table">
<tr><th>Đặc điểm</th><th>@Input (cũ)</th><th>input() (mới)</th></tr>
<tr><td>Đọc</td><td>this.course</td><td>this.course()</td></tr>
<tr><td>Là signal</td><td>Không</td><td>Có (read-only)</td></tr>
<tr><td>Init bắt buộc?</td><td>Phải khai báo <code>!</code> hoặc default</td><td>Tự xử lý — không cần <code>!</code></td></tr>
<tr><td>Required</td><td><code>@Input({ required: true })</code></td><td><code>input.required&lt;T&gt;()</code></td></tr>
<tr><td>Transform</td><td><code>{ transform: fn }</code></td><td><code>{ transform: fn }</code></td></tr>
<tr><td>Alias</td><td><code>{ alias: 'x' }</code></td><td><code>{ alias: 'x' }</code></td></tr>
<tr><td>Reactive trong computed/effect</td><td>Không tự nhiên</td><td>Có — vì là signal</td></tr>
<tr><td>OnChanges thay thế</td><td>Phải dùng ngOnChanges</td><td>Dùng computed/effect tự nhiên</td></tr>
<tr><td>Debug</td><td>console.log(this.x)</td><td>console.log(this.x())</td></tr>
</table>

<h3>Tích hợp với computed</h3>
<pre><code>@Component({ /* ... */ })
<span class="c-keyword">export class</span> UserCard {
  user = input.required&lt;User&gt;();

  <span class="c-comment">// Reactive — tự update khi user input đổi</span>
  fullName = computed(() =&gt; \`\${<span class="c-keyword">this</span>.user().firstName} \${<span class="c-keyword">this</span>.user().lastName}\`);
  initials = computed(() =&gt; <span class="c-keyword">this</span>.fullName().split(<span class="c-string">' '</span>).map(s =&gt; s[0]).join(<span class="c-string">''</span>));
}</code></pre>

<p>Không cần <code>ngOnChanges</code>, không cần setter — pure derived value.</p>

<h3>Tích hợp với effect</h3>
<pre><code>@Component({ /* ... */ })
<span class="c-keyword">export class</span> UserDetail {
  userId = input.required&lt;string&gt;();
  user = signal&lt;User | <span class="c-keyword">null</span>&gt;(<span class="c-keyword">null</span>);

  <span class="c-keyword">constructor</span>(<span class="c-keyword">private</span> svc: UserService) {
    effect(() =&gt; {
      <span class="c-comment">// Tự gọi mỗi khi userId đổi</span>
      <span class="c-keyword">this</span>.svc.load(<span class="c-keyword">this</span>.userId()).subscribe(u =&gt; <span class="c-keyword">this</span>.user.set(u));
    });
  }
}</code></pre>

<p>Thay thế hoàn toàn pattern <code>ngOnChanges</code>.</p>

<div class="callout"><strong>Lời khuyên:</strong> code mới — luôn dùng <code>input()</code>. Code cũ — không cần migrate ngay; <code>@Input</code> vẫn hoạt động. Khi rảnh, schematic tự migrate.</div>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>input()</code> trả về signal — gọi với cặp ngoặc.</li>
    <li>Tích hợp tự nhiên với computed/effect — bỏ ngOnChanges.</li>
    <li>API: <code>input&lt;T&gt;(default)</code>, <code>input.required&lt;T&gt;()</code>.</li>
    <li>Read-only — cha mới có thể set, con không.</li>
  </ul>
</div>`
    },
    {
      id: "18-11", n: "11",
      title: "Signal Input thay thế ngOnChanges",
      html: `
<p>ngOnChanges là một trong những hook khó dùng nhất: SimpleChanges, firstChange, check theo string key… Signal input + computed/effect thay thế hoàn toàn, sạch hơn rất nhiều.</p>

<h3>Pattern cũ — ngOnChanges</h3>
<pre><code>@Component({ /* ... */ })
<span class="c-keyword">export class</span> ProfileCard <span class="c-keyword">implements</span> OnChanges {
  @Input() userId!: string;
  user: User | <span class="c-keyword">null</span> = <span class="c-keyword">null</span>;

  <span class="c-keyword">constructor</span>(<span class="c-keyword">private</span> svc: UserService) {}

  ngOnChanges(c: SimpleChanges) {
    <span class="c-keyword">if</span> (c[<span class="c-string">'userId'</span>]) {
      <span class="c-keyword">this</span>.svc.load(<span class="c-keyword">this</span>.userId).subscribe(u =&gt; <span class="c-keyword">this</span>.user = u);
    }
  }
}</code></pre>

<p>Vấn đề: phải biết key, phải nhớ if check, không reactive với computed.</p>

<h3>Pattern mới — signal input + effect</h3>
<pre><code>@Component({ /* ... */ })
<span class="c-keyword">export class</span> ProfileCard {
  userId = input.required&lt;string&gt;();
  user = signal&lt;User | <span class="c-keyword">null</span>&gt;(<span class="c-keyword">null</span>);

  <span class="c-keyword">constructor</span>(<span class="c-keyword">private</span> svc: UserService) {
    effect(() =&gt; {
      <span class="c-keyword">this</span>.svc.load(<span class="c-keyword">this</span>.userId()).subscribe(u =&gt; <span class="c-keyword">this</span>.user.set(u));
    });
  }
}</code></pre>

<h3>Pattern mới hơn — computed</h3>
<p>Nếu chỉ derive value (không gọi async), <code>computed</code> còn gọn hơn:</p>

<pre><code>@Component({ /* ... */ })
<span class="c-keyword">export class</span> Greeting {
  user = input.required&lt;User&gt;();
  greeting = computed(() =&gt; <span class="c-string">'Xin chào, '</span> + <span class="c-keyword">this</span>.user().name);
  shortName = computed(() =&gt; <span class="c-keyword">this</span>.user().name.split(<span class="c-string">' '</span>)[0]);
}</code></pre>

<p>Khi <code>user</code> input đổi → <code>greeting</code>, <code>shortName</code> tự cập nhật. Template binding <code>{{ greeting() }}</code> tự re-render.</p>

<h3>Pattern resource (Angular 19+)</h3>
<p>Cho async data fetch dựa trên input, có API <code>resource()</code>:</p>

<pre><code>@Component({ /* ... */ })
<span class="c-keyword">export class</span> ProfileCard {
  userId = input.required&lt;string&gt;();

  user = resource({
    request: () =&gt; <span class="c-keyword">this</span>.userId(),
    loader: ({ request }) =&gt; <span class="c-keyword">this</span>.svc.load(request)
  });
}</code></pre>

<pre><code>@if (user.isLoading()) {
  &lt;app-spinner/&gt;
} @else if (user.error()) {
  &lt;p&gt;Lỗi: {{ user.error() }}&lt;/p&gt;
} @else {
  &lt;app-profile [data]="user.value()"/&gt;
}</code></pre>

<p>Tự handle loading/error/refetch khi userId đổi. Cực kỳ thanh lịch.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li>Signal input + computed/effect thay ngOnChanges hoàn toàn.</li>
    <li>Pure derived → computed. Async/side-effect → effect.</li>
    <li>Async fetch theo input → <code>resource()</code> API (Angular 19+).</li>
  </ul>
</div>`
    },
    {
      id: "18-12", n: "12",
      title: "Options: required, alias, transform",
      html: `
<p>Đầy đủ tuỳ chọn của <code>input()</code>:</p>

<h3>required — bắt buộc</h3>
<pre><code>course = input.required&lt;Course&gt;();
<span class="c-comment">// Cha PHẢI truyền [course]="..." — nếu không, compile error</span></code></pre>

<h3>Default value</h3>
<pre><code>size = input&lt;<span class="c-string">'sm'</span> | <span class="c-string">'md'</span> | <span class="c-string">'lg'</span>&gt;(<span class="c-string">'md'</span>);
disabled = input(<span class="c-keyword">false</span>);
limit = input(10);</code></pre>

<h3>alias — tên khác trong template</h3>
<pre><code>data = input&lt;User&gt;(<span class="c-keyword">undefined as any</span>, { alias: <span class="c-string">'user'</span> });
<span class="c-comment">// Cha viết: [user]="x" — không phải [data]="x"</span></code></pre>

<p>Use case: tên nội bộ khác tên public API. Hữu ích cho framework directive.</p>

<h3>transform — chuẩn hoá kiểu</h3>
<pre><code><span class="c-keyword">import</span> { booleanAttribute, numberAttribute } <span class="c-keyword">from</span> <span class="c-string">'@angular/core'</span>;

disabled = input(<span class="c-keyword">false</span>, { transform: booleanAttribute });
count = input(0, { transform: numberAttribute });</code></pre>

<p><code>booleanAttribute</code> hiểu các giá trị: <code>true</code>, <code>"true"</code>, <code>""</code>, hoặc attribute có mặt → <code>true</code>; ngược lại → <code>false</code>.</p>

<pre><code>&lt;<span class="c-tag">app-button</span> <span class="c-attr">disabled</span>&gt;Click&lt;/<span class="c-tag">app-button</span>&gt;            <span class="c-comment">&lt;!-- disabled = true --&gt;</span>
&lt;<span class="c-tag">app-button</span> <span class="c-attr">disabled</span>=<span class="c-string">"true"</span>&gt;Click&lt;/<span class="c-tag">app-button</span>&gt;     <span class="c-comment">&lt;!-- disabled = true --&gt;</span>
&lt;<span class="c-tag">app-button</span>&gt;Click&lt;/<span class="c-tag">app-button</span>&gt;                     <span class="c-comment">&lt;!-- disabled = false --&gt;</span></code></pre>

<h3>Custom transform</h3>
<pre><code>upper = input(<span class="c-string">''</span>, {
  transform: (v: string) =&gt; v?.trim().toUpperCase() ?? <span class="c-string">''</span>
});

date = input(<span class="c-keyword">new</span> Date(), {
  transform: (v: string | Date) =&gt; <span class="c-keyword">typeof</span> v === <span class="c-string">'string'</span> ? <span class="c-keyword">new</span> Date(v) : v
});

<span class="c-comment">// Cha truyền string → component nhận Date</span></code></pre>

<h3>Combo đầy đủ</h3>
<pre><code>color = input&lt;string&gt;(<span class="c-string">'#000'</span>, {
  alias: <span class="c-string">'fg'</span>,
  transform: (v: string) =&gt; v.startsWith(<span class="c-string">'#'</span>) ? v : \`#\${v}\`
});</code></pre>

<pre><code>&lt;<span class="c-tag">app-x</span> <span class="c-attr">fg</span>=<span class="c-string">"ff0000"</span>&gt;...&lt;/<span class="c-tag">app-x</span>&gt;   <span class="c-comment">&lt;!-- nội bộ: color = '#ff0000' --&gt;</span></code></pre>

<h3>output() — counterpart của input()</h3>
<p>Angular 17.3 thêm <code>output()</code> thay <code>@Output() x = new EventEmitter()</code>:</p>

<pre><code><span class="c-keyword">import</span> { output } <span class="c-keyword">from</span> <span class="c-string">'@angular/core'</span>;

@Component({ /* ... */ })
<span class="c-keyword">export class</span> Card {
  liked = output&lt;Course&gt;();
  enrolled = output&lt;{ course: Course; ts: number }&gt;();

  onLike() { <span class="c-keyword">this</span>.liked.emit(<span class="c-keyword">this</span>.course()); }
}</code></pre>

<p>API như EventEmitter (<code>.emit()</code>) nhưng đơn giản hơn — không phải <code>new</code>, không phải <code>EventEmitter&lt;T&gt;</code>.</p>

<div class="takeaways">
  <h4>Cần nhớ</h4>
  <ul>
    <li><code>required</code>, <code>alias</code>, <code>transform</code> đầy đủ và type-safe.</li>
    <li>Transform cho phép chuẩn hoá: <code>booleanAttribute</code>, <code>numberAttribute</code>, hoặc custom.</li>
    <li><code>output()</code> tương đương <code>@Output() = new EventEmitter()</code> — gọn hơn.</li>
  </ul>
</div>`
    }
  ]
},

/* =================== SECTION 19 =================== */
{
  id: "s19", n: "19", title: "Kết khoá",
  lessons: [
    {
      id: "19-02", n: "02",
      title: "Kết luận và những điểm chốt cần nhớ",
      html: `
<p>Kết thúc khoá học. Nếu bạn theo hết, bạn đã hiểu Angular ở mức <strong>chiều sâu</strong> — đủ để đọc source code, debug runtime, và đưa ra quyết định kiến trúc trong dự án doanh nghiệp.</p>

<h3>10 điều ghi nhớ cho công việc hằng ngày</h3>
<ol>
  <li><strong>Standalone là mặc định.</strong> Đừng tạo NgModule mới trừ khi maintain code cũ. Migration schematic làm tự động.</li>

  <li><strong>Cú pháp control-flow mới (@if/@for/@switch).</strong> Nhanh hơn, sạch hơn, không cần import. Schematic chuyển code cũ tự động.</li>

  <li><strong>OnPush + Signal nên là mặc định.</strong> Hiệu năng tốt, hành vi rõ ràng, ít "magic re-render".</li>

  <li><strong>inject() &gt; constructor injection.</strong> Gọn, dễ refactor, mở ra pattern composable function.</li>

  <li><strong>Signal cho local state, Observable cho stream.</strong> <code>signal()</code>, <code>computed()</code>, <code>effect()</code> đủ cho 80% state nhỏ-vừa. RxJS cho debounce, switchMap, WebSocket.</li>

  <li><strong>async pipe luôn luôn.</strong> Đừng tự subscribe trong component nếu async pipe đủ dùng — không leak, không boilerplate.</li>

  <li><strong>@defer cải thiện TTI.</strong> Kết hợp <code>prefetch on idle</code> + <code>on viewport</code> cho UX mượt với bundle nhỏ.</li>

  <li><strong>strictTemplates: true.</strong> Bắt được rất nhiều bug ở compile-time thay vì runtime.</li>

  <li><strong>DI là vũ khí kiến trúc.</strong> Service singleton ở root, store cục bộ ở component-level, config qua InjectionToken — hiểu phân cấp injector là then chốt.</li>

  <li><strong>Đọc CHANGELOG mỗi <code>ng update</code>.</strong> Angular phát triển nhanh — mỗi 6 tháng có API mới hữu ích (resource, linkedSignal, afterRender…).</li>
</ol>

<h3>Lộ trình học tiếp</h3>
<ul>
  <li><strong>Router</strong>: <code>provideRouter</code>, route guards (<code>canActivate</code>, <code>canMatch</code>), resolvers, lazy loading patterns.</li>
  <li><strong>Reactive Forms</strong>: <code>FormBuilder</code>, <code>FormGroup</code>, custom validator, custom <code>ControlValueAccessor</code>.</li>
  <li><strong>Material / CDK</strong>: thư viện UI chuẩn của Angular team — Overlay, Drag&amp;Drop, Virtual Scroll.</li>
  <li><strong>Testing</strong>: TestBed, Spectator (cleaner API), component test với Cypress Component Testing.</li>
  <li><strong>SSR</strong> với <code>@angular/ssr</code> — render server-side cho SEO + faster LCP.</li>
  <li><strong>resource() API</strong> (Angular 19+) — async data fetching declarative gọn hơn HttpClient subscribe.</li>
  <li><strong>Zone-less</strong> (đang experimental): bỏ Zone.js, dùng signals làm reactivity duy nhất.</li>
</ul>

<h3>Kỹ năng cần luyện thêm</h3>
<ul>
  <li>RxJS sâu hơn: <code>switchMap</code> vs <code>mergeMap</code> vs <code>concatMap</code>, <code>combineLatest</code>, error handling chuyên sâu.</li>
  <li>TypeScript nâng cao: discriminated union, conditional type, mapped type — viết signature component generic.</li>
  <li>Performance profiling: Chrome Performance tab, Angular DevTools profiler, đọc flame chart.</li>
</ul>

<div class="callout"><strong>Cuối cùng:</strong> Angular là framework rất lớn. Đừng cố nhớ hết. Hiểu các "trục" (Component, DI, Change Detection, Signals) — cụ thể có thể tra. Build dự án thật, gặp bug thật, debug — đó mới là cách hiểu sâu thực sự.</div>

<p style="margin-top: 40px; text-align: center; color: var(--ink-soft); font-size: 14px;">
Cảm ơn bạn đã theo hết khoá. Chúc bạn thành công với Angular!
</p>
        `
    }
  ]
}
  ]
};
