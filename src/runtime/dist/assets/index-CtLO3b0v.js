import {
  d as e,
  R as t,
  aW as a,
  G as o,
  v as r,
  i,
  V as n,
  bO as l,
  am as s,
  bP as u,
  W as c,
  ag as v,
  P as p,
  r as d,
  q as f,
  o as m,
  c as y,
  F as g,
  b as w,
  f as h,
  w as b,
  a as T,
  e as C,
  t as E,
  x as k,
  h as S,
  X as L,
  C as x,
  bQ as D,
  bR as V,
  bS as O,
  bT as I,
  bU as R,
  bV as _,
  ac as N,
  as as A,
  a3 as q,
  bN as B,
  bW as P,
  bX as M,
  an as F,
  bY as $,
  bZ as j,
  b_ as G,
  b$ as U,
  c0 as W,
  c1 as J,
  c2 as K,
  c3 as z,
  bb as H,
  D as X,
  E as Y,
  A as Z,
  c4 as Q,
  c5 as ee,
  ad as te,
  c6 as ae,
  c7 as oe,
  c8 as re,
  c9 as ie,
  ca as ne,
  cb as le,
  bu as se,
  cc as ue,
  cd as ce,
  ce as ve,
  cf as pe,
  cg as de,
  ch as fe,
  s as me,
  ci as ye,
  cj as ge,
  ck as we,
  be as he,
  ah as be,
  cl as Te,
  ao as Ce,
  I as Ee,
  a$ as ke,
  _ as Se,
} from "./index-BUIbb6Pa.js";
import { t as Le } from "./transformExcel-Cy_3yjj_.js";
import { u as xe, o as De, a as Ve, d as Oe } from "./useEnvEdit-B6M5ajw7.js";
import { g as Ie } from "./proxyProviderAvailability-Dl68x0Bx.js";
import Re from "./Layout-DI5ayfG1.js";
import _e from "./index-C1USGHg9.js";
import Ne from "./envEditProxyForm-BbH2PHWU.js";
import Ae from "./index-Cl4ZyFim.js";
import qe from "./index-BFrckwEl.js";
import Be from "./envConfigPreview-CBaHhdWV.js";
import Pe from "./uploadResTable-C0OHSR31.js";
import { _ as Me } from "./uploadStateBox.vue_vue_type_script_setup_true_lang-Bg_v28iv.js";
import { A as Fe } from "./driver.js-DEmvqz_C.js";
/* empty css               */ const $e = [
    1, 4096, 2, 4, 8, 16, 32, 64, 256, 512, 1024, 2048, 131072, 262144, 524288,
  ],
  je = [1, 2, 4, 8, 16, 32],
  Ge = [1, 4, 8, 16, 32, 64],
  Ue = "chromewebstore.google.com",
  We = new Set(["__proto__", "constructor", "prototype"]),
  Je = "global",
  Ke = "custom";
