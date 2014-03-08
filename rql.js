var express = require('express');
var cp = require('./commandProcessor.js');
//Needed for POST TESTER
//var request = require('request');

//TODO(hansnelsen): command object parser
//TODO(hansnelsen): processSql.js
//TODO(hansnelsen): processCommands.js
//TODO(hansnelsen): addToExportQueue.js
//TODO(hansnelsen): databaseResults.js



var app = express();

app.configure(function(){
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
});



app.post('/rql', function(request, response){
	
	var parsed = cp.parse(request.body);
	try {
		var commandResults = cp.execute(cp.validate(parsed));
		response.send(commandResults);
	}
	catch(error) {
		response.send(404,error);
	}


});


var port = process.env.PORT || 8001;
app.listen(port, function(){
	console.log("Listening on " + port)

});



//POST TESTER
// request.post({
//   url: 'http://localhost:8001/a',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     a: 1,
//     b: 2,
//     c: 3
//   })
// }, function(error, response, body){
//   console.log(body);
// });