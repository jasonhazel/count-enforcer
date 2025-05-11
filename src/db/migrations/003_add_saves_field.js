module.exports = {
    name: '003_add_saves_field',
    up: (db) => {
        // Add saves column to users table
        db.prepare(`
            ALTER TABLE users 
            ADD COLUMN saves INTEGER DEFAULT 0
        `).run();
    },
    down: (db) => {
        // SQLite doesn't support dropping columns directly
        // We would need to create a new table without the column and copy data
        // For now, we'll just log that this operation isn't supported
        console.log('Rolling back saves column is not supported in SQLite');
    }
}; 