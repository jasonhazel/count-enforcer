const LangCommand = require('../../commands/lang.command');
const { t, supportedLanguages } = require('../../lang/i18n');

// Mock the dependencies
jest.mock('../../lang/i18n', () => ({
    t: jest.fn((key, lang) => `translated_${key}_${lang}`),
    supportedLanguages: ['en', 'es', 'fr']
}));

describe('LangCommand', () => {
    let command;
    let mockMessage;
    let mockDb;
    const mockLang = 'en';
    const mockUserId = '123456789';

    beforeEach(() => {
        command = new LangCommand();
        
        // Create mock message with required properties
        mockMessage = {
            author: {
                id: mockUserId
            },
            reply: jest.fn().mockResolvedValue({})
        };

        // Mock database with prepare method
        mockDb = {
            prepare: jest.fn().mockReturnValue({
                run: jest.fn()
            })
        };

        // Clear all mocks between tests
        jest.clearAllMocks();
        console.error = jest.fn(); // Mock console.error
    });

    describe('constructor', () => {
        it('should set command name and description correctly', () => {
            expect(command.name).toBe('lang');
            expect(command.description).toBe('Set your preferred language');
            expect(command.hidden).toBe(false);
        });
    });

    describe('execute', () => {
        it('should update user language when valid language code is provided', async () => {
            const validLangCode = 'es';
            await command.execute(mockMessage, [validLangCode], mockDb, mockLang);

            // Verify DB query was made
            expect(mockDb.prepare).toHaveBeenCalledWith('UPDATE users SET language = ? WHERE user_id = ?');
            expect(mockDb.prepare().run).toHaveBeenCalledWith(validLangCode, mockUserId);

            // Verify success message was sent
            expect(mockMessage.reply).toHaveBeenCalledWith('translated_lang_set_es');
        });

        it('should handle invalid language code', async () => {
            const invalidLangCode = 'invalid';
            await command.execute(mockMessage, [invalidLangCode], mockDb, mockLang);

            // Verify error message was sent
            expect(mockMessage.reply).toHaveBeenCalledWith('translated_lang_invalid_en');

            // Verify DB was not updated
            expect(mockDb.prepare).not.toHaveBeenCalled();
        });

        it('should handle missing language code', async () => {
            await command.execute(mockMessage, [], mockDb, mockLang);

            // Verify error message was sent
            expect(mockMessage.reply).toHaveBeenCalledWith('translated_lang_invalid_en');

            // Verify DB was not updated
            expect(mockDb.prepare).not.toHaveBeenCalled();
        });

        it('should handle database errors', async () => {
            const validLangCode = 'es';
            mockDb.prepare().run.mockImplementation(() => {
                throw new Error('Database error');
            });

            await command.execute(mockMessage, [validLangCode], mockDb, mockLang);

            // Verify error was logged
            expect(console.error).toHaveBeenCalledWith('Error setting language:', expect.any(Error));

            // Verify error message was sent
            expect(mockMessage.reply).toHaveBeenCalledWith('translated_error_register_en');
        });
    });
}); 