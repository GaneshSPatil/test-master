var colors = require('colors');

colors.setTheme({
  silly: ['rainbow'],
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: ['yellow','underline'],
  debug: 'blue',
  error: 'red'
});

var fs = require('fs');
var usages = ['node runTest.js exampleTest.js ==> runs all tests'.debug,
	'node runTest.js exampleTest.js'.debug+' -list '.info+'==> lists all tests'.debug,
	'node runTest.js exampleTest.js'.debug+' -stop '.info+'==> stops on first failure'.debug,
	'node runTest.js exampleTest.js'.debug+' -only '.info+' namePart ==> runs all tests that match the namePart'.debug
];

var printLine = function(line){console.log(line);};

var TestUsageException = function(message){
	this.message = message;
	this.name = 'TestUsageException'.cyan;
};
var trim_undefined = function(item){return item || ''};

var quit = function(){
	console.log('Usage:'.silly);
	usages.forEach(printLine);
	var args = Array.prototype.slice.call(arguments, 0);
	throw new TestUsageException(args.map(trim_undefined).join(' ').error);
};

var readTestDetails = function(testfileName){
	console.log('loading tests from:'.verbose,testfileName.warn.bold);
	var test = require('./'+testfileName).test;
	test || quit('Missing test object in'.error,testfileName.warn.bold);
	var members = Object.keys(test);
	var isAFunction = function(field){return ('function' == typeof test[field]);};
	var methods = members.filter(isAFunction);
	return {test:test,methodNames:methods};
};
var runTests = function(test,methodNames,option){
	var failed = 0;
	var executeTest = function(name){
		var member = test[name];
		console.log('--------'.data);
		console.log('-->'.info,name.info.bold.bold);
		try{
			member();
		}catch(error){
			failed++;
			console.log(error.stack.error);
			if(option === 'stop') throw {name:'User Requested to stop',message:'on first failure'};
		}
	};
	methodNames.forEach(executeTest);
	console.log('--------'.verbose);
	var total = methodNames.length;
	console.log((total-failed +'/'+total).data+' passed'.verbose);
};


var main = function(){
	var testName = process.argv[2];
	var option = process.argv[3];
	var filterText = process.argv[4];
	var matching = function(name){return name.indexOf(filterText)>=0;};

	if(!fs.existsSync(testName)) quit('Missing testfile',testName);
	var testDetails = readTestDetails(testName);

	(option === '-list') && testDetails.methodNames.forEach(printLine);
	(option === '-stop') && runTests(testDetails.test,testDetails.methodNames,'stop');
	(option === '-only') && runTests(testDetails.test,testDetails.methodNames.filter(matching));
	option || runTests(testDetails.test,testDetails.methodNames);
};

main();