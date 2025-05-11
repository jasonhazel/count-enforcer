const PingCommand = require('../../commands/ping.command');

// Mock translation function
const t = (key, lang, latency) => `pong_${lang}_${latency}`;
jest.mock('../../i18n', () => ({ t }));

describe('PingCommand', () => {
    let command;
    let message;
    let db;

    beforeEach(() => {
        command = new PingCommand();
        message = {
            createdTimestamp: 1000,
            reply: jest.fn()
        };
        db = {};
        jest.spyOn(Date, 'now').mockReturnValue(1100);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should reply with pong and correct latency in given language', async () => {
        await command.execute(message, [], db, 'es');
        expect(message.reply).toHaveBeenCalledWith('pong_es_100');
    });

    test('should reply with pong and correct latency in English', async () => {
        await command.execute(message, [], db, 'en');
        expect(message.reply).toHaveBeenCalledWith('pong_en_100');
    });
}); 