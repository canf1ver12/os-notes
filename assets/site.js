/* =========================================================
   OS 課程筆記站：章節清單、線條插圖、太陽系導覽與自動導覽
   新增章節時，只要在 CHAPTERS 依編號順序加一筆。
   首頁太陽系（每章一顆行星）、章節卡片、側欄、章節插圖、上一章/下一章、本頁目錄都會自動產生。
   ========================================================= */

const CHAPTERS = [
  {
    slug: "01-introduction",
    no: "01",
    title: "作業系統概論",
    en: "Introduction",
    icon: "chip",
    summary: "OS 在做什麼？interrupt、DMA、儲存階層、開機流程、dual mode 與虛擬化。",
    tags: ["interrupt", "DMA", "dual mode", "SMP / NUMA", "boot"]
  },
  {
    slug: "02-os-structure",
    no: "02",
    title: "作業系統結構",
    en: "OS Structure",
    icon: "layers",
    summary: "程式怎麼請 OS 幫忙？system call、API、linker 與 loader，以及 OS 的幾種架構。",
    tags: ["system call", "API", "linking", "microkernel", "LKM"]
  },
  {
    slug: "03-processes",
    no: "03",
    title: "行程",
    en: "Processes",
    icon: "monitor",
    summary: "程式跑起來之後變成什麼？process 狀態、PCB、fork()，以及 process 之間怎麼溝通。",
    tags: ["PCB", "scheduler", "fork", "IPC", "pipe", "RPC"]
  },
  {
    slug: "04-threads",
    no: "04",
    title: "執行緒與並行",
    en: "Threads & Concurrency",
    short: "Threads",
    icon: "threads",
    summary: "一個 process 裡同時做好幾件事：thread 模型、Amdahl's law、Pthreads 與 implicit threading。",
    tags: ["multithreading", "Amdahl", "Pthreads", "thread pool"]
  },
  {
    slug: "05-cpu-scheduling",
    no: "05",
    title: "CPU 排程",
    en: "CPU Scheduling",
    short: "Scheduling",
    icon: "clock",
    summary: "很多 process 在等 CPU 時，要先給誰？用同一題比較各種演算法，再看多處理器排程。",
    tags: ["FCFS", "SJF", "Round Robin", "MLFQ", "affinity"]
  },
  {
    slug: "06-synchronization",
    no: "06",
    title: "同步工具",
    en: "Synchronization Tools",
    short: "Sync Tools",
    icon: "lock",
    summary: "兩個 thread 同時改一個變數會出什麼事？從 race condition、Peterson 到 CAS 與 mutex。",
    tags: ["race condition", "critical section", "Peterson", "CAS", "mutex"]
  }
];

/* ---------- 線條插圖（viewBox 0 0 64 64，幾何線條，規則見 CLAUDE.md 第 6 節） ---------- */
const ICONS = {
  monitor: `
    <rect x="9" y="12" width="46" height="31" rx="2"/>
    <path d="M18 22l6 5-6 5M28 32h9"/>
    <path d="M32 43v8M23 52h18"/>`,
  clock: `
    <circle cx="32" cy="34" r="20"/>
    <path d="M32 22v12l8 5"/>
    <path d="M32 14v-4M27 10h10M49 19l3-3"/>`,
  lock: `
    <rect x="14" y="29" width="36" height="25" rx="2"/>
    <path d="M21 29v-7a11 11 0 0 1 22 0v7"/>
    <circle cx="32" cy="40" r="3"/>
    <path d="M32 43v5"/>`,
  chip: `
    <rect x="18" y="18" width="28" height="28" rx="2"/>
    <rect x="25" y="25" width="14" height="14"/>
    <path d="M25 18v-7M32 18v-7M39 18v-7M25 46v7M32 46v7M39 46v7M18 25h-7M18 32h-7M18 39h-7M46 25h7M46 32h7M46 39h7"/>`,
  planet: `
    <circle cx="32" cy="32" r="13"/>
    <path d="M19.5 36.5C9 41 5 46 7.5 49c3.5 4 19-1 33-9.5s23.5-18.5 20-22.5c-2.3-2.7-8.6-1.6-16.5 1.7"/>`,
  moon: `<path d="M41 10a23 23 0 1 0 13 34A18 18 0 0 1 41 10z"/>`,
  layers: `
    <path d="M32 9L56 21 32 33 8 21z"/>
    <path d="M8 32l24 12 24-12"/>
    <path d="M8 43l24 12 24-12"/>`,
  threads: `
    <path d="M8 20c8-8 16 8 24 0s16 8 24 0"/>
    <path d="M8 32c8-8 16 8 24 0s16 8 24 0"/>
    <path d="M8 44c8-8 16 8 24 0s16 8 24 0"/>`,
  disk: `
    <circle cx="32" cy="32" r="22"/>
    <circle cx="32" cy="32" r="5"/>
    <path d="M32 10v8M50 23l-7 4"/>`,
  sparkle: `<path class="fill" d="M32 4C33.6 25 39 30.4 60 32 39 33.6 33.6 39 32 60 30.4 39 25 33.6 4 32 25 30.4 30.4 25 32 4z"/>`
};

/* 行星色：第 1 章地球藍、第 2 章火星紅、第 3 章太陽黃…依序循環。CHAPTERS 裡寫 color 可以覆蓋 */
const PLANET_COLORS = ["var(--g3)", "var(--g2)", "var(--g1)", "var(--g5)", "var(--g4)", "var(--g6)"];
const planetColor = (c) => c.color || PLANET_COLORS[CHAPTERS.indexOf(c) % PLANET_COLORS.length];

/* 背景裝飾用的彩色小行星 */
const decoPlanet = (color, ring) => `
  <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
    <circle cx="50" cy="50" r="30" fill="${color}"/>
    <path d="M25 40Q50 33 75 40" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="3" stroke-linecap="round"/>
    <path d="M22 57Q50 64 78 57" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="5" stroke-linecap="round"/>
    ${ring ? `<ellipse cx="50" cy="51" rx="49" ry="12" transform="rotate(-18 50 50)" fill="none" stroke="#f1f2f6" stroke-width="1.6"/>` : ""}
  </svg>`;

const icon = (name) =>
  `<svg class="doodle" viewBox="0 0 64 64" aria-hidden="true">${ICONS[name] || ICONS.planet}</svg>`;

const SPARKLE = (x, y, s, cls = "") =>
  `<path class="sparkle ${cls}" transform="translate(${x} ${y}) scale(${s / 56}) translate(-32 -32)" d="M32 4C33.6 25 39 30.4 60 32 39 33.6 33.6 39 32 60 30.4 39 25 33.6 4 32 25 30.4 30.4 25 32 4z"/>`;

/* 行星造型：0 類地行星（大陸）、1 環狀行星、2 條紋行星，依章節順序輪流。
   在半徑 1 的單位圓上畫，再用 translate + scale 放到軌道上 */
