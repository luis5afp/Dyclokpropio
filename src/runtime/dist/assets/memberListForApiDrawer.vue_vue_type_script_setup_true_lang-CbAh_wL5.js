import {
  d as e,
  v as s,
  r as a,
  o as r,
  h as t,
  w as o,
  b as l,
  f as p,
  ap as d,
} from "./index-BUIbb6Pa.js";
import i from "./memberListForApi-DY18YSj1.js";
const m = e({
  __name: "memberListForApiDrawer",
  setup(e) {
    let { t: m } = s.useI18n();
    const n = () => {
      d().showOrHideChat(!1);
    };
    return (e, s) => {
      const d = a("el-drawer");
      return (
        r(),
        t(
          d,
          {
            modelValue: e.$attrs.drawer,
            "onUpdate:modelValue":
              s[0] || (s[0] = (s) => (e.$attrs.drawer = s)),
            title: p(m)("org.apiCreateMember.apiUrl"),
            size: "60%",
            "close-on-click-modal": !1,
            "close-on-press-escape": !1,
            "body-class": "!tw-pt-0 !tw-pb-0",
            "footer-class": "!tw-pb-[16px]",
            onOpened: n,
          },
          { default: o(() => [l(i)]), _: 1 },
          8,
          ["modelValue", "title"],
        )
      );
    };
  },
});
export { m as _ };
