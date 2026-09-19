import a from "./crawlerMarketCard-D9mhIOow.js";
import {
  d as r,
  v as t,
  R as e,
  Q as s,
  P as l,
  r as w,
  f as o,
  o as c,
  c as d,
  a as p,
  t as i,
  b as x,
  w as n,
  F as m,
  z as b,
  h as f,
  X as u,
  i as v,
} from "./index-BUIbb6Pa.js";
const g = { key: 0, class: "tw-mt-[12px] tw-relative" },
  k = { class: "tw-text-[14px] tw-mb-[12px]" },
  _ = {
    class:
      "tw-border tw-border-[var(--border-color-base)] tw-rounded-xl tw-overflow-hidden tw-bg-[var(--card-bg-color)] tw-px-[8px] tw-py-[16px]",
  },
  y = r({
    __name: "crawlerMarket",
    setup(r) {
      let { t: y } = t.useI18n(),
        h = v(),
        { crawlerMarketList: M } = e(s());
      return (
        l(() => {
          s().getCrawlerMarketList();
        }),
        (r, t) => {
          const e = w("el-scrollbar");
          return o(M).length
            ? (c(),
              d("div", g, [
                p("div", k, i(o(y)("crawler.recommended_template")), 1),
                p("div", _, [
                  x(
                    e,
                    {
                      always: "",
                      class: "tw-h-[calc(110px*3+12px*2)] tw-px-[16px]",
                    },
                    {
                      default: n(() => [
                        p(
                          "div",
                          {
                            class:
                              "tw-grid tw-grid-cols-4 tw-gap-[12px] tw-w-full",
                            ref_key: "scrollbarRef",
                            ref: h,
                          },
                          [
                            (c(!0),
                            d(
                              m,
                              null,
                              b(
                                o(M),
                                (r) => (
                                  c(),
                                  f(a, { item: r, key: r.id }, null, 8, [
                                    "item",
                                  ])
                                ),
                              ),
                              128,
                            )),
                          ],
                          512,
                        ),
                      ]),
                      _: 1,
                    },
                  ),
                ]),
              ]))
            : u("", !0);
        }
      );
    },
  });
export { y as _ };
