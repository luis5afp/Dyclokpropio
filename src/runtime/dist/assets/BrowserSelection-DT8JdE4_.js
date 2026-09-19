import {
  d as e,
  v as t,
  bP as l,
  r as a,
  o as s,
  c as i,
  f as n,
  h as o,
  O as r,
  w as u,
  b as d,
  F as v,
  z as p,
  a as w,
  t as c,
  D as x,
  y as m,
  dO as b,
  X as g,
  bo as y,
  e as f,
  C as _,
  dP as k,
  m as B,
  i as T,
  _ as V,
} from "./index-BUIbb6Pa.js";
import { _ as L } from "./Tip.vue_vue_type_script_setup_true_lang-DBJcGLEl.js";
const h = { class: "envV2-input-layout" },
  I = { class: "s-flex tw-gap-x-2" },
  C = { key: 0, class: "c-flex" },
  $ = { key: 1, class: "s-flex tw-gap-x-2 tw-mt-[2px]" },
  q = { class: "tw-text-[12px] tw-text-subText" },
  N = { class: "tw-flex tw-flex-col tw-gap-y-2" },
  D = { key: 0, class: "tw-text-[12px] tw-text-subText tw-leading-[16px]" },
  E = { key: 0, class: "tw-text-[12px] tw-text-subText tw-leading-[16px]" },
  O = { key: 1 },
  P = { key: 1, class: "tw-text-[12px] tw-text-subText tw-leading-[16px]" },
  j = { key: 2, class: "s-flex tw-gap-x-2" },
  F = { class: "tw-text-[12px] tw-text-subText" },
  K = { class: "tw-text-[12px] tw-text-subText" },
  z = V(
    e({
      __name: "BrowserSelection",
      props: { modelValue: {}, isEdit: { type: Boolean } },
      emits: ["update:modelValue"],
      setup(e, { emit: V }) {
        const z = e,
          R = V,
          { t: S } = t.useI18n(),
          U = l(),
          X = _({
            get: () => z.modelValue,
            set: (e) => R("update:modelValue", e),
          }),
          A = _(() => z.isEdit || 120 === Number(X.value)),
          G = T([]),
          H = _(
            () => (e) =>
              U.localBrowserList.some((t) => t.version === e && t.execPath),
          ),
          J = _(() => (e) => G.value.includes(e)),
          M = _(() => {
            var e;
            return (
              (null == (e = null == U ? void 0 : U.browserList)
                ? void 0
                : e.find(
                    (e) => (null == e ? void 0 : e.id) === z.modelValue,
                  )) ?? null
            );
          }),
          Q = async (e) => {
            if (e) {
              var t;
              ((t = e.version), G.value.includes(t) || G.value.push(t));
              try {
                const t = k(e, "environment-selection", U.domainList),
                  l = x.api.installRequestedKernel(t);
                (B.emit("openOrCloseTip", !0),
                  await l,
                  await U.getLocalBrowserList());
              } finally {
                ((e) => {
                  G.value = G.value.filter((t) => t !== e);
                })(e.version);
              }
            }
          },
          W = (e) => {
            var t;
            const l = null == (t = U.progress) ? void 0 : t[e];
            return l &&
              [
                "downloading",
                "verifying",
                "extracting",
                "validating",
                "installing",
              ].includes(l.stage)
              ? null === l.percent
                ? S("kernelDownload.tip2")
                : `${Number(l.percent).toFixed(1)}%`
              : "";
          },
          Y = _(() => {
            var e;
            const t = M.value;
            return (
              !!(x.isClient && X.value && t) &&
              !U.getLocalBrowserById(X.value) &&
              !J.value(t.version) &&
              !U.isLocalTopVersion(
                null == (e = t.version) ? void 0 : e.split(".")[0],
              )
            );
          }),
          Z = _(() => {
            const e = M.value;
            return x.isClient && e ? (W(e.version) ?? "") : "";
          }),
          ee = _(
            () =>
              U.browserList.length > 1 &&
              (A.value || Y.value || Boolean(Z.value)),
          );
        return (t, l) => {
          const _ = a("el-icon"),
            k = a("el-option"),
            B = a("el-select"),
            T = a("el-form-item");
          return (
            s(),
            i("div", null, [
              n(U).browserList.length > 1
                ? (s(),
                  o(
                    T,
                    {
                      key: 0,
                      label: t.$t("env.env.req.browser"),
                      prop: "browserVersionId",
                      required: "",
                      "inline-message": !1,
                      class: r(ee.value ? "!tw-mb-[6px]" : ""),
                    },
                    {
                      label: u(() => [
                        w("div", h, [
                          w("div", null, [
                            f(c(t.$t("env.env.req.browser")) + " ", 1),
                            d(
                              L,
                              {
                                text: n(S)("update.tip28", { version: "14x" }),
                              },
                              null,
                              8,
                              ["text"],
                            ),
                          ]),
                        ]),
                      ]),
                      default: u(() => [
                        d(
                          B,
                          {
                            modelValue: X.value,
                            "onUpdate:modelValue":
                              l[0] || (l[0] = (e) => (X.value = e)),
                          },
                          {
                            default: u(() => [
                              (s(!0),
                              i(
                                v,
                                null,
                                p(
                                  n(U).browserList,
                                  (e) => (
                                    s(),
                                    o(
                                      k,
                                      {
                                        key: e.id,
                                        label: n(U).getBrowserNameById(e.id),
                                        value: e.id,
                                      },
                                      {
                                        default: u(() => {
                                          var t;
                                          return [
                                            w("div", I, [
                                              w(
                                                "span",
                                                null,
                                                c(
                                                  n(U).getBrowserNameById(e.id),
                                                ),
                                                1,
                                              ),
                                              !n(x).isClient ||
                                              H.value(e.version) ||
                                              n(U).isLocalTopVersion(
                                                null ==
                                                  (t = e.originalKernelType)
                                                  ? void 0
                                                  : t.replace(/\D/g, ""),
                                              )
                                                ? g("", !0)
                                                : (s(),
                                                  i("div", C, [
                                                    J.value(e.version)
                                                      ? g("", !0)
                                                      : (s(),
                                                        o(
                                                          _,
                                                          {
                                                            key: 0,
                                                            class:
                                                              "hover:tw-text-main",
                                                            onClick: m(
                                                              (t) => Q(e),
                                                              ["stop"],
                                                            ),
                                                          },
                                                          {
                                                            default: u(() => [
                                                              d(n(b)),
                                                            ]),
                                                            _: 1,
                                                          },
                                                          8,
                                                          ["onClick"],
                                                        )),
                                                    W(e.version)
                                                      ? (s(),
                                                        i("div", $, [
                                                          d(
                                                            _,
                                                            {
                                                              class:
                                                                "tw-animate-spin tw-text-main",
                                                            },
                                                            {
                                                              default: u(() => [
                                                                d(n(y)),
                                                              ]),
                                                              _: 1,
                                                            },
                                                          ),
                                                          w(
                                                            "span",
                                                            q,
                                                            c(W(e.version)),
                                                            1,
                                                          ),
                                                        ]))
                                                      : g("", !0),
                                                  ])),
                                            ]),
                                          ];
                                        }),
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
                          ["modelValue"],
                        ),
                      ]),
                      _: 1,
                    },
                    8,
                    ["label", "class"],
                  ))
                : g("", !0),
              ee.value
                ? (s(),
                  o(
                    T,
                    { key: 1, label: " ", class: "label-height-auto" },
                    {
                      default: u(() => [
                        w("div", N, [
                          A.value
                            ? (s(),
                              i("div", D, [
                                e.isEdit
                                  ? (s(),
                                    i("span", E, c(t.$t("update.tip17")), 1))
                                  : g("", !0),
                                120 == X.value
                                  ? (s(),
                                    i(
                                      "span",
                                      O,
                                      c(
                                        e.isEdit
                                          ? ""
                                          : n(S)("update.attention"),
                                      ) + c(n(S)("update.120Tip")),
                                      1,
                                    ))
                                  : g("", !0),
                              ]))
                            : g("", !0),
                          Y.value
                            ? (s(),
                              i("div", P, [
                                w(
                                  "span",
                                  null,
                                  c(
                                    t.$t("update.tip16", {
                                      version: n(U).getBrowserTopVersionById(
                                        X.value,
                                      ),
                                    }),
                                  ),
                                  1,
                                ),
                                w(
                                  "span",
                                  {
                                    class:
                                      "tw-cursor-pointer tw-text-main tw-underline tw-ml-2",
                                    onClick: l[1] || (l[1] = (e) => Q(M.value)),
                                  },
                                  c(t.$t("env.env.openTipBtn")),
                                  1,
                                ),
                              ]))
                            : Z.value
                              ? (s(),
                                i("div", j, [
                                  d(
                                    _,
                                    { class: "tw-animate-spin tw-text-main" },
                                    { default: u(() => [d(n(y))]), _: 1 },
                                  ),
                                  w("span", F, c(Z.value), 1),
                                  w(
                                    "span",
                                    K,
                                    c(t.$t("kernelDownload.tip2")),
                                    1,
                                  ),
                                ]))
                              : g("", !0),
                        ]),
                      ]),
                      _: 1,
                    },
                  ))
                : g("", !0),
              n(U).browserList.length <= 1
                ? (s(),
                  o(
                    T,
                    {
                      key: 2,
                      label: t.$t("env.env.req.browser"),
                      prop: "browserVersionId",
                    },
                    {
                      default: u(() => [
                        w("div", null, c(n(U).getBrowserNameById()), 1),
                      ]),
                      _: 1,
                    },
                    8,
                    ["label"],
                  ))
                : g("", !0),
            ])
          );
        };
      },
    }),
    [["__scopeId", "data-v-408b6c9c"]],
  );
export { z as default };
