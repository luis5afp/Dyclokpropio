import { ay as e } from "./index-BUIbb6Pa.js";
const n = (e) => Math.max(0, Math.min(100, Math.floor(e))),
  t = () => ({
    detailText: "",
    progressPercent: null,
    isCancellingOpen: !1,
    extensionDownloadProgressState: { byExtensionId: {}, lastPercent: null },
  }),
  r = () => ({
    detailText: "",
    progressPercent: null,
    isCancellingOpen: !1,
    extensionDownloadProgressState: { byExtensionId: {}, lastPercent: null },
  }),
  s = () => ({
    detailText: "",
    progressPercent: null,
    isCancellingOpen: !1,
    extensionDownloadProgressState: { byExtensionId: {}, lastPercent: null },
    isCancellingOpen: !0,
  }),
  a = (n, t) =>
    t(
      {
        [e.PRE_DATA_INJECT]: "env.env.step.crux.initializing",
        [e.FETCH_ENV_INFO]: "env.env.step.crux.detectingProxy",
        [e.EXPAND_CHECK]: "env.env.step.crux.detectingExpand",
        [e.PARAMS_MERGE]: "env.env.step.crux.mergingFingerprint",
        [e.LOCK_ENV]: "env.env.step.crux.lockingEnv",
        [e.OPEN_ENV]: "env.env.step.crux.startingBrowser",
      }[n] || "env.env.step.crux.initializing",
    ),
  o = (e, n, t) => {
    const r = {
      "data-sync-start": "env.env.step.crux.syncingCloudData",
      "backend-data-fetch": "env.env.step.crux.fetchingBrowserData",
      "localstorage-download": "env.env.step.crux.downloadingLocalStorage",
      "localstorage-extract": "env.env.step.crux.extractingLocalStorage",
      "localstorage-sync": "env.env.step.crux.syncingLocalStorage",
      "indexeddb-download": "env.env.step.crux.downloadingIndexedDB",
      "indexeddb-extract": "env.env.step.crux.extractingIndexedDB",
      "indexeddb-sync": "env.env.step.crux.syncingIndexedDB",
      "extension-extract": "env.env.step.crux.extractingExtension",
      "browser-start": "env.env.step.crux.startingBrowser",
    }[e];
    return r ? t(r) : a(n, t);
  },
  c = (e, n) => {
    const t = e.extensionTotal;
    return n(
      {
        download: "env.env.step.crux.downloadingExtension",
        update: "env.env.step.crux.updatingExtension",
        mixed: "env.env.step.crux.syncingExtension",
      }[e.extensionAction || "mixed"],
      "number" == typeof t && t > 0 ? { num: t } : void 0,
    );
  },
  i = (e, t, r, s) => {
    if ("extension-download" === t.stage) {
      const r = ((e, t) => {
        if (!t.expanId || !t.extensionTotal)
          return { state: e, percent: e.lastPercent };
        const r = { ...e.byExtensionId };
        if ("number" == typeof t.percent) {
          const e = n(t.percent),
            s = r[t.expanId] ?? 0;
          r[t.expanId] = Math.max(s, e);
        }
        const s = Object.values(r);
        if (!s.length)
          return {
            state: { byExtensionId: r, lastPercent: e.lastPercent },
            percent: e.lastPercent,
          };
        const a = Math.max(1, Math.floor(t.extensionTotal)),
          o = s.reduce((e, n) => e + n, 0),
          c = n(o / a),
          i = null === e.lastPercent ? c : Math.max(e.lastPercent, c);
        return { state: { byExtensionId: r, lastPercent: i }, percent: i };
      })(e.extensionDownloadProgressState, t);
      return {
        ...e,
        detailText: c(t, s),
        progressPercent: r.percent,
        extensionDownloadProgressState: r.state,
        isCancellingOpen: !1,
      };
    }
    return {
      detailText: "",
      progressPercent: null,
      isCancellingOpen: !1,
      extensionDownloadProgressState: { byExtensionId: {}, lastPercent: null },
      detailText: o(t.stage, r, s),
      progressPercent:
        "number" == typeof t.percent
          ? ((a = t.percent), Math.max(0, Math.min(100, Math.floor(a))))
          : null,
    };
    var a;
  },
  l = (e, n, t) =>
    e.isCancellingOpen
      ? t("env.env.btnClosed")
      : e.detailText
        ? null === e.progressPercent || void 0 === e.progressPercent
          ? e.detailText
          : `${e.detailText} ${e.progressPercent}%`
        : a(n, t);
export { l as a, t as c, s as m, r, i as u };
