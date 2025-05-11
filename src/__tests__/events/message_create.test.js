const { Events } = require('discord.js');
const messageCreateEvent = require('../../events/message_create');

describe('MessageCreate Event Handler', () => {
    let mockMessage;
    let mockDb;
    let mockCommands;
    let mockCommand;
    let consoleSpy;

    beforeEach(() => {
        mockMessage = {
            author: { id: 'user1', bot: false },
            guild: { id: 'guild1' },
            content: '!test arg1 arg2',
            reply: jest.fn()
        };
        mockDb = {
            prepare: jest.fn().mockReturnValue({
                get: jest.fn()
            })
        };
        mockCommand = {
            execute: jest.fn()
        };
        mockCommands = new Map();
        mockCommands.set('test', mockCommand);
        consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    test('should have correct event name', () => {
        expect(messageCreateEvent.name).toBe(Events.MessageCreate);
    });

    test('should ignore messages from bots', async () => {
        mockMessage.author.bot = true;
        await messageCreateEvent.execute(mockMessage, mockDb, mockCommands);
        expect(mockDb.prepare).not.toHaveBeenCalled();
        expect(mockCommand.execute).not.toHaveBeenCalled();
    });

    test('should ignore messages without the correct prefix', async () => {
        mockMessage.content = '?test arg1 arg2';
        mockDb.prepare().get.mockReturnValueOnce({ prefix: '!' });
        await messageCreateEvent.execute(mockMessage, mockDb, mockCommands);
        expect(mockCommand.execute).not.toHaveBeenCalled();
    });

    test('should use default prefix if not set in db', async () => {
        mockMessage.content = '!test arg1 arg2';
        mockDb.prepare().get.mockReturnValueOnce(undefined); // No prefix in db
        mockDb.prepare().get.mockReturnValueOnce({ language: 'en' });
        await messageCreateEvent.execute(mockMessage, mockDb, mockCommands);
        expect(mockCommand.execute).toHaveBeenCalled();
    });

    test('should execute command with correct args and language', async () => {
        mockDb.prepare().get
            .mockReturnValueOnce({ prefix: '!' }) // prefix
            .mockReturnValueOnce({ language: 'fr' }); // user
        await messageCreateEvent.execute(mockMessage, mockDb, mockCommands);
        expect(mockCommand.execute).toHaveBeenCalledWith(
            mockMessage,
            ['arg1', 'arg2'],
            mockDb,
            'fr'
        );
    });

    test('should default to en language if user not found', async () => {
        mockDb.prepare().get
            .mockReturnValueOnce({ prefix: '!' }) // prefix
            .mockReturnValueOnce(undefined); // user
        await messageCreateEvent.execute(mockMessage, mockDb, mockCommands);
        expect(mockCommand.execute).toHaveBeenCalledWith(
            mockMessage,
            ['arg1', 'arg2'],
            mockDb,
            'en'
        );
    });

    test('should handle unknown commands gracefully', async () => {
        mockCommands = new Map(); // No commands registered
        await messageCreateEvent.execute(mockMessage, mockDb, mockCommands);
        expect(mockDb.prepare).toHaveBeenCalled();
        // Should not throw or reply
        expect(mockMessage.reply).not.toHaveBeenCalled();
    });

    test('should reply with error if command throws', async () => {
        mockDb.prepare().get
            .mockReturnValueOnce({ prefix: '!' }) // prefix
            .mockReturnValueOnce({ language: 'en' }); // user
        mockCommand.execute.mockImplementation(() => { throw new Error('fail'); });
        await messageCreateEvent.execute(mockMessage, mockDb, mockCommands);
        expect(consoleSpy).toHaveBeenCalledWith(
            'Error executing command:',
            expect.any(Error)
        );
        expect(mockMessage.reply).toHaveBeenCalledWith('There was an error executing that command.');
    });
}); 