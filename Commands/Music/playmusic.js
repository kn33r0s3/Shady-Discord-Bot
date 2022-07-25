const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const { YouTube } = require('popyt');

var map = {};

const guild = require('../../getGuide');
module.exports = {
    play: async function (client, message, keyword) {
        if (!message.member.voice.channel) {
            message.channel.send('Join a VC first!!');
            return;
        }
        if (!keyword) {
            guild('play', message)
            return;
        }
        const youTube = new YouTube(process.env.YT_API);
        const video = await youTube.getVideo(keyword);
        try {
            if (video.liveStatus) {
                var tslol = 'LIVE';
            } else {
                tslol = `${video.minutes}:${video.seconds}`;
            }
            const music = {
                title: video.title,
                timestamp: tslol,
                url: video.url,
                image: video.thumbnails.maxres || video.thumbnails.high || video.thumbnails.medium || video.thumbnails.default,
            }
            if (map[message.guild.id] == undefined) {
                map[message.guild.id] = new Music(client, message, music);
            } else {
                map[message.guild.id].message = message;
                map[message.guild.id].addSong(music);
            }
        }
        catch (err) {
            message.channel.send(err);
        }


    },
    queue: function (message) {
        if (map[message.guild.id] === undefined) {
            guild('queue', message);
            return;
        }
        map[message.guild.id].message = message;
        map[message.guild.id].queue();
    },
    skip: function (message) {
        if (map[message.guild.id] === undefined) {
            guild('skip', message);
            return;
        }
        map[message.guild.id].message = message;
        map[message.guild.id].skip();
    },
    loop: function (message) {
        if (map[message.guild.id] === undefined) {
            guild('loop', message);
            return;
        }
        map[message.guild.id].loop = !map[message.guild.id].loop
        map[message.guild.id].message = message;
        if (map[message.guild.id].loop) {

            message.channel.send("Loop Enabled")
        } else {
            message.channel.send("Loop Disabled")
        }
    },
    leave: function (message) {
        if (map[message.guild.id] === undefined) {
            guild('leave', message);
            return;
        } else {
            map[message.guild.id].message = message;
            map[message.guild.id].leave();
        }
    },
    nowPlaying: function (message) {
        if (map[message.guild.id] === undefined) {
            guild('Now playing', message);
            return;
        } else {
            map[message.guild.id].message = message;
            map[message.guild.id].np();
        }
    },
    jump: function (message) {
        const id = message.content.split(' ')[1];
        if (!id) {
            message.channel.send('Enter number dumb!');
            return;
        }
        if (map[message.guild.id] === undefined) {
            guild('jump', message);
            return;
        }
        map[message.guild.id].jumpSongs(+id);
    },
    pause: function (message) {
        if (map[message.guild.id] === undefined) {
            message.channel.send('Try joining vc and try /play [url / keyword]');
            return;
        } else {
            map[message.guild.id].message = message;
            map[message.guild.id].pause();
        }
    },
    resume: function (message) {
        if (map[message.guild.id] === undefined) {
            message.channel.send('Try joining vc and try /play [url / keyword]');
            return;
        } else {
            map[message.guild.id].message = message;
            map[message.guild.id].resume();
        }
    },
    remove: function (message) {
        if (map[message.guild.id] === undefined) {
            message.channel.send('Try joining vc and try /play [url / keyword]');
            return;
        } else {
            map[message.guild.id].message = message;
            var id = +message.content.split(' ')[1];
            if (typeof id != "number") {
                message.channel.send('``Enter number``');
                return
            }
            map[message.guild.id].remove(id - 1);
        }
    }

}


class Music {
    constructor(client, message, music) {
        this.message = message;
        this.client = client;

        this.music = music;
        this.urls = [];
        this.musicHolds = [];

        this.vc = message.member.voice.channel;

        this.nowPlaying = true;
        this.loop = false;
        this.paused = false;

        this.nowPlayingMsg;

        this.init();

    }
    async init() {
        if (!this.vc) {
            this.message.channel.send('Connect to a voice channel first.. smh!');
            return;
        }
        if (!this.music.url) {
            this.message.channel.send('Provide a URL bruh!!');
            return;
        }
        if (this.message.author.voiceChannel) {
            this.message.channel.send(`I'm already in a voice channel lol.`);
            return;
        }
        await this.addSong(this.music);
        await this.play();
    }

