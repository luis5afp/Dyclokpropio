import {
  d as e,
  v as t,
  R as l,
  ad as a,
  r as o,
  o as n,
  c as i,
  f as s,
  y as c,
  b as r,
  w as d,
  X as u,
  t as p,
  a as w,
  O as v,
  iV as x,
  F as f,
  z as m,
  g5 as y,
  c5 as g,
  h,
  e as b,
  C as k,
  i as L,
  cZ as T,
  iW as C,
  V as _,
  _ as N,
} from "./index-BUIbb6Pa.js";
import { g as M, s as O } from "./index-D7tcaRcX.js";
const F = { class: "tw-h-fit choose-plan-container tw-relative" },
  P = { key: 2, class: "title" },
  S = { class: "contrast" },
  A = { class: "offers-title" },
  j = { key: 0, class: "offers" },
  E = { class: "offers-title" },
  I = { key: 0, class: "offers" },
  R = { class: "tw-flex" },
  z = {
    style: { "border-right": "1px solid var(--dialog-border-color)" },
    class:
      "tw-border-r-[1px] tw-border-[var(--dialog-border-color)] tw-border-solid tw-w-[20%] tw-flex-col tw-flex tw-justify-end",
  },
  U = {
    class:
      "'w-text-[16px] tw-text-[var(--text-color-base)] tw-h-[40px] tw-leading-[40px]",
  },
  V = {
    class:
      "'w-text-[16px] tw-text-[var(--text-color-base)] tw-h-[40px] tw-leading-[40px]",
  },
  $ = { class: "c-flex tw-flex-col" },
  B = {
    class:
      "tw-text-[18px] tw-leading-[1em] tw-underline tw-font-semibold tw-px-[6px] tw-py-[12px]",
  },
  H = { class: "tw-text-[16px] tw-px-[6px] tw-py-[12px] tw-pb-[0px]" },
  W = { key: 0 },
  D = { key: 1 },
  q = {
    key: 0,
    class:
      "tw-flex tw-h-[21px] tw-items-baseline tw-gap-x-1 tw-text-center tw-justify-center tw-flex-grow tw-opacity-60 tw-line-through",
  },
  X = { key: 0 },
  Z = { key: 1 },
  G = {
    key: 1,
    class:
      "tw-text-[16px] tw-px-[6px] tw-pb-[10px] tw-pt-[0px] tw-text-[var(--warning-color)]",
  },
  J = {
    class: "c-flex tw-flex-col !tw-justify-normal tw-px-[6px] tw-py-[12px]",
  },
  K = ["onClick"],
  Q = N(
    e({
      __name: "newChoosePlan",
      props: { isShowTitle: { type: Boolean, default: !1 } },
      emits: ["submit", "close"],
      setup(e, { emit: N }) {
        const { t: Q } = t.useI18n(),
          Y = e;
        let {
            planDataList: ee,
            discount: te,
            defaultPaidModuleList: le,
            payOrderNum: ae,
          } = l(a()),
          oe = k(() =>
            _.cloneDeep(
              (ee.value.planConfigList || []).filter((e) => {
                var t;
                return (
                  e.type === g.Free ||
                  (null == (t = e.costConfig) ? void 0 : t.showList)
                );
              }),
            ),
          );
        const ne = L(!0),
          ie = k(() => oe.value.find((e) => e.discount)),
          se = N,
          ce = (e, t = !1) => {
            se("submit", e, ne.value, t);
          },
          re = () => {
            (T(["do", "chat:open", []]),
              T([
                "do",
                "message:send",
                ["text", "I am interested in the customized plan"],
              ]));
          },
          de = [
            { code: "memberLimit", name: Q("cost.plan.card.memberCount") },
            { code: "envLimit", name: Q("cost.plan.card.envCount") },
            { code: "openLimit", name: Q("cost.plan.card.dailyEnvCount") },
            { code: "extendNum", name: Q("cost.plan.dialog.extensionNumber") },
            { code: "rpaOpenNum", name: Q("cost.plan.card.rpaOpenNum") },
          ],
          ue = [
            {
              code: "memberLimit",
              name: Q("cost.plan.dialog.customBrowserFingerprint"),
            },
            { code: "envLimit", name: Q("cost.plan.dialog.editBrowserEnv") },
            { code: "openLimit", name: Q("cost.plan.dialog.proxyConfig") },
            {
              code: "extendNum",
              name: Q("cost.plan.dialog.addPlatformAccount"),
            },
            { code: "extendNum", name: Q("cost.plan.dialog.cloudAsync") },
          ];
        function pe(e, t) {
          var l;
          return (
            t.type === g.CUSTOM_PLAN ||
            ((null == (l = t.authConfig) ? void 0 : l.moduleIds) || []).find(
              (t) => t === e,
            )
          );
        }
        const we = L(),
          ve = L(0);
        function xe(e) {
          ve.value = e.scrollLeft;
        }
        function fe(e) {
          var t, l;
          "-" == e
            ? null == (t = we.value) ||
              t.scrollTo({ left: ve.value - 70, behavior: "smooth" })
            : null == (l = we.value) ||
              l.scrollTo({ left: ve.value + 70, behavior: "smooth" });
        }
        const me = L(null),
          ye = L(null),
          ge = L(!1);
        function he(e, t) {
          (ye.value && (clearTimeout(ye.value), (ye.value = null)),
            me.value && (clearInterval(me.value), (me.value = null)),
            (ge.value = !1),
            (ye.value = window.setTimeout(() => {
              ((ge.value = !0),
                (me.value = window.setInterval(() => fe(e), 100)),
                fe(e));
            }, 300)));
        }
        function be() {
          (!ge.value && ye.value && (clearTimeout(ye.value), (ye.value = null)),
            me.value && (clearInterval(me.value), (me.value = null)),
            (ge.value = !1));
        }
        return (e, t) => {
          const l = o("ArrowLeftBold"),
            a = o("el-icon"),
            k = o("ArrowRightBold"),
            L = o("el-switch"),
            T = o("el-tooltip"),
            _ = o("el-button");
          return (
            n(),
            i("div", F, [
              s(oe).length > 4
                ? (n(),
                  i(
                    "div",
                    {
                      key: 0,
                      class:
                        "tw-absolute tw-z-10 tw-left-[22%] tw-top-[40%] tw-cursor-pointer",
                      onMousedown: t[0] || (t[0] = (e) => he("-")),
                      onMouseup: be,
                      onMouseleave: be,
                      onTouchstart:
                        t[1] || (t[1] = c((e) => he("-"), ["prevent"])),
                      onTouchend: be,
                      onTouchcancel: be,
                    },
                    [r(a, { size: "20" }, { default: d(() => [r(l)]), _: 1 })],
                    32,
                  ))
                : u("", !0),
              s(oe).length > 4
                ? (n(),
                  i(
                    "div",
                    {
                      key: 1,
                      class:
                        "tw-absolute tw-z-10 tw-right-[2%] tw-top-[40%] tw-cursor-pointer",
                      onMousedown: t[2] || (t[2] = (e) => he("+")),
                      onMouseup: be,
                      onMouseleave: be,
                      onTouchstart:
                        t[3] || (t[3] = c((e) => he("+"), ["prevent"])),
                      onTouchend: be,
                      onTouchcancel: be,
                    },
                    [r(a, { size: "20" }, { default: d(() => [r(k)]), _: 1 })],
                    32,
                  ))
                : u("", !0),
              Y.isShowTitle
                ? (n(),
                  i("div", P, p(s(Q)("cost.plan.dialog.choosePlanTitle")), 1))
                : u("", !0),
              w("div", S, [
                w(
                  "div",
                  { class: v(["month", ne.value ? "" : "active"]) },
                  [
                    w("span", A, p(s(Q)("cost.plan.dialog.monthly")), 1),
                    1 !== s(te)[s(x).ONE_MONTH]
                      ? (n(),
                        i(
                          "span",
                          j,
                          "-" +
                            p(Math.ceil(100 - 100 * s(te)[s(x).ONE_MONTH])) +
                            "%",
                          1,
                        ))
                      : u("", !0),
                  ],
                  2,
                ),
                r(
                  L,
                  {
                    modelValue: ne.value,
                    "onUpdate:modelValue":
                      t[4] || (t[4] = (e) => (ne.value = e)),
                    "inline-prompt": "",
                    size: "large",
                  },
                  null,
                  8,
                  ["modelValue"],
                ),
                w(
                  "div",
                  { class: v(["year", ne.value ? "active" : ""]) },
                  [
                    w("span", E, p(s(Q)("cost.plan.dialog.yearly")), 1),
                    1 !== s(te)[s(x).TWELVE_MONTHS]
                      ? (n(),
                        i(
                          "span",
                          I,
                          "-" +
                            p(
                              Math.ceil(100 - 100 * s(te)[s(x).TWELVE_MONTHS]),
                            ) +
                            "%",
                          1,
                        ))
                      : u("", !0),
                  ],
                  2,
                ),
              ]),
              w("div", R, [
                w("div", z, [
                  w("div", U, p(s(Q)("cost.plan.dialog.freeFeatures")), 1),
                  (n(),
                  i(
                    f,
                    null,
                    m(ue, (e) =>
                      w(
                        "div",
                        {
                          class:
                            "tw-h-[45px] c-flex !tw-justify-start tw-text-[14px] tw-text-[var(--text-color-light1)] tw-pr-[10px]",
                          key: e.code,
                        },
                        p(e.name),
                        1,
                      ),
                    ),
                    64,
                  )),
                  w("div", V, p(s(Q)("cost.plan.dialog.advancedFeatures")), 1),
                  (n(),
                  i(
                    f,
                    null,
                    m(de, (e) =>
                      w(
                        "div",
                        {
                          class:
                            "tw-h-[45px] c-flex !tw-justify-start tw-text-[14px] tw-text-[var(--text-color-light1)] tw-pr-[10px]",
                          key: e.code,
                        },
                        p(e.name),
                        1,
                      ),
                    ),
                    64,
                  )),
                  (n(!0),
                  i(
                    f,
                    null,
                    m(
                      s(le),
                      (e) => (
                        n(),
                        i(
                          "div",
                          {
                            class: v([
                              "tw-text-[14px]",
                              "tw-text-[var(--text-color-light1)]",
                              "defaultTitle" === e.code && "tw-invisible",
                              "tw-h-[45px]",
                              "c-flex",
                              "!tw-justify-start",
                              "tw-pr-[10px]",
                            ]),
                            key: e.code,
                          },
                          [w("div", null, p(e.name), 1)],
                          2,
                        )
                      ),
                    ),
                    128,
                  )),
                ]),
                r(
                  s(y),
                  {
                    ref_key: "scrollbarRef",
                    ref: we,
                    "view-class": "tw-flex tw-h-fit",
                    onScroll: xe,
                  },
                  {
                    default: d(() => [
                      (n(!0),
                      i(
                        f,
                        null,
                        m(s(oe), (e, l) => {
                          var a, o, c, x;
                          return (
                            n(),
                            i(
                              "div",
                              {
                                ref_for: !0,
                                ref: "innerRef",
                                key: l,
                                class:
                                  "tw-border-solid tw-flex-none tw-basis-1/4 hover:tw-bg-[#0F96700f] tw-rounded-[16px] tw-text-[14px]",
                              },
                              [
                                w("div", $, [
                                  r(
                                    T,
                                    {
                                      effect: "dark",
                                      placement: "top",
                                      content: e.summary,
                                    },
                                    {
                                      default: d(() => [
                                        w("div", B, p(e.name || "plan"), 1),
                                      ]),
                                      _: 2,
                                    },
                                    1032,
                                    ["content"],
                                  ),
                                  w("div", H, [
                                    e.type !== s(g).CUSTOM_PLAN
                                      ? (n(),
                                        i(
                                          "span",
                                          W,
                                          " $" +
                                            p(
                                              s(M)(
                                                e,
                                                ne.value,
                                                e.type === s(g).Free,
                                              ),
                                            ) +
                                            "/" +
                                            p(s(Q)("cost.plan.dialog.month")),
                                          1,
                                        ))
                                      : (n(),
                                        i(
                                          "span",
                                          D,
                                          p(s(Q)("env.env.req.custom")),
                                          1,
                                        )),
                                  ]),
                                  ie.value
                                    ? (n(),
                                      i("div", q, [
                                        s(M)(
                                          e,
                                          ne.value,
                                          e.type === s(g).Free,
                                          !1,
                                        ) &&
                                        e.type !== s(g).Free &&
                                        e.discount &&
                                        s(O)(e, ne.value)
                                          ? (n(),
                                            i(
                                              "span",
                                              X,
                                              " $" +
                                                p(
                                                  s(M)(
                                                    e,
                                                    ne.value,
                                                    e.type === s(g).Free,
                                                    !1,
                                                  ),
                                                ) +
                                                "/" +
                                                p(
                                                  s(Q)(
                                                    "cost.plan.dialog.month",
                                                  ),
                                                ),
                                              1,
                                            ))
                                          : (n(), i("span", Z)),
                                      ]))
                                    : u("", !0),
                                  ne.value
                                    ? (n(),
                                      i("div", G, [
                                        w(
                                          "span",
                                          {
                                            class: v(
                                              ([
                                                s(g).CUSTOM_PLAN,
                                                s(g).Free,
                                              ].includes(e.type) ||
                                                !e.discount) &&
                                                "tw-invisible",
                                            ),
                                          },
                                          " $" +
                                            p(
                                              (
                                                12 *
                                                Number(
                                                  s(M)(
                                                    e,
                                                    ne.value,
                                                    e.type === s(g).Free,
                                                  ),
                                                )
                                              ).toFixed(2),
                                            ) +
                                            "/" +
                                            p(s(Q)("cost.plan.dialog.year")),
                                          3,
                                        ),
                                      ]))
                                    : u("", !0),
                                  w("div", J, [
                                    e.type == s(g).Free
                                      ? (n(),
                                        h(
                                          _,
                                          {
                                            key: 0,
                                            type: "info",
                                            disabled: "",
                                          },
                                          {
                                            default: d(() => [
                                              b(
                                                p(
                                                  s(Q)(
                                                    "cost.plan.card.currentPlan",
                                                  ),
                                                ),
                                                1,
                                              ),
                                            ]),
                                            _: 1,
                                          },
                                        ))
                                      : e.type === s(g).CUSTOM_PLAN
                                        ? (n(),
                                          h(
                                            _,
                                            {
                                              key: 1,
                                              type: "primary",
                                              plain: "",
                                              onClick: re,
                                            },
                                            {
                                              default: d(() => [
                                                b(
                                                  p(
                                                    s(Q)(
                                                      "cost.plan.dialog.service",
                                                    ),
                                                  ),
                                                  1,
                                                ),
                                              ]),
                                              _: 1,
                                            },
                                          ))
                                        : (n(),
                                          h(
                                            _,
                                            {
                                              key: 2,
                                              type: "primary",
                                              onClick: (t) =>
                                                ce(e.planConfigId),
                                            },
                                            {
                                              default: d(() => [
                                                b(
                                                  p(
                                                    s(Q)(
                                                      "cost.plan.card.buyNow",
                                                    ),
                                                  ),
                                                  1,
                                                ),
                                              ]),
                                              _: 1,
                                            },
                                            8,
                                            ["onClick"],
                                          )),
                                    w(
                                      "div",
                                      {
                                        class: v(
                                          `tw-flex-1 tw-mt-[14px] tw-text-[var(--warning-color)] tw-underline ${(null == (a = e.costConfig) ? void 0 : a.trial) && !ne.value && "tw-cursor-pointer"} tw-text-center`,
                                        ),
                                      },
                                      [
                                        w(
                                          "span",
                                          {
                                            class: v(
                                              (!(null == (o = e.costConfig)
                                                ? void 0
                                                : o.trial) ||
                                                e.type === s(g).CUSTOM_PLAN ||
                                                ne.value ||
                                                s(ae)) &&
                                                "tw-invisible",
                                            ),
                                            onClick: (t) =>
                                              ce(e.planConfigId, !0),
                                          },
                                          p(s(Q)("cost.plan.card.try7")) +
                                            "（$" +
                                            p(
                                              null ==
                                                (x =
                                                  (null ==
                                                  (c =
                                                    null == e
                                                      ? void 0
                                                      : e.costConfig)
                                                    ? void 0
                                                    : c.trialPrice) || 0)
                                                ? void 0
                                                : x.toFixed(2),
                                            ) +
                                            "）",
                                          11,
                                          K,
                                        ),
                                      ],
                                      2,
                                    ),
                                  ]),
                                  t[5] || (t[5] = w("div", null, null, -1)),
                                ]),
                                (n(),
                                i(
                                  f,
                                  null,
                                  m(ue, (e) =>
                                    w(
                                      "div",
                                      {
                                        key: e.code,
                                        class:
                                          "tw-h-[45px] c-flex tw-text-[14px]",
                                      },
                                      [
                                        ...(t[6] ||
                                          (t[6] = [
                                            w(
                                              "div",
                                              {
                                                class:
                                                  "tw-w-[16px] tw-h-[16px] tw-rounded-[50%] tw-bg-[var(--icon-success-color)] c-flex tw-leading-[16px]",
                                              },
                                              [
                                                w("i", {
                                                  class:
                                                    "iconfont icon-check tw-text-[14px] tw-text-[var(--text-color-white)]",
                                                }),
                                              ],
                                              -1,
                                            ),
                                          ])),
                                      ],
                                    ),
                                  ),
                                  64,
                                )),
                                t[7] ||
                                  (t[7] = w(
                                    "div",
                                    { class: "tw-h-[40px]" },
                                    null,
                                    -1,
                                  )),
                                (n(),
                                i(
                                  f,
                                  null,
                                  m(de, (t) =>
                                    w(
                                      "div",
                                      {
                                        key: t.code,
                                        class:
                                          "tw-h-[45px] c-flex tw-text-[16px]",
                                      },
                                      p(
                                        (function (e, t) {
                                          var l;
                                          if (t.type === g.CUSTOM_PLAN)
                                            return Q("cost.plan.dialog.custom");
                                          if (
                                            [
                                              "envLimit",
                                              "memberLimit",
                                              "openLimit",
                                            ].includes(e) &&
                                            t.type !== g.Free
                                          ) {
                                            let a = {
                                              envLimit: C.EnvLimit1,
                                              memberLimit: C.MemberLimit,
                                              openLimit: C.OpenLimit,
                                            };
                                            return ((null == (l = t.initConfig)
                                              ? void 0
                                              : l.unlimited) || 0) &
                                              Reflect.get(a, e)
                                              ? Q("cost.plan.dialog.unlimited")
                                              : Reflect.get(t, e);
                                          }
                                          {
                                            let l =
                                              (Reflect.get(t, e) ||
                                                Reflect.get(
                                                  (null == t
                                                    ? void 0
                                                    : t.authConfig) || {},
                                                  e,
                                                )) ??
                                              0;
                                            return -1 === l
                                              ? Q("cost.plan.dialog.unlimited")
                                              : l;
                                          }
                                        })(t.code, e),
                                      ),
                                      1,
                                    ),
                                  ),
                                  64,
                                )),
                                (n(!0),
                                i(
                                  f,
                                  null,
                                  m(
                                    s(le),
                                    (t) => (
                                      n(),
                                      i(
                                        "div",
                                        {
                                          key: t.code,
                                          class: v([
                                            ...("defaultTitle" === t.code
                                              ? [
                                                  "tw-text-[16px]",
                                                  "tw-text-[var(--text-color-base)]",
                                                ]
                                              : [
                                                  "tw-text-[14px]",
                                                  "tw-text-[var(--text-color-light1)]",
                                                ]),
                                            "tw-h-[45px]",
                                            "c-flex",
                                          ]),
                                        },
                                        [
                                          w(
                                            "div",
                                            {
                                              class: v(
                                                `tw-w-[16px] tw-h-[16px] tw-rounded-[50%] tw-leading-[16px] ${pe(t.id, e) ? "tw-bg-[var(--icon-success-color)]" : "tw-bg-[var(--icon-fail-color)]"} c-flex`,
                                              ),
                                            },
                                            [
                                              w(
                                                "i",
                                                {
                                                  class: v(
                                                    `iconfont ${pe(t.id, e) ? "icon-check" : "icon-fail"}  tw-text-[14px] tw-text-[var(--text-color-white)]`,
                                                  ),
                                                },
                                                null,
                                                2,
                                              ),
                                            ],
                                            2,
                                          ),
                                        ],
                                        2,
                                      )
                                    ),
                                  ),
                                  128,
                                )),
                              ],
                            )
                          );
                        }),
                        128,
                      )),
                    ]),
                    _: 1,
                  },
                  512,
                ),
              ]),
            ])
          );
        };
      },
    }),
    [["__scopeId", "data-v-97039f48"]],
  );
export { Q as default };
