let EventEmitter = require('events'),
    Constants = require('./Constants'),
    SocketConnection = require('./helpers/SocketConnection'),
    RequestHandler = require('./helpers/RequestHandler'),
    Collection = require('./helpers/Collection'),
    Message = require('./structures/Message'),
    User = require('./structures/User'),
    ExtendedUser = require('./structures/ExtendedUser'),
    Room = require('./structures/Room'),
    Media = require('./structures/Media'),
    Booth = require('./structures/Booth');

/**
 * The main Client object
 * @property {Boolean} ready Indicates if the client is ready for rest calls.
 * @property {String} room Slug of the current room.
 * @property {String} socketStatus The current status of the socket connection
 * @property {ExtendedUser} self The logged-in user
 */
class Client extends EventEmitter {
    /**
     * Create a new Client
     * @param {String} email The Email to use for login
     * @param {String} password the password to use
     * @param {Object} [options] An object containing additional settings
     * @param {Boolean} [options.useFriends] Whether the bot should distinguish between friends or not
     * @param {Boolean} [options.autoConnect] If the bot should automatically establish a socket connection
     * @param {Boolean} [options.autoReconnect] If the bot should automatically reopen an errored or closed socket connection
     * @param {Number} [options.requestFreeze=10000] The time all requests are freezed when a ratelimit warning is received. Can not be lower than 1
     */
    constructor(email, password, options) {
        super();
        if (!email)throw new Error("Email has to be provided.");
        if (!password)throw new Error("Password has to be provided");
        options.requestFreeze = options.requestFreeze || 10000;
        this._options = options;
        this.ready = false;
        this.room = null;
        this.messages = new Collection(Message);
        this.deletedMessages = new Collection(Message);
        this.users = new Collection(User);
        this.offlineUsers = new Collection(User);

        this.history = [];
        this.queue = [];

        this.playback = null;

        this._ws = new SocketConnection(this);
        this._connect = false;
        this._connectPromise = {resolve: undefined, reject: undefined};
        this._requestAgent = new RequestHandler(this);
        this._mediaCache = new Collection(Media);


        this._getCsrf().then(token => {
            this._csrf = token;
            this._login(email, password).then(() => {
                this._requestAgent.request(Constants.methods.get, Constants.endpoints.self).then((user) => {
                    this.user = new ExtendedUser(user, this);
                    this.ready = true;
                    /**
                     * Emitted when the client is ready to make rest calls
                     * @event Client#ready
                     */
                    this.emit('ready');
                    if (this._connect || options.autoConnect) this.connect().then(this._connectPromise.resolve).catch(this._connectPromise.reject);
                }).catch(err => {
                    throw new Error('Failed to get self', err);
                });
            }).catch(err => {
                throw new Error('Failed to login, please check your credentials', err);
            });
        }).catch(err => {
            throw new Error(`Unable to get CSRF token, Error: ${err.stack}`);
        });
    }

    get socketStatus() {
        return this._ws.status;
    }

    get self() {
        return this.user;
    }

    _getCsrf() {
        return new Promise((resolve, reject) => {
            this._requestAgent.agent.get(Constants.baseUrl + Constants.endpoints.csrf).then(res => {
                let index = res.text.indexOf("_csrf") + 7;

                res.text = res.text.substr(index, res.text.indexOf('\"', index) - index);

                if (res.text.length === 60) resolve(res.text);
                else reject(new Error('Could not find CSRF in body.'));
            }).catch(reject);
        });
    }

    _login(email, password) {
        return new Promise((resolve, reject) => {
            this._requestAgent.request(Constants.methods.post, Constants.endpoints.login, {
                csrf: this._csrf,
                email,
                password
            }).then(res => {
                if (res.status === 'ok') resolve(res);
            }).catch(reject);
        });
    }

    /**
     * Establishes the Websocket Conncetion to plug.dj
     * @return {Promise}
     */
    connect() {
        if (this.ready)return this._ws.connect();
        return new Promise((resolve, reject) => {
            this._connectPromise = {resolve, reject};
            this._connect = true;
        });
    }

