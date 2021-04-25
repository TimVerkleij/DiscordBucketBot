const Discord = require('discord.js');
const cron = require('cron');
const client = new Discord.Client();
const NoSQL = require('nosql');
const dotenv = require('dotenv');
dotenv.config();

//Database files
var fortuneDB = NoSQL.load('./local.fortune.nosql');
var factsDB = NoSQL.load('./local.facts.nosql');
var quickchatsDB = NoSQL.load('./local.quickchats.nosql');
var memesDB = NoSQL.load('./local.memes.nosql');

//service imports
const tictactoe = require('./services/tictactoe')
const helpMenu = require('./services/helpMenu')
const music = require('./services/music')
const extras = require('./services/extras')

//extras
let lastCommand

client.on("ready", () => {
    client.user.setActivity('>help', {type: "STREAMING", url: "https://www.twitch.tv/blastbucketgaming"});
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
    let newMessage = message.content.toLowerCase()

    if (message.content.includes("<@!750667235684515872>") && newMessage.includes("help")) {
        let helpMenu = generateHelpMenu()
        message.channel.send(helpMenu)
    }


    if (message.content.startsWith(">") && !message.author.bot) {
        const userMessage = message.content;
        const commando = extras.getFirstWord(userMessage).substring(1).toLowerCase();
        const args = extras.getArgs(userMessage)
        const voiceChannel = message.member.voice.channel;

        if(lastCommand) {
            if (Date.now() - lastCommand.time < 4000 && lastCommand.currentChannel === message.channel.id) {
                return
            }
        }

        if (commando === "penis") {
            message.channel.send(message.member.displayName + " has a penis length of " + Math.floor(Math.random() * 8 + 1) + " inches.");
        } else if (commando === "play") {

            //check if user sent a song
            if(args === ">play"){
                return message.channel.send("You didn\'t give me a song to play dummy")
            }

            //check if user is in a voicechannel
            if(!voiceChannel){
                return message.channel.send("You don\'t seem to be in a voice channel")
            }

            //play music
            music.play(voiceChannel, args, message)

        } else if (commando === "stop") {
            let connectedVoiceChannelClient = message.guild.voice?.channel
            let connectedVoiceChannelMember = message.member.voice?.channel

            if(connectedVoiceChannelClient === connectedVoiceChannelMember){
                music.stopMusic(voiceChannel)
            } else {
                message.channel.send(`We're not in the same voice channel :slight_frown:`)
            }

                
        } else if (commando === "help") {
            let helpMenuMessage = helpMenu.generateHelpMenu()
            message.channel.send(helpMenuMessage);
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
                // gets id from person who was challenged
                var mentionedUser = client.users.cache.get(extras.getUserDataFromMention(args)) 
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
                        tictactoe.startTTT(message, array, mainUser, mentionedUser)
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
        } else if (commando === "ping") {
            message.channel.send(`My reaction time is ${client.ws.ping} ms`)
        }

        let time = Date.now()
        let currentChannel = message.channel.id
        lastCommand = {commando, time, currentChannel}
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

client.on('voiceStateUpdate', (oldState, newState) => {
    
    //Voice channel that the client is currently connected to
    let connectedVoiceChannel = oldState.guild.voice?.channel

    if(connectedVoiceChannel){

        //Amount of non-bot members present in the connected voice channel
        let membersInVoiceChannel = connectedVoiceChannel.members.filter(x => {
            if(x.user.bot === false){
                return x
            }
        }).size

        //Leave Voice channel if all humans left
        if(membersInVoiceChannel == 0){
            connectedVoiceChannel.leave()
        }
    }
})

function checkSubRoles(member){
    
        const twitchSubrole = "818893751261986887"
        const greenSubRole = "489629999427485717"

        const hasSub = member.roles.cache.has(twitchSubrole)
        const hasGreenSub = member.roles.cache.has(greenSubRole)

        if (hasSub && ! hasGreenSub) {
            member.roles.add(greenSubRole)
        } else if (! hasSub && hasGreenSub) {
            member.roles.remove(greenSubRole)
        }
}

client.login(process.env.BOT_TOKEN);