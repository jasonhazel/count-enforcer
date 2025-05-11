const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const RegisterCommand = require('../../commands/register.command');

describe('Register Command', () => {
    let db;
    let command;

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
        `);

        command = new RegisterCommand();
    });

    afterAll(() => {
        // Close the database connection
        db.close();
    });

    beforeEach(() => {
        // Clear users table before each test
        db.prepare('DELETE FROM users').run();
    });

    test('should register a new user', async () => {
        // Mock Discord.js message
        const message = {
            author: {
                id: '123456789',
                username: 'testuser',
                discriminator: '1234'
            },
            guild: {
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue({
                            id: 'role123'
                        })
                    }
                },
                members: {
                    me: {
                        permissions: {
                            has: jest.fn().mockReturnValue(true)
                        },
                        roles: {
                            highest: {
                                position: 2
                            }
                        }
                    }
                }
            },
            member: {
                roles: {
                    add: jest.fn()
                }
            },
            reply: jest.fn()
        };

        await command.execute(message, [], db, 'en');

        // Verify user was created in database
        const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get('123456789');
        expect(user).toBeTruthy();
        expect(user.username).toBe('testuser');
        expect(user.discriminator).toBe('1234');
        expect(user.active).toBe(1);
        expect(user.language).toBe('en');

        // Verify message was sent
        expect(message.reply).toHaveBeenCalled();
    });

    test('should update existing user', async () => {
        // Insert test user
        db.prepare(`
            INSERT INTO users (user_id, username, discriminator, active, language)
            VALUES (?, ?, ?, ?, ?)
        `).run('123456789', 'oldname', '4321', 0, 'es');

        // Mock Discord.js message
        const message = {
            author: {
                id: '123456789',
                username: 'newname',
                discriminator: '1234'
            },
            guild: {
                roles: {
                    cache: {
                        find: jest.fn().mockReturnValue({
                            id: 'role123'
                        })
                    }
                },
                members: {
                    me: {
                        permissions: {
                            has: jest.fn().mockReturnValue(true)
                        },
                        roles: {
                            highest: {
                                position: 2
                            }
                        }
                    }
                }
            },
            member: {
                roles: {
                    add: jest.fn()
                }
            },
            reply: jest.fn()
        };

        await command.execute(message, [], db, 'en');

        // Verify user was updated
        const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get('123456789');
        expect(user).toBeTruthy();
        expect(user.username).toBe('newname');
        expect(user.discriminator).toBe('1234');
        expect(user.active).toBe(1);
        expect(user.language).toBe('es');

        // Verify message was sent
        expect(message.reply).toHaveBeenCalled();
    });
}); 