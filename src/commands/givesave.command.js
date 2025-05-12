const BaseCommand = require('./base');
const { t } = require('../lang/i18n');

class GiveSaveCommand extends BaseCommand {
    constructor() {
        super('givesave', 'Give a save to a user', true);
    }

    async execute(message, args, db, lang) {
        const targetUsername = args[0];
        
        try {
            // Check if the user is the server owner
            if (message.author.id !== message.guild.ownerId) {
                await message.reply(t('owner_only', lang));
                return;
            }
            
            if (!targetUsername) {
                await message.reply(t('givesave_no_target', lang));
                return;
            }
            
            // Find the user in the database by their display name
            const user = db.prepare('SELECT * FROM users WHERE username = ?').get(targetUsername);
            
            if (!user) {
                await message.reply(t('givesave_user_not_found', lang, { target: targetUsername }));
                return;
            }

            // Increment the user's saves
            db.prepare('UPDATE users SET saves = saves + 1 WHERE user_id = ?')
                .run(user.user_id);

            await message.reply(t('givesave_success', lang, { target: targetUsername }));
        } catch (error) {
            await message.reply(t('givesave_user_not_found', lang, { target: targetUsername || 'unknown' }));
        }
    }
}

module.exports = GiveSaveCommand; 