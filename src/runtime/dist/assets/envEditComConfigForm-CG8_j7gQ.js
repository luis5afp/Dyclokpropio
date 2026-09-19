import {
  d as e,
  v as l,
  R as a,
  ad as t,
  W as n,
  V as o,
  dc as s,
  P as i,
  r as u,
  o as d,
  c as r,
  F as p,
  f as v,
  dd as c,
  h as b,
  w as m,
  a as w,
  b as f,
  c2 as g,
  t as y,
  z as x,
  de as T,
  df as C,
  dg as _,
  ct as k,
  e as V,
  X as O,
  di as h,
  cs as $,
  cr as A,
  cq as D,
  cx as B,
  O as E,
  dj as L,
  i as I,
  C as S,
  dk as U,
  ac as q,
  I as G,
} from "./index-BUIbb6Pa.js";
import { C as N } from "./index-C6tOf3zW.js";
import R from "./CustomRadioGroup-Dk-imFdD.js";
import { _ as W } from "./index.vue_vue_type_script_setup_true_lang-CIPUEjpB.js";
import "./Tip.vue_vue_type_script_setup_true_lang-DBJcGLEl.js";
const M = { key: 0, class: "data-async" },
  P = { key: 0, class: "data-async" },
  j = { key: 0, class: "data-async" },
  Y = { key: 0, class: "data-async" },
  F = { class: "s-flex tw-gap-x-1" },
  z = { class: "sle tw-w-[100%] tw-inline-block" },
  H = { key: 0 },
  X = { class: "tw-px-[8px] tw-py-[6px] tw-border-b tw-border-subText" },
  J = { class: "tw-w-[200px] tw-overflow-x-hidden" },
  K = { class: "tw-grid tw-grid-cols-1 tw-gap-y-2 tw-px-[8px] tw-py-[6px]" },
  Q = {
    class:
      "tw-w-[26px] tw-h-[26px] tw-mr-2 tw-rounded-[5px] tw-overflow-hidden tw-flex-shrink-0",
  },
  Z = ["src"],
  ee = { class: "tw-text-black tw-opacity-90 tw-text-[14px] tw-break-all" },
  le = { class: "tw-line-clamp-1" },
  ae = { class: "tw-line-clamp-1 tw-text-[12px]" },
  te = { key: 1 },
  ne = { class: "config-tips tw-leading-[18px] tw-mt-[8px]" },
  oe = e({
    __name: "envEditComConfigForm",
    props: {
      modelValue: {},
      isBatch: { type: Boolean, default: !1 },
      isEdit: { type: Boolean, default: !1 },
      isSingle: { type: Boolean, default: !1 },
      isBulkImport: { type: Boolean, default: !1 },
      batchData: {},
      importData: {},
      showItemArr: { default: () => Object.values(c) },
      activeTabsName: {},
    },
    setup(e) {
      const oe = e;
      let se = I();
      const { t: ie } = l.useI18n(),
        { planTooltipContentText: ue } = a(t()),
        de = I([]),
        re = S(() =>
          de.value.filter((e) => {
            var l;
            return (
              (null == (l = se.value) ? void 0 : l.extensionsGroupId) === e.id
            );
          }),
        ),
        pe = S(() => {
          var e, l, a;
          return (
            (null ==
            (a =
              null == (l = null == (e = re.value) ? void 0 : e[0])
                ? void 0
                : l.extensionsList)
              ? void 0
              : a.length) || 0
          );
        }),
        ve = S(() => {
          var e, l;
          let a =
              null == (l = null == (e = re.value) ? void 0 : e[0])
                ? void 0
                : l.extensionsList,
            t = [],
            n = [];
          return (
            null == a ||
              a.forEach((e) => {
                e.status === L.ENABLED ? t.push(e) : n.push(e);
              }),
            (t = t.sort(
              (e, l) =>
                new Date(l.createTime).getTime() -
                new Date(e.createTime).getTime(),
            )),
            (n = n.sort(
              (e, l) =>
                new Date(l.createTime).getTime() -
                new Date(e.createTime).getTime(),
            )),
            [...t, ...n]
          );
        });
      function ce(e, l) {
        l == T.Extensions &&
          e &&
          U(() => {
            se.value.dataConfigOption = se.value.dataConfigOption.filter(
              (e) => e !== k.Extensions,
            );
          });
      }
      n(
        () => oe.activeTabsName,
        () => {
          (oe.isBatch
            ? (se.value = oe.batchData)
            : oe.isBulkImport
              ? (se.value = oe.importData)
              : (se.value = oe.modelValue),
            q(() => be()));
        },
        { immediate: !0 },
      );
      const be = o.debounce(() => {
          s({ all: !0, detail: !1 }).then((e) => {
            var l, a, t;
            ((de.value = (null == e ? void 0 : e.list) ?? []),
              oe.isEdit ||
                (null == (l = se.value) ? void 0 : l.extensionsGroupId) ||
                (se.value.extensionsGroupId =
                  (null ==
                  (t =
                    null == (a = null == de ? void 0 : de.value)
                      ? void 0
                      : a.find((e) => e.isDefault))
                    ? void 0
                    : t.id) ?? ""));
          });
        }, 1e3),
        me = () => {
          oe.isEdit && (se.value.dataConfigOption = [k.Cookie]);
        },
        we = () => {
          oe.isEdit && (se.value.browserConfigOption = []);
        },
        fe = (e) => {
          var l, a;
          e === B.BAN
            ? (se.value.extensionsGroupId = "")
            : (se.value.extensionsGroupId =
                (null ==
                (a =
                  null == (l = null == de ? void 0 : de.value)
                    ? void 0
                    : l.find((e) => e.isDefault))
                  ? void 0
                  : a.id) ?? "");
        };
      return (
        n(
          () => {
            var e;
            return null == (e = se.value) ? void 0 : e.browserConfigOption;
          },
          (e, l) => {
            if (!l) return;
            const a = l.includes($.disableDiskWrite),
              t = null == e ? void 0 : e.includes($.disableDiskWrite);
            !a &&
              t &&
              G.confirm(
                ie("env.env.req.disableDiskWriteConfirm"),
                ie("env.env.shareDialog.operatorTips"),
                {
                  confirmButtonText: ie("base.confirm"),
                  cancelButtonText: ie("base.cancel"),
                  type: "warning",
                },
              ).catch(() => {
                se.value.browserConfigOption = e.filter(
                  (e) => e !== $.disableDiskWrite,
                );
              });
          },
          { deep: !0 },
        ),
        i(() => {
          t().getOrgPlanInfo();
        }),
        (l, a) => {
          var t, n, o, s, i, I;
          const S = u("el-radio-button"),
            U = u("el-checkbox"),
            q = u("el-tooltip"),
            G = u("el-checkbox-group"),
            ie = u("el-form-item"),
            re = u("ExpansionDefaultAvatar"),
            be = u("el-scrollbar"),
            ge = u("el-dropdown"),
            ye = u("el-option"),
            xe = u("el-select");
          return (
            d(),
            r("div", null, [
              e.isBatch
                ? O("", !0)
                : (d(),
                  r(
                    p,
                    { key: 0 },
                    [
                      (
                        null == (t = e.showItemArr)
                          ? void 0
                          : t.includes(v(c).DataAsync)
                      )
                        ? (d(),
                          b(
                            ie,
                            {
                              key: 0,
                              label: l.$t("env.env.req.dataAsync"),
                              class: "data-async-content",
                            },
                            {
                              default: m(() => [
                                w("div", null, [
                                  f(
                                    R,
                                    {
                                      modelValue: v(se).dataType,
                                      "onUpdate:modelValue":
                                        a[0] ||
                                        (a[0] = (e) => (v(se).dataType = e)),
                                      onChange: me,
                                    },
                                    {
                                      default: m(() => [
                                        f(
                                          S,
                                          {
                                            label: l.$t("setting.globalConfig"),
                                            value: v(g).GLOBAL,
                                          },
                                          null,
                                          8,
                                          ["label", "value"],
                                        ),
                                        f(
                                          S,
                                          {
                                            label: l.$t("env.env.req.custom"),
                                            value: v(g).CUSTOM,
                                          },
                                          null,
                                          8,
                                          ["label", "value"],
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["modelValue"],
                                  ),
                                ]),
                                v(se).dataType === v(g).CUSTOM
                                  ? (d(),
                                    r("div", M, [
                                      w(
                                        "p",
                                        null,
                                        y(l.$t("env.env.req.dataAsyncTips")),
                                        1,
                                      ),
                                      f(
                                        G,
                                        {
                                          modelValue: v(se).dataConfigOption,
                                          "onUpdate:modelValue":
                                            a[1] ||
                                            (a[1] = (e) =>
                                              (v(se).dataConfigOption = e)),
                                        },
                                        {
                                          default: m(() => [
                                            (d(!0),
                                            r(
                                              p,
                                              null,
                                              x(
                                                v(T),
                                                (e, a) => (
                                                  d(),
                                                  b(
                                                    q,
                                                    {
                                                      key: e,
                                                      content: v(ue),
                                                      disabled:
                                                        e === v(T).Cookie ||
                                                        v(C)(
                                                          v(_).CLOUD_DATA_SYNC,
                                                          !1,
                                                        ),
                                                      placement: "top",
                                                    },
                                                    {
                                                      default: m(() => [
                                                        f(
                                                          U,
                                                          {
                                                            onChange: (l) =>
                                                              ce(l, e),
                                                            disabled:
                                                              !v(C)(
                                                                v(_)
                                                                  .CLOUD_DATA_SYNC,
                                                                !1,
                                                              ) &&
                                                              e !== v(T).Cookie,
                                                            label: l.$t(e),
                                                            value: v(k)[a],
                                                          },
                                                          {
                                                            default: m(() => [
                                                              w("div", null, [
                                                                V(
                                                                  y(l.$t(e)) +
                                                                    " ",
                                                                  1,
                                                                ),
                                                                e ===
                                                                v(T).Extensions
                                                                  ? (d(),
                                                                    b(
                                                                      W,
                                                                      {
                                                                        key: 0,
                                                                        content:
                                                                          l.$t(
                                                                            "env.env.req.sync_warning",
                                                                          ),
                                                                        "icon-class":
                                                                          "tw-align-bottom tw-ml-[4px]",
                                                                        icon: "icon-tips",
                                                                      },
                                                                      null,
                                                                      8,
                                                                      [
                                                                        "content",
                                                                      ],
                                                                    ))
                                                                  : O("", !0),
                                                              ]),
                                                            ]),
                                                            _: 2,
                                                          },
                                                          1032,
                                                          [
                                                            "onChange",
                                                            "disabled",
                                                            "label",
                                                            "value",
                                                          ],
                                                        ),
                                                      ]),
                                                      _: 2,
                                                    },
                                                    1032,
                                                    ["content", "disabled"],
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
                                    ]))
                                  : O("", !0),
                              ]),
                              _: 1,
                            },
                            8,
                            ["label"],
                          ))
                        : O("", !0),
                      oe.importData
                        ? (d(),
                          b(
                            N,
                            {
                              key: 1,
                              modelValue: oe.importData,
                              "onUpdate:modelValue":
                                a[2] || (a[2] = (e) => (oe.importData = e)),
                            },
                            null,
                            8,
                            ["modelValue"],
                          ))
                        : (d(),
                          b(
                            N,
                            {
                              key: 2,
                              modelValue: oe.modelValue,
                              "onUpdate:modelValue":
                                a[3] || (a[3] = (e) => (oe.modelValue = e)),
                            },
                            null,
                            8,
                            ["modelValue"],
                          )),
                      (
                        null == (n = e.showItemArr)
                          ? void 0
                          : n.includes(v(c).BrowserSettings)
                      )
                        ? (d(),
                          b(
                            ie,
                            {
                              key: 3,
                              label: l.$t("env.env.req.browserSettings"),
                              class: "data-async-content",
                            },
                            {
                              default: m(() => [
                                w("div", null, [
                                  f(
                                    R,
                                    {
                                      modelValue: v(se).browserType,
                                      "onUpdate:modelValue":
                                        a[4] ||
                                        (a[4] = (e) => (v(se).browserType = e)),
                                      onChange: we,
                                    },
                                    {
                                      default: m(() => [
                                        f(
                                          S,
                                          {
                                            label: l.$t("setting.globalConfig"),
                                            value: v(g).GLOBAL,
                                          },
                                          null,
                                          8,
                                          ["label", "value"],
                                        ),
                                        f(
                                          S,
                                          {
                                            label: l.$t("env.env.req.custom"),
                                            value: v(g).CUSTOM,
                                          },
                                          null,
                                          8,
                                          ["label", "value"],
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["modelValue"],
                                  ),
                                ]),
                                v(se).browserType === v(g).CUSTOM
                                  ? (d(),
                                    r("div", P, [
                                      f(
                                        G,
                                        {
                                          modelValue: v(se).browserConfigOption,
                                          "onUpdate:modelValue":
                                            a[5] ||
                                            (a[5] = (e) =>
                                              (v(se).browserConfigOption = e)),
                                        },
                                        {
                                          default: m(() => [
                                            (d(!0),
                                            r(
                                              p,
                                              null,
                                              x(
                                                v(h),
                                                (e, a) => (
                                                  d(),
                                                  r(
                                                    p,
                                                    { key: e },
                                                    [
                                                      [
                                                        v(h).ipCheckErr,
                                                        v(h).disablePassword,
                                                      ].includes(e)
                                                        ? O("", !0)
                                                        : (d(),
                                                          b(
                                                            q,
                                                            {
                                                              key: 0,
                                                              content: v(ue),
                                                              disabled:
                                                                v(C)(
                                                                  v(_)
                                                                    .BROWSER_SETTINGS,
                                                                  !1,
                                                                ) ||
                                                                e ===
                                                                  v(h)
                                                                    .RestorePage,
                                                              placement: "top",
                                                            },
                                                            {
                                                              default: m(() => [
                                                                [
                                                                  v(h)
                                                                    .disableDebugger,
                                                                ].includes(e)
                                                                  ? O("", !0)
                                                                  : (d(),
                                                                    b(
                                                                      U,
                                                                      {
                                                                        key: 0,
                                                                        disabled:
                                                                          !v(C)(
                                                                            v(_)
                                                                              .BROWSER_SETTINGS,
                                                                            !1,
                                                                          ) &&
                                                                          e !==
                                                                            v(h)
                                                                              .RestorePage,
                                                                        label:
                                                                          l.$t(
                                                                            `env.env.req.${e}`,
                                                                          ),
                                                                        value:
                                                                          v($)[
                                                                            a
                                                                          ],
                                                                        class:
                                                                          "tw-flex tw-items-center tw-w-fit",
                                                                      },
                                                                      null,
                                                                      8,
                                                                      [
                                                                        "disabled",
                                                                        "label",
                                                                        "value",
                                                                      ],
                                                                    )),
                                                              ]),
                                                              _: 2,
                                                            },
                                                            1032,
                                                            [
                                                              "content",
                                                              "disabled",
                                                            ],
                                                          )),
                                                    ],
                                                    64,
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
                                    ]))
                                  : O("", !0),
                              ]),
                              _: 1,
                            },
                            8,
                            ["label"],
                          ))
                        : O("", !0),
                    ],
                    64,
                  )),
              e.isBatch
                ? (d(),
                  r(
                    p,
                    { key: 1 },
                    [
                      f(
                        ie,
                        {
                          label: l.$t("env.env.req.dataAsync"),
                          class: "data-async-content",
                        },
                        {
                          default: m(() => [
                            w("div", null, [
                              f(
                                R,
                                {
                                  modelValue: v(se).dataType,
                                  "onUpdate:modelValue":
                                    a[6] ||
                                    (a[6] = (e) => (v(se).dataType = e)),
                                  onChange: me,
                                },
                                {
                                  default: m(() => [
                                    f(
                                      S,
                                      {
                                        label: l.$t("setting.globalConfig"),
                                        value: v(g).GLOBAL,
                                      },
                                      null,
                                      8,
                                      ["label", "value"],
                                    ),
                                    f(
                                      S,
                                      {
                                        label: l.$t("env.env.req.custom"),
                                        value: v(g).CUSTOM,
                                      },
                                      null,
                                      8,
                                      ["label", "value"],
                                    ),
                                  ]),
                                  _: 1,
                                },
                                8,
                                ["modelValue"],
                              ),
                            ]),
                            v(se).dataType === v(g).CUSTOM
                              ? (d(),
                                r("div", j, [
                                  w(
                                    "p",
                                    null,
                                    y(l.$t("env.env.req.dataAsyncTips")),
                                    1,
                                  ),
                                  f(
                                    G,
                                    {
                                      modelValue: v(se).dataConfigOption,
                                      "onUpdate:modelValue":
                                        a[7] ||
                                        (a[7] = (e) =>
                                          (v(se).dataConfigOption = e)),
                                    },
                                    {
                                      default: m(() => [
                                        (d(!0),
                                        r(
                                          p,
                                          null,
                                          x(
                                            v(T),
                                            (e, a) => (
                                              d(),
                                              b(
                                                q,
                                                {
                                                  key: e,
                                                  content: v(ue),
                                                  disabled:
                                                    v(C)(
                                                      v(_).CLOUD_DATA_SYNC,
                                                      !1,
                                                    ) || e === v(T).Cookie,
                                                  placement: "top",
                                                },
                                                {
                                                  default: m(() => [
                                                    f(
                                                      U,
                                                      {
                                                        onChange: (l) =>
                                                          ce(l, e),
                                                        disabled:
                                                          !v(C)(
                                                            v(_)
                                                              .CLOUD_DATA_SYNC,
                                                            !1,
                                                          ) &&
                                                          e !== v(T).Cookie,
                                                        label: l.$t(e),
                                                        value: v(k)[a],
                                                      },
                                                      {
                                                        default: m(() => [
                                                          w("div", null, [
                                                            V(
                                                              y(l.$t(e)) + " ",
                                                              1,
                                                            ),
                                                            e ===
                                                            v(T).Extensions
                                                              ? (d(),
                                                                b(
                                                                  W,
                                                                  {
                                                                    key: 0,
                                                                    content:
                                                                      l.$t(
                                                                        "env.env.req.sync_warning",
                                                                      ),
                                                                    "icon-class":
                                                                      "tw-align-bottom tw-ml-[4px]",
                                                                    icon: "icon-tips",
                                                                  },
                                                                  null,
                                                                  8,
                                                                  ["content"],
                                                                ))
                                                              : O("", !0),
                                                          ]),
                                                        ]),
                                                        _: 2,
                                                      },
                                                      1032,
                                                      [
                                                        "onChange",
                                                        "disabled",
                                                        "label",
                                                        "value",
                                                      ],
                                                    ),
                                                  ]),
                                                  _: 2,
                                                },
                                                1032,
                                                ["content", "disabled"],
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
                                ]))
                              : O("", !0),
                          ]),
                          _: 1,
                        },
                        8,
                        ["label"],
                      ),
                      f(
                        N,
                        {
                          modelValue: oe.batchData,
                          "onUpdate:modelValue":
                            a[8] || (a[8] = (e) => (oe.batchData = e)),
                        },
                        null,
                        8,
                        ["modelValue"],
                      ),
                      f(
                        ie,
                        {
                          label: l.$t("env.env.req.browserSettings"),
                          class: "data-async-content",
                        },
                        {
                          default: m(() => [
                            w("div", null, [
                              f(
                                R,
                                {
                                  modelValue: v(se).browserType,
                                  "onUpdate:modelValue":
                                    a[9] ||
                                    (a[9] = (e) => (v(se).browserType = e)),
                                  onChange: we,
                                },
                                {
                                  default: m(() => [
                                    f(
                                      S,
                                      {
                                        label: l.$t("setting.globalConfig"),
                                        value: v(g).GLOBAL,
                                      },
                                      null,
                                      8,
                                      ["label", "value"],
                                    ),
                                    f(
                                      S,
                                      {
                                        label: l.$t("env.env.req.custom"),
                                        value: v(g).CUSTOM,
                                      },
                                      null,
                                      8,
                                      ["label", "value"],
                                    ),
                                  ]),
                                  _: 1,
                                },
                                8,
                                ["modelValue"],
                              ),
                            ]),
                            v(se).browserType === v(g).CUSTOM
                              ? (d(),
                                r("div", Y, [
                                  f(
                                    G,
                                    {
                                      modelValue: v(se).browserConfigOption,
                                      "onUpdate:modelValue":
                                        a[10] ||
                                        (a[10] = (e) =>
                                          (v(se).browserConfigOption = e)),
                                    },
                                    {
                                      default: m(() => [
                                        (d(!0),
                                        r(
                                          p,
                                          null,
                                          x(
                                            v(h),
                                            (e, a) => (
                                              d(),
                                              r(
                                                p,
                                                { key: e },
                                                [
                                                  [
                                                    v(h).ipCheckErr,
                                                    v(h).disablePassword,
                                                  ].includes(e)
                                                    ? O("", !0)
                                                    : (d(),
                                                      b(
                                                        q,
                                                        {
                                                          key: 0,
                                                          content: v(ue),
                                                          disabled:
                                                            v(C)(
                                                              v(_)
                                                                .BROWSER_SETTINGS,
                                                              !1,
                                                            ) ||
                                                            e ===
                                                              v(h).RestorePage,
                                                          placement: "top",
                                                        },
                                                        {
                                                          default: m(() => [
                                                            [
                                                              v(h)
                                                                .disableDebugger,
                                                            ].includes(e)
                                                              ? O("", !0)
                                                              : (d(),
                                                                b(
                                                                  U,
                                                                  {
                                                                    key: 0,
                                                                    disabled:
                                                                      !v(C)(
                                                                        v(_)
                                                                          .BROWSER_SETTINGS,
                                                                        !1,
                                                                      ) &&
                                                                      e !==
                                                                        v(h)
                                                                          .RestorePage,
                                                                    label: l.$t(
                                                                      `env.env.req.${e}`,
                                                                    ),
                                                                    value:
                                                                      v($)[a],
                                                                    class:
                                                                      "tw-flex tw-items-center tw-w-fit",
                                                                  },
                                                                  null,
                                                                  8,
                                                                  [
                                                                    "disabled",
                                                                    "label",
                                                                    "value",
                                                                  ],
                                                                )),
                                                          ]),
                                                          _: 2,
                                                        },
                                                        1032,
                                                        ["content", "disabled"],
                                                      )),
                                                ],
                                                64,
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
                                ]))
                              : O("", !0),
                          ]),
                          _: 1,
                        },
                        8,
                        ["label"],
                      ),
                    ],
                    64,
                  ))
                : O("", !0),
              (
                null == (o = e.showItemArr)
                  ? void 0
                  : o.includes(v(c).EnvOverOpen)
              )
                ? (d(),
                  b(
                    ie,
                    {
                      key: 2,
                      label: l.$t("setting.envOverOpen"),
                      class: "data-async-content !tw-mb-4",
                    },
                    {
                      default: m(() => [
                        f(
                          R,
                          {
                            modelValue: v(se).envMutilOpenType,
                            "onUpdate:modelValue":
                              a[11] ||
                              (a[11] = (e) => (v(se).envMutilOpenType = e)),
                          },
                          {
                            default: m(() => [
                              f(
                                S,
                                {
                                  label: l.$t("setting.globalConfig"),
                                  value: v(A).GLOBAL,
                                },
                                null,
                                8,
                                ["label", "value"],
                              ),
                              f(
                                S,
                                {
                                  label: l.$t("env.env.req.geoEnable"),
                                  value: v(A).ALLOW,
                                },
                                null,
                                8,
                                ["label", "value"],
                              ),
                              f(
                                S,
                                {
                                  label: l.$t("env.env.req.disable"),
                                  value: v(A).BAN,
                                },
                                null,
                                8,
                                ["label", "value"],
                              ),
                            ]),
                            _: 1,
                          },
                          8,
                          ["modelValue"],
                        ),
                      ]),
                      _: 1,
                    },
                    8,
                    ["label"],
                  ))
                : O("", !0),
              (
                null == (s = e.showItemArr)
                  ? void 0
                  : s.includes(v(c).RemoteInspector)
              )
                ? (d(),
                  b(
                    ie,
                    {
                      key: 3,
                      label: l.$t("setting.remoteInspector"),
                      class: "data-async-content !tw-mb-4",
                    },
                    {
                      default: m(() => [
                        f(
                          R,
                          {
                            modelValue: v(se).remoteInspectorType,
                            "onUpdate:modelValue":
                              a[12] ||
                              (a[12] = (e) => (v(se).remoteInspectorType = e)),
                          },
                          {
                            default: m(() => [
                              f(
                                S,
                                {
                                  label: l.$t("setting.globalConfig"),
                                  value: v(D).GLOBAL,
                                },
                                null,
                                8,
                                ["label", "value"],
                              ),
                              f(
                                S,
                                {
                                  label: l.$t("env.env.req.geoEnable"),
                                  value: v(D).ALLOW,
                                },
                                null,
                                8,
                                ["label", "value"],
                              ),
                              f(
                                S,
                                {
                                  label: l.$t("env.env.req.disable"),
                                  value: v(D).BAN,
                                },
                                null,
                                8,
                                ["label", "value"],
                              ),
                            ]),
                            _: 1,
                          },
                          8,
                          ["modelValue"],
                        ),
                      ]),
                      _: 1,
                    },
                    8,
                    ["label"],
                  ))
                : O("", !0),
              (
                null == (i = e.showItemArr)
                  ? void 0
                  : i.includes(v(c).ExtensionsType)
              )
                ? (d(),
                  b(
                    ie,
                    { key: 4, label: l.$t("expan.tip24") },
                    {
                      default: m(() => [
                        f(
                          R,
                          {
                            modelValue: v(se).extensionsType,
                            "onUpdate:modelValue":
                              a[13] ||
                              (a[13] = (e) => (v(se).extensionsType = e)),
                            onChange: fe,
                          },
                          {
                            default: m(() => [
                              f(
                                S,
                                {
                                  label: l.$t("expan.tip25"),
                                  value: v(B).ALLOW,
                                },
                                null,
                                8,
                                ["label", "value"],
                              ),
                              f(
                                S,
                                {
                                  label: l.$t("env.env.btnClose"),
                                  value: v(B).BAN,
                                },
                                null,
                                8,
                                ["label", "value"],
                              ),
                            ]),
                            _: 1,
                          },
                          8,
                          ["modelValue"],
                        ),
                      ]),
                      _: 1,
                    },
                    8,
                    ["label"],
                  ))
                : O("", !0),
              v(se).extensionsType === v(B).ALLOW &&
              (null == (I = e.showItemArr)
                ? void 0
                : I.includes(v(c).ExtensionsType))
                ? (d(),
                  b(
                    ie,
                    {
                      key: 5,
                      label: l.$t("expan.tip6"),
                      class: "!tw-mb-[52px]",
                    },
                    {
                      default: m(() => [
                        f(
                          xe,
                          {
                            modelValue: v(se).extensionsGroupId,
                            "onUpdate:modelValue":
                              a[14] ||
                              (a[14] = (e) => (v(se).extensionsGroupId = e)),
                            placeholder: l.$t("expan.tip46"),
                          },
                          {
                            label: m(({ label: e }) => [
                              w("div", F, [
                                f(
                                  ge,
                                  { class: "tw-w-[100%]" },
                                  {
                                    dropdown: m(() => [
                                      pe.value
                                        ? (d(),
                                          r("div", H, [
                                            w(
                                              "div",
                                              X,
                                              y(l.$t("expan.tip51")),
                                              1,
                                            ),
                                            f(
                                              be,
                                              { "max-height": "400px" },
                                              {
                                                default: m(() => [
                                                  w("div", J, [
                                                    w("div", K, [
                                                      (d(!0),
                                                      r(
                                                        p,
                                                        null,
                                                        x(
                                                          ve.value,
                                                          (e) => (
                                                            d(),
                                                            r(
                                                              "div",
                                                              {
                                                                key: e.id,
                                                                class: "s-flex",
                                                              },
                                                              [
                                                                w(
                                                                  "span",
                                                                  {
                                                                    class: E([
                                                                      {
                                                                        "tw-bg-[var(--primary-color)]":
                                                                          e.status ===
                                                                          v(L)
                                                                            .ENABLED,
                                                                        "tw-bg-subText":
                                                                          e.status ===
                                                                          v(L)
                                                                            .DISABLED,
                                                                      },
                                                                      "tw-w-[8px] tw-h-[8px] tw-rounded-full tw-flex-shrink-0 tw-mr-2",
                                                                    ]),
                                                                  },
                                                                  null,
                                                                  2,
                                                                ),
                                                                w("div", Q, [
                                                                  e.iconUrl
                                                                    ? (d(),
                                                                      r(
                                                                        "img",
                                                                        {
                                                                          key: 0,
                                                                          src: e.iconUrl,
                                                                          class:
                                                                            "tw-w-full tw-h-full",
                                                                        },
                                                                        null,
                                                                        8,
                                                                        Z,
                                                                      ))
                                                                    : (d(),
                                                                      b(re, {
                                                                        key: 1,
                                                                      })),
                                                                ]),
                                                                w("p", ee, [
                                                                  w(
                                                                    "span",
                                                                    le,
                                                                    y(
                                                                      e.extensionsName,
                                                                    ),
                                                                    1,
                                                                  ),
                                                                  w(
                                                                    "span",
                                                                    ae,
                                                                    y(
                                                                      e.extensionsIntroduce,
                                                                    ),
                                                                    1,
                                                                  ),
                                                                ]),
                                                              ],
                                                            )
                                                          ),
                                                        ),
                                                        128,
                                                      )),
                                                    ]),
                                                  ]),
                                                ]),
                                                _: 1,
                                              },
                                            ),
                                          ]))
                                        : (d(),
                                          r(
                                            "div",
                                            te,
                                            y(l.$t("expan.tip52")),
                                            1,
                                          )),
                                    ]),
                                    default: m(() => [w("span", z, y(e), 1)]),
                                    _: 2,
                                  },
                                  1024,
                                ),
                              ]),
                            ]),
                            default: m(() => [
                              (d(!0),
                              r(
                                p,
                                null,
                                x(de.value, (e) => {
                                  var a;
                                  return (
                                    d(),
                                    b(
                                      ye,
                                      {
                                        key: e.id,
                                        label:
                                          e.name +
                                          ` (${l.$t("expan.tip50", { number: null == (a = e.extensionsList) ? void 0 : a.length })})`,
                                        value: e.id,
                                      },
                                      null,
                                      8,
                                      ["label", "value"],
                                    )
                                  );
                                }),
                                128,
                              )),
                            ]),
                            _: 1,
                          },
                          8,
                          ["modelValue", "placeholder"],
                        ),
                        w("span", ne, y(l.$t("expan.configTips")), 1),
                      ]),
                      _: 1,
                    },
                    8,
                    ["label"],
                  ))
                : O("", !0),
            ])
          );
        }
      );
    },
  });
export { oe as default };
