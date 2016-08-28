var request = require('request');
request('http://localhost:3000', function (error, response, body) {
  console.log(response);
});
