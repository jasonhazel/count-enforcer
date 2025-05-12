const { Events } = require('discord.js');
const { getGuildSettings, createGuildSettings } = require('../utils/db_helpers');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client, db) {
        console.log(`Logged in as ${client.user.tag}!`);
        console.log(`Bot is in ${client.guilds.cache.size} guilds`);
        
        // Check all guilds and ensure they have settings
        for (const guild of client.guilds.cache.values()) {
            try {
                console.log(`Checking settings for guild: ${guild.name} (${guild.id})`);
                
                // Check if guild settings exist
                const settings = getGuildSettings(db, guild.id);
                
                if (!settings) {
                    console.log(`No settings found for guild ${guild.name}, creating default settings...`);
                    // Create default settings for the guild
                    createGuildSettings(db, guild.id);
                    console.log(`Successfully created settings for guild: ${guild.name}`);
                } else {
                    console.log(`Found existing settings for guild ${guild.name}:`, {
                        prefix: settings.prefix,
                        current_count: settings.current_count,
                        highest_count: settings.highest_count,
                        failed_count: settings.failed_count
                    });
                }
            } catch (error) {
                console.error(`Error checking/creating settings for guild ${guild.name}:`, error);
                console.error('Error details:', {
                    message: error.message,
                    stack: error.stack
                });
            }
        }
        
        console.log('Finished checking guild settings');
        
        // Generate and output bot invite link
        const inviteLink = client.generateInvite({
            scopes: ['bot', 'applications.commands'],
            permissions: ['SendMessages', 'ReadMessageHistory', 'ManageMessages', 'EmbedLinks', 'AttachFiles']
        });
        
        console.log('======================================');
        console.log('Add this bot to your server using the following link:');
        console.log(inviteLink);
        console.log('======================================');
    }
}; 