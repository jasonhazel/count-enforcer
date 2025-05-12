const BaseCommand = require('./base');
const { t, supportedLanguages } = require('../lang/i18n');

class LangCommand extends BaseCommand {
    constructor() {
        super('lang', 'Set your preferred language');
    }

    async execute(message, args, db, lang) {
        const code = args[0]?.toLowerCase();
        if (!supportedLanguages.includes(code)) {
            await message.reply(t('lang_invalid', lang));
            return;
        }
        try {
            const { id } = message.author;
            db.prepare('UPDATE users SET language = ? WHERE user_id = ?').run(code, id);
            await message.reply(t('lang_set', code));
        } catch (error) {
            console.error('Error setting language:', error);
            await message.reply(t('error_register', lang));
        }
    }
}

module.exports = LangCommand; 