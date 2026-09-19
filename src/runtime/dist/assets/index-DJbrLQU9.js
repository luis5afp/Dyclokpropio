import {
  cx as e,
  fK as t,
  kO as l,
  c2 as a,
  kP as i,
  cn as o,
  cm as n,
  kQ as s,
  kR as r,
  kS as u,
  kT as d,
  aB as p,
  kU as c,
  d as m,
  aQ as f,
  cs as g,
  aW as v,
  hQ as b,
  v as C,
  gz as w,
  bP as y,
  G as x,
  ad as L,
  i as k,
  bQ as h,
  at as _,
  V,
  W as S,
  P as O,
  m as T,
  as as E,
  dS as D,
  dV as N,
  dW as I,
  ct as $,
  kV as R,
  kW as A,
  ac as U,
  kX as q,
  kY as B,
  ag as F,
  r as G,
  q as P,
  x as M,
  o as j,
  c as z,
  a as W,
  b as H,
  w as K,
  F as Y,
  z as J,
  f as Q,
  h as X,
  t as Z,
  iI as ee,
  de as te,
  df as le,
  dg as ae,
  e as ie,
  X as oe,
  aq as ne,
  di as se,
  O as re,
  e4 as ue,
  dX as de,
  C as pe,
  I as ce,
  D as me,
  ao as fe,
  dk as ge,
  iL as ve,
  kZ as be,
  E as Ce,
  A as we,
  dl as ye,
  dm as xe,
  dp as Le,
  a3 as ke,
  a1 as he,
  s as _e,
  L as Ve,
  dq as Se,
  k_ as Oe,
  k$ as Te,
  a5 as Ee,
  l0 as De,
  eB as Ne,
  eC as Ie,
  g1 as $e,
  h0 as Re,
  dj as Ae,
  aS as Ue,
  fe as qe,
  _ as Be,
} from "./index-BUIbb6Pa.js";
import { g as Fe } from "./system-DtbAsiCM.js";
import { _ as Ge } from "./VersionLimit.vue_vue_type_style_index_0_lang-C11Eho2N.js";
import { _ as Pe } from "./index.vue_vue_type_script_setup_true_lang-CIPUEjpB.js";
import { T as Me, i as je, a as ze } from "./TableFieldDialog-BI1BUo05.js";
import We from "./oneWaySync-C7I0Josw.js";
import { S as He } from "./useFetchTable-DUveM-tP.js";
import Ke from "./doubleCheckSafetyProtectionDialog-DboYwbiE.js";
import { _ as Ye } from "./ConfigItemTooltip.vue_vue_type_script_setup_true_lang-CQAwO164.js";
import { u as Je } from "./useEnvConvert-Diwx279c.js";
import Qe from "./ConvertEnvDialog-uW3XYugW.js";
import Xe from "./GuideEncryptDialog-BFzmeGjH.js";
import { C as Ze } from "./index-C6tOf3zW.js";
import { _ as et } from "./extensionsTip.vue_vue_type_script_setup_true_lang-Ctz4K9rc.js";
import { A as tt } from "./driver.js-DEmvqz_C.js";
import "./sortable.esm-DneA_jWz.js";
import "./Tip.vue_vue_type_script_setup_true_lang-DBJcGLEl.js";
import "./ActionDialog-Dgihq2Lx.js";
import "./guide-cookie-encrypt-en-light-Br-7UCuE.js";
import "./CustomRadioGroup-Dk-imFdD.js";
const lt =
  "" + new URL("browserIdentityLog-DhfWMCz-.png", import.meta.url).href;
const at = [
  { value: l.SERIALNUM, label: p.t("setting.browserIdentityOption1") },
  { value: l.BEFORE_NAME, label: p.t("setting.browserIdentityOption2") },
  { value: l.AFTER_NAME, label: p.t("setting.browserIdentityOption3") },
  { value: l.BEFORE_REMARK, label: p.t("setting.browserIdentityOption4") },
  { value: l.AFTER_REMARK, label: p.t("setting.browserIdentityOption5") },
];
(c.ALL_SHOW,
  p.t("setting.indexPageConfigOption1"),
  c.NO_SHOW,
  p.t("setting.indexPageConfigOption2"),
  c.FIRST,
  p.t("setting.indexPageConfigOption3"));
const it = {
    [t.serialNum]: "env.env.resp.serialNum",
    [t.name]: "env.env.resp.name",
    [t.remark]: "base.remark",
    [t.createTime]: "base.createTime",
    [t.lastOpenTime]: "env.env.resp.lastOpenTime",
    [t.sort]: "env.env.req.custom_id",
  },
  ot = {
    envDataSync: { status: !1, roleIds: [] },
    updateFrequencyConfig: {
      status: !1,
      updateFrequency: r.NOW,
      autoUpdate: !1,
      autoUpdateRule: s.UPDATE_VERSION,
    },
    dataConfigOption: [],
    browserConfigOption: [],
    expandSecuritySkipSuperAdmin: !1,
    bookmarkConfig: {
      status: !1,
      type: n.APPEND,
      fileName: "",
      fileContent: [],
      coverRule: o.Cover,
      envGroupIds: ["all"],
    },
    envConfig: { envMutilOpenType: !1, remoteInspectorType: !1 },
    proxyDetectConfig: { status: !1, nameList: "", memberGroupList: ["all"] },
    accessLimit: {
      status: !1,
      type: 1,
      urlList: "",
      memberMroupList: ["all"],
      quickSelectionOption: [],
      quickSelectionType: 1,
    },
    appVersionLimitConfig: i,
    localDataType: a.GLOBAL,
    localDataConfig: {
      type: 0,
      browserType: a.GLOBAL,
      dataType: [],
      synchronize: !0,
    },
    envTitleConfig: {
      status: !1,
      envTitle: JSON.stringify(u(d())),
      memberGroupList: ["all"],
    },
    envPageConfig: { status: !1, pageSize: 10 },
    envOpenLimitConfig: { status: !1, memberGroupList: ["all"], openLimit: 5 },
    browserShowRuleConfig: { status: !1, envLabel: l.SERIALNUM },
    envSortConfig: { status: !1, orderBy: t.serialNum, sort: He.DESC },
    memberIpLimitConfig: { status: !1, type: e.BAN, ip: "", vpn: !1 },
    deviceNameLimitConfig: { status: !1, type: e.BAN, deviceName: "" },
    proxyLimitConfig: { status: !1 },
    myOrgConfig: { memberLoginConfig: { status: !1, ipLimitNum: 1 } },
    cookieEncryptConfig: { status: !1, newAdd: !0 },
    localNetworkConfig: { status: !1, urls: "" },
  },
  nt = [
    { name: "dataSettings", href: "#dataSettings" },
    { name: "browserConfig", href: "#browserConfig" },
    { name: "envSettings", href: "#envSettings" },
    { name: "securitySettings", href: "#securitySettings" },
    { name: "techCheck", href: "#techCheck" },
    { name: "softwareUpdate", href: "#softwareUpdate" },
  ];
