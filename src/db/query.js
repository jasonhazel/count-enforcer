const Database = require('better-sqlite3');
const db = new Database('bot.db');

// Query all users
const users = db.prepare('SELECT * FROM users').all();

// Print the results in a formatted way
console.log('Users in database:');
console.log('-----------------');
users.forEach(user => {
    console.log(`
User ID: ${user.user_id}
Username: ${user.username}
Discriminator: ${user.discriminator}
Active: ${user.active}
Language: ${user.language}
Created: ${user.created_at}
Last Seen: ${user.last_seen}
-----------------`);
});

db.close(); 