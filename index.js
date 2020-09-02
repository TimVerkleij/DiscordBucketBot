const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});


client.on('message', message => {
    var listenTo = message.content.slice(0,6)
    console.log(listenTo)
    if (listenTo === '!penis') {
        // send back "Pong." to the channel the message was sent in
        message.channel.send(message.member.displayName + " has a penis length of " + Math.floor(Math.random()* 10 + 1) + " inches.");
    }
});

client.login('NzUwNjY3MjM1Njg0NTE1ODcy.X093Vw.e3UuaU6Uj8dHcc7MUXvVlDc_9cU');