function planetShape(type, id) {
  const ns = 'vector-effect="non-scaling-stroke"';
  const clip = `clip-path="url(#pl-clip-${id})"`;
  const base = `<circle class="base" r="1" fill="var(--pc)"/>`;
  const shade = `<path class="shade" ${clip} fill-rule="evenodd" d="M-1.3 -1.3H1.3V1.3H-1.3Z M-1.25 -0.25a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/>`;
  const light = `<ellipse class="light" cx="-0.42" cy="-0.5" rx="0.24" ry="0.11" transform="rotate(-38 -0.42 -0.5)"/>`;
  const defs = `<clipPath id="pl-clip-${id}"><circle r="1"/></clipPath>`;
  if (type === 0) {
    return `${defs}${base}
      <g ${clip}>
        <path class="land" d="M-0.85 -0.25C-0.55 -0.85 0.1 -0.7 0 -0.25C-0.08 0.08 -0.5 0.12 -0.85 -0.25Z"/>
        <path class="land" d="M0.15 0.28C0.45 0.05 0.95 0.3 0.7 0.72C0.5 0.98 0.08 0.7 0.15 0.28Z"/>
        <path class="land" d="M-0.55 0.45C-0.35 0.38 -0.2 0.6 -0.38 0.72C-0.55 0.8 -0.7 0.55 -0.55 0.45Z"/>
      </g>${shade}${light}`;
  }
  if (type === 1) {
    const ring = (sweep) => `<path class="ring" ${ns} d="M-1.85 0A1.85 0.42 0 0 ${sweep} 1.85 0"/>`;
    return `${defs}<g transform="rotate(-20)">${ring(1)}</g>${base}
      <g ${clip}>
        <path class="band" ${ns} d="M-1 -0.3Q0 -0.15 1 -0.3"/>
        <path class="band lt" ${ns} d="M-1 0.2Q0 0.35 1 0.2"/>
      </g>${shade}${light}<g transform="rotate(-20)">${ring(0)}</g>`;
  }
  return `${defs}${base}
    <g ${clip}>
      <path class="band" ${ns} d="M-1 -0.42Q0 -0.28 1 -0.42"/>
      <path class="band lt" ${ns} d="M-1 -0.02Q0 0.12 1 -0.02"/>
      <path class="band" ${ns} d="M-1 0.42Q0 0.56 1 0.42"/>
      <circle class="crater" cx="0.35" cy="0.15" r="0.13"/>
      <circle class="crater" cx="-0.3" cy="0.62" r="0.08"/>
    </g>${shade}${light}`;
}

/* 首頁太陽系：中心是 kernel，每一章是一顆行星，新增章節會自動多一條軌道 */
/* 章節頁右上角的小軌道圖：跟首頁太陽系一樣，第幾章就在第幾圈、角度也一樣，
   只是把軌道等比例縮到中間圖示的外面，避免壓到圖示 */
function doodleOrbit(c) {
  const i = CHAPTERS.indexOf(c);
  const n = CHAPTERS.length;
  const C = 75, rMin = 42, rMax = 64;
  const radius = (k) => (n > 1 ? rMin + ((rMax - rMin) * k) / (n - 1) : rMax);
  const rad = ((-38 + i * 137.5) * Math.PI) / 180;   // 跟 drawSolarSystem 用同一個角度公式
  const r = radius(i);
  const x = C + r * Math.cos(rad), y = C + r * Math.sin(rad);
  const others = CHAPTERS.map((_, k) => k === i ? "" : `<circle class="faint" cx="${C}" cy="${C}" r="${radius(k).toFixed(1)}"/>`).join("");
  const pr = 8 + (i % 2) * 1.2;
  return `<circle cx="${C}" cy="${C}" r="74"/>${others}
    <circle class="dash" cx="${C}" cy="${C}" r="${r.toFixed(1)}"/>
    <circle class="halo" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${pr + 3.5}"/>
    <g class="pl" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${pr})">${planetShape(i % 3, "doodle")}</g>`;
}

function drawSolarSystem(el, root) {
  const C = 300;
  const n = CHAPTERS.length;
  const inner = 96;
  const outer = 268;
  const step = n > 1 ? Math.min(75, (outer - inner) / (n - 1)) : 0;
  let orbits = "";
  let planets = "";
  const spots = [];
  CHAPTERS.forEach((c, i) => {
    const r = inner + step * i;
    const deg = -38 + i * 137.5;
    const rad = (deg * Math.PI) / 180;
    const x = C + r * Math.cos(rad);
    const y = C + r * Math.sin(rad);
    const right = x <= 430;            // 標籤放在比較有空間的那一側
    const pr = 14 + (i % 2) * 3;
    const lx = right ? x + pr + 22 : x - pr - 22;
    const anchor = right ? "start" : "end";
    const pc = planetColor(c);
    spots.push({ x, y, right });
    orbits += `<circle class="orbit" data-i="${i}" style="--pc: ${pc}" cx="${C}" cy="${C}" r="${r}"/>`;
    planets += `
      <a class="planet" data-i="${i}" href="${root}/chapters/${c.slug}.html" aria-label="${c.no} ${c.title}" style="--pc: ${pc}">
        <line class="tick" x1="${x + (right ? pr + 8 : -pr - 8)}" y1="${y}" x2="${lx + (right ? -4 : 4)}" y2="${y}"/>
        <circle class="halo" cx="${x}" cy="${y}" r="${pr + 7}"/>
        <g class="pl" style="transform-origin: ${x}px ${y}px">
          <circle class="pulse" cx="${x}" cy="${y}" r="${pr + 2}"/>
          <g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${pr})">${planetShape(i % 3, i)}</g>
        </g>
        <text class="no" x="${lx}" y="${y - 4}" text-anchor="${anchor}">${c.no}</text>
        <text x="${lx}" y="${y + 13}" text-anchor="${anchor}">${(c.short || c.en).toUpperCase()}</text>
      </a>`;
  });
  el.innerHTML = `
    <svg viewBox="0 0 600 600" role="img" aria-label="以太陽系表示的章節導覽">
      <defs><path id="sun-ring" d="M${C} ${C} m-62 0 a62 62 0 1 1 124 0 a62 62 0 1 1 -124 0"/></defs>
      <circle class="orbit solid" cx="${C}" cy="${C}" r="290"/>
      ${orbits}
      <g class="ring-text-rotor">
        <text class="ring-text"><textPath href="#sun-ring">OPERATING SYSTEM · COURSE NOTES · NCCU · </textPath></text>
      </g>
      <circle class="sun" cx="${C}" cy="${C}" r="44"/>
      <circle class="sun-core" cx="${C}" cy="${C}" r="34"/>
      <text class="sun-label" x="${C}" y="${C + 4}">KERNEL</text>
      ${SPARKLE(28, 300, 16)}${SPARKLE(560, 60, 12, "dim")}${SPARKLE(565, 535, 22)}${SPARKLE(95, 545, 11, "dim")}${SPARKLE(470, 330, 8, "dim")}
      ${planets}
    </svg>
    <div class="solar-card" aria-hidden="true"></div>`;

  /* 滑鼠移到行星（或下面的章節卡片）上：行星浮起、軌道亮起、浮出小卡 */
  const card = el.querySelector(".solar-card");
  const activate = (i) => {
    const c = CHAPTERS[i];
    const spot = spots[i];
    el.classList.add("focus");
    el.querySelectorAll(".planet, .orbit").forEach((node) => node.classList.toggle("on", node.dataset.i === String(i)));
    card.style.setProperty("--pc", planetColor(c));
    card.innerHTML = `
      <div class="k">CH.${c.no} · ORBIT ${c.no}</div>
      <div class="t">${c.en}</div>
      <div class="z">${c.title}</div>
      <div class="d">${c.summary}</div>
      <span class="go">開始學習 →</span>`;
    const px = (spot.x / 600) * 100;
    const py = (spot.y / 600) * 100;
    card.style.left = spot.right ? `calc(${px}% - 270px)` : `calc(${px}% + 40px)`;
    card.style.top = `calc(${py}% - 30px)`;
    card.classList.add("show");
  };
  const deactivate = () => {
    el.classList.remove("focus");
    el.querySelectorAll(".on").forEach((node) => node.classList.remove("on"));
    card.classList.remove("show");
  };
  el.querySelectorAll(".planet").forEach((p) => {
    const i = Number(p.dataset.i);
    p.addEventListener("mouseenter", () => activate(i));
    p.addEventListener("focus", () => activate(i));
    p.addEventListener("mouseleave", deactivate);
    p.addEventListener("blur", deactivate);
    p.addEventListener("click", (e) => {
      e.preventDefault();
      const box = p.querySelector(".pl").getBoundingClientRect();
      warpTo(p.getAttribute("href"), planetColor(CHAPTERS[i]), box.left + box.width / 2, box.top + box.height / 2);
    });
  });
  return { activate, deactivate };
}

