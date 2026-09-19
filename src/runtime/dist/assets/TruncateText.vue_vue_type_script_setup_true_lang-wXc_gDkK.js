import {
  d as e,
  P as t,
  hP as a,
  g as s,
  r as n,
  c as l,
  b as i,
  aJ as r,
  w as c,
  a as o,
  O as d,
  f as u,
  ai as w,
  C as m,
  i as p,
  e as v,
  t as f,
  ac as b,
  o as x,
} from "./index-BUIbb6Pa.js";
const h = { class: "tw-w-full tw-min-w-0" },
  _ = { class: "tw-text-[var(--text-color-base)]" },
  z = e({
    __name: "TruncateText",
    props: { lineNumber: { default: 2 }, content: { default: "" } },
    setup(e) {
      let z = e,
        $ = m(
          () =>
            ({
              1: "tw-line-clamp-1",
              2: "tw-line-clamp-2",
              3: "tw-line-clamp-3",
              4: "tw-line-clamp-4",
              5: "tw-line-clamp-5",
            })[z.lineNumber] || "",
        );
      const g = p(),
        A = p(!1);
      let F = null,
        O = 0;
      const R = () => {
        (O && cancelAnimationFrame(O),
          (O = requestAnimationFrame(() => {
            ((O = 0),
              (async () => {
                await b();
                const e = g.value;
                if (!e) return;
                const t =
                  e.scrollWidth > e.clientWidth ||
                  e.scrollHeight > e.clientHeight;
                A.value !== t && (A.value = t);
              })());
          })));
      };
      return (
        t(() => {
          (R(),
            window.ResizeObserver &&
              g.value &&
              ((F = new ResizeObserver(() => {
                R();
              })),
              F.observe(g.value)),
            window.addEventListener("resize", R));
        }),
        a(() => {
          R();
        }),
        s(() => {
          (O && cancelAnimationFrame(O),
            null == F || F.disconnect(),
            window.removeEventListener("resize", R));
        }),
        (t, a) => {
          const s = n("el-tooltip");
          return (
            x(),
            l("div", h, [
              i(
                s,
                r(
                  {
                    disabled: !A.value,
                    effect: "dark",
                    placement: "top",
                    "popper-class": "!tw-max-w-[300px]",
                  },
                  t.$attrs,
                ),
                {
                  content: c(() => [
                    o("div", _, [
                      w(t.$slots, "default", {}, () => [v(f(e.content), 1)]),
                    ]),
                  ]),
                  default: c(() => [
                    o(
                      "div",
                      { ref_key: "textRef", ref: g, class: d(`${u($)}`) },
                      [w(t.$slots, "default", {}, () => [v(f(e.content), 1)])],
                      2,
                    ),
                  ]),
                  _: 3,
                },
                16,
                ["disabled"],
              ),
            ])
          );
        }
      );
    },
  });
export { z as _ };
