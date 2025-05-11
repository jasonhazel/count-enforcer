const LangCommand = require('../../commands/lang.command');
const { t, supportedLanguages } = require('../../i18n');

// Mock Discord.js Message
class MockMessage {
    constructor() {
        this.author = { id: '123456789' };
        this.reply = jest.fn();
    }
}

describe('LangCommand', () => {
    let command;
    let message;
    let db;
    let runMock;
    let prepareMock;

    beforeEach(() => {
        command = new LangCommand();
        message = {
            author: { id: '123456789' },
            reply: jest.fn()
        };
        runMock = jest.fn();
        prepareMock = jest.fn(() => ({ run: runMock }));
        db = { prepare: prepareMock };
    });

    test('should have correct name and description', () => {
        expect(command.name).toBe('lang');
        expect(command.description).toBe('Set your preferred language');
    });

    test('should reject invalid language code', async () => {
        const args = ['invalid_lang'];
        const lang = {};

        await command.execute(message, args, db, lang);
        expect(message.reply).toHaveBeenCalled();
        expect(db.prepare).not.toHaveBeenCalled();
    });

    test('should accept valid language code', async () => {
        const validLang = supportedLanguages[0];
        const args = [validLang];
        const lang = {};

        await command.execute(message, args, db, lang);
        expect(db.prepare).toHaveBeenCalledWith('UPDATE users SET language = ? WHERE user_id = ?');
        expect(db.prepare().run).toHaveBeenCalledWith(validLang, message.author.id);
        expect(message.reply).toHaveBeenCalled();
    });

    test('should handle database errors', async () => {
        const validLang = supportedLanguages[0];
        const args = [validLang];
        const lang = {};
        
        // Mock database error
        db.prepare().run.mockImplementation(() => {
            throw new Error('Database error');
        });

        await command.execute(message, args, db, lang);
        expect(message.reply).toHaveBeenCalled();
    });

    test('should handle missing language code', async () => {
        const args = [];
        const lang = {};

        await command.execute(message, args, db, lang);
        expect(message.reply).toHaveBeenCalled();
        expect(db.prepare).not.toHaveBeenCalled();
    });

    test('should reply with lang_invalid for unsupported language code', async () => {
        await command.execute(message, ['xx'], db, 'en');
        expect(message.reply).toHaveBeenCalledWith(t('lang_invalid', 'en'));
        expect(runMock).not.toHaveBeenCalled();
    });

    test('should update user language and reply with lang_set', async () => {
        await command.execute(message, ['es'], db, 'en');
        expect(runMock).toHaveBeenCalledWith('es', '123456789');
        expect(message.reply).toHaveBeenCalledWith(t('lang_set', 'es'));
    });

    test('should handle database errors gracefully', async () => {
        runMock.mockImplementation(() => { throw new Error('fail'); });
        await command.execute(message, ['en'], db, 'en');
        expect(message.reply).toHaveBeenCalledWith(t('error_register', 'en'));
    });
}); 