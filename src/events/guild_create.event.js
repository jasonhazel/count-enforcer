const { PermissionsBitField, Events } = require('discord.js');
const { getUserLanguage } = require('../utils/db_helpers');
const { t } = require('../lang/i18n');

module.exports = {
    name: Events.GuildCreate,
    once: false,
    async execute(guild, db, commands) {
        try {
            // Get the guild owner's language preference
            const ownerLang = getUserLanguage(db, guild.ownerId) || 'en';
            const owner = await guild.fetchOwner();
            
            // Check if bot has required permissions
            const botMember = await guild.members.fetch(guild.client.user.id);
            const requiredPermissions = [
                PermissionsBitField.Flags.ManageRoles,
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory,
                PermissionsBitField.Flags.ManageGuild
            ];

            const missingPermissions = requiredPermissions.filter(
                permission => !botMember.permissions.has(permission)
            );

            if (missingPermissions.length > 0) {
                const permissionNames = missingPermissions.map(p => p.toString());
                const message = t('guild_missing_permissions', ownerLang, permissionNames);
                await owner.send(message);
                await owner.send(t('guild_permissions_instructions', ownerLang));
                return;
            }
            
            // Check if counter role already exists
            let counterRole = guild.roles.cache.find(role => role.name.toLowerCase() === 'counter');
            const botRole = guild.members.me.roles.highest;
            
            // Create Counter role if it doesn't exist
            if (!counterRole) {
                try {
                    counterRole = await guild.roles.create({
                        name: 'counter',
                        color: '#69398e',
                        reason: 'Role for counting game participants',
                        permissions: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
                    });

                    // Ensure new Counter role is below bot's role
                    await counterRole.setPosition(botRole.position - 1);

                    await owner.send(t('guild_welcome', ownerLang, guild.name));
                    await owner.send(t('guild_role_created', ownerLang));
                    await owner.send(t('guild_role_instructions', ownerLang, botRole.name));
                    await owner.send(t('guild_role_permissions', ownerLang));
                } catch (error) {
                    if (error.code === 50013) { // Missing Permissions
                        const requiredPermissions = ['MANAGE_ROLES', 'SEND_MESSAGES', 'VIEW_CHANNEL'];
                        await owner.send(t('guild_missing_permissions', ownerLang, requiredPermissions));
                        await owner.send(t('guild_permissions_instructions', ownerLang));
                    } else {
                        console.error('Error creating counter role:', error);
                    }
                }
            } else {
                // If counter role exists, check if it's in the correct position
                if (counterRole.position >= botRole.position) {
                    await owner.send(t('guild_welcome', ownerLang, guild.name));
                    await owner.send(t('guild_role_position_error', ownerLang, botRole.name));
                } else {
                    await owner.send(t('guild_welcome', ownerLang, guild.name));
                    await owner.send(t('guild_role_instructions', ownerLang, botRole.name));
                    await owner.send(t('guild_role_permissions', ownerLang));
                }
            }
            
            console.log(`Processed Counter role setup for ${guild.name}`);
        } catch (error) {
            console.error('Error in guild create event:', error);
        }
    }
}; 