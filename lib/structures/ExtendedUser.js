let User = require('./User'),
    MinimalUser = require('./MinimalUser');

/**
 * An user with more information
 * @property {Object} settings An object containing settings
 * @property {Number} plugPoints The current amount of plug points the user has
 * @property {Number} xp The current number of experience points the user has
 * @property {Array<MinimalUser>} ignores An array of users the current user ignores
 */
class ExtendedUser extends User {
    constructor(data, client) {
        super(data, client);
        this.settings = data.settings;
        this.plugPoints = data.pp;
        this.xp = data.xp;
        this.ignores = data.ignores ? data.ignores.map(user => new MinimalUser(user, client)) : [];
    }
}

module.exports = ExtendedUser;