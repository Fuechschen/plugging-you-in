let Base = require('./Base');

/**
 * Represents a rooms booth settings
 * @property {Boolean} isLocked Whether the queue is lock or unlocked
 * @property {Boolean} shouldCycle Whether the queue cycles or not
 */
class Booth extends Base {
    constructor(booth, client) {
        super(client);
        this.isLocked = booth.isLocked;
        this.shouldCycle = booth.shouldCycle;
    }

    _setLock(lock) {
        return this.isLocked = lock;
    }

    _setCycle(cycle) {
        return this.shouldCycle = cycle;
    }

    setLock(lock, clear) {
        return this._client.setLock(lock, clear);
    }

    setCycle(cycle) {
        return this._client.setCycle(cycle);
    }

    /**
     * Unlocks the queue
     * @returns {Promise}
     */
    unlock() {
        return this.setLock(false);
    }

    /**
     * Locks the queue
     * @returns {Promise}
     */
    lock() {
        return this.setLock(true);
    }

    /**
     * Clears and locks the queue
     * @returns {Promise}
     */
    clear() {
        return this.setLock(true, true);
    }

    /**
     * Enables queue cycling
     * @returns {Promise}
     */
    enableCycle() {
        return this.setCycle(true);
    }

    /**
     * Disables queue cycling
     * @returns {Promise}
     */
    disableCycle() {
        return this.setCycle(false);
    }
}

module.exports = Booth;