import { _ as t, o as w, c as a, a as e, ai as r } from "./index-BUIbb6Pa.js";
const s = {
    class:
      "tw-w-[100%] tw-leading-[21px] tw-py-[10px] tw-pl-[16px] tw-pr-[16px] tw-border-[var(--warning-color)] tw-border-[0.8px] tw-rounded-[8px] tw-bg-opacity-10 tw-bg-[#faa63a] tw-text-[var(--warning-color)] tw-flex tw-justify-between",
  },
  n = { class: "tw-text-red tw-flex tw-items-baseline" };
const o = t({}, [
  [
    "render",
    function (t, o) {
      return (
        w(),
        a("div", s, [
          e("div", n, [
            o[0] ||
              (o[0] = e(
                "div",
                {
                  class:
                    "tw-w-[16px] tw-h-[16px] tw-rounded-full tw-mr-[8px] c-flex tw-bg-[#faa63a]",
                },
                [
                  e("i", {
                    class:
                      "iconfont icon-warning tw-text-[#fff] tw-text-[16px]",
                  }),
                ],
                -1,
              )),
            r(t.$slots, "default"),
          ]),
        ])
      );
    },
  ],
]);
export { o as W };
