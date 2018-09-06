var WaybackCdx = require('../cdx/WaybackCdx');

function query(options, callback) {
    var records = [];

    return WaybackCdx.stream(options)
        .on('end', function() {
            if (callback) {
                return callback(records);
            }
        })
        .pipe( es.map(function (record, next) {
            record = JSON.parse(record);

            var cdxRecord = {
                key: record.urlkey,

                original: record.original,

                timestamp: record.timestamp,

                // mime type
                type: record.mimetype
            };

            records.push(cdxRecord);

            //db.insertCdxRecord(cdxRecord, next);
        }));
};
