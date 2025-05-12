const CommandManager = require('../../commands/manager');

class MockCommand {
    constructor(name) {
        this.name = name;
        this.execute = jest.fn();
    }
}

describe('CommandManager', () => {
    let manager;
    let mockMessage;
    let mockDb;

    beforeEach(() => {
        manager = new CommandManager();
        mockMessage = {
            reply: jest.fn()
        };
        mockDb = {};
    });

    it('should initialize with an empty commands map', () => {
        expect(manager.commands.size).toBe(0);
    });

    it('should register a command successfully', () => {
        const mockCommand = new MockCommand('test');
        manager.registerCommand(mockCommand);
        
        expect(manager.commands.get('test')).toBe(mockCommand);
    });

    it('should throw error when registering command without name', () => {
        const mockCommand = {};
        
        expect(() => {
            manager.registerCommand(mockCommand);
        }).toThrow('Command must have a name property');
    });

    it('should get registered command', () => {
        const mockCommand = new MockCommand('test');
        manager.registerCommand(mockCommand);
        
        const retrievedCommand = manager.getCommand('test');
        expect(retrievedCommand).toBe(mockCommand);
    });

    it('should return undefined for unregistered command', () => {
        const retrievedCommand = manager.getCommand('nonexistent');
        expect(retrievedCommand).toBeUndefined();
    });

    it('should execute registered command', async () => {
        const mockCommand = new MockCommand('test');
        manager.registerCommand(mockCommand);
        
        const args = ['test', 'arg1', 'arg2'];
        const lang = 'en';
        
        await manager.executeCommand(mockMessage, args, mockDb, lang);
        
        expect(mockCommand.execute).toHaveBeenCalledWith(mockMessage, ['arg1', 'arg2'], mockDb, lang);
    });

    it('should handle command execution with no arguments', async () => {
        const mockCommand = new MockCommand('test');
        manager.registerCommand(mockCommand);
        
        const args = ['test'];
        const lang = 'en';
        
        await manager.executeCommand(mockMessage, args, mockDb, lang);
        
        expect(mockCommand.execute).toHaveBeenCalledWith(mockMessage, [], mockDb, lang);
    });

    it('should do nothing for unregistered command execution', async () => {
        const args = ['nonexistent', 'arg1'];
        const lang = 'en';
        
        await manager.executeCommand(mockMessage, args, mockDb, lang);
        
        // No error should be thrown, and nothing should happen
        expect(mockMessage.reply).not.toHaveBeenCalled();
    });

    it('should handle command execution errors', async () => {
        const mockCommand = new MockCommand('test');
        mockCommand.execute.mockRejectedValue(new Error('Command execution failed'));
        manager.registerCommand(mockCommand);
        
        const args = ['test'];
        const lang = 'en';
        
        // Should not throw error
        await expect(manager.executeCommand(mockMessage, args, mockDb, lang)).resolves.toBeUndefined();
    });
}); 