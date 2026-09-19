import {
  d as e,
  v as l,
  at as a,
  jX as t,
  jY as r,
  jZ as u,
  V as i,
  r as o,
  q as d,
  o as s,
  c as n,
  b as m,
  w as p,
  a as c,
  x as v,
  h as f,
  f as k,
  e as b,
  t as x,
  X as y,
  F as T,
  z as w,
  O as I,
  b6 as E,
  i as h,
  ba as _,
  C as V,
  D as g,
  dl as $,
  a3 as q,
  E as Y,
  A as D,
  j_ as H,
  j$ as C,
  n as M,
  em as N,
  N as A,
  ak as L,
  k0 as U,
  a5 as W,
} from "./index-BUIbb6Pa.js";
import { T as F } from "./timezone-BMz8A6Hf.js";
import { _ as R } from "./envListDialog.vue_vue_type_style_index_0_lang-2Qz_48rj.js";
const O = { key: 1, class: "tw-ml-[8px]" },
  P = { key: 2, class: "s-flex tw-w-full tw-flex-wrap" },
  Z = { key: 0 },
  j = { key: 0, class: "tw-ml-[8px]" },
  X = { class: "m-l-8" },
  z = { class: "m-t-4" },
  K = { class: "tw-pl-2" },
  S = { class: "tw-text-subText tw-leading-[1.5em] tw-mt-[4px]" },
  B = { class: "m-t-12", style: { display: "flex" } },
  G = { class: "tw-text-[var(--warning-color)]" },
  J = e({
    __name: "editRpaTask",
    emits: ["submit", "cancel"],
    setup(e, { expose: J, emit: Q }) {
      const { t: ee } = l.useI18n(),
        le = Q,
        ae = {
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
        te = a({
          name: [{ required: !0, message: ee("rpa.task.req.taskNameHolder") }],
          timeout: [
            {
              validator: (e, l, a) => {
                l && l < 10
                  ? a(new Error(ee("rpa.task.req.timeoutLimitHolder")))
                  : a();
              },
            },
          ],
          rpaWorkflowId: [
            { required: !0, message: ee("rpa.task.req.rpaWorkflowIdHolder") },
          ],
          envIds: [
            { required: !0, message: ee("rpa.task.req.executionEnvHolder") },
          ],
          executeInterval: [{ required: !0, message: ee("rpaOptions.tip3") }],
          executeNumber: [{ required: !0, message: ee("rpaOptions.tip3") }],
          executeTime: [
            {
              required: !0,
              message: ee("rpa.task.req.executeTimeHolder"),
              trigger: "blur",
            },
          ],
          effectiveTime: [
            { required: !0, message: ee("rpa.task.req.effectiveTimeHolder") },
          ],
        }),
        re = h(),
        ue = _({ render: () => W("i", { class: "iconfont icon-date" }) }),
        ie = (e) => {
          const l = new Date();
          return (e.setDate(e.getDate() + 2), e.getTime() < l.getTime());
        },
        oe = V(() => {
          const e = [];
          return (
            F.data.forEach((l) => {
              "local" !== l.value &&
                e.push({ label: `${l.tz} ${l.gmt}`, value: l.value });
            }),
            e
          );
        }),
        de = {
          name: "",
          remark: "",
          envIds: [],
          rpaWorkflowId: "",
          timeout: null,
          type: u.ONCE,
          executeTimeType: r.IMMEDIATELY,
          timeZone: "Asia/Shanghai",
          executeTime: "",
          executeFrequency: t.EVERYDAY,
          endTimeEffect: "",
          startTimeEffect: "",
          executeInterval: 1,
          executeNumber: 1,
          effectiveTime: null,
        };
      let se = a(i.cloneDeep(de));
      const ne = h(!1),
        me = h(!1),
        pe = h(!1),
        ce = h(!1),
        ve = h([]),
        fe = h(!1),
        ke = h(!1),
        be = h([]),
        xe = h([]),
        ye = h(""),
        Te = h([new Date(), new Date()]),
        we = h(!1),
        Ie = h(),
        Ee = async () => {
          var e;
          ke.value ||
            (g.isClient
              ? ((null == (e = se.envIds) ? void 0 : e.length) ||
                  q.warning(ee("rpa.task.req.executionEnvHolder")),
                Ie.value.validate(async (e) => {
                  if (!e) return;
                  ke.value = !0;
                  let l = i.omitBy(se, (e, l) => !e || "effectiveTime" == l);
                  g.api.trackEvent({
                    type: D.RPA_CLICK,
                    action: Y.CLICK_CREATE_RPA_TASK,
                  });
                  try {
                    if (
                      (l.type === u.REPEAT &&
                        (delete l.executeFrequency,
                        (l.executeIntervalTimeUnit = "MINUTE"),
                        (l.executeTimeType = r.FIXED_TIME),
                        (l.executeInterval = se.executeInterval)),
                      se.id)
                    )
                      (await H(se.id, {
                        ...l,
                        timeout: se.timeout ? se.timeout : 0,
                      }),
                        le(
                          "submit",
                          !1,
                          se.envIds,
                          null == se ? void 0 : se.id,
                          !1,
                          !0,
                          se.type === u.REPEAT
                            ? {
                                interval: l.executeInterval,
                                count: l.executeNumber,
                              }
                            : void 0,
                        ));
                    else {
                      let e = await C({
                        ...l,
                        timeout: se.timeout ? se.timeout : 0,
                      });
                      le(
                        "submit",
                        !0,
                        se.envIds,
                        null == e ? void 0 : e.id,
                        se.executeTimeType === r.IMMEDIATELY &&
                          se.type === u.ONCE,
                        !0,
                        se.type === u.REPEAT
                          ? {
                              interval: l.executeInterval,
                              count: l.executeNumber,
                            }
                          : void 0,
                      );
                    }
                    (he(), we.value && M.push({ name: "taskManage" }));
                  } catch (a) {
                    N(a);
                  } finally {
                    await A(() => {
                      ke.value = !1;
                    });
                  }
                }))
              : $());
        },
        he = () => {
          var e;
          ((ne.value = !1),
            null == (e = Ie.value) || e.resetFields(),
            Object.assign(se, i.cloneDeep(de)),
            delete se.id);
        },
        _e = () => {
          L({ all: !0, detail: !1 }).then((e) => {
            be.value = (null == e ? void 0 : e.list) || [];
          });
        },
        Ve = () => {
          U({ all: !0, detail: !1 }).then((e) => {
            var l;
            ((xe.value =
              null == (l = null == e ? void 0 : e.list)
                ? void 0
                : l.map((e) => ({
                    value: (null == e ? void 0 : e.id) ?? "",
                    label: (null == e ? void 0 : e.name) ?? "",
                  }))),
              xe.value.find((e) => e.value === ye.value) &&
                (se.rpaWorkflowId = ye.value));
          });
        },
        ge = () => {
          let e = se.effectiveTime || ["", ""];
          ((se.startTimeEffect = e[0]), (se.endTimeEffect = e[1]));
        },
        $e = () => {
          Te.value = [new Date(), new Date()];
        },
        qe = () => {
          var e;
          null == (e = re.value) ||
            e.acceptParams(be.value.filter((e) => se.envIds.includes(e.id)));
        },
        Ye = (e) => {
          var l;
          ((se.envIds = e),
            null == (l = Ie.value) || l.validateField(["envIds"]));
        };
      return (
        J({
          acceptParams: (e, l, a, t) => {
            var r, u, i;
            ((me.value = e),
              (fe.value = !1),
              (pe.value = (null == a ? void 0 : a.includes("implement")) ?? !1),
              (ce.value = !!a && "implement-envList" === a),
              null == (r = Ie.value) || r.clearValidate(),
              (we.value = t ?? !1),
              l &&
                (l.id && (se.id = l.id),
                l.name && (se.name = l.name),
                l.remark && (se.remark = l.remark),
                (null == (u = l.envList) ? void 0 : u.length) &&
                  (se.envIds =
                    (null == (i = l.envList)
                      ? void 0
                      : i.map((e) => (null == e ? void 0 : e.envId) ?? "")) ??
                    []),
                l.rpaWorkflowId && (ye.value = l.rpaWorkflowId),
                l.timeout && (se.timeout = l.timeout),
                l.type && (se.type = l.type),
                l.executeTimeType && (se.executeTimeType = l.executeTimeType),
                l.timeZone && (se.timeZone = l.timeZone),
                l.executeTime && (se.executeTime = l.executeTime),
                l.executeFrequency &&
                  (se.executeFrequency = l.executeFrequency),
                l.endTimeEffect && (se.endTimeEffect = l.endTimeEffect),
                l.startTimeEffect && (se.startTimeEffect = l.startTimeEffect),
                (se.effectiveTime =
                  l.startTimeEffect && l.endTimeEffect
                    ? [l.startTimeEffect, l.endTimeEffect]
                    : null),
                (null == l ? void 0 : l.envListData) &&
                  (ve.value = l.envListData),
                l.executeInterval >= 0 &&
                  (se.executeInterval = l.executeInterval),
                (null == l ? void 0 : l.executeNumber) &&
                  (se.executeNumber = l.executeNumber)),
              _e(),
              Ve(),
              (ne.value = !0));
          },
        }),
        (e, l) => {
          const a = o("el-button"),
            i = o("el-form-item"),
            h = o("el-option"),
            _ = o("el-select"),
            V = o("ArrowDown"),
            g = o("el-icon"),
            $ = o("el-input"),
            q = o("el-input-number"),
            Y = o("el-radio-button"),
            D = o("el-radio-group"),
            H = o("el-date-picker"),
            C = o("el-time-picker"),
            M = o("el-form"),
            N = o("el-dialog"),
            A = d("prevent-label-click");
          return (
            s(),
            n(
              T,
              null,
              [
                m(
                  N,
                  {
                    modelValue: ne.value,
                    "onUpdate:modelValue":
                      l[19] || (l[19] = (e) => (ne.value = e)),
                    "close-on-click-modal": !1,
                    "close-on-press-escape": !1,
                    title: `${pe.value ? e.$t("rpaMarket.tip9") : me.value ? e.$t("rpa.task.req.editTask") : e.$t("rpa.task.list.createTask")}`,
                    width: "650px",
                    "align-center": "",
                  },
                  {
                    footer: p(() => [
                      m(
                        a,
                        {
                          type: "info",
                          onClick:
                            l[18] ||
                            (l[18] = () => {
                              (le("cancel"), he());
                            }),
                        },
                        {
                          default: p(() => [b(x(e.$t("base.cancel")), 1)]),
                          _: 1,
                        },
                      ),
                      m(
                        a,
                        { type: "primary", loading: ke.value, onClick: Ee },
                        {
                          default: p(() => [b(x(e.$t("base.confirm")), 1)]),
                          _: 1,
                        },
                        8,
                        ["loading"],
                      ),
                    ]),
                    default: p(() => [
                      c("div", null, [
                        v(
                          (s(),
                          f(
                            M,
                            {
                              ref_key: "ruleFormRef",
                              ref: Ie,
                              model: k(se),
                              rules: te,
                              "label-position": "right",
                              "scroll-to-error": !0,
                              "label-width": "auto",
                            },
                            {
                              default: p(() => [
                                pe.value
                                  ? (s(),
                                    f(
                                      i,
                                      {
                                        key: 0,
                                        label: e.$t(
                                          "rpa.task.req.executionEnv",
                                        ),
                                        prop: "envIds",
                                      },
                                      {
                                        default: p(() => {
                                          var e, l;
                                          return [
                                            ce.value
                                              ? y("", !0)
                                              : (s(),
                                                f(
                                                  a,
                                                  {
                                                    key: 0,
                                                    type: "primary",
                                                    onClick: qe,
                                                  },
                                                  {
                                                    default: p(() => {
                                                      var e;
                                                      return [
                                                        b(
                                                          x(
                                                            (
                                                              null ==
                                                              (e = k(se).envIds)
                                                                ? void 0
                                                                : e.length
                                                            )
                                                              ? k(ee)(
                                                                  "rpa.task.list.reselect",
                                                                )
                                                              : k(ee)(
                                                                  "rpa.task.list.choose",
                                                                ),
                                                          ),
                                                          1,
                                                        ),
                                                      ];
                                                    }),
                                                    _: 1,
                                                  },
                                                )),
                                            (null == (e = k(se).envIds)
                                              ? void 0
                                              : e.length) && !ce.value
                                              ? (s(),
                                                n(
                                                  "span",
                                                  O,
                                                  x(
                                                    k(ee)(
                                                      "rpa.task.list.selected",
                                                    ),
                                                  ) +
                                                    "：" +
                                                    x(
                                                      (null ==
                                                      (l = k(se).envIds)
                                                        ? void 0
                                                        : l.length) +
                                                        k(ee)(
                                                          "cost.plan.dialog.unit",
                                                        ),
                                                    ),
                                                  1,
                                                ))
                                              : (s(),
                                                n("div", P, [
                                                  (s(!0),
                                                  n(
                                                    T,
                                                    null,
                                                    w(
                                                      ve.value,
                                                      (e, l) => (
                                                        s(),
                                                        n("p", { key: e.id }, [
                                                          c(
                                                            "span",
                                                            null,
                                                            x(e.serialNum),
                                                            1,
                                                          ),
                                                          l !==
                                                          ve.value.length - 1
                                                            ? (s(),
                                                              n("span", Z, ","))
                                                            : y("", !0),
                                                        ])
                                                      ),
                                                    ),
                                                    128,
                                                  )),
                                                ])),
                                          ];
                                        }),
                                        _: 1,
                                      },
                                      8,
                                      ["label"],
                                    ))
                                  : y("", !0),
                                pe.value
                                  ? (s(),
                                    f(
                                      i,
                                      {
                                        key: 1,
                                        label: e.$t(
                                          "rpa.task.req.rpaWorkflowId",
                                        ),
                                        prop: "rpaWorkflowId",
                                      },
                                      {
                                        default: p(() => [
                                          m(
                                            _,
                                            {
                                              modelValue: k(se).rpaWorkflowId,
                                              "onUpdate:modelValue":
                                                l[0] ||
                                                (l[0] = (e) =>
                                                  (k(se).rpaWorkflowId = e)),
                                              disabled:
                                                !ce.value &&
                                                !(
                                                  !pe.value ||
                                                  !k(se).rpaWorkflowId
                                                ),
                                              placeholder: e.$t(
                                                "rpa.task.req.rpaWorkflowIdHolder",
                                              ),
                                              clearable: "",
                                              filterable: "",
                                            },
                                            {
                                              default: p(() => [
                                                (s(!0),
                                                n(
                                                  T,
                                                  null,
                                                  w(
                                                    xe.value,
                                                    (e) => (
                                                      s(),
                                                      f(
                                                        h,
                                                        {
                                                          key: e.value,
                                                          label: e.label,
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
                                              _: 1,
                                            },
                                            8,
                                            [
                                              "modelValue",
                                              "disabled",
                                              "placeholder",
                                            ],
                                          ),
                                          pe.value
                                            ? (s(),
                                              n(
                                                "div",
                                                {
                                                  key: 0,
                                                  class:
                                                    "tw-mt-[20px] s-flex tw-cursor-pointer tw-gap-x-1 tw-text-main",
                                                  onClick:
                                                    l[1] ||
                                                    (l[1] = (e) =>
                                                      (fe.value = !fe.value)),
                                                },
                                                [
                                                  c(
                                                    "span",
                                                    null,
                                                    x(
                                                      e.$t("menu.setting.top2"),
                                                    ),
                                                    1,
                                                  ),
                                                  c(
                                                    "div",
                                                    {
                                                      class: I([
                                                        [
                                                          fe.value
                                                            ? "tw-rotate-180"
                                                            : "",
                                                        ],
                                                        "tw-duration-300 c-flex",
                                                      ]),
                                                    },
                                                    [
                                                      m(g, null, {
                                                        default: p(() => [
                                                          m(V),
                                                        ]),
                                                        _: 1,
                                                      }),
                                                    ],
                                                    2,
                                                  ),
                                                ],
                                              ))
                                            : y("", !0),
                                        ]),
                                        _: 1,
                                      },
                                      8,
                                      ["label"],
                                    ))
                                  : y("", !0),
                                !pe.value || fe.value
                                  ? (s(),
                                    n(
                                      T,
                                      { key: 2 },
                                      [
                                        m(
                                          i,
                                          {
                                            label: e.$t(
                                              "rpa.task.list.taskName",
                                            ),
                                            prop: "name",
                                          },
                                          {
                                            default: p(() => [
                                              m(
                                                $,
                                                {
                                                  modelValue: k(se).name,
                                                  "onUpdate:modelValue":
                                                    l[2] ||
                                                    (l[2] = (e) =>
                                                      (k(se).name = e)),
                                                  modelModifiers: { trim: !0 },
                                                  placeholder: e.$t(
                                                    "rpa.task.req.taskNameHolder",
                                                  ),
                                                  clearable: "",
                                                  maxlength: "100",
                                                  "show-word-limit": "",
                                                },
                                                null,
                                                8,
                                                ["modelValue", "placeholder"],
                                              ),
                                            ]),
                                            _: 1,
                                          },
                                          8,
                                          ["label"],
                                        ),
                                        m(
                                          i,
                                          {
                                            label: e.$t("rpa.task.list.remark"),
                                          },
                                          {
                                            default: p(() => [
                                              m(
                                                $,
                                                {
                                                  modelValue: k(se).remark,
                                                  "onUpdate:modelValue":
                                                    l[3] ||
                                                    (l[3] = (e) =>
                                                      (k(se).remark = e)),
                                                  modelModifiers: { trim: !0 },
                                                  maxlength: 500,
                                                  placeholder: e.$t(
                                                    "rpa.task.req.remarkHolder",
                                                  ),
                                                  clearable: "",
                                                  "show-word-limit": "",
                                                },
                                                null,
                                                8,
                                                ["modelValue", "placeholder"],
                                              ),
                                            ]),
                                            _: 1,
                                          },
                                          8,
                                          ["label"],
                                        ),
                                        pe.value
                                          ? y("", !0)
                                          : (s(),
                                            f(
                                              i,
                                              {
                                                key: 0,
                                                label: e.$t(
                                                  "rpa.task.req.rpaWorkflowId",
                                                ),
                                                prop: "rpaWorkflowId",
                                              },
                                              {
                                                default: p(() => [
                                                  m(
                                                    _,
                                                    {
                                                      modelValue:
                                                        k(se).rpaWorkflowId,
                                                      "onUpdate:modelValue":
                                                        l[4] ||
                                                        (l[4] = (e) =>
                                                          (k(se).rpaWorkflowId =
                                                            e)),
                                                      placeholder: e.$t(
                                                        "rpa.task.req.rpaWorkflowIdHolder",
                                                      ),
                                                      clearable: "",
                                                      filterable: "",
                                                    },
                                                    {
                                                      default: p(() => [
                                                        (s(!0),
                                                        n(
                                                          T,
                                                          null,
                                                          w(
                                                            xe.value,
                                                            (e) => (
                                                              s(),
                                                              f(
                                                                h,
                                                                {
                                                                  key: e.value,
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
                                                      ]),
                                                      _: 1,
                                                    },
                                                    8,
                                                    [
                                                      "modelValue",
                                                      "placeholder",
                                                    ],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["label"],
                                            )),
                                        pe.value
                                          ? y("", !0)
                                          : (s(),
                                            f(
                                              i,
                                              {
                                                key: 1,
                                                label: e.$t(
                                                  "rpa.task.req.executionEnv",
                                                ),
                                                prop: "envIds",
                                              },
                                              {
                                                default: p(() => {
                                                  var e, l;
                                                  return [
                                                    m(
                                                      a,
                                                      {
                                                        type: "primary",
                                                        onClick: qe,
                                                      },
                                                      {
                                                        default: p(() => {
                                                          var e;
                                                          return [
                                                            b(
                                                              x(
                                                                (
                                                                  null ==
                                                                  (e =
                                                                    k(
                                                                      se,
                                                                    ).envIds)
                                                                    ? void 0
                                                                    : e.length
                                                                )
                                                                  ? k(ee)(
                                                                      "rpa.task.list.reselect",
                                                                    )
                                                                  : k(ee)(
                                                                      "rpa.task.list.choose",
                                                                    ),
                                                              ),
                                                              1,
                                                            ),
                                                          ];
                                                        }),
                                                        _: 1,
                                                      },
                                                    ),
                                                    (
                                                      null == (e = k(se).envIds)
                                                        ? void 0
                                                        : e.length
                                                    )
                                                      ? (s(),
                                                        n(
                                                          "span",
                                                          j,
                                                          x(
                                                            k(ee)(
                                                              "rpa.task.list.selected",
                                                            ),
                                                          ) +
                                                            "：" +
                                                            x(
                                                              (null ==
                                                              (l = k(se).envIds)
                                                                ? void 0
                                                                : l.length) +
                                                                k(ee)(
                                                                  "cost.plan.dialog.unit",
                                                                ),
                                                            ),
                                                          1,
                                                        ))
                                                      : y("", !0),
                                                  ];
                                                }),
                                                _: 1,
                                              },
                                              8,
                                              ["label"],
                                            )),
                                        m(
                                          i,
                                          {
                                            label: e.$t(
                                              "rpa.task.req.timeoutLimit",
                                            ),
                                            class: "timeout-form-item",
                                            prop: "timeout",
                                          },
                                          {
                                            default: p(() => [
                                              m(
                                                q,
                                                {
                                                  modelValue: k(se).timeout,
                                                  "onUpdate:modelValue":
                                                    l[5] ||
                                                    (l[5] = (e) =>
                                                      (k(se).timeout = e)),
                                                  max: 86400,
                                                  min: 10,
                                                  placeholder:
                                                    e.$t("rpa.task.req.enter"),
                                                  precision: 0,
                                                  "value-on-clear": null,
                                                  "controls-position": "right",
                                                  style: {
                                                    "max-width": "150px",
                                                  },
                                                },
                                                null,
                                                8,
                                                ["modelValue", "placeholder"],
                                              ),
                                              c(
                                                "span",
                                                X,
                                                x(e.$t("rpa.task.req.second")),
                                                1,
                                              ),
                                              c(
                                                "p",
                                                z,
                                                x(
                                                  e.$t(
                                                    "rpa.task.req.timeoutLimitTips",
                                                  ),
                                                ),
                                                1,
                                              ),
                                            ]),
                                            _: 1,
                                          },
                                          8,
                                          ["label"],
                                        ),
                                        m(
                                          i,
                                          {
                                            label: e.$t(
                                              "rpa.task.list.taskType",
                                            ),
                                          },
                                          {
                                            default: p(() => [
                                              m(
                                                D,
                                                {
                                                  modelValue: k(se).type,
                                                  "onUpdate:modelValue":
                                                    l[6] ||
                                                    (l[6] = (e) =>
                                                      (k(se).type = e)),
                                                  disabled: me.value,
                                                  class: "plain",
                                                  onChange:
                                                    l[7] ||
                                                    (l[7] = (e) =>
                                                      (k(se).executeTime = "")),
                                                },
                                                {
                                                  default: p(() => [
                                                    m(
                                                      Y,
                                                      { value: k(u).ONCE },
                                                      {
                                                        default: p(() => [
                                                          b(
                                                            x(
                                                              e.$t(
                                                                "rpa.task.list.disposable",
                                                              ),
                                                            ),
                                                            1,
                                                          ),
                                                        ]),
                                                        _: 1,
                                                      },
                                                      8,
                                                      ["value"],
                                                    ),
                                                    m(
                                                      Y,
                                                      { value: k(u).REPEAT },
                                                      {
                                                        default: p(() => [
                                                          b(
                                                            x(
                                                              e.$t("rpa2.tip1"),
                                                            ),
                                                            1,
                                                          ),
                                                        ]),
                                                        _: 1,
                                                      },
                                                      8,
                                                      ["value"],
                                                    ),
                                                    m(
                                                      Y,
                                                      { value: k(u).CYCLE },
                                                      {
                                                        default: p(() => [
                                                          b(
                                                            x(
                                                              e.$t(
                                                                "rpa.task.list.cycle",
                                                              ),
                                                            ),
                                                            1,
                                                          ),
                                                        ]),
                                                        _: 1,
                                                      },
                                                      8,
                                                      ["value"],
                                                    ),
                                                  ]),
                                                  _: 1,
                                                },
                                                8,
                                                ["modelValue", "disabled"],
                                              ),
                                            ]),
                                            _: 1,
                                          },
                                          8,
                                          ["label"],
                                        ),
                                        k(se).type === k(u).ONCE
                                          ? (s(),
                                            f(
                                              i,
                                              {
                                                key: 2,
                                                label: e.$t(
                                                  "rpa.task.req.executeTimeType",
                                                ),
                                              },
                                              {
                                                default: p(() => [
                                                  m(
                                                    D,
                                                    {
                                                      modelValue:
                                                        k(se).executeTimeType,
                                                      "onUpdate:modelValue":
                                                        l[8] ||
                                                        (l[8] = (e) =>
                                                          (k(
                                                            se,
                                                          ).executeTimeType =
                                                            e)),
                                                      disabled: me.value,
                                                      class: "plain",
                                                    },
                                                    {
                                                      default: p(() => [
                                                        m(
                                                          Y,
                                                          {
                                                            value:
                                                              k(r).IMMEDIATELY,
                                                          },
                                                          {
                                                            default: p(() => [
                                                              b(
                                                                x(
                                                                  e.$t(
                                                                    "rpa.task.list.startImmediately",
                                                                  ),
                                                                ),
                                                                1,
                                                              ),
                                                            ]),
                                                            _: 1,
                                                          },
                                                          8,
                                                          ["value"],
                                                        ),
                                                        m(
                                                          Y,
                                                          {
                                                            value:
                                                              k(r).FIXED_TIME,
                                                          },
                                                          {
                                                            default: p(() => [
                                                              b(
                                                                x(
                                                                  e.$t(
                                                                    "rpa.task.list.timer",
                                                                  ),
                                                                ),
                                                                1,
                                                              ),
                                                            ]),
                                                            _: 1,
                                                          },
                                                          8,
                                                          ["value"],
                                                        ),
                                                      ]),
                                                      _: 1,
                                                    },
                                                    8,
                                                    ["modelValue", "disabled"],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["label"],
                                            ))
                                          : k(se).type === k(u).CYCLE
                                            ? (s(),
                                              f(
                                                i,
                                                {
                                                  key: 3,
                                                  label: e.$t(
                                                    "rpa.task.req.executeFrequency",
                                                  ),
                                                },
                                                {
                                                  default: p(() => [
                                                    m(
                                                      D,
                                                      {
                                                        modelValue:
                                                          k(se)
                                                            .executeFrequency,
                                                        "onUpdate:modelValue":
                                                          l[9] ||
                                                          (l[9] = (e) =>
                                                            (k(
                                                              se,
                                                            ).executeFrequency =
                                                              e)),
                                                        disabled: me.value,
                                                        class: "plain",
                                                      },
                                                      {
                                                        default: p(() => [
                                                          m(
                                                            Y,
                                                            {
                                                              value:
                                                                k(t).EVERYDAY,
                                                            },
                                                            {
                                                              default: p(() => [
                                                                b(
                                                                  x(
                                                                    e.$t(
                                                                      "rpa.task.list.everyDay",
                                                                    ),
                                                                  ),
                                                                  1,
                                                                ),
                                                              ]),
                                                              _: 1,
                                                            },
                                                            8,
                                                            ["value"],
                                                          ),
                                                        ]),
                                                        _: 1,
                                                      },
                                                      8,
                                                      [
                                                        "modelValue",
                                                        "disabled",
                                                      ],
                                                    ),
                                                  ]),
                                                  _: 1,
                                                },
                                                8,
                                                ["label"],
                                              ))
                                            : y("", !0),
                                        (k(se).executeTimeType !=
                                          k(r).FIXED_TIME &&
                                          k(se).type !== k(u).CYCLE) ||
                                        k(se).type === k(u).REPEAT
                                          ? y("", !0)
                                          : (s(),
                                            n(
                                              T,
                                              { key: 4 },
                                              [
                                                m(
                                                  i,
                                                  {
                                                    label: e.$t(
                                                      "rpa.task.logs.executeTime",
                                                    ),
                                                    prop: "executeTime",
                                                  },
                                                  {
                                                    default: p(() => [
                                                      k(se).type === k(u).ONCE
                                                        ? (s(),
                                                          f(
                                                            H,
                                                            {
                                                              key: 0,
                                                              modelValue:
                                                                k(se)
                                                                  .executeTime,
                                                              "onUpdate:modelValue":
                                                                l[10] ||
                                                                (l[10] = (e) =>
                                                                  (k(
                                                                    se,
                                                                  ).executeTime =
                                                                    e)),
                                                              "default-time":
                                                                Te.value[0],
                                                              "disabled-date":
                                                                ie,
                                                              placeholder:
                                                                e.$t(
                                                                  "rpa.task.req.enter",
                                                                ),
                                                              class:
                                                                "!tw-border-0",
                                                              format:
                                                                "YYYY-MM-DD HH:mm",
                                                              "popper-class":
                                                                "effective-time-date-picker",
                                                              "time-format":
                                                                "HH:mm",
                                                              type: "datetime",
                                                              "value-format":
                                                                "YYYY-MM-DD HH:mm",
                                                              onChange: $e,
                                                            },
                                                            null,
                                                            8,
                                                            [
                                                              "modelValue",
                                                              "default-time",
                                                              "placeholder",
                                                            ],
                                                          ))
                                                        : (s(),
                                                          f(
                                                            C,
                                                            {
                                                              key: 1,
                                                              modelValue:
                                                                k(se)
                                                                  .executeTime,
                                                              "onUpdate:modelValue":
                                                                l[11] ||
                                                                (l[11] = (e) =>
                                                                  (k(
                                                                    se,
                                                                  ).executeTime =
                                                                    e)),
                                                              placeholder:
                                                                e.$t(
                                                                  "rpa.task.req.enter",
                                                                ),
                                                              class:
                                                                "!tw-border-0",
                                                              format: "HH:mm",
                                                              "value-format":
                                                                "HH:mm",
                                                            },
                                                            null,
                                                            8,
                                                            [
                                                              "modelValue",
                                                              "placeholder",
                                                            ],
                                                          )),
                                                    ]),
                                                    _: 1,
                                                  },
                                                  8,
                                                  ["label"],
                                                ),
                                                k(se).type === k(u).CYCLE
                                                  ? (s(),
                                                    f(
                                                      i,
                                                      {
                                                        key: 0,
                                                        label: e.$t(
                                                          "rpa.task.req.effectiveTime",
                                                        ),
                                                        prop: "effectiveTime",
                                                      },
                                                      {
                                                        default: p(() => [
                                                          m(
                                                            H,
                                                            {
                                                              modelValue:
                                                                k(se)
                                                                  .effectiveTime,
                                                              "onUpdate:modelValue":
                                                                l[12] ||
                                                                (l[12] = (e) =>
                                                                  (k(
                                                                    se,
                                                                  ).effectiveTime =
                                                                    e)),
                                                              "disabled-date":
                                                                ie,
                                                              "end-placeholder":
                                                                e.$t(
                                                                  "base.endTime",
                                                                ),
                                                              "prefix-icon":
                                                                ue.value,
                                                              "start-placeholder":
                                                                e.$t(
                                                                  "base.startTime",
                                                                ),
                                                              "date-format":
                                                                "YYYY-MM-DD",
                                                              "default-time":
                                                                k(E)(),
                                                              format:
                                                                "YYYY-MM-DD HH:mm",
                                                              "popper-class":
                                                                "effective-time-date-picker !tw-max-w-[600px]",
                                                              "range-separator":
                                                                "-",
                                                              type: "datetimerange",
                                                              popperOptions: ae,
                                                              "value-format":
                                                                "YYYY-MM-DD HH:mm",
                                                              onChange: ge,
                                                            },
                                                            null,
                                                            8,
                                                            [
                                                              "modelValue",
                                                              "end-placeholder",
                                                              "prefix-icon",
                                                              "start-placeholder",
                                                              "default-time",
                                                            ],
                                                          ),
                                                        ]),
                                                        _: 1,
                                                      },
                                                      8,
                                                      ["label"],
                                                    ))
                                                  : y("", !0),
                                                m(
                                                  i,
                                                  {
                                                    label: e.$t(
                                                      "rpa.task.req.timeZone",
                                                    ),
                                                  },
                                                  {
                                                    default: p(() => [
                                                      m(
                                                        _,
                                                        {
                                                          modelValue:
                                                            k(se).timeZone,
                                                          "onUpdate:modelValue":
                                                            l[13] ||
                                                            (l[13] = (e) =>
                                                              (k(se).timeZone =
                                                                e)),
                                                          placeholder:
                                                            e.$t(
                                                              "base.selectHolder",
                                                            ),
                                                          class: "m-t-5",
                                                          filterable: "",
                                                        },
                                                        {
                                                          default: p(() => [
                                                            (s(!0),
                                                            n(
                                                              T,
                                                              null,
                                                              w(
                                                                oe.value,
                                                                (e) => (
                                                                  s(),
                                                                  f(
                                                                    h,
                                                                    {
                                                                      key: e.value,
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
                                                          ]),
                                                          _: 1,
                                                        },
                                                        8,
                                                        [
                                                          "modelValue",
                                                          "placeholder",
                                                        ],
                                                      ),
                                                    ]),
                                                    _: 1,
                                                  },
                                                  8,
                                                  ["label"],
                                                ),
                                              ],
                                              64,
                                            )),
                                        k(se).type === k(u).REPEAT
                                          ? (s(),
                                            n(
                                              T,
                                              { key: 5 },
                                              [
                                                m(
                                                  i,
                                                  {
                                                    label: e.$t("rpa2.tip2"),
                                                    required: "",
                                                    prop: "executeInterval",
                                                  },
                                                  {
                                                    default: p(() => [
                                                      m(
                                                        q,
                                                        {
                                                          min: 0,
                                                          max: 1440,
                                                          precision: 0,
                                                          modelValue:
                                                            k(se)
                                                              .executeInterval,
                                                          "onUpdate:modelValue":
                                                            l[14] ||
                                                            (l[14] = (e) =>
                                                              (k(
                                                                se,
                                                              ).executeInterval =
                                                                e)),
                                                          placeholder:
                                                            e.$t(
                                                              "rpa.task.req.enter",
                                                            ),
                                                          controls: !1,
                                                        },
                                                        null,
                                                        8,
                                                        [
                                                          "modelValue",
                                                          "placeholder",
                                                        ],
                                                      ),
                                                      c(
                                                        "span",
                                                        K,
                                                        x(e.$t("rpa2.tip5")),
                                                        1,
                                                      ),
                                                      l[20] ||
                                                        (l[20] = c(
                                                          "br",
                                                          null,
                                                          null,
                                                          -1,
                                                        )),
                                                      c(
                                                        "p",
                                                        S,
                                                        x(e.$t("rpa2.tip3")),
                                                        1,
                                                      ),
                                                    ]),
                                                    _: 1,
                                                  },
                                                  8,
                                                  ["label"],
                                                ),
                                                m(
                                                  i,
                                                  {
                                                    label: e.$t("rpa2.tip6"),
                                                    required: "",
                                                    prop: "executeNumber",
                                                  },
                                                  {
                                                    default: p(() => [
                                                      m(
                                                        q,
                                                        {
                                                          placeholder:
                                                            e.$t(
                                                              "rpa.task.req.enter",
                                                            ),
                                                          min: 1,
                                                          max: 1e4,
                                                          modelValue:
                                                            k(se).executeNumber,
                                                          "onUpdate:modelValue":
                                                            l[15] ||
                                                            (l[15] = (e) =>
                                                              (k(
                                                                se,
                                                              ).executeNumber =
                                                                e)),
                                                          controls: !1,
                                                        },
                                                        null,
                                                        8,
                                                        [
                                                          "placeholder",
                                                          "modelValue",
                                                        ],
                                                      ),
                                                    ]),
                                                    _: 1,
                                                  },
                                                  8,
                                                  ["label"],
                                                ),
                                                m(
                                                  i,
                                                  {
                                                    label: e.$t("rpa2.tip7"),
                                                    prop: "executeTime",
                                                  },
                                                  {
                                                    default: p(() => [
                                                      m(
                                                        H,
                                                        {
                                                          modelValue:
                                                            k(se).executeTime,
                                                          "onUpdate:modelValue":
                                                            l[16] ||
                                                            (l[16] = (e) =>
                                                              (k(
                                                                se,
                                                              ).executeTime =
                                                                e)),
                                                          "default-time":
                                                            Te.value[0],
                                                          "disabled-date": ie,
                                                          placeholder:
                                                            e.$t(
                                                              "rpa.task.req.enter",
                                                            ),
                                                          class: "!tw-border-0",
                                                          format:
                                                            "YYYY-MM-DD HH:mm",
                                                          "popper-class":
                                                            "effective-time-date-picker",
                                                          "time-format":
                                                            "HH:mm",
                                                          type: "datetime",
                                                          "value-format":
                                                            "YYYY-MM-DD HH:mm",
                                                          onChange: $e,
                                                        },
                                                        null,
                                                        8,
                                                        [
                                                          "modelValue",
                                                          "default-time",
                                                          "placeholder",
                                                        ],
                                                      ),
                                                    ]),
                                                    _: 1,
                                                  },
                                                  8,
                                                  ["label"],
                                                ),
                                                m(
                                                  i,
                                                  {
                                                    label: e.$t(
                                                      "rpa.task.req.timeZone",
                                                    ),
                                                  },
                                                  {
                                                    default: p(() => [
                                                      m(
                                                        _,
                                                        {
                                                          modelValue:
                                                            k(se).timeZone,
                                                          "onUpdate:modelValue":
                                                            l[17] ||
                                                            (l[17] = (e) =>
                                                              (k(se).timeZone =
                                                                e)),
                                                          placeholder:
                                                            e.$t(
                                                              "base.selectHolder",
                                                            ),
                                                          class: "m-t-5",
                                                          filterable: "",
                                                        },
                                                        {
                                                          default: p(() => [
                                                            (s(!0),
                                                            n(
                                                              T,
                                                              null,
                                                              w(
                                                                oe.value,
                                                                (e) => (
                                                                  s(),
                                                                  f(
                                                                    h,
                                                                    {
                                                                      key: e.value,
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
                                                          ]),
                                                          _: 1,
                                                        },
                                                        8,
                                                        [
                                                          "modelValue",
                                                          "placeholder",
                                                        ],
                                                      ),
                                                    ]),
                                                    _: 1,
                                                  },
                                                  8,
                                                  ["label"],
                                                ),
                                              ],
                                              64,
                                            ))
                                          : y("", !0),
                                      ],
                                      64,
                                    ))
                                  : y("", !0),
                              ]),
                              _: 1,
                            },
                            8,
                            ["model", "rules"],
                          )),
                          [[A]],
                        ),
                      ]),
                      c("div", B, [
                        l[21] ||
                          (l[21] = c(
                            "span",
                            { class: "icon-warn-wrap m-r-8 m-t-2" },
                            [c("i", { class: "iconfont icon-warning" })],
                            -1,
                          )),
                        c("span", G, x(e.$t("rpa.task.req.tips")), 1),
                      ]),
                    ]),
                    _: 1,
                  },
                  8,
                  ["modelValue", "title"],
                ),
                m(
                  R,
                  { ref_key: "envListDialogRef", ref: re, onSubmit: Ye },
                  null,
                  512,
                ),
              ],
              64,
            )
          );
        }
      );
    },
  });
export { J as _ };
