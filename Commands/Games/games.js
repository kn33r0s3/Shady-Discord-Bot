const Settings = require('../../botSettings')
var setting = new Settings()
var prefix = setting.prefix;

module.exports = {
    tictactoe: function (message) {
        require('./tictactoe')(message);
    }
}