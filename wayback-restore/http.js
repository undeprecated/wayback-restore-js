/*jshint node: true, esversion: 6*/
/*global define, require, module*/

/**
 * A base class for creating different types of restoration objects to restore
 * based on the mime type.
 */

var debug = require("debug")("wayback:http");

var fs = require("fs");
var https = require("https");
var fetch = require("node-fetch");

const httpsAgent = new https.Agent({
  maxSockets: 5,
  keepAlive: true
});

async function get(url) {
  const response = await fetch(url, {
    method: "GET",
    agent: httpsAgent
  });
  const buffer = await response.buffer();
  return Buffer.from(new Uint8Array(buffer));
}

async function download(url, path) {
  const response = await fetch(url, {
    method: "GET",
    agent: httpsAgent
  });

  const writer = fs.createWriteStream(path);

  response.body.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

module.exports = {
  get: get,
  download: download
};
