const express = require('express');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var path = require('path');

app.prepare()
.then(() => {
  const server = express();
  server.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());
  server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  server
  .get('*', (req, res) => {
    return handle(req, res);
  })
  .post('/metainfo', (req, res) => {
    var name = encodeURIComponent(req.body['data']['name']['value'])
    var email = encodeURIComponent(req.body['data']['email']['value'])
    res.redirect('/metainfo?session='+req.query['session']+'&name='+name+'&sns='+email)
  })
  
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
