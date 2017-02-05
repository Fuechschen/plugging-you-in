let Base = require('./Base');

/**
 * Represents a single chat message
 * @property {String} content The message content.
 * @property {User} user The user who sent the message.
 */
class Message extends Base {
    constructor(data, client) {
        super(client);

    }
}

module.exports = Message;