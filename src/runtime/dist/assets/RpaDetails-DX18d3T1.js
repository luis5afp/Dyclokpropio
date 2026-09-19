import {
  d as a,
  hQ as t,
  v as e,
  P as l,
  kb as s,
  r,
  o as n,
  c as o,
  a as c,
  f as i,
  n as u,
  b as w,
  w as d,
  e as p,
  t as v,
  i as x,
  kc as f,
  _ as b,
} from "./index-BUIbb6Pa.js";
const m = { class: "tw-h-full tw-flex tw-flex-col" },
  g = { class: "tw-mb-[9px] tw-text-[14px]" },
  h = {
    class:
      "tw-rounded-[8px] tw-flex tw-flex-col tw-flex-1 tw-h-[0] tw-bg-[var(--table-tr-bg-color)] tw-px-[24px] tw-pt-[24px]",
  },
  _ = {
    class:
      "tw-border-b-[1px] tw-border-[var(--el-component-bg-color)] tw-pb-[24px] b-flex",
  },
  k = { class: "tw-flex tw-items-center" },
  y = ["src"],
  I = { class: "tw-ml-[12px]" },
  L = { class: "tw-flex-1 tw-h-[0]" },
  T = ["innerHTML"],
  q = b(
    a({
      __name: "RpaDetails",
      setup(a) {
        const b = t(),
          q = x();
        let C = x(""),
          { t: H } = e.useI18n();
        async function M() {
          if (!C.value) return;
          let a = await f(C.value);
          u.push({
            path: "/rpa/rpaTaskEdit",
            query: { taskId: a.id, previousRoute: b.name },
          });
        }
        return (
          l(async () => {
            var a;
            ((C.value = (null == (a = b.query) ? void 0 : a.id) ?? ""),
              await (async function (a) {
                q.value = await s(a);
              })(C.value));
          }),
          (a, t) => {
            var e, l;
            const s = r("ArrowLeft"),
              x = r("el-icon"),
              f = r("el-button"),
              b = r("el-scrollbar");
            return (
              n(),
              o("div", m, [
                c("div", g, [
                  c(
                    "div",
                    {
                      class: "tw-flex tw-items-center tw-cursor-pointer",
                      onClick: t[0] || (t[0] = (a) => i(u).go(-1)),
                    },
                    [
                      w(x, null, { default: d(() => [w(s)]), _: 1 }),
                      p(v(i(H)("errorPage.goBack")), 1),
                    ],
                  ),
                ]),
                c("div", h, [
                  c("div", _, [
                    c("div", k, [
                      c(
                        "img",
                        {
                          class: "tw-w-[50px] tw-h-[50px] tw-rounded-[8px]",
                          src: null == (e = q.value) ? void 0 : e.iconUrl,
                        },
                        null,
                        8,
                        y,
                      ),
                      c(
                        "div",
                        I,
                        v(null == (l = q.value) ? void 0 : l.name),
                        1,
                      ),
                    ]),
                    w(
                      f,
                      { type: "primary", onClick: M },
                      { default: d(() => [p(v(i(H)("rpa2.Usage")), 1)]), _: 1 },
                    ),
                  ]),
                  c("div", L, [
                    w(
                      b,
                      { class: "tw-h-full" },
                      {
                        default: d(() => {
                          var a;
                          return [
                            c(
                              "div",
                              {
                                class: "rpa-content",
                                innerHTML:
                                  null == (a = q.value) ? void 0 : a.detail,
                              },
                              null,
                              8,
                              T,
                            ),
                          ];
                        }),
                        _: 1,
                      },
                    ),
                  ]),
                ]),
              ])
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-b2e25452"]],
  );
export { q as default };
