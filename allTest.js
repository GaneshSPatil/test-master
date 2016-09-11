var test = {};
var assert = require('assert');

test['isEven should return true if the number is even'] = function(lib){
  assert.equal(lib.isEven(2), true);
}

test['isEven should return false if the number is not even'] = function(lib){
  assert.equal(lib.isEven(3), false);
}

test['isOdd should return true if the number is odd'] = function(lib){
  assert.equal(lib.isOdd(5), true);
}

test['isOdd should return false if the number is not odd'] = function(lib){
  assert.equal(lib.isOdd(2), false);
}

test['add should return sum of provided numbers'] = function(lib){
  assert.equal(lib.add(2, 3), 5);
}

exports.test = test;
