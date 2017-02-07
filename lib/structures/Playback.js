let Base = require('./Base'),
    Media = require('./Media');

/**
 * Represents a Play
 * @property {String} id The current history id
 * @property {String} timestamp The timestamp when the playback started
 * @property {Media} media The media played
 * @property {User} user The dj
 */
class Playback extends Base {
    constructor(data, client) {
        super(client);
        this.id = data.h;
        this.timestamp = data.t;
        this.media = (this._client._mediaCache.get(data.m.id) || this._client._mediaCache.add(new Media(data.m)));
        this.user = this._client.users.get(data.c);

        this._votes = {};
    }

    get historyID() {
        return this.id;
    }

    get voteState() {
        let state = {mehs: 0, woots: 0};
        for (let e of this._votes) {
            if (e === 1) state.woots += 1;
            else if (e === -1) state.mehs += 1;
        }
        return state;
    }

    _addVote(userID, direction) {
        this._votes[userID] = direction;
    }

    skip() {
        return this._client.skip(this.user.id, this.id);
    }
}

module.exports = Playback;