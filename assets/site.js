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
    summary: "兩個 thread 同時改一個變數會出什麼事？從 race condition、CAS、mutex 到 semaphore 和 monitor。",
    tags: ["race condition", "critical section", "semaphore", "monitor", "liveness"]
  },
  {
    slug: "07-sync-examples",
    no: "07",
    title: "同步範例",
    en: "Synchronization Examples",
    short: "Sync Examples",
    icon: "table",
    summary: "用 semaphore 和 monitor 解三個經典問題：生產者消費者、讀者寫者、哲學家用餐。",
    tags: ["bounded buffer", "readers-writers", "dining philosophers", "POSIX semaphore"]
  },
  {
    slug: "08-deadlocks",
    no: "08",
    title: "死結",
    en: "Deadlocks",
    icon: "cycle",
    summary: "大家都在等對方放手怎麼辦？四個必要條件、RAG、銀行家演算法與偵測復原。",
    tags: ["deadlock", "resource allocation graph", "banker's algorithm", "safe state", "wait-for graph"]
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
  table: `
    <circle cx="32" cy="32" r="22"/>
    <circle cx="32.0" cy="19.0" r="4"/>
    <circle cx="44.4" cy="28.0" r="4"/>
    <circle cx="39.6" cy="42.5" r="4"/>
    <circle cx="24.4" cy="42.5" r="4"/>
    <circle cx="19.6" cy="28.0" r="4"/>
    <path d="M37.3 24.7L42.6 17.4M40.6 34.8L49.1 37.6M32.0 41.0L32.0 50.0M23.4 34.8L14.9 37.6M26.7 24.7L21.4 17.4"/>`,
  cycle: `
    <path d="M15.1 25.8A18 18 0 0 1 46.7 21.7"/>
    <path d="M46.7 15.7L46.7 21.7L41.1 19.7"/>
    <path d="M48.9 38.2A18 18 0 0 1 17.3 42.3"/>
    <path d="M17.3 48.3L17.3 42.3L22.9 44.3"/>`,
  sparkle: `<path class="fill" d="M32 4C33.6 25 39 30.4 60 32 39 33.6 33.6 39 32 60 30.4 39 25 33.6 4 32 25 30.4 30.4 25 32 4z"/>`
};

