/*jshint node: true, esversion: 6*/
/*global define, require, module*/

/**
 * A base class for creating different types of restoration objects to restore
 * based on the mime type.
 */
var debug = require("debug")("wayback:asset");
var request = require("request");

// Third Party Modules
//var Promise = require("bluebird");

// Local Modules
var core = require("./core");
var helpers = require("./helpers");
var http = require("./http");

var cheerio = require("cheerio");

var ARCHIVE_TEMPLATE = core.ARCHIVE_TEMPLATE;
var RESTORE_STATUS = core.RESTORE_STATUS;

/*
Promise.promisifyAll(require("request"), {
    multiArgs: true
});
*/

function Asset() {
    this.key = null;

    // the url to restore
    this.original_url = "";

    this.timestamp = "";

    // restored | failed | unarchived
    this.status = RESTORE_STATUS.EMPTY;

    // mimetype: html, image, css, js, based on wayback types
    this.mimetype = "";

    this.type = "";

    // restored content
    this.content = null;

    // links on the page to restore
    this.links = [];

    // assets used by the page
    this.assets = [];
}

Asset.prototype.getSnapshot = function(raw) {
    var timestamp = this.timestamp;
    var url = this.original_url;
    var flag = raw ? "id_" : "";

    return ARCHIVE_TEMPLATE + `${timestamp}${flag}/${url}`;
};

Asset.prototype.contentType = function() {
    return convertMimeType(this.mimetype);
};

Asset.prototype.setTypeFromMimeType = function(mimetype) {
    this.type = convertMimeType(mimetype);
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
 * @param   {String}    url        A url to restore
 * @return  {Promise}   A Promise to return restored content.
 */
Asset.prototype.fetch = async function(raw) {
    var me = this;

    var url = me.getSnapshot(raw);

    debug("fetch url", url);

    try {
        me.content = await http.get(url);

        //me.content = Buffer.from(new Uint8Array(me.content));
        //me.content = Buffer.from(await http.get(url));

        if (
            me.contentType() === "text" ||
            me.contentType() === "css" ||
            me.contentType() === "script"
        ) {
            me.content = Buffer.from(new Uint8Array(me.content));
            //me.content = me.content.toString( 'utf8' );

            try {
                var $ = cheerio.load(me.content);
                me.content = $.html();
                me.links = me.extractLinks($);
                me.assets = me.extractAssets($);
                // reloads content that might have been rewritten
                //me.content = $.html();
                me.content = contentCleanup(me.content, me.domain);
            } catch (err) {
                debug(err);
            }
        }

        return me.content;
    } catch (err) {
        debug(err);
    }
};

/**
 * Extract the links to assets ie images, CSS, JS
 *
 * @param page {RestorePage} The object to find more links to restore.
 * @return {Array}  Links found
 */
Asset.prototype.extractAssets = function($) {
    var me = this;

    me.assets = [];

    $("[src], link[href]").each(function(index, link) {
        var src = $(link).attr("src");

        if (src) {
            me.assets.push(src);
            $(link).attr("src", helpers.makeRelative(src));
        }

        var href = $(link).attr("href");
        if (href) {
            me.assets.push(href);
            $(link).attr("href", helpers.makeRelative(href));
        }
    });

    return me.assets;
};

Asset.prototype.extractLinks = function($) {
    var me = this,
        domain = this.domain;

    me.links = [];

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
            me.links.push(href);
        }
    });

    return me.links;
};

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
    } else {
        return "other";
    }
}

/**
 * Remove extraneous code from the restored content and cleanup links.
 */
function contentCleanup(content, domain) {
    //content = content.replace(/(\/web\/[0-9]+([imjscd_\/]+)?(http[s]?:\/\/[0-9a-zA-Z-_\.]*{this.options.domain})?)/gim, '');
    content = content.replace(
        /(\/web\/[0-9]+([imjscd_\/]+)?(http[s]?:\/\/[0-9a-zA-Z-_\.]*{domain})?)/gim,
        ""
    );

    content = content.replace(/(https?:)?\/\/web.archive.org/gi, "");

    return content;
}

module.exports = {
    Asset: Asset
};
