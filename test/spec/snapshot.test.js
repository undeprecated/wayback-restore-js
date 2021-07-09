var setup = require('../setup');

var snapshot = require('../../wayback-restore/snapshot');

var expect = setup.expect;

describe('snapshot.js', function () {
  describe('filter', function () {
    it('regex should match', function () {
      const file_urls = [
        'http://www.example.com/logo.gif',
        'http://www.example.com/logo.jpg',
        'http://www.example.com/logo.jpeg',
        'http://www.example.com/path/toimages/logo.jpg'
      ];
      file_urls.forEach((str) => {
        let match = snapshot.filter(/\.(gif|jpg|jpeg)$/i, str);
        expect(match).to.be.true;
      });
    });

    it('regex should NOT match', function () {
      const file_urls = [
        'http://www.example.com/logo.png',
        'http://www.example.com/logo.jpg.png',
        'http://www.example.com/path/to/jpg/images/logo.txt'
      ];
      file_urls.forEach((str) => {
        let match = snapshot.filter(/\.(gif|jpg|jpeg)$/i, str);
        expect(match).to.be.false;
      });
    });

    it('should match on a string', function () {
      const file_urls = [
        'http://www.example.com/logo.gif',
        'http://www.example.com/logo.jpg',
        'http://www.example.com/logo.jpeg',
        'http://www.example.com/path/toimages/logo.jpg'
      ];
      file_urls.forEach((str) => {
        let match = snapshot.filter('.(gif|jpg|jpeg)$', str);
        expect(match).to.be.true;
      });
    });
  });
});
