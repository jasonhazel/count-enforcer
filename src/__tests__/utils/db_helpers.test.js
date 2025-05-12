const {
    getUserLanguage,
    updateUserLastSeen,
    createNewUser,
    deactivateUser,
    getGuildSettings,
    createGuildSettings
} = require('../../utils/db_helpers');

describe('Database Helper Functions', () => {
    let mockDb;
    let mockPrepare;
    let mockGet;
    let mockRun;

    beforeEach(() => {
        mockGet = jest.fn();
        mockRun = jest.fn();
        mockPrepare = jest.fn().mockReturnValue({
            get: mockGet,
            run: mockRun
        });
        mockDb = {
            prepare: mockPrepare
        };
    });

    describe('getUserLanguage', () => {
        it('should return user language when user exists', () => {
            mockGet.mockReturnValue({ language: 'fr' });
            
            const result = getUserLanguage(mockDb, '123');
            
            expect(mockPrepare).toHaveBeenCalledWith('SELECT language FROM users WHERE user_id = ?');
            expect(mockGet).toHaveBeenCalledWith('123');
            expect(result).toBe('fr');
        });

        it('should return default language (en) when user does not exist', () => {
            mockGet.mockReturnValue(null);
            
            const result = getUserLanguage(mockDb, '123');
            
            expect(result).toBe('en');
        });
    });

    describe('updateUserLastSeen', () => {
        it('should update user last seen information', () => {
            updateUserLastSeen(mockDb, '123', 'testUser', '1234');
            
            expect(mockPrepare).toHaveBeenCalledWith(`
        UPDATE users 
        SET username = ?, 
            discriminator = ?, 
            last_seen = CURRENT_TIMESTAMP, 
            active = TRUE 
        WHERE user_id = ?
    `);
            expect(mockRun).toHaveBeenCalledWith('testUser', '1234', '123');
        });
    });

    describe('createNewUser', () => {
        it('should create a new user', () => {
            createNewUser(mockDb, '123', 'testUser', '1234', 'en');
            
            expect(mockPrepare).toHaveBeenCalledWith(`
        INSERT INTO users (user_id, username, discriminator, active, language) 
        VALUES (?, ?, ?, TRUE, ?)
    `);
            expect(mockRun).toHaveBeenCalledWith('123', 'testUser', '1234', 'en');
        });
    });

    describe('deactivateUser', () => {
        it('should deactivate a user', () => {
            deactivateUser(mockDb, '123');
            
            expect(mockPrepare).toHaveBeenCalledWith(`
        UPDATE users 
        SET active = FALSE, 
            last_seen = CURRENT_TIMESTAMP 
        WHERE user_id = ?
    `);
            expect(mockRun).toHaveBeenCalledWith('123');
        });
    });

    describe('getGuildSettings', () => {
        it('should return guild settings when guild exists', () => {
            const mockSettings = { guild_id: '123', prefix: '!', current_count: 0 };
            mockGet.mockReturnValue(mockSettings);
            
            const result = getGuildSettings(mockDb, '123');
            
            expect(mockPrepare).toHaveBeenCalledWith('SELECT * FROM guild_settings WHERE guild_id = ?');
            expect(mockGet).toHaveBeenCalledWith('123');
            expect(result).toBe(mockSettings);
        });

        it('should return null when guild does not exist', () => {
            mockGet.mockReturnValue(null);
            
            const result = getGuildSettings(mockDb, '123');
            
            expect(result).toBeNull();
        });
    });

    describe('createGuildSettings', () => {
        it('should create new guild settings with default values', () => {
            createGuildSettings(mockDb, '123');
            
            expect(mockPrepare).toHaveBeenCalledWith(`
        INSERT INTO guild_settings (guild_id, prefix, current_count, highest_count, failed_count, saves)
        VALUES (?, '!', 0, 0, 0, 1.000)
    `);
            expect(mockRun).toHaveBeenCalledWith('123');
        });
    });
}); 