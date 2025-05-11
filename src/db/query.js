const Database = require('better-sqlite3');
const db = new Database('/data/bot.db');

// Query all users
const users = db.prepare('SELECT * FROM users').all();


db.close(); 