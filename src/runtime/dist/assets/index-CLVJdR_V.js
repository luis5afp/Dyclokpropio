import {
  d as e,
  v as l,
  r as t,
  o as a,
  h as n,
  w as o,
  ai as i,
  a as r,
  b as s,
  e as u,
  t as d,
  f as c,
  aq as p,
  i as f,
  ap as m,
  b1 as v,
  b2 as g,
  b3 as h,
  b4 as y,
  b5 as w,
  q as b,
  c as k,
  O as x,
  x as V,
  F as _,
  z as C,
  ax as O,
  aj as F,
  b6 as M,
  b7 as A,
  b8 as S,
  b9 as B,
  X as j,
  Y as D,
  aJ as E,
  aX as T,
  ba as $,
  V as I,
  a5 as P,
  _ as R,
  W as U,
  P as q,
  C as L,
  bb as z,
  ac as G,
} from "./index-BUIbb6Pa.js";
import { _ as H } from "./index.vue_vue_type_script_setup_true_lang-8hqXqXGq.js";
const W = { class: "tw-flex tw-justify-between" },
  K = e({
    __name: "filterDrawer",
    emits: ["filterReset", "search"],
    setup(e, { expose: v, emit: g }) {
      let { t: h } = l.useI18n();
      const y = g;
      let w = f(!1);
      const b = () => {
          (y("filterReset"), (w.value = !1), m().showOrHideChat(!0));
        },
        k = () => {
          (y("search"), (w.value = !1), m().showOrHideChat(!0));
        },
        x = () => {
          m().showOrHideChat(!0);
        };
      return (
        v({
          openDrawer: function () {
            w.value = !0;
          },
        }),
        (e, l) => {
          const f = t("el-button"),
            m = t("el-drawer");
          return (
            a(),
            n(
              m,
              {
                modelValue: c(w),
                "onUpdate:modelValue":
                  l[1] || (l[1] = (e) => (p(w) ? (w.value = e) : (w = e))),
                title: c(h)("base.moreFilter"),
                "close-on-press-escape": !1,
                size: "500",
                class: "tw-bg-[var(--bg-light1)]",
                onClose: x,
              },
              {
                footer: o(() => [
                  r("div", W, [
                    s(
                      f,
                      {
                        type: "primary",
                        link: "",
                        onClick: l[0] || (l[0] = (l) => e.$emit("filterReset")),
                      },
                      { default: o(() => [u(d(c(h)("base.reset")), 1)]), _: 1 },
                    ),
                    r("div", null, [
                      s(
                        f,
                        { type: "info", onClick: b },
                        {
                          default: o(() => [u(d(c(h)("base.unFilter")), 1)]),
                          _: 1,
                        },
                      ),
                      s(
                        f,
                        { type: "primary", onClick: k },
                        {
                          default: o(() => [
                            u(d(c(h)("base.immediateFilter")), 1),
                          ]),
                          _: 1,
                        },
                      ),
                    ]),
                  ]),
                ]),
                default: o(() => [i(e.$slots, "filter-form")]),
                _: 3,
              },
              8,
              ["modelValue", "title"],
            )
          );
        }
      );
    },
  }),
  N = { input: v, inputNumber: w, select: y, datePicker: h, treeSelect: g };
