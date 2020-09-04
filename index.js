const Discord = require('discord.js');
const client = new Discord.Client();

client.on("ready", () => {
    client.user.setActivity('>help', {type: "LISTENING"});
    // client.user.setActivity('YouTube', { type: 'WATCHING' });
    console.log("Ready!")
});

client.on('message', message => {
    if (message.member.id != "750667235684515872") {

        var startCommand = message.content.slice(0, 1)
        if (startCommand === ">") {
            var userMessage = message.content;
            var commando = getFirstWord(userMessage).substring(1);
            if (commando === "penis") {
                message.channel.send(message.member.displayName + " has a penis length of " + Math.floor(Math.random() * 10 + 1) + " inches.");
            } else if (commando === "callme") {
                message.channel.send("<@" + message.member.id + ">")
            } else if (commando === "help") {
                const exampleEmbed = new Discord.MessageEmbed()
                    .setColor('#00ff00')
                    .setTitle('BucketBot Help Menu')
                    .setURL('https://www.youtube.com/c/blastbucketgaming/')
                    .setAuthor('BlastBucketGaming', 'https://yt3.ggpht.com/a-/AOh14Ggq46BGHZkdlJ0-7SbxWGD9j8hzapdBQQjS_v3hQA=s100-c-k-c0xffffffff-no-rj-mo', 'https://www.youtube.com/c/blastbucketgaming')
                    .setDescription('This is the BucketBot help menu. Here you will find all available commands. The bot only works if you see it online in the member list.')
                    .setThumbnail('https://static-cdn.jtvnw.net/jtv_user_pictures/8c77fe3b-7d7d-496b-8f97-5a6ae40c3047-profile_image-70x70.png')
                    // .addFields({ name: 'Regular field title', value: 'Some value here' }, { name: '\u200B', value: '\u200B' }, { name: 'Inline field title', value: 'Some value here', inline: true }, { name: 'Inline field title', value: 'Some value here', inline: true }, )
                    .addField('Available commands:', '>help :arrow_right: Show this help menu \n \n >penis :arrow_right: Shows your penis length \n \n >callme :arrow_right: I will mention you in a message', true)
                    // .setImage('https://i.imgur.com/wSTFkRM.png')
                    .setTimestamp()
                    .setFooter('Made by BlastBucket Gaming', 'https://yt3.ggpht.com/a-/AOh14Ggq46BGHZkdlJ0-7SbxWGD9j8hzapdBQQjS_v3hQA=s100-c-k-c0xffffffff-no-rj-mo');
                message.channel.send(exampleEmbed);
            } else {
                message.channel.send("Unknown command, type >help to see the available commands")
            }
        }
    }
});


function getFirstWord(str) {
    let spaceIndex = str.indexOf(' ');
    return spaceIndex === -1 ? str : str.substr(0, spaceIndex);
};


client.login('NzUwNjY3MjM1Njg0NTE1ODcy.X093Vw.e3UuaU6Uj8dHcc7MUXvVlDc_9cU');