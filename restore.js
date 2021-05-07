/**
 * This file only exists for testing restore/downloader processes by executing
 * `npm run restore`.
 *
 * @TODO: replace this with a CLI utility.
 */

var Wayback = require('./wayback-restore');

/**
 * Test URLS
 */
//const url = "https://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk",
//const url = 'https://web.archive.org/web/20170204050649/http://www.androidfantasy.com/',
//const url = "https://web.archive.org/web/20150801040409/http://acbaw.com/",
//const url = "http://web.archive.org/web/20091125054126/http://www.ulcinjtoday.com/",
//const url = "https://web.archive.org/web/20190114224925/http://www.tennisballmachinereviews.org/",
//const url = "https://web.archive.org/web/20200602050304/https://www.fancytextguru.com/",
//const url = "https://web.archive.org/web/20190424225217/http://remont-k.com/",
//const url = "https://web.archive.org/web/20181029143918/https://trufish.org/";
//const url = "https://web.archive.org/web/20150424013550/http://www.kbect.com/",
//const url = "https://web.archive.org/web/20170923120200/http://careersters.net/",
//const url ="https://web.archive.org/web/20160404213504/http://claridadesdemichoacan.com",

// @TODO: this doesn't not work because it's an IP
//const url = "https://web.archive.org/web/20200612100421/http://198.96.92.14/",
// @NOTE: This is not a valid URL and does not restore
//const url = "https://web.archive.org/web/20181029143918/trufish.org",

/*
Wayback.restore({
  url: 'http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk'
});

Wayback.restore({
  domain: 'cashpropertysolutions.co.uk',
  timestamp: '20150531'
});

Wayback.restore('http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk');
*/
/*
Wayback.restore({
  directory: '~/testrestore/restores/',
  url: 'https://web.archive.org/web/20150202214825/http://dollarseoclub.com/#!#',
  concurrency: 1,
  max_pages: 50,
  links: true
})
  .on('completed', function (results) {
    console.log('restoration has completed');
    console.log('url: ', results.url);
    console.log('domain: ', results.domain);
    console.log('timestamp: ', results.timestamp);
    console.log('directory: ', results.directory);
    console.log('started: ', results.started);
    console.log('ended: ', results.ended);
    console.log('restored: ', results.restored_count);
    console.log('failed: ', results.failed_count);
    console.log('Runtime:', results.runtime_hms);
  })
  .on('restoring', function (asset) {
    console.log('[RESTORING]', asset.original_url);
  })
  .on('restored', function (asset) {
    console.log('[RESTORED]', asset.original_url);
  })
  .on('start', function () {
    console.log('[STARTED USING]:', this.settings);
  })
  .on('cdxquery', function (cdx) {
    console.log('Snapshots Found: ', cdx.size);
  })
  .start();
*/

/**
 * Downloader Examples.
 */

Wayback.downloader({
  concurrency: 5,
  directory: '/home/nick/testrestore',
  domain: 'trufish.org',
  exclude: '',
  from: '2017',
  limit: 20,
  notify_on_finish: true,
  //only: '/.(gif|jpg|jpeg|png)$/i',
  only: '.(gif|jpg|jpeg|png)$',
  to: '2018',
  list: true

  //url: 'https://trufish.org/',
  //from: '20181001',
  //to: '20201031',
  //list: false,
  //limit: 8,
  //concurrency: 10,
  //exact_url: false,
  //only: 'https://trufish.org/wp-content/themes/aspire-pro/images/bg-1.jpg',
  //exclude: /.(gif|jpg|jpeg|png|svg)$/i
})
  .on('completed', function (results) {
    console.log('completed');
    console.log(results);
  })
  .start((record) => {
    console.log('Asset', record.getSnapshotUrl());
  });
