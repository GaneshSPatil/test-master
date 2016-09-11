var express = require('express');
var fs = require('fs');
var _ = require('lodash');
var bodyParser = require('body-parser');
var userInfo = require('./userInfo.js').info;
var allTests = require('./allTest.js').test;

var app = express();
app.use(bodyParser());

app.use(function(req, res, next){
  var time = new Date();

  var info = {};
  info.Time = time.toLocaleTimeString();
  info.Date = time.toLocaleDateString();
  info.userName = req.body.name;
  info.userId = req.body.id;
  info.isValid = isValidUser(info.userId);
  info.testCount = isValidUser(info.userId) ? getTestCount(info.userId) : 0;
  console.log(JSON.stringify(info));
  fs.appendFileSync('./request.log', JSON.stringify(info));
  next();
});

var getTestCount = function(userId){
  return userInfo[userId].length
}

var isValidUser = function(userId){
  return _.includes(_.keys(userInfo), userId);
}

app.use(function(req, res, next){
  var userId = req.body.id;
  if(isValidUser(userId)){
    next();
  }else{
    var response = {};
    response.message = 'Unauthorized, Contact Admin';
    response.tests = '';
    res.send(response);
  }
});

var backup = function(){
  var text = 'exports.info = {\n'
  Object.keys(userInfo).forEach(function(userName, index, allUserNames){
    text = text.concat('"' + userName + '"').concat(':');
    var allTests = '["'.concat(userInfo[userName].join('","')).concat('"]');
    text = text.concat(allTests);

    if((allUserNames.length-1) != index){
      text = text.concat(',\n');
    }else{
      text = text.concat('\n}');
    }
  });
  fs.writeFileSync('./userInfo.js', text);
}

app.post('/submit', function(req, res){
  var id = req.body.id;
  var code = req.body.code;
  var fileName = './abcd-'+Math.random()+'.js';
  fs.writeFileSync(fileName, code);
  var lib = require(fileName).lib;
  fs.unlink(fileName);

  var testNames = userInfo[id];
  var userTests = {};
  testNames.forEach(function(name){
    userTests[name] = allTests[name];
  });

  var failedCount = 0;
  Object.keys(userTests).forEach(function(testName){
    try{
      userTests[testName](lib);
    }catch(e){
      failedCount++;
    }
  });

  var response = {};
  if(failedCount){
    response.message = 'Tests are failing.. fix it first';
  }else{
    var allTestNames = Object.keys(allTests);
    if(testNames.length == allTestNames.length){
      response.message = 'Congratulations.. Yippiee All tests passed';
    }else{
      response.message = 'Tests updated';
      var otherTests = getDiffTests(testNames, allTestNames);
      var testToAdd = otherTests[Math.round(Math.random()*(otherTests.length - 1))];
      userTests[testToAdd] = allTests[testToAdd];
      userInfo[id].push(testToAdd);
      backup();
    }
  }
  response.tests = getTests(userTests);
  res.send(response);
});

var getDiffTests = function(userTests, allTests){
  return allTests.filter(function(testName){
    return (userTests.indexOf(testName) == -1);
  });
}

var getHeader = function(){
  return ['var test = {};',
          'var assert = require(\'assert\');', '']
          .join('\n');
};

var getFooter = function(){
  return ['',
          'exports.test = test;']
          .join('\n');
};

var getStringRepresentation = function(testName, test){
  return '\n' + 'test["' + testName + '"] = ' + test.toString() + '\n';
}

var getTests = function(userTests){
  var text = '';
  var text = text.concat(getHeader());
  Object.keys(userTests).forEach(function(testName){
    text = text.concat(getStringRepresentation(testName, userTests[testName]));
  })
  var text = text.concat(getFooter());
  return text;
};

app.listen(3000);
