let SuperAgent = require('superagent'),
    Constants = require('../Constants'),
    Limiter = require('rolling-rate-limiter');

class RequestHandler {
    constructor() {
        this.agent = SuperAgent.agent();
        this.limiter = Limiter({
            interval: 1000,
            maxInInterval: 10,
            minDifference: 100
        });
        this.requestQueue = [];
        this._ticking = false;
    }

    //todo add support for ratelimit queue
    request(verb, endpoint, data) {
        return new Promise((resolve, reject) => {
            let request = this.agent[verb](Constants.baseUrl + endpoint).type('application/json');
            if (data) request.send(data);
            this.requestQueue.push({resolve, reject, request});
            this._tick();

            request.then(res => {
                if ([200, 201, 204, 304].includes(res.statusCode)) return resolve(res.body);
                reject(new Error(`Invalid statuscode ${res.statusCode}`));
            }, reject);
        });
    }

    _tick() {
        if (this._ticking)return;
        this._ticking = true;
        this._processTick();
    }

    _processTick() {
        setTimeout(() => {
            let e = this.requestQueue.shift();
            e.request.then(res => {
                if ([200, 201, 204, 304].includes(res.statusCode)) return e.resolve(res.body);
                e.reject(new Error(`Invalid statuscode ${res.statusCode}`));
            }, e.reject);
            if (this.requestQueue.length) this._processTick();
            else this._ticking = false;
        }, this.limiter());
    }
}

module.exports = RequestHandler;