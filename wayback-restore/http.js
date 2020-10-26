/*jshint node: true, esversion: 6*/
/*global define, require, module*/

/**
 * A base class for creating different types of restoration objects to restore
 * based on the mime type.
 */

var debug = require("debug")("wayback:http");

var fs = require("fs");
var https = require("https");
//var fetch = require("node-fetch");
var request = require("request");

const httpsAgent = new https.Agent({
  maxSockets: 5,
  keepAlive: true
});

/*
async function get(url) {
  const response = await fetch(url, {
    method: "GET",
    agent: httpsAgent
  });
  const buffer = await response.buffer();
  return Buffer.from(new Uint8Array(buffer));
}*/

/*
async function download2(url, path) {
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
}*/

async function download(url, path) {
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
