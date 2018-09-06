/*jshint node: true*/
/*global define, require, module*/

/*
project/
    .db/
        cdx.db
        restores.db
    files/
---
settings.db
    options: <RestoreOptions>
project.db
    files: []

file
    url - url restored
    filepath - path to the restored file
    link -
*/

'use strict';

// Core Modules
var fs = require('fs');
var es = require('event-stream');
var Promise = require('bluebird');
var util = require('util');
var EventEmitter = require('events');
var url = require('url');
var debug = require('debug')('project');
var path = require('path');
var mkdirp = require('mkdirp');
var parseDomain = require('parse-domain');

// Third-Party Modules
var cheerio = require("cheerio");

// Local Modules
var //Database        = require('./database'),
    //Cdx             = require('./cdx/cdxquery'),
    //Queue        = require('./restorequeue'),
    Url = require('./Url'),
    //RestoreOptions  = require('./restore/restoreoptions'),
    Asset = require('./Asset');

//Promise.promisifyAll(Database);

var ARCHIVE_SOURCE = 'http://web.archive.org';
//var ARCHIVE_TEMPLATE = 'http://web.archive.org/web/%s';

var STATUS = {
    RESTORED: 'restored',
    FAILED: 'failed',
    RESTORING: 'restoring'
};

/**
 * Base restoration project.
 */
function Project(settings) {
    EventEmitter.call(this);

    this.settings = {
        timestamp: settings.timestamp,
        url: settings.url,

        restoreUrl: settings.restoreUrl,
        recurse: settings.recurse,
        //domainToRestore: settings.domainToRestore,
        restoreDir: settings.restoreDir
    };

    this.domain = parseDomainToRestore(this.settings.url);

    debug('Settings');
    debug(this.settings);

    this.db = {
        cdx: [],
        unrestored: {},
        restored: {}
    };

    this.data = {
        restoring: 0, // counter for number of restores in progress
        restored: 0, // number of links restored
        unrestored: 0, // number of links not restored
        start_dt: ''
    };

    this.events = {
        restoring: 'restoring'
    };

    //this.baseUrl = util.format(ARCHIVE_TEMPLATE, this.settings.maxtimestamp);

    this.asset = new Asset(this.settings);

    //this.initEvents();
}

util.inherits(Project, EventEmitter);

/*
Project.prototype.initEvents = function() {
    var project = this;

    //this.Asset.on('restoring', this.onRestore.bind(project));
    //this.Asset.on('urlrestored', this.onUrlRestored.bind(project));
};
*/
/*
Project.prototype.onRestore = function(url) {
    this.data.restoring++;
}
*/
/**
 * Handle the result of restoring a page.
 *
Project.prototype.onUrlRestored = function(url, links, assets, success) {
    if (success) {
        this.restoreSuccess(url, links, assets);
    } else {
        this.restoreFailed(url);
    }

    this.data.restoring--;

    this.checkCompletion();
};
*/

Project.prototype.restoreRaw = function(urls) {
    var project = this;

    if (!Array.isArray(urls)) {
        urls = [urls];
    }

    for (var i = 0; i < urls.length; i++) {
        var urlToRestore = urls[i];

        var link = url.resolve(ARCHIVE_SOURCE, urlToRestore);

        debug('url to restore ' + link);

        if (project.linkHasBeenProcessed(link)) {
            //if (1 > 2) {
            console.log('link has been processed:', link);
            //return;
        } else {
            project.setRestoring(link);

            project.asset.restore(link)
                .then(function(asset) {
                    var $,
                        content,
                        links = [],
                        assets = [];

                    // @TODO if asset is not an HTML document, then no need
                    // to do the following steps.
                    try {
                        $ = cheerio.load(asset.content);
                        content = $.html();
                        links = project.extractLinks($);
                        assets = project.extractAssets($);

                        content = project.contentCleanup(content);
                    } catch (err) {
                        //debug('restore error: ', err);
                    }

                    project.saveToFileDir(content, convertLinkToLocalFile(project.domain, asset.url));

                    if (assets.length) {
                        console.log('assets,', urlToRestore, '\n', assets);
                        project.restore(assets);
                    }

                    if (project.settings.recurse && links.length) {
                        project.restore(links);
                    }

                    return asset;
                })
                .then(function(asset) {
                    debug('set restored', asset.url);
                    project.setRestored(asset.url);
                });
        }
    }
};

