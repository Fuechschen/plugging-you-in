let SuperAgent = require('superagent'),
    EventEmitter = require('events'),
    Ws = require('ws'),
    Constants = require('./Constants'),
    SocketConnection = require('./helpers/SocketConnection');

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
        this._ws = new SocketConnection(this);
        this._beforeReadyQueue = [];
        this._connect = false;
        this._requestAgent = SuperAgent.Agent();
        this._getCsrf().then(token => {
            this._csrf = token;
            this._login(options.email, options.password).then(() => {
                /**
                 * Emitted when the client is ready to make rest calls
                 * @event Client#ready
                 */
                this.emit('ready');
                this.ready = true;
                if (this._connect) this.connect();
            }).catch(err => {
                throw new Error('Failed to login, please check your credentials', err);
            });
        }).catch(err => {
            throw new Error(`Unable to get CSRF token, Error: ${err.stack}`);
        });
    }

    _getCsrf() {
        return new Promise((resolve, reject) => {
            this._requestAgent(Constants.methods.get, Constants.endpoints.csrf).then(res => {
                let index = res.body.indexOf("_csrf") + 7;

                res.body = res.body.substr(index, res.body.indexOf('\"', index) - index);

                if (body.length === 60) resolve(res.body);
                else reject(new Error('Could not find CSRF in body.'));
            }).catch(resolve);
        });
    }

    _login(email, password) {
        return new Promise((resolve, reject) => {
            this._requestAgent(Constants.methods.get, Constants.endpoints.login, {
                csrf: this._csrf,
                email,
                password
            }).then(res => {
                if (res.body.status === 'ok') resolve();
            }).catch(reject);
        })
    }

    /**
     * Establishes the Websocket Conncetion to plug.dj
     * @return Promise
     */
    connect() {
        return this._ws.connect();
    }

    /**
     * Joins a room (community)
     * @param {String} room the room to join
     * @return {Promise}
     */
    joinRoom(room) {
        return new Promise((resolve, reject) => {
            if (!room && Constants.invalidRooms.includes(room))return reject(new Error('Room is inbvlid'));

        });
    }
}

module.exports = Client;