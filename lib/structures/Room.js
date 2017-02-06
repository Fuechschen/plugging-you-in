let Base = require('./Base');

/**
 * Represents a room
 * @property {Number} id The room id
 * @property {String} slug The room slug
 * @property {String} name The room name
 * @property {String} welcomeMessage The welcome message
 * @property {String} description The room description
 * @property {Number} minChatLevel The minimal level required to chat
 */
class Room extends Base {
    constructor(data, client) {
        super(client);
        this.id = data.id;
        this.slug = data.slug;
        this.name = data.name;

        this.booth = null;

        this.welcomeMessage = data.welcome;
        this.description = data.description;

        this.minChatLevel = data.minChatLevel;
    }

    setBooth(booth) {
        this.booth = booth;
    }
}

module.exports = Room;