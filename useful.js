client.on("ready", () => {


    client.user.setActivity('>help', { type: "LISTENING" });


    client.channels.cache.toJSON().forEach(addChannels); //?add all text channels to array
    channelArray.forEach(onlineMessage) //?send message to all channels


    console.log(client.channels.cache.toJSON()[3]); //?show 4th channel


    play(client.channels.cache.get('296366910923210772'))//?connect to voice channel

    console.log("Ready!")
});

//?add all text channels to array
function addChannels(value) {
    let channelId = value.id
    // console.log(value.guild)
    if (!channelArray.includes(channelId) && value.type === "text") {
        channelArray.push(channelId);
    }
    
}

//?send message to all channels
function onlineMessage(value){
    const channel = client.channels.cache.get(value);

    // !! channel.send('BucketBot is online!');
}

//connect to voice channel
async function play(voiceChannel) {
	const connection = await voiceChannel.join(); //?connect
	// connection.play('nyan-cat-original.mp3'); //?play music
}