const SetSavesCommand = require('../../commands/setsaves.command');
const { t } = require('../../lang/i18n');

// Mock i18n
jest.mock('../../lang/i18n', () => ({
    t: jest.fn((key, lang, params) => {
        if (key === 'owner_only_command') return 'This command is for server owners only';
        if (key === 'setsaves_usage') return 'Please specify a number of saves to set';
        if (key === 'setsaves_invalid_number') return 'Please provide a valid number';
        if (key === 'setsaves_negative') return 'Saves cannot be negative';
        if (key === 'setsaves_success') return `Saves set to ${params.saves}`;
        if (key === 'setsaves_error') return 'An error occurred while setting saves';
        return key;
    })
}));

describe('SetSavesCommand', () => {
    let command;
    let mockMessage;
    let mockDb;
    let mockPrepare;

    beforeEach(() => {
        command = new SetSavesCommand();
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
        expect(command.name).toBe('setsaves');
        expect(command.description).toBe('Set the number of saves for the server (server owner only)');
        expect(command.hidden).toBe(true);
    });

    it('should reject non-owner users', async () => {
        await command.execute(mockMessage, [], mockDb, 'en');
        
        expect(mockMessage.reply).toHaveBeenCalledWith('This command is for server owners only');
        expect(mockPrepare).not.toHaveBeenCalled();
    });

    it('should require a saves argument', async () => {
        mockMessage.author.id = mockMessage.guild.ownerId;
        
        await command.execute(mockMessage, [], mockDb, 'en');
        
        expect(mockMessage.reply).toHaveBeenCalledWith('Please specify a number of saves to set');
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
        
        await command.execute(mockMessage, ['-1.5'], mockDb, 'en');
        
        expect(mockMessage.reply).toHaveBeenCalledWith('Saves cannot be negative');
        expect(mockPrepare).not.toHaveBeenCalled();
    });

    it('should successfully set saves with integer value', async () => {
        mockMessage.author.id = mockMessage.guild.ownerId;
        const mockRun = jest.fn();
        mockPrepare.mockReturnValue({ run: mockRun });
        
        await command.execute(mockMessage, ['5'], mockDb, 'en');
        
        expect(mockPrepare).toHaveBeenCalledWith(`
                UPDATE guild_settings 
                SET saves = ?
                WHERE guild_id = ?
            `);
        expect(mockRun).toHaveBeenCalledWith(5.000, '456');
        expect(mockMessage.reply).toHaveBeenCalledWith('Saves set to 5.000');
    });

    it('should successfully set saves with decimal value and round to 3 places', async () => {
        mockMessage.author.id = mockMessage.guild.ownerId;
        const mockRun = jest.fn();
        mockPrepare.mockReturnValue({ run: mockRun });
        
        await command.execute(mockMessage, ['5.12345'], mockDb, 'en');
        
        expect(mockPrepare).toHaveBeenCalledWith(`
                UPDATE guild_settings 
                SET saves = ?
                WHERE guild_id = ?
            `);
        expect(mockRun).toHaveBeenCalledWith(5.123, '456');
        expect(mockMessage.reply).toHaveBeenCalledWith('Saves set to 5.123');
    });

    it('should handle database errors gracefully', async () => {
        mockMessage.author.id = mockMessage.guild.ownerId;
        mockPrepare.mockImplementation(() => {
            throw new Error('Database error');
        });
        
        await command.execute(mockMessage, ['5'], mockDb, 'en');
        
        expect(mockMessage.reply).toHaveBeenCalledWith('An error occurred while setting saves');
    });
}); 