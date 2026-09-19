'use strict';

const os = require('os');

/**
 * Clean equivalent of the recovered get-device-info value construction.
 * Device ID calculation is injected until recovered hp() is fully decoded.
 */
function createDeviceInfo(getDeviceId) {
  if (typeof getDeviceId !== 'function') {
    throw new TypeError('getDeviceId must be a function');
  }

  const resolved = Intl.DateTimeFormat().resolvedOptions();

  return {
    timeZone: resolved.timeZone,
    language: resolved.locale,
    name: os.hostname(),
    id: getDeviceId(),
  };
}

module.exports = { createDeviceInfo };
