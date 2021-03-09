const Discord = require('discord.js');

module.exports = {
    generateHelpMenu(){
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
}