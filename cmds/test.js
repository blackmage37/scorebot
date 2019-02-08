const Discord = require("discord.js");

/* used to scorinate a single results 100 times with the exact same params
   outputs to a webpage for display
   only available to bot admin */

module.exports.run = async (bot, message, args, con) => {

	switch(message.author.id) {

		case '270482906156236800': 
			// do nothing yet
			break;
		
		default:
			message.channel.send("Who told you this command existed?!");
			break;
		
	}

/*     let originalParams = args.join(' ');

    // scorinate the match specified by the params 100 times

    // output the full list to a webpage (these should be deleted every 24 hours or so)

    // prep a message with a summary and a link to their full history page
    let embed = {
        // build here
    };

    // send the result message
    message.channel.send({ embed: embed }); */

}

module.exports.help = {
    name: "past"
}