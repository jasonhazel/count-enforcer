const CommandsCommand = require('../../commands/commands.command');
const fs = require('fs');
const path = require('path');

// Mock fs and path modules
jest.mock('fs');
jest.mock('path');

// Mock require to return a dummy command class
jest.mock('../../commands/bananabread.command.js', () => {
    return class DummyCommand {
        constructor() {
            this.name = 'bananabread';
            this.description = 'Posts the banana bread copypasta';
        }
    };
}, { virtual: true });

jest.mock('../../commands/givesave.command.js', () => {
    return class DummyCommand {
        constructor() {
            this.name = 'givesave';
            this.description = 'Give a save to a user (Admin only)';
        }
    };
}, { virtual: true });

jest.mock('../../commands/lang.command.js', () => {
    return class DummyCommand {
        constructor() {
            this.name = 'lang';
            this.description = 'Set your preferred language';
        }
    };
}, { virtual: true });

jest.mock('../../commands/ping.command.js', () => {
    return class DummyCommand {
        constructor() {
            this.name = 'ping';
            this.description = 'Check the bot\'s latency';
        }
    };
}, { virtual: true });

jest.mock('../../commands/register.command.js', () => {
    return class DummyCommand {
        constructor() {
            this.name = 'register';
            this.description = 'Register to participate in the counting game';
        }
    };
}, { virtual: true });

jest.mock('../../commands/server.command.js', () => {
    return class DummyCommand {
        constructor() {
            this.name = 'server';
            this.description = 'Shows server statistics';
        }
    };
}, { virtual: true });

jest.mock('../../commands/stats.command.js', () => {
    return class DummyCommand {
        constructor() {
            this.name = 'stats';
            this.description = 'Shows your statistics';
        }
    };
}, { virtual: true });

jest.mock('../../commands/unregister.command.js', () => {
    return class DummyCommand {
        constructor() {
            this.name = 'unregister';
            this.description = 'Unregister from the counting game';
        }
    };
}, { virtual: true });

// Mock discord.js EmbedBuilder
jest.mock('discord.js', () => ({
    EmbedBuilder: jest.fn().mockImplementation(() => ({
        setColor: jest.fn().mockReturnThis(),
        setTitle: jest.fn().mockReturnThis(),
        setDescription: jest.fn().mockReturnThis(),
        addFields: jest.fn().mockReturnThis(),
        setTimestamp: jest.fn().mockReturnThis(),
        setFooter: jest.fn().mockReturnThis(),
        data: {
            title: 'Available Commands',
            description: 'Here are all the commands you can use:',
            fields: [
                { name: '!bananabread', value: 'Posts the banana bread copypasta', inline: false },
                { name: '!commands', value: 'Lists all available commands', inline: false },
                { name: '!givesave', value: 'Give a save to a user (Admin only)', inline: false },
                { name: '!lang', value: 'Set your preferred language', inline: false },
                { name: '!ping', value: 'Check the bot\'s latency', inline: false },
                { name: '!register', value: 'Register to participate in the counting game', inline: false },
                { name: '!server', value: 'Shows server statistics', inline: false },
                { name: '!stats', value: 'Shows your statistics', inline: false },
                { name: '!unregister', value: 'Unregister from the counting game', inline: false }
            ],
            footer: { text: 'Requested by testuser#1234' }
        }
    }))
}));

describe('CommandsCommand', () => {
    let command;
    let message;
    let db;
    let prepareMock;
    let getMock;

    beforeEach(() => {
        command = new CommandsCommand();
        message = {
            author: { id: 'user1', tag: 'testuser#1234' },
            reply: jest.fn()
        };
        getMock = jest.fn();
        prepareMock = jest.fn(() => ({ get: getMock }));
        db = { prepare: prepareMock };

        // Mock fs.readdirSync to return command files
        fs.readdirSync.mockReturnValue([
            'bananabread.command.js',
            'commands.command.js',
            'givesave.command.js',
            'lang.command.js',
            'ping.command.js',
            'register.command.js',
            'server.command.js',
            'stats.command.js',
            'unregister.command.js'
        ]);

        // Mock path.join to return a dummy path
        path.join.mockReturnValue('/dummy/path');
    });

    test('should list all available commands in an embed', async () => {
        getMock.mockResolvedValueOnce({ language: 'en' });
        await command.execute(message, [], db);
        expect(message.reply).toHaveBeenCalledWith(expect.objectContaining({
            embeds: expect.arrayContaining([
                expect.objectContaining({
                    data: expect.objectContaining({
                        title: 'Available Commands',
                        description: 'Here are all the commands you can use:',
                        fields: expect.arrayContaining([
                            expect.objectContaining({ name: '!bananabread', value: 'Posts the banana bread copypasta', inline: false }),
                            expect.objectContaining({ name: '!commands', value: 'Lists all available commands', inline: false }),
                            expect.objectContaining({ name: '!givesave', value: 'Give a save to a user (Admin only)', inline: false }),
                            expect.objectContaining({ name: '!lang', value: 'Set your preferred language', inline: false }),
                            expect.objectContaining({ name: '!ping', value: 'Check the bot\'s latency', inline: false }),
                            expect.objectContaining({ name: '!register', value: 'Register to participate in the counting game', inline: false }),
                            expect.objectContaining({ name: '!server', value: 'Shows server statistics', inline: false }),
                            expect.objectContaining({ name: '!stats', value: 'Shows your statistics', inline: false }),
                            expect.objectContaining({ name: '!unregister', value: 'Unregister from the counting game', inline: false })
                        ]),
                        footer: expect.objectContaining({ text: 'Requested by testuser#1234' })
                    })
                })
            ])
        }));
    });

    test('should handle missing user language (fallback to English)', async () => {
        getMock.mockResolvedValueOnce(undefined);
        await command.execute(message, [], db);
        expect(message.reply).toHaveBeenCalledWith(expect.objectContaining({
            embeds: expect.arrayContaining([
                expect.objectContaining({
                    data: expect.objectContaining({
                        title: 'Available Commands',
                        description: 'Here are all the commands you can use:',
                        fields: expect.arrayContaining([
                            expect.objectContaining({ name: '!bananabread', value: 'Posts the banana bread copypasta', inline: false }),
                            expect.objectContaining({ name: '!commands', value: 'Lists all available commands', inline: false }),
                            expect.objectContaining({ name: '!givesave', value: 'Give a save to a user (Admin only)', inline: false }),
                            expect.objectContaining({ name: '!lang', value: 'Set your preferred language', inline: false }),
                            expect.objectContaining({ name: '!ping', value: 'Check the bot\'s latency', inline: false }),
                            expect.objectContaining({ name: '!register', value: 'Register to participate in the counting game', inline: false }),
                            expect.objectContaining({ name: '!server', value: 'Shows server statistics', inline: false }),
                            expect.objectContaining({ name: '!stats', value: 'Shows your statistics', inline: false }),
                            expect.objectContaining({ name: '!unregister', value: 'Unregister from the counting game', inline: false })
                        ]),
                        footer: expect.objectContaining({ text: 'Requested by testuser#1234' })
                    })
                })
            ])
        }));
    });
}); 