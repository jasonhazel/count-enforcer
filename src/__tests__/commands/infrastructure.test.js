const BaseCommand = require('../../commands/base');
const CommandManager = require('../../commands/manager');

// Mock Discord.js Message
class MockMessage {
    constructor(content) {
        this.content = content;
    }
}

describe('Command Infrastructure', () => {
    describe('BaseCommand', () => {
        test('should create a command with name and description', () => {
            const command = new BaseCommand('test', 'Test command');
            expect(command.name).toBe('test');
            expect(command.description).toBe('Test command');
        });

        test('should throw error when execute is not implemented', async () => {
            const command = new BaseCommand('test', 'Test command');
            const message = new MockMessage('!test');
            const args = [];
            const db = {};
            const lang = {};

            await expect(command.execute(message, args, db, lang))
                .rejects
                .toThrow('Execute method must be implemented by command class');
        });
    });

    describe('CommandManager', () => {
        let manager;
        let mockCommand;

        beforeEach(() => {
            manager = new CommandManager();
            mockCommand = {
                name: 'test',
                description: 'Test command',
                execute: jest.fn()
            };
        });

        test('should register a command', () => {
            manager.registerCommand(mockCommand);
            expect(manager.getCommand('test')).toBe(mockCommand);
        });

        test('should throw error when registering command without name', () => {
            const invalidCommand = {
                description: 'Test command',
                execute: jest.fn()
            };

            expect(() => manager.registerCommand(invalidCommand))
                .toThrow('Command must have a name property');
        });

        test('should return undefined for non-existent command', () => {
            expect(manager.getCommand('nonexistent')).toBeUndefined();
        });

        test('should execute registered command', async () => {
            manager.registerCommand(mockCommand);
            const message = new MockMessage('!test arg1 arg2');
            const args = ['test', 'arg1', 'arg2'];
            const db = {};
            const lang = {};

            await manager.executeCommand(message, args, db, lang);
            expect(mockCommand.execute).toHaveBeenCalledWith(message, ['arg1', 'arg2'], db, lang);
        });

        test('should not execute non-existent command', async () => {
            const message = new MockMessage('!nonexistent');
            const args = ['nonexistent'];
            const db = {};
            const lang = {};

            await expect(manager.executeCommand(message, args, db, lang))
                .resolves
                .not.toThrow();
        });
    });
}); 