import {
  d as e,
  r as t,
  o as a,
  h as n,
  w as o,
  a as l,
  y as s,
  t as i,
  C as p,
  g6 as d,
  _ as u,
} from "./index-BUIbb6Pa.js";
const m = u(
  e({
    __name: "nameIdCell",
    props: {
      name: {},
      id: {},
      nameSuffix: {},
      idLabel: { default: "ID" },
      emptyText: { default: "--" },
      tooltipContent: {},
      copyContent: {},
    },
    setup(e) {
      const u = e,
        m = p(() =>
          void 0 === u.id || null === u.id || "" === u.id
            ? u.emptyText
            : String(u.id),
        ),
        c = p(
          () =>
            `${void 0 === u.name || null === u.name || "" === u.name ? u.emptyText : String(u.name)}${u.nameSuffix || ""}`,
        ),
        r = p(() => u.tooltipContent || `${c.value} ${u.idLabel}: ${m.value}`),
        f = () => {
          d(u.copyContent || `${c.value}\n${u.idLabel}: ${m.value}`);
        };
      return (e, p) => {
        const d = t("el-tooltip");
        return (
          a(),
          n(
            d,
            {
              effect: "customized",
              "popper-class": "table-overflow-tooltip",
              placement: "top",
              "show-after": 200,
              content: r.value,
            },
            {
              default: o(() => [
                l(
                  "span",
                  { class: "name-id-cell", onClick: s(f, ["stop"]) },
                  i(c.value),
                  1,
                ),
              ]),
              _: 1,
            },
            8,
            ["content"],
          )
        );
      };
    },
  }),
  [["__scopeId", "data-v-022173bc"]],
);
export { m as default };
