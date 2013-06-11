// Require libraries
var fs = require("fs");
var express = require("express");
var site = express();

var indexHtml = fs.readFileSync(__dirname + "/dist/index.html", 'utf8');
var fbMetaRegex = /"og:url" content="http:\/\/behindthewire.theglobalmail.org/;

// Serve static files
site.get("/test-story/*", function(req, res) {
  fs.createReadStream(__dirname + "/dist/story.html").pipe(res);
});

site.get("/test-embed/*", function(req, res) {
  fs.createReadStream(__dirname + "/dist/embed-sizes.html").pipe(res);
});

site.get("/embed/*", function(req, res) {
  fs.createReadStream(__dirname + "/dist/embed.html").pipe(res);
});

site.get("/", function(req, res) {
  res.writeHeader(200, {"Content-Type": "text/html"});
  res.write(indexHtml);
  res.end();
});

// Ensure all routes go home, client side app..
site.get("*", function(req, res) {
  res.writeHeader(200, {"Content-Type": "text/html"});
  res.write(indexHtml.replace(fbMetaRegex, '$&' + req.url));
  res.end();
});

// Actually listen
site.listen(process.env.PORT || 8081);
console.log('Server listening on ' + (process.env.PORT || 8081));

module.exports = site;
