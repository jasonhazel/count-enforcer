const { Events } = require('discord.js');

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
                const settings = db.prepare('SELECT * FROM guild_settings WHERE guild_id = ?').get(guild.id);
                
                if (!settings) {
                    console.log(`No settings found for guild ${guild.name}, creating default settings...`);
                    // Create default settings for the guild
                    db.prepare(`
                        INSERT INTO guild_settings (guild_id, prefix, current_count, highest_count, failed_count)
                        VALUES (?, '!', 0, 0, 0)
                    `).run(guild.id);
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
    }
}; 