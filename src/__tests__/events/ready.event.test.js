const { Events } = require('discord.js');
const readyEvent = require('../../events/ready.event');
const { getGuildSettings, createGuildSettings } = require('../../utils/db_helpers');

// Mock db_helpers
jest.mock('../../utils/db_helpers');

describe('Ready Event', () => {
    let mockClient;
    let mockDb;
    let mockGuild1;
    let mockGuild2;
    let consoleSpy;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Mock console methods
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        jest.spyOn(console, 'error').mockImplementation();

        // Create mock guilds
        mockGuild1 = {
            id: '123',
            name: 'Test Guild 1'
        };

        mockGuild2 = {
            id: '456',
            name: 'Test Guild 2'
        };

        // Create mock client
        mockClient = {
            user: {
                tag: 'TestBot#0000'
            },
            guilds: {
                cache: new Map([
                    [mockGuild1.id, mockGuild1],
                    [mockGuild2.id, mockGuild2]
                ])
            },
            generateInvite: jest.fn().mockReturnValue('https://discord.gg/mock-invite')
        };

        // Create mock db
        mockDb = {};

        // Mock getGuildSettings implementation
        getGuildSettings.mockImplementation((db, guildId) => {
            if (guildId === mockGuild1.id) {
                return {
                    prefix: '!',
                    current_count: 0,
                    highest_count: 10,
                    failed_count: 2
                };
            }
            return null;
        });

        // Mock createGuildSettings implementation
        createGuildSettings.mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    test('should have correct name and once flag', () => {
        expect(readyEvent.name).toBe(Events.ClientReady);
        expect(readyEvent.once).toBe(true);
    });

    test('should log bot login information', async () => {
        await readyEvent.execute(mockClient, mockDb);

        expect(consoleSpy).toHaveBeenCalledWith('Logged in as TestBot#0000!');
        expect(consoleSpy).toHaveBeenCalledWith('Bot is in 2 guilds');
    });

    test('should check settings for all guilds', async () => {
        await readyEvent.execute(mockClient, mockDb);

        expect(getGuildSettings).toHaveBeenCalledTimes(2);
        expect(getGuildSettings).toHaveBeenCalledWith(mockDb, mockGuild1.id);
        expect(getGuildSettings).toHaveBeenCalledWith(mockDb, mockGuild2.id);
    });

    test('should create settings for guilds without settings', async () => {
        await readyEvent.execute(mockClient, mockDb);

        // Should only create settings for mockGuild2 (no existing settings)
        expect(createGuildSettings).toHaveBeenCalledTimes(1);
        expect(createGuildSettings).toHaveBeenCalledWith(mockDb, mockGuild2.id);
    });

    test('should generate and log invite link', async () => {
        await readyEvent.execute(mockClient, mockDb);

        expect(mockClient.generateInvite).toHaveBeenCalledWith({
            scopes: ['bot', 'applications.commands'],
            permissions: ['SendMessages', 'ReadMessageHistory', 'ManageMessages', 'EmbedLinks', 'AttachFiles']
        });

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('https://discord.gg/mock-invite'));
    });

    test('should handle errors gracefully', async () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation();
        getGuildSettings.mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        await readyEvent.execute(mockClient, mockDb);

        expect(errorSpy).toHaveBeenCalledWith(
            expect.stringContaining('Error checking/creating settings for guild'),
            expect.any(Error)
        );

        errorSpy.mockRestore();
    });
}); 