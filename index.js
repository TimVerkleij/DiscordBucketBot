const Discord = require('discord.js');
const cron = require('cron');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
var NoSQL = require('nosql');
var fortuneDB = NoSQL.load('./local.fortune.nosql');
var factsDB = NoSQL.load('./local.facts.nosql');
var quickchatsDB = NoSQL.load('./local.quickchats.nosql');
var DMDB = NoSQL.load('./local.directMessages.nosql');
var memesDB = NoSQL.load('./local.memes.nosql');

client.on("ready", () => {
    client.user.setActivity('>help', {type: "LISTENING"});
    console.log("Ready!")
});

let scheduledMessage = new cron.CronJob('00 00 15 * * *', () => {

    console.log("Updating roles...")

    let getMembers = function () {
        const mrPoopGuildId = "379480837332271105"
        
        let mrPoopGuild = client.guilds.cache.get(mrPoopGuildId)
        return mrPoopGuild.members.fetch().then(members => {
            return members
        })

    }

    let allMembers = getMembers()

    allMembers.then(function (result) {
        console.log(`Checking roles for ${result.size} members...`)

        result.forEach((member) => checkSubRoles(member))
    })

});

scheduledMessage.start();

client.on('message', message => {

    if (message.guild === null && !message.author.bot) {

        const satedosUserId = "719187380682358905";

        if(message.author.id === satedosUserId){
            const today = new Date().getTime()
            message.attachments.every(a => {
                memesDB.insert({name: a.name, url: a.url, dateAdded: today})
                message.author.send("Meme has been added to the database!")
            })
        } else{
            const d = new Date(message.createdTimestamp);
            date = d.toLocaleTimeString() + " " + d.toDateString()
    
            DMDB.insert({user: message.author.username, message: message.content, date: date})
    
    
            console.log(`${
                message.author.username
            } tried to send a DM:\n${
                d.toLocaleTimeString()
            }: ${
                message.content
            }`)
            return
        }
        
    }


    let newMessage = message.content.toLowerCase()

    if (message.content.includes("<@!750667235684515872>") && newMessage.includes("help")) {
        let helpMenu = generateHelpMenu()
        message.channel.send(helpMenu)
    }


    if (message.content.startsWith(">") && !message.author.bot) {
        const userMessage = message.content;
        const commando = getFirstWord(userMessage).substring(1).toLowerCase();
        const args = getArgs(userMessage)
        const voiceChannel = message.member.voice.channel;
        if (commando === "penis") {
            message.channel.send(message.member.displayName + " has a penis length of " + Math.floor(Math.random() * 10 + 1) + " inches.");
        } else if (commando === "play") {
            if (args !== ">play") {
                if (voiceChannel) {
                    play(voiceChannel, args, message)
                } else {
                    message.channel.send("You don\'t seem to be in a voice channel")
                }
            } else {
                message.channel.send("You didn\'t give me a song to play dummy")
            }
        } else if (commando === "stop") {
            stopMusic(voiceChannel)
        } else if (commando === "callme") {
            message.channel.send("Hello? <@" + message.member.id + "> , are you there? :telephone_receiver: ")
        } else if (commando === "help") {
            let helpMenu = generateHelpMenu()
            message.channel.send(helpMenu);
        } else if (commando === "fortune") {
            fortuneDB.find().make(function (filter) {
                filter.callback(function (err, response) {
                    message.channel.send(':fortune_cookie:' + response[Math.floor(Math.random() * response.length)])
                });
            });
        } else if (commando === "fact") {
            factsDB.find().make(function (filter) {
                filter.callback(function (err, response) {
                    message.channel.send(response[Math.floor(Math.random() * response.length)])
                });
            });
        } else if (commando === "tictactoe" || commando === "ttt") {

            //creates a 3x3 player field full of the black large square emotes
            var a1 = b1 = c1 = a2 = b2 = c2 = a3 = b3 = c3 = ':black_large_square:'

            var array = [
                [],
                [
                    0, a1, a2, a3
                ],
                [
                    0, b1, b2, b3
                ],
                [
                    0, c1, c2, c3
                ]
            ]

            if (args.startsWith('<@') && args.endsWith('>') && ! args.includes(' ')) {
                var mentionedUser = getUserDataFromMention(args) // gets id from person who was challenged
                var mainUser = message.author // gets id from the challenger

                //Checks if the challenged user is valid
                //Bot will give savage/funny responses if invalid user was given
                if (mentionedUser === mainUser) {
                    message.channel.send("LMFAO You can't play with yourself idiot.")
                    return
                }
                if (mentionedUser === client.user) {
                    message.channel.send("Did you really think I was gonna play a game with you? LOLLLLL. Nobody wants to fucking play with you. :rofl: ")
                    return
                }
                if (mentionedUser.bot) {
                    message.channel.send("Are you seriously trying to play against a bot? :rofl: You are clearly not the smartest one in this server because that's me :robot:")
                    return
                }

                const playingFieldEmbed = new Discord.MessageEmbed().setColor('#0000ff').setTitle('Tic Tac Toe').addField(array[1][1] + ' ' + array[1][2] + ' ' + array[1][3] + '\n' + array[2][1] + ' ' + array[2][2] + ' ' + array[2][3] + '\n' + array[3][1] + ' ' + array[3][2] + ' ' + array[3][3], `${mentionedUser}'s turn`)

                message.channel.send(playingFieldEmbed);

                message.channel.send("Welcome to Tic Tac Toe, \n Type out `a`, `b` or `c` for the row, then `1`, `2` or `3` for the column. (eg. `a1` for top-left or `b2` for middle). You can also type `end` to end the game.")

                //creates a message collector which will wait for a response
                const collector = new Discord.MessageCollector(message.channel, m => m.author.id === mentionedUser.id, {time: 20000});

                collector.on('collect', message => {
                    if ((message.content.startsWith('a') || message.content.startsWith('b') || message.content.startsWith('c')) && (message.content.endsWith('1') || message.content.endsWith('2') || message.content.endsWith('3')) && message.content.length == 2) {
                        nextMove(message, array, mainUser, mentionedUser)
                        collector.stop()
                    } else {
                        message.channel.send("That\'s not how you play this game lmfao, try doing it right next time")
                    }
                })
            } else {
                message.channel.send("Lmfao, you gonna play on your own? Mention somone to play against dimwit.")
            }


        } else if (commando === "rlchat") {
            quickchatsDB.find().make(function (filter) {
                filter.callback(function (err, response) {
                    message.channel.send(response[Math.floor(Math.random() * response.length)])
                });
            });
        } else if (commando === "bruh") {
            message.channel.send("Bruh.", {files: ["./files/bruh.mp3"]});
        } else if (commando === "coinflip") {
            message.channel.send("Say `heads` or `tails` :smirk:")
            let randomNumber = Math.random()
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.member.id, {time: 20000});
            collector.on('collect', message => {
                if (message.content.includes("tails") || message.content.includes("Tails")) {
                    if (randomNumber > 0.5) {
                        message.channel.send("You chose tails, it landed on heads, you lose :slight_smile:")
                    } else {
                        message.channel.send("You chose tails, it landed on tails, you win :smile:")
                    }
                } else if (message.content.includes("heads") || message.content.includes("Heads")) {
                    if (randomNumber < 0.5) {
                        message.channel.send("You chose heads, it landed on heads, you win :smile:")
                    } else {
                        message.channel.send("You chose heads, it landed on tails, you lose :slight_smile:")
                    }
                }

                collector.stop()
            })
        } else if (commando === "members") {
            message.channel.send(`This awesome Discord server has ${message.guild.memberCount} members!`)
        } else if (commando === "meme") {
            memesDB.find().make(function (filter) {
                filter.callback(function (err, response) {
                    try{
                        message.channel.send(response[Math.floor(Math.random() * response.length)].url)
                    } catch{
                        message.channel.send("Something went wrong :frowning:")
                    }
                });
            });
        } else if (commando === "ping") {
            message.channel.send(`My reaction time is ${client.ws.ping} ms`)
        }
    }else if (message.content === "🍆") {
        message.react("🤏")
        message.react("🍆")
    } else if (newMessage.startsWith("rl.rank")) {
        message.channel.send(`Wrong channel ${message.author} \nGo to <#786661753462980690>`)
    }

});


