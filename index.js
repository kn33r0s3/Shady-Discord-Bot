// Discord
const Discord = require('discord.js');
const client = new Discord.Client();
// Commands and Settings
const Settings = require('./botSettings')
const dotenv = require('dotenv')
const runCommand = require('./runcommands');
dotenv.config({ path: './.env' });

var setting;
var prefix;

client.on('ready', () => {
    console.log('Bot is online!');
    setting = new Settings();
    prefix = setting.prefix;

    function randomStatus() {
        let status = ["KP OLI DANCE", "PRACHANDEY NAACH ", "Geda Jasto Jindagi", "Your mutu", "JANATA JANNA CHAHANCHAN"] //
        let randomstatus = Math.floor(Math.random() * status.length);

        client.user.setActivity(status[randomstatus], { type: "STREAMING", url: "https://www.twitch.tv/kneerawz" });
    };
    setInterval(randomStatus, 10000);

});

client.on('message', async message => {
    if (message.content.startsWith(prefix)) {
        try {
            var commandName = message.content.toString().split(prefix)[1].split(' ')[0];
        } catch {
            message.channel.send('``Invalid command u fool!``')
        }
        if (!message.guild) return;
        if (message.author.bot) return;
        runCommand(commandName, message);
    }
});

client.login(process.env.CLIENT_TOKEN);