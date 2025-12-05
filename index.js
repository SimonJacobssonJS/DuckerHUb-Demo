const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'CI/CD Demo Running, Demot körs och fungerar som det ska!',
  });
});

app.listen(port, () => {
  console.log(`Server kör på http://localhost:${port}`);
});