    async play() {
        let connection = await this.vc.join();
        console.log("connection to vc done");
        let dispatcher = connection.play(ytdl(this.urls[0], { filter: "audioonly" }));
        console.log("dispatcher is ready")
        await this.np();
        await dispatcher.on('finish', () => {
            this.urls.shift();
            this.nowPlayingMsg.delete();
            this.nowPlayingMsg;
            if (this.urls.length === 0 && !this.loop) {
                this.leave('Not playin any songs, left the vc :(');
            }
            else if (this.loop && this.urls.length === 0) {
                this.urls = [];
                this.musicHolds.forEach(music => {
                    this.urls.push(music.url);
                })
                this.play();
            } else {
                this.play();
            }
        })
    }

    async addSong(music) {
        if (!this.checkUrl(music.url)) {
            this.message.channel.send('Not valid URL BRUH...');
            return;
        }
        if (this.urls.length != 0) {
            this.message.channel.send(`**Queued**\`\`${music.title}\`\``)
        }
        this.urls.push(music.url);
        music.requestedBy = this.message.author;
        this.musicHolds.push(music);
    }

    skip(m) {
        m = m || "Skipped!!";
        if (this.urls[1]) {
            this.urls.shift()
            this.play();
            this.message.channel.send(m);
        } else if (!this.urls[1]) {
            this.leave(m = "Skipped!! Queue is empty. I have left the voice channel!");
        } else if (!this.loop) {
            this.leave(m = "Skipped!! Queue is empty. I have left the voice channel!");
        } else {
            this.urls = [];
            this.musicHolds.forEach(music => {
                this.urls.push(music.url);
            })
            this.play();
        }
    }

    prev() {
        if (this.musicHolds.length <= 1) {
            this.message.channel.send('I am unable to play previous song.');
        } else {
            var currentSong = this.getSongsInfo(this.urls[0]);
            var currentSongIndex = this.musicHolds.indexOf(currentSong);
            var prevSongUrl = this.musicHolds[currentSongIndex - 1].url;
            this.urls.unshift(prevSongUrl);
            this.play();
        }
    }

    async queue() {
        var currentPage = 1;
        var noOfContent = 5;

        try {
            this.message.channel.send(this.getQueuePages(currentPage, noOfContent))
                .then(async (msg) => {
                    msg.react('⏮');
                    msg.react('⏭️');
                    this.nowPlayingMsg = msg;
                    const filter = (reaction, user) => (reaction.emoji.name === '⏭️' || reaction.emoji.name === '⏸️' || reaction.emoji.name === '▶️' || reaction.emoji.name === '⏮') && this.message.guild.member(user).voice.channel === this.message.guild.member(this.client.user).voice.channel && user.id != process.env.CLIENT_ID
                    const collector = msg.createReactionCollector(filter, { time: 120000 });
                    collector.on('collect', r => {
                        switch (r.emoji.name) {
                            case '⏭️':
                                // Next page
                                var totalPage = Math.floor(this.musicHolds.length / noOfContent);
                                if (totalPage != this.musicHolds.length / noOfContent) {
                                    totalPage++;
                                }
                                if (currentPage >= totalPage) {
                                    this.message.channel.send('Cannot go to next page').then(m => {
                                        setTimeout(function () {
                                            m.delete();
                                        }, 5000)
                                    })
                                    break;
                                }
                                this.client.messageReactionRemoveAll(msg);
                                currentPage++;
                                msg.edit('', this.getQueuePages(currentPage, noOfContent));
                                break;
                            case '⏮':
                                // Previous
                                if (currentPage === 1) {
                                    this.message.channel.send('Cannot go to previous page').then(m => {
                                        setTimeout(function () {
                                            m.delete();
                                        }, 5000)
                                    })
                                    break;
                                }
                                this.client.messageReactionRemoveAll(msg);
                                currentPage--;
                                msg.edit('', this.getQueuePages(currentPage, noOfContent));
                                break;
                        }
                    })
                    collector.on('end', r => { })

                })

        }
        // Listening for the emoji Removed
        catch (err) {
            this.message.channel.send(err);
        }


    }

