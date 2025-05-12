const BaseCommand = require('./base');
const { t } = require('../lang/i18n');
const { updateUserLastSeen, createNewUser, manageCounterRole } = require('../utils/db_helpers');

class RegisterCommand extends BaseCommand {
    constructor() {
        super('register', 'Register to participate in counting');
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
                        await message.reply(t('role_error_not_found', lang));
                        break;
                    case 'MISSING_MANAGE_ROLES_PERMISSION':
                        await message.reply(t('role_error_missing_permission', lang));
                        break;
                    case 'INSUFFICIENT_ROLE_HIERARCHY':
                        await message.reply(t('role_error_hierarchy', lang));
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