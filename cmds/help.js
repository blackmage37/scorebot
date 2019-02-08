const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, con) => {
	let embed = {
		"title": "ScoreBot",
		"description": "This bot allows you to scorinate single matches easily in discord! The prefix is a full stop, so the command to open this menu, for example, is `.help`",
		"color": 12582912,
		"thumbnail": {
			"url": " "
			},
        "fields": [
            {
                "name": "help",
                "value": "*Displays this menu*"
            },
            {
                "name": "nsfs/sqis",
                "value": "Params: formula team1 team1rank team1style team2 team2rank team2style *(neutral)*\nExample: `.nsfs Osarius 10.37 1.5 Cobrio 1.37 0`\nThe above line will scorinate a game between Osarius (home team) and Cobrio, using the NSFS paradigm.\nIf the user adds a 1 as the final parameter, the game will be scorinated as if taking place at a neutral venue, for example:\n`.nsfs Osarius 10.37 1.5 Cobrio 1.37 0 1`"
            },
            {
                "name": "past",
                "value": "Params: (optional) a result id OR (optional) tag a user\n*Displays either the specified result, with the original params passed OR a list of results for all games a user has scorinated, with the parameters they passed to the bot. If no user is tagged, it displays all results by the user calling the command*"
            }
		]
	};
	
	var channel = bot.channels.get(message.channel.id);
	channel.send({ embed });
	
}

module.exports.help = {
	name: "help"
}