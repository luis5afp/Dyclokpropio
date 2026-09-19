import {
  d as a,
  u as t,
  r as s,
  c as e,
  a as n,
  t as r,
  b as l,
  w as o,
  e as i,
  f as c,
  o as u,
  H as d,
  _ as p,
} from "./index-BUIbb6Pa.js";
const m = "" + new URL("404-IqlIAwtR.png", import.meta.url).href,
  g = { class: "not-container" },
  _ = { class: "not-detail" },
  b = { class: "btn-container" },
  f = p(
    a({
      __name: "404",
      setup(a) {
        const p = t(),
          f = () => {
            p.push(d);
          };
        return (a, t) => {
          const d = s("el-button");
          return (
            u(),
            e("div", g, [
              t[1] ||
                (t[1] = n(
                  "img",
                  { src: m, class: "not-img", alt: "404" },
                  null,
                  -1,
                )),
              n("div", _, [
                t[0] || (t[0] = n("h2", null, "404", -1)),
                n("h4", null, r(a.$t("errorPage.hint404")) + "🤷‍♂️🤷‍♀️", 1),
                n("div", b, [
                  l(
                    d,
                    { type: "primary", onClick: c(p).back },
                    {
                      default: o(() => [
                        i(r(a.$t("errorPage.lastPageBtn")), 1),
                      ]),
                      _: 1,
                    },
                    8,
                    ["onClick"],
                  ),
                  l(
                    d,
                    { type: "primary", onClick: f },
                    {
                      default: o(() => [
                        i(r(a.$t("errorPage.homePageBtn")), 1),
                      ]),
                      _: 1,
                    },
                  ),
                ]),
              ]),
            ])
          );
        };
      },
    }),
    [["__scopeId", "data-v-6e7b083b"]],
  );
export { f as default };
