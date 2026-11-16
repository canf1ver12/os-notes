# CLAUDE.md：OS 課程筆記站

這份文件是給 AI（Claude、Codex、Cursor 等）看的專案說明。
**每次要新增或修改內容之前，請先完整讀完這份文件，並照這裡的規則做。**
如果使用者的指示和這份文件衝突，以使用者當下的指示為準，並在回覆中提醒他「這和 CLAUDE.md 的某條規則不同，要不要一起更新規則？」。

---

## 0. 快速導覽：這個專案怎麼繼續做下去

這個網站會跟著課程進度一直長大，**最常見的工作就是「新增下一章」**。做法是：

1. 先讀第 1 節（目的）和第 2 節（技術限制），確認不能做的事。
2. 讀使用者給的那一章投影片和筆記，這是內容唯一的依據。
3. 照第 4 節的流程建立檔案、在 `CHAPTERS` 登記、寫內容、更新名詞庫。首頁行星、卡片、側欄、上下頁、段落外框都會自動產生，不要手寫。
4. 內容照第 5 節的 7 個區塊和第 7 節的寫作規則；樣式只用第 6 節列出的元件。
5. 跑第 8 節的檢查清單，最後更新第 10 節的進度表。

如果是修改既有內容或功能，先看第 6 節對應功能的說明和第 9 節的規則，只改被要求的部分。

| 想知道 | 看哪裡 |
|---|---|
| 這個網站是做什麼的、內容從哪來 | 第 1 節 |
| 不能用什麼技術 | 第 2 節 |
| 檔案放哪、怎麼命名 | 第 3 節 |
| 新增一章的步驟 | 第 4 節 |
| 首頁和章節頁長什麼樣子、每章有哪些區塊 | 第 5 節 |
| 顏色、字型、元件、互動功能 | 第 6 節 |
| 語氣、條列、pseudocode、程式碼寫法 | 第 7 節 |
| 做完要檢查什麼 | 第 8 節 |
| 修改時的注意事項 | 第 9 節 |
| 目前做到第幾章、用了哪些資料 | 第 10 節 |

---

## 1. 專案目的

- 這是一個「作業系統（Operating System）」的課程筆記網站，一章一頁。
- 讀者是正在修 OS 的大學生，包含作者本人（統計系主修、資科輔系）。
- **內容的依據是上課投影片和作者自己的筆記**（課程用課本 Silberschatz, Galvin, Gagne《Operating System Concepts》）。寫新章節時先讀那一章的投影片和筆記，以筆記的說法、例子和比喻為主，投影片標示「不考」的內容可以略過或註明。
- **章節編號和課本章節編號一致**：01 Introduction、02 OS Structure、03 Processes、04 Threads、05 CPU Scheduling、06 Synchronization Tools，之後依序是 07 Synchronization Examples、08 Deadlocks、09 Main Memory、10 Virtual Memory……
- 目標：讀完一頁就能**看懂觀念、會手算例題、看得懂 pseudocode、能回答常見考題**。
- 網站要能一直長大：之後每上完一個主題，就照同一套規則加一頁，不需要重新設計。

## 2. 技術限制（不要違反）

- **純靜態網站**：只用 HTML + CSS + 原生 JavaScript。
- **不要**引入任何框架、套件、建置工具（不要 React、Vue、Tailwind、npm、bundler）。
- **不要**引用外部 CDN 或外部字型，網站要能離線打開。字型已經放在 `assets/fonts/`（英文 Space Grotesk、等寬 JetBrains Mono、中文 jf open 粉圓 Huninn），不要再加新的字型。
- 部署方式是 GitHub Pages，直接從 `main` 分支根目錄發佈，所以 `index.html` 必須在根目錄。
- 所有路徑都用**相對路徑**，不要用 `/` 開頭的絕對路徑（GitHub Pages 的網址有 repo 名稱前綴，絕對路徑會壞掉）。

## 3. 檔案結構