function X(e) {
  return Array.isArray(e)
    ? e.map((e) => ("string" == typeof e ? e.trim() : "")).filter(Boolean)
    : [];
}
const J = {
    key: 1,
    class: "input-list tw-flex tw-w-full tw-flex-col tw-gap-[8px]",
  },
  Y = { class: "ig-item" },
  Q = { key: 0, class: "iconfont icon-check" },
  Z = { key: 0, class: "flx-align-center" },
  ee = { class: "tw-flex tw-gap-[4px] tw-flex-wrap tw-w-min" },
  le = R(
    e({
      __name: "filterForm",
      props: {
        labelWidth: { default: 0 },
        modelValue: { default: () => ({}) },
        config: { default: () => [] },
        isInline: { type: Boolean, default: !0 },
        isDrawer: { type: Boolean, default: !1 },
        igActiveMap: { default: () => ({}) },
        igOptionMap: { default: () => ({}) },
        igValue: { default: () => ({}) },
      },
      emits: ["search", "field:change"],
      setup(e, { emit: p }) {
        const { t: m } = l.useI18n(),
          v = $({ render: () => P("i", { class: "iconfont icon-date" }) }),
          g = e,
          h = f({}),
          y = {
            placement: "bottom",
            modifiers: [
              {
                name: "flip",
                enabled: !0,
                options: {
                  fallbackPlacements: ["top"],
                  boundary: "viewport",
                  rootBoundary: "viewport",
                },
              },
              {
                name: "preventOverflow",
                enabled: !0,
                options: { boundary: "viewport", padding: 10, altAxis: !0 },
              },
            ],
          },
          w = {
            placement: "bottom-start",
            modifiers: [
              {
                name: "flip",
                enabled: !1,
                behavior: ["bottom-start", "bottom-end"],
              },
              { name: "preventOverflow", boundariesElement: "viewport" },
            ],
          },
          R = p,
          U = () => R("search"),
          q = (e) => {
            const l = g.modelValue[e];
            return Array.isArray(l) && l.length ? l : [""];
          },
          L = (e) => {
            let l = I.omit(e, [
              "getOptionsFn",
              "customTagRender",
              "customOptionRender",
              "onPopupScroll",
              "trim",
            ]);
            const { el: t, attrs: a, ...n } = l;
            let o = I.omit(n, ["label", "slotName", "span", "show"]);
            a && (o = Object.assign(o, a));
            if (
              (o.hasOwnProperty("disabledDate") &&
                ((o["disabled-date"] = o.disabledDate), delete o.disabledDate),
              "string" == typeof t && "select" === t)
            )
              delete o.options;
            return Object.assign({ clearable: !0 }, o);
          },
          z = (e) => {
            const { el: l, key: t } = e,
              a = ((e) => (l) => {
                R("field:change", e, l);
              })(t);
            let n = { onSearch: U, change: a };
            if ("string" == typeof l)
              switch (l) {
                case "input":
                  Object.assign(n, {
                    clear: () => {
                      (a(""), U());
                    },
                    keydown: (e) => {
                      var l;
                      "Enter" === e.key &&
                        (null == (l = e.target) || l.blur(), U());
                    },
                  });
                  break;
                case "select":
                  const l = (...l) => {
                      var t;
                      (a(...l),
                        null == (t = e.onChange) || t.call(e, ...l),
                        U());
                    },
                    t = (l) => {
                      var t, a;
                      if (l) {
                        if (
                          !e.loadOnMount &&
                          (null == e ? void 0 : e.getOptionsFn) &&
                          ((null == (t = e.options) ? void 0 : t.length) ??
                            0) <= 100
                        ) {
                          h.value[e.key] = !0;
                          const l =
                            null == (a = e.getOptionsFn) ? void 0 : a.call(e);
                          l && "function" == typeof l.finally
                            ? l.finally(() => {
                                h.value[e.key] = !1;
                              })
                            : (h.value[e.key] = !1);
                        }
                      } else
                        (null == e ? void 0 : e.getOptionsFn) &&
                          e.loadOnMount &&
                          e.getOptionsFn();
                    },
                    o = e.multiple
                      ? {
                          visibleChange: t,
                          clear: () => {
                            U();
                          },
                        }
                      : { change: l, visibleChange: t };
                  Object.assign(n, {
                    onSearch: void 0,
                    popupScroll: e.onPopupScroll,
                    ...o,
                  });
                  break;
                case "datePicker":
                  if (null == e ? void 0 : e.emitChange) return;
                  Object.assign(n, {
                    change: (...e) => {
                      (a(...e), U());
                    },
                  });
              }
            return n;
          },
          G = (e) => {
            return (l = e) ? ("string" == typeof l ? (N[l] ?? l) : l) : N.input;
            var l;
          },
          H = (e) => (e && e.startsWith("enum.") ? m(e) : e);
        function W(e) {
          let l = g.config.findIndex((l) => l.key === e.key);
          if ("input" === e.el && l === g.config.length - 1 && !g.isDrawer)
            return P("i", {
              class: "iconfont icon-search tw-text-black tw-text-[16px]",
            });
        }
        function K(e) {
          const l = document.createElement("canvas").getContext("2d");
          if (
            ((l.font = "14px Arial"),
            ["datePicker", "inputGroup"].includes(e.el))
          )
            return "fit-content";
          {
            const t = l.measureText(e.placeholder ?? "").width,
              a = e.width ? parseInt(e.width.replace("px", "")) : 0,
              n = ["select", "inputGroup"].includes(e.el) || W(e) ? 30 : 0;
            return I.max([150, a, t + 30 + n]) + "px";
          }
        }
        function X(e) {
          const l = document.createElement("canvas").getContext("2d");
          l.font = "14px Arial";
          const t = l.measureText(e).width;
          return I.max([150, t + 90]) + "px";
        }
        function le(e, l) {
          g.modelValue[e] = g.modelValue[e].filter((e) => e.id !== l);
        }
        return (l, p) => {
          const f = t("el-date-picker"),
            $ = t("el-input"),
            I = t("el-icon"),
            P = t("el-button"),
            N = t("el-tooltip"),
            te = t("el-dropdown-item"),
            ae = t("el-dropdown-menu"),
            ne = t("el-dropdown"),
            oe = t("el-option"),
            ie = t("el-select"),
            re = t("el-tag"),
            se = t("el-popover"),
            ue = t("el-form-item"),
            de = t("el-form"),
            ce = b("trim"),
            pe = b("prevent-label-click");
          return (
            a(),
            k(
              "div",
              { class: x(["filter-form-wrapper", e.isInline && "isInline"]) },
              [
                V(
                  (a(),
                  n(
                    de,
                    {
                      inline: e.isInline,
                      "label-width": "auto",
                      "label-position": "top",
                      model: e.modelValue,
                      class: "filter-form tw-w-full",
                    },
                    {
                      default: o(() => [
                        i(l.$slots, "header", {}, void 0, !0),
                        (a(!0),
                        k(
                          _,
                          null,
                          C(
                            e.config,
                            (t) => (
                              a(),
                              n(
                                ue,
                                {
                                  key: t.key,
                                  label: e.isDrawer ? t.label : "",
                                  class: x([
                                    "tw-h-fit",
                                    e.isInline && "isInline-item",
                                    null == t ? void 0 : t.class,
                                  ]),
                                  style: O(
                                    `width: ${e.isDrawer ? "100%" : K(t)}`,
                                  ),
                                },
                                F(
                                  {
                                    default: o(() => [
                                      "datePicker" === t.el
                                        ? (a(),
                                          n(
                                            f,
                                            {
                                              key: 0,
                                              modelValue: e.modelValue[t.key],
                                              "onUpdate:modelValue": (l) =>
                                                (e.modelValue[t.key] = l),
                                              dateFormat: t.dateFormat,
                                              disabled: t.disable,
                                              "disabled-date": t.disabledDate,
                                              "end-placeholder":
                                                t.endPlaceholder ||
                                                l.$t("base.createTime"),
                                              format: t.format,
                                              "prefix-icon": v.value,
                                              "start-placeholder":
                                                t.startPlaceholder ||
                                                l.$t("base.createTime"),
                                              timeFormat: t.timeFormat,
                                              type: t.type,
                                              class: x("filter-date-picker"),
                                              "default-time": c(M)(),
                                              "range-separator": "-",
                                              size: "default",
                                              style: { width: "100%" },
                                              "popper-class":
                                                "date-picker-popper",
                                              "popper-options": y,
                                              onChange: (e) => {
                                                return (
                                                  (l = e),
                                                  (a = t.key),
                                                  R("field:change", a, l),
                                                  void U()
                                                );
                                                var l, a;
                                              },
                                            },
                                            null,
                                            8,
                                            [
                                              "modelValue",
                                              "onUpdate:modelValue",
                                              "dateFormat",
                                              "disabled",
                                              "disabled-date",
                                              "end-placeholder",
                                              "format",
                                              "prefix-icon",
                                              "start-placeholder",
                                              "timeFormat",
                                              "type",
                                              "default-time",
                                              "onChange",
                                            ],
                                          ))
                                        : "inputList" === t.el
                                          ? (a(),
                                            k("div", J, [
                                              (a(!0),
                                              k(
                                                _,
                                                null,
                                                C(
                                                  q(t.key),
                                                  (e, l) => (
                                                    a(),
                                                    k(
                                                      "div",
                                                      {
                                                        key: `${t.key}-${l}`,
                                                        class:
                                                          "tw-flex tw-items-center tw-gap-[8px]",
                                                      },
                                                      [
                                                        s(
                                                          $,
                                                          {
                                                            "model-value": e,
                                                            placeholder:
                                                              t.placeholder ||
                                                              c(m)(
                                                                "rpa.task.req.enter",
                                                              ),
                                                            clearable: "",
                                                            onKeydown: A(U, [
                                                              "enter",
                                                            ]),
                                                            "onUpdate:modelValue":
                                                              (e) =>
                                                                ((e, l, t) => {
                                                                  const a = [
                                                                    ...q(e),
                                                                  ];
                                                                  ((a[l] = t),
                                                                    R(
                                                                      "field:change",
                                                                      e,
                                                                      a,
                                                                    ));
                                                                })(t.key, l, e),
                                                          },
                                                          null,
                                                          8,
                                                          [
                                                            "model-value",
                                                            "placeholder",
                                                            "onUpdate:modelValue",
                                                          ],
                                                        ),
                                                        s(
                                                          N,
                                                          {
                                                            content:
                                                              t.removeButtonText ||
                                                              "",
                                                            placement: "top",
                                                            disabled:
                                                              !t.removeButtonText,
                                                          },
                                                          {
                                                            default: o(() => [
                                                              s(
                                                                P,
                                                                {
                                                                  "aria-label":
                                                                    t.removeButtonText,
                                                                  class:
                                                                    "input-list-remove !tw-m-0 tw-shrink-0",
                                                                  circle: "",
                                                                  plain: "",
                                                                  onClick: (
                                                                    e,
                                                                  ) =>
                                                                    ((e, l) => {
                                                                      R(
                                                                        "field:change",
                                                                        e,
                                                                        (function (
                                                                          e,
                                                                          l,
                                                                        ) {
                                                                          const t =
                                                                            e.filter(
                                                                              (
                                                                                e,
                                                                                t,
                                                                              ) =>
                                                                                t !==
                                                                                l,
                                                                            );
                                                                          return t.length
                                                                            ? t
                                                                            : [
                                                                                "",
                                                                              ];
                                                                        })(
                                                                          q(e),
                                                                          l,
                                                                        ),
                                                                      );
                                                                    })(
                                                                      t.key,
                                                                      l,
                                                                    ),
                                                                },
                                                                {
                                                                  default: o(
                                                                    () => [
                                                                      s(
                                                                        I,
                                                                        null,
                                                                        {
                                                                          default:
                                                                            o(
                                                                              () => [
                                                                                s(
                                                                                  c(
                                                                                    S,
                                                                                  ),
                                                                                ),
                                                                              ],
                                                                            ),
                                                                          _: 1,
                                                                        },
                                                                      ),
                                                                    ],
                                                                  ),
                                                                  _: 1,
                                                                },
                                                                8,
                                                                [
                                                                  "aria-label",
                                                                  "onClick",
                                                                ],
                                                              ),
                                                            ]),
                                                            _: 2,
                                                          },
                                                          1032,
                                                          [
                                                            "content",
                                                            "disabled",
                                                          ],
                                                        ),
                                                      ],
                                                    )
                                                  ),
                                                ),
                                                128,
                                              )),
                                              s(
                                                P,
                                                {
                                                  class:
                                                    "input-list-add tw-self-start !tw-m-0",
                                                  link: "",
                                                  type: "primary",
                                                  onClick: (e) => {
                                                    return (
                                                      (l = t.key),
                                                      void R(
                                                        "field:change",
                                                        l,
                                                        ((a = q(l)),
                                                        [...a, ""]),
                                                      )
                                                    );
                                                    var l, a;
                                                  },
                                                },
                                                {
                                                  default: o(() => [
                                                    s(I, null, {
                                                      default: o(() => [
                                                        s(c(B)),
                                                      ]),
                                                      _: 1,
                                                    }),
                                                    r(
                                                      "span",
                                                      null,
                                                      d(t.addButtonText || "+"),
                                                      1,
                                                    ),
                                                  ]),
                                                  _: 2,
                                                },
                                                1032,
                                                ["onClick"],
                                              ),
                                            ]))
                                          : "inputGroup" === t.el
                                            ? (a(),
                                              n(
                                                $,
                                                {
                                                  key: 2,
                                                  modelValue:
                                                    e.igValue[t.key][
                                                      e.igActiveMap[t.key]
                                                    ],
                                                  "onUpdate:modelValue": (l) =>
                                                    (e.igValue[t.key][
                                                      e.igActiveMap[t.key]
                                                    ] = l),
                                                  placeholder:
                                                    e.igOptionMap[t.key][
                                                      e.igActiveMap[t.key]
                                                    ].label || "",
                                                  class:
                                                    "input-group tw-bg-[var(--input-bg-color)] tw-rounded-[8px]",
                                                  style: O({
                                                    width: X(
                                                      e.igOptionMap[t.key][
                                                        e.igActiveMap[t.key]
                                                      ].label || "",
                                                    ),
                                                  }),
                                                  onChange: (e) => {
                                                    return (
                                                      (l = e),
                                                      (a = t.key),
                                                      void (
                                                        g.igActiveMap[a] &&
                                                        R(
                                                          "field:change",
                                                          g.igActiveMap[a],
                                                          l,
                                                        )
                                                      )
                                                    );
                                                    var l, a;
                                                  },
                                                  onKeydown: A(U, ["enter"]),
                                                },
                                                F(
                                                  {
                                                    prefix: o(() => [
                                                      p[0] ||
                                                        (p[0] = r(
                                                          "i",
                                                          {
                                                            class:
                                                              "iconfont icon-search",
                                                          },
                                                          null,
                                                          -1,
                                                        )),
                                                    ]),
                                                    _: 2,
                                                  },
                                                  [
                                                    (t.showSuffix ?? 1)
                                                      ? {
                                                          name: "suffix",
                                                          fn: o(() => [
                                                            s(
                                                              ne,
                                                              {
                                                                placement:
                                                                  "bottom-end",
                                                                "popper-class":
                                                                  "ig-menu",
                                                                trigger:
                                                                  "click",
                                                                onCommand: (
                                                                  e,
                                                                ) =>
                                                                  ((e, l) => {
                                                                    if (
                                                                      !l.igOptions
                                                                    )
                                                                      return "";
                                                                    const t =
                                                                      l.key;
                                                                    ((g.igActiveMap[
                                                                      t
                                                                    ] = e),
                                                                      g.igValue[
                                                                        t
                                                                      ] &&
                                                                        (Object.keys(
                                                                          g
                                                                            .igValue[
                                                                            t
                                                                          ],
                                                                        ).forEach(
                                                                          (
                                                                            e,
                                                                          ) => {
                                                                            R(
                                                                              "field:change",
                                                                              e,
                                                                              "",
                                                                            );
                                                                          },
                                                                        ),
                                                                        (g.igValue[
                                                                          t
                                                                        ] =
                                                                          {})),
                                                                      U());
                                                                  })(e, t),
                                                              },
                                                              {
                                                                dropdown: o(
                                                                  () => [
                                                                    s(
                                                                      ae,
                                                                      {
                                                                        style: {
                                                                          width:
                                                                            "100%",
                                                                        },
                                                                      },
                                                                      {
                                                                        default:
                                                                          o(
                                                                            () => [
                                                                              (a(
                                                                                !0,
                                                                              ),
                                                                              k(
                                                                                _,
                                                                                null,
                                                                                C(
                                                                                  t.igOptions,
                                                                                  (
                                                                                    l,
                                                                                  ) => (
                                                                                    a(),
                                                                                    n(
                                                                                      te,
                                                                                      {
                                                                                        key: l.value,
                                                                                        command:
                                                                                          l.value,
                                                                                      },
                                                                                      {
                                                                                        default:
                                                                                          o(
                                                                                            () => [
                                                                                              r(
                                                                                                "div",
                                                                                                Y,
                                                                                                [
                                                                                                  r(
                                                                                                    "span",
                                                                                                    null,
                                                                                                    d(
                                                                                                      l.label,
                                                                                                    ),
                                                                                                    1,
                                                                                                  ),
                                                                                                  e
                                                                                                    .igActiveMap[
                                                                                                    t
                                                                                                      .key
                                                                                                  ] ===
                                                                                                  l.value
                                                                                                    ? (a(),
                                                                                                      k(
                                                                                                        "i",
                                                                                                        Q,
                                                                                                      ))
                                                                                                    : j(
                                                                                                        "",
                                                                                                        !0,
                                                                                                      ),
                                                                                                ],
                                                                                              ),
                                                                                            ],
                                                                                          ),
                                                                                        _: 2,
                                                                                      },
                                                                                      1032,
                                                                                      [
                                                                                        "command",
                                                                                      ],
                                                                                    )
                                                                                  ),
                                                                                ),
                                                                                128,
                                                                              )),
                                                                            ],
                                                                          ),
                                                                        _: 2,
                                                                      },
                                                                      1024,
                                                                    ),
                                                                  ],
                                                                ),
                                                                default: o(
                                                                  () => [
                                                                    s(
                                                                      P,
                                                                      {
                                                                        class:
                                                                          "ig-btn",
                                                                        link: "",
                                                                        type: "info",
                                                                      },
                                                                      {
                                                                        default:
                                                                          o(
                                                                            () => [
                                                                              s(
                                                                                N,
                                                                                {
                                                                                  content:
                                                                                    c(
                                                                                      m,
                                                                                    )(
                                                                                      "base.switchSearchField",
                                                                                    ),
                                                                                  placement:
                                                                                    "top",
                                                                                },
                                                                                {
                                                                                  default:
                                                                                    o(
                                                                                      () => [
                                                                                        ...(p[1] ||
                                                                                          (p[1] =
                                                                                            [
                                                                                              r(
                                                                                                "i",
                                                                                                {
                                                                                                  class:
                                                                                                    "iconfont icon-screen",
                                                                                                },
                                                                                                null,
                                                                                                -1,
                                                                                              ),
                                                                                            ])),
                                                                                      ],
                                                                                    ),
                                                                                  _: 1,
                                                                                },
                                                                                8,
                                                                                [
                                                                                  "content",
                                                                                ],
                                                                              ),
                                                                            ],
                                                                          ),
                                                                        _: 1,
                                                                      },
                                                                    ),
                                                                  ],
                                                                ),
                                                                _: 2,
                                                              },
                                                              1032,
                                                              ["onCommand"],
                                                            ),
                                                          ]),
                                                          key: "0",
                                                        }
                                                      : void 0,
                                                  ],
                                                ),
                                                1032,
                                                [
                                                  "modelValue",
                                                  "onUpdate:modelValue",
                                                  "placeholder",
                                                  "style",
                                                  "onChange",
                                                ],
                                              ))
                                            : (a(),
                                              n(
                                                N,
                                                {
                                                  key: 3,
                                                  content: t.tooltip ?? "",
                                                  placement: "top",
                                                  disabled: !t.tooltip,
                                                },
                                                {
                                                  default: o(() => [
                                                    r(
                                                      "div",
                                                      {
                                                        class: x([
                                                          "tw-w-full tw-flex",
                                                          (null == t
                                                            ? void 0
                                                            : t.prependConfig) &&
                                                            "prependSelect",
                                                        ]),
                                                      },
                                                      [
                                                        (
                                                          null == t
                                                            ? void 0
                                                            : t.prependConfig
                                                        )
                                                          ? (a(),
                                                            n(
                                                              ie,
                                                              {
                                                                key: 0,
                                                                class:
                                                                  "prepend-select-left !tw-w-[30%]",
                                                                modelValue:
                                                                  e.modelValue[
                                                                    t
                                                                      .prependConfig
                                                                      .key
                                                                  ],
                                                                "onUpdate:modelValue":
                                                                  (l) =>
                                                                    (e.modelValue[
                                                                      t.prependConfig.key
                                                                    ] = l),
                                                                onChange:
                                                                  t
                                                                    .prependConfig
                                                                    .onChange,
                                                              },
                                                              {
                                                                default: o(
                                                                  () => [
                                                                    (a(!0),
                                                                    k(
                                                                      _,
                                                                      null,
                                                                      C(
                                                                        t
                                                                          .prependConfig
                                                                          .options,
                                                                        (
                                                                          e,
                                                                          l,
                                                                        ) => (
                                                                          a(),
                                                                          n(
                                                                            oe,
                                                                            {
                                                                              key: l,
                                                                              label:
                                                                                e.label,
                                                                              value:
                                                                                e.value,
                                                                            },
                                                                            null,
                                                                            8,
                                                                            [
                                                                              "label",
                                                                              "value",
                                                                            ],
                                                                          )
                                                                        ),
                                                                      ),
                                                                      128,
                                                                    )),
                                                                  ],
                                                                ),
                                                                _: 2,
                                                              },
                                                              1032,
                                                              [
                                                                "modelValue",
                                                                "onUpdate:modelValue",
                                                                "onChange",
                                                              ],
                                                            ))
                                                          : j("", !0),
                                                        V(
                                                          (a(),
                                                          n(
                                                            D(G(t.el)),
                                                            E(
                                                              {
                                                                modelValue:
                                                                  e.modelValue[
                                                                    t.key
                                                                  ],
                                                                "onUpdate:modelValue":
                                                                  (l) =>
                                                                    (e.modelValue[
                                                                      t.key
                                                                    ] = l),
                                                                filterable:
                                                                  "select" ===
                                                                  t.el,
                                                                size: "default",
                                                                placeholder:
                                                                  c(m)(
                                                                    "rpa.task.req.enter",
                                                                  ),
                                                                style: {
                                                                  width: (
                                                                    null == t
                                                                      ? void 0
                                                                      : t.prependConfig
                                                                  )
                                                                    ? "0"
                                                                    : "100%",
                                                                },
                                                                class: [
                                                                  "tw-bg-[var(--input-bg-color)]",
                                                                  "tw-flex-1",
                                                                  "tw-rounded-[8px]",
                                                                  W(t) &&
                                                                    "main-icon-input",
                                                                ],
                                                              },
                                                              { ref_for: !0 },
                                                              L(t),
                                                              T(z(t)),
                                                              {
                                                                loading:
                                                                  h.value[
                                                                    t.key
                                                                  ] ||
                                                                  t.loading,
                                                                "popper-options":
                                                                  w,
                                                              },
                                                            ),
                                                            F(
                                                              {
                                                                default: o(
                                                                  () => [
                                                                    "select" ===
                                                                    t.el
                                                                      ? (a(!0),
                                                                        k(
                                                                          _,
                                                                          {
                                                                            key: 0,
                                                                          },
                                                                          C(
                                                                            null ==
                                                                              t
                                                                              ? void 0
                                                                              : t.options,
                                                                            (
                                                                              e,
                                                                              l,
                                                                            ) => (
                                                                              a(),
                                                                              n(
                                                                                oe,
                                                                                {
                                                                                  key: l,
                                                                                  label:
                                                                                    H(
                                                                                      null ==
                                                                                        e
                                                                                        ? void 0
                                                                                        : e.label,
                                                                                    ),
                                                                                  title:
                                                                                    H(
                                                                                      null ==
                                                                                        e
                                                                                        ? void 0
                                                                                        : e.label,
                                                                                    ),
                                                                                  value:
                                                                                    null ==
                                                                                    e
                                                                                      ? void 0
                                                                                      : e.value,
                                                                                },
                                                                                {
                                                                                  default:
                                                                                    o(
                                                                                      () => {
                                                                                        var l,
                                                                                          o;
                                                                                        return [
                                                                                          t.customOptionRender
                                                                                            ? (a(),
                                                                                              n(
                                                                                                D(
                                                                                                  t.customOptionRender(
                                                                                                    e,
                                                                                                  ),
                                                                                                ),
                                                                                                {
                                                                                                  key: 0,
                                                                                                },
                                                                                              ))
                                                                                            : (a(),
                                                                                              k(
                                                                                                _,
                                                                                                {
                                                                                                  key: 1,
                                                                                                },
                                                                                                [
                                                                                                  t.icon
                                                                                                    ? (a(),
                                                                                                      k(
                                                                                                        "div",
                                                                                                        Z,
                                                                                                        [
                                                                                                          r(
                                                                                                            "span",
                                                                                                            null,
                                                                                                            d(
                                                                                                              e.label,
                                                                                                            ),
                                                                                                            1,
                                                                                                          ),
                                                                                                        ],
                                                                                                      ))
                                                                                                    : j(
                                                                                                        "",
                                                                                                        !0,
                                                                                                      ),
                                                                                                  r(
                                                                                                    "div",
                                                                                                    null,
                                                                                                    d(
                                                                                                      (null ==
                                                                                                      (l =
                                                                                                        H(
                                                                                                          null ==
                                                                                                            e
                                                                                                            ? void 0
                                                                                                            : e.label,
                                                                                                        ))
                                                                                                        ? void 0
                                                                                                        : l.length) >
                                                                                                        20
                                                                                                        ? (null ==
                                                                                                          (o =
                                                                                                            H(
                                                                                                              null ==
                                                                                                                e
                                                                                                                ? void 0
                                                                                                                : e.label,
                                                                                                            ))
                                                                                                            ? void 0
                                                                                                            : o.slice(
                                                                                                                0,
                                                                                                                20,
                                                                                                              )) +
                                                                                                            "..."
                                                                                                        : H(
                                                                                                            null ==
                                                                                                              e
                                                                                                              ? void 0
                                                                                                              : e.label,
                                                                                                          ),
                                                                                                    ),
                                                                                                    1,
                                                                                                  ),
                                                                                                ],
                                                                                                64,
                                                                                              )),
                                                                                        ];
                                                                                      },
                                                                                    ),
                                                                                  _: 2,
                                                                                },
                                                                                1032,
                                                                                [
                                                                                  "label",
                                                                                  "title",
                                                                                  "value",
                                                                                ],
                                                                              )
                                                                            ),
                                                                          ),
                                                                          128,
                                                                        ))
                                                                      : j(
                                                                          "",
                                                                          !0,
                                                                        ),
                                                                  ],
                                                                ),
                                                                _: 2,
                                                              },
                                                              [
                                                                t.customTagRender
                                                                  ? {
                                                                      name: "tag",
                                                                      fn: o(
                                                                        () => {
                                                                          var l,
                                                                            i;
                                                                          return [
                                                                            (a(
                                                                              !0,
                                                                            ),
                                                                            k(
                                                                              _,
                                                                              null,
                                                                              C(
                                                                                null ==
                                                                                  (l =
                                                                                    e
                                                                                      .modelValue[
                                                                                      t
                                                                                        .key
                                                                                    ])
                                                                                  ? void 0
                                                                                  : l.slice(
                                                                                      0,
                                                                                      3,
                                                                                    ),
                                                                                (
                                                                                  e,
                                                                                  l,
                                                                                ) => (
                                                                                  a(),
                                                                                  n(
                                                                                    D(
                                                                                      t.customTagRender(
                                                                                        e,
                                                                                      ),
                                                                                    ),
                                                                                    {
                                                                                      key: l,
                                                                                      closable:
                                                                                        "",
                                                                                      onClose:
                                                                                        () =>
                                                                                          le(
                                                                                            t.key,
                                                                                            e.id,
                                                                                          ),
                                                                                    },
                                                                                    null,
                                                                                    40,
                                                                                    [
                                                                                      "onClose",
                                                                                    ],
                                                                                  )
                                                                                ),
                                                                              ),
                                                                              128,
                                                                            )),
                                                                            (null ==
                                                                            (i =
                                                                              e
                                                                                .modelValue[
                                                                                t
                                                                                  .key
                                                                              ])
                                                                              ? void 0
                                                                              : i.length) >
                                                                            3
                                                                              ? (a(),
                                                                                n(
                                                                                  se,
                                                                                  {
                                                                                    key: 0,
                                                                                    "popper-class":
                                                                                      "!tw-max-w-full !tw-w-fit",
                                                                                    trigger:
                                                                                      "click",
                                                                                    placement:
                                                                                      "top",
                                                                                    "show-arrow":
                                                                                      !1,
                                                                                  },
                                                                                  {
                                                                                    reference:
                                                                                      o(
                                                                                        () => [
                                                                                          s(
                                                                                            re,
                                                                                            {
                                                                                              class:
                                                                                                "default-style tw-text-white",
                                                                                              color:
                                                                                                "var(--btn-info-color)",
                                                                                            },
                                                                                            {
                                                                                              default:
                                                                                                o(
                                                                                                  () => {
                                                                                                    var l;
                                                                                                    return [
                                                                                                      u(
                                                                                                        "+" +
                                                                                                          d(
                                                                                                            (null ==
                                                                                                            (l =
                                                                                                              e
                                                                                                                .modelValue[
                                                                                                                t
                                                                                                                  .key
                                                                                                              ])
                                                                                                              ? void 0
                                                                                                              : l.length) -
                                                                                                              3,
                                                                                                          ),
                                                                                                        1,
                                                                                                      ),
                                                                                                    ];
                                                                                                  },
                                                                                                ),
                                                                                              _: 2,
                                                                                            },
                                                                                            1024,
                                                                                          ),
                                                                                        ],
                                                                                      ),
                                                                                    default:
                                                                                      o(
                                                                                        () => [
                                                                                          r(
                                                                                            "div",
                                                                                            ee,
                                                                                            [
                                                                                              (a(
                                                                                                !0,
                                                                                              ),
                                                                                              k(
                                                                                                _,
                                                                                                null,
                                                                                                C(
                                                                                                  e
                                                                                                    .modelValue[
                                                                                                    t
                                                                                                      .key
                                                                                                  ],
                                                                                                  (
                                                                                                    e,
                                                                                                    l,
                                                                                                  ) => (
                                                                                                    a(),
                                                                                                    n(
                                                                                                      D(
                                                                                                        t.customTagRender(
                                                                                                          e,
                                                                                                        ),
                                                                                                      ),
                                                                                                      {
                                                                                                        class:
                                                                                                          "!tw-max-w-full",
                                                                                                        key: l,
                                                                                                        closable:
                                                                                                          "",
                                                                                                        onClose:
                                                                                                          () =>
                                                                                                            le(
                                                                                                              t.key,
                                                                                                              e.id,
                                                                                                            ),
                                                                                                      },
                                                                                                      null,
                                                                                                      40,
                                                                                                      [
                                                                                                        "onClose",
                                                                                                      ],
                                                                                                    )
                                                                                                  ),
                                                                                                ),
                                                                                                128,
                                                                                              )),
                                                                                            ],
                                                                                          ),
                                                                                        ],
                                                                                      ),
                                                                                    _: 2,
                                                                                  },
                                                                                  1024,
                                                                                ))
                                                                              : j(
                                                                                  "",
                                                                                  !0,
                                                                                ),
                                                                          ];
                                                                        },
                                                                      ),
                                                                      key: "0",
                                                                    }
                                                                  : void 0,
                                                              ],
                                                            ),
                                                            1040,
                                                            [
                                                              "modelValue",
                                                              "onUpdate:modelValue",
                                                              "filterable",
                                                              "placeholder",
                                                              "style",
                                                              "class",
                                                              "loading",
                                                            ],
                                                          )),
                                                          [[ce, !1 !== t.trim]],
                                                        ),
                                                      ],
                                                      2,
                                                    ),
                                                  ]),
                                                  _: 2,
                                                },
                                                1032,
                                                ["content", "disabled"],
                                              )),
                                    ]),
                                    _: 2,
                                  },
                                  [
                                    e.isDrawer && t.customLabel
                                      ? {
                                          name: "label",
                                          fn: o(() => [
                                            (a(),
                                            n(
                                              D(
                                                t.customLabel
                                                  ? t.customLabel()
                                                  : t.label,
                                              ),
                                            )),
                                          ]),
                                          key: "0",
                                        }
                                      : void 0,
                                  ],
                                ),
                                1032,
                                ["label", "class", "style"],
                              )
                            ),
                          ),
                          128,
                        )),
                      ]),
                      _: 3,
                    },
                    8,
                    ["inline", "model"],
                  )),
                  [[pe]],
                ),
                i(l.$slots, "operatingBtn", {}, void 0, !0),
              ],
              2,
            )
          );
        };
      },
    }),
    [["__scopeId", "data-v-3b3a80e4"]],
  ),
  te = { key: 0, class: "tw-pt-[6px] tw-w-full tw-flex tw-justify-between" },
  ae = {
    key: 0,
    class:
      "tw-absolute tw-top-[-6px] tw-right-[-6px] c-flex tw-w-[14px] tw-h-[14px] tw-rounded-[50%] tw-bg-[var(--primary-color)] tw-text-[var(--bg-base)] tw-text-[12px]",
  },
  ne = R(
    e({
      __name: "index",
      props: {
        labelWidth: { default: 0 },
        modelValue: { default: () => ({}) },
        config: { default: () => [] },
        autoSearch: { type: Boolean, default: !0 },
        hasSearchBtn: { type: Boolean, default: !0 },
        initialValueFn: { type: Function, default: () => ({}) },
      },
      emits: ["search", "reset", "field:change", "openFiltrate"],
      setup(e, { expose: t, emit: r }) {
        const { t: u } = l.useI18n(),
          p = e;
        let v = f({});
        const g = L(() => {
            let e = y.value.map((e) => e.key);
            return I.reduce(
              p.modelValue,
              (l, t, a) => {
                var n;
                return (
                  ((e.includes(a) &&
                    ![void 0, null].includes(p.modelValue[a]) &&
                    (!Array.isArray(p.modelValue[a]) ||
                      p.modelValue[a].some((e) => e)) &&
                    (!I.has(v.value, a) || v.value[a] !== t)) ||
                    (e.includes(a) &&
                      (null == (n = y.value.filter((e) => e.key === a)[0])
                        ? void 0
                        : n.count))) &&
                    l++,
                  l
                );
              },
              0,
            );
          }),
          h = L(() => p.config.filter((e) => !e.isPackUp)),
          y = L(() => p.config.filter((e) => e.isPackUp)),
          w = f(),
          b = f({}),
          x = f({}),
          V = f({}),
          _ = r;
        const C = () => _("search"),
          O = (e) => {
            var l;
            const t = (function (e = !1) {
              return (e ? y.value : p.config).filter(
                (e) => void 0 === e.show || e.show,
              );
            })(e).reduce(
              (e, l) => (
                (e[l.key] =
                  void 0 !== (null == l ? void 0 : l.defaultValue)
                    ? l.defaultValue
                    : null),
                e
              ),
              {},
            );
            (Object.keys(t).forEach((e) => {
              const l = t[e];
              F(e)(l);
            }),
              z(x.value) ||
                Object.keys(x.value).forEach((e) => {
                  (Object.keys(x.value[e]).forEach((l) => {
                    const { defaultValue: t } = x.value[e][l];
                    _("field:change", l, t);
                  }),
                    (V.value[e] = {}));
                }),
              null == (l = null == p ? void 0 : p.initialValueFn) || l.call(p),
              _("reset"),
              G(() => {
                C();
              }));
          },
          F = (e) => (l) => {
            _("field:change", e, l);
          },
          M = (e, l) => {
            G(() => {
              let t = document.querySelectorAll(
                ".filter-form-wrapper:not(.main-filter-drawer) .filter-date-picker",
              );
              if (t.length)
                for (let a = 0; a < t.length; a++) {
                  let n = t[a].querySelectorAll("input");
                  if (l)
                    (null == e ? void 0 : e.length) &&
                      n.forEach((l) => (l.style.width = e[0] + "px"));
                  else {
                    const l = document.createElement("canvas").getContext("2d");
                    l.font = "14px Arial";
                    const t = l.measureText(
                        (n[0].value || n[0].placeholder) ?? "",
                      ).width,
                      a = l.measureText(
                        (n[1].value || n[1].placeholder) ?? "",
                      ).width;
                    let o = I.max([t, a, ...(e || [])]);
                    n.forEach((e) => (e.style.width = (o ?? 0) + 20 + "px"));
                  }
                }
            });
          };
        function A() {
          var e;
          (m().showOrHideChat(!1),
            null == (e = w.value) || e.openDrawer(),
            _("openFiltrate"));
        }
        function S(e, l) {
          (_("field:change", e, l), M());
        }
        return (
          U(
            () => p.config,
            () => {
              M();
            },
            { deep: !0 },
          ),
          q(() => {
            (p.autoSearch && (O(!1), (v.value = I.cloneDeep(p.modelValue))),
              M(),
              p.config.forEach((e) => {
                e.loadOnMount && e.getOptionsFn && e.getOptionsFn();
              }));
          }),
          (x.value = p.config.reduce((e, { el: l, key: t, igOptions: a }) => {
            if ("inputGroup" !== l || !a) return e;
            const n = a.reduce((e, l) => {
              const { value: a } = l;
              return (
                b.value[t] || (b.value[t] = a),
                V.value[t] || (V.value[t] = {}),
                (e[a] = l),
                e
              );
            }, {});
            return ((e[t] = n), e);
          }, {})),
          t({ changeEleStyle: M }),
          (l, t) =>
            e.config.length
              ? (a(),
                k("div", te, [
                  i(l.$slots, "header", {}, void 0, !0),
                  s(
                    le,
                    {
                      config: h.value,
                      "model-value": e.modelValue,
                      "is-inline": !0,
                      "is-drawer": !1,
                      igActiveMap: b.value,
                      igOptionMap: x.value,
                      igValue: V.value,
                      onSearch: t[1] || (t[1] = (e) => l.$emit("search")),
                      "onField:change": S,
                    },
                    {
                      operatingBtn: o(() => [
                        e.hasSearchBtn
                          ? (a(),
                            n(
                              H,
                              {
                                key: 0,
                                content: c(u)("base.search"),
                                "button-class": "tw-w-[40px] c-flex",
                                icon: "icon-search",
                                onClick: C,
                              },
                              null,
                              8,
                              ["content"],
                            ))
                          : j("", !0),
                        y.value.length
                          ? (a(),
                            n(
                              H,
                              {
                                key: 1,
                                content: c(u)("base.moreFilter"),
                                "button-class":
                                  "tw-relative tw-w-[40px] c-flex",
                                icon: "icon-filter",
                                onClick: A,
                              },
                              {
                                default: o(() => [
                                  g.value
                                    ? (a(), k("div", ae, d(g.value), 1))
                                    : j("", !0),
                                ]),
                                _: 1,
                              },
                              8,
                              ["content"],
                            ))
                          : j("", !0),
                        e.hasSearchBtn
                          ? (a(),
                            n(
                              H,
                              {
                                key: 2,
                                content: c(u)("base.resetFilter"),
                                "button-class": "tw-w-[40px] c-flex",
                                icon: "icon-ClearCache",
                                onClick: t[0] || (t[0] = (e) => O(!1)),
                              },
                              null,
                              8,
                              ["content"],
                            ))
                          : j("", !0),
                        i(l.$slots, "operatingBtn", {}, void 0, !0),
                      ]),
                      _: 3,
                    },
                    8,
                    [
                      "config",
                      "model-value",
                      "igActiveMap",
                      "igOptionMap",
                      "igValue",
                    ],
                  ),
                  s(
                    K,
                    {
                      ref_key: "filterDrawerRef",
                      ref: w,
                      onFilterReset: t[3] || (t[3] = (e) => O(!0)),
                      onSearch: t[4] || (t[4] = (e) => l.$emit("search")),
                    },
                    {
                      "filter-form": o(() => [
                        s(
                          le,
                          {
                            "model-value": e.modelValue,
                            config: y.value,
                            "is-inline": !1,
                            "is-drawer": !0,
                            igActiveMap: b.value,
                            igOptionMap: x.value,
                            igValue: V.value,
                            maxLength: 1e3,
                            errorMessage: c(u)(
                              "proxy.proxy.list.errorMessage",
                              { num: 1e3 },
                            ),
                            class: "main-filter-drawer",
                            onSearch: t[2] || (t[2] = (e) => l.$emit("search")),
                            "onField:change": S,
                          },
                          null,
                          8,
                          [
                            "model-value",
                            "config",
                            "igActiveMap",
                            "igOptionMap",
                            "igValue",
                            "errorMessage",
                          ],
                        ),
                      ]),
                      _: 1,
                    },
                    512,
                  ),
                ]))
              : j("", !0)
        );
      },
    }),
    [["__scopeId", "data-v-df39c152"]],
  );
export { ne as E, X as n };
