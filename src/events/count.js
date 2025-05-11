const { Events } = require('discord.js');
const { t } = require('../i18n');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, db) {
        // Ignore bot messages
        if (message.author.bot) return;

        // Check if user has counter role
        const counterRole = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'counter');
        if (!counterRole || !message.member.roles.cache.has(counterRole.id)) {
            return;
        }

        // Check if user is registered
        const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(message.author.id);
        if (!user || !user.active) {
            return;
        }

        // Check if message is a number
        const number = parseInt(message.content);
        if (isNaN(number)) {
            return;
        }

        // Get current count from guild settings
        const guildSettings = db.prepare('SELECT current_count FROM guild_settings WHERE guild_id = ?')
            .get(message.guild.id);
        
        if (!guildSettings) {
            return;
        }

        const expectedCount = guildSettings.current_count + 1;

        // Check if the number is correct
        if (number === expectedCount) {
            // Update the current count
            db.prepare('UPDATE guild_settings SET current_count = ? WHERE guild_id = ?')
                .run(number, message.guild.id);
            
            // Get latest guild settings
            const updatedSettings = db.prepare('SELECT * FROM guild_settings WHERE guild_id = ?')
                .get(message.guild.id);
            
            // Update highest count if needed
            if (number > updatedSettings.highest_count) {
                db.prepare('UPDATE guild_settings SET highest_count = ? WHERE guild_id = ?')
                    .run(number, message.guild.id);
            }
            
            // Add checkmark reaction
            await message.react('✅');
        } else {
            // If count is less than 10, just warn the user
            if (guildSettings.current_count < 10) {
                await message.reply(t('incorrect_count_warning', user.language, {
                    expected: expectedCount,
                    current: number
                }));
                await message.react('⚠️');
                return;
            }

            // Handle incorrect count for counts >= 10
            if (user.saves > 0) {
                // User has saves
                await message.reply(t('incorrect_count_with_save', user.language, {
                    expected: expectedCount,
                    current: number
                }));
                
                // Decrement saves
                db.prepare('UPDATE users SET saves = saves - 1 WHERE user_id = ?')
                    .run(message.author.id);
            } else {
                // No saves left
                await message.reply(t('incorrect_count_no_save', user.language, {
                    expected: expectedCount,
                    current: number
                }));
                
                // Reset count and increment failed count
                db.prepare(`
                    UPDATE guild_settings 
                    SET current_count = 0, failed_count = failed_count + 1 
                    WHERE guild_id = ?
                `).run(message.guild.id);
            }
            
            // Add X reaction
            await message.react('❌');
        }
    }
}; 