```
os-notes/
├── CLAUDE.md               ← 你正在讀的規則文件
├── AGENTS.md               ← 給其他 AI 工具的入口，內容指向本文件
├── README.md               ← 給人看的專案介紹
├── index.html              ← 首頁：標題、引導文字、太陽系章節導覽、搜尋、章節卡片
├── .nojekyll               ← 讓 GitHub Pages 不跑 Jekyll
├── assets/
│   ├── style.css           ← 全站唯一的樣式表
│   ├── site.js             ← 章節清單 CHAPTERS、線條插圖 ICONS、首頁太陽系、名詞查詢、側欄/目錄/上下頁的產生程式
│   ├── glossary.js         ← 名詞庫 GLOSSARY：章節頁「名詞查詢」的資料來源
│   └── fonts/              ← 本地字型（Space Grotesk、JetBrains Mono、jf open 粉圓），fonts.css 不要修改
├── chapters/
│   ├── 01-introduction.html
│   ├── 02-os-structure.html
│   ├── 03-processes.html
│   ├── 04-threads.html
│   ├── 05-cpu-scheduling.html
│   └── 06-synchronization.html
└── templates/
    └── chapter.html        ← 新章節的起始模板，複製它來用
```

### 命名規則

- 章節檔案：`chapters/NN-英文-kebab-case.html`
  - `NN` 是兩位數章節編號：`04`、`05`、`12`。
  - `NN` 用課本的章節編號。英文用小寫、單字之間用 `-`：`07-sync-examples.html`、`08-deadlocks.html`、`10-virtual-memory.html`。
  - 不要用中文檔名、空白或底線。
- 圖片（如果真的需要）：`assets/img/NN-描述.png`，例如 `assets/img/07-page-table.png`。能用 HTML/CSS 或 `<pre>` 畫的圖就不要用圖片。
- 不要新增其他 CSS 或 JS 檔案。需要新樣式就加到 `assets/style.css` 對應的區塊，並在本文件第 6 節登記。

## 4. 新增一章的標準流程（照順序做）

1. 複製 `templates/chapter.html` 到 `chapters/NN-slug.html`。
2. 把檔案裡所有 `{{...}}` 佔位符換掉：
   - `<body data-chapter="NN-slug">` 的值要和檔名（不含 `.html`）**完全一樣**。
   - `<title>` 格式：`NN 中文名稱 English Name｜OS 課程筆記`。
3. 打開 `assets/site.js`，在 `CHAPTERS` 陣列裡**依編號順序**加一筆：
   ```js
   {
     slug: "08-deadlocks",        // 和檔名一致
     no: "08",                    // 和檔名開頭的編號一致
     title: "死結",
     en: "Deadlocks",
     icon: "lock",                // ICONS 裡的插圖名稱，規則見第 6 節
     short: "Deadlocks",          // 選填：英文名稱太長時，太陽系行星旁邊顯示的短名稱（12 字元內）
     summary: "一句話說明這章在講什麼（30 字內）",
     tags: ["deadlock", "resource allocation graph", "banker's algorithm"]
   }
   ```
   首頁太陽系的行星、首頁卡片、側欄、章節標題旁的軌道插圖、上一章/下一章都會自動從這裡產生，**不要手動在 HTML 裡寫導覽連結或插圖**。
4. 照第 5 節的章節結構寫內容。
5. **更新名詞庫**：把這章新出現的重要名詞加進 `assets/glossary.js` 的 `GLOSSARY`（見下方規則）。
6. 跑一遍第 8 節的檢查清單。
7. 在本文件最下面的「章節進度」表把這章打勾。

### 名詞庫 GLOSSARY 的規則

章節頁右上角的「名詞查詢」（快捷鍵 `/`，或在內文反白一個詞）會從名詞庫找解釋，並提供「回到第 X 章看完整說明」的連結，點下去會跳到那一章並把名詞標亮。所以：

- **每一筆都必須來自某一章已經寫好的內容**，`def` 是那一章裡解釋的濃縮（1～3 句），不要寫章節裡沒有的東西。
- 每一章的 `dl.terms` 裡的名詞、`h3` 標題介紹的方法或演算法、比較表裡的名詞，都要收進名詞庫。
- `term` 用英文正式名稱，`zh` 用第 7 節術語表的譯名，`aliases` 放縮寫、別名、其他常見中文譯法，讓使用者不管打哪一種都找得到。
- `chapter` 是 slug，`section` 是這個名詞主要出現的 `h2` id，跳轉時會從那個區塊開始找名詞標亮。
- `related` 只能寫名詞庫裡已經存在的 `term`。
- 名詞庫找不到時，網站上線後會自動在各章內文做全文搜尋（本機直接開檔案時不會）。

## 5. 頁面結構與每一章的固定結構

### 首頁（`index.html`）

由上到下：標題列（OS Notes）→ 左邊是大標「Operating System / 作業系統課程筆記」、三行星空引導文字和搜尋框，右邊是太陽系（每章一顆行星）→ 章節卡片 → 「怎麼新增章節」說明區塊。行星和卡片都由 `CHAPTERS` 產生，首頁 HTML 不用為新章節做任何修改。

