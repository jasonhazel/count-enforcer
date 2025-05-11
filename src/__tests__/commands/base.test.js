const BaseCommand = require('../../commands/base');

describe('BaseCommand', () => {
    test('sets name and description', () => {
        const cmd = new BaseCommand('foo', 'bar');
        expect(cmd.name).toBe('foo');
        expect(cmd.description).toBe('bar');
    });

    test('throws if execute is called directly', async () => {
        const cmd = new BaseCommand('foo', 'bar');
        await expect(cmd.execute()).rejects.toThrow('Execute method must be implemented by command class');
    });
}); 