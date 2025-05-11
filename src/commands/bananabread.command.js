const { t } = require('../i18n');

class BananabreadCommand {
    constructor() {
        this.name = 'bananabread';
        this.description = 'Posts the banana bread copypasta';
    }

    async execute(message, args, db) {
        const user = await db.prepare('SELECT language FROM users WHERE user_id = ?').get(message.author.id);
        const lang = user ? user.language : 'en';
        
        await message.reply(t('bananabread', lang));
    }
}

module.exports = BananabreadCommand; 