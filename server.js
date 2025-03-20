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

app.get('/', (req, res) => {
  res.send('Hello from the CWA Proxy!');
});

app.get('/county/:id', async (req, res) => {
  const countyId = req.params.id;
  const url = `https://www.cwa.gov.tw/Data/js/Observe/County/${countyId}.js`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const text = await response.text();
    res.type('application/javascript').send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

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

app.get('/od2', async (req, res) => {
  const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=rdec-key-123-45678-011121314&format=JSON';

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
