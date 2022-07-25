const Settings = require('./botSettings')
var settings = new Settings();
module.exports = function(commandName, message) {
    var commands = settings.getCommands()
    for (const [key, value] of Object.entries(commands)) {
        value.forEach(command => {
            if (command.name === commandName) {
                if (command.message) {
                    message.channel.send('```' + command.message + '\ncoммand naмe:' + command.name + '\nυѕage:' + command.usage + '```')
                    return
                }
                message.channel.send('```coммand naмe:' + command.name + '\nυѕage:' + command.usage + '```')
                return;
            }
        })
    }
}