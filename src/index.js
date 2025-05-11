const { Client, GatewayIntentBits, Events } = require('discord.js');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const MigrationManager = require('./db/migration-manager');

// Initialize database and run migrations
const db = new Database('bot.db');
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
const commandFiles = fs.readdirSync(commandsPath).filter(file => 
    file.endsWith('.command.js')
);

for (const file of commandFiles) {
    try {
        const klass = require(path.join(commandsPath, file));
        const command = new klass();
        if (command.name) {
            commands.set(command.name, command);
        }
    } catch (error) {
        console.error(`Error loading command from ${file}:`, error);
    }
}

// Load event handlers
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, db, commands));
    } else {
        client.on(event.name, (...args) => event.execute(...args, db, commands));
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