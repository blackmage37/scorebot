const sqisConfig = require("../nsfs.json");                     // loads NSFS formula details
const Discord = require("discord.js");

module.exports.run = async (bot, message, args, con) => {

    let originalParams = args.join(' ');

    // calculate the result



    // insert results to database
    let sql = `INSERT INTO scoreHistory ( userID, params, result ) VALUES ( ${message.author.id}, ${originalParams}, ${resultString} )`;
    con.query(sql, (err, rows) => {
        if (err) throw err;
        console.log(rows);
    });

    // prep the result message
    let embed = {
        "title": "Result",
			"description": resultString,
        "color": 44678,
        "author": {
            "name": 'ScoreBot',
            "icon_url": ' '
        },
        "fields": [
            {
                "name": "User params",
                "value": originalParams
            }
        ]
    };

    // send the result message
    message.channel.send({ embed: embed });

}

module.exports.help = {
    name: "nsfs"
}