const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const { PermissionsBitField } = require('discord.js');

function setupWebServer(client, db) {
    const app = express();
    const port = process.env.WEB_PORT || 3000;

    // Set up EJS
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(expressLayouts);
    app.set('layout', 'layout');

    // Generate invite URL with required permissions
    const inviteUrl = client.generateInvite({
        scopes: ['bot'],
        permissions: [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.ManageRoles,
            PermissionsBitField.Flags.EmbedLinks,
            PermissionsBitField.Flags.ManageGuild
        ]
    });

    // Routes
    app.get('/', async (req, res) => {
        try {
            // Get stats from database
            const stats = {
                serverCount: client.guilds.cache.size,
                userCount: await db.prepare('SELECT COUNT(*) as count FROM users WHERE active = 1').get().count,
                highestCount: await db.prepare('SELECT MAX(highest_count) as count FROM guild_settings').get().count || 0,
                highestStreak: await db.prepare('SELECT MAX(highest_streak) as streak FROM users').get().streak || 0
            };

            // Get server statistics
            const servers = await Promise.all(client.guilds.cache.map(async (guild) => {
                const guildStats = await db.prepare(`
                    SELECT 
                        current_count,
                        highest_count,
                        saves
                    FROM guild_settings 
                    WHERE guild_id = ?
                `).get(guild.id) || { current_count: 0, highest_count: 0, saves: 0 };

                // Get active users count for this guild
                const activeUsers = await db.prepare(`
                    SELECT COUNT(*) as count 
                    FROM users 
                    WHERE active = 1 
                    AND last_seen > datetime('now', '-7 days')
                `).get().count;

                return {
                    name: guild.name,
                    currentCount: guildStats.current_count,
                    highestCount: guildStats.highest_count,
                    activeUsers: activeUsers,
                    saves: guildStats.saves
                };
            }));

            // Sort servers by current count in descending order
            servers.sort((a, b) => b.currentCount - a.currentCount);

            res.render('index', { inviteUrl, stats, servers });
        } catch (error) {
            console.error('Error fetching stats:', error);
            // Provide default stats if there's an error
            const stats = {
                serverCount: client.guilds.cache.size,
                userCount: 0,
                highestCount: 0,
                highestStreak: 0
            };
            res.render('index', { inviteUrl, stats, servers: [] });
        }
    });

    // Start server
    app.listen(port, () => {
        console.log(`Web server running at http://localhost:${port}`);
    });
}

module.exports = setupWebServer; 