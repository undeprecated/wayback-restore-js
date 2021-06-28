var setup = require('../setup');

var Wayback = require('../../wayback-restore');

var expect = setup.expect;

describe('downloader.js', function () {
  describe('available methods', function () {
    it('should have on method', function () {
      const download = Wayback.downloader('http://example.com');
      expect(typeof download.on).to.be.equals('function');
    });
    it('should list', function () {
      const download = Wayback.downloader('http://example.com');
      expect(typeof download.list).to.be.equals('function');
    });
    it('should start', function () {
      const download = Wayback.downloader('http://example.com');
      expect(typeof download.start).to.be.equals('function');
    });
    it('should stop', function () {
      const download = Wayback.downloader('http://example.com');
      expect(typeof download.stop).to.be.equals('function');
    });
    it('should pause', function () {
      const download = Wayback.downloader('http://example.com');
      expect(typeof download.pause).to.be.equals('function');
    });
    it('should resume', function () {
      const download = Wayback.downloader('http://example.com');
      expect(typeof download.resume).to.be.equals('function');
    });
  });

  describe('download options', function () {
    it('should output to a restore directory', function () {
      const download = Wayback.downloader('http://example.com');
      expect(download.restore_directory).to.equal('example.com');
    });

    it('should output to a restore directory', function () {
      const download = Wayback.downloader({
        url: 'https://web.archive.org/web/20181029143918/https://example.com/',
        from: '20080701',
        to: '20080731',
        list: true
      });
      expect(download.restore_directory).to.equal('example.com');
    });

    it('should accept a wayback url string', function () {
      const download = Wayback.downloader(
        'http://web.archive.org/web/20150531/http://www.example.com'
      );

      expect(download.options).to.be.an('object');
      expect(download.options.domain).to.equal('example.com');
      expect(download.options.exact_url).to.equal(true);
      expect(download.options.url).to.equal(
        'http://web.archive.org/web/20150531/http://www.example.com'
      );
    });

    it('should accept an object with a url', function () {
      const download = Wayback.downloader({
        url: 'http://www.example.com'
      });

      expect(download.options).to.be.an('object');
      expect(download.options.domain).to.equal('example.com');
      expect(download.options.exact_url).to.equal(false);
    });

    it('should accept an object with domain', function () {
      const download = Wayback.downloader({
        domain: 'example.com'
      });

      expect(download.options).to.be.an('object');
      expect(download.options.domain).to.equal('example.com');
      expect(download.options.exact_url).to.equal(false);
    });

    it('should accept an object domain and timestamps', function () {
      const download = Wayback.downloader({
        domain: 'example.com',
        from: '20150531',
        to: '20160531'
      });

      expect(download.options).to.be.an('object');
      expect(download.options.domain).to.equal('example.com');
      expect(download.options.from).to.equal('20150531');
      expect(download.options.to).to.equal('20160531');
    });
  });
  describe('cdx query', function () {
    it('should create a CdxQuery object', function () {
      const download = Wayback.downloader(
        'http://web.archive.org/web/20150531/http://www.example.com'
      );
      expect(download.cdxQuery).to.be.an('object');
    });

    it('should generate a CDX Url', function () {
      const download = Wayback.downloader({
        url: 'https://web.archive.org/web/20181029143918/https://example.com/',
        from: '20181001143918',
        to: '20181029143918'
      });

      expect(download.cdxQuery.url).to.equal(
        'https://web.archive.org/cdx/search/cdx?url=example.com*&fl=urlkey,timestamp,original,mimetype,statuscode,digest,length&filter=statuscode:200&from=20181001143918&to=20181029143918&collapse=digest'
      );
    });

    it('should have proper filters', function () {
      const download = Wayback.downloader({
        url: 'http://www.example.com',
        from: '20080701',
        to: '20080731'
      });

      expect(download.cdxQuery).to.be.an('object');
      expect(download.cdxQuery.options.from).to.equal('20080701');
      expect(download.cdxQuery.options.to).to.equal('20080731');
    });
  });

  describe('match_only_filter', function () {
    it('regex should match', function () {
      const download = Wayback.downloader({
        url: 'http://www.example.com',
        only: /\.(gif|jpg|jpeg)$/i
      });

      const file_urls = [
        'http://www.example.com/logo.gif',
        'http://www.example.com/logo.jpg',
        'http://www.example.com/logo.jpeg',
        'http://www.example.com/path/toimages/logo.jpg'
      ];
      file_urls.forEach((str) => {
        let match = download.match_only_filter(str);
        expect(match).to.be.true;
      });
    });

    it('regex should NOT match', function () {
      const download = Wayback.downloader({
        url: 'http://www.example.com',
        only: /\.(gif|jpg|jpeg)$/i
      });

      const file_urls = [
        'http://www.example.com/logo.png',
        'http://www.example.com/logo.jpg.png',
        'http://www.example.com/path/to/jpg/images/logo.txt'
      ];
      file_urls.forEach((str) => {
        let match = download.match_only_filter(str);
        expect(match).to.be.false;
      });
    });

    it('should allow all when not used', function () {
      const download = Wayback.downloader({
        url: 'http://www.example.com'
      });

      const file_urls = [
        'http://www.example.com/logo.gif',
        'http://www.example.com/logo.jpg',
        'http://www.example.com/logo.jpeg',
        'http://www.example.com/path/toimages/logo.jpg',
        'http://www.example.com/logo.png',
        'http://www.example.com/logo.jpg.png',
        'http://www.example.com/path/to/jpg/images/logo.txt'
      ];
      file_urls.forEach((str) => {
        let match = download.match_only_filter(str);
        expect(match).to.be.true;
      });
    });

    it('should match on a string', function () {
      const download = Wayback.downloader({
        url: 'http://www.example.com',
        only: '.(gif|jpg|jpeg)$'
      });

      const file_urls = [
        'http://www.example.com/logo.gif',
        'http://www.example.com/logo.jpg',
        'http://www.example.com/logo.jpeg',
        'http://www.example.com/path/toimages/logo.jpg'
      ];
      file_urls.forEach((str) => {
        let match = download.match_only_filter(str);
        expect(match).to.be.true;
      });
    });
  });

  describe('match_exclude_filter', function () {
    it('regex should match', function () {
      const download = Wayback.downloader({
        url: 'http://www.example.com',
        exclude: /\.(gif|jpg|jpeg)$/i
      });

      const file_urls = [
        'http://www.example.com/logo.gif',
        'http://www.example.com/logo.jpg',
        'http://www.example.com/logo.jpeg',
        'http://www.example.com/path/toimages/logo.jpg'
      ];
      file_urls.forEach((str) => {
        let match = download.match_exclude_filter(str);
        expect(match).to.be.true;
      });
    });
    it('regex should NOT match', function () {
      const download = Wayback.downloader({
        url: 'http://www.example.com',
        exclude: /\.(gif|jpg|jpeg)$/i
      });

      const file_urls = [
        'http://www.example.com/logo.png',
        'http://www.example.com/logo.jpg.png',
        'http://www.example.com/path/to/jpg/images/logo.txt'
      ];
      file_urls.forEach((str) => {
        let match = download.match_exclude_filter(str);
        expect(match).to.be.false;
      });
    });

    it('should allow all when not used', function () {
      const download = Wayback.downloader({
        url: 'http://www.example.com'
      });

      const file_urls = [
        'http://www.example.com/logo.gif',
        'http://www.example.com/logo.jpg',
        'http://www.example.com/logo.jpeg',
        'http://www.example.com/path/toimages/logo.jpg',
        'http://www.example.com/logo.png',
        'http://www.example.com/logo.jpg.png',
        'http://www.example.com/path/to/jpg/images/logo.txt'
      ];
      file_urls.forEach((str) => {
        let match = download.match_exclude_filter(str);
        expect(match).to.be.false;
      });
    });

    it('should match on a string', function () {
      const download = Wayback.downloader({
        url: 'http://www.example.com',
        exclude: '.(gif|jpg|jpeg)$'
      });

      const file_urls = [
        'http://www.example.com/logo.gif',
        'http://www.example.com/logo.jpg',
        'http://www.example.com/logo.jpeg',
        'http://www.example.com/path/toimages/logo.jpg'
      ];
      file_urls.forEach((str) => {
        let match = download.match_exclude_filter(str);
        expect(match).to.be.true;
      });
    });
  });
});
