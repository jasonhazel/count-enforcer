const BaseCommand = require('./base');
const { t } = require('../lang/i18n');

class SetCountCommand extends BaseCommand {
    constructor() {
        super('setcount', 'Set the current count to a specific number (server owner only)', true);
    }

    async execute(message, args, db, lang) {
        // Check if user is server owner
        if (message.author.id !== message.guild.ownerId) {
            await message.reply(t('owner_only_command', lang));
            return;
        }

        // Check if argument is provided
        if (!args.length) {
            await message.reply(t('setcount_usage', lang));
            return;
        }

        // Parse the number
        const newCount = parseInt(args[0]);
        if (isNaN(newCount)) {
            await message.reply(t('setcount_invalid_number', lang));
            return;
        }

        // Check if number is non-negative
        if (newCount < 0) {
            await message.reply(t('setcount_negative', lang));
            return;
        }

        try {
            // Update the count in the database
            db.prepare(`
                UPDATE guild_settings 
                SET current_count = ?,
                    highest_count = CASE WHEN ? > highest_count THEN ? ELSE highest_count END
                WHERE guild_id = ?
            `).run(newCount, newCount, newCount, message.guild.id);

            await message.reply(t('setcount_success', lang, { count: newCount }));
        } catch (error) {
            console.error('Error setting count:', error);
            await message.reply(t('setcount_error', lang));
        }
    }
}

module.exports = SetCountCommand; 