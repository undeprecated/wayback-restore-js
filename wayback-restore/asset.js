/*jshint node: true, esversion: 6*/
/*global define, require, module*/

/**
 * A base class for creating different types of restoration objects to restore
 * based on the mime type.
 */
var debug = require("debug")("wayback:asset");
var fs = require("fs-extra");
var path = require("path");

// Local Modules
var core = require("./core");
var helpers = require("./helpers");
var http = require("./http");

//var cheerio = require("cheerio");

var ARCHIVE_TEMPLATE = core.ARCHIVE_TEMPLATE;
var RESTORE_STATUS = core.RESTORE_STATUS;

function Asset() {
  // CDX urlkey
  this.key = null;

  // the url to restore
  this.original_url = "";

  // path to local file
  this.restored_file = "";

  this.timestamp = "";

  // restored | failed | unarchived
  this.status = RESTORE_STATUS.EMPTY;

  // mimetype: html, image, css, js, based on wayback types
  this.mimetype = "";

  this.type = "";
}

Asset.prototype.getSnapshotUrl = function(raw) {
  var timestamp = this.timestamp;
  var url = this.original_url;
  var flag = raw ? "id_" : "";

  return ARCHIVE_TEMPLATE + `${timestamp}${flag}/${url}`;
};

Asset.prototype.clear = function() {
  this.content = null;
};

Asset.prototype.isRestored = function() {
  return this.status === RESTORE_STATUS.RESTORED;
};

Asset.prototype.setRestored = function() {
  this.status = RESTORE_STATUS.RESTORED;
};

Asset.prototype.setFailed = function() {
  this.status = RESTORE_STATUS.FAILED;
};

Asset.prototype.setRestoring = function() {
  this.status = RESTORE_STATUS.RESTORING;
};

/**
 * Get the content from Waybak Machine.
 *
 * @param {String} url - A url to restore
 * @param {mix} The restored content
 */
Asset.prototype.fetch = async function(url) {
  var me = this;
  var flag = false;

  try {
    var content = await http.get(url);
    return Buffer.from(new Uint8Array(content));

    /*if (
      me.type === "json" ||
      me.type === "xml" ||
      me.type === "text" ||
      me.type === "css" ||
      me.type === "script"
    ) {
      return Buffer.from(new Uint8Array(content));
    } else {
      return content;
  }*/

    /*me.content = await http.get(url);

        //me.content = Buffer.from(new Uint8Array(me.content));
        //me.content = Buffer.from(await http.get(url));

        if (me.type === "xml") {
            me.content = Buffer.from(new Uint8Array(me.content));
            return true;
        }

        if (me.type === "json") {
            me.content = Buffer.from(new Uint8Array(me.content));
            return true;
        }

        if (me.type === "text" || me.type === "css" || me.type === "script") {
            me.content = Buffer.from(new Uint8Array(me.content));
            //me.content = me.content.toString("utf8");

            try {
                var $ = cheerio.load(me.content);
                if (me.type === "text") {
                    me.content = $.html();
                }
                if (me.type === "css" || me.type === "script") {
                    me.content = $.text();
                }

                me.links = me.extractLinks($);
                me.assets = me.extractAssets($);
                me.content = contentCleanup(me.content, me.domain);

                flag = true;
            } catch (err) {
                debug(err);
            }
        }

        //return me.content;
        return flag;*/
  } catch (err) {
    debug(err);
  }

  return "";
};

/**
 * Download streams content directly to a local file.
 * @param  {String} path - Local file path to save to.
 */
Asset.prototype.download = async function(file_path) {
  var snapshot = this.getSnapshotUrl(true);
  await fs.ensureDir(path.dirname(file_path));
  await http.download(snapshot, file_path);
  this.restored_file = file_path;
  return this;
};

/**
 * Extract the links to assets ie images, CSS, JS
 *
 * @param page {RestorePage} The object to find more links to restore.
 * @return {Array}  Links found
 */
Asset.prototype.extractAssets = function($) {
  var me = this;
  var assets = [];
  //assets = [];

  $("[src], link[href]").each(function(index, link) {
    var src = $(link).attr("src");

    if (src) {
      assets.push(src);
      $(link).attr("src", helpers.makeRelative(src));
    }

    var href = $(link).attr("href");
    if (href) {
      assets.push(href);
      $(link).attr("href", helpers.makeRelative(href));
    }
  });

  return assets;
};

Asset.prototype.extractLinks = function($) {
  var me = this;
  //var domain = this.domain;

  var links = [];

  // get all hrefs
  $("a[href]").each(function(index, a) {
    var href = $(a).attr("href");
    /*
        // remove archive
        href = rewriteLink(domain, href);

        var re = new RegExp("^(http[s:])?[//w.]*" + domain, "i");
        if (re.test(href)) {
            href = Url.makeRelative(href);
        }*/

    if (filter(href)) {
      // rewrites hrefs
      //$(a).attr("href", "test");
      //href = Url.makeRelative(href);
      links.push(href);
    }
  });

  return links;
};

/*
Asset.prototype.downloadFile = async (url, path) => {
    const res = await fetch(url);
    const fileStream = fs.createWriteStream(path);
    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", err => {
            reject(err);
        });
        fileStream.on("finish", function() {
            resolve();
        });
    });
};
*/

function filter(link) {
  if (
    !(
      /^javascript/i.test(link) ||
      /^mailto/i.test(link) ||
      ///^http/i.test(link) ||
      /^#/.test(link) ||
      /^\?/.test(link) ||
      /^\/\//i.test(link)
    )
  ) {
    return link;
  }
  return;
}

/**
 * Convert a CDX mimetype to a Asset type
 *
 * @private
 * @param {string} type A mimetype
 * @return {string} AssetType
 */
function convertMimeType(type) {
  if (type.match(/^text\/css/i)) {
    return "css";
  } else if (type.match(/^text\//i)) {
    return "text";
  } else if (type.match(/^image\//i)) {
    return "image";
  } else if (type.match(/^video\//i)) {
    return "video";
  } else if (type.match(/^audio\//i)) {
    return "audio";
  } else if (type.match(/javascript/i)) {
    return "script";
  } else if (type.match(/xml/i)) {
    return "xml";
  } else if (type === "application/json") {
    return "json";
  } else {
    return "other";
  }
}

/**
 * Remove extraneous code from the restored content and cleanup links.
 *
function contentCleanup(content, domain) {
    //content = content.replace(/(\/web\/[0-9]+([imjscd_\/]+)?(http[s]?:\/\/[0-9a-zA-Z-_\.]*{this.options.domain})?)/gim, '');
    content = content.replace(
        /(\/web\/[0-9]+([imjscd_\/]+)?(http[s]?:\/\/[0-9a-zA-Z-_\.]*{domain})?)/gim,
        ""
    );

    content = content.replace(/(https?:)?\/\/web.archive.org/gi, "");

    return content;
}*/

module.exports = {
  Asset: Asset,
  convertMimeType: convertMimeType
};
