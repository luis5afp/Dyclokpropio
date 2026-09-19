import e from "./CustomRadioGroup-Dk-imFdD.js";
import {
  d as a,
  v as l,
  bG as t,
  W as u,
  r as _,
  o as s,
  c as n,
  b as o,
  w as m,
  F as v,
  z as d,
  h as S,
  f as C,
  a as i,
  t as r,
  X as A,
  i as p,
  C as H,
} from "./index-BUIbb6Pa.js";
const c = [
    { name: "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384", value: "C02C" },
    { name: "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384", value: "C030" },
    { name: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256", value: "C02B" },
    { name: "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256", value: "C02F" },
    { name: "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256", value: "CCA9" },
    { name: "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256", value: "CCA8" },
    { name: "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA", value: "C014" },
    { name: "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA", value: "C013" },
    { name: "TLS_RSA_WITH_AES_256_GCM_SHA384", value: "009D" },
    { name: "TLS_RSA_WITH_AES_128_GCM_SHA256", value: "009C" },
    { name: "TLS_RSA_WITH_AES_256_CBC_SHA", value: "0035" },
    { name: "TLS_RSA_WITH_AES_128_CBC_SHA", value: "002F" },
  ],
  E = new Set(c.map((e) => e.value));
function T(e) {
  const a = Array.isArray(e) ? e : "string" == typeof e ? e.split(",") : [],
    l = new Set(a.map((e) => e.trim().toUpperCase()).filter((e) => E.has(e)));
  return c
    .filter((e) => l.has(e.value))
    .map((e) => e.value)
    .join(",");
}
const f = { class: "tw-w-full" },
  b = { class: "tw-flex tw-items-center tw-justify-between tw-gap-[12px]" },
  w = { class: "tw-min-w-0 tw-flex-1 tw-truncate" },
  D = {
    class:
      "tw-flex-shrink-0 tw-font-mono tw-text-[12px] tw-text-[var(--text-color-light1)]",
  },
  V = "disabled",
  I = "enabled",
  L = a({
    __name: "TlsCipherSuiteSelector",
    props: { modelValue: {}, mode: {} },
    emits: ["update:modelValue", "update:mode"],
    setup(a, { emit: E }) {
      const { t: L } = l.useI18n(),
        { formItem: W } = t(),
        h = a,
        x = E,
        R = p(V),
        G = p([]),
        g = H(() => [
          { value: V, label: L("env.env.req.tlsDisabledValuesDisabled") },
          { value: I, label: L("env.env.req.tlsDisabledValuesEnabled") },
        ]);
      function y(e) {
        if (e !== I)
          return (
            (R.value = V),
            (G.value = []),
            null == (a = null == W ? void 0 : W.clearValidate) || a.call(W),
            x("update:mode", V),
            void x("update:modelValue", "")
          );
        var a;
        ((R.value = I), x("update:mode", I));
        const l = T(G.value);
        x("update:modelValue", l);
      }
      function M(e) {
        const a = T(e);
        ((G.value = a ? a.split(",") : []),
          x("update:mode", I),
          x("update:modelValue", a));
      }
      return (
        u(
          [() => h.modelValue, () => h.mode],
          ([e, a]) => {
            const l = T(e);
            ((G.value = l ? l.split(",") : []),
              (R.value = a !== I && a !== V ? (l ? I : V) : a));
          },
          { immediate: !0 },
        ),
        (a, l) => {
          const t = _("el-radio-button"),
            u = _("el-option"),
            p = _("el-select");
          return (
            s(),
            n("div", f, [
              o(
                e,
                {
                  modelValue: R.value,
                  "onUpdate:modelValue": l[0] || (l[0] = (e) => (R.value = e)),
                  class: "tw-mb-[8px]",
                  onChange: y,
                },
                {
                  default: m(() => [
                    (s(!0),
                    n(
                      v,
                      null,
                      d(
                        g.value,
                        (e) => (
                          s(),
                          S(
                            t,
                            { key: e.value, label: e.label, value: e.value },
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
              R.value === I
                ? (s(),
                  S(
                    p,
                    {
                      key: 0,
                      modelValue: G.value,
                      "onUpdate:modelValue":
                        l[1] || (l[1] = (e) => (G.value = e)),
                      placeholder: C(L)(
                        "env.env.req.tlsDisabledValuesPlaceholder",
                      ),
                      class: "tw-w-full",
                      clearable: "",
                      "collapse-tags": "",
                      "collapse-tags-tooltip": "",
                      filterable: "",
                      multiple: "",
                      onChange: M,
                    },
                    {
                      default: m(() => [
                        (s(!0),
                        n(
                          v,
                          null,
                          d(
                            C(c),
                            (e) => (
                              s(),
                              S(
                                u,
                                {
                                  key: e.value,
                                  label: `${e.name} (${e.value})`,
                                  value: e.value,
                                },
                                {
                                  default: m(() => [
                                    i("div", b, [
                                      i("span", w, r(e.name), 1),
                                      i("span", D, r(e.value), 1),
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
                    ["modelValue", "placeholder"],
                  ))
                : A("", !0),
            ])
          );
        }
      );
    },
  });
export { L as _, T as n };