client.on("guildMemberUpdate", function (oldMember, member) {

    const mrPoopGuildId = "379480837332271105"
    if (member.guild.id === mrPoopGuildId) {
        checkSubRoles(member)
    }
});

function generateHelpMenu(){
    const helpMenu = new Discord.MessageEmbed().setColor('#00ff00').setTitle('BucketBot Help Menu').setURL('https://www.youtube.com/c/blastbucketgaming/').setAuthor('BlastBucketGaming', 'https://yt3.ggpht.com/a-/AOh14Ggq46BGHZkdlJ0-7SbxWGD9j8hzapdBQQjS_v3hQA=s100-c-k-c0xffffffff-no-rj-mo', 'https://www.youtube.com/c/blastbucketgaming').setDescription('This is the BucketBot help menu. Here you will find all available commands. The bot only works if you see it online in the member list.').setThumbnail('https://static-cdn.jtvnw.net/jtv_user_pictures/8c77fe3b-7d7d-496b-8f97-5a6ae40c3047-profile_image-70x70.png').addFields([
                {
                    name: '`>help`',
                    value: 'Shows this help menu',
                    inline: true
                },
                {
                    name: '`>penis`',
                    value: 'Shows your penis length',
                    inline: true
                },
                {
                    name: '`>fortune`',
                    value: 'I\'m not a fortune teller but I can try :fortune_cookie:',
                    inline: true
                },
                {
                    name: '`>callme`',
                    value: 'Let the bot mention you in a message',
                    inline: true
                }, {
                    name: '`>fact`',
                    value: 'I will tell you a random fact, and you\'re gonna believe it',
                    inline: true
                }, {
                    name: '`>rlchat`',
                    value: 'THIS IS ROCKET LEAGUE!!!',
                    inline: true
                }, {
                    name: '`>bruh`',
                    value: 'Bruh.',
                    inline: true
                }, {
                    name: '`>tictactoe`',
                    value: 'Play a game of tic tac toe against a friend!',
                    inline: true
                }, {
                    name: '`>coinflip`',
                    value: 'You won\'t win',
                    inline: true
                }, {
                    name: '`>members`',
                    value: 'Check how many people are in this server',
                    inline: true
                }, {
                    name: '`>ping`',
                    value: 'Check my response time',
                    inline: true
                }, {
                    name: '`>meme`',
                    value: 'Show a random meme',
                    inline: true
                }
            ]).addField('Music commands:', '>play [youtube url] :arrow_right: I will play you a song in your voice channel\n \n >stop :arrow_right: stop playing music and leave the channel')
            return helpMenu
}


