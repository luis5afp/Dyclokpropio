import {
  d as e,
  V as t,
  ac as l,
  i as a,
  gE as n,
  D as s,
  dl as o,
  E as i,
  A as r,
  P as u,
  ag as d,
  r as p,
  q as c,
  x as v,
  o as x,
  c as w,
  a as f,
  b as m,
  w as y,
  F as h,
  z as g,
  h as k,
  t as b,
  f as _,
  b7 as $,
  h3 as M,
  $ as C,
  X as I,
  gy as T,
  e as D,
  O as L,
  C as A,
  h4 as E,
  _ as N,
} from "./index-BUIbb6Pa.js";
import j from "./expandCard-CWq3GX1Y.js";
import { _ as R } from "./extendMarketAddList.vue_vue_type_script_setup_true_lang-C2ZysF9x.js";
import { _ as U } from "./LazyRow.vue_vue_type_script_setup_true_lang-C9dK0oMf.js";
import "./expansionDefaulAvatar-BAAgU78a.js";
import "./chrome-tool-B5CAdZMC.js";
import "./system-DtbAsiCM.js";
const H = ["element-loading-text"],
  z = { key: 0, class: "tw-w-full tw-h-full s-flex !tw-items-start" },
  V = { class: "tw-truncate tw-pr-[10px]" },
  S = { class: "tw-max-w-[300px]" },
  B = { key: 1 },
  K = {
    class:
      "tw-w-full tw-flex tw-flex-1 tw-h-full tw-flex-col tw-justify-between",
  },
  O = { class: "s-flex tw-gap-x-3 tw-mb-2" },
  W = { key: 0, class: "tw-text-4 tw-mb-3" },
  X = { key: 0, class: "tw-overflow-y-auto tw-h-full tw-pb-[32px]" },
  q = { class: "waterfall-flex" },
  P = { class: "b-flex" },
  F = {
    class:
      "tw-text-[14px] tw-text-textColor-700 s-flex tw-gap-x-1 tw-flex-wrap",
  },
  Z = ["id"],
  G = { class: "tw-text-4 tw-mb-3 tw-max-w-fit" },
  J = { class: "tw-max-w-[300px]" },
  Q = { key: 1, class: "tw-text-4 tw-mb-3" },
  Y = { class: "waterfall-flex tw-mb-8" },
  ee = { class: "b-flex" },
  te = {
    class:
      "tw-text-[14px] tw-text-textColor-700 s-flex tw-gap-x-1 tw-flex-wrap",
  },
  le = ["onClick"],
  ae = ["innerHTML"],
  ne = { key: 2 },
  se = { class: "c-flex tw-flex-col" },
  oe = { class: "tw-mb-[8px] tw-text-subText tw-text-[14px]" },
  ie = ["innerHTML"],
  re = { key: 1, class: "tw-w-full tw-h-full" },
  ue = { key: 0, class: "s-flex tw-gap-x-3 tw-mb-2" },
  de = { class: "c-flex tw-flex-col tw-w-full tw-h-full" },
  pe = { class: "tw-mb-[8px] tw-text-subText tw-text-[14px]" },
  ce = ["innerHTML"],
  ve = N(
    e({
      __name: "expansionMarket",
      setup(e) {
        const N = a(3);
        function ve() {
          const e = window.innerWidth;
          N.value = e < 640 ? 1 : e < 768 ? 2 : 3;
        }
        function xe(e, t) {
          if (!e.length || !t) return [];
          const l = Array.from({ length: t }, () => []);
          return (
            e.forEach((e, a) => {
              l[a % t].push(e);
            }),
            l
          );
        }
        const we = A(() => xe(Ie.value, N.value)),
          fe = a({}),
          me = a(),
          ye = a(!1),
          he = a(),
          ge = a(),
          ke = a(""),
          be = a(""),
          _e = a([]),
          $e = a([]),
          Me = a(null),
          Ce = (e) => {
            e.preventDefault();
          },
          Ie = A(() => {
            var e;
            return null == (e = _e.value)
              ? void 0
              : e.reduce((e, t) => {
                  const l = t.extensions.map((e) => ({
                    ...t,
                    ...e,
                    extensions: void 0,
                    groupName: t.name,
                  }));
                  return e.concat(l);
                }, []);
          }),
          Te = a(""),
          De = t.debounce((e) => {
            var t, a, n;
            if (!Le.value) {
              if (((ye.value = !0), e)) {
                Te.value = e;
                const t =
                    null == (n = he.value)
                      ? void 0
                      : n.querySelector("a.is-active span"),
                  a = he.value;
                if (t && a) {
                  const e = t.getBoundingClientRect(),
                    n = a.getBoundingClientRect(),
                    s = a.scrollTop,
                    o = a.scrollLeft;
                  (e.top >= n.top + s &&
                    e.left >= n.left + o &&
                    e.bottom <= n.top + s + a.clientHeight &&
                    e.right <= n.left + o + a.clientWidth) ||
                    setTimeout(() => {
                      l(() => {
                        t.scrollIntoView({ block: "start", inline: "start" });
                      });
                    });
                }
              } else {
                const e =
                  null ==
                  (a =
                    null == (t = null == $e ? void 0 : $e.value)
                      ? void 0
                      : t[0])
                    ? void 0
                    : a.name;
                e && me.value.scrollTo(`#${e}`);
              }
              ye.value = !1;
            }
          }, 100),
          Le = a(!1),
          Ae = a(""),
          Ee = a(!1),
          Ne = async (e, a) => {
            var n;
            const o = be.value;
            if (
              ("" === Ae.value || "" === o || Ae.value !== o || !0 === a) &&
              ((Ae.value = o),
              await Re(e),
              (Le.value = !!o),
              o ||
                ((_e.value = t.cloneDeep($e.value)),
                (e || void 0 === e) && De("")),
              o)
            ) {
              s.api.trackEvent({
                type: r.SEARCH_EXTENSION,
                params: { keyword: o },
              });
              const a = o.toLowerCase(),
                i = t.cloneDeep($e.value),
                u = new Set(),
                d = [];
              (i
                .map((e) => {
                  const t = [
                    ...e.extensions.filter((e) =>
                      e.extensionsName.toLowerCase().includes(a),
                    ),
                    ...e.extensions.filter((e) =>
                      e.extensionsIntroduce.toLowerCase().includes(a),
                    ),
                  ];
                  return { ...e, extensions: t };
                })
                .filter((e) => e.extensions.length > 0)
                .forEach((e) => {
                  ((e.extensions = e.extensions.filter(
                    (e) =>
                      !u.has(e.extensionsMarketId) &&
                      (u.add(e.extensionsMarketId), !0),
                  )),
                    e.extensions.length > 0 && d.push(e));
                }),
                (_e.value = []),
                l(() => {
                  _e.value = d;
                }),
                (null == (n = _e.value[0]) ? void 0 : n.name) &&
                  !1 !== e &&
                  l(() => {
                    me.value.scrollTo(`#${_e.value[0].name}`);
                  }));
            }
          },
          je = t.debounce(async (e) => {
            var t;
            n(s.isClient)
              ? o()
              : (s.api.trackEvent({
                  type: r.OTHER_CLICK,
                  action: i.CLICK_BTN_ADD_EXTENSION,
                  params: {
                    type: e.source,
                    id: e.extensionsMarketId,
                    name: e.extensionsName,
                  },
                }),
                null == (t = ge.value) || t.open(e));
          }, 100),
          Re = async (e) => {
            try {
              Ee.value = !0;
              const t = await E();
              ((_e.value = t),
                ($e.value = t),
                l(() => {
                  (e || void 0 === e) && De("");
                }));
            } finally {
              Ee.value = !1;
            }
          };
        return (
          u(() => {
            (Re(), ve(), window.addEventListener("resize", ve));
          }),
          d(() => {
            window.removeEventListener("resize", ve);
          }),
          (e, t) => {
            const l = p("el-tooltip"),
              a = p("el-anchor-link"),
              n = p("el-anchor"),
              o = p("el-input"),
              i = p("el-icon"),
              r = p("ThemeImage"),
              u = c("loading");
            return v(
              (x(),
              w(
                "div",
                {
                  class: "tw-h-[calc(100%-63px)]",
                  "element-loading-text": e.$t(
                    "components.table.elementLoadingText",
                  ),
                },
                [
                  _e.value.length || $e.value.length
                    ? (x(),
                      w("div", z, [
                        f(
                          "div",
                          {
                            class: "step tw-h-full tw-overflow-y-auto",
                            ref_key: "anchorBoxRef",
                            ref: he,
                          },
                          [
                            m(
                              n,
                              {
                                bound: 0,
                                container: Me.value,
                                type: "default",
                                onClick: Ce,
                                onChange: _(De),
                                ref_key: "ahchorRef",
                                ref: me,
                              },
                              {
                                default: y(() => {
                                  var e;
                                  return [
                                    (x(!0),
                                    w(
                                      h,
                                      null,
                                      g(
                                        (
                                          null == (e = _e.value)
                                            ? void 0
                                            : e.length
                                        )
                                          ? Le.value
                                            ? $e.value
                                            : _e.value
                                          : $e.value,
                                        (e) => (
                                          x(),
                                          k(
                                            a,
                                            {
                                              key: e.name,
                                              href: `#${e.name.split(" ").join("")}`,
                                            },
                                            {
                                              default: y(() => {
                                                var t;
                                                return [
                                                  (null == (t = e.name)
                                                    ? void 0
                                                    : t.length) >= 15
                                                    ? (x(),
                                                      k(
                                                        l,
                                                        {
                                                          key: 0,
                                                          "hide-after": 0,
                                                          disabled: ye.value,
                                                          placement:
                                                            "top-start",
                                                        },
                                                        {
                                                          content: y(() => [
                                                            f(
                                                              "div",
                                                              S,
                                                              b(e.name),
                                                              1,
                                                            ),
                                                          ]),
                                                          default: y(() => [
                                                            f(
                                                              "div",
                                                              V,
                                                              b(e.name),
                                                              1,
                                                            ),
                                                          ]),
                                                          _: 2,
                                                        },
                                                        1032,
                                                        ["disabled"],
                                                      ))
                                                    : (x(),
                                                      w(
                                                        "span",
                                                        B,
                                                        b(e.name),
                                                        1,
                                                      )),
                                                ];
                                              }),
                                              _: 2,
                                            },
                                            1032,
                                            ["href"],
                                          )
                                        ),
                                      ),
                                      128,
                                    )),
                                  ];
                                }),
                                _: 1,
                              },
                              8,
                              ["container", "onChange"],
                            ),
                          ],
                          512,
                        ),
                        f("div", K, [
                          f("div", null, [
                            f("div", O, [
                              m(
                                o,
                                {
                                  clearable: "",
                                  style: { width: "207px" },
                                  placeholder: e.$t("expan.tip2"),
                                  "prefix-icon": _(M),
                                  modelValue: be.value,
                                  "onUpdate:modelValue":
                                    t[0] || (t[0] = (e) => (be.value = e)),
                                  onKeydown: $(Ne, ["enter"]),
                                  onClear: Ne,
                                },
                                null,
                                8,
                                ["placeholder", "prefix-icon", "modelValue"],
                              ),
                              m(
                                _(C),
                                {
                                  type: "primary",
                                  plain: "",
                                  onClick: t[1] || (t[1] = () => Ne()),
                                },
                                {
                                  default: y(() => [
                                    m(
                                      i,
                                      { size: 18 },
                                      { default: y(() => [m(_(M))]), _: 1 },
                                    ),
                                    f("span", null, b(e.$t("base.search")), 1),
                                  ]),
                                  _: 1,
                                },
                              ),
                            ]),
                            Le.value && _e.value.length
                              ? (x(), w("div", W, b(e.$t("expan.tip76")), 1))
                              : I("", !0),
                          ]),
                          _e.value.length && Le.value
                            ? (x(),
                              w("div", X, [
                                f("div", q, [
                                  (x(!0),
                                  w(
                                    h,
                                    null,
                                    g(
                                      we.value,
                                      (t, l) => (
                                        x(),
                                        w(
                                          "div",
                                          {
                                            key: l,
                                            class: "waterfall-flex-col",
                                          },
                                          [
                                            (x(!0),
                                            w(
                                              h,
                                              null,
                                              g(
                                                t,
                                                (t) => (
                                                  x(),
                                                  w(
                                                    "div",
                                                    {
                                                      key: t.extensionsMarketId,
                                                    },
                                                    [
                                                      m(
                                                        U,
                                                        null,
                                                        {
                                                          default: y(() => [
                                                            m(
                                                              j,
                                                              {
                                                                tooltipDisabled:
                                                                  ye.value,
                                                                cardType:
                                                                  _(T).extend,
                                                                item: {
                                                                  imgUrl:
                                                                    t.iconUrl,
                                                                  title:
                                                                    t.extensionsName,
                                                                  groupName:
                                                                    t.groupName,
                                                                  desc: t.extensionsIntroduce,
                                                                  redDot:
                                                                    t.redDot,
                                                                  id: t.extensionsMarketId,
                                                                },
                                                              },
                                                              {
                                                                footer: y(
                                                                  () => [
                                                                    f(
                                                                      "div",
                                                                      P,
                                                                      [
                                                                        f(
                                                                          "div",
                                                                          F,
                                                                          [
                                                                            f(
                                                                              "span",
                                                                              null,
                                                                              b(
                                                                                e.$t(
                                                                                  "expan.tip67",
                                                                                ),
                                                                              ) +
                                                                                ":",
                                                                              1,
                                                                            ),
                                                                            f(
                                                                              "span",
                                                                              null,
                                                                              b(
                                                                                t.source,
                                                                              ),
                                                                              1,
                                                                            ),
                                                                          ],
                                                                        ),
                                                                        m(
                                                                          _(C),
                                                                          {
                                                                            onClick:
                                                                              (
                                                                                e,
                                                                              ) =>
                                                                                _(
                                                                                  je,
                                                                                )(
                                                                                  t,
                                                                                ),
                                                                            type: t.beAdd
                                                                              ? "info"
                                                                              : "primary",
                                                                            disabled:
                                                                              t.beAdd,
                                                                            loading:
                                                                              ke.value ===
                                                                              `${t.extensionsMarketId}123`,
                                                                            class:
                                                                              "!tw-py-[2px] !tw-h-[32px]",
                                                                            plain:
                                                                              !t.beAdd &&
                                                                              !fe
                                                                                .value[
                                                                                `${t.extensionsMarketId}123`
                                                                              ],
                                                                            size: "small",
                                                                            onMouseenter:
                                                                              (
                                                                                e,
                                                                              ) =>
                                                                                (fe.value[
                                                                                  `${t.extensionsMarketId}123`
                                                                                ] =
                                                                                  !0),
                                                                            onMouseleave:
                                                                              (
                                                                                e,
                                                                              ) =>
                                                                                (fe.value[
                                                                                  `${t.extensionsMarketId}123`
                                                                                ] =
                                                                                  !1),
                                                                          },
                                                                          {
                                                                            default:
                                                                              y(
                                                                                () => [
                                                                                  D(
                                                                                    b(
                                                                                      (
                                                                                        null ==
                                                                                        t
                                                                                          ? void 0
                                                                                          : t.beAdd
                                                                                      )
                                                                                        ? e.$t(
                                                                                            "expan.tip75",
                                                                                          )
                                                                                        : ke.value ===
                                                                                            `${t.extensionsMarketId}123`
                                                                                          ? e.$t(
                                                                                              "expan.tip69",
                                                                                            )
                                                                                          : e.$t(
                                                                                              "expan.tip68",
                                                                                            ),
                                                                                    ),
                                                                                    1,
                                                                                  ),
                                                                                ],
                                                                              ),
                                                                            _: 2,
                                                                          },
                                                                          1032,
                                                                          [
                                                                            "onClick",
                                                                            "type",
                                                                            "disabled",
                                                                            "loading",
                                                                            "plain",
                                                                            "onMouseenter",
                                                                            "onMouseleave",
                                                                          ],
                                                                        ),
                                                                      ],
                                                                    ),
                                                                  ],
                                                                ),
                                                                _: 2,
                                                              },
                                                              1032,
                                                              [
                                                                "tooltipDisabled",
                                                                "cardType",
                                                                "item",
                                                              ],
                                                            ),
                                                          ]),
                                                          _: 2,
                                                        },
                                                        1024,
                                                      ),
                                                    ],
                                                  )
                                                ),
                                              ),
                                              128,
                                            )),
                                          ],
                                        )
                                      ),
                                    ),
                                    128,
                                  )),
                                ]),
                              ]))
                            : I("", !0),
                          _e.value.length && !Le.value
                            ? (x(),
                              w(
                                "div",
                                {
                                  key: 1,
                                  class:
                                    "tw-overflow-y-auto tw-h-full tw-pb-[32px]",
                                  ref_key: "globalContainerRef",
                                  ref: Me,
                                },
                                [
                                  (x(!0),
                                  w(
                                    h,
                                    null,
                                    g(_e.value, (t, a) => {
                                      var n;
                                      return (
                                        x(),
                                        w(
                                          "div",
                                          {
                                            key: a,
                                            id: t.name.split(" ").join(""),
                                          },
                                          [
                                            (null == (n = t.name)
                                              ? void 0
                                              : n.length) >= 50
                                              ? (x(),
                                                k(
                                                  l,
                                                  {
                                                    key: 0,
                                                    "hide-after": 0,
                                                    disabled: ye.value,
                                                    placement: "top-start",
                                                  },
                                                  {
                                                    content: y(() => [
                                                      f("div", J, b(t.name), 1),
                                                    ]),
                                                    default: y(() => {
                                                      var e;
                                                      return [
                                                        f(
                                                          "div",
                                                          G,
                                                          b(
                                                            (null ==
                                                            (e = t.name)
                                                              ? void 0
                                                              : e.slice(
                                                                  0,
                                                                  50,
                                                                )) + "...",
                                                          ),
                                                          1,
                                                        ),
                                                      ];
                                                    }),
                                                    _: 2,
                                                  },
                                                  1032,
                                                  ["disabled"],
                                                ))
                                              : (x(),
                                                w("div", Q, b(t.name), 1)),
                                            f("div", Y, [
                                              (x(!0),
                                              w(
                                                h,
                                                null,
                                                g(
                                                  xe(t.extensions, N.value),
                                                  (l, a) => (
                                                    x(),
                                                    w(
                                                      "div",
                                                      {
                                                        key: a,
                                                        class:
                                                          "waterfall-flex-col",
                                                      },
                                                      [
                                                        (x(!0),
                                                        w(
                                                          h,
                                                          null,
                                                          g(
                                                            l,
                                                            (l) => (
                                                              x(),
                                                              w(
                                                                "div",
                                                                {
                                                                  key: l.extensionsMarketId,
                                                                },
                                                                [
                                                                  m(
                                                                    U,
                                                                    null,
                                                                    {
                                                                      default:
                                                                        y(
                                                                          () => [
                                                                            m(
                                                                              j,
                                                                              {
                                                                                tooltipDisabled:
                                                                                  ye.value,
                                                                                cardType:
                                                                                  _(
                                                                                    T,
                                                                                  )
                                                                                    .extend,
                                                                                item: {
                                                                                  imgUrl:
                                                                                    l.iconUrl,
                                                                                  title:
                                                                                    l.extensionsName,
                                                                                  groupName:
                                                                                    t.name,
                                                                                  desc: l.extensionsIntroduce,
                                                                                  redDot:
                                                                                    l.redDot,
                                                                                  id: l.extensionsMarketId,
                                                                                },
                                                                              },
                                                                              {
                                                                                footer:
                                                                                  y(
                                                                                    () => [
                                                                                      f(
                                                                                        "div",
                                                                                        ee,
                                                                                        [
                                                                                          f(
                                                                                            "div",
                                                                                            te,
                                                                                            [
                                                                                              f(
                                                                                                "span",
                                                                                                null,
                                                                                                b(
                                                                                                  e.$t(
                                                                                                    "expan.tip67",
                                                                                                  ),
                                                                                                ) +
                                                                                                  ":",
                                                                                                1,
                                                                                              ),
                                                                                              f(
                                                                                                "span",
                                                                                                {
                                                                                                  class:
                                                                                                    L(
                                                                                                      l.originalUrl
                                                                                                        ? "hover:tw-underline tw-cursor-pointer"
                                                                                                        : "",
                                                                                                    ),
                                                                                                  onClick:
                                                                                                    (
                                                                                                      e,
                                                                                                    ) =>
                                                                                                      (function (
                                                                                                        e,
                                                                                                      ) {
                                                                                                        if (
                                                                                                          !e
                                                                                                        )
                                                                                                          return;
                                                                                                        const t =
                                                                                                          new URL(
                                                                                                            e,
                                                                                                          );
                                                                                                        (t.searchParams.delete(
                                                                                                          "hl",
                                                                                                        ),
                                                                                                          s.api.openUrl(
                                                                                                            t.toString(),
                                                                                                          ));
                                                                                                      })(
                                                                                                        l.originalUrl ??
                                                                                                          "",
                                                                                                      ),
                                                                                                },
                                                                                                b(
                                                                                                  l.sourceText,
                                                                                                ),
                                                                                                11,
                                                                                                le,
                                                                                              ),
                                                                                            ],
                                                                                          ),
                                                                                          m(
                                                                                            _(
                                                                                              C,
                                                                                            ),
                                                                                            {
                                                                                              onClick:
                                                                                                (
                                                                                                  e,
                                                                                                ) =>
                                                                                                  _(
                                                                                                    je,
                                                                                                  )(
                                                                                                    l,
                                                                                                  ),
                                                                                              type: l.beAdd
                                                                                                ? "info"
                                                                                                : "primary",
                                                                                              disabled:
                                                                                                l.beAdd,
                                                                                              loading:
                                                                                                ke.value ===
                                                                                                `${l.extensionsMarketId}${t.name}`,
                                                                                              class:
                                                                                                "!tw-py-[2px] !tw-h-[32px]",
                                                                                              plain:
                                                                                                !l.beAdd &&
                                                                                                !fe
                                                                                                  .value[
                                                                                                  `${l.extensionsMarketId}${t.name}`
                                                                                                ],
                                                                                              size: "small",
                                                                                              onMouseenter:
                                                                                                (
                                                                                                  e,
                                                                                                ) =>
                                                                                                  (fe.value[
                                                                                                    `${l.extensionsMarketId}${t.name}`
                                                                                                  ] =
                                                                                                    !0),
                                                                                              onMouseleave:
                                                                                                (
                                                                                                  e,
                                                                                                ) =>
                                                                                                  (fe.value[
                                                                                                    `${l.extensionsMarketId}${t.name}`
                                                                                                  ] =
                                                                                                    !1),
                                                                                            },
                                                                                            {
                                                                                              default:
                                                                                                y(
                                                                                                  () => [
                                                                                                    D(
                                                                                                      b(
                                                                                                        (
                                                                                                          null ==
                                                                                                          l
                                                                                                            ? void 0
                                                                                                            : l.beAdd
                                                                                                        )
                                                                                                          ? e.$t(
                                                                                                              "expan.tip75",
                                                                                                            )
                                                                                                          : ke.value ===
                                                                                                              `${l.extensionsMarketId}${t.name}`
                                                                                                            ? e.$t(
                                                                                                                "expan.tip69",
                                                                                                              )
                                                                                                            : e.$t(
                                                                                                                "expan.tip68",
                                                                                                              ),
                                                                                                      ),
                                                                                                      1,
                                                                                                    ),
                                                                                                  ],
                                                                                                ),
                                                                                              _: 2,
                                                                                            },
                                                                                            1032,
                                                                                            [
                                                                                              "onClick",
                                                                                              "type",
                                                                                              "disabled",
                                                                                              "loading",
                                                                                              "plain",
                                                                                              "onMouseenter",
                                                                                              "onMouseleave",
                                                                                            ],
                                                                                          ),
                                                                                        ],
                                                                                      ),
                                                                                    ],
                                                                                  ),
                                                                                _: 2,
                                                                              },
                                                                              1032,
                                                                              [
                                                                                "tooltipDisabled",
                                                                                "cardType",
                                                                                "item",
                                                                              ],
                                                                            ),
                                                                          ],
                                                                        ),
                                                                      _: 2,
                                                                    },
                                                                    1024,
                                                                  ),
                                                                ],
                                                              )
                                                            ),
                                                          ),
                                                          128,
                                                        )),
                                                      ],
                                                    )
                                                  ),
                                                ),
                                                128,
                                              )),
                                            ]),
                                          ],
                                          8,
                                          Z,
                                        )
                                      );
                                    }),
                                    128,
                                  )),
                                  f(
                                    "div",
                                    {
                                      class:
                                        "tw-w-full tw-text-center tw-text-subText tw-text-[14px] tw-mt-4",
                                      innerHTML: e.$t("expan.tip70"),
                                    },
                                    null,
                                    8,
                                    ae,
                                  ),
                                ],
                                512,
                              ))
                            : _e.value.length
                              ? I("", !0)
                              : (x(),
                                w("div", ne, [
                                  f("div", se, [
                                    m(r, {
                                      alt: "",
                                      src: "@/assets/images/notData.png",
                                    }),
                                    f(
                                      "p",
                                      oe,
                                      b(e.$t("components.table.noData")),
                                      1,
                                    ),
                                    f(
                                      "div",
                                      {
                                        class:
                                          "tw-text-center tw-w-full tw-text-[14px] tw-text-subText",
                                        innerHTML: e.$t("expan.tip70"),
                                      },
                                      null,
                                      8,
                                      ie,
                                    ),
                                  ]),
                                ])),
                          t[4] || (t[4] = f("div", null, null, -1)),
                        ]),
                      ]))
                    : (x(),
                      w("div", re, [
                        _e.value.length || $e.value.length
                          ? (x(),
                            w("div", ue, [
                              m(
                                o,
                                {
                                  clearable: "",
                                  style: { width: "207px" },
                                  placeholder: e.$t("expan.tip2"),
                                  "prefix-icon": _(M),
                                  modelValue: be.value,
                                  "onUpdate:modelValue":
                                    t[2] || (t[2] = (e) => (be.value = e)),
                                  onKeydown: $(Ne, ["enter"]),
                                  onClear: Ne,
                                },
                                null,
                                8,
                                ["placeholder", "prefix-icon", "modelValue"],
                              ),
                              m(
                                _(C),
                                {
                                  type: "primary",
                                  plain: "",
                                  onClick: t[3] || (t[3] = () => Ne()),
                                },
                                {
                                  default: y(() => [
                                    m(
                                      i,
                                      { size: 18 },
                                      { default: y(() => [m(_(M))]), _: 1 },
                                    ),
                                    f("span", null, b(e.$t("base.search")), 1),
                                  ]),
                                  _: 1,
                                },
                              ),
                            ]))
                          : I("", !0),
                        f("div", de, [
                          m(r, { alt: "", src: "@/assets/images/notData.png" }),
                          f("p", pe, b(e.$t("components.table.noData")), 1),
                          f(
                            "div",
                            {
                              class:
                                "tw-text-center tw-w-full tw-text-[14px] tw-text-subText",
                              innerHTML: e.$t("expan.tip70"),
                            },
                            null,
                            8,
                            ce,
                          ),
                        ]),
                      ])),
                  m(
                    R,
                    {
                      ref_key: "extendMarketAddListRef",
                      ref: ge,
                      "get-data": () => {
                        Ne(!1, !0);
                      },
                    },
                    null,
                    8,
                    ["get-data"],
                  ),
                ],
                8,
                H,
              )),
              [[u, Ee.value]],
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-9a9ee5de"]],
  );
export { ve as default };
