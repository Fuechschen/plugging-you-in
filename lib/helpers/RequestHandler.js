let SuperAgent = require('superagent');

class RequestHandler {
    constructor() {
        this.agent = SuperAgent.Agent();
    }

    //todo add support for ratelimit queue
    request(endpoint, verb, data) {
        return new Promise((resolve, reject) => {
            let request = this.agent(verb, endpoint).type('application/json');
            if (data) request.send(data);
            request.then(res => {
                if ([200, 201, 204, 304].includes(res.statusCode)) return resolve(res.body);
                reject(new Error(`Invalid statuscode ${res.statusCode}`));
            }, reject);
        });
    }
}

module.exports = RequestHandler;