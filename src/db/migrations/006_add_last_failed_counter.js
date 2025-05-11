module.exports = {
    name: '006_add_last_failed_counter',
    up: (db) => {
        // Add last_failed_counter column to guild_settings table
        db.prepare(`
            ALTER TABLE guild_settings 
            ADD COLUMN last_failed_counter TEXT
        `).run();
    },
    down: (db) => {
        // SQLite doesn't support dropping columns directly
        // We would need to create a new table without the column and copy data
        // For now, we'll just log that this operation isn't supported
        console.log('Rolling back last_failed_counter column is not supported in SQLite');
    }
}; 