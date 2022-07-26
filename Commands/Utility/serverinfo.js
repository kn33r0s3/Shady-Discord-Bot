const Discord = require('discord.js');

module.exports = {
    serverinfo: function (client, message, args) {
        function checkBots(guild) {
            let botCount = 0;
            guild.members.cache.forEach(member => {
                if (member.user.bot) botCount++;
            });
            return botCount;
        }

        function checkMembers(guild) {
            let memberCount = 0;
            guild.members.cache.forEach(member => {
                if (!member.user.bot) memberCount++;
            });
            return memberCount;
        }

        let sicon = message.guild.iconURL();
        let serverembed = new Discord.MessageEmbed()
            .setAuthor(`${message.guild.name} - Informations`, message.guild.iconURL)
            .setColor("#15f153")
            .addField('Server owner', message.guild.owner, true)
            .addField('Server region', message.guild.region, true)
            .addField("Server ID", message.guild.id, true)
            .setThumbnail(sicon)
            .addField("Server Name", message.guild.name)
            .addField('Verification level', message.guild.verificationLevel, true)
            .addField('Channel count', message.guild.channels.cache.size, true)
            .addField('Total member count', message.guild.memberCount)
            .addField('Humans', message.guild.memberCount - checkBots(message.guild))
            .addField('Bots', checkBots(message.guild), true)
            .addField('Online', message.guild.members.cache.filter(member => member.presence.status !== "offline").size)
            .setFooter('Server created at:')
            .setTimestamp(message.guild.createdAt);

        return message.channel.send(serverembed);
    }
}