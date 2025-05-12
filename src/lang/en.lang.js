const translations = {
    registered: 'You have been registered!',
    updated: 'Your information has been updated and you are now registered!',
    unregistered: 'You have been unregistered. Use !register to register again.',
    not_registered: 'You are not registered in the system.',
    error_register: 'There was an error registering you. Please try again later.',
    error_unregister: 'There was an error unregistering you. Please try again later.',
    lang_set: 'Your language has been set to English.',
    lang_invalid: 'Invalid language code. Supported: en, es, de, fr, zh',
    pong: latency => `Pong! Latency: ${latency}ms`,
    echo: msg => msg,
    echo_missing: 'Please provide a message to echo!',
    owner_only_command: 'This command can only be used by the server owner.',
    setcount_usage: 'Please provide a number to set the count to. Usage: !setcount [number]',
    setcount_invalid_number: 'Please provide a valid number.',
    setcount_negative: 'The count cannot be negative.',
    setcount_success: ({ count }) => `Count has been set to ${count}.`,
    setcount_error: 'There was an error setting the count. Please try again later.',
    setsaves_usage: 'Please provide a number to set the saves to. Usage: !setsaves [number]',
    setsaves_invalid_number: 'Please provide a valid number.',
    setsaves_negative: 'The saves cannot be negative.',
    setsaves_success: ({ saves }) => `Saves have been set to ${saves}.`,
    setsaves_error: 'There was an error setting the saves. Please try again later.',
    incorrect_count_warning: ({ expected, current }) => 
        `Warning: You said ${current}, but the next number should be ${expected}. No penalty since count is below 10.`,
    incorrect_count_with_save: 'Wrong number! Expected {expected}, but got {current}. Using a save to keep the count going!',
    incorrect_count_no_save: ({ expected, current }) => 
        `Incorrect count! You said ${current}, but the next number should be ${expected}. No saves left - count reset to 0!`,
    bananabread: "dude i got some fucking banana bread at work today dude? hell yeah. " +
        "my mom told me if i wait for things, like, good things will happen to me dude and " +
        "fucking i waited for some things and i got some banana bread at work today dude? hell yeah. " +
        "so it just goes to show that waiting for things is, like, worth it. " +
        "but there's a lot of bad things in this world, dude. " +
        "like fucking skunks dude? hell no. " +
        "Scratching you're eye, but it's STILL fucking ITCHY dude?! HELL no. " +
        "The fucking CUBS, DUDE? HELL NO!! " +
        "LIKE GETTING PAID NOT A LOT OF MONEY, DUDE?! FOR FUCKING WORKING?! HELL NO!!!! " +
        "BUT BANANA BREAD?! AT FUCKING WORK, DUDE?! HELL YEAH!!!!!! " +
        "HELL YEAH, BRO!!!! HELL YEAH!! " +
        "BANANA BREAD, BRO, AT FUCKING WORK, DUDE!!!! HELL YEAH!!",
    
    // GiveSave command translations
    givesave_owner_only: 'This command can only be used by the server owner.',
    givesave_usage: 'Please provide a username. Usage: !givesave <username>',
    givesave_user_not_found: username => `User "${username}" not found in the database.`,
    givesave_success: (username, saves) => `Successfully gave a save to ${username}. They now have ${saves} saves.`,
    
    // Guild welcome messages
    guild_welcome: guildName => `Thank you for adding me to ${guildName}! 🎉`,
    guild_missing_permissions: permissions => `I notice I'm missing some required permissions. Please ensure I have the following permissions:\n${permissions.map(p => `- ${p}`).join('\n')}`,
    guild_permissions_instructions: `You can grant these permissions by:\n1. Going to Server Settings\n2. Clicking on "Roles"\n3. Finding my role\n4. Enabling the missing permissions\n5. Saving the changes`,
    guild_role_created: 'I\'ve automatically created the "counter" role with the necessary permissions. This role will be automatically assigned to users when they register with the bot.',
    guild_role_instructions: botRole => `Important Note About Permissions:
- My role (${botRole}) needs to be above the "counter" role in the role hierarchy
- If you have existing roles that need to be managed by the bot, they should be below my role
- If you're using role-based permissions in your channels, make sure to adjust them to allow the "counter" role to access necessary channels`,
    guild_role_permissions: 'The "counter" role has basic permissions (View Channel, Send Messages, Read Message History) to ensure users can interact with the bot',
    guild_role_position_error: botRole => `I notice that the "counter" role is currently above my highest role. To ensure I can properly manage this role, please:\n\n1. Go to Server Settings\n2. Click on "Roles"\n3. Drag my role (${botRole}) above the "counter" role\n4. Save the changes`,
    
    // Role management error messages
    role_error_not_found: 'Error: Counter role not found. Please contact an administrator.',
    role_error_missing_permission: 'Error: Bot does not have permission to manage roles. Please contact an administrator.',
    role_error_hierarchy: 'Error: Bot\'s role is not high enough in the role hierarchy. Please contact an administrator.',
    
    // User command translations
    user_stats_title: 'User Statistics',
    user_stats_description: username => `Statistics for ${username}`,
    user_stats_language: 'Language',
    user_stats_failed_counts: 'Failed Counts',
    user_stats_successful_counts: 'Successful Counts',
    user_stats_current_streak: 'Current Streak',
    user_stats_highest_streak: 'Highest Streak',
    
    // Rules command translations
    rules_title: '🎲 Counting Game Rules',
    rules_description: 'Here\'s how to play the counting game:',
    rules_basic_title: '📝 Basic Rules',
    rules_basic_content: '• Count up from 1, one number at a time\n• Each person can only count once in a row',
    rules_how_to_title: '🎯 How to Play',
    rules_how_to_content: '• Use `!register` to join and `!lang` to set your language\n• Get the "counter" role to start counting',
    rules_mistakes_title: '❌ Mistakes',
    rules_mistakes_content: '• If you make a mistake, the count resets to 0\n• Your streak resets and fail count increases',
    rules_saves_title: '💾 Saves',
    rules_saves_content: '• Use `!saves` to see how saves work\n• Each save prevents one mistake from resetting the count',
    rules_stats_title: '📊 Statistics',
    rules_stats_content: '• Use `!user` to see your stats\n• Use `!server` to see server stats',
    rules_footer: username => `Requested by ${username}`,
    
    // Commands list translations
    commands_title: 'Available Commands',
    commands_description: 'Here are all the commands you can use:',
    commands_footer: username => `Requested by ${username}`,
    
    // Console messages for administrators
    console_invite_link: 'Add this bot to your server using the following link:',
    cannot_count_twice: 'You cannot count twice in a row!',
    error_updating_count: 'An error occurred while updating the count. Please try again later.',
    incorrect_count_with_save: 'Wrong number! Expected {expected}, but got {current}. Using a save to keep the count going!'
};

module.exports = translations; 