### 章節頁（`chapters/NN-slug.html`）

- 標題列：左邊品牌，右邊「名詞查詢」、「本章搜尋」、「HOME」按鈕（自動產生）。
- 三欄版面：左邊章節列表、中間內容、右邊本頁目錄 ON THIS PAGE（寬度見第 6 節「章節版面」）。
- 中間內容：章節標題區（編號、英文標題、中文名稱、右上角軌道圖）→ 7 個固定區塊 → 上一章 / 下一章。
- 章節 HTML 只要寫標題區和 7 個區塊的內容，其他都由 `site.js` 產生。

### 每一章的 7 個區塊

每章的 `<main>` 裡，`h2` 區塊**一定要依照這個順序**出現。標題文字可以加副標，但前面的名稱要一樣，這樣讀者每章都知道去哪裡找東西：

| 順序 | `h2` 標題 | 內容要求 |
|---|---|---|
| 1 | 本章重點 | 放在 `.summary-box` 裡，3～5 點條列，讀完這幾點就知道這章在幹嘛 |
| 2 | 核心觀念 | 可以有多個 `h3`。每個新名詞第一次出現要附英文，並用一個生活化比喻解釋 |
| 3 | 實際例子 | 至少一個**有具體數字或具體程式**的例子，一步一步算或一步一步跑 |
| 4 | Pseudocode | 至少一段 pseudocode，用第 7 節的寫法 |
| 5 | 比較整理 | 一個表格，比較這章出現的不同方法/概念（優點、缺點、適用情境） |
| 6 | 自我測驗 | 至少 3 題，用 `<details class="quiz">`，答案要附**原因**，不能只給結論 |
| 7 | 延伸閱讀 | **不放外部網站連結**。只列三項：課本章節（含 Section 範圍）、上課投影片檔名、作者筆記的頁碼範圍 |

`h2` 要有 `id`，用英文小寫：`key-points`、`concepts`、`example`、`pseudocode`、`comparison`、`quiz`、`reading`。
頁面右側的「本頁目錄」由 `site.js` 自動從 `h2` 產生，所以 `h2` 要寫好。

### 一個主題有多種做法時

OS 很多主題都有好幾種解法（排程演算法、同步機制、置換演算法…），這時候：

- 在「核心觀念」裡每種做法各一個 `h3`。
- 每種做法都要說明「它怎麼運作」「為什麼會想到這樣做」「它解決了上一個做法的什麼問題」。
- 在「比較整理」放總表。

## 6. 視覺風格與元件

### 整體風格：Universe × Tech

網站的感覺像一張用細線畫的星象圖，加上太空儀表板的科技感，而且要**活潑**：**黑色星空（彩色星雲、閃爍星星、流星、角落的彩色小行星）、1px 細線、虛線軌道、四芒星、HUD 角框、等寬字標籤**，每一章有自己的**行星色**。

