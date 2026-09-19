import {
  d as t,
  k5 as s,
  r as e,
  f as a,
  o,
  h as n,
  w as l,
  ai as p,
} from "./index-BUIbb6Pa.js";
const r = t({
  __name: "tipButton",
  setup(t) {
    const r = s();
    return (t, s) => {
      const c = e("el-tooltip");
      return a(r).state
        ? p(t.$slots, "default", { key: 1 })
        : (o(),
          n(
            c,
            { key: 0, content: t.$t("sync.tip72"), placement: "top" },
            { default: l(() => [p(t.$slots, "default")]), _: 3 },
            8,
            ["content"],
          ));
    };
  },
});
export { r as _ };
