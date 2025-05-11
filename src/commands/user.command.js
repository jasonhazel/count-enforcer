const { t } = require('../i18n');
const BaseCommand = require('./base');
const { EmbedBuilder } = require('discord.js');

class UserCommand extends BaseCommand {
    constructor() {
        super('user', 'Shows your personal statistics');
    }

    async execute(message, args, db) {
        const user = await db.prepare('SELECT * FROM users WHERE user_id = ?').get(message.author.id);
        const lang = user ? user.language : 'en';

        if (!user) {
            await message.reply(t('not_registered', lang));
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('#69398e')
            .setTitle('User Statistics')
            .setDescription(`Statistics for ${message.author.tag}`)
            .addFields(
                // { name: 'Username', value: user.username, inline: true },
                // { name: 'Active', value: user.active ? 'Yes' : 'No', inline: true },
                { name: 'Language', value: user.language, inline: true },
                { name: 'Saves', value: user.saves.toString(), inline: true },
                { name: 'Failed Counts', value: (user.fail_count || 0).toString(), inline: true },
                { name: 'Successful Counts', value: (user.success_count || 0).toString(), inline: true },
                // { name: 'Member Since', value: new Date(user.created_at).toLocaleDateString(), inline: true },
                // { name: 'Last Seen', value: new Date(user.last_seen).toLocaleDateString(), inline: true }
            )
            .setTimestamp()

        await message.reply({ embeds: [embed] });
    }
}

module.exports = UserCommand; 