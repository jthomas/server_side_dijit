var connect = require('connect'),
    server_side = require('../lib/server_side');

if (!process.env.DOJO_SOURCE) {
    console.log("Please set top-level directory containing Dojo 1.8 source as the following environment variable: DOJO_SOURCE");
    process.exit(1);
}

var app = connect()
  .use(connect.directory(__dirname + '/public', { icons: true }))
  .use(server_side({dojo: process.env.DOJO_SOURCE}))
  .use("/dojo", connect.static(process.env.DOJO_SOURCE))
  .use("/server_side", connect.static(__dirname + '/../public/js/server_side'))
  .use(connect.static(__dirname + '/public'))
  .listen(3000);
