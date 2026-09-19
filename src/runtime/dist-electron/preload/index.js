"use strict";

const { contextBridge, ipcRenderer } = require("electron");
const os = require("os");
const IPC = require("../shared/ipc-channels");

const cache = {
  localVersionInfo: undefined,
  deviceId: undefined,
  deviceName: undefined,
  deviceUserName: undefined,
};

function openUrl(payload) {
  ipcRenderer.send(IPC.OPEN_URL, payload);
}

const api = {
  getLocalServerStatus: (payload) =>
    ipcRenderer.invoke(IPC.GET_LOCAL_SERVER_STATUS, payload),

  getLocalVersionInfo: async () => {
    if (cache.localVersionInfo === undefined) {
      cache.localVersionInfo = await ipcRenderer.invoke(IPC.VERSION_LOCAL_INFO);
    }
    return cache.localVersionInfo;
  },

  getMainWindowLaunchPreference: () =>
    ipcRenderer.invoke(IPC.GET_MAIN_WINDOW_LAUNCH_PREFERENCE),

  setMainWindowLaunchPreference: (preference) =>
    ipcRenderer.invoke(IPC.SET_MAIN_WINDOW_LAUNCH_PREFERENCE, preference),

  getCurrentMainWindowSize: () =>
    ipcRenderer.invoke(IPC.GET_CURRENT_MAIN_WINDOW_SIZE),

  getDeviceId: async () => {
    if (cache.deviceId === undefined) {
      cache.deviceId = await ipcRenderer.invoke(IPC.GET_DEVICE_ID);
    }
    return cache.deviceId;
  },

  getNewDeviceId: async () => {
    if (cache.deviceId === undefined) {
      cache.deviceId = await ipcRenderer.invoke(IPC.GET_NEW_DEVICE_ID);
    }
    return cache.deviceId;
  },

  getDeviceName: async () => {
    if (cache.deviceName === undefined) {
      cache.deviceName = await ipcRenderer.invoke(IPC.GET_DEVICE_NAME);
    }
    return cache.deviceName;
  },

  getDeviceUserName: async () => {
    if (cache.deviceUserName === undefined) {
      cache.deviceUserName = await ipcRenderer.invoke(IPC.GET_DEVICE_USER_NAME);
    }
    return cache.deviceUserName;
  },

  activeWindow: (payload) => ipcRenderer.send(IPC.ACTIVE_WINDOW, payload),
  getAllDisplays: () => ipcRenderer.invoke(IPC.GET_ALL_DISPLAYS),
  trackEvent: (payload) => ipcRenderer.send(IPC.TRACK_EVENT, payload),
  setUserPlan: (payload) => ipcRenderer.send(IPC.SET_USER_PLAN, payload),
  clearElectronStore: () => ipcRenderer.send(IPC.CLEAR_ELECTRON_STORE),

  store: {
    get: (key) => ipcRenderer.sendSync(IPC.ELECTRON_STORE_GET, key),
    set: (key, value) =>
      ipcRenderer.sendSync(IPC.ELECTRON_STORE_SET, { key, value }),
    delete: (key) => ipcRenderer.sendSync(IPC.ELECTRON_STORE_DELETE, key),
  },

  envController: {
    stopEnv: (payload) => ipcRenderer.send(IPC.STOP_ENV, payload),
    runEnv: (environment, options) =>
      ipcRenderer.send(IPC.RUN_ENV, environment, options),
  },

  getCurrentPlatform: () => ipcRenderer.invoke(IPC.GET_CURRENT_PLATFORM),
  getDesktopSources: () => ipcRenderer.invoke(IPC.GET_DESKTOP_SOURCES),
  getWindowByPid: (pid) => ipcRenderer.invoke(IPC.GET_WINDOW_BY_PID, pid),
  windowTest: (payload) => ipcRenderer.invoke(IPC.WINDOW_TEST, payload),
  delRpaTaskLog: (payload) => ipcRenderer.invoke(IPC.DEL_RPA_TASK_LOG, payload),
  getRpaLogList: (payload) => ipcRenderer.invoke(IPC.GET_RPA_TASK_LOG, payload),
  setRpaTaskConfig: (payload) =>
    ipcRenderer.invoke(IPC.SET_RPA_TASK_CONFIG, payload),
  getRpaIndexPage: () => ipcRenderer.invoke(IPC.GET_RPA_INDEX_PAGE),

  createApplicationWindow: (payload) =>
    ipcRenderer.send(IPC.OPEN_APPLICATION_WINDOW, payload),

  closeAllExternalWindows: () => ipcRenderer.send(IPC.CLOSE_ALL_WIN),

  aes128Encrypt: (payload) => ipcRenderer.invoke(IPC.AES_128_ENCRYPT, payload),
  aes128Decrypt: (payload) => ipcRenderer.invoke(IPC.AES_128_DECRYPT, payload),
  aes128DecryptMany: (payload) =>
    ipcRenderer.invoke(IPC.AES_128_DECRYPT_MANY, payload),

  getPublicIP: () => ipcRenderer.invoke(IPC.GET_PUBLIC_IP),
  getAppTitle: () => ipcRenderer.invoke(IPC.GET_APP_TITLE),

  installRequestedKernel: (payload) =>
    ipcRenderer.invoke(IPC.KERNEL_INSTALL_REQUESTED, payload),
  listInstalledKernels: () => ipcRenderer.invoke(IPC.KERNEL_LIST_INSTALLED),
  getKernelProgress: () => ipcRenderer.invoke(IPC.KERNEL_GET_PROGRESS),
  cancelKernelInstall: (payload) =>
    ipcRenderer.invoke(IPC.KERNEL_CANCEL, payload),
  deleteInstalledKernel: (payload) =>
    ipcRenderer.invoke(IPC.KERNEL_DELETE_INSTALLED, payload),
  cleanupOldKernels: () => ipcRenderer.invoke(IPC.KERNEL_CLEANUP_OLD),

  getMacAddress: () => ipcRenderer.invoke(IPC.GET_MAC_ADDRESS),
  getSystemIdleTime: () => ipcRenderer.invoke(IPC.GET_SYSTEM_IDLE_TIME),

  changeAppApiLine: (apiLine) => {
    process.env.API_LINE = apiLine;
    console.log(apiLine, "process.env.API_LINE");
  },

  setProcessEnv: (key, value) =>
    ipcRenderer.send(IPC.SET_PROCESS_ENV, { key, value }),

  getSystemVersion: () =>
    typeof process.getSystemVersion === "function"
      ? process.getSystemVersion()
      : os.release(),
};

const DIC = { api };

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("openUrl", openUrl);

    // The recovered preload exposed ipcRenderer directly. We preserve this
    // contract for compatibility during reconstruction. It should be narrowed
    // later once all renderer call sites are migrated.
    contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);
    contextBridge.exposeInMainWorld("DIC", DIC);
  } catch (error) {
    console.error(error);
  }
} else {
  window.openUrl = (url) => ipcRenderer.send(IPC.OPEN_URL, { url });
  window.ipcRenderer = ipcRenderer;
  window.DIC = DIC;
}

window.CLIENT_OS = os.platform();

module.exports = { api, DIC, openUrl, IPC };