function checkSubRoles(member){
    
        const hasSub = member.roles.cache.has("616806136674385960")
        const hasGreenSub = member.roles.cache.has("489629999427485717")

        if (hasSub && ! hasGreenSub) {
            member.roles.add("489629999427485717")
        } else if (! hasSub && hasGreenSub) {
            member.roles.remove("489629999427485717")
        }
}

function getFirstWord(str) {
    let spaceIndex = str.indexOf(' ');
    return spaceIndex === -1 ? str : str.substr(0, spaceIndex);
};

function getArgs(str) {
    let spaceIndex = str.indexOf(' ');
    return spaceIndex === -1 ? str : str.substr(spaceIndex).trim();
}

//Whenever a mention is expected, this function will fetch all the user's data using their Discord ID
function getUserDataFromMention(mention) {
    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return client.users.cache.get(mention);
    }
}

//This recursive function handles most of the Tic Tac Toe game
function nextMove(message, array, mainUser, mentionedUser) {
    const gameInput = message.content.toLowerCase()
    if ((gameInput.startsWith('a') || gameInput.startsWith('b') || gameInput.startsWith('c')) && (gameInput.endsWith('1') || gameInput.endsWith('2') || gameInput.endsWith('3')) && gameInput.length == 2) {

        var input = gameInput
        var firstChar = input.charAt(0)
        var letter
        if (firstChar === "a") {
            letter = 1
        } else if (firstChar === "b") {
            letter = 2
        } else {
            letter = 3
        }

        var number = parseInt(input.charAt(1))

        //Checks if the chosen spot on the board is empty
        if (array[letter][number] === ":black_large_square:") {

            //Check who's turn it is.
            if (message.author == mainUser) {
                array[letter][number] = ":o:"
                let gameEnd = checkGameEnd(array, message)
                let gameWon = checkWin(array, message)
                if (gameWon) {
                    message.channel.send(`${mainUser} won the game!`)
                    return
                } else {
                    if (! gameEnd) {
                        message.channel.send("It\'s your turn now! <@" + mentionedUser.id + ">")
                        const collector2 = new Discord.MessageCollector(message.channel, m => m.author.id === mentionedUser.id, {time: 20000});
                        collector2.on('collect', message => {
                            nextMove(message, array, mainUser, mentionedUser);
                            collector2.stop()
                        })
                    }
                }


            } else {
                array[letter][number] = ":x:"
                let gameEnd = checkGameEnd(array, message)
                let gameWon = checkWin(array, message)
                if (gameWon) {
                    message.channel.send(`${mentionedUser} won the game!`)
                    return
                } else {
                    if (! gameEnd) {
                        message.channel.send("It\'s your turn now! <@" + mainUser.id + ">")
                        const collector2 = new Discord.MessageCollector(message.channel, m => m.author.id === mainUser.id, {time: 20000});
                        collector2.on('collect', message => {
                            nextMove(message, array, mainUser, mentionedUser);
                            collector2.stop()
                        })
                    }
                }


            }
        } else {
            message.channel.send("Are you blind? That spot is not available dumbass. Try a different spot.")
            if (message.author == mainUser) {
                const collector2 = new Discord.MessageCollector(message.channel, m => m.author.id === mainUser.id, {time: 20000});
                collector2.on('collect', message => {
                    nextMove(message, array, mainUser, mentionedUser);
                    collector2.stop();
                })
            } else {
                const collector2 = new Discord.MessageCollector(message.channel, m => m.author.id === mentionedUser.id, {time: 20000});
                collector2.on('collect', message => {
                    nextMove(message, array, mainUser, mentionedUser);
                    collector2.stop()
                })
            }
        }


        const playingFieldEmbed = new Discord.MessageEmbed().setColor('#0000ff').addField(`${
            array[1][1]
        } ${
            array[1][2]
        } ${
            array[1][3]
        }\n${
            array[2][1]
        } ${
            array[2][2]
        } ${
            array[2][3]
        }\n${
            array[3][1]
        } ${
            array[3][2]
        } ${
            array[3][3]
        }`, `Next turn!`)

        message.channel.send(playingFieldEmbed);
    } else {
        message.channel.send("That\'s not how you play this game lmfao, try doing it right next time")
        if (message.author == mainUser) {
            const collector2 = new Discord.MessageCollector(message.channel, m => m.author.id === mainUser.id, {time: 20000});
            collector2.on('collect', message => {
                nextMove(message, array, mainUser, mentionedUser);
                collector2.stop();
            })
        } else {
            const collector2 = new Discord.MessageCollector(message.channel, m => m.author.id === mentionedUser.id, {time: 20000});
            collector2.on('collect', message => {
                nextMove(message, array, mainUser, mentionedUser);
                collector2.stop()
            })
        }
    }


}


