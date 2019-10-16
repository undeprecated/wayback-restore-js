.next/* jshint node: true, esversion: 6 */
/* global define, require, module, Promise, Map, async */

'use strict';

// Core Modules
var debug = require( 'debug' )( 'wayback:process' );
var es = require( 'event-stream' );
var util = require( 'util' );
var EventEmitter = require( 'events' );
var url = require( 'url' );
var path = require( 'path' );

// Third-Party Modules
var fs = require( 'fs-extra' );

// Local Modules
var core = require( './core' );
var help = require( './helpers' );
var Asset = require( './asset' ).Asset;
var convertLinkToKey = require( './asset' ).convertLinkToKey;
var cdx = require( './cdx' );

var ARCHIVE_SOURCE = core.ARCHIVE_SOURCE;

var STATUS = core.RESTORE_STATUS;

// Events fired by Process
var EVENT = core.EVENTS;

/**
 * Asset restore process.
 *
 * @TODO: Rename Process to AssetRestore
 */
function Process( settings ) {
    EventEmitter.call( this );

    this.settings = settings;

    debug( 'Settings', this.settings );

    this.db = {
        cdx: new Map(),
        restored: {}
    };
}

util.inherits( Process, EventEmitter );

Process.prototype.start = async function () {
    var me = this;

    this.emit( EVENT.STARTED );

    await this.createOutputDirectory();

    await this.fetchCdx( {
        url: this.settings.domain + '*',
        filter: 'statuscode:200',
        collapse: 'timestamp:8,digest',
        to: this.settings.timestamp,
        //output: 'json'
    } );

    await this.next( me.settings.url );

    this.complete();
};

Process.prototype.fetchCdx = function ( options, callback ) {
    var me = this;

    return new Promise( function ( resolve, reject ) {
        cdx.stream( options ).on( 'end', function () {
            resolve( me.db.cdx );

            /*if (callback) {
                    return callback.call(me.db.cdx);
                }*/
        } ).pipe( es.map( function ( record, next ) {
            record = JSON.parse( record );

            var asset = new Asset();
            asset.key = record.urlkey;
            asset.original_url = record.original;
            asset.timestamp = record.timestamp;
            asset.mimetype = record.mimetype;
            asset.domain = me.settings.domain;
            //asset.type = asset.setTypeFromMimeType(record.mimetype);

            me.db.cdx.set( asset.key, asset );
        } ) );
    } );
};

Process.prototype.findAssetByUrl = async function ( url ) {
    var self = this;
    return await self.findAssetByKey( convertLinkToKey( self.settings.domain, url ) );
};

Process.prototype.findAssetByKey = async function ( key ) {
    var self = this;
    return new Promise( function ( resolve, reject ) {
        var asset = self.db.cdx.get( key );

        if ( asset ) {
            resolve( asset );
        } else {
            reject( `asset does not exist for key [${ key }]` );
        }
    } );
};

Process.prototype.next = async function ( urls ) {
    var me = this;
    var i;

    if ( !Array.isArray( urls ) ) {
        urls = [ urls ];
    }

    for ( i = 0; i < urls.length; i++ ) {
        var url = urls[ i ];

        debug( 'processing url', url );
        try {
            var asset = await me.findAssetByUrl( url );

            if ( asset ) {
                debug( 'found asset to restore for url', asset.original_url );

                if ( !me.hasBeenRestored( asset ) ) {
                    await me.restore( asset );

                    if ( me.settings.assets ) {
                        debug( 'restoring assets' );
                        await me.next( asset.assets );
                    }
                    if ( me.settings.links ) {
                        debug( 'restoring links' );
                        await me.next( asset.links );
                    }
                } else {
                    debug( 'already restored url', asset.original_url );
                }
            }
        } catch ( err ) {
            debug( err );
        }
    }
};

Process.prototype.restore = async function ( asset ) {
    var me = this;

    me.setRestoring( asset );

    try {
        await asset.fetch( true );

        debug( 'save asset', asset.original_url );
        await me.saveAsset( asset );

        asset.clear();

        debug( 'set restored', asset.original_url );
        me.setRestored( asset );
    } catch ( error ) {
        me.restoreFailed( error, asset );
    }
};

/**
 * Restore process has completed.
 */
Process.prototype.complete = function () {
    var me = this;

    me.end_dt = Date.now();

    if ( me.settings.log ) {
        me.saveToFile( me.settings.logDir + '/' + me.settings.logFile, JSON.stringify( me.getLog(), null, 2 ) );
    }

    me.emit( 'completed' );
    //this.onCompleted(project_results);
};

Process.prototype.saveAsset = async function ( asset ) {
    asset.filename = convertLinkToLocalFile( this.settings.domain, asset.original_url );
    await this.saveToFile( this.settings.websiteDirectory + '/' + asset.filename, asset.content );
    return asset;
};

