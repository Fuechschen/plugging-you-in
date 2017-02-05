let Base = require('./Base');

class Booth extends Base {
    constructor(booth, playback, client) {
        super(client);
        this.media = null;

        this.isLocked = booth.isLocked;
        this.shouldCycle = booth.shouldCycle;

        this.playback = new Playback(playback);
    }
}

module.exports = Booth;