/* ---------- 名詞查詢 ---------- */
/* sessionStorage 小工具：分頁關掉就清空；瀏覽器不給用時安靜地略過 */
const store = {
  get(k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (err) { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (err) { /* 忽略 */ } },
  del(k) { try { sessionStorage.removeItem(k); } catch (err) { /* 忽略 */ } }
};
const KEY_QUERY = "os-notes-query";     // 最後一次搜尋的文字
const KEY_RETURN = "os-notes-return";   // 從哪裡跳去看完整說明
const KEY_RESTORE = "os-notes-restore"; // 回到原頁時要捲到的位置

function clearHighlights() {
  document.querySelectorAll("mark.hl").forEach((m) => {
    const parent = m.parentNode;
    m.replaceWith(...m.childNodes);
    parent.normalize();
  });
}
const normalize = (t) => (t || "").toLowerCase().replace(/[\s_\-()（）'’「」]/g, "");
const chapterBySlug = (slug) => CHAPTERS.find((c) => c.slug === slug);

function searchGlossary(query) {
  const q = normalize(query);
  if (!q || typeof GLOSSARY === "undefined") return [];
  return GLOSSARY.map((g) => {
    const names = [g.term, g.zh, ...(g.aliases || [])].map(normalize);
    let score = 0;
    if (names.some((n) => n === q)) score = 100;
    else if (names.some((n) => n.startsWith(q))) score = 60;
    else if (names.some((n) => n.includes(q) || (q.length >= 3 && q.includes(n) && n.length >= 2))) score = 35;
    else if (normalize(g.def).includes(q)) score = 8;
    return { g, score };
  }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score).map((r) => r.g);
}

/* 名詞庫找不到時，在網路上（GitHub Pages）把各章內容抓下來做全文搜尋 */
let chapterTextCache = null;
async function searchChapterText(query, root) {
  if (!/^https?:/.test(location.protocol)) return null;
  if (!chapterTextCache) {
    chapterTextCache = await Promise.all(CHAPTERS.map(async (c) => {
      try {
        const html = await (await fetch(`${root}/chapters/${c.slug}.html`)).text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        const blocks = Array.from(doc.querySelectorAll("main.content p, main.content li, main.content dd, main.content td"))
          .map((el) => el.textContent.replace(/\s+/g, " ").trim()).filter(Boolean);
        return { c, blocks };
      } catch (err) { return { c, blocks: [] }; }
    }));
  }
  const q = query.toLowerCase();
  const hits = [];
  chapterTextCache.forEach(({ c, blocks }) => {
    blocks.forEach((b) => { if (b.toLowerCase().includes(q) && hits.length < 6) hits.push({ c, text: b }); });
  });
  return hits;
}

function setupLookup(root, current) {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="lookup" id="lookup" hidden>
      <div class="lookup-panel" role="dialog" aria-label="名詞查詢">
        <div class="lookup-head">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>
          <input id="lookup-input" type="search" autocomplete="off" placeholder="輸入忘記的名詞，例如 PCB、時間片、semaphore...">
          <kbd>ESC</kbd>
        </div>
        <div class="lookup-body" id="lookup-body"></div>
      </div>
    </div>
    <button class="sel-bubble" id="sel-bubble" type="button" hidden></button>`);

  const box = document.getElementById("lookup");
  const input = document.getElementById("lookup-input");
  const body = document.getElementById("lookup-body");
  const bubble = document.getElementById("sel-bubble");
  const esc = (t) => String(t).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const chip = (slug) => {
    const c = chapterBySlug(slug);
    return c ? `<span class="ch-chip" style="--pc: ${planetColor(c)}">CH.${c.no} ${esc(c.title)}</span>` : "";
  };

  const showDetail = (g) => {
    const c = chapterBySlug(g.chapter);
    const here = g.chapter === current;
    const candidates = [g.term, g.zh, ...(g.aliases || [])].filter((t) => t && t.length > 1).join("|");
    const href = `${root}/chapters/${g.chapter}.html?hl=${encodeURIComponent(candidates)}#${g.section}`;
    body.innerHTML = `
      <button class="lookup-back" type="button">← 回到搜尋結果</button>
      <article class="term-card" style="--pc: ${c ? planetColor(c) : "var(--gold)"}">
        <div class="term-top">${chip(g.chapter)}${here ? `<span class="here">就在這一章</span>` : ""}</div>
        <h3>${esc(g.term)}</h3>
        <p class="zh">${esc(g.zh)}</p>
        <p class="def">${esc(g.def)}</p>
        ${g.related && g.related.length ? `<div class="related"><span>相關名詞</span>${g.related.map((r) => `<button type="button" data-term="${esc(r)}">${esc(r)}</button>`).join("")}</div>` : ""}
        <a class="term-go" href="${href}">${here ? "在這一章找到它" : `到第 ${c ? c.no : ""} 章看完整說明`} →</a>
      </article>`;
    body.querySelector(".lookup-back").addEventListener("click", () => render(input.value));
    body.querySelector(".term-go").addEventListener("click", (e) => {
      const info = rememberOrigin(g.term, c);
      if (here) {
        // 名詞就在這一章：不重新載入，直接捲過去標亮
        e.preventDefault();
        close();
        jumpTo(candidates, g.section);
        showReturnBar(info);
      }
    });
    body.querySelectorAll(".related button").forEach((b) => b.addEventListener("click", () => {
      const target = GLOSSARY.find((x) => x.term === b.dataset.term);
      if (target) showDetail(target);
    }));
  };

  const render = async (query) => {
    const q = query.trim();
    store.set(KEY_QUERY, q);
    if (!q) {
      body.innerHTML = `<p class="lookup-hint">讀到忘記的名詞時，在這裡輸入就能看到解釋。也可以直接在內文<strong>反白</strong>一個詞，按旁邊跳出的「查詢」。<br>名詞庫目前收錄 ${typeof GLOSSARY === "undefined" ? 0 : GLOSSARY.length} 個名詞，全部來自已經寫好的章節。</p>`;
      return;
    }
    const results = searchGlossary(q);
    const findBtn = current ? `<button type="button" class="lookup-findall">在這一章找出「${esc(q)}」的每一處 →</button>` : "";
    if (results.length) {
      // 輸入的字剛好等於某個名詞：把它放在最上面直接展開，其他結果照樣列在下面
      const nq = normalize(q);
      const exactIdx = results.findIndex((g) => [g.term, g.zh, ...(g.aliases || [])].map(normalize).includes(nq));
      const expanded = (g, i) => {
        const c = chapterBySlug(g.chapter);
        return `<li class="expanded" style="--pc: ${c ? planetColor(c) : "var(--gold)"}">
          <div class="ex-head"><span class="lt">${esc(g.term)} <small>${esc(g.zh)}</small></span>${chip(g.chapter)}</div>
          <p class="ex-def">${esc(g.def)}</p>
          ${g.related && g.related.length ? `<div class="related"><span>相關名詞</span>${g.related.map((r) => `<button type="button" data-term="${esc(r)}">${esc(r)}</button>`).join("")}</div>` : ""}
          <button type="button" class="ex-go" data-i="${i}">${g.chapter === current ? "在這一章找到它" : `到第 ${c ? c.no : ""} 章看完整說明`} →</button>
        </li>`;
      };
      const items = results.slice(0, 8);
      body.innerHTML = `<ul class="lookup-list">${items.map((g, i) => i === exactIdx ? expanded(g, i) : `
        <li><button type="button" class="item" data-i="${i}">
          <span class="lt">${esc(g.term)} <small>${esc(g.zh)}</small></span>${chip(g.chapter)}
          <span class="ld">${esc(g.def)}</span>
        </button></li>`).join("")}</ul>${findBtn}`;
      // 精確符合的那一個移到最上面
      const ex = body.querySelector("li.expanded");
      if (ex) ex.parentNode.prepend(ex);
      body.querySelectorAll(".lookup-list button.item").forEach((b) => b.addEventListener("click", () => showDetail(items[Number(b.dataset.i)])));
      body.querySelectorAll("li.expanded .related button").forEach((b) => b.addEventListener("click", () => {
        const target = GLOSSARY.find((x) => x.term === b.dataset.term);
        if (target) showDetail(target);
      }));
      const go = body.querySelector(".ex-go");
      if (go) go.addEventListener("click", () => {
        showDetail(items[Number(go.dataset.i)]);
        body.querySelector(".term-go").click();
      });
      const fb = body.querySelector(".lookup-findall");
      if (fb) fb.addEventListener("click", () => findInChapter(q));
      return;
    }
    body.innerHTML = `<p class="lookup-hint">名詞庫裡還沒有「${esc(q)}」，正在各章內容裡找...</p>`;
    const hits = await searchChapterText(q, root);
    if (input.value.trim() !== q) return;
    if (hits && hits.length) {
      body.innerHTML = `<p class="lookup-hint">名詞庫裡沒有「${esc(q)}」，但它在這些段落出現過：</p>
        <ul class="lookup-list">${hits.map((h) => `
          <li><a href="${root}/chapters/${h.c.slug}.html?hl=${encodeURIComponent(q)}">
            ${chip(h.c.slug)}<span class="ld">${esc(h.text.length > 120 ? h.text.slice(0, 120) + "..." : h.text)}</span>
          </a></li>`).join("")}</ul>`;
      body.querySelectorAll(".lookup-list a").forEach((a, i) => a.addEventListener("click", () => rememberOrigin(q, hits[i].c)));
      if (current) {
        body.insertAdjacentHTML("beforeend", `<button type="button" class="lookup-findall">在這一章找出「${esc(q)}」的每一處 →</button>`);
        body.querySelector(".lookup-findall").addEventListener("click", () => findInChapter(q));
      }
    } else {
      body.innerHTML = `<p class="lookup-hint">目前的章節裡找不到「${esc(q)}」。可能是還沒教到的內容，或換個寫法試試看（中文、英文、縮寫都可以）。</p>`;
    }
  };

  // query 沒給：沿用上一次的搜尋（換頁、按上一頁回來，結果都還在）
  // listOnly：一律顯示結果清單，不自動打開某一個名詞
  const open = (query, listOnly = false) => {
    const given = typeof query === "string";
    if (!given) query = store.get(KEY_QUERY) || "";
    if (box.hidden) readingY = window.scrollY;   // 打開查詢前，記住正在讀的位置
    box.hidden = false;
    input.value = query;
    // 一律先顯示完整的結果清單，由使用者自己點要看哪一個
    render(query);
    input.focus({ preventScroll: true });
  };
  let readingY = window.scrollY;
  const close = () => { box.hidden = true; };

  /* 跳去看完整說明前，記住「從哪一章、讀到哪裡、搜尋了什麼」 */
  const here = chapterBySlug(current);
  function rememberOrigin(term, targetChapter) {
    // 如果現在已經是「看完整說明」的狀態（上方提示列還開著），代表使用者還在查詢的路上，
    // 這時候不能把出發點換成現在的位置，要沿用最一開始讀到一半的那個地方
    const prev = store.get(KEY_RETURN);
    const bar = document.getElementById("return-bar");
    const keep = prev && bar && !bar.hidden;
    const info = {
      from: keep ? prev.from : location.pathname,
      y: keep ? prev.y : readingY,
      query: input.value.trim(),
      term,
      fromLabel: keep ? prev.fromLabel : (here ? `CH.${here.no} ${here.title}` : ""),
      target: targetChapter ? targetChapter.slug : ""
    };
    store.set(KEY_RETURN, info);
    store.set(KEY_QUERY, info.query);
    return info;
  }

  /* 看完整說明時，畫面上方的提示列：回到搜尋結果、回到剛剛讀的地方 */
  function showReturnBar(info) {
    let bar = document.getElementById("return-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "return-bar";
      bar.className = "return-bar top-bar";
      document.body.appendChild(bar);
    }
    const sameChapter = info.from === location.pathname;
    bar.innerHTML = `
      <span class="rb-label">正在看「${esc(info.term)}」的完整說明</span>
      <button type="button" data-act="results">← 回到搜尋結果${info.query ? `<small>「${esc(info.query)}」</small>` : ""}</button>
      <button type="button" data-act="back">↩ 回到剛剛讀的地方<small>${sameChapter ? "這一章原本的位置" : esc(info.fromLabel)}</small></button>
      <button type="button" class="rb-x" data-act="close" aria-label="關閉">×</button>`;
    bar.hidden = false;
    const on = (act, fn) => bar.querySelector(`[data-act="${act}"]`).addEventListener("click", fn);
    on("results", () => open(info.query));
    on("back", () => {
      store.del(KEY_RETURN);
      bar.hidden = true;
      clearHighlights();
      if (sameChapter) {
        window.scrollTo({ top: info.y, behavior: "smooth" });
      } else {
        store.set(KEY_RESTORE, { path: info.from, y: info.y });
        location.href = info.from;
      }
    });
    on("close", () => {
      store.del(KEY_RETURN);
      bar.hidden = true;
    });
  }

  /* 另一個功能：本章搜尋。像瀏覽器的「尋找」，把這一章裡某個字的每一處都標出來，用 ↑ ↓ 一個一個看。
     入口有兩個：標題列的「本章搜尋」按鈕，和名詞查詢清單最下面的「在這一章找出每一處」 */
  const KEY_FIND = "os-notes-find";
  let findBar = null, findInput = null, findTimer = null;
  function ensureFindBar() {
    if (findBar) return findBar;
    findBar = document.createElement("div");
    findBar.id = "find-bar";
    findBar.className = "return-bar find-bar";
    findBar.hidden = true;
    findBar.innerHTML = `
      <span class="rb-label">本章搜尋</span>
      <input id="find-input" type="text" autocomplete="off" placeholder="輸入要找的字，例如 thread、stack">
      <span class="fb-res"></span>
      <button type="button" class="rb-x" data-act="close" aria-label="關閉">×</button>`;
    document.body.appendChild(findBar);
    findInput = findBar.querySelector("#find-input");
    findInput.addEventListener("input", () => {
      clearTimeout(findTimer);
      findTimer = setTimeout(() => runFind(findInput.value), 280);   // 打字停一下再找，不會每個字都跳來跳去
    });
    findInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        clearTimeout(findTimer);
        // 字跟上一次一樣就跳下一處（Shift+Enter 上一處），不一樣就重新找
        if (findInput.value.trim() && findInput.value.trim() === findState.terms && findState.marks.length) focusMark(e.shiftKey ? -1 : 1);
        else runFind(findInput.value);
        renderFindRes();
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeFind();
      }
    });
    findBar.querySelector('[data-act="close"]').addEventListener("click", closeFind);
    return findBar;
  }
  function runFind(q) {
    q = q.trim();
    store.set(KEY_FIND, q);
    if (!q) { clearHighlights(); findState = { marks: [], i: 0, term: "", mode: "all", total: 0, keyTotal: 0, section: "", terms: "" }; renderFindRes(); return; }
    findAll(q, "", "all");
    findState.terms = q;
    renderFindRes();
  }
  // 只更新輸入框右邊的結果區，輸入框本身不重畫，打字才不會被打斷
  function renderFindRes() {
    const res = findBar.querySelector(".fb-res");
    const q = findInput.value.trim();
    const n = findState.marks.length;
    if (!q) { res.innerHTML = `<span class="fb-hint">Enter 下一處 · Shift+Enter 上一處</span>`; return; }
    if (!n) { res.innerHTML = `<span class="fb-hint">${q.length < 2 ? "至少輸入兩個字" : `這一章找不到「${esc(q)}」`}</span>`; return; }
    res.innerHTML = `
      <span class="rb-nav">
        <button type="button" data-act="prev" aria-label="上一處">↑</button>
        <span class="rb-count">${findState.mode === "key" ? "重點 " : ""}${findState.i + 1} / ${n}</span>
        <button type="button" data-act="next" aria-label="下一處">↓</button>
      </span>
      ${findState.mode === "key" && findState.total > n ? `<button type="button" class="rb-mode" data-act="all">顯示全部 ${findState.total} 處</button>` : ""}
      ${findState.mode === "all" && findState.keyTotal > 0 && findState.keyTotal < findState.total ? `<button type="button" class="rb-mode" data-act="key">只看重點 ${findState.keyTotal} 處</button>` : ""}`;
    const on = (act, fn) => { const el = res.querySelector(`[data-act="${act}"]`); if (el) el.addEventListener("click", fn); };
    on("prev", () => { focusMark(-1); renderFindRes(); });
    on("next", () => { focusMark(1); renderFindRes(); });
    on("all", () => { findAll(findState.term, "", "all"); findState.terms = q; renderFindRes(); });
    on("key", () => { findAll(findState.term, "", "key"); findState.terms = q; renderFindRes(); });
  }
  function openFind(q) {
    close();
    const rb = document.getElementById("return-bar");
    if (rb) rb.hidden = true;
    ensureFindBar().hidden = false;
    if (findBtn) findBtn.setAttribute("aria-pressed", "true");
    if (typeof q === "string") { findInput.value = q; runFind(q); }
    else {
      if (!findInput.value) findInput.value = store.get(KEY_FIND) || "";
      if (findInput.value.trim() && !findState.marks.length) runFind(findInput.value); else renderFindRes();
      findInput.select();
    }
    findInput.focus({ preventScroll: true });
  }
  function closeFind() {
    if (findBar) findBar.hidden = true;
    if (findBtn) findBtn.setAttribute("aria-pressed", "false");
    clearHighlights();
    findState = { marks: [], i: 0, term: "", mode: "all", total: 0, keyTotal: 0, section: "", terms: "" };
  }
  function findInChapter(q) { openFind(q); }
  const findBtn = document.getElementById("find-open");
  if (findBtn) findBtn.addEventListener("click", () => (findBar && !findBar.hidden ? closeFind() : openFind()));

  // 從名詞查詢跳過來，或從首頁搜尋點進來：跳到那個位置並閃動
  const params = new URLSearchParams(location.search);
  const hl = params.get("hl");
  const q = params.get("q");
  if (hl || q) {
    window.addEventListener("load", () => {
      const run = () => {
        const target = hl ? { terms: hl, section: location.hash.slice(1) } : candidatesFor(q, current);
        jumpTo(target.terms, target.section);
        const ret = store.get(KEY_RETURN);
        // 只要還在查詢的路上就顯示提示列（就算繞回出發的那一章也一樣）
        if (hl && ret) showReturnBar(ret);
      };
      // 等字型載完、版面定下來再跳，位置才準
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(run); else run();
    });
  }

  document.getElementById("lookup-open").addEventListener("click", () => open());
  input.addEventListener("input", () => render(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // type="search" 的輸入框按 Esc 預設會清空文字，這裡只想關掉視窗、保留搜尋
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "Enter") {
      const first = body.querySelector(".lookup-list .ex-go, .lookup-list button.item, .lookup-list a");
      if (first) first.click();
    }
  });
  box.addEventListener("click", (e) => { if (e.target === box) close(); });
  document.addEventListener("keydown", (e) => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
    if (e.key === "Escape" && !box.hidden) close();
    else if (e.key === "F" && e.shiftKey && !typing && !e.metaKey && !e.ctrlKey) { e.preventDefault(); openFind(); }
    else if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
      e.preventDefault();
      open();
    }
  });

  /* 反白內文中的名詞，旁邊跳出「查詢」 */
  const main = document.querySelector("main.content");
  document.addEventListener("mouseup", (e) => {
    if (e.target === bubble) return;
    setTimeout(() => {
      const sel = window.getSelection();
      const text = sel ? sel.toString().trim() : "";
      if (!text || text.length > 40 || !sel.rangeCount || !main.contains(sel.anchorNode)) { bubble.hidden = true; return; }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      bubble.textContent = `查詢「${text.length > 16 ? text.slice(0, 16) + "..." : text}」`;
      bubble.dataset.q = text;
      bubble.style.left = `${Math.min(window.innerWidth - 200, rect.left + rect.width / 2)}px`;
      bubble.style.top = `${rect.top - 10}px`;
      bubble.hidden = false;
    }, 10);
  });
  document.addEventListener("scroll", () => { bubble.hidden = true; }, { passive: true });
  bubble.addEventListener("click", () => {
    bubble.hidden = true;
    open(bubble.dataset.q);
  });
}