/* 行星色：第 1 章地球藍、第 2 章火星紅、第 3 章太陽黃…依序循環。CHAPTERS 裡寫 color 可以覆蓋 */
const PLANET_COLORS = ["var(--g3)", "var(--g2)", "var(--g1)", "var(--g5)", "var(--g4)", "var(--g6)", "var(--g7)"];
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
  // 筆記的畫線（mark.note-hl）不能拆掉，只清掉本章搜尋加上的狀態
  document.querySelectorAll("mark.note-hl.cur, mark.note-hl.note-match").forEach((m) => m.classList.remove("cur", "note-match"));
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
    <div class="sel-bubble" id="sel-bubble" hidden>
      <button type="button" data-act="lookup"></button>
      <button type="button" data-act="note">畫線加筆記</button>
    </div>`);

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

  /* 名詞查詢的結果下面，再列出內容符合的「你的筆記」 */
  const appendNoteHits = (q) => {
    const hits = searchNotes(q).slice(0, 6);
    if (!hits.length) return;
    const wrap = document.createElement("div");
    wrap.className = "lookup-notes";
    wrap.innerHTML = `<p class="ln-title">你的筆記</p><ul class="lookup-list">${hits.map((h, i) => `
      <li><a href="${root}/chapters/${h.chapter}.html?${h.type === "nb" ? "notebook=1" : `note=${encodeURIComponent(h.id)}`}" data-i="${i}">
        <span class="lt">${h.type === "nb" ? "整章筆記本" : esc(noteSnippet(h.quote, q, 40))}</span>${chip(h.chapter)}
        <span class="ld">${esc(noteSnippet(h.type === "nb" ? h.text : (h.note || "（只有畫線）"), q, 120))}</span>
      </a></li>`).join("")}</ul>`;
    wrap.querySelectorAll("a").forEach((a) => a.addEventListener("click", (e) => {
      const h = hits[Number(a.dataset.i)];
      if (h.chapter !== current) return;
      // 就在這一章：不重新載入，直接跳過去
      e.preventDefault();
      close();
      if (h.type === "nb" || !focusNote(h.id)) document.querySelector('.notes-btn').click();
    }));
    const fa = body.querySelector(".lookup-findall");
    if (fa) body.insertBefore(wrap, fa); else body.appendChild(wrap);
  };

  const render = async (query) => {
    await renderTerms(query);
    const q = query.trim();
    if (q && input.value.trim() === q && !body.querySelector(".lookup-notes")) appendNoteHits(q);
  };
  const renderTerms = async (query) => {
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
    addNoteMatches(q);
    renderFindRes();
  }
  // 只更新輸入框右邊的結果區，輸入框本身不重畫，打字才不會被打斷
  function renderFindRes() {
    const res = findBar.querySelector(".fb-res");
    const q = findInput.value.trim();
    const n = findState.marks.length;
    const inNotebook = current && q.length >= 2 && Notes.notebook(current).toLowerCase().includes(q.toLowerCase());
    const nbBtn = inNotebook ? `<button type="button" class="rb-mode" data-act="nb">整章筆記本也有</button>` : "";
    if (!q) { res.innerHTML = `<span class="fb-hint">Enter 下一處 · Shift+Enter 上一處</span>`; return; }
    if (!n) {
      res.innerHTML = `<span class="fb-hint">${q.length < 2 ? "至少輸入兩個字" : `這一章找不到「${esc(q)}」`}</span>${nbBtn}`;
      const b = res.querySelector('[data-act="nb"]');
      if (b) b.addEventListener("click", () => document.querySelector(".notes-btn").click());
      return;
    }
    res.innerHTML = `
      <span class="rb-nav">
        <button type="button" data-act="prev" aria-label="上一處">↑</button>
        <span class="rb-count">${findState.mode === "key" ? "重點 " : ""}${findState.i + 1} / ${n}</span>
        <button type="button" data-act="next" aria-label="下一處">↓</button>
      </span>
      ${findState.mode === "key" && findState.total > n ? `<button type="button" class="rb-mode" data-act="all">顯示全部 ${findState.total} 處</button>` : ""}
      ${findState.mode === "all" && findState.keyTotal > 0 && findState.keyTotal < findState.total ? `<button type="button" class="rb-mode" data-act="key">只看重點 ${findState.keyTotal} 處</button>` : ""}
      ${findState.noteCount ? `<span class="fb-hint">含 ${findState.noteCount} 則筆記</span>` : ""}${nbBtn}`;
    const on = (act, fn) => { const el = res.querySelector(`[data-act="${act}"]`); if (el) el.addEventListener("click", fn); };
    on("prev", () => { focusMark(-1); renderFindRes(); });
    on("next", () => { focusMark(1); renderFindRes(); });
    on("all", () => { findAll(findState.term, "", "all"); findState.terms = q; addNoteMatches(q); renderFindRes(); });
    on("nb", () => document.querySelector(".notes-btn").click());
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
  /* 反白之後，旁邊跳出「查詢」（40 字以內才有）和「畫線加筆記」 */
  const lookupPart = bubble.querySelector('[data-act="lookup"]');
  let bubbleRange = null;
  const showBubble = () => {
    const sel = window.getSelection();
    const text = sel ? sel.toString().trim() : "";
    if (!text || text.length > 2000 || !sel.rangeCount || !main.contains(sel.anchorNode) || !main.contains(sel.focusNode)) { bubble.hidden = true; return; }
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    bubbleRange = range.cloneRange();
    lookupPart.hidden = text.length > 40;
    lookupPart.textContent = `查詢「${text.length > 16 ? text.slice(0, 16) + "..." : text}」`;
    bubble.dataset.q = text;
    bubble.style.left = `${Math.max(120, Math.min(window.innerWidth - 140, rect.left + rect.width / 2))}px`;
    bubble.style.top = `${Math.max(64, rect.top - 10)}px`;
    bubble.hidden = false;
  };
  document.addEventListener("mouseup", (e) => {
    if (bubble.contains(e.target)) return;
    setTimeout(showBubble, 10);
  });
  // 手機、平板沒有 mouseup：選取停下來之後再顯示
  let selTimer = null;
  if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
    document.addEventListener("selectionchange", () => { clearTimeout(selTimer); selTimer = setTimeout(showBubble, 450); });
  }
  document.addEventListener("scroll", () => { bubble.hidden = true; }, { passive: true });
  bubble.addEventListener("mousedown", (e) => e.preventDefault());   // 按按鈕時不要把反白取消掉
  lookupPart.addEventListener("click", () => {
    bubble.hidden = true;
    open(bubble.dataset.q);
  });
  bubble.querySelector('[data-act="note"]').addEventListener("click", () => {
    bubble.hidden = true;
    startNoteFromRange(bubbleRange);
  });
}

/* =========================================================
   筆記：反白畫線加註解、整章筆記本、筆記總覽，並用 GitHub Gist 跨電腦同步
   資料一律先存在這台電腦的 localStorage（離線也能寫）；
   使用者在「同步設定」貼上只有 gist 權限的 token 後，才會和他自己帳號下的 secret gist 合併。
   合併規則：每一筆用 updated 時間比較，新的贏；刪除會留下 deleted 記號，才不會被另一台電腦加回來。
   ========================================================= */
const NOTES_KEY = "os-notes-notes";     // 筆記資料（localStorage）
const SYNC_KEY = "os-notes-sync";       // 同步設定：token、gist id、上次同步時間（localStorage）
const GIST_FILE = "os-notes.json";
const GIST_DESC = "OS Notes 筆記同步（由 OS 課程筆記站自動建立）";
const TOKEN_URL = "https://github.com/settings/tokens/new?scopes=gist&description=OS%20Notes%20sync";
const lstore = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (err) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (err) { return false; } }
};
const escapeHtml = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const newNoteId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const emptyNotes = () => ({ v: 1, items: {} });
const notesSig = (d) => Object.values((d && d.items) || {}).map((x) => `${x.id}:${x.updated || 0}`).sort().join("|");
const fmtTime = (ts) => ts ? new Date(ts).toLocaleString("zh-TW", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "";

function mergeNotes(a, b) {
  const items = Object.assign({}, a.items);
  Object.values((b && b.items) || {}).forEach((it) => {
    if (!it || !it.id) return;
    const cur = items[it.id];
    if (!cur || (it.updated || 0) > (cur.updated || 0)) items[it.id] = it;
  });
  return { v: 1, items };
}

const Notes = {
  data: emptyNotes(),
  listeners: [],
  load() { const d = lstore.get(NOTES_KEY); this.data = d && d.items ? d : emptyNotes(); },
  on(fn) { this.listeners.push(fn); },
  emit(kind) { this.listeners.forEach((fn) => fn(kind)); },
  persist() { lstore.set(NOTES_KEY, this.data); },
  put(item) {
    item.updated = Date.now();
    this.data.items[item.id] = item;
    this.persist(); this.emit("local"); Sync.schedule();
  },
  remove(id) {
    const it = this.data.items[id];
    if (!it) return;
    this.data.items[id] = { id, type: it.type, chapter: it.chapter, deleted: true, updated: Date.now() };
    this.persist(); this.emit("local"); Sync.schedule();
  },
  get(id) { const it = this.data.items[id]; return it && !it.deleted ? it : null; },
  highlights(slug) {
    return Object.values(this.data.items)
      .filter((x) => x.type === "hl" && !x.deleted && (!slug || x.chapter === slug))
      .sort((a, b) => (a.created || 0) - (b.created || 0));
  },
  notebook(slug) { const it = this.get(`nb:${slug}`); return it ? it.text || "" : ""; },
  setNotebook(slug, text) {
    if (text === this.notebook(slug)) return;
    this.put({ id: `nb:${slug}`, type: "nb", chapter: slug, text });
  },
  // 同步或匯入後換成合併好的資料
  replaceWith(merged) { this.data = merged; this.persist(); this.emit("remote"); }
};

const Sync = {
  cfg: {},
  state: "off",          // off 沒設定、idle 已同步、syncing 同步中、error 失敗、offline 離線
  msg: "",
  timer: null, busy: false, again: false,
  init() { this.cfg = lstore.get(SYNC_KEY) || {}; this.state = this.cfg.token ? "idle" : "off"; },
  save() { lstore.set(SYNC_KEY, this.cfg); },
  set(state, msg) { this.state = state; this.msg = msg; Notes.emit("sync"); },
  async api(path, opts = {}) {
    const headers = { Accept: "application/vnd.github+json", Authorization: `Bearer ${this.cfg.token}`, "X-GitHub-Api-Version": "2022-11-28" };
    if (opts.body) headers["Content-Type"] = "application/json";
    const res = await fetch(`https://api.github.com${path}`, Object.assign({}, opts, { headers, cache: "no-store" }));
    if (!res.ok) { const err = new Error(`GitHub API ${res.status}`); err.status = res.status; throw err; }
    return res.status === 204 ? null : res.json();
  },
  // 第一次連線：先找帳號裡已經有的筆記 gist（換電腦時就會找到同一個），沒有才建立新的 secret gist
  async findOrCreate() {
    for (let page = 1; page <= 5; page++) {
      const list = await this.api(`/gists?per_page=100&page=${page}`);
      const g = list.find((x) => x.files && x.files[GIST_FILE]);
      if (g) return g;
      if (list.length < 100) break;
    }
    return this.api("/gists", { method: "POST", body: JSON.stringify({ description: GIST_DESC, public: false, files: { [GIST_FILE]: { content: JSON.stringify(Notes.data) } } }) });
  },
  async readRemote() {
    const g = await this.api(`/gists/${this.cfg.gistId}`);
    const f = g.files && g.files[GIST_FILE];
    if (!f) return emptyNotes();
    let text = f.content;
    if (f.truncated) text = await (await fetch(f.raw_url, { cache: "no-store" })).text();
    try { const d = JSON.parse(text); return d && d.items ? d : emptyNotes(); } catch (err) { return emptyNotes(); }
  },
  async useGist() {
    const g = await this.findOrCreate();
    this.cfg.gistId = g.id;
    this.cfg.gistUrl = g.html_url;
    this.save();
  },
  async run() {
    if (!this.cfg.token) return;
    if (this.busy) { this.again = true; return; }
    if (navigator.onLine === false) { this.set("offline", "離線中，筆記先存在這台電腦，連上網路後會自動同步"); return; }
    this.busy = true;
    this.set("syncing", "同步中...");
    try {
      if (!this.cfg.gistId) await this.useGist();
      let remote;
      try { remote = await this.readRemote(); } catch (err) {
        if (err.status !== 404) throw err;
        await this.useGist();                      // gist 被刪掉了：重新找或建立
        remote = await this.readRemote();
      }
      const merged = mergeNotes(Notes.data, remote);
      if (notesSig(merged) !== notesSig(Notes.data)) Notes.replaceWith(merged);
      if (notesSig(merged) !== notesSig(remote)) {
        await this.api(`/gists/${this.cfg.gistId}`, { method: "PATCH", body: JSON.stringify({ files: { [GIST_FILE]: { content: JSON.stringify(merged) } } }) });
      }
      this.cfg.lastSync = Date.now();
      this.save();
      this.set("idle", `已同步 · ${fmtTime(this.cfg.lastSync)}`);
    } catch (err) {
      if (err.status === 401) this.set("error", "token 無效或已過期，請到同步設定重新貼上");
      else if (err.status === 403 || err.status === 404) this.set("error", "token 沒有 gist 權限，或 GitHub API 次數暫時用完了");
      else this.set("error", "同步失敗，筆記已經存在這台電腦，稍後會再試");
    } finally {
      this.busy = false;
      if (this.again) { this.again = false; this.schedule(800); }
    }
  },
  schedule(ms = 2500) {
    if (!this.cfg.token) return;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.run(), ms);
  },
  async connect(token) {
    this.cfg = { token: token.trim() };
    this.save();
    await this.run();
    return this.state === "idle";
  },
  disconnect() { clearTimeout(this.timer); this.cfg = {}; this.save(); this.set("off", ""); }
};

