const ytdl = require('ytdl-core');

let queue = []

module.exports = { 
    
    // connects to a voice channel and plays a requested song
    async play(voiceChannel, song, message) { // has to be url even though this is a bad check...
        if (!/https?:\/\/(www\.)?youtu\.?be/i.test(song)) 
            return message.channel.send("You did not provide a (valid) link. Grow some brains and give me something to play.");
        

        const stream = ytdl(song, {
            filter: 'audioonly',
            highWaterMark: 1 << 25
        });

        if (! stream) 
            return message.channel.send("Video not found. Better luck next time");
        
        queue.push(stream)

        if(queue.length === 1) {
            await playNextSong(voiceChannel, message)
        }
        },


    stopMusic(voiceChannel) {
        voiceChannel.leave()
    }
}

async function playNextSong(voiceChannel, message) {
    try {
        const connection = await voiceChannel.join()
        const dispatcher = connection.play(queue[0])
        dispatcher.on('finish', () => {
            queue.shift()

            if(queue.length < 1) {
                return voiceChannel.leave()
            }

            playNextSong(voiceChannel, message)
        })
    } catch {
        message.channel.send("Could not connect to your voice channel. Do I have the right permissions? Or are you just being a dick? :frowning: \n Consider asking a moderator to give me permissions :wink:");
    }
}