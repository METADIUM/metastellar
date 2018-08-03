const express = require('express');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const bodyParser = require('body-parser');

app.prepare()
.then(() => {
  const server = express();
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());

  server.get('*', (req, res) => {
    return handle(req, res);
  }).post('*', (req, res) => {
    console.log('received', req.query, req.body);
    res.end('OK')
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
