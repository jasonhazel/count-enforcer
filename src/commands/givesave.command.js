const BaseCommand = require('./base');
const { t } = require('../lang/i18n');

class GiveSaveCommand extends BaseCommand {
    constructor() {
        super('givesave', 'Give a save to a user (Admin only)');
    }

    async execute(message, args, db, lang) {
        // Check if the user is the server owner
        if (message.author.id !== message.guild.ownerId) {
            await message.reply('This command can only be used by the server owner.');
            return;
        }

        const targetUsername = args[0];
        
        if (!targetUsername) {
            await message.reply('Please provide a username. Usage: !givesave <username>');
            return;
        }
        
        // Find the user in the database by their display name
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(targetUsername);
        
        if (!user) {
            await message.reply(`User "${targetUsername}" not found in the database.`);
            return;
        }

        // Increment the user's saves
        db.prepare('UPDATE users SET saves = saves + 1 WHERE user_id = ?')
            .run(user.user_id);

        await message.reply(`Successfully gave a save to ${targetUsername}. They now have ${user.saves + 1} saves.`);
    }
}

module.exports = GiveSaveCommand; 