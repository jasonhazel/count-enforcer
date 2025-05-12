const { t } = require('../lang/i18n');
const BaseCommand = require('./base');
const { EmbedBuilder } = require('discord.js');

class ServerCommand extends BaseCommand {
    constructor() {
        super('server', 'Shows server statistics');
    }

    async execute(message, args, db, lang) {
        const stats = await db.prepare('SELECT current_count, highest_count, failed_count, last_counter, last_failed_counter, saves FROM guild_settings WHERE guild_id = ?')
            .get(message.guild.id);

        if (!stats) {
            await message.reply(t('not_registered', lang));
            return;
        }

        // Get last counter's username if available
        let lastCounterName = 'None';
        if (stats.last_counter) {
            const lastCounter = await db.prepare('SELECT username FROM users WHERE user_id = ?').get(stats.last_counter);
            if (lastCounter) {
                lastCounterName = lastCounter.username;
            }
        }

        // Get last failed counter's username and fail count if available
        let lastFailedCounterName = 'None';
        let lastFailedCounterFails = 0;
        if (stats.last_failed_counter) {
            const lastFailedCounter = await db.prepare('SELECT username, fail_count FROM users WHERE user_id = ?').get(stats.last_failed_counter);
            if (lastFailedCounter) {
                lastFailedCounterName = lastFailedCounter.username;
                lastFailedCounterFails = lastFailedCounter.fail_count;
            }
        }

        const embed = new EmbedBuilder()
            .setColor('#69398e')
            .setTitle('Server Statistics')
            .setDescription(`Statistics for ${message.guild.name}`)
            .addFields(
                { name: 'Current', value: stats.current_count.toString(), inline: true },
                { name: 'Highest', value: stats.highest_count.toString(), inline: true },
                { name: 'Failed', value: stats.failed_count.toString(), inline: true },
                { name: 'Saves', value: (stats.saves || 0).toString(), inline: true },
                { name: 'Last', value: lastCounterName, inline: true },
                { name: 'Last Failed', value: `${lastFailedCounterName} (${lastFailedCounterFails} fails)`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Requested by ${message.author.tag}` });

        await message.reply({ embeds: [embed] });
    }
}

module.exports = ServerCommand; 