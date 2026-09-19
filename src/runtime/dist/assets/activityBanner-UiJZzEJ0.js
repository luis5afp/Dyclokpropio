import {
  d as t,
  o as a,
  c as e,
  a as s,
  f as w,
  ax as r,
  O as i,
} from "./index-BUIbb6Pa.js";
const n = "" + new URL("expan-tip-CtqN4Uph.png", import.meta.url).href,
  l = { class: "tw-w-[100%] tw-h-fit tw-relative" },
  o = ["src"],
  c = t({
    __name: "activityBanner",
    setup(t) {
      function c(t, a) {
        return "h" === a
          ? (t / 311) * 100 + "%"
          : "w" === a
            ? (t / 1589) * 100 + "%"
            : void 0;
      }
      return (t, p) => (
        a(),
        e("div", l, [
          s(
            "img",
            {
              src: w(n),
              alt: "Expand Tip",
              class: "tw-object-cover tw-w-[100%]",
              ref: "imgRef",
            },
            null,
            8,
            o,
          ),
          s(
            "div",
            {
              class: i([
                `tw-w-[${c(50, "w")}]`,
                `tw-h-[${c(42, "h")}]`,
                "tw-bg-[#15e5af]",
                "tw-absolute",
                "tw-z-10",
              ]),
              style: r({ top: c(150, "h"), left: c(60, "w") }),
            },
            null,
            6,
          ),
        ])
      );
    },
  });
export { c as default };
