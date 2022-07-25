module.exports = {
    returnPermissionObject: function(message) {
        return {
            isAdmin: checkAllPerms("ADMINISTRATOR", message),
            manageRoles: checkAllPerms("MANAGE_ROLES", message),
            banMembers: checkAllPerms("BAN_MEMBERS", message),
            kickMembers: checkAllPerms("KICK_MEMBERS", message),
            manageMessages: checkAllPerms("MANAGE_MESSAGES", message)
        }
    }
}

checkAllPerms = function(perms, message) {
    if (message.author.id === process.env.CLIENT_ID) {
        return false;
    }
    return message.member.hasPermission(perms);
}
