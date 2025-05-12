const { t } = require('../i18n');

async function manageCounterRole(member, action, db, lang) {
    const counterRole = member.guild.roles.cache.find(role => role.name.toLowerCase() === 'counter');
    
    if (!counterRole) {
        console.error('Counter role not found in the server. Please create a role named "counter"');
        throw new Error('COUNTER_ROLE_NOT_FOUND');
    }

    // Check if bot has permission to manage roles
    if (!member.guild.members.me.permissions.has('ManageRoles')) {
        console.error('Bot does not have permission to manage roles');
        throw new Error('MISSING_MANAGE_ROLES_PERMISSION');
    }

    // Check if bot's role is higher than counter role
    if (member.guild.members.me.roles.highest.position <= counterRole.position) {
        console.error('Bot\'s role is not higher than the counter role in the hierarchy');
        throw new Error('INSUFFICIENT_ROLE_HIERARCHY');
    }

    try {
        if (action === 'add') {
            await member.roles.add(counterRole);
        } else if (action === 'remove') {
            await member.roles.remove(counterRole);
        }
        return true;
    } catch (error) {
        console.error(`Error ${action}ing counter role:`, error);
        throw error;
    }
}

module.exports = {
    manageCounterRole
}; 