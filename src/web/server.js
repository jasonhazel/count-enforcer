const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const { PermissionsBitField } = require('discord.js');

function setupWebServer(client) {
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
    app.get('/', (req, res) => {
        res.render('index', { inviteUrl });
    });

    // Start server
    app.listen(port, () => {
        console.log(`Web server running at http://localhost:${port}`);
    });
}

module.exports = setupWebServer; 