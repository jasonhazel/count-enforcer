const GiveSaveCommand = require('../../commands/givesave.command');

describe('GiveSaveCommand', () => {
    let command;
    let message;
    let db;
    let prepareMock;
    let getMock;
    let runMock;

    beforeEach(() => {
        command = new GiveSaveCommand();
        message = {
            author: { id: 'owner1' },
            guild: { ownerId: 'owner1' },
            reply: jest.fn()
        };
        getMock = jest.fn();
        runMock = jest.fn();
        prepareMock = jest.fn(() => ({ get: getMock, run: runMock }));
        db = { prepare: prepareMock };
    });

    test('should only allow server owner to use the command', async () => {
        message.author.id = 'notowner';
        await command.execute(message, ['user1'], db, 'en');
        expect(message.reply).toHaveBeenCalledWith('This command can only be used by the server owner.');
    });

    test('should require a username argument', async () => {
        await command.execute(message, [], db, 'en');
        expect(message.reply).toHaveBeenCalledWith('Please provide a username. Usage: !givesave <username>');
    });

    test('should handle user not found in database', async () => {
        getMock.mockReturnValueOnce(undefined);
        await command.execute(message, ['user1'], db, 'en');
        expect(message.reply).toHaveBeenCalledWith('User "user1" not found in the database.');
    });

    test('should give a save to the user and reply with success', async () => {
        getMock.mockReturnValueOnce({ user_id: 'user1', saves: 2 });
        await command.execute(message, ['user1'], db, 'en');
        expect(runMock).toHaveBeenCalledWith('user1');
        expect(message.reply).toHaveBeenCalledWith('Successfully gave a save to user1. They now have 3 saves.');
    });
}); 