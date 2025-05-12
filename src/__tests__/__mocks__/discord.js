const GatewayIntentBits = {
    Guilds: 1,
    GuildMessages: 2,
    MessageContent: 4
};

class Client {
    constructor(config) {
        this.config = config;
        this.login = jest.fn().mockResolvedValue('mock-login-success');
        this.on = jest.fn();
        this.once = jest.fn();
    }
}

const Events = {
    ClientReady: 'ready',
    MessageCreate: 'messageCreate',
    InteractionCreate: 'interactionCreate'
};

module.exports = {
    Client,
    GatewayIntentBits,
    Events
}; 