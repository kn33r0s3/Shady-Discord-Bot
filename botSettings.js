class Settings {
    constructor() {
        this.prefix = ";";
    }
    getCommands() {
        var getCommand = {
            modCommands: [{
                name: "kick",
                usage: this.prefix + "kick [user] -r [reason]"
            },
            {
                name: "ban",
                usage: this.prefix + "ban [user] -r [reason]"
            },
            {
                name: "purge",
                usage: this.prefix + "purge [number of messages]"
            },
            {
                name: "mute",
                usage: this.prefix + "mute [user]"
            },
            {
                name: "unmute",
                usage: this.prefix + "unmute [user]"
            },
            {
                name: "warn",
                usage: this.prefix + "warn [user] -r [reason]"
            },
            {
                name: "warns",
                usage: this.prefix + "warns [user]"
            },
            {
                name: "clear-warns",
                usage: this.prefix + "clear-warns [user]"
            }
            ],
            funCommands: [{
                name: "av",
                usage: this.prefix + "av"
            },
            {
                name: "ping",
                usage: this.prefix + "ping"
            },
            {
                name: "meme",
                usage: this.prefix + "meme"
            },
            {
                name: "nude",
                usage: this.prefix + "nude"
            },
            {
                name: "say",
                usage: this.prefix + "say"
            }
            ],
            gameCommands: [{
                name: "TicTacToe",
                usage: this.prefix + "ttt [user]"
            }],
            musicCommands: [{
                name: "play",
                usage: this.prefix + "play [songName]",
                message: "You have to be connected into voice channel"
            },
            {
                name: "queue",
                usage: this.prefix + "queue",
                message: "Bot, I mean NotABot Should be playing music"
            },
            {
                name: "skip",
                usage: this.prefix + "skip",
                message: "Skips the songs. Bot should be playing music"
            },
            {
                name: "loop",
                usage: this.prefix + "loop",
                message: "Disable/Enable loop"
            },
            {
                name: "leave",
                usage: this.prefix + "leave",
            },
            {
                name: "jump",
                usage: this.prefix + "jump [music number]"
            },
            {
                name: "Now playing",
                usage: this.prefix + "np"
            },
            {
                name: "remove",
                usage: this.prefix + "remove [music number]"
            }
            ]
        }
        return getCommand;
    }
}


module.exports = Settings;