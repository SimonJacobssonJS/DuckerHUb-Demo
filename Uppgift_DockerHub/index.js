const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.json({ message: 'CI/CD Demo Running! 🚀' });
});

app.listen(port, () => {
  console.log(`Server kör på http://localhost:${port}`);
});