/* ---------- 在章節裡找關鍵字 ----------
   預設只標「重點」：出現在小標題、名詞定義、粗體強調、表格欄位標題的地方，
   也就是這個詞被正式介紹或解釋的位置；按「顯示全部」才標出每一處。 */
let findState = { marks: [], i: 0, term: "", mode: "key", total: 0, keyTotal: 0, section: "" };
const KEY_SELECTOR = "h3, dt, strong, th";

/* 判斷這個位置算不算「重點」：
   小標題（h3）只要包含關鍵字就算；名詞定義、粗體、表格欄位標題要以關鍵字開頭才算，
   這樣「Renderer process」這種複合名詞不會被當成 process 本身的說明 */
function isKeyPlace(el, needle) {
  const h3 = el.closest("h3");
  if (h3) return true;
  const box = el.closest("dt, strong, th");
  if (!box) return false;
  return box.textContent.trim().toLowerCase().startsWith(needle);
}

function textNodesWith(needle, onlyKey) {
  const main = document.querySelector("main.content");
  const nodes = [];
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const el = node.parentElement;
    if (el.closest(".chapter-head, .pager, mark")) continue;
    if (onlyKey && !isKeyPlace(el, needle)) continue;
    if (node.textContent.toLowerCase().includes(needle)) nodes.push(node);
  }
  return nodes;
}

