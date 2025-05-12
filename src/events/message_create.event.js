const { Events } = require('discord.js');
const { getGuildSettings } = require('../utils/db_helpers');
const { getUserLanguage } = require('../utils/db_helpers');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, db, commands) {
        if (message.author.bot) return;

        // Get guild prefix from database or use default
        const guildSettings = getGuildSettings(db, message.guild.id);
        const guildPrefix = guildSettings?.prefix || '!';

        if (!message.content.startsWith(guildPrefix)) return;

        const args = message.content.slice(guildPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        // Get user language
        const lang = getUserLanguage(db, message.author.id);

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