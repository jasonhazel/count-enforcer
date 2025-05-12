const { t } = require('../lang/i18n');
const BaseCommand = require('./base');
const { EmbedBuilder } = require('discord.js');

class UserCommand extends BaseCommand {
    constructor() {
        super('user', 'Shows your personal statistics');
    }

    async execute(message, args, db, lang) {
        const user = await db.prepare('SELECT * FROM users WHERE user_id = ?').get(message.author.id);

        if (!user) {
            await message.reply(t('not_registered', lang));
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('#69398e')
            .setTitle('User Statistics')
            .setDescription(`Statistics for ${message.author.tag}`)
            .addFields(
                { name: 'Language', value: user.language, inline: true },
                { name: 'Failed Counts', value: (user.fail_count || 0).toString(), inline: true },
                { name: 'Successful Counts', value: (user.success_count || 0).toString(), inline: true },
                { name: 'Current Streak', value: (user.current_streak || 0).toString(), inline: true },
                { name: 'Highest Streak', value: (user.highest_streak || 0).toString(), inline: true }
            )
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
}

module.exports = UserCommand; 