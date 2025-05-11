const { Events } = require('discord.js');
const readyEvent = require('../../events/ready');

describe('Ready Event Handler', () => {
    let mockClient;
    let mockDb;
    let mockGuilds;
    let consoleSpy;

    beforeEach(() => {
        // Mock console methods
        consoleSpy = {
            log: jest.spyOn(console, 'log').mockImplementation(),
            error: jest.spyOn(console, 'error').mockImplementation()
        };

        // Mock guilds
        mockGuilds = new Map();
        mockGuilds.set('123', {
            id: '123',
            name: 'Test Guild 1'
        });
        mockGuilds.set('456', {
            id: '456',
            name: 'Test Guild 2'
        });

        // Mock client
        mockClient = {
            user: { tag: 'TestBot#1234' },
            guilds: {
                cache: mockGuilds
            }
        };

        // Mock database
        mockDb = {
            prepare: jest.fn().mockReturnValue({
                get: jest.fn(),
                run: jest.fn()
            })
        };
    });

    afterEach(() => {
        consoleSpy.log.mockRestore();
        consoleSpy.error.mockRestore();
    });

    test('should have correct event configuration', () => {
        expect(readyEvent.name).toBe(Events.ClientReady);
        expect(readyEvent.once).toBe(true);
    });

    test('should log bot login information', async () => {
        await readyEvent.execute(mockClient, mockDb);
        expect(consoleSpy.log).toHaveBeenCalledWith('Logged in as TestBot#1234!');
        expect(consoleSpy.log).toHaveBeenCalledWith('Bot is in 2 guilds');
    });

    test('should create default settings for new guilds', async () => {
        // Mock database to return no settings for both guilds
        mockDb.prepare().get.mockReturnValue(null);

        await readyEvent.execute(mockClient, mockDb);

        // Verify database calls
        expect(mockDb.prepare).toHaveBeenCalledWith('SELECT * FROM guild_settings WHERE guild_id = ?');
        expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO guild_settings'));
        
        // Verify default settings were created for both guilds
        expect(mockDb.prepare().run).toHaveBeenCalledTimes(2);
        expect(mockDb.prepare().run).toHaveBeenCalledWith('123');
        expect(mockDb.prepare().run).toHaveBeenCalledWith('456');
    });

    test('should handle existing guild settings', async () => {
        // Mock database to return existing settings for one guild
        mockDb.prepare().get
            .mockReturnValueOnce({
                guild_id: '123',
                prefix: '!',
                current_count: 5,
                highest_count: 10,
                failed_count: 2
            })
            .mockReturnValueOnce(null);

        await readyEvent.execute(mockClient, mockDb);

        // Verify settings were logged
        expect(consoleSpy.log).toHaveBeenCalledWith(
            expect.stringContaining('Found existing settings for guild Test Guild 1:'),
            expect.any(Object)
        );
    });

    test('should handle database errors gracefully', async () => {
        // Mock database error
        mockDb.prepare().get.mockImplementation(() => {
            throw new Error('Database error');
        });

        await readyEvent.execute(mockClient, mockDb);

        // Verify error was logged
        expect(consoleSpy.error).toHaveBeenCalledWith(
            expect.stringContaining('Error checking/creating settings for guild'),
            expect.any(Error)
        );
    });
}); 