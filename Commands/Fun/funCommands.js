const Settings = require('../../botSettings')
const { MessageEmbed } = require('discord.js')
const { YouTube } = require('popyt');
const convert = require("parse-ms");
const fetch = require('node-fetch');
var setting = new Settings()
var prefix = setting.prefix;
const randomColor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });

const ud = require('urban-dictionary');

module.exports = {
    avatar: function (message) {
        var user = message.mentions.users.first();

        if (user) {
            const avatarAuthor = new MessageEmbed({
                color: randomColor,
                author: {
                    name: user.username,
                    icon_url: user.displayAvatarURL(),
                },
                title: 'Avatar',
                image: {
                    url: user.displayAvatarURL({ dynamic: true, size: 256 }),
                }
            })
            message.channel.send(avatarAuthor);
        } else {
            const avembed = new MessageEmbed({
                color: randomColor,
                author: {
                    name: message.author.username,
                    icon_url: message.author.displayAvatarURL(),
                },
                title: 'Avatar',
                image: {
                    url: message.author.displayAvatarURL({ dynamic: true, size: 256 }),
                }
            })
            message.channel.send(avembed);
        }
    },
    meme: async function (message) {
        const { getRandomMeme } = require("@blad3mak3r/reddit-memes");
        var data = await getRandomMeme()
        message.channel.send(`${data.image}`)
    },
    ping: async function (message) {
        var ping = await (
            message.reply("Checking for Ping...").then((m) => {
                m.edit(
                    "Punggg: ``" +

                    `${m.createdTimestamp - message.createdTimestamp}` +
                    " ms``"
                );
            })
        );
        return ping;
    },
    nude: async function (message) {
        const { getRandomMeme } = require("@blad3mak3r/reddit-memes");
        if (!message.channel.nsfw) {
            message.channel.send('This is not NSFW Channel')
                .then((msg) => {
                    setTimeout(function () {
                        msg.delete();
                    }, 5000);
                })
                .catch();
            return;
        }
        var subreddits = ['horny', 'skinnytail', 'nudes', 'hotgirlsnsfw', 'nudesfeed', 'nsfwcosplay', 'tittydrop', '60fpsporn', 'legalteens', 'cumsluts', 'holdthemoan', 'PetiteGoneWild', 'GirlsFinishingTheJob']
        var randomSubreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
        var data = await getRandomMeme(randomSubreddit)
        message.channel.send(`${data.image}`)
    },
    help: function (message) {
        const headerTmp = "\n**【ＮｏｔＡＢｏｔ　ＵＳＡＧＥ　ＧＵＩＤＥ】**\n"
        const prefixLine = "``мy preғιх: " + prefix + "\n``"
        var linesARR = [];
        var commands = Object.entries(setting.getCommands())

        commands.forEach((entry) => {
            var lines = [];
            entry[1].forEach((commands) => {
                lines.push(`\`\`\`coммand naмe: ${commands.name}\nυѕage::${commands.usage}\`\`\``)
            })
            linesARR.push(lines.join('\n'))
        })

        // for (const [key, value] of Object.entries()) {
        //   console.log(`${key}: ${value}`);
        // }

        var mainMessage = linesARR.join('\n')
        var embed = new MessageEmbed()
            .setColor(10038562)
            .setAuthor('NotABot')
            .setTitle(headerTmp)
            .setDescription(prefixLine)
            .addFields({ name: "commands", value: mainMessage })
        message.channel.send(embed)
            .then(msg => {
                msg.react('❌')
                const filter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id
                msg.awaitReactions(filter, { max: 1 })
                    .then(collected => {
                        msg.delete();
                    })
            })
    },
    urban: async function (message) {
        const args = message.content.split(' ');
        args.shift();
        const term = args.join(' ');
        if (!term) {
            message.channel.send('Enter term that you want to search');
            return;
        }
        ud.term(term, (err, entry, tags, sounds) => {
            try {
                const resultEmbed = new MessageEmbed({
                    color: 10038562,
                    title: 'Definition of ' + entry[0].word,
                    url: entry[0].permalink,
                    description: entry[0].definition,
                    fields: [{
                        name: '**Example**',
                        value: entry[0].example
                    },
                    {
                        name: "👍",
                        value: entry[0].thumbs_up,
                        inline: true
                    },
                    {
                        name: "👎",
                        value: entry[0].thumbs_down,
                        inline: true
                    }
                    ],
                    footer: {
                        "text": "Sent by " + entry[0].author
                    }
                });
                message.channel.send(resultEmbed);
                return;


            }
            catch (err) {
                const errorEmbed = new MessageEmbed({
                    color: 10038562,
                    description: "Error! Nothing Found"
                })
                message.channel.send(errorEmbed);
                return;
            }

        })
    },
    poll: async function (client, message, argus) {
        if (!message.guild.member(client.user).hasPermission('ADD_REACTIONS')) return message.reply('Sorry, i do not have the perms.:x:')
        const sayMessage = argus.join(" ");
        if (sayMessage.length < 1) return message.channel.send("Pls provide an argument for the poll.")
        if (message.member.hasPermission("KICK_MEMBERS")) {
            const embeed = new MessageEmbed()
                .setColor(10038562)
                .setTitle("PoLL")
                .setDescription(` A poll has begun: \n\n"**${sayMessage}**"\n\nVote Now!`)
            message.channel.send(embeed).then(m => {
                m.react('✅');
                m.react('❌');
            })
        }
    },
    choose: async function (message, argzzz) {
        try {
            args2 = argzzz.split(",");
            argLength = args2.length;
            argNum = Math.floor(Math.random() * argLength);
            args3 = args2[argNum];

            const embbed = new MessageEmbed()
                .setColor(10038562)
                .setTitle(args3);
            message.channel.send(embbed);
        }
        catch (err) {
            console.log(err);
            const embed = new MessageEmbed()
                .setColor(10038562)
                .setTitle("Error")
                .setDescription("Check your syntax and try again!!");
            message.channel.send(embed);
        }
    }, roast: async (client, message, args) => {
        let user = message.mentions.users.first();
        if (message.mentions.users === message.author.username) return message.reply('You can not roast yourself');
        if (message.mentions.users.size < 1) return message.reply('You must mention someone to roast them.')
        var roast = require('../../roasts');
        const roasts = roast[Math.floor(Math.random() * roast.length)];
        const embed = new MessageEmbed()
            .setColor(10038562)
            .setDescription(user.username + ", " + roasts);
        message.channel.send({ embed })
    },
    youtube: async function (message, keyword) {
        try {
            const youTube = new YouTube(process.env.API_XD);
            const video = await youTube.getVideo(keyword);
            message.channel.send(video.url);
        }
        catch (err) {
            console.log(err);
            message.channel.send("``No appropirate search results!``")
        }
    },
    spotify: async function (message) {
        const user = message.mentions.members.first() || message.member;

        let status;
        if (user.presence.activities.length === 1) status = user.presence.activities[0];
        else if (user.presence.activities.length > 1) status = user.presence.activities[1];

        if (user.presence.activities.length === 0 || status.name !== "Spotify" && status.type !== "LISTENING") {
            return message.channel.send("This user isn't listening to Spotify.");
        }

        if (status !== null && status.type === "LISTENING" && status.name === "Spotify" && status.assets !== null) {
            let image = `https://i.scdn.co/image/${status.assets.largeImage.slice(8)}`,
                url = `https://open.spotify.com/track/${status.syncID}/`,
                name = status.details,
                artist = status.state,
                album = status.assets.largeText,
                timeStart = status.timestamps.start,
                timeEnd = status.timestamps.end,
                timeConvert = convert(timeEnd - timeStart);

            let minutes = timeConvert.minutes < 10 ? `0${timeConvert.minutes}` : timeConvert.minutes;
            let seconds = timeConvert.seconds < 10 ? `0${timeConvert.seconds}` : timeConvert.seconds;
            let time = `${minutes}:${seconds}`;
            const theText = `${artist} - ${name}`;
            const embed = new MessageEmbed()
                .setAuthor("Spotify Track Information", user.user.displayAvatarURL())
                .setColor(0x1ED768)
                .setThumbnail(image)
                .addField("Name:", name, true)
                .addField("Album:", album, true)
                .addField("Artist:", artist, true)
                .addField("Duration:", time, false)
                .addField("Listen now on Spotify!", `[${theText}](${url})`);
            message.channel.send(embed);
        }
    }, corona: async function (message, args) {
        let countries = args[1] // Your/someone countries prefix.

        fetch(`https://corona.lmao.ninja/v2/countries/${countries}`)
            .then(res => res.json())
            .then(data => {
                let country = data.country;
                let flag = data.countryInfo.flag; // Turns out -> Link.
                let confirmed = data.cases.toLocaleString();
                let todayconfirmed = data.todayCases.toLocaleString();
                let deaths = data.deaths.toLocaleString();
                let todaydeaths = data.todayDeaths.toLocaleString();
                let recovered = data.recovered.toLocaleString();
                let critical = data.critical.toLocaleString();
                let active = data.active.toLocaleString();
                // Add .toLocaleString() if you wanna separate 3 numbers with commas.

                const embed = new MessageEmbed()
                    .setColor(randomColor)
                    .setTimestamp(new Date())
                    .setAuthor("CoronaVirus Statistics", flag)
                    .addField(`Data for: ${country}`, `Confirmed: (Total: **${confirmed}** | Daily: **${todayconfirmed}**) \nDeaths: (Total: **${deaths}** | Daily: **${todaydeaths}**) \nRecovered: **${recovered}** \nCritical: **${critical}** \nActive: **${data.active}**`);

                message.channel.send(embed);
                // Let's test it out!
            })
    }

};