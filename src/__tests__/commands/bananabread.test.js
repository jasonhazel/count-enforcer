const BananabreadCommand = require('../../commands/bananabread.command');
const { t } = require('../../lang/i18n');

// Mock the dependencies
jest.mock('../../lang/i18n', () => ({
    t: jest.fn((key, lang) => `translated_${key}_${lang}`)
}));

describe('BananabreadCommand', () => {
    let command;
    let mockMessage;
    let mockDb;
    const mockLang = 'en';

    beforeEach(() => {
        command = new BananabreadCommand();
        
        // Create mock message with required properties
        mockMessage = {
            reply: jest.fn().mockResolvedValue({})
        };

        mockDb = {};

        // Clear all mocks between tests
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should set command name, description, and hidden flag correctly', () => {
            expect(command.name).toBe('bananabread');
            expect(command.description).toBe('Posts the banana bread copypasta');
            expect(command.hidden).toBe(true);
        });
    });

    describe('execute', () => {
        it('should reply with the bananabread copypasta', async () => {
            await command.execute(mockMessage, [], mockDb, mockLang);

            // Verify translation was requested
            expect(t).toHaveBeenCalledWith('bananabread', mockLang);

            // Verify message was sent
            expect(mockMessage.reply).toHaveBeenCalledWith('translated_bananabread_en');
        });

        it('should handle errors when sending the message', async () => {
            // Mock a failure in reply
            mockMessage.reply.mockRejectedValue(new Error('Failed to send message'));

            await expect(command.execute(mockMessage, [], mockDb, mockLang))
                .rejects.toThrow('Failed to send message');
        });
    });
}); 