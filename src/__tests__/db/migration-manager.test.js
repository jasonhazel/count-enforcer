const fs = require('fs');
const path = require('path');
const MigrationManager = require('../../db/migration-manager');

// Mock fs and path modules
jest.mock('fs');
jest.mock('path');

describe('MigrationManager', () => {
    let mockDb;
    let mockMigration;
    let consoleSpy;

    beforeEach(() => {
        // Mock database
        mockDb = {
            exec: jest.fn(),
            prepare: jest.fn().mockReturnValue({
                all: jest.fn().mockReturnValue([]),
                run: jest.fn()
            })
        };

        // Mock migration file
        mockMigration = {
            up: jest.fn()
        };

        // Mock fs.readdirSync
        fs.readdirSync.mockReturnValue(['001_initial.js', '002_add_users.js']);

        // Mock path.join
        path.join.mockImplementation((...args) => args.join('/'));

        // Mock require
        jest.doMock('/migrations/001_initial.js', () => mockMigration, { virtual: true });
        jest.doMock('/migrations/002_add_users.js', () => mockMigration, { virtual: true });

        // Mock console methods
        consoleSpy = {
            log: jest.spyOn(console, 'log').mockImplementation(),
            error: jest.spyOn(console, 'error').mockImplementation()
        };

        // Reset require cache
        jest.resetModules();
    });

    afterEach(() => {
        jest.clearAllMocks();
        consoleSpy.log.mockRestore();
        consoleSpy.error.mockRestore();
    });

    test('should initialize migrations table on construction', () => {
        new MigrationManager(mockDb);
        expect(mockDb.exec).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS migrations'));
    });

    test('should get applied migrations', () => {
        const manager = new MigrationManager(mockDb);
        mockDb.prepare().all.mockReturnValueOnce([
            { name: '001_initial.js' },
            { name: '002_add_users.js' }
        ]);

        const migrations = manager.getAppliedMigrations();
        expect(migrations).toEqual(['001_initial.js', '002_add_users.js']);
        expect(mockDb.prepare).toHaveBeenCalledWith('SELECT name FROM migrations ORDER BY id');
    });

    test('should run new migrations', async () => {
        const manager = new MigrationManager(mockDb);
        mockDb.prepare().all.mockReturnValueOnce([]); // No applied migrations

        // Mock require for this test
        jest.doMock(path.join(manager.migrationsPath, '001_initial.js'), () => mockMigration, { virtual: true });
        jest.doMock(path.join(manager.migrationsPath, '002_add_users.js'), () => mockMigration, { virtual: true });

        await manager.runMigrations();

        expect(mockMigration.up).toHaveBeenCalledTimes(2);
        expect(mockDb.prepare().run).toHaveBeenCalledTimes(2);
        expect(consoleSpy.log).toHaveBeenCalledWith('Running migration: 001_initial.js');
        expect(consoleSpy.log).toHaveBeenCalledWith('Successfully applied migration: 001_initial.js');
    });

    test('should skip already applied migrations', async () => {
        const manager = new MigrationManager(mockDb);
        mockDb.prepare().all.mockReturnValueOnce([
            { name: '001_initial.js' }
        ]);

        // Mock require for this test
        jest.doMock(path.join(manager.migrationsPath, '002_add_users.js'), () => mockMigration, { virtual: true });

        await manager.runMigrations();

        expect(mockMigration.up).toHaveBeenCalledTimes(1);
        expect(mockDb.prepare().run).toHaveBeenCalledTimes(1);
        expect(consoleSpy.log).not.toHaveBeenCalledWith('Running migration: 001_initial.js');
    });

    test('should handle migration errors', async () => {
        const manager = new MigrationManager(mockDb);
        mockDb.prepare().all.mockReturnValueOnce([]); // No applied migrations

        // Mock require for this test with a failing migration
        const failingMigration = {
            up: jest.fn().mockImplementation(() => {
                throw new Error('Migration failed');
            })
        };
        jest.doMock(path.join(manager.migrationsPath, '001_initial.js'), () => failingMigration, { virtual: true });

        await expect(manager.runMigrations()).rejects.toThrow('Migration failed');
        expect(consoleSpy.error).toHaveBeenCalledWith(
            'Error applying migration 001_initial.js:',
            expect.any(Error)
        );
    });
}); 