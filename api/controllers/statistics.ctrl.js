const Group = require('../models/group.model');

exports.statisticsController = {
    async getStatistics(req, res) {
        const gameId = req.params.id;

        try {
            let groups = await Group.find({
                'game': gameId
            }).populate({
                path: 'game',
                populate: {
                    path: 'route'
                }
            });

            const game = groups[0].game;

            let i, j;
            const groupsLength = groups.length;
            const challengesAmount = game.route.challengesAmount;

            const groupsOnGame = []
            const timeArr = [];

            for (i = 0; i < groupsLength; i++) {

                const groupChallenges = groups[i].challengesTime.length;
                groupsOnGame.push(groups[i].groupName);
                timeArr.push(groups[i].groupName);

                if(groupChallenges == 0) {
                    let j = 0;
                    while (j < challengesAmount) {
                        timeArr.push(0);
                        j++;
                    }
                }
                else {
                    for (j = 0; j < challengesAmount && j < groupChallenges; j++) {

                        if (j == 0) {
                            const challengeTimeMinutesCurrent = groups[i].challengesTime[j].getHours() * 60 + groups[i].challengesTime[j].getMinutes();
                            const createdAt = game.createdAt.getHours() * 60 + game.createdAt.getMinutes();
                            timeArr.push(challengeTimeMinutesCurrent - createdAt);

                        } else {
                            const challengeTimeMinutesCurrent = groups[i].challengesTime[j].getHours() * 60 + groups[i].challengesTime[j].getMinutes();
                            const challengeTimeMinutesBefore = groups[i].challengesTime[j - 1].getHours() * 60 + groups[i].challengesTime[j - 1].getMinutes();
                            timeArr.push(challengeTimeMinutesCurrent - challengeTimeMinutesBefore);
                        }

                    }

                    while (j < challengesAmount) {
                        timeArr.push(0);
                        j++;
                    }
                }
       
            
            }

            const dataGame = [];

            // Insert Challenges
            for (i = 0; i < challengesAmount; i++) {
                dataGame.push(`{ "name":"Challenge ${i + 1}"`)
            }

            // Insert game time for each group in each challenge
            let countGroup = 0;
            for (i = 0; i < timeArr.length; i++) {
                if (typeof timeArr[i] === 'string') {
                    ++countGroup;
                }
                if (typeof timeArr[i] !== 'string') {
                    for (j = 0; j < challengesAmount; j++) {
                        const timePerGroup = `"Group_${countGroup}": ${timeArr[i + j]}`;
                        if(countGroup !== groupsLength)
                            dataGame[j] = `${dataGame[j]}, ${timePerGroup}`
                        else dataGame[j] = `${dataGame[j]}, ${timePerGroup} }`

                    }
                    if (countGroup !== groupsLength)
                        i = i + challengesAmount - 1;
                    else
                        break;
                }
            }

            const gameDataParsed = [];

            dataGame.forEach((challenge,index) => { 
                gameDataParsed.push(JSON.parse(challenge));
             }) 

            const data = {};
            data.gameData = gameDataParsed;
            data.groupsOnGame = groupsOnGame;

            res.status(200).json({
                data
            })

        } catch (e) {
            console.log(e);
        }

    },
}