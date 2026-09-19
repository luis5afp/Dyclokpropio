'use strict';

const appSchema = Object.freeze({
  userInfo: { type: 'object', default: {} },
  inputDelay: { type: 'number' },
  language: { type: 'string' },
  token: { type: 'string' },
  apiUrl: { type: 'string' },
  homeUrl: { type: 'string' },
  userOpenList: { type: 'array' },
  closeWindowChoice: { type: 'number' },
  loginAccountRecords: { type: 'array' },
  baseURLKey: { type: 'string', default: 'test' },
  cacheBaseDir: { type: 'string', default: '' },
  pluginPath: { type: 'string', default: '' },
  status: { type: 'boolean' },
  day: { type: 'number', default: 30 },
  cacheBaseDirs: { type: 'array' },
  migrateType: { type: 'string' },
  migrateDir: { type: 'string' },
  currentOpenApiConfig: {
    type: 'object',
    default: { running: false, port: 0, key: '' },
  },
  currentOpenApiV2Config: {
    type: 'object',
    default: { orgId: '', memberId: '', apiKey: '' },
  },
  useSystemProxyForPersonal: { type: 'boolean', default: true },
  deviceId: { type: 'string', default: '' },
  isIpLimitVpn: { type: 'boolean', default: false },
  cookieEncryptTypeMapForEnvIds: { type: 'object', default: {} },
  useHardwareAcceleration: { type: 'boolean', default: false },
  lastCheckSoftwareTimestamp: { type: 'number', default: 0 },
  downloadDomainPolicyV2: { type: 'string', default: '' },
  apiLine: { type: 'string', default: 'line1' },
  lineUrlList: { type: 'array', default: [] },
  eventVersions: { type: 'object', default: {} },
  trackingPoint: { type: 'string', default: '0' },
  mainWindowState: {
    type: 'object',
    properties: {
      width: { type: 'number' },
      height: { type: 'number' },
      isMaximized: { type: 'boolean' },
    },
    required: ['width', 'height', 'isMaximized'],
    additionalProperties: false,
  },
  mainWindowLaunchPreference: {
    type: 'object',
    properties: {
      width: { type: 'number' },
      height: { type: 'number' },
    },
    required: ['width', 'height'],
    additionalProperties: false,
  },
});

const appDefaults = Object.freeze({
  inputDelay: 100,
  language: 'en',
  token: '',
  apiUrl: '',
  homeUrl: '',
  openapiKey: '',
  userOpenList: [],
  loginAccountRecords: [],
  baseURLKey: 'test',
  cacheBaseDir: '',
  pluginPath: '',
  clearDay: -1,
  migrateType: 'UNKNOWN',
  migrateDir: '',
  deviceId: '',
  currentOpenApiConfig: { running: false, port: 0, key: '' },
  currentOpenApiV2Config: { orgId: '', memberId: '', apiKey: '' },
  useSystemProxyForPersonal: true,
  useHardwareAcceleration: false,
  isIpLimitVpn: false,
  cookieEncryptTypeMapForEnvIds: {},
  downloadDomainPolicyV2: '',
  apiLine: 'line1',
  lineUrlList: [],
  eventVersions: {},
  trackingPoint: '0',
});

const trackerSchema = Object.freeze({
  isPaid: { type: 'boolean' },
  installDate: { type: 'number' },
  dailyCount: { type: 'number' },
  events: { type: 'array', default: [] },
  reliableEvents: { type: 'array', default: [] },
  lastResetDate: { type: 'number' },
});

const trackerDefaults = Object.freeze({
  isPaid: false,
  installDate: 0,
  dailyCount: 0,
  events: [],
  reliableEvents: [],
  lastResetDate: 0,
});

const storeConfig = Object.freeze({
  app: {
    name: 'app',
    encryptionKey:
      'd81aaab2094eef341d5f987fe0f89da0c25f611acce75e8171da1216a1ec70a1',
    schema: appSchema,
    clearInvalidConfig: true,
    defaults: appDefaults,
  },
  tracker: {
    name: 'tracker',
    encryptionKey:
      '03c15ab2b80588706644f91cf2fab6c20e42eb4db2b0d1a00665d1f5353fa83a',
    schema: trackerSchema,
    clearInvalidConfig: true,
    defaults: trackerDefaults,
  },
});

module.exports = {
  appSchema,
  appDefaults,
  trackerSchema,
  trackerDefaults,
  storeConfig,
};
