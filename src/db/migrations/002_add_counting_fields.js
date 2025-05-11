module.exports = {
    async up(db) {
        // Add new columns to guild_settings
        db.exec(`
            ALTER TABLE guild_settings ADD COLUMN current_count INTEGER DEFAULT 0;
            ALTER TABLE guild_settings ADD COLUMN highest_count INTEGER DEFAULT 0;
            ALTER TABLE guild_settings ADD COLUMN failed_count INTEGER DEFAULT 0;
        `);
    }
}; 