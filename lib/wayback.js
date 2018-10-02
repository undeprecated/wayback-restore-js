// ===============================================================================
//
// References:
//
// https://github.com/heroku-examples/node-articles-nlp/tree/master/lib
//
// ===============================================================================

/*
@TODO Implement a throttle system so we don't hammer the request server
    - https://github.com/alltherooms/throttled-request

@TODO Create a UI
    - http://startbootstrap.com/template-overviews/sb-admin-2/
    - https://almsaeedstudio.com/themes/AdminLTE/documentation/index.html
    - http://www.cssauthor.com/bootstrap-admin-templates/

@TODO pageNotRestored handle unrestored pages. write redirect?

@TODO implement pausing a restore
@TODO implement resuming a restore
@TODO implement stopping a restore

@TODO create report
*/

var restore = require('./restore');
var cdx = require('./cdx');
var core = require('./core');

module.exports = {
    VERSION: core.VERSION,
    restore: restore,
    cdx: cdx
};