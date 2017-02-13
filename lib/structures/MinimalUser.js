let Base = require('./Base'),
    Utils = require('../helpers/Utils');

/**
 * An user with the minimum of information plug gives
 * @property {Number} id The id of the user.
 * @property {String} username The name of the user
 */
class MinimalUser extends Base {
    constructor(data, client) {
        super(client);
        this.id = data.id || -1;
        this.username = Utils.decode(data.username) || "";
    }

    /**
     * Bans the user from the community
     * @param {Number} time
     * @param {String} reason
     * @returns {Promise}
     */
    ban(time, reason) {
        return this._client.banUser(this.id, reason, time);
    }
}

module.exports = MinimalUser;