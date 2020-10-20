/* jshint esversion: 6 */
/*global define, require, module */

// Core Modules
var debug = require("debug")("wayback:restore");

// Third Party Modules

// Local Modules
var parse = require("./parse");
var { Process } = require("./process");

/**
 * This is the main restore process of a Wayback Machine archive.
 */
function restore(settings) {
  const defaults = {
    timestamp: "",
    url: "",
    domain: "",
    directory: "restore", // base directory
    max_pages: -1, //(unlimited)
    links: true, // restore links
    assets: true, // restore assets
    concurrency: settings.concurrency || 1,
    log: false,
    logFile: "restore.log"
  };

  if (typeof settings === "string") {
    let url = settings;
    settings = {};
    settings.url = url;
  }

  settings = Object.assign(defaults, settings);

  if (settings.url !== "") {
    const { domain, timestamp } = parse.parse(settings.url);
    settings.domain = domain;
    settings.timestamp = timestamp;
  } else if (settings.domain !== "" && settings.timestamp !== "") {
    settings.url = `https://web.archive.org/web/${settings.timestamp}/http://${settings.domain}`;
  } else {
    throw "Invalid settings";
  }

  return new Process(settings);
}
/**
 * @TODO: Restore based on Snapshots
 * This method finds all CDX snapshots and restores based on the results.
 *
function restoreSnapshots(domain, to, from=null) {
    var process = new Process(settings);
    process.start = () => {
      await this.fetchCdx({
        url: this.settings.domain + "*",
        filter: "statuscode:200",
        collapse: "timestamp:8,digest",
        to: this.settings.timestamp
      });

      this.q = async.queue((asset, callback) => {
        this.restoreAsset(asset, callback);
      }, this.settings.concurrency);

      this.q.drain = async () => {
        return await process.complete();
      };

      this.db.cdx.forEach((asset, keys) => {
        this.q.push(asset);
      });
  }
}*/

module.exports = restore;
