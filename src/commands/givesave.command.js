const BaseCommand = require('./base');
const { t } = require('../lang/i18n');

class GiveSaveCommand extends BaseCommand {
    constructor() {
        super('givesave', 'Give a save to a user (Admin only)', true);
    }

    async execute(message, args, db, lang) {
        // Check if the user is the server owner
        if (message.author.id !== message.guild.ownerId) {
            await message.reply(t('givesave_owner_only', lang));
            return;
        }

        const targetUsername = args[0];
        
        if (!targetUsername) {
            await message.reply(t('givesave_usage', lang));
            return;
        }
        
        // Find the user in the database by their display name
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(targetUsername);
        
        if (!user) {
            await message.reply(t('givesave_user_not_found', lang, targetUsername));
            return;
        }

        // Increment the user's saves
        db.prepare('UPDATE users SET saves = saves + 1 WHERE user_id = ?')
            .run(user.user_id);

        await message.reply(t('givesave_success', lang, targetUsername, user.saves + 1));
    }
}

module.exports = GiveSaveCommand; 