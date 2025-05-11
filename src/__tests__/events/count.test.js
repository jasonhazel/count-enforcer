const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const countEvent = require('../../events/count');

describe('Count Event Handler', () => {
    let db;

    beforeAll(() => {
        // Create a test database in memory
        db = new Database(':memory:');
        
        // Create necessary tables
        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                discriminator TEXT,
                active BOOLEAN DEFAULT TRUE,
                language TEXT DEFAULT 'en',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                saves INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS guild_settings (
                guild_id TEXT PRIMARY KEY,
                prefix TEXT DEFAULT '!',
                current_count INTEGER DEFAULT 0,
                highest_count INTEGER DEFAULT 0,
                failed_count INTEGER DEFAULT 0
            );
        `);
    });

    afterAll(() => {
        // Close the database connection
        db.close();
    });

    beforeEach(() => {
        // Clear tables before each test
        db.prepare('DELETE FROM users').run();
        db.prepare('DELETE FROM guild_settings').run();
    });

    // Helper function to create a basic message mock
    const createMessageMock = (userId, guildId, content, isBot = false) => ({
        author: {
            id: userId,
            bot: isBot
        },
        guild: {
            id: guildId,
            roles: {
                cache: {
                    find: jest.fn().mockReturnValue({
                        id: 'role123'
                    })
                }
            }
        },
        member: {
            roles: {
                cache: {
                    has: jest.fn().mockReturnValue(true)
                }
            }
        },
        content,
        react: jest.fn(),
        reply: jest.fn()
    });

    test('should ignore bot messages', async () => {
        const message = createMessageMock('123456789', '987654321', '6', true);
        await countEvent.execute(message, db);
        expect(message.react).not.toHaveBeenCalled();
    });

    test('should ignore users without counter role', async () => {
        const message = createMessageMock('123456789', '987654321', '6');
        message.member.roles.cache.has.mockReturnValue(false);
        await countEvent.execute(message, db);
        expect(message.react).not.toHaveBeenCalled();
    });

    test('should ignore unregistered users', async () => {
        const message = createMessageMock('123456789', '987654321', '6');
        await countEvent.execute(message, db);
        expect(message.react).not.toHaveBeenCalled();
    });

    test('should ignore inactive users', async () => {
        const userId = '123456789';
        const guildId = '987654321';
        
        db.prepare(`
            INSERT INTO users (user_id, username, active, language)
            VALUES (?, ?, ?, ?)
        `).run(userId, 'testuser', 0, 'en');

        const message = createMessageMock(userId, guildId, '6');
        await countEvent.execute(message, db);
        expect(message.react).not.toHaveBeenCalled();
    });

    test('should ignore non-numeric messages', async () => {
        const userId = '123456789';
        const guildId = '987654321';
        
        db.prepare(`
            INSERT INTO users (user_id, username, active, language)
            VALUES (?, ?, ?, ?)
        `).run(userId, 'testuser', 1, 'en');

        const message = createMessageMock(userId, guildId, 'not a number');
        await countEvent.execute(message, db);
        expect(message.react).not.toHaveBeenCalled();
    });

    test('should update highest count when exceeded', async () => {
        const userId = '123456789';
        const guildId = '987654321';
        
        db.prepare(`
            INSERT INTO users (user_id, username, active, language)
            VALUES (?, ?, ?, ?)
        `).run(userId, 'testuser', 1, 'en');

        db.prepare(`
            INSERT INTO guild_settings (guild_id, current_count, highest_count)
            VALUES (?, ?, ?)
        `).run(guildId, 5, 5);

        const message = createMessageMock(userId, guildId, '6');
        await countEvent.execute(message, db);

        const settings = db.prepare('SELECT * FROM guild_settings WHERE guild_id = ?').get(guildId);
        expect(settings.highest_count).toBe(6);
        expect(message.react).toHaveBeenCalledWith('✅');
    });

    test('should handle incorrect count with warning for counts less than 10', async () => {
        const userId = '123456789';
        const guildId = '987654321';
        
        db.prepare(`
            INSERT INTO users (user_id, username, active, language)
            VALUES (?, ?, ?, ?)
        `).run(userId, 'testuser', 1, 'en');

        db.prepare(`
            INSERT INTO guild_settings (guild_id, current_count)
            VALUES (?, ?)
        `).run(guildId, 5);

        const message = createMessageMock(userId, guildId, '7');
        await countEvent.execute(message, db);

        expect(message.reply).toHaveBeenCalled();
        expect(message.react).toHaveBeenCalledWith('⚠️');
    });

    test('should increment count for correct number', async () => {
        // Setup test data
        const userId = '123456789';
        const guildId = '987654321';
        
        db.prepare(`
            INSERT INTO users (user_id, username, active, language)
            VALUES (?, ?, ?, ?)
        `).run(userId, 'testuser', 1, 'en');

        db.prepare(`
            INSERT INTO guild_settings (guild_id, current_count)
            VALUES (?, ?)
        `).run(guildId, 5);

        // Mock Discord.js message
        const message = {
            author: {
                id: userId,
                bot: false
            },
            guild: {
                id: guildId,
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue({
                            id: 'role123'
                        })
                    }
                }
            },
            member: {
                roles: {
                    cache: {
                        has: jest.fn().mockReturnValue(true)
                    }
                }
            },
            content: '6',
            react: jest.fn()
        };

        await countEvent.execute(message, db);

        // Verify count was incremented
        const settings = db.prepare('SELECT * FROM guild_settings WHERE guild_id = ?').get(guildId);
        expect(settings.current_count).toBe(6);

        // Verify reaction was added
        expect(message.react).toHaveBeenCalledWith('✅');
    });

    test('should handle incorrect count with saves', async () => {
        // Setup test data
        const userId = '123456789';
        const guildId = '987654321';
        
        db.prepare(`
            INSERT INTO users (user_id, username, active, language, saves)
            VALUES (?, ?, ?, ?, ?)
        `).run(userId, 'testuser', 1, 'en', 1);

        db.prepare(`
            INSERT INTO guild_settings (guild_id, current_count)
            VALUES (?, ?)
        `).run(guildId, 10);

        // Mock Discord.js message
        const message = {
            author: {
                id: userId,
                bot: false
            },
            guild: {
                id: guildId,
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue({
                            id: 'role123'
                        })
                    }
                }
            },
            member: {
                roles: {
                    cache: {
                        has: jest.fn().mockReturnValue(true)
                    }
                }
            },
            content: '12', // Incorrect number
            react: jest.fn(),
            reply: jest.fn()
        };

        await countEvent.execute(message, db);

        // Verify saves were decremented
        const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);
        expect(user.saves).toBe(0);

        // Verify count wasn't reset
        const settings = db.prepare('SELECT * FROM guild_settings WHERE guild_id = ?').get(guildId);
        expect(settings.current_count).toBe(10);

        // Verify reaction was added
        expect(message.react).toHaveBeenCalledWith('❌');
    });

    test('should reset count when no saves left', async () => {
        // Setup test data
        const userId = '123456789';
        const guildId = '987654321';
        
        db.prepare(`
            INSERT INTO users (user_id, username, active, language, saves)
            VALUES (?, ?, ?, ?, ?)
        `).run(userId, 'testuser', 1, 'en', 0);

        db.prepare(`
            INSERT INTO guild_settings (guild_id, current_count, failed_count)
            VALUES (?, ?, ?)
        `).run(guildId, 10, 0);

        // Mock Discord.js message
        const message = {
            author: {
                id: userId,
                bot: false
            },
            guild: {
                id: guildId,
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue({
                            id: 'role123'
                        })
                    }
                }
            },
            member: {
                roles: {
                    cache: {
                        has: jest.fn().mockReturnValue(true)
                    }
                }
            },
            content: '12', // Incorrect number
            react: jest.fn(),
            reply: jest.fn()
        };

        await countEvent.execute(message, db);

        // Verify count was reset
        const settings = db.prepare('SELECT * FROM guild_settings WHERE guild_id = ?').get(guildId);
        expect(settings.current_count).toBe(0);
        expect(settings.failed_count).toBe(1);

        // Verify reaction was added
        expect(message.react).toHaveBeenCalledWith('❌');
    });
}); 