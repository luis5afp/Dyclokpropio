import {
  d as t,
  r as e,
  o as r,
  c as w,
  a as o,
  b as a,
  w as s,
  f as l,
  jq as i,
  t as p,
  h as n,
  e as x,
  X as d,
  F as c,
  z as m,
} from "./index-BUIbb6Pa.js";
const b = {
    class:
      "tw-relative tw-flex tw-w-full tw-max-w-[760px] tw-flex-col tw-items-center tw-overflow-hidden tw-rounded-xl tw-border tw-border-[var(--border-color-light4)] tw-bg-[var(--bg-base)] tw-px-5 tw-pb-6 tw-pt-7 tw-text-center tw-text-[var(--text-color-base)] tw-shadow-[0_8px_28px_rgb(31_55_93_/_6%)] before:tw-absolute before:-tw-left-7 before:-tw-top-[52px] before:tw-h-[86px] before:tw-w-[86px] before:tw-rounded-full before:tw-border before:tw-border-[var(--primary-color-light4)] before:tw-content-[''] after:tw-absolute after:-tw-bottom-[58px] after:-tw-right-9 after:tw-h-[86px] after:tw-w-[86px] after:tw-rounded-full after:tw-border after:tw-border-[var(--primary-color-light4)] after:tw-content-[''] md:tw-px-[38px] md:tw-pb-[30px] md:tw-pt-[34px]",
  },
  f = {
    class:
      "tw-flex tw-h-[58px] tw-w-[58px] tw-items-center tw-justify-center tw-rounded-2xl tw-border tw-border-[var(--primary-color-light3)] tw-bg-[var(--primary-color-light7)] tw-text-[var(--primary-color)] tw-shadow-[0_7px_16px_rgb(64_103_242_/_12%)]",
    "aria-hidden": "true",
  },
  u = {
    class:
      "tw-mt-4 tw-text-[17px] tw-font-semibold tw-leading-6 tw-text-[var(--text-color-base)]",
  },
  h = {
    class:
      "tw-mt-[6px] tw-max-w-[520px] tw-text-[13px] tw-leading-5 tw-text-[var(--text-color-light2)]",
  },
  g = {
    key: 1,
    class:
      "tw-mt-7 tw-grid tw-w-auto tw-grid-cols-1 tw-items-center tw-justify-items-start tw-gap-3 tw-border-t tw-border-dashed tw-border-[var(--border-color-light4)] tw-pt-[22px] md:tw-w-full md:tw-grid-cols-[auto_minmax(24px,72px)_auto_minmax(24px,72px)_auto] md:tw-justify-items-stretch md:tw-gap-0",
  },
  _ = {
    class:
      "tw-inline-flex tw-min-w-0 tw-items-center tw-justify-center tw-gap-2 tw-whitespace-nowrap tw-text-[13px] tw-text-[var(--text-color-base)]",
  },
  v = {
    class:
      "tw-inline-flex tw-h-6 tw-w-6 tw-flex-none tw-items-center tw-justify-center tw-rounded-full tw-bg-[var(--primary-color-light7)] tw-text-xs tw-font-semibold tw-text-[var(--primary-color)]",
  },
  y = {
    key: 0,
    class:
      "tw-mx-3 tw-hidden tw-h-px tw-bg-[var(--border-color-light4)] md:tw-block",
    "aria-hidden": "true",
  },
  j = t({
    __name: "IpResourceEmptyState",
    props: {
      title: {},
      description: {},
      actionText: {},
      steps: {},
      showAction: { type: Boolean, default: !0 },
    },
    emits: ["action"],
    setup(t, { emit: j }) {
      const k = j;
      return (j, z) => {
        const A = e("el-icon"),
          T = e("el-button");
        return (
          r(),
          w("div", b, [
            o("div", f, [
              a(A, { size: 30 }, { default: s(() => [a(l(i))]), _: 1 }),
            ]),
            o("h3", u, p(t.title), 1),
            o("p", h, p(t.description), 1),
            t.showAction
              ? (r(),
                n(
                  T,
                  {
                    key: 0,
                    type: "primary",
                    class: "tw-mt-5 tw-min-w-[136px]",
                    onClick: z[0] || (z[0] = (t) => k("action")),
                  },
                  { default: s(() => [x(p(t.actionText), 1)]), _: 1 },
                ))
              : d("", !0),
            t.steps.length
              ? (r(),
                w("div", g, [
                  (r(!0),
                  w(
                    c,
                    null,
                    m(
                      t.steps,
                      (e, a) => (
                        r(),
                        w(
                          c,
                          { key: e },
                          [
                            o("div", _, [
                              o("span", v, p(a + 1), 1),
                              o("span", null, p(e), 1),
                            ]),
                            a < t.steps.length - 1
                              ? (r(), w("span", y))
                              : d("", !0),
                          ],
                          64,
                        )
                      ),
                    ),
                    128,
                  )),
                ]))
              : d("", !0),
          ])
        );
      };
    },
  });
export { j as _ };
