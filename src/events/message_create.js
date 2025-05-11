const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, db, commands) {
        if (message.author.bot) return;

        // Get guild prefix from database or use default
        const guildPrefix = db.prepare('SELECT prefix FROM guild_settings WHERE guild_id = ?').get(message.guild.id)?.prefix || '!';

        if (!message.content.startsWith(guildPrefix)) return;

        const args = message.content.slice(guildPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        // Get user language or default to 'en'
        const userRow = db.prepare('SELECT * FROM users WHERE user_id = ?').get(message.author.id);
        const lang = userRow?.language || 'en';

        // Execute command
        const command = commands.get(commandName);
        if (command) {
            try {
                await command.execute(message, args, db, lang);
            } catch (error) {
                console.error('Error executing command:', error);
                message.reply('There was an error executing that command.');
            }
        }
    }
}; 