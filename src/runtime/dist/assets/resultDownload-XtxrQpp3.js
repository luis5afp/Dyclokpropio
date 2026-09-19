import { f as e } from "./config-52pM5gru.js";
import {
  d as s,
  r as t,
  o as a,
  h as l,
  w as n,
  a as o,
  O as r,
  b as c,
  c as d,
  F as i,
  z as u,
  e as w,
  t as m,
  f as p,
  i as f,
  C as k,
} from "./index-BUIbb6Pa.js";
const b = s({
  __name: "resultDownload",
  props: { result: {} },
  setup(s) {
    const b = s,
      j = f(!1),
      x = k(() =>
        Object.keys(b.result).filter(
          (e) => void 0 !== b.result[e] && null !== b.result[e],
        ),
      );
    return (s, f) => {
      const k = t("el-dropdown-item"),
        g = t("el-dropdown-menu"),
        h = t("el-dropdown");
      return (
        a(),
        l(
          h,
          {
            trigger: "click",
            onVisibleChange: f[0] || (f[0] = (e) => (j.value = e)),
          },
          {
            dropdown: n(() => [
              c(
                g,
                { class: "tw-w-40" },
                {
                  default: n(() => [
                    (a(!0),
                    d(
                      i,
                      null,
                      u(
                        x.value,
                        (s) => (
                          a(),
                          l(
                            k,
                            {
                              key: s,
                              onClick: (e) =>
                                ((e) => {
                                  const s = b.result[e];
                                  let t = null,
                                    a = "";
                                  switch (e) {
                                    case "markdown":
                                    case "html":
                                    case "rawHtml":
                                      ((t = new Blob([s], {
                                        type: "text/markdown",
                                      })),
                                        (a = `${e}.md`));
                                      break;
                                    case "json":
                                    case "metadata":
                                    case "links":
                                      ((t = new Blob(
                                        [JSON.stringify(s, null, 2)],
                                        { type: "application/json" },
                                      )),
                                        (a = `${e}.json`));
                                  }
                                  if (t) {
                                    const e = URL.createObjectURL(t),
                                      s = document.createElement("a");
                                    ((s.href = e), (s.download = a), s.click());
                                  }
                                })(s),
                            },
                            { default: n(() => [w(m(p(e)(s)), 1)]), _: 2 },
                            1032,
                            ["onClick"],
                          )
                        ),
                      ),
                      128,
                    )),
                  ]),
                  _: 1,
                },
              ),
            ]),
            default: n(() => [
              o(
                "span",
                {
                  class: r(
                    "tw-text-[14px] tw-text-[#808080] " +
                      (j.value ? "!tw-text-main" : ""),
                  ),
                },
                "Download Results",
                2,
              ),
            ]),
            _: 1,
          },
        )
      );
    };
  },
});
export { b as default };
