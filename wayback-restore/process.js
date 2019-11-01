/* jshint node: true, esversion: 6 */
/* global define, require, module, Promise, Map, async */

'use strict';

// Core Modules
var debug = require( 'debug' )( 'wayback:process' );
var es = require( 'event-stream' );
var util = require( 'util' );
var EventEmitter = require( 'events' );
var url = require( 'url' );
var path = require( 'path' );
var parseDomain = require( 'parse-domain' );

// Third-Party Modules
var fs = require( 'fs-extra' );

// Local Modules
var core = require( './core' );
var help = require( './helpers' );
var Asset = require( './asset' ).Asset;
var cdx = require( './cdx' );

var ARCHIVE_TEMPLATE = core.ARCHIVE_TEMPLATE;
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

    this.results = {
        url: this.settings.url,
        domain: this.settings.domain,
        timestamp: this.settings.timestamp,
        directory: this.settings.directory,
        start_dt: '',
        end_dt: '',
        restored_count: 0,
        failed_count: 0
    };
}

util.inherits( Process, EventEmitter );

Process.prototype.onCompleted = function ( results ) {};

Process.prototype.start = async function () {
    this.results.start_dt = Date.now();
    this.emit( EVENT.STARTED );

    await this.createOutputDirectory( this.settings.directory );

    await this.fetchCdx( {
        url: this.settings.domain + '*',
        filter: 'statuscode:200',
        collapse: 'timestamp:8,digest',
        to: this.settings.timestamp,
        //output: 'json'
    } );

    await this.restore( this.settings.url );

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

Process.prototype.restore = async function ( urls ) {
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
                    //await me.restore( asset );
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

                    if ( me.settings.assets ) {
                        debug( 'restoring assets' );
                        await me.restore( asset.assets );
                    }
                    if ( me.settings.links ) {
                        debug( 'restoring links' );
                        await me.restore( asset.links );
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

/**
 * Restore process has completed.
 */
Process.prototype.complete = function () {
    var me = this;

    me.results.end_dt = Date.now();

    if ( me.settings.log ) {
        me.saveToFile( me.settings.logFile, JSON.stringify( me.getLogData(), null, 2 ) );
    }

    me.emit( 'completed', me.results );

    me.onCompleted( me.results );
};

Process.prototype.saveAsset = async function ( asset ) {
    asset.filename = convertLinkToLocalFile( this.settings.domain, asset.original_url );
    await this.saveToFile( this.settings.websiteDirectory + '/' + asset.filename, asset.content );
    return asset;
};

Process.prototype.setRestoring = function ( asset ) {
    asset.setRestoring();
    this.db.restored[ asset.key ] = STATUS.RESTORING;
    this.emit( STATUS.RESTORING, asset );
    return asset;
};

Process.prototype.setRestored = function ( asset ) {
    asset.setRestored();
    this.db.restored[ asset.key ] = STATUS.RESTORED;
    this.results.restored_count++;
    this.emit( STATUS.RESTORED, asset );
    return asset;
};

Process.prototype.restoreFailed = function ( error, asset ) {
    debug( 'restore failed', asset );
    //debug('snapshot', asset.getSnapshot());
    debug( error );
    asset.setFailed();
    this.results.failed_count++;
    this.db.restored[ asset.key ] = STATUS.FAILD;
    this.emit( STATUS.FAILED, asset );
};

Process.prototype.hasBeenRestored = function ( asset ) {
    return !!this.db.restored[ asset.key ];
};

/**
 * Create base directory for restore output.
 */
Process.prototype.createOutputDirectory = async function ( dir ) {
    try {
        await fs.emptyDir( dir )
    } catch ( err ) {
        debug( 'Error creating output directory', err );
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

Process.prototype.getLogData = function ( filename ) {
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

function convertLinkToKey( domain, link ) {
    var key = help.makeRelative( link );

    // @TODO - move this to constructor? doesn't need to be called every time
    var re = new RegExp( ARCHIVE_TEMPLATE, "i" );

    key = key.replace( re, '' );

    re = new RegExp( '(\/web\/[0-9]+([imjscd_\/]+)?(http[s]?:\/\/[0-9a-zA-Z-_\.]*' + domain + ')?)', 'gim' );
    key = key.replace( re, '' );

    // remove leading slashes
    key = key.replace( /^\/+/i, '' );

    // remove trailing slash
    key = key.replace( /\/$/, '' );

    var cdxkey = _keyLead( domain ) + '/' + key;
    //debug('to cdx key: ' + cdxkey);
    return cdxkey.toLowerCase();
}

function _keyLead( domain ) {
    var pd = parseDomain( domain ),
        tld = pd.tld.split( '.' ).reverse().join( ',' );
    return tld + ',' + pd.domain + ')';
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

module.exports = {
    Process: Process,
    convertLinkToKey: convertLinkToKey
};
