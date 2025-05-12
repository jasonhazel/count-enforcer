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
    incorrect_count_with_save: ({ expected, current }) => 
        `Incorrect count! You said ${current}, but the next number should be ${expected}. Using one of your saves!`,
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
        "BANANA BREAD, BRO, AT FUCKING WORK, DUDE!!!! HELL YEAH!!"
};

module.exports = translations; 