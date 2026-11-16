# 🖥️ OS 課程筆記站

如果你也在修作業系統，想把 process、CPU 排程、同步這些觀念真的弄懂，可以使用這個網站。每一章都用同樣的結構整理，附有手算例題、pseudocode、比較表和自我測驗，讀完一章就能自己算題目、回答常見考題。

👉 網站：https://你的帳號.github.io/os-notes/

## 目前章節

| 編號 | 主題 |
|---|---|
| 01 | 作業系統概論 Introduction |
| 02 | 作業系統結構 OS Structure |
| 03 | 行程 Processes |
| 04 | 執行緒與並行 Threads & Concurrency |
| 05 | CPU 排程 CPU Scheduling |
| 06 | 同步工具 Synchronization Tools |

章節編號和課本《Operating System Concepts》一致，內容依據上課投影片和我的筆記整理。

## 每章結構

本章重點、核心觀念、實際例子、Pseudocode、比較整理、自我測驗、延伸閱讀。自我測驗的答案預設是收起來的，先自己想過再點開，就可以看到答案和原因。

## 名詞查詢

讀到一半忘記某個名詞時，按右上角的「名詞查詢」（或鍵盤 `/`），也可以直接在內文反白那個詞，就會跳出解釋，並且可以一鍵回到第一次介紹它的章節。

## 本章搜尋

想看某個字在這一章出現在哪些地方，按右上角的「本章搜尋」（或鍵盤 `Shift+F`），輸入後會把這章所有出現處標出來，用 Enter 或 ↑ ↓ 一個一個看。

## 擴充方式

這個專案的規則寫在 [`CLAUDE.md`](./CLAUDE.md)（其他 AI 工具請看 [`AGENTS.md`](./AGENTS.md)）。要新增章節時，請 AI 先讀完 `CLAUDE.md`，再依照裡面的流程：

1. 複製 `templates/chapter.html` 到 `chapters/NN-slug.html`
2. 在 `assets/site.js` 的 `CHAPTERS` 登記新章節
3. 照固定的 7 個區塊寫內容
4. 把新名詞加進 `assets/glossary.js`
5. 跑完檢查清單

首頁太陽系、章節卡片、側邊欄、上一章／下一章和本頁目錄都會自動更新。

## 本機預覽

直接用瀏覽器打開 `index.html` 就可以看，不需要安裝任何東西。
