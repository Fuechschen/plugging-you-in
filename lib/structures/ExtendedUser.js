let User = require('./User');

/**
 * An user with more information
 * @property {Object} settings An object containing settings
 * @property {Number} plugPoints The current amount of plug points the user has
 * @property {Number} xp The current number of experience points the user has
 */
class ExtendedUser extends User {
    constructor(data, client) {
        super(data, client);
        this.settings = data.settings;
        this.plugPoints = data.pp;
        this.xp = data.xp;
    }
}

module.exports = ExtendedUser;