const sqisConfig = require("../sqis.json");                     // loads SQIS formula details
const Discord = require("discord.js");

module.exports.run = async (bot, message, args, con) => {

        let originalParams = args.join(' ');
        let hSc = 0;
        let aSc = 0;
		let insertId = 0;

        // check there are enough params
        if (args.length < 5) {
            message.channel.send("Please check your message. The number of parameters does not appear to be correct.");
            return;
        }

        // split the params into more easily referenced variables and exit if any issues
        let home = args[0];
        //console.log('Home team: ' + home);

        // next two should be numeric
        let homeRank = args[1];
        //console.log('Home rank: ' + homeRank);

        let homeStyle = args[2];
        //console.log('Home style: ' + homeStyle);

        let away = args[3];
        //console.log('Away team: ' + away);

        // next two should be numeric again
        let awayRank = args[4];
        //console.log('Away rank: ' + awayRank);

        let awayStyle = args[5];
        //console.log('Away style: ' + awayStyle);

        // conditional check; defaults to 0 (false)
        let boolNeutral = 0;
        if (args.length > 5) {
            boolNeutral = args[6];
        }

        //console.log('Neutral flag: ' + boolNeutral);

        let a = sqisConfig.constantA;
        let b = sqisConfig.constantB;

        let skillRatio = 0;
        let skillAdv = 0;

        // calculate home advantage
        let homeAdv = 0;
        if (boolNeutral==0) {
            homeAdv = sqisConfig.homeAdvantage;
        } else {
            homeAdv = 1;
        }

        // home score first
        
            // calculate the skill ratios
            if (homeRank==awayRank) {
                skillRatio = 1;
                skillAdv = -1;
            } else if (homeRank > awayRank) {
                skillRatio = awayRank/homeRank;
                skillAdv = 1;
            } else {
                skillRatio = homeRank/awayRank;
                skillAdv = -1;
            }
            
            // get our values we need to calculate the result
            let pGoalH = (a + (b - skillRatio * b) * skillAdv) * homeAdv;
            //console.log('Home pGoal: ' + pGoalH);
            let randH = Math.random();
            //console.log('Home rand: ' + randH);
            let accH = 0;
            let pIGoalsH = Math.pow(1-pGoalH,sqisConfig.attacks);
            //console.log('Initial pIGoalsH: ' + pIGoalsH);

            // calculate the result
            let i = 0;
            for(i = 0; i <= sqisConfig.attacks; i++) {

                accH += pIGoalsH;
                //console.log('Acc: ' + accH);
                if(randH < accH) {
                
                    hSc = i;
                    break;

                } else {
                
                    // calculate probability of i + 1 goals
                    pIGoalsH *= ((sqisConfig.attacks - i) * pGoalH / ((i + 1) * (1 - pGoalH)));
                    //console.log('New pIGoalsH: ' + pIGoalsH);
                }

            }

        console.log('Home score: ' + hSc);

        // now repeat for the away score
            
            // calculate the skill ratios
            if (homeRank==awayRank) {
                skillRatio = 1;
                skillAdv = -1;
            } else if (awayRank > homeRank) {
                skillRatio = homeRank/awayRank;
                skillAdv = 1;
            } else {
                skillRatio = awayRank/homeRank;
                skillAdv = -1;
            }
            
            // get our values we need to calculate the result
            let pGoalA = (a + (b - skillRatio * b) * skillAdv) * homeAdv;
            console.log('Away pGoal: ' + pGoalA);
            let randA = Math.random();
            console.log('Away rand: ' + randA);
            let accA = 0;
            let pIGoalsA = Math.pow(1-pGoalA,sqisConfig.attacks);

            // calculate the result
            let j = 0;
            for(j = 0; j <= sqisConfig.attacks; j++) {

                accA += pIGoalsA;
                if(randA < accA) {

                    aSc = j;
                    break;

                } else {
                    
                    // calculate probability of j + 1 goals
                    pIGoalsA *= ((sqisConfig.attacks - j) * pGoalA / ((j + 1) * (1 - pGoalA)));
                
                }

            }

        console.log('Away score: ' + aSc);

		console.log('Applying style modifiers...');
		
		// apply style modifiers
		
		/* ORIGINAL CODE: What's "individualScore" doing?
		
		int styleEffect = 0;
		int maxStyleEffect = (homeScore == awayScore ? 0 : abs(homeScore - awayScore) - 1) + min(homeScore, awayScore); // what’s the maximum change we can make that will preserve W/D/L?
		styleEffect = (int)(s->individualScore("style", (homeStyle + awayStyle) / 20 + 0.5));
		if(styleEffect < -maxStyleEffect)
		styleEffect = -maxStyleEffect;
		homeScore += max(-homeScore, styleEffect); // don’t drop the score below 0
		awayScore += max(-awayScore, styleEffect); // don’t drop the score below 0
		return qMakePair(homeScore, awayScore);
		
		*/
		
		
		
		
		
		
		
		
        // create the result string
        let resultString = home + ' ' + hSc + '-' + aSc + ' ' + away;
        console.log(resultString);

        // insert results to database
        let sql = `INSERT INTO scoreHistory ( userID, messageID, channelID, guildID, formula, params, result ) VALUES ( '${message.author.id}', '${message.id}', '${message.channel.id}', '${message.guild.id}', 'sqis', '${originalParams}', '${resultString}' )`;
        con.query(sql, (err, row) => {
            if (err) throw err;
            
			//console.log(row);
			//console.log(row.insertId);
			
			// get row id of inserted result, so the result can be checked later for integrity purposes
			insertId = row.insertId;
			
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
						"name": "ResultID",
						"value": insertId
					},
					{
						"name": "User params",
						"value": originalParams
					},
					{
						"name": "From message",
						"value": message.content
					}
				]
			};

			// send the result message
			message.channel.send({ embed: embed });
			
		});
		
}

module.exports.help = {
	name: "sqis"
}