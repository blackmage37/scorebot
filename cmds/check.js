const Discord = require("discord.js");
const botSettings = require("./botsettings.json");              // loads botsettings from external file

/* retrieves past results from the scorination database
   
   if a result id is passed, it retrieves the result, the params passed, and the user who scorinated it
      
*/

module.exports.run = async (bot, message, args, con) => {

	//message.channel.send("The past function has not yet been implemented, sorry!");

 	let sql = "";
	let embed = "";
	
	if (args[0].length < 1 || args == null) {
			message.reply(" you did not specify a result ID to lookup");
			return;
		}
		
		sql = "SELECT * FROM " + botSettings.resultstbl + " WHERE resultID = " + args[0];
		
		con.query(sql, (err, rows) => {
			if(err) throw err;
			if(!rows[0]) return message.channel.send("This result ID does not exist!");
			
			// retrieve user details
			let nick = message.guild.members.get(rows[0].userID).nickname;
            let tag = message.guild.members.get(rows[0].userID).user.tag;
            
			if (nick.length > 0) {
				userDetail = tag + ' (' + nick + ')';
			} else {
				userDetail = tag;
			}
			
			// build message with result
			let embed = {
				"title": "Result",
				"description": "Search for resultID " + args[0] + " returned...",
				"color": 44678,
				"author": {
				 "name": 'ScoreBot',
				 "icon_url": ' '
				 },
				"fields": [
					{
						"name": "ResultID",
						"value": rows[0].resultID
					},
					{
						"name": "Timestamp",
						"value": rows[0].result_ts
					},
					{
						"name": "Result",
						"value": rows[0].result
					},
					{
						"name": "User",
						"value": userDetail
					},
					{
						"name": "Formula",
						"value": rows[0].formula
					},
					{
						"name": "Params",
						"value": rows[0].params
					}
				]
			};
			
			message.channel.send({ embed: embed });
			
		});
		
		return;
		
}

module.exports.help = {
    name: "check"
}