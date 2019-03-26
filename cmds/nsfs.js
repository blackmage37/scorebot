const nsfsConfig = require("../nsfs.json");                     // loads NSFS formula details
const Discord = require("discord.js");

// generates random numbers with gaussian distribution using box-muller transform
// https://stackoverflow.com/a/49434653
function gaussianRand() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return gaussianRand(); // resample between 0 and 1
    return num;
};

module.exports.run = async (bot, message, args, con) => {

	// 2019-03-01 -- something is up with the maths in here. Need to revisit and refactor maybe.
	//
	// ------------------------------------------------------------------------------------------------------------------
    // message.channel.send("The NSFS formula has not been implemented yet, sorry!");
    // /* uncomment this line and the one above to disable the nsfs formula

	let originalParams = args.join(' ');
	let hSc = 0;
	let aSc = 0;
	let insertId = 0;
	
	// check there are enough params
	if (args.length < 6) {
		message.channel.send("Please check your message. The number of parameters does not appear to be correct.");
		return;
	}

	// split the params into more easily referenced variables and exit if any issues
	let home = args[0];
	//console.log('Home team: ' + home);

	// next two should be numeric
	let homeRank = parseFloat(args[1]);
	//console.log('Home rank: ' + homeRank);

	let homeStyle = parseFloat(args[2]);
	//console.log('Home style: ' + homeStyle);

	let away = args[3];
	//console.log('Away team: ' + away);

	// next two should be numeric again
    let awayRank = parseFloat(args[4]);
	//console.log('Away rank: ' + awayRank);

    let awayStyle = parseFloat(args[5]);
	//console.log('Away style: ' + awayStyle);

	// conditional check; defaults to 0 (false)
	let boolNeutral = 0;
	if (args.length > 6) {
        boolNeutral = parseInt(args[6], 10);
	}

	// calculate home advantage
	let homeAdv = 0;
	if (boolNeutral==0) {
        homeAdv = parseFloat(nsfsConfig.homeAdvantage);
	}

    ////// grab the config values in handy local vars

    baseAtkSup = parseInt(nsfsConfig.baseAttacksSuperior, 10);
    baseAtkInf = parseInt(nsfsConfig.baseAttacksInferior, 10);
    atkCoeffSup = parseFloat(nsfsConfig.attackCoeffSuperior);
    atkCoeffInf = parseFloat(nsfsConfig.attackCoeffInferior);
    atkMult = parseFloat("1");
    bast = parseFloat(nsfsConfig.baseAttackSuccessThreshold);
    rankDiffMod = parseFloat(nsfsConfig.rankDiffModifier);
    rankCoeff = parseFloat(nsfsConfig.rankCoeff);
    rankScalar = parseFloat(nsfsConfig.rankScalar);
    baseAtkCoeff = parseFloat(nsfsConfig.baseAttackCoeff);

    ////// calculate the result

		// home team first
	
			// calculate the number of attacks
            let attacksH = 0;
            //console.log('home attack calculation: int((' + baseAtkSup + ' + ((' + homeRank + ' - ' + awayRank + ') * ' + atkCoeffSup + ')) * ' + atkMult + ')');

            if (homeRank > awayRank) {
				attacksH = Math.floor((baseAtkSup + ((homeRank - awayRank) * atkCoeffSup)) * atkMult);
			} else {
				attacksH = Math.floor((baseAtkInf + ((homeRank - awayRank) * atkCoeffInf)) * atkMult);
			}
			
			//console.log('home attacks: ' + attacksH);
			
			// calculate chance of scoring on an attack
            let pGoalH = 0.00;
            //console.log('1 - (' + bast + ' + ' + rankDiffMod + ' * (Math.pow(' + awayRank + ' * ' + rankCoeff + ', ' + rankScalar + ') - Math.pow(' + homeRank + ' * ' + rankCoeff + ', ' + rankScalar + '))) / ' + baseAtkCoeff + ' + ' + homeAdv + ')');
            pGoalH = 1 - (bast + rankDiffMod * (Math.pow(awayRank * rankCoeff, rankScalar) - Math.pow(homeRank * rankCoeff, rankScalar))) / (baseAtkCoeff + homeAdv);
			//console.log('scoring chance: ' + pGoalH);
						
			// get score
			let randH = Math.random();
			let accH = 0;
            let pIGoalsH = Math.pow(1 - pGoalH, attacksH);		// probability of no goals
			
			//console.log('threshold: ' + randH);
			
			for (i = 0; i <= attacksH; i++) {
				
				accH += pIGoalsH;
				
				// check against 
                if (randH < accH) {
                    hSc = i;
                    //console.log(i + ' goals scored. attack period finished.');
                    break;
                } else {
                    //console.log('scored!');
                }
				
				pIGoalsH *= (attacksH - i) * pGoalH / ((i + 1) * (1 - pGoalH));
				
			}
			
		//console.log('Home score: ' + hSc);
		
		// away team
		
			// calculate the number of attacks
            let attacksA = 0;
            //console.log('away attack calculation: int((' + baseAtkInf + ' + ((' + awayRank + ' - ' + homeRank + ') * ' + atkCoeffInf + ')) * ' + atkMult + ')');
			if (awayRank > homeRank) {
                attacksA = (baseAtkSup + ((awayRank - homeRank) * atkCoeffSup)) * atkMult;
			} else {
                attacksA = (baseAtkInf + ((awayRank - homeRank) * atkCoeffInf)) * atkMult;
			}
			
			//console.log('away attacks: ' + attacksA);
			
			// calculate chance of scoring on an attack
			let pGoalA = 0.00;
            pGoalA = 1 - (bast + rankDiffMod * (Math.pow(homeRank * rankCoeff, rankScalar) - Math.pow(awayRank * rankCoeff, rankScalar))) / (baseAtkCoeff + homeAdv);
			//console.log('scoring chance: ' + pGoalA);
			
			// get score
			let randA = Math.random();
			let accA = 0;
			let pIGoalsA = Math.pow(1 - pGoalA, attacksA);		// probability of no goals
			
			//console.log('threshold: ' + randA);
			//console.log('no goal: ' + pIGoalsA);
			
			for (i = 0; i <= attacksA; i++) {
				
				accA += pIGoalsA;
				
				// check against 
				if(randA < accA) {
					aSc = i;
                    //console.log(i + ' goals scored. attack period finished.');
                    break;
                } else {
                    //console.log('scored!');
                }
				
				pIGoalsA *= (attacksA - i) * pGoalA / ((i + 1) * (1 - pGoalA));
				
			}
			
		//console.log('Away score: ' + aSc);
		
		//console.log('Applying style modifiers...');

        ///// apply style modifiers

            // get style mod config values to local vars
            styleCoeffA = parseFloat(nsfsConfig.NSFSStyleCoeffA);
            styleCoeffB = parseFloat(nsfsConfig.NSFSStyleCoeffB);
            styleExp = parseFloat(nsfsConfig.NSFSStyleExponent);
            styleOffset = parseFloat(nsfsConfig.NSFSStyleOffset);

    /*
     
       //---------------------------------------------------------------------------------------------------------------------
       // nsfs style
       //---------------------------------------------------------------------------------------------------------------------
	    
		    let styleMod = (homeStyle + awayStyle) / 2.0 + gaussianRand();
		    let result = hSc - aSc;
		    let styleMultiplier = styleCoeffA / (1 + styleCoeffB * Math.pow(Math.E, styleExp * styleMod)) + styleOffset;
		
		    console.log('Style multiplier: ' + styleMultiplier);
		
		    hSc *= styleMultiplier;
		    aSc *= styleMultiplier;
		
			    // if a negative style mod changed the result to a draw, fix it
			    if (hSc == aSc && result > 0) {
				    hSc++;
			    } else if (hSc == aSc && result < 0) {
				    aSc++;
			    }

       //---------------------------------------------------------------------------------------------------------------------

    */

       //---------------------------------------------------------------------------------------------------------------------
       // xkoranate style
       //---------------------------------------------------------------------------------------------------------------------

            let styleEffect = 0;
            let maxStyleEffect = 0
        
            if (hSc == aSc) {
                maxStyleEffect = 0;
            } else {
                maxStyleEffect = (Math.abs(hSc - aSc) - 1) + Math.min(hSc, aSc);
            }

            styleEffect = (homeStyle + awayStyle) / 20 + 0.5;

            if (styleEffect < -maxStyleEffect) {
                styleEffect = -maxStyleEffect;
            }

            hSc += Math.max(-hSc, styleEffect);
            aSc += Math.max(-aSc, styleEffect);

        //---------------------------------------------------------------------------------------------------------------------

    // round the scores to whole numbers
    hSc = Math.round(hSc);
    aSc = Math.round(aSc);

	// create the result string
	let resultString = home + ' ' + hSc + '-' + aSc + ' ' + away;
	console.log(resultString);
		
    // insert results to database
	let sql = `INSERT INTO scoreHistory ( userID, messageID, channelID, guildID, formula, params, result ) VALUES ( '${message.author.id}', '${message.id}', '${message.channel.id}', '${message.guild.id}', 'nsfs', '${originalParams}', '${resultString}' )`;
    con.query(sql, (err, row) => {
		
        if (err) throw err;
        //console.log(row);
		
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
	
// */
    
}

module.exports.help = {
    name: "nsfs"
}