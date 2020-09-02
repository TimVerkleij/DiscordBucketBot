const Discord = require('discord.js');
const client = new Discord.Client();

client.on("ready", () => {
    client.user.setActivity(`Use !penis`);
    console.log("Ready!")
});


client.on('message', message => {
    var listenTo = message.content.slice(0, 6)
    var startCommand = message.content.slice(0, 1)
    if (listenTo === '!penis') {
        // send back "Pong." to the channel the message was sent in
        message.channel.send(message.member.displayName + " has a penis length of " + Math.floor(Math.random() * 10 + 1) + " inches.");
    } else if (startCommand == "!") {
        message.channel.send("the only available command right now is !penis Bucket will be adding more commands later!")
    }
});



client.login('NzUwNjY3MjM1Njg0NTE1ODcy.X093Vw.e3UuaU6Uj8dHcc7MUXvVlDc_9cU');