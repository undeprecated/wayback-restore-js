/* jshint node: true */
/*global define, require, describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, spyOn*/

"use string";

var debug = require("debug")("wayback:main");
//var Wayback = require( "../dist/wayback-restore" );
var Wayback = require("./wayback-restore");

/*
var restore = Wayback.restore({
    url:
        "http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk"
});

var restore = Wayback.restore({
    domain: 'cashpropertysolutions.co.uk',
    timestamp: "20150531"
});

var restore = Wayback.restore('http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk');
*/

var restore = Wayback.restore({
  directory: "~/testrestore/restores/",
  //url:"https://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk",
  //url: 'https://web.archive.org/web/20170204050649/http://www.androidfantasy.com/',
  //url: "https://web.archive.org/web/20150801040409/http://acbaw.com/",
  //url: "http://web.archive.org/web/20091125054126/http://www.ulcinjtoday.com/",
  //url: "https://web.archive.org/web/20190114224925/http://www.tennisballmachinereviews.org/",
  //url: "https://web.archive.org/web/20200602050304/https://www.fancytextguru.com/",
  //url: "https://web.archive.org/web/20190424225217/http://remont-k.com/",
  url: "https://web.archive.org/web/20181029143918/https://trufish.org/",
  //url: "https://web.archive.org/web/20150424013550/http://www.kbect.com/",
  //url: "https://web.archive.org/web/20170923120200/http://careersters.net/",
  //url:"https://web.archive.org/web/20160404213504/http://claridadesdemichoacan.com",
  // @TODO: this doesn't not work because it's an IP
  //url: "https://web.archive.org/web/20200612100421/http://198.96.92.14/",

  /**
     * This is not a valid URL and does not restore
     * @type {String}
     *
    url: "https://web.archive.org/web/20181029143918/trufish.org",
    */
  //domain: "acbaw.com",
  //timestamp: "20150801040409",

  //domain: "trufish.org",
  //from: "20150801040409",
  //to: "20150801040409",

  concurrency: 1,
  max_pages: 50,
  links: true
});
restore
  .on("completed", function(results) {
    console.log("restoration has completed");
    console.log("url: ", results.url);
    console.log("domain: ", results.domain);
    console.log("timestamp: ", results.timestamp);
    console.log("directory: ", results.directory);
    //console.log("first file: ", results.first_file);
    //console.log("started: ", results.started);
    //console.log("ended: ", results.ended);
    console.log("restored: ", results.restored_count);
    console.log("failed: ", results.failed_count);
    console.log("Runtime:", results.runtime_hms);
  })
  .on("restoring", function(asset) {
    console.log("[RESTORING]", asset.original_url);
  })
  .on("restored", function(asset) {
    console.log("[RESTORED]", asset.original_url);
  })
  .on("start", function() {
    console.log("[STARTED USING]:", this.settings);
  })
  .on("cdxquery", function(cdx) {
    console.log("Snapshots Found: ", cdx.size);
  })
  .start();
/*


    .on('restoring', function(Asset) {
        console.log('[RESTORING]', Asset);
    })
    .on('restored', function(Asset) {
        console.log('[RESTORED]', Asset.original_url);
    })
    .on('failed', function(Asset) {
        console.log('[NOT RESTORED]', Asset.original_url);
    })
    .on('completed', function() {
        console.log('[COMPLETED]');
    })*/
