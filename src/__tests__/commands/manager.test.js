const CommandManager = require('../../commands/manager');

describe('CommandManager', () => {
    let manager;
    let mockCommand;

    beforeEach(() => {
        manager = new CommandManager();
        mockCommand = {
            name: 'test',
            execute: jest.fn()
        };
    });

    test('registers and retrieves a command by name', () => {
        manager.registerCommand(mockCommand);
        expect(manager.getCommand('test')).toBe(mockCommand);
    });

    test('throws if registering a command without a name', () => {
        expect(() => manager.registerCommand({})).toThrow('Command must have a name property');
    });

    test('executes a registered command', async () => {
        manager.registerCommand(mockCommand);
        const message = {};
        const args = ['test', 'foo', 'bar'];
        const db = {};
        const lang = 'en';
        await manager.executeCommand(message, [...args], db, lang);
        expect(mockCommand.execute).toHaveBeenCalledWith(message, ['foo', 'bar'], db, lang);
    });

    test('does nothing if command is not registered', async () => {
        const message = {};
        const args = ['notfound', 'foo'];
        const db = {};
        const lang = 'en';
        await expect(manager.executeCommand(message, [...args], db, lang)).resolves.toBeUndefined();
    });
}); 