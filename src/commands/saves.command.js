const { t } = require('../lang/i18n');
const BaseCommand = require('./base');
const { EmbedBuilder } = require('discord.js');

class SavesCommand extends BaseCommand {
    constructor() {
        super('saves', 'Shows information about how saves work');
    }

    async execute(message, args, db, lang) {
        try {
            const guildSettings = db.prepare('SELECT saves FROM guild_settings WHERE guild_id = ?')
                .get(message.guild.id);

            const currentSaves = guildSettings?.saves || 0;

            const embed = new EmbedBuilder()
                .setColor('#69398e')
                .setTitle('💾 Save System Rules')
                .setDescription('Here\'s how saves work in this server:')
                .addFields(
                    {
                        name: '📊 Base Save Rate',
                        value: '• Every correct count adds 0.001 saves (0.1%)',
                        inline: false
                    },
                    {
                        name: '🔥 Streak Multipliers',
                        value: '• 1.0x multiplier for streaks 0-100\n• 1.5x multiplier for streaks 101-500\n• 2.0x multiplier for streaks 501+',
                        inline: false
                    },
                    {
                        name: '🏆 Milestone Bonuses',
                        value: '• +2.0 saves at every 1000\n• +1.0 saves at every 500\n• +0.5 saves at every 100',
                        inline: false
                    },
                    {
                        name: '🛡️ Using Saves',
                        value: '• When someone makes a mistake, one save is used to prevent the count from resetting\n• Saves are shared across the entire server\n• Current saves: ' + currentSaves.toFixed(3),
                        inline: false
                    }
                )
                .setFooter({ text: 'Saves are rounded to 3 decimal places' })
                .setTimestamp();

            await message.reply({ embeds: [embed] });
        } catch (error) {
            await message.reply('not_registered');
        }
    }
}

module.exports = SavesCommand; 