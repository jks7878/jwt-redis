const express = require('express');
const app = express();

const verifyToken = require('/token');

app.listen(8000, '0.0.0.0', () => { console.log(`jwt-redis Server Now Listening on port 8000`) });

app.get('/', (req, res) => {
  res.send('Hello World');
});

