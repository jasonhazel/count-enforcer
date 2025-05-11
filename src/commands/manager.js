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
            await command.execute(message, args, db, lang);
        }
    }
}

module.exports = CommandManager; 