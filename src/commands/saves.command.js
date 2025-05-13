const { t } = require('../lang/i18n');
const BaseCommand = require('./base');
const { EmbedBuilder } = require('discord.js');
const { HIDDEN_MILESTONES } = require('../constants/hidden_milestones');

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
                .setTitle(t('saves_title', lang))
                .setDescription(t('saves_description', lang))
                .addFields(
                    {
                        name: t('saves_base_rate_title', lang),
                        value: t('saves_base_rate_content', lang),
                        inline: false
                    },
                    {
                        name: t('saves_regular_milestones_title', lang),
                        value: t('saves_regular_milestones_content', lang),
                        inline: false
                    },
                    {
                        name: t('saves_hidden_milestones_title', lang),
                        value: t('saves_hidden_milestones_content', lang),
                        inline: false
                    },
                    {
                        name: t('saves_usage_title', lang),
                        value: t('saves_usage_content', lang, { currentSaves: currentSaves.toFixed(3) }),
                        inline: false
                    }
                )
                .setFooter({ text: t('saves_footer', lang) })
                .setTimestamp();

            await message.reply({ embeds: [embed] });
        } catch (error) {
            await message.reply('not_registered');
        }
    }
}

module.exports = SavesCommand; 