# VINEST YouTube 投資知識庫

一個投資研究知識整理 app，專門用來整理 YouTube 既投資內容。

## 產品定位

呢個 app 既核心係：
- 把來自 YouTube 既投資觀點、研究重點、公司分析、行業分析、bull/bear 論點整理成長期知識庫
- 方便日後按公司、行業、主題回顧同搜尋
- 適合整理 YouTube 影片學到既投資內容

## 資訊架構

### 資料模型
```
KnowledgeEntry
├── id, title, source_name, source_url, source_type, date
├── summary_short, summary_long
├── key_points[], bull_points[], bear_points[], catalysts[], risks[]
├── companies[], sectors[], themes[], tickers[]
├── notes, open_questions[], created_at, updated_at
```

### 頁面結構
1. **首頁 (index.html)** - Dashboard
   - KPI cards：總筆記、公司數、行業數、主題數
   - 最近新增筆記
   - 熱門公司/行業/主題
   - Quick add form

2. **知識庫 (library.html)** - 完整列表
   - 關鍵詞搜尋
   - 按公司/行業/主題/來源類型篩選
   - 排序功能

3. **筆記詳情 (entry.html)**
   - 標題、來源、日期
   - 摘要同重點
   - Bull/Bear/Catalysts/Risks 結構化論點
   - 分類 tags
   - 相關筆記

4. **公司頁 (company.html)**
   - 公司名、同相關筆記數
   - 聚合既 bull/bear/catalysts/risks
   - 相關公司、行業、主題
   - 所有相關筆記

5. **行業頁 (sector.html)**
   - 行業聚合頁
   - 相關公司、主題
   - 論點匯總

6. **主題頁 (theme.html)**
   - 主題聚合頁
   - 相關公司、行業
   - 論點匯總

## MVP 功能

### P1 (已完成)
- ✅ 手動新增知識筆記
- ✅ 知識庫列表
- ✅ 搜尋同篩選
- ✅ 公司頁面
- ✅ 行業頁面
- ✅ 主題頁面
- ✅ 筆記詳情頁
- ✅ 基本分類 tags

### P2 (待開發)
- Related entries
- Pin / Favorite
- 比較同一公司既筆記
- Bulk edit tags

### P3 (待開發)
- 匯入外部來源
- AI 輔助整理
- 自動摘要建議
- Thesis change tracking

## 使用技術

- 純 HTML/CSS/JS（無 framework，MVP 優先）
- JSON 做本地儲存（可用 localStorage 或 file-based）
- Dark theme，research-focused UI
- Single-page 設計

## 資料路徑

```
/home/admin/.openclaw/workspace/vinest-youtube-kb/
├── data/
│   └── entries.json      # 主資料庫
├── web/
│   ├── index.html        # 首頁
│   ├── library.html      # 知識庫列表
│   ├── entry.html        # 筆記詳情
│   ├── company.html      # 公司頁
│   ├── sector.html       # 行業頁
│   ├── theme.html        # 主題頁
│   ├── app.js            # 共用邏輯
│   └── styles.css        # 共用樣式
└── README.md
```

## 設計原則

1. **Summary First** - 先睇到核心結論
2. **Evidence Second** - 再睇bull/bear/catalyst/risk 結構化論點
3. **Raw Notes Last** - 最後先係個人備註
4. **Clean & Research-focused** - 整潔、研究導向既介面
5. **Card-based** - 卡片式佈局，易於掃描
