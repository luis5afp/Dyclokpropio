import {
  d as e,
  cv as l,
  v as a,
  i as t,
  at as o,
  W as s,
  g as n,
  r,
  o as i,
  h as u,
  w as c,
  b as d,
  f as p,
  c as v,
  F as y,
  z as m,
  dZ as f,
  a as w,
  t as g,
  X as b,
  O as x,
  e as h,
  C,
  d_ as _,
} from "./index-BUIbb6Pa.js";
import { _ as k } from "./index.vue_vue_type_script_setup_true_lang-A7OAkZwm.js";
import S from "./CustomRadioGroup-Dk-imFdD.js";
import { a as R } from "./ipResourceMock-CCd7H3CQ.js";
import { i as I } from "./ipResourceCatalog-CJEdeRbI.js";
import { _ as M } from "./IpCountryFlag.vue_vue_type_script_setup_true_lang-DgLdnpgH.js";
const V = {
    class:
      "tw-mt-[6px] tw-w-full tw-text-xs tw-leading-normal tw-text-[var(--text-color-light2)]",
  },
  E = { class: "tw-inline-flex tw-items-center tw-gap-1 tw-pt-[6px]" },
  F = { class: "tw-inline-flex tw-items-center tw-gap-1" },
  D = { class: "tw-flex tw-flex-wrap tw-items-start tw-gap-[10px]" },
  T = { class: "tw-inline-flex" },
  O = {
    key: 0,
    class:
      "tw-flex tw-text-sm tw-leading-[19px] tw-text-[var(--primary-color)]",
  },
  j = { class: "tw-flex-1" },
  P = {
    key: 1,
    class:
      "tw-flex tw-min-h-8 tw-items-start tw-text-sm tw-leading-[19px] tw-text-[var(--danger-color)]",
  },
  X = { class: "tw-flex-1" },
  q = { key: 0 },
  N = e({
    __name: "DynamicProxyForm",
    props: {
      layout: { default: "vertical" },
      labelWidth: { default: "120px" },
      showCheck: { type: Boolean, default: !1 },
      ipType: { default: l.IpAPI },
    },
    emits: ["change", "ip-type-change"],
    setup(e, { expose: l, emit: N }) {
      const H = e,
        U = N,
        { t: G } = a.useI18n(),
        z = C(() => "horizontal" === H.layout),
        $ = t(),
        B = t(!1),
        W = t(!1),
        K = t(!1),
        A = t(""),
        L = t(H.ipType),
        Z = t(!1),
        J = t({ checked: !1 });
      let Q = 0,
        Y = 0,
        ee = 0;
      const le = t({
          trafficPackages: [],
          minTrafficGb: 0,
          maxTrafficGb: 0,
          protocols: [],
          modes: [],
          sessionMinutes: [],
          countries: [],
        }),
        ae = () => ({
          mode: f.FIXED_SESSION,
          sessionMinutes: void 0,
          countryCode: "",
          region: "",
          city: "",
        }),
        te = o(ae()),
        oe = C(() => ({
          mode: [
            {
              required: !0,
              message: G("ipResource.modeRequired"),
              trigger: "change",
            },
          ],
        })),
        se = C(() => le.value.countries.find((e) => e.code === te.countryCode)),
        ne = C(() => {
          var e;
          return (null == (e = se.value) ? void 0 : e.regions) || [];
        }),
        re = C(() => ne.value.find((e) => e.code === te.region)),
        ie = C(() => {
          var e;
          return (null == (e = re.value) ? void 0 : e.cities) || [];
        }),
        ue = C(() => Boolean(te.countryCode)),
        ce = C(() => !Z.value && !B.value && ue.value),
        de = (e) =>
          e === f.FIXED_SESSION
            ? G("ipResource.fixedSession")
            : G("ipResource.random"),
        pe = (e, l) => (e ? (l ? `${e}(${l})` : e) : l || "--"),
        ve = () => {
          ((ee += 1), (Z.value = !1), (J.value = { checked: !1 }));
        },
        ye = async () => {
          if (!ce.value) return;
          const e = ++ee;
          ((Z.value = !0), (J.value = { checked: !1 }));
          try {
            const l = await R({
              proxyType: _.SOCKS5,
              ipType: L.value,
              ipResourceConfig: {
                mode: te.mode,
                ...(te.mode === f.FIXED_SESSION && te.sessionMinutes
                  ? { sessionMinutes: te.sessionMinutes }
                  : {}),
                countryCode: te.countryCode,
                stateCode: te.region,
                cityCode: te.city,
              },
            });
            if (e !== ee) return;
            J.value = { checked: !0, data: l };
          } catch (l) {
            if (e !== ee) return;
            (console.error("[ipResource] failed to check dynamic proxy", {
              mode: te.mode,
              countryCode: te.countryCode,
              stateCode: te.region,
              cityCode: te.city,
              error: l,
            }),
              (J.value = { checked: !0, data: { connect: !1 } }));
          } finally {
            e === ee && (Z.value = !1);
          }
        },
        me = () => {
          te.mode !== f.FIXED_SESSION && (te.sessionMinutes = void 0);
        },
        fe = async () => {
          const e = ++Q;
          ((Y += 1),
            (W.value = !1),
            (K.value = !1),
            (te.region = ""),
            (te.city = ""),
            (A.value = ""));
          const l = se.value;
          if (l) {
            W.value = !0;
            try {
              const a = await I.getDynamicStates(l.code);
              if (e !== Q) return;
              l.regions = a.map((e) => ({ ...e, cities: [] }));
            } catch (a) {
              if (e !== Q) return;
              (console.error("[ipResource] failed to load dynamic states", {
                countryCode: l.code,
                error: a,
              }),
                (A.value = G("ipResource.catalogFailed")));
            } finally {
              e === Q && (W.value = !1);
            }
          }
        },
        we = async () => {
          const e = ++Y;
          ((K.value = !1), (te.city = ""), (A.value = ""));
          const l = te.countryCode,
            a = re.value;
          if (l && a) {
            K.value = !0;
            try {
              const t = await I.getDynamicCities(l, a.code);
              if (e !== Y) return;
              a.cities = t;
            } catch (t) {
              if (e !== Y) return;
              (console.error("[ipResource] failed to load dynamic cities", {
                countryCode: l,
                stateCode: a.code,
                error: t,
              }),
                (A.value = G("ipResource.catalogFailed")));
            } finally {
              e === Y && (K.value = !1);
            }
          }
        },
        ge = () => {
          if (te.mode)
            return {
              protocol: _.SOCKS5,
              mode: te.mode,
              countryCode: te.countryCode,
              ...(te.region ? { stateCode: te.region } : {}),
              ...(te.city ? { cityCode: te.city } : {}),
              ...(te.mode === f.FIXED_SESSION && te.sessionMinutes
                ? { sessionMinutes: te.sessionMinutes }
                : {}),
            };
        };
      return (
        s(
          te,
          () => {
            (ve(), U("change", ge()));
          },
          { deep: !0 },
        ),
        s(
          () => H.ipType,
          (e) => {
            e && e !== L.value && (L.value = e);
          },
        ),
        s(L, (e) => {
          (ve(), U("ip-type-change", e));
        }),
        n(() => {
          ((Q += 1), (Y += 1), (ee += 1));
        }),
        l({
          validate: async () => {
            var e;
            return (
              !B.value &&
              !A.value &&
              Boolean(
                await (null == (e = $.value)
                  ? void 0
                  : e.validate().catch(() => !1)),
              )
            );
          },
          reset: async (e = {}) => {
            var l;
            ((Q += 1), (Y += 1), (W.value = !1), (K.value = !1));
            const { stateCode: a, cityCode: t } = e;
            (Object.assign(te, ae(), {
              mode: e.mode ?? f.FIXED_SESSION,
              sessionMinutes: e.sessionMinutes,
              countryCode: e.countryCode ?? "",
              region: e.stateCode || "",
              city: e.cityCode || "",
            }),
              null == (l = $.value) || l.clearValidate(),
              await (async () => {
                ((B.value = !0), (A.value = ""));
                try {
                  le.value = await I.getDynamicProxyCatalog();
                } catch (e) {
                  (console.error(
                    "[ipResource] failed to load dynamic catalog",
                    e,
                  ),
                    (le.value = {
                      trafficPackages: [],
                      minTrafficGb: 0,
                      maxTrafficGb: 0,
                      protocols: [],
                      modes: [],
                      sessionMinutes: [],
                      countries: [],
                    }),
                    (A.value = G("ipResource.catalogFailed")));
                } finally {
                  B.value = !1;
                }
              })());
            const o = a || "",
              s = t || "";
            e.countryCode &&
              (await fe(), (te.region = o), o && (await we(), (te.city = s)));
          },
          getValue: ge,
          catalogLoading: B,
          catalogError: A,
        }),
        (e, l) => {
          const a = r("el-radio-button"),
            t = r("el-form-item"),
            o = r("el-option"),
            s = r("el-select"),
            n = r("el-button"),
            C = r("el-tooltip"),
            _ = r("el-alert"),
            R = r("el-form");
          return (
            i(),
            u(
              R,
              {
                ref_key: "formRef",
                ref: $,
                class:
                  "tw-w-full tw-text-[var(--text-color-base)] [&_.el-form-item__label]:tw-text-[var(--text-color-base)]",
                model: te,
                rules: oe.value,
                "label-position": z.value ? "right" : "top",
                "label-width": z.value ? H.labelWidth : void 0,
              },
              {
                default: c(() => [
                  d(
                    t,
                    { label: p(G)("ipResource.mode"), prop: "mode" },
                    {
                      default: c(() => [
                        d(
                          S,
                          {
                            modelValue: te.mode,
                            "onUpdate:modelValue":
                              l[0] || (l[0] = (e) => (te.mode = e)),
                            onChange: me,
                          },
                          {
                            default: c(() => [
                              (i(!0),
                              v(
                                y,
                                null,
                                m(
                                  le.value.modes,
                                  (e) => (
                                    i(),
                                    u(
                                      a,
                                      { key: e, label: de(e), value: e },
                                      null,
                                      8,
                                      ["label", "value"],
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
                  te.mode === p(f).FIXED_SESSION
                    ? (i(),
                      u(
                        t,
                        {
                          key: 0,
                          class: "!tw-items-start",
                          label: p(G)("ipResource.sessionMinutes"),
                          prop: "sessionMinutes",
                        },
                        {
                          default: c(() => [
                            d(
                              s,
                              {
                                modelValue: te.sessionMinutes,
                                "onUpdate:modelValue":
                                  l[1] ||
                                  (l[1] = (e) => (te.sessionMinutes = e)),
                                class: "tw-w-full",
                                clearable: "",
                                placeholder: p(G)("base.selectHolder"),
                              },
                              {
                                default: c(() => [
                                  (i(!0),
                                  v(
                                    y,
                                    null,
                                    m(
                                      le.value.sessionMinutes,
                                      (e) => (
                                        i(),
                                        u(
                                          o,
                                          {
                                            key: e,
                                            label: `${e} ${p(G)("ipResource.minutes")}`,
                                            value: e,
                                          },
                                          null,
                                          8,
                                          ["label", "value"],
                                        )
                                      ),
                                    ),
                                    128,
                                  )),
                                ]),
                                _: 1,
                              },
                              8,
                              ["modelValue", "placeholder"],
                            ),
                            w(
                              "p",
                              V,
                              g(p(G)("ipResource.sessionMinutesHint")),
                              1,
                            ),
                          ]),
                          _: 1,
                        },
                        8,
                        ["label"],
                      ))
                    : b("", !0),
                  w(
                    "div",
                    {
                      class: x(
                        z.value
                          ? "tw-grid tw-grid-cols-1"
                          : "tw-grid tw-grid-cols-3 tw-gap-3",
                      ),
                    },
                    [
                      d(
                        t,
                        {
                          label: p(G)("ipResource.country"),
                          prop: "countryCode",
                        },
                        {
                          default: c(() => [
                            d(
                              s,
                              {
                                modelValue: te.countryCode,
                                "onUpdate:modelValue":
                                  l[2] || (l[2] = (e) => (te.countryCode = e)),
                                class: "tw-w-full",
                                clearable: "",
                                filterable: "",
                                loading: B.value,
                                placeholder: p(G)("base.selectHolder"),
                                onChange: fe,
                              },
                              {
                                label: c(({ label: e, value: l }) => [
                                  w("span", E, [
                                    d(
                                      M,
                                      { "country-code": String(l) },
                                      null,
                                      8,
                                      ["country-code"],
                                    ),
                                    w("span", null, g(e), 1),
                                  ]),
                                ]),
                                default: c(() => [
                                  (i(!0),
                                  v(
                                    y,
                                    null,
                                    m(
                                      le.value.countries,
                                      (e) => (
                                        i(),
                                        u(
                                          o,
                                          {
                                            key: e.code,
                                            label: e.name,
                                            value: e.code,
                                          },
                                          {
                                            default: c(() => [
                                              w("span", F, [
                                                d(
                                                  M,
                                                  { "country-code": e.code },
                                                  null,
                                                  8,
                                                  ["country-code"],
                                                ),
                                                w("span", null, g(e.name), 1),
                                              ]),
                                            ]),
                                            _: 2,
                                          },
                                          1032,
                                          ["label", "value"],
                                        )
                                      ),
                                    ),
                                    128,
                                  )),
                                ]),
                                _: 1,
                              },
                              8,
                              ["modelValue", "loading", "placeholder"],
                            ),
                          ]),
                          _: 1,
                        },
                        8,
                        ["label"],
                      ),
                      d(
                        t,
                        { label: p(G)("ipResource.region"), prop: "region" },
                        {
                          default: c(() => [
                            d(
                              s,
                              {
                                modelValue: te.region,
                                "onUpdate:modelValue":
                                  l[3] || (l[3] = (e) => (te.region = e)),
                                class: "tw-w-full",
                                clearable: "",
                                filterable: "",
                                loading: W.value,
                                disabled:
                                  !te.countryCode ||
                                  (!W.value && !ne.value.length),
                                placeholder: p(G)("base.selectHolder"),
                                onChange: we,
                              },
                              {
                                default: c(() => [
                                  (i(!0),
                                  v(
                                    y,
                                    null,
                                    m(
                                      ne.value,
                                      (e) => (
                                        i(),
                                        u(
                                          o,
                                          {
                                            key: e.code,
                                            label: e.name,
                                            value: e.code,
                                          },
                                          null,
                                          8,
                                          ["label", "value"],
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
                                "loading",
                                "disabled",
                                "placeholder",
                              ],
                            ),
                          ]),
                          _: 1,
                        },
                        8,
                        ["label"],
                      ),
                      d(
                        t,
                        { label: p(G)("ipResource.city"), prop: "city" },
                        {
                          default: c(() => [
                            d(
                              s,
                              {
                                modelValue: te.city,
                                "onUpdate:modelValue":
                                  l[4] || (l[4] = (e) => (te.city = e)),
                                class: "tw-w-full",
                                clearable: "",
                                filterable: "",
                                loading: K.value,
                                disabled:
                                  !te.region || (!K.value && !ie.value.length),
                                placeholder: p(G)("base.selectHolder"),
                              },
                              {
                                default: c(() => [
                                  (i(!0),
                                  v(
                                    y,
                                    null,
                                    m(
                                      ie.value,
                                      (e) => (
                                        i(),
                                        u(
                                          o,
                                          {
                                            key: e.code,
                                            label: e.name,
                                            value: e.code,
                                          },
                                          null,
                                          8,
                                          ["label", "value"],
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
                                "loading",
                                "disabled",
                                "placeholder",
                              ],
                            ),
                          ]),
                          _: 1,
                        },
                        8,
                        ["label"],
                      ),
                    ],
                    2,
                  ),
                  H.showCheck
                    ? (i(),
                      v(
                        y,
                        { key: 1 },
                        [
                          d(
                            t,
                            { label: p(G)("env.env.req.proxyIpType") },
                            {
                              default: c(() => [
                                d(
                                  k,
                                  {
                                    modelValue: L.value,
                                    "onUpdate:modelValue":
                                      l[5] || (l[5] = (e) => (L.value = e)),
                                    placeholder: p(G)(
                                      "env.env.req.proxyIpTypeHolder",
                                    ),
                                    filterable: "",
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
                          ),
                          d(
                            t,
                            { label: " ", class: "!tw-items-start" },
                            {
                              default: c(() => {
                                var e, a;
                                return [
                                  w("div", D, [
                                    d(
                                      C,
                                      {
                                        disabled: ue.value || Z.value,
                                        content: p(G)(
                                          "ipResource.dynamicProxyCheckDisabledTip",
                                        ),
                                        placement: "top",
                                        "popper-class": "!tw-max-w-[320px]",
                                      },
                                      {
                                        default: c(() => [
                                          w("span", T, [
                                            d(
                                              n,
                                              {
                                                class:
                                                  "!tw-bg-transparent before:!tw-bg-transparent",
                                                disabled: !ce.value,
                                                loading: Z.value,
                                                plain: "",
                                                type: "primary",
                                                onClick: ye,
                                              },
                                              {
                                                default: c(() => [
                                                  h(
                                                    g(
                                                      p(G)(
                                                        "env.env.req.checkProxy",
                                                      ),
                                                    ),
                                                    1,
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["disabled", "loading"],
                                            ),
                                          ]),
                                        ]),
                                        _: 1,
                                      },
                                      8,
                                      ["disabled", "content"],
                                    ),
                                    J.value.checked &&
                                    (null == (e = J.value.data)
                                      ? void 0
                                      : e.connect)
                                      ? (i(),
                                        v("div", O, [
                                          l[11] ||
                                            (l[11] = w(
                                              "span",
                                              {
                                                class:
                                                  "tw-mr-1 tw-mt-[2px] tw-inline-flex tw-h-4 tw-w-4 tw-flex-none tw-justify-center tw-rounded-full tw-bg-current",
                                              },
                                              [
                                                w("i", {
                                                  class:
                                                    "iconfont icon-check tw-text-sm tw-text-[var(--themeColor1)]",
                                                }),
                                              ],
                                              -1,
                                            )),
                                          w("div", j, [
                                            h(
                                              g(
                                                p(G)(
                                                  "proxy.proxy.check.success",
                                                ),
                                              ),
                                              1,
                                            ),
                                            l[6] ||
                                              (l[6] = w("br", null, null, -1)),
                                            h(
                                              " IP: " +
                                                g(J.value.data.ip || "--"),
                                              1,
                                            ),
                                            l[7] ||
                                              (l[7] = w("br", null, null, -1)),
                                            h(
                                              " " +
                                                g(
                                                  p(G)(
                                                    "proxy.proxy.check.country",
                                                  ),
                                                ) +
                                                ": " +
                                                g(
                                                  pe(
                                                    J.value.data.country,
                                                    J.value.data.countryCode,
                                                  ),
                                                ),
                                              1,
                                            ),
                                            l[8] ||
                                              (l[8] = w("br", null, null, -1)),
                                            h(
                                              " " +
                                                g(
                                                  p(G)(
                                                    "env.env.req.state_province",
                                                  ),
                                                ) +
                                                ": " +
                                                g(
                                                  pe(
                                                    J.value.data.region,
                                                    J.value.data.regionCode,
                                                  ),
                                                ),
                                              1,
                                            ),
                                            l[9] ||
                                              (l[9] = w("br", null, null, -1)),
                                            h(
                                              " " +
                                                g(p(G)("env.env.req.city")) +
                                                ": " +
                                                g(J.value.data.city || "--"),
                                              1,
                                            ),
                                            l[10] ||
                                              (l[10] = w("br", null, null, -1)),
                                            h(
                                              " " +
                                                g(
                                                  p(G)(
                                                    "proxy.proxy.check.timezone",
                                                  ),
                                                ) +
                                                ": " +
                                                g(
                                                  J.value.data.timezone || "--",
                                                ),
                                              1,
                                            ),
                                          ]),
                                        ]))
                                      : J.value.checked
                                        ? (i(),
                                          v("div", P, [
                                            l[12] ||
                                              (l[12] = w(
                                                "span",
                                                {
                                                  class:
                                                    "tw-mr-1 tw-mt-[2px] tw-inline-flex tw-h-4 tw-w-4 tw-flex-none tw-justify-center tw-rounded-full tw-bg-current",
                                                },
                                                [
                                                  w("i", {
                                                    class:
                                                      "iconfont icon-warning tw-text-sm tw-text-[var(--themeColor1)]",
                                                  }),
                                                ],
                                                -1,
                                              )),
                                            w("div", X, [
                                              h(
                                                g(
                                                  p(G)(
                                                    "proxy.proxy.check.fail",
                                                  ),
                                                ),
                                                1,
                                              ),
                                              (
                                                null == (a = J.value.data)
                                                  ? void 0
                                                  : a.errMsg
                                              )
                                                ? (i(),
                                                  v(
                                                    "span",
                                                    q,
                                                    ": " +
                                                      g(J.value.data.errMsg),
                                                    1,
                                                  ))
                                                : b("", !0),
                                            ]),
                                          ]))
                                        : b("", !0),
                                  ]),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ],
                        64,
                      ))
                    : b("", !0),
                  A.value
                    ? (i(),
                      u(
                        _,
                        {
                          key: 2,
                          class: "tw-w-full",
                          closable: !1,
                          title: A.value,
                          type: "error",
                          "show-icon": "",
                        },
                        null,
                        8,
                        ["title"],
                      ))
                    : b("", !0),
                ]),
                _: 1,
              },
              8,
              ["model", "rules", "label-position", "label-width"],
            )
          );
        }
      );
    },
  });
export { N as _ };
