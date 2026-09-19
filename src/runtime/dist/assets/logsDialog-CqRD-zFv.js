import {
  d as e,
  v as a,
  r as l,
  o as t,
  h as s,
  w as r,
  a as o,
  b as n,
  f as i,
  X as p,
  e as u,
  t as c,
  i as g,
  k7 as d,
  C as v,
  bN as E,
  k8 as _,
  k9 as k,
  aL as m,
  a5 as T,
  eR as R,
  ka as O,
  _ as y,
} from "./index-BUIbb6Pa.js";
import { E as b } from "./index-rtKG2tmD.js";
import { E as f } from "./index-CLVJdR_V.js";
import { _ as h } from "./index.vue_vue_type_style_index_0_lang-CoddPsWR.js";
import { u as x } from "./useFetchTable-DUveM-tP.js";
import { u as C } from "./index-CjqfvICL.js";
import "./timeZone-D3UW65MQ.js";
import "./TableFieldDialog-BI1BUo05.js";
import "./sortable.esm-DneA_jWz.js";
import "./LazyRow.vue_vue_type_script_setup_true_lang-C9dK0oMf.js";
import "./index.vue_vue_type_script_setup_true_lang-8hqXqXGq.js";
const N = { class: "table-box tw-max-h-[680px] tw-h-[70vh] log-table" },
  S = y(
    e({
      __name: "logsDialog",
      setup(e, { expose: y }) {
        const { t: S } = a.useI18n(),
          L = g(""),
          A = g(!1),
          {
            pagination: I,
            filters: w,
            list: V,
            fetchList: D,
            onSearch: P,
            onPaginationSizeChange: j,
            onPaginationCurrentChange: z,
            onFiltersChangeByKey: M,
            listErr: $,
          } = x({
            fetch: (e) => {
              const { date: a, ...l } = e,
                [t, s] = a || [];
              return d(L.value, {
                ...l,
                detail: !0,
                ...(t ? { startCreateTime: C(t, "YYYY-MM-DD").value } : {}),
                ...(s ? { endCreateTime: C(s, "YYYY-MM-DD").value } : {}),
              });
            },
            tableName: "RpaTaskLogsList",
          }),
          K = (e) => {
            if (!e) return "";
            try {
              const a = JSON.parse(e);
              return "string" == typeof a
                ? K(a)
                : (null == a ? void 0 : a.zh) ||
                    (null == a ? void 0 : a.en) ||
                    Object.values(a || {})[0] ||
                    "";
            } catch (a) {
              return e;
            }
          },
          F = v(() => [
            {
              el: "inputGroup",
              key: "inputGroup",
              label: "",
              clearable: !0,
              igOptions: [
                { value: "serialNum", label: S("env.env.filter.serialNum") },
                { value: "envName", label: S("rpa.task.logs.envName") },
              ],
            },
            {
              el: "select",
              key: "executeType",
              label: "",
              clearable: !0,
              options: [
                { value: _.OPEN_ENV, label: S("rpa.task.logs.openEnv") },
                {
                  value: _.EXECUTE_TASK,
                  label: S("rpa.task.logs.executeTask"),
                },
                { value: _.CLOSE_ENV, label: S("rpa.task.logs.closeEnv") },
              ],
              placeholder: S("rpa.task.logs.executeContent"),
            },
            {
              el: "select",
              key: "status",
              label: "",
              clearable: !0,
              options: [
                { value: k.DISABLED, label: S("rpa.task.logs.error") },
                { value: k.ENABLED, label: S("rpa.task.logs.success") },
              ],
              placeholder: S("rpa.task.logs.executeType"),
            },
            {
              el: "datePicker",
              key: "date",
              label: "",
              type: "daterange",
              clearable: !0,
              rangeSeparator: S("base.to"),
              startPlaceholder: S("base.startTime"),
              endPlaceholder: S("base.endTime"),
            },
          ]),
          Y = v(() => [
            {
              prop: "envName",
              label: S("rpa.task.logs.executeEnv"),
              render: ({ row: e }) =>
                T("div", [
                  T("div", { class: "sle" }, e.envName),
                  T(
                    "div",
                    {
                      style: {
                        color: "var(--text-color-light1)",
                        fontSize: "12px",
                      },
                    },
                    `${S("rpa.task.logs.serialNum")}: ${e.serialNum}`,
                  ),
                ]),
            },
            {
              prop: "executeType",
              label: S("rpa.task.logs.executeContent"),
              render: ({ row: e }) => {
                if (!e.executeType) return T("span", "--");
                const a = {
                  [_.OPEN_ENV]: S("rpa.task.logs.openEnv"),
                  [_.EXECUTE_TASK]: S("rpa.task.logs.executeTask"),
                  [_.CLOSE_ENV]: S("rpa.task.logs.closeEnv"),
                };
                return T("span", null, [
                  T("div", a[e.executeType]),
                  e.executeType === _.CLOSE_ENV && B(e),
                ]);
              },
            },
            {
              prop: "status",
              label: S("rpa.task.logs.executeType"),
              render: ({ row: e }) => {
                if (!(null == e ? void 0 : e.status)) return T("span", "--");
                const a = {
                  [k.DISABLED]: S("rpa.task.logs.error"),
                  [k.ENABLED]: S("rpa.task.logs.success"),
                };
                return T("div", {}, [
                  T(
                    R,
                    { type: e.status === k.ENABLED ? "primary" : "danger" },
                    { default: () => a[null == e ? void 0 : e.status] },
                  ),
                ]);
              },
            },
            {
              prop: "errorType",
              label: S("rpa.task.logs.reason"),
              render: ({ row: e }) => {
                if (e.status === k.ENABLED) return T("span", "--");
                const a = K(e.msg);
                if (a)
                  return T(
                    "div",
                    {
                      class: "sle",
                      style: {
                        color: "var(--text-color-light1)",
                        fontSize: "12px",
                      },
                    },
                    `${S("rpa.task.logs.reason")}: ${a}`,
                  );
                if (null === (null == e ? void 0 : e.errorType))
                  return T(
                    "div",
                    {
                      class: "sle",
                      style: {
                        color: "var(--text-color-light1)",
                        fontSize: "12px",
                      },
                    },
                    `${S("rpa.task.logs.reason")}: ${S("rpa.task.logs.unknown")}`,
                  );
                const l = {
                  [O.NOT_WORKFLOW]: S("rpa.task.logs.notWorkflow"),
                  [O.ENV_OPEN_ERROR]: S("rpa.task.logs.openError"),
                  [O.MEMORY_OVERSIZE]: S("rpa.task.logs.memoryOversize"),
                  [O.UNKNOWN]: S("rpa.task.logs.unknown"),
                  [O.TASK_TIMEOUT_ERROR]: S("rpa.task.logs.timeoutClose"),
                  [O.RUN_WORKFLOW_ERROR]: S("rpa.task.logs.runWorkflowError"),
                  [O.ACTIVE_CLOSE_ERROR]: S("rpa.task.logs.activeClose"),
                  [O.ACTIVE_STOP_ERROR]: S("rpa.task.logs.activeStop"),
                  [O.CLIENT_OFFLINE_ERROR]: S("rpa.task.logs.clientOffline"),
                };
                return T("div", {}, [
                  T(
                    "div",
                    {
                      class: "sle",
                      style: {
                        color: "var(--text-color-light1)",
                        fontSize: "12px",
                      },
                    },
                    `${S("rpa.task.logs.reason")}: ${l[e.errorType]}`,
                  ),
                ]);
              },
            },
            {
              prop: "createTime",
              label: S("rpa.task.logs.executeTime"),
              specialType: m.TIME,
            },
          ]),
          U = async () => {
            ((A.value = !1),
              (w.serialNum = void 0),
              (w.envName = void 0),
              (w.status = void 0),
              (w.executeType = void 0),
              (w.date = [void 0, void 0]),
              (L.value = ""),
              await E(300),
              (V.value = []));
          },
          B = (e) => {
            if (
              [
                O.TASK_TIMEOUT_ERROR,
                O.ACTIVE_CLOSE_ERROR,
                O.ACTIVE_STOP_ERROR,
              ].includes(e.errorType)
            ) {
              let a = {
                [O.TASK_TIMEOUT_ERROR]: "timeoutClose",
                [O.ACTIVE_CLOSE_ERROR]: "activeClose",
                [O.ACTIVE_STOP_ERROR]: "activeStop",
              };
              return T(
                "div",
                {
                  class: "sle",
                  style: {
                    color: "var(--text-color-light1)",
                    fontSize: "12px",
                  },
                },
                `(${S(`rpa.task.logs.${Reflect.get(a, e.errorType)}`)})`,
              );
            }
          };
        return (
          y({
            attrsParams: async (e) => {
              ((L.value = e), await D(), (A.value = !0));
            },
          }),
          (e, a) => {
            const g = l("el-button"),
              d = l("el-dialog");
            return (
              t(),
              s(
                d,
                {
                  modelValue: A.value,
                  "onUpdate:modelValue": a[0] || (a[0] = (e) => (A.value = e)),
                  "close-on-click-modal": !1,
                  title: i(S)("rpa.task.logs.executeLogs"),
                  "align-center": "",
                  class: "rpa-logs-dialog",
                  width: "1170",
                },
                {
                  footer: r(() => [
                    o("div", null, [
                      n(
                        g,
                        { style: { width: "232px" }, type: "info", onClick: U },
                        {
                          default: r(() => [
                            u(c(e.$t("rpa.task.logs.close")), 1),
                          ]),
                          _: 1,
                        },
                      ),
                    ]),
                  ]),
                  default: r(() => [
                    o("div", null, [
                      o("div", N, [
                        n(
                          b,
                          {
                            columns: Y.value,
                            list: i(V),
                            "tool-button": !1,
                            listErr: i($),
                          },
                          {
                            filters: r(() => [
                              n(
                                f,
                                {
                                  autoSearch: !1,
                                  config: F.value,
                                  "model-value": i(w),
                                  onSearch: i(P),
                                  "onField:change": i(M),
                                },
                                null,
                                8,
                                [
                                  "config",
                                  "model-value",
                                  "onSearch",
                                  "onField:change",
                                ],
                              ),
                            ]),
                            pagination: r(() => [
                              i(V).length
                                ? (t(),
                                  s(
                                    h,
                                    {
                                      key: 0,
                                      handleCurrentChange: i(z),
                                      handleSizeChange: i(j),
                                      pageable: i(I),
                                    },
                                    null,
                                    8,
                                    [
                                      "handleCurrentChange",
                                      "handleSizeChange",
                                      "pageable",
                                    ],
                                  ))
                                : p("", !0),
                            ]),
                            _: 1,
                          },
                          8,
                          ["columns", "list", "listErr"],
                        ),
                      ]),
                    ]),
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
    }),
    [["__scopeId", "data-v-302db01d"]],
  );
export { S as default };