function countOccurrences(term, onlyKey) {
  const needle = term.toLowerCase();
  return textNodesWith(needle, onlyKey).reduce((sum, n) =>
    sum + n.textContent.toLowerCase().split(needle).length - 1, 0);
}

/* 把符合的地方包成 <mark class="hl">（不分大小寫） */
function markAll(term, onlyKey) {
  const needle = term.toLowerCase();
  textNodesWith(needle, onlyKey).forEach((n) => {
    const text = n.textContent.toLowerCase();
    const starts = [];
    let k = text.indexOf(needle);
    while (k !== -1) { starts.push(k); k = text.indexOf(needle, k + needle.length); }
    // 從後面往前包，前面的位置才不會跑掉
    for (let j = starts.length - 1; j >= 0; j--) {
      const range = document.createRange();
      range.setStart(n, starts[j]);
      range.setEnd(n, starts[j] + term.length);
      const mark = document.createElement("mark");
      mark.className = "hl";
      range.surroundContents(mark);
    }
  });
  return Array.from(document.querySelectorAll("main.content mark.hl"));
}

/* terms 用 | 分隔多個候選寫法，用第一個在這頁找得到的；
   mode = "key" 只標重點（找不到重點就自動改成全部），"all" 標出每一處；
   有指定區塊的話，從那個區塊裡第一次出現的地方開始 */
