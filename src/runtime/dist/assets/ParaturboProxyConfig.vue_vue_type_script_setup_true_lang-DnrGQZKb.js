import {
  d as a,
  cv as e,
  v as t,
  i as l,
  W as c,
  r as i,
  o as s,
  c as u,
  h as r,
  w as n,
  b as o,
  O as y,
  F as p,
  z as d,
  f as v,
  a as m,
  cX as f,
  cQ as h,
  e as _,
  t as w,
  X as b,
  ac as g,
} from "./index-BUIbb6Pa.js";
import { _ as x } from "./DynamicProxyForm.vue_vue_type_script_setup_true_lang-BLDcp8Iw.js";
import { _ as S } from "./IpResourceSelector.vue_vue_type_script_setup_true_lang-Dxuw76Sd.js";
import { _ as k } from "./DynamicTrafficGate.vue_vue_type_script_setup_true_lang-3aGxeuRD.js";
const I = { class: "tw-w-full tw-text-[var(--text-color-base)]" },
  P = { key: 0, class: "tw-w-full tw-pt-1" },
  R = { class: "tw-flex tw-w-full tw-items-start tw-gap-3" },
  C = { class: "tw-min-w-0 tw-flex-1" },
  T = a({
    __name: "ParaturboProxyConfig",
    props: {
      context: {},
      currentStaticResourceId: { default: "" },
      currentStaticLabel: { default: "" },
      ipType: { default: e.IpAPI },
      labelWidth: { default: "120px" },
      transparentBackground: { type: Boolean, default: !1 },
      showStaticPurchase: { type: Boolean, default: !1 },
    },
    emits: [
      "type-change",
      "dynamic-change",
      "dynamic-ip-type-change",
      "select-static",
      "purchase-static",
      "dynamic-availability-change",
    ],
    setup(a, { expose: e, emit: T }) {
      const V = a,
        A = T,
        { t: j } = t.useI18n(),
        B = ["static", "dynamic"],
        D = "proxy-create" === V.context ? "dynamic" : "static",
        W = l(D),
        U = l(V.currentStaticResourceId),
        z = l(0),
        E = l(),
        F = l(),
        L = l(!1),
        O = l(!1),
        X = l({}),
        G = (a) => {
          E.value = a || void 0;
        },
        Q = (a) => {
          F.value = a || void 0;
        },
        q = (a) => {
          "static" === W.value && A("select-static", a);
        },
        H = async (a) => {
          var e;
          ((L.value = a),
            A("dynamic-availability-change", a),
            a
              ? O.value ||
                (await g(),
                await (null == (e = E.value) ? void 0 : e.reset(X.value)),
                (O.value = !0))
              : (O.value = !1));
        },
        J = () => {
          ((O.value = !1),
            (L.value = !1),
            A("dynamic-availability-change", !1));
        },
        K = async () => {
          var a;
          (J(),
            await g(),
            "dynamic" === W.value &&
              (await (null == (a = F.value) ? void 0 : a.loadSummary())));
        };
      (c(W, async (a) => {
        (A("type-change", a), "dynamic" !== a ? J() : await K());
      }),
        c(
          () => V.currentStaticResourceId,
          (a) => {
            U.value = a;
          },
        ));
      return (
        e({
          reset: async (a = D, e = {}) => {
            const t = "proxy-create" === V.context ? "dynamic" : a,
              l = W.value !== t;
            ((X.value = e),
              (O.value = !1),
              (W.value = t),
              (U.value = V.currentStaticResourceId),
              await g(),
              "dynamic" !== t ? J() : l || (await K()));
          },
          validateDynamic: () => {
            var a;
            return (
              (L.value && (null == (a = E.value) ? void 0 : a.validate())) ||
              Promise.resolve(!1)
            );
          },
          getDynamicValue: () => {
            var a;
            return null == (a = E.value) ? void 0 : a.getValue();
          },
          getType: () => W.value,
          refreshStaticResources: () => {
            z.value += 1;
          },
          dynamicAvailable: L,
        }),
        (a, e) => {
          const t = i("el-button"),
            l = i("el-form-item"),
            c = i("el-tab-pane"),
            g = i("el-tabs");
          return (
            s(),
            u("div", I, [
              "proxy-create" === V.context
                ? (s(),
                  r(
                    k,
                    {
                      key: 0,
                      ref: Q,
                      "auto-load": !1,
                      onAvailabilityChange: H,
                    },
                    {
                      default: n(() => [
                        o(
                          x,
                          {
                            ref: G,
                            layout: "vertical",
                            "label-width": V.labelWidth,
                            "show-check": !1,
                            "ip-type": V.ipType,
                            onChange:
                              e[0] || (e[0] = (a) => A("dynamic-change", a)),
                            onIpTypeChange:
                              e[1] ||
                              (e[1] = (a) => A("dynamic-ip-type-change", a)),
                          },
                          null,
                          8,
                          ["label-width", "ip-type"],
                        ),
                      ]),
                      _: 1,
                    },
                  ))
                : (s(),
                  r(
                    g,
                    {
                      key: 1,
                      modelValue: W.value,
                      "onUpdate:modelValue":
                        e[6] || (e[6] = (a) => (W.value = a)),
                      class: y([
                        "tw-w-full",
                        [
                          "[&_.el-tabs__content]:tw-pt-4",
                          V.transparentBackground
                            ? "!tw-bg-transparent"
                            : "!tw-bg-[var(--card-base-bg-color)]",
                        ],
                      ]),
                    },
                    {
                      default: n(() => [
                        (s(),
                        u(
                          p,
                          null,
                          d(B, (a) =>
                            o(
                              c,
                              {
                                key: a,
                                label: v(j)(
                                  "static" === a
                                    ? "ipResource.staticProxy"
                                    : "ipResource.dynamicProxy",
                                ),
                                name: a,
                              },
                              {
                                default: n(() => [
                                  "static" === a
                                    ? (s(),
                                      u("div", P, [
                                        o(
                                          l,
                                          {
                                            label: v(j)(
                                              "ipResource.selectStaticProxy",
                                            ),
                                          },
                                          {
                                            default: n(() => [
                                              m("div", R, [
                                                m("div", C, [
                                                  (s(),
                                                  r(
                                                    S,
                                                    {
                                                      key: z.value,
                                                      modelValue: U.value,
                                                      "onUpdate:modelValue":
                                                        e[2] ||
                                                        (e[2] = (a) =>
                                                          (U.value = a)),
                                                      "current-label":
                                                        V.currentStaticLabel,
                                                      "source-types": [
                                                        v(f).STATIC_IP_RESOURCE,
                                                      ],
                                                      onSelect: q,
                                                    },
                                                    null,
                                                    8,
                                                    [
                                                      "modelValue",
                                                      "current-label",
                                                      "source-types",
                                                    ],
                                                  )),
                                                ]),
                                                V.showStaticPurchase
                                                  ? (s(),
                                                    r(
                                                      t,
                                                      {
                                                        key: 0,
                                                        class: "tw-flex-none",
                                                        type: "primary",
                                                        plain: "",
                                                        icon: v(h),
                                                        onClick:
                                                          e[3] ||
                                                          (e[3] = (a) =>
                                                            A(
                                                              "purchase-static",
                                                            )),
                                                      },
                                                      {
                                                        default: n(() => [
                                                          _(
                                                            w(
                                                              v(j)(
                                                                "ipResource.buyProxy",
                                                              ),
                                                            ),
                                                            1,
                                                          ),
                                                        ]),
                                                        _: 1,
                                                      },
                                                      8,
                                                      ["icon"],
                                                    ))
                                                  : b("", !0),
                                              ]),
                                            ]),
                                            _: 1,
                                          },
                                          8,
                                          ["label"],
                                        ),
                                      ]))
                                    : (s(),
                                      r(
                                        k,
                                        {
                                          key: 1,
                                          ref_for: !0,
                                          ref: Q,
                                          "auto-load": !1,
                                          onAvailabilityChange: H,
                                        },
                                        {
                                          default: n(() => [
                                            o(
                                              x,
                                              {
                                                ref_for: !0,
                                                ref: G,
                                                layout: "horizontal",
                                                "label-width": V.labelWidth,
                                                "show-check": !0,
                                                "ip-type": V.ipType,
                                                onChange:
                                                  e[4] ||
                                                  (e[4] = (a) =>
                                                    A("dynamic-change", a)),
                                                onIpTypeChange:
                                                  e[5] ||
                                                  (e[5] = (a) =>
                                                    A(
                                                      "dynamic-ip-type-change",
                                                      a,
                                                    )),
                                              },
                                              null,
                                              8,
                                              ["label-width", "ip-type"],
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                      )),
                                ]),
                                _: 2,
                              },
                              1032,
                              ["label", "name"],
                            ),
                          ),
                          64,
                        )),
                      ]),
                      _: 1,
                    },
                    8,
                    ["modelValue", "class"],
                  )),
            ])
          );
        }
      );
    },
  });
export { T as _ };
