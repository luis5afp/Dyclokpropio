import {
  d as e,
  v as a,
  R as l,
  G as t,
  P as n,
  ag as v,
  r as u,
  o as s,
  c as i,
  b as o,
  w as r,
  a as p,
  t as c,
  f as d,
  e as w,
  aw as m,
  ax as E,
  O as f,
  X as x,
  C as N,
  i as _,
  ay as I,
  az as T,
  m as C,
  aA as y,
  aB as A,
  aC as P,
  aD as g,
  _ as S,
} from "./index-BUIbb6Pa.js";
import {
  r as b,
  m as h,
  u as O,
  c as D,
  a as k,
} from "./openEnvProgressDisplay-BkwyI96I.js";
const R = { key: 0, class: "tw-min-h-[74px] tw-w-[534px] tw-flex" },
  B = {
    class:
      "tw-flex-1 tw-px-[16px] tw-py-[12px] tw-rounded-r-[6px] tw-bg-[var(--el-fill-color-extra--high-light)]",
  },
  U = { class: "b-flex tw-w-full tw-text-[14px]" },
  L = { class: "tw-flex tw-items-center tw-gap-[8px]" },
  j = { class: "tw-mr-[4px]" },
  z = {
    class:
      "tw-w-[28px] tw-bg-[var(--card-bg-color)] tw-flex tw-items-center tw-justify-center",
  },
  J = S(
    e({
      __name: "OpenEnvProgress",
      setup(e) {
        let { t: S } = a.useI18n();
        const J = N(() => q.value.isStart || Z.value.isStart),
          { isCollapse: $ } = l(t()),
          G = N(() => `calc(50% + ${($.value ? 98 : 260) / 2}px)`),
          X = _(!1),
          Z = _({
            openEnvNum: 0,
            serialNum: 0,
            stepType: I.PRE_DATA_INJECT,
            envId: "",
            isStart: !1,
            canCancel: !0,
          }),
          q = _({
            openEnvNum: 0,
            serialNum: 0,
            stepType: I.PRE_DATA_INJECT,
            envId: "",
            isStart: !1,
            canCancel: !0,
          }),
          F = _(!1),
          H = _(!1),
          K = _(D()),
          M = N(() =>
            q.value.isStart ? q.value.canCancel : Z.value.canCancel,
          ),
          Q = N(() => (q.value.isStart ? q.value.envId : Z.value.envId)),
          V = N(() => (q.value.isStart ? q.value.stepType : Z.value.stepType)),
          W = N(() => k(K.value, V.value, A.t)),
          Y = N(() =>
            g({
              isBatchOpen: q.value.isStart,
              canCancelCurrentEnv: M.value,
              remainingBatchEnvCount: q.value.openEnvNum,
              cancelPending: F.value,
            }),
          ),
          ee = (e) => {
            ((X.value = !1),
              (F.value = !1),
              (H.value = !1),
              (K.value = b()),
              e.envId
                ? ((Z.value.openEnvNum = e.openNum),
                  (Z.value.envId = e.envId),
                  (Z.value.isStart = !0),
                  (Z.value.canCancel = !0))
                : ((q.value.openEnvNum = e.openNum),
                  (q.value.isStart = !0),
                  (q.value.canCancel = !0),
                  (q.value.envId = "")));
          },
          ae = (e) => {
            const { serialNum: a, stepType: l, isBatchOpen: t, envId: n } = e;
            ((H.value = !1),
              (K.value = b()),
              l === I.PRE_DATA_INJECT &&
                (t
                  ? q.value.openEnvNum--
                  : t || Z.value.envId !== n || Z.value.openEnvNum--),
              t
                ? ((q.value.serialNum = a),
                  (q.value.stepType = l),
                  (q.value.envId = n),
                  (q.value.canCancel = !0),
                  (F.value = !1),
                  (H.value = !1))
                : t ||
                  Z.value.envId !== n ||
                  ((Z.value.serialNum = a), (Z.value.stepType = l)));
          },
          le = (e) => {
            const { envId: a, isBatchOpen: l, canCancel: t } = e;
            l && q.value.envId === a
              ? (q.value.canCancel = t)
              : l || Z.value.envId !== a || (Z.value.canCancel = t);
          },
          te = (e) => {
            const { isBatchOpen: a, envId: l } = e;
            a
              ? ((q.value.isStart = !1),
                (q.value.envId = ""),
                (F.value = !1),
                (H.value = !1),
                (K.value = b()))
              : a ||
                Z.value.envId !== l ||
                ((Z.value.isStart = !1),
                (F.value = !1),
                (H.value = !1),
                (K.value = b()));
          },
          ne = (e) => {
            (null == e ? void 0 : e.envId) &&
              e.envId === Q.value &&
              (K.value = O(K.value, e, V.value, A.t));
          },
          ve = () => {
            const e = q.value.isStart,
              a = e ? q.value.envId : Z.value.envId;
            if (!a || !Y.value) return;
            e && P();
            ((!!M.value && T(a)) || e) &&
              ((F.value = !0), (H.value = !0), (K.value = h()));
          };
        let ue = !1;
        return (
          n(() => {
            ue ||
              (C.on(y.OPEN_START, ee),
              C.on(y.OPEN_UPDATE, ae),
              C.on(y.OPEN_CANCEL_STATE_UPDATE, le),
              C.on(y.OPEN_DETAIL_UPDATE, ne),
              C.on(y.OPEN_END, te),
              (ue = !0));
          }),
          v(() => {
            ue &&
              (C.off(y.OPEN_START, ee),
              C.off(y.OPEN_UPDATE, ae),
              C.off(y.OPEN_CANCEL_STATE_UPDATE, le),
              C.off(y.OPEN_DETAIL_UPDATE, ne),
              C.off(y.OPEN_END, te),
              (ue = !1));
          }),
          (e, a) => {
            const l = u("el-button"),
              t = u("ArrowRight"),
              n = u("el-icon"),
              v = u("ArrowLeft");
            return J.value
              ? (s(),
                i(
                  "div",
                  {
                    key: 0,
                    class: f([
                      "tw-fixed tw-bottom-[8%] tw-z-[1000]",
                      X.value
                        ? "tw-right-0 tw-bottom-[15%]"
                        : "tw-bottom-[8%] tw-translate-x-[-50%]",
                    ]),
                    style: E({ left: X.value ? void 0 : G.value }),
                  },
                  [
                    o(
                      m,
                      { name: "open-env-slide", mode: "out-in" },
                      {
                        default: r(() => [
                          X.value
                            ? (s(),
                              i(
                                "div",
                                {
                                  key: 1,
                                  class:
                                    "tw-h-[74px] tw-flex tw-cursor-pointer",
                                  onClick:
                                    a[1] || (a[1] = (e) => (X.value = !1)),
                                },
                                [
                                  a[5] ||
                                    (a[5] = p(
                                      "div",
                                      {
                                        class:
                                          "tw-w-[5px] tw-bg-[var(--primary-color-light8)] tw-rounded-l-[10px]",
                                      },
                                      null,
                                      -1,
                                    )),
                                  p("div", z, [
                                    o(
                                      l,
                                      { type: "info", link: "" },
                                      {
                                        default: r(() => [
                                          o(
                                            n,
                                            { size: "20" },
                                            { default: r(() => [o(v)]), _: 1 },
                                          ),
                                        ]),
                                        _: 1,
                                      },
                                    ),
                                  ]),
                                ],
                              ))
                            : (s(),
                              i("div", R, [
                                a[4] ||
                                  (a[4] = p(
                                    "div",
                                    {
                                      class:
                                        "tw-w-[5px] tw-rounded-l-[6px] tw-bg-[var(--primary-color-light8)]",
                                    },
                                    null,
                                    -1,
                                  )),
                                p("div", B, [
                                  p("div", U, [
                                    p(
                                      "div",
                                      null,
                                      c(
                                        d(S)("env.env.step.crux.remainingEnv", {
                                          num:
                                            (q.value.isStart
                                              ? q.value.openEnvNum
                                              : Z.value.openEnvNum) + 1,
                                        }),
                                      ),
                                      1,
                                    ),
                                    p("div", L, [
                                      o(
                                        l,
                                        {
                                          type: "info",
                                          class: "cancel-open-btn",
                                          link: "",
                                          disabled: !Y.value,
                                          onClick: ve,
                                        },
                                        {
                                          default: r(() => [
                                            a[2] ||
                                              (a[2] = p(
                                                "span",
                                                { class: "cancel-open-dot" },
                                                null,
                                                -1,
                                              )),
                                            w(" " + c(d(S)("base.cancel")), 1),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["disabled"],
                                      ),
                                      o(
                                        l,
                                        {
                                          type: "info",
                                          link: "",
                                          onClick:
                                            a[0] ||
                                            (a[0] = (e) => (X.value = !0)),
                                        },
                                        {
                                          default: r(() => [
                                            w(c(d(S)("base.fold")) + " ", 1),
                                            o(n, null, {
                                              default: r(() => [o(t)]),
                                              _: 1,
                                            }),
                                          ]),
                                          _: 1,
                                        },
                                      ),
                                    ]),
                                  ]),
                                  o(
                                    l,
                                    {
                                      class:
                                        "tw-w-full tw-h-[25px] tw-rounded-[2px] tw-mt-[8px] btn-primary-light2 tw-text-[13px]",
                                      type: "primary",
                                    },
                                    {
                                      default: r(() => [
                                        a[3] ||
                                          (a[3] = p(
                                            "i",
                                            {
                                              class:
                                                "iconfont icon-opening dic-animate-spin tw-animate-spin tw-mr-[4px]",
                                            },
                                            null,
                                            -1,
                                          )),
                                        p(
                                          "div",
                                          j,
                                          c(d(S)("rpa.task.logs.openEnv")) +
                                            " " +
                                            c(
                                              `(${q.value.isStart ? q.value.serialNum : Z.value.serialNum})`,
                                            ) +
                                            ": ",
                                          1,
                                        ),
                                        p("div", null, c(W.value), 1),
                                      ]),
                                      _: 1,
                                    },
                                  ),
                                ]),
                              ])),
                        ]),
                        _: 1,
                      },
                    ),
                  ],
                  6,
                ))
              : x("", !0);
          }
        );
      },
    }),
    [["__scopeId", "data-v-332987c6"]],
  );
export { J as default };
