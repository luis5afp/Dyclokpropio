import {
  c2 as e,
  cm as n,
  cn as a,
  co as o,
  am as l,
  cp as t,
  cq as i,
  cr as v,
  cs as p,
  ct as u,
  cu as r,
  bc as s,
  cv as c,
  an as T,
  cw as b,
  cx as d,
  v as m,
  aW as y,
  i as q,
  G as w,
  bU as h,
  W as g,
  aB as L,
  cy as f,
  C as x,
  V as C,
  cz as O,
  bV as V,
  cA as S,
} from "./index-BUIbb6Pa.js";
import { T as A } from "./timezone-BMz8A6Hf.js";
const M = [
    "canvas",
    "webGLImage",
    "audioContext",
    "clientRects",
    "speechVoices",
    "battery",
    "mediadevice",
  ],
  R = {
    canvasNoise: void 0,
    webGLImageNoise: void 0,
    audioContextNoise: void 0,
    clientRectsNoise: void 0,
    speechVoicesNoise: void 0,
    batteryNoise: void 0,
  },
  G = () => Math.floor(1e5 * Math.random()) + 1,
  N = {
    extensionsType: d.ALLOW,
    name: void 0,
    browser: b.Chrome,
    groupIds: void 0,
    browserVersionId: "",
    uaOs: "",
    os: { windows: ["windows-all"], mac: [], android: [], ios: [], linux: [] },
    uaType: "all",
    ua: void 0,
    cookie: void 0,
    otherCookie: void 0,
    proxyWay: T.NonUse,
    proxyType: l.Http,
    proxyHost: void 0,
    proxyPort: void 0,
    proxyUserName: void 0,
    proxyPasswd: void 0,
    proxyIpType: c.IpAPI,
    proxyId: void 0,
    proxyIpAddrType: s.IPV4,
    accountList: [],
    urls: [],
    fixedUrls: [],
    restoreUrlType: r.GLOBAL,
    config: void 0,
    dataConfigOption: [u.Cookie],
    browserConfigOption: [p.RestorePage],
    dataType: e.GLOBAL,
    browserType: e.GLOBAL,
    envDataSync: { status: !1, roleIds: [] },
    envMutilOpenType: v.GLOBAL,
    remoteInspectorType: i.GLOBAL,
    spoofingVideoType: t.DISABLE,
    localDataType: e.GLOBAL,
    localDataConfig: { type: 0, browserType: e.GLOBAL, dataType: [] },
    proxySoftEnable: !0,
    proxySoft: l.NONE,
    proxySoftInfo: {
      ip: "",
      country: "",
      countryCode: "",
      region: "",
      regionCode: "",
      city: "",
    },
    proxyApiInfo: { ipMethod: o.EVERY_TIME, url: "", ip: "", port: "" },
    bookmarkConfigVal: {
      bookmarkType: e.GLOBAL,
      status: !1,
      fileContent: [],
      coverRule: a.Cover,
      fileName: "",
      type: n.APPEND,
    },
    accessLimitConfigVal: {
      accessLimitType: e.GLOBAL,
      status: !1,
      type: 1,
      quickSelectionOption: [],
      quickSelectionType: 0,
      urlList: "",
    },
    envTagIds: [],
  },
  I = [
    {
      value: f.Windows.toLocaleLowerCase(),
      label: L.t("env.env.req.osLabelWindows"),
      options: [
        {
          value: `${f.Windows.toLocaleLowerCase()}-all`,
          label: L.t("env.env.req.allVersion"),
        },
        { value: "Windows11", label: "Windows 11" },
        { value: "Windows10", label: "Windows 10" },
        { value: "Windows8", label: "Windows 8" },
        { value: "Windows7", label: "Windows 7" },
      ],
    },
    {
      value: f.Mac.toLocaleLowerCase(),
      label: L.t("env.env.req.osLabelMac"),
      options: [
        {
          value: `${f.Mac.toLocaleLowerCase()}-all`,
          label: L.t("env.env.req.allVersion"),
        },
        { value: "macOS26", label: "macOS 26" },
        { value: "macOS15", label: "macOS 15" },
        { value: "macOS14", label: "macOS 14" },
        { value: "macOS13", label: "macOS 13" },
        { value: "macOS12", label: "macOS 12" },
        { value: "macOS11", label: "macOS 11" },
        { value: "macOS10", label: "macOS 10" },
      ],
    },
    {
      value: f.Android.toLocaleLowerCase(),
      label: L.t("env.env.req.osLabelAndroid"),
      options: [
        {
          value: `${f.Android.toLocaleLowerCase()}-all`,
          label: L.t("env.env.req.allVersion"),
        },
        { value: "Android16", label: "Android 16" },
        { value: "Android15", label: "Android 15" },
        { value: "Android14", label: "Android 14" },
        { value: "Android13", label: "Android 13" },
        { value: "Android12", label: "Android 12" },
        { value: "Android11", label: "Android 11" },
        { value: "Android10", label: "Android 10" },
        { value: "Android9", label: "Android 9" },
      ],
    },
    {
      value: f.Ios.toLocaleLowerCase(),
      label: L.t("env.env.req.osLabelIos"),
      options: [
        {
          value: `${f.Ios.toLocaleLowerCase()}-all`,
          label: L.t("env.env.req.allVersion"),
        },
        { value: "iOS26", label: "iOS 26" },
        { value: "iOS18", label: "iOS 18" },
        { value: "iOS17", label: "iOS 17" },
        { value: "iOS16", label: "iOS 16" },
        { value: "iOS15", label: "iOS 15" },
        { value: "iOS14", label: "iOS 14" },
      ],
    },
    {
      value: f.Linux.toLocaleLowerCase(),
      label: L.t("env.env.req.osLabelLinux"),
      options: [
        {
          value: `${f.Linux.toLocaleLowerCase()}-all`,
          label: L.t("env.env.req.allVersion"),
        },
      ],
    },
  ],
  D = [
    151, 150, 147, 143, 142, 134, 133, 132, 131, 130, 129, 128, 127, 126, 125,
    124, 123, 122, 121, 120, 119, 118, 117, 116, 115, 114, 113,
  ];