function findAll(terms, sectionId, mode = "key") {
  clearHighlights();
  const list = terms.split("|").map((t) => t.trim()).filter((t) => t.length > 1);
  for (const t of list) {
    const total = countOccurrences(t, false);
    if (!total) continue;
    const keyTotal = countOccurrences(t, true);
    const useMode = mode === "key" && keyTotal > 0 ? "key" : "all";
    const marks = markAll(t, useMode === "key");
    const start = sectionId ? document.getElementById(sectionId) : null;
    let i = 0;
    if (start) {
      const found = marks.findIndex((m) => start.compareDocumentPosition(m) & Node.DOCUMENT_POSITION_FOLLOWING);
      if (found >= 0) i = found;
    }
    findState = { marks, i, term: t, mode: useMode, total, keyTotal, section: sectionId || "", terms };
    focusMark();
    return marks.length;
  }
  findState = { marks: [], i: 0, term: "", mode: "key", total: 0, keyTotal: 0, section: "", terms };
  return 0;
}

function focusMark(step = 0) {
  const { marks } = findState;
  if (!marks.length) return;
  findState.i = (findState.i + step + marks.length) % marks.length;
  marks.forEach((m) => m.classList.remove("cur"));
  const cur = marks[findState.i];
  cur.classList.add("cur");
  setTimeout(() => cur.scrollIntoView({ behavior: "smooth", block: "center" }), step ? 0 : 250);
  const count = document.querySelector("#find-bar .rb-count");
  if (count) count.textContent = `${findState.mode === "key" ? "重點 " : ""}${findState.i + 1} / ${marks.length}`;
}

/* 跳到一個位置並讓它閃動（名詞查詢、首頁搜尋點進來時用）：
   優先找有指定區塊之後的「重點位置」，沒有的話找區塊之後第一次出現的地方 */
function jumpTo(terms, sectionId) {
  clearHighlights();
  const list = terms.split("|").map((t) => t.trim()).filter((t) => t.length > 1);
  const start = sectionId ? document.getElementById(sectionId) : null;
  const after = (node) => !start || (start.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING);
  for (const t of list) {
    const needle = t.toLowerCase();
    const all = textNodesWith(needle, false);
    if (!all.length) continue;
    const key = textNodesWith(needle, true);
    const node = key.find(after) || all.find(after) || key[0] || all[0];
    const idx = node.textContent.toLowerCase().indexOf(needle);
    const range = document.createRange();
    range.setStart(node, idx);
    range.setEnd(node, idx + t.length);
    const mark = document.createElement("mark");
    mark.className = "hl cur flash";
    range.surroundContents(mark);
    setTimeout(() => mark.scrollIntoView({ behavior: "smooth", block: "center" }), 250);
    return true;
  }
  return false;
}

/* 首頁搜尋帶過來的關鍵字：如果名詞庫裡有這個詞而且就在這一章，
   也用它的其他寫法一起找，並從它被正式介紹的區塊開始 */
function candidatesFor(q, current) {
  const nq = normalize(q);
  const g = (typeof GLOSSARY === "undefined" ? [] : GLOSSARY).find((x) =>
    x.chapter === current && [x.term, x.zh, ...(x.aliases || [])].map(normalize).includes(nq));
  if (!g) return { terms: q, section: "" };
  return { terms: [q, g.term, g.zh, ...(g.aliases || [])].join("|"), section: g.section, label: g.term };
}

/* 跳到某一章：行星色的圓從 (x, y) 擴散蓋滿畫面，再換頁；新頁面再從中間收回來 */
function warpTo(href, color, x, y) {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { location.href = href; return; }
  try { sessionStorage.setItem("os-notes-warp", color); } catch (err) { /* 沒有 storage 也沒關係 */ }
  const warp = document.createElement("div");
  warp.className = "warp";
  warp.style.setProperty("--pc", color);
  warp.style.setProperty("--x", `${x}px`);
  warp.style.setProperty("--y", `${y}px`);
  document.body.appendChild(warp);
  setTimeout(() => { location.href = href; }, 560);
}

