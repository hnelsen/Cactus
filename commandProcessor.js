var sqlite3 = require('sqlite3').verbose();
var underscore = require('underscore');

var commandWhiteList = ['#load', '#status', '#store', '#export', '#list', '#clear'];

//Explicit SQL we allow; we want to select, update and be able to create temp tables and indexes
var sqlWhiteList = ['select', 'update', 'create'];

//Explicit SQL we do not allow that MAY be paired with a safe word. For instance INSERT .... SELECT would yield a false posative
var sqlBlackList = ['insert'];

var listContains = function (list1, list2) {
	//Determine if list one contains anything in list list two
	//Output: a list of True or False, which is then compacted to remove all False
	//Results: if there is not a match, an empty array is returned, if there is, an array of true is returned
	var i = underscore.compact(underscore.map(list1, function (word){
		return underscore.contains(list2,word);

	}));
	//console.log(i);
	if (i.length > 0){
		return true;
	} else {
		return false;
	}
	
}

exports.parse = function (commandObject) {
	//Make sure it is a string
	//explode the sting on ; and put it into an array
	//return
	var commandArray = [];
	commandArray = commandObject.command.split(';');
	return commandArray;


}

exports.validate = function (command) {
	//This variable, when used with test() will accept things that begin with <space># or # as commands
	var rx = /^ +#|^#/; 
	var validatedCommands = [];
	for (x=0; x < command.length; x++) {
		//testing for commands vs sql statements
		console.log(command[x]);

		if (rx.test(command[x])) { 
			
			// validatedCommands[x] = command[x] + " is a command";
			tokenizedCommand = underscore.compact(command[x].split(' '));
			//console.log(underscore.indexOf(commandWhiteList,tokenizedCommand[0]));
			//check to see if the command is in the array you just made
			if (underscore.indexOf(commandWhiteList,tokenizedCommand[0]) == -1 ) {
				//validatedCommands = c[0] + " is not a recognized command";
				throw new Error(tokenizedCommand[0] + " is not a recognized command");
			}
			else {
				//need to validate parameters here
				//validatedCommands = tokenizedCommand[0] + " will execute"
				validatedCommands = command;

			}
		} 
		
		 else {
			tokenizedSql = underscore.compact(command[x].split(' '));
			console.log(tokenizedSql);
			//var mapped = underscore.compact(underscore.map(sqlWhiteList, function(word) { return underscore.contains(tokenizedSql,word);}));
			//var blackListed = underscore.compact(underscore.map(sqlBlackList, function(word) { return underscore.contains(tokenizedSql,word);}));
			var whiteListed = listContains(sqlWhiteList,tokenizedSql);
			var blackListed = listContains(sqlBlackList,tokenizedSql);

			// console.log(whiteListed);
			// console.log(blackListed);
			
			// console.log(underscore.compact(mapped));
			
			//if (whiteListed.length == 0 || blackListed.length > 0) {
			// if (underscore.isEmpty(whiteListed) || !underscore.isEmpty(blackListed)) {
			if (!whiteListed || blackListed) {
				throw new Error("Unsuported SQL Statement " + command[x]);
			} else {
				//look for blacklist 

				validatedCommands = command;
			}

			}
		 

	}
	return validatedCommands;
}


exports.execute = function (command) {
	
//this needs to branch between two execution paths: SQLite and #commands
//TODO (hansnelsen): make this clean at some point, obviously
	return command;

}


//there are a number of things to do here:
// parser --> extract ALL of the commands
//		  --> it should then pass the array to a sanity process
// sanity --> are there any non-whitelisted commands
// 		  --> it fail with an error that it does not know command X
// 		  --> it determine if any given command is in the proper format: #load adfadsfads is nonsense, we need to say so 
// 		  --> if know and coherent then execute and send back the status
// Some other part of the code is going to process these things, this is just a sanity checker


//var db = sqlite3.cached.Database('test.db');
// db.serialize(function() {
//   db.run("CREATE TABLE lorem (info TEXT)");

//   var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//   for (var i = 0; i < 10; i++) {
//       stmt.run("Ipsum " + i);
//   }
//   stmt.finalize();

//   db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
//       console.log(row.id + ": " + row.info);
//   });
// });

// db.close();