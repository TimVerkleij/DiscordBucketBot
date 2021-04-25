module.exports = { 
    
    // Whenever a mention is expected, this function will fetch all the user's data using their Discord ID
    getUserDataFromMention(mention) {
        if (mention.startsWith('<@') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);

            if (mention.startsWith('!')) {
                mention = mention.slice(1);
            }

            return mention;
        }
    }
}
