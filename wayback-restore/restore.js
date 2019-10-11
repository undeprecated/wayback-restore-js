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
    if ( settings.url ) {
        settings.domain = parse.parseDomain( settings.url );

        return new Process( settings );
    } else if ( settings.domain ) {
        settings.url = settings.url = `http://${ settings.domain }`;
        settings.domain = parse.parseDomain( settings.url );

        return new Process( settings );
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
