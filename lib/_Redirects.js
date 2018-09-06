/**
 * File containing different methods for creating redirect links.
 */

"use strict";

function htaccess($from, $to) {
    return "Redirect 301 $to $from";
}

function php($to) {
    return "<?php header(\"Location: $to \", true, 301); exit(); ?>";
}

module.exports.htaccess = htaccess;
module.exports.php      = php;
