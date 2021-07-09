module.exports = {
  VERSION: '0.0.14',
  ARCHIVE_SOURCE: 'http://web.archive.org',
  ARCHIVE_TEMPLATE: 'https://web.archive.org/web/',
  ARCHIVE_SOURCE_RE: new RegExp('http://web.archive.org', 'i'),
  ARCHIVE_TEMPLATE_RE: new RegExp('https://web.archive.org/web/', 'i'),
  RESTORE_STATUS: {
    RESTORED: 'restored',
    FAILED: 'failed',
    UNARCHIVED: 'unarchived',
    RESTORING: 'restoring',
    EMPTY: ''
  },
  EVENTS: {
    PAUSED: 'paused',
    RESUMED: 'resumed',
    STARTED: 'start',
    STOP: 'stop',
    RESTORING: 'restoring',
    RESTORED: 'restored',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CDXQUERY: 'cdxquery',
    ERROR: 'error'
  }
};
