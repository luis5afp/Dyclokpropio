import { _ as e } from "./chrome-tool-B5CAdZMC.js";
import {
  d as l,
  v as a,
  gz as t,
  gA as s,
  i as o,
  aQ as n,
  V as i,
  gE as u,
  D as d,
  dl as r,
  gF as p,
  af as v,
  c5 as c,
  a3 as m,
  g_ as x,
  dj as w,
  gN as f,
  fe as b,
  r as g,
  q as I,
  o as h,
  h as _,
  w as y,
  x as k,
  b as V,
  c as T,
  e as D,
  t as N,
  F as U,
  z as R,
  a as P,
  aq as $,
  f as C,
  O as E,
  X as G,
  C as H,
  dc as M,
  ad as q,
} from "./index-BUIbb6Pa.js";
import { g as A } from "./system-DtbAsiCM.js";
const L = { class: "tw-w-full" },
  S = { class: "tw-w-[240px] tw-text-subText" },
  j = { class: "tw-mt-[-5px] tw-flex tw-items-center" },
  F = { class: "tw-leading-[1]" },
  O = { class: "s-flex tw-w-full tw-gap-x-2" },
  z = { class: "tw-text-black tw-max-w-[300px]" },
  B = { class: "tw-text-subText tw-leading-[1] tw-mt-[8px]" },
  Z = { class: "tw-max-w-[300px] tw-whitespace-normal" },
  Q = l({
    __name: "extendMarketAddList",
    props: { getData: { type: Function } },
    setup(l, { expose: Q }) {
      const { t: W } = a.useI18n(),
        { checkAndDownload: X } = t(),
        J = o(!1),
        K = o(!1),
        Y = {
          [s.CUSTOMIZE_PIN]: W("expan.tip62"),
          [s.PIN]: W("expan.tip63"),
          [s.UN_PIN]: W("expan.tip64"),
        },
        ee = o(!1),
        le = o({
          extensionsGroupId: [],
          enable: !1,
          browserHide: !1,
          hideRoleId: ["all"],
          pinType: s.CUSTOMIZE_PIN,
        }),
        ae = o([]),
        te = l,
        se = o(),
        oe = o(),
        { addExpRedDotIds: ne } = n();
      let ie = o(!0);
      const ue = o([]),
        de = H(() => {
          var e;
          const l = [{ label: W("org.member.req.allGroup"), value: "all" }];
          return (
            null == (e = ue.value) ||
              e.map((e) => {
                l.push({ label: e.name, value: e.id });
              }),
            l
          );
        }),
        re = H(() => ({
          extensionsGroupId: [
            {
              validator: (e, l) =>
                0 !== l.length || new Error(W("expan.expandGroupHold")),
              trigger: "change",
            },
          ],
          hideRoleId: [
            { required: !0, message: W("org.member.req.roleIdHolder") },
          ],
        })),
        pe = (e) => {
          "all" === e.at(-1)
            ? (le.value.hideRoleId = ["all"])
            : e.includes("all") &&
              e.length > 1 &&
              (le.value.hideRoleId = e.filter((e) => "all" !== e));
        },
        ve = H(() => q().currentPlan),
        ce = i.debounce(() => {
          var e;
          u(d.isClient)
            ? r()
            : null == (e = se.value) ||
              e.validate(async (e) => {
                var l, a, t, s, o, n, i;
                try {
                  if (e) {
                    K.value = !0;
                    const e = await p();
                    if (
                      ((null == (l = null == ve ? void 0 : ve.value)
                        ? void 0
                        : l.timeLimit) ?? 0) < 0 &&
                      e.data.addPermission.hasNum >= 3
                    )
                      return void v();
                    if (
                      e.data.addPermission.hasNum >=
                      e.data.addPermission.limitNum
                    ) {
                      const l =
                        e.data.addPermission.planType === c.Free
                          ? W("expan.tip42", {
                              number: e.data.addPermission.limitNum,
                            })
                          : W("expan.tip43");
                      return void m.warning(l);
                    }
                    const u = await x({
                      extensionsMarketId: oe.value.extensionsMarketId,
                      extensionsGroupIds: le.value.extensionsGroupId,
                      status: le.value.enable ? w.ENABLED : w.DISABLED,
                      browserHide: le.value.browserHide,
                      hideRoleId: le.value.hideRoleId,
                      pinType: le.value.pinType,
                    });
                    if (0 === u.code) {
                      const e =
                          null == (a = null == u ? void 0 : u.data)
                            ? void 0
                            : a.uniqueId,
                        l =
                          null == (t = null == u ? void 0 : u.data)
                            ? void 0
                            : t.version,
                        d =
                          (null == (s = oe.value) ? void 0 : s.source) ?? null,
                        r =
                          (null == (o = oe.value) ? void 0 : o.downloadUrl) ??
                          null;
                      if (!e)
                        return (
                          (J.value = !1),
                          (K.value = !1),
                          void te.getData()
                        );
                      (le.value.enable && e && d && r
                        ? await X(
                            {
                              expanId: e,
                              source: d,
                              downloadUrl: r,
                              version: l,
                            },
                            async (e, l, a = !0) => {
                              var t;
                              l
                                ? (a ||
                                    (await f(
                                      null == (t = null == u ? void 0 : u.data)
                                        ? void 0
                                        : t.id,
                                      { status: w.DISABLED },
                                    )),
                                  m.success(W("expan.tip74")),
                                  (J.value = !1),
                                  te.getData(),
                                  (K.value = !1))
                                : void 0 !== l &&
                                  b({
                                    title: W("expan.tip56"),
                                    message: W("expan.tip55"),
                                    duration: 5e3,
                                    type: "error",
                                  });
                            },
                          )
                        : (m.success(W("expan.tip74")),
                          (J.value = !1),
                          te.getData(),
                          (K.value = !1)),
                        (null == (n = oe.value) ? void 0 : n.redDot) &&
                          ne(
                            null == (i = oe.value)
                              ? void 0
                              : i.extensionsMarketId,
                          ));
                    }
                  }
                } finally {
                  K.value = !1;
                }
              });
        }, 200);
      return (
        Q({
          open: async (e) => {
            try {
              ((J.value = !0), (ie.value = !0), (ee.value = !0));
              let l = await A({ all: !0 });
              ue.value = l.list.filter((e) => "SUPER_ADMIN" !== e.code);
              let a = await M({ all: !0 });
              ((ae.value = a.list),
                (oe.value = e),
                (le.value.extensionsGroupId = [ae.value[0].id]),
                (le.value.hideRoleId = ["all"]),
                (le.value.browserHide = !1),
                (le.value.pinType = s.CUSTOMIZE_PIN));
            } finally {
              ee.value = !1;
            }
          },
        }),
        (l, a) => {
          const t = g("el-form-item"),
            o = g("el-option"),
            n = g("el-select"),
            i = g("ArrowUp"),
            u = g("el-icon"),
            d = g("el-tooltip"),
            r = g("el-switch"),
            p = g("el-checkbox"),
            v = g("el-form"),
            c = g("el-button"),
            m = g("el-dialog"),
            x = I("loadingV2"),
            w = I("prevent-label-click");
          return (
            h(),
            _(
              m,
              {
                modelValue: J.value,
                "onUpdate:modelValue": a[7] || (a[7] = (e) => (J.value = e)),
                width: "550px",
                title: l.$t("expan.tip1"),
                "close-on-click-modal": !1,
                "close-on-press-escape": !1,
              },
              {
                footer: y(() => [
                  V(
                    c,
                    {
                      type: "info",
                      onClick: a[6] || (a[6] = (e) => (J.value = !1)),
                      class: "tw-w-full",
                    },
                    { default: y(() => [D(N(l.$t("base.cancel")), 1)]), _: 1 },
                  ),
                  V(
                    c,
                    {
                      type: "primary",
                      loading: K.value,
                      onClick: C(ce),
                      class: "tw-w-full",
                    },
                    { default: y(() => [D(N(l.$t("base.confirm")), 1)]), _: 1 },
                    8,
                    ["loading", "onClick"],
                  ),
                ]),
                default: y(() => [
                  k(
                    (h(),
                    _(
                      v,
                      {
                        model: le.value,
                        "label-position": "right",
                        "label-width": "auto",
                        rules: re.value,
                        ref_key: "formRef",
                        ref: se,
                      },
                      {
                        default: y(() => [
                          V(
                            t,
                            { label: l.$t("expan.tip2") },
                            {
                              default: y(() => {
                                var e;
                                return [
                                  k(
                                    (h(),
                                    T("span", L, [
                                      D(
                                        N(
                                          null == (e = oe.value)
                                            ? void 0
                                            : e.extensionsName,
                                        ),
                                        1,
                                      ),
                                    ])),
                                    [[x, ee.value]],
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                            8,
                            ["label"],
                          ),
                          V(
                            t,
                            {
                              label: l.$t("expan.tip6"),
                              required: "",
                              prop: "extensionsGroupId",
                            },
                            {
                              default: y(() => [
                                k(
                                  (h(),
                                  _(
                                    n,
                                    {
                                      modelValue: le.value.extensionsGroupId,
                                      "onUpdate:modelValue":
                                        a[0] ||
                                        (a[0] = (e) =>
                                          (le.value.extensionsGroupId = e)),
                                      filterable: "",
                                      multiple: "",
                                    },
                                    {
                                      default: y(() => [
                                        (h(!0),
                                        T(
                                          U,
                                          null,
                                          R(
                                            ae.value,
                                            (e) => (
                                              h(),
                                              _(
                                                o,
                                                {
                                                  key: e.id,
                                                  label: e.name,
                                                  value: e.id,
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
                                      _: 1,
                                    },
                                    8,
                                    ["modelValue"],
                                  )),
                                  [[x, ee.value]],
                                ),
                                P(
                                  "div",
                                  {
                                    class:
                                      "tw-mt-[20px] s-flex tw-cursor-pointer tw-gap-x-1 tw-text-main",
                                    onClick:
                                      a[1] ||
                                      (a[1] = (e) =>
                                        $(ie)
                                          ? (ie.value = !C(ie))
                                          : (ie = !C(ie))),
                                  },
                                  [
                                    P(
                                      "span",
                                      null,
                                      N(l.$t("menu.setting.top2")),
                                      1,
                                    ),
                                    P(
                                      "div",
                                      {
                                        class: E([
                                          [C(ie) ? "" : "tw-rotate-180"],
                                          "tw-duration-300 c-flex",
                                        ]),
                                      },
                                      [
                                        V(u, null, {
                                          default: y(() => [V(i)]),
                                          _: 1,
                                        }),
                                      ],
                                      2,
                                    ),
                                  ],
                                ),
                              ]),
                              _: 1,
                            },
                            8,
                            ["label"],
                          ),
                          C(ie)
                            ? (h(),
                              T(
                                U,
                                { key: 0 },
                                [
                                  V(
                                    t,
                                    { prop: "pinType", required: "" },
                                    {
                                      label: y(() => [
                                        P(
                                          "span",
                                          null,
                                          N(l.$t("expan.tip61")),
                                          1,
                                        ),
                                        V(
                                          d,
                                          {
                                            "show-arrow": !1,
                                            class: "box-item",
                                            effect: "dark",
                                            placement: "top-start",
                                          },
                                          {
                                            content: y(() => [
                                              P("div", S, [
                                                P(
                                                  "p",
                                                  null,
                                                  N(l.$t("expan.tip65")),
                                                  1,
                                                ),
                                                a[8] ||
                                                  (a[8] = P(
                                                    "div",
                                                    { class: "tw-mt-1" },
                                                    [P("img", { src: e })],
                                                    -1,
                                                  )),
                                              ]),
                                            ]),
                                            default: y(() => [
                                              a[9] ||
                                                (a[9] = P(
                                                  "i",
                                                  {
                                                    class:
                                                      "iconfont icon-help-circle1 tw-text-[18px] tw-pl-[4px] tw-cursor-pointer",
                                                  },
                                                  null,
                                                  -1,
                                                )),
                                            ]),
                                            _: 1,
                                          },
                                        ),
                                      ]),
                                      default: y(() => [
                                        V(
                                          n,
                                          {
                                            modelValue: le.value.pinType,
                                            "onUpdate:modelValue":
                                              a[2] ||
                                              (a[2] = (e) =>
                                                (le.value.pinType = e)),
                                          },
                                          {
                                            default: y(() => [
                                              (h(!0),
                                              T(
                                                U,
                                                null,
                                                R(
                                                  C(s),
                                                  (e) => (
                                                    h(),
                                                    _(
                                                      o,
                                                      {
                                                        key: e,
                                                        label: Y[e],
                                                        value: e,
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
                                            _: 1,
                                          },
                                          8,
                                          ["modelValue"],
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                  ),
                                  V(
                                    t,
                                    {
                                      label: C(W)("expan.hideSettings"),
                                      prop: "enable",
                                    },
                                    {
                                      default: y(() => [
                                        P("div", j, [
                                          V(
                                            r,
                                            {
                                              class: "tw-mr-[10px]",
                                              size: "small",
                                              modelValue: le.value.browserHide,
                                              "onUpdate:modelValue":
                                                a[3] ||
                                                (a[3] = (e) =>
                                                  (le.value.browserHide = e)),
                                            },
                                            null,
                                            8,
                                            ["modelValue"],
                                          ),
                                          P(
                                            "span",
                                            F,
                                            N(C(W)("expan.enableHide")),
                                            1,
                                          ),
                                        ]),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["label"],
                                  ),
                                  le.value.browserHide
                                    ? (h(),
                                      _(
                                        t,
                                        {
                                          key: 0,
                                          label: l.$t("menu.org.roleList"),
                                          prop: "hideRoleId",
                                        },
                                        {
                                          default: y(() => [
                                            k(
                                              (h(),
                                              _(
                                                n,
                                                {
                                                  modelValue:
                                                    le.value.hideRoleId,
                                                  "onUpdate:modelValue":
                                                    a[4] ||
                                                    (a[4] = (e) =>
                                                      (le.value.hideRoleId =
                                                        e)),
                                                  "max-collapse-tags": 3,
                                                  placeholder: l.$t(
                                                    "setting.versionLimitTip12",
                                                  ),
                                                  clearable: "",
                                                  "collapse-tags": "",
                                                  "collapse-tags-tooltip": "",
                                                  multiple: "",
                                                  onChange: pe,
                                                },
                                                {
                                                  default: y(() => [
                                                    (h(!0),
                                                    T(
                                                      U,
                                                      null,
                                                      R(
                                                        de.value,
                                                        (e) => (
                                                          h(),
                                                          _(
                                                            o,
                                                            {
                                                              key: e.value,
                                                              value: e.value,
                                                              label: e.label,
                                                            },
                                                            {
                                                              default: y(() => [
                                                                P("div", O, [
                                                                  P(
                                                                    "span",
                                                                    null,
                                                                    N(e.label),
                                                                    1,
                                                                  ),
                                                                  "all" ===
                                                                  e.value
                                                                    ? (h(),
                                                                      _(
                                                                        d,
                                                                        {
                                                                          key: 0,
                                                                          placement:
                                                                            "top",
                                                                        },
                                                                        {
                                                                          content:
                                                                            y(
                                                                              () => [
                                                                                P(
                                                                                  "div",
                                                                                  z,
                                                                                  N(
                                                                                    l.$t(
                                                                                      "setting.versionLimitTip16",
                                                                                    ),
                                                                                  ),
                                                                                  1,
                                                                                ),
                                                                              ],
                                                                            ),
                                                                          default:
                                                                            y(
                                                                              () => [
                                                                                a[10] ||
                                                                                  (a[10] =
                                                                                    P(
                                                                                      "i",
                                                                                      {
                                                                                        class:
                                                                                          "iconfont icon-help-circle1 tw-cursor-pointer",
                                                                                      },
                                                                                      null,
                                                                                      -1,
                                                                                    )),
                                                                              ],
                                                                            ),
                                                                          _: 1,
                                                                        },
                                                                      ))
                                                                    : G("", !0),
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
                                                    )),
                                                  ]),
                                                  _: 1,
                                                },
                                                8,
                                                ["modelValue", "placeholder"],
                                              )),
                                              [[x, ee.value]],
                                            ),
                                            P(
                                              "div",
                                              B,
                                              N(C(W)("expan.selectMembers")),
                                              1,
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["label"],
                                      ))
                                    : G("", !0),
                                ],
                                64,
                              ))
                            : G("", !0),
                          V(
                            t,
                            { class: "tw-mt-[10px]", label: " " },
                            {
                              default: y(() => [
                                V(
                                  p,
                                  {
                                    modelValue: le.value.enable,
                                    "onUpdate:modelValue":
                                      a[5] ||
                                      (a[5] = (e) => (le.value.enable = e)),
                                  },
                                  {
                                    default: y(() => [
                                      P("div", Z, N(l.$t("expan.tip73")), 1),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["modelValue"],
                                ),
                              ]),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                      8,
                      ["model", "rules"],
                    )),
                    [[w]],
                  ),
                ]),
                _: 1,
              },
              8,
              ["modelValue", "title"],
            )
          );
        }
      );
    },
  });
export { Q as _ };
