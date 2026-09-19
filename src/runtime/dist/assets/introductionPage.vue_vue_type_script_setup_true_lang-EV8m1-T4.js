import {
  d as t,
  v as e,
  r as l,
  o as i,
  c as a,
  a as n,
  t as s,
  F as w,
  z as x,
  b as o,
  w as r,
  e as p,
  f as d,
  ev as c,
  i as u,
} from "./index-BUIbb6Pa.js";
const f = { class: "tw-flex tw-items-center tw-h-full tw-px-[32px]" },
  g = { class: "tw-flex tw-w-full" },
  m = { class: "tw-text-[var(--text-light1)] tw-w-[422px] lg:tw-w-[330px]" },
  v = { class: "tw-text-[24px] tw-leading-[36px] tw-mb-[12px]" },
  C = { class: "tw-flex-1" },
  b = { class: "tw-mt-[32px]" },
  h = ["src"],
  y = t({
    __name: "introductionPage",
    props: { textConfig: {}, handleSkip: { type: Function } },
    emits: ["onCreate", "onSkip"],
    setup(t, { emit: y }) {
      let { locale: k } = e.useI18n(),
        _ = t;
      const A = u(!1);
      async function S() {
        try {
          ((A.value = !0), await _.handleSkip());
        } finally {
          A.value = !1;
        }
      }
      return (e, u) => {
        var y;
        const _ = l("el-button");
        return (
          i(),
          a("div", f, [
            n("div", g, [
              n("div", m, [
                n("div", v, s(t.textConfig.title), 1),
                (i(!0),
                a(
                  w,
                  null,
                  x(
                    t.textConfig.textArr,
                    (t) => (
                      i(),
                      a(
                        "div",
                        {
                          key: t,
                          class:
                            "tw-flex tw-leading-[21px] tw-mb-[8px] tw-text-[14px]",
                        },
                        [
                          u[1] ||
                            (u[1] = n(
                              "div",
                              {
                                class:
                                  "tw-w-[6px] tw-h-[6px] tw-rounded tw-bg-[var(--text-light1)] tw-mr-[8px] tw-mt-[8px]",
                              },
                              null,
                              -1,
                            )),
                          n("div", C, s(t), 1),
                        ],
                      )
                    ),
                  ),
                  128,
                )),
                n("div", b, [
                  o(
                    _,
                    {
                      id: (null == (y = t.textConfig) ? void 0 : y.btnId) || "",
                      type: "primary",
                      onClick: u[0] || (u[0] = (t) => e.$emit("onCreate")),
                    },
                    {
                      default: r(() => [
                        u[2] ||
                          (u[2] = n(
                            "i",
                            { class: "iconfont icon-plus" },
                            null,
                            -1,
                          )),
                        p(" " + s(t.textConfig.btnText), 1),
                      ]),
                      _: 1,
                    },
                    8,
                    ["id"],
                  ),
                  o(
                    _,
                    { plain: "", type: "info", onClick: S, loading: A.value },
                    {
                      default: r(() => [
                        p(s(e.$t("introductionPage.skip")), 1),
                      ]),
                      _: 1,
                    },
                    8,
                    ["loading"],
                  ),
                ]),
              ]),
              n(
                "img",
                {
                  src:
                    d(k) === d(c).ZH
                      ? t.textConfig.imgArr.zh
                      : t.textConfig.imgArr.en,
                  class:
                    "2xl:tw-ml-[14%] tw-ml-[6%] tw-rounded-[16px] tw-border tw-border-[var(--info-color-light4)] 2xl:tw-w-[732px] xl:tw-w-[500px] lg:tw-w-[450px] tw-max-w-[732px] tw-h-fit",
                },
                null,
                8,
                h,
              ),
            ]),
          ])
        );
      };
    },
  });
export { y as _ };
