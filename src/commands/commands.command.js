const fs = require('fs');
const path = require('path');
const { t } = require('../i18n');
const { EmbedBuilder } = require('discord.js');
const BaseCommand = require('./base');

class CommandsCommand extends BaseCommand {
    constructor() {
        super('commands', 'Lists all available commands');
    }

    async execute(message, args, db, lang) {
        // Read all command files from the commands directory
        const commandsDir = path.join(__dirname);
        const commandFiles = fs.readdirSync(commandsDir)
            .filter(file => file.endsWith('.command.js'));

        // Load and collect command information
        const commands = [];
        for (const file of commandFiles) {
            const CommandClass = require(path.join(commandsDir, file));
            const command = new CommandClass();
            commands.push({
                name: command.name,
                description: command.description
            });
        }

        // Sort commands alphabetically
        commands.sort((a, b) => a.name.localeCompare(b.name));

        const embed = new EmbedBuilder()
            .setColor('#69398e')
            .setTitle('Available Commands')
            .setDescription('Here are all the commands you can use:')
            .addFields(
                commands.map(cmd => ({
                    name: `!${cmd.name}`,
                    value: cmd.description,
                    inline: false
                }))
            )
            .setTimestamp()
            .setFooter({ text: `Requested by ${message.author.tag}` });

        await message.reply({ embeds: [embed] });
    }
}

module.exports = CommandsCommand; 