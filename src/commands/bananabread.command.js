const BaseCommand = require('./base');
const { t } = require('../lang/i18n');

class BananabreadCommand extends BaseCommand {
    constructor() {
        super('bananabread', 'Posts the banana bread copypasta', true);
    }

    async execute(message, args, db, lang) {
        await message.reply(t('bananabread', lang));
    }
}

module.exports = BananabreadCommand; 