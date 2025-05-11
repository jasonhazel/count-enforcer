const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

describe('Database Migrations', () => {
    let db;

    beforeAll(() => {
        // Create a test database in memory
        db = new Database(':memory:');
    });

    afterAll(() => {
        // Close the database connection
        db.close();
    });

    beforeEach(() => {
        // Clear all tables before each test
        db.prepare('DROP TABLE IF EXISTS users').run();
        db.prepare('DROP TABLE IF EXISTS guild_settings').run();
    });

    test('should create initial schema', () => {
        // Run initial migration
        db.exec(`
            CREATE TABLE IF NOT EXISTS guild_settings (
                guild_id TEXT PRIMARY KEY,
                prefix TEXT DEFAULT '!'
            );

            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                discriminator TEXT,
                active BOOLEAN DEFAULT TRUE,
                language TEXT DEFAULT 'en',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Verify tables exist
        const tables = db.prepare(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name IN ('users', 'guild_settings')
        `).all();

        expect(tables).toHaveLength(2);
        expect(tables.map(t => t.name)).toContain('users');
        expect(tables.map(t => t.name)).toContain('guild_settings');
    });

    test('should add counting fields to guild_settings', () => {
        // Create initial schema
        db.exec(`
            CREATE TABLE IF NOT EXISTS guild_settings (
                guild_id TEXT PRIMARY KEY,
                prefix TEXT DEFAULT '!'
            );
        `);

        // Add counting fields
        db.exec(`
            ALTER TABLE guild_settings ADD COLUMN current_count INTEGER DEFAULT 0;
            ALTER TABLE guild_settings ADD COLUMN highest_count INTEGER DEFAULT 0;
            ALTER TABLE guild_settings ADD COLUMN failed_count INTEGER DEFAULT 0;
        `);

        // Verify columns exist
        const columns = db.prepare(`
            PRAGMA table_info(guild_settings)
        `).all();

        const columnNames = columns.map(col => col.name);
        expect(columnNames).toContain('current_count');
        expect(columnNames).toContain('highest_count');
        expect(columnNames).toContain('failed_count');
    });

    test('should add saves field to users', () => {
        // Create initial schema
        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                discriminator TEXT,
                active BOOLEAN DEFAULT TRUE,
                language TEXT DEFAULT 'en',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Add saves field
        db.exec(`
            ALTER TABLE users ADD COLUMN saves INTEGER DEFAULT 0;
        `);

        // Verify column exists
        const columns = db.prepare(`
            PRAGMA table_info(users)
        `).all();

        const columnNames = columns.map(col => col.name);
        expect(columnNames).toContain('saves');
    });
}); 