    async np() { // nowPlaying
        if (!this.nowPlaying) {
            return;
        }
        var currentSong = this.getSongsInfo(this.urls[0]);
        var title;
        this.paused ? title = "Paused" : title = "Currently Playing";

        const embed = new Discord.MessageEmbed({
            author: {
                name: title,
                icon_url: this.client.user.displayAvatarURL(),
            },
            thumbnail: {
                url: currentSong.image.url
            },
            color: 10038562,
            title: `**${currentSong.title}**`,
            description: `${currentSong.timestamp}`,
            footer: {
                text: `Requested by ${currentSong.requestedBy.username}`,
                icon_url: currentSong.requestedBy.displayAvatarURL()
            }
        })

        this.message.channel.send(embed)
            .then(async (msg) => {
                msg.react('⏮');
                if (this.paused) {
                    msg.react('▶️');
                } else {
                    msg.react('⏸️');
                }
                msg.react('⏭️');
                this.nowPlayingMsg = msg;
                const filter = (reaction, user) => (reaction.emoji.name === '⏭️' || reaction.emoji.name === '⏸️' || reaction.emoji.name === '▶️' || reaction.emoji.name === '⏮') && this.message.guild.member(user).voice.channel === this.message.guild.member(this.client.user).voice.channel && user.id != process.env.CLIENT_ID
                const collector = msg.createReactionCollector(filter, { max: 1, time: 120000 });
                collector.on('collect', r => {
                    switch (r.emoji.name) {
                        case '⏭️':
                            // Next
                            this.skip();
                            break;
                        case '⏸️':
                            //Pause
                            this.pause()
                            msg.delete();
                            this.np();
                            break;
                        case '▶️':
                            //Resume
                            this.resume();
                            msg.delete();
                            this.np()
                            break;
                        case '⏮':
                            // Previous
                            this.prev();
                            break;
                    }
                })
                collector.on('end', r => { })

            })
            .catch((e) => this.message.channel.send(e));
    }

    async jumpSongs(id) {
        if (id - 1 >= this.musicHolds.length || id < 0 || typeof id != 'number') {
            this.message.channel.send('``Not a valid number, Can\'t remove!``');
            return;
        }
        this.urls = [];
        this.musicHolds.forEach(music => {
            this.urls.push(music.url);
        });
        this.urls = this.urls.slice(id - 1);
        this.play();
    }



    async checkUrl(url) {
        return await ytdl.validateURL(url);
    }

    getQueuePages(page, noOfContent) {
        var temptext = '';
        var totalPage = Math.floor(this.musicHolds.length / noOfContent);
        if (totalPage != this.musicHolds.length / noOfContent) {
            totalPage++;
        }
        var start = page * noOfContent - noOfContent;
        var end = page * noOfContent;
        if (end > this.musicHolds.length) end = this.musicHolds.length;

        for (var i = start; i < end; i++) {
            temptext += (`[${i + 1}] ${this.musicHolds[i].title} | | Added By ${this.musicHolds[i].requestedBy.username} \n \n`)
        }

        const embed = new Discord.MessageEmbed({
            author: {
                icon_url: this.client.user.displayAvatarURL(),
                name: `Page ${page}/${totalPage}`
            },
            color: 10038562,
            title: "Queue",
            description: temptext,
            footer: {
                "text": this.client.user.username
            }
        })

        return embed;
    }

    getSongsInfo(url) {
        return this.musicHolds.find(music => music.url === url)
    }
    async pause() {
        this.paused = true;
        let connection = await this.vc.join();
        connection.dispatcher.pause();
    }
    async resume() {
        this.paused = false;
        let connection = await this.vc.join();
        connection.dispatcher.resume();
    }

    async leave(m) {
        map[this.message.guild.id] = undefined;
        if (!this.musicHolds[0]) {
            this.vc.leave();
            this.nowPlayingMsg.delete();
            this.message.channel.send(m || 'Queue is empty. Left the voice channel!!');
            return;
        } else {
            this.vc.leave();
            this.nowPlayingMsg.delete();
            this.message.channel.send(m || "Left the voice channel!!");
            return;
        }
    }

    remove(id) {
        if (id >= this.musicHolds.length || id < 0 || typeof id != 'number') {
            this.message.channel.send('``Not a valid number, Can\'t remove!``');
            return;
        }
        if (this.musicHolds[id].url === this.urls[0]) {
            this.skip("Removed!!");
            this.urls.splice(id, 1);
            this.musicHolds.splice(id, 1);
            return;
        }
        this.urls.splice(id, 1);
        this.musicHolds.splice(id, 1);
        this.message.channel.send("Removed from queue");
        return;
    }
}
