/*jshint node: true*/
/*global define, require, module*/

'use strict';

/**
 * List of different page types to restore.
 */

var html    = 'html',
    css     = 'css',
    text    = 'text',
    image   = 'image',
    video   = 'video',
    audio   = 'audio',
    script  = 'script',
    other   = 'other';

/**
 * Convert a CDX mimetype to a Page type
 *
 * @private
 * @param {string} type A mimetype
 * @return {string} PageType
 */
function convertMimeType (type) {
    if (type.match(/^text\/css/i)) {
        return css;
    } else if (type.match(/^text\//i)) {
        return text;
    } else if (type.match(/^image\//i)) {
        return image;
    } else if (type.match(/^video\//i)) {
        return video;
    } else if (type.match(/^audio\//i)) {
        return audio;
    } else if (type.match(/javascript/i)) {
        return script;
    } else {
        return other;
    }
}

module.exports.convertMimeType = convertMimeType;

module.exports.IMAGE  = image;
module.exports.TEXT   = text;
module.exports.HTML   = html;
module.exports.CSS    = css;
module.exports.SCRIPT = script;
module.exports.AUDIO  = audio;
module.exports.VIDEO  = video;
module.exports.OTHER  = other;
