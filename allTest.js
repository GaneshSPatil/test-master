var test = {};
var assert = require('assert');

test['should return true if the number is even'] = function(lib){
  assert.equal(lib.isEven(2), true);
}

test['should return false if the number is even'] = function(lib){
  assert.equal(lib.isEven(3), false);
}

test['should return true if the number is odd'] = function(lib){
  assert.equal(lib.isOdd(3), true);
}

exports.test = test;
