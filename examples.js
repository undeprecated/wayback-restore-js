var Wayback = require('./wayback-restore');

/**
 * Restore Examples.
 *
 * Wayback.restore will restore a website as it appears on web.archive.org and will only include
 * files that are used on the page ie. JS, CSS, images, and links to other pages that have
 * been archived.
 **/
Wayback.restore({
  url: 'http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk'
});

Wayback.restore({
  domain: 'cashpropertysolutions.co.uk',
  timestamp: '20150531'
});

Wayback.restore('http://web.archive.org/web/20150531/http://www.cashpropertysolutions.co.uk');

Wayback.restore({
  directory: '~/testrestore/restores/',
  url: url,
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

/**
 * Downloader Examples.
 *
 * Wayback.downloader downloads snapshots of files based on the options you set to download.
 */
Wayback.downloader({
  url: 'https://trufish.org/',
  from: '20181001',
  to: '20201031',
  list: true,
  concurrency: 10,
  exact_url: false,
  exclude: /.(gif|jpg|jpeg|png|svg)$/i
})
  .on('completed', function (results) {
    console.log('completed');
    console.log(results);
  })
  .start((record) => {
    console.log('Asset', record.getSnapshotUrl());
  });

/**
 * Snapshot Explorer Examples.
 *
 * Wayback.snapshot allows you to find web assets that have been archived.
 */

// Find snapshots and execute a callback each time a snapshot is returned.
Wayback.snapshot(
  {
    url: 'example.com',
    filter: 'statuscode:200',
    collapse: 'digest',
    matchType: 'exact',
    limit: 10,
    from: '20210623',
    to: '20210624'
  },
  (asset) => {
    console.log('Snapshot', asset);
  }
);

// Use a promise to receive all snapshots results
Wayback.snapshot({
  url: 'example.com',
  filter: 'statuscode:200',
  collapse: 'digest',
  matchType: 'exact',
  limit: 10,
  from: '20210623',
  to: '20210624'
})
  .then((snapshots) => {
    console.log('snapshots', snapshots);
    console.log('# snapshots found: ', snapshots.length);
  })
  .catch((error) => {
    console.log('error', error);
  });
