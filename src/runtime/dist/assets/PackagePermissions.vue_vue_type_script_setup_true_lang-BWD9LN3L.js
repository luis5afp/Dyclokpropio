import {
  d as t,
  R as e,
  ad as o,
  v as r,
  r as l,
  o as d,
  c as a,
  a as w,
  t as i,
  b as s,
  w as n,
  f as x,
  F as c,
  z as p,
  O as v,
  C as b,
} from "./index-BUIbb6Pa.js";
const u = { class: "tw-w-[100%]" },
  f = { class: "tw-text-[16px] tw-pb-[10px]" },
  g = {
    class: "tw-flex tw-rounded-tl-[8px] tw-rounded-tr-[8px] tw-overflow-hidden",
  },
  h = {
    class:
      "tw-bg-[var(--el-fill-color-extra--high-light)] tw-px-[15px] tw-h-[60px] tw-text-[var(--text-color-base)] tw-w-[150px] tw-flex tw-items-center",
  },
  m = { class: "tw-flex tw-shrink-0 tw-w-fit" },
  C = { class: "tw-w- tw-text-[14px]" },
  I = {
    class:
      "tw-max-w-[150px] tw-text-[var(--text-color-base)] tw-px-[15px] tw-border-b-[1px] tw-border-[var(--dropdown-divided-br-color)] tw-border-solid tw-h-[60px] tw-flex tw-items-center",
  },
  k = {
    class:
      "tw-max-w-[150px] tw-text-[var(--text-color-base)] tw-px-[15px] tw-border-b-[1px] tw-border-[var(--dropdown-divided-br-color)] tw-border-solid tw-h-[60px] tw-flex tw-items-center",
  },
  L = {
    class:
      "tw-text-[var(--text-color-base)] tw-w-[120px] tw-px-[10px] c-flex tw-border-b-[1px] tw-border-[var(--dropdown-divided-br-color)] tw-border-solid tw-h-[60px]",
  },
  N = {
    class:
      "tw-text-[var(--text-color-base)] tw-w-[120px] tw-px-[10px] c-flex tw-border-b-[1px] tw-border-[var(--dropdown-divided-br-color)] tw-border-solid tw-h-[60px]",
  },
  _ = t({
    __name: "PackagePermissions",
    props: { id: {}, name: {}, customShowListIds: {} },
    setup(t) {
      let { planDataList: _, defaultPaidModuleList: y } = e(o()),
        { t: O } = r.useI18n(),
        S = t;
      const P = b(() => {
        const t = _.value.planConfigList || [];
        return S.customShowListIds && S.customShowListIds.length > 0
          ? t.filter((t) => {
              var e;
              return null == (e = S.customShowListIds)
                ? void 0
                : e.includes(t.planConfigId);
            })
          : t;
      });
      function $(t, e) {
        var o;
        return ((null == (o = e.authConfig) ? void 0 : o.moduleIds) || []).find(
          (e) => e === t,
        );
      }
      return (e, o) => {
        const r = l("el-scrollbar");
        return (
          d(),
          a("div", u, [
            w("div", f, i(t.name), 1),
            s(
              r,
              { "view-class": "tw-w-fit" },
              {
                default: n(() => [
                  w("div", g, [
                    w("div", h, i(x(O)("cost.plan.dialog.interest")), 1),
                    (d(!0),
                    a(
                      c,
                      null,
                      p(
                        P.value,
                        (e) => (
                          d(),
                          a(
                            "div",
                            {
                              key: e.planConfigId,
                              class: v(
                                `tw-w-[120px] tw-text-[var(--text-color-base)] ${t.id == e.planConfigId ? "tw-bg-[var(--table-hover-bg-color)]" : "tw-bg-[var(--el-fill-color-extra--high-light)]"} tw-bg-[var(--el-fill-color-extra--high-light)] tw-text-center tw-h-[60px] tw-leading-[60px] tw-px-[15px]`,
                              ),
                            },
                            i(e.name),
                            3,
                          )
                        ),
                      ),
                      128,
                    )),
                  ]),
                  s(
                    r,
                    {
                      height: "400",
                      "view-class": "tw-flex",
                      class:
                        "tw-bg-[var(--table-tr-bg-color)] tw-rounded-bl-[8px] tw-rounded-br-[8px]",
                    },
                    {
                      default: n(() => [
                        w("div", m, [
                          w("div", C, [
                            w(
                              "div",
                              I,
                              i(x(O)("cost.plan.dialog.extensionNumber")),
                              1,
                            ),
                            w(
                              "div",
                              k,
                              i(x(O)("cost.plan.card.rpaOpenNum")),
                              1,
                            ),
                            (d(!0),
                            a(
                              c,
                              null,
                              p(
                                x(y),
                                (t) => (
                                  d(),
                                  a(
                                    "div",
                                    {
                                      class:
                                        "tw-w-[150px] tw-text-[var(--text-color-base)] tw-px-[15px] tw-border-b-[1px] tw-border-[var(--dropdown-divided-br-color)] tw-border-solid tw-h-[60px] tw-flex tw-items-center",
                                      key: t.id,
                                    },
                                    i(t.name),
                                    1,
                                  )
                                ),
                              ),
                              128,
                            )),
                          ]),
                          (d(!0),
                          a(
                            c,
                            null,
                            p(P.value, (e) => {
                              var o, r, l;
                              return (
                                d(),
                                a(
                                  "div",
                                  {
                                    key: e.planConfigId,
                                    class: v(
                                      t.id == e.planConfigId &&
                                        "tw-bg-[var(--table-hover-bg-color)]",
                                    ),
                                  },
                                  [
                                    w(
                                      "div",
                                      L,
                                      i(
                                        null ==
                                          (o =
                                            null == e ? void 0 : e.authConfig)
                                          ? void 0
                                          : o.extendNum,
                                      ),
                                      1,
                                    ),
                                    w(
                                      "div",
                                      N,
                                      i(
                                        -1 ===
                                          (null ==
                                          (r =
                                            null == e ? void 0 : e.authConfig)
                                            ? void 0
                                            : r.rpaOpenNum)
                                          ? x(O)("cost.plan.dialog.unlimited")
                                          : ((null ==
                                            (l =
                                              null == e ? void 0 : e.authConfig)
                                              ? void 0
                                              : l.rpaOpenNum) ?? 0),
                                      ),
                                      1,
                                    ),
                                    (d(!0),
                                    a(
                                      c,
                                      null,
                                      p(
                                        x(y),
                                        (t) => (
                                          d(),
                                          a(
                                            "div",
                                            {
                                              key: t.id,
                                              class:
                                                "tw-text-[var(--text-color-base)] c-flex tw-px-[5px] tw-border-b-[1px] tw-border-[var(--dropdown-divided-br-color)] tw-border-solid tw-h-[60px]",
                                            },
                                            [
                                              w(
                                                "div",
                                                {
                                                  class: v(
                                                    `tw-w-[16px] tw-h-[16px] tw-rounded-[50%] tw-leading-[16px] ${$(t.id, e) ? "tw-bg-[var(--icon-success-color)]" : "tw-bg-[var(--icon-fail-color)]"} c-flex`,
                                                  ),
                                                },
                                                [
                                                  w(
                                                    "i",
                                                    {
                                                      class: v(
                                                        `iconfont ${$(t.id, e) ? "icon-check" : "icon-fail"}  tw-text-[14px] tw-text-[var(--text-color-white)]`,
                                                      ),
                                                    },
                                                    null,
                                                    2,
                                                  ),
                                                ],
                                                2,
                                              ),
                                            ],
                                          )
                                        ),
                                      ),
                                      128,
                                    )),
                                  ],
                                  2,
                                )
                              );
                            }),
                            128,
                          )),
                        ]),
                      ]),
                      _: 1,
                    },
                  ),
                ]),
                _: 1,
              },
            ),
          ])
        );
      };
    },
  });
export { _ };
