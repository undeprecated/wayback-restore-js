/* jshint esversion: 6 */
/*global define, require, module */

// Core Modules
var debug = require( 'debug' )( 'wayback:restore' );

// Third Party Modules

// Local Modules
var Process = require( './process' );
var helper = require( './helpers' );

/**
 * This is the main restore process of a Wayback Machine archive.
 *
 * @param  {[type]} url  An archive url to restore.
 * @return {[type]}      [description]
 */
function restore( settings ) {
    if ( settings.url ) {
        return createProcess( settings );
    }

    if ( settings.domain ) {
        settings.url = settings.url = `http://${ settings.domain }`;
        return createProcess( settings );
    }
}

function createProcess( settings ) {
    settings.domain = helper.parseDomainToRestore( settings.url );

    return new Process( settings );
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
