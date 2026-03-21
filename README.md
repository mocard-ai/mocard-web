# MoCard 靜態介紹網站

MoCard 對外介紹網站，採 Mobile-First 設計，純前端靜態實作。

## 專案結構

```
/
├── index.html          # 首頁
├── faq.html            # 常見問題
├── about.html          # 關於 MoCard
├── blog.html           # 文章列表
├── blog-post.html      # 單一文章（範例）
├── privacy.html        # 隱私權政策
├── terms.html          # 服務條款
├── feedback.html       # 意見回饋（Google 表單嵌入）
├── css/
│   └── styles.css      # 全站樣式
├── js/
│   └── main.js         # 導覽選單、FAQ 手風琴
└── README.md
```

## 使用方式

1. **本地預覽**：直接用瀏覽器開啟 `index.html`，或使用簡易 HTTP server：
   ```bash
   # 使用 Python
   python -m http.server 8000
   # 或使用 npx
   npx serve .
   ```

2. **部署**：可部署至 Firebase Hosting 或 GitHub Pages
   - Firebase: `firebase init hosting` 後指向本目錄
   - GitHub Pages: 將本目錄設為 Pages 來源

## 意見回饋頁面設定

`feedback.html` 需嵌入您的 Google 表單：

1. 建立 [Google 表單](https://forms.google.com)
2. 點擊「傳送」→「內嵌 HTML」
3. 複製 `iframe` 的 `src` 屬性
4. 在 `feedback.html` 中替換 `iframe` 的 `src` 為您的表單連結

## 技術規格

- 純 HTML / CSS / Vanilla JS
- Mobile-First 響應式設計
- 無後端依賴，適合靜態託管
