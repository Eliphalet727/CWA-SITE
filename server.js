// server.js
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// 為了讓前端能跨網域呼叫，設定 CORS header
app.use((req, res, next) => {
  // 允許所有網域
  res.setHeader('Access-Control-Allow-Origin', '*');
  // 允許必要的 Headers
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// (A) 測試用首頁
app.get('/', (req, res) => {
  res.send('Hello from the CWA Proxy!');
});

// (B) Proxy：抓取氣象署官網 JS，ex: /county/63 => 轉送 https://www.cwa.gov.tw/Data/js/Observe/County/63.js
app.get('/county/:id', async (req, res) => {
  const countyId = req.params.id;
  const url = `https://www.cwa.gov.tw/Data/js/Observe/County/${countyId}.js`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const text = await response.text();
    // 回傳原始文字 (JS 字串)
    // 注意：原檔案是 "var ST = {...};" 形式，前端可能用 eval 處理
    res.type('application/javascript').send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// (C) Proxy：抓取氣象局 OpenData (範例：O-A0001-001)
app.get('/od1', async (req, res) => {
  const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=rdec-key-123-45678-011121314&format=JSON';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);  // 以 JSON 格式回給前端
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// (D) Proxy：抓取氣象局另一個 OpenData (O-A0003-001)，你也可定義多個路由
app.get('/od3', async (req, res) => {
  const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=rdec-key-123-45678-011121314&format=JSON';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
