let Base = require('./Base'),
    MinimalUser = require('./MinimalUser');

/**
 * Represents a ban
 * @property {String} duration The ban duration ('h' for one hour, 'd' for a day, 'f' for forever)
 */
class Ban extends Base {
    constructor(data, client) {
        super(client);
        this.duration = data.d || data.duration;
        this.reason = data.r || data.reason;
        if (!data.t && !data.username && !data.id) this.user = this._client.user;
        else this.user = this._client.users.find(user => user.username === data.t) || this._client.users.get(data.id) || new MinimalUser({
                id: data.id,
                username: data.username
            });
    }

    /**
     * Removes this ban.
     * @return {Promise}
     */
    remove() {
        return this._client.unbanUser(this.user.id);
    }
}

module.exports = Ban;