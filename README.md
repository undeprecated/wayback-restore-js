# Wayback Restore JS

A website restoration tool written for Node Js.

## About

This package allows you to restore a website from web.archive.org. It was developed for Node JS

## Usage

```JavaScript
var Wayback = require("wayback-restore");

Wayback.restore(options);
```

### Options

#### url

URL to restore. Ex. https://web.archive.org/web/20150801040409/http://example.com/

If you use `url` then you do not need to use `timestamp` and `domain`.

#### timestamp

Timestamp to restore.

Ex. 20150801040409

#### domain

Domain to restore

#### directory

(Default: restore) Directory to output into.

#### max_pages:

(default: no limit), Maximum number of pages to download. Leave empty for no limit.

#### links

(default: true) Set to true to download links found on the page.

#### assets

(default: true) Set to true to download CSS, JS, images.

#### concurrency

(default: 1): Number of downloads to process at once.

**_Warning: Setting this value too high might get you blocked from web.archive.org._**

#### log

(default: false) Set to true to enable logging to a log file.

#### logFile

(default: restore.log) Name of the log file to write. It will be written to `options.directory`.

### Methods

#### start

#### stop

#### pause

#### resume

### Events

The following events are emitted.

#### start

Fired when restoring starts.

```
.on("start", function() {
    console.log("[STARTED USING]:", this.settings);
})
```

#### restoring - (asset)

When a file begins restoring.

```
.on("restoring", function(asset) {
   console.log("[RESTORING]", asset.original_url);
})
```

#### restored - (asset)

Fired when a file has been downloaded.

```
.on("restored", function(asset) {
   console.log("[RESTORED]", asset.original_url);
})
```

#### cdxquery

```
.on("cdxquery", function(cdx) {
  console.log("Snapshots Found: ", cdx.size);
})
```

#### completed - (results)

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
