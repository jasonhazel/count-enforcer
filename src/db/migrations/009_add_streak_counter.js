module.exports = {
    up: async (db) => {
        // Add streak counter columns to users table
        await db.exec(`
            ALTER TABLE users
            ADD COLUMN current_streak INTEGER DEFAULT 0
        `);
        await db.exec(`
            ALTER TABLE users
            ADD COLUMN highest_streak INTEGER DEFAULT 0
        `);
    },

    down: async (db) => {
        // Remove streak counter columns
        await db.exec(`
            ALTER TABLE users
            DROP COLUMN current_streak
        `);
        await db.exec(`
            ALTER TABLE users
            DROP COLUMN highest_streak
        `);
    }
}; 