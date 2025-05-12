const { Events } = require('discord.js');
const countEvent = require('../../events/count.event');
const { t } = require('../../lang/i18n');
const { getUserLanguage } = require('../../utils/db_helpers');

// Mock dependencies
jest.mock('../../lang/i18n');
jest.mock('../../utils/db_helpers');

// Mock the database operations
const mockDb = {
    prepare: jest.fn(),
};

// Mock message reactions
const mockReact = jest.fn();

// Mock message replies
const mockReply = jest.fn();

// Mock channel sends
const mockChannelSend = jest.fn();

describe('Count Event Handler', () => {
    let message;
    let mockRun;
    let mockGet;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Mock console.error using spyOn
        jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Setup mock database operations
        mockRun = jest.fn();
        mockGet = jest.fn();
        mockDb.prepare.mockReturnValue({
            run: mockRun,
            get: mockGet,
        });

        // Mock t function
        t.mockImplementation((key, lang, params = {}) => `translated_${key}_${JSON.stringify(params)}`);

        // Mock getUserLanguage
        getUserLanguage.mockReturnValue('en');

        // Setup base message mock
        message = {
            author: {
                id: '123456789',
                username: 'TestUser',
                bot: false,
            },
            guild: {
                id: '987654321',
                ownerId: '111111111',
                roles: {
                    cache: {
                        find: jest.fn(callback => {
                            const roles = [{ id: 'counter-role-id', name: 'counter' }];
                            return roles.find(callback);
                        })
                    }
                }
            },
            member: {
                roles: {
                    cache: new Map([
                        ['counter-role-id', { id: 'counter-role-id' }]
                    ])
                }
            },
            content: '1',
            reply: mockReply,
            react: mockReact,
            channel: {
                send: mockChannelSend
            }
        };
    });

    afterEach(() => {
        // Restore console.error
        console.error.mockRestore();
    });

    test('should have correct event name', () => {
        expect(countEvent.name).toBe(Events.MessageCreate);
    });

    test('should ignore bot messages', async () => {
        message.author.bot = true;
        await countEvent.execute(message, mockDb);
        expect(mockDb.prepare).not.toHaveBeenCalled();
    });

    test('should ignore messages with command prefix', async () => {
        message.content = '!count';
        mockGet.mockReturnValueOnce({ prefix: '!' });
        await countEvent.execute(message, mockDb);
        expect(mockReply).not.toHaveBeenCalled();
    });

    test('should require counter role', async () => {
        message.member.roles.cache.clear();
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        
        await countEvent.execute(message, mockDb);
        
        expect(mockReply).toHaveBeenCalledWith('translated_need_counter_role_{}');
    });

    test('should register new user if not registered', async () => {
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce(null); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 0,
            last_counter: null,
            saves: 1
        }); // guild settings

        await countEvent.execute(message, mockDb);

        expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO users'));
        expect(mockRun).toHaveBeenCalledWith(message.author.id, message.author.username, 'en');
    });

    test('should handle correct count', async () => {
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 0
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 0,
            last_counter: null,
            saves: 1
        }); // guild settings

        await countEvent.execute(message, mockDb);

        expect(mockReact).toHaveBeenCalledWith('✅');
        expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining('UPDATE guild_settings'));
        expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining('UPDATE users'));
    });

    test('should prevent double counting for non-owner', async () => {
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 0
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 0,
            last_counter: '123456789',
            saves: 1
        }); // guild settings

        await countEvent.execute(message, mockDb);

        expect(mockReply).toHaveBeenCalledWith('translated_cannot_count_twice_{}');
        expect(mockReact).toHaveBeenCalledWith('❌');
    });

    test('should allow owner to double count', async () => {
        message.author.id = message.guild.ownerId;
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: message.guild.ownerId,
            current_streak: 0
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 0,
            last_counter: message.guild.ownerId,
            saves: 1
        }); // guild settings

        await countEvent.execute(message, mockDb);

        expect(mockReact).toHaveBeenCalledWith('✅');
        expect(mockReact).toHaveBeenCalledWith('👀');
    });

    test('should handle incorrect count with save', async () => {
        message.content = '3';
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 5
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 0,
            last_counter: null,
            saves: 1
        }); // guild settings

        await countEvent.execute(message, mockDb);

        expect(mockReply).toHaveBeenCalledWith('translated_incorrect_count_with_save_{"expected":1,"current":3}');
        expect(mockReact).toHaveBeenCalledWith('❌');
        expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining('UPDATE guild_settings'));
        expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining('UPDATE users'));
    });

    test('should handle incorrect count without save', async () => {
        message.content = '3';
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 5
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 0,
            last_counter: null,
            saves: 0
        }); // guild settings

        await countEvent.execute(message, mockDb);

        expect(mockReply).toHaveBeenCalledWith('translated_incorrect_count_no_save_{"expected":1,"current":3}');
        expect(mockReact).toHaveBeenCalledWith('❌');
        expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining('UPDATE guild_settings'));
        expect(mockRun).toHaveBeenCalledWith(message.author.id, message.guild.id);
    });

    test('should handle all hidden milestones', async () => {
        const hiddenMilestones = [42, 69, 256, 420, 512, 640, 666, 1024];
        
        for (const milestone of hiddenMilestones) {
            jest.clearAllMocks();
            message.content = milestone.toString();
            
            mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
            mockGet.mockReturnValueOnce({ 
                user_id: '123456789',
                current_streak: 0
            }); // user check
            mockGet.mockReturnValueOnce({ 
                current_count: milestone - 1,
                last_counter: null,
                saves: 1
            }); // guild settings

            await countEvent.execute(message, mockDb);

            expect(mockReact).toHaveBeenCalledWith('✅');
            expect(mockChannelSend).toHaveBeenCalled();
            
            const updateCall = mockDb.prepare.mock.calls.find(call => 
                call[0].includes('UPDATE guild_settings')
            );
            expect(updateCall[0]).toContain('saves = ROUND(saves + ?, 3)');
            expect(mockRun).toHaveBeenCalledWith(
                milestone, // current_count
                milestone, // highest_count
                message.author.id, // last_counter
                1.001, // saves (base rate + hidden milestone bonus)
                message.guild.id // guild_id
            );
        }
    });

    test('should handle combined streak multiplier and milestone bonus', async () => {
        message.content = '1000';
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 501 // 2.0x multiplier
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 999,
            last_counter: null,
            saves: 1
        }); // guild settings

        await countEvent.execute(message, mockDb);

        const updateCall = mockDb.prepare.mock.calls.find(call => 
            call[0].includes('UPDATE guild_settings')
        );
        expect(updateCall[0]).toContain('saves = ROUND(saves + ?, 3)');
        expect(mockRun).toHaveBeenCalledWith(
            1000, // current_count
            1000, // highest_count
            message.author.id, // last_counter
            2.002, // saves (base rate * streak multiplier + milestone bonus)
            message.guild.id // guild_id
        );
    });

    test('should handle non-numeric messages', async () => {
        message.content = 'not a number';
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check

        await countEvent.execute(message, mockDb);

        expect(mockReply).not.toHaveBeenCalled();
        expect(mockReact).not.toHaveBeenCalled();
    });

    test('should handle missing guild settings', async () => {
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 0
        }); // user check
        mockGet.mockReturnValueOnce(null); // guild settings not found

        await countEvent.execute(message, mockDb);

        expect(mockReply).not.toHaveBeenCalled();
        expect(mockReact).not.toHaveBeenCalled();
    });

    test('should handle missing prefix settings', async () => {
        mockGet.mockReturnValueOnce(null); // no prefix settings

        await countEvent.execute(message, mockDb);

        expect(mockReply).not.toHaveBeenCalled();
        expect(mockReact).not.toHaveBeenCalled();
    });

    test('should handle missing counter role', async () => {
        // Mock the find method to return null, simulating no counter role found
        message.guild.roles.cache.find = jest.fn().mockReturnValue(null);
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check

        await countEvent.execute(message, mockDb);

        expect(mockReply).toHaveBeenCalledWith('translated_need_counter_role_{}');
    });

    test('should update user streak and success count on correct count', async () => {
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 5
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 0,
            last_counter: null,
            saves: 1
        }); // guild settings

        await countEvent.execute(message, mockDb);

        const userUpdateCall = mockDb.prepare.mock.calls.find(call => 
            call[0].includes('UPDATE users')
        );
        expect(userUpdateCall[0]).toContain('success_count = success_count + 1');
        expect(userUpdateCall[0]).toContain('current_streak = current_streak + 1');
        expect(userUpdateCall[0]).toContain('highest_streak = MAX(highest_streak, current_streak + 1)');
    });

    test('should reset user streak and success count on incorrect count', async () => {
        message.content = '3';
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 5
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 0,
            last_counter: null,
            saves: 1
        }); // guild settings

        await countEvent.execute(message, mockDb);

        const userUpdateCall = mockDb.prepare.mock.calls.find(call => 
            call[0].includes('UPDATE users')
        );
        expect(userUpdateCall[0]).toContain('fail_count = fail_count + 1');
        expect(userUpdateCall[0]).toContain('current_streak = 0');
        expect(userUpdateCall[0]).toContain('success_count = 0');
    });

    test('should apply correct streak multiplier for >100 streak', async () => {
        // Reset all mocks to ensure clean state
        jest.clearAllMocks();
        
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 101
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 0,
            last_counter: null,
            saves: 1
        }); // guild settings

        // Mock the database prepare function for each specific query
        mockDb.prepare.mockImplementation((query) => {
            if (query.includes('UPDATE guild_settings')) {
                return {
                    run: (...args) => mockRun(...args)
                };
            }
            if (query.includes('UPDATE users')) {
                return {
                    run: (...args) => mockRun(...args)
                };
            }
            return {
                get: (...args) => mockGet(...args),
                run: (...args) => mockRun(...args)
            };
        });

        await countEvent.execute(message, mockDb);

        // Find the guild settings update call
        const guildUpdateCalls = mockRun.mock.calls.filter(call => 
            call.length === 5 && typeof call[3] === 'number'
        );
        
        expect(guildUpdateCalls.length).toBe(1);
        const [count, highestCount, userId, saves, guildId] = guildUpdateCalls[0];
        
        expect(count).toBe(1);
        expect(highestCount).toBe(1);
        expect(userId).toBe('123456789');
        // Compare with 3 decimal places to match database precision
        expect(Number(saves.toFixed(3))).toBe(0.002);
        expect(guildId).toBe(message.guild.id);
    });

    test('should apply correct streak multiplier for >500 streak', async () => {
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 501
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 0,
            last_counter: null,
            saves: 1
        }); // guild settings

        await countEvent.execute(message, mockDb);

        const updateCall = mockDb.prepare.mock.calls.find(call => 
            call[0].includes('UPDATE guild_settings')
        );
        expect(updateCall[0]).toContain('saves = ROUND(saves + ?, 3)');
        // Base save rate 0.001 * 2.0 multiplier = 0.002
        expect(mockRun).toHaveBeenCalledWith(1, 1, '123456789', 0.002, message.guild.id);
    });

    test('should handle regular milestone at 100', async () => {
        message.content = '100';
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 0
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 99,
            last_counter: null,
            saves: 1
        }); // guild settings

        await countEvent.execute(message, mockDb);

        const updateCall = mockDb.prepare.mock.calls.find(call => 
            call[0].includes('UPDATE guild_settings')
        );
        expect(updateCall[0]).toContain('saves = ROUND(saves + ?, 3)');
        // Base save rate 0.001 + 0.5 milestone bonus = 0.501
        expect(mockRun).toHaveBeenCalledWith(100, 100, '123456789', 0.501, message.guild.id);
    });

    test('should handle regular milestone at 500', async () => {
        message.content = '500';
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 0
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 499,
            last_counter: null,
            saves: 1
        }); // guild settings

        await countEvent.execute(message, mockDb);

        const updateCall = mockDb.prepare.mock.calls.find(call => 
            call[0].includes('UPDATE guild_settings')
        );
        expect(updateCall[0]).toContain('saves = ROUND(saves + ?, 3)');
        // Base save rate 0.001 + 1.0 milestone bonus = 1.001
        expect(mockRun).toHaveBeenCalledWith(500, 500, '123456789', 1.001, message.guild.id);
    });

    test('should handle regular milestone at 1000', async () => {
        message.content = '1000';
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 0
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 999,
            last_counter: null,
            saves: 1
        }); // guild settings

        await countEvent.execute(message, mockDb);

        const updateCall = mockDb.prepare.mock.calls.find(call => 
            call[0].includes('UPDATE guild_settings')
        );
        expect(updateCall[0]).toContain('saves = ROUND(saves + ?, 3)');
        // Base save rate 0.001 + 2.0 milestone bonus = 2.001
        expect(mockRun).toHaveBeenCalledWith(1000, 1000, '123456789', 2.001, message.guild.id);
    });

    test('should properly update user stats on success', async () => {
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 5,
            success_count: 10,
            highest_streak: 7
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 0,
            last_counter: null,
            saves: 1
        }); // guild settings

        await countEvent.execute(message, mockDb);

        const userUpdateCall = mockDb.prepare.mock.calls.find(call => 
            call[0].includes('UPDATE users')
        );
        expect(userUpdateCall[0]).toContain('success_count = success_count + 1');
        expect(userUpdateCall[0]).toContain('current_streak = current_streak + 1');
        expect(userUpdateCall[0]).toContain('highest_streak = MAX(highest_streak, current_streak + 1)');
        expect(mockRun).toHaveBeenCalledWith(message.author.id);
    });

    test('should properly update user stats on failure with save', async () => {
        message.content = '3';
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 5,
            fail_count: 2
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 0,
            last_counter: null,
            saves: 1
        }); // guild settings

        await countEvent.execute(message, mockDb);

        const userUpdateCall = mockDb.prepare.mock.calls.find(call => 
            call[0].includes('UPDATE users')
        );
        expect(userUpdateCall[0]).toContain('fail_count = fail_count + 1');
        expect(userUpdateCall[0]).toContain('current_streak = 0');
        expect(userUpdateCall[0]).toContain('success_count = 0');
        expect(mockRun).toHaveBeenCalledWith(message.author.id);
    });

    test('should properly update user stats on failure without save', async () => {
        message.content = '3';
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 5,
            fail_count: 2
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 0,
            last_counter: null,
            saves: 0
        }); // guild settings

        await countEvent.execute(message, mockDb);

        const userUpdateCall = mockDb.prepare.mock.calls.find(call => 
            call[0].includes('UPDATE users')
        );
        expect(userUpdateCall[0]).toContain('fail_count = fail_count + 1');
        expect(userUpdateCall[0]).toContain('current_streak = 0');
        expect(userUpdateCall[0]).toContain('success_count = 0');
        expect(mockRun).toHaveBeenCalledWith(message.author.id);

        const guildUpdateCall = mockDb.prepare.mock.calls.find(call => 
            call[0].includes('UPDATE guild_settings')
        );
        expect(guildUpdateCall[0]).toContain('current_count = 0');
        expect(guildUpdateCall[0]).toContain('failed_count = failed_count + 1');
        expect(guildUpdateCall[0]).toContain('last_failed_counter = ?');
    });

    test('should handle missing guild settings gracefully', async () => {
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 0
        }); // user check
        mockGet.mockReturnValueOnce(null); // guild settings missing

        await countEvent.execute(message, mockDb);

        expect(mockReply).not.toHaveBeenCalled();
        expect(mockReact).not.toHaveBeenCalled();
        expect(mockRun).not.toHaveBeenCalled();
    });

    test('should handle database error during user update', async () => {
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 0
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 0,
            last_counter: null,
            saves: 1
        }); // guild settings

        // Simulate database error by throwing in the mockRun function
        mockRun.mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        await countEvent.execute(message, mockDb);

        expect(console.error).toHaveBeenCalledWith('Error updating count:', expect.any(Error));
        expect(mockReact).toHaveBeenCalledWith('❌');
        expect(mockReply).toHaveBeenCalledWith('translated_error_updating_count_{}');
    });

    test('should handle database error during guild settings update', async () => {
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 0
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 0,
            last_counter: null,
            saves: 1
        }); // guild settings

        // Simulate database error by throwing in the mockRun function
        mockRun.mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        await countEvent.execute(message, mockDb);

        expect(console.error).toHaveBeenCalledWith('Error updating count:', expect.any(Error));
        expect(mockReact).toHaveBeenCalledWith('❌');
        expect(mockReply).toHaveBeenCalledWith('translated_error_updating_count_{}');
    });

    test('should handle missing prefix settings gracefully', async () => {
        mockGet.mockReturnValueOnce(null); // prefix settings missing

        await countEvent.execute(message, mockDb);

        expect(mockReply).not.toHaveBeenCalled();
        expect(mockReact).not.toHaveBeenCalled();
        expect(mockRun).not.toHaveBeenCalled();
    });

    test('should handle database error when checking user', async () => {
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockImplementationOnce(() => {
            throw new Error('Database error');
        }); // user check fails

        await countEvent.execute(message, mockDb);

        expect(console.error).toHaveBeenCalledWith('Error accessing user data:', expect.any(Error));
        expect(mockReact).toHaveBeenCalledWith('❌');
        expect(mockReply).toHaveBeenCalledWith('translated_error_updating_count_{}');
    });

    test('should handle database error when checking guild settings', async () => {
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 0
        }); // user check
        mockGet.mockImplementationOnce(() => {
            throw new Error('Database error');
        }); // guild settings check fails

        await countEvent.execute(message, mockDb);

        expect(console.error).toHaveBeenCalledWith('Error accessing guild settings:', expect.any(Error));
        expect(mockReact).toHaveBeenCalledWith('❌');
        expect(mockReply).toHaveBeenCalledWith('translated_error_updating_count_{}');
    });

    test('should handle database error when updating correct count', async () => {
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 0
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 0,
            last_counter: null,
            saves: 1
        }); // guild settings
        mockRun.mockImplementationOnce(() => {
            throw new Error('Database error');
        }); // update fails

        await countEvent.execute(message, mockDb);

        expect(console.error).toHaveBeenCalledWith('Error updating count:', expect.any(Error));
        expect(mockReact).toHaveBeenCalledWith('❌');
        expect(mockReply).toHaveBeenCalledWith('translated_error_updating_count_{}');
    });

    test('should handle database error when handling incorrect count with save', async () => {
        message.content = '3';
        mockGet.mockReturnValueOnce({ prefix: '!' }); // prefix check
        mockGet.mockReturnValueOnce({ 
            user_id: '123456789',
            current_streak: 0
        }); // user check
        mockGet.mockReturnValueOnce({ 
            current_count: 0,
            last_counter: null,
            saves: 1
        }); // guild settings
        mockRun.mockImplementationOnce(() => {
            throw new Error('Database error');
        }); // update fails

        await countEvent.execute(message, mockDb);

        expect(console.error).toHaveBeenCalledWith('Error handling incorrect count:', expect.any(Error));
        expect(mockReact).toHaveBeenCalledWith('❌');
        expect(mockReply).toHaveBeenCalledWith('translated_error_updating_count_{}');
    });

    test('should handle unexpected errors', async () => {
        // Force an unexpected error by making message undefined
        message.guild = undefined;

        await countEvent.execute(message, mockDb);

        expect(console.error).toHaveBeenCalledWith('Unexpected error in count event:', expect.any(Error));
        expect(mockReact).toHaveBeenCalledWith('❌');
        expect(mockReply).toHaveBeenCalledWith('translated_error_updating_count_{}');
    });
}); 