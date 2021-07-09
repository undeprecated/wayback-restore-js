var setup = require('../setup');

var Wayback = require('../../wayback-restore');

var expect = setup.expect;

describe('downloader.js', function () {
  describe('available methods', function () {
    it('should have on method', function () {
      const download = Wayback.downloader({
        url: 'https://example.com/',
        from: '20080701',
        to: '20080731'
      });
      expect(typeof download.on).to.be.equals('function');
    });
    it('should start', function () {
      const download = Wayback.downloader({
        url: 'https://example.com/',
        from: '20080701',
        to: '20080731'
      });
      expect(typeof download.start).to.be.equals('function');
    });
    it('should stop', function () {
      const download = Wayback.downloader({
        url: 'https://example.com/',
        from: '20080701',
        to: '20080731'
      });
      expect(typeof download.stop).to.be.equals('function');
    });
    it('should pause', function () {
      const download = Wayback.downloader({
        url: 'https://example.com/',
        from: '20080701',
        to: '20080731'
      });
      expect(typeof download.pause).to.be.equals('function');
    });
    it('should resume', function () {
      const download = Wayback.downloader({
        url: 'https://example.com/',
        from: '20080701',
        to: '20080731'
      });
      expect(typeof download.resume).to.be.equals('function');
    });
  });

  describe('download options', function () {
    it('should output to a restore directory', function () {
      const download = Wayback.downloader({
        url: 'https://example.com/',
        from: '20080701',
        to: '20080731'
      });
      expect(download.restore_directory).to.equal('example.com');
    });

    it('should output to a restore directory', function () {
      const download = Wayback.downloader({
        url: 'https://example.com/',
        from: '20080701',
        to: '20080731'
      });
      expect(download.restore_directory).to.equal('example.com');
    });

    it('should accept an object with a url', function () {
      const download = Wayback.downloader({
        url: 'http://www.example.com'
      });

      expect(download.options).to.be.an('object');
      expect(download.domain).to.equal('example.com');
    });

    it('should accept an object domain and timestamps', function () {
      const download = Wayback.downloader({
        url: 'https://example.com/',
        from: '20150531',
        to: '20160531'
      });

      expect(download.options).to.be.an('object');
      expect(download.domain).to.equal('example.com');
      expect(download.options.from).to.equal('20150531');
      expect(download.options.to).to.equal('20160531');
    });
  });
  describe('snapshot', function () {
    it('should create a snapshot object', function () {
      const download = Wayback.downloader({
        url: 'https://example.com/',
        from: '20150531',
        to: '20160531'
      });

      expect(download.snapshot).to.be.an('object');
    });
  });
});