| 要素 | 規則 |
|---|---|
| 背景 | `--space`（接近純黑 #07080c）。星雲、星星、閃爍由 `body::before` / `body::after` 產生，流星和角落行星由 `site.js` 的 `.space-deco` 產生。**不要把背景改成藍色或淺色**，裝飾不能蓋到文字 |
| 顏色 | 文字 `--text`（亮白）/ `--text-soft`；線條 `--line` / `--line-strong`；全站共用的重點色 `--gold`。**行星色** `--g1`～`--g6`：每一章依序自動分配一個（地球藍、火星紅、太陽黃、海王星紫、木星橘、金星粉），存在 CSS 變數 `--pc` |
| 行星色用在哪裡 | 卡片上緣、卡片編號與插圖、太陽系裡的行星、章節頁的編號、h2/h3 前的符號、章節插圖。想指定顏色時，在 `CHAPTERS` 那一筆加 `color: "var(--g4)"` |
| 字型 | 英文與數字：`--sans`（Space Grotesk），**標題用 600 粗字重**、內文 400；標籤、編號、程式碼：`--mono`（JetBrains Mono 500），標籤一律大寫加字距；中文用 **jf open 粉圓（Huninn）**，它只有一種粗細，全站設定了 `font-synthesis: none`，不要讓瀏覽器硬加粗。**不要用 300 以下的細字重**，小字不要小於 0.7rem |
| 線條與圓角 | 線條一律 1px（強調時 2px，例如卡片上緣）。按鈕、標籤圓角 2～3px；段落區塊 20px，提醒框、名詞卡、程式碼、表格 12～14px |
| 編號 | 章節、區塊、步驟都用兩位數等寬編號（`01`、`CH.02`），h2 的編號由 CSS counter 自動產生，不要手寫 |
| 太陽系 | 首頁的太陽系由 `site.js` 的 `drawSolarSystem()` 依照 `CHAPTERS` 自動畫出：中心是 KERNEL，每章一顆行星、一條軌道。行星造型由 `planetShape()` 依章節順序輪流（類地行星、環狀行星、條紋行星）。**新增章節不需要改這段程式** |
| 章節頁工具 | 標題列右邊固定有「名詞查詢」、「本章搜尋」和「HOME」三個按鈕，由 `site.js` 自動加上，章節 HTML 不用手寫。查詢面板、反白查詢的小按鈕、跳轉後的標亮都使用該章的行星色 `--pc`。從查詢跳去看完整說明後，標題列正下方會出現醒目的提示列，有「回到搜尋結果」和「回到剛剛讀的地方」兩個按鈕；連續查好幾個名詞、跳過好幾章時，「回到剛剛讀的地方」一律回到第一次打開查詢前讀到一半的位置，直到按了這個按鈕或 × 關掉提示列才重新記；最後一次的搜尋、跳轉來源、閱讀位置都存在 `sessionStorage`（存取一律包 try/catch） |
| 段落分區 | 章節 HTML 維持「`<h2 id>` 加內容」的平鋪寫法，**不要自己寫 `<section>` 包起來**。`site.js` 會把每個 h2 到下一個 h2 之間的內容包成 `.sec-block` 星系區塊：左上有行星徽章（7 個固定段落各有圖示：重點星芒、觀念環狀行星、例子彗星、Pseudocode 衛星、比較月亮、測驗問號、閱讀望遠鏡）、`SECTION 0N · 英文標籤`、標題下一排行星色小星點，區塊之間放軌道分隔線。h3 前面是小行星加軌道；本章重點自動變成編號方塊加彩色虛線列；`.callout` 變成虛線卡片，角落貼圓形徽章（warn 是 !、tip 是 ★、note 是 i）；`dl.terms` 變成一張卡片、每個名詞用 ✦ 標記。捲動時，畫面中間偏上（40% 高度）那條線所在的區塊會加上 `.lit`，邊框和徽章發出該章的行星色光。新增段落類型時，要在 `site.js` 的 `SEC_META` 補上標籤和圖示 |
| 章節版面 | 三欄：左邊章節列表 176px、中間內容最寬 920px、右邊 ON THIS PAGE 150px，欄距 3rem。兩側欄只放導覽，字要小、不要加寬，空間優先留給中間內容；寬度小於 1180px 隱藏右欄，小於 800px 只剩中間一欄 |
| 找關鍵字 | 首頁搜尋會同時比對章節資料和名詞庫，點卡片時帶 `?q=關鍵字`；從名詞查詢跳轉帶 `?hl=候選寫法1\|候選寫法2#區塊`。章節頁只跳到**一個**位置並閃動（`jumpTo()`）：優先找指定區塊之後的「重點位置」（`h3` 小標題，或以關鍵字開頭的 `dt`、`strong`、`th`），找不到才用第一次出現的地方。**所以寫內容時，第一次正式介紹一個名詞要用 `<strong>` 或 `dt`** |
| 本章搜尋 | 獨立功能，像瀏覽器的「尋找」。入口有三個：標題列的「本章搜尋」按鈕、快捷鍵 Shift+F、查詢清單最下面的「在這一章找出『X』的每一處」。打開後底部出現搜尋列，有自己的輸入框，打字停 0.3 秒自動標出這章所有出現處；Enter 下一處、Shift+Enter 上一處、Esc 關閉並清掉標亮；有 ↑ ↓、次數和「只看重點 / 顯示全部」切換。最後一次搜尋的字存在 `sessionStorage`（`os-notes-find`）。函式是 `openFind()`、`runFind()`、`findInChapter()` |
| 查詢清單 | 一律先顯示清單；輸入的字剛好等於某個名詞時，那一個放在最上面直接展開（解釋、相關名詞、看完整說明按鈕） |
| 上一頁 | 瀏覽器按上一頁時頁面會從 bfcache 原封不動還原，所以任何「跳轉前蓋住畫面」的效果都要在 `pageshow` 事件裡清掉 |
| 太陽系互動 | 滑鼠移到行星或章節卡片上：行星彈起放大發光、其他行星變暗、軌道亮起、浮出章節小卡。點行星：行星色的圓擴散蓋滿畫面（`warpTo()`），進到章節頁再收回來。動畫都要尊重 `prefers-reduced-motion` |
| 不要 | 灰黑色的一般投影（要發光只用行星色光暈）、手繪抖動線條、粗框、內文用 emoji、在內文區塊放圖片背景 |

