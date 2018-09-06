/*jshint node: true*/
/*global define, require, module, exports*/

/**
 * Options available for a website restoration.
 */

"use strict";

function Options(opts) {
    this.data = {
        recursive: true,

        restore_url: '/',

        domain_to_restore: '',

        // Number of milliseconds to wait between file restores
        delay: 0,

        // Number of links to process
        // -1 for unlimited
        max_links_processed: -1,

        // @TODO implement
        // Redirection handling
        redirect: {
            to: '',
            type: ''
        },

        // @TODO deprecate
        // Filename of restore log
        logfile: 'output.log',

        // @TODO deprecate
        // Debug filename
        debug: 'debug.log',

        // @TODO implement
        // Base restore directory
        restoreDir: ''
        
        // Directory name containing restored files
        // @TODO deprecate - writing of restore should be moved to Project.js
        files_dir: 'files',


        // don't restore files more recent than this date (YYYYMMDD)
        //max_timestamp: ''
    };
}

//Options.prototype.data = {};

Options.prototype.get = function (name) {
    return this.data[name];
};

Options.prototype.set = function (name, value) {
    this.data[name] = value;
};

Options.prototype.hasRedirect = function () {
    return this.get('redirect') && this.get('redirect').to !== '';
};

module.exports = Options;
