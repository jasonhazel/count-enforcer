const BaseCommand = require('./base');
const { t } = require('../i18n');

class RegisterCommand extends BaseCommand {
    constructor() {
        super('register', 'Register yourself in the bot\'s database');
    }

    async execute(message, args, db, lang) {
        try {
            const { id, username, discriminator } = message.author;
            
            const existingUser = db.prepare('SELECT * FROM users WHERE user_id = ?').get(id);
            
            if (existingUser) {
                db.prepare(`
                    UPDATE users 
                    SET username = ?, discriminator = ?, last_seen = CURRENT_TIMESTAMP, active = TRUE 
                    WHERE user_id = ?
                `).run(username, discriminator, id);
                await message.reply(t('updated', lang));
            } else {
                db.prepare(`
                    INSERT INTO users (user_id, username, discriminator, active, language) 
                    VALUES (?, ?, ?, TRUE, ?)
                `).run(id, username, discriminator, lang);
                await message.reply(t('registered', lang));
            }

            // Add counter role
            const member = message.member;
            const counterRole = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'counter');
            
            if (!counterRole) {
                console.error('Counter role not found in the server. Please create a role named "counter"');
                await message.reply('Error: Counter role not found. Please contact an administrator.');
                return;
            }

            // Check if bot has permission to manage roles
            if (!message.guild.members.me.permissions.has('ManageRoles')) {
                console.error('Bot does not have permission to manage roles');
                await message.reply('Error: Bot does not have permission to manage roles. Please contact an administrator.');
                return;
            }

            // Check if bot's role is higher than counter role
            if (message.guild.members.me.roles.highest.position <= counterRole.position) {
                console.error('Bot\'s role is not higher than the counter role in the hierarchy');
                await message.reply('Error: Bot\'s role is not high enough in the role hierarchy. Please contact an administrator.');
                return;
            }

            await member.roles.add(counterRole);
            console.log(`Added counter role to user ${username}`);
        } catch (error) {
            console.error('Error registering user:', error);
            if (error.code === 50001) {
                await message.reply('Error: Bot does not have permission to manage roles. Please contact an administrator.');
            } else {
                await message.reply(t('error_register', lang));
            }
        }
    }
}

module.exports = RegisterCommand; 