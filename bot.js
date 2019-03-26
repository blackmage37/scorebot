const Discord = require("discord.js");
const fs = require("fs");
const mysql = require("mysql");

const botSettings = require("./botsettings.json");              // loads botsettings from external file
const ref = require("./channels.js");                           // list of channels this bot can be used in
const cleanChannels = ref.channelArray();

// note that this is a constant; currently this bot will not allow alteration of the prefix
const prefix = botSettings.prefix;

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
bot.ratelimits = new Discord.Collection();

// load all commands from the /cmds/ folder
fs.readdir("./cmds/", (err, files) => {
	if(err) console.error(err);

	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if(jsfiles.length <= 0) {
		console.log("No commands to load!");
		return;
	}

	console.log(`Loading ${jsfiles.length} commands!`);

	jsfiles.forEach((f, i) => {
		let props = require(`./cmds/${f}`);
		console.log(`${i + 1}: ${f} loaded!`);
		bot.commands.set(props.help.name, props);
	});
});

bot.on("ready", () => {
	console.log(`Bot is ready! ${bot.user.username}`); 
});

// connect to MySQL database to store results
var con = mysql.createConnection({
    host: botSettings.dbhost,
    user: botSettings.dbuser,
    password: botSettings.dbpass,
    database: botSettings.dbname	
});

con.connect(err => {
	if(err) throw err;
	console.log("Connected to database!");
});

bot.on("message", async message => {

	// ignore bot messages and DMs
	if(message.author.bot) return;
	if(message.channel.type === "dm") return;

    // split the message into command and args
	let messageArray = message.content.split(/\s+/g);
	let command = messageArray[0];
	let args = messageArray.slice(1);

    // if it doesn't have the command prefix, ignore it
	if(!command.startsWith(prefix)) return;

    // set a 2 second rate limit for commands
	let limit = bot.ratelimits.get(message.author.id);
	let now = Date.now();
	let timeLimit = 2000;

    // if less than 2 seconds since last command, block it
	if(limit != null) {
		if(limit >= now - timeLimit) {
			message.delete();
			return message.channel.send("You are being ratelimited. Try again in `" + (Math.abs((now - limit) - timeLimit) / 1000).toFixed(2) + "` seconds.").then(m => m.delete(2000));
		} else {
			bot.ratelimits.set(message.author.id, now);
		}
	} else {
		bot.ratelimits.set(message.author.id, now);
	}

    // extract the actual command from the message and run it
	let cmd = bot.commands.get(command.slice(prefix.length));
	if(cmd) cmd.run(bot, message, args, con);
});

bot.login(botSettings.token);