function ze(e) {
  return !We.has(e);
}
function He(e) {
  if (null === e || "object" != typeof e) return !1;
  const t = Object.getPrototypeOf(e);
  return t === Object.prototype || null === t;
}
function Xe(e) {
  return Array.isArray(e)
    ? e.map((e) => Xe(e))
    : He(e)
      ? Object.fromEntries(
          Object.entries(e)
            .filter(([e]) => ze(e))
            .map(([e, t]) => [e, Xe(t)]),
        )
      : e;
}
function Ye(e, t) {
  for (const [a, o] of Object.entries(t))
    if (ze(a) && null != o) {
      if (He(o)) {
        const t = Object.hasOwn(e, a) ? e[a] : void 0;
        e[a] = Ye(He(t) ? t : {}, o);
        continue;
      }
      e[a] = Xe(o);
    }
  return e;
}
function Ze(e, ...t) {
  if (!He(e)) return Xe(e);
  const a = Ye({}, e);
  for (const o of t) He(o) && Ye(a, o);
  return a;
}
function Qe(e) {
  if (He(e)) return Xe(e);
  if ("string" == typeof e && "" !== e.trim())
    try {
      const t = JSON.parse(e);
      return He(t) ? Xe(t) : void 0;
    } catch {
      return;
    }
}
function et(e) {
  if ("number" == typeof e)
    return Number.isSafeInteger(e) && e >= 0 ? e : void 0;
  if ("string" != typeof e || !/^\d+$/.test(e)) return;
  const t = Number(e);
  return Number.isSafeInteger(t) ? t : void 0;
}
function tt(e, t) {
  const a = et(e);
  if (void 0 !== a) return t.filter((e) => (a & e) === e);
}
function at(e, t) {
  return Array.isArray(e) ? t.filter((t) => e.includes(t)) : tt(e, t);
}
function ot(e, t) {
  if (Array.isArray(e)) {
    if (
      !e.every(
        (e) =>
          "number" == typeof e &&
          Number.isSafeInteger(e) &&
          t.some((t) => t === e),
      )
    )
      return;
    return t.filter((t) => e.includes(t));
  }
  return tt(e, t);
}
function rt(e, t) {
  if ("string" != typeof e) return "";
  const a = new Set(t.map((e) => e.toLowerCase()));
  return e
    .split(/\r?\n/)
    .map((e) => e.trim())
    .filter((e) => !a.has(e.toLowerCase()))
    .join("\n");
}
function it(e) {
  return "number" == typeof e && Number.isFinite(e);
}
function nt() {
  return {
    bookmarkType: Je,
    status: !1,
    type: 1,
    fileName: "",
    fileContent: [],
    coverRule: 1,
  };
}
function lt() {
  return {
    accessLimitType: Je,
    status: !1,
    type: 1,
    quickSelectionOption: [],
    quickSelectionType: 0,
    urlList: "",
  };
}
function st(e, t) {
  const a = {};
  if (!e) return a;
  const o = Qe(e.dataConfig);
  if ((null == o ? void 0 : o.dataType) === Ke) {
    a.dataType = Ke;
    const e = ot(o.type, je);
    void 0 !== e && (a.dataConfigOption = e);
  } else (null == o ? void 0 : o.dataType) === Je && (a.dataType = Je);
  const r = Qe(e.browserConfig);
  if ((null == r ? void 0 : r.browserType) === Ke) {
    a.browserType = Ke;
    const e = ot(r.type, $e);
    void 0 !== e && (a.browserConfigOption = e);
  } else (null == r ? void 0 : r.browserType) === Je && (a.browserType = Je);
  const i = Qe(e.localDataConfig);
  (null == i ? void 0 : i.browserType) === Ke
    ? ((a.localDataType = Ke),
      (a.localDataConfig = (function (e, t) {
        const a = at(null == t ? void 0 : t.dataType, Ge) ?? [],
          o = ot(e.dataType, Ge) ?? a;
        return {
          type: it(e.type) ? e.type : ((null == t ? void 0 : t.type) ?? 1),
          browserType: Ke,
          dataType: o,
          synchronize:
            "boolean" == typeof e.synchronize
              ? e.synchronize
              : ((null == t ? void 0 : t.synchronize) ?? !1),
          frequency: it(e.frequency)
            ? e.frequency
            : ((null == t ? void 0 : t.frequency) ?? 1),
          interval: it(e.interval)
            ? e.interval
            : ((null == t ? void 0 : t.interval) ?? 0),
        };
      })(i, t.localDataConfig)))
    : (null == i ? void 0 : i.browserType) === Je &&
      ((a.localDataType = Je),
      void 0 !== t.localDataConfig &&
        (a.localDataConfig = Xe(t.localDataConfig)));
  const n = Qe(e.bookmarkConfig);
  (null == n ? void 0 : n.bookmarkType) === Ke
    ? (a.bookmarkConfigVal = (function (e, t) {
        const a = t ?? nt();
        return {
          bookmarkType: Ke,
          status: "boolean" == typeof e.status ? e.status : a.status,
          type: it(e.type) ? e.type : a.type,
          fileName: "string" == typeof e.fileName ? e.fileName : a.fileName,
          fileContent: Array.isArray(e.fileContent)
            ? Xe(e.fileContent)
            : Xe(a.fileContent),
          coverRule: it(e.coverRule) ? e.coverRule : a.coverRule,
        };
      })(n, t.bookmarkConfigVal))
    : (null == n ? void 0 : n.bookmarkType) === Je &&
      void 0 !== t.bookmarkConfigVal &&
      (a.bookmarkConfigVal = Xe(t.bookmarkConfigVal));
  const l = Qe(e.accessLimitConfig);
  (null == l ? void 0 : l.accessLimitType) === Ke
    ? (a.accessLimitConfigVal = (function (e, t) {
        const a = t ?? lt(),
          o = et(e.quickSelectionType),
          r = Array.isArray(e.quickSelectionOption)
            ? ot(e.quickSelectionOption, [1])
            : void 0,
          i =
            at(a.quickSelectionType, [1]) ??
            at(a.quickSelectionOption, [1]) ??
            [],
          n = void 0 !== o ? (ot(o, [1]) ?? []) : (r ?? i),
          l = "string" == typeof e.urlList ? e.urlList : a.urlList;
        return {
          accessLimitType: Ke,
          status: "boolean" == typeof e.status ? e.status : a.status,
          type: it(e.type) ? e.type : a.type,
          quickSelectionOption: n,
          quickSelectionType: n.reduce((e, t) => e + t, 0),
          urlList: rt(l, n.includes(1) ? [Ue] : []),
        };
      })(l, t.accessLimitConfigVal))
    : (null == l ? void 0 : l.accessLimitType) === Je &&
      void 0 !== t.accessLimitConfigVal &&
      (a.accessLimitConfigVal = Xe(t.accessLimitConfigVal));
  const s = Qe(e.envDataSync);
  var u;
  return (
    He((u = s)) &&
      "boolean" == typeof u.status &&
      Array.isArray(u.roleIds) &&
      u.roleIds.every((e) => "string" == typeof e) &&
      (a.envDataSync = Xe(s)),
    a
  );
}
const ut = (e, t, a) => {
    const { envUsage: o, envLimit: r } = e;
    return (
      !(
        !Number.isFinite(t) ||
        t < 0 ||
        !Number.isFinite(a) ||
        a <= 0 ||
        "number" != typeof o ||
        !Number.isFinite(o) ||
        "number" != typeof r ||
        !Number.isFinite(r) ||
        r < 0
      ) && o + a > r
    );
  },
  ct = async ({
    cachedSummary: e,
    planLimit: t,
    requestedCount: a,
    fetchLatestSummary: o,
  }) => {
    if (!ut(e, t, a)) return !1;
    try {
      const e = await o();
      return ut(e, t, a);
    } catch (r) {
      return !1;
    }
  },
  vt = async ({
    createType: e,
    cachedSummary: t,
    planLimit: a,
    fetchLatestSummary: o,
  }) =>
    "Single" === e &&
    ct({
      cachedSummary: t,
      planLimit: a,
      requestedCount: 1,
      fetchLatestSummary: o,
    }),
  pt = { class: "s-flex" },
  dt = Se(
    e({
      __name: "index",
      props: { summary: {} },
      emits: ["submit", "convertEnv", "convertEnvByBatch", "update:envGroup"],
      setup(e, { expose: Se, emit: We }) {
        const Ke = ["basic", "fingerprint", "senior", "proxy"],
          { listingLinkAccounts: ze } = t(a()),
          Ye = o(),
          et = x(() => Ye.language),
          { t: tt, locale: ot } = r.useI18n(),
          it = We,
          ut = i(null),
          vt = i(),
          dt = i("1000px"),
          ft = i(!1),
          mt = i(),
          yt = x(() =>
            Reflect.get(
              {
                zh: "125px",
                en: "180px",
                vi: "160px",
                ru: "170px",
                pt: "200px",
                es: "180px",
              },
              ot.value,
            ),
          ),
          gt = {
            isView: !1,
            title: "env.env.createTitle",
            row: {},
            uaTypeArr: ["all"],
          },
          wt = i(n.cloneDeep(gt)),
          ht = i({
            isView: !1,
            title: "env.env.createTitle",
            row: {},
            uaTypeArr: ["all"],
          }),
          bt = i({
            isView: !1,
            title: "env.env.createTitle",
            row: {},
            uaTypeArr: ["all"],
          }),
          Tt = x(() => te().currentPlan);
        let Ct = e,
          Et = x(() => Lt.value === l.Single),
          kt = x(() => Lt.value === l.Batch),
          St = x(() => Lt.value === l.BulkImport),
          Lt = i(l.Single);
        const xt = i(!1),
          {
            getDefaultBatchExtendConfig: Dt,
            getRatioList: Vt,
            noiseTypeArr: Ot,
            noiseValueArr: It,
            extendConfigList: Rt,
            getDefaultExtendConfig: _t,
          } = xe({ isEdit: xt, isSingle: Et });
        let Nt = null;
        const At = i(_t()),
          qt = i(Dt()),
          Bt = i(Dt()),
          Pt =
            /^[\-\+]?(0(\.\d{1,6})?|([1-9](\d)?)(\.\d{1,6})?|1[0-7]\d{1}(\.\d{1,6})?|180|180\.0{1,6})$/,
          Mt = /^\d+$/,
          Ft = /^Mozilla.*AppleWebKit.*KHTML.*$/,
          $t =
            /^((25[0-5]\.|2[0-4]\d\.|1\d{2}\.|[1-9]?\d\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d))$/,
          jt = i([]),
          Gt = i([]),
          Ut = i([]),
          Wt = i([]),
          Jt = i({}),
          Kt = i([]),
          zt = i({}),
          Ht = i(!1),
          Xt = i();
        let Yt = i(),
          Zt = i();
        const Qt = i(["0"]),
          ea = i(),
          ta = i(),
          aa = i(),
          oa = i(!1),
          ra = x(() => (kt.value ? qt.value : St.value ? Bt.value : At.value));
        i({
          soft: s.IPFLY,
          type: s.Socks5,
          host: "py.ipflygates.com",
          port: 16666,
          userName: "",
          passwd: "",
        });
        const ia = i({}),
          na = i(!0),
          { checkProxyResult: la } = ge(),
          sa = Fe({
            allowClose: !0,
            disableActiveInteraction: !0,
            smoothScroll: !0,
            allowKeyboardControl: !1,
            doneBtnText: tt("header.guide.endGuide"),
            steps: [],
            onDestroyStarted: () => {
              sa.destroy();
            },
          }),
          ua = async () => {
            var e, t;
            const a = await (null == (e = aa.value)
              ? void 0
              : e.refreshFingerprint());
            null == (t = mt.value) || t.refreshFingerprint(a);
          },
          ca = async (e) => {
            function t(e) {
              setTimeout(async () => {
                (!(function (e) {
                  if (ut.value) {
                    const t = ut.value.querySelector(`#${e}`);
                    if (t) {
                      const e = t.getBoundingClientRect(),
                        a = ut.value.getBoundingClientRect(),
                        o = e.top - a.top + ut.value.scrollTop;
                      ut.value.scrollTop = o;
                    }
                  }
                })(e),
                  sa.drive());
              }, 1e3);
            }
            switch (e) {
              case we.ADD_ACCOUNT:
                if (!he([be.CREATE_AN_ENVIRONMENT, be.EDITING_ENVIRONMENT]))
                  return;
                (sa.setSteps([
                  {
                    element: "#envV2AddAccountBox",
                    popover: {
                      description: `<div class="tw-mb-[6px]">${tt("envV2.tip35")}</div><div>${tt("envV2.tip36")}</div>`,
                      side: "right",
                      prevBtnText: "",
                    },
                  },
                ]),
                  t("envV2AddAccountBox"));
                break;
              case we.COOKIE_IMPORT:
                if (!he([be.CREATE_AN_ENVIRONMENT, be.EDITING_ENVIRONMENT]))
                  return;
                (sa.setSteps([
                  {
                    element: "#guide-cookie",
                    popover: {
                      description: `<div class="tw-mb-[6px]">${tt("header.guide.addCookieTips1")}</div><div>${tt("header.guide.addCookieTips2")}</div>`,
                      side: "right",
                      prevBtnText: "",
                    },
                  },
                ]),
                  t("guide-cookie"));
                break;
              case we.PROXY:
                if (!he([be.CREATE_AN_ENVIRONMENT, be.EDITING_ENVIRONMENT]))
                  return;
                (sa.setSteps([
                  {
                    element: "#envV2ProxyBox",
                    popover: {
                      description: `<div class="tw-mb-[6px]">${tt("envV2.tip37")}</div><div>${tt("envV2.tip38")}</div>`,
                      side: "right",
                      prevBtnText: "",
                    },
                  },
                ]),
                  N(async () => {
                    (await B(100),
                      Te("#envV2ProxyBox", "center", !1),
                      await B(500),
                      sa.drive());
                  }));
            }
          };
        function va() {
          return kt.value ? ht.value : St.value ? bt.value : wt.value;
        }
        function pa(e) {
          if ("string" != typeof e) return e;
          if (!/^\s*\{.*\}\s*$/.test(e) || !/'[^']+'?\s*:\s*'[^']*'/.test(e))
            return e;
          try {
            const t = e.replace(/'([^']*)'/g, '"$1"');
            return (JSON.parse(t), t);
          } catch (t) {
            return e;
          }
        }
        const da = x(() => {
            const e = {};
            return (
              Rt.value.forEach((t) => {
                if (
                  (t.options && (e[t.column] = I(t.options)),
                  "geo" === t.column &&
                    t.valueOptions &&
                    (e.geoSub = I(t.valueOptions)),
                  ["hardwareConcurrency", "deviceMemory"].includes(t.column))
                ) {
                  let a = n.cloneDeep(t.options);
                  (a.push({
                    value: "truth",
                    label: tt("env.env.req.fontTruth"),
                  }),
                    (e[t.column] = I(a)));
                }
              }),
              e
            );
          }),
          fa = u(),
          ma = x(() => {
            var e, t, a, o, r, i;
            return {
              ...(null == (e = vt.value) ? void 0 : e.urlsRules),
              ...(xt.value
                ? null == (t = ea.value)
                  ? void 0
                  : t.rules
                : null == (a = ta.value)
                  ? void 0
                  : a.proxyRules),
              ...(null == (o = ea.value) ? void 0 : o.rules),
              ...(null == (r = aa.value) ? void 0 : r.fingerprintRules),
              name: [{ required: !0, message: tt("env.env.req.nameRule") }],
              importFileData: [
                {
                  validator: (e, t, a) => {
                    const o = va();
                    if (o.row.fileType === ne.SOCIAL_MEDIA_TEMPLATE) {
                      const e = ce(o.socialMediaImportDraft ?? se());
                      return void a(
                        e.length
                          ? new Error(tt(`env.env.import.validation.${e[0]}`))
                          : void 0,
                      );
                    }
                    a(t ? void 0 : new Error(tt("env.env.req.fileHolder")));
                  },
                  trigger: "change",
                },
              ],
              createNum: [
                { required: !0, message: tt("env.env.req.createNumHolder") },
              ],
              prefixName: [
                { required: !0, message: tt("env.env.req.prefixNameHolder") },
              ],
              groupIds: [
                { required: !0, message: tt("env.env.req.groupIdRule") },
              ],
              browserVersionId: [
                {
                  required: fa.browserList.length > 1,
                  message: tt("update.tip24"),
                  trigger: "change",
                },
              ],
              os: [
                {
                  validator: (e, t, a) => {
                    var o, r, i, n, l;
                    t &&
                    ((null == (o = t.windows) ? void 0 : o.length) ||
                      (null == (r = t.mac) ? void 0 : r.length) ||
                      (null == (i = t.android) ? void 0 : i.length) ||
                      (null == (n = t.ios) ? void 0 : n.length) ||
                      (null == (l = t.linux) ? void 0 : l.length))
                      ? a()
                      : a(new Error(tt("env.env.req.osRule1")));
                  },
                },
              ],
              uaType: [
                {
                  trigger: "change",
                  validator: (e, t, a) => {
                    var o, r;
                    Et.value
                      ? 0 !==
                        (null == (r = null == (o = va()) ? void 0 : o.uaTypeArr)
                          ? void 0
                          : r.length)
                        ? a()
                        : a(new Error(tt("env.env.req.uaTypeRule")))
                      : a();
                  },
                },
              ],
              ua: [
                {
                  required: !0,
                  validator: (e, t, a) => {
                    if (!Et.value && "random" === va().row.uaCreateType)
                      return void a();
                    let o = va();
                    o.row.ua
                      ? Ft.test(o.row.ua)
                        ? a()
                        : a(new Error(tt("env.env.req.uaRule2")))
                      : a(new Error(tt("env.env.req.uaRule")));
                  },
                },
              ],
              cookie: [
                {
                  validator: (e, t, a) => {
                    if (!t) return void a();
                    const o = va().row.accountList || [];
                    if (
                      t.startsWith("[") ||
                      t.startsWith("{") ||
                      t.endsWith("]") ||
                      t.endsWith("}")
                    )
                      try {
                        let e = pa(t);
                        const r = JSON.parse(e);
                        if (j(r))
                          return (
                            (va().row.cookie = va().row.cookie.replace(
                              /'/g,
                              '"',
                            )),
                            (null == r
                              ? void 0
                              : r.hasOwnProperty("host_key")) ||
                            (0 !== o.length && o.some((e) => e.platform))
                              ? void a()
                              : void a(new Error(tt("envV2.cookieRuleErr")))
                          );
                        if (!Array.isArray(r))
                          return a(new Error(tt("envV2.tip31")));
                        a();
                      } catch (r) {
                        (console.log(r, "21312312"),
                          a(new Error(tt("env.env.req.cookieRule"))));
                      }
                    else
                      try {
                        const e = t
                          .split(";")
                          .map((e) => e.trim())
                          .filter((e) => e);
                        if (0 === e.length)
                          return void a(
                            new Error(tt("env.env.req.correctFormatCookie")),
                          );
                        for (const t of e) {
                          if (!t.includes("="))
                            return void a(
                              new Error(tt("env.env.req.correctFormatCookie")),
                            );
                          const [e, ...o] = t.split("=");
                          o.join("=").trim();
                          if (!e.trim())
                            return void a(
                              new Error(tt("env.env.req.correctFormatCookie")),
                            );
                        }
                        if (0 === o.length || !o.some((e) => e.platform))
                          return void a(
                            new Error(tt("env.env.req.associationRules")),
                          );
                        a();
                      } catch {
                        a(new Error(tt("env.env.req.correctFormatCookie")));
                      }
                  },
                },
              ],
              otherCookie: [
                {
                  validator: (e, t, a) => {
                    if (!t) return void a();
                    const o = va().row.accountList || [];
                    if (
                      t.startsWith("[") ||
                      t.startsWith("{") ||
                      t.endsWith("]") ||
                      t.endsWith("}")
                    )
                      try {
                        let e = pa(t);
                        const r = JSON.parse(e);
                        if (j(r))
                          return (
                            (va().row.otherCookie =
                              va().row.otherCookie.replace(/'/g, '"')),
                            (null == r
                              ? void 0
                              : r.hasOwnProperty("host_key")) ||
                            (0 !== o.length && o.some((e) => e.platform))
                              ? void a()
                              : void a(new Error(tt("envV2.cookieRuleErr")))
                          );
                        if (!Array.isArray(r))
                          return a(new Error(tt("envV2.tip31")));
                        a();
                      } catch (r) {
                        a(new Error(tt("env.env.req.cookieRule")));
                      }
                    else
                      try {
                        const e = t
                          .split(";")
                          .map((e) => e.trim())
                          .filter((e) => e);
                        if (0 === e.length)
                          return void a(
                            new Error(tt("env.env.req.correctFormatCookie")),
                          );
                        for (const t of e) {
                          if (!t.includes("="))
                            return void a(
                              new Error(tt("env.env.req.correctFormatCookie")),
                            );
                          const [e, ...o] = t.split("="),
                            r = o.join("=").trim();
                          if (!e.trim() || void 0 === r)
                            return void a(
                              new Error(tt("env.env.req.correctFormatCookie")),
                            );
                        }
                        if (0 === o.length || !o.some((e) => e.platform))
                          return void a(
                            new Error(tt("env.env.req.associationRules")),
                          );
                        a();
                      } catch {
                        a(new Error(tt("env.env.req.correctFormatCookie")));
                      }
                  },
                },
              ],
              extensionsGroupId: [{ required: !0, message: tt("expan.tip46") }],
              "extend.acceptLang": [
                {
                  validator: (e, t, a) => {
                    "custom" === ra.value.acceptLangType &&
                    H(ra.value.acceptLangValue)
                      ? a(new Error(tt("env.env.req.acceptLangRule")))
                      : a();
                  },
                },
              ],
              "extend.geo": [
                {
                  validator: (e, t, a) => {
                    var o, r, i;
                    if (
                      "custom" !== ra.value.geoSubType ||
                      "disable" === ra.value.geoType
                    )
                      return void a();
                    const n = ra.value.geoValue;
                    H(n.longitude) || H(n.latitude) || H(n.accuracy)
                      ? a(new Error(tt("env.env.req.geoRule1")))
                      : !n.longitude ||
                          Pt.test(
                            null == (o = n.longitude) ? void 0 : o.toString(),
                          )
                        ? !n.latitude ||
                          Pt.test(
                            null == (r = n.latitude) ? void 0 : r.toString(),
                          )
                          ? !n.accuracy ||
                            Mt.test(
                              null == (i = n.accuracy) ? void 0 : i.toString(),
                            )
                            ? a()
                            : a(new Error(tt("env.env.req.geoRule4")))
                          : a(new Error(tt("env.env.req.geoRule3")))
                        : a(new Error(tt("env.env.req.geoRule2")));
                  },
                  trigger: "change",
                },
              ],
              "extend.webrtcValue": [
                {
                  validator: (e, t, a) => {
                    if (
                      (console.log(ra.value, "targetExtendConfig.value"),
                      ra.value.webrtcSyncProxyIpFlag)
                    )
                      return void a();
                    if (ra.value.webrtcUseRandomInternalIp) return void a();
                    if ("replace" !== ra.value.webrtcType) return void a();
                    const o = ra.value.webrtcValue;
                    o
                      ? !o || $t.test(o)
                        ? a()
                        : a(new Error(tt("env.env.req.webrtcRule2")))
                      : a(new Error(tt("env.env.req.webrtcRule1")));
                  },
                  trigger: "blur",
                },
              ],
              "extend.ratio": [
                {
                  validator: (e, t, a) => {
                    "custom" !== ra.value.ratioType ||
                    "custom" !== ra.value.ratioValue ||
                    (ra.value.ratioWidth && ra.value.ratioHeight)
                      ? a()
                      : a(tt("env.env.req.ratioInputPlaceholder"));
                  },
                },
              ],
              "extend.windowRatio": [
                {
                  validator: (e, t, a) => {
                    "custom" !== ra.value.windowRatioType ||
                    "custom" !== ra.value.windowRatioValue ||
                    (ra.value.windowWidth && ra.value.windowHeight)
                      ? a()
                      : a(tt("env.env.req.ratioInputPlaceholder"));
                  },
                },
              ],
              "extend.port": [
                {
                  validator: (e, t, a) => {
                    "1" !== ra.value.portType ||
                    !ra.value.portValue ||
                    ((ra.value.portValue = ra.value.portValue
                      .replace("，", ",")
                      .replace(/\s/g, "")
                      .replace(/[^0-9, ]/g, "")),
                    ra.value.portValue
                      .split(",")
                      .every((e) => Number(e) >= 1 && Number(e) <= 65535))
                      ? a()
                      : a(tt("env.env.req.portRule"));
                  },
                  trigger: "blur",
                },
              ],
              "extend.webglRender": [
                {
                  validator: (e, t, a) => {
                    "custom" !== ra.value.webGLMetadataType ||
                    ra.value.webglRender
                      ? a()
                      : a(tt("env.env.req.webglRenderRule"));
                  },
                  trigger: "change",
                },
              ],
              "extend.webglManufacturer": [
                {
                  validator: (e, t, a) => {
                    "custom" !== ra.value.webGLMetadataType ||
                    ra.value.webglManufacturer
                      ? a()
                      : a(tt("env.env.req.webglManufacturerRule"));
                  },
                  trigger: "change",
                },
              ],
              "envDataSync.roleIds": [
                {
                  required:
                    null == (i = va().row.envDataSync) ? void 0 : i.status,
                  message: tt("setting.versionLimitTip12"),
                },
              ],
            };
          }),
          ya = x(() => va().row.accountList || []);
        c(
          ya,
          (e) => {
            if (Ea.value) {
              const t = e.some((e) => e.platform),
                a = e.every((e) => void 0 === e.platform);
              if (!(t || a)) return;
              Ea.value.validateField(["cookie", "otherCookie"], (e) => {
                e || console.log("校验失败");
              });
            }
          },
          { deep: !0 },
        );
        const ga = async () => {
            const e = await Ce({ all: !0, detail: !1 });
            ((jt.value = e.list.map((e) => ({ value: e.id, label: e.name }))),
              wt.value.row.groupIds || (wt.value.row.groupIds = [e.list[0].id]),
              ht.value.row.groupIds || (ht.value.row.groupIds = [e.list[0].id]),
              bt.value.row.groupIds || (bt.value.row.groupIds = [e.list[0].id]),
              wt.value.row.groups &&
                wt.value.row.groups.length &&
                wt.value.row.groups.forEach((e) => {
                  jt.value.find((t) => t.value === e.id) ||
                    jt.value.push({ value: e.id, label: e.name });
                }));
          },
          wa = () => {
            const e = window.innerWidth;
            dt.value = e < 1e3 ? "1000px" : e - 210 + "px";
          };
        function ha(e, t) {
          let a = n.cloneDeep(e);
          return (
            (a.row.uaCreateType = "random"),
            t
              ? ((a.row.importFileData = void 0),
                (a.row.fileType = ne.DIC_EXCEL_TEMPLATE),
                (a.row.fileTypeValue = ne.ADS_EXCEL_TEMPLATE))
              : ((a.row.createNum = 10), (a.row.prefixName = "")),
            (a.row.proxyOwnType = "random"),
            a
          );
        }
        const ba = () => wa();
        (c(
          () => ft.value,
          (e) => {
            e
              ? window.addEventListener("resize", ba)
              : window.removeEventListener("resize", ba);
          },
        ),
          v(() => {
            (window.removeEventListener("resize", ba), sa.destroy());
          }));
        let Ta = x(() => o().kelConfigList);
        const Ca = (e) => {
            const t = [],
              a = e
                .split(";")
                .map((e) => e.trim())
                .filter((e) => e),
              o = va().row.accountList || [],
              r = ke().add(1, "month").unix();
            if (0 === o.length) return t;
            if (o.some((e) => void 0 !== e.platform && null !== e.platform))
              return (
                o.forEach((e) => {
                  var o;
                  if (!e.platform) return;
                  let i;
                  if ("other" === e.platform)
                    try {
                      const t = new URL(e.url);
                      i = "." + t.hostname;
                    } catch (n) {
                      return void console.error("Invalid account.url:", e.url);
                    }
                  else
                    i = (null == (o = e.platform) ? void 0 : o.startsWith("."))
                      ? e.platform
                      : "." + e.platform;
                  a.forEach((a) => {
                    const [o, ...n] = a.split("="),
                      l = n.join("=").trim();
                    if (void 0 === l) return;
                    let s =
                      Ta.value.some((t) => {
                        var a;
                        return null ==
                          (a = "other" == e.platform ? e.url : e.platform)
                          ? void 0
                          : a.includes(t);
                      }) && o.startsWith("__");
                    t.push({
                      entryId: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                      name: o,
                      value: l,
                      domain: s ? i.replace(/^\./, "") : i,
                      path: "/",
                      httpOnly: !1,
                      hostOnly: !1,
                      session: !1,
                      secure: s,
                      url: `http://${i.slice(1)}/`,
                      expirationDate: r,
                    });
                  });
                }),
                console.log(t, "cookies"),
                t
              );
            q.error(tt("env.env.req.associationRules"));
          },
          Ea = i(),
          ka = async () => {
            var e, t, a, o, r, i, s, u, c, v, p, d, f, m, y, g, w;
            xt.value
              ? await (null == (e = ea.value) ? void 0 : e.getIpProxyInfo())
              : await (null == (t = ta.value) ? void 0 : t.getIpProxyInfo());
            const h = xt.value
                ? await (null == (a = ea.value)
                    ? void 0
                    : a.validateParaturbo())
                : await (null == (o = ta.value)
                    ? void 0
                    : o.validateParaturbo()),
              [b] = await A(Ea.value.validate()),
              [T] = await A(ta.value.validateAccountList()),
              [C] = await A(vt.value.validateUrlsList()),
              [E] = await A(ta.value.validateSocialMediaImport());
            if ("FILE_READ_PENDING" === (null == E ? void 0 : E.message))
              return q.warning(tt("env.env.import.fileReadPending"));
            if (!1 === h || b || T || C || E)
              return (
                N(async () => {
                  await B(200);
                  const e = document.querySelectorAll(".el-form-item__error");
                  if (null == e ? void 0 : e.length) {
                    const t = e[0],
                      a = P(t, "el-collapse-item");
                    if (a && !a.classList.contains("is-active")) {
                      const e = a.querySelector("button");
                      e && (e.click(), await B(200));
                    }
                    t.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                      inline: "center",
                    });
                  }
                }),
                q.warning(tt("env.env.req.pleaseCheck"))
              );
            if (!Xt.value) {
              Xt.value = !0;
              try {
                vt.value.mergeURLs();
                const e = await M(n.cloneDeep(va().row), Lt.value);
                (Reflect.set(
                  e,
                  "proxySelectWay",
                  null == (r = e.proxyOwnType) ? void 0 : r.toUpperCase(),
                ),
                  e.proxyWay !== F.FROM_API ||
                    (null == (i = e.proxyApiInfo) ? void 0 : i.ip) ||
                    (await $(e)));
                const t = e.importFileData;
                if (e.os) {
                  const t = {};
                  (Object.keys(e.os).forEach((a) => {
                    Reflect.set(
                      t,
                      a.toLocaleLowerCase(),
                      Reflect.get(e.os || {}, a),
                    );
                  }),
                    (e.os = t));
                }
                !Et.value &&
                  e.uaCreateType &&
                  "random" == e.uaCreateType &&
                  (e.ua = "");
                const a = Nt.row.cookie === e.cookie && !e.otherCookie;
                if (e.cookie || e.otherCookie) {
                  const t = {};
                  if (e.cookie) {
                    let a;
                    try {
                      let t = JSON.parse(e.cookie);
                      if (j(t)) t = [t];
                      else if (!Array.isArray(t))
                        throw new Error(tt("envV2.tip31"));
                      if (t.find((e) => e.domain)) a = G(t);
                      else if (
                        1 === t.length &&
                        t[0] &&
                        !(null == (s = t[0])
                          ? void 0
                          : s.hasOwnProperty("host_key"))
                      ) {
                        let e = n.map(t[0], (e, t) => ({ name: t, value: e }));
                        a = U(e, va().row.accountList || [], Ta.value);
                      } else a = t;
                    } catch {
                      a = Ca(e.cookie);
                    }
                    a.forEach((e) => {
                      const a =
                        e.entryId || `${e.host_key}|${e.path}|${e.name}`;
                      t[a] = e;
                    });
                  }
                  if (e.otherCookie) {
                    let a;
                    try {
                      let t = JSON.parse(e.otherCookie);
                      if ((j(t) && (t = [t]), !Array.isArray(t)))
                        throw new Error(tt("envV2.tip31"));
                      if (t.find((e) => e.domain)) a = G(t);
                      else if (
                        1 === t.length &&
                        t[0] &&
                        !(null == (u = t[0])
                          ? void 0
                          : u.hasOwnProperty("host_key"))
                      ) {
                        let e = n.map(t[0], (e, t) => ({ name: t, value: e }));
                        a = U(e, va().row.accountList || [], Ta.value);
                      } else a = t;
                    } catch {
                      a = Ca(e.otherCookie);
                    }
                    a.forEach((e) => {
                      const a =
                        e.entryId || `${e.host_key}|${e.path}|${e.name}`;
                      t[a] = e;
                    });
                  }
                  const a = Object.keys(t).map((e) => t[e]);
                  if (a.length) {
                    const t = a.map((e) => W(e));
                    ((e.cookie = JSON.stringify(J(t))), (e.otherCookie = null));
                  }
                }
                ((e.dataConfig = JSON.stringify({
                  ...(e.dataType === K.GLOBAL
                    ? { type: 0 }
                    : {
                        type:
                          (null == (c = null == e ? void 0 : e.dataConfigOption)
                            ? void 0
                            : c.reduce((e, t) => e + t, 0)) ?? 0,
                      }),
                  dataType: e.dataType,
                })),
                  (e.browserConfig = JSON.stringify({
                    ...(e.browserType === K.GLOBAL
                      ? { type: 0 }
                      : {
                          type:
                            (null ==
                            (v = null == e ? void 0 : e.browserConfigOption)
                              ? void 0
                              : v.reduce((e, t) => e + t, 0)) ?? 0,
                        }),
                    browserType: e.browserType,
                  })),
                  (e.envDataSync = JSON.stringify(e.envDataSync)),
                  e.localDataConfig &&
                    (2 === e.localDataConfig.type &&
                    e.localDataConfig.browserType === K.CUSTOM
                      ? (Array.isArray(e.localDataConfig.dataType) ||
                          (e.localDataConfig.dataType = []),
                        (e.localDataConfig.dataType =
                          e.localDataConfig.dataType.reduce(
                            (e, t) => e + t,
                            0,
                          )))
                      : (e.localDataConfig.dataType = null),
                    (e.localDataConfig = JSON.stringify(e.localDataConfig))),
                  (e.bookmarkConfig = JSON.stringify(e.bookmarkConfigVal)),
                  (e.accessLimitConfig = JSON.stringify(
                    z(e.accessLimitConfigVal),
                  )));
                const o = await (null == (p = aa.value)
                  ? void 0
                  : p.handleExtendConfig());
                e.config = JSON.stringify(o);
                let h = JSON.parse(JSON.stringify(e));
                if (
                  (delete h.localDataType,
                  delete h.uaCreateType,
                  delete h.proxyOwnType,
                  delete h.importFileData,
                  delete h.fileTypeValue,
                  delete h.fileType,
                  (h.urls = h.urls.filter((e) => e)),
                  (h.accountList = (h.accountList ?? []).filter(
                    (e) => !!e && Object.values(e).some((e) => !H(e)),
                  )),
                  h.id)
                ) {
                  X.api.trackEvent({
                    type: Z.ENV_CLICK,
                    action: Y.CLICK_EDIT_ENV,
                    params: { envId: h.id },
                  });
                  const e =
                      !1 ===
                      n.isEqual(
                        null == Nt ? void 0 : Nt.row,
                        n.cloneDeep(wt.value.row),
                      ),
                    t =
                      (null == h ? void 0 : h.browserVersionId) !==
                      (null == (d = null == Nt ? void 0 : Nt.row)
                        ? void 0
                        : d.browserVersionId);
                  if ((a && delete h.cookie, e)) {
                    if (
                      !(await ((e = !1) =>
                        new Promise((t) => {
                          Ee.confirm(
                            `\n    <div>\n      <p>${tt("env.env.editEnvTipSubTitle")}</p>\n      ${e ? `<p style="color: var(--warning-color); margin-top: 6px">${tt("env.env.editEnvBrowserTip")}</p>` : ""}\n    </div>\n  `,
                            tt("env.env.editEnvTipTitle"),
                            {
                              confirmButtonText: tt("base.confirm"),
                              cancelButtonText: tt("base.cancel"),
                              type: "warning",
                              dangerouslyUseHTMLString: !0,
                            },
                          )
                            .then(() => {
                              t(!0);
                            })
                            .catch(() => {
                              t(!1);
                            });
                        }))(t))
                    )
                      return;
                    await Q(h.id, h, !1);
                  } else await Q(h.id, h, !1);
                } else {
                  if (
                    (null == Tt ? void 0 : Tt.value.type) === ee.Free &&
                    [l.Batch, l.BulkImport].includes(Lt.value)
                  )
                    return void q.error(te().planTooltipContentText);
                  if (kt.value) {
                    if (
                      await ct({
                        cachedSummary: Ct.summary,
                        planLimit: te().currentPlanConfig.envLimit,
                        requestedCount: e.createNum ?? 0,
                        fetchLatestSummary: ae,
                      })
                    )
                      return void oe(
                        tt("env.env.createEvn.hint"),
                        tt("env.env.openLimit.btnText"),
                        re,
                      );
                    (X.api.trackEvent({
                      type: Z.ENV_CLICK,
                      action: Y.CLICK_CREATE_ENV,
                      params: { createType: "1" },
                    }),
                      await ie(h),
                      q({
                        type: "success",
                        message: tt("env.env.req.batchCreateEnvTip", [
                          e.createNum,
                        ]),
                        plain: !0,
                      }));
                  } else if (St.value) {
                    const a = va().socialMediaImportDraft;
                    let o = 0;
                    if (e.fileType === ne.SOCIAL_MEDIA_TEMPLATE)
                      o = le(a ?? se());
                    else {
                      let { data: a } = await Le(t);
                      if ("text/plain" === (null == t ? void 0 : t.type)) {
                        if (
                          ((e.fileType = ne.DIC_TXT_TEMPLATE),
                          (o = ue(a)),
                          0 == o)
                        )
                          return void q.warning(tt("setting.fileContentError"));
                      } else {
                        let e = a.filter((e) => e.length);
                        if (0 == e.length)
                          return void q.warning(tt("setting.fileContentError"));
                        o = e.length - 3;
                      }
                    }
                    if (
                      await ct({
                        cachedSummary: Ct.summary,
                        planLimit: te().currentPlanConfig.envLimit,
                        requestedCount: o,
                        fetchLatestSummary: ae,
                      })
                    )
                      return void oe(
                        tt("env.env.createEvn.hint"),
                        tt("env.env.openLimit.btnText"),
                        re,
                      );
                    let r, i, l;
                    if (e.fileType === ne.SOCIAL_MEDIA_TEMPLATE) {
                      const e = n.cloneDeep(
                          va().socialMediaImportDraft ?? se(),
                        ),
                        t = ce(e);
                      if (t.length)
                        return void q.warning(
                          tt(`env.env.import.validation.${t[0]}`),
                        );
                      const a = le(e);
                      if (a !== o) {
                        o = a;
                        if (
                          await ct({
                            cachedSummary: Ct.summary,
                            planLimit: te().currentPlanConfig.envLimit,
                            requestedCount: o,
                            fetchLatestSummary: ae,
                          })
                        )
                          return void oe(
                            tt("env.env.createEvn.hint"),
                            tt("env.env.openLimit.btnText"),
                            re,
                          );
                      }
                      r = ve(e, JSON.stringify(n.omit(h, ["importFileData"])));
                    }
                    if (
                      (null == (f = Yt.value) || f.showDialog(o),
                      e.fileType === ne.SOCIAL_MEDIA_TEMPLATE)
                    )
                      (X.api.trackEvent({
                        type: Z.ENV_CLICK,
                        action: Y.CLICK_BATCH_IMPORT_ENV,
                      }),
                        ([i, l] = await A(pe(r))));
                    else {
                      let a = {
                        file: t,
                        req: n.omit(h, ["importFileData"]),
                        fileType:
                          e.fileType === ne.OTHER
                            ? e.fileTypeValue
                            : e.fileType,
                      };
                      (X.api.trackEvent({
                        type: Z.ENV_CLICK,
                        action: Y.CLICK_BATCH_IMPORT_ENV,
                      }),
                        ([i, l] = await A(de(a))));
                    }
                    (null == (m = Yt.value) || m.closeDialog(),
                      i || null == (y = Zt.value) || y.showDialog(l));
                  } else {
                    X.api.trackEvent({
                      type: Z.ENV_CLICK,
                      action: Y.CLICK_CREATE_ENV,
                      params: { createType: "0" },
                    });
                    const t = await fe(h);
                    (0 === Ye.createCount.envCreateCount &&
                      (Ye.isFirstLogin = !1),
                      e.cookie &&
                        0 === t.code &&
                        "NEW_ENCRYPT" ===
                          (null == (g = t.data)
                            ? void 0
                            : g.cookieEncryptStatus) &&
                        (null == (w = t.data) ? void 0 : w.cookie) &&
                        it("convertEnv", t.data));
                  }
                }
                (St.value || (Va(), it("submit")),
                  xt.value || me.dispatch("getSummary"));
              } catch (k) {
                console.log(k);
              } finally {
                Xt.value = !1;
              }
            }
          };
        function Sa(e) {
          var t;
          e && (null == (t = Ea.value) || t.validateField(e));
        }
        const La = () => {
            var e;
            xt.value && na.value
              ? ye(
                  tt("proxy.proxy.dialog.fingerprintHint"),
                  async () => {
                    var e;
                    ((na.value = !1), null == (e = aa.value) || e.randomUa());
                  },
                  {
                    title: tt("proxy.proxy.dialog.hasEnvTitle"),
                    confirmText: tt("proxy.proxy.dialog.confirmSure"),
                    cancelText: tt("base.cancel"),
                  },
                )
              : null == (e = aa.value) || e.randomUa();
          },
          xa = () => {
            var e;
            null == (e = Ea.value) || e.validateField("extend.geo");
          },
          Da = (e) => {
            Qt.value = e;
          },
          Va = () => {
            ((ft.value = !1),
              setTimeout(() => {
                var e, t;
                (sa.destroy(),
                  null == (e = Ea.value) || e.clearValidate(),
                  null == (t = Ea.value) || t.resetFields(),
                  (wt.value = n.cloneDeep(gt)));
              }, 200));
          };
        function Oa(e) {
          (Va(), it("submit"));
          const t =
            null == e
              ? void 0
              : e.map((e) => {
                  if ("SUCCESS" === e.result) return e.id;
                });
          it("convertEnvByBatch", t);
        }
        async function Ia(e) {
          const t = [...(va().row.groupIds || [])];
          (t.push(e.id),
            (va().row.groupIds = t),
            await ga(),
            it("update:envGroup"));
        }
        (Se({
          acceptParams: async (e, t) => {
            ((la.value = { checked: !1, success: !1 }),
              (oa.value = !1),
              wa(),
              (xt.value = !!e.row.id),
              a().initFontData());
            const o = e.type;
            ((Qt.value = "Single" === o ? ["0"] : ["0", "1", "2", "3"]),
              "edit" === e.type
                ? ((Lt.value = l.Single),
                  (Ht.value = (null == e ? void 0 : e.isShare) ?? !1))
                : ((Lt.value = e.type), (Ht.value = !1)),
              (Nt = n.cloneDeep(e)));
            const r = Ye.personalPreference,
              i = n.cloneDeep(e);
            (r.row &&
              !xt.value &&
              (i.row = _(n.omitBy(r.row, n.isNull), e.row)),
              (i.row.uaOs = e.row.uaOs || ""));
            try {
              const e = JSON.parse(i.row.uaType || '["all"]');
              i.uaTypeArr = Array.isArray(e) ? e : [e];
            } catch (s) {
              i.uaTypeArr = ["all"];
            }
            if (xt.value || e.type === l.Single) {
              const t = (function (e = {}) {
                  var t, a;
                  const o = {
                      dataType: Je,
                      browserType: Je,
                      localDataType: Je,
                      bookmarkConfigVal: nt(),
                      accessLimitConfigVal: lt(),
                      restoreUrlType: "GLOBAL",
                      envMutilOpenType: "GLOBAL",
                      remoteInspectorType: "GLOBAL",
                    },
                    r = at(
                      null == (t = e.dataSyncConfig) ? void 0 : t.type,
                      je,
                    );
                  if (
                    (void 0 !== r && (o.dataConfigOption = r),
                    He(e.envDataSync) && (o.envDataSync = Xe(e.envDataSync)),
                    He(e.localDataConfig))
                  ) {
                    const t = Xe(e.localDataConfig),
                      a = at(t.dataType, Ge);
                    (void 0 !== a && (t.dataType = a), (o.localDataConfig = t));
                  }
                  const i = at(
                    null == (a = e.browserConfig) ? void 0 : a.type,
                    $e,
                  );
                  if (
                    (void 0 !== i && (o.browserConfigOption = i),
                    He(e.bookmarkConfig))
                  ) {
                    const t = e.bookmarkConfig;
                    if (
                      "string" != typeof t.bookmark ||
                      "" === t.bookmark.trim() ||
                      void 0 !== Qe(t.bookmark)
                    ) {
                      const e = Qe(t.bookmark);
                      o.bookmarkConfigVal = {
                        bookmarkType: Je,
                        status: "boolean" == typeof t.status && t.status,
                        type: "number" == typeof t.type ? t.type : 1,
                        fileName:
                          "string" == typeof (null == e ? void 0 : e.fileName)
                            ? e.fileName
                            : "",
                        fileContent: Array.isArray(
                          null == e ? void 0 : e.fileContent,
                        )
                          ? Xe(e.fileContent)
                          : [],
                        coverRule:
                          "number" == typeof t.coverRule ? t.coverRule : 1,
                      };
                    }
                  }
                  if (He(e.accessLimit)) {
                    const t = e.accessLimit,
                      a = at(t.quickSelectionType, [1]) ?? [],
                      r = a.includes(1) ? [Ue] : [];
                    o.accessLimitConfigVal = {
                      accessLimitType: Je,
                      status: "boolean" == typeof t.status && t.status,
                      type: "number" == typeof t.type ? t.type : 1,
                      quickSelectionOption: a,
                      quickSelectionType:
                        "number" == typeof t.quickSelectionType
                          ? t.quickSelectionType
                          : 0,
                      urlList: rt(t.urlList, r),
                    };
                  }
                  return o;
                })(Ye.orgConfigData),
                a = n.cloneDeep(Oe);
              if (xt.value) {
                const o = st(e.row, t),
                  r = n.omit(n.cloneDeep(e.row), [
                    "dataConfig",
                    "browserConfig",
                    "localDataConfig",
                    "bookmarkConfig",
                    "accessLimitConfig",
                    "envDataSync",
                    "dataType",
                    "dataConfigOption",
                    "browserType",
                    "browserConfigOption",
                    "localDataType",
                    "bookmarkConfigVal",
                    "accessLimitConfigVal",
                    "envDataSyncOption",
                  ]);
                wt.value = { ...e, row: Ze(a, t, r, o) };
              } else {
                const o = r.row
                  ? (function (e) {
                      if (!He(e)) return {};
                      const t = Xe(e);
                      (t.dataType === Je &&
                        (delete t.dataConfigOption, delete t.envDataSync),
                        t.browserType === Je && delete t.browserConfigOption);
                      const a = He(t.localDataConfig)
                        ? t.localDataConfig
                        : void 0;
                      (null == a ? void 0 : a.browserType) === Je
                        ? ((t.localDataType = Je), delete t.localDataConfig)
                        : t.localDataType === Je && delete t.localDataConfig;
                      const o = He(t.bookmarkConfigVal)
                        ? t.bookmarkConfigVal
                        : void 0;
                      (null == o ? void 0 : o.bookmarkType) === Je &&
                        delete t.bookmarkConfigVal;
                      const r = He(t.accessLimitConfigVal)
                        ? t.accessLimitConfigVal
                        : void 0;
                      return (
                        (null == r ? void 0 : r.accessLimitType) === Je &&
                          delete t.accessLimitConfigVal,
                        t
                      );
                    })(n.omitBy(r.row, n.isNull))
                  : void 0;
                wt.value = { ...e, row: Ze(a, e.row, t, o) };
              }
            } else wt.value = n.cloneDeep(i);
            xt.value && (oa.value = !0);
            try {
              const e = JSON.parse(wt.value.row.uaType || '["all"]');
              Array.isArray(e)
                ? (wt.value.uaTypeArr = e)
                : (wt.value.uaTypeArr = [e]);
            } catch (s) {
              wt.value.uaTypeArr = ["all"];
            }
            if (
              ((ht.value = ha(i, !1)),
              (bt.value = ha(i, !0)),
              (ht.value.row.proxySoftEnable = !1),
              (bt.value.row.proxySoftEnable = !1),
              ga(),
              e.row.config)
            ) {
              ((At.value = JSON.parse(e.row.config)),
                Ot.forEach((e) => {
                  "noise" === At.value[e + "Type"] &&
                    Reflect.set(It, e + "Noise", At.value[e + "Value"]);
                }),
                "random" === At.value.ratioType &&
                  ((At.value.ratioType = "custom"),
                  (At.value.ratioValue = "custom")));
              let t = va().row.uaOs;
              ("truth" === At.value.ratioType &&
                ["IOS", "ANDROID"].includes(t) &&
                ((At.value.ratioType = "custom"),
                (At.value.ratioValue = "custom")),
                "0" === At.value.portValue && (At.value.portValue = ""),
                At.value.windowRatioType ||
                  ((At.value.windowRatioType = "default"),
                  (At.value.windowRatioValue = "")));
            } else
              (Ot.forEach((e) => {
                "noise" === At.value[e + "Type"] && (It[e + "Noise"] = void 0);
              }),
                (At.value = _t(xt.value ? {} : (r.extendConfig ?? {}))),
                (qt.value = Dt(r.extendConfig ?? {})),
                (Bt.value = Dt(r.extendConfig ?? {})));
            ((ft.value = !0),
              N(() => {
                Nt = n.cloneDeep(wt.value);
              }),
              t && ca(t));
          },
        }),
          (() => {
            ((Ut.value = D(V)),
              (Wt.value = D(O, [s.Ssh, ...Ie(va().row.proxyType)])),
              (ia.value = {}),
              De.forEach((e) => {
                const t = I(e.options);
                ((t[`${e.value}-all`] = e.label),
                  (ia.value = { ...ia.value, ...t }));
              }),
              (Gt.value = [
                { value: "all", label: tt("env.env.req.allUaType") },
              ]),
              Ve.forEach((e) => {
                Gt.value.push({ value: `${e}`, label: `UA ${e}` });
              }),
              (Kt.value = []),
              ze.value.forEach((e) => {
                Kt.value.push({
                  value: e.value,
                  label:
                    "other" === e.value
                      ? tt("env.env.req.customPlatform")
                      : e.value,
                  logo: e.logo,
                });
              }));
            const e = [];
            (R.data.forEach((t) => {
              t.accept &&
                e.push({
                  label:
                    t["zh" === (null == et ? void 0 : et.value) ? "zh" : "en"],
                  value: t.code,
                });
            }),
              (zt.value = I(e)),
              Vt());
          })());
        const Ra = i([]);
        return (
          c(
            () => ft.value,
            (e) => {
              if (Et.value && !xt.value && !wt.value.row.name) {
                const e = ke().format("MMDD");
                wt.value.row.name = `profile-${e}${(() => {
                  let e;
                  Ra.value.length >= 999 && Ra.value.shift();
                  do {
                    e = (Math.floor(999 * Math.random()) + 1)
                      .toString()
                      .padStart(3, "0");
                  } while (Ra.value.includes(e));
                  return (Ra.value.push(e), e);
                })()}`;
              }
            },
          ),
          p(() => {
            c(
              () => ra.value.acceptLangValue,
              () => {
                Ea.value && Ea.value.validateField("extend.acceptLang");
              },
              { deep: !0 },
            );
          }),
          c(
            () => ft.value,
            (e) => {
              e || (Qt.value = ["0"]);
            },
          ),
          (e, t) => {
            const a = d("el-collapse-item"),
              o = d("el-collapse"),
              r = d("el-form"),
              i = d("el-button"),
              n = d("el-drawer"),
              l = f("prevent-label-click");
            return (
              m(),
              y(
                g,
                null,
                [
                  w(
                    n,
                    {
                      modelValue: ft.value,
                      "onUpdate:modelValue":
                        t[6] || (t[6] = (e) => (ft.value = e)),
                      close: Va,
                      "close-on-press-escape": !1,
                      "destroy-on-close": !0,
                      size: "100%",
                      title: h(tt)(wt.value.title),
                      class: "envV2Edit-drawer",
                    },
                    {
                      default: b(() => [
                        w(
                          Re,
                          {
                            isEdit: xt.value,
                            isBulkImport: h(St),
                            isBatch: h(kt),
                            onCloseDrawer:
                              t[5] || (t[5] = (e) => (ft.value = !1)),
                            onRefreshFingerprint: ua,
                          },
                          {
                            left: b(() => [
                              k(
                                (m(),
                                S(
                                  r,
                                  {
                                    ref_key: "formRef",
                                    ref: Ea,
                                    disabled: wt.value.isView || Xt.value,
                                    "hide-required-asterisk": wt.value.isView,
                                    "label-width": yt.value,
                                    model: h(kt)
                                      ? ht.value.row
                                      : h(St)
                                        ? bt.value.row
                                        : wt.value.row,
                                    rules: ma.value,
                                    "inline-message": "",
                                    "validate-on-rule-change": !1,
                                    class: "envEditV2Form",
                                    "label-position": "right",
                                  },
                                  {
                                    default: b(() => [
                                      w(
                                        o,
                                        {
                                          id: "envEditV2Collapse",
                                          modelValue: Qt.value,
                                          "onUpdate:modelValue":
                                            t[4] ||
                                            (t[4] = (e) => (Qt.value = e)),
                                          onChange: Da,
                                        },
                                        {
                                          default: b(() => [
                                            w(
                                              a,
                                              {
                                                id: Ke[0],
                                                title: e.$t(
                                                  "env.env.step.basic1",
                                                ),
                                                name: "0",
                                              },
                                              {
                                                default: b(() => [
                                                  w(
                                                    _e,
                                                    {
                                                      ref_key:
                                                        "envEditBasicFormV2Ref",
                                                      ref: ta,
                                                      formRef: Ea.value,
                                                      modelValue: wt.value,
                                                      "onUpdate:modelValue":
                                                        t[0] ||
                                                        (t[0] = (e) =>
                                                          (wt.value = e)),
                                                      batchData: ht.value,
                                                      envGroupOptions: jt.value,
                                                      importData: bt.value,
                                                      "is-Batch": h(kt),
                                                      "is-edit": xt.value,
                                                      "is-share": Ht.value,
                                                      isBulkImport: h(St),
                                                      isSingle: h(Et),
                                                      "label-width": yt.value,
                                                      uaTypeOptions: Gt.value,
                                                      onCheckStep: Sa,
                                                      onUpdateEnvGroup: Ia,
                                                    },
                                                    null,
                                                    8,
                                                    [
                                                      "formRef",
                                                      "modelValue",
                                                      "batchData",
                                                      "envGroupOptions",
                                                      "importData",
                                                      "is-Batch",
                                                      "is-edit",
                                                      "is-share",
                                                      "isBulkImport",
                                                      "isSingle",
                                                      "label-width",
                                                      "uaTypeOptions",
                                                    ],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["id", "title"],
                                            ),
                                            xt.value || h(St) || h(kt)
                                              ? (m(),
                                                S(
                                                  a,
                                                  {
                                                    key: 0,
                                                    id: Ke[3],
                                                    title:
                                                      e.$t(
                                                        "env.env.step.proxy",
                                                      ),
                                                    name: "3",
                                                  },
                                                  {
                                                    default: b(() => [
                                                      w(
                                                        Ne,
                                                        {
                                                          ref_key:
                                                            "envEditProxyFormRef",
                                                          ref: ea,
                                                          modelValue:
                                                            wt.value.row,
                                                          "onUpdate:modelValue":
                                                            t[1] ||
                                                            (t[1] = (e) =>
                                                              (wt.value.row =
                                                                e)),
                                                          batchData:
                                                            ht.value.row,
                                                          importData:
                                                            bt.value.row,
                                                          "is-batch": !!h(kt),
                                                          "is-edit": xt.value,
                                                          "is-share": Ht.value,
                                                          isBulkImport: h(St),
                                                          isEnvEditV2: !0,
                                                          isSingle: h(Et),
                                                          "label-width":
                                                            yt.value,
                                                          proxyListMap:
                                                            Jt.value,
                                                          proxyTypeOptions:
                                                            Wt.value,
                                                          proxyWayOptions:
                                                            Ut.value,
                                                        },
                                                        null,
                                                        8,
                                                        [
                                                          "modelValue",
                                                          "batchData",
                                                          "importData",
                                                          "is-batch",
                                                          "is-edit",
                                                          "is-share",
                                                          "isBulkImport",
                                                          "isSingle",
                                                          "label-width",
                                                          "proxyListMap",
                                                          "proxyTypeOptions",
                                                          "proxyWayOptions",
                                                        ],
                                                      ),
                                                    ]),
                                                    _: 1,
                                                  },
                                                  8,
                                                  ["id", "title"],
                                                ))
                                              : L("", !0),
                                            w(
                                              a,
                                              {
                                                id: Ke[1],
                                                title: e.$t(
                                                  "env.env.step.fingerprint1",
                                                ),
                                                name: "1",
                                              },
                                              {
                                                default: b(() => [
                                                  w(
                                                    Ae,
                                                    {
                                                      ref_key:
                                                        "envFingerprintFormV2Ref",
                                                      ref: aa,
                                                      modelValue: wt.value,
                                                      "onUpdate:modelValue":
                                                        t[2] ||
                                                        (t[2] = (e) =>
                                                          (wt.value = e)),
                                                      batchData: ht.value,
                                                      batchExtendConfig:
                                                        qt.value,
                                                      envGroupOptions: jt.value,
                                                      "extend-config": At.value,
                                                      importData: bt.value,
                                                      importExtendConfig:
                                                        Bt.value,
                                                      "is-Batch": h(kt),
                                                      "is-edit": xt.value,
                                                      "is-share": Ht.value,
                                                      isBulkImport: h(St),
                                                      isMore: !0,
                                                      isShowAll: !0,
                                                      isSingle: h(Et),
                                                      uaTypeOptions: Gt.value,
                                                      noAutoebGLMetadata:
                                                        oa.value,
                                                      formRef: Ea.value,
                                                      onBlurGeo: xa,
                                                    },
                                                    null,
                                                    8,
                                                    [
                                                      "modelValue",
                                                      "batchData",
                                                      "batchExtendConfig",
                                                      "envGroupOptions",
                                                      "extend-config",
                                                      "importData",
                                                      "importExtendConfig",
                                                      "is-Batch",
                                                      "is-edit",
                                                      "is-share",
                                                      "isBulkImport",
                                                      "isSingle",
                                                      "uaTypeOptions",
                                                      "noAutoebGLMetadata",
                                                      "formRef",
                                                    ],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["id", "title"],
                                            ),
                                            w(
                                              a,
                                              {
                                                id: Ke[2],
                                                title: e.$t(
                                                  "env.env.step.extend",
                                                ),
                                                name: "2",
                                              },
                                              {
                                                default: b(() => [
                                                  w(
                                                    qe,
                                                    {
                                                      ref_key: "envSeniorV2Ref",
                                                      ref: vt,
                                                      modelValue: wt.value.row,
                                                      "onUpdate:modelValue":
                                                        t[3] ||
                                                        (t[3] = (e) =>
                                                          (wt.value.row = e)),
                                                      batchData: ht.value.row,
                                                      importData: bt.value.row,
                                                      "is-share": Ht.value,
                                                      isBatch: h(kt),
                                                      isBulkImport: h(St),
                                                      isEdit: xt.value,
                                                      isSingle: h(Et),
                                                      onCheckStep: Sa,
                                                    },
                                                    null,
                                                    8,
                                                    [
                                                      "modelValue",
                                                      "batchData",
                                                      "importData",
                                                      "is-share",
                                                      "isBatch",
                                                      "isBulkImport",
                                                      "isEdit",
                                                      "isSingle",
                                                    ],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["id", "title"],
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["modelValue"],
                                      ),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  [
                                    "disabled",
                                    "hide-required-asterisk",
                                    "label-width",
                                    "model",
                                    "rules",
                                  ],
                                )),
                                [[l]],
                              ),
                            ]),
                            right: b(() => [
                              w(
                                Be,
                                {
                                  ref_key: "envConfigPreviewRef",
                                  ref: mt,
                                  acceptLangMap: zt.value,
                                  batchDrawerProps: ht.value.row,
                                  batchDrawerPropsRow: ht.value.row,
                                  batchExtendConfig: qt.value,
                                  "drawer-props": wt.value.row,
                                  "extend-config": At.value,
                                  extendConfigOptionTrans: da.value,
                                  importDrawerPropsRow: bt.value.row,
                                  importExtendConfig: Bt.value,
                                  isBatch: h(kt),
                                  isBulkImport: h(St),
                                  isSingle: h(Et),
                                  "show-title": !1,
                                  "class-name":
                                    "!tw-w-full !tw-p-[0px] !tw-rounded-none !tw-border-none",
                                  onOpenNewFingerprint: La,
                                },
                                null,
                                8,
                                [
                                  "acceptLangMap",
                                  "batchDrawerProps",
                                  "batchDrawerPropsRow",
                                  "batchExtendConfig",
                                  "drawer-props",
                                  "extend-config",
                                  "extendConfigOptionTrans",
                                  "importDrawerPropsRow",
                                  "importExtendConfig",
                                  "isBatch",
                                  "isBulkImport",
                                  "isSingle",
                                ],
                              ),
                            ]),
                            footer: b(() => [
                              T("div", pt, [
                                w(
                                  i,
                                  { type: "info", onClick: Va },
                                  {
                                    default: b(() => [
                                      C(E(e.$t("base.cancel")), 1),
                                    ]),
                                    _: 1,
                                  },
                                ),
                                w(
                                  i,
                                  {
                                    type: "primary",
                                    onClick: ka,
                                    loading: Xt.value,
                                  },
                                  {
                                    default: b(() => [
                                      C(E(e.$t("base.confirm")), 1),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["loading"],
                                ),
                              ]),
                            ]),
                            _: 1,
                          },
                          8,
                          ["isEdit", "isBulkImport", "isBatch"],
                        ),
                      ]),
                      _: 1,
                    },
                    8,
                    ["modelValue", "title"],
                  ),
                  w(Me, { ref_key: "uploadStateBoxRef", ref: Yt }, null, 512),
                  w(
                    Pe,
                    { ref_key: "uploadResTableRef", ref: Zt, onClose: Oa },
                    null,
                    512,
                  ),
                ],
                64,
              )
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-f09dac39"]],
  ),
  ft = Object.freeze(
    Object.defineProperty(
      { __proto__: null, default: dt },
      Symbol.toStringTag,
      { value: "Module" },
    ),
  );
export { dt as E, vt as c, ft as i };