### 線條插圖 ICONS

插圖放在 `assets/site.js` 的 `ICONS` 物件，目前有：`monitor`、`clock`、`lock`、`chip`、`layers`、`threads`、`planet`、`moon`、`disk`、`sparkle`。
新章節優先從現有的挑一個最貼近主題的。如果都不合適，可以新增一個，規則是：

- `viewBox="0 0 64 64"`，只寫形狀內容，外層 `<svg>` 由 `icon()` 函式產生。
- 只用幾何線條：`<rect>`、`<circle>`、直線和正圓弧，線條是乾淨俐落的，**不要手繪抖動**。
- 不要設定 `fill` 和 `stroke` 顏色（會自動用 `currentColor`、粗細 1.5、圓頭）。需要實心的部分加 `class="fill"`。
- 5 筆以內畫得出來的程度。例如 thread 可以畫成三條平行的波浪線，deadlock 可以畫成兩個互相指向的箭頭，memory 可以畫成一排小方格。
- 新增後在這一段的清單裡補上名稱。

### 可以用的元件（只用這些，不要自己發明新的 class）

```html
<!-- 本章重點 -->
<div class="summary-box"><ul><li>...</li></ul></div>

<!-- 提示框：note 一般補充、tip 記憶技巧、warn 常見錯誤 / 考試陷阱 -->
<div class="callout note"><strong>補充</strong><p>...</p></div>
<div class="callout tip"><strong>記憶技巧</strong><p>...</p></div>
<div class="callout warn"><strong>常見錯誤</strong><p>...</p></div>

<!-- 名詞定義 -->
<dl class="terms">
  <dt>Context switch（內容切換）</dt>
  <dd>CPU 從一個 process 換到另一個 process 時，保存舊的狀態、載入新的狀態。</dd>
</dl>

<!-- 程式碼：pseudocode 用 class="pseudo"；真的程式碼依語言用 class="lang-c"、"lang-py"、"lang-sh"，標籤一定要和語言一致 -->
<pre class="pseudo"><code>...</code></pre>
<pre class="lang-c"><code>...</code></pre>

<!-- 用文字畫的圖（狀態圖、記憶體配置圖） -->
<pre class="diagram">...</pre>

<!-- 甘特圖（排程類章節用）：--len 是這段的時間長度，data-t 是結束時間 -->
<div class="gantt" data-start="0">
  <span class="seg p1" style="--len:8" data-t="8">P1</span>
  <span class="seg idle" style="--len:2" data-t="10">idle</span>
</div>
<!-- 顏色 class：p1 ~ p6、idle -->

<!-- 表格：一律包在 table-wrap 裡，手機才能橫向捲動 -->
<div class="table-wrap"><table>...</table></div>

<!-- 自我測驗 -->
<details class="quiz">
  <summary>Q1. 題目</summary>
  <p><strong>答案：</strong>...</p>
  <p><strong>原因：</strong>...</p>
</details>
```

## 7. 寫作規則

### 語言與語氣

- **條列與一句話的選擇**：同一段裡在列舉好幾個項目、比較 A 和 B、或描述步驟時，改成條列（`ul` / `ol`，項目開頭可用 `<strong>` 標出關鍵字）；只講一個重點的短解釋，維持一兩句話就好，不要硬拆成條列。

- 一律使用**繁體中文**，語氣口語、像學長姐在講解，但描述要完整，不要用「就搞定了」這種省略說法。
- **專有名詞保留英文**，第一次出現寫「中文（English）」或「English（中文）」，之後可以直接用英文。統一用下面的譯名：

| English | 本站用法 |
|---|---|
| process | process（行程） |
| thread | thread（執行緒） |
| scheduler | scheduler（排程器） |
| context switch | context switch（內容切換） |
| critical section | critical section（臨界區） |
| race condition | race condition（競爭狀況） |
| deadlock | deadlock（死結） |
| starvation | starvation（飢餓） |
| semaphore | semaphore（號誌） |
| mutex | mutex lock（互斥鎖） |
| page / frame | page（分頁）/ frame（頁框） |
| virtual memory | virtual memory（虛擬記憶體） |
| system call | system call（系統呼叫） |
| kernel / user mode | kernel mode / user mode |

  新章節出現新名詞時，請把它加進這張表。
