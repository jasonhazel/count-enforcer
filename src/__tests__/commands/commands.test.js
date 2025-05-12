const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');
const CommandsCommand = require('../../commands/commands.command');

// Mock the dependencies
jest.mock('fs');
jest.mock('path');
jest.mock('discord.js');

describe('CommandsCommand', () => {
    let command;
    let mockMessage;
    let mockDb;
    const mockLang = 'en';

    beforeEach(() => {
        command = new CommandsCommand();
        
        // Create mock message with required properties
        mockMessage = {
            author: {
                tag: 'testUser#1234'
            },
            reply: jest.fn().mockResolvedValue({})
        };

        mockDb = {};

        // Mock path.join to return predictable paths
        path.join.mockImplementation((...args) => args.join('/'));

        // Reset all mocks
        jest.clearAllMocks();

        // Mock EmbedBuilder
        EmbedBuilder.mockImplementation(() => ({
            setColor: jest.fn().mockReturnThis(),
            setTitle: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis(),
            setFooter: jest.fn().mockReturnThis()
        }));
    });

    describe('constructor', () => {
        it('should set command name and description correctly', () => {
            expect(command.name).toBe('commands');
            expect(command.description).toBe('Lists all available commands');
            expect(command.hidden).toBe(false);
        });
    });

    describe('execute', () => {
        it('should list all non-hidden commands in alphabetical order', async () => {
            // Mock command files in directory
            fs.readdirSync.mockReturnValue(['ping.command.js', 'hidden.command.js', 'alpha.command.js']);

            // Mock require for each command file
            jest.mock('../../commands/ping.command.js', () => {
                return class {
                    constructor() {
                        this.name = 'ping';
                        this.description = 'Ping command';
                        this.hidden = false;
                    }
                };
            }, { virtual: true });

            jest.mock('../../commands/hidden.command.js', () => {
                return class {
                    constructor() {
                        this.name = 'hidden';
                        this.description = 'Hidden command';
                        this.hidden = true;
                    }
                };
            }, { virtual: true });

            jest.mock('../../commands/alpha.command.js', () => {
                return class {
                    constructor() {
                        this.name = 'alpha';
                        this.description = 'Alpha command';
                        this.hidden = false;
                    }
                };
            }, { virtual: true });

            // Mock the require function to use our mocked modules
            const mockRequire = jest.fn((path) => {
                if (path.endsWith('ping.command.js')) {
                    return require('../../commands/ping.command.js');
                } else if (path.endsWith('hidden.command.js')) {
                    return require('../../commands/hidden.command.js');
                } else if (path.endsWith('alpha.command.js')) {
                    return require('../../commands/alpha.command.js');
                }
                return require(path);
            });

            // Replace require temporarily
            const originalRequire = require;
            global.require = mockRequire;

            try {
                await command.execute(mockMessage, [], mockDb, mockLang);

                // Verify fs.readdirSync was called
                expect(fs.readdirSync).toHaveBeenCalled();

                // Verify EmbedBuilder was configured correctly
                expect(EmbedBuilder).toHaveBeenCalled();
                const embedInstance = EmbedBuilder.mock.results[0].value;
                
                expect(embedInstance.setColor).toHaveBeenCalledWith('#69398e');
                expect(embedInstance.setTitle).toHaveBeenCalledWith('Available Commands');
                expect(embedInstance.setDescription).toHaveBeenCalledWith('Here are all the commands you can use:');
                
                // Verify fields were added in alphabetical order
                expect(embedInstance.addFields).toHaveBeenCalledWith([
                    { name: '!alpha', value: 'Alpha command', inline: false },
                    { name: '!ping', value: 'Ping command', inline: false }
                ]);

                expect(embedInstance.setTimestamp).toHaveBeenCalled();
                expect(embedInstance.setFooter).toHaveBeenCalledWith({ text: 'Requested by testUser#1234' });

                // Verify message was sent
                expect(mockMessage.reply).toHaveBeenCalledWith({ embeds: [embedInstance] });
            } finally {
                // Restore original require
                global.require = originalRequire;
            }
        });

        it('should handle empty command list', async () => {
            fs.readdirSync.mockReturnValue([]);

            await command.execute(mockMessage, [], mockDb, mockLang);

            const embedInstance = EmbedBuilder.mock.results[0].value;
            expect(embedInstance.addFields).toHaveBeenCalledWith([]);
            expect(mockMessage.reply).toHaveBeenCalled();
        });

        it('should handle errors when reading command files', async () => {
            fs.readdirSync.mockImplementation(() => {
                throw new Error('Failed to read directory');
            });

            await expect(command.execute(mockMessage, [], mockDb, mockLang))
                .rejects.toThrow('Failed to read directory');
        });
    });
}); 