import e from "./envSerialNums-BjlyggGT.js";
import { _ as a } from "./index.vue_vue_type_script_setup_true_lang-CIPUEjpB.js";
import {
  d as t,
  v as o,
  ew as l,
  G as r,
  R as s,
  ex as n,
  ey as i,
  ez as p,
  c2 as u,
  cm as v,
  cn as d,
  cx as c,
  cp as m,
  cq as _,
  cr as y,
  ct as T,
  co as g,
  cu as f,
  bc as E,
  am as I,
  cv as x,
  an as b,
  i as O,
  V as w,
  dd as C,
  P as A,
  D as R,
  r as h,
  q as S,
  o as V,
  h as k,
  f as P,
  aq as D,
  w as N,
  a as L,
  x as j,
  b as B,
  X as U,
  c as q,
  F as G,
  t as F,
  z as M,
  e as H,
  C as X,
  I as Y,
  as as W,
  a3 as $,
  ac as z,
  bX as J,
  bO as K,
  bY as Q,
  eA as Z,
  eB as ee,
  eC as ae,
  a1 as te,
  eD as oe,
  eE as le,
  eF as re,
  eG as se,
  eH as ne,
  c3 as ie,
  eI as pe,
  eJ as ue,
  eK as ve,
  eL as de,
  cR as ce,
  _ as me,
} from "./index-BUIbb6Pa.js";
import _e from "./envEditProxyForm-BbH2PHWU.js";
import ye from "./envEditAccountForm-WSrZTnvX.js";
import { u as Te } from "./useEnvEdit-B6M5ajw7.js";
import { u as ge } from "./common-_BPSz0Vp.js";
import fe from "./index-BFrckwEl.js";
import Ee from "./envEditExtendForm-1k6uLxBb.js";
import Ie from "./envTagSelect-BOvyEvCo.js";
import xe from "./BrowserSelection-DT8JdE4_.js";
import { g as be } from "./ua-CJ8LtZXg.js";
import "./proxyEditV2-PrFoTQ5r.js";
import "./ipResourceMock-CCd7H3CQ.js";
import "./index.vue_vue_type_script_setup_true_lang-A7OAkZwm.js";
import "./CustomRadioGroup-Dk-imFdD.js";
import "./editProxySoftDlg.vue_vue_type_script_setup_true_lang-D9otwVyq.js";
import "./proxySoftItem-B7tAwO_8.js";
import "./envProxyItems-DIhzCyp-.js";
import "./proxyCheckButton-qJacjpSf.js";
import "./proxyUtil-OnkkuXcX.js";
import "./envAutoInputProxy.vue_vue_type_script_setup_true_lang-CKSB7kpP.js";
import "./proxyApiExtraction-CcAfvVt-.js";
import "./proxyProviderAvailability-Dl68x0Bx.js";
import "./Tip.vue_vue_type_script_setup_true_lang-DBJcGLEl.js";
import "./ProxyGroupSelect.vue_vue_type_script_setup_true_lang-CTswbFOC.js";
import "./ParaturboProxyConfig.vue_vue_type_script_setup_true_lang-DnrGQZKb.js";
import "./DynamicProxyForm.vue_vue_type_script_setup_true_lang-BLDcp8Iw.js";
import "./ipResourceCatalog-CJEdeRbI.js";
import "./IpCountryFlag.vue_vue_type_script_setup_true_lang-DgLdnpgH.js";
import "./country-flag.esm-Bg8BdAZu.js";
import "./IpResourceSelector.vue_vue_type_script_setup_true_lang-Dxuw76Sd.js";
import "./DynamicTrafficGate.vue_vue_type_script_setup_true_lang-3aGxeuRD.js";
import "./IpResourcePurchaseDialog.vue_vue_type_script_setup_true_lang-DcxcArWP.js";
import "./envSegmentedTabs-B8OKb7JK.js";
import "./DynamicTrafficPurchase.vue_vue_type_script_setup_true_lang-BAxyvPun.js";
import "./ipResourcePayment-DW1eNDIC.js";
import "./payDialog.vue_vue_type_style_index_0_lang-BmKrLnEo.js";
import "./browser-DEPKJqf2.js";
import "./IpPurchaseImportantNotice.vue_vue_type_script_setup_true_lang-umWhcEQR.js";
import "./IpPurchaseCheckoutFooter.vue_vue_type_script_setup_true_lang-Boqn4piK.js";
import "./IpPurchaseOrderSummary.vue_vue_type_script_setup_true_lang-CQmGRhje.js";
import "./paySelect-CHLWtiLZ.js";
import "./StaticIpPurchase.vue_vue_type_script_setup_true_lang-Cjw6R1ER.js";
import "./fixedUrlsFormItem.vue_vue_type_script_setup_true_lang-J-frhu2d.js";
import "./timezone-BMz8A6Hf.js";
import "./expansionDefaulAvatar-BAAgU78a.js";
import "./index-C6tOf3zW.js";
import "./system-DtbAsiCM.js";
import "./oneWaySync-C7I0Josw.js";
import "./accessLimitCard-CVpkvN01.js";
import "./envAddAcceptLangDialog.vue_vue_type_script_setup_true_name_envAddAcceptLangDialog_lang-DdcOzUN-.js";
import "./envEditFontDialog-BAmKs9Pq.js";
import "./TlsCipherSuiteSelector.vue_vue_type_script_setup_true_lang-Bm0jmwwi.js";
const Oe = { class: "tw-overflow-y-auto tw-max-h-[75vh] envBatchDlg" },
  we = { key: 0 },
  Ce = { class: "tw-flex tw-items-center" },
  Ae = { class: "tw-mr-[4px]" },
  Re = me(
    t({
      __name: "envBatchOperationDlg",
      props: { onExportEnv: { type: Function } },
      emits: ["submit", "exportSubmit", "cookieEncryptSubmit"],
      setup(t, { expose: me, emit: Re }) {
        let { t: he } = o.useI18n(),
          Se = O(!1),
          Ve = O();
        const ke = {
          [l.EDIT_PROXY]: "env.env.req.editEnvProxy",
          [l.EDIT_BROWSER_VERSION]: "env.env.req.editBrowserVersion",
          [l.EDIT_PLATFORM_ACCOUNT]: "env.env.req.editEnvAccount",
          [l.EDIT_OPEN_URL]: "env.env.req.editEnvOpenUrl",
          [l.EDIT_COMMON_SETTINGS]: "envV2.tip40",
          [l.EDIT_FINGERPRINT]: "env.env.req.editEnvFingerprint",
          [l.BATCH_SORT]: "env.env.req.edit_custom_id",
          [l.EXPORT_ENV]: "env.env.exportEnv",
          [l.BATCH_COOKIE_ENCRYPT_RESTORE]: "env.cookie.cookieAction",
        };
        let Pe = X(() => he(Reflect.get(ke, Ye.value) || ""));
        const De = ge(),
          Ne = r(),
          { tagList: Le } = s(De),
          je = O(),
          Be = O(),
          Ue = O(),
          qe = O(""),
          Ge = O({ serialNums: [], envIds: [], envs: [] }),
          Fe = Re,
          Me = t,
          He = {
            proxyWay: b.Custom,
            proxyOwnType: "fixed",
            proxyIpType: x.IpAPI,
            proxyType: I.NonUse,
            proxyHost: "",
            proxyPort: void 0,
            proxyUserName: "",
            proxyPasswd: "",
            proxyId: void 0,
            proxyIpAddrType: E.IPV4,
            restoreUrlType: f.GLOBAL,
            localDataConfig: { type: 0, browserType: u.GLOBAL, dataType: [] },
            proxyApiInfo: { ipMethod: g.EVERY_TIME, url: "", ip: "", port: "" },
            updateType: p.APPEND,
            urls: [],
            accountList: [],
            browserType: u.GLOBAL,
            dataType: u.GLOBAL,
            dataConfigOption: [T.Cookie],
            browserConfigOption: [],
            envMutilOpenType: y.GLOBAL,
            remoteInspectorType: _.GLOBAL,
            spoofingVideoType: m.DISABLE,
            extensionsType: c.ALLOW,
            showItemArr: [],
            extensionsGroupId: void 0,
            sort: 0,
            bookmarkConfigVal: {
              bookmarkType: "global",
              status: !1,
              fileContent: [],
              coverRule: d.Cover,
              fileName: "",
              type: v.APPEND,
            },
            accessLimitConfigVal: {
              accessLimitType: u.GLOBAL,
              status: !1,
              type: 1,
              quickSelectionOption: [],
              quickSelectionType: 0,
              urlList: "",
            },
            envTagBatchOperation: p.APPEND,
            envCookieEncryptType: i.ENCRYPT,
            envTagIds: [],
            envExportTemplate: n.EXCEL,
            ProxyGroupIds: [],
            browserVersionId: void 0,
            autoUserAgent: !0,
          };
        let Xe = O(w.cloneDeep(He));
        const Ye = O(l.EDIT_PROXY),
          { getDefaultExtendConfig: We, extendConfigList: $e } = Te({
            isSingle: O(!0),
          }),
          ze = O(We()),
          Je = O(),
          Ke = O(),
          Qe = O(),
          Ze = {
            [C.DataAsync]: he("env.env.req.dataAsync"),
            [C.BrowserSettings]: he("env.env.req.browserSettings"),
            [C.EnvOverOpen]: he("setting.envOverOpen"),
            [C.ExtensionsType]: he("expan.tip24"),
            [C.RestoreUrlType]: he("envV2.tip6"),
            [C.SpoofingVideoType]: he("env.env.req.spoofingVideoType"),
            [C.ClearLocalData]: he("cacheDel.tip1"),
            [C.BookmarkConfig]: he("setting.bookmarkConfig"),
            [C.AccessLimitConfig]: he("setting.visitConfig"),
            [C.ExtensionsGroupId]: he("expan.tip24"),
            [C.envDataSync]: he("env.env.req.dataAsync"),
            [C.RemoteInspector]: he("setting.remoteInspector"),
          },
          ea = X(() => Ye.value === l.EDIT_PROXY),
          aa = X(() => Ye.value === l.EDIT_PLATFORM_ACCOUNT),
          ta = X(() => Ye.value === l.EDIT_OPEN_URL),
          oa = X(() => Ye.value === l.EDIT_COMMON_SETTINGS),
          la = X(() => Ye.value === l.EDIT_FINGERPRINT),
          ra = X(() => Ye.value === l.BATCH_SORT),
          sa = X(() => Ye.value === l.BATCH_TAG),
          na = X(() => Ye.value === l.EDIT_BROWSER_VERSION),
          ia = X(() => Ye.value === l.BATCH_COOKIE_ENCRYPT_RESTORE),
          pa = X(() => [l.EXPORT_ENV_1000, l.EXPORT_ENV].includes(Ye.value)),
          ua = O(!0),
          va = X(() => {
            switch (Ye.value) {
              case l.BATCH_COOKIE_ENCRYPT_RESTORE:
                return 600;
              case l.BATCH_SORT:
                return 500;
              case l.BATCH_TAG:
                return 600;
              default:
                return 750;
            }
          });
        let da = X(() => {
          var e, a, t, o;
          return {
            ...(null == (e = Je.value) ? void 0 : e.rules),
            ...(null == (a = Qe.value) ? void 0 : a.rules),
            ...(null == (t = Ke.value) ? void 0 : t.urlsRules),
            ...(null == (o = je.value) ? void 0 : o.urlsRules),
            showItemArr: [{ required: !0, message: he("base.selectHolder") }],
            sort: [
              { required: !0, message: he("env.env.req.enter_custom_id") },
            ],
            browserVersionId: [
              {
                required: !0,
                message: he("env.env.req.editBrowserVersionTip1"),
              },
            ],
            "envDataSync.roleIds": [
              { required: !0, message: he("setting.versionLimitTip12") },
            ],
            envTagIds: [
              {
                required: !0,
                message: he("env.tag.selectTagTips"),
                trigger: "blur",
              },
            ],
          };
        });
        const ca = O("");
        function ma() {
          var e;
          ((Se.value = !1), null == (e = Ve.value) || e.resetFields());
        }
        function _a() {
          var e;
          null == (e = Ve.value) || e.validateField("extend.geo");
        }
        async function ya() {
          var e;
          let a = await J(Xe.value, K.Single);
          a.proxyWay !== b.FROM_API ||
            (null == (e = null == a ? void 0 : a.proxyApiInfo)
              ? void 0
              : e.ip) ||
            (await Q(a));
          let {
            proxyWay: t,
            proxyIpType: o,
            proxyType: r,
            proxyHost: s,
            proxyPort: n,
            proxyUserName: i,
            proxyPasswd: v,
            proxyId: d,
            urls: c,
            updateType: m,
            accountList: _,
            browserConfigOption: y,
            dataConfigOption: T,
            envMutilOpenType: g,
            remoteInspectorType: f,
            spoofingVideoType: E,
            extensionsType: I,
            dataType: x,
            browserType: O,
            showItemArr: A,
            extensionsGroupId: R,
            proxySoft: h,
            proxySoftInfo: S,
            proxySoftEnable: V,
            proxyApiInfo: k,
            proxyIpAddrType: P,
            fixedUrls: D,
            restoreUrlType: N,
            localDataConfig: L,
            bookmarkConfigVal: j,
            accessLimitConfigVal: B,
            envDataSync: U,
            envTagIds: q,
            envTagBatchOperation: G,
          } = a;
          switch (Ye.value) {
            case l.EDIT_PROXY:
              a.proxyWay === b.SelectExist && "random" === a.proxyOwnType
                ? await de({
                    ids: Ge.value.envIds,
                    type: 2,
                    proxyWay: t,
                    proxyGroupIds: a.proxyGroupIds,
                  })
                : await de({
                    ids: Ge.value.envIds,
                    proxyWay: t,
                    proxyIpType: o,
                    proxyType: r,
                    proxyHost: s,
                    proxyPort: n,
                    proxyUserName: i,
                    proxyPasswd: v,
                    proxyId: d,
                    proxySoft: h,
                    proxyApiInfo: k,
                    proxyIpAddrType: P,
                    ...(ce.includes(h)
                      ? { proxySoftInfo: S, proxySoftEnable: V }
                      : {}),
                  });
              break;
            case l.EDIT_PLATFORM_ACCOUNT:
              await ve({ ids: Ge.value.envIds, updateType: m, accountList: _ });
              break;
            case l.EDIT_OPEN_URL:
              await ue({ ids: Ge.value.envIds, updateType: m, urls: D || [] });
              break;
            case l.EDIT_COMMON_SETTINGS: {
              L.dataType = L.dataType.reduce((e, a) => e + a, 0);
              let e = {
                  ids: Ge.value.envIds,
                  restoreUrlType: N,
                  dataConfig: JSON.stringify({
                    type: x === u.CUSTOM ? w.sum(T).toString() : 0,
                    dataType: x,
                  }),
                  browserConfig: JSON.stringify({
                    type: O === u.CUSTOM ? w.sum(y).toString() : 0,
                    browserType: O,
                  }),
                  envMutilOpenType: g,
                  remoteInspectorType: f,
                  spoofingVideoType: E,
                  extensionsType: I,
                  extensionsGroupId: R,
                  bookmarkConfig: JSON.stringify(j),
                  localDataConfig: JSON.stringify(L),
                  envDataSync: JSON.stringify(U),
                  accessLimitConfig: JSON.stringify(ie(B)),
                },
                a = w.pick(e, [
                  ...A,
                  "ids",
                  A.includes(C.ExtensionsType) ? C.ExtensionsGroupId : "",
                  A.includes(C.DataAsync) ? C.envDataSync : "",
                ]);
              await pe(a);
              break;
            }
            case l.EDIT_FINGERPRINT: {
              let e = await (async function () {
                var e;
                let a = await (null == (e = Qe.value)
                  ? void 0
                  : e.handleExtendConfig());
                for (let t in a)
                  Xe.value.showItemArr.some((e) => t.indexOf(e) >= 0) ||
                    delete a[t];
                return a;
              })();
              (await se({ ids: Ge.value.envIds, config: JSON.stringify(e) }),
                ne(Ge.value.envIds, "ENV_EDITED"));
              break;
            }
            case l.BATCH_SORT:
              1 === Ge.value.envIds.length
                ? await le(Ge.value.envIds[0], { sort: Xe.value.sort }, !0)
                : await re({ ids: Ge.value.envIds, sort: Xe.value.sort });
              break;
            case l.BATCH_TAG:
              (G === p.CLEAR &&
                (await te({
                  title: he("env.tag.confirmEmptyTag"),
                  message: he("env.tag.confirmEmptyTagTips"),
                })),
                await oe({
                  envIds: Ge.value.envIds,
                  envTagIds: (q || []).map((e) => e.id),
                  envTagBatchOperation: G || p.APPEND,
                }));
              break;
            case l.BATCH_COOKIE_ENCRYPT_RESTORE:
              Fe("cookieEncryptSubmit", {
                envIds: Ge.value.envIds,
                envs: Ge.value.envs,
                envCookieEncryptType: Xe.value.envCookieEncryptType,
              });
              break;
            case l.EDIT_BROWSER_VERSION: {
              await Z({
                ids: Ge.value.envIds,
                browserVersionId: Xe.value.browserVersionId,
                uaType: be(Xe.value.browserVersionId),
                autoUserAgent: Xe.value.autoUserAgent,
              });
              const { appVersionLimitConfig: e } = Ne.orgConfigData;
              ee(e, "2.7.18") &&
                Ne.updateOrgConfigData({
                  appVersionLimitConfig: ae(e, "2.7.18"),
                });
              break;
            }
            case l.EXPORT_ENV:
            case l.EXPORT_ENV_1000:
              try {
                ((ga.value = !0),
                  await Me.onExportEnv({
                    envIds: Ge.value.envIds,
                    envExportTemplate: Xe.value.envExportTemplate,
                    isResetSelect: ua.value,
                  }));
              } finally {
                ga.value = !1;
              }
          }
        }
        async function Ta() {
          var e, a;
          if (
            (await (null == (e = Ve.value) ? void 0 : e.validate()),
            await (null == (a = Ke.value) ? void 0 : a.validateAccountList()),
            ta.value || aa.value || ia.value)
          ) {
            const e = Xe.value.envCookieEncryptType === i.ENCRYPT,
              a = {
                title: {
                  [l.EDIT_PLATFORM_ACCOUNT]: he(
                    "org.member.req.batchEditAccountTitle",
                  ),
                  [l.EDIT_OPEN_URL]: he("org.member.req.batchEditUrlTitle"),
                  [l.BATCH_COOKIE_ENCRYPT_RESTORE]: he(
                    e
                      ? "env.cookie.confirmEncrypt"
                      : "env.cookie.confirmDecrypt",
                  ),
                },
                message: {
                  [l.EDIT_PLATFORM_ACCOUNT]: he(
                    "org.member.req.batchEditAccountContent",
                  ),
                  [l.EDIT_OPEN_URL]: he("org.member.req.batchEditUrlContent"),
                  [l.BATCH_COOKIE_ENCRYPT_RESTORE]: he(
                    e ? "env.cookie.encryptTip" : "env.cookie.decryptTip",
                  ),
                },
              };
            return Y({
              type: "warning",
              title: a.title[Ye.value],
              message: a.message[Ye.value],
              showCancelButton: !0,
            }).then(async () => {
              await fa();
            });
          }
          await fa();
        }
        A(async () => {
          const e = await R.api.getLocalVersionInfo();
          ca.value = "darwin" === e.platform ? "MACOS" : "WINDOWS";
        });
        let ga = O(!1);
        async function fa() {
          try {
            ga.value = !0;
            let [e] = await W(ya());
            e ||
              (pa.value ||
                ia.value ||
                ($.success(he("env.env.shareDialog.operatorSuccess")),
                Fe("submit", ua.value)),
              (Se.value = !1));
          } finally {
            ga.value = !1;
          }
        }
        function Ea(e) {
          var a;
          e && (null == (a = Ve.value) || a.validateField(e));
        }
        return (
          me({
            openDlg: function (e, a, t = !0) {
              var o;
              (null == (o = Ve.value) || o.resetFields(),
                (ze.value = We()),
                (ua.value = t),
                l.EXPORT_ENV_1000 === a
                  ? (qe.value = he("env.env.recent1000"))
                  : (qe.value = ""),
                setTimeout(async () => {
                  a === l.EDIT_PROXY && (await Je.value.getProxyList());
                }),
                z(async () => {
                  var t;
                  ((Xe.value = w.cloneDeep(He)),
                    (Ge.value.serialNums = e.map((e) => e.serialNum)),
                    (Ge.value.envIds = e.map((e) => e.id)),
                    (Ge.value.envs = e.map((e) => e)),
                    (Ye.value = a),
                    sa.value && De.getTagList(),
                    1 === e.length &&
                      a === l.BATCH_SORT &&
                      (Xe.value.sort =
                        (null == (t = e[0]) ? void 0 : t.sort) || 0),
                    (Se.value = !0));
                }));
            },
          }),
          (t, o) => {
            const l = h("el-form-item"),
              r = h("el-radio"),
              s = h("el-radio-group"),
              u = h("el-checkbox"),
              v = h("el-option"),
              d = h("el-select"),
              c = h("el-input-number"),
              m = h("el-form"),
              _ = h("el-button"),
              y = h("el-dialog"),
              T = S("prevent-label-click");
            return (
              V(),
              k(
                y,
                {
                  modelValue: P(Se),
                  "onUpdate:modelValue":
                    o[14] ||
                    (o[14] = (e) => (D(Se) ? (Se.value = e) : (Se = e))),
                  "align-center": !0,
                  "close-on-click-modal": !1,
                  "close-on-press-escape": !1,
                  "destroy-on-close": !0,
                  title: P(Pe),
                  width: va.value,
                },
                {
                  footer: N(() => [
                    B(
                      _,
                      { type: "info", class: "tw-w-full", onClick: ma },
                      {
                        default: N(() => [H(F(P(he)("base.cancel")), 1)]),
                        _: 1,
                      },
                    ),
                    B(
                      _,
                      {
                        class: "tw-w-full",
                        type: "primary",
                        onClick: Ta,
                        loading: P(ga),
                      },
                      {
                        default: N(() => [H(F(P(he)("base.confirm")), 1)]),
                        _: 1,
                      },
                      8,
                      ["loading"],
                    ),
                  ]),
                  default: N(() => [
                    L("div", Oe, [
                      j(
                        (V(),
                        k(
                          m,
                          {
                            ref_key: "envBatchOperationRef",
                            ref: Ve,
                            model: P(Xe),
                            rules: P(da),
                            "validate-on-rule-change": !1,
                            "label-position": "right",
                            "inline-message": !0,
                            "label-width":
                              ea.value || ra.value ? "auto" : "150px",
                          },
                          {
                            default: N(() => [
                              B(
                                l,
                                { label: t.$t("env.group.moveGroupTitle") },
                                {
                                  default: N(() => [
                                    B(
                                      e,
                                      {
                                        serialNums: Ge.value.serialNums,
                                        content: qe.value,
                                      },
                                      null,
                                      8,
                                      ["serialNums", "content"],
                                    ),
                                  ]),
                                  _: 1,
                                },
                                8,
                                ["label"],
                              ),
                              ea.value
                                ? (V(),
                                  k(
                                    _e,
                                    {
                                      key: 0,
                                      ref_key: "envEditProxyFormRef",
                                      ref: Je,
                                      batchData: P(Xe),
                                      "onUpdate:batchData":
                                        o[0] ||
                                        (o[0] = (e) =>
                                          D(Xe) ? (Xe.value = e) : (Xe = e)),
                                      "is-batch": !0,
                                      "is-bulk-import": !1,
                                      "is-edit": !0,
                                      "is-share": !1,
                                      "is-single": !1,
                                      "is-env-edit-v2": !1,
                                      class: "envEditProxyFormWrapper",
                                    },
                                    null,
                                    8,
                                    ["batchData"],
                                  ))
                                : U("", !0),
                              aa.value || ta.value
                                ? (V(),
                                  q(
                                    G,
                                    { key: 1 },
                                    [
                                      B(
                                        l,
                                        {
                                          label: P(he)(
                                            "env.env.batchRemark.updateType",
                                          ),
                                        },
                                        {
                                          default: N(() => [
                                            B(
                                              s,
                                              {
                                                modelValue: P(Xe).updateType,
                                                "onUpdate:modelValue":
                                                  o[1] ||
                                                  (o[1] = (e) =>
                                                    (P(Xe).updateType = e)),
                                                size: "medium",
                                              },
                                              {
                                                default: N(() => [
                                                  B(
                                                    r,
                                                    {
                                                      label: P(he)(
                                                        "env.env.batchRemark.append",
                                                      ),
                                                      value: P(p).APPEND,
                                                    },
                                                    null,
                                                    8,
                                                    ["label", "value"],
                                                  ),
                                                  B(
                                                    r,
                                                    {
                                                      label: P(he)(
                                                        "env.env.batchRemark.cover",
                                                      ),
                                                      value: P(p).COVER,
                                                    },
                                                    null,
                                                    8,
                                                    ["label", "value"],
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
                                      B(
                                        ye,
                                        {
                                          ref_key: "accountFormRef",
                                          ref: Ke,
                                          modelValue: P(Xe),
                                          "onUpdate:modelValue":
                                            o[2] ||
                                            (o[2] = (e) =>
                                              D(Xe)
                                                ? (Xe.value = e)
                                                : (Xe = e)),
                                          "is-share": !1,
                                          "is-show-account": aa.value,
                                          "is-show-url": ta.value,
                                          isBatch: !1,
                                          isBulkImport: !1,
                                          isEdit: !1,
                                          isSingle: !0,
                                          onCheckStep: Ea,
                                        },
                                        null,
                                        8,
                                        [
                                          "modelValue",
                                          "is-show-account",
                                          "is-show-url",
                                        ],
                                      ),
                                      B(
                                        l,
                                        {
                                          label: "",
                                          class: "form-item-label-hidden",
                                        },
                                        {
                                          default: N(() => [
                                            P(Xe).updateType === P(p).COVER
                                              ? (V(),
                                                q(
                                                  "div",
                                                  we,
                                                  F(
                                                    P(he)(
                                                      aa.value
                                                        ? "org.member.req.batchEditAccountTip"
                                                        : "org.member.req.batchEditUrlTip",
                                                    ),
                                                  ),
                                                  1,
                                                ))
                                              : U("", !0),
                                          ]),
                                          _: 1,
                                        },
                                      ),
                                    ],
                                    64,
                                  ))
                                : U("", !0),
                              na.value
                                ? (V(),
                                  q(
                                    G,
                                    { key: 2 },
                                    [
                                      B(
                                        xe,
                                        {
                                          modelValue: P(Xe).browserVersionId,
                                          "onUpdate:modelValue":
                                            o[3] ||
                                            (o[3] = (e) =>
                                              (P(Xe).browserVersionId = e)),
                                          "is-edit": !0,
                                        },
                                        null,
                                        8,
                                        ["modelValue"],
                                      ),
                                      B(
                                        l,
                                        { class: "tw-mt-[-16px]" },
                                        {
                                          default: N(() => [
                                            B(
                                              u,
                                              {
                                                label: P(he)(
                                                  "env.env.req.autoUserAgentTip",
                                                ),
                                                modelValue: P(Xe).autoUserAgent,
                                                "onUpdate:modelValue":
                                                  o[4] ||
                                                  (o[4] = (e) =>
                                                    (P(Xe).autoUserAgent = e)),
                                                class:
                                                  "tw-flex tw-items-center tw-w-fit",
                                              },
                                              null,
                                              8,
                                              ["label", "modelValue"],
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                      ),
                                    ],
                                    64,
                                  ))
                                : U("", !0),
                              oa.value
                                ? (V(),
                                  q(
                                    G,
                                    { key: 3 },
                                    [
                                      B(
                                        l,
                                        {
                                          label: t.$t("env.env.req.editItem"),
                                          prop: "showItemArr",
                                        },
                                        {
                                          default: N(() => [
                                            B(
                                              d,
                                              {
                                                modelValue: P(Xe).showItemArr,
                                                "onUpdate:modelValue":
                                                  o[5] ||
                                                  (o[5] = (e) =>
                                                    (P(Xe).showItemArr = e)),
                                                "append-to": Be.value,
                                                "max-collapse-tags": 2,
                                                placeholder:
                                                  P(he)("base.selectHolder"),
                                                "collapse-tags": "",
                                                "collapse-tags-tooltip": "",
                                                multiple: "",
                                                "popper-class": "!tw-max-w-fit",
                                              },
                                              {
                                                default: N(() => [
                                                  (V(!0),
                                                  q(
                                                    G,
                                                    null,
                                                    M(
                                                      P(C),
                                                      (e) => (
                                                        V(),
                                                        q(
                                                          G,
                                                          { key: e },
                                                          [
                                                            [
                                                              P(C)
                                                                .ExtensionsGroupId,
                                                              P(C).envDataSync,
                                                            ].includes(e)
                                                              ? U("", !0)
                                                              : (V(),
                                                                k(
                                                                  v,
                                                                  {
                                                                    key: 0,
                                                                    label:
                                                                      Ze[e],
                                                                    value: e,
                                                                  },
                                                                  null,
                                                                  8,
                                                                  [
                                                                    "label",
                                                                    "value",
                                                                  ],
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
                                              [
                                                "modelValue",
                                                "append-to",
                                                "placeholder",
                                              ],
                                            ),
                                            L(
                                              "div",
                                              {
                                                ref_key: "selectBottomDom",
                                                ref: Be,
                                                class: "tw-fixed tw-z-[2]",
                                              },
                                              null,
                                              512,
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["label"],
                                      ),
                                      B(
                                        fe,
                                        {
                                          modelValue: P(Xe),
                                          "onUpdate:modelValue":
                                            o[6] ||
                                            (o[6] = (e) =>
                                              D(Xe)
                                                ? (Xe.value = e)
                                                : (Xe = e)),
                                          isSingle: !0,
                                          showItemArr: P(Xe).showItemArr,
                                          isBatchEdit: !0,
                                          ref_key: "envSeniorV2Ref",
                                          ref: je,
                                        },
                                        null,
                                        8,
                                        ["modelValue", "showItemArr"],
                                      ),
                                    ],
                                    64,
                                  ))
                                : U("", !0),
                              la.value
                                ? (V(),
                                  q(
                                    G,
                                    { key: 4 },
                                    [
                                      B(
                                        l,
                                        {
                                          label: t.$t("env.env.req.editItem"),
                                          prop: "showItemArr",
                                        },
                                        {
                                          default: N(() => [
                                            B(
                                              d,
                                              {
                                                modelValue: P(Xe).showItemArr,
                                                "onUpdate:modelValue":
                                                  o[7] ||
                                                  (o[7] = (e) =>
                                                    (P(Xe).showItemArr = e)),
                                                "append-to": Ue.value,
                                                "max-collapse-tags": 2,
                                                placeholder:
                                                  P(he)("base.selectHolder"),
                                                "collapse-tags": "",
                                                "collapse-tags-tooltip": "",
                                                multiple: "",
                                                "popper-class": "!tw-max-w-fit",
                                              },
                                              {
                                                default: N(() => [
                                                  (V(!0),
                                                  q(
                                                    G,
                                                    null,
                                                    M(
                                                      P($e),
                                                      (e) => (
                                                        V(),
                                                        q(
                                                          G,
                                                          { key: e.column },
                                                          [
                                                            [
                                                              "webGLMetadata",
                                                              "deviceName",
                                                              "mac",
                                                            ].includes(e.column)
                                                              ? U("", !0)
                                                              : (V(),
                                                                k(
                                                                  v,
                                                                  {
                                                                    key: 0,
                                                                    label:
                                                                      e.label,
                                                                    value:
                                                                      e.column,
                                                                  },
                                                                  null,
                                                                  8,
                                                                  [
                                                                    "label",
                                                                    "value",
                                                                  ],
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
                                              [
                                                "modelValue",
                                                "append-to",
                                                "placeholder",
                                              ],
                                            ),
                                            L(
                                              "div",
                                              {
                                                ref_key: "selectBottomDom2",
                                                ref: Ue,
                                                class: "tw-fixed tw-z-[2]",
                                              },
                                              null,
                                              512,
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["label"],
                                      ),
                                      B(
                                        Ee,
                                        {
                                          ref_key: "envEditExtendFormRef",
                                          ref: Qe,
                                          modelValue: ze.value,
                                          "onUpdate:modelValue":
                                            o[8] ||
                                            (o[8] = (e) => (ze.value = e)),
                                          "drawer-props-row": P(Xe),
                                          "form-ref": P(Ve),
                                          "is-batch-operation": !0,
                                          "is-show-all": !1,
                                          isSingle: !0,
                                          onBlurGeo: _a,
                                          showItemArr: P(Xe).showItemArr,
                                        },
                                        null,
                                        8,
                                        [
                                          "modelValue",
                                          "drawer-props-row",
                                          "form-ref",
                                          "showItemArr",
                                        ],
                                      ),
                                    ],
                                    64,
                                  ))
                                : U("", !0),
                              ra.value
                                ? (V(),
                                  k(
                                    l,
                                    {
                                      key: 5,
                                      label: P(he)("env.env.req.custom_id"),
                                      prop: "sort",
                                    },
                                    {
                                      default: N(() => [
                                        B(
                                          c,
                                          {
                                            controls: !1,
                                            precision: 0,
                                            min: 0,
                                            max: 999999,
                                            modelValue: P(Xe).sort,
                                            "onUpdate:modelValue":
                                              o[9] ||
                                              (o[9] = (e) => (P(Xe).sort = e)),
                                            modelModifiers: { number: !0 },
                                            placeholder:
                                              P(he)("rpa.task.req.enter"),
                                          },
                                          null,
                                          8,
                                          ["modelValue", "placeholder"],
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["label"],
                                  ))
                                : U("", !0),
                              ia.value
                                ? (V(),
                                  k(
                                    l,
                                    {
                                      key: 6,
                                      label: t.$t("env.env.topUpTip2"),
                                    },
                                    {
                                      default: N(() => [
                                        B(
                                          s,
                                          {
                                            modelValue:
                                              P(Xe).envCookieEncryptType,
                                            "onUpdate:modelValue":
                                              o[10] ||
                                              (o[10] = (e) =>
                                                (P(Xe).envCookieEncryptType =
                                                  e)),
                                          },
                                          {
                                            default: N(() => [
                                              B(
                                                r,
                                                { label: P(i).ENCRYPT },
                                                {
                                                  default: N(() => [
                                                    H(
                                                      F(
                                                        t.$t(
                                                          "env.cookie.encrypt",
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
                                              B(
                                                r,
                                                { label: P(i).RESTORE },
                                                {
                                                  default: N(() => [
                                                    H(
                                                      F(
                                                        t.$t(
                                                          "env.cookie.decrypt",
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
                                : U("", !0),
                              sa.value
                                ? (V(),
                                  q(
                                    G,
                                    { key: 7 },
                                    [
                                      B(
                                        l,
                                        { label: t.$t("env.tag.setTag") },
                                        {
                                          default: N(() => [
                                            B(
                                              s,
                                              {
                                                modelValue:
                                                  P(Xe).envTagBatchOperation,
                                                "onUpdate:modelValue":
                                                  o[11] ||
                                                  (o[11] = (e) =>
                                                    (P(
                                                      Xe,
                                                    ).envTagBatchOperation =
                                                      e)),
                                              },
                                              {
                                                default: N(() => [
                                                  B(
                                                    r,
                                                    { label: P(p).APPEND },
                                                    {
                                                      default: N(() => [
                                                        H(
                                                          F(
                                                            P(he)(
                                                              "env.tag.appendTag",
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
                                                  B(
                                                    r,
                                                    { label: P(p).COVER },
                                                    {
                                                      default: N(() => [
                                                        H(
                                                          F(
                                                            P(he)(
                                                              "env.tag.coverTag",
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
                                                  B(
                                                    r,
                                                    { label: P(p).CLEAR },
                                                    {
                                                      default: N(() => [
                                                        H(
                                                          F(
                                                            P(he)(
                                                              "env.tag.emptyTag",
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
                                      P(Xe).envTagBatchOperation !== P(p).CLEAR
                                        ? (V(),
                                          k(
                                            l,
                                            {
                                              key: 0,
                                              label: t.$t("env.tag.selectTag"),
                                              prop: "envTagIds",
                                            },
                                            {
                                              default: N(() => [
                                                B(
                                                  Ie,
                                                  {
                                                    modelValue: P(Xe).envTagIds,
                                                    "onUpdate:modelValue":
                                                      o[12] ||
                                                      (o[12] = (e) =>
                                                        (P(Xe).envTagIds = e)),
                                                  },
                                                  null,
                                                  8,
                                                  ["modelValue"],
                                                ),
                                              ]),
                                              _: 1,
                                            },
                                            8,
                                            ["label"],
                                          ))
                                        : U("", !0),
                                    ],
                                    64,
                                  ))
                                : U("", !0),
                              pa.value
                                ? (V(),
                                  k(
                                    l,
                                    {
                                      key: 8,
                                      label: P(he)("env.env.fileType"),
                                    },
                                    {
                                      default: N(() => [
                                        B(
                                          s,
                                          {
                                            modelValue: P(Xe).envExportTemplate,
                                            "onUpdate:modelValue":
                                              o[13] ||
                                              (o[13] = (e) =>
                                                (P(Xe).envExportTemplate = e)),
                                          },
                                          {
                                            default: N(() => [
                                              B(
                                                r,
                                                {
                                                  value: P(n).EXCEL,
                                                  size: "large",
                                                },
                                                {
                                                  default: N(() => [
                                                    H(
                                                      F(
                                                        P(he)(
                                                          "env.env.ExcelFile",
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
                                              B(
                                                r,
                                                {
                                                  value: P(n).TXT,
                                                  size: "large",
                                                },
                                                {
                                                  default: N(() => [
                                                    L("div", Ce, [
                                                      L(
                                                        "div",
                                                        Ae,
                                                        F(
                                                          P(he)(
                                                            "env.env.txtFile",
                                                          ),
                                                        ),
                                                        1,
                                                      ),
                                                      B(
                                                        a,
                                                        {
                                                          content: P(he)(
                                                            "env.env.cookieLargeExportTip",
                                                          ),
                                                        },
                                                        null,
                                                        8,
                                                        ["content"],
                                                      ),
                                                    ]),
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
                                  ))
                                : U("", !0),
                            ]),
                            _: 1,
                          },
                          8,
                          ["model", "rules", "label-width"],
                        )),
                        [[T]],
                      ),
                    ]),
                  ]),
                  _: 1,
                },
                8,
                ["modelValue", "title", "width"],
              )
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-2312540f"]],
  );
export { Re as default };
