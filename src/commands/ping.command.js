const BaseCommand = require('./base');
const { t } = require('../i18n');

class PingCommand extends BaseCommand {
    constructor() {
        super('ping', 'Check the bot\'s latency');
    }

    async execute(message, args, db, lang) {
        const latency = Date.now() - message.createdTimestamp;
        await message.reply(t('pong', lang, latency));
    }
}

module.exports = PingCommand; 