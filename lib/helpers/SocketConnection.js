let WebSocket = require('ws'),
    EventEmitter = require('events'),
    Constants = require('../Constants');

class SocketConnection extends EventEmitter {
    constructor(client) {
        super();
        this.ws = null;
        this.client = client;
        this.chatQueue = [];
        this.ticking = false;
        this._reconnectTries = 1;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.client._requestAgent.request(Constants.methods.get, Constants.endpoints.token).then((body) => this.initializeWS(body.data[0])).catch(reject);
        });
    }

    initializeWS(token) {
        this.ws = new WebSocket(Constants.socket, {origin: "https://plug.dj"});
        this.ws.on('open', () => {
            this.sendWS(Constants.packetTypes.auth, token);
        });
        this.ws.on('error', (err) => {
            /**
             * Emitted when the socket errors
             * @event Client#socketError
             */
            this.client.emit('socketError', err);
            if (this.client.options.autoReconnect) setTimeout(() => this.initializeWS(token), this._reconnectTries * 1000);
        });
        this.ws.on('close', (code, reason) => {
            /**
             * Emitted when the socket is closed
             * @event Client#socketClose
             * @property {Number} [data.code] The close code.
             * @property {String} [data.reason] A human-readable close reason.
             */
            this.client.emit('socketClose', {code, reason});
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
                 */
                this.client.emit('rawWS', data);
                if (e.s === this.client.room)continue;
                switch (e.a) {

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