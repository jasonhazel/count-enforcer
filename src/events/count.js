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

        // Get current count and last counter from guild settings
        const guildSettings = db.prepare('SELECT current_count, last_counter, saves FROM guild_settings WHERE guild_id = ?')
            .get(message.guild.id);
        
        if (!guildSettings) {
            return;
        }

        // Check if user is trying to count twice in a row (unless they're the server owner)
        const isDoubleCount = guildSettings.last_counter === message.author.id;
        if (isDoubleCount && message.author.id !== message.guild.ownerId) {
            await message.reply(t('cannot_count_twice', user.language));
            await message.react('❌');
            return;
        }

        const expectedCount = guildSettings.current_count + 1;

        if (number === expectedCount) {
            // Calculate base save rate
            const baseSaveRate = 0.001; // 0.1% per count

            // Calculate streak multiplier
            let streakMultiplier = 1.0;
            if (user.current_streak > 500) {
                streakMultiplier = 2.0;
            } else if (user.current_streak > 100) {
                streakMultiplier = 1.5;
            }

            // Calculate milestone bonus
            let milestoneBonus = 0;
            if (expectedCount % 1000 === 0) {
                milestoneBonus = 2;
            } else if (expectedCount % 500 === 0) {
                milestoneBonus = 1;
            } else if (expectedCount % 100 === 0) {
                milestoneBonus = 0.5;
            }

            // Calculate total saves to add and round to 3 decimal places
            const savesToAdd = Number(((baseSaveRate * streakMultiplier) + milestoneBonus).toFixed(3));
        

            // Update guild settings with new count and saves
            db.prepare(`
                UPDATE guild_settings 
                SET current_count = ?, 
                    highest_count = MAX(highest_count, ?), 
                    last_counter = ?,
                    saves = ROUND(saves + ?, 3)
                WHERE guild_id = ?
            `).run(expectedCount, expectedCount, message.author.id, savesToAdd, message.guild.id);

            // Increment user's success count and streak
            db.prepare(`
                UPDATE users 
                SET success_count = success_count + 1,
                    current_streak = current_streak + 1,
                    highest_streak = MAX(highest_streak, current_streak + 1)
                WHERE user_id = ?
            `).run(message.author.id);

            // Add checkmark reaction
            await message.react('✅');
            
            // Add suspicious emoji if server owner double counted
            if (isDoubleCount && message.author.id === message.guild.ownerId) {
                await message.react('👀');
            }
        } else {
            // Handle incorrect count
            if (guildSettings.saves > 0) {
                // Guild has saves
                await message.reply(t('incorrect_count_with_save', user.language, {
                    expected: expectedCount,
                    current: number
                }));
                
                // Decrement guild saves, increment fail count, and reset streak
                db.prepare(`
                    UPDATE guild_settings 
                    SET saves = CASE 
                        WHEN saves > 0 THEN ROUND(saves - 1, 3)
                        ELSE 0 
                    END
                    WHERE guild_id = ?
                `).run(message.guild.id);

                db.prepare(`
                    UPDATE users 
                    SET fail_count = fail_count + 1,
                        current_streak = 0
                    WHERE user_id = ?
                `).run(message.author.id);
            } else {
                // No saves left
                await message.reply(t('incorrect_count_no_save', user.language, {
                    expected: expectedCount,
                    current: number
                }));
                
                // Reset count and increment failed count, but keep last_counter
                db.prepare(`
                    UPDATE guild_settings 
                    SET current_count = 0, failed_count = failed_count + 1, last_failed_counter = ? 
                    WHERE guild_id = ?
                `).run(message.author.id, message.guild.id);

                // Increment user's fail count and reset streak
                db.prepare(`
                    UPDATE users 
                    SET fail_count = fail_count + 1,
                        current_streak = 0
                    WHERE user_id = ?
                `).run(message.author.id);
            }
            
            // Add X reaction
            await message.react('❌');
        }
    }
}; 