(function () {
  const body = document.body;
  const root = body.dataset.root || ".";
  const current = body.dataset.chapter || null;

  /* ---------- 段落分區：把每個 h2 和它底下的內容包成一個「星系區塊」 ----------
     章節 HTML 不用改，維持「h2 + 內容」的寫法，這裡自動加上區塊框、行星徽章和分隔軌道 */
  const SEC_META = {
    "key-points": { label: "KEY POINTS", glyph: "star" },
    "concepts":   { label: "CONCEPTS",   glyph: "ring" },
    "example":    { label: "EXAMPLE",    glyph: "comet" },
    "pseudocode": { label: "PSEUDOCODE", glyph: "sat" },
    "comparison": { label: "COMPARE",    glyph: "moon" },
    "quiz":       { label: "QUIZ",       glyph: "q" },
    "reading":    { label: "READING",    glyph: "scope" }
  };
  const GLYPH = {
    star:  '<path d="M28 17l2.6 7.4 7.4 2.6-7.4 2.6L28 37l-2.6-7.4L18 27l7.4-2.6z" class="g-fill"/>',
    ring:  '<circle cx="28" cy="27" r="6.5" class="g-fill"/><ellipse cx="28" cy="27" rx="12" ry="4" transform="rotate(-20 28 27)" class="g-line"/>',
    comet: '<circle cx="33" cy="22" r="4.5" class="g-fill"/><path d="M30 25L18 37M33 27l-9 11M28 21l-10 9" class="g-line"/>',
    sat:   '<rect x="24.5" y="23.5" width="7" height="7" class="g-fill" transform="rotate(45 28 27)"/><path d="M16 21l6 6M34 27l6 6M18 33l4-4M34 21l4-4" class="g-line"/>',
    moon:  '<path d="M32 18a9 9 0 1 0 0 18 7.5 7.5 0 1 1 0-18z" class="g-fill"/>',
    q:     '<text x="28" y="33" text-anchor="middle" class="g-text">?</text>',
    scope: '<path d="M18 31l14-7 2 4-14 7z" class="g-fill"/><path d="M27 33l-3 6M27 33l4 6" class="g-line"/><circle cx="37" cy="20" r="1.4" class="g-fill"/>'
  };
  const main = document.querySelector("main.content");
  if (main && current) {
    const h2s = Array.from(main.querySelectorAll(":scope > h2"));
    h2s.forEach((h2, i) => {
      const meta = SEC_META[h2.id] || { label: "SECTION", glyph: "ring" };
      const sec = document.createElement("section");
      sec.className = "sec-block";
      sec.dataset.sec = h2.id || "";
      main.insertBefore(sec, h2);
      // 標題列：行星徽章 + SECTION 編號 + 標題
      const head = document.createElement("div");
      head.className = "sec-head";
      head.innerHTML = `<svg class="sec-badge" viewBox="0 0 56 56" aria-hidden="true">
          <ellipse cx="28" cy="28" rx="26" ry="9" class="orbit" transform="rotate(-24 28 28)"/>
          <circle cx="28" cy="27" r="17" class="disc"/>
          ${GLYPH[meta.glyph]}
          <circle cx="51" cy="18" r="2.6" class="moonlet"/>
        </svg>
        <div class="sec-titles"><span class="sec-label">SECTION ${String(i + 1).padStart(2, "0")} · ${meta.label}</span></div>`;
      sec.appendChild(head);
      head.querySelector(".sec-titles").appendChild(h2);
      const dots = document.createElement("span");
      dots.className = "sec-dots";
      dots.setAttribute("aria-hidden", "true");
      head.querySelector(".sec-titles").appendChild(dots);
      // 把 h2 之後、下一個 h2 之前的內容都搬進這個區塊
      const bodyEl = document.createElement("div");
      bodyEl.className = "sec-body";
      sec.appendChild(bodyEl);
      let n = sec.nextSibling;
      while (n && !(n.nodeType === 1 && (n.tagName === "H2" || n.classList.contains("pager")))) {
        const next = n.nextSibling;
        bodyEl.appendChild(n);
        n = next;
      }
      // 區塊之間的軌道分隔線（最後一個不用）
      if (i < h2s.length - 1) {
        const div = document.createElement("div");
        div.className = "sec-divider";
        div.setAttribute("aria-hidden", "true");
        div.innerHTML = `<span class="line"></span><svg viewBox="0 0 40 20"><ellipse cx="20" cy="10" rx="17" ry="5" class="orbit"/><circle cx="20" cy="10" r="5.5" class="disc"/></svg><span class="line"></span>`;
        sec.after(div);
      }
    });
    // 正在讀的區塊亮起來：畫面中間偏上那條線落在哪個區塊，就幫它加上 .lit
    const blocks = Array.from(main.querySelectorAll(".sec-block"));
    let ticking = false;
    const lightUp = () => {
      ticking = false;
      const line = window.innerHeight * 0.4;
      let hit = null;
      for (const b of blocks) {
        const r = b.getBoundingClientRect();
        if (r.top <= line && r.bottom >= line) { hit = b; break; }
      }
      // 剛好停在兩個區塊中間的分隔線時，亮離那條線最近的那個
      if (!hit) {
        let best = Infinity;
        blocks.forEach((b) => {
          const r = b.getBoundingClientRect();
          const d = Math.min(Math.abs(r.top - line), Math.abs(r.bottom - line));
          if (d < best) { best = d; hit = b; }
        });
      }
      blocks.forEach((b) => b.classList.toggle("lit", b === hit));
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(lightUp); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    lightUp();

    // 提醒框加上圓形徽章（! ? ★），像貼在框角的貼紙
    main.querySelectorAll(".callout").forEach((c) => {
      const mark = c.classList.contains("warn") ? "!" : c.classList.contains("tip") ? "★" : "i";
      const b = document.createElement("span");
      b.className = "callout-badge";
      b.setAttribute("aria-hidden", "true");
      b.textContent = mark;
      c.prepend(b);
    });
  }
  const chapterHref = (c) => `${root}/chapters/${c.slug}.html`;
  const currentChapter = CHAPTERS.find((c) => c.slug === current);

  /* ---------- 共用：背景的彩色行星與流星 ---------- */
  if (currentChapter) document.documentElement.style.setProperty("--pc", planetColor(currentChapter));
  document.body.insertAdjacentHTML("afterbegin", `
    <div class="space-deco" aria-hidden="true">
      <div class="deco" style="right:-34px; ${current ? "bottom:30%" : "bottom:12%"}; width:130px; height:130px; opacity:${current ? 0.55 : 0.95}">${decoPlanet("var(--g5)", true)}</div>
      <div class="deco" style="left:2.5%; bottom:10%; width:52px; height:52px; opacity:${current ? 0.5 : 0.9}">${decoPlanet("var(--g2)", false)}</div>
      <div class="deco" style="right:4%; bottom:7%; width:70px; height:70px; opacity:${current ? 0.5 : 0.9}">${decoPlanet("var(--g3)", false)}</div>
      <div class="deco" style="${current ? "left:1.2%; bottom:22%" : "left:45%; top:15%"}; width:28px; height:28px; color:var(--g1); opacity:0.9">
        <svg viewBox="0 0 64 64" width="100%" height="100%"><path fill="currentColor" d="M41 10a23 23 0 1 0 13 34A18 18 0 0 1 41 10z"/></svg>
      </div>
      <span class="shoot" style="right:8%; top:14%"></span>
      <span class="shoot s2" style="right:38%; top:6%"></span>
    </div>`);

  /* ---------- 共用：標誌與頁尾 ---------- */
  const brand = document.querySelector(".brand");
  if (brand) brand.insertAdjacentHTML("afterbegin", icon("planet"));
  const footer = document.querySelector(".site-footer");
  if (footer) footer.insertAdjacentHTML("afterbegin", icon("sparkle"));

  /* ---------- 首頁：太陽系、卡片、搜尋 ---------- */
  /* 從太陽系跳過來的話，先用行星色蓋住畫面再收回來 */
  let arrived = null;
  try { arrived = sessionStorage.getItem("os-notes-warp"); sessionStorage.removeItem("os-notes-warp"); } catch (err) { /* 忽略 */ }
  if (arrived) {
    const out = document.createElement("div");
    out.className = "warp out";
    out.style.setProperty("--pc", arrived);
    document.body.appendChild(out);
    setTimeout(() => out.remove(), 700);
  }

  const solar = document.getElementById("solar");
  const solarApi = solar ? drawSolarSystem(solar, root) : null;

  /* 按瀏覽器的上一頁時，頁面會從快取（bfcache）原封不動還原，連跳轉用的色塊也在。
     所以頁面重新顯示時，把色塊拿掉、把浮起來的行星放回去 */
  window.addEventListener("pageshow", (e) => {
    if (!e.persisted) return;
    document.querySelectorAll(".warp").forEach((w) => w.remove());
    if (solarApi) solarApi.deactivate();
  });

  /* 從「回到剛剛讀的地方」回來：捲回原本讀到的位置 */
  const restore = store.get(KEY_RESTORE);
  if (restore && restore.path === location.pathname) {
    store.del(KEY_RESTORE);
    // 等字型載完、版面定下來再捲，位置才會準
    window.addEventListener("load", () => {
      const go = () => window.scrollTo({ top: restore.y, behavior: "instant" });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => setTimeout(go, 50));
      else go();
    });
  }

  const cardBox = document.getElementById("chapter-cards");
  if (cardBox) {
    const search = document.getElementById("chapter-search");
    const empty = document.getElementById("chapter-empty");
    const render = (keyword) => {
      const k = (keyword || "").trim().toLowerCase();
      // 除了章節標題、簡介、標籤，也從名詞庫找：某章的名詞符合，就列出那一章
      const hits = k ? searchGlossary(k) : [];
      const termsBy = {};
      hits.forEach((g) => { (termsBy[g.chapter] = termsBy[g.chapter] || []).push(g.term); });
      const list = CHAPTERS.filter((c) =>
        !k || termsBy[c.slug] || [c.no, c.title, c.en, c.summary, ...c.tags].join(" ").toLowerCase().includes(k)
      );
      cardBox.innerHTML = list.map((c) => `
        <a class="card" href="${chapterHref(c)}${k ? `?q=${encodeURIComponent(keyword.trim())}` : ""}" style="--pc: ${planetColor(c)}">
          ${termsBy[c.slug] ? `<span class="card-match">// 找到：${termsBy[c.slug].slice(0, 3).join("、")}${termsBy[c.slug].length > 3 ? " 等" : ""}</span>` : ""}
          <div class="card-top">
            <span class="no">CH.${c.no}</span>
            <span class="card-doodle">${icon(c.icon)}</span>
          </div>
          <p class="en">${c.en}</p>
          <h3>${c.title}</h3>
          <p>${c.summary}</p>
          <div class="tags">${c.tags.map((t) => `<span>${t}</span>`).join("")}</div>
        </a>`).join("");
      if (empty) empty.hidden = list.length > 0;
    };
    render("");
    if (search) search.addEventListener("input", (e) => render(e.target.value));
    // 滑鼠移到章節卡片上，太陽系裡對應的行星也會浮起來
    if (solarApi) {
      cardBox.addEventListener("mouseover", (e) => {
        const a = e.target.closest(".card");
        if (!a) return;
        const i = CHAPTERS.findIndex((c) => a.getAttribute("href") === chapterHref(c));
        if (i >= 0) solarApi.activate(i);
      });
      cardBox.addEventListener("mouseleave", solarApi.deactivate);
    }
  }

  /* ---------- 章節頁：標題資訊列與軌道插圖 ---------- */
  const head = document.querySelector(".chapter-head");
  if (head && currentChapter) {
    const eyebrow = head.querySelector(".eyebrow");
    if (eyebrow) eyebrow.textContent = `CH.${currentChapter.no} / ${String(CHAPTERS.length).padStart(2, "0")}  ·  ORBIT ${currentChapter.no}`;
    head.insertAdjacentHTML("beforeend", `
      <div class="chapter-doodle">
        <svg class="rings" viewBox="0 0 150 150" aria-hidden="true">${doodleOrbit(currentChapter)}</svg>
        <div class="core">${icon(currentChapter.icon)}</div>
      </div>`);
  }

  /* ---------- 章節頁：側欄 ---------- */
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.innerHTML = `<h4>Chapters</h4><ol>${CHAPTERS.map((c) => `
      <li><a href="${chapterHref(c)}" class="${c.slug === current ? "active" : ""}">
        <span class="no">${c.no}</span><span>${c.title}<small>${c.en}</small></span></a></li>`).join("")}</ol>`;
    const btn = document.getElementById("menu-btn");
    if (btn) btn.addEventListener("click", () => sidebar.classList.toggle("open"));
  }

  /* ---------- 章節頁：上一章 / 下一章 ---------- */
  const pager = document.getElementById("pager");
  if (pager && current) {
    const i = CHAPTERS.findIndex((c) => c.slug === current);
    const prev = CHAPTERS[i - 1];
    const next = CHAPTERS[i + 1];
    pager.innerHTML =
      (prev ? `<a class="prev" href="${chapterHref(prev)}"><small>Prev</small>${prev.no} ${prev.title}</a>` : `<a class="prev" href="${root}/index.html"><small>Home</small>回到首頁</a>`) +
      (next ? `<a class="next" href="${chapterHref(next)}"><small>Next</small>${next.no} ${next.title}</a>` : `<a class="next" href="${root}/index.html"><small>Home</small>所有章節</a>`);
  }

  /* ---------- 章節頁：本頁目錄（從 h2 產生）+ 捲動高亮 ---------- */
  const toc = document.getElementById("toc");
  const headings = Array.from(document.querySelectorAll("main.content h2[id]"));
  if (toc && headings.length) {
    toc.innerHTML = `<h4>On this page</h4><ol>${headings.map((h, i) =>
      `<li><a href="#${h.id}" data-id="${h.id}" data-n="${String(i + 1).padStart(2, "0")}">${h.textContent}</a></li>`).join("")}</ol>`;
    const links = toc.querySelectorAll("a");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((a) => a.classList.toggle("active", a.dataset.id === e.target.id));
        }
      });
    }, { rootMargin: "-90px 0px -70% 0px" });
    headings.forEach((h) => observer.observe(h));
  }

  /* ---------- 章節頁：標題列的「名詞查詢」和「HOME」按鈕 ---------- */
  const header = document.querySelector(".site-header");
  if (header && current) {
    const menuBtn = document.getElementById("menu-btn");
    header.insertAdjacentHTML("beforeend", `
      <div class="header-actions">
        <button class="lookup-btn" type="button" id="lookup-open" title="查詢名詞（快捷鍵 /）">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>
          <span>名詞查詢</span><kbd>/</kbd>
        </button>
        <button class="lookup-btn" type="button" id="find-open" title="在這一章找出某個字的每一處（快捷鍵 Shift+F）">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v6"/><path d="M6 3v18h7"/><path d="M14 3v4h4"/><circle cx="17" cy="17" r="3"/><path d="M19.2 19.2L21.5 21.5"/></svg>
          <span>本章搜尋</span>
        </button>
        <a class="home-btn" href="${root}/index.html" title="回到首頁">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/></svg>
          <span>HOME</span>
        </a>
      </div>`);
    if (menuBtn) header.querySelector(".header-actions").appendChild(menuBtn);
    setupLookup(root, current);
  }

})();