/* 在筆記裡找字：給名詞查詢、本章搜尋、筆記總覽用。slug 沒給就找全部章節 */
function searchNotes(q, slug) {
  const n = q.trim().toLowerCase();
  if (!n) return [];
  const hits = Notes.highlights(slug).filter((h) => (h.note || "").toLowerCase().includes(n) || (h.quote || "").toLowerCase().includes(n));
  Object.values(Notes.data.items).forEach((x) => {
    if (x.type === "nb" && !x.deleted && (!slug || x.chapter === slug) && (x.text || "").toLowerCase().includes(n)) hits.push(x);
  });
  return hits;
}
/* 從一段長文字裡切出關鍵字附近的一小段 */
function noteSnippet(text, q, len = 70) {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  const k = q ? t.toLowerCase().indexOf(q.trim().toLowerCase()) : -1;
  if (t.length <= len) return t;
  const start = k > 20 ? k - 20 : 0;
  return (start ? "..." : "") + t.slice(start, start + len) + (start + len < t.length ? "..." : "");
}

/* ---------- 筆記：在章節內文畫線 ----------
   畫線的位置用「原文 + 前後各 32 個字」記錄，不記 DOM 路徑，
   這樣就算 site.js 之後改了區塊的包法，或章節內容小幅修改，也還找得回來 */
