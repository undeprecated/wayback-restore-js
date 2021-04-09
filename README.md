# Wayback Restore JS

> A website restoration tool written for Node Js.

This package allows you to restore a website from web.archive.org. It was developed for Node JS and can be used in any Electron application.

## Install

```
npm install wayback-restore
```

## Usage

```JavaScript
var Wayback = require("wayback-restore");

Wayback.restore(options);
```

## API

### restore(options)

#### options

##### url - string

URL to restore. Ex. https://web.archive.org/web/20150801040409/http://example.com/

If you use `url` then you do not need to use `timestamp` and `domain`.

##### timestamp - string

Timestamp to restore.

Ex. 20150801040409

##### domain - string

Domain to restore

##### directory - string

(Default: restore) Directory to output into.

##### max_pages - integer

(default: no limit), Maximum number of pages to download. Leave empty for no limit.

##### links - boolean

(default: true) Set to true to download links found on the page.

##### assets - boolean

(default: true) Set to true to download CSS, JS, images.

##### concurrency - integer

(default: 1): Number of downloads to process at once.

**_Warning: Setting this value too high might get you blocked from web.archive.org._**

##### log - boolean

(default: false) Set to true to enable logging to a log file.

##### logFile - string

(default: restore.log) Name of the log file to write. It will be written to `options.directory`.

#### Methods

##### start

##### stop

##### pause

##### resume

#### Events

The following events are emitted.

##### start(callback)

Fired when restoring starts.

```
.on("start", function() {
    console.log("[STARTED USING]:", this.settings);
})
```

##### restoring - (asset)

When a file begins restoring.

```
.on("restoring", function(asset) {
   console.log("[RESTORING]", asset.original_url);
})
```

##### restored - (asset)

Fired when a file has been downloaded.

```
.on("restored", function(asset) {
   console.log("[RESTORED]", asset.original_url);
})
```

##### cdxquery

```
.on("cdxquery", function(cdx) {
  console.log("Snapshots Found: ", cdx.size);
})
```

##### completed - (results)

When the restore process has completed.

```
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
```

### downloader(options)

#### options

##### url - string

A snapshot URL to download.

```JavaScript
Wayback.download({
    url: 'http://web.archive.org/web/20150531/http://www.example.com'
});
```

##### domain - string

A domain to download from.

##### from - string

Only files on or after timestamp supplied (ie. 20150801231334).

Can also be 20150801

##### to - string

Only files on or before timestamp supplied (ie. 20150801231334).

Can also be 20150801

##### limit - integer (default: 0)

limit number of files to download.

0 = no limit.

##### exact_url - boolean (default: false)

Downloads only the url provided not full site.

##### list - boolean (default: false)

Doesn't download any files.

##### concurrency - integer (default: 1)

Number of files to download at the same time.

##### only - string|RegEx (defalt: '')
    
Only include files matching this filter.

##### exclude - string|RegEx (defalt: '')
    
Excludes files matching this filter.

##### directory - string (defalt: '.')

Directory to output into.

#### Methods

See Wayback.restore methods.


## Examples

```JavaScript
var restore = Wayback.restore({
    url:
        "http://web.archive.org/web/20150531/http://example.com"
});
```

```JavaScript
var restore = Wayback.restore({
    domain: 'example.com',
    timestamp: "20150531"
});
```

```JavaScript
var restore = Wayback.restore('http://web.archive.org/web/20150531/http://example.com');
```


```JavaScript
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
```

## TODO

- Improve documentation
- Improve this modules API
- Create a CLI. Maybe as a separate module?

## Need a GUI Application?

Checkout [Restorizor](https://www.restorizor.com) a Wayback Machine download application built using Electron and powered by this very same wayback-restore.js module.
