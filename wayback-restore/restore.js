/* jshint esversion: 6 */
/*global define, require, module */

// Core Modules
var debug = require("debug")("wayback:restore");

// Third Party Modules

// Local Modules
var parse = require("./parse");
var { Process } = require("./process");

/*
var restore = Wayback.restore('http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk');

var restore = Wayback.restore({
    url:
        "http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk"
});

var restore = Wayback.restore({
    domain: 'cashpropertysolutions.co.uk',
    timestamp: "20150531"
});
*/

/**
 * This is the main restore process of a Wayback Machine archive.
 *
 * @param  {[type]} url  An archive url to restore.
 * @return {[type]}      [description]
 */
function restore(settings) {
    const defaults = {
        timestamp: "",
        url: "",
        domain: "",
        links: true, // restore links
        assets: true, // restore assets
        directory: "restore", // base directory
        log: false,
        logFile: "restore.wbmr"
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
        settings.url = `https://web.archive.org/web/${
            settings.timestamp
        }/http://${settings.domain}`;
    } else {
        throw "Invalid settings";
    }

    return new Process(settings);
}

/*
// @TODO implement this new method
function restore( settings ) {
    const defaults = {...default settings};
    settings = Object.assign(defaults, settings);
    this.process = new Process( settings );
    this.process.on('completed', this.onCompleted);
    this.process.on('restoring', this.onRestoring);
    this.process.on('restored', this.onRestored);

    return this.process;
}
*/

// @TODO implement redirect
/*
Restore.prototype.writeRedirect = function(url, file) {
    var redirect = '',
        obj = path.parse(file);

    if (this.options.redirect.type === 'htaccess') {
        redirect = Redirects.htaccess(url, this.options.redirect.to);
        this.saveToFileDir(redirect, obj.dir + '/.htacces');
    } else if (this.options.redirect.type === 'php') {
        redirect = Redirects.php(this.options.redirect.to);
        this.saveToFileDir(redirect, obj.dir + '/index.php');
    }
};
*/

module.exports = restore;
