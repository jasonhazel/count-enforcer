const { PermissionsBitField, Events } = require('discord.js');
const guildCreateEvent = require('../../events/guild_create.event');
const { getUserLanguage } = require('../../utils/db_helpers');
const { t } = require('../../lang/i18n');

// Mock dependencies
jest.mock('../../utils/db_helpers');
jest.mock('../../lang/i18n');

describe('Guild Create Event', () => {
    let mockGuild;
    let mockDb;
    let mockCommands;
    let mockOwner;
    let mockBotMember;
    let mockBotRole;
    let mockCounterRole;
    let mockRoleManager;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Mock owner
        mockOwner = {
            send: jest.fn()
        };

        // Mock bot role
        mockBotRole = {
            position: 5,
            name: 'Bot Role'
        };

        // Mock counter role
        mockCounterRole = {
            position: 4,
            name: 'counter',
            setPosition: jest.fn()
        };

        // Mock role manager
        mockRoleManager = {
            create: jest.fn().mockResolvedValue(mockCounterRole),
            cache: {
                find: jest.fn()
            }
        };

        // Mock bot member
        mockBotMember = {
            permissions: {
                has: jest.fn().mockReturnValue(true)
            },
            roles: {
                highest: mockBotRole
            }
        };

        // Mock guild
        mockGuild = {
            name: 'Test Guild',
            ownerId: '123',
            client: {
                user: {
                    id: '456'
                }
            },
            fetchOwner: jest.fn().mockResolvedValue(mockOwner),
            members: {
                fetch: jest.fn().mockResolvedValue(mockBotMember),
                me: {
                    roles: {
                        highest: mockBotRole
                    }
                }
            },
            roles: mockRoleManager
        };

        // Mock db
        mockDb = {};

        // Mock commands
        mockCommands = new Map();

        // Mock getUserLanguage
        getUserLanguage.mockReturnValue('en');

        // Mock t function
        t.mockImplementation((key, lang, ...args) => `translated_${key}_${args.join('_')}`);

        // Spy on console
        jest.spyOn(console, 'log').mockImplementation();
        jest.spyOn(console, 'error').mockImplementation();
    });

    test('should have correct name and once flag', () => {
        expect(guildCreateEvent.name).toBe(Events.GuildCreate);
        expect(guildCreateEvent.once).toBe(false);
    });

    test('should check bot permissions', async () => {
        await guildCreateEvent.execute(mockGuild, mockDb, mockCommands);
        
        expect(mockGuild.members.fetch).toHaveBeenCalledWith(mockGuild.client.user.id);
        expect(mockBotMember.permissions.has).toHaveBeenCalledTimes(5);
    });

    test('should notify owner about missing permissions', async () => {
        mockBotMember.permissions.has.mockReturnValue(false);
        
        await guildCreateEvent.execute(mockGuild, mockDb, mockCommands);
        
        expect(mockOwner.send).toHaveBeenCalledWith(expect.stringContaining('translated_guild_missing_permissions'));
        expect(mockOwner.send).toHaveBeenCalledWith(expect.stringContaining('translated_guild_permissions_instructions'));
    });

    test('should create counter role if it does not exist', async () => {
        mockRoleManager.cache.find.mockReturnValue(null);
        
        await guildCreateEvent.execute(mockGuild, mockDb, mockCommands);
        
        expect(mockRoleManager.create).toHaveBeenCalledWith({
            name: 'counter',
            color: '#69398e',
            reason: 'Role for counting game participants',
            permissions: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
        });
        expect(mockCounterRole.setPosition).toHaveBeenCalledWith(mockBotRole.position - 1);
    });

    test('should handle existing counter role', async () => {
        mockRoleManager.cache.find.mockReturnValue(mockCounterRole);
        
        await guildCreateEvent.execute(mockGuild, mockDb, mockCommands);
        
        expect(mockRoleManager.create).not.toHaveBeenCalled();
        expect(mockOwner.send).toHaveBeenCalledWith(expect.stringContaining('translated_guild_welcome'));
    });

    test('should warn if counter role position is incorrect', async () => {
        mockRoleManager.cache.find.mockReturnValue({
            ...mockCounterRole,
            position: 6 // Higher than bot role
        });
        
        await guildCreateEvent.execute(mockGuild, mockDb, mockCommands);
        
        expect(mockOwner.send).toHaveBeenCalledWith(expect.stringContaining('translated_guild_role_position_error'));
    });

    test('should handle role creation errors', async () => {
        mockRoleManager.cache.find.mockReturnValue(null);
        mockRoleManager.create.mockRejectedValue({ code: 50013 });
        
        await guildCreateEvent.execute(mockGuild, mockDb, mockCommands);
        
        expect(mockOwner.send).toHaveBeenCalledWith(expect.stringContaining('translated_guild_missing_permissions'));
    });

    test('should handle general errors gracefully', async () => {
        const error = new Error('Test error');
        mockGuild.fetchOwner.mockRejectedValue(error);
        
        await guildCreateEvent.execute(mockGuild, mockDb, mockCommands);
        
        expect(console.error).toHaveBeenCalledWith('Error in guild create event:', error);
    });

    test('should use owner language preference', async () => {
        getUserLanguage.mockReturnValue('fr');
        
        await guildCreateEvent.execute(mockGuild, mockDb, mockCommands);
        
        expect(getUserLanguage).toHaveBeenCalledWith(mockDb, mockGuild.ownerId);
        expect(t).toHaveBeenCalledWith(expect.any(String), 'fr', expect.any(String));
    });

    test('should fall back to English if no language preference', async () => {
        getUserLanguage.mockReturnValue(null);
        
        await guildCreateEvent.execute(mockGuild, mockDb, mockCommands);
        
        expect(t).toHaveBeenCalledWith(expect.any(String), 'en', expect.any(String));
    });
}); 