'use strict';

const crypto = require('crypto');
const os = require('os');

/**
 * Exact clean equivalent of recovered hp().
 */
function getDeviceId() {
  const fingerprint = os.hostname() + os.arch() + os.userInfo().username;

  return crypto
    .createHash('sha256')
    .update(fingerprint)
    .digest('hex')
    .substring(0, 32);
}

module.exports = { getDeviceId };
