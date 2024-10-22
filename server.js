const express = require('express');
const app = express();
const port = 3000;

// Пример манифеста TonConnect
const tonManifest = {
    "url": "http://localhost:3000",
    "name": "ton-world",                   
    "iconUrl": "<app-icon-url>"
  }

// API для получения манифеста
app.get('/tonconnect-manifest.json', (req, res) => {
  res.json(tonManifest);
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});