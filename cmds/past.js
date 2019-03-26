const Discord = require("discord.js");

/* retrieves past results from the scorination database
   
   if a user is passed, it retrieves the last ten results scorinated by that user
   if no user is passed, it retrieves the scorination history of the user who passed the command

   Future version:
		if a user is passed, it retrieves all results scorinated by that user to a webpage
   
*/

module.exports.run = async (bot, message, args, con) => {

	//message.channel.send("The past function has not yet been implemented, sorry!");

 	let sql = "";
	let embed = "";
	
	// get the last 10 results scorinated by the mentioned user (or the message author if no mention)
	let target = message.mentions.users.first() || message.author;
	
	sql = "SELECT * FROM iltornan_bots.scoreHistory WHERE userID = '" + target.id + "' ORDER BY result_ts DESC LIMIT 10;";
	
	con.query(sql, (err, rows) => {
		if(err) throw err;
		if(!rows[0]) return message.channel.send("This user has no scorination history.");
		
		// retrieve user details
		let nick = message.guild.members.get(target.id).nickname;
        let tag = message.guild.members.get(target.id).user.tag;
        
		if (nick.length > 0) {
			userDetail = tag + ' (' + nick + ')';
		} else {
			userDetail = tag;
		}
		
/* 			
		let resultsList = "";
		let listOfIDs = "";
		let timestampList = "";
		
		for(i = 0;i<rows.length;i++) {
			listOfIDs = listOfIDs + rows[i].resultID + "\n";
			resultsList = resultsList + rows[i].result + "\n";
			timestampList = timestampList + rows[i].result_ts + "\n";
		}
*/

		let searchResults = "";
		
		for(i = 0;i<rows.length;i++) {
			searchResults = searchResults + "ID: " + rows[i].resultID + " --- " + rows[i].result + "\n";
		}
		
		// build message with result(s)
		let embed = {
			"title": "Result",
			"description": "User scorination history search results for " + userDetail + "\n\nCheck individual results with the `.check` command\ne.g. `.check 3` to return result ID #3",
			"color": 44678,
			"author": {
			 "name": 'ScoreBot',
			 "icon_url": ' '
			 },
			"fields": [
/*
				{
					"name": "ResultID",
					"value": listOfIDs,
					"inline": true
				},
				{
					"name": "Timestamp",
					"value": timestampList,
					"inline": true
				},
				{
					"name": "Result",
					"value": resultsList,
					"inline": true
				},
*/					{
					"name": "Result List",
					"value": searchResults
				}
			]
		};
		
		// send the result message
		message.channel.send({ embed: embed });
	
	});
}

module.exports.help = {
    name: "past"
}