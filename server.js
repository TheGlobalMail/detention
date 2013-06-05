// Require libraries
var fs = require("fs");
var express = require("express");
var site = express();

// Serve static files
site.use("/", express.static(__dirname + '/app'));

site.get("/embed/*", function(req, res) {
  fs.createReadStream(__dirname + "/app/embed.html").pipe(res);
});

// Ensure all routes go home, client side app..
site.get("*", function(req, res) {
  fs.createReadStream(__dirname + "/app/index.html").pipe(res);
});

// Actually listen
site.listen(process.env.PORT || 8081);
console.log('Server listening on ' + (process.env.PORT || 8081));

module.exports = site;