const NOTE_SKIP = ".chapter-head, .pager, [aria-hidden='true'], .sec-label";
function noteTextIndex() {
  const main = document.querySelector("main.content");
  const entries = [];
  let text = "";
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement && !n.parentElement.closest(NOTE_SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
  });
  let n;
  while ((n = walker.nextNode())) { entries.push({ node: n, start: text.length }); text += n.nodeValue; }
  return { entries, text };
}
function notePoint(idx, container, offset) {
  if (container.nodeType === 3) {
    const e = idx.entries.find((x) => x.node === container);
    if (e) return e.start + offset;
  }
  const r = document.createRange();
  r.setStart(container, offset);
  for (const e of idx.entries) if (r.comparePoint(e.node, 0) >= 0) return e.start;
  return idx.text.length;
}
function anchorFromRange(range) {
  const idx = noteTextIndex();
  let s = notePoint(idx, range.startContainer, range.startOffset);
  let e = notePoint(idx, range.endContainer, range.endOffset);
  while (s < e && /\s/.test(idx.text[s])) s++;
  while (e > s && /\s/.test(idx.text[e - 1])) e--;
  if (e - s < 1) return null;
  const at = idx.entries.filter((x) => x.start <= s).pop();
  const sec = at && at.node.parentElement.closest(".sec-block");
  return {
    quote: idx.text.slice(s, e),
    prefix: idx.text.slice(Math.max(0, s - 32), s),
    suffix: idx.text.slice(e, e + 32),
    section: sec ? sec.dataset.sec : ""
  };
}
/* 同一段文字出現好幾次時，挑前後文最吻合的那一處 */
function locateAnchor(idx, a) {
  let best = -1, bestScore = -1;
  let k = idx.text.indexOf(a.quote);
  while (k !== -1) {
    const pre = idx.text.slice(Math.max(0, k - (a.prefix || "").length), k);
    const suf = idx.text.slice(k + a.quote.length, k + a.quote.length + (a.suffix || "").length);
    let score = 0;
    while (score < pre.length && pre[pre.length - 1 - score] === a.prefix[a.prefix.length - 1 - score]) score++;
    let s2 = 0;
    while (s2 < suf.length && suf[s2] === a.suffix[s2]) s2++;
    if (score + s2 > bestScore) { bestScore = score + s2; best = k; }
    k = idx.text.indexOf(a.quote, k + 1);
  }
  return best;
}
function wrapNoteRange(idx, s, e, item) {
  const parts = idx.entries.filter((x) => x.start < e && x.start + x.node.nodeValue.length > s);
  const marks = [];
  parts.forEach((x) => {
    let node = x.node;
    const a = Math.max(0, s - x.start);
    const b = Math.min(node.nodeValue.length, e - x.start);
    if (a > 0) node = node.splitText(a);
    if (b - a < node.nodeValue.length) node.splitText(b - a);
    if (!/\S/.test(node.nodeValue)) return;            // 純空白（例如兩個 li 之間）不用包
    const mark = document.createElement("mark");
    mark.className = "note-hl";
    mark.dataset.note = item.id;
    node.parentNode.insertBefore(mark, node);
    mark.appendChild(node);
    marks.push(mark);
  });
  if (marks.length) {
    marks[0].classList.add("nh-first");
    marks[marks.length - 1].classList.add("nh-last");
    if (item.note && item.note.trim()) marks.forEach((m) => m.classList.add("has-note"));
  }
  return marks.length > 0;
}
const noteMarksOf = (id) => Array.from(document.querySelectorAll("mark.note-hl")).filter((m) => m.dataset.note === id);
let noteOrphans = new Set();
let noteMarkSig = null;
/* 把這一章的畫線重新畫一次（筆記有變動時呼叫）；找不到原文的記在 noteOrphans */
function renderNoteMarks(force = false) {
  const slug = document.body.dataset.chapter;
  const list = Notes.highlights(slug);
  const sig = list.map((h) => `${h.id}${h.note && h.note.trim() ? "*" : ""}`).join("|");
  if (!force && sig === noteMarkSig) return;
  noteMarkSig = sig;
  document.querySelectorAll("mark.note-hl").forEach((m) => {
    const parent = m.parentNode;
    m.replaceWith(...m.childNodes);
    parent.normalize();
  });
  noteOrphans = new Set();
  list.forEach((h) => {
    const idx = noteTextIndex();
    const k = locateAnchor(idx, h);
    if (k < 0 || !wrapNoteRange(idx, k, k + h.quote.length, h)) noteOrphans.add(h.id);
  });
}