function W({ isEdit: e, isSingle: n }, a = !0) {
  const { t: o } = m.useI18n(),
    l = y();
  let t = q([{ label: o("env.env.req.CustomInput"), value: "custom" }]),
    i = q([
      { label: "428 x 926", value: "428 x 926" },
      { label: "390 x 844", value: "390 x 844" },
      { label: "360 x 780", value: "360 x 780" },
      { label: "375 x 812", value: "375 x 812" },
      { label: "414 x 896", value: "414 x 896" },
      { label: "414 x 736", value: "414 x 736" },
    ]),
    v = q([
      { label: "480 x 854", value: "480 x 854" },
      { label: "480 x 853", value: "480 x 853" },
      { label: "414 x 896", value: "414 x 896" },
      { label: "411 x 731", value: "411 x 731" },
      { label: "360 x 780", value: "360 x 780" },
      { label: "360 x 760", value: "360 x 760" },
      { label: "360 x 748", value: "360 x 748" },
      { label: "360 x 740", value: "360 x 740" },
      { label: "360 x 720", value: "360 x 720" },
      { label: "360 x 640", value: "360 x 640" },
      { label: "320 x 569", value: "320 x 569" },
    ]);
  const p = [
      { label: o("env.env.req.fontTruth"), value: "truth" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "6", value: "6" },
      { label: "8", value: "8" },
      { label: "10", value: "10" },
      { label: "12", value: "12" },
      { label: "16", value: "16" },
      { label: "20", value: "20" },
      { label: "24", value: "24" },
      { label: "32", value: "32" },
      { label: "64", value: "64" },
    ],
    u = [
      { label: o("env.env.req.fontTruth"), value: "truth" },
      { label: "2", value: "2" },
      { label: "4", value: "4" },
      { label: "6", value: "6" },
      { label: "8", value: "8" },
      { label: "16", value: "16" },
      { label: "32", value: "32" },
      { label: "64", value: "64" },
      { label: "128", value: "128" },
    ],
    r = () => ({
      acceptLangType: "ip",
      acceptLangValue: ["en-US", "en"],
      langType: "acceptLang",
      langValue: "local",
      timezoneType: "ip",
      timezoneValue: "local",
      geoType: "ask",
      geoSubType: "ip",
      geoValue: { longitude: void 0, latitude: void 0, accuracy: void 0 },
      fontType: "custom",
      fontValue: l.fontData.sort((e, n) =>
        e.localeCompare(n, void 0, { sensitivity: "base" }),
      ),
      webrtcType: "disable",
      webrtcValue: "",
      webrtcSyncProxyIpFlag: !1,
      webrtcKeepRandomInternalIp: !1,
      webrtcUseRandomInternalIp: !1,
      tlsDisabledValues: "",
      canvasType: "noise",
      canvasValue: 1,
      canvasRev2Value: void 0,
      ratioType: "truth",
      ratioValue: "",
      ratioWidth: void 0,
      ratioHeight: void 0,
      windowRatioType: "default",
      windowRatioValue: "",
      windowWidth: void 0,
      windowHeight: void 0,
      webGLImageType: "noise",
      webGLImageValue: 1,
      webGLImageRev2Value: void 0,
      mediadeviceType: "noise",
      mediadeviceValue: 1,
      webGLMetadataType: "custom",
      webglManufacturer: "",
      webglManufacturerType: "",
      webglRender: "",
      webGPUType: "inWebGL",
      webGPUTypeValue: Math.floor(99999 * Math.random()) + 2,
      audioContextType: "noise",
      audioContextValue: 1,
      clientRectsType: "noise",
      clientRectsValue: 1,
      speechVoicesType: "noise",
      speechVoicesValue: 1,
      hardwareConcurrencyValue: p[C.random(5, 9)].value,
      deviceMemoryValue: "2",
      trackType: "0",
      batteryType: "noise",
      batteryValue: 1,
      portType: "1",
      portValue: "",
      accelerateType: "0",
      startParams: "",
      deviceNameType: "truth",
      deviceNameValue: "",
      macType: "truth",
      macValue: "",
    });
  const s = w(),
    c = x(() => s.language),
    T = q([
      {
        column: "acceptLang",
        label: o("env.env.req.acceptLang"),
        valueType: "list",
        componentType: "custom",
        options: [
          {
            value: "ip",
            label: o("env.env.req.acceptLangIp"),
            tip: o("env.env.optionTips.acceptLangTip1"),
          },
          {
            value: "custom",
            label: o("env.env.req.custom"),
            tip: o("env.env.optionTips.acceptLangTip2"),
          },
        ],
      },
      {
        column: "lang",
        label: o("env.env.req.lang"),
        valueType: "string",
        componentType: "select",
        options: [
          {
            value: "acceptLang",
            label: o("env.env.req.langAcceptLang"),
            tip: o("env.env.optionTips.langTip1"),
          },
          {
            value: "truth",
            label: o("env.env.req.webrtcTruth"),
            tip: o("env.env.req.langCurrent"),
          },
          {
            value: "custom",
            label: o("env.env.req.custom"),
            tip: o("env.env.optionTips.langTip2"),
          },
        ],
        valueOptions: (() => {
          const e = [];
          return (
            h.data.forEach((n) => {
              n.ui &&
                e.push({
                  label:
                    n["zh" === (null == c ? void 0 : c.value) ? "zh" : "en"],
                  value: n.code,
                });
            }),
            e
          );
        })(),
      },
      {
        column: "timezone",
        label: o("env.env.req.timezone"),
        valueType: "string",
        componentType: "select",
        options: [
          {
            value: "ip",
            label: o("env.env.req.timezoneIp"),
            tip: o("env.env.optionTips.timezoneTip1"),
          },
          {
            value: "custom",
            label: o("env.env.req.custom"),
            tip: o("env.env.optionTips.timezoneTip2"),
          },
        ],
        valueOptions: (() => {
          const e = [];
          return (
            A.data.forEach((n) => {
              "local" === n.value
                ? e.push({ label: n.gmt, value: n.value })
                : e.push({ label: `${n.tz} ${n.gmt}`, value: `${n.value}` });
            }),
            e
          );
        })(),
      },
      {
        column: "geo",
        label: o("env.env.req.geo"),
        valueType: "geo",
        componentType: "custom",
        options: [
          {
            value: "ask",
            label: o("env.env.req.geoAsk"),
            tip: o("env.env.optionTips.geoTip1"),
          },
          {
            value: "enable",
            label: o("env.env.req.geoEnable"),
            tip: o("env.env.optionTips.geoTip2"),
          },
          {
            value: "disable",
            label: o("env.env.req.geoDisable"),
            tip: o("env.env.optionTips.geoTip3"),
          },
        ],
        valueOptions: [
          {
            value: "ip",
            label: o("env.env.req.geoIp"),
            tip: o("env.env.optionTips.geoInIpTip"),
          },
          {
            value: "custom",
            label: o("env.env.req.custom"),
            tip: o("env.env.optionTips.geoCustomTip"),
          },
        ],
      },
      {
        column: "ratio",
        label: o("env.env.req.ScreenResolution"),
        valueType: "string",
        componentType: "custom",
        options: [
          {
            value: "custom",
            label: o("env.env.req.custom"),
            tip: o("env.env.optionTips.ScreenResolutionTip1"),
          },
          {
            value: "truth",
            label: o("env.env.req.fontTruth"),
            tip: o("env.env.optionTips.ScreenResolutionTip2"),
          },
        ],
      },
      {
        column: "windowRatio",
        label: o("env.env.req.windowSize"),
        valueType: "string",
        componentType: "custom",
        options: [
          {
            value: "custom",
            label: o("env.env.req.custom"),
            tip: o("env.env.optionTips.windowRatioTip1"),
          },
          {
            value: "default",
            label: o("env.env.req.default"),
            tip: o("env.env.optionTips.windowRatioTip2"),
          },
        ],
      },
      {
        column: "font",
        label: o("env.env.req.font"),
        valueType: "list",
        componentType: "custom",
        options: [
          {
            value: "custom",
            label: o("env.env.req.custom"),
            tip: o("env.env.optionTips.fontTip2"),
          },
          {
            value: "truth",
            label: o("env.env.req.fontTruth"),
            tip: o("env.env.optionTips.fontTip3"),
          },
        ],
      },
      {
        column: "webrtc",
        label: o("env.env.req.webrtc"),
        valueType: "string",
        componentType: "custom",
        options: [
          {
            value: "replace",
            label: o("env.env.req.webrtcReplace"),
            tip: o("env.env.optionTips.webRTCTip3"),
          },
          {
            value: "forward",
            label: o("env.env.req.webrtcForward"),
            tip: o("env.env.optionTips.webRTCTip6"),
          },
          {
            value: "truth",
            label: o("env.env.req.webrtcTruth"),
            tip: o("env.env.optionTips.webRTCTip4"),
          },
          {
            value: "disable",
            label: o("env.env.req.webrtcDisable"),
            tip: o("env.env.optionTips.webRTCTip5"),
          },
        ],
      },
      {
        column: "tlsDisabledValues",
        label: o("env.env.req.tlsDisabledValues"),
        valueType: "string",
        componentType: "custom2",
        options: [
          {
            value: "disabled",
            label: o("env.env.req.tlsDisabledValuesDisabled"),
          },
          {
            value: "enabled",
            label: o("env.env.req.tlsDisabledValuesEnabled"),
          },
        ],
      },
      {
        column: "canvas",
        label: o("env.env.req.canvas"),
        valueType: "number",
        componentType: "input",
        options: [
          {
            value: "noise",
            label: o("env.env.req.canvasNoise"),
            tip: o("env.env.optionTips.canvasTip1"),
          },
          {
            value: "truth",
            label: o("env.env.req.canvasTruth"),
            tip: o("env.env.optionTips.canvasTip2"),
          },
        ],
      },
      {
        column: "clientRects",
        label: o("env.env.req.ClientRects"),
        valueType: "number",
        componentType: "input",
        options: [
          {
            value: "noise",
            label: o("env.env.req.noise"),
            tip: o("env.env.optionTips.clientRectsTip1"),
          },
          {
            value: "truth",
            label: o("env.env.req.fontTruth"),
            tip: o("env.env.optionTips.clientRectsTip2"),
          },
        ],
      },
      {
        column: "audioContext",
        label: o("env.env.req.AudioContext"),
        valueType: "number",
        componentType: "input",
        options: [
          {
            value: "noise",
            label: o("env.env.req.noise"),
            tip: o("env.env.optionTips.audioContextTip1"),
          },
          {
            value: "truth",
            label: o("env.env.req.fontTruth"),
            tip: o("env.env.optionTips.audioContextTip2"),
          },
        ],
      },
      {
        column: "webGLImage",
        label: o("env.env.req.WebGLImage"),
        valueType: "string",
        componentType: "input",
        options: [
          {
            value: "noise",
            label: o("env.env.req.noise"),
            tip: o("env.env.optionTips.WebGLImageTip1"),
          },
          {
            value: "truth",
            label: o("env.env.req.fontTruth"),
            tip: o("env.env.optionTips.WebGLImageTip2"),
          },
        ],
      },
      {
        column: "mediadevice",
        label: o("env.env.req.mediadevice"),
        valueType: "string",
        componentType: "input",
        options: [
          {
            value: "noise",
            label: o("env.env.req.noise"),
            tip: o("env.env.optionTips.customFingerprintTip", {
              type: o("env.env.req.mediadevice"),
            }),
          },
          {
            value: "truth",
            label: o("env.env.req.fontTruth"),
            tip: o("env.env.optionTips.truthCustomFingerprintTip", {
              type: o("env.env.req.mediadevice"),
            }),
          },
        ],
      },
      {
        column: "webGLMetadata",
        label: o("env.env.req.webGLMetadata"),
        valueType: "string",
        componentType: "input",
        options: [
          {
            value: "custom",
            label: o("env.env.req.custom"),
            tip: o("env.env.optionTips.webGLMetadataTip2"),
          },
          {
            value: "truth",
            label: o("env.env.req.fontTruth"),
            tip: o("env.env.optionTips.webGLMetadataTip3"),
          },
        ],
      },
      {
        column: "webGPU",
        label: o("env.env.req.WebGPU"),
        valueType: "string",
        componentType: "input",
        options: [
          {
            value: "inWebGL",
            label: o("env.env.req.inWebGL"),
            tip: o("env.env.optionTips.webGPUTip1"),
          },
          {
            value: "truth",
            label: o("env.env.req.fontTruth"),
            tip: o("env.env.optionTips.webGPUTip2"),
          },
          {
            value: "disable",
            label: o("env.env.req.disable"),
            tip: o("env.env.optionTips.webGPUTip3"),
          },
        ],
      },
      {
        column: "speechVoices",
        label: o("env.env.req.SpeechVoices"),
        valueType: "number",
        componentType: "input",
        options: [
          {
            value: "noise",
            label: o("env.env.req.noise"),
            tip: o("env.env.optionTips.speechVoicesTip1"),
          },
          {
            value: "truth",
            label: o("env.env.req.fontTruth"),
            tip: o("env.env.optionTips.speechVoicesTip2"),
          },
        ],
      },
      {
        column: "hardwareConcurrency",
        label: o("env.env.req.HardwareConcurrency"),
        valueType: "string",
        componentType: "custom2",
        options: [
          {
            value: "random",
            label: o("env.env.req.random"),
            tip: o("env.env.optionTips.HardwareConcurrencyTip1"),
          },
          {
            value: "custom",
            label: o("env.env.req.custom"),
            tip: o("env.env.optionTips.HardwareConcurrencyTip2"),
          },
        ],
        valueOptions: p,
      },
      {
        column: "deviceMemory",
        label: o("env.env.req.DeviceMemory"),
        valueType: "number",
        componentType: "custom2",
        options: [
          {
            value: "random",
            label: o("env.env.req.random"),
            tip: o("env.env.optionTips.DeviceMemoryTip1"),
          },
          {
            value: "custom",
            label: o("env.env.req.custom"),
            tip: o("env.env.optionTips.DeviceMemoryTip2"),
          },
        ],
        valueOptions: u,
      },
      {
        column: "deviceName",
        label: o("org.loginVerify.tip18"),
        valueType: "string",
        componentType: "input",
        options: [
          {
            value: "custom",
            label: o("env.env.req.custom"),
            tip: o("env.env.req.deviceNameCustomTip"),
          },
          {
            value: "truth",
            label: o("env.env.req.fontTruth"),
            tip: o("env.env.req.deviceNameTruthTip"),
          },
        ],
      },
      {
        column: "mac",
        label: o("env.env.req.macAddress"),
        valueType: "string",
        componentType: "input",
        options: [
          {
            value: "custom",
            label: o("env.env.req.custom"),
            tip: o("env.env.req.macCustomTip"),
          },
          {
            value: "truth",
            label: o("env.env.req.fontTruth"),
            tip: o("env.env.req.macTruthTip"),
          },
        ],
      },
      {
        column: "track",
        label: o("env.env.req.DoNotTrack"),
        valueType: "string",
        componentType: "input",
        options: [
          {
            value: "0",
            label: o("env.env.req.default"),
            tip: o("env.env.optionTips.doNotTrackTip1"),
          },
          {
            value: "1",
            label: o("env.env.req.enable"),
            tip: o("env.env.optionTips.doNotTrackTip2"),
          },
          {
            value: "2",
            label: o("env.env.req.close"),
            tip: o("env.env.optionTips.doNotTrackTip3"),
          },
        ],
      },
      {
        column: "battery",
        label: o("env.env.req.Battery"),
        valueType: "string",
        componentType: "input",
        options: [
          {
            value: "noise",
            label: o("env.env.req.noise"),
            tip: o("env.env.optionTips.batteryTip1"),
          },
          {
            value: "truth",
            label: o("env.env.req.fontTruth"),
            tip: o("env.env.optionTips.batteryTip2"),
          },
        ],
      },
      {
        column: "port",
        label: o("env.env.req.PortScanProtection"),
        valueType: "number",
        componentType: "input",
        options: [
          {
            value: "1",
            label: o("env.env.req.enable"),
            tip: o("env.env.optionTips.portScanProtectionTip1"),
          },
          {
            value: "0",
            label: o("env.env.req.close"),
            tip: o("env.env.optionTips.portScanProtectionTip2"),
          },
        ],
      },
      {
        column: "accelerate",
        label: o("env.env.req.HardwareAcceleration"),
        valueType: "string",
        componentType: "input",
        options: [
          {
            value: "0",
            label: o("env.env.req.default"),
            tip: o("env.env.optionTips.HardwareAccelerationTip1"),
          },
          {
            value: "1",
            label: o("env.env.req.enable"),
            tip: o("env.env.optionTips.HardwareAccelerationTip2"),
          },
          {
            value: "2",
            label: o("env.env.req.close"),
            tip: o("env.env.optionTips.HardwareAccelerationTip3"),
          },
        ],
      },
      {
        column: "startParams",
        label: o("env.env.req.startExtraParams"),
        valueType: "string",
        componentType: "custom2",
        options: [],
      },
    ]);
  return (
    a &&
      (g(
        () => (null == n ? void 0 : n.value),
        () => {
          (null == n ? void 0 : n.value)
            ? ((T.value.find((e) => "font" === e.column).options = [
                {
                  value: "custom",
                  label: o("env.env.req.custom"),
                  tip: o("env.env.optionTips.fontTip2"),
                },
                {
                  value: "truth",
                  label: o("env.env.req.fontTruth"),
                  tip: o("env.env.optionTips.fontTip3"),
                },
              ]),
              (T.value.find((e) => "webGLMetadata" === e.column).options = [
                {
                  value: "custom",
                  label: o("env.env.req.custom"),
                  tip: o("env.env.optionTips.webGLMetadataTip2"),
                },
                {
                  value: "truth",
                  label: o("env.env.req.fontTruth"),
                  tip: o("env.env.optionTips.webGLMetadataTip3"),
                },
              ]),
              (T.value.find((e) => "mac" === e.column).options = [
                {
                  value: "custom",
                  label: o("env.env.req.custom"),
                  tip: o("env.env.req.macCustomTip"),
                },
                {
                  value: "truth",
                  label: o("env.env.req.fontTruth"),
                  tip: o("env.env.req.macTruthTip"),
                },
              ]),
              (T.value.find((e) => "deviceName" === e.column).options = [
                {
                  value: "custom",
                  label: o("env.env.req.custom"),
                  tip: o("env.env.req.deviceNameCustomTip"),
                },
                {
                  value: "truth",
                  label: o("env.env.req.fontTruth"),
                  tip: o("env.env.req.deviceNameTruthTip"),
                },
              ]))
            : ((T.value.find((e) => "font" === e.column).options = [
                {
                  value: "random",
                  label: o("env.env.req.random"),
                  tip: o("env.env.optionTips.fontTip1"),
                },
                {
                  value: "custom",
                  label: o("env.env.req.custom"),
                  tip: o("env.env.optionTips.fontTip2"),
                },
                {
                  value: "truth",
                  label: o("env.env.req.fontTruth"),
                  tip: o("env.env.optionTips.fontTip3"),
                },
              ]),
              (T.value.find((e) => "webGLMetadata" === e.column).options = [
                {
                  value: "random",
                  label: o("env.env.req.random"),
                  tip: o("env.env.optionTips.webGLMetadataTip1"),
                },
                {
                  value: "custom",
                  label: o("env.env.req.custom"),
                  tip: o("env.env.optionTips.webGLMetadataTip2"),
                },
                {
                  value: "truth",
                  label: o("env.env.req.fontTruth"),
                  tip: o("env.env.optionTips.webGLMetadataTip3"),
                },
              ]),
              (T.value.find((e) => "mac" === e.column).options = [
                {
                  value: "random",
                  label: o("env.env.req.random"),
                  tip: o("env.env.req.macRandomTip"),
                },
                {
                  value: "custom",
                  label: o("env.env.req.custom"),
                  tip: o("env.env.req.macCustomTip"),
                },
                {
                  value: "truth",
                  label: o("env.env.req.fontTruth"),
                  tip: o("env.env.req.macTruthTip"),
                },
              ]),
              (T.value.find((e) => "deviceName" === e.column).options = [
                {
                  value: "random",
                  label: o("env.env.req.random"),
                  tip: o("env.env.req.deviceNameRandomTip"),
                },
                {
                  value: "custom",
                  label: o("env.env.req.custom"),
                  tip: o("env.env.req.deviceNameCustomTip"),
                },
                {
                  value: "truth",
                  label: o("env.env.req.fontTruth"),
                  tip: o("env.env.req.deviceNameTruthTip"),
                },
              ]));
        },
        { immediate: !0 },
      ),
      g(
        () => (null == e ? void 0 : e.value),
        () => {
          (null == e ? void 0 : e.value)
            ? (T.value.find((e) => "ratio" === e.column).options = [
                {
                  value: "custom",
                  label: o("env.env.req.custom"),
                  tip: o("env.env.optionTips.ScreenResolutionTip1"),
                },
                {
                  value: "truth",
                  label: o("env.env.req.fontTruth"),
                  tip: o("env.env.optionTips.ScreenResolutionTip2"),
                },
              ])
            : (T.value.find((e) => "ratio" === e.column).options = [
                {
                  value: "custom",
                  label: o("env.env.req.custom"),
                  tip: o("env.env.optionTips.ScreenResolutionTip1"),
                },
                {
                  value: "truth",
                  label: o("env.env.req.fontTruth"),
                  type: "custom",
                  tip: o("env.env.optionTips.ScreenResolutionTip2"),
                },
                {
                  value: "random",
                  label: o("env.env.req.random"),
                  tip: o("env.env.optionTips.ScreenResolutionTip3"),
                },
              ]);
        },
        { immediate: !0 },
      )),
    {
      ratioList: t,
      getRatioList: async () => {
        l.getRatioConfigVal.forEach((e) => {
          t.value.push({
            label: e.width + " x " + e.height,
            value: e.width + " x " + e.height,
          });
        });
      },
      noiseTypeArr: M,
      noiseValueArr: R,
      createNoiseValue: G,
      deviceMemoryOption: u,
      hardwareConcurrencyOption: p,
      getWebGLMetadata: async (e) => await S(e),
      extendConfigList: T,
      getDefaultBatchExtendConfig: function (e) {
        let n = C.cloneDeep(e);
        const a = C.cloneDeep(r());
        return (
          (a.deviceMemoryType = "random"),
          (a.hardwareConcurrencyType = "random"),
          (a.webGLMetadataType = "random"),
          (a.fontType = "random"),
          V(C.omitBy(n ?? {}, C.isNull), a)
        );
      },
      iosRatioList: i,
      androidRatioList: v,
      getDefaultExtendConfig: function (e) {
        const n = C.cloneDeep(r());
        let a = C.cloneDeep(e);
        return (
          a &&
            (a.deviceMemoryType === O.RANDOM &&
              ((a.deviceMemoryValue = u[C.random(1, u.length - 1)].value),
              delete a.deviceMemoryType),
            a.hardwareConcurrencyType === O.RANDOM &&
              ((a.hardwareConcurrencyValue =
                p[C.random(1, p.length - 1)].value),
              delete a.hardwareConcurrencyType),
            a.webGLMetadataType === O.RANDOM &&
              ((a.webglManufacturer = ""),
              (a.webglRender = ""),
              (a.webGLMetadataType = O.CUSTOM)),
            a.fontType === O.RANDOM &&
              ((a.fontValue = l.fontData.sort((e, n) =>
                e.localeCompare(n, void 0, { sensitivity: "base" }),
              )),
              (a.fontType = O.CUSTOM)),
            a.deviceNameType === O.RANDOM &&
              ((a.deviceNameValue = ""), (a.deviceNameType = O.CUSTOM)),
            a.macType === O.RANDOM &&
              ((a.macValue = ""), (a.macType = O.CUSTOM))),
          V(C.omitBy(a ?? {}, C.isNull), n)
        );
      },
    }
  );
}
export { D as a, N as d, I as o, W as u };
