const UnregisterCommand = require('../../commands/unregister.command');

// Mock translation function
const t = (key, lang) => `${key}_${lang}`;
jest.mock('../../i18n', () => ({ t }));

describe('UnregisterCommand', () => {
    let command;
    let message;
    let db;
    let member;
    let guild;
    let counterRole;
    let consoleSpy;
    let prepareMock;
    let getMock;
    let runMock;

    beforeEach(() => {
        command = new UnregisterCommand();
        counterRole = { id: 'counterRoleId', name: 'counter', position: 2 };
        member = {
            roles: {
                remove: jest.fn()
            }
        };
        // Mock cache as an array with a find method
        const cache = [counterRole];
        cache.find = jest.fn(cb => Array.prototype.find.call(cache, cb));
        guild = {
            roles: {
                cache
            },
            members: {
                me: {
                    permissions: {
                        has: jest.fn().mockReturnValue(true)
                    },
                    roles: {
                        highest: { position: 3 }
                    }
                }
            }
        };
        message = {
            author: { id: 'user1', username: 'testuser', discriminator: '1234' },
            member,
            guild,
            reply: jest.fn()
        };
        getMock = jest.fn();
        runMock = jest.fn();
        prepareMock = jest.fn(() => ({ get: getMock, run: runMock }));
        db = { prepare: prepareMock };
        consoleSpy = {
            log: jest.spyOn(console, 'log').mockImplementation(),
            error: jest.spyOn(console, 'error').mockImplementation()
        };
    });

    afterEach(() => {
        consoleSpy.log.mockRestore();
        consoleSpy.error.mockRestore();
    });

    test('should unregister an existing user and remove counter role', async () => {
        getMock.mockReturnValueOnce({ user_id: 'user1' }); // Existing user
        await command.execute(message, [], db, 'en');
        expect(db.prepare).toHaveBeenCalledWith(expect.stringContaining('UPDATE users'));
        expect(message.reply).toHaveBeenCalledWith('unregistered_en');
        expect(member.roles.remove).toHaveBeenCalledWith(counterRole);
        expect(consoleSpy.log).toHaveBeenCalledWith('Removed counter role from user testuser');
    });

    test('should handle non-existent user', async () => {
        getMock.mockReturnValueOnce(undefined); // Non-existent user
        await command.execute(message, [], db, 'en');
        expect(message.reply).toHaveBeenCalledWith('not_registered_en');
        expect(member.roles.remove).not.toHaveBeenCalled();
    });

    test('should handle missing counter role', async () => {
        getMock.mockReturnValueOnce({ user_id: 'user1' }); // Existing user
        guild.roles.cache.find = jest.fn(() => undefined);
        await command.execute(message, [], db, 'en');
        expect(consoleSpy.error).toHaveBeenCalledWith('Counter role not found in the server. Please create a role named "counter"');
        expect(message.reply).toHaveBeenCalledWith('Error: Counter role not found. Please contact an administrator.');
        expect(member.roles.remove).not.toHaveBeenCalled();
    });

    test('should handle missing ManageRoles permission', async () => {
        getMock.mockReturnValueOnce({ user_id: 'user1' }); // Existing user
        guild.members.me.permissions.has.mockReturnValue(false);
        await command.execute(message, [], db, 'en');
        expect(consoleSpy.error).toHaveBeenCalledWith('Bot does not have permission to manage roles');
        expect(message.reply).toHaveBeenCalledWith('Error: Bot does not have permission to manage roles. Please contact an administrator.');
        expect(member.roles.remove).not.toHaveBeenCalled();
    });

    test('should handle bot role not high enough in hierarchy', async () => {
        getMock.mockReturnValueOnce({ user_id: 'user1' }); // Existing user
        guild.members.me.roles.highest.position = 1;
        counterRole.position = 2;
        await command.execute(message, [], db, 'en');
        expect(consoleSpy.error).toHaveBeenCalledWith("Bot's role is not higher than the counter role in the hierarchy");
        expect(message.reply).toHaveBeenCalledWith("Error: Bot's role is not high enough in the role hierarchy. Please contact an administrator.");
        expect(member.roles.remove).not.toHaveBeenCalled();
    });

    test('should handle permission error (code 50001)', async () => {
        getMock.mockReturnValueOnce({ user_id: 'user1' }); // Existing user
        member.roles.remove.mockImplementation(() => { throw { code: 50001 }; });
        await command.execute(message, [], db, 'en');
        expect(message.reply).toHaveBeenCalledWith('Error: Bot does not have permission to manage roles. Please contact an administrator.');
    });

    test('should handle general errors', async () => {
        getMock.mockReturnValueOnce({ user_id: 'user1' }); // Existing user
        member.roles.remove.mockImplementation(() => { throw new Error('fail'); });
        await command.execute(message, [], db, 'en');
        expect(message.reply).toHaveBeenCalledWith('error_unregister_en');
    });
}); 