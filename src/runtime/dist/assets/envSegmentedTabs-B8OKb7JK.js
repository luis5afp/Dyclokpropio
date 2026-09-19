import {
  d as e,
  G as s,
  P as a,
  g as t,
  W as l,
  c as d,
  O as n,
  f as i,
  a as o,
  x as u,
  e4 as v,
  ax as m,
  F as r,
  z as b,
  e as c,
  t as f,
  X as p,
  i as _,
  ac as g,
  o as h,
  _ as w,
} from "./index-BUIbb6Pa.js";
const y = ["disabled", "onClick"],
  x = { class: "env-segmented-tabs__label" },
  V = { key: 0, class: "env-segmented-tabs__dot" },
  k = w(
    e({
      __name: "envSegmentedTabs",
      props: { options: {}, modelValue: {}, disabled: { type: Boolean } },
      emits: ["update:modelValue", "change"],
      setup(e, { emit: w }) {
        const k = e,
          L = w,
          z = s(),
          A = _(),
          C = _({ left: 0, width: 0 });
        function E() {
          g(() => {
            const e = A.value;
            if (!e) return;
            const s = Array.from(
              e.querySelectorAll(".env-segmented-tabs__item"),
            )[k.options.findIndex((e) => e.value === k.modelValue)];
            C.value = s
              ? { left: s.offsetLeft, width: s.offsetWidth }
              : { left: 0, width: 0 };
          });
        }
        return (
          a(() => {
            (E(), window.addEventListener("resize", E));
          }),
          t(() => {
            window.removeEventListener("resize", E);
          }),
          l(
            () => [k.modelValue, k.options],
            () => {
              E();
            },
            { deep: !0 },
          ),
          (s, a) =>
            e.options.length > 1
              ? (h(),
                d(
                  "div",
                  {
                    key: 0,
                    class: n([
                      "env-segmented-tabs",
                      { "is-disabled": e.disabled, "is-light": i(z).isLight },
                    ]),
                  },
                  [
                    o(
                      "div",
                      {
                        ref_key: "tabsRef",
                        ref: A,
                        class: "env-segmented-tabs__inner",
                      },
                      [
                        u(
                          o(
                            "div",
                            {
                              class: "env-segmented-tabs__indicator",
                              style: m({
                                width: `${C.value.width}px`,
                                transform: `translateX(${C.value.left}px)`,
                              }),
                            },
                            null,
                            4,
                          ),
                          [[v, C.value.width]],
                        ),
                        (h(!0),
                        d(
                          r,
                          null,
                          b(
                            e.options,
                            (s) => (
                              h(),
                              d(
                                "button",
                                {
                                  key: s.value,
                                  class: n([
                                    "env-segmented-tabs__item",
                                    { "is-active": s.value === e.modelValue },
                                  ]),
                                  type: "button",
                                  disabled: e.disabled || s.disabled,
                                  onClick: (e) =>
                                    (function (e) {
                                      k.disabled ||
                                        e.disabled ||
                                        e.value === k.modelValue ||
                                        (L("update:modelValue", e.value),
                                        L("change", e.value));
                                    })(s),
                                },
                                [
                                  o("span", x, [
                                    c(f(s.label) + " ", 1),
                                    s.dot ? (h(), d("span", V)) : p("", !0),
                                  ]),
                                ],
                                10,
                                y,
                              )
                            ),
                          ),
                          128,
                        )),
                      ],
                      512,
                    ),
                  ],
                  2,
                ))
              : p("", !0)
        );
      },
    }),
    [["__scopeId", "data-v-19b1d22f"]],
  );
export { k as default };
