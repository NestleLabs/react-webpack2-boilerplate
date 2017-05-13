const fs = require("fs");
const path = require("path");
const nconf = require("nconf");

module.exports = nconf.argv()
  .env()
  .file({ file: path.resolve(__dirname, ".env") })
  .defaults({
    "NODE_ENV": "development",
    "HOST": "0.0.0.0",
    "PORT": 3000,
    "HTTPS": false,
  });
