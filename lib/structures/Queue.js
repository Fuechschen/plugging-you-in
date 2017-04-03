let Base = require('./Base');
let Constants = require('../Constants');
/**
 * Represents the queue of a room
 * @property {Array<User>} queue An ordered array of users being in the queue
 */
class Queue extends Base {
    constructor(queue,client) {
        super(client);
        this.queue = [];
        this.update(queue);
    }

    update(queue) {
        let oldQueue = this.queue;
        return {oldQueue, newQueue: this.queue = queue.map(id => this._client.users.get(id))};
    }

    /**
     * Adds an user to the queue
     * @param {Number} userID The id of the user to add
     * @returns {Promise}
     */
    addUser(userID) {
        return new Promise((resolve, reject) => {
            if (!this._client.ready)return reject(new Error('Client is not ready yet.'));
            if (!this._client.users.get(userID))return reject(new Error('User is not in the room'));
            this._client._requestAgent.request('post', Constants.endpoints.addBooth, {id: userID}).then(resolve, reject);
        });
    }

    /**
     * Removes an user from the queue
     * @param {Number} userID The id of the user to be removed
     * @returns {Promise}
     */
    removeUser(userID) {
        return new Promise((resolve, reject) => {
            if (!this._client.ready)return reject(new Error('Client is not ready yet.'));
            if (!this._client.queue.includes(this.users.get(userID)))return reject(new Error('User not in queue or room'));
            this._client._requestAgent.request('delete', Constants.endpoints.remove + userID).then(resolve, reject);
        });
    }

    /**
     * Moves an user in the queue
     * @param {Number} userID The user to move
     * @param {Number} position The new position of the user
     * @returns {Promise}
     */
    moveUser(userID, position) {
        return new Promise((resolve, reject) => {
            if (!this._client.ready)return reject(new Error('Client is not ready yet.'));
            if (!this._client.queue.includes(this.users.get(userID)))return reject(new Error('User not in queue or room'));
            if (position > 50 || position < 0)return reject(new Error('Position can not be higher than 50 or lower than 0'));
            this._client._requestAgent.request('delete', Constants.endpoints.move, {
                userID,
                position
            }).then(resolve, reject);
        });
    }

    /**
     * Locks the queue
     * @returns {Promise}
     */
    lock() {
        return this.setLock(true);
    }

    /**
     * Unlocks the queue
     * @returns {Promise}
     */
    unlock() {
        return this.setLock(false);
    }

    /**
     * Clears and locks the queue
     * @returns {Promise}
     */
    clear() {
        return this.setLock(true, true);
    }
}

module.exports = Queue;