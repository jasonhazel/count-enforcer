const ServerCommand = require('../../commands/server.command');

// Mock translation function
const t = (key, lang) => `${key}_${lang}`;
jest.mock('../../i18n', () => ({ t }));

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
            title: 'Server Statistics',
            description: 'Statistics for Test Server',
            fields: [
                { name: 'Current Count', value: '10', inline: true },
                { name: 'Highest Count', value: '20', inline: true },
                { name: 'Failed Count', value: '2', inline: true }
            ],
            footer: { text: 'Requested by testuser#1234' }
        }
    }))
}));

describe('ServerCommand', () => {
    let command;
    let message;
    let db;
    let prepareMock;
    let getMock;

    beforeEach(() => {
        command = new ServerCommand();
        message = {
            author: { id: 'user1', tag: 'testuser#1234' },
            guild: { id: 'guild1', name: 'Test Server' },
            reply: jest.fn()
        };
        getMock = jest.fn();
        prepareMock = jest.fn(() => ({ get: getMock }));
        db = { prepare: prepareMock };
    });

    test('should display server stats for a registered guild', async () => {
        // First call: user language, Second call: guild stats
        getMock
            .mockResolvedValueOnce({ language: 'en' })
            .mockResolvedValueOnce({ current_count: 10, highest_count: 20, failed_count: 2 });
        await command.execute(message, [], db);
        expect(db.prepare).toHaveBeenCalledWith('SELECT language FROM users WHERE user_id = ?');
        expect(db.prepare).toHaveBeenCalledWith('SELECT current_count, highest_count, failed_count FROM guild_settings WHERE guild_id = ?');
        expect(message.reply).toHaveBeenCalledWith(expect.objectContaining({
            embeds: expect.arrayContaining([
                expect.objectContaining({
                    data: expect.objectContaining({
                        title: 'Server Statistics',
                        description: 'Statistics for Test Server',
                        fields: expect.arrayContaining([
                            expect.objectContaining({ name: 'Current Count', value: '10', inline: true }),
                            expect.objectContaining({ name: 'Highest Count', value: '20', inline: true }),
                            expect.objectContaining({ name: 'Failed Count', value: '2', inline: true })
                        ]),
                        footer: expect.objectContaining({ text: 'Requested by testuser#1234' })
                    })
                })
            ])
        }));
    });

    test('should handle non-existent guild stats', async () => {
        getMock
            .mockResolvedValueOnce({ language: 'en' })
            .mockResolvedValueOnce(undefined);
        await command.execute(message, [], db);
        expect(message.reply).toHaveBeenCalledWith('not_registered_en');
    });
}); 