/* 點畫線時跳出的註解卡 */
let notePop = null;
function closeNotePop() { if (notePop) notePop.hidden = true; }
function openNotePop(id, editing = false) {
  const item = Notes.get(id);
  const marks = noteMarksOf(id);
  if (!item || !marks.length) return;
  if (!notePop) {
    notePop = document.createElement("div");
    notePop.className = "note-pop";
    notePop.setAttribute("role", "dialog");
    notePop.setAttribute("aria-label", "畫線筆記");
    document.body.appendChild(notePop);
    document.addEventListener("mousedown", (e) => {
      if (!notePop.hidden && !notePop.contains(e.target) && !e.target.closest("mark.note-hl")) closeNotePop();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !notePop.hidden && !notePop.querySelector("textarea")) closeNotePop(); });
    window.addEventListener("resize", closeNotePop);
  }
  const place = () => {
    const r = marks[0].getBoundingClientRect();
    const w = Math.min(360, window.innerWidth - 24);
    notePop.style.width = `${w}px`;
    notePop.style.left = `${Math.max(12, Math.min(r.left + window.scrollX, window.scrollX + window.innerWidth - w - 12))}px`;
    notePop.style.top = `${r.bottom + window.scrollY + 10}px`;
  };
  const draw = (edit) => {
    const cur = Notes.get(id);
    if (!cur) { closeNotePop(); return; }
    notePop.innerHTML = `
      <div class="np-head"><span class="np-label">NOTE</span><span class="np-time">${escapeHtml(fmtTime(cur.updated))}</span><button type="button" class="np-x" data-act="close" aria-label="關閉">×</button></div>
      <blockquote class="np-quote"></blockquote>
      ${edit ? `<textarea class="np-input" rows="4" placeholder="寫下你對這段的註解（可以留空，只畫線）"></textarea>
        <div class="np-actions"><button type="button" class="np-main" data-act="save">儲存</button><button type="button" data-act="cancel">取消</button><span class="np-tip">Ctrl / ⌘ + Enter 儲存</span></div>`
      : `<p class="np-text"></p>
        <div class="np-actions"><button type="button" class="np-main" data-act="edit">${cur.note && cur.note.trim() ? "編輯註解" : "寫註解"}</button><button type="button" data-act="del">刪除畫線</button></div>`}`;
    notePop.querySelector(".np-quote").textContent = noteSnippet(cur.quote, "", 120);
    const on = (act, fn) => { const b = notePop.querySelector(`[data-act="${act}"]`); if (b) b.addEventListener("click", fn); };
    on("close", closeNotePop);
    if (edit) {
      const ta = notePop.querySelector(".np-input");
      ta.value = cur.note || "";
      const save = () => { Notes.put(Object.assign({}, cur, { note: ta.value })); draw(false); };
      on("save", save);
      on("cancel", () => draw(false));
      ta.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); save(); }
        else if (e.key === "Escape") { e.preventDefault(); draw(false); }
      });
      setTimeout(() => ta.focus({ preventScroll: true }), 30);
    } else {
      const p = notePop.querySelector(".np-text");
      if (cur.note && cur.note.trim()) p.textContent = cur.note;
      else { p.textContent = "還沒寫註解，目前只有畫線。"; p.classList.add("empty"); }
      on("edit", () => draw(true));
      const del = notePop.querySelector('[data-act="del"]');
      del.addEventListener("click", () => {
        // 按兩次才刪，避免手滑
        if (del.dataset.sure) { Notes.remove(id); closeNotePop(); return; }
        del.dataset.sure = "1";
        del.textContent = "再按一次確定刪除";
        del.classList.add("danger");
      });
    }
  };
  draw(editing);
  notePop.hidden = false;
  place();
}
/* 跳到某一則畫線並閃動（從筆記總覽、筆記清單、名詞查詢點過來） */
function focusNote(id, open = true) {
  const marks = noteMarksOf(id);
  if (!marks.length) return false;
  marks[0].scrollIntoView({ behavior: "smooth", block: "center" });
  marks.forEach((m) => { m.classList.remove("flash"); void m.offsetWidth; m.classList.add("flash"); });
  setTimeout(() => marks.forEach((m) => m.classList.remove("flash")), 3800);
  if (open) setTimeout(() => openNotePop(id), 550);
  return true;
}
/* 從反白的範圍建立一則畫線筆記（反白後按「畫線加筆記」） */
function startNoteFromRange(range) {
  const slug = document.body.dataset.chapter;
  if (!slug || !range) return;
  const a = anchorFromRange(range);
  if (!a) return;
  const item = Object.assign({ id: newNoteId(), type: "hl", chapter: slug, created: Date.now(), note: "" }, a);
  const sel = window.getSelection();
  if (sel) sel.removeAllRanges();
  Notes.put(item);
  openNotePop(item.id, true);
}
/* 本章搜尋：註解內容符合的畫線，也算進 ↑ ↓ 會停的位置 */
function addNoteMatches(q) {
  const slug = document.body.dataset.chapter;
  const n = q.trim().toLowerCase();
  findState.noteCount = 0;
  if (!slug || n.length < 2) return 0;
  const extra = Notes.highlights(slug)
    .filter((h) => (h.note || "").toLowerCase().includes(n))
    .map((h) => noteMarksOf(h.id)[0]).filter(Boolean);
  if (!extra.length) return 0;
  extra.forEach((m) => m.classList.add("note-match"));
  const curEl = findState.marks[findState.i];
  const all = Array.from(new Set([...findState.marks, ...extra]))
    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  findState.marks = all;
  findState.noteCount = extra.length;
  if (!findState.term) Object.assign(findState, { term: q.trim(), mode: "all", total: all.length });
  if (curEl) findState.i = all.indexOf(curEl);
  else { findState.i = 0; focusMark(); }
  return extra.length;
}

