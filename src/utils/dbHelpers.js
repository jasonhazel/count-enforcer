function getUserLanguage(db, userId) {
    const user = db.prepare('SELECT language FROM users WHERE user_id = ?').get(userId);
    return user ? user.language : 'en';
}

function updateUserLastSeen(db, userId, username, discriminator) {
    return db.prepare(`
        UPDATE users 
        SET username = ?, 
            discriminator = ?, 
            last_seen = CURRENT_TIMESTAMP, 
            active = TRUE 
        WHERE user_id = ?
    `).run(username, discriminator, userId);
}

function createNewUser(db, userId, username, discriminator, language) {
    return db.prepare(`
        INSERT INTO users (user_id, username, discriminator, active, language) 
        VALUES (?, ?, ?, TRUE, ?)
    `).run(userId, username, discriminator, language);
}

function deactivateUser(db, userId) {
    return db.prepare(`
        UPDATE users 
        SET active = FALSE, 
            last_seen = CURRENT_TIMESTAMP 
        WHERE user_id = ?
    `).run(userId);
}

function getGuildSettings(db, guildId) {
    return db.prepare('SELECT * FROM guild_settings WHERE guild_id = ?').get(guildId);
}

function createGuildSettings(db, guildId) {
    return db.prepare(`
        INSERT INTO guild_settings (guild_id, prefix, current_count, highest_count, failed_count, saves)
        VALUES (?, '!', 0, 0, 0, 1.000)
    `).run(guildId);
}

module.exports = {
    getUserLanguage,
    updateUserLastSeen,
    createNewUser,
    deactivateUser,
    getGuildSettings,
    createGuildSettings
}; 