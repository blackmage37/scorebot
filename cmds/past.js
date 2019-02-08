const Discord = require("discord.js");

/* retrieves past results from the scorination database
   takes either a result id, a user id, or no parameters
   
   if a result id is passed, it retrieves the result, the params passed, and the user who scorinated it
   
   if a user is passed, it retrieves all results scorinated by that user to a webpage
   if no user is passed, it retrieves the scorination history of the user who passed the command */

module.exports.run = async (bot, message, args, con) => {

	message.channel.send("The past function has not yet been implemented, sorry!");

/* 	let sql = "";
	let embed = "";

	// if the command has a result id passed, retrieve that
	
	// otherwise...
    
	// did the command have a user passed?
	
		// if so, retrieve that user's scorination history
		sql = ` `;

		// output the full list to a webpage (these should be deleted every 24 hours or so)

		// prep a message with a summary and a link to their full history page
		embed = {
			// build here
		};

	// else, get the scorination history of the user who sent the command
	
		// if so, retrieve that user's scorination history
		sql = ` `;

		// output the full list to a webpage (these should be deleted every 24 hours or so)

		// prep a message with a summary and a link to their full history page
		embed = {
			// build here
		};
	
    // send the result message
    message.channel.send({ embed: embed }); */

}

module.exports.help = {
    name: "past"
}