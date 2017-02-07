let Base = require('./Base'),
    Utils = require('../helpers/Utils');

/**
 * Represents a user.
 * @prop {Number} id The id of the user.
 * @prop {String} username The name of the user
 * @prop {Number} role The role of the user
 * @prop {Number} globalRole The global role of the user (e.g. Brand Ambassador, Admin)
 * @prop {String} avatarID The avatar of the user
 * @prop {String} badge The badge of the user
 * @prop {String} subscription The subscription type of the user
 * @prop {Boolean} guest Whether the user is a guest or not
 * @prop {Date} joined When the user created his/her account
 * @prop {String} language The users language
 * @prop {String} [blurb] The users profile description
 * @prop {String} slug A flattend and url-friendly version of the username
 * @prop {Number} level The level of the user
 */
class User extends Base {
    constructor(data, client) {
        super(client);

        this.id = data.id || -1;
        this.username = Utils.decode(data.username) || "";

        this.online = true;

        this.role = data.role || 0;
        this.globalRole = data.gRole || 0;

        this.avatarID = data.avatarID || "base01";
        this.badge = data.badge || "";

        this.subscription = data.sub ? 'gold' : data.silver ? 'silver' : 'none';

        this.guest = data.guest || false;

        this.joined = Utils.convertToDate(data.joined);
        this.language = data.language || "en";
        this.blurb = Utils.decode(data.blurb) || "";
        this.slug = data.slug || "";
        this.level = data.level || 0;
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

    /**
     * Mutes the user
     * @param {Number} time
     * @param {String} reason
     * @returns {Promise}
     */
    mute(time, reason) {
        return this._client.muteUser(this.id, reason, time);
    }

    /**
     * Moves the user in the waitlist
     * @param {Number} position
     * @returns {Promise}
     */
    move(position) {
        return this._client.moveUser(this.id, position);
    }

    /**
     * Adds the user to the waitlst
     * @returns {Promise}
     */
    add() {
        return this._client.addUser(this.id);
    }

    /**
     * Removes the user from the waitlist
     * @returns {Promise}
     */
    remove() {
        return this._client.removeUser(this.id);
    }
}

module.exports = User;