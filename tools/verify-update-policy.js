'use strict';

const fs = require('fs');
const path = require('path');
const {
  UPDATE_CHANNELS,
  registerDisabledUpdateHandlers,
} = require('../src/main/ipc/handlers/update-policy');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const eventHandlers = new Map();
const invokeHandlers = new Map();
const ipcMain = {
  on(channel, handler) {
    eventHandlers.set(channel, handler);
    return this;
  },
  handle(channel, handler) {
    invokeHandlers.set(channel, handler);
  },
};

registerDisabledUpdateHandlers(ipcMain);

for (const channel of UPDATE_CHANNELS) {
  assert(eventHandlers.has(channel), 'Missing disabled event handler: ' + channel);
  assert(invokeHandlers.has(channel), 'Missing disabled invoke handler: ' + channel);
}

(async () => {
  for (const channel of UPDATE_CHANNELS) {
    const result = await invokeHandlers.get(channel)();
    assert(result === false, 'Disabled invoke must return false: ' + channel);
  }

  const root = path.resolve(__dirname, '..');
  const rendererFiles = [
    path.join(root, 'dist', 'assets', 'index-D2T4aaQJ.js'),
    path.join(root, 'src', 'runtime', 'dist', 'assets', 'index-D2T4aaQJ.js'),
  ];

  for (const file of rendererFiles) {
    const source = fs.readFileSync(file, 'utf8');
    assert(
      !source.includes('/v1/app/notice'),
      'Remote program update check is still present in ' + file,
    );
    assert(
      !source.includes('setInterval(()=>De().then(()=>{ht()}),6e5)'),
      'Recurring minified update check is still present in ' + file,
    );
    assert(
      !source.includes('De().then(() => {\n            ht();'),
      'Recurring formatted update check is still present in ' + file,
    );
  }

  console.log(
    JSON.stringify(
      {
        programUpdateCheckDisabled: true,
        blockedUpdateChannels: UPDATE_CHANNELS,
        remoteVersionEndpointPresent: false,
        recurringVersionTimerPresent: false,
      },
      null,
      2,
    ),
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
