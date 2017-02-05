let SuperAgent = require('superagent'),
    Constants = require('../Constants');

class RequestHandler {
    constructor() {
        this.agent = SuperAgent.agent();
    }

    //todo add support for ratelimit queue
    request(verb, endpoint, data) {
        return new Promise((resolve, reject) => {
            let request = this.agent[verb](Constants.baseUrl + endpoint).type('application/json');
            if (data) request.send(data);
            request.then(res => {
                if ([200, 201, 204, 304].includes(res.statusCode)) return resolve(res.body);
                reject(new Error(`Invalid statuscode ${res.statusCode}`));
            }, reject);
        });
    }
}

module.exports = RequestHandler;