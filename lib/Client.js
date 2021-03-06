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
    Booth = require('./structures/Booth'),
    Queue = require('./structures/Queue');

/**
 * The main Client object
 * @property {Boolean} ready Indicates if the client is ready for rest calls.
 * @property {Room} room The current room
 * @property {String} socketStatus The current status of the socket connection
 * @property {ExtendedUser} self The logged-in user
 */
class Client extends EventEmitter {
    /**
     * Create a new Client
     * @param {String} email The Email to use for login
     * @param {String} password the password to use
     * @param {Object} [options] An object containing additional settings
     * @param {Boolean} [options.useFriends=false] Whether the bot should distinguish between friends or not
     * @param {Boolean} [options.autoConnect=false] If the bot should automatically establish a socket connection
     * @param {Boolean} [options.autoReconnect=false] If the bot should automatically reopen an errored or closed socket connection
     * @param {Number} [options.requestFreeze=1000] The time all requests are freezed when a ratelimit warning is received. Can not be lower than 1
     * @param {Number} [options.chatFreeze=1000] The time all chatmessages are freezed when receiving a "floodChat" event
     * @param {Boolean} [options.ignoreRateLimits=false] Whether to respect plug.dj's rate limits or not. It's not recommended to use this option except when you are having your own handling for rate limits.
     * @param {Boolean} [options.updateNotification=false] Whether you want to notified about (possible) updates.
     */
    constructor(email, password, options = {}) {
        super();
        if (!email)throw new Error("Email has to be provided.");
        if (!password)throw new Error("Password has to be provided");
        options.requestFreeze = options.requestFreeze || 1000;
        options.chatFreeze = options.chatFreeze || 1000;
        this._options = options;
        this.ready = false;
        this.room = null;
        this.messages = new Collection(Message);
        this.deletedMessages = new Collection(Message);
        this.users = new Collection(User);
        this.offlineUsers = new Collection(User);

        this.history = [];

        this.playback = null;

        this._ws = new SocketConnection(this);
        this._connect = false;
        this._connectPromise = {resolve: undefined, reject: undefined};
        this._requestAgent = new RequestHandler(this);
        this._mediaCache = new Collection(Media);


        this._getCsrf().then(token => {
            this._csrf = token;
            this._login(email, password).then(() => {
                this._requestAgent.request('get', Constants.endpoints.self).then((user) => {
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
            this._requestAgent.request('get', Constants.endpoints.csrf).then(body => resolve(body.data[0].c)).catch(reject);
        });
    }

    _login(email, password) {
        return new Promise((resolve, reject) => {
            this._requestAgent.request('post', Constants.endpoints.login, {
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
            return this._requestAgent.request('post', Constants.endpoints.joinRoom, {slug}).then(() => {
                return this._requestAgent.request('get', Constants.endpoints.roomState).then(body => {
                    console.log(body);
                    if (!body.data[0])return reject(new Error('Room could not be fetched.'));
                    for (let u of body.data[0].users) this.users.add(new User(u, this));
                    this.room = new Room(body.data[0].meta, this);
                    this.room.setBooth(new Booth(body.data[0].booth, this));
                    //noinspection JSUnresolvedVariable
                    this.room.setQueue(new Queue(body.data[0].booth.waitingDJs, this));
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
     * @param {String} [time='d'] The ban duration, defaults to one day ('h' for one hour, 'd' for a day, 'f' for forever)
     * @param {Number} [reason=1] The ban reason, defaults to 'violating community rules'
     * @return {Promise}
     */
    banUser(userID, time = Constants.banDurations.day, reason = Constants.banReasons.violatingCommunityRules) {
        return new Promise((resolve, reject) => {
            if (!this.ready)return reject(new Error('Client is not ready yet.'));
            //todo let it return a ban object
            this._requestAgent.request('post', Constants.endpoints.addBan, {
                userID,
                reason,
                duration: time
            }).then(resolve, reject);
        });
    }

    /**
     * Removes a ban for a user
     * @param {Number} userID The id of the user
     * @return {Promise}
     */
    unbanUser(userID) {
        return new Promise((resolve, reject) => {
            if (!this.ready)return reject(new Error('Client is not ready yet.'));
            this._requestAgent.request('post', Constants.endpoints.bans + userID).then(resolve, reject);
        });
    }

    /**
     * Skips the current playback. All fields are automatically filled in, however it is recommended to provide at least the userID to prevent wrong skips
     * @param {Number} [userID] The id of the current dj
     * @param {String} [historyID] The id of the current playback
     * @returns {Promise}
     */
    skipSong(userID = this.playback.user, historyID = this.playback.historyID) {
        return new Promise((resolve, reject) => {
            if (!this.ready)return reject(new Error('Client is not ready yet.'));
            if (!this.playback)return reject(new Error('No one is playing'));
            this._requestAgent.request('post', Constants.endpoints.skip, {
                historyID: historyID || this.playback.historyID,
                userID
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
            this._requestAgent.request('delete', Constants.endpoints.chat + chatID).then(resolve, reject);
        });
    }

    /**
     * Sets an user as staff
     * @param {Number} userID
     * @param {Number} role the role, 0 for grey, 1 for res dj, 2 for bouncer, 3 for manager, 4 for co-host, 5 for host
     * @return {Promise}
     */
    setRole(userID, role) {
        return new Promise((resolve, reject) => {
            if (!this.ready)return reject(new Error('Client is not ready yet.'));
            if (0 > role || role > 5)return reject(new Error('Role out of bounds'));
            if (role === 0) this._requestAgent.request('delete', Constants.endpoints.staff + `/${userID}`).then(() => resolve()).catch(reject);
            else this._requestAgent.request('post', Constants.endpoints.staff + `/update`, {
                userID,
                roleID: role
            }).then(() => resolve()).catch(reject);
        });
    }

    /**
     * Shorthand for {Client}.setRole(userID, 0)
     * @param {Number} userID
     * @return {Promise}
     */
    removeRole(userID) {
        return this.setRole(userID, 0);
    }
}

module.exports = Client;