- **不要使用破折號（—）**。需要補充說明時用括號或冒號。
- 網頁內容不用 emoji，只有首頁的引導文字（星空符號那三行）可以用裝飾性的 emoji 和符號。
- `h2`、`h3` 標題用短名詞，例如「Round Robin」「三個必要條件」，不要寫成一整句。

### Pseudocode 寫法

- 關鍵字大寫：`IF`、`ELSE`、`WHILE`、`FOR`、`RETURN`、`FUNCTION`、`END`。
- 縮排 4 個空白。
- 變數用英文 snake_case，註解用 `//` 加中文。
- OS 的原語保持課本寫法：`wait(S)`、`signal(S)`、`acquire()`、`release()`、`test_and_set()`。

### 例子與數字

- 例題的數字要**真的算過**，表格裡的平均值要和甘特圖一致。寫完後請自己再驗算一次。
- C 程式範例要是能編譯的完整片段（含 `#include`），並寫出預期輸出。

## 8. 完成前的檢查清單

每次新增或修改章節後，逐項確認：

- [ ] 檔名符合 `NN-kebab-case.html`，`data-chapter` 和檔名一致
- [ ] `site.js` 的 `CHAPTERS` 已登記，順序正確
- [ ] 7 個 `h2` 區塊都在，順序正確，都有 `id`
- [ ] 至少一段 `pre.pseudo`、一個有具體數字或程式的例子、一個比較表、三題測驗
- [ ] `CHAPTERS` 那一筆有 `icon`，而且名稱存在於 `ICONS`
- [ ] 這章的新名詞都已經加進 `assets/glossary.js`，`related` 寫的名詞都存在
- [ ] 章節 HTML 在 `site.js` 之前有載入 `../assets/glossary.js`
- [ ] 沒有破折號（—）、沒有外部 CDN、沒有新的 CSS/JS 檔案
- [ ] 新增的樣式符合第 6 節的視覺風格（黑色星空底、1px 細線、行星色用 `--pc`、標題字重 600、沒有灰黑投影和手繪線條）
- [ ] 所有連結是相對路徑，打開首頁點得到新章節，上一章/下一章正常
- [ ] 例題數字驗算過
- [ ] 手機寬度（約 375px）下表格可以橫向捲動，版面沒有爆掉

## 9. AI 修改時的其他規則

- 只改使用者要求的部分，不要順手重排其他章節的內容。
- 要改共用的 `style.css` 或 `site.js` 時，先說明會影響哪些頁面。
- 不確定課程進度或老師用的課本版本時，先問，不要自己猜章節對應。
- 內容有不確定的地方（例如某作業系統的實作細節），寫進 `callout note` 並標明「依實作而異」，不要寫成定論。

## 10. 章節進度

每新增一章，首頁太陽系就會自動多一顆行星（依序配到下一個行星色），名詞也要同步加進名詞庫。

| 編號 | 主題 | 投影片 | 筆記 | 狀態 |
|---|---|---|---|---|
| 01 | 作業系統概論 Introduction | 01_OS_Introduction | p.25 至 p.85 | ✅ |
| 02 | 作業系統結構 OS Structure | 02_OS_OS_Structure | p.86 至 p.124 | ✅ |
| 03 | 行程 Processes | 03_OS_Processes | p.125 至 p.166 | ✅ |
| 04 | 執行緒與並行 Threads & Concurrency | 04_OS_ThreadsConcurrency | p.167 至 p.200 | ✅ |
| 05 | CPU 排程 CPU Scheduling | 05_OS_CPU_Scheduling | p.201 至 p.233 | ✅ |
| 06 | 同步工具 Synchronization Tools | 06-07_OS_Synchronization（前半） | 尚無 | ✅ |
| 07 | 同步範例 Synchronization Examples | 待上課 | | ⬜ |
| 08 | 死結 Deadlocks | 待上課 | | ⬜ |
| 09 | 主記憶體 Main Memory | 待上課 | | ⬜ |
| 10 | 虛擬記憶體 Virtual Memory | 待上課 | | ⬜ |
| 11 至 15 | 儲存、I/O 與檔案系統 | 待上課 | | ⬜ |
