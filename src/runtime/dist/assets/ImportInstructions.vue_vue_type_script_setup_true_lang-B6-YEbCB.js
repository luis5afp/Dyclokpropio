import {
  d as t,
  v as e,
  o as i,
  c as s,
  a as v,
  t as r,
  f as a,
} from "./index-BUIbb6Pa.js";
const l = {
    class:
      "tw-bg-[var(--bg-light4)] tw-rounded-[8px] tw-text-[var(--w-e-textarea-border-color)] tw-p-[16px]",
  },
  n = { class: "tw-text-[14px]" },
  p = { class: "tw-text-[14px]" },
  x = { class: "tw-mt-[12px]" },
  w = { class: "tw-text-[14px]" },
  o = t({
    __name: "ImportInstructions",
    setup(t) {
      let { t: o } = e.useI18n();
      return (t, e) => (
        i(),
        s("div", l, [
          v("div", null, [
            v("div", null, r(a(o)("env.env.import.txtFilePreviewTitle")), 1),
            v("div", n, r(a(o)("env.env.import.txtFilePreviewTip")), 1),
            v("div", p, r(a(o)("env.env.import.txtFilePreviewTip2")), 1),
          ]),
          v("div", x, [
            v("div", null, r(a(o)("env.env.import.txtFilePreviewTip4")), 1),
            e[0] ||
              (e[0] = v(
                "div",
                { class: "tw-text-[14px] tw-break-all tw-mb-[10px]" },
                " 61573712412345|abc@hotmail.com|RcDtLU68|c_user=615737124123456;xs=28:QaQ1PlqUASA:2:1742926124:-1:-1;fr=0ay9sjkwe1EOC6F.AW23c9wKXYt2XSSD2wFSPr8AeQ.Bn4vQ1..AAA.0.0.Bn4vQ1.A1Q-suJiM;datr=NfTiZz50vn0W7d0sP; ",
                -1,
              )),
          ]),
          v(
            "div",
            w,
            r(a(o)("env.env.import.txtFilePreviewTip3", { pipe: "|" })),
            1,
          ),
        ])
      );
    },
  });
export { o as _ };
