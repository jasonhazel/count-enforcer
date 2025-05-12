class CommandManager {
    constructor() {
        this.commands = new Map();
    }

    registerCommand(command) {
        if (!command.name) {
            throw new Error('Command must have a name property');
        }
        this.commands.set(command.name, command);
    }

    getCommand(name) {
        return this.commands.get(name);
    }

    async executeCommand(message, args, db, lang) {
        const commandName = args.shift().toLowerCase();
        const command = this.getCommand(commandName);
        
        if (command) {
            try {
                await command.execute(message, args, db, lang);
            } catch (error) {
                console.error('Error executing command:', error);
                // Error is caught and logged, but not re-thrown
            }
        }
    }
}

module.exports = CommandManager; 