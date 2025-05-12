const { Events } = require('discord.js');
const messageCreateEvent = require('../../events/message_create.event');
const { getGuildSettings, getUserLanguage } = require('../../utils/db_helpers');
const { t } = require('../../lang/i18n');

// Mock dependencies
jest.mock('../../utils/db_helpers');
jest.mock('../../lang/i18n');

describe('Message Create Event', () => {
    let mockMessage;
    let mockDb;
    let mockCommands;
    let mockCommand;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Mock message
        mockMessage = {
            content: '!test arg1 arg2',
            author: {
                id: '123',
                bot: false
            },
            guild: {
                id: '456'
            },
            reply: jest.fn()
        };

        // Mock db
        mockDb = {};

        // Mock command
        mockCommand = {
            execute: jest.fn()
        };

        // Mock commands collection
        mockCommands = new Map([
            ['test', mockCommand]
        ]);

        // Mock db_helpers
        getGuildSettings.mockReturnValue({
            prefix: '!'
        });
        getUserLanguage.mockReturnValue('en');

        // Mock i18n
        t.mockImplementation((key) => `translated_${key}`);
    });

    test('should have correct name', () => {
        expect(messageCreateEvent.name).toBe(Events.MessageCreate);
    });

    test('should ignore bot messages', async () => {
        mockMessage.author.bot = true;
        
        await messageCreateEvent.execute(mockMessage, mockDb, mockCommands);
        
        expect(getGuildSettings).not.toHaveBeenCalled();
        expect(mockCommand.execute).not.toHaveBeenCalled();
    });

    test('should ignore messages without prefix', async () => {
        mockMessage.content = 'test without prefix';
        
        await messageCreateEvent.execute(mockMessage, mockDb, mockCommands);
        
        expect(mockCommand.execute).not.toHaveBeenCalled();
    });

    test('should handle messages with custom prefix', async () => {
        getGuildSettings.mockReturnValue({
            prefix: '$'
        });
        mockMessage.content = '$test arg1 arg2';
        
        await messageCreateEvent.execute(mockMessage, mockDb, mockCommands);
        
        expect(mockCommand.execute).toHaveBeenCalledWith(
            mockMessage,
            ['arg1', 'arg2'],
            mockDb,
            'en'
        );
    });

    test('should execute command with correct arguments', async () => {
        await messageCreateEvent.execute(mockMessage, mockDb, mockCommands);
        
        expect(mockCommand.execute).toHaveBeenCalledWith(
            mockMessage,
            ['arg1', 'arg2'],
            mockDb,
            'en'
        );
    });

    test('should handle non-existent commands', async () => {
        mockMessage.content = '!nonexistent arg1 arg2';
        
        await messageCreateEvent.execute(mockMessage, mockDb, mockCommands);
        
        expect(mockCommand.execute).not.toHaveBeenCalled();
    });

    test('should handle command execution errors', async () => {
        const error = new Error('Test error');
        mockCommand.execute.mockRejectedValue(error);
        
        await messageCreateEvent.execute(mockMessage, mockDb, mockCommands);
        
        expect(mockMessage.reply).toHaveBeenCalledWith('translated_command_execution_error');
    });

    test('should use default prefix if guild settings not found', async () => {
        getGuildSettings.mockReturnValue(null);
        mockMessage.content = '!test arg1 arg2';
        
        await messageCreateEvent.execute(mockMessage, mockDb, mockCommands);
        
        expect(mockCommand.execute).toHaveBeenCalled();
    });

    test('should get user language for command execution', async () => {
        await messageCreateEvent.execute(mockMessage, mockDb, mockCommands);
        
        expect(getUserLanguage).toHaveBeenCalledWith(mockDb, mockMessage.author.id);
        expect(mockCommand.execute).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            expect.anything(),
            'en'
        );
    });
}); 