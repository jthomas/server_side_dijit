var connect = require('connect'),
    server_side = require('./lib/server_side');

var app = connect()
  .use(server_side)
  .use(connect.static('public'))
  .listen(3000);
