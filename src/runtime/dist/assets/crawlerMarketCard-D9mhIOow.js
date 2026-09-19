import {
  d as t,
  v as e,
  Q as a,
  P as r,
  ac as l,
  r as s,
  o as i,
  c,
  a as o,
  h as n,
  w as p,
  t as m,
  D as w,
  E as x,
  A as d,
  ad as f,
  ae as u,
  af as v,
  i as k,
  _,
} from "./index-BUIbb6Pa.js";
import { s as y } from "./util-Cx7pBhYb.js";
const h = { class: "tw-flex tw-items-center" },
  C = ["src"],
  b = _(
    t({
      __name: "crawlerMarketCard",
      props: { item: {} },
      emits: ["runCard"],
      setup(t, { emit: _ }) {
        let { t: b } = e.useI18n(),
          g = a(),
          R = t;
        function H() {
          var t;
          (w.api.trackEvent({
            type: d.OTHER_CLICK,
            action: x.CLICK_ADD_CRAWLER,
            params: { type: "crawl", id: R.item.id, name: R.item.name },
          }),
            f().isFree
              ? u()
              : ((null == (t = f().currentPlan) ? void 0 : t.timeLimit) ?? 0) <
                  0
                ? v()
                : ((g.editCrawlerMarketCard = R.item), y()));
        }
        const D = k(null),
          E = k(!1),
          I = k(null),
          L = k(!1);
        return (
          r(() => {
            l(() => {
              const t = D.value,
                e = I.value;
              (t && (E.value = t.scrollHeight > t.offsetHeight),
                e && (L.value = e.scrollHeight > e.offsetHeight));
            });
          }),
          (e, a) => {
            const r = s("el-tooltip");
            return (
              i(),
              c(
                "div",
                {
                  class:
                    "card-wrapper tw-rounded-[8px] tw-h-[110px] tw-cursor-pointer tw-border tw-border-[var(--el-border-color-light)] tw-p-[12px] tw-flex tw-flex-col tw-justify-between hover:tw-border-[var(--primary-color)]",
                  style: { flex: "0 0 calc(25% - 12px)" },
                  onClick: H,
                },
                [
                  o("div", h, [
                    o(
                      "img",
                      {
                        class: "tw-w-[40px] tw-rounded-[8px]",
                        src: t.item.iconUrl,
                      },
                      null,
                      8,
                      C,
                    ),
                    L.value
                      ? (i(),
                        n(
                          r,
                          {
                            key: 0,
                            effect: "dark",
                            content: t.item.name,
                            placement: "top",
                            "popper-class": "!tw-max-w-[300px]",
                          },
                          {
                            default: p(() => [
                              o(
                                "div",
                                {
                                  ref_key: "textRef2",
                                  ref: I,
                                  class:
                                    "tw-line-clamp-2 tw-ml-[10px] tw-text-[14px]",
                                },
                                m(t.item.name),
                                513,
                              ),
                            ]),
                            _: 1,
                          },
                          8,
                          ["content"],
                        ))
                      : (i(),
                        c(
                          "div",
                          {
                            key: 1,
                            ref_key: "textRef2",
                            ref: I,
                            class:
                              "tw-line-clamp-2 tw-ml-[10px] tw-text-[14px]",
                          },
                          m(t.item.name),
                          513,
                        )),
                  ]),
                  E.value
                    ? (i(),
                      n(
                        r,
                        {
                          key: 0,
                          effect: "dark",
                          content: t.item.introduce,
                          placement: "top",
                          "popper-class": "!tw-max-w-[300px]",
                        },
                        {
                          default: p(() => [
                            o(
                              "div",
                              {
                                ref_key: "textRef",
                                ref: D,
                                class:
                                  "tw-line-clamp-3 tw-flex-1 tw-text-[12px] tw-text-[var(--text-color-light1)] tw-mt-[8px]",
                              },
                              m(t.item.introduce),
                              513,
                            ),
                          ]),
                          _: 1,
                        },
                        8,
                        ["content"],
                      ))
                    : (i(),
                      c(
                        "div",
                        {
                          key: 1,
                          ref_key: "textRef",
                          ref: D,
                          class:
                            "tw-line-clamp-3 tw-flex-1 tw-text-[12px] tw-text-[var(--text-color-light1)] tw-mt-[8px]",
                        },
                        m(t.item.introduce),
                        513,
                      )),
                ],
              )
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-32b8bb20"]],
  );
export { b as default };
