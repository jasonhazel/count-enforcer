const BaseCommand = require('./base');
const { t } = require('../i18n');

class SetSavesCommand extends BaseCommand {
    constructor() {
        super('setsaves', 'Set the number of saves for the server (server owner only)');
    }

    async execute(message, args, db, lang) {
        // Check if user is server owner
        if (message.author.id !== message.guild.ownerId) {
            await message.reply(t('owner_only_command', lang));
            return;
        }

        // Check if argument is provided
        if (!args.length) {
            await message.reply(t('setsaves_usage', lang));
            return;
        }

        // Parse the number
        const newSaves = parseFloat(args[0]);
        if (isNaN(newSaves)) {
            await message.reply(t('setsaves_invalid_number', lang));
            return;
        }

        // Check if number is non-negative
        if (newSaves < 0) {
            await message.reply(t('setsaves_negative', lang));
            return;
        }

        try {
            // Round to 3 decimal places for consistency
            const roundedSaves = Math.round(newSaves * 1000) / 1000;
            
            // Update the saves in the database
            db.prepare(`
                UPDATE guild_settings 
                SET saves = ?
                WHERE guild_id = ?
            `).run(roundedSaves, message.guild.id);

            await message.reply(t('setsaves_success', lang, { saves: roundedSaves }));
        } catch (error) {
            console.error('Error setting saves:', error);
            await message.reply(t('setsaves_error', lang));
        }
    }
}

module.exports = SetSavesCommand; 