'use string';

const asset = require('../../wayback-restore/asset');
var utils = require('../../wayback-restore/utils');
var setup = require('../setup');

var assert = setup.assert;

describe('utils.js', function () {
  describe('convertLinkToKey', function () {
    it('from url with trailing slash', function (done) {
      var link = 'http://www.cashpropertysolutions.co.uk//need-a-quick-sale/';
      var key = 'uk,co,cashpropertysolutions)/need-a-quick-sale';
      var domain = 'cashpropertysolutions.co.uk';

      assert.equal(utils.convertLinkToKey(domain, link), key);

      done();
    });

    it('from /', function (done) {
      var link = 'http://www.cashpropertysolutions.co.uk/';
      var key = 'uk,co,cashpropertysolutions)/';
      var domain = 'cashpropertysolutions.co.uk';

      assert.equal(utils.convertLinkToKey(domain, link), key);

      done();
    });
  });

  describe('timestampToDay', function () {
    it('converts 20181225112233', function (done) {
      assert.equal(utils.timestampToDay(20181225112233), 20181225);
      done();
    });
    it('converts 20181225', function (done) {
      assert.equal(utils.timestampToDay(20181225), 20181225);
      done();
    });
    it('accepts a number or string', function (done) {
      assert.equal(utils.timestampToDay('20181225112233'), 20181225);
      assert.equal(utils.timestampToDay(20181225112233), 20181225);
      done();
    });
  });

  describe('getDomain', function () {
    it('example.com', function (done) {
      assert.equal(utils.getDomain('example.com'), 'example.com');
      done();
    });
    it('example.co.uk', function (done) {
      assert.equal(utils.getDomain('example.co.uk'), 'example.co.uk');
      done();
    });
  });
});
