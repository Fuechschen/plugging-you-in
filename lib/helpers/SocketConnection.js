let WebSocket = require('ws'),
    EventEmitter = require('events'),
    Constants = require('../Constants'),
    Message = require('../structures/Message'),
    User = require('../structures/User'),
    Playback = require('../structures/Playback');

class SocketConnection extends EventEmitter {
    constructor(client) {
        super();
        this.status = 'disconnected';
        this.ws = null;
        this.client = client;
        this.chatQueue = [];
        this.ticking = false;
        this._reconnectTries = 1;
    }

    connect() {
        return new Promise((resolve, reject) => {
            if (['connecting', 'connected', 'authenticating'].includes(this.status))return reject(new Error('Connection is established or in the process of beeing established.'));
            this.status = 'connecting';
            this.client._requestAgent.request(Constants.methods.get, Constants.endpoints.token).then((body) => this.initializeWS(body.data[0])).catch(err => {
                this.status = 'disconnected';
                reject(err);
            });
        });
    }

    initializeWS(token) {
        this.ws = new WebSocket(Constants.socket, {origin: "https://plug.dj"});
        this.ws.on('open', () => {
            this.status = 'authenticating';
            this.sendWS(Constants.packetTypes.auth, token);
        });
        this.ws.on('error', (err) => {
            /**
             * Emitted when the socket errors
             * @event Client#socketError
             */
            this.client.emit('socketError', err);
            if (this.client._options.autoReconnect) setTimeout(() => this.initializeWS(token), this._reconnectTries * 1000);
        });
        this.ws.on('close', (code, reason) => {
            /**
             * Emitted when the socket is closed
             * @event Client#socketClose
             * @property {Number} [data.code] The close code.
             * @property {String} [data.reason] A human-readable close reason.
             */
            this.client.emit('socketClose', {code, reason});
            this.status = 'disconnected';
        });
        this.ws.on('message', (data => {
            if (data === 'h')return;
            try {
                data = JSON.parse(data);
            } catch (e) {
                return this.client.emit('error', new Error('Received invalid data from plug.dj: ' + data));
            }
            for (let e of data) {
                /**
                 * Emits the raw packages.
                 * @event Client#rawWS
                 * @property {Object} data The data received from plug.dj
                 */
                this.client.emit('rawWS', e);
                if (e.s === this.client.room)continue;
                switch (e.a) {
                    case 'ack':
                        /**
                         * Emited when the socket connection is up.
                         * @event Client#connect
                         * @property {String} room The room the client is currently in
                         */
                        this.client.emit('connect', e.s);
                        this.status = 'connected';
                        break;
                    case 'chat':
                        /**
                         * Emitted when a chat message is received
                         * @event Client#chat
                         * @property {Message} message The received message
                         */
                        this.client.emit('chat', this.client.messages.add(new Message(e.p, this.client)));
                        break;
                    case 'chatDelete':
                        /**
                         * Emitted when a moderator deletes a chat message
                         * @event Client#chatDelete
                         * @property {Message} message The deleted message (can be null if message is not cached)
                         * @property {User} The user who deleted the message
                         */
                        this.client.emit('chatDelete', this.client.deletedMessages.add(this.client.message.remove({id: e.p.c})) || null, this.client.users.get(e.p.mi));
                        break;
                    case 'userJoin':
                        /**
                         * Emitted when a guest joins the room
                         * @event Client#guestJoin
                         */
                        if (!e.p)return this.client.emit('guestJoin');
                        /**
                         * Emitted when an users joins the room
                         * @event Client#userJoin
                         * @property {User} user The joined user
                         */
                        this.client.emit('userJoin', (this.client.offlineUsers.get(e.p.id) || this.client.users.add(new User(e.p))));
                        break;
                    case 'friendJoin':
                        /**
                         * Emitted when an users joins the room
                         * @event Client#friendJoin
                         * @property {User} user The joined user
                         */
                        this.client.emit(`${this.client._options.useFriends ? 'friend' : 'user'}Join`, (this.client.offlineUsers.get(e.p.id) || this.client.users.add(new User(e.p))));
                        break;
                    case 'userLeave':
                        /**
                         * Emitted when a guest leaves the room
                         * @event Client#guestLeave
                         */
                        if (!e.p)return this.client.emit('guestLeave');
                        /**
                         * Emitted when an user leaves the room.
                         * @event Client#userLeave
                         * @property {User} user The left user
                         */
                        this.client.emit('userLeave', this.client.offlineUsers.add(this.client.users.remove({id: e.p})));
                        break;
                    case 'advance':
                        let oldPlayback = null;
                        if (this.client.playback) {
                            this.client.history.push(this.client.playback);
                            oldPlayback = this.client.playback;
                        }
                        /**
                         * Emitted when a new song is played
                         * @event Client#advance
                         * @property {Playback} playback The current playback
                         * @property {Playback} oldPlayback The playback before.
                         */
                        this.client.emit('advance', this.client.playback = new Playback(e.p, this.client), oldPlayback);
                        let queue = this.client.queue;
                        this.client.emit('queueUpdate', this.client.queue = e.p.d.map(id => this.client.users.get(id)), queue);
                        break;
                    case 'djListUpdate':
                        let oldQueue = this.client.queue;
                        /**
                         * Emitted when the waitlist changes
                         * @event Client#queueUpdate
                         * @property {Array<User>} queue The new queue as an array of users
                         * @property {Array<User>} oldQueue The old queue
                         */
                        this.client.emit('queueUpdate', this.client.queue = e.p.map(id => this.client.users.get(id)), oldQueue);
                        break;
                    case 'djListCycle':
                        /**
                         * Emitted when the cycle-mode gets changed
                         * @event Client#cycleChange
                         * @property {User} user The user who changed the cycle mode
                         * @property {Boolean} state The new cycle-mode
                         */
                        this.client.emit('cycleChange', this.client.users.get(e.p.mi), this.client.room.booth._setCycle(e.p.c));
                        break;
                    case 'djListLocked':
                        /**
                         * Emitted when the queue gets locked/unlocked/cleared
                         * @event Client#lockChange
                         * @property {User} user The user who took the action
                         * @property {Boolean} lock The new lock-state of the queue
                         * @property {Boolean} clear Wheter the queue got cleared or not
                         */
                        this.client.emit('lockChange', this.client.users.get(e.p.mi), this.client.booth._setLock(e.p.f), e.p.c);
                        break;
                    case 'vote':
                        /**
                         * Emitted when someone votes on a song
                         * @event Client#vote
                         * @property {User} user The user who voted
                         * @property {Number} vote The vote, 1 for woot, -1 for meh
                         */
                        this.client.emit('vote', this.client.users.get(e.p.i), e.p.v);
                        this.client.playback._addVote(e.p.i, e.p.v);
                        break;
                }
            }
        }));
    }

    sendChat(input) {
        this.chatQueue.push(input);
        this._chatTick();
    }

    _chatTick() {
        if (this.ticking)return;
        if (!this.chatQueue.length)return;
        for (let e of this.chatQueue)this.sendWS(Constants.packetTypes.chat, e.content);

    }

    processChatMessage(msg) {
        return new Promise((resolve, reject) => {
            this.sendWS(Constants.packetTypes.chat, msg.message);
            msg.resolve();
            resolve();
        });
    }

    sendWS(type, data) {
        this.ws.send(JSON.stringify({a: type, p: data, t: Math.floor(Date.now() / 1000)}));
    }
}

module.exports = SocketConnection;