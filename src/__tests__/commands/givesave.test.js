const GiveSaveCommand = require('../../commands/givesave.command');
const { t } = require('../../lang/i18n');

// Mock i18n
jest.mock('../../lang/i18n', () => ({
    t: jest.fn((key, lang, params) => {
        if (key === 'owner_only') return 'This command is for server owners only';
        if (key === 'givesave_no_target') return 'Please specify a user to give a save to';
        if (key === 'givesave_user_not_found') return `User ${params?.target || 'unknown'} not found`;
        if (key === 'givesave_success') return `Successfully gave a save to ${params.target}`;
        return key;
    })
}));

describe('GiveSaveCommand', () => {
    let command;
    let mockMessage;
    let mockDb;
    let mockPrepare;

    beforeEach(() => {
        command = new GiveSaveCommand();
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
                ownerId: '456'
            }
        };
        t.mockClear();
    });

    it('should be constructed with correct name, description and hidden status', () => {
        expect(command.name).toBe('givesave');
        expect(command.description).toBe('Give a save to a user');
        expect(command.hidden).toBe(true);
    });

    it('should reject non-owner users', async () => {
        await command.execute(mockMessage, [], mockDb, 'en');
        
        expect(mockMessage.reply).toHaveBeenCalledWith('This command is for server owners only');
        expect(mockPrepare).not.toHaveBeenCalled();
    });

    it('should require a target username', async () => {
        mockMessage.author.id = mockMessage.guild.ownerId;
        
        await command.execute(mockMessage, [], mockDb, 'en');
        
        expect(mockMessage.reply).toHaveBeenCalledWith('Please specify a user to give a save to');
        expect(mockPrepare).not.toHaveBeenCalled();
    });

    it('should handle non-existent users', async () => {
        mockMessage.author.id = mockMessage.guild.ownerId;
        mockPrepare.mockReturnValue({
            get: jest.fn().mockReturnValue(null)
        });
        
        await command.execute(mockMessage, ['nonexistentuser'], mockDb, 'en');
        
        expect(mockMessage.reply).toHaveBeenCalledWith('User nonexistentuser not found');
        expect(mockPrepare).toHaveBeenCalledWith('SELECT * FROM users WHERE username = ?');
    });

    it('should successfully give a save to existing user', async () => {
        mockMessage.author.id = mockMessage.guild.ownerId;
        const mockUser = { user_id: '789', username: 'testuser' };
        const mockGet = jest.fn().mockReturnValue(mockUser);
        const mockRun = jest.fn();
        
        mockPrepare.mockImplementation((query) => {
            if (query.includes('SELECT')) {
                return { get: mockGet };
            }
            return { run: mockRun };
        });
        
        await command.execute(mockMessage, ['testuser'], mockDb, 'en');
        
        expect(mockPrepare).toHaveBeenCalledWith('SELECT * FROM users WHERE username = ?');
        expect(mockPrepare).toHaveBeenCalledWith('UPDATE users SET saves = saves + 1 WHERE user_id = ?');
        expect(mockRun).toHaveBeenCalledWith('789');
        expect(mockMessage.reply).toHaveBeenCalledWith('Successfully gave a save to testuser');
    });

    it('should handle database errors gracefully', async () => {
        mockMessage.author.id = mockMessage.guild.ownerId;
        mockPrepare.mockImplementation(() => {
            throw new Error('Database error');
        });
        
        await command.execute(mockMessage, ['testuser'], mockDb, 'en');
        
        expect(mockMessage.reply).toHaveBeenCalledWith('User testuser not found');
    });
}); 