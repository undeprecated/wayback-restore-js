var debug = require( "debug" )( "wayback:parse" );

var mod_url = require( "url" );
var parse_domain = require( "parse-domain" );

const Wayback = {
    parse: url => {
        let x = url;
        x = Wayback.strip( x );
        let [timestamp, web] = x.split( "/", 1 );

        web = x.replace( timestamp, "" ).replace( "/", "" );

        return { url: web, timestamp: timestamp };
    },
    parseTimestamp: from_url => {
        let { url, timestamp } = Wayback.parse( from_url );

        return timestamp;
    },
    parseDomain: from_url => {
        var {
            url,
            timestamp
        } = Wayback.parse( from_url );
        var myURL = mod_url.parse( url );
        var link = parse_domain( myURL.hostname );

        if ( link ) {
            return link.domain + "." + link.tld;
        } else {
            debug( "Could not extract an archived link" );
            return;
        }
    },
    strip: url => {
        let x = url;
        x = x.replace( "http://web.archive.org/web/", "" );
        x = x.replace( "https://web.archive.org/web/", "" );
        return x;
    }
};

module.exports = {
    parseDomain: function ( url ) {
        return Wayback.parseDomain( url );
    },
    parseTimestamp: function ( url ) {
        return Wayback.parseTimestamp( url );
    },
    parse: function ( url ) {
        return Wayback.parse( url );
    }
};
