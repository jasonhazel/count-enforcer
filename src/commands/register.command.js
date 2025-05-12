const BaseCommand = require('./base');
const { t } = require('../i18n');
const { updateUserLastSeen, createNewUser } = require('../utils/dbHelpers');
const { manageCounterRole } = require('../utils/roleManager');

class RegisterCommand extends BaseCommand {
    constructor() {
        super('register', 'Register yourself in the bot\'s database');
    }

    async execute(message, args, db, lang) {
        try {
            const { id, username, discriminator } = message.author;
            
            const existingUser = db.prepare('SELECT * FROM users WHERE user_id = ?').get(id);
            
            if (existingUser) {
                updateUserLastSeen(db, id, username, discriminator);
                await message.reply(t('updated', lang));
            } else {
                createNewUser(db, id, username, discriminator, lang);
                await message.reply(t('registered', lang));
            }

            try {
                await manageCounterRole(message.member, 'add', db, lang);
                console.log(`Added counter role to user ${username}`);
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
                        await message.reply(t('error_register', lang));
                }
            }
        } catch (error) {
            console.error('Error registering user:', error);
            await message.reply(t('error_register', lang));
        }
    }
}

module.exports = RegisterCommand; 