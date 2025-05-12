const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'guildCreate',
    once: false,
    async execute(guild, db, commands) {
        try {
            // Get the server owner
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
                const message = `Thank you for adding me to ${guild.name}! 🎉

I notice I'm missing some required permissions. Please ensure I have the following permissions:
${permissionNames.map(p => `- ${p}`).join('\n')}

You can grant these permissions by:
1. Going to Server Settings
2. Clicking on "Roles"
3. Finding my role
4. Enabling the missing permissions
5. Saving the changes

Once these permissions are granted, I'll be able to properly manage roles and interact with channels.`;
                await owner.send(message);
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
                        color: '#5865F2', // Discord blue color
                        reason: 'Automatic role creation for bot functionality',
                        permissions: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ReadMessageHistory
                        ]
                    });

                    // Ensure new Counter role is below bot's role
                    await counterRole.setPosition(botRole.position - 1);

                    // Create a message with instructions
                    const message = `Thank you for adding me to ${guild.name}! 🎉

I've automatically created the "counter" role with the necessary permissions. This role will be automatically assigned to users when they register with the bot.

Important Note About Permissions:
- My role (${botRole.name}) needs to be above the "counter" role in the role hierarchy
- If you have existing roles that need to be managed by the bot, they should be below my role
- If you're using role-based permissions in your channels, make sure to adjust them to allow the "counter" role to access necessary channels
- The "counter" role has basic permissions (View Channel, Send Messages, Read Message History) to ensure users can interact with the bot

If you encounter any permission issues, please check:
1. My role's position in the role hierarchy
2. Channel-specific permission overwrites
3. That I have the "Manage Roles" permission enabled`;

                    // Send the message to the owner
                    await owner.send(message);
                } catch (roleError) {
                    console.error(`Failed to create counter role in ${guild.name}:`, roleError.message);
                    
                    // Check if it's a permission error
                    if (roleError.code === 50013) {
                        const missingPerm = roleError.message.includes('Read Message History') ? 'Read Message History' : 'Manage Roles';
                        await owner.send(`I encountered an error while trying to create the counter role. It seems I don't have the "${missingPerm}" permission. Please make sure my role has this permission enabled.`);
                    } else {
                        await owner.send(`I encountered an error while trying to create the counter role. Please make sure I have the "Manage Roles" permission and that my role is high enough in the role hierarchy.`);
                    }
                    return;
                }
            } else {
                // If counter role exists, check if it's in the correct position
                if (counterRole.position >= botRole.position) {
                    const message = `Thank you for adding me to ${guild.name}! 🎉

I notice that the "counter" role is currently above my highest role. To ensure I can properly manage this role, please:

1. Go to Server Settings
2. Click on "Roles"
3. Drag my role (${botRole.name}) above the "counter" role
4. Save the changes

Important Note About Permissions:
- My role needs to be above any roles I need to manage
- If you have existing roles that need to be managed by the bot, they should be below my role
- If you're using role-based permissions in your channels, make sure to adjust them to allow the "counter" role to access necessary channels
- The "counter" role has basic permissions (View Channel, Send Messages, Read Message History) to ensure users can interact with the bot

If you encounter any permission issues, please check:
1. My role's position in the role hierarchy
2. Channel-specific permission overwrites
3. That I have the "Manage Roles" permission enabled`;

                    await owner.send(message);
                } else {
                    const message = `Thank you for adding me to ${guild.name}! 🎉

I see you already have a "counter" role set up. This role will be automatically assigned to users when they register with the bot.

Important Note About Permissions:
- My role (${botRole.name}) needs to be above the "counter" role in the role hierarchy
- If you have existing roles that need to be managed by the bot, they should be below my role
- If you're using role-based permissions in your channels, make sure to adjust them to allow the "counter" role to access necessary channels
- The "counter" role has basic permissions (View Channel, Send Messages, Read Message History) to ensure users can interact with the bot

If you encounter any permission issues, please check:
1. My role's position in the role hierarchy
2. Channel-specific permission overwrites
3. That I have the "Manage Roles" permission enabled`;

                    await owner.send(message);
                }
            }
            
            console.log(`Processed Counter role setup for ${guild.name}`);
        } catch (error) {
            console.error(`Failed to setup roles for ${guild.name}:`, error.message);
            
            // Check if it's a permission error
            if (error.code === 50013) {
                const missingPerm = error.message.includes('Read Message History') ? 'Read Message History' : 'Manage Roles';
                try {
                    const owner = await guild.fetchOwner();
                    await owner.send(`I encountered a permission error in ${guild.name}. It seems I don't have the "${missingPerm}" permission. Please make sure my role has this permission enabled.`);
                } catch (dmError) {
                    console.error('Failed to send error message to owner:', dmError.message);
                }
            } else {
                // Try to send generic error message to owner
                try {
                    const owner = await guild.fetchOwner();
                    await owner.send(`There was an error setting up the roles in ${guild.name}. Please make sure I have the "Manage Roles" permission and that my role is above the roles I need to manage.`);
                } catch (dmError) {
                    console.error('Failed to send error message to owner:', dmError.message);
                }
            }
        }
    }
}; 