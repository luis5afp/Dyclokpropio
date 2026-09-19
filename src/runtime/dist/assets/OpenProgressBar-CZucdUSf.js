import {
  d as t,
  r as s,
  o as e,
  h as a,
  w as o,
  a as l,
  c as r,
  F as p,
  z as n,
  O as d,
  C as c,
  _ as i,
} from "./index-BUIbb6Pa.js";
const u = { class: "open-progress-bar" },
  b = i(
    t({
      __name: "OpenProgressBar",
      props: { stepIndex: {}, totalSteps: {}, tooltipText: { default: "" } },
      setup(t) {
        const i = t,
          b = c(() => {
            if (i.totalSteps <= 0) return 0;
            const t = (i.stepIndex + 1) / i.totalSteps;
            return Math.ceil(5 * t);
          });
        return (c, i) => {
          const x = s("el-tooltip");
          return (
            e(),
            a(
              x,
              {
                content: t.tooltipText,
                placement: "top",
                "show-after": 300,
                disabled: !t.tooltipText,
              },
              {
                default: o(() => [
                  l("div", u, [
                    (e(),
                    r(
                      p,
                      null,
                      n(5, (t) =>
                        l(
                          "span",
                          {
                            key: t,
                            class: d([
                              "progress-block",
                              t <= b.value && "progress-block--active",
                            ]),
                          },
                          null,
                          2,
                        ),
                      ),
                      64,
                    )),
                  ]),
                ]),
                _: 1,
              },
              8,
              ["content", "disabled"],
            )
          );
        };
      },
    }),
    [["__scopeId", "data-v-bd7dd7b6"]],
  );
export { b as default };