Project.prototype.start = function() {
    //this.restore(asset);
};

Project.prototype.restore = function(urls) {
    var project = this;

    if (!Array.isArray(urls)) {
        urls = [urls];
    }

    for (var i = 0; i < urls.length; i++) {
        var urlToRestore = urls[i];

        var link = url.resolve(ARCHIVE_SOURCE, urlToRestore);

        debug('url to restore ' + link);

        if (project.linkHasBeenProcessed(link)) {
            //if (1 > 2) {
            console.log('link has been processed:', link);
            //return;
        } else {
            project.setRestoring(link);

            project.asset.restore(link)
                .then(function(asset) {
                    var $,
                        content,
                        links = [],
                        assets = [];

                    // @TODO if asset is not an HTML document, then no need
                    // to do the following steps.
                    try {
                        $ = cheerio.load(asset.content);
                        content = $.html();
                        links = project.extractLinks($);
                        assets = project.extractAssets($);

                        content = project.contentCleanup(content);
                    } catch (err) {
                        //debug('restore error: ', err);
                    }

                    project.saveToFileDir(content, convertLinkToLocalFile(project.domain, asset.url));

                    if (assets.length) {
                        console.log('assets,', urlToRestore, '\n', assets);
                        project.restore(assets);
                    }

                    if (project.settings.recurse && links.length) {
                        project.restore(links);
                    }

                    return asset;
                })
                .then(function(asset) {
                    debug('set restored', asset.url);
                    project.setRestored(asset.url);
                });
        }
    }
};

/**
 * Extract the links to assets ie images, CSS, JS
 *
 * @param page {RestorePage} The object to find more links to restore.
 * @return {Array}  Links found
 */
Project.prototype.extractAssets = function($) {
    var links = [];

    $('[src], link[href]').each(function(index, link) {
        var src = $(link).attr('src');

        if (src) {
            links.push(src);
            $(link).attr('src', Url.makeRelative(src));
        }

        var href = $(link).attr('href');
        if (href) {
            links.push(href);
            $(link).attr('href', Url.makeRelative(href));
        }
    });

    return links;
};

Project.prototype.extractLinks = function($) {
    var restore = this,
        domain = this.domain,
        links = [];

    // get all hrefs
    $('a[href]').each(function(index, a) {
        var href = $(a).attr('href');

        /*
        // remove archive
        href = rewriteLink(domain, href);

        var re = new RegExp("^(http[s:])?[//w.]*" + domain, "i");
        if (re.test(href)) {
            href = Url.makeRelative(href);
        }*/

        if (filter(href)) {
            links.push(href);
        }
    });

    return links;
};

/**
 * Remove extraneous code from the restored content and cleanup links.
 */
Project.prototype.contentCleanup = function(content) {
    //content = Removals.waybackInserts(content);
    //content = Removals.other(content);
    //content = content.replace(/(\/web\/[0-9]+([imjscd_\/]+)?(http[s]?:\/\/[0-9a-zA-Z-_\.]*{this.options.domain})?)/gim, '');
    content = content.replace(/(\/web\/[0-9]+([imjscd_\/]+)?(http[s]?:\/\/[0-9a-zA-Z-_\.]*{this.domain})?)/gim, '');

    content = content.replace(/(https?:)?\/\/web.archive.org/gi, '');

    return content;
};

Project.prototype.linkHasBeenProcessed = function(link) {
    return this.db.restored.hasOwnProperty(link);
};