/**
 * Extract the links to assets ie images, CSS, JS
 *
 * @param page {RestorePage} The object to find more links to restore.
 * @return {Array}  Links found
 *
Process.prototype.extractAssets = function($) {
    var links = [];

    $('[src], link[href]').each(function(index, link) {
        var src = $(link).attr('src');

        if (src) {
            links.push(src);
            $(link).attr('src', help.makeRelative(src));
        }

        var href = $(link).attr('href');
        if (href) {
            links.push(href);
            $(link).attr('href', help.makeRelative(href));
        }
    });

    return links;
};

Process.prototype.extractLinks = function($) {
    var restore = this,
        domain = this.settings.domain,
        links = [];

    // get all hrefs
    $('a[href]').each(function(index, a) {
        var href = $(a).attr('href');

        if (filter(href)) {
            links.push(href);
        }
    });

    return links;
};
*/
/**
 * Remove extraneous code from the restored content and cleanup links.
 *
Process.prototype.contentCleanup = function(content) {
    //content = content.replace(/(\/web\/[0-9]+([imjscd_\/]+)?(http[s]?:\/\/[0-9a-zA-Z-_\.]*{this.options.domain})?)/gim, '');
    content = content.replace(/(\/web\/[0-9]+([imjscd_\/]+)?(http[s]?:\/\/[0-9a-zA-Z-_\.]*{this.settings.domain})?)/gim, '');

    content = content.replace(/(https?:)?\/\/web.archive.org/gi, '');

    return content;
};
*/

Process.prototype.setRestoring = function ( asset ) {
    asset.setRestoring();
    this.db.restored[ asset.key ] = STATUS.RESTORING;
    this.emit( STATUS.RESTORING, asset );
    return asset;
};

Process.prototype.setRestored = function ( asset ) {
    asset.setRestored();
    this.db.restored[ asset.key ] = STATUS.RESTORED;
    this.emit( STATUS.RESTORED, asset );
    return asset;
};

Process.prototype.hasBeenRestored = function ( asset ) {
    return !!this.db.restored[ asset.key ];
};

Process.prototype.restoreFailed = function ( error, asset ) {
    debug( 'restore failed', asset );
    //debug('snapshot', asset.getSnapshot());
    debug( error );
    asset.setFailed();
    this.db.restored[ asset.key ] = STATUS.FAILD;
    this.emit( STATUS.FAILED, asset );
};

// Load me from database
//Process.prototype.load = function() {
//this.db.load();
//};

//Process.prototype.emptyDb = function(callback) {
//    this.db.cdx = {};
/*
this.db.cdx.db.remove({}, { multi: true }, function (err, numRemoved) {
    if (err) {
        return callback(err);
    }
    return callback(null, numRemoved);
}); */
//};

/**
 * Create base directory for restore output.
 */
Process.prototype.createOutputDirectory = async function () {
    var dir = this.settings.directory;

    try {
        await fs.emptyDir( this.settings.directory )
    } catch ( err ) {
        debug( 'Error creating output director', err );
    }
};

/**
 * Asynchronously write content to a file and makes the directory path if it
 * does not exist.
 *
 * @param  {String} content Data to write to a  file.
 * @param  {String} file    Full file and pathname.
 */
Process.prototype.saveToFile = async function ( filename, content ) {
    filename = path.normalize( this.settings.directory + '/' + filename );

    try {
        //await fs.outputFile(filename, content, 'binary');
        await fs.outputFile( filename, content );
    } catch ( err ) {
        debug( 'Error saving to file', file, err );
    }
};

Process.prototype.getLog = function ( filename ) {
    var self = this;
    var log = {};

    for ( var [key, asset] of self.db.cdx.entries() ) {
        if ( !log.hasOwnProperty( asset.status ) ) {
            log[ asset.status ] = [];
        }
        log[ asset.status ].push( asset );
    }

    return log;
};

/*
Process.prototype.saveToBaseDir = function(content, file) {
    var fh = fs.createWriteStream(this.settings.directory + '/' + file);

    fh.write(content);

    fh.end();
};
Process.prototype.saveToLogDir = function(content, file) {
    this.saveToBaseDir(content, 'logs' + '/' + file);
};*/

function convertLinkToLocalFile( domain, link ) {
    var file;
    var key = link;
    //var key = Url.makeRelative(link);

    // @TODO - move this to constructor? doesn't need to be called every time
    var re = new RegExp( ARCHIVE_SOURCE, "i" );

    key = key.replace( re, '' );

    re = new RegExp( '(\/web\/[0-9]+([imjscd_\/]+)?(http[s]?:\/\/[0-9a-zA-Z-_\.]*' + domain + ')?)', 'gim' );
    key = key.replace( re, '' );

    // remove leading slashes
    key = key.replace( /^\/+/i, '' );

    file = convertToPath( key );

    return file;
}

/**
 * Converts a URL to a local file path and name
 */
function convertToPath( url ) {
    var obj = path.parse( help.makeRelative( url ) );

    var dir = obj.dir,
        filename = obj.name !== ''
            ? obj.name
            : 'index',
        suffix = obj.ext !== ''
            ? obj.ext
            : '.html';

    dir = dir.replace( /^\//, '' ); // remove leading slash
    dir = dir.replace( /\/$/, '' ); // remove trailing slash

    return dir + '/' + filename + suffix;
}

function filter( link ) {
    // filter links
    if ( !( /^javascript/i.test( link ) || /^mailto/i.test( link ) ||
    ///^http/i.test(link) ||
    /^#/.test( link ) || /^\?/.test( link ) || /^\/\//i.test( link ) ) ) {
        return link;
    }
    return;
}

module.exports = Process;