function checkWin(array) {

    const winningConditions = [
        [
            array[1][1],
            array[1][2],
            array[1][3]
        ],
        [
            array[2][1],
            array[2][2],
            array[2][3]
        ],
        [
            array[3][1],
            array[3][2],
            array[3][3]
        ],
        [
            array[1][1],
            array[2][1],
            array[3][1]
        ],
        [
            array[1][2],
            array[2][2],
            array[3][2]
        ],
        [
            array[1][3],
            array[2][3],
            array[3][3]
        ],
        [
            array[1][1],
            array[2][2],
            array[3][3]
        ],
        [
            array[1][3],
            array[2][2],
            array[3][1]
        ]
    ]

    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        let winCondition = winningConditions[i]
        let a = winCondition[0]
        let b = winCondition[1]
        let c = winCondition[2]
        let failSafe = [a, b, c]
        if ((a === b && b === c) && ! failSafe.includes(":black_large_square:")) {
            roundWon = true
        }
    }
    return roundWon

}


function checkFields(array, emptySpaces) {
    for (let i = 0; i < array.length; i++) {
        const value = array[i];
        for (let j = 0; j < value.length; j++) {
            const item = value[j];
            if (item === ":black_large_square:") 
                emptySpaces++
        }
    }
    return emptySpaces
}

function checkGameEnd(array, message) {
    let gameEnd = false
    var emptySpaces = 0
    if (checkFields(array, emptySpaces) === 0) {
        message.channel.send("game over")
        gameEnd = true
    }
    return gameEnd

}

//connects to a voice channel and plays a requested song
async function play(voiceChannel, song, message) {
    // has to be url even though this is a bad check...
    if (!/https?:\/\/(www\.)?youtu\.?be/i.test(song)) return message.channel.send("You did not provide a (valid) link. Grow some brains and give me something to play.");

    const stream = ytdl(song, {
        filter: 'audioonly',
        highWaterMark: 1 << 25
    });
    if (!stream) return message.channel.send("Video not found. Better luck next time");

    try {
        const connection = await voiceChannel.join(); // ?connect
        const dispatcher = connection.play(stream)
        dispatcher.on('finish', () => voiceChannel.leave());
    } catch {
        message.channel.send("Could not connect to your voice channel. Do I have the right permissions? Or are you just being a dick? :frowning: \n Consider asking a moderator to give me permissions :wink:");
    }
}


function stopMusic(voiceChannel) {
    voiceChannel.leave()
}

client.login(process.env.BOT_TOKEN);
