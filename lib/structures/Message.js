let Base = require('./Base');

/**
 * Represents a single chat message
 * @property {String} content The message content.
 * @property {User} user The user who sent the message.
 * @property {Date} time The time the message was received.
 */
class Message extends Base {
    constructor(data, client) {
        super(client);
        this.id = data.cid;
        this.user = client.users.get(data.uid);
        this.content = data.message;
        this.time = new Date();
    }

    get message() {
        return this.content;
    }

    get uid() {
        return this.user.id;
    }

    get un() {
        return this.user.username;
    }

    get cid() {
        return this.id;
    }

    /**
     * Deletes this message
     * @returns {Promise}
     */
    delete() {
        return this._client.deleteMessage(this.id);
    }
}

module.exports = Message;