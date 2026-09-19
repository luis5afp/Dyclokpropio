import {
  d as e,
  v as t,
  R as l,
  i as a,
  dx as s,
  bB as o,
  P as c,
  ag as w,
  r,
  o as u,
  h as i,
  b7 as n,
  f as d,
  be as p,
  ah as x,
  w as v,
  c as f,
  F as g,
  z as m,
  a as y,
  b,
  t as h,
  e as k,
  ax as _,
  X as C,
  dy as T,
  C as V,
  a3 as E,
  _ as N,
} from "./index-BUIbb6Pa.js";
import { u as L } from "./common-_BPSz0Vp.js";
const I = { class: "tw-max-w-[90%]" },
  O = { class: "tw-truncate" },
  S = {
    key: 1,
    class: "tw-text-[var(--text-color-base)] tw-flex tw-flex-col tw-gap-[8px]",
  },
  j = {
    class:
      "tw-h-[38px] tw-mb-[40px] tw-flex tw-items-center tw-px-[8px] tw-rounded-[4px] create-tag-btn",
  },
  D = { class: "tw-relative tw-flex-1 tw-text-left" },
  z = { class: "tw-truncate" },
  A = {
    class:
      "tw-flex tw-flex-1 tw-flex-wrap tw-gap-2 tw-absolute tw-top-[38px] tw-left-[3px] tag-color-list-wrapper",
  },
  G = ["onClick"],
  R = {
    class: "tw-text-center tw-text-[14px] tw-text-[var(--text-color-light1)]",
  },
  $ = { class: "tw-truncate" },
  P = { class: "tw-flex tw-flex-wrap tw-gap-2 tw-w-min" },
  q = {
    class: "tw-text-[var(--text-color-base)] tw-flex tw-flex-col tw-gap-[8px]",
  },
  B = {
    class:
      "tw-h-[38px] tw-mb-[40px] tw-flex tw-items-center tw-px-[8px] tw-rounded-[4px] tw-cursor-pointer",
  },
  F = {
    class:
      "tw-relative tw-flex-1 tw-text-left tw-flex tw-items-center tw-justify-between",
  },
  H = { class: "tw-truncate" },
  K = {
    class:
      "tw-flex tw-flex-1 tw-flex-wrap tw-gap-2 tw-absolute tw-top-[38px] tw-left-[3px] tag-color-list-wrapper",
  },
  M = ["onClick"],
  U = {
    class: "tw-text-center tw-text-[14px] tw-text-[var(--text-color-light1)]",
  },
  X = N(
    e({
      __name: "envTagSelect",
      props: { modelValue: {} },
      emits: ["update:modelValue"],
      setup(e, { emit: N }) {
        let X = e,
          { t: J } = t.useI18n();
        const { tagCodeColorMap: Q, tagColorList: W } = T(),
          Y = V({
            get: () => X.modelValue,
            set: (e) => Z("update:modelValue", e),
          });
        let Z = N;
        const ee = L(),
          { tagList: te } = l(ee);
        let le = a("");
        const ae = V(() =>
            te.value.filter((e) => e.tagName.includes(le.value)),
          ),
          se = a(s.COLOR_ONE),
          oe = `env-tag-select-popper-${o()}`;
        let ce = null;
        const we = (e) => {
          const t = e;
          "Enter" === t.key && re(t);
        };
        function re(e) {
          (console.log(e, "e"),
            e.stopPropagation(),
            e.preventDefault(),
            le.value && ne());
        }
        function ue(e) {
          le.value = e.slice(0, 50);
        }
        function ie(e) {
          e.target.maxLength = 50;
        }
        async function ne() {
          if (!le.value || ae.value.length) return;
          let e = await ee.createTag(le.value, se.value);
          e &&
            (Y.value.push({ id: e, tagName: le.value, tagStyle: se.value }),
            (le.value = ""),
            (se.value = s.COLOR_ONE),
            E.success(J("org.member.createSuccess")));
        }
        function de(e) {
          Y.value = Y.value.filter((t) => t.id !== e);
        }
        return (
          c(() => {
            (ee.getTagList(!0),
              (ce = document.querySelector(`.${oe}`)),
              ce && ce.addEventListener("keyup", we));
          }),
          w(() => {
            ce && (ce.removeEventListener("keyup", we), (ce = null));
          }),
          (t, l) => {
            const a = r("el-tag"),
              s = r("el-option"),
              o = r("Check"),
              c = r("el-icon"),
              w = r("el-divider"),
              T = r("el-popover"),
              V = r("el-select");
            return (
              u(),
              i(
                V,
                {
                  modelValue: Y.value,
                  "onUpdate:modelValue": l[0] || (l[0] = (e) => (Y.value = e)),
                  multiple: "",
                  placeholder: d(p)(d(x).ENV_TAG_EDIT)
                    ? d(J)("env.tag.selectOrInputCreateTag")
                    : d(J)("base.selectHolder"),
                  "value-key": "id",
                  filterable: "",
                  clearable: "",
                  "reserve-keyword": !1,
                  "popper-class": `env-tag-select-popper ${oe}`,
                  "filter-method": ue,
                  onKeyup: n(re, ["enter"]),
                  onInput: ie,
                },
                {
                  tag: v(() => [
                    (u(!0),
                    f(
                      g,
                      null,
                      m(
                        e.modelValue.slice(0, 3),
                        (e) => (
                          u(),
                          i(
                            a,
                            {
                              key: e.id,
                              class:
                                "default-style tw-text-white tw-max-w-[28%]",
                              color: d(Q)[e.tagStyle],
                              closable: "",
                              onClose: (t) => de(e.id ?? ""),
                            },
                            {
                              default: v(() => [y("div", $, h(e.tagName), 1)]),
                              _: 2,
                            },
                            1032,
                            ["color", "onClose"],
                          )
                        ),
                      ),
                      128,
                    )),
                    e.modelValue.length > 3
                      ? (u(),
                        i(
                          T,
                          {
                            key: 0,
                            "popper-class": "!tw-max-w-full !tw-w-fit",
                            placement: "top",
                            "show-arrow": !1,
                          },
                          {
                            reference: v(() => [
                              b(
                                a,
                                {
                                  class: "default-style tw-text-white",
                                  color: "var(--btn-info-color)",
                                },
                                {
                                  default: v(() => [
                                    k("+" + h(e.modelValue.length - 3), 1),
                                  ]),
                                  _: 1,
                                },
                              ),
                            ]),
                            default: v(() => [
                              y("div", P, [
                                (u(!0),
                                f(
                                  g,
                                  null,
                                  m(
                                    e.modelValue,
                                    (e) => (
                                      u(),
                                      f("div", { key: e.id }, [
                                        b(
                                          a,
                                          {
                                            class:
                                              "default-style tw-text-white",
                                            color: d(Q)[e.tagStyle],
                                            closable: "",
                                            onClose: (t) => de(e.id ?? ""),
                                          },
                                          {
                                            default: v(() => [
                                              k(h(e.tagName), 1),
                                            ]),
                                            _: 2,
                                          },
                                          1032,
                                          ["color", "onClose"],
                                        ),
                                      ])
                                    ),
                                  ),
                                  128,
                                )),
                              ]),
                            ]),
                            _: 1,
                          },
                        ))
                      : C("", !0),
                  ]),
                  empty: v(() => [
                    y("div", q, [
                      d(le) && d(p)(d(x).ENV_TAG_EDIT)
                        ? (u(),
                          f(
                            g,
                            { key: 0 },
                            [
                              y("div", B, [
                                k(h(d(J)("env.tag.createTagTips")) + " ", 1),
                                y("div", F, [
                                  y(
                                    "div",
                                    {
                                      class: "b-flex tw-w-full tw-gap-[10px]",
                                      onClick: ne,
                                    },
                                    [
                                      b(
                                        a,
                                        {
                                          class:
                                            "tw-ml-[4px] tw-text-white default-style tw-flex-1 tw-w-0 tw-max-w-fit",
                                          color: d(Q)[se.value],
                                        },
                                        {
                                          default: v(() => [
                                            y("div", H, h(d(le)), 1),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["color"],
                                      ),
                                      l[2] ||
                                        (l[2] = y(
                                          "i",
                                          {
                                            class:
                                              "iconfont icon-enter tw-text-[var(--text-light-11)]",
                                          },
                                          null,
                                          -1,
                                        )),
                                    ],
                                  ),
                                  y("div", K, [
                                    (u(!0),
                                    f(
                                      g,
                                      null,
                                      m(
                                        d(W),
                                        (e) => (
                                          u(),
                                          f(
                                            "div",
                                            {
                                              class:
                                                "tw-w-[24px] tw-h-[24px] tw-rounded-[4px] c-flex tw-cursor-pointer",
                                              onClick: (t) =>
                                                (se.value = e.code),
                                              key: e.code,
                                              style: _({
                                                backgroundColor: e.color,
                                              }),
                                            },
                                            [
                                              se.value === e.code
                                                ? (u(),
                                                  i(
                                                    c,
                                                    {
                                                      key: 0,
                                                      size: "18",
                                                      class: "tw-text-white",
                                                    },
                                                    {
                                                      default: v(() => [b(o)]),
                                                      _: 1,
                                                    },
                                                  ))
                                                : C("", !0),
                                            ],
                                            12,
                                            M,
                                          )
                                        ),
                                      ),
                                      128,
                                    )),
                                  ]),
                                ]),
                              ]),
                              b(w, {
                                class:
                                  "tw-my-[0] tw-border-[var(--border-color-base)]",
                              }),
                            ],
                            64,
                          ))
                        : C("", !0),
                      y("div", U, h(d(J)("base.searchEmpty")), 1),
                    ]),
                  ]),
                  default: v(() => [
                    ae.value.length
                      ? (u(!0),
                        f(
                          g,
                          { key: 0 },
                          m(
                            ae.value,
                            (e) => (
                              u(),
                              i(
                                s,
                                { key: e.id, value: e, label: e.tagName },
                                {
                                  default: v(() => [
                                    y("div", I, [
                                      b(
                                        a,
                                        {
                                          class:
                                            "default-style tw-text-white tw-w-full tw-flex tw-justify-start",
                                          color: d(Q)[e.tagStyle],
                                        },
                                        {
                                          default: v(() => [
                                            y("div", O, h(e.tagName), 1),
                                          ]),
                                          _: 2,
                                        },
                                        1032,
                                        ["color"],
                                      ),
                                    ]),
                                  ]),
                                  _: 2,
                                },
                                1032,
                                ["value", "label"],
                              )
                            ),
                          ),
                          128,
                        ))
                      : (u(),
                        f("div", S, [
                          d(le) && d(p)(d(x).ENV_TAG_EDIT)
                            ? (u(),
                              f(
                                g,
                                { key: 0 },
                                [
                                  y("div", j, [
                                    k(
                                      h(d(J)("env.tag.createTagTips")) + " ",
                                      1,
                                    ),
                                    y("div", D, [
                                      y(
                                        "div",
                                        {
                                          class:
                                            "b-flex tw-w-full tw-gap-[10px]",
                                          onClick: ne,
                                        },
                                        [
                                          b(
                                            a,
                                            {
                                              class:
                                                "tw-ml-[4px] tw-text-white default-style tw-flex-1 tw-w-0 tw-max-w-fit",
                                              color: d(Q)[se.value],
                                            },
                                            {
                                              default: v(() => [
                                                y("div", z, h(d(le)), 1),
                                              ]),
                                              _: 1,
                                            },
                                            8,
                                            ["color"],
                                          ),
                                          l[1] ||
                                            (l[1] = y(
                                              "i",
                                              {
                                                class:
                                                  "iconfont icon-enter tw-text-[var(--text-light-11)]",
                                              },
                                              null,
                                              -1,
                                            )),
                                        ],
                                      ),
                                      y("div", A, [
                                        (u(!0),
                                        f(
                                          g,
                                          null,
                                          m(
                                            d(W),
                                            (e) => (
                                              u(),
                                              f(
                                                "div",
                                                {
                                                  class:
                                                    "tw-w-[24px] tw-h-[24px] tw-rounded-[4px] c-flex tw-cursor-pointer",
                                                  onClick: (t) =>
                                                    (se.value = e.code),
                                                  key: e.code,
                                                  style: _({
                                                    backgroundColor: e.color,
                                                  }),
                                                },
                                                [
                                                  se.value === e.code
                                                    ? (u(),
                                                      i(
                                                        c,
                                                        {
                                                          key: 0,
                                                          size: "18",
                                                          class:
                                                            "tw-text-white",
                                                        },
                                                        {
                                                          default: v(() => [
                                                            b(o),
                                                          ]),
                                                          _: 1,
                                                        },
                                                      ))
                                                    : C("", !0),
                                                ],
                                                12,
                                                G,
                                              )
                                            ),
                                          ),
                                          128,
                                        )),
                                      ]),
                                    ]),
                                  ]),
                                  b(w, { class: "tw-my-[0] tw-border-[#666]" }),
                                ],
                                64,
                              ))
                            : C("", !0),
                          y("div", R, h(d(J)("base.searchEmpty")), 1),
                        ])),
                  ]),
                  _: 1,
                },
                8,
                ["modelValue", "placeholder", "popper-class"],
              )
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-a501ce66"]],
  );
export { X as default };
