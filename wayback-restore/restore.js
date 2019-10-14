/* jshint esversion: 6 */
/*global define, require, module */

// Core Modules
var debug = require( 'debug' )( 'wayback:restore' );

// Third Party Modules

// Local Modules
var parse = require( './parse' );
var Process = require( './process' );

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
function restore( settings ) {
    if ( typeof settings === 'string' ) {
        let url = settings;
        settings = {};
        settings.url = url;
    }

    const defaults = {
        timestamp: '',
        url: '',
        domain: '',
        links: false, // restore links
        assets: true, // restore assets
        directory: 'restore', // base directory
        websiteDirectory: 'website', // directory for restored content
        log: false,
        logDir: 'logs', // directory for log files,
        logFile: 'restore.log'
    }

    settings = Object.assign( defaults, settings );

    if ( settings.url !== '' ) {
        const { domain, timestamp } = parse.parse( settings.url );
        settings.domain = domain;
        settings.timestamp = timestamp

        return new Process( settings );
    } else if ( settings.domain !== '' && settings.timestamp !== '' ) {
        settings.url = `https://web.archive.org/web/${ settings.timestamp}/http://${ settings.domain }`;

        return new Process( settings );
    } else {
        throw "Invalid settings";
    }
}

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
