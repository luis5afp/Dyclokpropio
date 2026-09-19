import { _ as a } from "./RpaOperationRule.vue_vue_type_style_index_0_lang-Cp8Mvyio.js";
import {
  d as t,
  v as e,
  R as s,
  jW as l,
  V as i,
  as as r,
  bN as n,
  ko as o,
  P as u,
  ac as p,
  dR as v,
  r as c,
  o as d,
  c as w,
  b as f,
  w as m,
  a as b,
  f as g,
  t as x,
  e as k,
  X as y,
  kf as _,
  jZ as O,
  jY as T,
  g5 as S,
  i as R,
  C as N,
  D,
  E,
  A as I,
  k2 as h,
  kp as P,
  _ as j,
} from "./index-BUIbb6Pa.js";
import { _ as C } from "./newRpaProcessOptionsForm.vue_vue_type_script_setup_true_lang-BLtJw3M5.js";
import { W as J } from "./warningTipBox-D4J3yDX4.js";
import "./timezone-BMz8A6Hf.js";
import "./rpaRule-swm8xZfZ.js";
const A = { class: "tw-relative tw-h-full tw-pb-[40px] rpaTaskConfigWrapper" },
  F = { class: "tw-absolute tw-right-[20px] tw-text-[14px]" },
  L = {
    key: 0,
    class: "tw-text-[var(--btn-success-color2)] tw-flex tw-items-center",
  },
  U = {
    key: 1,
    class: "tw-text-[var(--primary-color)] tw-flex tw-items-center",
  },
  W = { class: "tw-max-w-[610px] tw-pb-[32px]" },
  M = { key: 0 },
  G = { class: "tw-mb-[24px]" },
  K = { class: "tw-mb-[24px]" },
  Y = { key: 0, class: "tw-mb-[24px]" },
  z = j(
    t({
      __name: "RpaTaskConfigSet",
      props: { taskId: {}, activeName: {} },
      setup(t, { expose: j }) {
        let z = t,
          { t: B } = e.useI18n();
        const { editTaskData: H } = s(l()),
          V = l(),
          X = R();
        let Z = R(),
          q = R(),
          Q = R(!1);
        i.debounce(async function () {
          Q.value = !0;
          let [a, t] = await r(Promise.all([la(), sa()]));
          (await n(ea()), a || ($.value = !0));
          Q.value = !1;
        }, 500);
        const $ = R(!1),
          aa = N(() => P(H.value)),
          ta = R();
        function ea() {
          return 1e3 * (Math.random() + 1);
        }
        function sa() {
          return new Promise(async (a, t) => {
            var e;
            let s = await (null == (e = q.value) ? void 0 : e.handleSubmit());
            s
              ? (await (async (a) => {
                  (D.api.trackEvent({
                    type: I.RPA_CLICK,
                    action: E.CLICK_CONFIGURE_RPA_FLOW,
                  }),
                    (Q.value = !0),
                    ($.value = !1));
                  let t = JSON.parse(JSON.stringify(X.value));
                  t = { ...t, globalData: JSON.stringify(a) };
                  let [e] = await r(
                    h(H.value.rpaWorkflowId, JSON.stringify(t), !0),
                  );
                  (await n(ea()),
                    e || ((H.value.data = JSON.stringify(t)), ($.value = !0)),
                    (Q.value = !1));
                })(s),
                a(!0))
              : t(!1);
          });
        }
        function la() {
          return new Promise(async (a, t) => {
            var e;
            let s = await (null == (e = Z.value) ? void 0 : e.handleSubmit());
            if (s) {
              ((s.isOn = !0), s.timeout || (s.timeout = 0), (Q.value = !0));
              let [t] = await r(o(z.taskId, s));
              (await n(ea()),
                t || ($.value = !0),
                (Q.value = !1),
                V.getEditTaskData(z.taskId, !0),
                a(!0));
            } else t(!1);
          });
        }
        async function ia() {
          setTimeout(() => sa(), 0);
        }
        const ra = i.debounce(() => {
          setTimeout(async () => {
            (await la(), V.getPendingTaskList());
          }, 0);
        }, 500);
        return (
          u(() => {
            p(() => {
              var a;
              const t = JSON.parse(H.value.data ?? "{}");
              ((t.globalData = v(t.globalData)
                ? JSON.parse(t.globalData)
                : t.globalData),
                (X.value = t),
                null == (a = Z.value) || a.acceptParams(H.value));
            });
          }),
          j({
            handleScrollbar: function () {
              var a, t, e;
              null == (e = ta.value) ||
                e.scrollTo({
                  top:
                    null == (t = null == (a = ta.value) ? void 0 : a.wrapRef)
                      ? void 0
                      : t.scrollHeight,
                  behavior: "smooth",
                });
            },
          }),
          (t, e) => {
            const s = c("el-divider");
            return (
              d(),
              w("div", A, [
                f(
                  g(S),
                  { ref_key: "scrollbar", ref: ta },
                  {
                    default: m(() => {
                      var t, l, i;
                      return [
                        b("div", F, [
                          g(Q)
                            ? (d(),
                              w("div", L, [
                                e[0] ||
                                  (e[0] = b(
                                    "i",
                                    {
                                      class:
                                        "iconfont icon-opening dic-animate-spin tw-mr-[4px]",
                                    },
                                    null,
                                    -1,
                                  )),
                                b("span", null, x(g(B)("rpa2.saving")), 1),
                              ]))
                            : $.value
                              ? (d(),
                                w("div", U, [
                                  e[1] ||
                                    (e[1] = b(
                                      "span",
                                      {
                                        class:
                                          "tw-w-[16px] tw-h-[16px] tw-bg-[var(--primary-color)] c-flex tw-rounded-[50%] tw-mr-[4px]",
                                      },
                                      [
                                        b("i", {
                                          class:
                                            "iconfont icon-check tw-text-black tw-pt-[2px] tw-text-[14px]",
                                        }),
                                      ],
                                      -1,
                                    )),
                                  k(" " + x(g(B)("rpa2.editSavedSettings")), 1),
                                ]))
                              : y("", !0),
                        ]),
                        b("div", W, [
                          (null == (t = X.value) ? void 0 : t.globalData) &&
                          JSON.stringify(
                            null == (l = X.value) ? void 0 : l.globalData,
                          ) !== JSON.stringify({ key: "value" })
                            ? (d(),
                              w("div", M, [
                                b("div", G, x(g(B)("rpaOptions.tip1")), 1),
                                f(
                                  C,
                                  {
                                    disabled: g(V).isTargetTaskEdit,
                                    ref_key: "newRpaProcessOptionsFormRef",
                                    ref: q,
                                    "global-data":
                                      null == (i = X.value)
                                        ? void 0
                                        : i.globalData,
                                    onSubmit: ia,
                                  },
                                  null,
                                  8,
                                  ["disabled", "global-data"],
                                ),
                                f(s),
                              ]))
                            : y("", !0),
                          b("div", null, [
                            b("div", K, x(g(B)("rpa2.runRules")), 1),
                            (g(H).isOn && g(H).status !== g(_).TERMINATE) ||
                            (g(H).type === g(O).ONCE &&
                              g(H).executeTimeType === g(T).IMMEDIATELY)
                              ? y("", !0)
                              : (d(),
                                w("div", Y, [
                                  f(
                                    J,
                                    { class: "tw-text-[14px]" },
                                    {
                                      default: m(() => [
                                        k(
                                          x(
                                            g(B)("rpa2.taskExpired", {
                                              taskTypeName: aa.value,
                                            }),
                                          ),
                                          1,
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                  ),
                                ])),
                            f(
                              a,
                              {
                                workflowUuid: g(H).workflowUuid,
                                ref_key: "rpaOperationRuleRef",
                                ref: Z,
                                disabled: g(V).isTargetTaskEdit,
                                onSubmit: g(ra),
                              },
                              null,
                              8,
                              ["workflowUuid", "disabled", "onSubmit"],
                            ),
                          ]),
                        ]),
                      ];
                    }),
                    _: 1,
                  },
                  512,
                ),
              ])
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-9195a000"]],
  );
export { z as default };
