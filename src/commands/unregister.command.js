const BaseCommand = require('./base');
const { t } = require('../i18n');
const { deactivateUser } = require('../utils/dbHelpers');
const { manageCounterRole } = require('../utils/roleManager');

class UnregisterCommand extends BaseCommand {
    constructor() {
        super('unregister', 'Unregister yourself from the bot\'s database');
    }

    async execute(message, args, db, lang) {
        try {
            const { id } = message.author;
            
            const existingUser = db.prepare('SELECT * FROM users WHERE user_id = ?').get(id);
            
            if (existingUser) {
                deactivateUser(db, id);
                await message.reply(t('unregistered', lang));

                try {
                    await manageCounterRole(message.member, 'remove', db, lang);
                } catch (error) {
                    switch (error.message) {
                        case 'COUNTER_ROLE_NOT_FOUND':
                            await message.reply('Error: Counter role not found. Please contact an administrator.');
                            break;
                        case 'MISSING_MANAGE_ROLES_PERMISSION':
                            await message.reply('Error: Bot does not have permission to manage roles. Please contact an administrator.');
                            break;
                        case 'INSUFFICIENT_ROLE_HIERARCHY':
                            await message.reply('Error: Bot\'s role is not high enough in the role hierarchy. Please contact an administrator.');
                            break;
                        default:
                            await message.reply(t('error_unregister', lang));
                    }
                }
            } else {
                await message.reply(t('not_registered', lang));
            }
        } catch (error) {
            console.error('Error unregistering user:', error);
            await message.reply(t('error_unregister', lang));
        }
    }
}

module.exports = UnregisterCommand; 