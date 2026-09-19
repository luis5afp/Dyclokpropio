import { _ as t } from "./headerBar.vue_vue_type_script_setup_true_lang-CJ3mJ7qU.js";
import { _ as e } from "./leftSideBar.vue_vue_type_script_setup_true_lang-cw_y4wj7.js";
import {
  d as a,
  c as s,
  b as l,
  a as w,
  ai as p,
  o as r,
} from "./index-BUIbb6Pa.js";
const i = {
    class:
      "app-web-sso-layout tw-w-full tw-h-full tw-relative tw-flex tw-flex-col",
  },
  o = {
    class:
      "tw-flex tw-flex-1 tw-w-full tw-max-w-[72%] tw-mx-auto tw-px-[60px] tw-pb-10 tw-relative tw-justify-between tw-gap-[8%]",
  },
  u = { class: "action-area" },
  _ = a({
    __name: "appWebSSOLayout",
    setup: (a) => (a, _) => (
      r(),
      s("div", i, [
        l(t, {
          class: "tw-flex-shrink-0 tw-sticky tw-top-0 tw-px-[60px] tw-z-10",
        }),
        w("div", o, [
          l(e, { class: "tw-flex-1 tw-relative" }),
          w("div", u, [p(a.$slots, "default")]),
        ]),
      ])
    ),
  });
export { _ };
