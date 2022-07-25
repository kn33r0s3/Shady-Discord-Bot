const Discord = require('discord.js')

var perms = require('../../getPerms')
var guide = require('../../getGuide')
// const Settings = require('../../botSettings')
// var setting = new Settings()
// var prefix = setting.prefix;


module.exports = {

    ban: function (message) {
        if (!perms.returnPermissionObject(message).banMembers) {
            message.channel.send("``Missing permissions!!``");
            return;
        }
        var user = message.mentions.users.first();
        var reason;
        try {
            reason = message.content.toString().split("-r ")[1];
        } catch {
            reason = "Kicked without any reasons!!";
        }
        if (user) {
            const member = message.guild.member(user);
            if (member) {
                member
                    .ban({
                        reason,
                    })
                    .then(() => {
                        message.channel.send(
                            `Successfully banned ${user.tag} Reason: ${reason}`
                        );
                    })
                    .catch((err) => {
                        message.channel.send("I was unable to ban the member.");
                        console.error(err);
                    });
            } else {
                message.channel.send("That user isn't in this server!");
            }
        } else {
            guide("ban", message);
            return;
        }
    },
    mute: async function (message) {
        if (!perms.returnPermissionObject(message).manageRoles) {
            message.channel.send("``Missing permissions.``");
            return;
        }
        var user = message.mentions.users.first();
        if (!user) {
            guide("mute", message);
            return;
        }
        var mutedRoleId;
        var role = message.guild.roles.cache.find((role) => role.name === "MuTeD");
        if (!role) {
            await message.guild.roles
                .create({
                    data: {
                        name: "MuTeD",
                    },
                })
                .then()
                .catch(() => {
                    message.channel.send("I dont have permission to mute.");
                });

            role = await message.guild.roles.cache.find(
                (role) => role.name === "MuTeD"
            );
            mutedRoleId = role.id;
            message.guild.channels.cache.forEach((channel) => {
                if (channel.type === "text") {
                    channel.createOverwrite(mutedRoleId, {
                        SEND_MESSAGES: false,
                    });
                }
            });
        } else {
            mutedRoleId = await role.id;
        }
        //

        const member = message.guild.member(user);

        if (member._roles.includes(mutedRoleId)) {
            message.channel.send("``user is already muted.``");
            return;
        }
        var discord = require("discord.js");
        var guild = new discord.GuildMemberRoleManager(member);
        guild
            .add([mutedRoleId])
            .then(() => {
                message.channel.send(`Sucessfully muted ${user}.`);
            })
            .catch(() => {
                message.channel.send("``Cannot mute this guy.``");
            });
    },
    unmute: async function (message) {
        if (!perms.returnPermissionObject(message).manageRoles) {
            message.channel.send("``Missing permissions!!``");
            return;
        }
        var mutedRoleId = await message.guild.roles.cache.find(
            (role) => role.name === "MuTeD"
        ).id;
        var user = message.mentions.users.first();
        if (!user) {
            guide("unmute", message);
            return;
        }
        const member = message.guild.member(user);

        if (!member._roles.includes(mutedRoleId)) {
            message.channel.send("``user is not muted lol.``");
            return;
        }

        var discord = require("discord.js");
        var guild = new discord.GuildMemberRoleManager(member);
        guild
            .remove([mutedRoleId])
            .then(() => {
                message.channel.send(`Sucessfully unmuted ${user}.`);
            })
            .catch(() => { });
    },
    purge: function (message) {
        if (!perms.returnPermissionObject(message).manageMessages) {
            message.channel.send("``Missing permissions``");
            return;
        }
        try {
            number = +message.content.toString().split(" ")[1];
        } catch {
            guide("purge", message);
        }
        if (number > 100) number = 100;
        message.channel
            .bulkDelete(number)
            .then((messages) => {
                message.channel
                    .send(`I have deleted ${messages.size} messages`)
                    .then((msg) => {
                        setTimeout(function () {
                            msg.delete();
                        }, 3000);
                    })
                    .catch();
            })
            .catch(() => {
                message.channel
                    .send("``I can't delete messages more than 100. (sad times :( ))")
                    .then((msg) => {
                        setTimeout(function () {
                            msg.delete();
                        }, 3000);
                    })
                    .catch();
            });
    },
    warn: function (message) {
        const date = new Date();
        const fs = require("fs");
        if (!perms.returnPermissionObject(message).isAdmin) {
            message.channel
                .send("``You cannot warn, noob!!``")
                .then((msg) => {
                    setTimeout(function () {
                        msg.delete();
                    }, 3000);
                })
                .catch();
            return;
        }

        var user = message.mentions.users.first();
        if (!user) {
            guide("warn", message);
            return;
        }
        try {
            reason = message.content.toString().split("-r ")[1];
        } catch {
            guide("warn", message);
            return;
        }

        user
            .send(
                message.member.displayName +
                " warned you\n." +
                " ``Reason: " +
                reason +
                "``"
            )
            .then(() => {
                message.channel
                    .send(`Successfully warned ${user}\n \`\`Reason:${reason}\`\`.`)
                    .then((msg) => {
                        setTimeout(function () {
                            msg.delete();
                        }, 7000);
                    })
                    .catch();
            })
            .catch(() => {
                message.channel.send("I cannot warn this user.");
            });

        var warnsJSON = fs.readFileSync("warns.json", {
            encoding: "utf8",
        });
        warnsJSON = JSON.parse(warnsJSON);
        if (!warnsJSON[message.guild.id]) {
            warnsJSON[message.guild.id] = {};
        }
        if (!warnsJSON[message.guild.id][user.toString()]) {
            warnsJSON[message.guild.id][user.toString()] = [];
        }
        if (warnsJSON[message.guild.id][user.toString()]) {
            warnsJSON[message.guild.id][user.toString()].push({
                reason,
                author: message.member.displayName,
                date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
            });
        }

        fs.writeFileSync("./warns.json", JSON.stringify(warnsJSON), {
            encoding: "utf8",
        });
    },
    warns: function (message) {
        if (!perms.returnPermissionObject(message).isAdmin) {
            message.channel
                .send("``You cannot check warns, noob!!``")
                .then((msg) => {
                    setTimeout(function () {
                        msg.delete();
                    }, 3000);
                })
                .catch();
            return;
        }

        const fs = require("fs");
        var warnsJSON = fs.readFileSync("./warns.json", {
            encoding: "utf8",
        });
        warnsJSON = JSON.parse(warnsJSON)
        var user = message.mentions.users.first();
        if (!user) {
            guide("warn", message);
            return;
        }
        if (warnsJSON[message.guild.id]) {
            if (warnsJSON[message.guild.id][user.toString()]) {
                var userWarns = warnsJSON[message.guild.id][user.toString()];
                var totalWarns = userWarns.length;
                message.channel.send(`This user has ${totalWarns} warns.`)
                var warnsLines = []
                userWarns.forEach((warns) => {
                    warnsLines.push(`Reason:${warns.reason} | Warned by:${warns.author} | Date:${warns.date}`)
                });
                var embed = new Discord.MessageEmbed({
                    color: 10038562,
                    author: "NotABot",
                    title: user.username + "'s Warns",
                    description: warnsLines.join('\n')
                })
                message.channel.send(embed);
            } else {
                message.channel.send(`No warns. ${user} is a good human.`);
            }
        } else {
            message.channel.send(`No warns. ${user} is a good human.`);
        }
    },

    clearWarns: function (message) {
        if (!perms.returnPermissionObject(message).isAdmin) {
            message.channel
                .send("``You cannot check warns, noob!!``")
                .then((msg) => {
                    setTimeout(function () {
                        msg.delete();
                    }, 3000);
                })
                .catch();
            return;
        }

        const fs = require("fs");
        var warnsJSON = fs.readFileSync("./warns.json", {
            encoding: "utf8",
        });
        warnsJSON = JSON.parse(warnsJSON)
        var user = message.mentions.users.first();
        if (!user) {
            guide("warn", message);
            return;
        }
        if (warnsJSON[message.guild.id]) {
            if (warnsJSON[message.guild.id][user.toString()]) {
                warnsJSON[message.guild.id][user.toString()] = [];
                fs.writeFileSync('./warns.json', JSON.stringify(warnsJSON), {
                    encoding: "utf8"
                })
                message.channel.send("All warns have been cleared for " + user.toString() + ".")
            } else {
                message.channel.send(`No warns. ${user} is a good human.`);
            }
        } else {
            message.channel.send(`No warns. ${user} is a good human.`);
        }
    }
};