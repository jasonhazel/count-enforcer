module.exports = {
    name: '004_update_saves_default',
    up: (db) => {
        // SQLite doesn't support changing column defaults directly
        // We need to:
        // 1. Create a new table with the desired default
        // 2. Copy data from old table
        // 3. Drop old table
        // 4. Rename new table to old name

        // Create new table with updated default
        db.prepare(`
            CREATE TABLE users_new (
                user_id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                discriminator TEXT,
                active INTEGER DEFAULT 1,
                language TEXT DEFAULT 'en',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
                saves INTEGER DEFAULT 1
            )
        `).run();

        // Copy data from old table
        db.prepare(`
            INSERT INTO users_new 
            SELECT user_id, username, discriminator, active, language, created_at, last_seen, 
                   COALESCE(saves, 1) as saves
            FROM users
        `).run();

        // Drop old table
        db.prepare('DROP TABLE users').run();

        // Rename new table to old name
        db.prepare('ALTER TABLE users_new RENAME TO users').run();
    },
    down: (db) => {
        // Similar process to revert back to default 0
        db.prepare(`
            CREATE TABLE users_new (
                user_id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                discriminator TEXT,
                active INTEGER DEFAULT 1,
                language TEXT DEFAULT 'en',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
                saves INTEGER DEFAULT 0
            )
        `).run();

        db.prepare(`
            INSERT INTO users_new 
            SELECT user_id, username, discriminator, active, language, created_at, last_seen, 
                   COALESCE(saves, 0) as saves
            FROM users
        `).run();

        db.prepare('DROP TABLE users').run();
        db.prepare('ALTER TABLE users_new RENAME TO users').run();
    }
}; 