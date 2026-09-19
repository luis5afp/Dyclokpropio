import {
  d as e,
  i as l,
  v as a,
  G as o,
  W as t,
  r as n,
  o as u,
  c as r,
  F as d,
  a as i,
  z as c,
  h as s,
  aj as v,
  w as p,
  t as m,
  b,
  f as w,
  e as V,
  X as y,
  O as f,
  C as g,
  bU as h,
  bT as k,
  d9 as R,
  V as x,
  cA as _,
  bb as $,
  d7 as T,
  cy as I,
  ac as q,
  _ as C,
} from "./index-BUIbb6Pa.js";
import { _ as U } from "./envAddAcceptLangDialog.vue_vue_type_script_setup_true_name_envAddAcceptLangDialog_lang-DdcOzUN-.js";
import S from "./envEditFontDialog-BAmKs9Pq.js";
import { u as D } from "./useEnvEdit-B6M5ajw7.js";
import E from "./CustomRadioGroup-Dk-imFdD.js";
import {
  _ as M,
  n as O,
} from "./TlsCipherSuiteSelector.vue_vue_type_script_setup_true_lang-Bm0jmwwi.js";
import { _ as L } from "./Tip.vue_vue_type_script_setup_true_lang-DBJcGLEl.js";
import "./timezone-BMz8A6Hf.js";
const P = { class: "extend-item-container" },
  B = { key: 0 },
  H = { key: 0 },
  A = { style: { color: "#fff", width: "300px" } },
  W = { key: 0 },
  j = { class: "accept-lang-container" },
  G = { key: 0, class: "m-t-12" },
  N = { key: 1, class: "m-t-24" },
  F = { key: 0, class: "font-container" },
  z = { key: 0 },
  K = { key: 0, class: "envV2EditFormItemBox tw-mt-[5px]" },
  J = { class: "tw-text-[var(--el-text-color-regular)]" },
  X = { class: "tw-text-[var(--el-text-color-regular)]" },
  Q = { class: "tw-text-[var(--el-text-color-regular)]" },
  Y = { class: "tw-text-[var(--el-text-color-regular)]" },
  Z = { class: "tw-text-[var(--el-text-color-regular)]" },
  ee = { key: 0, class: "ratio-input-wrapper" },
  le = { key: 0, class: "ratio-input-wrapper" },
  ae = { key: 9, class: "webGLMetadata-wrapper" },
  oe = { key: 1, class: "select-wrapper" },
  te = { key: 0, class: "unit" },
  ne = { key: 1, class: "select-wrapper" },
  ue = { key: 0, class: "unit" },
  re = "disabled",
  de = "enabled",
  ie = C(
    e({
      __name: "envEditExtendForm",
      props: {
        modelValue: {},
        batchExtendConfig: {},
        importExtendConfig: {},
        drawerPropsRow: {},
        batchDrawerPropsRow: {},
        importDrawerPropsRow: {},
        isEdit: { type: Boolean, default: !1 },
        isBatch: { type: Boolean, default: !1 },
        isSingle: { type: Boolean, default: !1 },
        isBulkImport: { type: Boolean, default: !1 },
        isBatchOperation: { type: Boolean, default: !1 },
        showItemArr: { default: () => [] },
        isShowAll: { type: Boolean, default: !0 },
        formRef: {},
      },
      emits: ["blurGeo"],
      setup(e, { expose: C, emit: ie }) {
        const ce = e,
          {
            ratioList: se,
            extendConfigList: ve,
            getRatioList: pe,
            androidRatioList: me,
            iosRatioList: be,
            noiseTypeArr: we,
            noiseValueArr: Ve,
            createNoiseValue: ye,
          } = D({ isEdit: l(ce.isEdit), isSingle: l(ce.isSingle) }),
          { t: fe } = a.useI18n(),
          ge = o(),
          he = g(() => ge.language),
          ke = l({});
        let Re = ie;
        const xe = l([]),
          _e = l(),
          $e = l(),
          Te =
            /^((25[0-5]\.|2[0-4]\d\.|1\d{2}\.|[1-9]?\d\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d))$/,
          Ie = l(!0);
        let qe = l(ce.modelValue);
        const Ce = l(re),
          Ue = g({
            get: () => {
              var e, l;
              return (null == (e = qe.value) ? void 0 : e.webrtcSyncProxyIpFlag)
                ? "proxyIp"
                : (
                      null == (l = qe.value)
                        ? void 0
                        : l.webrtcUseRandomInternalIp
                    )
                  ? "randomIp"
                  : "manual";
            },
            set: (e) => {
              const l = e;
              "proxyIp" === l
                ? ((qe.value.webrtcSyncProxyIpFlag = !0),
                  (qe.value.webrtcUseRandomInternalIp = !1))
                : "randomIp" === l
                  ? ((qe.value.webrtcSyncProxyIpFlag = !1),
                    (qe.value.webrtcUseRandomInternalIp = !0),
                    "boolean" != typeof qe.value.webrtcKeepRandomInternalIp &&
                      (qe.value.webrtcKeepRandomInternalIp = !1))
                  : ((qe.value.webrtcSyncProxyIpFlag = !1),
                    (qe.value.webrtcUseRandomInternalIp = !1));
            },
          });
        let Se = l(ce.drawerPropsRow);
        const De =
            /^[\-\+]?(0(\.\d{1,6})?|([1-9](\d)?)(\.\d{1,6})?|1[0-7]\d{1}(\.\d{1,6})?|180|180\.0{1,6})$/,
          Ee = /^\d+$/;
        function Me(e = !1) {
          var l;
          O(null == (l = qe.value) ? void 0 : l.tlsDisabledValues)
            ? (Ce.value = de)
            : e && (Ce.value = re);
        }
        let Oe = g(() => ({
          "extend.acceptLang": [
            {
              validator: (e, l, a) => {
                "custom" === qe.value.acceptLangType &&
                $(qe.value.acceptLangValue)
                  ? a(new Error(fe("env.env.req.acceptLangRule")))
                  : a();
              },
            },
          ],
          "extend.tlsDisabledValues": [
            {
              validator: (e, l, a) => {
                var o;
                Ce.value !== de ||
                O(null == (o = qe.value) ? void 0 : o.tlsDisabledValues)
                  ? a()
                  : a(new Error(fe("env.env.req.tlsDisabledValuesRule")));
              },
              trigger: "change",
            },
          ],
          "extend.geo": [
            {
              validator: (e, l, a) => {
                var o, t, n;
                if ("custom" !== qe.value.geoSubType) return void a();
                const u = qe.value.geoValue;
                $(u.longitude) || $(u.latitude) || $(u.accuracy)
                  ? a(new Error(fe("env.env.req.geoRule1")))
                  : !u.longitude ||
                      De.test(null == (o = u.longitude) ? void 0 : o.toString())
                    ? !u.latitude ||
                      De.test(null == (t = u.latitude) ? void 0 : t.toString())
                      ? !u.accuracy ||
                        Ee.test(
                          null == (n = u.accuracy) ? void 0 : n.toString(),
                        )
                        ? a()
                        : a(new Error(fe("env.env.req.geoRule4")))
                      : a(new Error(fe("env.env.req.geoRule3")))
                    : a(new Error(fe("env.env.req.geoRule2")));
              },
              trigger: "change",
            },
          ],
          "extend.webrtcValue": [
            {
              validator: (e, l, a) => {
                if ("replace" !== qe.value.webrtcType) return void a();
                if ("manual" !== Ue.value) return void a();
                const o = qe.value.webrtcValue;
                o
                  ? !o || Te.test(o)
                    ? a()
                    : a(new Error(fe("env.env.req.webrtcRule2")))
                  : a(new Error(fe("env.env.req.webrtcRule1")));
              },
            },
          ],
          "extend.ratio": [
            {
              validator: (e, l, a) => {
                "custom" !== qe.value.ratioType ||
                "custom" !== qe.value.ratioValue ||
                (qe.value.ratioWidth && qe.value.ratioHeight)
                  ? a()
                  : a(fe("env.env.req.ratioInputPlaceholder"));
              },
            },
          ],
          "extend.windowRatio": [
            {
              validator: (e, l, a) => {
                "custom" !== qe.value.windowRatioType ||
                "custom" !== qe.value.windowRatioValue ||
                (qe.value.windowWidth && qe.value.windowHeight)
                  ? a()
                  : a(fe("env.env.req.ratioInputPlaceholder"));
              },
            },
          ],
          "extend.port": [
            {
              validator: (e, l, a) => {
                "1" !== qe.value.portType ||
                !qe.value.portValue ||
                ((qe.value.portValue = qe.value.portValue
                  .replace("，", ",")
                  .replace(/\s/g, "")
                  .replace(/[^0-9, ]/g, "")),
                qe.value.portValue
                  .split(",")
                  .every((e) => Number(e) >= 1 && Number(e) <= 65535))
                  ? a()
                  : a(fe("env.env.req.portRule"));
              },
              trigger: "blur",
            },
          ],
          "extend.webglRender": [
            {
              validator: (e, l, a) => {
                "custom" !== qe.value.webGLMetadataType || qe.value.webglRender
                  ? a()
                  : a(fe("env.env.req.webglRenderRule"));
              },
              trigger: "blur",
            },
          ],
          "extend.webglManufacturer": [
            {
              validator: (e, l, a) => {
                "custom" !== qe.value.webGLMetadataType ||
                qe.value.webglManufacturer
                  ? a()
                  : a(fe("env.env.req.webglManufacturerRule"));
              },
              trigger: "blur",
            },
          ],
        }));
        (t(
          () => [ce.isBatch, ce.isSingle, ce.isBulkImport],
          () => {
            (ce.isBatch
              ? ((qe.value = ce.batchExtendConfig),
                (Se.value = ce.batchDrawerPropsRow))
              : ce.isBulkImport
                ? ((qe.value = ce.importExtendConfig),
                  (Se.value = ce.importDrawerPropsRow))
                : ((qe.value = ce.modelValue), (Se.value = ce.drawerPropsRow)),
              Me(!0),
              qe.value.acceptLangValue &&
                q(() => {
                  ((xe.value = []),
                    qe.value.acceptLangValue.forEach((e) => {
                      Reflect.get(ke.value, e) &&
                        xe.value.push({ label: ke.value[e], value: e });
                    }));
                }));
          },
          { immediate: !0 },
        ),
          t(
            () => {
              var e;
              return null == (e = qe.value) ? void 0 : e.tlsDisabledValues;
            },
            () => {
              Me(!1);
            },
          ),
          t(
            () => Ce.value,
            (e) => {
              e === re &&
                (async function () {
                  var e;
                  (await q(),
                    null == (e = ce.formRef) ||
                      e.clearValidate("extend.tlsDisabledValues"));
                })();
            },
          ));
        const Le = () => {
            ("custom" === qe.value.acceptLangType &&
              (qe.value.acceptLangValue = xe.value.map((e) => e.value)),
              "disable" === qe.value.geoType && (qe.value.geoSubType = "ip"),
              "replace" !== qe.value.webrtcType ||
                Te.test(qe.value.webrtcValue) ||
                (qe.value.webrtcValue = ""),
              "custom" === qe.value.ratioType &&
                !qe.value.ratioValue &&
                se.value.length > 1 &&
                (qe.value.ratioValue = "750 x 1334"),
              "custom" === qe.value.windowRatioType &&
                !qe.value.windowRatioValue &&
                se.value.length > 1 &&
                (qe.value.windowRatioValue = "1920 x 1080"));
          },
          Pe = (e, l) => {
            if (e <= 0 || e >= xe.value.length) return;
            const a = JSON.parse(JSON.stringify(xe.value[e]));
            (l
              ? (xe.value.splice(e, 1), xe.value.unshift(a))
              : ((xe.value[e] = xe.value[e - 1]), (xe.value[e - 1] = a)),
              Le());
          },
          Be = (e, l) => {
            if (e < 0 || e >= xe.value.length - 1) return;
            const a = JSON.parse(JSON.stringify(xe.value[e]));
            (l
              ? (xe.value.splice(e, 1), xe.value.push(a))
              : ((xe.value[e] = xe.value[e + 1]), (xe.value[e + 1] = a)),
              Le());
          },
          He = () => {
            var e;
            null == (e = _e.value) || e.openDialog();
          },
          Ae = () => {
            Re("blurGeo");
          },
          We = async () => {
            var e, l;
            qe.value.fontValue = R({
              uaOs: null == (e = Se.value) ? void 0 : e.uaOs,
              os: null == (l = Se.value) ? void 0 : l.os,
            });
          },
          je = () => {
            var e, l, a;
            null == (a = $e.value) ||
              a.openDialog(qe.value.fontValue, {
                uaOs: null == (e = Se.value) ? void 0 : e.uaOs,
                os: null == (l = Se.value) ? void 0 : l.os,
              });
          };
        async function Ge() {
          var e, l;
          if (["truth"].includes(qe.value.webGLMetadataType)) return;
          let a = null == (e = Se.value) ? void 0 : e.uaOs;
          if (!a) {
            let e = Object.keys(
              (null == (l = Se.value) ? void 0 : l.os) || {},
            ).filter((e) => {
              var l;
              return Reflect.get(
                (null == (l = Se.value) ? void 0 : l.os) || {},
                e,
              ).length;
            });
            a = e[x.random(0, e.length - 1)].toUpperCase();
          }
          let {
            webglManufacturer: o,
            webglRender: t,
            adapterinfoArchitecture: n,
            adapterinfoVendor: u,
          } = await _(a);
          ((qe.value.webglRender = t),
            (qe.value.webglManufacturer = o),
            (qe.value.adapterinfoArchitecture = n),
            (qe.value.adapterinfoVendor = u));
        }
        const Ne = (e) => {
            if (!e || !e.length) return;
            const l = xe.value.map((e) => e.value);
            (e.forEach((e) => {
              l.includes(e.value) || xe.value.push(e);
            }),
              Le());
          },
          Fe = (e) => {
            $(e)
              ? T(fe("env.env.req.fontRule"))
              : (e.sort((e, l) =>
                  e.localeCompare(l, void 0, { sensitivity: "base" }),
                ),
                (qe.value.fontValue = e));
          };
        return (
          ce.isBatchOperation ||
            t(
              () => {
                var e, l;
                return [
                  ce.drawerPropsRow.uaOs,
                  null == (e = ce.batchDrawerPropsRow) ? void 0 : e.uaOs,
                  null == (l = ce.importDrawerPropsRow) ? void 0 : l.uaOs,
                ];
              },
              () => {
                Ge();
              },
              { deep: !0, immediate: !ce.isEdit },
            ),
          (function () {
            const e = [];
            (h.data.forEach((l) => {
              l.accept &&
                e.push({
                  label:
                    l["zh" === (null == he ? void 0 : he.value) ? "zh" : "en"],
                  value: l.code,
                });
            }),
              (ke.value = k(e)));
          })(),
          pe(),
          C({
            rules: Oe,
            handleExtendConfig: () => {
              const e = x.cloneDeep(qe.value);
              e.tlsDisabledValues = O(e.tlsDisabledValues);
              let l = Se.value.uaOs ?? I.Windows;
              if (
                "random" == e.ratioType ||
                ("truth" === e.ratioType && ["IOS", "ANDROID"].includes(l))
              ) {
                let a = {
                    [I.Windows]: se.value,
                    [I.Mac]: se.value,
                    [I.Linux]: se.value,
                    [I.Android]: me.value,
                    [I.Ios]: be.value,
                  },
                  o = Reflect.get(a, l),
                  t =
                    o[
                      x.random(
                        ["IOS", "ANDROID"].includes(l) ? 0 : 3,
                        ["IOS", "ANDROID"].includes(l) ? o.length - 1 : 29,
                      )
                    ];
                ("random" == e.ratioType
                  ? (e.ratioValue = t.value)
                  : (e.ratioValue = "random"),
                  (e.ratioWidth = t.value.split(" x ")[0]),
                  (e.ratioHeight = t.value.split(" x ")[1]));
              } else
                "custom" !== e.ratioValue &&
                  ((e.ratioWidth = e.ratioValue.split(" x ")[0]),
                  (e.ratioHeight = e.ratioValue.split(" x ")[1]));
              return (
                "custom" !== e.windowRatioValue &&
                  ((e.windowWidth = e.windowRatioValue.split(" x ")[0]),
                  (e.windowHeight = e.windowRatioValue.split(" x ")[1])),
                we.forEach((l) => {
                  Reflect.set(e, l + "Value", Ve[l + "Noise"] || ye());
                }),
                ce.isSingle ||
                  ("random" === e.deviceMemoryType &&
                    ((e.deviceMemoryValue = "random"),
                    delete e.deviceMemoryType),
                  "random" === e.hardwareConcurrencyType &&
                    ((e.hardwareConcurrencyValue = "random"),
                    delete e.hardwareConcurrencyType)),
                e
              );
            },
          }),
          (l, a) => {
            const o = n("el-tooltip"),
              t = n("el-radio-button"),
              g = n("el-button"),
              h = n("el-input-number"),
              k = n("el-form-item"),
              R = n("el-option"),
              x = n("el-select"),
              _ = n("el-radio"),
              $ = n("el-radio-group"),
              T = n("el-input"),
              I = n("TipIcon");
            return (
              u(),
              r(
                d,
                null,
                [
                  i("div", null, [
                    (u(!0),
                    r(
                      d,
                      null,
                      c(
                        w(ve),
                        (n, q) => (
                          u(),
                          r(
                            d,
                            null,
                            [
                              e.isShowAll || e.showItemArr.includes(n.column)
                                ? (u(),
                                  s(
                                    k,
                                    {
                                      key: q,
                                      label: n.label,
                                      prop: `extend.${n.column}`,
                                      class: "extend-item",
                                    },
                                    v(
                                      {
                                        default: p(() => {
                                          var v, q, C;
                                          return [
                                            i("div", P, [
                                              "custom2" !== n.componentType
                                                ? (u(),
                                                  r("div", B, [
                                                    b(
                                                      E,
                                                      {
                                                        modelValue:
                                                          w(qe)[
                                                            `${n.column}Type`
                                                          ],
                                                        "onUpdate:modelValue": (
                                                          e,
                                                        ) =>
                                                          (w(qe)[
                                                            `${n.column}Type`
                                                          ] = e),
                                                      },
                                                      {
                                                        default: p(() => [
                                                          (u(!0),
                                                          r(
                                                            d,
                                                            null,
                                                            c(
                                                              n.options,
                                                              (e) => (
                                                                u(),
                                                                s(
                                                                  t,
                                                                  {
                                                                    key: e.value,
                                                                    label:
                                                                      e.label,
                                                                    value:
                                                                      e.value,
                                                                    onChange:
                                                                      Le,
                                                                  },
                                                                  {
                                                                    default: p(
                                                                      () => [
                                                                        "custom" ===
                                                                        e.type
                                                                          ? (u(),
                                                                            r(
                                                                              "div",
                                                                              H,
                                                                              [
                                                                                b(
                                                                                  o,
                                                                                  {
                                                                                    placement:
                                                                                      "top",
                                                                                  },
                                                                                  {
                                                                                    content:
                                                                                      p(
                                                                                        () => [
                                                                                          i(
                                                                                            "div",
                                                                                            A,
                                                                                            [
                                                                                              i(
                                                                                                "p",
                                                                                                null,
                                                                                                m(
                                                                                                  w(
                                                                                                    fe,
                                                                                                  )(
                                                                                                    "env.env.req.ratioTruthBtn1",
                                                                                                  ),
                                                                                                ),
                                                                                                1,
                                                                                              ),
                                                                                              i(
                                                                                                "p",
                                                                                                null,
                                                                                                m(
                                                                                                  w(
                                                                                                    fe,
                                                                                                  )(
                                                                                                    "env.env.req.ratioTruthBtn2",
                                                                                                  ),
                                                                                                ),
                                                                                                1,
                                                                                              ),
                                                                                            ],
                                                                                          ),
                                                                                        ],
                                                                                      ),
                                                                                    default:
                                                                                      p(
                                                                                        () => [
                                                                                          a[21] ||
                                                                                            (a[21] =
                                                                                              i(
                                                                                                "i",
                                                                                                {
                                                                                                  class:
                                                                                                    "iconfont icon-help-circle",
                                                                                                  style:
                                                                                                    {
                                                                                                      "font-size":
                                                                                                        "15px",
                                                                                                    },
                                                                                                },
                                                                                                null,
                                                                                                -1,
                                                                                              )),
                                                                                        ],
                                                                                      ),
                                                                                    _: 1,
                                                                                  },
                                                                                ),
                                                                                V(
                                                                                  " " +
                                                                                    m(
                                                                                      e.label,
                                                                                    ),
                                                                                  1,
                                                                                ),
                                                                              ],
                                                                            ))
                                                                          : (u(),
                                                                            r(
                                                                              d,
                                                                              {
                                                                                key: 1,
                                                                              },
                                                                              [
                                                                                V(
                                                                                  m(
                                                                                    e.label,
                                                                                  ),
                                                                                  1,
                                                                                ),
                                                                              ],
                                                                              64,
                                                                            )),
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
                                                        _: 2,
                                                      },
                                                      1032,
                                                      [
                                                        "modelValue",
                                                        "onUpdate:modelValue",
                                                      ],
                                                    ),
                                                  ]))
                                                : y("", !0),
                                              "acceptLang" === n.column
                                                ? (u(),
                                                  r(
                                                    d,
                                                    { key: 1 },
                                                    [
                                                      "custom" ===
                                                      w(qe)[`${n.column}Type`]
                                                        ? (u(),
                                                          r("div", W, [
                                                            i("div", j, [
                                                              (u(!0),
                                                              r(
                                                                d,
                                                                null,
                                                                c(
                                                                  xe.value,
                                                                  (e, l) => (
                                                                    u(),
                                                                    r(
                                                                      "div",
                                                                      {
                                                                        key: l,
                                                                        class:
                                                                          "accept-lang-item",
                                                                      },
                                                                      [
                                                                        i(
                                                                          "span",
                                                                          null,
                                                                          m(
                                                                            e.label,
                                                                          ),
                                                                          1,
                                                                        ),
                                                                        i(
                                                                          "div",
                                                                          null,
                                                                          [
                                                                            b(
                                                                              g,
                                                                              {
                                                                                type: "info",
                                                                                link: "",
                                                                                onClick:
                                                                                  (
                                                                                    e,
                                                                                  ) =>
                                                                                    Pe(
                                                                                      l,
                                                                                      !0,
                                                                                    ),
                                                                                disabled:
                                                                                  !(
                                                                                    l >
                                                                                    0
                                                                                  ),
                                                                              },
                                                                              {
                                                                                default:
                                                                                  p(
                                                                                    () => [
                                                                                      ...(a[22] ||
                                                                                        (a[22] =
                                                                                          [
                                                                                            i(
                                                                                              "i",
                                                                                              {
                                                                                                class:
                                                                                                  "iconfont icon-to-top",
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
                                                                                "onClick",
                                                                                "disabled",
                                                                              ],
                                                                            ),
                                                                            b(
                                                                              g,
                                                                              {
                                                                                type: "info",
                                                                                link: "",
                                                                                onClick:
                                                                                  (
                                                                                    e,
                                                                                  ) =>
                                                                                    Pe(
                                                                                      l,
                                                                                      !1,
                                                                                    ),
                                                                                disabled:
                                                                                  !(
                                                                                    l >
                                                                                    0
                                                                                  ),
                                                                              },
                                                                              {
                                                                                default:
                                                                                  p(
                                                                                    () => [
                                                                                      ...(a[23] ||
                                                                                        (a[23] =
                                                                                          [
                                                                                            i(
                                                                                              "i",
                                                                                              {
                                                                                                class:
                                                                                                  "iconfont icon-arrow-up",
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
                                                                                "onClick",
                                                                                "disabled",
                                                                              ],
                                                                            ),
                                                                            b(
                                                                              g,
                                                                              {
                                                                                type: "info",
                                                                                link: "",
                                                                                onClick:
                                                                                  (
                                                                                    e,
                                                                                  ) =>
                                                                                    Be(
                                                                                      l,
                                                                                      !1,
                                                                                    ),
                                                                                disabled:
                                                                                  !(
                                                                                    l <
                                                                                    xe
                                                                                      .value
                                                                                      .length -
                                                                                      1
                                                                                  ),
                                                                              },
                                                                              {
                                                                                default:
                                                                                  p(
                                                                                    () => [
                                                                                      ...(a[24] ||
                                                                                        (a[24] =
                                                                                          [
                                                                                            i(
                                                                                              "i",
                                                                                              {
                                                                                                class:
                                                                                                  "iconfont icon-arrow-down",
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
                                                                                "onClick",
                                                                                "disabled",
                                                                              ],
                                                                            ),
                                                                            b(
                                                                              g,
                                                                              {
                                                                                type: "info",
                                                                                link: "",
                                                                                onClick:
                                                                                  (
                                                                                    e,
                                                                                  ) =>
                                                                                    Be(
                                                                                      l,
                                                                                      !0,
                                                                                    ),
                                                                                disabled:
                                                                                  !(
                                                                                    l <
                                                                                    xe
                                                                                      .value
                                                                                      .length -
                                                                                      1
                                                                                  ),
                                                                              },
                                                                              {
                                                                                default:
                                                                                  p(
                                                                                    () => [
                                                                                      ...(a[25] ||
                                                                                        (a[25] =
                                                                                          [
                                                                                            i(
                                                                                              "i",
                                                                                              {
                                                                                                class:
                                                                                                  "iconfont icon-to-bottom",
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
                                                                                "onClick",
                                                                                "disabled",
                                                                              ],
                                                                            ),
                                                                            b(
                                                                              g,
                                                                              {
                                                                                type: "info",
                                                                                link: "",
                                                                                onClick:
                                                                                  (
                                                                                    e,
                                                                                  ) => {
                                                                                    var a;
                                                                                    (a =
                                                                                      l) <
                                                                                      0 ||
                                                                                      a >
                                                                                        xe
                                                                                          .value
                                                                                          .length -
                                                                                          1 ||
                                                                                      (xe.value.splice(
                                                                                        a,
                                                                                        1,
                                                                                      ),
                                                                                      Le());
                                                                                  },
                                                                              },
                                                                              {
                                                                                default:
                                                                                  p(
                                                                                    () => [
                                                                                      ...(a[26] ||
                                                                                        (a[26] =
                                                                                          [
                                                                                            i(
                                                                                              "i",
                                                                                              {
                                                                                                class:
                                                                                                  "iconfont icon-remove",
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
                                                                                "onClick",
                                                                              ],
                                                                            ),
                                                                          ],
                                                                        ),
                                                                      ],
                                                                    )
                                                                  ),
                                                                ),
                                                                128,
                                                              )),
                                                            ]),
                                                            b(
                                                              g,
                                                              {
                                                                link: "",
                                                                type: "primary",
                                                                onClick: He,
                                                              },
                                                              {
                                                                default: p(
                                                                  () => [
                                                                    a[27] ||
                                                                      (a[27] =
                                                                        i(
                                                                          "i",
                                                                          {
                                                                            class:
                                                                              "iconfont icon-plus",
                                                                          },
                                                                          null,
                                                                          -1,
                                                                        )),
                                                                    V(
                                                                      " " +
                                                                        m(
                                                                          l.$t(
                                                                            "env.env.req.addLanguage",
                                                                          ),
                                                                        ),
                                                                      1,
                                                                    ),
                                                                  ],
                                                                ),
                                                                _: 1,
                                                              },
                                                            ),
                                                          ]))
                                                        : y("", !0),
                                                    ],
                                                    64,
                                                  ))
                                                : "tlsDisabledValues" ===
                                                    n.column
                                                  ? (u(),
                                                    s(
                                                      M,
                                                      {
                                                        key: 2,
                                                        modelValue:
                                                          w(qe)
                                                            .tlsDisabledValues,
                                                        "onUpdate:modelValue":
                                                          a[0] ||
                                                          (a[0] = (e) =>
                                                            (w(
                                                              qe,
                                                            ).tlsDisabledValues =
                                                              e)),
                                                        mode: Ce.value,
                                                        "onUpdate:mode":
                                                          a[1] ||
                                                          (a[1] = (e) =>
                                                            (Ce.value = e)),
                                                      },
                                                      null,
                                                      8,
                                                      ["modelValue", "mode"],
                                                    ))
                                                  : "geo" === n.column
                                                    ? (u(),
                                                      r(
                                                        d,
                                                        { key: 3 },
                                                        [
                                                          "disable" !==
                                                          w(qe).geoType
                                                            ? (u(),
                                                              r("div", G, [
                                                                b(
                                                                  E,
                                                                  {
                                                                    modelValue:
                                                                      w(qe)
                                                                        .geoSubType,
                                                                    "onUpdate:modelValue":
                                                                      a[2] ||
                                                                      (a[2] = (
                                                                        e,
                                                                      ) =>
                                                                        (w(
                                                                          qe,
                                                                        ).geoSubType =
                                                                          e)),
                                                                  },
                                                                  {
                                                                    default: p(
                                                                      () => [
                                                                        (u(!0),
                                                                        r(
                                                                          d,
                                                                          null,
                                                                          c(
                                                                            n.valueOptions,
                                                                            (
                                                                              e,
                                                                            ) => (
                                                                              u(),
                                                                              s(
                                                                                t,
                                                                                {
                                                                                  key: e.value,
                                                                                  label:
                                                                                    e.label,
                                                                                  value:
                                                                                    e.value,
                                                                                  onChange:
                                                                                    Le,
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
                                                                    _: 2,
                                                                  },
                                                                  1032,
                                                                  [
                                                                    "modelValue",
                                                                  ],
                                                                ),
                                                              ]))
                                                            : y("", !0),
                                                          "custom" ===
                                                          w(qe).geoSubType
                                                            ? (u(),
                                                              r("div", N, [
                                                                b(
                                                                  k,
                                                                  {
                                                                    label: l.$t(
                                                                      "env.env.req.longitude",
                                                                    ),
                                                                    class:
                                                                      "geo-longitude",
                                                                  },
                                                                  {
                                                                    default: p(
                                                                      () => [
                                                                        b(
                                                                          h,
                                                                          {
                                                                            min: -180,
                                                                            max: 180,
                                                                            class:
                                                                              "tw-w-[100%]",
                                                                            controls:
                                                                              !1,
                                                                            modelValue:
                                                                              w(
                                                                                qe,
                                                                              )
                                                                                .geoValue
                                                                                .longitude,
                                                                            "onUpdate:modelValue":
                                                                              a[3] ||
                                                                              (a[3] =
                                                                                (
                                                                                  e,
                                                                                ) =>
                                                                                  (w(
                                                                                    qe,
                                                                                  ).geoValue.longitude =
                                                                                    e)),
                                                                            placeholder:
                                                                              l.$t(
                                                                                "env.env.req.longitudeHolder",
                                                                              ),
                                                                            onBlur:
                                                                              Ae,
                                                                            clearable:
                                                                              "",
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
                                                                  8,
                                                                  ["label"],
                                                                ),
                                                                b(
                                                                  k,
                                                                  {
                                                                    label: l.$t(
                                                                      "env.env.req.latitude",
                                                                    ),
                                                                    class:
                                                                      "geo-latitude",
                                                                  },
                                                                  {
                                                                    default: p(
                                                                      () => [
                                                                        b(
                                                                          h,
                                                                          {
                                                                            class:
                                                                              "tw-w-[100%]",
                                                                            min: -180,
                                                                            max: 180,
                                                                            controls:
                                                                              !1,
                                                                            modelValue:
                                                                              w(
                                                                                qe,
                                                                              )
                                                                                .geoValue
                                                                                .latitude,
                                                                            "onUpdate:modelValue":
                                                                              a[4] ||
                                                                              (a[4] =
                                                                                (
                                                                                  e,
                                                                                ) =>
                                                                                  (w(
                                                                                    qe,
                                                                                  ).geoValue.latitude =
                                                                                    e)),
                                                                            placeholder:
                                                                              l.$t(
                                                                                "env.env.req.latitudeHolder",
                                                                              ),
                                                                            onBlur:
                                                                              Ae,
                                                                            clearable:
                                                                              "",
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
                                                                  8,
                                                                  ["label"],
                                                                ),
                                                                b(
                                                                  k,
                                                                  {
                                                                    label: l.$t(
                                                                      "env.env.req.accuracy",
                                                                    ),
                                                                    class:
                                                                      "geo-accuracy",
                                                                  },
                                                                  {
                                                                    default: p(
                                                                      () => [
                                                                        b(
                                                                          h,
                                                                          {
                                                                            class:
                                                                              "tw-w-[100%]",
                                                                            step: 1,
                                                                            min: 10,
                                                                            max: 5e3,
                                                                            controls:
                                                                              !1,
                                                                            modelValue:
                                                                              w(
                                                                                qe,
                                                                              )
                                                                                .geoValue
                                                                                .accuracy,
                                                                            "onUpdate:modelValue":
                                                                              a[5] ||
                                                                              (a[5] =
                                                                                (
                                                                                  e,
                                                                                ) =>
                                                                                  (w(
                                                                                    qe,
                                                                                  ).geoValue.accuracy =
                                                                                    e)),
                                                                            placeholder:
                                                                              l.$t(
                                                                                "env.env.req.accuracyHolder",
                                                                              ),
                                                                            onBlur:
                                                                              Ae,
                                                                            clearable:
                                                                              "",
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
                                                                  8,
                                                                  ["label"],
                                                                ),
                                                              ]))
                                                            : y("", !0),
                                                        ],
                                                        64,
                                                      ))
                                                    : "font" === n.column
                                                      ? (u(),
                                                        r(
                                                          d,
                                                          { key: 4 },
                                                          [
                                                            "custom" ===
                                                            w(qe)[
                                                              `${n.column}Type`
                                                            ]
                                                              ? (u(),
                                                                r("div", F, [
                                                                  i(
                                                                    "div",
                                                                    {
                                                                      class: f({
                                                                        "font-list":
                                                                          !0,
                                                                        collapse:
                                                                          Ie.value,
                                                                      }),
                                                                    },
                                                                    m(
                                                                      Ie.value
                                                                        ? `${null == (v = w(qe).fontValue) ? void 0 : v.slice(0, 4).join(", ")} ${l.$t("base.etc", { N: null == (q = w(qe).fontValue) ? void 0 : q.length })}`
                                                                        : null ==
                                                                            (C =
                                                                              w(
                                                                                qe,
                                                                              ).fontValue)
                                                                          ? void 0
                                                                          : C.join(
                                                                              ", ",
                                                                            ),
                                                                    ),
                                                                    3,
                                                                  ),
                                                                  b(
                                                                    g,
                                                                    {
                                                                      link: "",
                                                                      type: "primary",
                                                                      onClick:
                                                                        We,
                                                                    },
                                                                    {
                                                                      default:
                                                                        p(
                                                                          () => [
                                                                            a[28] ||
                                                                              (a[28] =
                                                                                i(
                                                                                  "i",
                                                                                  {
                                                                                    class:
                                                                                      "iconfont icon-random",
                                                                                  },
                                                                                  null,
                                                                                  -1,
                                                                                )),
                                                                            V(
                                                                              " " +
                                                                                m(
                                                                                  l.$t(
                                                                                    "env.env.req.randomFont",
                                                                                  ),
                                                                                ),
                                                                              1,
                                                                            ),
                                                                          ],
                                                                        ),
                                                                      _: 1,
                                                                    },
                                                                  ),
                                                                  b(
                                                                    g,
                                                                    {
                                                                      link: "",
                                                                      type: "primary",
                                                                      onClick:
                                                                        je,
                                                                    },
                                                                    {
                                                                      default:
                                                                        p(
                                                                          () => [
                                                                            a[29] ||
                                                                              (a[29] =
                                                                                i(
                                                                                  "i",
                                                                                  {
                                                                                    class:
                                                                                      "iconfont icon-edit",
                                                                                  },
                                                                                  null,
                                                                                  -1,
                                                                                )),
                                                                            V(
                                                                              " " +
                                                                                m(
                                                                                  l.$t(
                                                                                    "base.edit",
                                                                                  ),
                                                                                ),
                                                                              1,
                                                                            ),
                                                                          ],
                                                                        ),
                                                                      _: 1,
                                                                    },
                                                                  ),
                                                                  Ie.value
                                                                    ? (u(),
                                                                      s(
                                                                        g,
                                                                        {
                                                                          key: 0,
                                                                          link: "",
                                                                          type: "primary",
                                                                          onClick:
                                                                            a[6] ||
                                                                            (a[6] =
                                                                              (
                                                                                e,
                                                                              ) =>
                                                                                (Ie.value =
                                                                                  !1)),
                                                                        },
                                                                        {
                                                                          default:
                                                                            p(
                                                                              () => [
                                                                                a[30] ||
                                                                                  (a[30] =
                                                                                    i(
                                                                                      "i",
                                                                                      {
                                                                                        class:
                                                                                          "iconfont icon-arrow",
                                                                                      },
                                                                                      null,
                                                                                      -1,
                                                                                    )),
                                                                                V(
                                                                                  " " +
                                                                                    m(
                                                                                      l.$t(
                                                                                        "base.expand",
                                                                                      ),
                                                                                    ),
                                                                                  1,
                                                                                ),
                                                                              ],
                                                                            ),
                                                                          _: 1,
                                                                        },
                                                                      ))
                                                                    : (u(),
                                                                      s(
                                                                        g,
                                                                        {
                                                                          key: 1,
                                                                          link: "",
                                                                          type: "primary",
                                                                          onClick:
                                                                            a[7] ||
                                                                            (a[7] =
                                                                              (
                                                                                e,
                                                                              ) =>
                                                                                (Ie.value =
                                                                                  !0)),
                                                                        },
                                                                        {
                                                                          default:
                                                                            p(
                                                                              () => [
                                                                                a[31] ||
                                                                                  (a[31] =
                                                                                    i(
                                                                                      "i",
                                                                                      {
                                                                                        class:
                                                                                          "iconfont icon-arrow fold",
                                                                                      },
                                                                                      null,
                                                                                      -1,
                                                                                    )),
                                                                                V(
                                                                                  m(
                                                                                    l.$t(
                                                                                      "base.fold",
                                                                                    ),
                                                                                  ),
                                                                                  1,
                                                                                ),
                                                                              ],
                                                                            ),
                                                                          _: 1,
                                                                        },
                                                                      )),
                                                                ]))
                                                              : y("", !0),
                                                          ],
                                                          64,
                                                        ))
                                                      : "select" ===
                                                          n.componentType
                                                        ? (u(),
                                                          r(
                                                            d,
                                                            { key: 5 },
                                                            [
                                                              n.valueOptions &&
                                                              "custom" ===
                                                                w(qe)[
                                                                  `${n.column}Type`
                                                                ]
                                                                ? (u(),
                                                                  r("div", z, [
                                                                    b(
                                                                      x,
                                                                      {
                                                                        modelValue:
                                                                          w(qe)[
                                                                            `${n.column}Value`
                                                                          ],
                                                                        "onUpdate:modelValue":
                                                                          (e) =>
                                                                            (w(
                                                                              qe,
                                                                            )[
                                                                              `${n.column}Value`
                                                                            ] =
                                                                              e),
                                                                        placeholder:
                                                                          l.$t(
                                                                            "base.selectHolder",
                                                                          ),
                                                                        filterable:
                                                                          "",
                                                                        class:
                                                                          "m-t-5",
                                                                        onChange:
                                                                          Le,
                                                                      },
                                                                      {
                                                                        default:
                                                                          p(
                                                                            () => [
                                                                              (u(
                                                                                !0,
                                                                              ),
                                                                              r(
                                                                                d,
                                                                                null,
                                                                                c(
                                                                                  n.valueOptions,
                                                                                  (
                                                                                    e,
                                                                                  ) => (
                                                                                    u(),
                                                                                    s(
                                                                                      R,
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
                                                                            ],
                                                                          ),
                                                                        _: 2,
                                                                      },
                                                                      1032,
                                                                      [
                                                                        "modelValue",
                                                                        "onUpdate:modelValue",
                                                                        "placeholder",
                                                                      ],
                                                                    ),
                                                                  ]))
                                                                : y("", !0),
                                                            ],
                                                            64,
                                                          ))
                                                        : "webrtc" === n.column
                                                          ? (u(),
                                                            r(
                                                              d,
                                                              { key: 6 },
                                                              [
                                                                "replace" ===
                                                                w(qe)[
                                                                  `${n.column}Type`
                                                                ]
                                                                  ? (u(),
                                                                    r(
                                                                      "div",
                                                                      K,
                                                                      [
                                                                        b(
                                                                          k,
                                                                          {
                                                                            label:
                                                                              w(
                                                                                fe,
                                                                              )(
                                                                                "env.env.req.webrtcReplaceType",
                                                                              ),
                                                                            "label-position":
                                                                              "left",
                                                                          },
                                                                          {
                                                                            default:
                                                                              p(
                                                                                () => [
                                                                                  b(
                                                                                    $,
                                                                                    {
                                                                                      modelValue:
                                                                                        Ue.value,
                                                                                      "onUpdate:modelValue":
                                                                                        a[8] ||
                                                                                        (a[8] =
                                                                                          (
                                                                                            e,
                                                                                          ) =>
                                                                                            (Ue.value =
                                                                                              e)),
                                                                                      class:
                                                                                        "m-t-5 tw-flex tw-gap-2",
                                                                                    },
                                                                                    {
                                                                                      default:
                                                                                        p(
                                                                                          () => [
                                                                                            b(
                                                                                              _,
                                                                                              {
                                                                                                value:
                                                                                                  "manual",
                                                                                              },
                                                                                              {
                                                                                                default:
                                                                                                  p(
                                                                                                    () => [
                                                                                                      i(
                                                                                                        "div",
                                                                                                        J,
                                                                                                        m(
                                                                                                          l.$t(
                                                                                                            "env.env.req.webrtcManualInput",
                                                                                                          ),
                                                                                                        ),
                                                                                                        1,
                                                                                                      ),
                                                                                                    ],
                                                                                                  ),
                                                                                                _: 1,
                                                                                              },
                                                                                            ),
                                                                                            b(
                                                                                              _,
                                                                                              {
                                                                                                value:
                                                                                                  "proxyIp",
                                                                                              },
                                                                                              {
                                                                                                default:
                                                                                                  p(
                                                                                                    () => [
                                                                                                      i(
                                                                                                        "div",
                                                                                                        X,
                                                                                                        m(
                                                                                                          l.$t(
                                                                                                            "env.env.req.useMatchingWebRTCIP",
                                                                                                          ),
                                                                                                        ),
                                                                                                        1,
                                                                                                      ),
                                                                                                    ],
                                                                                                  ),
                                                                                                _: 1,
                                                                                              },
                                                                                            ),
                                                                                            b(
                                                                                              _,
                                                                                              {
                                                                                                value:
                                                                                                  "randomIp",
                                                                                              },
                                                                                              {
                                                                                                default:
                                                                                                  p(
                                                                                                    () => [
                                                                                                      i(
                                                                                                        "div",
                                                                                                        Q,
                                                                                                        m(
                                                                                                          l.$t(
                                                                                                            "env.env.req.useRandomInternalIP",
                                                                                                          ),
                                                                                                        ),
                                                                                                        1,
                                                                                                      ),
                                                                                                    ],
                                                                                                  ),
                                                                                                _: 1,
                                                                                              },
                                                                                            ),
                                                                                          ],
                                                                                        ),
                                                                                      _: 1,
                                                                                    },
                                                                                    8,
                                                                                    [
                                                                                      "modelValue",
                                                                                    ],
                                                                                  ),
                                                                                ],
                                                                              ),
                                                                            _: 1,
                                                                          },
                                                                          8,
                                                                          [
                                                                            "label",
                                                                          ],
                                                                        ),
                                                                        "manual" ===
                                                                        Ue.value
                                                                          ? (u(),
                                                                            s(
                                                                              k,
                                                                              {
                                                                                key: 0,
                                                                                label:
                                                                                  w(
                                                                                    fe,
                                                                                  )(
                                                                                    "env.env.req.webrtcValue",
                                                                                  ),
                                                                                "label-position":
                                                                                  "left",
                                                                                prop: "extend.webrtcValue",
                                                                              },
                                                                              {
                                                                                default:
                                                                                  p(
                                                                                    () => [
                                                                                      b(
                                                                                        T,
                                                                                        {
                                                                                          modelValue:
                                                                                            w(
                                                                                              qe,
                                                                                            )[
                                                                                              `${n.column}Value`
                                                                                            ],
                                                                                          "onUpdate:modelValue":
                                                                                            (
                                                                                              e,
                                                                                            ) =>
                                                                                              (w(
                                                                                                qe,
                                                                                              )[
                                                                                                `${n.column}Value`
                                                                                              ] =
                                                                                                e),
                                                                                          placeholder:
                                                                                            l.$t(
                                                                                              "env.env.req.webrtcValueHolder",
                                                                                            ),
                                                                                          class:
                                                                                            "tw-mt-[8px] w-max",
                                                                                          clearable:
                                                                                            "",
                                                                                        },
                                                                                        null,
                                                                                        8,
                                                                                        [
                                                                                          "modelValue",
                                                                                          "onUpdate:modelValue",
                                                                                          "placeholder",
                                                                                        ],
                                                                                      ),
                                                                                    ],
                                                                                  ),
                                                                                _: 2,
                                                                              },
                                                                              1032,
                                                                              [
                                                                                "label",
                                                                              ],
                                                                            ))
                                                                          : y(
                                                                              "",
                                                                              !0,
                                                                            ),
                                                                        "randomIp" ===
                                                                        Ue.value
                                                                          ? (u(),
                                                                            s(
                                                                              k,
                                                                              {
                                                                                key: 1,
                                                                                label:
                                                                                  w(
                                                                                    fe,
                                                                                  )(
                                                                                    "env.env.req.webrtcKeepRandomInternalIp",
                                                                                  ),
                                                                                "label-position":
                                                                                  "left",
                                                                                class:
                                                                                  "!tw-mb-[0]",
                                                                              },
                                                                              {
                                                                                default:
                                                                                  p(
                                                                                    () => [
                                                                                      b(
                                                                                        $,
                                                                                        {
                                                                                          modelValue:
                                                                                            w(
                                                                                              qe,
                                                                                            )
                                                                                              .webrtcKeepRandomInternalIp,
                                                                                          "onUpdate:modelValue":
                                                                                            a[9] ||
                                                                                            (a[9] =
                                                                                              (
                                                                                                e,
                                                                                              ) =>
                                                                                                (w(
                                                                                                  qe,
                                                                                                ).webrtcKeepRandomInternalIp =
                                                                                                  e)),
                                                                                          class:
                                                                                            "tw-flex tw-gap-4",
                                                                                        },
                                                                                        {
                                                                                          default:
                                                                                            p(
                                                                                              () => [
                                                                                                b(
                                                                                                  _,
                                                                                                  {
                                                                                                    value:
                                                                                                      !1,
                                                                                                  },
                                                                                                  {
                                                                                                    default:
                                                                                                      p(
                                                                                                        () => [
                                                                                                          i(
                                                                                                            "div",
                                                                                                            Y,
                                                                                                            [
                                                                                                              V(
                                                                                                                m(
                                                                                                                  l.$t(
                                                                                                                    "env.env.req.notKeep",
                                                                                                                  ),
                                                                                                                ) +
                                                                                                                  " ",
                                                                                                                1,
                                                                                                              ),
                                                                                                              b(
                                                                                                                I,
                                                                                                                {
                                                                                                                  content:
                                                                                                                    l.$t(
                                                                                                                      "env.env.req.notKeepTip",
                                                                                                                    ),
                                                                                                                },
                                                                                                                null,
                                                                                                                8,
                                                                                                                [
                                                                                                                  "content",
                                                                                                                ],
                                                                                                              ),
                                                                                                            ],
                                                                                                          ),
                                                                                                        ],
                                                                                                      ),
                                                                                                    _: 1,
                                                                                                  },
                                                                                                ),
                                                                                                b(
                                                                                                  _,
                                                                                                  {
                                                                                                    value:
                                                                                                      !0,
                                                                                                  },
                                                                                                  {
                                                                                                    default:
                                                                                                      p(
                                                                                                        () => [
                                                                                                          i(
                                                                                                            "div",
                                                                                                            Z,
                                                                                                            [
                                                                                                              V(
                                                                                                                m(
                                                                                                                  l.$t(
                                                                                                                    "env.env.req.keep",
                                                                                                                  ),
                                                                                                                ) +
                                                                                                                  " ",
                                                                                                                1,
                                                                                                              ),
                                                                                                              b(
                                                                                                                I,
                                                                                                                {
                                                                                                                  content:
                                                                                                                    l.$t(
                                                                                                                      "env.env.req.keepTip",
                                                                                                                    ),
                                                                                                                },
                                                                                                                null,
                                                                                                                8,
                                                                                                                [
                                                                                                                  "content",
                                                                                                                ],
                                                                                                              ),
                                                                                                            ],
                                                                                                          ),
                                                                                                        ],
                                                                                                      ),
                                                                                                    _: 1,
                                                                                                  },
                                                                                                ),
                                                                                              ],
                                                                                            ),
                                                                                          _: 1,
                                                                                        },
                                                                                        8,
                                                                                        [
                                                                                          "modelValue",
                                                                                        ],
                                                                                      ),
                                                                                    ],
                                                                                  ),
                                                                                _: 1,
                                                                              },
                                                                              8,
                                                                              [
                                                                                "label",
                                                                              ],
                                                                            ))
                                                                          : y(
                                                                              "",
                                                                              !0,
                                                                            ),
                                                                      ],
                                                                    ))
                                                                  : y("", !0),
                                                              ],
                                                              64,
                                                            ))
                                                          : "ratio" ===
                                                                n.column &&
                                                              "custom" ===
                                                                w(qe).ratioType
                                                            ? (u(),
                                                              r(
                                                                d,
                                                                { key: 7 },
                                                                [
                                                                  b(
                                                                    x,
                                                                    {
                                                                      modelValue:
                                                                        w(qe)
                                                                          .ratioValue,
                                                                      "onUpdate:modelValue":
                                                                        a[10] ||
                                                                        (a[10] =
                                                                          (e) =>
                                                                            (w(
                                                                              qe,
                                                                            ).ratioValue =
                                                                              e)),
                                                                      placeholder:
                                                                        l.$t(
                                                                          "base.selectHolder",
                                                                        ),
                                                                      filterable:
                                                                        "",
                                                                      class:
                                                                        "m-t-5",
                                                                    },
                                                                    {
                                                                      default:
                                                                        p(
                                                                          () => [
                                                                            (u(
                                                                              !0,
                                                                            ),
                                                                            r(
                                                                              d,
                                                                              null,
                                                                              c(
                                                                                w(
                                                                                  se,
                                                                                ),
                                                                                (
                                                                                  e,
                                                                                ) => (
                                                                                  u(),
                                                                                  s(
                                                                                    R,
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
                                                                  "custom" ===
                                                                  w(qe)
                                                                    .ratioValue
                                                                    ? (u(),
                                                                      r(
                                                                        "div",
                                                                        ee,
                                                                        [
                                                                          b(
                                                                            h,
                                                                            {
                                                                              placeholder:
                                                                                l.$t(
                                                                                  "env.env.req.ratioInputPlaceholder",
                                                                                ),
                                                                              modelValue:
                                                                                w(
                                                                                  qe,
                                                                                )
                                                                                  .ratioWidth,
                                                                              "onUpdate:modelValue":
                                                                                a[11] ||
                                                                                (a[11] =
                                                                                  (
                                                                                    e,
                                                                                  ) =>
                                                                                    (w(
                                                                                      qe,
                                                                                    ).ratioWidth =
                                                                                      e)),
                                                                              modelModifiers:
                                                                                {
                                                                                  number:
                                                                                    !0,
                                                                                },
                                                                              min: 1,
                                                                              controls:
                                                                                !1,
                                                                            },
                                                                            null,
                                                                            8,
                                                                            [
                                                                              "placeholder",
                                                                              "modelValue",
                                                                            ],
                                                                          ),
                                                                          a[32] ||
                                                                            (a[32] =
                                                                              i(
                                                                                "span",
                                                                                null,
                                                                                "x",
                                                                                -1,
                                                                              )),
                                                                          b(
                                                                            h,
                                                                            {
                                                                              placeholder:
                                                                                l.$t(
                                                                                  "env.env.req.ratioInputPlaceholder",
                                                                                ),
                                                                              modelValue:
                                                                                w(
                                                                                  qe,
                                                                                )
                                                                                  .ratioHeight,
                                                                              "onUpdate:modelValue":
                                                                                a[12] ||
                                                                                (a[12] =
                                                                                  (
                                                                                    e,
                                                                                  ) =>
                                                                                    (w(
                                                                                      qe,
                                                                                    ).ratioHeight =
                                                                                      e)),
                                                                              min: 1,
                                                                              controls:
                                                                                !1,
                                                                            },
                                                                            null,
                                                                            8,
                                                                            [
                                                                              "placeholder",
                                                                              "modelValue",
                                                                            ],
                                                                          ),
                                                                        ],
                                                                      ))
                                                                    : y("", !0),
                                                                ],
                                                                64,
                                                              ))
                                                            : "windowRatio" ===
                                                                  n.column &&
                                                                "custom" ===
                                                                  w(qe)
                                                                    .windowRatioType
                                                              ? (u(),
                                                                r(
                                                                  d,
                                                                  { key: 8 },
                                                                  [
                                                                    b(
                                                                      x,
                                                                      {
                                                                        modelValue:
                                                                          w(qe)
                                                                            .windowRatioValue,
                                                                        "onUpdate:modelValue":
                                                                          a[13] ||
                                                                          (a[13] =
                                                                            (
                                                                              e,
                                                                            ) =>
                                                                              (w(
                                                                                qe,
                                                                              ).windowRatioValue =
                                                                                e)),
                                                                        placeholder:
                                                                          l.$t(
                                                                            "base.selectHolder",
                                                                          ),
                                                                        filterable:
                                                                          "",
                                                                        class:
                                                                          "m-t-5",
                                                                      },
                                                                      {
                                                                        default:
                                                                          p(
                                                                            () => [
                                                                              (u(
                                                                                !0,
                                                                              ),
                                                                              r(
                                                                                d,
                                                                                null,
                                                                                c(
                                                                                  w(
                                                                                    se,
                                                                                  ),
                                                                                  (
                                                                                    e,
                                                                                  ) => (
                                                                                    u(),
                                                                                    s(
                                                                                      R,
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
                                                                    "custom" ===
                                                                    w(qe)
                                                                      .windowRatioValue
                                                                      ? (u(),
                                                                        r(
                                                                          "div",
                                                                          le,
                                                                          [
                                                                            b(
                                                                              h,
                                                                              {
                                                                                placeholder:
                                                                                  l.$t(
                                                                                    "env.env.req.ratioInputPlaceholder",
                                                                                  ),
                                                                                modelValue:
                                                                                  w(
                                                                                    qe,
                                                                                  )
                                                                                    .windowWidth,
                                                                                "onUpdate:modelValue":
                                                                                  a[14] ||
                                                                                  (a[14] =
                                                                                    (
                                                                                      e,
                                                                                    ) =>
                                                                                      (w(
                                                                                        qe,
                                                                                      ).windowWidth =
                                                                                        e)),
                                                                                modelModifiers:
                                                                                  {
                                                                                    number:
                                                                                      !0,
                                                                                  },
                                                                                min: 1,
                                                                                controls:
                                                                                  !1,
                                                                              },
                                                                              null,
                                                                              8,
                                                                              [
                                                                                "placeholder",
                                                                                "modelValue",
                                                                              ],
                                                                            ),
                                                                            a[33] ||
                                                                              (a[33] =
                                                                                i(
                                                                                  "span",
                                                                                  null,
                                                                                  "x",
                                                                                  -1,
                                                                                )),
                                                                            b(
                                                                              h,
                                                                              {
                                                                                placeholder:
                                                                                  l.$t(
                                                                                    "env.env.req.ratioInputPlaceholder",
                                                                                  ),
                                                                                modelValue:
                                                                                  w(
                                                                                    qe,
                                                                                  )
                                                                                    .windowHeight,
                                                                                "onUpdate:modelValue":
                                                                                  a[15] ||
                                                                                  (a[15] =
                                                                                    (
                                                                                      e,
                                                                                    ) =>
                                                                                      (w(
                                                                                        qe,
                                                                                      ).windowHeight =
                                                                                        e)),
                                                                                modelModifiers:
                                                                                  {
                                                                                    number:
                                                                                      !0,
                                                                                  },
                                                                                min: 1,
                                                                                controls:
                                                                                  !1,
                                                                              },
                                                                              null,
                                                                              8,
                                                                              [
                                                                                "placeholder",
                                                                                "modelValue",
                                                                              ],
                                                                            ),
                                                                          ],
                                                                        ))
                                                                      : y(
                                                                          "",
                                                                          !0,
                                                                        ),
                                                                  ],
                                                                  64,
                                                                ))
                                                              : "webGLMetadata" !==
                                                                    n.column ||
                                                                  "custom" !==
                                                                    w(qe)
                                                                      .webGLMetadataType ||
                                                                  e.isBatchOperation
                                                                ? "deviceMemory" ===
                                                                  n.column
                                                                  ? (u(),
                                                                    r(
                                                                      d,
                                                                      {
                                                                        key: 10,
                                                                      },
                                                                      [
                                                                        e.isSingle ||
                                                                        e.isEdit
                                                                          ? y(
                                                                              "",
                                                                              !0,
                                                                            )
                                                                          : (u(),
                                                                            s(
                                                                              E,
                                                                              {
                                                                                key: 0,
                                                                                modelValue:
                                                                                  w(
                                                                                    qe,
                                                                                  )
                                                                                    .deviceMemoryType,
                                                                                "onUpdate:modelValue":
                                                                                  a[18] ||
                                                                                  (a[18] =
                                                                                    (
                                                                                      e,
                                                                                    ) =>
                                                                                      (w(
                                                                                        qe,
                                                                                      ).deviceMemoryType =
                                                                                        e)),
                                                                                class:
                                                                                  "m-b-5",
                                                                              },
                                                                              {
                                                                                default:
                                                                                  p(
                                                                                    () => [
                                                                                      (u(
                                                                                        !0,
                                                                                      ),
                                                                                      r(
                                                                                        d,
                                                                                        null,
                                                                                        c(
                                                                                          n.options,
                                                                                          (
                                                                                            e,
                                                                                          ) => (
                                                                                            u(),
                                                                                            s(
                                                                                              t,
                                                                                              {
                                                                                                key: e.value,
                                                                                                label:
                                                                                                  e.label,
                                                                                                value:
                                                                                                  e.value,
                                                                                                onChange:
                                                                                                  Le,
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
                                                                                _: 2,
                                                                              },
                                                                              1032,
                                                                              [
                                                                                "modelValue",
                                                                              ],
                                                                            )),
                                                                        e.isSingle ||
                                                                        "custom" ===
                                                                          w(qe)
                                                                            .deviceMemoryType
                                                                          ? (u(),
                                                                            r(
                                                                              "div",
                                                                              oe,
                                                                              [
                                                                                b(
                                                                                  x,
                                                                                  {
                                                                                    modelValue:
                                                                                      w(
                                                                                        qe,
                                                                                      )[
                                                                                        `${n.column}Value`
                                                                                      ],
                                                                                    "onUpdate:modelValue":
                                                                                      (
                                                                                        e,
                                                                                      ) =>
                                                                                        (w(
                                                                                          qe,
                                                                                        )[
                                                                                          `${n.column}Value`
                                                                                        ] =
                                                                                          e),
                                                                                    placeholder:
                                                                                      l.$t(
                                                                                        "base.selectHolder",
                                                                                      ),
                                                                                    filterable:
                                                                                      "",
                                                                                  },
                                                                                  {
                                                                                    default:
                                                                                      p(
                                                                                        () => [
                                                                                          (u(
                                                                                            !0,
                                                                                          ),
                                                                                          r(
                                                                                            d,
                                                                                            null,
                                                                                            c(
                                                                                              n.valueOptions,
                                                                                              (
                                                                                                e,
                                                                                              ) => (
                                                                                                u(),
                                                                                                s(
                                                                                                  R,
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
                                                                                        ],
                                                                                      ),
                                                                                    _: 2,
                                                                                  },
                                                                                  1032,
                                                                                  [
                                                                                    "modelValue",
                                                                                    "onUpdate:modelValue",
                                                                                    "placeholder",
                                                                                  ],
                                                                                ),
                                                                                "truth" !==
                                                                                w(
                                                                                  qe,
                                                                                )[
                                                                                  `${n.column}Value`
                                                                                ]
                                                                                  ? (u(),
                                                                                    r(
                                                                                      "div",
                                                                                      te,
                                                                                      "GB",
                                                                                    ))
                                                                                  : y(
                                                                                      "",
                                                                                      !0,
                                                                                    ),
                                                                              ],
                                                                            ))
                                                                          : y(
                                                                              "",
                                                                              !0,
                                                                            ),
                                                                      ],
                                                                      64,
                                                                    ))
                                                                  : "hardwareConcurrency" ===
                                                                      n.column
                                                                    ? (u(),
                                                                      r(
                                                                        d,
                                                                        {
                                                                          key: 11,
                                                                        },
                                                                        [
                                                                          e.isSingle
                                                                            ? y(
                                                                                "",
                                                                                !0,
                                                                              )
                                                                            : (u(),
                                                                              s(
                                                                                E,
                                                                                {
                                                                                  key: 0,
                                                                                  modelValue:
                                                                                    w(
                                                                                      qe,
                                                                                    )
                                                                                      .hardwareConcurrencyType,
                                                                                  "onUpdate:modelValue":
                                                                                    a[19] ||
                                                                                    (a[19] =
                                                                                      (
                                                                                        e,
                                                                                      ) =>
                                                                                        (w(
                                                                                          qe,
                                                                                        ).hardwareConcurrencyType =
                                                                                          e)),
                                                                                  class:
                                                                                    "m-b-5",
                                                                                },
                                                                                {
                                                                                  default:
                                                                                    p(
                                                                                      () => [
                                                                                        (u(
                                                                                          !0,
                                                                                        ),
                                                                                        r(
                                                                                          d,
                                                                                          null,
                                                                                          c(
                                                                                            n.options,
                                                                                            (
                                                                                              e,
                                                                                            ) => (
                                                                                              u(),
                                                                                              s(
                                                                                                t,
                                                                                                {
                                                                                                  key: e.value,
                                                                                                  label:
                                                                                                    e.label,
                                                                                                  value:
                                                                                                    e.value,
                                                                                                  onChange:
                                                                                                    Le,
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
                                                                                  _: 2,
                                                                                },
                                                                                1032,
                                                                                [
                                                                                  "modelValue",
                                                                                ],
                                                                              )),
                                                                          e.isSingle ||
                                                                          "custom" ===
                                                                            w(
                                                                              qe,
                                                                            )
                                                                              .hardwareConcurrencyType
                                                                            ? (u(),
                                                                              r(
                                                                                "div",
                                                                                ne,
                                                                                [
                                                                                  b(
                                                                                    x,
                                                                                    {
                                                                                      modelValue:
                                                                                        w(
                                                                                          qe,
                                                                                        )[
                                                                                          `${n.column}Value`
                                                                                        ],
                                                                                      "onUpdate:modelValue":
                                                                                        (
                                                                                          e,
                                                                                        ) =>
                                                                                          (w(
                                                                                            qe,
                                                                                          )[
                                                                                            `${n.column}Value`
                                                                                          ] =
                                                                                            e),
                                                                                      placeholder:
                                                                                        l.$t(
                                                                                          "base.selectHolder",
                                                                                        ),
                                                                                      filterable:
                                                                                        "",
                                                                                    },
                                                                                    {
                                                                                      default:
                                                                                        p(
                                                                                          () => [
                                                                                            (u(
                                                                                              !0,
                                                                                            ),
                                                                                            r(
                                                                                              d,
                                                                                              null,
                                                                                              c(
                                                                                                n.valueOptions,
                                                                                                (
                                                                                                  e,
                                                                                                ) => (
                                                                                                  u(),
                                                                                                  s(
                                                                                                    R,
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
                                                                                          ],
                                                                                        ),
                                                                                      _: 2,
                                                                                    },
                                                                                    1032,
                                                                                    [
                                                                                      "modelValue",
                                                                                      "onUpdate:modelValue",
                                                                                      "placeholder",
                                                                                    ],
                                                                                  ),
                                                                                  "truth" !==
                                                                                  w(
                                                                                    qe,
                                                                                  )[
                                                                                    `${n.column}Value`
                                                                                  ]
                                                                                    ? (u(),
                                                                                      r(
                                                                                        "div",
                                                                                        ue,
                                                                                        m(
                                                                                          l.$t(
                                                                                            "env.env.req.nucleus",
                                                                                          ),
                                                                                        ),
                                                                                        1,
                                                                                      ))
                                                                                    : y(
                                                                                        "",
                                                                                        !0,
                                                                                      ),
                                                                                ],
                                                                              ))
                                                                            : y(
                                                                                "",
                                                                                !0,
                                                                              ),
                                                                        ],
                                                                        64,
                                                                      ))
                                                                    : "port" ===
                                                                          n.column &&
                                                                        "1" ===
                                                                          w(qe)
                                                                            .portType
                                                                      ? (u(),
                                                                        s(
                                                                          T,
                                                                          {
                                                                            key: 12,
                                                                            class:
                                                                              "m-t-12",
                                                                            modelValue:
                                                                              w(
                                                                                qe,
                                                                              )[
                                                                                `${n.column}Value`
                                                                              ],
                                                                            "onUpdate:modelValue":
                                                                              (
                                                                                e,
                                                                              ) =>
                                                                                (w(
                                                                                  qe,
                                                                                )[
                                                                                  `${n.column}Value`
                                                                                ] =
                                                                                  e),
                                                                            placeholder:
                                                                              l.$t(
                                                                                "env.env.req.portHolder",
                                                                              ),
                                                                          },
                                                                          null,
                                                                          8,
                                                                          [
                                                                            "modelValue",
                                                                            "onUpdate:modelValue",
                                                                            "placeholder",
                                                                          ],
                                                                        ))
                                                                      : "startParams" ===
                                                                          n.column
                                                                        ? (u(),
                                                                          s(
                                                                            T,
                                                                            {
                                                                              key: 13,
                                                                              modelValue:
                                                                                w(
                                                                                  qe,
                                                                                )
                                                                                  .startParams,
                                                                              "onUpdate:modelValue":
                                                                                a[20] ||
                                                                                (a[20] =
                                                                                  (
                                                                                    e,
                                                                                  ) =>
                                                                                    (w(
                                                                                      qe,
                                                                                    ).startParams =
                                                                                      e)),
                                                                              placeholder:
                                                                                l.$t(
                                                                                  "env.env.req.startExtraParamsHolder",
                                                                                ),
                                                                              clearable:
                                                                                "",
                                                                            },
                                                                            null,
                                                                            8,
                                                                            [
                                                                              "modelValue",
                                                                              "placeholder",
                                                                            ],
                                                                          ))
                                                                        : y(
                                                                            "",
                                                                            !0,
                                                                          )
                                                                : (u(),
                                                                  r("div", ae, [
                                                                    b(
                                                                      k,
                                                                      {
                                                                        label:
                                                                          w(fe)(
                                                                            "env.env.req.UnmaskedVendor",
                                                                          ),
                                                                        prop: "extend.webglManufacturer",
                                                                      },
                                                                      {
                                                                        default:
                                                                          p(
                                                                            () => [
                                                                              b(
                                                                                T,
                                                                                {
                                                                                  modelValue:
                                                                                    w(
                                                                                      qe,
                                                                                    )
                                                                                      .webglManufacturer,
                                                                                  "onUpdate:modelValue":
                                                                                    a[16] ||
                                                                                    (a[16] =
                                                                                      (
                                                                                        e,
                                                                                      ) =>
                                                                                        (w(
                                                                                          qe,
                                                                                        ).webglManufacturer =
                                                                                          e)),
                                                                                  placeholder:
                                                                                    l.$t(
                                                                                      "env.env.req.webglManufacturerRule",
                                                                                    ),
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
                                                                      8,
                                                                      ["label"],
                                                                    ),
                                                                    b(
                                                                      k,
                                                                      {
                                                                        label:
                                                                          w(fe)(
                                                                            "env.env.req.UnmaskedRenderer",
                                                                          ),
                                                                        prop: "extend.webglRender",
                                                                      },
                                                                      {
                                                                        default:
                                                                          p(
                                                                            () => [
                                                                              b(
                                                                                T,
                                                                                {
                                                                                  modelValue:
                                                                                    w(
                                                                                      qe,
                                                                                    )
                                                                                      .webglRender,
                                                                                  "onUpdate:modelValue":
                                                                                    a[17] ||
                                                                                    (a[17] =
                                                                                      (
                                                                                        e,
                                                                                      ) =>
                                                                                        (w(
                                                                                          qe,
                                                                                        ).webglRender =
                                                                                          e)),
                                                                                  placeholder:
                                                                                    l.$t(
                                                                                      "env.env.req.webglRenderRule",
                                                                                    ),
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
                                                                      8,
                                                                      ["label"],
                                                                    ),
                                                                    i(
                                                                      "div",
                                                                      {
                                                                        class:
                                                                          "update-webGLMetadata-btn",
                                                                        onClick:
                                                                          Ge,
                                                                      },
                                                                      [
                                                                        a[34] ||
                                                                          (a[34] =
                                                                            i(
                                                                              "i",
                                                                              {
                                                                                class:
                                                                                  "iconfont icon-random",
                                                                              },
                                                                              null,
                                                                              -1,
                                                                            )),
                                                                        V(
                                                                          m(
                                                                            w(
                                                                              fe,
                                                                            )(
                                                                              "env.env.req.Randomize",
                                                                            ),
                                                                          ),
                                                                          1,
                                                                        ),
                                                                      ],
                                                                    ),
                                                                  ])),
                                            ]),
                                          ];
                                        }),
                                        _: 2,
                                      },
                                      [
                                        "tlsDisabledValues" === n.column
                                          ? {
                                              name: "label",
                                              fn: p(() => [
                                                i("span", null, m(n.label), 1),
                                                b(
                                                  L,
                                                  {
                                                    text: l.$t(
                                                      "env.env.req.tlsDisabledValuesRiskTip",
                                                    ),
                                                  },
                                                  null,
                                                  8,
                                                  ["text"],
                                                ),
                                              ]),
                                              key: "0",
                                            }
                                          : void 0,
                                      ],
                                    ),
                                    1032,
                                    ["label", "prop"],
                                  ))
                                : y("", !0),
                            ],
                            64,
                          )
                        ),
                      ),
                      256,
                    )),
                  ]),
                  b(
                    U,
                    {
                      ref_key: "addAcceptLangDialogRef",
                      ref: _e,
                      onSubmit: Ne,
                    },
                    null,
                    512,
                  ),
                  b(
                    S,
                    { ref_key: "editFontDialogRef", ref: $e, onSubmit: Fe },
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
    [["__scopeId", "data-v-7953d7a1"]],
  );
export { ie as default };
