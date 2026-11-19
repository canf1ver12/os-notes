# OS 課程筆記

此網站的作用是複習作業系統，每一章的內容都用同樣的結構整理，附有手算例題、pseudocode、比較表和自我測驗

網站：https://canf1ver12.github.io/os-notes/

## 目前章節

| 編號 | 主題 |
|---|---|
| 01 | 作業系統概論 Introduction |
| 02 | 作業系統結構 OS Structure |
| 03 | 行程 Processes |
| 04 | 執行緒與並行 Threads & Concurrency |
| 05 | CPU 排程 CPU Scheduling |
| 06 | 同步工具 Synchronization Tools |
| 07 | 同步範例 Synchronization Examples |
| 08 | 死結 Deadlocks |

章節編號和課本《Operating System Concepts》一致，內容依據上課投影片和我的筆記整理

## 每章結構

本章重點、核心觀念、實際例子、Pseudocode、比較整理、自我測驗、延伸閱讀

## 名詞查詢

讀到一半忘記某個名詞時，按右上角的「名詞查詢」（或鍵盤 `/`），也可以直接在內文反白那個詞，就會跳出清單，點擊「看完整說明」就會跳到解釋，並且可以一鍵回到剛剛閱讀的地方

## 本章搜尋

想看某個字在這一章出現在哪些地方，按右上角的「本章搜尋」（或鍵盤 `Shift+F`），輸入後會把這章所有出現處標出來，用 Enter 或 ↑ ↓ 查看

## 筆記

- 在內文反白一段文字，按「畫線加筆記」就能畫線並寫註解，之後點畫線就會跳出註解
- 按右上角的「筆記」（或鍵盤 `Shift+N`）打開整章筆記本，也能看到這一章所有的畫線
- 首頁右上角的「我的筆記」會列出所有章節的筆記，可以搜尋，點一則就回到原文
- 名詞查詢和本章搜尋也找得到筆記裡的字

筆記預設存在這台電腦的瀏覽器裡，要跨電腦使用時：

1. 到 GitHub 建立一個只勾 `gist` 權限的 token
2. 打開「筆記」→「同步設定」，貼上 token 按「連線」，每台電腦都要做一次
3. 之後筆記會自動和你帳號下的 secret gist 同步，離線時寫的筆記會在連上網路後補上

- token 只存在該台電腦的瀏覽器，不要在公用電腦設定
- secret gist 沒有加密，不要放機密資料
- 同步設定裡也可以匯出、匯入 `.json` 備份

## 擴充方式

這個專案的規則寫在 [`CLAUDE.md`](./CLAUDE.md)（其他 AI 工具請看 [`AGENTS.md`](./AGENTS.md)），要新增章節時，請 AI 先讀完 `CLAUDE.md`，再依照裡面的流程：

1. 複製 `templates/chapter.html` 到 `chapters/NN-slug.html`
2. 在 `assets/site.js` 的 `CHAPTERS` 登記新章節
3. 照固定的 7 個區塊寫內容
4. 把新名詞加進 `assets/glossary.js`
5. 跑完檢查清單

首頁太陽系、章節卡片、側邊欄、上一章／下一章和本頁目錄都會自動更新

## 本機預覽

直接用瀏覽器打開 `index.html` 就可以看，不需要安裝任何東西
