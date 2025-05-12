const { EmbedBuilder } = require('discord.js');
const RulesCommand = require('../../commands/rules.command');
const { t } = require('../../lang/i18n');

// Mock the dependencies
jest.mock('discord.js');
jest.mock('../../lang/i18n', () => ({
    t: jest.fn((key, lang, ...args) => `translated_${key}_${lang}${args.length ? '_' + args.join('_') : ''}`)
}));

describe('RulesCommand', () => {
    let command;
    let mockMessage;
    let mockDb;
    const mockLang = 'en';

    beforeEach(() => {
        command = new RulesCommand();
        
        // Create mock message with required properties
        mockMessage = {
            author: {
                tag: 'testUser#1234'
            },
            reply: jest.fn().mockResolvedValue({})
        };

        mockDb = {};

        // Mock EmbedBuilder
        EmbedBuilder.mockImplementation(() => ({
            setColor: jest.fn().mockReturnThis(),
            setTitle: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis(),
            setFooter: jest.fn().mockReturnThis()
        }));

        // Clear all mocks between tests
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should set command name and description correctly', () => {
            expect(command.name).toBe('rules');
            expect(command.description).toBe('Shows the rules of the counting game');
            expect(command.hidden).toBe(false);
        });
    });

    describe('execute', () => {
        it('should create and send an embed with rules information', async () => {
            await command.execute(mockMessage, [], mockDb, mockLang);

            // Verify EmbedBuilder was configured correctly
            expect(EmbedBuilder).toHaveBeenCalled();
            const embedInstance = EmbedBuilder.mock.results[0].value;

            // Verify embed styling
            expect(embedInstance.setColor).toHaveBeenCalledWith('#69398e');
            expect(embedInstance.setTitle).toHaveBeenCalledWith('translated_rules_title_en');
            expect(embedInstance.setDescription).toHaveBeenCalledWith('translated_rules_description_en');

            // Verify all rule sections were added
            const expectedFields = [
                {
                    name: 'translated_rules_basic_title_en',
                    value: 'translated_rules_basic_content_en',
                    inline: false
                },
                {
                    name: 'translated_rules_how_to_title_en',
                    value: 'translated_rules_how_to_content_en',
                    inline: false
                },
                {
                    name: 'translated_rules_mistakes_title_en',
                    value: 'translated_rules_mistakes_content_en',
                    inline: false
                },
                {
                    name: 'translated_rules_saves_title_en',
                    value: 'translated_rules_saves_content_en',
                    inline: false
                },
                {
                    name: 'translated_rules_stats_title_en',
                    value: 'translated_rules_stats_content_en',
                    inline: false
                }
            ];

            // Verify each field was added
            expect(embedInstance.addFields).toHaveBeenCalledTimes(1);
            const addFieldsCall = embedInstance.addFields.mock.calls[0];
            expect(addFieldsCall).toEqual(expectedFields);

            // Verify timestamp and footer
            expect(embedInstance.setTimestamp).toHaveBeenCalled();
            expect(embedInstance.setFooter).toHaveBeenCalledWith({
                text: 'translated_rules_footer_en_testUser#1234'
            });

            // Verify message was sent
            expect(mockMessage.reply).toHaveBeenCalledWith({ embeds: [embedInstance] });
        });

        it('should handle errors when creating or sending the embed', async () => {
            // Mock a failure in reply
            mockMessage.reply.mockRejectedValue(new Error('Failed to send message'));

            await expect(command.execute(mockMessage, [], mockDb, mockLang))
                .rejects.toThrow('Failed to send message');
        });
    });
}); 