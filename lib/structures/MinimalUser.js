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
     * @param {String} time
     * @param {Number} reason
     * @returns {Promise}
     */
    ban(time, reason) {
        return this._client.banUser(this.id, reason, time);
    }

    /**
     * Unbans the user from the community
     * @returns {Promise}
     */
    unban() {
        return this._client.unbanUser(this.user.id);
    }

    /**
     * Sets the user as staff
     * @param {Number} role the role, 0 for grey, 1 for res dj, 2 for bouncer, 3 for manager, 4 for co-host, 5 for host
     * @return {Promise}
     */
    setRole(role){
        return this._client.setRole(this.id,role);
    }

    /**
     * Shorthand for {MinimalUser}.setStaff(0)
     * @return {Promise}
     */
    removeRole(){
        return this._client.removeStaff(this.id);
    }
}

module.exports = MinimalUser;