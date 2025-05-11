const { DataTypes } = require('sequelize');
const { sequelize } = require('./query');

// Guild Settings Model
const GuildSettings = sequelize.define('GuildSettings', {
    guild_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    prefix: {
        type: DataTypes.STRING,
        defaultValue: '!'
    },
    current_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    highest_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    failed_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'guild_settings',
    timestamps: false
});

// User Model
const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    discriminator: {
        type: DataTypes.STRING,
        allowNull: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    language: {
        type: DataTypes.STRING,
        defaultValue: 'en'
    },
    saves: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    last_seen: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = {
    GuildSettings,
    User
}; 