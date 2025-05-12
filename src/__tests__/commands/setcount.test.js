const SetCountCommand = require('../../commands/setcount.command');
const { t } = require('../../lang/i18n');

// Mock i18n
jest.mock('../../lang/i18n', () => ({
    t: jest.fn((key, lang, params) => {
        if (key === 'owner_only_command') return 'This command is for server owners only';
        if (key === 'setcount_usage') return 'Please specify a number to set the count to';
        if (key === 'setcount_invalid_number') return 'Please provide a valid number';
        if (key === 'setcount_negative') return 'Count cannot be negative';
        if (key === 'setcount_success') return `Count set to ${params.count}`;
        if (key === 'setcount_error') return 'An error occurred while setting the count';
        return key;
    })
}));

describe('SetCountCommand', () => {
    let command;
    let mockMessage;
    let mockDb;
    let mockPrepare;

    beforeEach(() => {
        command = new SetCountCommand();
        mockPrepare = jest.fn();
        mockDb = {
            prepare: mockPrepare
        };
        mockMessage = {
            reply: jest.fn(),
            author: {
                id: '123'
            },
            guild: {
                id: '456',
                ownerId: '789'
            }
        };
        t.mockClear();
    });

    it('should be constructed with correct name, description and hidden status', () => {
        expect(command.name).toBe('setcount');
        expect(command.description).toBe('Set the current count to a specific number (server owner only)');
        expect(command.hidden).toBe(true);
    });

    it('should reject non-owner users', async () => {
        await command.execute(mockMessage, [], mockDb, 'en');
        
        expect(mockMessage.reply).toHaveBeenCalledWith('This command is for server owners only');
        expect(mockPrepare).not.toHaveBeenCalled();
    });

    it('should require a count argument', async () => {
        mockMessage.author.id = mockMessage.guild.ownerId;
        
        await command.execute(mockMessage, [], mockDb, 'en');
        
        expect(mockMessage.reply).toHaveBeenCalledWith('Please specify a number to set the count to');
        expect(mockPrepare).not.toHaveBeenCalled();
    });

    it('should reject invalid numbers', async () => {
        mockMessage.author.id = mockMessage.guild.ownerId;
        
        await command.execute(mockMessage, ['not_a_number'], mockDb, 'en');
        
        expect(mockMessage.reply).toHaveBeenCalledWith('Please provide a valid number');
        expect(mockPrepare).not.toHaveBeenCalled();
    });

    it('should reject negative numbers', async () => {
        mockMessage.author.id = mockMessage.guild.ownerId;
        
        await command.execute(mockMessage, ['-42'], mockDb, 'en');
        
        expect(mockMessage.reply).toHaveBeenCalledWith('Count cannot be negative');
        expect(mockPrepare).not.toHaveBeenCalled();
    });

    it('should successfully set count and update highest count if needed', async () => {
        mockMessage.author.id = mockMessage.guild.ownerId;
        const mockRun = jest.fn();
        mockPrepare.mockReturnValue({ run: mockRun });
        
        await command.execute(mockMessage, ['42'], mockDb, 'en');
        
        expect(mockPrepare).toHaveBeenCalledWith(`
                UPDATE guild_settings 
                SET current_count = ?,
                    highest_count = CASE WHEN ? > highest_count THEN ? ELSE highest_count END
                WHERE guild_id = ?
            `);
        expect(mockRun).toHaveBeenCalledWith(42, 42, 42, '456');
        expect(mockMessage.reply).toHaveBeenCalledWith('Count set to 42');
    });

    it('should handle database errors gracefully', async () => {
        mockMessage.author.id = mockMessage.guild.ownerId;
        mockPrepare.mockImplementation(() => {
            throw new Error('Database error');
        });
        
        await command.execute(mockMessage, ['42'], mockDb, 'en');
        
        expect(mockMessage.reply).toHaveBeenCalledWith('An error occurred while setting the count');
    });
}); 