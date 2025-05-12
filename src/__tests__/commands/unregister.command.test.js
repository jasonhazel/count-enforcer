const UnregisterCommand = require('../../commands/unregister.command');
const { t } = require('../../lang/i18n');
const { deactivateUser } = require('../../utils/db_helpers');
const { manageCounterRole } = require('../../utils/role_manager');

// Mock the dependencies
jest.mock('../../lang/i18n', () => ({
    t: jest.fn((key, lang) => `translated_${key}_${lang}`)
}));

jest.mock('../../utils/db_helpers', () => ({
    deactivateUser: jest.fn()
}));

jest.mock('../../utils/role_manager', () => ({
    manageCounterRole: jest.fn()
}));

describe('UnregisterCommand', () => {
    let command;
    let mockMessage;
    let mockDb;
    const mockLang = 'en';
    const mockUserId = '123456789';

    beforeEach(() => {
        command = new UnregisterCommand();
        
        // Create mock message with required properties
        mockMessage = {
            author: {
                id: mockUserId
            },
            member: {
                id: mockUserId,
                roles: {
                    remove: jest.fn().mockResolvedValue(true)
                }
            },
            reply: jest.fn().mockResolvedValue({})
        };

        // Mock database with prepare method
        mockDb = {
            prepare: jest.fn().mockReturnValue({
                get: jest.fn()
            })
        };

        // Clear all mocks between tests
        jest.clearAllMocks();
        console.error = jest.fn(); // Mock console.error
    });

    describe('constructor', () => {
        it('should set command name and description correctly', () => {
            expect(command.name).toBe('unregister');
            expect(command.description).toBe('Unregister yourself from the bot\'s database');
            expect(command.hidden).toBe(false);
        });
    });

    describe('execute', () => {
        describe('when user exists', () => {
            beforeEach(() => {
                // Mock that user exists in DB
                mockDb.prepare().get.mockReturnValue({ user_id: mockUserId });
            });

            it('should deactivate user and remove counter role', async () => {
                manageCounterRole.mockResolvedValue(undefined);

                await command.execute(mockMessage, [], mockDb, mockLang);

                // Verify DB query was made
                expect(mockDb.prepare).toHaveBeenCalledWith('SELECT * FROM users WHERE user_id = ?');
                expect(mockDb.prepare().get).toHaveBeenCalledWith(mockUserId);

                // Verify user was deactivated
                expect(deactivateUser).toHaveBeenCalledWith(mockDb, mockUserId);

                // Verify unregister message was sent
                expect(mockMessage.reply).toHaveBeenCalledWith('translated_unregistered_en');

                // Verify role was removed
                expect(manageCounterRole).toHaveBeenCalledWith(mockMessage.member, 'remove', mockDb, mockLang);
            });

            describe('role management errors', () => {
                it('should handle COUNTER_ROLE_NOT_FOUND error', async () => {
                    manageCounterRole.mockRejectedValue(new Error('COUNTER_ROLE_NOT_FOUND'));

                    await command.execute(mockMessage, [], mockDb, mockLang);

                    expect(mockMessage.reply).toHaveBeenCalledWith('Error: Counter role not found. Please contact an administrator.');
                });

                it('should handle MISSING_MANAGE_ROLES_PERMISSION error', async () => {
                    manageCounterRole.mockRejectedValue(new Error('MISSING_MANAGE_ROLES_PERMISSION'));

                    await command.execute(mockMessage, [], mockDb, mockLang);

                    expect(mockMessage.reply).toHaveBeenCalledWith('Error: Bot does not have permission to manage roles. Please contact an administrator.');
                });

                it('should handle INSUFFICIENT_ROLE_HIERARCHY error', async () => {
                    manageCounterRole.mockRejectedValue(new Error('INSUFFICIENT_ROLE_HIERARCHY'));

                    await command.execute(mockMessage, [], mockDb, mockLang);

                    expect(mockMessage.reply).toHaveBeenCalledWith('Error: Bot\'s role is not high enough in the role hierarchy. Please contact an administrator.');
                });

                it('should handle unknown errors', async () => {
                    manageCounterRole.mockRejectedValue(new Error('UNKNOWN_ERROR'));

                    await command.execute(mockMessage, [], mockDb, mockLang);

                    expect(mockMessage.reply).toHaveBeenCalledWith('translated_error_unregister_en');
                });
            });
        });

        describe('when user does not exist', () => {
            beforeEach(() => {
                // Mock that user doesn't exist in DB
                mockDb.prepare().get.mockReturnValue(null);
            });

            it('should reply with not registered message', async () => {
                await command.execute(mockMessage, [], mockDb, mockLang);

                expect(mockMessage.reply).toHaveBeenCalledWith('translated_not_registered_en');
                expect(deactivateUser).not.toHaveBeenCalled();
                expect(manageCounterRole).not.toHaveBeenCalled();
            });
        });

        it('should handle database errors', async () => {
            mockDb.prepare.mockImplementation(() => {
                throw new Error('Database error');
            });

            await command.execute(mockMessage, [], mockDb, mockLang);

            expect(console.error).toHaveBeenCalledWith('Error unregistering user:', expect.any(Error));
            expect(mockMessage.reply).toHaveBeenCalledWith('translated_error_unregister_en');
        });
    });
}); 