Project.prototype.setRestoring = function(link) {
    debug('restoring: ', link);
    this.db.restored[link] = STATUS.RESTORING;
};

Project.prototype.setRestored = function(link) {
    this.db.restored[link] = STATUS.RESTORED;
};

Project.prototype.linkHasBeenRestored = function(link) {
    var project = this;
    //key = Cdx.convertLinkToCdxKey(project.domain, link);

    return project.db.restored.hasOwnProperty(link) && project.db.restored[link] === STATUS.RESTORED;
};

Project.prototype.linkHasNotBeenRestored = function(link) {
    var project = this;
    //key = Cdx.convertLinkToCdxKey(project.domain, link);

    return project.db.unrestored.hasOwnProperty(link);
};
/*
Project.prototype.restoreSuccess = function(url, links, assets) {
    var project = this,
        key = url;
    //key = Cdx.convertLinkToCdxKey(project.domain, url);
    //links = Page.get('links');

    debug('Restored: ' + url);

    project.db.restored[key] = true;

    //debug('Found assets: ' + assets);
    //debug('Found links: ' + links);

    if (assets) {
        assets.forEach(function(asset) {
            debug('asset: ' + asset);
            project.restore(asset);
        });
    }

    if (project.settings.recurse && links) {
        //Page.set('links', null);
        links.forEach(function(link) {
            //project.Queue.add(link);
            project.restore(link);
        });
    }

    this.data.restored++;
};
*/
/**
 *
 *
Project.prototype.restoreFailed = function(url) {
    var project = this,
        key = url;
    //key = Cdx.convertLinkToCdxKey(project.domain, url);

    project.db.restored[key] = true;

    // @TODO write redirect
    if (project.settings.hasOwnProperty('redirect') && project.settings.redirect.type !== '') {
        //this.writeRedirect(url, file)
    }

    this.data.unrestored++;
};
*/

/*
Project.prototype.onQueueItemAdd = function (item){
    //var restore = this;

    //this.restore.next(item);
    var nextItem = this.Queue.next();

    if (nextItem){
        this.restore(nextItem);
    }
};*/

// Load project from database
Project.prototype.load = function() {
    //this.db.load();
};

Project.prototype.emptyDb = function(callback) {
    this.db.cdx = {};
    /*
    this.db.cdx.db.remove({}, { multi: true }, function (err, numRemoved) {
        if (err) {
            return callback(err);
        }
        return callback(null, numRemoved);
    }); */
};

// Performs a CDX query
/*
Project.prototype.findArchived = function (options, callback) {
    var project = this;

    //this.cdx = new CdxQuery.CdxQuery(project.domain, options);
    //this.cdx.query(callback);

    return Cdx.query(project.domain, options, function(records) {
        project.db.cdx = records;
        return callback(null);
    });
};
*/

/*
Project.prototype.getNumCdxRecords = function (callback) {
    return this.db.cdx.length;
}
*/

// Save Project settings
Project.prototype.saveSettings = function() {
    //this.db.save();
};

/**
 * Restore process has completed.
 */
Project.prototype.complete = function() {
    var project = this;
    // Create the Manifest
    //this.Manifest.set('started', this.data.start_dt);
    //this.Manifest.set('ended', Date.now());
    //console.log(this.base_dir + '/' + this.Manifest.get('name'));
    //this.Manifest.save(this.base_dir + '/' + this.Manifest.get('name'));

    project.end_dt = Date.now();

    // wait a second for Node's event loop to finish before firing event.
    // somewhat ensures this event is fired last.
    setTimeout(function() {
        project.emit('completed');
    }, 1000);
};


Project.prototype.checkCompletion = function() {
    if (this.isCompleted()) {
        this.complete();
    }
};

/**
 * Restore process has fully completed when nothing is in the Queue
 * and nothing else is being restored.
 */
Project.prototype.isCompleted = function() {
    //return this.Queue.isEmpty() && this.data.restoring <= 0;
    return this.data.restoring <= 0;
};

