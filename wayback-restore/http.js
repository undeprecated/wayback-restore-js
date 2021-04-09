/*jshint node: true, esversion: 6*/
/*global define, require, module*/

/**
 * A base class for creating different types of restoration objects to restore
 * based on the mime type.
 */

var debug = require("debug")("wayback:http");

var fs = require("fs");
var https = require("https");
var request = require("request");

const httpsAgent = new https.Agent({
  maxSockets: 5,
  keepAlive: true
});

async function download(url, path) {
  if (!path) {
    return request({
      url: url,
      agent: httpsAgent,
      headers: {
        "User-Agent": "Wayback Restore"
      }
    });
  }
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(path);

    request({
      url: url,
      agent: httpsAgent,
      headers: {
        "User-Agent": "Wayback Restore"
      }
    }).pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

module.exports = {
  download: download
};