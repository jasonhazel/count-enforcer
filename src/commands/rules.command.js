const { t } = require('../i18n');
const BaseCommand = require('./base');
const { EmbedBuilder } = require('discord.js');

class RulesCommand extends BaseCommand {
    constructor() {
        super('rules', 'Shows the rules of the counting game');
    }

    async execute(message, args, db) {
        const user = await db.prepare('SELECT language FROM users WHERE user_id = ?').get(message.author.id);
        const lang = user ? user.language : 'en';

        const embed = new EmbedBuilder()
            .setColor('#69398e')
            .setTitle('🎲 Counting Game Rules')
            .setDescription('Here\'s how to play the counting game:')
            .addFields(
                {
                    name: '📝 Basic Rules',
                    value: '• Count up from 1, one number at a time\n• Each person can only count once in a row',
                    inline: false
                },
                {
                    name: '🎯 How to Play',
                    value: '• Use `!register` to join and `!lang` to set your language\n• Get the "counter" role to start counting',
                    inline: false
                },
                {
                    name: '❌ Mistakes',
                    value: '• If you make a mistake, the count resets to 0\n• Your streak resets and fail count increases',
                    inline: false
                },
                {
                    name: '💾 Saves',
                    value: '• Use `!saves` to see how saves work\n• Each save prevents one mistake from resetting the count',
                    inline: false
                },
                {
                    name: '📊 Statistics',
                    value: '• Use `!user` to see your stats\n• Use `!server` to see server stats',
                    inline: false
                }
            )
            .setTimestamp()
            .setFooter({ text: `Requested by ${message.author.tag}` });

        await message.reply({ embeds: [embed] });
    }
}

module.exports = RulesCommand; 