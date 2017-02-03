let util = require('util');

class Utils {
    static decode(str) {
        if (typeof str !== "string")return str;

        return str
            .replace(/&#34;/g, '\\\"')
            .replace(/&#39;/g, '\'')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
    }

    static convertToDate(plugDate) {
        var res = /(\d+)-(\d+)-(\d+)\s+(\d+):(\d+):(\d+).(\d+)/g.exec(plugDate);
        var time = "Invalid Date";

        if (res === null)
            return time;

        for (var i = res.length - 1; i >= 0; i--) {
            // clean array from unnecessary info
            if (isNaN(res[i]) && !isFinite(res[i]))
                res.splice(i, 1);
        }

        if (res.length === 3) {
            res.unshift("%s-%s-%s");
            time = util.format.apply(util, res);
        } else if (res.length === 6) {
            res.unshift("%s-%s-%sT%s:%s:%sZ");
            time = util.format.apply(util, res);
        } else if (res.length === 7) {
            res.unshift("%s-%s-%sT%s:%s:%s.%sZ");
            time = util.format.apply(util, res);
        }

        return time;
    }
}

module.exports = Utils;