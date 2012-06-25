var render = require('./render.js');

module.exports = function serveJsHandle(req, res, next) {
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
    res.write = function(chunk, encoding){
        buffer = buffer.concat(chunk);
        return true;
    };

    res.end = function(chunk, encoding){
        if (chunk) {
            res.write(chunk);
        }
        return end.call(res, render.render(buffer), encoding);
    };
    
    next();
};
