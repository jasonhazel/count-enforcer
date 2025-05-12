const { EmbedBuilder } = require('discord.js');
const UserCommand = require('../../commands/user.command');
const { t } = require('../../lang/i18n');

// Mock the dependencies
jest.mock('discord.js');
jest.mock('../../lang/i18n', () => ({
    t: jest.fn((key, lang) => `translated_${key}_${lang}`)
}));

describe('UserCommand', () => {
    let command;
    let mockMessage;
    let mockDb;
    const mockLang = 'en';
    const mockUserId = '123456789';

    beforeEach(() => {
        command = new UserCommand();
        
        // Create mock message with required properties
        mockMessage = {
            author: {
                id: mockUserId,
                tag: 'testUser#1234'
            },
            reply: jest.fn().mockResolvedValue({})
        };

        // Mock database with prepare method
        mockDb = {
            prepare: jest.fn().mockReturnValue({
                get: jest.fn()
            })
        };

        // Mock EmbedBuilder
        EmbedBuilder.mockImplementation(() => ({
            setColor: jest.fn().mockReturnThis(),
            setTitle: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis()
        }));

        // Clear all mocks between tests
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should set command name and description correctly', () => {
            expect(command.name).toBe('user');
            expect(command.description).toBe('Shows your personal statistics');
            expect(command.hidden).toBe(false);
        });
    });

    describe('execute', () => {
        it('should display user statistics when user exists', async () => {
            // Mock user data
            const mockUser = {
                language: 'en',
                fail_count: 5,
                success_count: 10,
                current_streak: 3,
                highest_streak: 7
            };
            mockDb.prepare().get.mockReturnValue(mockUser);

            await command.execute(mockMessage, [], mockDb, mockLang);

            // Verify DB query was made
            expect(mockDb.prepare).toHaveBeenCalledWith('SELECT * FROM users WHERE user_id = ?');
            expect(mockDb.prepare().get).toHaveBeenCalledWith(mockUserId);

            // Verify embed was created correctly
            expect(EmbedBuilder).toHaveBeenCalled();
            const embedInstance = EmbedBuilder.mock.results[0].value;

            expect(embedInstance.setColor).toHaveBeenCalledWith('#69398e');
            expect(embedInstance.setTitle).toHaveBeenCalledWith('User Statistics');
            expect(embedInstance.setDescription).toHaveBeenCalledWith('Statistics for testUser#1234');

            // Verify fields were added correctly
            const expectedFields = [
                { name: 'Language', value: 'en', inline: true },
                { name: 'Failed Counts', value: '5', inline: true },
                { name: 'Successful Counts', value: '10', inline: true },
                { name: 'Current Streak', value: '3', inline: true },
                { name: 'Highest Streak', value: '7', inline: true }
            ];
            expect(embedInstance.addFields).toHaveBeenCalledTimes(1);
            const addFieldsCall = embedInstance.addFields.mock.calls[0];
            expect(addFieldsCall).toEqual(expectedFields);

            expect(embedInstance.setTimestamp).toHaveBeenCalled();

            // Verify message was sent
            expect(mockMessage.reply).toHaveBeenCalledWith({ embeds: [embedInstance] });
        });

        it('should handle user with no statistics', async () => {
            // Mock user with minimal data
            const mockUser = {
                language: 'en'
            };
            mockDb.prepare().get.mockReturnValue(mockUser);

            await command.execute(mockMessage, [], mockDb, mockLang);

            // Verify fields were added with default values
            const embedInstance = EmbedBuilder.mock.results[0].value;
            const expectedFields = [
                { name: 'Language', value: 'en', inline: true },
                { name: 'Failed Counts', value: '0', inline: true },
                { name: 'Successful Counts', value: '0', inline: true },
                { name: 'Current Streak', value: '0', inline: true },
                { name: 'Highest Streak', value: '0', inline: true }
            ];
            expect(embedInstance.addFields).toHaveBeenCalledTimes(1);
            const addFieldsCall = embedInstance.addFields.mock.calls[0];
            expect(addFieldsCall).toEqual(expectedFields);
        });

        it('should handle unregistered user', async () => {
            // Mock user not found
            mockDb.prepare().get.mockReturnValue(null);

            await command.execute(mockMessage, [], mockDb, mockLang);

            // Verify error message was sent
            expect(mockMessage.reply).toHaveBeenCalledWith('translated_not_registered_en');
            expect(EmbedBuilder).not.toHaveBeenCalled();
        });

        it('should handle database errors', async () => {
            // Mock database error
            mockDb.prepare.mockImplementation(() => {
                throw new Error('Database error');
            });

            await expect(command.execute(mockMessage, [], mockDb, mockLang))
                .rejects.toThrow('Database error');
        });
    });
}); 