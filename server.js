var express = require('express');

var app = express();

app.get('/', function (req, res) {
  console.log('foo');
  res.send('Admin Homepage');
});

app.listen(3000);
