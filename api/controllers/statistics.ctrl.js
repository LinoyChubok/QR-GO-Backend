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

            let groupsOnGame = []
            let timeArr = [];

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
                            let challengeTimeMinutesCurrent = groups[i].challengesTime[j].getHours() * 60 + groups[i].challengesTime[j].getMinutes();
                            let createdAt = game.createdAt.getHours() * 60 + game.createdAt.getMinutes();
                            timeArr.push(challengeTimeMinutesCurrent - createdAt);

                        } else {
                            let challengeTimeMinutesCurrent = groups[i].challengesTime[j].getHours() * 60 + groups[i].challengesTime[j].getMinutes();
                            let challengeTimeMinutesBefore = groups[i].challengesTime[j - 1].getHours() * 60 + groups[i].challengesTime[j - 1].getMinutes();
                            timeArr.push(challengeTimeMinutesCurrent - challengeTimeMinutesBefore);
                        }

                    }

                    while (j < challengesAmount) {
                        timeArr.push(0);
                        j++;
                    }
                }
       
            
            }

            let dataGame = [];

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
                        let timePerGroup = `"Group_${countGroup}": ${timeArr[i + j]}`;
                        if(countGroup !== challengesAmount)
                            dataGame[j] = `${dataGame[j]}, ${timePerGroup}`
                        else dataGame[j] = `${dataGame[j]}, ${timePerGroup} }`

                    }
                    if (countGroup !== groupsLength)
                        i = i + challengesAmount - 1;
                    else
                        break;
                }
            }

            let gameData = [];
            let a = dataGame.map(
                challenge => {
                    gameData.push(JSON.parse(challenge));
                    return challenge;
                }
            )

            const data = {};
            data.gameData = gameData;
            data.groupsOnGame = groupsOnGame;

            res.status(200).json({
                data
            })

        } catch (e) {
            console.log(e);
        }

    },
}