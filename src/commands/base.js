class BaseCommand {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    async execute(message, args, db, lang) {
        throw new Error('Execute method must be implemented by command class');
    }
}

module.exports = BaseCommand; 