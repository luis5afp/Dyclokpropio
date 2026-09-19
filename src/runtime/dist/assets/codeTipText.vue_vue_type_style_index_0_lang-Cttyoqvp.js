import {
  d as e,
  v as i,
  c as r,
  a as s,
  f as n,
  t as l,
  o as t,
} from "./index-BUIbb6Pa.js";
const a = { class: "tip-wrapper" },
  o = ["innerHTML"],
  p = ["innerHTML"],
  T = e({
    __name: "codeTipText",
    setup(e) {
      const T = i.useI18n(),
        { t: c } = T;
      return (e, i) => (
        t(),
        r("ul", a, [
          s("li", { innerHTML: n(c)("register.codeTip1") }, null, 8, o),
          s("li", { innerHTML: n(c)("register.codeTip2") }, null, 8, p),
          s("li", null, l(n(c)("register.codeTip3")), 1),
          s("li", null, l(n(c)("register.codeTip4")), 1),
        ])
      );
    },
  });
export { T as _ };
