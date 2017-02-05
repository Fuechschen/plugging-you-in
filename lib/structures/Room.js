let Base = require('./Base');

class Room extends Base {
    constructor(data, client) {
        super(client);
        this.id = data.id;
        this.slug = data.slug;
        this.name = data.name;

        this.welcomeMessage = data.welcome;
        this.description = data.description;

        this.minChatLevel = data.minChatLevel;
    }
}

module.exports = Room;