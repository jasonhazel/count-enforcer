module.exports = {
    name: '010_add_guild_saves',
    up: (db) => {
        // Add saves column to guild_settings table with 3 decimal places
        db.prepare(`
            ALTER TABLE guild_settings 
            ADD COLUMN saves DECIMAL(10,3) DEFAULT 0.000
        `).run();
    },
    down: (db) => {
        // SQLite doesn't support dropping columns directly
        // We would need to create a new table without the column and copy data
        // For now, we'll just log that this operation isn't supported
        console.log('Rolling back saves column is not supported in SQLite');
    }
}; 