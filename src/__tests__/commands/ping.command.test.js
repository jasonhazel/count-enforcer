const PingCommand = require('../../commands/ping.command');
const { t } = require('../../lang/i18n');

// Mock the i18n module
jest.mock('../../lang/i18n', () => ({
    t: jest.fn((key, lang, ...args) => `translated_${key}_${lang}_${args.join('_')}`)
}));

describe('PingCommand', () => {
    let command;
    let mockMessage;
    let mockDb;
    const mockLang = 'en';

    beforeEach(() => {
        command = new PingCommand();
        // Create a mock message with required properties
        mockMessage = {
            reply: jest.fn().mockResolvedValue({}),
            createdTimestamp: Date.now() - 100 // simulate 100ms latency
        };
        mockDb = {};
        // Clear mock calls between tests
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should set command name and description correctly', () => {
            expect(command.name).toBe('ping');
            expect(command.description).toBe('Check the bot\'s latency');
            expect(command.hidden).toBe(false);
        });
    });

    describe('execute', () => {
        it('should reply with translated latency message', async () => {
            await command.execute(mockMessage, [], mockDb, mockLang);
            
            // Verify reply was called
            expect(mockMessage.reply).toHaveBeenCalledTimes(1);
            
            // Verify translation was called with correct parameters
            expect(t).toHaveBeenCalledWith('pong', mockLang, expect.any(Number));
            
            // Verify the latency calculation
            const translationCall = t.mock.calls[0];
            const calculatedLatency = translationCall[2];
            expect(calculatedLatency).toBeGreaterThanOrEqual(0);
            expect(calculatedLatency).toBeLessThanOrEqual(1000); // reasonable latency range
        });
    });
}); 