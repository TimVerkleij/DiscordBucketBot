const Discord = require('discord.js');

module.exports = { 
    startTTT(message, array, mainUser, mentionedUser) {
        nextMove(message, array, mainUser, mentionedUser)
    }
}

// This recursive function handles most of the Tic Tac Toe game
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

        // Checks if the chosen spot on the board is empty
        if (array[letter][number] === ":black_large_square:") { // Check who's turn it is.
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