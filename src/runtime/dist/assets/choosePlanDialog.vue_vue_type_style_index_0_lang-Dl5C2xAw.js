import a from "./newChoosePlan-Pr2v2f0F.js";
import {
  d as e,
  v as s,
  r as o,
  o as l,
  h as n,
  w as t,
  b as i,
  a as c,
  t as u,
  f as m,
  i as d,
  ad as r,
} from "./index-BUIbb6Pa.js";
const p = e({
  __name: "choosePlanDialog",
  emits: ["submit"],
  setup(e, { expose: p, emit: h }) {
    const { t: v } = s.useI18n(),
      f = d(!1),
      g = h,
      w = (a, e, s) => {
        (g("submit", a, e, s), (f.value = !1));
      };
    return (
      p({
        acceptParams: async () => {
          (await r().getPlanDataV2Fn(), (f.value = !0));
        },
      }),
      (e, s) => {
        const d = o("el-dialog");
        return (
          l(),
          n(
            d,
            {
              modelValue: f.value,
              "onUpdate:modelValue": s[2] || (s[2] = (a) => (f.value = a)),
              width: "980px",
              "close-on-click-modal": !1,
              "close-on-press-escape": !1,
              "align-center": "",
              "show-close": !1,
              class: "choose-plan-dialog",
            },
            {
              header: t(() => [
                c("span", null, u(m(v)("cost.plan.dialog.choosePlanTitle")), 1),
                c("i", {
                  class: "iconfont icon-fail",
                  onClick: s[0] || (s[0] = (a) => (f.value = !1)),
                }),
              ]),
              default: t(() => [
                i(a, {
                  onSubmit: w,
                  onClose: s[1] || (s[1] = (a) => (f.value = !1)),
                }),
              ]),
              _: 1,
            },
            8,
            ["modelValue"],
          )
        );
      }
    );
  },
});
export { p as _ };
