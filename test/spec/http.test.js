'use string';

var setup = require( '../setup' );
var http = require( '../../wayback-restore/http' );
var assert = setup.assert;

var fs = require( 'fs' );
var request = require( 'request' );

describe( "http.js", function () {

    describe( "fetch()", function () {
        it( "can fetch images", function ( done ) {
            var url = "https://web.archive.org/web/20150531082612id_/http://www.cashpropertysolutions.co.uk/wp-content/uploads/2015/04/homevestors-how-does-it-work21.jpg";
            var response = http.get( url ).then( function ( data ) {
                assert.isNotEmpty( data );
                done();
            } );
        } );

        it( "can fetch html", function ( done ) {
            var url = "https://web.archive.org/web/20150531065350id_/http://www.cashpropertysolutions.co.uk/";
            var content = http.get( url ).then( function ( data ) {
                assert.isNotEmpty( data );
                done();
            } );
        } );
    } );
} );
