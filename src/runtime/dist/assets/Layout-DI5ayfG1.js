import {
  d as e,
  P as t,
  ac as a,
  ag as s,
  r,
  o,
  c as l,
  b as n,
  w as i,
  F as w,
  z as p,
  h as c,
  a as f,
  t as v,
  X as u,
  ai as d,
  O as x,
  f as b,
  bM as h,
  be as m,
  ah as y,
  e as g,
  i as k,
  C as $,
  m as _,
  bN as V,
  n as E,
  _ as C,
} from "./index-BUIbb6Pa.js";
const F = {
    class:
      "tw-w-full tw-h-full tw-overflow-hidden s-flex !tw-items-start tw-relative tw-min-w-[1000px]",
  },
  z = { key: 0, class: "tw-w-[10%] envV2-step tw-pr-1" },
  B = ["onMouseover"],
  R = ["onMouseover"],
  M = { class: "tw-h-full" },
  N = {
    class:
      "tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-h-[72px] tw-z-[1000] tw-flex tw-justify-end tw-pr-[10px]",
  },
  T = {
    class:
      "tw-h-full tw-pb-[40px] tw-w-full tw-overflow-y-auto envV2-box tw-pr-[5px] tw-px-[24px] tw-py-[14px] tw-rounded-[8px] tw-border-[1px] tw-border-[var(--border-color-base)] tw-bg-[var(--table-tr-bg-color)]",
  },
  q = {
    class:
      "tw-absolute tw-left-0 tw-top-0 tw-w-[98%] tw-pl-[24px] tw-border-b-0 tw-border-r-0 tw-z-[1] tw-border-[1px] tw-border-[var(--border-color-base)] tw-rounded-tl-[8px] tw-h-[60px] tw-bg-[var(--table-tr-bg-color)] b-flex",
  },
  I = { key: 0, class: "tw-text-[14px]" },
  W = { class: "tw-text-[14px]" },
  A = { key: 1, class: "tw-w-[10px]" },
  P = {
    key: 1,
    class:
      "tw-bottom-[20px] tw-text-[var(--text-color-light1)] tw-absolute tw-left-0 tw-pl-[24px] tw-py-[10px] tw-w-full tw-mr-[24px] tw-h-fit tw-bg-[var(--table-tr-bg-color)] tw-text-[14px] tw",
  },
  S = C(
    e({
      __name: "Layout",
      props: {
        isEdit: { type: Boolean },
        isBulkImport: { type: Boolean },
        isBatch: { type: Boolean },
      },
      emits: ["refreshFingerprint", "close-drawer"],
      setup(e, { emit: C }) {
        const S = k(!1),
          L = k(!1),
          O = k(!1),
          j = [
            { name: "basic1", href: "#basic" },
            { name: "proxy", href: "#proxy" },
            { name: "fingerprint1", href: "#fingerprint" },
            { name: "extend", href: "#senior" },
          ],
          D = k({ basic: !1, proxy: !1, fingerprint: !1, senior: !1 }),
          H = k(!0),
          X = C,
          G = e,
          J = $(() => G.isBulkImport || G.isBatch || G.isEdit),
          K = k(),
          Q = k();
        let U = 0,
          Y = 0;
        const Z = (e) => {
            const t = K.value;
            e || (t && (t.scrollTop = 1));
          },
          ee = (e) => {
            e.preventDefault();
          },
          te = (e) => {
            ((Y = e),
              U ||
                (U = requestAnimationFrame(() => {
                  ((U = 0), _.emit("envV2-left-size", Y - 13.5));
                })));
          },
          ae = new ResizeObserver((e) => {
            for (const t of e) {
              const { width: e } = t.contentRect;
              te(e);
            }
          }),
          se = (e, t) => {
            const a = t.target,
              s = a.parentNode;
            a.offsetWidth > s.offsetWidth && (D.value[e] = !0);
          },
          re = () => {
            X("refreshFingerprint");
          },
          oe = async () => {
            L.value = !0;
            const e = S.value,
              t = document.querySelector("#envV2-info"),
              a = t.offsetHeight;
            ((O.value && e) || (H.value = !0), await V(100));
            const s = document.querySelector("#envV2-form"),
              r = document.querySelector(".fold-strip"),
              o = r.offsetTop;
            if (t) {
              const s = t.offsetWidth;
              ((t.style.transition = "all 0.3s ease-in-out"),
                (t.style.right = e ? "0" : `-${s}px`),
                (r.style.top = e ? "" : "56px"),
                (r.style.paddingTop = e ? "" : o - 57.5 + "px"),
                (r.style.height = e ? "auto" : `${a}px`),
                (r.style.border = e
                  ? ""
                  : "1px solid var(--border-color-base)"),
                (r.style.borderRadius = e ? "" : "8px"));
            }
            (s &&
              (ae.observe(s),
              (s.style.transition = "all 0.3s ease-in-out"),
              (s.style.width = e
                ? J.value
                  ? "60%"
                  : "67%"
                : J.value
                  ? "calc(90% - 80px)"
                  : "calc(100% - 80px)")),
              await V(10),
              (S.value = !S.value),
              await V(400),
              (L.value = !1),
              ae.unobserve(s));
          },
          le = () => {
            const e = document.querySelector("#envV2-info");
            S.value &&
              ((e.style.transition = ""),
              (e.style.right = `-${e.offsetWidth}px`));
            const t = e.offsetWidth;
            H.value = !(t <= 333);
          };
        function ne() {
          (E.push("/personalInfo?type=envPreferences"), X("close-drawer"));
        }
        return (
          t(() => {
            (window.addEventListener("resize", le),
              a(() => {
                (le(), J.value && Z(""));
              }));
          }),
          s(() => {
            (window.removeEventListener("resize", le),
              U && cancelAnimationFrame(U),
              ae.disconnect());
          }),
          (t, a) => {
            const s = r("el-anchor-link"),
              k = r("el-tooltip"),
              $ = r("el-anchor"),
              _ = r("el-button");
            return (
              o(),
              l("div", F, [
                J.value
                  ? (o(),
                    l("div", z, [
                      n(
                        $,
                        {
                          ref_key: "ahchorRef",
                          ref: Q,
                          bound: 0,
                          container: K.value,
                          offset: 0,
                          type: "default",
                          onChange: Z,
                          onClick: ee,
                        },
                        {
                          default: i(() => [
                            (o(),
                            l(
                              w,
                              null,
                              p(
                                j,
                                (e) => (
                                  o(),
                                  l(
                                    w,
                                    { key: e.name },
                                    [
                                      D.value.basic
                                        ? (o(),
                                          c(
                                            k,
                                            {
                                              key: 0,
                                              content: t.$t(
                                                `env.env.step.${e.name}`,
                                              ),
                                              placement: "right",
                                            },
                                            {
                                              default: i(() => [
                                                n(
                                                  s,
                                                  { href: e.href },
                                                  {
                                                    default: i(() => [
                                                      f(
                                                        "span",
                                                        {
                                                          onMouseover: (t) =>
                                                            se(e.name, t),
                                                        },
                                                        v(
                                                          t.$t(
                                                            `env.env.step.${e.name}`,
                                                          ),
                                                        ),
                                                        41,
                                                        B,
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
                                        : (o(),
                                          c(
                                            s,
                                            { key: 1, href: e.href },
                                            {
                                              default: i(() => [
                                                f(
                                                  "span",
                                                  {
                                                    onMouseover: (t) =>
                                                      se(e.name, t),
                                                    class:
                                                      "!tw-whitespace-normal",
                                                  },
                                                  v(
                                                    t.$t(
                                                      `env.env.step.${e.name}`,
                                                    ),
                                                  ),
                                                  41,
                                                  R,
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
                              64,
                            )),
                          ]),
                          _: 1,
                        },
                        8,
                        ["container"],
                      ),
                    ]))
                  : u("", !0),
                f(
                  "div",
                  {
                    id: "envV2-form",
                    class: x([
                      "tw-relative tw-pb-[72px]",
                      b(h)(
                        "tw-h-full tw-overflow-y-auto tw-duration-700 envV2-box",
                        J.value ? "tw-w-[60%]" : "tw-w-[67%]",
                      ),
                    ]),
                  },
                  [
                    f("div", M, [
                      f(
                        "div",
                        {
                          id: "envV2-left",
                          ref_key: "containerRef",
                          ref: K,
                          class:
                            "envV2-box tw-h-full tw-overflow-y-auto tw-relative tw-pr-[5px]",
                        },
                        [f("div", null, [d(t.$slots, "left", {}, void 0, !0)])],
                        512,
                      ),
                    ]),
                    f("div", N, [d(t.$slots, "footer", {}, void 0, !0)]),
                  ],
                  2,
                ),
                f(
                  "div",
                  {
                    id: "envV2-info",
                    class: x(
                      b(h)(
                        "tw-h-full tw-w-[28%] tw-duration-300 tw-absolute tw-right-0 tw-pb-[20px]",
                      ),
                    ),
                  },
                  [
                    f("div", T, [
                      f("div", q, [
                        S.value
                          ? u("", !0)
                          : (o(),
                            l("p", I, v(t.$t("env.env.preview.title")), 1)),
                        f(
                          "div",
                          {
                            class: x(
                              b(h)(
                                "tw-flex tw-items-start tw-px-[16px] tw-right-[40px] fold-strip tw-bg-[var(--table-tr-bg-color)]",
                                H.value ? "tw-fixed" : "",
                              ),
                            ),
                          },
                          [
                            e.isEdit && !S.value
                              ? (o(),
                                c(
                                  k,
                                  {
                                    key: 0,
                                    content: t.$t(
                                      "env.env.preview.refreshFingerprintTips",
                                    ),
                                    disable: L.value,
                                    "hide-after": 0,
                                    "popper-class": "tw-w-[300px]",
                                    placement: "left",
                                  },
                                  {
                                    default: i(() => [
                                      f(
                                        "div",
                                        {
                                          class:
                                            "tw-flex tw-items-center tw-gap-[2px] tw-cursor-pointer hover:tw-text-[var(--el-color-primary)]",
                                          onClick: re,
                                        },
                                        [
                                          f(
                                            "i",
                                            {
                                              class: x(
                                                b(h)(
                                                  "iconfont icon-random tw-cursor-pointer tw-flex !tw-text-[16px] ",
                                                  S.value
                                                    ? "tw-scale-x-[-1]"
                                                    : "",
                                                ),
                                              ),
                                            },
                                            null,
                                            2,
                                          ),
                                          f(
                                            "span",
                                            W,
                                            v(
                                              t.$t(
                                                "env.env.preview.refreshFingerprint",
                                              ),
                                            ),
                                            1,
                                          ),
                                        ],
                                      ),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["content", "disable"],
                                ))
                              : u("", !0),
                            S.value ? u("", !0) : (o(), l("div", A)),
                            n(
                              k,
                              {
                                content: S.value
                                  ? t.$t("envV2.tip17")
                                  : t.$t("envV2.tip18"),
                                disable: L.value,
                                "hide-after": 0,
                                placement: "left",
                              },
                              {
                                default: i(() => [
                                  f(
                                    "i",
                                    {
                                      class: x(
                                        b(h)(
                                          "iconfont icon-packup tw-cursor-pointer tw-flex !tw-text-[16px]",
                                          S.value ? "tw-scale-x-[-1]" : "",
                                        ),
                                      ),
                                      onClick: oe,
                                    },
                                    null,
                                    2,
                                  ),
                                ]),
                                _: 1,
                              },
                              8,
                              ["content", "disable"],
                            ),
                          ],
                          2,
                        ),
                      ]),
                      a[0] ||
                        (a[0] = f("div", { class: "tw-h-[42px]" }, null, -1)),
                      S.value
                        ? u("", !0)
                        : d(t.$slots, "right", { key: 0 }, void 0, !0),
                      !e.isEdit && b(m)(b(y).CREATE_AN_ENVIRONMENT)
                        ? (o(),
                          l("div", P, [
                            g(
                              v(
                                t.$t(
                                  "setting.envPreferences.needCustomFingerprint",
                                ),
                              ) + " ",
                              1,
                            ),
                            n(
                              _,
                              {
                                class: "!tw-p-0 tw-ml-[4px] tw-align-baseline",
                                type: "primary",
                                link: "",
                                onClick: ne,
                              },
                              {
                                default: i(() => [
                                  g(
                                    v(
                                      t.$t(
                                        "setting.envPreferences.preferences",
                                      ),
                                    ),
                                    1,
                                  ),
                                ]),
                                _: 1,
                              },
                            ),
                          ]))
                        : u("", !0),
                    ]),
                  ],
                  2,
                ),
              ])
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-0f0c50f0"]],
  );
export { S as default };
