import {
  d as e,
  G as a,
  v as t,
  R as s,
  ad as l,
  i as n,
  eS as i,
  eT as o,
  o as r,
  c as u,
  a as v,
  b as d,
  f as m,
  eU as p,
  e as c,
  t as f,
  X as L,
  C as E,
  be as b,
  ah as S,
  _ as y,
} from "./index-BUIbb6Pa.js";
import _ from "./envSegmentedTabs-B8OKb7JK.js";
const I = { class: "env-list-top" },
  x = { class: "tw-flex tw-justify-between" },
  w = {
    key: 0,
    class:
      "tw-flex tw-text-[13px] tw-text-[var(--primary-text-color)] tw-h-[36px] tw-items-center",
  },
  A = { class: "tw-mr-[12px]" },
  R = { class: "tw-text-[var(--primary-color)]" },
  g = { class: "tw-text-[var(--primary-color)]" },
  h = y(
    e({
      __name: "envListTop",
      props: { summary: {}, filters: {}, disabled: { type: Boolean } },
      emits: ["tab:click", "batch:click", "deselect"],
      setup(e, { emit: y }) {
        const h = a();
        let { t: T } = t.useI18n(),
          N = e,
          V = y;
        const { currentPlanConfig: k } = s(l());
        (n(i.ALL), (N.filters.operateStatus = i.ALL), o(N.filters));
        const C = E(() =>
          [
            { value: i.ALL, label: T("rpaMarket.tip7") },
            b(S.VIEW_OPENED_PROFILE) && {
              value: i.ENABLED,
              label: T("env.env.opening"),
            },
            b(S.SHARE_ENVIRONMENTAL_LIST) && {
              label: T("env.env.shareMe"),
              value: i.SHARE,
            },
            b(S.VIEW_SHARED_PROFILES) && {
              value: i.MY_SHARE,
              label: T("env.env.myShare"),
            },
            b(S.RESTORE_LIST) && {
              value: i.RECYCLING_BIN,
              label: T("menu.env.envTrash"),
            },
          ].filter(Boolean),
        );
        function M() {
          V("tab:click", N.filters.operateStatus);
        }
        return (a, t) => {
          var s, l, n, i;
          return (
            r(),
            u("div", I, [
              v("div", x, [
                d(
                  _,
                  {
                    modelValue: e.filters.operateStatus,
                    "onUpdate:modelValue":
                      t[0] || (t[0] = (a) => (e.filters.operateStatus = a)),
                    options: C.value,
                    disabled: e.disabled,
                    onChange: M,
                  },
                  null,
                  8,
                  ["modelValue", "options", "disabled"],
                ),
                m(h).userInfo.authority === m(p).SuperAdmin ||
                m(h).userInfo.authority === m(p).Admin
                  ? (r(),
                    u("div", w, [
                      v("div", A, [
                        c(f(m(T)("env.env.usage.used")), 1),
                        v(
                          "span",
                          R,
                          f(
                            (null == (s = e.summary) ? void 0 : s.envUsage) ??
                              0,
                          ),
                          1,
                        ),
                        c(
                          "/" +
                            f(
                              m(k).envLimit < 0
                                ? m(T)("cost.plan.dialog.unlimited")
                                : ((null == (l = e.summary)
                                    ? void 0
                                    : l.envLimit) ?? 0),
                            ),
                          1,
                        ),
                      ]),
                      v("div", null, [
                        c(f(m(T)(m(T)("env.env.usage.opened"))), 1),
                        v(
                          "span",
                          g,
                          f(
                            (null == (n = e.summary) ? void 0 : n.openUsage) ??
                              0,
                          ),
                          1,
                        ),
                        c(
                          "/" +
                            f(
                              m(k).openLimit < 0
                                ? m(T)("cost.plan.dialog.unlimited")
                                : ((null == (i = e.summary)
                                    ? void 0
                                    : i.openLimit) ?? 0),
                            ),
                          1,
                        ),
                      ]),
                    ]))
                  : L("", !0),
              ]),
            ])
          );
        };
      },
    }),
    [["__scopeId", "data-v-03a33a22"]],
  );
export { h as default };
