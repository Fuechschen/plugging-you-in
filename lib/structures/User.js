let MinimalUser = require('./MinimalUser'),
    Utils = require('../helpers/Utils');

/**
 * Represents a user.
 * @property {Number} role The role of the user
 * @property {Number} globalRole The global role of the user (e.g. Brand Ambassador, Admin)
 * @property {String} avatarID The avatar of the user
 * @property {String} badge The badge of the user
 * @property {String} subscription The subscription type of the user
 * @property {Boolean} guest Whether the user is a guest or not
 * @property {Date} joined When the user created his/her account
 * @property {String} language The users language
 * @property {String} [blurb] The users profile description
 * @property {String} slug A flattend and url-friendly version of the username
 * @property {Number} level The level of the user
 * @property {String} mention The mention for that user
 */
class User extends MinimalUser {
    constructor(data, client) {
        super(data, client);

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

    get mention() {
        return `@${this.username}`;
    }

    toString() {
        return `[${this.id}:${this.username}]`;
    }
}

module.exports = User;