/* ---------- 筆記：右側抽屜（整章筆記本、本章畫線清單、同步設定） ---------- */
function setupNotesDrawer(root, current) {
  const drawer = document.createElement("aside");
  drawer.className = "notes-drawer";
  drawer.id = "notes-drawer";
  drawer.hidden = true;
  drawer.setAttribute("aria-label", "我的筆記");
  drawer.innerHTML = `
    <div class="nd-head"><span class="nd-title"></span><button type="button" class="nd-x" aria-label="關閉">×</button></div>
    <div class="nd-body"></div>
    <div class="nd-foot"><span class="sync-state"><i class="sync-dot"></i><span class="sync-msg"></span></span><button type="button" class="nd-link" data-act="settings">同步設定</button></div>`;
  document.body.appendChild(drawer);
  const body = drawer.querySelector(".nd-body");
  const title = drawer.querySelector(".nd-title");
  const chapter = current ? chapterBySlug(current) : null;
  let view = "chapter";
  let nbTimer = null;

  const syncText = () => {
    if (Sync.state === "off") return "筆記只存在這台電腦";
    return Sync.msg || (Sync.cfg.lastSync ? `已同步 · ${fmtTime(Sync.cfg.lastSync)}` : "已設定同步");
  };
  const updateSync = () => {
    drawer.querySelector(".sync-dot").dataset.state = Sync.state;
    drawer.querySelector(".sync-msg").textContent = syncText();
    document.querySelectorAll(".notes-btn .sync-dot").forEach((d) => { d.dataset.state = Sync.state; });
    if (view === "settings" && !drawer.hidden && !body.contains(document.activeElement)) draw();
  };

  const drawChapter = () => {
    title.textContent = chapter ? `CH.${chapter.no} ${chapter.title} · 我的筆記` : "我的筆記";
    const list = Notes.highlights(current);
    body.innerHTML = `
      <section class="nd-sec">
        <h4>整章筆記本</h4>
        <textarea class="nd-notebook" placeholder="這一章想記的東西都可以寫在這裡：老師補充的重點、自己的整理、考前要再看的地方..."></textarea>
        <p class="nd-saved"></p>
      </section>
      <section class="nd-sec">
        <h4>畫線註解 <small>${list.length}</small></h4>
        ${list.length ? `<ul class="nd-list"></ul>` : `<p class="nd-hint">在內文反白一段文字，按旁邊跳出的「畫線加筆記」，就會出現在這裡。</p>`}
      </section>
      <a class="nd-all" href="${root}/notes.html">所有章節的筆記總覽 →</a>`;
    const ta = body.querySelector(".nd-notebook");
    const saved = body.querySelector(".nd-saved");
    ta.value = Notes.notebook(current);
    ta.addEventListener("input", () => {
      saved.textContent = "輸入中...";
      clearTimeout(nbTimer);
      nbTimer = setTimeout(() => { Notes.setNotebook(current, ta.value); saved.textContent = "已儲存"; }, 600);
    });
    ta.addEventListener("blur", () => { clearTimeout(nbTimer); Notes.setNotebook(current, ta.value); });
    const ul = body.querySelector(".nd-list");
    if (ul) list.forEach((h) => {
      const li = document.createElement("li");
      const orphan = noteOrphans.has(h.id);
      li.innerHTML = `<button type="button" class="nd-item${orphan ? " orphan" : ""}"><span class="nd-q"></span><span class="nd-n"></span>${orphan ? `<span class="nd-warn">原文已經改過，找不到畫線的位置</span>` : ""}</button>${orphan ? `<button type="button" class="nd-del">刪除</button>` : ""}`;
      li.querySelector(".nd-q").textContent = noteSnippet(h.quote, "", 90);
      li.querySelector(".nd-n").textContent = h.note && h.note.trim() ? noteSnippet(h.note, "", 90) : "（只有畫線）";
      li.querySelector(".nd-item").addEventListener("click", () => {
        if (orphan) return;
        if (window.matchMedia("(max-width: 800px)").matches) close();
        focusNote(h.id);
      });
      const del = li.querySelector(".nd-del");
      if (del) del.addEventListener("click", () => Notes.remove(h.id));
      ul.appendChild(li);
    });
  };

  const drawSettings = () => {
    title.textContent = "跨電腦同步";
    const on = !!Sync.cfg.token;
    body.innerHTML = `
      ${current ? `<button type="button" class="nd-back">← 回到本章筆記</button>` : ""}
      <section class="nd-sec">
        <h4>GitHub Gist 同步</h4>
        <p class="nd-p">筆記平常存在這台電腦的瀏覽器裡。連上 GitHub 之後，會自動在你的帳號下存一份 <strong>secret gist</strong>；換一台電腦時，貼上 token 就會找到同一份筆記並合併。</p>
        ${on ? `
          <p class="nd-status"><i class="sync-dot" data-state="${Sync.state}"></i>${escapeHtml(syncText())}</p>
          <div class="nd-actions">
            <button type="button" class="nd-btn main" data-act="sync-now">立即同步</button>
            ${Sync.cfg.gistUrl ? `<a class="nd-btn" href="${escapeHtml(Sync.cfg.gistUrl)}" target="_blank" rel="noopener">在 GitHub 上查看</a>` : ""}
            <button type="button" class="nd-btn" data-act="disconnect">中斷連線</button>
          </div>
          <p class="nd-small">中斷連線只會刪掉這台電腦上的 token，筆記和 gist 都會保留。</p>`
        : `
          <ol class="nd-steps">
            <li>到 GitHub 建立一個 token，權限只要勾 <code>gist</code>：<a href="${TOKEN_URL}" target="_blank" rel="noopener">建立 token</a></li>
            <li>把 token 貼在下面，按「連線」。每台電腦都要貼一次。</li>
          </ol>
          <div class="nd-token-row"><input type="password" class="nd-token" placeholder="ghp_..." autocomplete="off" spellcheck="false"><button type="button" class="nd-btn main" data-act="connect">連線</button></div>
          <p class="nd-small nd-err"></p>`}
        <p class="nd-small">token 只存在這台電腦的瀏覽器裡，不要在公用電腦上設定。secret gist 不會出現在你的公開頁面，但知道網址的人就看得到，也沒有加密，不要放密碼之類的機密。</p>
      </section>
      <section class="nd-sec">
        <h4>備份</h4>
        <div class="nd-actions">
          <button type="button" class="nd-btn" data-act="export">匯出備份（.json）</button>
          <label class="nd-btn">匯入備份<input type="file" accept=".json,application/json" hidden></label>
        </div>
        <p class="nd-small">匯入會和現有的筆記合併，同一則筆記保留比較新的版本。</p>
      </section>`;
    const act = (name, fn) => { const b = body.querySelector(`[data-act="${name}"]`); if (b) b.addEventListener("click", fn); };
    const back = body.querySelector(".nd-back");
    if (back) back.addEventListener("click", () => { view = "chapter"; draw(); });
    act("sync-now", () => Sync.run());
    act("disconnect", () => { Sync.disconnect(); draw(); });
    act("connect", async () => {
      const input = body.querySelector(".nd-token");
      const err = body.querySelector(".nd-err");
      if (!input.value.trim()) { err.textContent = "請先貼上 token。"; return; }
      err.textContent = "連線中...";
      const ok = await Sync.connect(input.value);
      if (!ok) { const msg = Sync.msg; Sync.disconnect(); draw(); body.querySelector(".nd-err").textContent = `連線失敗：${msg}`; }
      else draw();
    });
    act("export", () => {
      const blob = new Blob([JSON.stringify(Notes.data, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `os-notes-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    const file = body.querySelector('input[type="file"]');
    file.addEventListener("change", () => {
      const f = file.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const d = JSON.parse(reader.result);
          if (!d || !d.items) throw new Error("format");
          Notes.replaceWith(mergeNotes(Notes.data, d));
          Sync.schedule(300);
          alert("匯入完成，已經和現有的筆記合併。");
        } catch (err) { alert("這個檔案不是筆記備份，沒有匯入。"); }
      };
      reader.readAsText(f);
    });
  };

  const draw = () => { if (view === "settings" || !current) drawSettings(); else drawChapter(); updateSyncDot(); };
  const updateSyncDot = () => {
    drawer.querySelector(".sync-dot").dataset.state = Sync.state;
    drawer.querySelector(".sync-msg").textContent = syncText();
  };
  const open = (v) => {
    view = v || (current ? "chapter" : "settings");
    draw();
    const head = document.querySelector(".site-header");
    if (head) drawer.style.top = `${Math.round(head.getBoundingClientRect().bottom)}px`;   // 接在標題列正下方
    drawer.hidden = false;
    document.querySelectorAll(".notes-btn").forEach((b) => b.setAttribute("aria-pressed", "true"));
  };
  const close = () => {
    const ta = body.querySelector(".nd-notebook");
    if (ta && current) { clearTimeout(nbTimer); Notes.setNotebook(current, ta.value); }
    drawer.hidden = true;
    document.querySelectorAll(".notes-btn").forEach((b) => b.setAttribute("aria-pressed", "false"));
  };
  drawer.querySelector(".nd-x").addEventListener("click", close);
  drawer.querySelector('[data-act="settings"]').addEventListener("click", () => open("settings"));
  drawer.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.stopPropagation(); close(); } });

  Notes.on((kind) => {
    if (kind === "sync") { updateSync(); return; }
    if (drawer.hidden) return;
    // 正在打字時不要重畫，游標才不會跳掉；其他時候跟著資料更新
    if (body.contains(document.activeElement) && /TEXTAREA|INPUT/.test(document.activeElement.tagName)) return;
    draw();
  });
  updateSync();
  return { open, close, toggle: (v) => (drawer.hidden ? open(v) : close()), isOpen: () => !drawer.hidden };
}

/* ---------- 筆記總覽頁（notes.html） ---------- */
function renderNotesOverview(el, root) {
  el.innerHTML = `
    <header class="notes-hero">
      <p class="kicker">// MY NOTES</p>
      <h1>我的筆記</h1>
      <p class="lead">所有章節的畫線註解和整章筆記本都在這裡，點一則就會回到原文的位置。</p>
      <input class="search" id="notes-search" type="search" placeholder="搜尋筆記內容，例如 semaphore、考試、老師說...">
    </header>
    <div id="notes-groups"></div>`;
  const groups = el.querySelector("#notes-groups");
  const search = el.querySelector("#notes-search");
  const draw = () => {
    const q = search.value.trim();
    const n = q.toLowerCase();
    const match = (t) => !n || String(t || "").toLowerCase().includes(n);
    let total = 0;
    const html = CHAPTERS.map((c) => {
      const nb = Notes.notebook(c.slug);
      const hls = Notes.highlights(c.slug).filter((h) => match(h.quote) || match(h.note));
      const showNb = nb.trim() && match(nb);
      if (!showNb && !hls.length) return "";
      total += hls.length + (showNb ? 1 : 0);
      const href = `${root}/chapters/${c.slug}.html`;
      return `<section class="notes-group" style="--pc: ${planetColor(c)}">
        <h2><a href="${href}"><span class="ng-no">CH.${c.no}</span>${escapeHtml(c.title)}<small>${escapeHtml(c.en)}</small></a><span class="ng-count">${hls.length + (showNb ? 1 : 0)} 則</span></h2>
        ${showNb ? `<a class="ng-notebook" href="${href}?notebook=1"><span class="ng-label">整章筆記本</span><span class="ng-text">${escapeHtml(nb)}</span></a>` : ""}
        ${hls.length ? `<ul class="ng-list">${hls.map((h) => `
          <li><a href="${href}?note=${encodeURIComponent(h.id)}">
            <blockquote>${escapeHtml(noteSnippet(h.quote, q, 140))}</blockquote>
            ${h.note && h.note.trim() ? `<p class="ng-text">${escapeHtml(h.note)}</p>` : `<p class="ng-text empty">（只有畫線）</p>`}
            <span class="ng-meta">${escapeHtml(fmtTime(h.updated))} · 回到原文 →</span>
          </a></li>`).join("")}</ul>` : ""}
      </section>`;
    }).join("");
    groups.innerHTML = html || `<p class="notes-empty">${q ? `筆記裡找不到「${escapeHtml(q)}」。` : "還沒有任何筆記。到任一章反白一段文字，按「畫線加筆記」，或打開標題列的「筆記」寫整章筆記本，就會出現在這裡。"}</p>`;
  };
  search.addEventListener("input", draw);
  Notes.on((kind) => { if (kind !== "sync") draw(); });
  draw();
}

/* ---------- 筆記：初始化（每一頁都會呼叫） ---------- */
function setupNotes(root, current, page) {
  Notes.load();
  Sync.init();
  // 別的分頁改了筆記：重新讀一次
  window.addEventListener("storage", (e) => {
    if (e.key === NOTES_KEY) { Notes.load(); Notes.emit("remote"); }
    if (e.key === SYNC_KEY) { Sync.init(); Notes.emit("sync"); }
  });
  // 先畫線、再建抽屜：抽屜的清單要用到「哪些畫線找不到原文」
  if (current) {
    renderNoteMarks(true);
    Notes.on((kind) => { if (kind !== "sync") renderNoteMarks(); });
  }
  const drawer = setupNotesDrawer(root, current);
  document.querySelectorAll(".notes-btn").forEach((b) => b.addEventListener("click", () => drawer.toggle(b.dataset.view)));

  if (current) {
    const main = document.querySelector("main.content");
    main.addEventListener("click", (e) => {
      const m = e.target.closest("mark.note-hl");
      const sel = window.getSelection();
      if (m && !(sel && sel.toString().trim())) openNotePop(m.dataset.note);
    });
    document.addEventListener("keydown", (e) => {
      const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
      if (e.key === "N" && e.shiftKey && !typing && !e.metaKey && !e.ctrlKey) { e.preventDefault(); drawer.toggle(); }
    });
    // 從筆記總覽或名詞查詢點過來：?note=id 跳到那則畫線，?notebook=1 打開筆記本
    const params = new URLSearchParams(location.search);
    const noteId = params.get("note");
    if (noteId || params.get("notebook")) {
      window.addEventListener("load", () => {
        const run = () => { if (!noteId || !focusNote(noteId)) drawer.open("chapter"); };
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(run); else run();
      });
    }
  }
  if (page === "notes") {
    const el = document.getElementById("notes-page");
    if (el) renderNotesOverview(el, root);
  }

  // 同步時機：打開頁面、切回這個分頁、重新連上網路；改了筆記則在停手 2.5 秒後（沒設定 token 時 run() 什麼都不做）
  setTimeout(() => Sync.run(), 600);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && Date.now() - (Sync.cfg.lastSync || 0) > 20000) Sync.run();
  });
  window.addEventListener("online", () => Sync.run());
  return drawer;
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
    if (el.closest(".chapter-head, .pager, mark.hl")) continue;   // 筆記畫線（mark.note-hl）裡的字照樣要找得到
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
  // 停在「註解內容符合」的畫線上時，順便打開那則筆記
  if (cur.classList.contains("note-match")) setTimeout(() => openNotePop(cur.dataset.note), step ? 500 : 750);
  else closeNotePop();
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
      const changed = hit && !hit.classList.contains("lit");
      blocks.forEach((b) => b.classList.toggle("lit", b === hit));
      // 通知右側「本頁目錄」：目錄的高亮一律跟著亮起來的區塊走
      if (changed) document.dispatchEvent(new CustomEvent("os-notes:section", { detail: hit.dataset.sec }));
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
    // 不用 IntersectionObserver 盯 h2：它只在 h2 經過畫面時才觸發，往上捲回上一段時，
    // 要捲到那一段的開頭才會更新。改成跟著段落分區的 .lit（畫面 40% 那條線所在的區塊）
    const setActive = (id) => links.forEach((a) => a.classList.toggle("active", a.dataset.id === id));
    document.addEventListener("os-notes:section", (e) => setActive(e.detail));
    const lit = document.querySelector(".sec-block.lit");
    if (lit) setActive(lit.dataset.sec);
  }

  /* ---------- 標題列按鈕：名詞查詢、本章搜尋、筆記、HOME ---------- */
  const NOTES_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5h10.5l3.5 3.5v13.5H5z"/><path d="M8.5 9h7M8.5 12.5h7M8.5 16h4"/></svg>`;
  const NOTES_BTN = `<button class="lookup-btn notes-btn" type="button" title="我的筆記：整章筆記本、畫線清單、同步（快捷鍵 Shift+N）">${NOTES_ICON}<span>筆記</span><i class="sync-dot"></i></button>`;
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
        ${NOTES_BTN}
        <a class="home-btn" href="${root}/index.html" title="回到首頁">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/></svg>
          <span>HOME</span>
        </a>
      </div>`);
    if (menuBtn) header.querySelector(".header-actions").appendChild(menuBtn);
    setupLookup(root, current);
  } else if (header) {
    // 首頁、筆記總覽：標題列右邊放「我的筆記」或「同步設定」和「HOME」
    const onNotes = body.dataset.page === "notes";
    header.insertAdjacentHTML("beforeend", `
      <div class="header-actions">
        ${onNotes
          ? `<button class="lookup-btn notes-btn" type="button" data-view="settings" title="跨電腦同步、匯出與匯入">${NOTES_ICON}<span>同步設定</span><i class="sync-dot"></i></button>
             <a class="home-btn" href="${root}/index.html" title="回到首頁"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/></svg><span>HOME</span></a>`
          : `<a class="lookup-btn" href="${root}/notes.html" title="所有章節的筆記總覽">${NOTES_ICON}<span>我的筆記</span></a>`}
      </div>`);
  }
  setupNotes(root, current, body.dataset.page);

})();
