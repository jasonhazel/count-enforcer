const { manageCounterRole } = require('../../utils/role_manager');
const { t } = require('../../lang/i18n');

// Mock i18n
jest.mock('../../lang/i18n');

describe('Role Manager', () => {
    let mockMember;
    let mockGuild;
    let mockCounterRole;
    let mockBotRole;
    let mockRoleManager;
    let mockDb;
    let mockConsoleError;

    beforeEach(() => {
        // Mock console.error
        mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

        // Mock counter role
        mockCounterRole = {
            name: 'counter',
            position: 1
        };

        // Mock bot role
        mockBotRole = {
            position: 2
        };

        // Mock role manager
        mockRoleManager = {
            add: jest.fn().mockResolvedValue(undefined),
            remove: jest.fn().mockResolvedValue(undefined),
            highest: mockBotRole
        };

        // Mock guild
        mockGuild = {
            roles: {
                cache: {
                    find: jest.fn().mockReturnValue(mockCounterRole)
                }
            },
            members: {
                me: {
                    permissions: {
                        has: jest.fn().mockReturnValue(true)
                    },
                    roles: mockRoleManager
                }
            }
        };

        // Mock member
        mockMember = {
            guild: mockGuild,
            roles: mockRoleManager
        };

        // Mock db
        mockDb = {};
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add counter role successfully', async () => {
        await expect(manageCounterRole(mockMember, 'add', mockDb, 'en')).resolves.toBe(true);
        expect(mockRoleManager.add).toHaveBeenCalledWith(mockCounterRole);
    });

    it('should remove counter role successfully', async () => {
        await expect(manageCounterRole(mockMember, 'remove', mockDb, 'en')).resolves.toBe(true);
        expect(mockRoleManager.remove).toHaveBeenCalledWith(mockCounterRole);
    });

    it('should throw error when counter role not found', async () => {
        mockGuild.roles.cache.find.mockReturnValue(null);

        await expect(manageCounterRole(mockMember, 'add', mockDb, 'en'))
            .rejects.toThrow('COUNTER_ROLE_NOT_FOUND');
        expect(mockConsoleError).toHaveBeenCalledWith(
            'Counter role not found in the server. Please create a role named "counter"'
        );
    });

    it('should throw error when bot lacks manage roles permission', async () => {
        mockGuild.members.me.permissions.has.mockReturnValue(false);

        await expect(manageCounterRole(mockMember, 'add', mockDb, 'en'))
            .rejects.toThrow('MISSING_MANAGE_ROLES_PERMISSION');
        expect(mockConsoleError).toHaveBeenCalledWith(
            'Bot does not have permission to manage roles'
        );
    });

    it('should throw error when bot role is not high enough', async () => {
        mockBotRole.position = 1; // Same level as counter role

        await expect(manageCounterRole(mockMember, 'add', mockDb, 'en'))
            .rejects.toThrow('INSUFFICIENT_ROLE_HIERARCHY');
        expect(mockConsoleError).toHaveBeenCalledWith(
            'Bot\'s role is not higher than the counter role in the hierarchy'
        );
    });

    it('should handle role management errors', async () => {
        const error = new Error('Role management failed');
        mockRoleManager.add.mockRejectedValue(error);

        await expect(manageCounterRole(mockMember, 'add', mockDb, 'en'))
            .rejects.toThrow(error);
        expect(mockConsoleError).toHaveBeenCalledWith(
            'Error adding counter role:',
            error
        );
    });

    it('should handle role removal errors', async () => {
        const error = new Error('Role removal failed');
        mockRoleManager.remove.mockRejectedValue(error);

        await expect(manageCounterRole(mockMember, 'remove', mockDb, 'en'))
            .rejects.toThrow(error);
        expect(mockConsoleError).toHaveBeenCalledWith(
            'Error removing counter role:',
            error
        );
    });
}); 