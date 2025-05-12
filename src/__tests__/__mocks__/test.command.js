class TestCommand {
    constructor() {
        this.name = 'test';
        this.description = 'A test command';
        this.usage = '!test';
    }

    async execute(message, args, db) {
        // Mock execution
    }
}

module.exports = TestCommand; 