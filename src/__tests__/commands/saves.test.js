const SavesCommand = require('../../commands/saves.command');
const { t } = require('../../lang/i18n');
const { EmbedBuilder } = require('discord.js');

// Mock discord.js
jest.mock('discord.js', () => ({
    EmbedBuilder: jest.fn().mockReturnValue({
        setColor: jest.fn().mockReturnThis(),
        setTitle: jest.fn().mockReturnThis(),
        setDescription: jest.fn().mockReturnThis(),
        addFields: jest.fn().mockReturnThis(),
        setFooter: jest.fn().mockReturnThis(),
        setTimestamp: jest.fn().mockReturnThis()
    })
}));

// Mock i18n
jest.mock('../../lang/i18n', () => ({
    t: jest.fn((key) => key)
}));

describe('SavesCommand', () => {
    let command;
    let mockMessage;
    let mockDb;
    let mockPrepare;

    beforeEach(() => {
        command = new SavesCommand();
        mockPrepare = jest.fn();
        mockDb = {
            prepare: mockPrepare
        };
        mockMessage = {
            reply: jest.fn(),
            guild: {
                id: '123'
            }
        };
        t.mockClear();
        EmbedBuilder.mockClear();
    });

    it('should be constructed with correct name and description', () => {
        expect(command.name).toBe('saves');
        expect(command.description).toBe('Shows information about how saves work');
        expect(command.hidden).toBe(false);
    });

    it('should create embed with save system information when guild has saves', async () => {
        const mockGet = jest.fn().mockReturnValue({ saves: 5.123 });
        mockPrepare.mockReturnValue({ get: mockGet });

        await command.execute(mockMessage, [], mockDb, 'en');

        expect(mockPrepare).toHaveBeenCalledWith('SELECT saves FROM guild_settings WHERE guild_id = ?');
        expect(mockGet).toHaveBeenCalledWith('123');
        
        expect(EmbedBuilder).toHaveBeenCalled();
        const embedInstance = EmbedBuilder.mock.results[0].value;
        
        expect(embedInstance.setColor).toHaveBeenCalledWith('#69398e');
        expect(embedInstance.setTitle).toHaveBeenCalledWith('💾 Save System Rules');
        expect(embedInstance.setDescription).toHaveBeenCalledWith('Here\'s how saves work in this server:');
        expect(embedInstance.addFields).toHaveBeenCalledWith(
            {
                name: '📊 Base Save Rate',
                value: '• Every correct count adds 0.001 saves (0.1%)',
                inline: false
            },
            {
                name: '🔥 Streak Multipliers',
                value: '• 1.0x multiplier for streaks 0-100\n• 1.5x multiplier for streaks 101-500\n• 2.0x multiplier for streaks 501+',
                inline: false
            },
            {
                name: '🏆 Milestone Bonuses',
                value: '• +2.0 saves at every 1000\n• +1.0 saves at every 500\n• +0.5 saves at every 100',
                inline: false
            },
            {
                name: '🛡️ Using Saves',
                value: '• When someone makes a mistake, one save is used to prevent the count from resetting\n• Saves are shared across the entire server\n• Current saves: 5.123',
                inline: false
            }
        );
        expect(embedInstance.setFooter).toHaveBeenCalledWith({ text: 'Saves are rounded to 3 decimal places' });
        expect(embedInstance.setTimestamp).toHaveBeenCalled();
        expect(mockMessage.reply).toHaveBeenCalledWith({ embeds: [embedInstance] });
    });

    it('should handle guild with no saves', async () => {
        mockPrepare.mockReturnValue({ get: jest.fn().mockReturnValue(null) });

        await command.execute(mockMessage, [], mockDb, 'en');

        const embedInstance = EmbedBuilder.mock.results[0].value;
        expect(embedInstance.addFields).toHaveBeenCalledWith(
            expect.any(Object),
            expect.any(Object),
            expect.any(Object),
            expect.objectContaining({
                name: '🛡️ Using Saves',
                value: expect.stringContaining('Current saves: 0.000')
            })
        );
    });

    it('should handle database errors gracefully', async () => {
        mockPrepare.mockImplementation(() => {
            throw new Error('Database error');
        });

        await command.execute(mockMessage, [], mockDb, 'en');

        expect(mockMessage.reply).toHaveBeenCalledWith('not_registered');
    });
}); 