    /**
     * Joins a room (community)
     * @param {String} slug the slug to join
     * @return {Promise}
     */
    joinRoom(slug) {
        return new Promise((resolve, reject) => {
            if (!this.ready)return reject(new Error('Client is not ready yet.'));
            if (!slug && Constants.invalidRooms.includes(slug))return reject(new Error('Room is invalid'));
            return this._requestAgent.request(Constants.methods.post, Constants.endpoints.joinRoom, {slug}).then(() => {
                return this._requestAgent.request(Constants.methods.get, Constants.endpoints.roomState).then(body => {
                    if (!body.data[0])return reject(new Error('Room could not be fetched.'));
                    for (let u of body.data[0].users) this.users.add(new User(u, this));
                    this.room = new Room(body.data[0].meta, this);
                    this.room.setBooth(new Booth(body.data[0].booth, this));
                    /**
                     * Emitted when a room was joined and the caches were filled.
                     * @event Client#joinedRoom
                     */
                    this.emit('joinedRoom', slug);
                });
            }).catch(reject);
        });
    }

    /**
     * Sends a message in chat
     * @param {String} content The message content
     * @return {Promise}
     */

    //todo add delete timeout
    sendChat(content) {
        return new Promise((resolve, reject) => {
            if (!this.ready)return reject(new Error('Client is not ready yet.'));
            if (!content)return reject(new Error('message must be provided'));
            if (content.length > 200)return reject(new Error('Message is longer than 200'));
            this._ws.sendChat({content, resolve, reject});
        });
    }

    /**
     * Bans an user from the room.
     * @param {Number} userID The id of the user
     * @param {String} [time='d'] The ban duration, defaults to one day
     * @param {Number} [reason=1] The ban reason, defaults to 'violating community rules'
     * @return {Promise}
     */
    banUser(userID, time = Constants.banDurations.day, reason = Constants.banReasons.violatingCommunityRules) {
        return new Promise((resolve, reject) => {
            if (!this.ready)return reject(new Error('Client is not ready yet.'));
            this._requestAgent.request(Constants.methods.post, Constants.endpoints.addBan, {
                userID,
                reason,
                duration: time
            }).then(resolve, reject);
        });
    }

    /**
     * Skips the current playback
     * @param {Number} [userID] The id of the current dj
     * @param {String} [historyID] The id of the current playback
     * @returns {Promise}
     */
    skipSong(userID = this.playback.user, historyID = this.playback.historyID) {
        return new Promise((resolve, reject) => {
            if (!this.ready)return reject(new Error('Client is not ready yet.'));
            if (!this.playback)return reject(new Error('No one is playing'));
            this._requestAgent.request(Constants.methods.post, Constants.endpoints.skip, {
                historyID: historyID || this.playback.historyID,
                userID
            }).then(resolve, reject);
        });
    }

    /**
     * Adds an user to the queue
     * @param {Number} userID The id of the user to add
     * @returns {Promise}
     */
    addUser(userID) {
        return new Promise((resolve, reject) => {
            if (!this.ready)return reject(new Error('Client is not ready yet.'));
            if (!this.users.get(userID))return reject(new Error('User is not in the room'));
            this._requestAgent.request(Constants.methods.post, Constants.endpoints.addBooth, {id: userID}).then(resolve, reject);
        });
    }

    /**
     * Removes an user from the queue
     * @param {Number} userID The id of the user to be removed
     * @returns {Promise}
     */
    removeUser(userID) {
        return new Promise((resolve, reject) => {
            if (!this.ready)return reject(new Error('Client is not ready yet.'));
            if (!this.queue.includes(this.users.get(userID)))return reject(new Error('User not in queue or room'));
            this._requestAgent.request(Constants.methods.delete, Constants.endpoints.remove + userID).then(resolve, reject);
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
            if (!this.ready)return reject(new Error('Client is not ready yet.'));
            if (!this.queue.includes(this.users.get(userID)))return reject(new Error('User not in queue or room'));
            if (position > 50 || position < 0)return reject(new Error('Position can not be higher than 50 or lower than 0'));
            this._requestAgent.request(Constants.methods.delete, Constants.endpoints.move, {
                userID,
                position
            }).then(resolve, reject);
        });
    }

    /**
     * Deletes a chat message
     * @param {String} chatID Id of the message to be deleted
     * @returns {Promise}
     */
    deleteMessage(chatID) {
        return new Promise((resolve, reject) => {
            if (!this.ready)return reject(new Error('Client is not ready yet.'));
            this._requestAgent.request(Constants.methods.delete, Constants.endpoints.chat + chatID).then(resolve, reject);
        });
    }
}

module.exports = Client;