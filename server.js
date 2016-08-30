var express = require('express');
var id = require('./id.js').id;

var app = express();

app.get('/', function (req, res) {
  console.log('foo');
  res.send('Admin Homepage');
});

app.post('/submit', function(req, res){
  console.log(req);
  res.send('Admin Homepage');
});

app.listen(3000);
