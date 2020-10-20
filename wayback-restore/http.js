/*jshint node: true, esversion: 6*/
/*global define, require, module*/

/**
 * A base class for creating different types of restoration objects to restore
 * based on the mime type.
 */

var debug = require("debug")("wayback:http");

var fs = require("fs");
var https = require("https");
var axios = require("axios");

var session = axios.create({
  //keepAlive pools and reuses TCP connections, so it's faster
  httpsAgent: new https.Agent({
    maxSockets: 5,
    keepAlive: true
  }),

  //follow up to 10 HTTP 3xx redirects
  maxRedirects: 10

  //cap the maximum content length we'll accept to 50MBs, just in case
  //maxContentLength: 50 * 1000 * 1000

  /*proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  }*/
});

async function get(url) {
  //const response = await session.get( url, { responseType: 'arraybuffer' } );
  //return response.data;

  return session
    .get(url, { responseType: "arraybuffer" })
    .then(function(response) {
      return response.data;
    })
    .catch(function(err) {
      debug(err);
      return err;
    });
}

async function download(url, path) {
  const writer = fs.createWriteStream(path);

  const response = await session.get(url, {
    responseType: "stream"
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

module.exports = {
  session: session,
  get: get,
  download: download,
  close: function() {
    if (session.httpsAgent) {
      session.httpsAgent.destroy();
    }
  }
};
