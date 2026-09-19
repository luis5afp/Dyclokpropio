import {
  d as e,
  v as l,
  i as a,
  P as u,
  r as t,
  q as r,
  o as n,
  c as o,
  x as i,
  h as s,
  w as p,
  F as v,
  z as d,
  f as m,
  a as c,
  X as V,
  b as f,
  t as h,
  b0 as y,
  e as x,
  y as g,
  C as w,
} from "./index-BUIbb6Pa.js";
import { R as b } from "./rpaRule-swm8xZfZ.js";
const R = { key: 0, class: "tw-mt-4]" },
  E = { class: "s-flex tw-gap-x-1 tw-inline-block" },
  k = { key: 0, class: "tw-text-[#ff0000]" },
  N = { class: "tw-max-w-[400px] tw-text-black tw-text-opacity-80" },
  U = { class: "s-flex tw-w-full tw-gap-x-2" },
  O = { key: 3, class: "s-flex tw-w-full tw-gap-x-4" },
  _ = { key: 4, class: "tw-w-full" },
  S = ["onChange"],
  B = e({
    __name: "RpaProcessOptionsForm",
    props: { rpaData: {}, globalData: {} },
    setup(e, { expose: B }) {
      const { t: I, locale: L } = l.useI18n(),
        M = L.value,
        T = a(),
        C = e,
        $ = a(C.globalData),
        q = a(),
        A = w(() => (e) => [
          { required: !0, message: I("rpaOptions.tip3"), trigger: "blur" },
          {
            validator: (l, a, u) => {
              if (!e) return u();
              a > e ? u(I("rpaOptions.tip9", { number: e })) : u();
            },
          },
        ]),
        j = w(() => {
          const e = {};
          return (
            Object.keys($.value).forEach((l) => {
              const a = (a) => {
                const u = $.value[l];
                if (
                  !(
                    (null == u ? void 0 : u.maxLength) ||
                    (null == u ? void 0 : u.required) ||
                    (null == u ? void 0 : u.rule)
                  )
                )
                  return;
                ((e[a] = []),
                  u.required &&
                    e[a].push({
                      required: !0,
                      message: I("rpaOptions.tip3", { key: u.label[M] }),
                      trigger: "blur",
                    }),
                  u.maxLength &&
                    [b.STRING, b.NUMBER].includes(u.type) &&
                    e[a].push({
                      validator: (e, l, a) => {
                        (u.type === b.STRING &&
                          (l.length > +u.maxLength
                            ? a(
                                new Error(
                                  I("rpaOptions.tip4", {
                                    key: u.label[M],
                                    number: u.maxLength,
                                  }),
                                ),
                              )
                            : a()),
                          u.type === b.NUMBER &&
                            (l > +u.maxValue || l < +u.minValue
                              ? a(
                                  new Error(
                                    I("rpaOptions.tip5", {
                                      key: u.label[M],
                                      number: u.maxValue,
                                    }),
                                  ),
                                )
                              : a()));
                      },
                      trigger: "blur",
                    }));
                const t = (e) => (
                  e.startsWith("/") && (e = e.slice(1, -1)),
                  e.endsWith("/") && (e = e.slice(0, -1)),
                  e
                );
                (null == u ? void 0 : u.rule) &&
                  Array.isArray(u.rule) &&
                  u.rule.length &&
                  u.rule.forEach((l) => {
                    const r = {};
                    ((r.trigger = (null == l ? void 0 : l.trigger) || "blur"),
                      l.pattern &&
                        (r.validator = (e, a, r) => {
                          var n, o;
                          if (u.type === b.ARRAY) {
                            const e = a.split("\n");
                            if (u.maxLength && e.length > u.maxLength)
                              return r(
                                new Error(
                                  I("rpaOptions.tip6", {
                                    key: u.label[M],
                                    number: u.maxLength,
                                  }),
                                ),
                              );
                            if (
                              e.some((e) => !new RegExp(t(l.pattern)).test(e))
                            )
                              return r(
                                new Error(
                                  null == (n = null == l ? void 0 : l.errorTips)
                                    ? void 0
                                    : n[M],
                                ),
                              );
                          } else if (!new RegExp(t(l.pattern)).test(a))
                            return r(
                              new Error(
                                null == (o = null == l ? void 0 : l.errorTips)
                                  ? void 0
                                  : o[M],
                              ),
                            );
                          r();
                        }),
                      Object.keys(r) && e[a].push(r));
                  });
              };
              $.value[l].type === b.NUMBER_SECTION
                ? (a(`${l}.minValue`), a(`${l}.maxValue`))
                : a(`${l}.value`);
            }),
            e
          );
        }),
        G = (e) => {
          var l, a, u;
          if (e.type === b.NUMBER_SECTION) {
            if (
              (null === e.minValue &&
                (e.minValue = +e.value.split(",")[0] || 0),
              null === e.maxValue && (e.maxValue = +e.value.split(",")[1] || 0),
              (null == (l = e.minValue)
                ? void 0
                : l.toString().match(/[^0-9]/)) && (e.minValue = 1),
              (null == (a = e.maxValue)
                ? void 0
                : a.toString().match(/[^0-9]/)) && (e.maxValue = 1),
              +e.minValue > +e.maxValue)
            ) {
              const l = e.minValue;
              ((e.minValue = e.maxValue), (e.maxValue = l));
            }
            e.value = `${e.minValue},${e.maxValue}`;
          }
          e.type === b.NUMBER &&
            (null == (u = e.value) ? void 0 : u.toString().match(/[^0-9]/)) &&
            (e.value = 1);
        },
        z = () => {
          var e, l;
          null == (l = null == (e = q.value) ? void 0 : e[0]) || l.click();
        },
        D = async (e) => {
          var l;
          null == (l = T.value) ||
            l.validate((l) => {
              l &&
                (Object.keys($.value).forEach((e) => {
                  ($.value[e].type === b.NUMBER_SECTION &&
                    (($.value[e].value =
                      `${$.value[e].minValue},${$.value[e].maxValue}`),
                    delete $.value[e].minValue,
                    delete $.value[e].maxValue),
                    $.value[e].type === b.ARRAY &&
                      ($.value[e].value = $.value[e].value.replace(/\n/g, ",")),
                    $.value[e].type === b.NUMBER &&
                      ($.value[e].value = +$.value[e].value));
                }),
                e($.value));
            });
        };
      return (
        u(() => {
          const e = JSON.parse(JSON.stringify(C.globalData));
          (Object.keys(e).forEach((l) => {
            (e[l].type === b.NUMBER_SECTION &&
              ((e[l].minValue = e[l].value.split(",")[0] || 0),
              (e[l].maxValue = e[l].value.split(",")[1] || 0)),
              e[l].type === b.ARRAY &&
                (e[l].value = e[l].value.replace(/,/g, "\n")));
          }),
            ($.value = e));
        }),
        B({ handleSubmit: D }),
        (e, l) => {
          const a = t("el-tooltip"),
            u = t("el-input"),
            w = t("el-option"),
            B = t("el-select"),
            I = t("el-form-item"),
            L = t("el-icon"),
            C = t("el-button"),
            F = t("el-form"),
            Y = r("prevent-label-click");
          return $.value
            ? (n(),
              o("div", R, [
                i(
                  (n(),
                  s(
                    F,
                    {
                      ref_key: "formRef",
                      ref: T,
                      "hide-required-asterisk": !0,
                      model: $.value,
                      rules: j.value,
                      "label-position": "right",
                      "label-width": "auto",
                      onSubmit: g(D, ["prevent"]),
                    },
                    {
                      default: p(() => [
                        (n(!0),
                        o(
                          v,
                          null,
                          d(Object.keys($.value), (t, r) => {
                            var i;
                            return (
                              n(),
                              s(
                                I,
                                {
                                  key: r,
                                  prop:
                                    $.value[t].type === m(b).NUMBER_SECTION
                                      ? void 0
                                      : `${t}.value`,
                                  required: !!(null == (i = $.value[t])
                                    ? void 0
                                    : i.required),
                                },
                                {
                                  label: p(() => {
                                    var e, u, r;
                                    return [
                                      c("div", E, [
                                        c("span", null, [
                                          (
                                            null == (e = $.value[t])
                                              ? void 0
                                              : e.required
                                          )
                                            ? (n(), o("span", k, "*"))
                                            : V("", !0),
                                          x(
                                            " " +
                                              h(
                                                null == (u = $.value[t].label)
                                                  ? void 0
                                                  : u[m(M)],
                                              ),
                                            1,
                                          ),
                                        ]),
                                        (
                                          null == (r = $.value[t])
                                            ? void 0
                                            : r.tips
                                        )
                                          ? (n(),
                                            s(
                                              a,
                                              { key: 0, placement: "top" },
                                              {
                                                content: p(() => [
                                                  c(
                                                    "div",
                                                    N,
                                                    h($.value[t].tips[m(M)]),
                                                    1,
                                                  ),
                                                ]),
                                                default: p(() => [
                                                  l[0] ||
                                                    (l[0] = c(
                                                      "i",
                                                      {
                                                        class:
                                                          "iconfont icon-help-circle1 tw-cursor-pointer",
                                                      },
                                                      null,
                                                      -1,
                                                    )),
                                                ]),
                                                _: 2,
                                              },
                                              1024,
                                            ))
                                          : V("", !0),
                                      ]),
                                    ];
                                  }),
                                  default: p(() => {
                                    var l, a;
                                    return [
                                      c("template", U, [
                                        [
                                          m(b).STRING,
                                          m(b).LONG_STRING,
                                        ].includes($.value[t].type)
                                          ? (n(),
                                            s(
                                              u,
                                              {
                                                key: 0,
                                                modelValue: $.value[t].value,
                                                "onUpdate:modelValue": (e) =>
                                                  ($.value[t].value = e),
                                                maxlength:
                                                  null == (l = $.value[t])
                                                    ? void 0
                                                    : l.maxLength,
                                                placeholder:
                                                  $.value[t].description[m(M)],
                                                rows: 4,
                                                "show-word-limit": !!(null ==
                                                (a = $.value[t])
                                                  ? void 0
                                                  : a.maxLength),
                                                type:
                                                  $.value[t].type ===
                                                  m(b).LONG_STRING
                                                    ? "textarea"
                                                    : "text",
                                                clearable: "",
                                                resize: "none",
                                                size: "default",
                                              },
                                              null,
                                              8,
                                              [
                                                "modelValue",
                                                "onUpdate:modelValue",
                                                "maxlength",
                                                "placeholder",
                                                "show-word-limit",
                                                "type",
                                              ],
                                            ))
                                          : V("", !0),
                                        $.value[t].type === m(b).OPTIONS
                                          ? (n(),
                                            s(
                                              B,
                                              {
                                                key: 1,
                                                modelValue: $.value[t].value,
                                                "onUpdate:modelValue": (e) =>
                                                  ($.value[t].value = e),
                                                placeholder:
                                                  $.value[t].description[m(M)],
                                              },
                                              {
                                                default: p(() => [
                                                  (n(!0),
                                                  o(
                                                    v,
                                                    null,
                                                    d(
                                                      $.value[t].options,
                                                      (e) => (
                                                        n(),
                                                        s(
                                                          w,
                                                          {
                                                            key: e.value,
                                                            label:
                                                              e.label[m(M)],
                                                            value: e.value,
                                                          },
                                                          null,
                                                          8,
                                                          ["label", "value"],
                                                        )
                                                      ),
                                                    ),
                                                    128,
                                                  )),
                                                ]),
                                                _: 2,
                                              },
                                              1032,
                                              [
                                                "modelValue",
                                                "onUpdate:modelValue",
                                                "placeholder",
                                              ],
                                            ))
                                          : V("", !0),
                                        $.value[t].type === m(b).NUMBER
                                          ? (n(),
                                            s(
                                              u,
                                              {
                                                key: 2,
                                                modelValue: $.value[t].value,
                                                "onUpdate:modelValue": (e) =>
                                                  ($.value[t].value = e),
                                                modelModifiers: { trim: !0 },
                                                controls: !1,
                                                placeholder:
                                                  $.value[t].description[m(M)],
                                                onBlur: (e) => G($.value[t]),
                                                onInput: () => {
                                                  var e;
                                                  return ((e, l, a) => {
                                                    const u = $.value[e].value;
                                                    a &&
                                                      u > a &&
                                                      ($.value[e].value = a);
                                                  })(
                                                    t,
                                                    0,
                                                    null == (e = $.value[t])
                                                      ? void 0
                                                      : e.maxLength,
                                                  );
                                                },
                                              },
                                              null,
                                              8,
                                              [
                                                "modelValue",
                                                "onUpdate:modelValue",
                                                "placeholder",
                                                "onBlur",
                                                "onInput",
                                              ],
                                            ))
                                          : V("", !0),
                                        $.value[t].type === m(b).NUMBER_SECTION
                                          ? (n(),
                                            o("div", O, [
                                              f(
                                                I,
                                                {
                                                  prop: `${t}.minValue`,
                                                  rules: A.value(
                                                    $.value[t].maxLength,
                                                  ),
                                                  class: "tw-w-full !tw-mb-0",
                                                },
                                                {
                                                  default: p(() => [
                                                    f(
                                                      u,
                                                      {
                                                        modelValue:
                                                          $.value[t].minValue,
                                                        "onUpdate:modelValue": (
                                                          e,
                                                        ) =>
                                                          ($.value[t].minValue =
                                                            e),
                                                        modelModifiers: {
                                                          trim: !0,
                                                        },
                                                        placeholder:
                                                          $.value[t]
                                                            .description[m(M)],
                                                        class: "tw-w-full",
                                                        onBlur: (e) =>
                                                          G($.value[t]),
                                                      },
                                                      null,
                                                      8,
                                                      [
                                                        "modelValue",
                                                        "onUpdate:modelValue",
                                                        "placeholder",
                                                        "onBlur",
                                                      ],
                                                    ),
                                                  ]),
                                                  _: 2,
                                                },
                                                1032,
                                                ["prop", "rules"],
                                              ),
                                              c(
                                                "span",
                                                null,
                                                h(e.$t("base.to")),
                                                1,
                                              ),
                                              f(
                                                I,
                                                {
                                                  prop: `${t}.maxValue`,
                                                  rules: A.value(
                                                    $.value[t].maxLength,
                                                  ),
                                                  class: "tw-w-full !tw-mb-0",
                                                },
                                                {
                                                  default: p(() => [
                                                    f(
                                                      u,
                                                      {
                                                        modelValue:
                                                          $.value[t].maxValue,
                                                        "onUpdate:modelValue": (
                                                          e,
                                                        ) =>
                                                          ($.value[t].maxValue =
                                                            e),
                                                        modelModifiers: {
                                                          trim: !0,
                                                        },
                                                        placeholder:
                                                          $.value[t]
                                                            .description[m(M)],
                                                        class: "tw-w-full",
                                                        onBlur: (e) =>
                                                          G($.value[t]),
                                                      },
                                                      null,
                                                      8,
                                                      [
                                                        "modelValue",
                                                        "onUpdate:modelValue",
                                                        "placeholder",
                                                        "onBlur",
                                                      ],
                                                    ),
                                                  ]),
                                                  _: 2,
                                                },
                                                1032,
                                                ["prop", "rules"],
                                              ),
                                            ]))
                                          : V("", !0),
                                        $.value[t].type === m(b).FILE
                                          ? (n(),
                                            o("div", _, [
                                              c(
                                                "input",
                                                {
                                                  ref_for: !0,
                                                  ref_key: "selectFileRef",
                                                  ref: q,
                                                  multiple: !1,
                                                  class: "tw-hidden",
                                                  type: "file",
                                                  onChange: (e) =>
                                                    ((e, l) => {
                                                      const a =
                                                        e.target.files[0].path;
                                                      a && (l.value = a);
                                                    })(e, $.value[t]),
                                                },
                                                null,
                                                40,
                                                S,
                                              ),
                                              f(
                                                u,
                                                {
                                                  modelValue: $.value[t].value,
                                                  "onUpdate:modelValue": (e) =>
                                                    ($.value[t].value = e),
                                                  placeholder:
                                                    $.value[t].description[
                                                      m(M)
                                                    ],
                                                  resize: "none",
                                                  type: "text",
                                                },
                                                {
                                                  append: p(() => [
                                                    f(
                                                      C,
                                                      {
                                                        type: "primary",
                                                        onClick: z,
                                                      },
                                                      {
                                                        default: p(() => [
                                                          f(L, null, {
                                                            default: p(() => [
                                                              f(m(y)),
                                                            ]),
                                                            _: 1,
                                                          }),
                                                        ]),
                                                        _: 1,
                                                      },
                                                    ),
                                                  ]),
                                                  _: 1,
                                                },
                                                8,
                                                [
                                                  "modelValue",
                                                  "onUpdate:modelValue",
                                                  "placeholder",
                                                ],
                                              ),
                                            ]))
                                          : V("", !0),
                                        $.value[t].type === m(b).ARRAY
                                          ? (n(),
                                            s(
                                              u,
                                              {
                                                key: 5,
                                                modelValue: $.value[t].value,
                                                "onUpdate:modelValue": (e) =>
                                                  ($.value[t].value = e),
                                                placeholder:
                                                  $.value[t].description[m(M)],
                                                rows: 4,
                                                resize: "none",
                                                size: "default",
                                                type: "textarea",
                                                onChange: (e) =>
                                                  ((e) => {
                                                    const l = $.value[e].value;
                                                    if (!l) return;
                                                    let a = l.split("\n");
                                                    ((a = a.filter(
                                                      (e) => "" !== e,
                                                    )),
                                                      ($.value[e].value =
                                                        a.join("\n")));
                                                  })(t),
                                              },
                                              null,
                                              8,
                                              [
                                                "modelValue",
                                                "onUpdate:modelValue",
                                                "placeholder",
                                                "onChange",
                                              ],
                                            ))
                                          : V("", !0),
                                      ]),
                                    ];
                                  }),
                                  _: 2,
                                },
                                1032,
                                ["prop", "required"],
                              )
                            );
                          }),
                          128,
                        )),
                      ]),
                      _: 1,
                    },
                    8,
                    ["model", "rules"],
                  )),
                  [[Y]],
                ),
              ]))
            : V("", !0);
        }
      );
    },
  });
export { B as _ };
