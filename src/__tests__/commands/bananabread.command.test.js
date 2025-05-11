const BananabreadCommand = require('../../commands/bananabread.command');

// Mock translation function
const t = (key, lang) => `copypasta_${lang}`;
jest.mock('../../i18n', () => ({ t }));

describe('BananabreadCommand', () => {
    let command;
    let message;
    let db;
    let prepareMock;
    let getMock;

    beforeEach(() => {
        command = new BananabreadCommand();
        message = {
            author: { id: 'user1' },
            reply: jest.fn()
        };
        getMock = jest.fn();
        prepareMock = jest.fn(() => ({ get: getMock }));
        db = { prepare: prepareMock };
    });

    test('should reply with copypasta in user language', async () => {
        getMock.mockResolvedValueOnce({ language: 'es' });
        await command.execute(message, [], db);
        expect(message.reply).toHaveBeenCalledWith('copypasta_es');
    });

    test('should reply with copypasta in English if user not found', async () => {
        getMock.mockResolvedValueOnce(undefined);
        await command.execute(message, [], db);
        expect(message.reply).toHaveBeenCalledWith('copypasta_en');
    });
}); 