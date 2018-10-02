var WaybackCdx = require('../cdx');
var Asset = require('./asset');

module.exports = {
    query: function query(options, callback) {
        var records = [];

        return WaybackCdx.stream(options)
            .on('end', function() {
                if (callback) {
                    return callback(records);
                }
            })
            .pipe(es.map(function(record, next) {
                record = JSON.parse(record);

                var asset = new Asset();
                asset.key = record.urlkey;
                asset.original_url = record.original;
                asset.timestamp = records.timestamp;
                asset.type = record.mimetype;

                records.push(asset);
            }));
    }
};