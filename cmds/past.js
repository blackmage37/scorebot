const Discord = require("discord.js");

module.exports.run = async (bot, message, args, con) => {

    let originalParams = args.join(' ');

    // query the database for the user's scorination history
    let sql = ` `;

    // output the full list to a webpage (these should be deleted every 24 hours or so)

    // prep a message with a summary and a link to their full history page
    let embed = {
        // build here
    };

    // send the result message
    message.channel.send({ embed: embed });

}

module.exports.help = {
    name: "past"
}