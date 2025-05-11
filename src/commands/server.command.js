const { t } = require('../i18n');
const BaseCommand = require('./base');
const { EmbedBuilder } = require('discord.js');

class ServerCommand extends BaseCommand {
    constructor() {
        super('server', 'Shows server statistics');
    }

    async execute(message, args, db) {
        const user = await db.prepare('SELECT language FROM users WHERE user_id = ?').get(message.author.id);
        const lang = user ? user.language : 'en';

        const stats = await db.prepare('SELECT current_count, highest_count, failed_count FROM guild_settings WHERE guild_id = ?')
            .get(message.guild.id);

        if (!stats) {
            await message.reply(t('not_registered', lang));
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('#69398e')
            .setTitle('Server Statistics')
            .setDescription(`Statistics for ${message.guild.name}`)
            .addFields(
                { name: 'Current Count', value: stats.current_count.toString(), inline: true },
                { name: 'Highest Count', value: stats.highest_count.toString(), inline: true },
                { name: 'Failed Count', value: stats.failed_count.toString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Requested by ${message.author.tag}` });

        await message.reply({ embeds: [embed] });
    }
}

module.exports = ServerCommand; 