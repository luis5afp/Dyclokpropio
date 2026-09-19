import {
  d as e,
  v as o,
  cO as r,
  aW as l,
  R as a,
  V as t,
  an as u,
  as as p,
  a3 as n,
  dz as i,
  dA as y,
  al as s,
  bY as v,
  am as d,
  i as c,
  aQ as x,
  a1 as f,
  a5 as m,
  dh as w,
  D as _,
  E as I,
  A as g,
  dB as b,
  cP as C,
  r as S,
  q as P,
  o as T,
  h,
  w as k,
  x as R,
  f as V,
  a as A,
  b as E,
  X as O,
  c as U,
  F as j,
  z as N,
  bc as M,
  cR as q,
  t as W,
  e as $,
  cT as D,
  C as G,
  dC as F,
  cV as H,
  cW as L,
  ac as Y,
  cv as X,
  cZ as B,
  c$ as K,
  bQ as J,
  bS as z,
  _ as Q,
} from "./index-BUIbb6Pa.js";
import { c as Z } from "./ipResourceMock-CCd7H3CQ.js";
import { _ as ee } from "./index.vue_vue_type_script_setup_true_lang-CIPUEjpB.js";
import { _ as oe } from "./index.vue_vue_type_script_setup_true_lang-A7OAkZwm.js";
import re from "./CustomRadioGroup-Dk-imFdD.js";
import { _ as le } from "./editProxySoftDlg.vue_vue_type_script_setup_true_lang-D9otwVyq.js";
import { _ as ae } from "./envAutoInputProxy.vue_vue_type_script_setup_true_lang-CKSB7kpP.js";
import te from "./envProxyItems-DIhzCyp-.js";
import ue from "./proxyApiExtraction-CcAfvVt-.js";
import pe from "./proxyCheckButton-qJacjpSf.js";
import { _ as ne } from "./ProxyGroupSelect.vue_vue_type_script_setup_true_lang-CTswbFOC.js";
import ie from "./envSerialNums-BjlyggGT.js";
import { g as ye } from "./proxyProviderAvailability-Dl68x0Bx.js";
import { _ as se } from "./ParaturboProxyConfig.vue_vue_type_script_setup_true_lang-DnrGQZKb.js";
import "./proxySoftItem-B7tAwO_8.js";
import "./proxyUtil-OnkkuXcX.js";
import "./Tip.vue_vue_type_script_setup_true_lang-DBJcGLEl.js";
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
const ve = { id: "guide-add-proxy" },
  de = { class: "proxyFormContentWrapper tw-w-full" },
  ce = { key: 0, class: "custom-proxy-form" },
  xe = { class: "paste-hint tw-leading-[1.1]" },
  fe = { class: "tw-flex tw-items-center" },
  me = { key: 2, class: "custom-proxy-form" },
  we = { class: "tw-flex tw-items-center tw-gap-[4px]" },
  _e = { class: "w-max" },
  Ie = Q(
    e({
      __name: "proxyEditV2",
      emits: ["submit"],
      setup(e, { expose: Q, emit: Ie }) {
        const ge = c({
            isView: !1,
            title: "env.env.createTitle",
            row: {},
            batchUpdateData: [],
          }),
          be = G(() => {
            var e;
            return null == (e = ge.value.batchUpdateData ?? [])
              ? void 0
              : e.map((e) => e.serialNum);
          }),
          { t: Ce } = o.useI18n(),
          { generateFeedbackErrorMessage: Se } = r(),
          Pe = Ie,
          Te = l(),
          { nodeMavenSwitch: he } = a(Te),
          ke = c(),
          Re = c(null),
          Ve = c(null),
          Ae = G(() => [
            { value: u.Custom, label: Ce("enum.ProxyWay.CUSTOM") },
            { value: u.IP_RESOURCE, label: Ce("ipResource.dynamicProxy") },
            { value: u.FROM_API, label: Ce("enum.ProxyWay.FROM_API") },
          ]),
          Ee = G(() => {
            var e;
            const o = !!(null == (e = ge.value.row) ? void 0 : e.id);
            return J(
              z,
              [
                d.Ssh,
                ...ye(ge.value.row.proxyType),
                he.value || (o && ge.value.row.proxyType === d.NODE_MAVEN)
                  ? ""
                  : d.NODE_MAVEN,
              ].filter(Boolean),
            );
          }),
          Oe = c(),
          Ue = c(),
          je = c([]),
          Ne = c(!1),
          Me = c(!1),
          qe = c(!1),
          We = c("dynamic"),
          $e = c(!1),
          De = c(),
          Ge = G(
            () =>
              ge.value.row.proxyWay === u.IP_RESOURCE &&
              "dynamic" === We.value &&
              !$e.value,
          ),
          Fe = (e) => {
            We.value = e;
          },
          He = c(""),
          Le = G(() => {
            let e = !He.value;
            return {
              remark: e || He.value === i.REMARK,
              proxyGroupId: e || He.value === i.PROXY_GROUP,
              other: e,
            };
          }),
          Ye = () => {
            var e;
            ((Ne.value = !1),
              ke.value.clearValidate(),
              null == (e = null == Ve ? void 0 : Ve.value) ||
                e.setAutoInputContent(""));
          },
          Xe = t.throttle(async () => {
            var e, o, r;
            if (qe.value) return;
            let l;
            if (ge.value.row.proxyWay === u.IP_RESOURCE) {
              if ("dynamic" !== We.value) return;
              const r = await (null == (e = De.value)
                ? void 0
                : e.validateDynamic());
              if (
                ((l = null == (o = De.value) ? void 0 : o.getDynamicValue()),
                !r || !l)
              )
                return;
              if (!ge.value.row.id) {
                qe.value = !0;
                const [e, o] = await p(
                  Z({
                    ...l,
                    remark: ge.value.row.remark,
                    proxyGroupId: ge.value.row.proxyGroupId,
                  }),
                );
                if (((qe.value = !1), e)) return;
                return (
                  n.success(Ce("ipResource.createSuccess")),
                  (Ne.value = !1),
                  void Pe("submit", o)
                );
              }
            }
            null == (r = ke.value) ||
              r.validate(async (e) => {
                var o, r, a, t, C, S;
                if (!e) return;
                switch (((Me.value = !0), (qe.value = !0), He.value)) {
                  case i.REMARK:
                    {
                      let [e] = await p(
                        y({
                          ids: ge.value.batchUpdateData.map((e) => e.id),
                          remark: ge.value.row.remark,
                        }),
                      );
                      if (((qe.value = !1), e)) return;
                      (Ye(),
                        n.success(Ce("env.env.shareDialog.operatorSuccess")),
                        Pe("submit"));
                    }
                    return;
                  case i.PROXY_GROUP:
                    {
                      let [e] = await p(
                        y({
                          ids: ge.value.batchUpdateData.map((e) => e.id),
                          proxyGroupId: ge.value.row.proxyGroupId,
                        }),
                      );
                      if (((qe.value = !1), e)) return;
                    }
                    return (
                      Ye(),
                      n.success(Ce("env.env.shareDialog.operatorSuccess")),
                      void Pe("submit")
                    );
                }
                const P = JSON.parse(JSON.stringify(ge.value.row)),
                  T = ((e, o) => {
                    if (e === u.Custom) {
                      if ([d.Http, d.Https, d.Socks5].includes(o))
                        return s.Common;
                      if (q.includes(o)) return s.Dynamic;
                    }
                    return e === u.FROM_API
                      ? s.FROM_API
                      : e === u.IP_RESOURCE
                        ? s.IP_RESOURCE
                        : void 0;
                  })(
                    null == P ? void 0 : P.proxyWay,
                    null == P ? void 0 : P.proxyType,
                  );
                T !== s.FROM_API ||
                  (null == (o = null == P ? void 0 : P.proxyApiInfo)
                    ? void 0
                    : o.ip) ||
                  (null == (r = null == P ? void 0 : P.proxyApiInfo)
                    ? void 0
                    : r.port) ||
                  (await v(ge.value.row, !0));
                const h = l
                  ? {
                      type: d.Socks5,
                      ipType: null == P ? void 0 : P.proxyIpType,
                      proxySettingType: s.IP_RESOURCE,
                      contentJson: {
                        model: l.mode,
                        ...(l.sessionMinutes
                          ? { sessionTimeout: l.sessionMinutes }
                          : {}),
                        ...(l.countryCode ? { country: l.countryCode } : {}),
                        ...(l.stateCode ? { state: l.stateCode } : {}),
                        ...(l.cityCode ? { city: l.cityCode } : {}),
                      },
                    }
                  : {
                      type: ((e, o, r) => {
                        if (e === u.Custom) {
                          if ([d.Http, d.Https, d.Socks5].includes(o)) return o;
                          if (q.includes(o)) return r;
                        }
                        if (e === u.FROM_API) return r;
                      })(
                        null == P ? void 0 : P.proxyWay,
                        null == P ? void 0 : P.proxyType,
                        null == P ? void 0 : P.proxyTypeSoft,
                      ),
                      host:
                        null == (a = null == P ? void 0 : P.proxyHost)
                          ? void 0
                          : a.replace(/[\s\r\n]/g, ""),
                      port: null == P ? void 0 : P.proxyPort,
                      userName:
                        null == (t = null == P ? void 0 : P.proxyUserName)
                          ? void 0
                          : t.replace(/[\s\r\n]/g, ""),
                      passwd:
                        null == (C = null == P ? void 0 : P.proxyPasswd)
                          ? void 0
                          : C.replace(/[\s\r\n]/g, ""),
                      ipType: null == P ? void 0 : P.proxyIpType,
                      remark: (null == P ? void 0 : P.remark) ?? void 0,
                      proxySettingType: T,
                      proxyApiInfo: (() => {
                        const e = JSON.parse(JSON.stringify(ge.value.row));
                        return T === s.FROM_API
                          ? null == e
                            ? void 0
                            : e.proxyApiInfo
                          : void 0;
                      })(),
                      proxySoftInfo:
                        T === s.Dynamic
                          ? null == P
                            ? void 0
                            : P.proxySoftInfo
                          : void 0,
                      proxySoft:
                        ((k = null == P ? void 0 : P.proxyWay),
                        (R = null == P ? void 0 : P.proxyType),
                        k === u.Custom
                          ? q.includes(R)
                            ? R
                            : d.NONE
                          : k === u.FROM_API
                            ? R
                            : void 0),
                      ipAddrType: P.proxyIpAddrType,
                      proxyGroupId: P.proxyGroupId,
                      proxyGroupName: "",
                    };
                var k, R;
                if (null == P ? void 0 : P.id) {
                  let e = c(x().noPromptMap.editProxy);
                  const o = async () => {
                    _.api.trackEvent({
                      type: g.PROXY_CLICK,
                      action: I.CLICK_EDIT_PROXY,
                      params: h,
                      proxySettingType: T,
                    });
                    let [o] = await p(F(P.id, h));
                    (x().setNoPromptMap("editProxy", e.value),
                      o
                        ? (qe.value = !1)
                        : ((qe.value = !1), (Ne.value = !1), Pe("submit")));
                  };
                  if (e.value) return void o();
                  f({
                    title: Ce("proxy.proxy.dialog.editTitle"),
                    message: () =>
                      m("div", [
                        m("div", Ce("proxy.proxy.dialog.editContent")),
                        m(
                          w,
                          {
                            class: "tw-mt-2",
                            modelValue: e.value,
                            "onUpdate:modelValue": (o) => (e.value = o),
                          },
                          () => Ce("rpaMarket.tip18"),
                        ),
                      ]),
                    confirmCb: o,
                  });
                } else {
                  _.api.trackEvent({
                    type: g.PROXY_CLICK,
                    action: I.CLICK_CREATE_PROXY,
                    params: h,
                    proxySettingType: T,
                  });
                  const [e, o] = await p(b(h));
                  if (e) return void (qe.value = !1);
                  ((Ne.value = !1), Pe("submit", o));
                }
                ((qe.value = !1),
                  null == (S = null == Ve ? void 0 : Ve.value) ||
                    S.setAutoInputContent(""));
              });
          }, 1e3);
        let Be = G(() => ({
          proxyHost: [
            {
              required: !0,
              validator: (e, o, r) => {
                o ? r() : r(new Error(Ce("env.env.req.proxyHostRule")));
              },
            },
          ],
          proxyPort: [
            {
              required: !0,
              validator: (e, o, r) => {
                o ? r() : r(new Error(Ce("env.env.req.proxyPortRule")));
              },
            },
          ],
          proxyId: [
            {
              required: !0,
              validator: (e, o, r) => {
                o && ("fixed" != ge.value.row.proxyOwnType || o)
                  ? "random" != ge.value.row.proxyOwnType || je.value.length
                    ? r()
                    : r(new Error(Ce("env.env.req.proxyListNull")))
                  : r(new Error(Ce("env.env.req.proxyIdRule")));
              },
            },
          ],
          "proxyApiInfo.url": [
            { required: !0, message: Ce("env.env.req.input_extraction_link") },
            {
              validator: (e, o, r) => {
                o.startsWith("http")
                  ? r()
                  : r(
                      new Error(
                        Ce("env.env.req.input_correct_extraction_link"),
                      ),
                    );
              },
            },
          ],
        }));
        const Ke = G(() => {
          const e = l(),
            o = e.countryCityListMap[ge.value.row.proxyType];
          return (null == o ? void 0 : o.length)
            ? o
            : (e.countryCityListMap[d.IPFLY] ?? []);
        });
        let Je = C();
        const { proxyGroupList: ze } = a(Je),
          Qe = c({}),
          Ze = G(() =>
            ge.value.row.proxyWay === u.NonUse
              ? d.NonUse
              : q.includes(ge.value.row.proxyType)
                ? ge.value.row.proxyTypeSoft
                : ge.value.row.proxyType,
          ),
          eo = async () => {
            if (
              q.includes(ge.value.row.proxyType) &&
              ge.value.row.proxySoftEnable
            ) {
              let e = Je.softDataMap[ge.value.row.proxyType] ?? {};
              return {
                type: e.type,
                host: e.host,
                port: e.port,
                userName: L(
                  e.userName,
                  ge.value.row.proxySoftInfo,
                  ge.value.row.proxyType,
                ),
                passwd: H(
                  e.passwd,
                  ge.value.row.proxySoftInfo,
                  ge.value.row.proxyType,
                ),
                ipType: ge.value.row.proxyIpType,
                ipAddrType: ge.value.row.proxyIpAddrType,
              };
            }
            return {
              type: Ze.value,
              host: ge.value.row.proxyHost,
              port: ge.value.row.proxyPort,
              userName: L(
                ge.value.row.proxyUserName,
                ge.value.row.proxySoftInfo,
                ge.value.row.proxyType,
              ),
              passwd: H(
                ge.value.row.proxyPasswd,
                ge.value.row.proxySoftInfo,
                ge.value.row.proxyType,
              ),
              ipType: ge.value.row.proxyIpType,
              ipAddrType: ge.value.row.proxyIpAddrType,
            };
          },
          oo = (e) => {
            ((ge.value.row.proxyHost = e.proxyHost),
              (ge.value.row.proxyPort = +e.proxyPort),
              (ge.value.row.proxyUserName = e.proxyUserName),
              (ge.value.row.proxyPasswd = e.proxyPasswd),
              e.proxyType &&
                e.proxyType !== d.Placeholder &&
                (ge.value.row.proxyType = e.proxyType));
          },
          ro = async () => {
            var e, o;
            if (
              (null == (e = Oe.value) || e.resetFields(),
              ge.value.row.proxyWay === u.Custom)
            ) {
              Ee.value.find((e) => e.value === ge.value.row.proxyType) ||
                (ge.value.row.proxyType = d.Socks5);
            } else
              ge.value.row.proxyWay === u.IP_RESOURCE &&
                ((ge.value.row.proxyType = d.Socks5),
                (We.value = "dynamic"),
                ($e.value = !1),
                await Y(),
                await (null == (o = De.value) ? void 0 : o.reset("dynamic")));
          },
          lo = () => {
            (ge.value.row.proxyWay === u.Custom &&
              ge.value.row.proxyType === d.IPFLY &&
              ((ge.value.row.proxyIpType = X.IpAPI),
              (ge.value.row.proxyTypeSoft = d.Socks5)),
              ge.value.row.proxyWay === u.Custom &&
                ge.value.row.proxyType === d.S5PROXY &&
                ((ge.value.row.proxyIpType = X.IpAPI),
                (ge.value.row.proxyTypeSoft = d.Http)));
          };
        async function ao() {
          var e, o;
          const r = ge.value.row,
            l = await Se(
              "Proxy test failed for proxyEditV2, detailed information:",
              {
                name: null == r ? void 0 : r.name,
                proxyType: null == r ? void 0 : r.proxyType,
                proxyHost:
                  (null == r ? void 0 : r.proxyHost) ||
                  (null == (e = null == r ? void 0 : r.proxyApiInfo)
                    ? void 0
                    : e.ip),
                proxyPort:
                  (null == r ? void 0 : r.proxyPort) ||
                  (null == (o = null == r ? void 0 : r.proxyApiInfo)
                    ? void 0
                    : o.port),
                serialNum: null == r ? void 0 : r.serialNum,
              },
            );
          (B(["do", "chat:open", []]), B(["do", "message:send", ["text", l]]));
        }
        function to(e) {
          let o = Ke.value.find((o) => o.countryCode === e);
          (o && (ge.value.row.proxySoftInfo.country = o.name),
            (ge.value.row.proxySoftInfo.region = ""),
            (ge.value.row.proxySoftInfo.regionCode = ""),
            (ge.value.row.proxySoftInfo.city = ""));
        }
        async function uo() {
          if (!ge.value.row.proxySoftInfo || !ge.value.row.proxySoftInfo.ip)
            return void (Qe.value = {});
          let e = await K(ge.value.row.proxySoftInfo.ip, X.IpAPI);
          ((Qe.value = e),
            (ge.value.row.proxySoftInfo.countryCode = (
              e.countryCode ?? ""
            ).toLowerCase()),
            (ge.value.row.proxySoftInfo.country = e.country),
            (ge.value.row.proxySoftInfo.region = e.region),
            (ge.value.row.proxySoftInfo.regionCode = e.regionCode ?? ""),
            (ge.value.row.proxySoftInfo.city = e.city ?? ""));
        }
        function po() {}
        return (
          Q({
            acceptParams: (e, o = "") => {
              var r, a, t, p, n;
              if (
                ((Ne.value = !0),
                (ge.value = e),
                (He.value = o),
                ($e.value = !1),
                Je.getProxyGroupListFn().then(() => {
                  !ge.value.row.id &&
                    ze.value.length &&
                    (ge.value.row.proxyGroupId = ze.value[0].value);
                }),
                l().initCountryCity(),
                ge.value.row.proxyWay === u.IP_RESOURCE)
              ) {
                if (((ge.value.row.proxyType = d.Socks5), !ge.value.row.id))
                  return (
                    (We.value = "dynamic"),
                    void Y(() => {
                      var e;
                      return null == (e = De.value)
                        ? void 0
                        : e.reset("dynamic");
                    })
                  );
                We.value = "dynamic";
                const e = {
                  mode:
                    null == (r = ge.value.row.ipResourceConfig)
                      ? void 0
                      : r.mode,
                  sessionMinutes:
                    null == (a = ge.value.row.ipResourceConfig)
                      ? void 0
                      : a.sessionMinutes,
                  countryCode:
                    null == (t = ge.value.row.ipResourceConfig)
                      ? void 0
                      : t.countryCode,
                  stateCode:
                    null == (p = ge.value.row.ipResourceConfig)
                      ? void 0
                      : p.stateCode,
                  cityCode:
                    null == (n = ge.value.row.ipResourceConfig)
                      ? void 0
                      : n.cityCode,
                };
                Y(() => {
                  var o;
                  return null == (o = De.value)
                    ? void 0
                    : o.reset("dynamic", e);
                });
              }
            },
            rules: Be,
            getIpProxyInfo: uo,
          }),
          (e, o) => {
            const r = S("el-form-item"),
              l = S("el-radio-button"),
              a = S("el-option"),
              t = S("el-select"),
              p = S("el-tooltip"),
              n = S("el-input"),
              i = S("el-form"),
              y = S("el-button"),
              s = S("el-dialog"),
              v = P("trim"),
              c = P("prevent-label-click");
            return Ne.value
              ? (T(),
                h(
                  s,
                  {
                    key: 0,
                    modelValue: Ne.value,
                    "onUpdate:modelValue":
                      o[15] || (o[15] = (e) => (Ne.value = e)),
                    "align-center": !0,
                    "close-on-click-modal": !1,
                    "close-on-press-escape": !1,
                    loading: Me.value,
                    title: e.$t(ge.value.title ?? ""),
                    class: "proxy-dialog",
                    onClose: Ye,
                    width: He.value ? "550px" : "650px",
                  },
                  {
                    footer: k(() => [
                      E(
                        y,
                        { type: "info", onClick: Ye },
                        {
                          default: k(() => [$(W(e.$t("base.cancel")), 1)]),
                          _: 1,
                        },
                      ),
                      E(
                        y,
                        {
                          disabled: Ge.value,
                          loading: qe.value,
                          type: "primary",
                          onClick: V(Xe),
                        },
                        {
                          default: k(() => [$(W(e.$t("base.confirm")), 1)]),
                          _: 1,
                        },
                        8,
                        ["disabled", "loading", "onClick"],
                      ),
                    ]),
                    default: k(() => [
                      R(
                        (T(),
                        h(
                          i,
                          {
                            class: "tw-overflow-y-auto tw-max-h-[75vh]",
                            ref_key: "formRef",
                            ref: ke,
                            model: ge.value.row,
                            rules: V(Be),
                            "validate-on-rule-change": !1,
                            "label-position": "right",
                            "label-width": "auto",
                          },
                          {
                            default: k(() => [
                              A("div", ve, [
                                He.value
                                  ? (T(),
                                    h(
                                      r,
                                      {
                                        key: 0,
                                        label: e.$t("proxy.moveGroupTitle"),
                                      },
                                      {
                                        default: k(() => [
                                          E(
                                            ie,
                                            { serialNums: be.value },
                                            null,
                                            8,
                                            ["serialNums"],
                                          ),
                                        ]),
                                        _: 1,
                                      },
                                      8,
                                      ["label"],
                                    ))
                                  : O("", !0),
                                Le.value.other
                                  ? (T(),
                                    h(
                                      r,
                                      {
                                        key: 1,
                                        label: e.$t("env.env.req.proxyWay"),
                                        prop: "proxyWay",
                                      },
                                      {
                                        default: k(() => [
                                          E(
                                            re,
                                            {
                                              modelValue: ge.value.row.proxyWay,
                                              "onUpdate:modelValue":
                                                o[0] ||
                                                (o[0] = (e) =>
                                                  (ge.value.row.proxyWay = e)),
                                              onChange: ro,
                                            },
                                            {
                                              default: k(() => [
                                                (T(!0),
                                                U(
                                                  j,
                                                  null,
                                                  N(Ae.value, (e) => {
                                                    var o;
                                                    return (
                                                      T(),
                                                      h(
                                                        l,
                                                        {
                                                          id: `envV2Proxy${e.value}`,
                                                          key:
                                                            null ==
                                                            (o = e.value)
                                                              ? void 0
                                                              : o.toString(),
                                                          label: e.label,
                                                          value: e.value,
                                                        },
                                                        null,
                                                        8,
                                                        [
                                                          "id",
                                                          "label",
                                                          "value",
                                                        ],
                                                      )
                                                    );
                                                  }),
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
                                  : O("", !0),
                                E(
                                  r,
                                  {
                                    class: "tw-w-full proxyWayItem",
                                    label: "",
                                  },
                                  {
                                    default: k(() => [
                                      A("div", de, [
                                        ge.value.row.proxyWay === V(u).Custom
                                          ? (T(),
                                            U(
                                              j,
                                              { key: 0 },
                                              [
                                                Le.value.other
                                                  ? (T(),
                                                    U("div", ce, [
                                                      E(
                                                        ae,
                                                        {
                                                          ref_key:
                                                            "envAutoInputRef",
                                                          ref: Ve,
                                                          callback: oo,
                                                        },
                                                        null,
                                                        512,
                                                      ),
                                                      E(
                                                        r,
                                                        {
                                                          label: e.$t(
                                                            "env.env.req.proxyType",
                                                          ),
                                                          style: {},
                                                          prop: "proxyType",
                                                        },
                                                        {
                                                          default: k(() => [
                                                            E(
                                                              t,
                                                              {
                                                                modelValue:
                                                                  ge.value.row
                                                                    .proxyType,
                                                                "onUpdate:modelValue":
                                                                  o[1] ||
                                                                  (o[1] = (e) =>
                                                                    (ge.value.row.proxyType =
                                                                      e)),
                                                                placeholder:
                                                                  e.$t(
                                                                    "env.env.req.proxyTypeHolder",
                                                                  ),
                                                                filterable: "",
                                                                onChange: lo,
                                                              },
                                                              {
                                                                default: k(
                                                                  () => [
                                                                    (T(!0),
                                                                    U(
                                                                      j,
                                                                      null,
                                                                      N(
                                                                        Ee.value,
                                                                        (e) => (
                                                                          T(),
                                                                          U(
                                                                            j,
                                                                            {
                                                                              key: e.value,
                                                                            },
                                                                            [
                                                                              e.value !==
                                                                              V(
                                                                                d,
                                                                              )
                                                                                .NonUse
                                                                                ? (T(),
                                                                                  h(
                                                                                    a,
                                                                                    {
                                                                                      key: 0,
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
                                                                                  ))
                                                                                : O(
                                                                                    "",
                                                                                    !0,
                                                                                  ),
                                                                            ],
                                                                            64,
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
                                                                "placeholder",
                                                              ],
                                                            ),
                                                          ]),
                                                          _: 1,
                                                        },
                                                        8,
                                                        ["label"],
                                                      ),
                                                      E(
                                                        r,
                                                        {
                                                          label: V(Ce)(
                                                            "env.env.req.ipProtocol",
                                                          ),
                                                        },
                                                        {
                                                          default: k(() => [
                                                            E(
                                                              re,
                                                              {
                                                                modelValue:
                                                                  ge.value.row
                                                                    .proxyIpAddrType,
                                                                "onUpdate:modelValue":
                                                                  o[2] ||
                                                                  (o[2] = (e) =>
                                                                    (ge.value.row.proxyIpAddrType =
                                                                      e)),
                                                                onChange: po,
                                                              },
                                                              {
                                                                default: k(
                                                                  () => [
                                                                    E(
                                                                      l,
                                                                      {
                                                                        label:
                                                                          "IPv4",
                                                                        value:
                                                                          V(M)
                                                                            .IPV4,
                                                                      },
                                                                      null,
                                                                      8,
                                                                      ["value"],
                                                                    ),
                                                                    E(
                                                                      l,
                                                                      {
                                                                        label:
                                                                          "IPv6",
                                                                        value:
                                                                          V(M)
                                                                            .IPV6,
                                                                      },
                                                                      null,
                                                                      8,
                                                                      ["value"],
                                                                    ),
                                                                  ],
                                                                ),
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
                                                      V(q).includes(
                                                        ge.value.row.proxyType,
                                                      )
                                                        ? O("", !0)
                                                        : (T(),
                                                          h(
                                                            r,
                                                            {
                                                              key: 0,
                                                              label: "1",
                                                              class:
                                                                "form-item-label-hidden tw-h-[18px]",
                                                            },
                                                            {
                                                              default: k(() => [
                                                                A(
                                                                  "div",
                                                                  xe,
                                                                  W(
                                                                    e.$t(
                                                                      "proxy.proxy.dialog.pasteHint",
                                                                    ),
                                                                  ),
                                                                  1,
                                                                ),
                                                              ]),
                                                              _: 1,
                                                            },
                                                          )),
                                                      E(
                                                        te,
                                                        {
                                                          "basic-config":
                                                            ge.value.row,
                                                        },
                                                        null,
                                                        8,
                                                        ["basic-config"],
                                                      ),
                                                      V(q).includes(
                                                        ge.value.row.proxyType,
                                                      )
                                                        ? (T(),
                                                          U(
                                                            j,
                                                            { key: 1 },
                                                            [
                                                              E(
                                                                r,
                                                                {
                                                                  prop: "proxyPasswd",
                                                                },
                                                                {
                                                                  label: k(
                                                                    () => [
                                                                      A(
                                                                        "div",
                                                                        fe,
                                                                        [
                                                                          o[17] ||
                                                                            (o[17] =
                                                                              $(
                                                                                W(
                                                                                  "IP",
                                                                                ) +
                                                                                  " ",
                                                                                -1,
                                                                              )),
                                                                          E(
                                                                            p,
                                                                            {
                                                                              content:
                                                                                e.$t(
                                                                                  "env.env.req.ip_tip",
                                                                                ),
                                                                              class:
                                                                                "tw-ml-[10px]",
                                                                              effect:
                                                                                "dark",
                                                                              placement:
                                                                                "top",
                                                                              "popper-class":
                                                                                "!tw-max-w-[350px]",
                                                                            },
                                                                            {
                                                                              default:
                                                                                k(
                                                                                  () => [
                                                                                    ...(o[16] ||
                                                                                      (o[16] =
                                                                                        [
                                                                                          A(
                                                                                            "i",
                                                                                            {
                                                                                              class:
                                                                                                "iconfont icon-help-circle1 tw-cursor-pointer tw-text-subText tw-duration-300 hover:tw-text-black tw-pl-[2px]",
                                                                                            },
                                                                                            null,
                                                                                            -1,
                                                                                          ),
                                                                                        ])),
                                                                                  ],
                                                                                ),
                                                                              _: 1,
                                                                            },
                                                                            8,
                                                                            [
                                                                              "content",
                                                                            ],
                                                                          ),
                                                                        ],
                                                                      ),
                                                                    ],
                                                                  ),
                                                                  default: k(
                                                                    () => [
                                                                      E(
                                                                        n,
                                                                        {
                                                                          modelValue:
                                                                            ge
                                                                              .value
                                                                              .row
                                                                              .proxySoftInfo
                                                                              .ip,
                                                                          "onUpdate:modelValue":
                                                                            o[3] ||
                                                                            (o[3] =
                                                                              (
                                                                                e,
                                                                              ) =>
                                                                                (ge.value.row.proxySoftInfo.ip =
                                                                                  e)),
                                                                          modelModifiers:
                                                                            {
                                                                              trim: !0,
                                                                            },
                                                                          placeholder:
                                                                            e.$t(
                                                                              "rpa.task.req.enter",
                                                                            ),
                                                                          clearable:
                                                                            "",
                                                                          onBlur:
                                                                            uo,
                                                                        },
                                                                        null,
                                                                        8,
                                                                        [
                                                                          "modelValue",
                                                                          "placeholder",
                                                                        ],
                                                                      ),
                                                                    ],
                                                                  ),
                                                                  _: 1,
                                                                },
                                                              ),
                                                              E(
                                                                r,
                                                                {
                                                                  label: e.$t(
                                                                    "env.env.req.country_region",
                                                                  ),
                                                                  prop: "proxyPasswd",
                                                                },
                                                                {
                                                                  default: k(
                                                                    () => [
                                                                      E(
                                                                        t,
                                                                        {
                                                                          modelValue:
                                                                            ge
                                                                              .value
                                                                              .row
                                                                              .proxySoftInfo
                                                                              .countryCode,
                                                                          "onUpdate:modelValue":
                                                                            o[4] ||
                                                                            (o[4] =
                                                                              (
                                                                                e,
                                                                              ) =>
                                                                                (ge.value.row.proxySoftInfo.countryCode =
                                                                                  e)),
                                                                          disabled:
                                                                            !(
                                                                              !ge
                                                                                .value
                                                                                .row
                                                                                .proxySoftInfo
                                                                                .ip &&
                                                                              !Qe
                                                                                .value
                                                                                .countryCode
                                                                            ),
                                                                          placeholder:
                                                                            e.$t(
                                                                              "base.selectHolder",
                                                                            ),
                                                                          clearable:
                                                                            "",
                                                                          filterable:
                                                                            "",
                                                                          onChange:
                                                                            to,
                                                                        },
                                                                        {
                                                                          default:
                                                                            k(
                                                                              () => [
                                                                                (T(
                                                                                  !0,
                                                                                ),
                                                                                U(
                                                                                  j,
                                                                                  null,
                                                                                  N(
                                                                                    Ke.value,
                                                                                    (
                                                                                      e,
                                                                                    ) => (
                                                                                      T(),
                                                                                      h(
                                                                                        a,
                                                                                        {
                                                                                          key: e.countryCode,
                                                                                          label:
                                                                                            e.name,
                                                                                          value:
                                                                                            e.countryCode,
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
                                                                          "disabled",
                                                                          "placeholder",
                                                                        ],
                                                                      ),
                                                                    ],
                                                                  ),
                                                                  _: 1,
                                                                },
                                                                8,
                                                                ["label"],
                                                              ),
                                                              E(
                                                                r,
                                                                {
                                                                  label: e.$t(
                                                                    "env.env.req.state_province",
                                                                  ),
                                                                  prop: "proxyPasswd",
                                                                },
                                                                {
                                                                  default: k(
                                                                    () => [
                                                                      V(
                                                                        D,
                                                                      ).includes(
                                                                        ge.value
                                                                          .row
                                                                          .proxyType,
                                                                      )
                                                                        ? R(
                                                                            (T(),
                                                                            h(
                                                                              n,
                                                                              {
                                                                                key: 0,
                                                                                modelValue:
                                                                                  ge
                                                                                    .value
                                                                                    .row
                                                                                    .proxySoftInfo
                                                                                    .region,
                                                                                "onUpdate:modelValue":
                                                                                  o[5] ||
                                                                                  (o[5] =
                                                                                    (
                                                                                      e,
                                                                                    ) =>
                                                                                      (ge.value.row.proxySoftInfo.region =
                                                                                        e)),
                                                                                disabled:
                                                                                  !!ge
                                                                                    .value
                                                                                    .row
                                                                                    .proxySoftInfo
                                                                                    .ip ||
                                                                                  !ge
                                                                                    .value
                                                                                    .row
                                                                                    .proxySoftInfo
                                                                                    .countryCode ||
                                                                                  !!Qe
                                                                                    .value
                                                                                    .region,
                                                                                placeholder:
                                                                                  e.$t(
                                                                                    "env.env.req.input_optional_code",
                                                                                  ),
                                                                                clearable:
                                                                                  "",
                                                                                onBlur:
                                                                                  o[6] ||
                                                                                  (o[6] =
                                                                                    () =>
                                                                                      (ge.value.row.proxySoftInfo.region =
                                                                                        ge.value.row.proxySoftInfo.region.replace(
                                                                                          /[\r\n]+/g,
                                                                                          "",
                                                                                        ))),
                                                                              },
                                                                              null,
                                                                              8,
                                                                              [
                                                                                "modelValue",
                                                                                "disabled",
                                                                                "placeholder",
                                                                              ],
                                                                            )),
                                                                            [
                                                                              [
                                                                                v,
                                                                              ],
                                                                            ],
                                                                          )
                                                                        : R(
                                                                            (T(),
                                                                            h(
                                                                              n,
                                                                              {
                                                                                key: 1,
                                                                                modelValue:
                                                                                  ge
                                                                                    .value
                                                                                    .row
                                                                                    .proxySoftInfo
                                                                                    .regionCode,
                                                                                "onUpdate:modelValue":
                                                                                  o[7] ||
                                                                                  (o[7] =
                                                                                    (
                                                                                      e,
                                                                                    ) =>
                                                                                      (ge.value.row.proxySoftInfo.regionCode =
                                                                                        e)),
                                                                                disabled:
                                                                                  !!ge
                                                                                    .value
                                                                                    .row
                                                                                    .proxySoftInfo
                                                                                    .ip ||
                                                                                  !ge
                                                                                    .value
                                                                                    .row
                                                                                    .proxySoftInfo
                                                                                    .countryCode ||
                                                                                  !!Qe
                                                                                    .value
                                                                                    .regionCode,
                                                                                placeholder:
                                                                                  e.$t(
                                                                                    "env.env.req.input_optional_code",
                                                                                  ),
                                                                                clearable:
                                                                                  "",
                                                                                onBlur:
                                                                                  o[8] ||
                                                                                  (o[8] =
                                                                                    () =>
                                                                                      (ge.value.row.proxySoftInfo.regionCode =
                                                                                        ge.value.row.proxySoftInfo.regionCode.replace(
                                                                                          /[\r\n]+/g,
                                                                                          "",
                                                                                        ))),
                                                                              },
                                                                              null,
                                                                              8,
                                                                              [
                                                                                "modelValue",
                                                                                "disabled",
                                                                                "placeholder",
                                                                              ],
                                                                            )),
                                                                            [
                                                                              [
                                                                                v,
                                                                              ],
                                                                            ],
                                                                          ),
                                                                    ],
                                                                  ),
                                                                  _: 1,
                                                                },
                                                                8,
                                                                ["label"],
                                                              ),
                                                              E(
                                                                r,
                                                                {
                                                                  label:
                                                                    e.$t(
                                                                      "env.env.req.city",
                                                                    ),
                                                                  prop: "proxyPasswd",
                                                                },
                                                                {
                                                                  default: k(
                                                                    () => [
                                                                      R(
                                                                        E(
                                                                          n,
                                                                          {
                                                                            modelValue:
                                                                              ge
                                                                                .value
                                                                                .row
                                                                                .proxySoftInfo
                                                                                .city,
                                                                            "onUpdate:modelValue":
                                                                              o[9] ||
                                                                              (o[9] =
                                                                                (
                                                                                  e,
                                                                                ) =>
                                                                                  (ge.value.row.proxySoftInfo.city =
                                                                                    e)),
                                                                            disabled:
                                                                              !(
                                                                                !ge
                                                                                  .value
                                                                                  .row
                                                                                  .proxySoftInfo
                                                                                  .ip &&
                                                                                ge
                                                                                  .value
                                                                                  .row
                                                                                  .proxySoftInfo
                                                                                  .countryCode &&
                                                                                !Qe
                                                                                  .value
                                                                                  .city
                                                                              ),
                                                                            placeholder:
                                                                              e.$t(
                                                                                "env.env.req.input_optional_code",
                                                                              ),
                                                                            clearable:
                                                                              "",
                                                                            onBlur:
                                                                              o[10] ||
                                                                              (o[10] =
                                                                                () =>
                                                                                  (ge.value.row.proxySoftInfo.city =
                                                                                    ge.value.row.proxySoftInfo.city.replaceAll(
                                                                                      /[\r\n]+/g,
                                                                                      "",
                                                                                    ))),
                                                                          },
                                                                          null,
                                                                          8,
                                                                          [
                                                                            "modelValue",
                                                                            "disabled",
                                                                            "placeholder",
                                                                          ],
                                                                        ),
                                                                        [[v]],
                                                                      ),
                                                                    ],
                                                                  ),
                                                                  _: 1,
                                                                },
                                                                8,
                                                                ["label"],
                                                              ),
                                                            ],
                                                            64,
                                                          ))
                                                        : O("", !0),
                                                    ]))
                                                  : O("", !0),
                                              ],
                                              64,
                                            ))
                                          : ge.value.row.proxyWay ===
                                              V(u).IP_RESOURCE
                                            ? (T(),
                                              h(
                                                se,
                                                {
                                                  key: 1,
                                                  ref_key:
                                                    "paraturboProxyConfigRef",
                                                  ref: De,
                                                  context: "proxy-create",
                                                  onTypeChange: Fe,
                                                  onDynamicAvailabilityChange:
                                                    o[11] ||
                                                    (o[11] = (e) =>
                                                      ($e.value = e)),
                                                },
                                                null,
                                                512,
                                              ))
                                            : ge.value.row.proxyWay ===
                                                V(u).FROM_API
                                              ? (T(),
                                                U("div", me, [
                                                  E(
                                                    ue,
                                                    {
                                                      ref_key:
                                                        "proxyApiExtractionRef",
                                                      ref: Re,
                                                      "env-data": ge.value.row,
                                                      showRemark: !0,
                                                    },
                                                    null,
                                                    8,
                                                    ["env-data"],
                                                  ),
                                                ]))
                                              : O("", !0),
                                        ge.value.row.proxyWay === V(u).Custom
                                          ? (T(),
                                            U(
                                              j,
                                              { key: 3 },
                                              [
                                                Le.value.proxyGroupId
                                                  ? (T(),
                                                    h(
                                                      r,
                                                      {
                                                        key: 0,
                                                        class: "!tw-mb-[18px]",
                                                        label: e.$t(
                                                          "proxy.proxy.list.proxyGroup",
                                                        ),
                                                        prop: "proxyGroupId",
                                                      },
                                                      {
                                                        label: k(() => [
                                                          A("div", we, [
                                                            A(
                                                              "div",
                                                              null,
                                                              W(
                                                                e.$t(
                                                                  "proxy.proxy.list.proxyGroup",
                                                                ),
                                                              ),
                                                              1,
                                                            ),
                                                            E(
                                                              ee,
                                                              {
                                                                content: V(Ce)(
                                                                  "proxy.proxy.list.proxyGroupTip",
                                                                ),
                                                              },
                                                              null,
                                                              8,
                                                              ["content"],
                                                            ),
                                                          ]),
                                                        ]),
                                                        default: k(() => [
                                                          E(
                                                            ne,
                                                            {
                                                              modelValue:
                                                                ge.value.row
                                                                  .proxyGroupId,
                                                              "onUpdate:modelValue":
                                                                o[12] ||
                                                                (o[12] = (e) =>
                                                                  (ge.value.row.proxyGroupId =
                                                                    e)),
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
                                                  : O("", !0),
                                                Le.value.remark
                                                  ? (T(),
                                                    h(
                                                      r,
                                                      {
                                                        key: 1,
                                                        class: "!tw-mb-[18px]",
                                                        label:
                                                          e.$t(
                                                            "env.env.req.remark",
                                                          ),
                                                        prop: "remark",
                                                      },
                                                      {
                                                        default: k(() => [
                                                          R(
                                                            E(
                                                              n,
                                                              {
                                                                modelValue:
                                                                  ge.value.row
                                                                    .remark,
                                                                "onUpdate:modelValue":
                                                                  o[13] ||
                                                                  (o[13] = (
                                                                    e,
                                                                  ) =>
                                                                    (ge.value.row.remark =
                                                                      e)),
                                                                maxlength: 200,
                                                                placeholder:
                                                                  e.$t(
                                                                    "env.env.req.remark",
                                                                  ),
                                                                clearable: "",
                                                                "show-word-limit":
                                                                  "",
                                                              },
                                                              null,
                                                              8,
                                                              [
                                                                "modelValue",
                                                                "placeholder",
                                                              ],
                                                            ),
                                                            [[v]],
                                                          ),
                                                        ]),
                                                        _: 1,
                                                      },
                                                      8,
                                                      ["label"],
                                                    ))
                                                  : O("", !0),
                                                Le.value.other
                                                  ? (T(),
                                                    h(
                                                      r,
                                                      {
                                                        key: 2,
                                                        class: "!tw-mb-[18px]",
                                                        label: e.$t(
                                                          "env.env.req.proxyIpType",
                                                        ),
                                                        prop: "proxyIpType",
                                                      },
                                                      {
                                                        default: k(() => [
                                                          A("div", _e, [
                                                            E(
                                                              oe,
                                                              {
                                                                modelValue:
                                                                  ge.value.row
                                                                    .proxyIpType,
                                                                "onUpdate:modelValue":
                                                                  o[14] ||
                                                                  (o[14] = (
                                                                    e,
                                                                  ) =>
                                                                    (ge.value.row.proxyIpType =
                                                                      e)),
                                                                placeholder:
                                                                  e.$t(
                                                                    "env.env.req.proxyIpTypeHolder",
                                                                  ),
                                                                filterable: "",
                                                              },
                                                              null,
                                                              8,
                                                              [
                                                                "modelValue",
                                                                "placeholder",
                                                              ],
                                                            ),
                                                          ]),
                                                        ]),
                                                        _: 1,
                                                      },
                                                      8,
                                                      ["label"],
                                                    ))
                                                  : O("", !0),
                                                Le.value.other
                                                  ? (T(),
                                                    h(
                                                      r,
                                                      {
                                                        key: 3,
                                                        label: " ",
                                                        class:
                                                          "!tw-mb-[18px] !tw-items-center",
                                                      },
                                                      {
                                                        default: k(() => [
                                                          E(
                                                            pe,
                                                            {
                                                              ref_key:
                                                                "proxyCheckButtonRef",
                                                              ref: Oe,
                                                              getCheckProxyDataFn:
                                                                eo,
                                                              handleFeedbackFn:
                                                                ao,
                                                            },
                                                            null,
                                                            512,
                                                          ),
                                                        ]),
                                                        _: 1,
                                                      },
                                                    ))
                                                  : O("", !0),
                                              ],
                                              64,
                                            ))
                                          : O("", !0),
                                      ]),
                                    ]),
                                    _: 1,
                                  },
                                ),
                              ]),
                            ]),
                            _: 1,
                          },
                          8,
                          ["model", "rules"],
                        )),
                        [[c]],
                      ),
                      E(
                        le,
                        { ref_key: "editProxySoftDlgRef", ref: Ue },
                        null,
                        512,
                      ),
                    ]),
                    _: 1,
                  },
                  8,
                  ["modelValue", "loading", "title", "width"],
                ))
              : O("", !0);
          }
        );
      },
    }),
    [["__scopeId", "data-v-0b14e214"]],
  );
export { Ie as default };
