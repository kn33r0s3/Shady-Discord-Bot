const mod = require('./Commands/Moderation/mod');
const funCommands = require('./Commands/Fun/funCommands')
const games = require('./Commands/Games/games')
const playmusic = require('./Commands/Music/playmusic');
const userinfo = require('./Commands/Utility/userinfo');
const serverinfo = require('./Commands/Utility/serverinfo');
const kick = require('./Commands/Moderation/kick');


module.exports = runCommands = (commandName, message) => {
    switch (commandName.toLowerCase()) {
        case 'user-info':
        case 'u-i':
        case 'userinfo':
        case 'ui':
            const arguzz = message.content.split(' ');
            arguzz.shift();
            userinfo.userinfo(client, message, arguzz);
            break;
        case 'server-info':
        case 's-i':
        case 'serverinfo':
        case 'si':
            const arzz = message.content.split(' ');
            serverinfo.serverinfo(client, message, arzz);
            break;
        case 'kick':
            kick(message)
            break;
        case 'ban':
            mod.ban(message)
            break;
        case 'avatar':
        case 'av':
            funCommands.avatar(message)
            break;
        case 'meme':
            funCommands.meme(message)
            break;
        case 'nude':
            funCommands.nude(message)
            break;
        case 'poll':
            const argz = message.content.split(' ');
            argz.shift();
            funCommands.poll(client, message, argz);
            break;
        case 'choose':
            const argzz = message.content.split(' ');
            argzz.shift();
            var argzzz = argzz.join(' ');
            funCommands.choose(message, argzzz);
            break;
        case 'roast':
            const argus = message.content.split(' ');
            funCommands.roast(client, message, argus);
            break;
        case 'youtube':
        case 'yt':
            const argsz = message.content.split(' ');
            argsz.shift();
            const keywordd = argsz.join(' ');
            funCommands.youtube(message, keywordd);
            break;
        case 'spotify':
            funCommands.spotify(message);
            break;
        case 'corona':
        case 'covid':
        case 'cases':
            const blargs = message.content.split(' ');
            funCommands.corona(message, blargs);
            break;
        case 'mute':
            mod.mute(message)
            break;
        case 'unmute':
            mod.unmute(message);
            break;
        case 'purge':
            mod.purge(message);
            break;
        case 'ping':
            funCommands.ping(message);
            break;
        case 'help':
            funCommands.help(message);
            break;
        case 'warn':
            mod.warn(message);
            break;
        case 'warns':
            mod.warns(message);
            break;
        case 'clear-warns':
            mod.clearWarns(message);
            break;
        // * Games
        case 'ttt':
        case 'tictactoe':
            games.tictactoe(message);
            break;
        case 'say':
            async function say() {
                if (message.content.includes("@everyone") || message.content.includes("@here")) {
                    message.channel.send("No, i ain't committing mass ping. scary shit!");
                    return;
                }
                var text = await message.content.toString().split(prefix + 'say ')[1]
                message.delete()
                message.channel.send(text);
            }
            say();
            break;
        case "urban":
            funCommands.urban(message);
            break;
        case 'play':
        case 'p':
            if (!message.member.voice.channel) {
                message.channel.send('Join a VC first!!');
                return;
            } else {
                if (message.guild.me.voice.channel) {
                    if (message.guild.voice.channelID === message.member.voice.channelID) {
                        const args = message.content.split(' ');
                        args.shift();
                        const keyword = args.join(' ');
                        playmusic.play(client, message, keyword);
                    } else {
                        message.channel.send("I'm already being used in a different voice channel!");
                        return;
                    }
                } else if (!message.guild.me.voice.channel) {
                    const args = message.content.split(' ');
                    args.shift();
                    const keyword = args.join(' ');
                    playmusic.play(client, message, keyword);
                } else {
                    message.channel.send("error!! contact the bot owner and report this bug lol, he noob af!");
                    return;
                }
            }
            break;
        case 'queue':
        case 'q':
            playmusic.queue(message);
            break;
        case 'skip':
        case 's':
        case 'next':
        case 'n':
            if (!message.member.voice.channel) {
                message.channel.send('Join a VC first!!');
                return;
            } else {
                if (message.guild.me.voice.channel) {
                    if (message.guild.voice.channelID === message.member.voice.channelID) {
                        playmusic.skip(message);
                        return;
                    } else {
                        message.channel.send("Can't skip! We do not share the same voice channel.");
                        return;
                    }
                } else {
                    message.channel.send("I'm not connected to any voice channel :( ")
                }
            }
            break;
        case 'loop':
            if (!message.member.voice.channel) {
                message.channel.send('Join a VC first!!');
                return;
            } else {
                if (message.guild.me.voice.channel) {
                    if (message.guild.voice.channelID === message.member.voice.channelID) {
                        playmusic.loop(message);
                        return;
                    } else {
                        message.channel.send("We do not share the same voice channel!");
                        return;
                    }
                } else {
                    message.channel.send("I'm not connected to any voice channel :( ")
                }
            }
            break;
        case 'leave':
        case 'die':
        case 'kys':
        case 'disconnect':
        case 'fuckoff':
        case 'dc':
            if (!message.member.voice.channel) {
                message.channel.send('Join a VC first!!');
                return;
            } else {
                if (message.guild.me.voice.channel) {
                    if (message.guild.voice.channelID === message.member.voice.channelID) {
                        playmusic.leave(message);
                        return;
                    } else {
                        message.channel.send("We do not share the same voice channel!");
                        return;
                    }
                } else {
                    message.channel.send("I'm not connected to any voice channel :( ")
                }
            }
            break;
        case 'np':
            playmusic.nowPlaying(message);
            break;
        case 'jump':
            if (!message.member.voice.channel) {
                message.channel.send('Join a VC first!!');
                return;
            } else {
                if (message.guild.me.voice.channel) {
                    if (message.guild.voice.channelID === message.member.voice.channelID) {
                        playmusic.jump(message);
                        return;
                    } else {
                        message.channel.send("We do not share the same voice channel!");
                        return;
                    }
                } else {
                    message.channel.send("I'm not connected to any voice channel :( ")
                }
            }
            break;
        case 'pause':
            if (!message.member.voice.channel) {
                message.channel.send('Join a VC first!!');
                return;
            } else {
                if (message.guild.me.voice.channel) {
                    if (message.guild.voice.channelID === message.member.voice.channelID) {
                        playmusic.pause(message);
                        return;
                    } else {
                        message.channel.send("We do not share the same voice channel!");
                        return;
                    }
                } else {
                    message.channel.send("I'm not connected to any voice channel :( ")
                }
            }
            break;
        case 'resume':
            if (!message.member.voice.channel) {
                message.channel.send('Join a VC first!!');
                return;
            } else {
                if (message.guild.me.voice.channel) {
                    if (message.guild.voice.channelID === message.member.voice.channelID) {
                        playmusic.resume(message);
                        return;
                    } else {
                        message.channel.send("We do not share the same voice channel!");
                        return;
                    }
                } else {
                    message.channel.send("I'm not connected to any voice channel :( ")
                }
            }
            break;
        case 'remove':
            if (!message.member.voice.channel) {
                message.channel.send('Join a VC first!!');
                return;
            } else {
                if (message.guild.me.voice.channel) {
                    if (message.guild.voice.channelID === message.member.voice.channelID) {
                        playmusic.remove(message);
                        return;
                    } else {
                        message.channel.send("We do not share the same voice channel!");
                        return;
                    }
                } else {
                    message.channel.send("I'm not connected to any voice channel :( ")
                }
            }
            break;
        case 'invite':
            var userInvite = message.mentions.users.first();
            var invites = "Invite me to your server \n https://discord.com/oauth2/authorize?client_id=809445864291565578&scope=bot&permissions=8589934591 \n Also, Join our official server UwU \n discord.gg/neptards";
            if (!userInvite) {
                message.author.send(invites)
                    .then(() => {
                        message.channel
                            .send(`Successfully invited ${message.author}.`)
                            .then((msg) => {
                                setTimeout(function () {
                                    msg.delete();
                                }, 7000);
                            })
                    })
                    .catch(() => {
                        message.channel.send("I cannot invite you");
                    });
                return;
            }
            userInvite
                .send(invites)
                .then(() => {
                    message.channel
                        .send(`Successfully invited ${userInvite}\`\`.`)
                        .then((msg) => {
                            setTimeout(function () {
                                msg.delete();
                            }, 7000);
                        })
                })
                .catch((error) => {
                    message.channel.send("I cannot invite this user.");
                });

            break;
        default:
            console.log();
            break;
    }
}