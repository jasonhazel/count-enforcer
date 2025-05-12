const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const { PermissionsBitField } = require('discord.js');
const WebSocket = require('ws');

// Helper function to fetch stats
async function fetchStats(client, db) {
    try {
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

            return {
                name: guild.name,
                currentCount: guildStats.current_count,
                highestCount: guildStats.highest_count,
                saves: guildStats.saves
            };
        }));

        // Sort servers by current count in descending order
        servers.sort((a, b) => b.currentCount - a.currentCount);

        return { stats, servers };
    } catch (error) {
        console.error('Error fetching stats:', error);
        return {
            stats: {
                serverCount: client.guilds.cache.size,
                userCount: 0,
                highestCount: 0,
                highestStreak: 0
            },
            servers: []
        };
    }
}

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
        const { stats, servers } = await fetchStats(client, db);
        res.render('index', { inviteUrl, stats, servers });
    });

    // API endpoint for stats (keeping for initial load)
    app.get('/api/stats', async (req, res) => {
        const { stats, servers } = await fetchStats(client, db);
        res.json({ stats, servers });
    });

    // Create HTTP server
    const server = app.listen(port, () => {
        console.log(`Web server running at http://localhost:${port}`);
    });

    // Set up WebSocket server
    const wss = new WebSocket.Server({ 
        server,
        // Trust the proxy
        clientTracking: true,
        // Handle proxy headers
        verifyClient: (info, callback) => {
            // Check both direct and proxied protocols
            const isSecure = info.req.headers['x-forwarded-proto'] === 'https' || 
                           info.req.headers['x-forwarded-proto'] === 'wss' ||
                           info.req.secure;
            callback(true); // Allow both secure and non-secure connections
        }
    });

    // Store connected clients
    const clients = new Set();

    // Handle WebSocket connections
    wss.on('connection', (ws) => {
        clients.add(ws);

        // Send initial stats
        fetchStats(client, db).then(data => {
            ws.send(JSON.stringify(data));
        });

        ws.on('close', () => {
            clients.delete(ws);
        });
    });

    // Function to broadcast stats to all connected clients
    async function broadcastStats() {
        const data = await fetchStats(client, db);
        const message = JSON.stringify(data);
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    // Set up periodic stats updates
    setInterval(broadcastStats, 5000); // Update every 5 seconds

    // Also broadcast stats when the bot's cache updates
    client.on('guildUpdate', broadcastStats);
    client.on('guildCreate', broadcastStats);
    client.on('guildDelete', broadcastStats);
}

module.exports = setupWebServer; 