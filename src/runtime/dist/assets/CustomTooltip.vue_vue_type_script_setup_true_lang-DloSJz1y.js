import {
  d as e,
  r as t,
  o as s,
  h as o,
  w as a,
  a as l,
  t as r,
  i,
} from "./index-BUIbb6Pa.js";
const n = { class: "tw-max-w-[300px] tw-text-textColor-700" },
  p = { class: "tw-relative tw-text-[14px] tw-overflow-hidden" },
  c = e({
    __name: "CustomTooltip",
    props: { desc: { type: String, default: "" } },
    setup(e) {
      const c = e,
        w = i(),
        d = i(),
        u = i(!1),
        f = () => {
          const e = w.value,
            t = d.value,
            s = e.offsetHeight,
            o = t.offsetHeight;
          u.value = s < o;
        },
        v = () => {
          u.value = !1;
        };
      return (e, i) => {
        const x = t("el-tooltip");
        return (
          s(),
          o(
            x,
            {
              visible: u.value,
              "onUpdate:visible": i[0] || (i[0] = (e) => (u.value = e)),
              "hide-after": 0,
              placement: "top",
              trigger: "click",
            },
            {
              content: a(() => [l("div", n, r(c.desc), 1)]),
              default: a(() => [
                l("div", p, [
                  l(
                    "div",
                    {
                      class:
                        "tw-mt-1 group-hover:tw-underline tw-line-clamp-2 tw-leading-1.5 tw-font-normal tw-text-subText",
                      onMouseenter: f,
                      onMouseleave: v,
                    },
                    [l("p", { ref_key: "pref", ref: w }, r(c.desc), 513)],
                    32,
                  ),
                  l(
                    "p",
                    {
                      ref_key: "copyPref",
                      ref: d,
                      class:
                        "tw-absolute tw-top-[-99999999px] tw-opacity-0 z-[-99] tw-leading-1.5 tw-font-normal",
                    },
                    r(c.desc),
                    513,
                  ),
                ]),
              ]),
              _: 1,
            },
            8,
            ["visible"],
          )
        );
      };
    },
  });
export { c as _ };
