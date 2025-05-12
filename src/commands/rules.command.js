const BaseCommand = require('./base');
const { t } = require('../lang/i18n');
const { EmbedBuilder } = require('discord.js');

class RulesCommand extends BaseCommand {
    constructor() {
        super('rules', 'Shows the rules of the counting game');
    }

    async execute(message, args, db, lang) {
        const embed = new EmbedBuilder()
            .setColor('#69398e')
            .setTitle(t('rules_title', lang))
            .setDescription(t('rules_description', lang))
            .addFields(
                {
                    name: t('rules_basic_title', lang),
                    value: t('rules_basic_content', lang),
                    inline: false
                },
                {
                    name: t('rules_how_to_title', lang),
                    value: t('rules_how_to_content', lang),
                    inline: false
                },
                {
                    name: t('rules_mistakes_title', lang),
                    value: t('rules_mistakes_content', lang),
                    inline: false
                },
                {
                    name: t('rules_saves_title', lang),
                    value: t('rules_saves_content', lang),
                    inline: false
                },
                {
                    name: t('rules_stats_title', lang),
                    value: t('rules_stats_content', lang),
                    inline: false
                }
            )
            .setTimestamp()
            .setFooter({ text: t('rules_footer', lang, message.author.tag) });

        await message.reply({ embeds: [embed] });
    }
}

module.exports = RulesCommand; 