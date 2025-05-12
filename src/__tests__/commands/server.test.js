const ServerCommand = require('../../commands/server.command');
const { t } = require('../../lang/i18n');
const { EmbedBuilder } = require('discord.js');

// Mock discord.js
jest.mock('discord.js', () => ({
    EmbedBuilder: jest.fn().mockReturnValue({
        setColor: jest.fn().mockReturnThis(),
        setTitle: jest.fn().mockReturnThis(),
        setDescription: jest.fn().mockReturnThis(),
        addFields: jest.fn().mockReturnThis(),
        setTimestamp: jest.fn().mockReturnThis(),
        setFooter: jest.fn().mockReturnThis()
    })
}));

// Mock i18n
jest.mock('../../lang/i18n', () => ({
    t: jest.fn((key) => key)
}));

describe('ServerCommand', () => {
    let command;
    let mockMessage;
    let mockDb;
    let mockPrepare;

    beforeEach(() => {
        command = new ServerCommand();
        mockPrepare = jest.fn();
        mockDb = {
            prepare: mockPrepare
        };
        mockMessage = {
            reply: jest.fn(),
            guild: {
                id: '123',
                name: 'Test Server'
            },
            author: {
                tag: 'testuser#1234'
            }
        };
        t.mockClear();
        EmbedBuilder.mockClear();
    });

    it('should be constructed with correct name and description', () => {
        expect(command.name).toBe('server');
        expect(command.description).toBe('Shows server statistics');
        expect(command.hidden).toBe(false);
    });

    it('should handle unregistered server', async () => {
        mockPrepare.mockReturnValue({ get: jest.fn().mockReturnValue(null) });

        await command.execute(mockMessage, [], mockDb, 'en');

        expect(mockMessage.reply).toHaveBeenCalledWith('not_registered');
    });

    it('should display server statistics with no last counter', async () => {
        const mockStats = {
            current_count: 42,
            highest_count: 100,
            failed_count: 5,
            saves: 3,
            last_counter: null,
            last_failed_counter: null
        };
        mockPrepare.mockReturnValue({ get: jest.fn().mockReturnValue(mockStats) });

        await command.execute(mockMessage, [], mockDb, 'en');

        expect(EmbedBuilder).toHaveBeenCalled();
        const embedInstance = EmbedBuilder.mock.results[0].value;

        expect(embedInstance.setColor).toHaveBeenCalledWith('#69398e');
        expect(embedInstance.setTitle).toHaveBeenCalledWith('Server Statistics');
        expect(embedInstance.setDescription).toHaveBeenCalledWith('Statistics for Test Server');
        expect(embedInstance.addFields).toHaveBeenCalledWith(
            { name: 'Current', value: '42', inline: true },
            { name: 'Highest', value: '100', inline: true },
            { name: 'Failed', value: '5', inline: true },
            { name: 'Saves', value: '3', inline: true },
            { name: 'Last', value: 'None', inline: true },
            { name: 'Last Failed', value: 'None (0 fails)', inline: true }
        );
        expect(embedInstance.setTimestamp).toHaveBeenCalled();
        expect(embedInstance.setFooter).toHaveBeenCalledWith({ text: 'Requested by testuser#1234' });
    });

    it('should display server statistics with last counter and failed counter', async () => {
        const mockStats = {
            current_count: 42,
            highest_count: 100,
            failed_count: 5,
            saves: 3,
            last_counter: '789',
            last_failed_counter: '456'
        };

        const mockUserQueries = jest.fn()
            .mockImplementationOnce(() => ({ username: 'lastCounter' }))
            .mockImplementationOnce(() => ({ username: 'failedCounter', fail_count: 3 }));

        mockPrepare.mockImplementation((query) => ({
            get: query.includes('guild_settings') ? jest.fn().mockReturnValue(mockStats) : mockUserQueries
        }));

        await command.execute(mockMessage, [], mockDb, 'en');

        const embedInstance = EmbedBuilder.mock.results[0].value;
        expect(embedInstance.addFields).toHaveBeenCalledWith(
            { name: 'Current', value: '42', inline: true },
            { name: 'Highest', value: '100', inline: true },
            { name: 'Failed', value: '5', inline: true },
            { name: 'Saves', value: '3', inline: true },
            { name: 'Last', value: 'lastCounter', inline: true },
            { name: 'Last Failed', value: 'failedCounter (3 fails)', inline: true }
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