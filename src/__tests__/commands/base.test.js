const BaseCommand = require('../../commands/base');

describe('BaseCommand', () => {
    let command;
    const testName = 'test';
    const testDescription = 'test description';

    beforeEach(() => {
        command = new BaseCommand(testName, testDescription);
    });

    describe('constructor', () => {
        it('should set name and description correctly', () => {
            expect(command.name).toBe(testName);
            expect(command.description).toBe(testDescription);
            expect(command.hidden).toBe(false);
        });

        it('should set hidden flag when provided', () => {
            const hiddenCommand = new BaseCommand(testName, testDescription, true);
            expect(hiddenCommand.hidden).toBe(true);
        });
    });

    describe('execute', () => {
        it('should throw error when not implemented', async () => {
            await expect(command.execute()).rejects.toThrow('Execute method must be implemented by command class');
        });
    });
}); 