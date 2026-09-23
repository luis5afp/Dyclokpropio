/**
 * Editable renderer-side IPC adapter.
 *
 * This replaces scattered direct window.ipcRenderer access as Vue screens are
 * reconstructed. It intentionally performs no business-logic transformation:
 * channel names and arguments remain observable-compatible with the recovered
 * renderer.
 */
import channels from '../../shared/renderer-ipc-channels.json';

const allowedChannels = new Set(Object.values(channels));

function getRenderer() {
  const renderer = globalThis?.ipcRenderer ?? globalThis?.window?.ipcRenderer;
  if (!renderer) {
    throw new Error('Electron ipcRenderer is not available in this context');
  }
  return renderer;
}

function assertChannel(channel) {
  if (!allowedChannels.has(channel)) {
    throw new Error(`Unknown reconstructed IPC channel: ${channel}`);
  }
}

export function invoke(channel, ...args) {
  assertChannel(channel);
  return getRenderer().invoke(channel, ...args);
}

export function send(channel, ...args) {
  assertChannel(channel);
  return getRenderer().send(channel, ...args);
}

export function sendSync(channel, ...args) {
  assertChannel(channel);
  return getRenderer().sendSync(channel, ...args);
}

export function on(channel, listener) {
  assertChannel(channel);
  const renderer = getRenderer();
  renderer.on(channel, listener);
  return () => renderer.removeListener(channel, listener);
}

export { channels };
