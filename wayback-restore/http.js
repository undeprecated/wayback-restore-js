/*jshint node: true, esversion: 6*/
/*global define, require, module*/

/**
 * A base class for creating different types of restoration objects to restore
 * based on the mime type.
 */

var debug = require( 'debug' )( 'wayback:http' );

//var http = require('http');
var https = require( 'https' );
var axios = require( "axios" );

var session = axios.create( {
    //60 sec timeout
    //timeout: 60000,

    //keepAlive pools and reuses TCP connections, so it's faster
    /*httpAgent: new http.Agent({
        maxSockets: 5,
        keepAlive: true
        //maxFreeSockets:
    }),*/
    httpsAgent: new https.Agent( {
        maxSockets: 5, keepAlive: true
        //maxFreeSockets
    } ),

    //follow up to 10 HTTP 3xx redirects
    maxRedirects: 10,

    //cap the maximum content length we'll accept to 50MBs, just in case
    //maxContentLength: 50 * 1000 * 1000
} );

async function get( url, options ) {
    //const response = await session.get( url, { responseType: 'arraybuffer' } );
    //return response.data;

    return session.get( url, { responseType: 'arraybuffer' } ).then( function ( response ) {
        return response.data;
    } ).catch( function ( err ) {
        debug( err );
        return err;
    } );
}

module.exports = {
    session: session,
    get: get,
    close: function () {
        if ( session.httpsAgent ) {
            session.httpsAgent.destroy();
        }
    }
};

/*
var taskHandler = function(task, done) {
    fetch(task.url)
        .then(function() {
            done();
        });
};

var queue;

function download(queueSize) {
    queue = async.queue(taskHandler, queueSize);

    return function(url) {
        queue.push({
            url: url
        });
    };
}
*/

/*
// assign a callback
q.drain = function() {
    console.log('all items have been processed');
};

// add some items to the queue
q.push({
    name: 'foo'
}, function(err) {});
*/