/**
 * Create base directory for restore output.
 */
Project.prototype.createOutputDirectory = function() {
    var dir = this.settings.restoreDir;

    mkdirp.sync(dir);
};

/**
 * Asynchronously write content to a file and makes the directory path if it
 * does not exist.
 *
 * @param  {String} content Data to write to a  file.
 * @param  {String} file    Full file and pathname.
 */
Project.prototype.saveToFileDir = function(content, file) {
    var filename = this.settings.restoreDir + '/' + file;

    filename = path.normalize(filename);

    mkdirp(path.dirname(filename), function(err) {
        if (err) {
            console.error(err);
        } else {
            fs.writeFile(filename, content, 'binary', function(err) {
                if (err) throw err;
                // The file has been saved
            });
        }
    });
};

Project.prototype.saveToBaseDir = function(content, file) {
    var fh = fs.createWriteStream(this.settings.restoreDir + '/' + file);

    fh.write(content);

    fh.end();
};

Project.prototype.saveToLogDir = function(content, file) {
    this.saveToBaseDir(content, 'logs' + '/' + file);
};

function convertLinkToKey(domain, link) {

}

function parseDomainToRestore(href) {
    var domain = href.replace(ARCHIVE_SOURCE, '');

    var myURL = url.parse(domain);

    var matches = myURL.pathname.match(/http.*/gi);

    if (matches) {
        var link = parseDomain(url.parse(matches[0]).hostname);

        if (link) {
            return link.domain + '.' + link.tld;
        }
    }

    debug('Could not extract an archived link');
    return;
}

function convertLinkToLocalFile(domain, link) {
    var file;
    var key = link;
    //var key = Url.makeRelative(link);

    // @TODO - move this to constructor? doesn't need to be called every time
    var re = new RegExp(ARCHIVE_SOURCE, "i");

    key = key.replace(re, '');

    re = new RegExp('(\/web\/[0-9]+([imjscd_\/]+)?(http[s]?:\/\/[0-9a-zA-Z-_\.]*' + domain + ')?)', 'gim');
    key = key.replace(re, '');

    // remove leading slashes
    key = key.replace(/^\/+/i, '');

    file = Url.convertToPath(key);

    debug('convert link to localfile: ', link, file);
    return file;
}

function filter(link) {
    // filter links
    if (!(/^javascript/i.test(link) ||
            /^mailto/i.test(link) ||
            ///^http/i.test(link) ||
            /^#/.test(link) ||
            /^\?/.test(link) ||
            /^\/\//i.test(link))) {
        return link;
    }
    return;
}


/**
 * Interrogate a link to determine if it is one we can restore within the domain.
 *
 * @private
 *
 * @param {string} domain  The domain to restore from
 * @param {string} link    A link to restore
 * @return {null/string}    The link if it passes, else null
 *
function rewriteLink(domain, link) {
    // clean up the extracted link
    link = link.replace(/(https?:)?\/\/web.archive.org/gi, '');
    //link = link.replace(/(\/web\/[0-9]+([imjscd_\/]+)?(http[s]?:\/\/[0-9a-zA-Z-_\.]*{domain})?)/gim, '');
    link = link.replace(/(\/web\/[0-9]+([imjscd_\/]+)?)/gim, '');

    link = link.replace(/^[\s]+/i, ''); // remove leading spaces
    link = link.replace(/^href/i, ''); // remove href
    link = link.replace(/^[\s='"]+/i, ''); // remove =, space, quotes
    link = link.replace(/[\s='"]+$/i, ''); // remove =, space, quotes from end
    link = link.replace(/^[\s]+/i, ''); // remove leading spaces
    link = link.replace(/[\s]+$/i, ''); // remove trailing spaces

    /*
    var re = new RegExp("^(http[s:])?[//w.]*" + domain, "i");

    if (re.test(link)) {
        link = Url.makeRelative(link);
    }*/
/*
return link;
}
*/

module.exports = Project;