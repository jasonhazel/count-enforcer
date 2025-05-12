const fs = require('fs');
const path = require('path');

class MigrationManager {
    constructor(db) {
        this.db = db;
        this.migrationsPath = path.join(__dirname, 'migrations');
        this.initializeMigrationsTable();
    }

    initializeMigrationsTable() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    getAppliedMigrations() {
        return this.db.prepare('SELECT name FROM migrations ORDER BY id').all()
            .map(row => row.name);
    }

    async runMigrations() {
        const appliedMigrations = this.getAppliedMigrations();
        const migrationFiles = fs.readdirSync(this.migrationsPath)
            .filter(file => file.endsWith('.js'))
            .sort();

        for (const file of migrationFiles) {
            if (!appliedMigrations.includes(file)) {
                console.log(`Running migration: ${file}`);
                try {
                    const migration = require(path.join(this.migrationsPath, file));
                    await migration.up(this.db);
                    
                    this.db.prepare('INSERT INTO migrations (name) VALUES (?)')
                        .run(file);
                    
                    console.log(`Successfully applied migration: ${file}`);
                } catch (error) {
                    console.error(`Error applying migration ${file}:`, error);
                    throw error;
                }
            }
        }
    }
}

module.exports = MigrationManager; 