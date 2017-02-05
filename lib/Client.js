let EventEmitter = require('events'),
    Constants = require('./Constants'),
    SocketConnection = require('./helpers/SocketConnection'),
    RequestHandler = require('./helpers/RequestHandler'),
    Collection = require('./helpers/Collection'),
    Message = require('./structures/Message'),
    User = require('./structures/User');

/**
 * The main Client object
 * @property {Boolean} ready Indicates if the client is ready for rest calls.
 * @property {String} room Slug of the current room.
 */
class Client extends EventEmitter {
    constructor(options) {
        super();
        if (!options.email)throw new Error("Email has to be provided.");
        if (!options.password)throw new Error("Password has to be provided");
        this.ready = false;
        this.messages = new Collection(Message);
        this.users = new Collection(User);
        this.offlineUsers = new Collection(User);

        this._ws = new SocketConnection(this);
        this._beforeReadyQueue = [];
        this._connect = false;
        this._connectPromise = {resolve: undefined, reject: undefined};
        this._requestAgent = new RequestHandler(this);


        this._getCsrf().then(token => {
            this._csrf = token;
            this._login(options.email, options.password).then((res) => {
                console.log(res);
                /**
                 * Emitted when the client is ready to make rest calls
                 * @event Client#ready
                 */
                this.emit('ready');
                this.ready = true;
                if (this._connect) this.connect().then(this._connectPromise.resolve).catch(this._connectPromise.reject);
            }).catch(err => {
                throw new Error('Failed to login, please check your credentials', err);
            });
        }).catch(err => {
            throw new Error(`Unable to get CSRF token, Error: ${err.stack}`);
        });
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
        })
    }

    /**
     * Establishes the Websocket Conncetion to plug.dj
     * @return Promise
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
            if (!slug && Constants.invalidRooms.includes(slug))return reject(new Error('Room is invalid'));
            return this._requestAgent.request(Constants.methods.post, Constants.endpoints.joinRoom, {slug}).then(() => this.room = slug);
        });
    }

    /**
     * Sends a message in chat
     * @param {String} content The message content
     * @param {Number} [timeout] Time after the message is deleted.
     * @return {Promise}
     */
    sendChat(content, timeout) {
        return new Promise((resolve, reject) => {
            if (!message)return reject(new Error('message must be provided'));
            if (message.length > 200)return reject(new Error('Message is longer than 200'));
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
            this._requestAgent.request(Constants.methods.post, Constants.endpoints.addBan, {
                userID,
                reason,
                duration: time
            }).then(resolve, reject);
        });
    }


}

module.exports = Client;