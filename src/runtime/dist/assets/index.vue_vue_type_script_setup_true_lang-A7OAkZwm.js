import {
  d as e,
  dI as t,
  bf as l,
  v as s,
  bQ as a,
  dJ as o,
  r as n,
  o as i,
  c as r,
  b as u,
  aJ as w,
  w as c,
  F as d,
  z as p,
  h as v,
  f as b,
  a as f,
  y as m,
  O as _,
  dK as x,
  C as y,
} from "./index-BUIbb6Pa.js";
import { _ as g } from "./index.vue_vue_type_script_setup_true_lang-CIPUEjpB.js";
const h = { class: "tw-relative tw-w-full [&_.el-select__wrapper]:!tw-pr-14" },
  V = {
    class:
      "tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-8 tw-z-10 tw-flex tw-items-center",
  },
  k = ["aria-label"],
  j = e({
    inheritAttrs: !1,
    __name: "index",
    props: { modelValue: {}, modelModifiers: {} },
    emits: ["update:modelValue"],
    setup(e) {
      const j = t(e, "modelValue"),
        I = l(),
        { t: T } = s.useI18n(),
        z = a(x),
        C = y(() => T("env.env.req.proxyIpTypeTip")),
        J = o(y(() => "" === I.disabled || !0 === I.disabled));
      return (e, t) => {
        const l = n("el-option"),
          s = n("el-select");
        return (
          i(),
          r("div", h, [
            u(
              s,
              w(
                {
                  modelValue: j.value,
                  "onUpdate:modelValue": t[0] || (t[0] = (e) => (j.value = e)),
                },
                e.$attrs,
                { class: "tw-w-full" },
              ),
              {
                default: c(() => [
                  (i(!0),
                  r(
                    d,
                    null,
                    p(
                      b(z),
                      (e) => (
                        i(),
                        v(
                          l,
                          { key: e.value, label: e.label, value: e.value },
                          null,
                          8,
                          ["label", "value"],
                        )
                      ),
                    ),
                    128,
                  )),
                ]),
                _: 1,
              },
              16,
              ["modelValue"],
            ),
            f("div", V, [
              u(
                g,
                { content: C.value },
                {
                  default: c(() => [
                    f(
                      "button",
                      {
                        type: "button",
                        "aria-label": C.value,
                        class: _([
                          "tw-pointer-events-auto tw-flex tw-h-5 tw-w-5 tw-items-center tw-justify-center tw-rounded-full tw-border-0 tw-bg-transparent tw-p-0 tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-[var(--primary-color)] focus-visible:tw-ring-offset-1 focus-visible:tw-ring-offset-[var(--bg-base)]",
                          b(J)
                            ? "tw-text-[var(--el-disabled-color)]"
                            : "tw-text-subText hover:tw-text-black focus-visible:tw-text-black",
                        ]),
                        onMousedown: t[1] || (t[1] = m(() => {}, ["stop"])),
                        onClick: t[2] || (t[2] = m(() => {}, ["stop"])),
                      },
                      [
                        ...(t[3] ||
                          (t[3] = [
                            f(
                              "i",
                              {
                                class:
                                  "iconfont icon-help-circle1 tw-text-[16px]",
                              },
                              null,
                              -1,
                            ),
                          ])),
                      ],
                      42,
                      k,
                    ),
                  ]),
                  _: 1,
                },
                8,
                ["content"],
              ),
            ]),
          ])
        );
      };
    },
  });
export { j as _ };
