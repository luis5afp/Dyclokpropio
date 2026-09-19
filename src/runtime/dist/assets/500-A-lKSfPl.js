import {
  d as a,
  u as t,
  r as e,
  c as s,
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
const m = "" + new URL("500-PHeLT8Ul.png", import.meta.url).href,
  g = { class: "not-container" },
  f = { class: "not-detail" },
  _ = { class: "btn-container" },
  h = p(
    a({
      __name: "500",
      setup(a) {
        const p = t(),
          h = () => {
            p.push(d);
          };
        return (a, t) => {
          const d = e("el-button");
          return (
            u(),
            s("div", g, [
              t[1] ||
                (t[1] = n(
                  "img",
                  { src: m, class: "not-img", alt: "500" },
                  null,
                  -1,
                )),
              n("div", f, [
                t[0] || (t[0] = n("h2", null, "500", -1)),
                n("h4", null, r(a.$t("errorPage.hint500")) + "🤦‍♂️🤦‍♀️", 1),
                n("div", _, [
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
                    { type: "primary", onClick: h },
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
    [["__scopeId", "data-v-bf376e20"]],
  );
export { h as default };
