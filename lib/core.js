module.exports = {
    VERSION: '1.0.0',
    ARCHIVE_SOURCE: 'http://web.archive.org',
    ARCHIVE_TEMPLATE: 'https://web.archive.org/web/',
    RESTORE_STATUS: {
        RESTORED: 'restored',
        FAILED: 'failed',
        UNARCHIVED: 'unarchived',
        RESTORING: 'restoring',
        EMPTY: 'notrestored'
    },
    EVENTS: {
        STARTED: 'start',
        RESTORING: 'restoring',
        RESTORED: 'restored',
        COMPLETED: 'completed',
        FAILED: 'failed'
    }
};