class BaseCommand {
    constructor(name, description, hidden = false) {
        this.name = name;
        this.description = description;
        this.hidden = hidden;
    }

    async execute(message, args, db, lang) {
        throw new Error('Execute method must be implemented by command class');
    }
}

module.exports = BaseCommand; 