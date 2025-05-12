const { Client, GatewayIntentBits, Events } = require('discord.js');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const MigrationManager = require('./db/migration-manager');
const setupWebServer = require('./web/server');

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
const commandFiles = fs.readdirSync(commandsPath).filter(file => 
    file.endsWith('.command.js')
);

console.log(`Loading ${commandFiles.length} commands...`);

for (const file of commandFiles) {
    try {
        const klass = require(path.join(commandsPath, file));
        const command = new klass();
        if (command.name) {
            commands.set(command.name, command);
            console.log(`Registered command: ${command.name}`);
        } else {
            console.warn(`Skipping command in ${file}: missing name property`);
        }
    } catch (error) {
        console.error(`Failed to load command ${file}:`, error.message);
    }
}

// Load event handlers
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

console.log(`Loading ${eventFiles.length} event handlers...`);

for (const file of eventFiles) {
    try {
        const event = require(path.join(eventsPath, file));
        if (event.name) {
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, db, commands));
                console.log(`Registered one-time event: ${event.name}`);
            } else {
                client.on(event.name, (...args) => event.execute(...args, db, commands));
                console.log(`Registered event: ${event.name}`);
            }
        } else {
            console.warn(`Skipping event in ${file}: missing name property`);
        }
    } catch (error) {
        console.error(`Failed to load event ${file}:`, error.message);
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

client.login(token).then(() => {
    // Start web server after successful login
    setupWebServer(client, db);
}); 