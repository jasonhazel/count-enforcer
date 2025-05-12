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

            res.render('index', { inviteUrl, stats });
        } catch (error) {
            console.error('Error fetching stats:', error);
            // Provide default stats if there's an error
            const stats = {
                serverCount: client.guilds.cache.size,
                userCount: 0,
                highestCount: 0,
                highestStreak: 0
            };
            res.render('index', { inviteUrl, stats });
        }
    });

    // Start server
    app.listen(port, () => {
        console.log(`Web server running at http://localhost:${port}`);
    });
}

module.exports = setupWebServer; 