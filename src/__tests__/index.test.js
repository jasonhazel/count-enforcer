// Mock discord.js module
const mockDiscord = {
    Client: jest.fn(),
    GatewayIntentBits: {
        Guilds: 'GUILDS',
        GuildMessages: 'GUILD_MESSAGES',
        MessageContent: 'MESSAGE_CONTENT'
    },
    Events: {
        ClientReady: 'ready',
        MessageCreate: 'messageCreate',
        InteractionCreate: 'interactionCreate'
    }
};

jest.mock('discord.js', () => mockDiscord);
jest.mock('better-sqlite3');
jest.mock('fs');
jest.mock('path');
jest.mock('../web/server');
jest.mock('../db/migration_manager');

describe('Bot Initialization', () => {
    let mockDb;
    let mockClient;
    let mockCommand;
    let mockEvent;

    beforeEach(() => {
        // Clear all mocks and reset modules
        jest.clearAllMocks();
        jest.resetModules();

        // Mock Database constructor
        mockDb = {
            prepare: jest.fn(),
            transaction: jest.fn(),
        };
        require('better-sqlite3').mockImplementation(() => mockDb);

        // Mock Discord client
        mockClient = {
            login: jest.fn().mockResolvedValue('mock-login-success'),
            on: jest.fn(),
            once: jest.fn(),
        };
        mockDiscord.Client.mockImplementation(() => mockClient);

        // Mock fs readdir
        const fs = require('fs');
        fs.readdirSync.mockImplementation((dir) => {
            if (dir.includes('commands')) {
                return ['test.command.js'];
            }
            if (dir.includes('events')) {
                return ['test.event.js'];
            }
            return [];
        });

        // Mock path join
        require('path').join.mockImplementation((...args) => args.join('/'));

        // Set up mock command
        mockCommand = {
            name: 'test',
            description: 'A test command',
            usage: '!test',
            execute: jest.fn()
        };

        // Set up mock event
        mockEvent = {
            name: 'ready',
            once: true,
            execute: jest.fn()
        };

        // Mock the command and event modules
        jest.doMock('../commands/test.command.js', () => {
            return class {
                constructor() {
                    return mockCommand;
                }
            };
        }, { virtual: true });

        jest.doMock('../events/test.event.js', () => mockEvent, { virtual: true });

        // Set environment variable
        process.env.DISCORD_TOKEN = 'mock-token';
    });

    afterEach(() => {
        // Clean up environment variables and modules
        delete process.env.DISCORD_TOKEN;
        jest.resetModules();
    });

    test('should initialize Discord client with correct intents', () => {
        require('../index');
        
        expect(mockDiscord.Client).toHaveBeenCalledWith({
            intents: [
                mockDiscord.GatewayIntentBits.Guilds,
                mockDiscord.GatewayIntentBits.GuildMessages,
                mockDiscord.GatewayIntentBits.MessageContent,
            ]
        });
    });

    test('should initialize database and run migrations', () => {
        require('../index');
        
        expect(require('better-sqlite3')).toHaveBeenCalledWith('/data/bot.db');
    });

    test('should attempt to load commands from commands directory', () => {
        require('../index');
        
        expect(require('fs').readdirSync).toHaveBeenCalledWith(expect.stringContaining('commands'));
    });

    test('should attempt to load events from events directory', () => {
        require('../index');
        
        expect(require('fs').readdirSync).toHaveBeenCalledWith(expect.stringContaining('events'));
    });

    test('should login with Discord token', () => {
        require('../index');
        
        expect(mockClient.login).toHaveBeenCalledWith('mock-token');
    });

    test('should throw error if Discord token is not set', () => {
        delete process.env.DISCORD_TOKEN;
        
        expect(() => {
            require('../index');
        }).toThrow('No Discord token found');
    });

    test('should register command when valid command file is loaded', () => {
        const index = require('../index');
        
        expect(index.commands.has('test')).toBeTruthy();
        const registeredCommand = index.commands.get('test');
        expect(registeredCommand).toEqual(mockCommand);
    });

    test('should register event handler for non-once events', () => {
        // Create a new mock event with once: false
        const nonOnceEvent = {
            name: 'message',
            once: false,
            execute: jest.fn()
        };

        // Override the event mock
        jest.doMock('../events/test.event.js', () => nonOnceEvent, { virtual: true });
        
        require('../index');
        
        expect(mockClient.on).toHaveBeenCalledWith(
            'message',
            expect.any(Function)
        );
    });

    test('should register one-time event handler for once events', () => {
        require('../index');
        
        expect(mockClient.once).toHaveBeenCalledWith(
            'ready',
            expect.any(Function)
        );
    });

    test('should handle command loading errors gracefully', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        
        jest.doMock('../commands/test.command.js', () => {
            throw new Error('Command load error');
        }, { virtual: true });
        
        require('../index');
        
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Failed to load command test.command.js'),
            expect.any(String)
        );
        
        consoleSpy.mockRestore();
    });

    test('should handle event loading errors gracefully', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        
        jest.doMock('../events/test.event.js', () => {
            throw new Error('Event load error');
        }, { virtual: true });
        
        require('../index');
        
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Failed to load event test.event.js'),
            expect.any(String)
        );
        
        consoleSpy.mockRestore();
    });
}); 