function st({ selectedOptions: e = [], originalType: t = 0, isClient: l }) {
  const a = (function (e = []) {
    return e.filter((e) => Number.isFinite(e)).reduce((e, t) => e + t, 0);
  })(e);
  return l ||
    (function (e = 0) {
      return Boolean(8192 & e);
    })(t)
    ? a
    : -8193 & a;
}
const rt = ["element-loading-text"],
  ut = { class: "container-wrap" },
  dt = { class: "anchor-wrapper" },
  pt = { class: "step" },
  ct = ["onMouseover"],
  mt = ["onMouseover"],
  ft = { class: "tw-mb-[10px] tw-text-[19px]", id: "dataSettings" },
  gt = { class: "envV2EditFormItemBox tw-w-fit" },
  vt = { class: "data-async" },
  bt = { class: "tip" },
  Ct = { class: "tw-mb-[10px] tw-text-[19px]", id: "browserConfig" },
  wt = { class: "data-async envV2EditFormItemBox" },
  yt = { class: "browser-config-tooltip-trigger" },
  xt = {
    key: 0,
    class:
      "tw-w-full tw-my-[10px] tw-border-t-[1px] tw-border-[var(--el-button-divide-border-color)]",
  },
  Lt = { class: "tw-flex" },
  kt = { class: "tw-pl-2 tip tip-style" },
  ht = { class: "tw-flex" },
  _t = { class: "tw-pl-2 tip tip-style tw-mr-[5px]" },
  Vt = { class: "tw-flex" },
  St = { class: "tw-pl-2 tip tip-style" },
  Ot = { key: 0, class: "envV2EditFormItemBox tw-w-fit" },
  Tt = { key: 0, class: "upload-btn tw-w-fit" },
  Et = { class: "tip !tw-mb-[0px]" },
  Dt = { key: 1, class: "bookmark-wrap" },
  Nt = { class: "header" },
  It = { class: "tw-truncate tw-flex-1 tw-w-0" },
  $t = { class: "content" },
  Rt = { class: "tw-truncate" },
  At = { class: "tw-cursor-pointer" },
  Ut = { class: "tw-pl-2 tip" },
  qt = { key: 0 },
  Bt = { class: "tw-mb-[10px]", id: "cookieEncryptActions" },
  Ft = { class: "tw-text-[14px] tw-ml-[10px]" },
  Gt = { class: "tw-mb-[30px]" },
  Pt = { class: "tw-flex" },
  Mt = { class: "tw-pl-2 tip tip-style" },
  jt = { key: 0, class: "envV2EditFormItemBox" },
  zt = { class: "tw-flex" },
  Wt = { class: "tw-pl-2 tip tip-style" },
  Ht = { key: 0, class: "envV2EditFormItemBox" },
  Kt = {
    class: "tw-max-w-[500px] tw-w-[100%] tw-flex tw-items-center tw-relative",
  },
  Yt = { class: "tw-mb-[10px]" },
  Jt = {
    class:
      "tw-w-[285px] tw-h-[54px] tw-rounded-[8px] tw-bg-[var(--table-tr-bg-color)] c-flex !tw-justify-around",
  },
  Qt = { class: "tw-mt-[20px] tw-mb-[10px] tw-w-[268px]" },
  Xt = { class: "tw-text-[14px] tw-text-[var(--label-content-color)]" },
  Zt = { class: "tw-mb-[10px] tw-text-[19px]", id: "envSettings" },
  el = { class: "tw-flex" },
  tl = { class: "tw-pl-2 tip tip-style" },
  ll = { key: 0, class: "tip tw-mt-[10px]" },
  al = { class: "tw-text-[var(--el-text-color-regular)]" },
  il = { class: "tw-truncate" },
  ol = { class: "tw-flex" },
  nl = { class: "tw-pl-2 tip tip-style" },
  sl = {
    key: 0,
    class:
      "envV2EditFormItemBox tw-p-[20px] tw-mt-[10px] tw-rounded-[8px] tw-max-w-[500px]",
  },
  rl = {
    class: "s-flex tw-gap-x-5 !tw-items-start tw-w-full tw-max-w-[500px]",
  },
  ul = { class: "tw-whitespace-nowrap tw-w-[125px]" },
  dl = { class: "tw-w-full tw-flex tw-gap-[10px]" },
  pl = {
    class: "s-flex tw-gap-x-5 !tw-items-start tw-w-full tw-max-w-[500px]",
  },
  cl = { class: "tw-whitespace-nowrap tw-w-[125px]" },
  ml = { class: "tw-w-full tw-flex tw-gap-[10px]" },
  fl = { class: "tw-flex" },
  gl = { class: "tw-pl-2 tip tip-style" },
  vl = { key: 0, class: "tip tw-mt-[10px] envV2EditFormItemBox" },
  bl = {
    class: "s-flex tw-gap-x-5 !tw-items-start tw-w-full tw-max-w-[500px]",
  },
  Cl = { class: "tw-flex tw-items-center tw-text-white" },
  wl = { class: "tw-flex" },
  yl = { class: "tw-pl-2 tip tip-style" },
  xl = { key: 0, class: "tip tw-mt-[10px] envV2EditFormItemBox" },
  Ll = { class: "tw-truncate" },
  kl = { class: "tw-mb-[10px] tw-text-[19px]", id: "securitySettings" },
  hl = { class: "tw-flex" },
  _l = { class: "tw-pl-2 tip tip-style" },
  Vl = { key: 0, class: "envV2EditFormItemBox" },
  Sl = { class: "tw-cursor-pointer" },
  Ol = { class: "tw-truncate" },
  Tl = { class: "tw-flex" },
  El = { class: "tw-pl-2 tip tip-style tw-pr-[5px]" },
  Dl = { key: 0, class: "tw-max-w-[700px] envV2EditFormItemBox tw-mt-[10px]" },
  Nl = { class: "tw-flex" },
  Il = { class: "tw-pl-2 tip tip-style tw-pr-[5px]" },
  $l = { key: 0, class: "tw-max-w-[700px] envV2EditFormItemBox tw-mt-[10px]" },
  Rl = { class: "tw-flex" },
  Al = { class: "tw-pl-2 tip tip-style tw-mr-[5px]" },
  Ul = { class: "tw-flex" },
  ql = { class: "tw-pl-2 tip tip-style" },
  Bl = { key: 0, class: "envV2EditFormItemBox tw-mt-[10px]" },
  Fl = { class: "tw-flex" },
  Gl = { class: "tw-pl-2 tip tip-style" },
  Pl = { key: 0, class: "envV2EditFormItemBox" },
  Ml = { class: "tw-truncate" },
  jl = { key: 0, class: "tip" },
  zl = { class: "tw-flex" },
  Wl = { class: "tw-pl-2 tip tip-style" },
  Hl = { key: 0, class: "envV2EditFormItemBox" },
  Kl = { class: "tw-mb-[10px] tw-text-[19px]", id: "techCheck" },
  Yl = { class: "tw-flex" },
  Jl = { class: "tw-pl-2 tip tip-style" },
  Ql = { class: "tw-mb-[10px] tw-text-[19px]" },
  Xl = { class: "envV2EditFormItemBox tw-max-w-[700px] tw-w-fit" },
  Zl = { class: "tw-flex tw-gap-x-2" },
  ea = { class: "tw-pl-2 tip tip-style !tw-mb-[0px]" },
  ta = { class: "tw-gap-x-5 !tw-items-start tw-w-full tw-max-w-[500px]" },
  la = { class: "tw-w-full" },
  aa = {
    class: "tw-text-[var(--label-content-color)] tw-leading-[1.2] tw-mt-[4px]",
  },
  ia = { class: "tw-flex tw-items-center tw-ml-[-10px] tw-z-[10]" },
  oa = "120px",
  na = Be(
    m({
      __name: "index",
      setup(t) {
        f();
        const l = [
            g.disableDebugger,
            g.disableExpand,
            g.disableChromeExtension,
          ],
          a = pe(() => le(ae.BROWSER_SETTINGS, !1)),
          i = pe(() => le(ae.GLOBAL_SETTINGS, !1)),
          r = pe(() => le(ae.MULTI_DEVICE_LOGIN_INTERNAL_MEMBERS, !1)),
          p = pe(() =>
            (function (e, t) {
              return e && t;
            })(i.value, r.value),
          ),
          c = pe(() => le(ae.BAN_PWD_VIEW, !1)),
          m = k(),
          Be = pe(() => !i.value || Ea.isFree),
          na = pe(() => L().planTooltipContentText),
          sa = k(!1),
          ra = k(!1),
          {
            convertEnv: ua,
            shouldBreak: da,
            cleanup: pa,
            terminateConversion: ca,
            convertEnvResults: ma,
            progress: fa,
          } = Je(),
          ga = v(),
          va = pe(() => ga.getUpdateFrequency),
          ba = k("global"),
          Ca = b(),
          { t: wa } = C.useI18n(),
          ya = k({ AboutBrowsers: !1 }),
          xa = k(!1),
          La = k(""),
          ka = k(""),
          ha = k(),
          _a = k(),
          { refreshAllSha256Hash: Va, getCoreExpandList: Sa } = w(),
          Oa = y(),
          Ta = x(),
          Ea = L(),
          Da = k(!0),
          Na = k(!1),
          Ia = k(!1),
          $a = k(null),
          Ra = k(),
          Aa = k([]),
          Ua = k([]),
          qa = pe(() => Oe(Ua.value)),
          Ba = pe(() => Oe(Ua.value)),
          Fa = k([]),
          Ga = k(!1),
          Pa = k(0),
          Ma = k(),
          ja = pe(() => {
            var e;
            return (
              (null == (e = vi.value.browserConfigOption)
                ? void 0
                : e.reduce((e, t) => e + t, 0)) ?? 0
            );
          }),
          za = tt({
            allowClose: !1,
            disableActiveInteraction: !0,
            smoothScroll: !0,
            allowKeyboardControl: !1,
            doneBtnText: wa("promotion.close"),
            steps: [],
          }),
          Wa = k(!0),
          Ha = k(!1);
        let Ka = k(u(d())),
          Ya = k([
            { value: 10, label: `10 ${wa("setting.pageSizeTip2")}` },
            { value: 20, label: `20 ${wa("setting.pageSizeTip2")}` },
            { value: 50, label: `50 ${wa("setting.pageSizeTip2")}` },
            { value: 100, label: `100 ${wa("setting.pageSizeTip2")}` },
          ]),
          Ja = pe(() => {
            let e = gi.value.envTitleConfig.envTitle;
            try {
              return e ? JSON.parse(e) : [];
            } catch (t) {
              return [];
            }
          }),
          Qa = k(h(it, [], !0)),
          Xa = pe(() =>
            Ja.value.reduce((e, t) => {
              if (t.label && t.checked && !t.freeze && !je.has(t.key)) {
                let l = Ka.value.find((e) => e.key === t.key);
                return (null == l ? void 0 : l.label)
                  ? e + (e ? " > " : "") + (null == l ? void 0 : l.label)
                  : e;
              }
              return e;
            }, ""),
          );
        const Za = _({
            "accessLimit.urlList": [
              { required: !0, message: wa("setting.accessLimitRules1") },
            ],
            "accessLimit.memberMroupList": [
              { required: !0, message: wa("setting.accessLimitRules2") },
            ],
            "bookmarkConfig.envGroupIds": [
              { required: !0, message: wa("setting.accessLimitRules2") },
            ],
            "proxyDetectConfig.nameList": [
              { required: !0, message: wa("setting.proxyDetectRequireTip") },
            ],
            "proxyDetectConfig.memberGroupList": [
              { required: !0, message: wa("setting.accessLimitRules2") },
            ],
            "envTitleConfig.memberGroupList": [
              { required: !0, message: wa("setting.accessLimitRules2") },
            ],
            "appVersionLimitConfig.appVersion": [
              { required: !0, message: wa("setting.versionLimitTip11") },
            ],
            "appVersionLimitConfig.roleIds": [
              { required: !0, message: wa("setting.accessLimitRules2") },
            ],
            "appVersionLimitConfig.liunxAppVersion": [
              { required: !0, message: wa("setting.versionLimitTip11") },
            ],
            "appVersionLimitConfig.liunxRoleIds": [
              { required: !0, message: wa("setting.accessLimitRules2") },
            ],
            "envDataSync.roleIds": [
              { required: !0, message: wa("setting.versionLimitTip12") },
            ],
            "localNetworkConfig.urls": [
              { required: !0, message: wa("rpa.task.req.enter") },
            ],
            "envOpenLimitConfig.memberGroupList": [
              { required: !0, message: wa("setting.accessLimitRules2") },
            ],
            "envOpenLimitConfig.openLimit": [
              { required: !0, message: wa("setting.envOpenLimitCountRules") },
            ],
            "myOrgConfig.memberLoginConfig.ipLimitNum": [
              {
                required: !0,
                message: wa("setting.memberLoginConfigLimitRules"),
              },
            ],
          }),
          ei = k({
            title: wa("env.cookie.toNewTitle"),
            message: wa("env.cookie.toNewMessage"),
          }),
          ti = () => {
            ca();
          },
          li = pe(() => Boolean(ja.value & g.expandSecurity)),
          ai = pe(() => {
            var e;
            return null == (e = gi.value.browserConfigOption)
              ? void 0
              : e.includes(g.expandSecurity);
          }),
          ii = (e) => !me.isClient && e === se.expandSecurity && !li.value,
          oi = (e) =>
            !!ii(e) || (e === se.disableShowPassword ? !c.value : !a.value),
          ni = (e) =>
            !ii(e) && (e === se.disableShowPassword ? c.value : a.value),
          si = (e) => (ii(e) ? wa("appDownload.tip1") : na.value),
          ri = async () => {
            sa.value = !1;
          },
          ui = () => {
            setTimeout(() => {
              pa();
            }, 1e3);
          },
          di = (e) => {
            (console.log("v", e, gi.value.appVersionLimitConfig),
              !e &&
                gi.value.browserConfigOption.includes(g.expandSecurity) &&
                ce
                  .confirm(
                    wa("expan.security.tip7"),
                    wa("env.env.shareDialog.operatorTips"),
                    {
                      cancelButtonText: wa("base.cancel"),
                      confirmButtonText: wa("base.confirm"),
                      type: "warning",
                    },
                  )
                  .then(() => {
                    gi.value.browserConfigOption =
                      gi.value.browserConfigOption.filter(
                        (e) => e !== g.expandSecurity,
                      );
                  })
                  .catch(() => {
                    gi.value.appVersionLimitConfig.status = !0;
                  }));
          },
          pi = async (e) => {
            const t = null == e ? void 0 : e.action;
            (!1 === t &&
              (l.forEach((e) => {
                gi.value.browserConfigOption =
                  gi.value.browserConfigOption.filter((t) => t !== e);
              }),
              (gi.value.expandSecuritySkipSuperAdmin = !1),
              ("2.6.18" !== gi.value.appVersionLimitConfig.appVersion &&
                "2.6.18" !== gi.value.appVersionLimitConfig.liunxAppVersion) ||
                (gi.value.appVersionLimitConfig = De(
                  gi.value.appVersionLimitConfig,
                ))),
              !0 === t &&
                ((gi.value.expandSecuritySkipSuperAdmin = Boolean(
                  e.expandSecuritySkipSuperAdmin,
                )),
                l.forEach((e) => {
                  gi.value.browserConfigOption.includes(e) ||
                    gi.value.browserConfigOption.push(e);
                }),
                Ne(gi.value.appVersionLimitConfig, "2.6.18")
                  ? (gi.value.appVersionLimitConfig = Ie(
                      gi.value.appVersionLimitConfig,
                      "2.6.18",
                    ))
                  : (gi.value.appVersionLimitConfig.status = !0)));
          },
          ci = async (e) => {
            var t;
            const l = gi.value.expandSecuritySkipSuperAdmin,
              a =
                (null == (t = Ta.orgConfigData.browserConfig)
                  ? void 0
                  : t.type) ?? ja.value;
            gi.value.expandSecuritySkipSuperAdmin = e;
            try {
              (await Ta.updateOrgConfigData({
                browserConfig: {
                  type: a,
                  expandSecuritySkipSuperAdmin: e ? 1 : 0,
                },
              }),
                (vi.value.expandSecuritySkipSuperAdmin = e),
                ke.success({
                  message: wa("setting.SaveSuccess"),
                  duration: 3e3,
                }));
            } catch (i) {
              throw ((gi.value.expandSecuritySkipSuperAdmin = l), i);
            }
          },
          mi = (e) => {
            const t = gi.value.browserConfigOption.includes(g.expandSecurity);
            !1 === e && !1 === t
              ? gi.value.browserConfigOption.push(g.expandSecurity)
              : !0 === e &&
                !0 === t &&
                (gi.value.browserConfigOption =
                  gi.value.browserConfigOption.filter(
                    (e) => e !== g.expandSecurity,
                  ));
          },
          fi = async () => {
            const e = await fe({ all: !0, detail: !1 });
            ((Fa.value = e.list.map((e) => ({ value: e.id, label: e.name }))),
              Fa.value.unshift({
                value: "all",
                label: wa("org.member.req.allGroup"),
              }));
          };
        let gi = k(V.cloneDeep(ot));
        const vi = k(V.cloneDeep(ot));
        const bi = async () => {
          me.isClient && (Aa.value = await me.invoke(ve));
        };
        (S(
          () => Ca.query,
          (e) => {
            (null == e ? void 0 : e.type) &&
              "HistoryDownload" === e.type &&
              ((ba.value = "second"), bi());
          },
          { deep: !0, immediate: !0 },
        ),
          S(
            () => [
              gi.value.accessLimit.type,
              gi.value.accessLimit.quickSelectionOption,
            ],
            (e) => {
              const [t, l] = e,
                a = ((null == l ? void 0 : l.length) ?? 0) > 0;
              Za["accessLimit.urlList"] =
                1 === t && a
                  ? [{ required: !1, message: "" }]
                  : [
                      {
                        required: !0,
                        message: wa("setting.accessLimitRules1"),
                      },
                    ];
            },
          ),
          S(
            () => {
              var e;
              return null == (e = gi.value.envDataSync) ? void 0 : e.status;
            },
            (e) => {
              Za["envDataSync.roleIds"] = e
                ? [{ required: !0, message: wa("setting.versionLimitTip12") }]
                : [{ required: !1, message: "" }];
            },
          ));
        const Ci = async (e) => {
          (await U(),
            setTimeout(async () => {
              var t;
              if (
                (null == (t = m.value) || t.scrollTo(e),
                window.history.state.anchor && window.history.replaceState)
              ) {
                const e = new URL(window.location.href);
                window.history.replaceState({}, "", e.toString());
              }
            }, 500));
        };
        let wi = null;
        const yi = async () => {
            const e = await be(!0);
            Pa.value = (null == e ? void 0 : e.data) || 0;
          },
          xi = (e) => {
            ba.value = e;
          },
          Li = (e) => {
            Da.value = e;
          },
          ki = (e) => {
            Ci(e);
          };
        async function hi() {
          var e, t, l, a, i, o, n, s, r, u, d, p;
          let [c] = await E(Promise.all([Ta.getOrgConfigData(), $i()]));
          if (((Ha.value = !!c), c)) return;
          let m = Ta.orgConfigData;
          if (
            ((Na.value = m.debugMode ?? !1),
            (Ia.value = m.delPackage ?? !1),
            m.localDataConfig && (gi.value.localDataConfig = m.localDataConfig),
            gi.value.localDataConfig.dataType)
          ) {
            const e = V.cloneDeep(gi.value.localDataConfig);
            gi.value.localDataConfig.dataType = [];
            let t = e.dataType;
            (D.Cookie & t && gi.value.localDataConfig.dataType.push(D.Cookie),
              D.LocalStorage & t &&
                gi.value.localDataConfig.dataType.push(D.LocalStorage),
              D.IndexedDB & t &&
                gi.value.localDataConfig.dataType.push(D.IndexedDB),
              D.AccountPwd & t &&
                gi.value.localDataConfig.dataType.push(D.AccountPwd),
              D.History & t &&
                gi.value.localDataConfig.dataType.push(D.History),
              D.Media & t && gi.value.localDataConfig.dataType.push(D.Media));
          } else gi.value.localDataConfig.dataType = [];
          null == (e = Ma.value) || e.initLocalDataConfig();
          let f = (null == (t = m.accessLimit) ? void 0 : t.urlList) ?? "";
          if (
            null == (l = null == m ? void 0 : m.accessLimit)
              ? void 0
              : l.quickSelectionType
          ) {
            let e =
              null == (a = null == m ? void 0 : m.accessLimit)
                ? void 0
                : a.quickSelectionType;
            if (e) {
              const t = [];
              for (const l in N)
                if (N.hasOwnProperty(l)) {
                  const a = N[l];
                  (e & a) === a &&
                    (t.push(a),
                    (f = f
                      .split("\n")
                      .filter((e) => e !== I[N[a]])
                      .join("\n")));
                }
              m.accessLimit.quickSelectionOption = t;
            }
          }
          if (
            (m.accessLimit && (m.accessLimit.urlList = f),
            null == (i = null == m ? void 0 : m.dataSyncConfig)
              ? void 0
              : i.type)
          ) {
            let e =
              null == (o = null == m ? void 0 : m.dataSyncConfig)
                ? void 0
                : o.type;
            if (e) {
              const t = [];
              for (const l in $)
                if ($.hasOwnProperty(l)) {
                  const a = $[l];
                  (e & a) === a && t.push(a);
                }
              gi.value.dataConfigOption = t;
            }
          }
          if (
            null == (n = null == m ? void 0 : m.browserConfig) ? void 0 : n.type
          ) {
            let e =
              null == (s = null == m ? void 0 : m.browserConfig)
                ? void 0
                : s.type;
            if (e) {
              const t = [];
              for (const l in g)
                if (g.hasOwnProperty(l)) {
                  const a = g[l];
                  (e & a) === a && t.push(a);
                }
              gi.value.browserConfigOption = t;
            }
          }
          gi.value.expandSecuritySkipSuperAdmin = Boolean(
            null == (r = null == m ? void 0 : m.browserConfig)
              ? void 0
              : r.expandSecuritySkipSuperAdmin,
          );
          let v = V.pickBy(m.bookmarkConfig, (e) => null !== e);
          if (
            ((gi.value.bookmarkConfig = V.assign(
              V.cloneDeep(gi.value.bookmarkConfig),
              V.pick(v, Object.keys(gi.value.bookmarkConfig)),
            )),
            !gi.value.bookmarkConfig.envGroupIds.length &&
              (gi.value.bookmarkConfig.envGroupIds = ["all"]),
            null == (u = m.bookmarkConfig) ? void 0 : u.bookmark)
          )
            try {
              let e = JSON.parse(
                null == (d = m.bookmarkConfig) ? void 0 : d.bookmark,
              );
              ((gi.value.bookmarkConfig.fileName = e.fileName),
                (gi.value.bookmarkConfig.fileContent = e.fileContent));
            } catch (w) {}
          let b = [
              "envTitleConfig",
              "appVersionLimitConfig",
              "accessLimit",
              "proxyDetectConfig",
              "updateFrequencyConfig",
              "envConfig",
              "browserShowRuleConfig",
              "envSortConfig",
              "envDataSync",
              "envPageConfig",
              "envOpenLimitConfig",
              "memberIpLimitConfig",
              "deviceNameLimitConfig",
              "proxyLimitConfig",
              "myOrgConfig",
              "cookieEncryptConfig",
              "localNetworkConfig",
            ],
            C = V.defaultsDeep(
              {},
              V.omitBy(V.pick(m, b), V.isNull),
              V.pick(ot, b),
            );
          ((C.appVersionLimitConfig = R(C.appVersionLimitConfig)),
            (C.envTitleConfig.memberGroupList = A(
              C.envTitleConfig.memberGroupList,
            )),
            console.log(C, "initOrgConfig"),
            (gi.value = { ...gi.value, ...C }),
            (() => {
              const {
                version: e,
                roleIds: t,
                enable: l,
                liunxAppVersion: a,
                liunxRoleIds: i,
              } = wi || {};
              e &&
                t &&
                !V.isNull(l) &&
                ((gi.value.appVersionLimitConfig.appVersion = e || ""),
                (gi.value.appVersionLimitConfig.roleIds = t || ["all"]),
                (gi.value.appVersionLimitConfig.liunxAppVersion = a || e || ""),
                (gi.value.appVersionLimitConfig.liunxRoleIds = i ||
                  t || ["all"]),
                (gi.value.appVersionLimitConfig.status = l ?? !1));
            })(),
            0 === gi.value.envDataSync.roleIds.length &&
              (gi.value.envDataSync.roleIds = Ua.value
                .filter((e) => "SUPER_ADMIN" === e.code)
                .map((e) => e.id)),
            await U(),
            await (null == (p = ha.value) ? void 0 : p.changeFieldList()),
            (vi.value = V.cloneDeep(gi.value)));
        }
        O(async () => {
          var e, t;
          (window.history.state
            ? ((wi =
                (null == (e = window.history.state.params)
                  ? void 0
                  : e.appVersionLimitConfig) || null),
              await Ci(window.history.state.anchor))
            : null == (t = m.value) || t.scrollTo(nt[0].href),
            Oa.getAllLocalBrowserList(),
            T.on("setting-change-active", xi),
            T.on("current-updating", Li),
            T.on("setting-scroll-to-anchor", ki),
            (Wa.value = !0),
            Promise.allSettled([
              void me.api.getLocalVersionInfo().then((e) => {
                ((La.value = e.browserVersion),
                  (ka.value = e.browserUpdateTime));
              }),
              bi(),
              hi(),
              yi(),
              fi(),
            ]).finally(() => {
              Wa.value = !1;
            }));
        });
        const _i = async (e) => {
            try {
              (e &&
                me.api.trackEvent({
                  type: we.OTHER_CLICK,
                  action: Ce.CLICK_ENABLE_TECH_TROUBLESHOOTING,
                }),
                await Ta.updateOrgConfigData({ debugMode: e }),
                (Na.value = Ta.orgConfigData.debugMode ?? !1));
            } catch (t) {}
          },
          Vi = (e, t) => {
            const l = t.target,
              a = l.parentNode;
            l.offsetWidth > a.offsetWidth && (ya.value[e] = !0);
          },
          Si = () => {
            ((gi.value.bookmarkConfig.fileName = ""),
              (gi.value.bookmarkConfig.fileContent = []));
          },
          Oi = () => {
            me.isClient
              ? me
                  .invoke(xe, {
                    filters: [{ name: "HTML", extensions: ["html"] }],
                  })
                  .then((e) => {
                    if ((console.log(e, "result"), e && e.length > 0)) {
                      const t = e[0],
                        l = Ti(t);
                      return (
                        (gi.value.bookmarkConfig.fileName = l),
                        me
                          .invoke(Le, t)
                          .then((e) => ({ content: e, fileName: l }))
                      );
                    }
                    throw new Error("没有选择文件");
                  })
                  .then(({ content: e, fileName: t }) => {
                    if (
                      (console.log(e, "content"),
                      e.includes("<DL><p>") || e.includes("<H1>Bookmarks</H1>"))
                    ) {
                      const t = Ei(e);
                      (0 === t.length &&
                        ke.error(wa("setting.fileFormatError")),
                        (gi.value.bookmarkConfig.fileContent = Di(t)),
                        console.log(gi.value.bookmarkConfig.fileContent));
                    } else
                      (ke.warning(wa("setting.uploadFileFormatError")),
                        console.log("这不是一个有效的书签文件"));
                  })
                  .catch((e) => {
                    console.log("处理文件时出错: " + e.message);
                  })
              : ye();
          },
          Ti = (e) => {
            var t;
            return (
              (null == (t = e.split("\\").pop())
                ? void 0
                : t.split("/").pop()) || ""
            );
          },
          Ei = (e) => {
            function t(e) {
              if ("A" === e.tagName)
                return {
                  type: "url",
                  name: e.textContent,
                  url: e.getAttribute("href"),
                  icon: e.getAttribute("icon") || "",
                  date_added: "",
                  date_last_used: "",
                  id: Se(),
                  meta_info: { power_bookmark_meta: "" },
                };
              if ("H3" === e.tagName) {
                const t = { type: "folder", name: e.textContent, children: [] };
                let a = e.nextElementSibling;
                return (a && "DL" === a.tagName && (t.children = l(a)), t);
              }
              return "DT" === e.tagName ? t(e.firstElementChild) : null;
            }
            function l(e) {
              return Array.from(e.children).map(t).filter(Boolean);
            }
            return l(
              new DOMParser()
                .parseFromString(e, "text/html")
                .querySelector("DL"),
            );
          },
          Di = (e) => {
            const t = [
              {
                type: "folder",
                name: wa("setting.bookmarksBar"),
                children: [],
              },
              {
                type: "folder",
                name: wa("setting.otherBookmarks"),
                children: [],
              },
            ];
            return (
              e.forEach((e) => {
                var l, a;
                "folder" === e.type
                  ? (t[0].children = e.children || [])
                  : "url" === e.type &&
                    (null == (a = null == (l = t[1]) ? void 0 : l.children) ||
                      a.push(e));
              }),
              t
            );
          },
          Ni = { children: "children", label: "name" },
          Ii = (e, t) => {
            e.preventDefault();
          },
          $i = async () => {
            let e = await Fe({ detail: !1, all: !0 });
            ((Ua.value = e.list),
              (gi.value.envTitleConfig.memberGroupList = A(
                gi.value.envTitleConfig.memberGroupList,
              )),
              (gi.value.envOpenLimitConfig.memberGroupList = q(
                gi.value.envOpenLimitConfig.memberGroupList,
                Ua.value,
              )));
          },
          Ri = (e) => {
            gi.value.proxyDetectConfig.nameList = e.replace(/，/g, ",").trim();
          },
          Ai = (e) => {
            gi.value.accessLimit.urlList = e
              .replace(" ", "")
              .replace(/[\n\r]+$/, "");
          },
          Ui = (e) => {
            let t = gi.value.memberIpLimitConfig.ip.split("\n");
            gi.value.memberIpLimitConfig.ip = t
              .filter((e) => "" !== e.trim())
              .join("\n");
          },
          qi = (e) => {
            let t = gi.value.deviceNameLimitConfig.deviceName.split("\n");
            gi.value.deviceNameLimitConfig.deviceName = t
              .filter((e) => "" !== e.trim())
              .join("\n");
          },
          Bi = () => {
            let e = gi.value.localNetworkConfig.urls
              .split("\n")
              .map((e) => e.replace(/\/+$/, ""));
            (console.log(e, "urlArr"),
              (gi.value.localNetworkConfig.urls = e
                .filter((e) => "" !== e.trim())
                .join("\n")));
          },
          Fi = (e, t, l) => {
            "all" === e[e.length - 1]
              ? (t[l] = ["all"])
              : e.includes("all") &&
                e.length > 1 &&
                (t[l] = e.filter((e) => "all" !== e));
          },
          Gi = (e) => {
            (Fi(e, gi.value.envOpenLimitConfig, "memberGroupList"),
              (gi.value.envOpenLimitConfig.memberGroupList = q(
                gi.value.envOpenLimitConfig.memberGroupList,
                Ua.value,
              )));
          },
          Pi = (e) => {
            (Fi(e, gi.value.envTitleConfig, "memberGroupList"),
              (gi.value.envTitleConfig.memberGroupList = A(
                gi.value.envTitleConfig.memberGroupList,
              )));
          };
        function Mi(e) {
          e
            ? he({
                title: wa("env.env.shareDialog.operatorTips"),
                message: wa("setting.proxyLinkLimitEnableTip"),
                showClose: !1,
                confirmButtonText: wa("base.confirmOpen"),
                confirmCb: async () => {
                  gi.value.proxyLimitConfig.status = !0;
                },
                cancelCb: async () => {
                  gi.value.memberIpLimitConfig.status = !1;
                },
              })
            : (gi.value.proxyLimitConfig.status = !1);
        }
        function ji(e) {
          e ||
            he({
              title: wa("env.env.shareDialog.operatorTips"),
              message: wa("setting.proxyLinkLimitDisableTip"),
              showClose: !1,
              confirmCb: async () => {
                gi.value.memberIpLimitConfig.status = !1;
              },
              cancelCb: async () => {
                gi.value.proxyLimitConfig.status = !0;
              },
            });
        }
        function zi(e) {
          e
            ? (Ta.updateOrgConfigData({
                cookieEncryptConfig: {
                  status: !0,
                  newAdd: gi.value.cookieEncryptConfig.newAdd,
                },
              }),
              ke.success(wa("env.env.shareDialog.operatorSuccess")))
            : he({
                title: wa("env.env.shareDialog.operatorTips"),
                message: wa("env.cookie.confirmClose"),
                showClose: !1,
                confirmCb: async () => {
                  if (_e.getters.ownOpenId.length && me.isClient)
                    throw (
                      Ve(wa("header.promptError")),
                      new Error("有环境处于打开状态")
                    );
                  ((ei.value = {
                    title: wa("env.cookie.toOldTitle"),
                    message: wa("env.cookie.toOldMessage"),
                  }),
                    ua({
                      action: "convertToOld",
                      includeRecycleEnvs: !0,
                      callback: (e) => {
                        if ("in-progress" === e) sa.value = !0;
                        else if ("completed" === e || "failed" === e) {
                          (0 === ma.value.failed.length
                            ? ((gi.value.cookieEncryptConfig.status = !1),
                              Ta.updateOrgConfigData({
                                cookieEncryptConfig: {
                                  status: !1,
                                  newAdd: gi.value.cookieEncryptConfig.newAdd,
                                },
                              }))
                            : (gi.value.cookieEncryptConfig.status = !0),
                            yi());
                        }
                      },
                    }));
                },
                cancelCb: async () => {
                  gi.value.cookieEncryptConfig.status = !0;
                },
              });
        }
        async function Wi(e) {
          if ("all" === e) {
            if (
              (await ce.confirm(
                wa("env.cookie.encryptAllTip"),
                wa("env.env.shareDialog.operatorTips"),
                {
                  cancelButtonText: wa("base.cancel"),
                  confirmButtonText: wa("base.confirm"),
                  type: "warning",
                },
              ),
              _e.getters.ownOpenId.length && me.isClient)
            )
              throw (
                Ve(wa("header.promptError")),
                new Error("有环境处于打开状态")
              );
            ((ei.value = {
              title: wa("env.cookie.toNewTitle"),
              message: wa("env.cookie.toNewMessage"),
            }),
              ua({
                action: "convertToNew",
                callback: (e) => {
                  "in-progress" === e
                    ? (sa.value = !0)
                    : ("completed" !== e && "failed" !== e) || yi();
                },
              }));
          } else Hi();
        }
        function Hi() {
          ra.value = !ra.value;
        }
        function Ki() {
          $e() ||
            (Ha.value
              ? he({
                  title: wa("env.env.shareDialog.operatorTips"),
                  message: wa("setting.initErrorTip"),
                  confirmButtonText: wa("setting.refreshButtonText"),
                  confirmCb: async () => {
                    await hi();
                  },
                })
              : Yi.value
                ? (Ga.value = !0)
                : Ra.value.validate(async (t) => {
                    var a, i, o, n, s, r, u, d, p, c;
                    if (t && "global" === ba.value) {
                      let {
                        accessLimit: t,
                        envConfig: m,
                        bookmarkConfig: f,
                        appVersionLimitConfig: v,
                        browserShowRuleConfig: b,
                        proxyDetectConfig: C,
                        envTitleConfig: w,
                        updateFrequencyConfig: y,
                        envDataSync: x,
                        envSortConfig: L,
                        envPageConfig: k,
                        memberIpLimitConfig: h,
                        deviceNameLimitConfig: _,
                        proxyLimitConfig: S,
                        myOrgConfig: O,
                        cookieEncryptConfig: T,
                        localNetworkConfig: E,
                        envOpenLimitConfig: D,
                      } = gi.value;
                      const $ = {
                          ...D,
                          memberGroupList: q(D.memberGroupList, Ua.value),
                        },
                        R = { ...w, memberGroupList: A(w.memberGroupList) };
                      let U = V.omit(f, ["fileContent"]);
                      Reflect.set(
                        U,
                        "bookmark",
                        (
                          null ==
                          (o =
                            null ==
                            (i =
                              null == (a = null == gi ? void 0 : gi.value)
                                ? void 0
                                : a.bookmarkConfig)
                              ? void 0
                              : i.fileContent)
                            ? void 0
                            : o.length
                        )
                          ? JSON.stringify(
                              null == (n = null == gi ? void 0 : gi.value)
                                ? void 0
                                : n.bookmarkConfig,
                            )
                          : "",
                      );
                      const { quickSelectionOption: B = [] } = t;
                      let F = t.urlList;
                      const G = B.map((e) => {
                        const t = N[e],
                          l = I[t];
                        return F.includes(l) ? "" : l;
                      }).join("\n");
                      G && 1 === t.type && (F += F ? "\n" + G : G);
                      let P = V.cloneDeep(gi.value.localDataConfig);
                      if (
                        ((P.dataType = 0),
                        2 === P.type &&
                          (P.dataType =
                            gi.value.localDataConfig.dataType.reduce(
                              (e, t) => e + t,
                              0,
                            )),
                        me.isClient &&
                          (null ==
                          (r =
                            null == (s = gi.value)
                              ? void 0
                              : s.browserConfigOption)
                            ? void 0
                            : r.includes(g.expandSecurity)))
                      ) {
                        const t = await (async () => {
                          var t;
                          const l = await Re({
                              pageNo: 1,
                              pageSize: 100,
                              detail: !0,
                            }),
                            a =
                              null == (t = null == l ? void 0 : l.list)
                                ? void 0
                                : t.filter((e) => e.status === Ae.ENABLED),
                            i = a.map((e) => ({
                              uniqueId: e.uniqueId,
                              version: e.version,
                            }));
                          if (i.length <= 0) return !0;
                          const o = Ue.service({
                              lock: !0,
                              text: wa("components.table.elementLoadingText"),
                              background: "var(--loading-bg-color)",
                            }),
                            n = await Sa({
                              extensionsList: a,
                              extensionsType: e.ALLOW,
                            });
                          if (a.length !== n.length) {
                            const e = a
                              .filter(
                                (e) => !n.some((t) => t.key === e.uniqueId),
                              )
                              .map((e) => `[${e.extensionsName}]`)
                              .join(" ");
                            return (
                              ke.error({
                                message: wa("expan.security.tip11", {
                                  failedListStr: e,
                                }),
                                duration: 5e3,
                              }),
                              o.close(),
                              !1
                            );
                          }
                          const s = await Va(i);
                          return (
                            s ||
                              qe({
                                title: wa("sync.tip68"),
                                message: wa("expan.security.tip14"),
                                duration: 5e3,
                                type: "error",
                              }),
                            o.close(),
                            s
                          );
                        })();
                        t ||
                          [...l, g.expandSecurity].forEach((e) => {
                            gi.value.browserConfigOption =
                              gi.value.browserConfigOption.filter(
                                (t) => t !== e,
                              );
                          });
                      }
                      (await Ta.updateOrgConfigData({
                        dataSyncConfig: {
                          type:
                            (null ==
                            (d =
                              null == (u = gi.value)
                                ? void 0
                                : u.dataConfigOption)
                              ? void 0
                              : d.reduce((e, t) => e + t, 0)) ?? 0,
                        },
                        browserConfig:
                          ((c = {
                            selectedOptions:
                              null == (p = gi.value)
                                ? void 0
                                : p.browserConfigOption,
                            originalType: ja.value,
                            isClient: me.isClient,
                            expandSecuritySkipSuperAdmin:
                              ai.value && gi.value.expandSecuritySkipSuperAdmin,
                          }),
                          {
                            type: st(c),
                            expandSecuritySkipSuperAdmin:
                              c.expandSecuritySkipSuperAdmin ? 1 : 0,
                          }),
                        bookmarkConfig: U,
                        envConfig: m,
                        accessLimit: {
                          ...t,
                          urlList: F,
                          quickSelectionType:
                            (null == B
                              ? void 0
                              : B.reduce((e, t) => e + t, 0)) ?? 0,
                        },
                        proxyDetectConfig: C,
                        appVersionLimitConfig: v,
                        localDataConfig: P,
                        envTitleConfig: R,
                        browserShowRuleConfig: b,
                        updateFrequencyConfig: y,
                        envDataSync: x,
                        envSortConfig: L,
                        envPageConfig: k,
                        memberIpLimitConfig: h,
                        deviceNameLimitConfig: _,
                        proxyLimitConfig: S,
                        myOrgConfig: O,
                        cookieEncryptConfig: T,
                        localNetworkConfig: E,
                        envOpenLimitConfig: $,
                      }),
                        (vi.value = V.cloneDeep(gi.value)),
                        ke({
                          message: wa("setting.SaveSuccess"),
                          type: "success",
                        }));
                    }
                  }));
        }
        const Yi = pe(
            () =>
              !(
                (gi.value.bookmarkConfig.type === n.COVER &&
                  gi.value.bookmarkConfig.coverRule === o.CLEAR) ||
                0 !== gi.value.bookmarkConfig.fileContent.length ||
                !gi.value.bookmarkConfig.status
              ),
          ),
          Ji = (e) => {
            e ||
              ((Ga.value = !1),
              Si(),
              (gi.value.bookmarkConfig.type = n.APPEND));
          };
        function Qi(e, t = !0) {
          ((gi.value.envTitleConfig.envTitle = JSON.stringify(ze(e))),
            t && Ki());
        }
        return (
          B(async (e, t, l) => {
            V.isEqual(gi.value, vi.value)
              ? l()
              : await he({
                  customClass: "setting-leave-box",
                  title: wa("setting.unsavedLeaveTitle"),
                  message: Ee("div", {}, [
                    Ee(
                      "span",
                      { class: "tw-break-all" },
                      wa("setting.unsavedLeaveMessage"),
                    ),
                  ]),
                  confirmCb: () => l(),
                  cancelCb: () => {
                    var e;
                    ((Te().routePath = (
                      null == (e = t.meta) ? void 0 : e.activeMenu
                    )
                      ? t.meta.activeMenu
                      : t.path),
                      l(!1));
                  },
                  closeCb: () => {
                    var e;
                    ((Te().routePath = (
                      null == (e = t.meta) ? void 0 : e.activeMenu
                    )
                      ? t.meta.activeMenu
                      : t.path),
                      l(!1));
                  },
                });
          }),
          fi(),
          F(() => {
            (T.off("setting-change-active", xi),
              T.off("current-updating", Li),
              T.off("setting-scroll-to-anchor", ki),
              za.destroy());
          }),
          (t, a) => {
            const r = G("el-anchor-link"),
              u = G("el-tooltip"),
              d = G("el-checkbox"),
              c = G("el-checkbox-group"),
              f = G("el-form-item"),
              v = G("el-divider"),
              b = G("el-switch"),
              C = G("el-button"),
              w = G("el-tree"),
              y = G("el-radio"),
              x = G("el-radio-group"),
              L = G("el-option"),
              k = G("el-select"),
              h = G("el-input"),
              _ = G("Back"),
              S = G("el-icon"),
              O = G("Right"),
              T = G("RefreshRight"),
              E = G("el-input-number"),
              D = G("el-form"),
              I = P("trim"),
              R = P("prevent-label-click"),
              A = P("loading");
            return M(
              (j(),
              z(
                "div",
                {
                  class: "setting-wrapper",
                  "element-loading-text": t.$t(
                    "components.table.elementLoadingText",
                  ),
                },
                [
                  W("div", ut, [
                    W("div", dt, [
                      W("div", pt, [
                        H(
                          Q(ee),
                          {
                            bound: 10,
                            container: $a.value,
                            offset: 0,
                            "select-scroll-top": !0,
                            type: "default",
                            onClick: Ii,
                            ref_key: "anchorRef",
                            ref: m,
                          },
                          {
                            default: K(() => [
                              (j(!0),
                              z(
                                Y,
                                null,
                                J(
                                  Q(nt),
                                  (e) => (
                                    j(),
                                    z(
                                      Y,
                                      { key: e.name },
                                      [
                                        ya.value.AboutBrowsers
                                          ? (j(),
                                            X(
                                              u,
                                              {
                                                key: 0,
                                                content: t.$t(
                                                  `setting.${e.name}`,
                                                ),
                                                placement: "right",
                                              },
                                              {
                                                default: K(() => [
                                                  H(
                                                    r,
                                                    { href: e.href },
                                                    {
                                                      default: K(() => [
                                                        W(
                                                          "span",
                                                          {
                                                            onMouseover: (t) =>
                                                              Vi(e.name, t),
                                                          },
                                                          Z(
                                                            t.$t(
                                                              `setting.${e.name}`,
                                                            ),
                                                          ),
                                                          41,
                                                          ct,
                                                        ),
                                                      ]),
                                                      _: 2,
                                                    },
                                                    1032,
                                                    ["href"],
                                                  ),
                                                ]),
                                                _: 2,
                                              },
                                              1032,
                                              ["content"],
                                            ))
                                          : (j(),
                                            X(
                                              r,
                                              { key: 1, href: e.href },
                                              {
                                                default: K(() => [
                                                  W(
                                                    "span",
                                                    {
                                                      onMouseover: (t) =>
                                                        Vi(e.name, t),
                                                    },
                                                    Z(
                                                      t.$t(`setting.${e.name}`),
                                                    ),
                                                    41,
                                                    mt,
                                                  ),
                                                ]),
                                                _: 2,
                                              },
                                              1032,
                                              ["href"],
                                            )),
                                      ],
                                      64,
                                    )
                                  ),
                                ),
                                128,
                              )),
                            ]),
                            _: 1,
                          },
                          8,
                          ["container"],
                        ),
                      ]),
                    ]),
                    W(
                      "div",
                      {
                        ref_key: "globalContainerRef",
                        ref: $a,
                        class: "global-container tw-mt-[20px]",
                      },
                      [
                        M(
                          (j(),
                          X(
                            D,
                            {
                              ref_key: "formRef",
                              ref: Ra,
                              model: Q(gi),
                              rules: Za,
                              "label-position": "top",
                              class: "!tw-pb-[100px] gl-setting-form",
                              "inline-message": !0,
                              "scroll-to-error": !0,
                              "scroll-into-view-options": {
                                behavior: "smooth",
                                block: "center",
                              },
                            },
                            {
                              default: K(() => [
                                W(
                                  "div",
                                  ft,
                                  Z(Q(wa)("setting.dataSettings")),
                                  1,
                                ),
                                H(
                                  f,
                                  {
                                    id: "AsyncData",
                                    label: t.$t("env.env.req.dataAsync"),
                                  },
                                  {
                                    default: K(() => [
                                      W("div", gt, [
                                        W("div", vt, [
                                          W(
                                            "p",
                                            bt,
                                            Z(
                                              t.$t("env.env.req.dataAsyncTips"),
                                            ),
                                            1,
                                          ),
                                          H(
                                            c,
                                            {
                                              modelValue:
                                                Q(gi).dataConfigOption,
                                              "onUpdate:modelValue":
                                                a[0] ||
                                                (a[0] = (e) =>
                                                  (Q(gi).dataConfigOption = e)),
                                            },
                                            {
                                              default: K(() => [
                                                (j(!0),
                                                z(
                                                  Y,
                                                  null,
                                                  J(
                                                    Q(te),
                                                    (e, l) => (
                                                      j(),
                                                      X(
                                                        u,
                                                        {
                                                          key: e,
                                                          content: na.value,
                                                          disabled: Q(le)(
                                                            Q(ae)
                                                              .CLOUD_DATA_SYNC,
                                                            !1,
                                                          ),
                                                          placement: "top",
                                                        },
                                                        {
                                                          default: K(() => [
                                                            H(
                                                              d,
                                                              {
                                                                onChange: (t) =>
                                                                  (function (
                                                                    e,
                                                                    t,
                                                                  ) {
                                                                    t ==
                                                                      te.Extensions &&
                                                                      e &&
                                                                      ge(() => {
                                                                        gi.value.dataConfigOption =
                                                                          gi.value.dataConfigOption.filter(
                                                                            (
                                                                              e,
                                                                            ) =>
                                                                              e !==
                                                                              $.Extensions,
                                                                          );
                                                                      });
                                                                  })(t, e),
                                                                disabled: !Q(
                                                                  le,
                                                                )(
                                                                  Q(ae)
                                                                    .CLOUD_DATA_SYNC,
                                                                  !1,
                                                                ),
                                                                label: t.$t(e),
                                                                value: Q($)[l],
                                                              },
                                                              {
                                                                default: K(
                                                                  () => [
                                                                    W(
                                                                      "div",
                                                                      null,
                                                                      [
                                                                        ie(
                                                                          Z(
                                                                            Q(
                                                                              wa,
                                                                            )(
                                                                              e,
                                                                            ),
                                                                          ) +
                                                                            " ",
                                                                          1,
                                                                        ),
                                                                        e ===
                                                                        Q(te)
                                                                          .Extensions
                                                                          ? (j(),
                                                                            X(
                                                                              Pe,
                                                                              {
                                                                                key: 0,
                                                                                content:
                                                                                  Q(
                                                                                    wa,
                                                                                  )(
                                                                                    "env.env.req.sync_warning",
                                                                                  ),
                                                                                "icon-class":
                                                                                  "tw-align-bottom tw-ml-[4px]",
                                                                                icon: "icon-tips",
                                                                              },
                                                                              null,
                                                                              8,
                                                                              [
                                                                                "content",
                                                                              ],
                                                                            ))
                                                                          : oe(
                                                                              "",
                                                                              !0,
                                                                            ),
                                                                      ],
                                                                    ),
                                                                  ],
                                                                ),
                                                                _: 2,
                                                              },
                                                              1032,
                                                              [
                                                                "onChange",
                                                                "disabled",
                                                                "label",
                                                                "value",
                                                              ],
                                                            ),
                                                          ]),
                                                          _: 2,
                                                        },
                                                        1032,
                                                        ["content", "disabled"],
                                                      )
                                                    ),
                                                  ),
                                                  128,
                                                )),
                                              ]),
                                              _: 1,
                                            },
                                            8,
                                            ["modelValue"],
                                          ),
                                          H(
                                            We,
                                            {
                                              hidDivider: !0,
                                              modelValue: Q(gi),
                                              "onUpdate:modelValue":
                                                a[1] ||
                                                (a[1] = (e) =>
                                                  ne(gi)
                                                    ? (gi.value = e)
                                                    : (gi = e)),
                                              roleList: Ua.value,
                                              canUse: Q(le)(
                                                Q(ae).CLOUD_DATA_SYNC,
                                                !1,
                                              ),
                                            },
                                            null,
                                            8,
                                            [
                                              "modelValue",
                                              "roleList",
                                              "canUse",
                                            ],
                                          ),
                                        ]),
                                      ]),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                W("div", null, [
                                  H(
                                    Ze,
                                    {
                                      modelValue: Q(gi),
                                      "onUpdate:modelValue":
                                        a[2] ||
                                        (a[2] = (e) =>
                                          ne(gi) ? (gi.value = e) : (gi = e)),
                                      "is-global": !0,
                                      ref_key: "clearLocalDataRef",
                                      ref: Ma,
                                    },
                                    null,
                                    8,
                                    ["modelValue"],
                                  ),
                                ]),
                                H(v),
                                W(
                                  "div",
                                  Ct,
                                  Z(Q(wa)("setting.browserConfig")),
                                  1,
                                ),
                                H(
                                  f,
                                  {
                                    id: "BrowserSettings",
                                    label: t.$t("env.env.req.browserSettings"),
                                    style: { width: "fit-content" },
                                  },
                                  {
                                    default: K(() => [
                                      W("div", wt, [
                                        H(
                                          c,
                                          {
                                            modelValue:
                                              Q(gi).browserConfigOption,
                                            "onUpdate:modelValue":
                                              a[3] ||
                                              (a[3] = (e) =>
                                                (Q(gi).browserConfigOption =
                                                  e)),
                                          },
                                          {
                                            default: K(() => [
                                              (j(!0),
                                              z(
                                                Y,
                                                null,
                                                J(
                                                  Q(se),
                                                  (e, a) => (
                                                    j(),
                                                    z(
                                                      Y,
                                                      { key: e },
                                                      [
                                                        H(
                                                          u,
                                                          {
                                                            content: si(e),
                                                            disabled: ni(e),
                                                            placement: "top",
                                                          },
                                                          {
                                                            default: K(() => [
                                                              W("span", yt, [
                                                                H(
                                                                  d,
                                                                  {
                                                                    disabled:
                                                                      oi(e),
                                                                    value:
                                                                      Q(g)[a],
                                                                    id: e,
                                                                    onChange: (
                                                                      e,
                                                                    ) =>
                                                                      ((
                                                                        e,
                                                                        t,
                                                                        a,
                                                                      ) => {
                                                                        var i;
                                                                        const o =
                                                                          e ===
                                                                          g.expandSecurity;
                                                                        if (
                                                                          me.isClient ||
                                                                          !o ||
                                                                          !a ||
                                                                          li.value
                                                                        )
                                                                          return o
                                                                            ? null ==
                                                                              (i =
                                                                                _a.value)
                                                                              ? void 0
                                                                              : i.acceptParams(
                                                                                  {
                                                                                    content:
                                                                                      wa(
                                                                                        a
                                                                                          ? "expan.security.tip8"
                                                                                          : "expan.security.tip9",
                                                                                      ),
                                                                                    confirmText:
                                                                                      wa(
                                                                                        a
                                                                                          ? "base.confirmOpen"
                                                                                          : "base.confirmClose",
                                                                                      ),
                                                                                    confirmType:
                                                                                      "primary",
                                                                                    action:
                                                                                      a,
                                                                                    showExpandSecuritySkipSuperAdminSwitch:
                                                                                      !0,
                                                                                    expandSecuritySkipSuperAdmin:
                                                                                      gi
                                                                                        .value
                                                                                        .expandSecuritySkipSuperAdmin,
                                                                                    realtimeExpandSecuritySkipSuperAdmin:
                                                                                      !a,
                                                                                  },
                                                                                )
                                                                            : void (e !==
                                                                                g.disableDiskWrite ||
                                                                              !0 !==
                                                                                a
                                                                                ? !1 ===
                                                                                    a &&
                                                                                  l.includes(
                                                                                    e,
                                                                                  ) &&
                                                                                  gi.value.browserConfigOption.includes(
                                                                                    g.expandSecurity,
                                                                                  ) &&
                                                                                  ce
                                                                                    .confirm(
                                                                                      wa(
                                                                                        "expan.security.tip7",
                                                                                      ),
                                                                                      wa(
                                                                                        "env.env.shareDialog.operatorTips",
                                                                                      ),
                                                                                      {
                                                                                        cancelButtonText:
                                                                                          wa(
                                                                                            "base.cancel",
                                                                                          ),
                                                                                        confirmButtonText:
                                                                                          wa(
                                                                                            "base.confirm",
                                                                                          ),
                                                                                        type: "warning",
                                                                                      },
                                                                                    )
                                                                                    .then(
                                                                                      () => {
                                                                                        gi.value.browserConfigOption =
                                                                                          gi.value.browserConfigOption.filter(
                                                                                            (
                                                                                              e,
                                                                                            ) =>
                                                                                              e !==
                                                                                              g.expandSecurity,
                                                                                          );
                                                                                      },
                                                                                    )
                                                                                    .catch(
                                                                                      () => {
                                                                                        const t =
                                                                                          gi.value.browserConfigOption.includes(
                                                                                            e,
                                                                                          );
                                                                                        !1 ===
                                                                                          a &&
                                                                                        !1 ===
                                                                                          t
                                                                                          ? gi.value.browserConfigOption.push(
                                                                                              e,
                                                                                            )
                                                                                          : !0 ===
                                                                                              t &&
                                                                                            (gi.value.browserConfigOption =
                                                                                              gi.value.browserConfigOption.filter(
                                                                                                (
                                                                                                  t,
                                                                                                ) =>
                                                                                                  t !==
                                                                                                  e,
                                                                                              ));
                                                                                      },
                                                                                    )
                                                                                : ce
                                                                                    .confirm(
                                                                                      wa(
                                                                                        "env.env.req.disableDiskWriteConfirm",
                                                                                      ),
                                                                                      wa(
                                                                                        "env.env.shareDialog.operatorTips",
                                                                                      ),
                                                                                      {
                                                                                        cancelButtonText:
                                                                                          wa(
                                                                                            "base.cancel",
                                                                                          ),
                                                                                        confirmButtonText:
                                                                                          wa(
                                                                                            "base.confirm",
                                                                                          ),
                                                                                        type: "warning",
                                                                                      },
                                                                                    )
                                                                                    .catch(
                                                                                      () => {
                                                                                        gi.value.browserConfigOption =
                                                                                          gi.value.browserConfigOption.filter(
                                                                                            (
                                                                                              e,
                                                                                            ) =>
                                                                                              e !==
                                                                                              g.disableDiskWrite,
                                                                                          );
                                                                                      },
                                                                                    ));
                                                                        gi.value.browserConfigOption =
                                                                          gi.value.browserConfigOption.filter(
                                                                            (
                                                                              e,
                                                                            ) =>
                                                                              e !==
                                                                              g.expandSecurity,
                                                                          );
                                                                      })(
                                                                        Q(g)[a],
                                                                        0,
                                                                        e,
                                                                      ),
                                                                    class: re(
                                                                      `tw-flex tw-items-center tw-w-fit tw-mb-[5px] ${e}`,
                                                                    ),
                                                                  },
                                                                  {
                                                                    default: K(
                                                                      () => [
                                                                        ie(
                                                                          Z(
                                                                            t.$t(
                                                                              `env.env.req.${e}`,
                                                                            ),
                                                                          ) +
                                                                            " ",
                                                                          1,
                                                                        ),
                                                                        "expandSecurity" ===
                                                                        e
                                                                          ? (j(),
                                                                            X(
                                                                              et,
                                                                              {
                                                                                key: 0,
                                                                              },
                                                                            ))
                                                                          : oe(
                                                                              "",
                                                                              !0,
                                                                            ),
                                                                      ],
                                                                    ),
                                                                    _: 2,
                                                                  },
                                                                  1032,
                                                                  [
                                                                    "disabled",
                                                                    "value",
                                                                    "id",
                                                                    "onChange",
                                                                    "class",
                                                                  ],
                                                                ),
                                                              ]),
                                                            ]),
                                                            _: 2,
                                                          },
                                                          1032,
                                                          [
                                                            "content",
                                                            "disabled",
                                                          ],
                                                        ),
                                                        [
                                                          Q(se)
                                                            .randomFingerprint,
                                                          Q(se)
                                                            .disableShowPassword,
                                                        ].includes(e)
                                                          ? (j(), z("div", xt))
                                                          : oe("", !0),
                                                      ],
                                                      64,
                                                    )
                                                  ),
                                                ),
                                                128,
                                              )),
                                            ]),
                                            _: 1,
                                          },
                                          8,
                                          ["modelValue"],
                                        ),
                                      ]),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                H(
                                  f,
                                  {
                                    id: "EnvOverOpen",
                                    label: t.$t("setting.envOverOpen"),
                                  },
                                  {
                                    default: K(() => [
                                      H(Ye, null, {
                                        default: K(() => [
                                          W("div", Lt, [
                                            H(
                                              b,
                                              {
                                                modelValue:
                                                  Q(gi).envConfig
                                                    .envMutilOpenType,
                                                "onUpdate:modelValue":
                                                  a[4] ||
                                                  (a[4] = (e) =>
                                                    (Q(
                                                      gi,
                                                    ).envConfig.envMutilOpenType =
                                                      e)),
                                                disabled: !i.value,
                                              },
                                              null,
                                              8,
                                              ["modelValue", "disabled"],
                                            ),
                                            W(
                                              "span",
                                              kt,
                                              Z(t.$t("setting.envOverOpenTip")),
                                              1,
                                            ),
                                          ]),
                                        ]),
                                        _: 1,
                                      }),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                H(
                                  f,
                                  {
                                    id: "RemoteInspector",
                                    label: t.$t("setting.remoteInspector"),
                                  },
                                  {
                                    default: K(() => [
                                      H(Ye, null, {
                                        default: K(() => [
                                          W("div", ht, [
                                            H(
                                              b,
                                              {
                                                modelValue:
                                                  Q(gi).envConfig
                                                    .remoteInspectorType,
                                                "onUpdate:modelValue":
                                                  a[5] ||
                                                  (a[5] = (e) =>
                                                    (Q(
                                                      gi,
                                                    ).envConfig.remoteInspectorType =
                                                      e)),
                                                disabled: !i.value,
                                              },
                                              null,
                                              8,
                                              ["modelValue", "disabled"],
                                            ),
                                            W(
                                              "span",
                                              _t,
                                              Z(
                                                t.$t(
                                                  "setting.remoteInspectorTip",
                                                ),
                                              ),
                                              1,
                                            ),
                                          ]),
                                        ]),
                                        _: 1,
                                      }),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                H(
                                  f,
                                  {
                                    id: "BookMark",
                                    label: t.$t("setting.bookmarkConfig"),
                                  },
                                  {
                                    default: K(() => [
                                      W("div", Vt, [
                                        H(
                                          b,
                                          {
                                            modelValue:
                                              Q(gi).bookmarkConfig.status,
                                            "onUpdate:modelValue":
                                              a[6] ||
                                              (a[6] = (e) =>
                                                (Q(gi).bookmarkConfig.status =
                                                  e)),
                                            onChange: Ji,
                                            disabled: !i.value,
                                          },
                                          null,
                                          8,
                                          ["modelValue", "disabled"],
                                        ),
                                        W(
                                          "span",
                                          St,
                                          Z(t.$t("setting.uploadBookmarkTips")),
                                          1,
                                        ),
                                      ]),
                                      Q(gi).bookmarkConfig.status
                                        ? (j(),
                                          z("div", Ot, [
                                            H(
                                              u,
                                              {
                                                content: na.value,
                                                disabled: i.value,
                                                placement: "top",
                                              },
                                              {
                                                default: K(() => [
                                                  H(
                                                    f,
                                                    {
                                                      class:
                                                        "second-level-form-item",
                                                      "label-position": "left",
                                                      "label-width": oa,
                                                      label: t.$t(
                                                        "setting.bookmarkFile",
                                                      ),
                                                    },
                                                    {
                                                      default: K(() => {
                                                        var e, l, i, o, n;
                                                        return [
                                                          (
                                                            null ==
                                                            (l =
                                                              null ==
                                                              (e = Q(gi))
                                                                ? void 0
                                                                : e.bookmarkConfig)
                                                              ? void 0
                                                              : l.fileContent
                                                                  .length
                                                          )
                                                            ? (j(),
                                                              z("div", Dt, [
                                                                W("div", Nt, [
                                                                  W(
                                                                    "span",
                                                                    It,
                                                                    Z(
                                                                      null ==
                                                                        (i =
                                                                          Q(gi))
                                                                        ? void 0
                                                                        : i
                                                                            .bookmarkConfig
                                                                            .fileName,
                                                                    ),
                                                                    1,
                                                                  ),
                                                                  H(
                                                                    C,
                                                                    {
                                                                      link: "",
                                                                      type: "info",
                                                                      onClick:
                                                                        Si,
                                                                    },
                                                                    {
                                                                      default:
                                                                        K(
                                                                          () => [
                                                                            ...(a[61] ||
                                                                              (a[61] =
                                                                                [
                                                                                  W(
                                                                                    "i",
                                                                                    {
                                                                                      class:
                                                                                        "iconfont icon-fail",
                                                                                    },
                                                                                    null,
                                                                                    -1,
                                                                                  ),
                                                                                ])),
                                                                          ],
                                                                        ),
                                                                      _: 1,
                                                                    },
                                                                  ),
                                                                ]),
                                                                W("div", $t, [
                                                                  H(
                                                                    w,
                                                                    {
                                                                      data:
                                                                        null ==
                                                                        (n =
                                                                          null ==
                                                                          (o =
                                                                            Q(
                                                                              gi,
                                                                            ))
                                                                            ? void 0
                                                                            : o.bookmarkConfig)
                                                                          ? void 0
                                                                          : n.fileContent,
                                                                      props: Ni,
                                                                    },
                                                                    null,
                                                                    8,
                                                                    ["data"],
                                                                  ),
                                                                ]),
                                                              ]))
                                                            : (j(),
                                                              z("div", Tt, [
                                                                H(
                                                                  C,
                                                                  {
                                                                    type: "primary",
                                                                    plain: "",
                                                                    onClick: Oi,
                                                                  },
                                                                  {
                                                                    default: K(
                                                                      () => [
                                                                        ie(
                                                                          Z(
                                                                            t.$t(
                                                                              "setting.uploadBtnText",
                                                                            ),
                                                                          ),
                                                                          1,
                                                                        ),
                                                                      ],
                                                                    ),
                                                                    _: 1,
                                                                  },
                                                                ),
                                                                W(
                                                                  "p",
                                                                  Et,
                                                                  Z(
                                                                    t.$t(
                                                                      "setting.uploadFileFormat",
                                                                    ),
                                                                  ),
                                                                  1,
                                                                ),
                                                                M(
                                                                  W(
                                                                    "p",
                                                                    {
                                                                      class:
                                                                        "!tw-mb-[0px] !tw-text-[12px] !tw-text-[#ea362d]",
                                                                    },
                                                                    Z(
                                                                      t.$t(
                                                                        "env.env.req.fileHolder",
                                                                      ),
                                                                    ),
                                                                    513,
                                                                  ),
                                                                  [
                                                                    [
                                                                      ue,
                                                                      Yi.value &&
                                                                        Ga.value,
                                                                    ],
                                                                  ],
                                                                ),
                                                              ])),
                                                        ];
                                                      }),
                                                      _: 1,
                                                    },
                                                    8,
                                                    ["label"],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["content", "disabled"],
                                            ),
                                            H(
                                              f,
                                              {
                                                label: t.$t(
                                                  "setting.effectiveMethod",
                                                ),
                                                "label-position": "left",
                                                "label-width": oa,
                                                class: "second-level-form-item",
                                              },
                                              {
                                                default: K(() => [
                                                  H(
                                                    x,
                                                    {
                                                      modelValue:
                                                        Q(gi).bookmarkConfig
                                                          .type,
                                                      "onUpdate:modelValue":
                                                        a[7] ||
                                                        (a[7] = (e) =>
                                                          (Q(
                                                            gi,
                                                          ).bookmarkConfig.type =
                                                            e)),
                                                      onChange:
                                                        a[8] ||
                                                        (a[8] = (e) =>
                                                          (Ga.value = !0)),
                                                    },
                                                    {
                                                      default: K(() => [
                                                        H(
                                                          y,
                                                          {
                                                            value: Q(n).APPEND,
                                                          },
                                                          {
                                                            default: K(() => [
                                                              ie(
                                                                Z(
                                                                  t.$t(
                                                                    "setting.append",
                                                                  ),
                                                                ),
                                                                1,
                                                              ),
                                                            ]),
                                                            _: 1,
                                                          },
                                                          8,
                                                          ["value"],
                                                        ),
                                                        H(
                                                          y,
                                                          { value: Q(n).COVER },
                                                          {
                                                            default: K(() => [
                                                              ie(
                                                                Z(
                                                                  t.$t(
                                                                    "env.env.batchRemark.cover",
                                                                  ),
                                                                ),
                                                                1,
                                                              ),
                                                            ]),
                                                            _: 1,
                                                          },
                                                          8,
                                                          ["value"],
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
                                              ["label"],
                                            ),
                                            Q(gi).bookmarkConfig.type ===
                                            Q(n).COVER
                                              ? (j(),
                                                X(
                                                  f,
                                                  {
                                                    key: 0,
                                                    class:
                                                      "second-level-form-item",
                                                    "label-position": "left",
                                                    "label-width": oa,
                                                    label: t.$t(
                                                      "setting.replaceRules",
                                                    ),
                                                  },
                                                  {
                                                    default: K(() => [
                                                      H(
                                                        k,
                                                        {
                                                          modelValue:
                                                            Q(gi).bookmarkConfig
                                                              .coverRule,
                                                          "onUpdate:modelValue":
                                                            a[9] ||
                                                            (a[9] = (e) =>
                                                              (Q(
                                                                gi,
                                                              ).bookmarkConfig.coverRule =
                                                                e)),
                                                          class:
                                                            "tw-max-w-[500px]",
                                                          onChange:
                                                            a[10] ||
                                                            (a[10] = (e) =>
                                                              (Ga.value = !0)),
                                                        },
                                                        {
                                                          default: K(() => [
                                                            H(
                                                              L,
                                                              {
                                                                label: Q(wa)(
                                                                  "setting.bookmarksCover1",
                                                                ),
                                                                value:
                                                                  Q(o).Cover,
                                                              },
                                                              null,
                                                              8,
                                                              [
                                                                "label",
                                                                "value",
                                                              ],
                                                            ),
                                                            H(
                                                              L,
                                                              {
                                                                label: Q(wa)(
                                                                  "setting.bookmarksCover2",
                                                                ),
                                                                value:
                                                                  Q(o).CLEAR,
                                                              },
                                                              null,
                                                              8,
                                                              [
                                                                "label",
                                                                "value",
                                                              ],
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
                                                  ["label"],
                                                ))
                                              : oe("", !0),
                                            H(
                                              f,
                                              {
                                                "label-position": "left",
                                                "label-width": oa,
                                                prop: "bookmarkConfig.envGroupIds",
                                                class:
                                                  "!tw-mb-[0px] second-level-form-item",
                                                label: t.$t(
                                                  "setting.bookmarksGroup",
                                                ),
                                                for: "-",
                                              },
                                              {
                                                default: K(() => [
                                                  H(
                                                    k,
                                                    {
                                                      modelValue:
                                                        Q(gi).bookmarkConfig
                                                          .envGroupIds,
                                                      "onUpdate:modelValue":
                                                        a[11] ||
                                                        (a[11] = (e) =>
                                                          (Q(
                                                            gi,
                                                          ).bookmarkConfig.envGroupIds =
                                                            e)),
                                                      "max-collapse-tags": 2,
                                                      class:
                                                        "tw-max-w-[500px] select-pro",
                                                      "collapse-tags": "",
                                                      "collapse-tags-tooltip":
                                                        "",
                                                      multiple: "",
                                                      "popper-class":
                                                        "tw-max-w-[500px]",
                                                      onChange:
                                                        a[12] ||
                                                        (a[12] = (e) =>
                                                          Fi(
                                                            e,
                                                            Q(gi)
                                                              .bookmarkConfig,
                                                            "envGroupIds",
                                                          )),
                                                    },
                                                    {
                                                      default: K(() => [
                                                        (j(!0),
                                                        z(
                                                          Y,
                                                          null,
                                                          J(
                                                            Fa.value,
                                                            (e) => (
                                                              j(),
                                                              X(
                                                                L,
                                                                {
                                                                  key: e.label,
                                                                  label:
                                                                    e.label,
                                                                  value:
                                                                    e.value,
                                                                  class:
                                                                    "tw-w-inherit",
                                                                },
                                                                {
                                                                  default: K(
                                                                    () => [
                                                                      W(
                                                                        "span",
                                                                        Rt,
                                                                        Z(
                                                                          e.label,
                                                                        ),
                                                                        1,
                                                                      ),
                                                                    ],
                                                                  ),
                                                                  _: 2,
                                                                },
                                                                1032,
                                                                [
                                                                  "label",
                                                                  "value",
                                                                ],
                                                              )
                                                            ),
                                                          ),
                                                          128,
                                                        )),
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
                                              ["label"],
                                            ),
                                          ]))
                                        : oe("", !0),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                M(
                                  W(
                                    "div",
                                    null,
                                    [
                                      H(
                                        f,
                                        {
                                          id: "CookieEncrypt",
                                          label: t.$t("setting.cookieEncrypt"),
                                        },
                                        {
                                          default: K(() => [
                                            H(
                                              u,
                                              {
                                                content: na.value,
                                                disabled: Q(le)(
                                                  Q(ae).ENV_COOKIE_ENCRYPT,
                                                  !1,
                                                ),
                                                placement: "top",
                                              },
                                              {
                                                default: K(() => [
                                                  W("label", At, [
                                                    H(
                                                      b,
                                                      {
                                                        modelValue:
                                                          Q(gi)
                                                            .cookieEncryptConfig
                                                            .status,
                                                        "onUpdate:modelValue":
                                                          a[13] ||
                                                          (a[13] = (e) =>
                                                            (Q(
                                                              gi,
                                                            ).cookieEncryptConfig.status =
                                                              e)),
                                                        disabled: !Q(le)(
                                                          Q(ae)
                                                            .ENV_COOKIE_ENCRYPT,
                                                          !1,
                                                        ),
                                                        onChange: zi,
                                                      },
                                                      null,
                                                      8,
                                                      [
                                                        "modelValue",
                                                        "disabled",
                                                      ],
                                                    ),
                                                    W(
                                                      "span",
                                                      Ut,
                                                      Z(
                                                        t.$t(
                                                          "setting.cookieEncryptTip",
                                                        ),
                                                      ),
                                                      1,
                                                    ),
                                                  ]),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["content", "disabled"],
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["label"],
                                      ),
                                    ],
                                    512,
                                  ),
                                  [[ue, !1]],
                                ),
                                Q(gi).cookieEncryptConfig.status
                                  ? M(
                                      (j(),
                                      z(
                                        "div",
                                        qt,
                                        [
                                          W("div", Bt, [
                                            H(
                                              u,
                                              {
                                                content: na.value,
                                                disabled: Q(le)(
                                                  Q(ae).ENV_COOKIE_ENCRYPT,
                                                  !1,
                                                ),
                                                placement: "top",
                                              },
                                              {
                                                default: K(() => [
                                                  H(
                                                    C,
                                                    {
                                                      disabled: !Q(le)(
                                                        Q(ae)
                                                          .ENV_COOKIE_ENCRYPT,
                                                        !1,
                                                      ),
                                                      type: "info",
                                                      onClick:
                                                        a[14] ||
                                                        (a[14] = () =>
                                                          Wi("all")),
                                                    },
                                                    {
                                                      default: K(() => [
                                                        ie(
                                                          Z(
                                                            t.$t(
                                                              "env.cookie.allOperation",
                                                            ),
                                                          ),
                                                          1,
                                                        ),
                                                      ]),
                                                      _: 1,
                                                    },
                                                    8,
                                                    ["disabled"],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["content", "disabled"],
                                            ),
                                            H(
                                              u,
                                              {
                                                content: na.value,
                                                disabled: Q(le)(
                                                  Q(ae).ENV_COOKIE_ENCRYPT,
                                                  !1,
                                                ),
                                                placement: "top",
                                              },
                                              {
                                                default: K(() => [
                                                  H(
                                                    C,
                                                    {
                                                      disabled: !Q(le)(
                                                        Q(ae)
                                                          .ENV_COOKIE_ENCRYPT,
                                                        !1,
                                                      ),
                                                      type: "info",
                                                      onClick:
                                                        a[15] ||
                                                        (a[15] = () =>
                                                          Wi("part")),
                                                    },
                                                    {
                                                      default: K(() => [
                                                        ie(
                                                          Z(
                                                            t.$t(
                                                              "env.cookie.partOperation",
                                                            ),
                                                          ),
                                                          1,
                                                        ),
                                                      ]),
                                                      _: 1,
                                                    },
                                                    8,
                                                    ["disabled"],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["content", "disabled"],
                                            ),
                                            W(
                                              "span",
                                              Ft,
                                              Z(
                                                t.$t(
                                                  "env.cookie.encryptedNum",
                                                  { num: Pa.value },
                                                ),
                                              ),
                                              1,
                                            ),
                                          ]),
                                          W("div", Gt, [
                                            H(
                                              u,
                                              {
                                                content: na.value,
                                                disabled: Q(le)(
                                                  Q(ae).ENV_COOKIE_ENCRYPT,
                                                  !1,
                                                ),
                                                placement: "top",
                                              },
                                              {
                                                default: K(() => [
                                                  H(
                                                    d,
                                                    {
                                                      disabled: !Q(le)(
                                                        Q(ae)
                                                          .ENV_COOKIE_ENCRYPT,
                                                        !1,
                                                      ),
                                                      modelValue:
                                                        Q(gi)
                                                          .cookieEncryptConfig
                                                          .newAdd,
                                                      "onUpdate:modelValue":
                                                        a[16] ||
                                                        (a[16] = (e) =>
                                                          (Q(
                                                            gi,
                                                          ).cookieEncryptConfig.newAdd =
                                                            e)),
                                                      label: t.$t(
                                                        "env.cookie.autoEncrypt",
                                                      ),
                                                      onChange:
                                                        a[17] ||
                                                        (a[17] = (e) => {
                                                          return (
                                                            (t = e),
                                                            Ta.updateOrgConfigData(
                                                              {
                                                                cookieEncryptConfig:
                                                                  {
                                                                    status: !0,
                                                                    newAdd: t,
                                                                  },
                                                              },
                                                            ),
                                                            void ke.success(
                                                              wa(
                                                                "env.env.shareDialog.operatorSuccess",
                                                              ),
                                                            )
                                                          );
                                                          var t;
                                                        }),
                                                    },
                                                    null,
                                                    8,
                                                    [
                                                      "disabled",
                                                      "modelValue",
                                                      "label",
                                                    ],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["content", "disabled"],
                                            ),
                                          ]),
                                        ],
                                        512,
                                      )),
                                      [[ue, !1]],
                                    )
                                  : oe("", !0),
                                H(
                                  f,
                                  {
                                    label: t.$t(
                                      "setting.local_network_access_title",
                                    ),
                                  },
                                  {
                                    default: K(() => [
                                      W("div", Pt, [
                                        H(
                                          b,
                                          {
                                            modelValue:
                                              Q(gi).localNetworkConfig.status,
                                            "onUpdate:modelValue":
                                              a[18] ||
                                              (a[18] = (e) =>
                                                (Q(
                                                  gi,
                                                ).localNetworkConfig.status =
                                                  e)),
                                            disabled: !i.value || Q(Ea).isFree,
                                          },
                                          null,
                                          8,
                                          ["modelValue", "disabled"],
                                        ),
                                        W(
                                          "span",
                                          Mt,
                                          Z(
                                            t.$t(
                                              "setting.local_network_access_description",
                                            ),
                                          ),
                                          1,
                                        ),
                                      ]),
                                      Q(gi).localNetworkConfig.status
                                        ? (j(),
                                          z("div", jt, [
                                            H(
                                              f,
                                              {
                                                prop: "localNetworkConfig.urls",
                                                class: "second-level-form-item",
                                                label:
                                                  Q(wa)("setting.domainList"),
                                                "label-position": "left",
                                                "label-width": oa,
                                              },
                                              {
                                                default: K(() => [
                                                  H(
                                                    h,
                                                    {
                                                      modelValue:
                                                        Q(gi).localNetworkConfig
                                                          .urls,
                                                      "onUpdate:modelValue":
                                                        a[19] ||
                                                        (a[19] = (e) =>
                                                          (Q(
                                                            gi,
                                                          ).localNetworkConfig.urls =
                                                            e)),
                                                      autosize: {
                                                        minRows: 3,
                                                        maxRows: 5,
                                                      },
                                                      placeholder: Q(wa)(
                                                        "setting.local_network_access_input_placeholder",
                                                      ),
                                                      autocomplete: "off",
                                                      class: "tw-max-w-[500px]",
                                                      spellcheck: "false",
                                                      style: { width: "100%" },
                                                      type: "textarea",
                                                      onBlur: Bi,
                                                    },
                                                    null,
                                                    8,
                                                    [
                                                      "modelValue",
                                                      "placeholder",
                                                    ],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["label"],
                                            ),
                                          ]))
                                        : oe("", !0),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                H(
                                  f,
                                  {
                                    id: "browserIdentity",
                                    label: t.$t("setting.browserIdentity"),
                                  },
                                  {
                                    default: K(() => [
                                      W("div", zt, [
                                        H(
                                          b,
                                          {
                                            modelValue:
                                              Q(gi).browserShowRuleConfig
                                                .status,
                                            "onUpdate:modelValue":
                                              a[20] ||
                                              (a[20] = (e) =>
                                                (Q(
                                                  gi,
                                                ).browserShowRuleConfig.status =
                                                  e)),
                                            disabled: !i.value || Q(Ea).isFree,
                                          },
                                          null,
                                          8,
                                          ["modelValue", "disabled"],
                                        ),
                                        W(
                                          "span",
                                          Wt,
                                          Z(t.$t("setting.pageIndexOpenTip")),
                                          1,
                                        ),
                                      ]),
                                      Q(gi).browserShowRuleConfig.status
                                        ? (j(),
                                          z("div", Ht, [
                                            H(
                                              f,
                                              {
                                                class: "second-level-form-item",
                                                label: t.$t(
                                                  "setting.pageIndexRules",
                                                ),
                                                "label-position": "left",
                                                "label-width": oa,
                                              },
                                              {
                                                default: K(() => [
                                                  H(
                                                    u,
                                                    {
                                                      content: na.value,
                                                      disabled: i.value,
                                                      placement: "top",
                                                    },
                                                    {
                                                      default: K(() => [
                                                        W("div", Kt, [
                                                          H(
                                                            k,
                                                            {
                                                              modelValue:
                                                                Q(gi)
                                                                  .browserShowRuleConfig
                                                                  .envLabel,
                                                              "onUpdate:modelValue":
                                                                a[21] ||
                                                                (a[21] = (e) =>
                                                                  (Q(
                                                                    gi,
                                                                  ).browserShowRuleConfig.envLabel =
                                                                    e)),
                                                              controls: !1,
                                                              disabled:
                                                                !i.value,
                                                              class:
                                                                "tw-w-[100%]",
                                                            },
                                                            {
                                                              default: K(() => [
                                                                (j(!0),
                                                                z(
                                                                  Y,
                                                                  null,
                                                                  J(
                                                                    Q(at),
                                                                    (e) => (
                                                                      j(),
                                                                      X(
                                                                        L,
                                                                        {
                                                                          key: e.value,
                                                                          label:
                                                                            e.label,
                                                                          value:
                                                                            e.value,
                                                                        },
                                                                        null,
                                                                        8,
                                                                        [
                                                                          "label",
                                                                          "value",
                                                                        ],
                                                                      )
                                                                    ),
                                                                  ),
                                                                  128,
                                                                )),
                                                              ]),
                                                              _: 1,
                                                            },
                                                            8,
                                                            [
                                                              "modelValue",
                                                              "disabled",
                                                            ],
                                                          ),
                                                          H(
                                                            u,
                                                            {
                                                              effect: "dark",
                                                              placement:
                                                                "right",
                                                              "popper-class":
                                                                "!tw-text-[var(--tip-text-color)]",
                                                            },
                                                            {
                                                              content: K(() => [
                                                                W(
                                                                  "div",
                                                                  Yt,
                                                                  Z(
                                                                    Q(wa)(
                                                                      "setting.browserIdentityTitle",
                                                                    ),
                                                                  ),
                                                                  1,
                                                                ),
                                                                W("div", Jt, [
                                                                  H(
                                                                    S,
                                                                    {
                                                                      size: "20",
                                                                    },
                                                                    {
                                                                      default:
                                                                        K(
                                                                          () => [
                                                                            H(
                                                                              _,
                                                                            ),
                                                                          ],
                                                                        ),
                                                                      _: 1,
                                                                    },
                                                                  ),
                                                                  H(
                                                                    S,
                                                                    {
                                                                      size: "20",
                                                                    },
                                                                    {
                                                                      default:
                                                                        K(
                                                                          () => [
                                                                            H(
                                                                              O,
                                                                            ),
                                                                          ],
                                                                        ),
                                                                      _: 1,
                                                                    },
                                                                  ),
                                                                  H(
                                                                    S,
                                                                    {
                                                                      size: "20",
                                                                    },
                                                                    {
                                                                      default:
                                                                        K(
                                                                          () => [
                                                                            H(
                                                                              T,
                                                                            ),
                                                                          ],
                                                                        ),
                                                                      _: 1,
                                                                    },
                                                                  ),
                                                                  a[62] ||
                                                                    (a[62] = W(
                                                                      "div",
                                                                      {
                                                                        class:
                                                                          "tw-w-[66px] tw-h-[14px] tw-rounded-[4px] tw-border-[1.5px] tw-border-[var(--primary-color)] tw-border-solid c-flex",
                                                                      },
                                                                      " xxxxx ",
                                                                      -1,
                                                                    )),
                                                                  a[63] ||
                                                                    (a[63] = W(
                                                                      "div",
                                                                      {
                                                                        class:
                                                                          "tw-w-[115px] tw-h-[14px] tw-rounded-[29px] tw-bg-[var(--btn-info-hover-color)] c-flex",
                                                                      },
                                                                      "https://official-ad",
                                                                      -1,
                                                                    )),
                                                                ]),
                                                                W(
                                                                  "div",
                                                                  Qt,
                                                                  Z(
                                                                    Q(wa)(
                                                                      "setting.browserIdentityBottomTitle",
                                                                    ),
                                                                  ),
                                                                  1,
                                                                ),
                                                                a[64] ||
                                                                  (a[64] = W(
                                                                    "div",
                                                                    {
                                                                      class:
                                                                        "tw-w-[285px] tw-h-[74px] tw-rounded-[8px] tw-bg-[var(--table-tr-bg-color)] c-flex",
                                                                    },
                                                                    [
                                                                      W("img", {
                                                                        class:
                                                                          "tw-w-[46px]",
                                                                        src: lt,
                                                                      }),
                                                                    ],
                                                                    -1,
                                                                  )),
                                                              ]),
                                                              default: K(() => [
                                                                a[65] ||
                                                                  (a[65] = W(
                                                                    "i",
                                                                    {
                                                                      class:
                                                                        "iconfont icon-help-circle icon-help-circle1 tw-ml-[6px]",
                                                                    },
                                                                    null,
                                                                    -1,
                                                                  )),
                                                              ]),
                                                              _: 1,
                                                            },
                                                          ),
                                                        ]),
                                                      ]),
                                                      _: 1,
                                                    },
                                                    8,
                                                    ["content", "disabled"],
                                                  ),
                                                  W(
                                                    "div",
                                                    Xt,
                                                    Z(
                                                      Q(wa)(
                                                        "setting.browserIdentityTip",
                                                      ),
                                                    ),
                                                    1,
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["label"],
                                            ),
                                          ]))
                                        : oe("", !0),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                H(v),
                                W(
                                  "div",
                                  Zt,
                                  Z(Q(wa)("setting.envSettings")),
                                  1,
                                ),
                                H(
                                  f,
                                  {
                                    id: "profileFieldConfig",
                                    label: Q(wa)("setting.profileFieldConfig"),
                                  },
                                  {
                                    default: K(() => [
                                      H(
                                        u,
                                        {
                                          content: na.value,
                                          disabled: i.value,
                                          placement: "top",
                                        },
                                        {
                                          default: K(() => [
                                            W("div", el, [
                                              H(
                                                b,
                                                {
                                                  modelValue:
                                                    Q(gi).envTitleConfig.status,
                                                  "onUpdate:modelValue":
                                                    a[22] ||
                                                    (a[22] = (e) =>
                                                      (Q(
                                                        gi,
                                                      ).envTitleConfig.status =
                                                        e)),
                                                  disabled: !i.value,
                                                },
                                                null,
                                                8,
                                                ["modelValue", "disabled"],
                                              ),
                                              W(
                                                "span",
                                                tl,
                                                Z(
                                                  Q(wa)(
                                                    "setting.profileFieldConfigTip1",
                                                  ),
                                                ),
                                                1,
                                              ),
                                            ]),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["content", "disabled"],
                                      ),
                                      Q(gi).envTitleConfig.status
                                        ? (j(),
                                          z("div", ll, [
                                            W("span", al, [
                                              ie(
                                                Z(
                                                  Q(wa)(
                                                    "setting.profileFieldConfigTip2",
                                                  ) + Q(Xa),
                                                ) + " ",
                                                1,
                                              ),
                                              H(
                                                C,
                                                {
                                                  type: "primary",
                                                  link: "",
                                                  onClick:
                                                    a[23] ||
                                                    (a[23] = (e) =>
                                                      (xa.value = !0)),
                                                  disabled: !i.value,
                                                },
                                                {
                                                  default: K(() => [
                                                    ie(
                                                      Z(Q(wa)("base.edit")),
                                                      1,
                                                    ),
                                                  ]),
                                                  _: 1,
                                                },
                                                8,
                                                ["disabled"],
                                              ),
                                            ]),
                                            H(
                                              f,
                                              {
                                                class:
                                                  "second-level-form-item tw-mt-[10px]",
                                                prop: "envTitleConfig.memberGroupList",
                                                label: Q(wa)(
                                                  "setting.accessLimitLabel3",
                                                ),
                                                "label-position": "left",
                                                "label-width": oa,
                                              },
                                              {
                                                default: K(() => [
                                                  H(
                                                    k,
                                                    {
                                                      modelValue:
                                                        Q(gi).envTitleConfig
                                                          .memberGroupList,
                                                      "onUpdate:modelValue":
                                                        a[24] ||
                                                        (a[24] = (e) =>
                                                          (Q(
                                                            gi,
                                                          ).envTitleConfig.memberGroupList =
                                                            e)),
                                                      "max-collapse-tags": 2,
                                                      class:
                                                        "tw-max-w-[500px] select-pro",
                                                      "collapse-tags": "",
                                                      "collapse-tags-tooltip":
                                                        "",
                                                      multiple: "",
                                                      disabled: !i.value,
                                                      onChange: Pi,
                                                    },
                                                    {
                                                      default: K(() => [
                                                        H(
                                                          L,
                                                          {
                                                            key: "all",
                                                            label: t.$t(
                                                              "org.member.req.allGroup",
                                                            ),
                                                            value: "all",
                                                          },
                                                          {
                                                            default: K(() => [
                                                              ie(
                                                                Z(
                                                                  Q(wa)(
                                                                    "org.member.req.allGroup",
                                                                  ),
                                                                ),
                                                                1,
                                                              ),
                                                            ]),
                                                            _: 1,
                                                          },
                                                          8,
                                                          ["label"],
                                                        ),
                                                        (j(!0),
                                                        z(
                                                          Y,
                                                          null,
                                                          J(
                                                            qa.value,
                                                            (e) => (
                                                              j(),
                                                              X(
                                                                L,
                                                                {
                                                                  key: e.id,
                                                                  label: e.name,
                                                                  value: e.id,
                                                                  class:
                                                                    "tw-w-inherit",
                                                                },
                                                                {
                                                                  default: K(
                                                                    () => [
                                                                      W(
                                                                        "span",
                                                                        il,
                                                                        Z(
                                                                          e.name,
                                                                        ),
                                                                        1,
                                                                      ),
                                                                    ],
                                                                  ),
                                                                  _: 2,
                                                                },
                                                                1032,
                                                                [
                                                                  "label",
                                                                  "value",
                                                                ],
                                                              )
                                                            ),
                                                          ),
                                                          128,
                                                        )),
                                                      ]),
                                                      _: 1,
                                                    },
                                                    8,
                                                    ["modelValue", "disabled"],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["label"],
                                            ),
                                          ]))
                                        : oe("", !0),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                H(
                                  f,
                                  {
                                    id: "envSort",
                                    label: t.$t("setting.env_list_sorting"),
                                  },
                                  {
                                    default: K(() => [
                                      H(
                                        u,
                                        {
                                          content: na.value,
                                          disabled: i.value,
                                          placement: "top",
                                        },
                                        {
                                          default: K(() => [
                                            W("div", ol, [
                                              H(
                                                b,
                                                {
                                                  modelValue:
                                                    Q(gi).envSortConfig.status,
                                                  "onUpdate:modelValue":
                                                    a[25] ||
                                                    (a[25] = (e) =>
                                                      (Q(
                                                        gi,
                                                      ).envSortConfig.status =
                                                        e)),
                                                  disabled: !i.value,
                                                },
                                                null,
                                                8,
                                                ["modelValue", "disabled"],
                                              ),
                                              W(
                                                "span",
                                                nl,
                                                Z(
                                                  t.$t(
                                                    "setting.enable_sorting",
                                                  ),
                                                ),
                                                1,
                                              ),
                                            ]),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["content", "disabled"],
                                      ),
                                      Q(gi).envSortConfig.status
                                        ? (j(),
                                          z("div", sl, [
                                            H(
                                              f,
                                              { "label-position": "right" },
                                              {
                                                default: K(() => [
                                                  W("div", rl, [
                                                    W(
                                                      "p",
                                                      ul,
                                                      Z(
                                                        t.$t(
                                                          "setting.sort_field",
                                                        ),
                                                      ),
                                                      1,
                                                    ),
                                                    W("div", dl, [
                                                      H(
                                                        k,
                                                        {
                                                          class: "tw-flex-1",
                                                          modelValue:
                                                            Q(gi).envSortConfig
                                                              .orderBy,
                                                          "onUpdate:modelValue":
                                                            a[26] ||
                                                            (a[26] = (e) =>
                                                              (Q(
                                                                gi,
                                                              ).envSortConfig.orderBy =
                                                                e)),
                                                          disabled: !i.value,
                                                        },
                                                        {
                                                          default: K(() => [
                                                            (j(!0),
                                                            z(
                                                              Y,
                                                              null,
                                                              J(
                                                                Q(Qa),
                                                                (e) => (
                                                                  j(),
                                                                  X(
                                                                    L,
                                                                    {
                                                                      key: e.value,
                                                                      label:
                                                                        e.label,
                                                                      value:
                                                                        e.value,
                                                                    },
                                                                    null,
                                                                    8,
                                                                    [
                                                                      "label",
                                                                      "value",
                                                                    ],
                                                                  )
                                                                ),
                                                              ),
                                                              128,
                                                            )),
                                                          ]),
                                                          _: 1,
                                                        },
                                                        8,
                                                        [
                                                          "modelValue",
                                                          "disabled",
                                                        ],
                                                      ),
                                                    ]),
                                                  ]),
                                                ]),
                                                _: 1,
                                              },
                                            ),
                                            H(
                                              f,
                                              { "label-position": "right" },
                                              {
                                                default: K(() => [
                                                  W("div", pl, [
                                                    W(
                                                      "p",
                                                      cl,
                                                      Z(
                                                        t.$t(
                                                          "setting.sort_order",
                                                        ),
                                                      ),
                                                      1,
                                                    ),
                                                    W("div", ml, [
                                                      H(
                                                        k,
                                                        {
                                                          class: "tw-flex-1",
                                                          modelValue:
                                                            Q(gi).envSortConfig
                                                              .sort,
                                                          "onUpdate:modelValue":
                                                            a[27] ||
                                                            (a[27] = (e) =>
                                                              (Q(
                                                                gi,
                                                              ).envSortConfig.sort =
                                                                e)),
                                                          disabled: !i.value,
                                                        },
                                                        {
                                                          default: K(() => [
                                                            H(
                                                              L,
                                                              {
                                                                value:
                                                                  Q(He).DESC,
                                                                label:
                                                                  Q(wa)(
                                                                    "setting.descending",
                                                                  ),
                                                              },
                                                              null,
                                                              8,
                                                              [
                                                                "value",
                                                                "label",
                                                              ],
                                                            ),
                                                            H(
                                                              L,
                                                              {
                                                                value:
                                                                  Q(He).ASC,
                                                                label:
                                                                  Q(wa)(
                                                                    "setting.ascending",
                                                                  ),
                                                              },
                                                              null,
                                                              8,
                                                              [
                                                                "value",
                                                                "label",
                                                              ],
                                                            ),
                                                          ]),
                                                          _: 1,
                                                        },
                                                        8,
                                                        [
                                                          "modelValue",
                                                          "disabled",
                                                        ],
                                                      ),
                                                    ]),
                                                  ]),
                                                ]),
                                                _: 1,
                                              },
                                            ),
                                          ]))
                                        : oe("", !0),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                H(
                                  f,
                                  {
                                    id: "profileFieldConfig",
                                    label: Q(wa)("setting.envPageConfig"),
                                  },
                                  {
                                    default: K(() => [
                                      H(
                                        u,
                                        {
                                          content: na.value,
                                          disabled: i.value,
                                          placement: "top",
                                        },
                                        {
                                          default: K(() => [
                                            W("div", fl, [
                                              H(
                                                b,
                                                {
                                                  modelValue:
                                                    Q(gi).envPageConfig.status,
                                                  "onUpdate:modelValue":
                                                    a[28] ||
                                                    (a[28] = (e) =>
                                                      (Q(
                                                        gi,
                                                      ).envPageConfig.status =
                                                        e)),
                                                  disabled: !i.value,
                                                },
                                                null,
                                                8,
                                                ["modelValue", "disabled"],
                                              ),
                                              W(
                                                "span",
                                                gl,
                                                Z(
                                                  Q(wa)(
                                                    "setting.envPageConfigTip",
                                                  ),
                                                ),
                                                1,
                                              ),
                                            ]),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["content", "disabled"],
                                      ),
                                      Q(gi).envPageConfig.status
                                        ? (j(),
                                          z("div", vl, [
                                            H(f, null, {
                                              default: K(() => [
                                                W("div", bl, [
                                                  W("p", Cl, [
                                                    ie(
                                                      Z(
                                                        Q(wa)(
                                                          "setting.pageSize",
                                                        ),
                                                      ),
                                                      1,
                                                    ),
                                                    H(
                                                      Pe,
                                                      {
                                                        content: Q(wa)(
                                                          "setting.pageSizeTip",
                                                        ),
                                                      },
                                                      null,
                                                      8,
                                                      ["content"],
                                                    ),
                                                  ]),
                                                  H(
                                                    k,
                                                    {
                                                      class: "tw-flex-1",
                                                      modelValue:
                                                        Q(gi).envPageConfig
                                                          .pageSize,
                                                      "onUpdate:modelValue":
                                                        a[29] ||
                                                        (a[29] = (e) =>
                                                          (Q(
                                                            gi,
                                                          ).envPageConfig.pageSize =
                                                            e)),
                                                      disabled: !i.value,
                                                    },
                                                    {
                                                      default: K(() => [
                                                        (j(!0),
                                                        z(
                                                          Y,
                                                          null,
                                                          J(
                                                            Q(Ya),
                                                            (e) => (
                                                              j(),
                                                              X(
                                                                L,
                                                                {
                                                                  key: e.value,
                                                                  label:
                                                                    e.label,
                                                                  value:
                                                                    e.value,
                                                                },
                                                                null,
                                                                8,
                                                                [
                                                                  "label",
                                                                  "value",
                                                                ],
                                                              )
                                                            ),
                                                          ),
                                                          128,
                                                        )),
                                                      ]),
                                                      _: 1,
                                                    },
                                                    8,
                                                    ["modelValue", "disabled"],
                                                  ),
                                                ]),
                                              ]),
                                              _: 1,
                                            }),
                                          ]))
                                        : oe("", !0),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                H(
                                  f,
                                  {
                                    id: "envOpenLimitConfig",
                                    label: Q(wa)("setting.envOpenLimitConfig"),
                                  },
                                  {
                                    default: K(() => [
                                      H(
                                        u,
                                        {
                                          content: na.value,
                                          disabled: i.value,
                                          placement: "top",
                                        },
                                        {
                                          default: K(() => [
                                            W("div", wl, [
                                              H(
                                                b,
                                                {
                                                  modelValue:
                                                    Q(gi).envOpenLimitConfig
                                                      .status,
                                                  "onUpdate:modelValue":
                                                    a[30] ||
                                                    (a[30] = (e) =>
                                                      (Q(
                                                        gi,
                                                      ).envOpenLimitConfig.status =
                                                        e)),
                                                  disabled: !i.value,
                                                },
                                                null,
                                                8,
                                                ["modelValue", "disabled"],
                                              ),
                                              W(
                                                "span",
                                                yl,
                                                Z(
                                                  Q(wa)(
                                                    "setting.envOpenLimitConfigTip",
                                                  ),
                                                ),
                                                1,
                                              ),
                                            ]),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["content", "disabled"],
                                      ),
                                      Q(gi).envOpenLimitConfig.status
                                        ? (j(),
                                          z("div", xl, [
                                            H(
                                              f,
                                              {
                                                class: "second-level-form-item",
                                                prop: "envOpenLimitConfig.openLimit",
                                                label: Q(wa)(
                                                  "setting.envOpenLimitCount",
                                                ),
                                                "label-position": "left",
                                                "label-width": oa,
                                              },
                                              {
                                                default: K(() => [
                                                  H(
                                                    E,
                                                    {
                                                      modelValue:
                                                        Q(gi).envOpenLimitConfig
                                                          .openLimit,
                                                      "onUpdate:modelValue":
                                                        a[31] ||
                                                        (a[31] = (e) =>
                                                          (Q(
                                                            gi,
                                                          ).envOpenLimitConfig.openLimit =
                                                            e)),
                                                      min: 1,
                                                      max: 100,
                                                      precision: 0,
                                                      disabled: !i.value,
                                                      controls: !1,
                                                    },
                                                    null,
                                                    8,
                                                    ["modelValue", "disabled"],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["label"],
                                            ),
                                            H(
                                              f,
                                              {
                                                class: "second-level-form-item",
                                                prop: "envOpenLimitConfig.memberGroupList",
                                                label: Q(wa)(
                                                  "setting.accessLimitLabel3",
                                                ),
                                                "label-position": "left",
                                                "label-width": oa,
                                              },
                                              {
                                                default: K(() => [
                                                  H(
                                                    k,
                                                    {
                                                      modelValue:
                                                        Q(gi).envOpenLimitConfig
                                                          .memberGroupList,
                                                      "onUpdate:modelValue":
                                                        a[32] ||
                                                        (a[32] = (e) =>
                                                          (Q(
                                                            gi,
                                                          ).envOpenLimitConfig.memberGroupList =
                                                            e)),
                                                      "max-collapse-tags": 2,
                                                      class:
                                                        "tw-max-w-[500px] select-pro",
                                                      "collapse-tags": "",
                                                      "collapse-tags-tooltip":
                                                        "",
                                                      multiple: "",
                                                      onChange: Gi,
                                                    },
                                                    {
                                                      default: K(() => [
                                                        H(
                                                          L,
                                                          {
                                                            key: "all",
                                                            label: t.$t(
                                                              "org.member.req.allGroup",
                                                            ),
                                                            value: "all",
                                                          },
                                                          {
                                                            default: K(() => [
                                                              ie(
                                                                Z(
                                                                  Q(wa)(
                                                                    "org.member.req.allGroup",
                                                                  ),
                                                                ),
                                                                1,
                                                              ),
                                                            ]),
                                                            _: 1,
                                                          },
                                                          8,
                                                          ["label"],
                                                        ),
                                                        (j(!0),
                                                        z(
                                                          Y,
                                                          null,
                                                          J(
                                                            Ba.value,
                                                            (e) => (
                                                              j(),
                                                              X(
                                                                L,
                                                                {
                                                                  key: e.id,
                                                                  label: e.name,
                                                                  value: e.id,
                                                                  class:
                                                                    "tw-w-inherit",
                                                                },
                                                                {
                                                                  default: K(
                                                                    () => [
                                                                      W(
                                                                        "span",
                                                                        Ll,
                                                                        Z(
                                                                          e.name,
                                                                        ),
                                                                        1,
                                                                      ),
                                                                    ],
                                                                  ),
                                                                  _: 2,
                                                                },
                                                                1032,
                                                                [
                                                                  "label",
                                                                  "value",
                                                                ],
                                                              )
                                                            ),
                                                          ),
                                                          128,
                                                        )),
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
                                              ["label"],
                                            ),
                                          ]))
                                        : oe("", !0),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                H(v),
                                W(
                                  "div",
                                  kl,
                                  Z(Q(wa)("setting.securitySettings")),
                                  1,
                                ),
                                W("div", null, [
                                  H(
                                    f,
                                    {
                                      id: "visitConfig",
                                      label: t.$t("setting.visitConfig"),
                                    },
                                    {
                                      default: K(() => [
                                        H(
                                          u,
                                          {
                                            content: na.value,
                                            disabled: i.value,
                                            placement: "top",
                                          },
                                          {
                                            default: K(() => [
                                              W("div", hl, [
                                                H(
                                                  b,
                                                  {
                                                    modelValue:
                                                      Q(gi).accessLimit.status,
                                                    "onUpdate:modelValue":
                                                      a[33] ||
                                                      (a[33] = (e) =>
                                                        (Q(
                                                          gi,
                                                        ).accessLimit.status =
                                                          e)),
                                                    disabled: !i.value,
                                                  },
                                                  null,
                                                  8,
                                                  ["modelValue", "disabled"],
                                                ),
                                                W(
                                                  "span",
                                                  _l,
                                                  Z(
                                                    t.$t(
                                                      "setting.accessLimitTip1",
                                                    ),
                                                  ),
                                                  1,
                                                ),
                                              ]),
                                            ]),
                                            _: 1,
                                          },
                                          8,
                                          ["content", "disabled"],
                                        ),
                                        Q(gi).accessLimit.status
                                          ? (j(),
                                            z("div", Vl, [
                                              H(
                                                f,
                                                {
                                                  class:
                                                    "second-level-form-item",
                                                  label: t.$t(
                                                    "setting.accessLimitLabel1",
                                                  ),
                                                  "label-position": "left",
                                                  "label-width": oa,
                                                },
                                                {
                                                  default: K(() => [
                                                    W("label", Sl, [
                                                      H(
                                                        x,
                                                        {
                                                          class: "tw-grid",
                                                          modelValue:
                                                            Q(gi).accessLimit
                                                              .type,
                                                          "onUpdate:modelValue":
                                                            a[34] ||
                                                            (a[34] = (e) =>
                                                              (Q(
                                                                gi,
                                                              ).accessLimit.type =
                                                                e)),
                                                        },
                                                        {
                                                          default: K(() => [
                                                            H(
                                                              y,
                                                              {
                                                                value: 1,
                                                                size: "large",
                                                              },
                                                              {
                                                                default: K(
                                                                  () => [
                                                                    ie(
                                                                      Z(
                                                                        t.$t(
                                                                          "setting.accessLimitRadio1",
                                                                        ),
                                                                      ),
                                                                      1,
                                                                    ),
                                                                  ],
                                                                ),
                                                                _: 1,
                                                              },
                                                            ),
                                                            H(
                                                              y,
                                                              {
                                                                value: 2,
                                                                size: "large",
                                                              },
                                                              {
                                                                default: K(
                                                                  () => [
                                                                    ie(
                                                                      Z(
                                                                        t.$t(
                                                                          "setting.accessLimitRadio2",
                                                                        ),
                                                                      ),
                                                                      1,
                                                                    ),
                                                                  ],
                                                                ),
                                                                _: 1,
                                                              },
                                                            ),
                                                          ]),
                                                          _: 1,
                                                        },
                                                        8,
                                                        ["modelValue"],
                                                      ),
                                                    ]),
                                                  ]),
                                                  _: 1,
                                                },
                                                8,
                                                ["label"],
                                              ),
                                              1 === Q(gi).accessLimit.type
                                                ? (j(),
                                                  X(
                                                    f,
                                                    {
                                                      key: 0,
                                                      class:
                                                        "second-level-form-item",
                                                      label: t.$t(
                                                        "env.env.req.quickSelection",
                                                      ),
                                                      "label-position": "left",
                                                      "label-width": oa,
                                                    },
                                                    {
                                                      default: K(() => [
                                                        H(
                                                          c,
                                                          {
                                                            modelValue:
                                                              Q(gi).accessLimit
                                                                .quickSelectionOption,
                                                            "onUpdate:modelValue":
                                                              a[35] ||
                                                              (a[35] = (e) =>
                                                                (Q(
                                                                  gi,
                                                                ).accessLimit.quickSelectionOption =
                                                                  e)),
                                                          },
                                                          {
                                                            default: K(() => [
                                                              (j(!0),
                                                              z(
                                                                Y,
                                                                null,
                                                                J(
                                                                  Q(de),
                                                                  (e, l) => (
                                                                    j(),
                                                                    X(
                                                                      d,
                                                                      {
                                                                        key: e,
                                                                        label:
                                                                          t.$t(
                                                                            e,
                                                                          ),
                                                                        value:
                                                                          Q(N)[
                                                                            l
                                                                          ],
                                                                      },
                                                                      null,
                                                                      8,
                                                                      [
                                                                        "label",
                                                                        "value",
                                                                      ],
                                                                    )
                                                                  ),
                                                                ),
                                                                128,
                                                              )),
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
                                                    ["label"],
                                                  ))
                                                : oe("", !0),
                                              H(
                                                f,
                                                {
                                                  prop: "accessLimit.urlList",
                                                  class:
                                                    "second-level-form-item",
                                                  label: t.$t(
                                                    "setting.accessLimitLabel2",
                                                  ),
                                                  "label-position": "left",
                                                  "label-width": oa,
                                                },
                                                {
                                                  default: K(() => [
                                                    H(
                                                      h,
                                                      {
                                                        modelValue:
                                                          Q(gi).accessLimit
                                                            .urlList,
                                                        "onUpdate:modelValue":
                                                          a[36] ||
                                                          (a[36] = (e) =>
                                                            (Q(
                                                              gi,
                                                            ).accessLimit.urlList =
                                                              e)),
                                                        autosize: {
                                                          minRows: 2,
                                                          maxRows: 5,
                                                        },
                                                        placeholder: Q(wa)(
                                                          "setting.accessLimitRules1",
                                                        ),
                                                        autocomplete: "off",
                                                        class:
                                                          "tw-max-w-[500px]",
                                                        spellcheck: "false",
                                                        style: {
                                                          width: "100%",
                                                        },
                                                        type: "textarea",
                                                        onChange: Ai,
                                                      },
                                                      null,
                                                      8,
                                                      [
                                                        "modelValue",
                                                        "placeholder",
                                                      ],
                                                    ),
                                                  ]),
                                                  _: 1,
                                                },
                                                8,
                                                ["label"],
                                              ),
                                              H(
                                                f,
                                                {
                                                  class:
                                                    "second-level-form-item",
                                                  prop: "accessLimit.memberMroupList",
                                                  label: t.$t(
                                                    "setting.accessLimitLabel3",
                                                  ),
                                                  "label-position": "left",
                                                  "label-width": oa,
                                                },
                                                {
                                                  default: K(() => [
                                                    H(
                                                      k,
                                                      {
                                                        modelValue:
                                                          Q(gi).accessLimit
                                                            .memberMroupList,
                                                        "onUpdate:modelValue":
                                                          a[37] ||
                                                          (a[37] = (e) =>
                                                            (Q(
                                                              gi,
                                                            ).accessLimit.memberMroupList =
                                                              e)),
                                                        "max-collapse-tags": 2,
                                                        class:
                                                          "tw-max-w-[500px] select-pro",
                                                        "collapse-tags": "",
                                                        "collapse-tags-tooltip":
                                                          "",
                                                        multiple: "",
                                                        onChange:
                                                          a[38] ||
                                                          (a[38] = (e) =>
                                                            Fi(
                                                              e,
                                                              Q(gi).accessLimit,
                                                              "memberMroupList",
                                                            )),
                                                      },
                                                      {
                                                        default: K(() => [
                                                          H(
                                                            L,
                                                            {
                                                              key: "all",
                                                              label: t.$t(
                                                                "org.member.req.allGroup",
                                                              ),
                                                              value: "all",
                                                            },
                                                            {
                                                              default: K(() => [
                                                                ie(
                                                                  Z(
                                                                    Q(wa)(
                                                                      "org.member.req.allGroup",
                                                                    ),
                                                                  ),
                                                                  1,
                                                                ),
                                                              ]),
                                                              _: 1,
                                                            },
                                                            8,
                                                            ["label"],
                                                          ),
                                                          (j(!0),
                                                          z(
                                                            Y,
                                                            null,
                                                            J(
                                                              Ua.value,
                                                              (e) => (
                                                                j(),
                                                                X(
                                                                  L,
                                                                  {
                                                                    key: e.id,
                                                                    label:
                                                                      e.name,
                                                                    value: e.id,
                                                                    class:
                                                                      "tw-w-inherit",
                                                                  },
                                                                  {
                                                                    default: K(
                                                                      () => [
                                                                        W(
                                                                          "span",
                                                                          Ol,
                                                                          Z(
                                                                            e.name,
                                                                          ),
                                                                          1,
                                                                        ),
                                                                      ],
                                                                    ),
                                                                    _: 2,
                                                                  },
                                                                  1032,
                                                                  [
                                                                    "label",
                                                                    "value",
                                                                  ],
                                                                )
                                                              ),
                                                            ),
                                                            128,
                                                          )),
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
                                                ["label"],
                                              ),
                                            ]))
                                          : oe("", !0),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["label"],
                                  ),
                                ]),
                                H(
                                  f,
                                  {
                                    id: "memberIpLimitConfig",
                                    label: t.$t("setting.memberIpLimitConfig"),
                                  },
                                  {
                                    default: K(() => [
                                      H(Ye, null, {
                                        default: K(() => [
                                          W("div", Tl, [
                                            H(
                                              b,
                                              {
                                                modelValue:
                                                  Q(gi).memberIpLimitConfig
                                                    .status,
                                                "onUpdate:modelValue":
                                                  a[39] ||
                                                  (a[39] = (e) =>
                                                    (Q(
                                                      gi,
                                                    ).memberIpLimitConfig.status =
                                                      e)),
                                                disabled:
                                                  !i.value || Q(Ea).isFree,
                                                onChange: Mi,
                                              },
                                              null,
                                              8,
                                              ["modelValue", "disabled"],
                                            ),
                                            W(
                                              "span",
                                              El,
                                              Z(
                                                t.$t(
                                                  "setting.memberIpLimitConfigTip",
                                                ),
                                              ),
                                              1,
                                            ),
                                            H(
                                              Pe,
                                              {
                                                content: t.$t(
                                                  "setting.softwareUpgradeTip",
                                                ),
                                              },
                                              null,
                                              8,
                                              ["content"],
                                            ),
                                          ]),
                                        ]),
                                        _: 1,
                                      }),
                                      Q(gi).memberIpLimitConfig.status
                                        ? (j(),
                                          z("div", Dl, [
                                            H(
                                              f,
                                              {
                                                label: t.$t(
                                                  "setting.accessLimitLabel1",
                                                ),
                                                class: "second-level-form-item",
                                                "label-position": "left",
                                                "label-width": oa,
                                              },
                                              {
                                                default: K(() => [
                                                  H(
                                                    x,
                                                    {
                                                      modelValue:
                                                        Q(gi)
                                                          .memberIpLimitConfig
                                                          .type,
                                                      "onUpdate:modelValue":
                                                        a[40] ||
                                                        (a[40] = (e) =>
                                                          (Q(
                                                            gi,
                                                          ).memberIpLimitConfig.type =
                                                            e)),
                                                      disabled: Be.value,
                                                    },
                                                    {
                                                      default: K(() => [
                                                        H(
                                                          y,
                                                          {
                                                            value: Q(e).BAN,
                                                            size: "large",
                                                          },
                                                          {
                                                            default: K(() => [
                                                              ie(
                                                                Z(
                                                                  t.$t(
                                                                    "setting.memberIpLimitBanDesc",
                                                                  ),
                                                                ),
                                                                1,
                                                              ),
                                                            ]),
                                                            _: 1,
                                                          },
                                                          8,
                                                          ["value"],
                                                        ),
                                                        H(
                                                          y,
                                                          {
                                                            value: Q(e).ALLOW,
                                                            size: "large",
                                                          },
                                                          {
                                                            default: K(() => [
                                                              ie(
                                                                Z(
                                                                  t.$t(
                                                                    "setting.memberIpLimitAllowDesc",
                                                                  ),
                                                                ),
                                                                1,
                                                              ),
                                                            ]),
                                                            _: 1,
                                                          },
                                                          8,
                                                          ["value"],
                                                        ),
                                                      ]),
                                                      _: 1,
                                                    },
                                                    8,
                                                    ["modelValue", "disabled"],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["label"],
                                            ),
                                            H(
                                              f,
                                              {
                                                label: t.$t(
                                                  "setting.memberIpLimitList",
                                                ),
                                                class:
                                                  "tw-items-start second-level-form-item !tw-mb-[0px]",
                                                "label-position": "left",
                                                "label-width": oa,
                                              },
                                              {
                                                default: K(() => [
                                                  M(
                                                    H(
                                                      h,
                                                      {
                                                        modelValue:
                                                          Q(gi)
                                                            .memberIpLimitConfig
                                                            .ip,
                                                        "onUpdate:modelValue":
                                                          a[41] ||
                                                          (a[41] = (e) =>
                                                            (Q(
                                                              gi,
                                                            ).memberIpLimitConfig.ip =
                                                              e)),
                                                        autosize: {
                                                          minRows: 3,
                                                          maxRows: 5,
                                                        },
                                                        placeholder: Q(wa)(
                                                          "setting.memberIpLimitDesc",
                                                        ),
                                                        autocomplete: "off",
                                                        class:
                                                          "tw-mb-[10px] tw-max-w-[500px]",
                                                        spellcheck: "false",
                                                        style: {
                                                          width: "100%",
                                                        },
                                                        type: "textarea",
                                                        disabled: Be.value,
                                                        onChange: Ui,
                                                      },
                                                      null,
                                                      8,
                                                      [
                                                        "modelValue",
                                                        "placeholder",
                                                        "disabled",
                                                      ],
                                                    ),
                                                    [[I]],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["label"],
                                            ),
                                          ]))
                                        : oe("", !0),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                H(
                                  f,
                                  {
                                    id: "deviceNameLimitConfig",
                                    label: t.$t(
                                      "setting.deviceNameLimitConfig",
                                    ),
                                  },
                                  {
                                    default: K(() => [
                                      H(Ye, null, {
                                        default: K(() => [
                                          W("div", Nl, [
                                            H(
                                              b,
                                              {
                                                modelValue:
                                                  Q(gi).deviceNameLimitConfig
                                                    .status,
                                                "onUpdate:modelValue":
                                                  a[42] ||
                                                  (a[42] = (e) =>
                                                    (Q(
                                                      gi,
                                                    ).deviceNameLimitConfig.status =
                                                      e)),
                                                disabled:
                                                  !i.value || Q(Ea).isFree,
                                              },
                                              null,
                                              8,
                                              ["modelValue", "disabled"],
                                            ),
                                            W(
                                              "span",
                                              Il,
                                              Z(
                                                t.$t(
                                                  "setting.deviceNameLimitConfigTip",
                                                ),
                                              ),
                                              1,
                                            ),
                                            H(
                                              Pe,
                                              {
                                                content: t.$t(
                                                  "setting.softwareUpgradeTip",
                                                ),
                                              },
                                              null,
                                              8,
                                              ["content"],
                                            ),
                                          ]),
                                        ]),
                                        _: 1,
                                      }),
                                      Q(gi).deviceNameLimitConfig.status
                                        ? (j(),
                                          z("div", $l, [
                                            H(
                                              f,
                                              {
                                                label: t.$t(
                                                  "setting.accessLimitLabel1",
                                                ),
                                                class: "second-level-form-item",
                                                "label-position": "left",
                                                "label-width": oa,
                                              },
                                              {
                                                default: K(() => [
                                                  H(
                                                    x,
                                                    {
                                                      modelValue:
                                                        Q(gi)
                                                          .deviceNameLimitConfig
                                                          .type,
                                                      "onUpdate:modelValue":
                                                        a[43] ||
                                                        (a[43] = (e) =>
                                                          (Q(
                                                            gi,
                                                          ).deviceNameLimitConfig.type =
                                                            e)),
                                                      disabled: Be.value,
                                                    },
                                                    {
                                                      default: K(() => [
                                                        H(
                                                          y,
                                                          {
                                                            value: Q(e).BAN,
                                                            size: "large",
                                                          },
                                                          {
                                                            default: K(() => [
                                                              ie(
                                                                Z(
                                                                  t.$t(
                                                                    "setting.deviceNameLimitBanDesc",
                                                                  ),
                                                                ),
                                                                1,
                                                              ),
                                                            ]),
                                                            _: 1,
                                                          },
                                                          8,
                                                          ["value"],
                                                        ),
                                                        H(
                                                          y,
                                                          {
                                                            value: Q(e).ALLOW,
                                                            size: "large",
                                                          },
                                                          {
                                                            default: K(() => [
                                                              ie(
                                                                Z(
                                                                  t.$t(
                                                                    "setting.deviceNameLimitAllowDesc",
                                                                  ),
                                                                ),
                                                                1,
                                                              ),
                                                            ]),
                                                            _: 1,
                                                          },
                                                          8,
                                                          ["value"],
                                                        ),
                                                      ]),
                                                      _: 1,
                                                    },
                                                    8,
                                                    ["modelValue", "disabled"],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["label"],
                                            ),
                                            H(
                                              f,
                                              {
                                                label: t.$t(
                                                  "setting.deviceNameLimitList",
                                                ),
                                                class:
                                                  "tw-items-start second-level-form-item !tw-mb-[0px]",
                                                "label-position": "left",
                                                "label-width": oa,
                                              },
                                              {
                                                default: K(() => [
                                                  M(
                                                    H(
                                                      h,
                                                      {
                                                        modelValue:
                                                          Q(gi)
                                                            .deviceNameLimitConfig
                                                            .deviceName,
                                                        "onUpdate:modelValue":
                                                          a[44] ||
                                                          (a[44] = (e) =>
                                                            (Q(
                                                              gi,
                                                            ).deviceNameLimitConfig.deviceName =
                                                              e)),
                                                        autosize: {
                                                          minRows: 3,
                                                          maxRows: 5,
                                                        },
                                                        placeholder: Q(wa)(
                                                          "setting.deviceNameLimitDesc",
                                                        ),
                                                        autocomplete: "off",
                                                        class:
                                                          "tw-mb-[10px] tw-max-w-[500px]",
                                                        spellcheck: "false",
                                                        style: {
                                                          width: "100%",
                                                        },
                                                        type: "textarea",
                                                        disabled: Be.value,
                                                        onChange: qi,
                                                      },
                                                      null,
                                                      8,
                                                      [
                                                        "modelValue",
                                                        "placeholder",
                                                        "disabled",
                                                      ],
                                                    ),
                                                    [[I]],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["label"],
                                            ),
                                          ]))
                                        : oe("", !0),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                H(
                                  f,
                                  {
                                    id: "proxyLinkLimit",
                                    label: t.$t("setting.proxyLinkLimit"),
                                  },
                                  {
                                    default: K(() => [
                                      H(Ye, null, {
                                        default: K(() => [
                                          W("div", Rl, [
                                            H(
                                              b,
                                              {
                                                modelValue:
                                                  Q(gi).proxyLimitConfig.status,
                                                "onUpdate:modelValue":
                                                  a[45] ||
                                                  (a[45] = (e) =>
                                                    (Q(
                                                      gi,
                                                    ).proxyLimitConfig.status =
                                                      e)),
                                                disabled: Be.value,
                                                onChange: ji,
                                              },
                                              null,
                                              8,
                                              ["modelValue", "disabled"],
                                            ),
                                            W(
                                              "span",
                                              Al,
                                              Z(
                                                t.$t(
                                                  "setting.proxyLinkLimitTip",
                                                ),
                                              ),
                                              1,
                                            ),
                                            H(
                                              Pe,
                                              {
                                                content: t.$t(
                                                  "setting.softwareUpgradeTip",
                                                ),
                                              },
                                              null,
                                              8,
                                              ["content"],
                                            ),
                                          ]),
                                        ]),
                                        _: 1,
                                      }),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                H(
                                  f,
                                  {
                                    id: "memberLoginConfig",
                                    label: t.$t("setting.memberLoginConfig"),
                                  },
                                  {
                                    default: K(() => [
                                      H(
                                        u,
                                        {
                                          content: na.value,
                                          disabled: p.value,
                                          placement: "top",
                                        },
                                        {
                                          default: K(() => [
                                            W("div", Ul, [
                                              H(
                                                b,
                                                {
                                                  modelValue:
                                                    Q(gi).myOrgConfig
                                                      .memberLoginConfig.status,
                                                  "onUpdate:modelValue":
                                                    a[46] ||
                                                    (a[46] = (e) =>
                                                      (Q(
                                                        gi,
                                                      ).myOrgConfig.memberLoginConfig.status =
                                                        e)),
                                                  disabled: !p.value,
                                                },
                                                null,
                                                8,
                                                ["modelValue", "disabled"],
                                              ),
                                              W(
                                                "span",
                                                ql,
                                                Z(
                                                  t.$t(
                                                    "setting.memberLoginConfigTip",
                                                  ),
                                                ),
                                                1,
                                              ),
                                            ]),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["content", "disabled"],
                                      ),
                                      Q(gi).myOrgConfig.memberLoginConfig.status
                                        ? (j(),
                                          z("div", Bl, [
                                            H(
                                              f,
                                              {
                                                prop: "myOrgConfig.memberLoginConfig.ipLimitNum",
                                                class: "second-level-form-item",
                                                label: t.$t(
                                                  "setting.memberLoginConfigLimit",
                                                ),
                                                "label-position": "left",
                                                "label-width": oa,
                                              },
                                              {
                                                default: K(() => [
                                                  H(
                                                    E,
                                                    {
                                                      modelValue:
                                                        Q(gi).myOrgConfig
                                                          .memberLoginConfig
                                                          .ipLimitNum,
                                                      "onUpdate:modelValue":
                                                        a[47] ||
                                                        (a[47] = (e) =>
                                                          (Q(
                                                            gi,
                                                          ).myOrgConfig.memberLoginConfig.ipLimitNum =
                                                            e)),
                                                      class: "!tw-w-[160px]",
                                                      min: 1,
                                                      max: 9999,
                                                      precision: 0,
                                                      disabled: !p.value,
                                                      controls: !1,
                                                    },
                                                    null,
                                                    8,
                                                    ["modelValue", "disabled"],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["label"],
                                            ),
                                          ]))
                                        : oe("", !0),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                H(
                                  f,
                                  {
                                    id: "proxyDetectEnableLabel",
                                    label: t.$t(
                                      "setting.proxyDetectEnableLabel",
                                    ),
                                  },
                                  {
                                    default: K(() => [
                                      W("div", Fl, [
                                        H(
                                          b,
                                          {
                                            modelValue:
                                              Q(gi).proxyDetectConfig.status,
                                            "onUpdate:modelValue":
                                              a[48] ||
                                              (a[48] = (e) =>
                                                (Q(
                                                  gi,
                                                ).proxyDetectConfig.status =
                                                  e)),
                                            disabled: !i.value || Q(Ea).isFree,
                                          },
                                          null,
                                          8,
                                          ["modelValue", "disabled"],
                                        ),
                                        W(
                                          "span",
                                          Gl,
                                          Z(
                                            t.$t(
                                              "setting.proxyDetectEnableDesc",
                                            ),
                                          ),
                                          1,
                                        ),
                                      ]),
                                      Q(gi).proxyDetectConfig.status
                                        ? (j(),
                                          z("div", Pl, [
                                            H(
                                              f,
                                              {
                                                class: "second-level-form-item",
                                                prop: "proxyDetectConfig.nameList",
                                                "label-position": "left",
                                                "label-width": oa,
                                                label: t.$t(
                                                  "setting.proxyDetectSoftwareNameLabel",
                                                ),
                                              },
                                              {
                                                default: K(() => [
                                                  H(
                                                    h,
                                                    {
                                                      modelValue:
                                                        Q(gi).proxyDetectConfig
                                                          .nameList,
                                                      "onUpdate:modelValue":
                                                        a[49] ||
                                                        (a[49] = (e) =>
                                                          (Q(
                                                            gi,
                                                          ).proxyDetectConfig.nameList =
                                                            e)),
                                                      autosize: {
                                                        minRows: 2,
                                                        maxRows: 5,
                                                      },
                                                      placeholder: Q(wa)(
                                                        "setting.proxyDetectSoftwareNameHolder",
                                                      ),
                                                      disabled: Q(Ea).isFree,
                                                      autocomplete: "off",
                                                      class: "tw-max-w-[500px]",
                                                      spellcheck: "false",
                                                      style: { width: "100%" },
                                                      type: "textarea",
                                                      onChange: Ri,
                                                    },
                                                    null,
                                                    8,
                                                    [
                                                      "modelValue",
                                                      "placeholder",
                                                      "disabled",
                                                    ],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["label"],
                                            ),
                                            H(
                                              f,
                                              {
                                                class: "!tw-mb-[0px]",
                                                prop: "proxyDetectConfig.memberGroupList",
                                                "label-position": "left",
                                                "label-width": oa,
                                                label: t.$t(
                                                  "setting.accessLimitLabel3",
                                                ),
                                              },
                                              {
                                                default: K(() => [
                                                  H(
                                                    k,
                                                    {
                                                      modelValue:
                                                        Q(gi).proxyDetectConfig
                                                          .memberGroupList,
                                                      "onUpdate:modelValue":
                                                        a[50] ||
                                                        (a[50] = (e) =>
                                                          (Q(
                                                            gi,
                                                          ).proxyDetectConfig.memberGroupList =
                                                            e)),
                                                      "max-collapse-tags": 2,
                                                      disabled: Q(Ea).isFree,
                                                      class:
                                                        "tw-max-w-[500px] select-pro tw-mb-[10px]",
                                                      "collapse-tags": "",
                                                      "collapse-tags-tooltip":
                                                        "",
                                                      multiple: "",
                                                      onChange:
                                                        a[51] ||
                                                        (a[51] = (e) =>
                                                          Fi(
                                                            e,
                                                            Q(gi)
                                                              .proxyDetectConfig,
                                                            "memberGroupList",
                                                          )),
                                                    },
                                                    {
                                                      default: K(() => [
                                                        H(
                                                          L,
                                                          {
                                                            key: "all",
                                                            label: t.$t(
                                                              "org.member.req.allGroup",
                                                            ),
                                                            value: "all",
                                                          },
                                                          {
                                                            default: K(() => [
                                                              ie(
                                                                Z(
                                                                  Q(wa)(
                                                                    "org.member.req.allGroup",
                                                                  ),
                                                                ),
                                                                1,
                                                              ),
                                                            ]),
                                                            _: 1,
                                                          },
                                                          8,
                                                          ["label"],
                                                        ),
                                                        (j(!0),
                                                        z(
                                                          Y,
                                                          null,
                                                          J(
                                                            Ua.value,
                                                            (e) => (
                                                              j(),
                                                              X(
                                                                L,
                                                                {
                                                                  key: e.id,
                                                                  label: e.name,
                                                                  value: e.id,
                                                                  class:
                                                                    "tw-w-inherit",
                                                                },
                                                                {
                                                                  default: K(
                                                                    () => [
                                                                      W(
                                                                        "span",
                                                                        Ml,
                                                                        Z(
                                                                          e.name,
                                                                        ),
                                                                        1,
                                                                      ),
                                                                    ],
                                                                  ),
                                                                  _: 2,
                                                                },
                                                                1032,
                                                                [
                                                                  "label",
                                                                  "value",
                                                                ],
                                                              )
                                                            ),
                                                          ),
                                                          128,
                                                        )),
                                                      ]),
                                                      _: 1,
                                                    },
                                                    8,
                                                    ["modelValue", "disabled"],
                                                  ),
                                                  Q(gi).proxyDetectConfig.status
                                                    ? (j(),
                                                      z(
                                                        "p",
                                                        jl,
                                                        Z(
                                                          t.$t(
                                                            "setting.proxyDetectDetectionNote",
                                                          ),
                                                        ),
                                                        1,
                                                      ))
                                                    : oe("", !0),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["label"],
                                            ),
                                          ]))
                                        : oe("", !0),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                H(
                                  f,
                                  {
                                    id: "versionLimit",
                                    label: t.$t("setting.versionLimit"),
                                  },
                                  {
                                    default: K(() => [
                                      H(
                                        u,
                                        {
                                          content: na.value,
                                          disabled: i.value,
                                          placement: "top",
                                        },
                                        {
                                          default: K(() => [
                                            W("div", zl, [
                                              H(
                                                b,
                                                {
                                                  modelValue:
                                                    Q(gi).appVersionLimitConfig
                                                      .status,
                                                  "onUpdate:modelValue":
                                                    a[52] ||
                                                    (a[52] = (e) =>
                                                      (Q(
                                                        gi,
                                                      ).appVersionLimitConfig.status =
                                                        e)),
                                                  disabled: !i.value,
                                                  onChange: di,
                                                },
                                                null,
                                                8,
                                                ["modelValue", "disabled"],
                                              ),
                                              W(
                                                "span",
                                                Wl,
                                                Z(
                                                  t.$t(
                                                    "setting.versionLimitTip",
                                                  ),
                                                ),
                                                1,
                                              ),
                                            ]),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["content", "disabled"],
                                      ),
                                      Q(gi).appVersionLimitConfig.status
                                        ? (j(),
                                          z("div", Hl, [
                                            H(
                                              Ge,
                                              {
                                                class: "tw-mt-[10px]",
                                                form: Q(gi),
                                              },
                                              null,
                                              8,
                                              ["form"],
                                            ),
                                          ]))
                                        : oe("", !0),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                H(v, { class: "tw-mt-[0px]" }),
                                W("div", Kl, Z(Q(wa)("setting.techCheck")), 1),
                                W("div", null, [
                                  H(
                                    f,
                                    {
                                      id: "TechCheck",
                                      label: t.$t("setting.techCheckMode"),
                                    },
                                    {
                                      default: K(() => [
                                        W("div", Yl, [
                                          H(
                                            b,
                                            {
                                              modelValue: Na.value,
                                              "onUpdate:modelValue":
                                                a[53] ||
                                                (a[53] = (e) => (Na.value = e)),
                                              onChange: _i,
                                            },
                                            null,
                                            8,
                                            ["modelValue"],
                                          ),
                                          W(
                                            "span",
                                            Jl,
                                            Z(t.$t("setting.techCheckTip1")),
                                            1,
                                          ),
                                        ]),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["label"],
                                  ),
                                ]),
                                H(v, { class: "tw-mt-[0px]" }),
                                W(
                                  "div",
                                  Ql,
                                  Z(Q(wa)("setting.softwareUpdate")),
                                  1,
                                ),
                                H(
                                  f,
                                  {
                                    id: "softwareUpdate",
                                    label: t.$t(
                                      "setting.softwareUpdateSettings",
                                    ),
                                    class: "!tw-mb-[10px]",
                                  },
                                  {
                                    default: K(() => [
                                      H(
                                        x,
                                        {
                                          modelValue:
                                            Q(gi).updateFrequencyConfig
                                              .autoUpdate,
                                          "onUpdate:modelValue":
                                            a[54] ||
                                            (a[54] = (e) =>
                                              (Q(
                                                gi,
                                              ).updateFrequencyConfig.autoUpdate =
                                                e)),
                                          class: "tw-pl-[4px]",
                                        },
                                        {
                                          default: K(() => [
                                            H(
                                              y,
                                              { value: !1 },
                                              {
                                                default: K(() => [
                                                  ie(
                                                    Z(
                                                      t.$t(
                                                        "setting.notAutoUpdate",
                                                      ),
                                                    ),
                                                    1,
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                            ),
                                            H(
                                              y,
                                              { value: !0 },
                                              {
                                                default: K(() => [
                                                  ie(
                                                    Z(
                                                      t.$t(
                                                        "setting.autoUpdate",
                                                      ),
                                                    ),
                                                    1,
                                                  ),
                                                ]),
                                                _: 1,
                                              },
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
                                  ["label"],
                                ),
                                W("div", Xl, [
                                  M(
                                    (j(),
                                    X(
                                      D,
                                      {
                                        "label-position": "left",
                                        "label-width": "150",
                                        class: "upload-form",
                                      },
                                      {
                                        default: K(() => [
                                          Q(gi).updateFrequencyConfig.autoUpdate
                                            ? (j(),
                                              X(
                                                f,
                                                {
                                                  key: 1,
                                                  label:
                                                    t.$t("setting.updateRule"),
                                                },
                                                {
                                                  default: K(() => [
                                                    H(
                                                      k,
                                                      {
                                                        modelValue:
                                                          Q(gi)
                                                            .updateFrequencyConfig
                                                            .autoUpdateRule,
                                                        "onUpdate:modelValue":
                                                          a[57] ||
                                                          (a[57] = (e) =>
                                                            (Q(
                                                              gi,
                                                            ).updateFrequencyConfig.autoUpdateRule =
                                                              e)),
                                                      },
                                                      {
                                                        default: K(() => [
                                                          H(
                                                            L,
                                                            {
                                                              value:
                                                                Q(s)
                                                                  .UPDATE_VERSION,
                                                              label: t.$t(
                                                                "setting.updateRuleOption1",
                                                              ),
                                                            },
                                                            null,
                                                            8,
                                                            ["value", "label"],
                                                          ),
                                                        ]),
                                                        _: 1,
                                                      },
                                                      8,
                                                      ["modelValue"],
                                                    ),
                                                    W(
                                                      "p",
                                                      aa,
                                                      Z(
                                                        t.$t(
                                                          "setting.updateRuleTip",
                                                        ),
                                                      ),
                                                      1,
                                                    ),
                                                  ]),
                                                  _: 1,
                                                },
                                                8,
                                                ["label"],
                                              ))
                                            : (j(),
                                              z(
                                                Y,
                                                { key: 0 },
                                                [
                                                  H(
                                                    f,
                                                    {
                                                      label: t.$t(
                                                        "setting.updateRemindSetting",
                                                      ),
                                                    },
                                                    {
                                                      default: K(() => [
                                                        W("div", Zl, [
                                                          H(
                                                            b,
                                                            {
                                                              modelValue:
                                                                Q(gi)
                                                                  .updateFrequencyConfig
                                                                  .status,
                                                              "onUpdate:modelValue":
                                                                a[55] ||
                                                                (a[55] = (e) =>
                                                                  (Q(
                                                                    gi,
                                                                  ).updateFrequencyConfig.status =
                                                                    e)),
                                                            },
                                                            null,
                                                            8,
                                                            ["modelValue"],
                                                          ),
                                                          W(
                                                            "span",
                                                            ea,
                                                            Z(
                                                              t.$t(
                                                                "setting.updateFrequencyTip5",
                                                              ),
                                                            ),
                                                            1,
                                                          ),
                                                        ]),
                                                      ]),
                                                      _: 1,
                                                    },
                                                    8,
                                                    ["label"],
                                                  ),
                                                  Q(gi).updateFrequencyConfig
                                                    .status &&
                                                  !Q(gi).updateFrequencyConfig
                                                    .autoUpdate
                                                    ? (j(),
                                                      X(
                                                        f,
                                                        {
                                                          key: 0,
                                                          label: t.$t(
                                                            "setting.updateFrequencyTip1",
                                                          ),
                                                        },
                                                        {
                                                          default: K(() => [
                                                            W("div", ta, [
                                                              W("div", la, [
                                                                H(
                                                                  k,
                                                                  {
                                                                    modelValue:
                                                                      Q(gi)
                                                                        .updateFrequencyConfig
                                                                        .updateFrequency,
                                                                    "onUpdate:modelValue":
                                                                      a[56] ||
                                                                      (a[56] = (
                                                                        e,
                                                                      ) =>
                                                                        (Q(
                                                                          gi,
                                                                        ).updateFrequencyConfig.updateFrequency =
                                                                          e)),
                                                                  },
                                                                  {
                                                                    default: K(
                                                                      () => [
                                                                        (j(!0),
                                                                        z(
                                                                          Y,
                                                                          null,
                                                                          J(
                                                                            va.value,
                                                                            (
                                                                              e,
                                                                            ) => (
                                                                              j(),
                                                                              X(
                                                                                L,
                                                                                {
                                                                                  key: e.type,
                                                                                  label:
                                                                                    e
                                                                                      .text[
                                                                                      Q(
                                                                                        Ta,
                                                                                      )
                                                                                        .language ||
                                                                                        "en"
                                                                                    ],
                                                                                  value:
                                                                                    e.type,
                                                                                },
                                                                                null,
                                                                                8,
                                                                                [
                                                                                  "label",
                                                                                  "value",
                                                                                ],
                                                                              )
                                                                            ),
                                                                          ),
                                                                          128,
                                                                        )),
                                                                      ],
                                                                    ),
                                                                    _: 1,
                                                                  },
                                                                  8,
                                                                  [
                                                                    "modelValue",
                                                                  ],
                                                                ),
                                                              ]),
                                                            ]),
                                                          ]),
                                                          _: 1,
                                                        },
                                                        8,
                                                        ["label"],
                                                      ))
                                                    : oe("", !0),
                                                ],
                                                64,
                                              )),
                                        ]),
                                        _: 1,
                                      },
                                    )),
                                    [[R]],
                                  ),
                                ]),
                              ]),
                              _: 1,
                            },
                            8,
                            ["model", "rules"],
                          )),
                          [[R]],
                        ),
                        W("div", ia, [
                          H(
                            C,
                            { type: "primary", onClick: Ki },
                            {
                              default: K(() => [
                                ie(Z(t.$t("base.confirm")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                        ]),
                      ],
                      512,
                    ),
                  ]),
                  xa.value
                    ? (j(),
                      X(
                        Me,
                        {
                          key: 0,
                          ref_key: "tableFieldDialogRef",
                          ref: ha,
                          "is-global": !0,
                          fieldList: Q(V.cloneDeep)(Q(Ka)).filter((e) => e.key),
                          modelValue: xa.value,
                          "onUpdate:modelValue":
                            a[58] || (a[58] = (e) => (xa.value = e)),
                          titleData: Q(Ja),
                          onConfirm: Qi,
                        },
                        null,
                        8,
                        ["fieldList", "modelValue", "titleData"],
                      ))
                    : oe("", !0),
                  H(
                    Ke,
                    {
                      ref_key: "doubleCheckSafetyProtectionDialogRef",
                      ref: _a,
                      onConfirm: pi,
                      onExpandSecuritySkipSuperAdminChange: ci,
                      onCancel: mi,
                    },
                    null,
                    512,
                  ),
                  H(
                    Qe,
                    {
                      modelValue: sa.value,
                      "onUpdate:modelValue":
                        a[59] || (a[59] = (e) => (sa.value = e)),
                      percentage: Q(fa),
                      title: ei.value.title,
                      message: ei.value.message,
                      "convert-results": Q(ma),
                      "should-break": Q(da),
                      onCancel: ti,
                      onComplete: ri,
                      onClear: ui,
                    },
                    null,
                    8,
                    [
                      "modelValue",
                      "percentage",
                      "title",
                      "message",
                      "convert-results",
                      "should-break",
                    ],
                  ),
                  H(
                    Xe,
                    {
                      title: t.$t("env.cookie.partOperation"),
                      message: t.$t("env.cookie.batchEncryptTip"),
                      modelValue: ra.value,
                      "onUpdate:modelValue":
                        a[60] || (a[60] = (e) => (ra.value = e)),
                      onCancel: Hi,
                    },
                    null,
                    8,
                    ["title", "message", "modelValue"],
                  ),
                ],
                8,
                rt,
              )),
              [[A, Wa.value]],
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-419c7787"]],
  );
export { na as default };
