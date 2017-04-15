/* eslint-disable no-case-declarations */

let WebSocket = require('ws'),
    EventEmitter = require('events'),
    Limiter = require('rolling-rate-limiter'),
    Constants = require('../Constants'),
    Message = require('../structures/Message'),
    User = require('../structures/User'),
    Playback = require('../structures/Playback'),
    Ban = require('../structures/Ban');

class SocketConnection extends EventEmitter {
    constructor(client) {
        super();
        this.status = 'disconnected';
        this.ws = null;
        this.client = client;
        this.chatQueue = [];
        this.ticking = false;
        this._reconnectTries = 1;
        this.limiter = Limiter({
            interval: 1000,
            maxInInterval: 3,
            minDifference: 100
        });

        this.freeze = 0;
    }

    connect() {
        return new Promise((resolve, reject) => {
            if (['connecting', 'connected', 'authenticating'].includes(this.status))return reject(new Error('Connection is established or in the process of beeing established.'));
            this.status = 'connecting';
            this.client._requestAgent.request('get', Constants.endpoints.token).then((body) => this.initializeWS(body.data[0])).catch(err => {
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
            if (this.client._options.autoReconnect) setTimeout(() => this.initializeWS(token), (this._reconnectTries * 1000 + (Math.random() * 100)));
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
                if (!this.client.ready)break;
                if (e.s !== this.client.room)break;
                switch (e.a) {
                    default:
                        /**
                         * Emitted when an unknown package is received from plug. This can indicate an outdated version of plugging-you-in
                         * @event Client#unknown
                         */
                        this.client.emit('unknown', e);
                        if (this.client._options.updateNotification) this.client.emit('warn', 'You are probably using an outdated version of plugging-you-in. Please consider updating this module.');
                        break;
                    case 'ack':
                        /**
                         * Emitted when the socket connection is up.
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
                        this.client.emit('chatDelete', this.client.deletedMessages.add(this.client.messages.remove({id: e.p.c}) || {id: e.p.c}) || null, this.client.users.get(e.p.mi));
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
                        let update = this.client.room.queue.update(e.p);
                        this.client.emit('queueUpdate', update.newQueue, update.oldQueue);
                        break;

                    case 'djListUpdate':
                        /**
                         * Emitted when the waitlist changes
                         * @event Client#queueUpdate
                         * @property {Array<User>} queue The new queue as an array of users
                         * @property {Array<User>} oldQueue The old queue
                         */
                        let {oldQueue, newQueue} = this.client.room.queue.update(e.p);
                        this.client.emit('queueUpdate', newQueue, oldQueue);
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
                        if (this.client.playback) this.client.playback._addVote(e.p.i, e.p.v);
                        else this.client.emit('debug', 'Couldn\'t add vote to playback since playback did not exist.');
                        break;
                    case 'grab':
                        /**
                         * Emitted when an user grabs a song
                         * @event Client#grab
                         * @property {User} user The user who grabbed the song
                         */
                        this.client.emit('grab', this.client.users.get(e.p));
                        break;

                    case 'floodAPI':
                        /**
                         * Emitted when too many api requests are fired. You don't need to handle it if you leave `options.requestFreeze` at the default value, however all actions will be stopped for 10 seconds
                         * @event Client#floodApi
                         */
                        this.client.emit('floodApi');
                        if (!this.client._options.ignoreRateLimits) this.client._requestAgent.freezeRequests();
                        break;
                    case 'floodChat':
                        /**
                         * Emitted when you are sending too many chat messages and plugging-you-in isn't good enough at limiting you. Plugging-you-in will handle this by stopping to send messages entirely for a few seconds
                         * @event Client#floodChat
                         */
                        this.client.emit('floodChat');
                        if (!this.client._options.ignoreRateLimits) this.freezeRequests();
                        break;
                    case 'rateLimit':
                        /**
                         * Emitted when chat enters slow mode.
                         * @event Client#slowMode
                         */
                        this.client.emit('slowMode');
                        break;

                    case 'earn':
                        this.client.user.plugPoints = e.p.pp || this.client.user.plugPoints;
                        this.client.user.xp = e.p.xp || this.client.user.xp;
                        this.client.user.level = e.p.level || this.client.user.level;
                        /**
                         * Emitted when the bot earns experience/plug points or levels up
                         * @event Client#earn
                         * @property {Object} earn
                         * @property {Number} earn.xp The new amount of xp
                         * @property {Number} earn.pp The new amount of plug points
                         * @property {Number} earn.level The new level
                         */
                        this.client.emit('earn', e.p);
                        break;
                    case 'gifted':
                        /**
                         * Emitted when someone gifts plug points to someone
                         * @event Client#gifted
                         * @property {User} sender The user who sent the gift
                         * @property {User} receiver The user who received the gift
                         */
                        this.client.emit('gifted', this.client.users.find(user => user.username === e.p.s) || null, this.client.users.find(user => user.username === e.p.r) || null);
                        break;

                    case 'ban':
                        /**
                         * Emitted when you are banned from a community
                         * @event Client#ban
                         * @property {Ban} ban The ban object
                         */
                        this.client.emit('ban', new Ban(e.p, this.client));
                        break;

                    case 'modAddDJ':
                        /**
                         * Emitted when a moderator adds someone to the queue. This also fires a queueUpdate-event
                         * @event Client#addDj
                         * @property {User} user The user who got added
                         * @property {User} moderator The Moderator
                         */
                        this.client.emit('addDj', this.client.users.find(user => user.username === e.p.t) || null, this.client.users.get(e.p.mi));
                        break;
                    case 'modBan':
                        /**
                         * Emitted when a moderator bans someone from the room
                         * @event Client#userBan
                         * @property {Ban} ban The ban
                         * @property {User} moderator
                         */
                        this.client.emit('userBan', new Ban(e.p), this.client.users.get(e.p.mi));
                        break;
                    case 'modMoveDJ':
                        /**
                         * Emitted when a moderator moves someone in the queue. This also fires a queueUpdate-event
                         * @event Client#moveUser
                         * @property {User} user The moved user
                         * @property {User} moderator
                         * @property {Number} newPosition
                         * @property {Number} oldPosition
                         */
                        this.client.emit('moveUser', this.client.users.find(user => user.username === e.p.u) || null, this.client.users.get(e.p.mi), e.p.n, e.p.o);
                        break;
                    case 'modMute':
                        //todo
                        break;
                    case 'modRemoveDJ':
                        //todo
                        break;
                    case 'modSkip':
                        /**
                         * Emitted when a moderator skips a song
                         * @event Client#skip
                         * @property {User} moderator
                         */
                        this.client.emit('skip', this.client.users.get(e.p.mi));
                        break;
                    case 'modStaff':
                        //todo
                        break;

                    case 'friendAccept':
                        //todo
                        break;
                    case 'friendRequest':
                        //todo
                        break;

                    case 'killSession':
                        /**
                         * Emitted when the socket server kills the session
                         * @event Client#killSession
                         */
                        this.client.emit('killSession');
                        /**
                         * Emitted when the client encounters an error which it cannot handle itself
                         * @event Client#error
                         * @property {String|Error} error The error or an error message.
                         * @property {Error} [err] An error object
                         */
                        if (this.client._options.autoReconnect) this.connect().catch(err => this.client.emit('error', 'Unable to reconnect to the socket after the session was killed.', err));
                        break;

                    case 'levelUp':
                        this.client.user.level = e.p || this.client.user.level;
                        /**
                         * Emitted when the logged in account levels up
                         * @event Client#levelUp
                         * @property {Number} newLevel
                         */
                        this.client.emit('levelUp', e.p);
                        break;

                    case 'playlistCycle':
                        //todo
                        break;

                    case 'plugMaintenance':
                        /**
                         * Emitted when plug.dj goes into maintenance mode
                         * @event Client#maintenance
                         */
                        this.client.emit('maintenance');
                        //todo add handler for autoreconnect
                        break;

                    case 'plugMaintenanceAlert':
                        /**
                         * Emitted when plug.dj is about to go into maintenance mode
                         * @event Client#maintenanceAlert
                         * @property {Number} time time til maintenance mode in minutes
                         */
                        this.client.emit('maintenanceAlert', e.p);
                        break;

                    case 'plugMessage':
                        /**
                         * Emitted when plug.dj sends a broadcast
                         * @event Client#plugMessage
                         * @property {String} message
                         */
                        this.client.emit('plugMessage', e.p);
                        break;

                    case 'plugUpdate':
                        /**
                         * Emitted when plig.dj gets updated.
                         * @event Client#plugUpdate
                         */
                        this.client.emit('plugUpdate');
                        break;

                    case 'roomDescription':
                        //todo
                        break;

                    case 'roomMinChatLevelUpdate':
                        //todo
                        break;

                    case 'roomNameUpdate':
                        //todo
                        break;

                    case 'roomWelcomeUpdate':
                        //todo
                        break;

                    case 'skip':
                        /**
                         * Emitted when someone skips himself
                         * @event Client#selfSkip
                         * @property {User} user
                         */
                        this.client.emit('selfSkip', this.client.users.get(e.p));
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
        this.ticking = true;
        this.processChatQueue();
    }

    processChatQueue() {
        setTimeout(() => {
            this.processChatMessage(this.chatQueue.shift());
            if (this.chatQueue.length) this.processChatQueue();
            else this.ticking = false;
        }, this.limiter() + this.freeze);
        this.freeze = 0;
    }

    processChatMessage(msg) {
        this.sendWS(Constants.packetTypes.chat, msg.message);
        msg.resolve();
    }

    sendWS(type, data) {
        this.ws.send(JSON.stringify({a: type, p: data, t: Math.floor(Date.now() / 1000)}));
    }

    freezeRequests() {
        return this.freeze = this.client._options.chatFreeze;
    }
}

module.exports = SocketConnection;