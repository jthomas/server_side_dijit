var render = require('./render.js');

module.exports = function (config) {
    // Create AMD packages from module configuration.
    var page = render({
        dojo: config.dojo + "/dojo",
        dijit: config.dojo + "/dijit",
        server_side: __dirname + "/../public/js/server_side"
    });

    return function (req, res, next) {
        var ignore = function (accept) {
            return accept.indexOf("text/html") === -1;
        };

        if (ignore(req.headers.accept)) {
            return next();
        }

        var write = res.write,
            end = res.end,
            buffer = "";

        // Only hook into text/html requests....
        res.write = function (chunk, encoding) {
            buffer = buffer.concat(chunk);
            return true;
        };

        res.end = function (chunk, encoding) {
            if (chunk) {
                res.write(chunk);
            }

            // Fix content-length, we now have more data to send.
            var rendered = page(buffer);
            res.setHeader("Content-Length", rendered.length);

            return end.call(res, rendered, encoding);
        };

        next();
    };
};
