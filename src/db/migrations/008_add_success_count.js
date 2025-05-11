module.exports = {
    name: '008_add_success_count',
    up: (db) => {
        // Add success_count column to users table
        db.prepare(`
            ALTER TABLE users 
            ADD COLUMN success_count INTEGER DEFAULT 0
        `).run();
    },
    down: (db) => {
        // SQLite doesn't support dropping columns directly
        // We would need to create a new table without the column and copy data
        // For now, we'll just log that this operation isn't supported
        console.log('Rolling back success_count column is not supported in SQLite');
    }
}; 