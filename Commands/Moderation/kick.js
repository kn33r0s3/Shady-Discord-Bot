var perms = require('../../getPerms')
var guide = require('../../getGuide')
module.exports = kick = (message) => {
    if (!perms.returnPermissionObject(message).kickMembers) {
        message.channel.send("``Missing permissions!!``");
        return;
    }
    var user = message.mentions.users.first();
    var reason;
    try {
        reason = message.content.toString().split("-r ")[1];
    } catch {
        reason = "Kicked without any reasons.";
    }
    if (user) {
        const member = message.guild.member(user);
        if (member) {
            member
                .kick(reason)
                .then(() => {
                    message.channel.send(
                        `Successfully kicked ${user.tag}. Reason: ${reason}`
                    );
                })
                .catch((err) => {
                    message.channel.send("I was unable to kick the member.");
                });
        } else {
            message.channel.send("That user isn't in this server!");
        }
    } else {
        guide("kick", message);
    }
}