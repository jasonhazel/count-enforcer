const StatsCommand = require('../../commands/stats.command');

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
        data: {
            title: 'User Statistics',
            description: 'Statistics for testuser#1234',
            fields: [
                { name: 'Language', value: 'en', inline: true },
                { name: 'Saves', value: '5', inline: true }
            ]
        }
    }))
}));

describe('StatsCommand', () => {
    let command;
    let message;
    let db;
    let prepareMock;
    let getMock;

    beforeEach(() => {
        command = new StatsCommand();
        message = {
            author: { id: 'user1', tag: 'testuser#1234' },
            reply: jest.fn()
        };
        getMock = jest.fn();
        prepareMock = jest.fn(() => ({ get: getMock }));
        db = { prepare: prepareMock };
    });

    test('should display stats for an existing user', async () => {
        const mockUser = {
            language: 'en',
            saves: 5
        };
        getMock.mockResolvedValueOnce(mockUser);
        await command.execute(message, [], db);
        expect(db.prepare).toHaveBeenCalledWith('SELECT * FROM users WHERE user_id = ?');
        expect(message.reply).toHaveBeenCalledWith(expect.objectContaining({
            embeds: expect.arrayContaining([
                expect.objectContaining({
                    data: expect.objectContaining({
                        title: 'User Statistics',
                        description: 'Statistics for testuser#1234',
                        fields: expect.arrayContaining([
                            expect.objectContaining({ name: 'Language', value: 'en', inline: true }),
                            expect.objectContaining({ name: 'Saves', value: '5', inline: true })
                        ])
                    })
                })
            ])
        }));
    });

    test('should handle non-existent user', async () => {
        getMock.mockResolvedValueOnce(undefined);
        await command.execute(message, [], db);
        expect(message.reply).toHaveBeenCalledWith('not_registered_en');
    });
}); 