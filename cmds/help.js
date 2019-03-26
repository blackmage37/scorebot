const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, con) => {
	let embed = {
		"title": "ScoreBot",
		"description": "This bot allows you to scorinate single matches easily in discord!\n\nThe prefix is a full stop, so the command to open this menu, for example, is `.help`",
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
                "value": "Params:\nformula team1 team1rank team1style team2 team2rank team2style *(neutral)*\n\nExample: `.nsfs Osarius 10.37 1.5 Cobrio 1.37 0`\n\n*The above example will scorinate a game between Osarius (home team) and Cobrio, using the NSFS paradigm.\nIf the user adds a 1 as the final parameter, the game will be scorinated as if taking place at a neutral venue, for example:\n`.nsfs Osarius 10.37 1.5 Cobrio 1.37 0 1`\n\nNote that the SQIS formula does not implement style mods yet.\nThe NSFS formula will always use xkoranate-style style mods*"
            },
            {
                "name": "past",
                "value": "Params:\n(optional) tag a user\n*Displays a list of results for the last 10 games a user has scorinated.\nIf no user is specified, it will display the scorination history of whoever sent the command.*"
            },
            {
                "name": "check",
                "value": "Params:\nA result id\n\n*Displays the specified result, with the original params passed *"
            }
		]
	};
	
	var channel = bot.channels.get(message.channel.id);
	channel.send({ embed });
	
}

module.exports.help = {
	name: "help"
}