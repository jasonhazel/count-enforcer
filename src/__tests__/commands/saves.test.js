const SavesCommand = require('../../commands/saves.command');
const { t } = require('../../lang/i18n');
const { HIDDEN_MILESTONES } = require('../../constants/hidden_milestones');
const { EmbedBuilder } = require('discord.js');

// Mock dependencies
jest.mock('../../lang/i18n', () => ({
    t: jest.fn((key, lang, params) => {
        const translations = {
            saves_title: '💾 Save System Rules',
            saves_description: 'Here\'s how saves work in this server:',
            saves_base_rate_title: '📊 Base Save Rate',
            saves_base_rate_content: '• Every correct count adds 0.001 saves (0.1%)',
            saves_regular_milestones_title: '🏆 Regular Milestone Bonuses',
            saves_regular_milestones_content: '• +2.0 saves at every 1000\n• +1.0 saves at every 500\n• +0.5 saves at every 100',
            saves_hidden_milestones_title: '✨ Hidden Milestone Bonuses',
            saves_hidden_milestones_content: '• Special bonuses at various hidden milestones',
            saves_usage_title: '🛡️ Using Saves',
            saves_footer: 'Saves are rounded to 3 decimal places'
        };
        if (key === 'saves_usage_content' && params) {
            return `• When someone makes a mistake, one save is used to prevent the count from resetting\n• Saves are shared across the entire server\n• Current saves: ${params.currentSaves}`;
        }
        return translations[key] || key;
    })
}));
jest.mock('discord.js', () => ({
    EmbedBuilder: jest.fn()
}));

describe('SavesCommand', () => {
    let command;
    let mockMessage;
    let mockDb;
    let embedInstance;

    beforeEach(() => {
        command = new SavesCommand();
        embedInstance = {
            setColor: jest.fn().mockReturnThis(),
            setTitle: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setFooter: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis()
        };

        // Setup mock return value for EmbedBuilder
        EmbedBuilder.mockImplementation(() => embedInstance);

        mockMessage = {
            guild: {
                id: '123456789'
            },
            reply: jest.fn()
        };

        mockDb = {
            prepare: jest.fn().mockReturnValue({
                get: jest.fn().mockReturnValue({ saves: 5.123 })
            })
        };

        // Clear mock calls
        t.mockClear();
    });

    test('should be constructed with correct name and description', () => {
        expect(command.name).toBe('saves');
        expect(command.description).toBe('Shows information about how saves work');
    });

    test('should create embed with save system information when guild has saves', async () => {
        await command.execute(mockMessage, [], mockDb, 'en');

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
                name: '🏆 Regular Milestone Bonuses',
                value: '• +2.0 saves at every 1000\n• +1.0 saves at every 500\n• +0.5 saves at every 100',
                inline: false
            },
            {
                name: '✨ Hidden Milestone Bonuses',
                value: '• Special bonuses at various hidden milestones',
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
    });

    test('should handle guild with no saves', async () => {
        mockDb.prepare.mockReturnValue({
            get: jest.fn().mockReturnValue(null)
        });

        await command.execute(mockMessage, [], mockDb, 'en');

        expect(embedInstance.addFields).toHaveBeenCalledWith(
            expect.any(Object),
            expect.any(Object),
            expect.any(Object),
            expect.objectContaining({
                value: expect.stringContaining('Current saves: 0.000')
            })
        );
    });

    test('should handle database errors gracefully', async () => {
        mockDb.prepare.mockImplementation(() => {
            throw new Error('Database error');
        });

        await command.execute(mockMessage, [], mockDb, 'en');

        expect(mockMessage.reply).toHaveBeenCalledWith('not_registered');
    });
}); 