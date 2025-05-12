const RegisterCommand = require('../../commands/register.command');
const { t } = require('../../lang/i18n');
const { updateUserLastSeen, createNewUser, manageCounterRole } = require('../../utils/db_helpers');

// Mock the dependencies
jest.mock('../../lang/i18n', () => ({
    t: jest.fn((key, lang) => `translated_${key}_${lang}`)
}));

jest.mock('../../utils/db_helpers', () => ({
    updateUserLastSeen: jest.fn(),
    createNewUser: jest.fn(),
    manageCounterRole: jest.fn()
}));

describe('RegisterCommand', () => {
    let command;
    let mockMessage;
    let mockDb;
    const mockLang = 'en';
    const mockUserId = '123456789';
    const mockUsername = 'testUser';
    const mockDiscriminator = '1234';

    beforeEach(() => {
        command = new RegisterCommand();
        
        // Create mock message with required properties
        mockMessage = {
            author: {
                id: mockUserId,
                username: mockUsername,
                discriminator: mockDiscriminator
            },
            member: {
                // Add member properties that manageCounterRole might need
                id: mockUserId,
                roles: {
                    add: jest.fn().mockResolvedValue(true)
                }
            },
            reply: jest.fn().mockResolvedValue({}),
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
        console.log = jest.fn(); // Mock console.log
    });

    describe('constructor', () => {
        it('should set command name and description correctly', () => {
            expect(command.name).toBe('register');
            expect(command.description).toBe('Register to participate in counting');
            expect(command.hidden).toBe(false);
        });
    });

    describe('execute', () => {
        describe('new user registration', () => {
            beforeEach(() => {
                // Mock that user doesn't exist in DB
                mockDb.prepare().get.mockReturnValue(null);
            });

            it('should create new user and add counter role', async () => {
                manageCounterRole.mockResolvedValue(undefined);

                await command.execute(mockMessage, [], mockDb, mockLang);

                // Verify DB query was made
                expect(mockDb.prepare).toHaveBeenCalledWith('SELECT * FROM users WHERE user_id = ?');
                expect(mockDb.prepare().get).toHaveBeenCalledWith(mockUserId);

                // Verify new user was created
                expect(createNewUser).toHaveBeenCalledWith(
                    mockDb,
                    mockUserId,
                    mockUsername,
                    mockDiscriminator,
                    mockLang
                );

                // Verify registration message was sent
                expect(mockMessage.reply).toHaveBeenCalledWith('translated_registered_en');

                // Verify role was added
                expect(manageCounterRole).toHaveBeenCalledWith(mockMessage.member, 'add', mockDb, mockLang);
                expect(console.log).toHaveBeenCalledWith(`Added counter role to user ${mockUsername}`);
            });
        });

        describe('existing user update', () => {
            beforeEach(() => {
                // Mock that user exists in DB
                mockDb.prepare().get.mockReturnValue({ user_id: mockUserId });
            });

            it('should update existing user and add counter role', async () => {
                manageCounterRole.mockResolvedValue(undefined);

                await command.execute(mockMessage, [], mockDb, mockLang);

                // Verify user was updated
                expect(updateUserLastSeen).toHaveBeenCalledWith(
                    mockDb,
                    mockUserId,
                    mockUsername,
                    mockDiscriminator
                );

                // Verify update message was sent
                expect(mockMessage.reply).toHaveBeenCalledWith('translated_updated_en');

                // Verify role was added
                expect(manageCounterRole).toHaveBeenCalledWith(mockMessage.member, 'add', mockDb, mockLang);
            });
        });

        describe('role management errors', () => {
            beforeEach(() => {
                // Mock that user doesn't exist in DB
                mockDb.prepare().get.mockReturnValue(null);
            });

            it('should handle COUNTER_ROLE_NOT_FOUND error', async () => {
                manageCounterRole.mockRejectedValue(new Error('COUNTER_ROLE_NOT_FOUND'));

                await command.execute(mockMessage, [], mockDb, mockLang);

                expect(mockMessage.reply).toHaveBeenCalledWith('translated_role_error_not_found_en');
            });

            it('should handle MISSING_MANAGE_ROLES_PERMISSION error', async () => {
                manageCounterRole.mockRejectedValue(new Error('MISSING_MANAGE_ROLES_PERMISSION'));

                await command.execute(mockMessage, [], mockDb, mockLang);

                expect(mockMessage.reply).toHaveBeenCalledWith('translated_role_error_missing_permission_en');
            });

            it('should handle INSUFFICIENT_ROLE_HIERARCHY error', async () => {
                manageCounterRole.mockRejectedValue(new Error('INSUFFICIENT_ROLE_HIERARCHY'));

                await command.execute(mockMessage, [], mockDb, mockLang);

                expect(mockMessage.reply).toHaveBeenCalledWith('translated_role_error_hierarchy_en');
            });

            it('should handle unknown errors', async () => {
                manageCounterRole.mockRejectedValue(new Error('UNKNOWN_ERROR'));

                await command.execute(mockMessage, [], mockDb, mockLang);

                expect(mockMessage.reply).toHaveBeenCalledWith('translated_error_register_en');
            });
        });

        it('should handle database errors', async () => {
            mockDb.prepare.mockImplementation(() => {
                throw new Error('Database error');
            });

            await command.execute(mockMessage, [], mockDb, mockLang);

            expect(console.error).toHaveBeenCalledWith('Error registering user:', expect.any(Error));
            expect(mockMessage.reply).toHaveBeenCalledWith('translated_error_register_en');
        });
    });
}); 