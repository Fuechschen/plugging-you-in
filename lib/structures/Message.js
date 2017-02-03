let Base = require('./Base');

class Message extends Base {
    constructor(data, client) {
        super(client);

    }
}

module.exports = Message;