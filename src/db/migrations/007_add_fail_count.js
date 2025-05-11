module.exports = {
    name: '007_add_fail_count',
    up: (db) => {
        // Add fail_count column to users table
        db.prepare(`
            ALTER TABLE users 
            ADD COLUMN fail_count INTEGER DEFAULT 0
        `).run();
    },
    down: (db) => {
        // SQLite doesn't support dropping columns directly
        // We would need to create a new table without the column and copy data
        // For now, we'll just log that this operation isn't supported
        console.log('Rolling back fail_count column is not supported in SQLite');
    }
}; 