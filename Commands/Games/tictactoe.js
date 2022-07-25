const { MessageEmbed, GuildEmoji } = require('discord.js')
var guide = require('../../getGuide')
module.exports = async function (message) {
    var player1 = message.author
    var player2 = message.mentions.users.first();
    if (player2.bot) {
        message.channel.send("Lmao, You cant play against a bot. You'll lose anyway!!");
        return;
    }
    if (!player2) {
        guide('TicTacToe', message)
    }
    if (player1.id === player2.id) {
        message.reply('You cant play with your self')
        return;
    }
    message.channel.send(`${player1} challenged ${player2} to play tictactoe against him. React to accept Challenge.`)
        .then(msg => {
            msg.react('👍');
            msg.react('👎');
            const filter = (reaction, user) => (reaction.emoji.name === '👍' || reaction.emoji.name === '👎') && user.id === player2.id;
            const collector = msg.createReactionCollector(filter, { max: 1, time: 15000 });
            collector.on('collect', r => {
                if (r.emoji.name === '👍') {
                    // accepted
                    message.channel.send('Accepted!')
                    var ttt = new TicTacToe(message, player1, player2)
                    ttt.startGame();
                    return;
                }
                if (r.emoji.name === '👎') {
                    // rejected
                    message.channel.send('Rejected!')
                    return;
                }
            });
            collector.on('end', r => {
                if (r.size === 0) {
                    message.channel.send('``No one wants to play with you``')
                    message.delete()
                }
            });
            return;
        })
        .catch(() => { })
}


class TicTacToe {
    constructor(message, player1, player2) {
        this.channel = message.channel.id;
        this.message = message;
        this.player = [player1.id, player2.id];
        this.playerTurn = 0;
        this.options = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        this.tttBoard = [
            [":one:", ":two:", ":three:"],
            [":four:", ":five:", ":six:"],
            [":seven:", ":eight:", ":nine:"]
        ]
        this.tttBoardEmbed = new MessageEmbed({
            author: "NotABot",
            title: "TicTacToe",
            color: 10038562,
            description: `${this.tttBoard[0][0]}  ${this.tttBoard[0][1]}  ${this.tttBoard[0][2]}\n ${this.tttBoard[1][0]}  ${this.tttBoard[1][1]}  ${this.tttBoard[1][2]}\n  ${this.tttBoard[2][0]}  ${this.tttBoard[2][1]}  ${this.tttBoard[2][2]}\n <@${this.player[this.playerTurn]}>\'s Turn `,
            timestamp: false

        })
        this.boardMsg;
        this._ongoing = true;
    }

    async startGame() {
        await this.message.channel.send({ embed: this.tttBoardEmbed })
            .then(async msg => this.boardMsg = await msg)
        this.playGame();
        return;
    }


    updateBoard(row, column, userInput, desc) {
        if (userInput) {
            var index = this.options.indexOf(userInput)
            this.options.splice(index, 1)
        };
        if (this.playerTurn == 0 && userInput) {
            this.tttBoard[row][column] = ":regional_indicator_x:";
            this.playerTurn = 1
        } else if (this.playerTurn == 1 && userInput) {
            this.tttBoard[+row][+column] = ":o2:"
            this.playerTurn = 0
        }
        var description = desc || `${this.tttBoard[0][0]}  ${this.tttBoard[0][1]}  ${this.tttBoard[0][2]}\n ${this.tttBoard[1][0]}  ${this.tttBoard[1][1]}  ${this.tttBoard[1][2]}\n  ${this.tttBoard[2][0]}  ${this.tttBoard[2][1]}  ${this.tttBoard[2][2]}\n <@${this.player[this.playerTurn]}>\'s Turn `
        this.tttBoardEmbed.setDescription(description)


        this.boardMsg.edit('', { embed: this.tttBoardEmbed })
            .then(async msg => this.boardMsg = await msg)
            .catch()

    }

    async playGame() {
        const filter = m => +m.content.toString() >= 1 && +m.content.toString() <= 9 && m.author.id === this.player[this.playerTurn];
        const collector = await this.message.channel.createMessageCollector(filter, { max: 1, time: 30000, errors: ['time'] });
        collector.on('collect', m => {
            var userInput = +m.content;
            m.delete();
            if (!this.options.includes(userInput)) {
                this.message.channel.send('```It is already taken```')
                    .then(msg => {
                        setTimeout(function () {
                            msg.delete()
                        }, 7000)
                    })
                    .catch()
                this.playGame();
            } else {
                switch (userInput) {
                    case 1:
                        this.updateBoard(0, 0, userInput)
                        break;
                    case 2:
                        this.updateBoard(0, 1, userInput)
                        break;
                    case 3:
                        this.updateBoard(0, 2, userInput)
                        break;
                    case 4:
                        this.updateBoard(1, 0, userInput)
                        break;
                    case 5:
                        this.updateBoard(1, 1, userInput)
                        break;
                    case 6:
                        this.updateBoard(1, 2, userInput)
                        break;
                    case 7:
                        this.updateBoard(2, 0, userInput)
                        break;
                    case 8:
                        this.updateBoard(2, 1, userInput)
                        break;
                    case 9:
                        this.updateBoard(2, 2, userInput)
                        break;
                }
                if (this.checkDraw()) {
                    this.win(undefined, "draw")
                } else if (this.checkWin()) {
                    if (this.playerTurn == 0) this.win(this.win(this.player[1]))
                    if (this.playerTurn == 1) this.win(this.win(this.player[0]))
                } else if (this._ongoing) {
                    this.playGame();
                }
            }
            collector.on('end', collected => {
                if (collected.size === 0) {
                    this.message.channel.send(`<@${this.player[this.playerTurn]}> went afk`)
                }
            })
        })
    }
    checkWin() {
        for (var i = 0; i < this.tttBoard.length; i++) {
            if (this.tttBoard[i][0] === this.tttBoard[i][1] && this.tttBoard[i][0] === this.tttBoard[i][2]) {
                // this.win(this.tttBoard[0][i])
                return true;
            }
        }

        for (var i = 0; i < this.tttBoard.length; i++) {
            if (this.tttBoard[0][i] === this.tttBoard[1][i] && this.tttBoard[0][i] === this.tttBoard[2][i]) {
                // this.win(this.tttBoard[0][i])
                return true;
            }
        }

        if ((this.tttBoard[0][0] === this.tttBoard[1][1] && this.tttBoard[1][1] === this.tttBoard[2][2]) || (this.tttBoard[0][2] === this.tttBoard[1][1] && this.tttBoard[1][1] === this.tttBoard[2][0])) {
            // this.win(this.tttBoard[1][1]);
            return true
        }

    }

    checkDraw() {
        if (this.options.length === 0) {
            // this.win("draw");
            return true;
        }
    }

    win(winner, draw) {
        if (draw) {
            this.updateBoard(undefined, undefined, undefined, "Its A Draw! Nice Game")
            this._ongoing = false;
            return;
        } else if (winner) {
            this.updateBoard(undefined, undefined, undefined, `<@${winner}> won! GGs!`)
            this._ongoing = false;
            return;
        }

    }
}