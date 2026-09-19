import {
  d as t,
  v as e,
  r as i,
  o as l,
  c as a,
  a as r,
  b as s,
  f as w,
  t as o,
  F as c,
  z as n,
  w as p,
  h as x,
  Y as d,
  e as m,
  jj as u,
  X as g,
  C as f,
  jk as v,
  jl as b,
  jm as h,
} from "./index-BUIbb6Pa.js";
const y = {
    class:
      "tw-w-full tw-px-4 tw-pb-[30px] tw-pt-5 tw-text-[var(--text-color-base)]",
  },
  _ = { class: "tw-mx-auto tw-w-full" },
  R = { class: "tw-pt-6" },
  j = {
    class:
      "tw-text-base tw-font-semibold tw-leading-6 tw-text-[var(--text-color-base)]",
  },
  T = {
    class:
      "tw-mx-auto tw-mt-6 tw-grid tw-max-w-[980px] tw-grid-cols-1 tw-items-center tw-gap-5 lg:tw-grid-cols-[minmax(220px,1fr)_72px_minmax(220px,1fr)_72px_minmax(220px,1fr)] lg:tw-gap-0",
  },
  D = {
    class: "tw-flex tw-min-w-0 tw-flex-col tw-items-center tw-text-center",
  },
  U = {
    class:
      "tw-flex tw-h-16 tw-w-16 tw-items-center tw-justify-center tw-text-[var(--text-color-base)]",
  },
  k = {
    class:
      "tw-mt-3 tw-flex tw-items-center tw-gap-2 tw-text-sm tw-font-semibold tw-leading-[22px] tw-text-[var(--text-color-base)]",
  },
  z = {
    class:
      "tw-inline-flex tw-h-[22px] tw-w-[22px] tw-items-center tw-justify-center tw-rounded-full tw-bg-[var(--primary-color)] tw-text-xs tw-text-[var(--text-color-white)]",
  },
  C = {
    class:
      "tw-mt-[6px] tw-text-[13px] tw-leading-5 tw-text-[var(--text-color-light2)]",
  },
  B = {
    key: 0,
    class:
      "tw-mt-[30px] tw-hidden tw-w-full tw-items-center tw-self-start tw-text-[var(--border-color-light2)] lg:tw-flex",
    "aria-hidden": "true",
  },
  G = {
    class:
      "tw-mt-7 tw-rounded-lg tw-border tw-border-[var(--primary-color-light4)] tw-bg-[var(--primary-color-light7)] tw-px-[18px] tw-py-[14px]",
  },
  I = { class: "tw-text-sm tw-font-semibold tw-text-[var(--text-color-base)]" },
  M = {
    class:
      "tw-mt-[10px] tw-pl-5 tw-text-[13px] tw-leading-6 tw-text-[var(--text-color-light2)]",
  },
  E = t({
    __name: "DynamicIpEmptyGuide",
    setup(t) {
      const { t: E } = e.useI18n(),
        F = f(() => [
          {
            icon: v,
            title: E("ipResource.guideCreate"),
            description: E("ipResource.guideCreateDescription"),
          },
          {
            icon: b,
            title: E("ipResource.guideManage"),
            description: E("ipResource.guideManageDescription"),
          },
          {
            icon: h,
            title: E("ipResource.guideBind"),
            description: E("ipResource.guideBindDescription"),
          },
        ]);
      return (t, e) => {
        const f = i("el-alert"),
          v = i("el-icon");
        return (
          l(),
          a("div", y, [
            r("div", _, [
              s(
                f,
                {
                  class:
                    "tw-min-h-[44px] tw-rounded-md tw-border tw-border-[var(--primary-color-light4)] !tw-bg-[var(--primary-color-light7)] tw-px-[14px] tw-py-[10px] [&_.el-alert__icon]:tw-text-[var(--primary-color)] [&_.el-alert__title]:tw-text-[13px] [&_.el-alert__title]:tw-text-[var(--text-color-base)]",
                  title: w(E)("ipResource.dynamicTrafficSharedHint"),
                  type: "info",
                  closable: !1,
                  "show-icon": "",
                },
                null,
                8,
                ["title"],
              ),
              r("div", R, [
                r("h3", j, o(w(E)("ipResource.dynamicGuideTitle")), 1),
                r("div", T, [
                  (l(!0),
                  a(
                    c,
                    null,
                    n(
                      F.value,
                      (t, i) => (
                        l(),
                        a(
                          c,
                          { key: t.title },
                          [
                            r("div", D, [
                              r("div", U, [
                                s(
                                  v,
                                  { size: 42 },
                                  {
                                    default: p(() => [(l(), x(d(t.icon)))]),
                                    _: 2,
                                  },
                                  1024,
                                ),
                              ]),
                              r("div", k, [
                                r("span", z, o(i + 1), 1),
                                m(" " + o(t.title), 1),
                              ]),
                              r("p", C, o(t.description), 1),
                            ]),
                            i < F.value.length - 1
                              ? (l(),
                                a("div", B, [
                                  e[0] ||
                                    (e[0] = r(
                                      "span",
                                      {
                                        class:
                                          "tw-h-px tw-flex-1 tw-bg-[var(--border-color-light3)]",
                                      },
                                      null,
                                      -1,
                                    )),
                                  s(
                                    v,
                                    { class: "tw-mx-[7px]", size: 20 },
                                    { default: p(() => [s(w(u))]), _: 1 },
                                  ),
                                  e[1] ||
                                    (e[1] = r(
                                      "span",
                                      {
                                        class:
                                          "tw-h-px tw-flex-1 tw-bg-[var(--border-color-light3)]",
                                      },
                                      null,
                                      -1,
                                    )),
                                ]))
                              : g("", !0),
                          ],
                          64,
                        )
                      ),
                    ),
                    128,
                  )),
                ]),
                r("div", G, [
                  r("h4", I, o(w(E)("ipResource.dynamicUsageTips")), 1),
                  r("ul", M, [
                    r(
                      "li",
                      null,
                      o(w(E)("ipResource.dynamicUsageTipTraffic")),
                      1,
                    ),
                    r(
                      "li",
                      null,
                      o(w(E)("ipResource.dynamicUsageTipUnbind")),
                      1,
                    ),
                  ]),
                ]),
              ]),
            ]),
          ])
        );
      };
    },
  });
export { E as _ };
