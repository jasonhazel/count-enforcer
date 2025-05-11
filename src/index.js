const { Client, GatewayIntentBits, Events } = require('discord.js');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const MigrationManager = require('./db/migration-manager');

// Initialize database and run migrations
const db = new Database('/data/bot.db');
const migrationManager = new MigrationManager(db);
migrationManager.runMigrations();

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// Initialize commands map
const commands = new Map();

// Auto-load commands from the commands directory
const commandsPath = path.join(__dirname, 'commands');
console.log(`Loading commands from: ${commandsPath}`);
const commandFiles = fs.readdirSync(commandsPath).filter(file => 
    file.endsWith('.command.js')
);
console.log(`Found ${commandFiles.length} command files: ${commandFiles.join(', ')}`);

for (const file of commandFiles) {
    try {
        console.log(`Loading command from file: ${file}`);
        const klass = require(path.join(commandsPath, file));
        const command = new klass();
        if (command.name) {
            commands.set(command.name, command);
            console.log(`Successfully registered command: ${command.name}`);
        } else {
            console.warn(`Command in ${file} has no name property, skipping`);
        }
    } catch (error) {
        console.error(`Error loading command from ${file}:`, error);
    }
}

// Load event handlers
const eventsPath = path.join(__dirname, 'events');
console.log(`Loading events from: ${eventsPath}`);
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
console.log(`Found ${eventFiles.length} event files: ${eventFiles.join(', ')}`);

for (const file of eventFiles) {
    try {
        console.log(`Loading event from file: ${file}`);
        const event = require(path.join(eventsPath, file));
        if (event.name) {
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, db, commands));
                console.log(`Registered one-time event handler for: ${event.name}`);
            } else {
                client.on(event.name, (...args) => event.execute(...args, db, commands));
                console.log(`Registered event handler for: ${event.name}`);
            }
        } else {
            console.warn(`Event in ${file} has no name property, skipping`);
        }
    } catch (error) {
        console.error(`Error loading event from ${file}:`, error);
    }
}

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

// Login
const token = process.env.DISCORD_TOKEN;
if (!token) {
    throw new Error('No Discord token found. Please set DISCORD_TOKEN environment variable');
}

client.login(token); 