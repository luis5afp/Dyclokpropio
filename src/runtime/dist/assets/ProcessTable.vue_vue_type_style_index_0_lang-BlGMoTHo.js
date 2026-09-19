import { u as e } from "./useFetchTable-DUveM-tP.js";
import {
  d as a,
  u as t,
  W as n,
  v as l,
  G as i,
  P as s,
  m as o,
  M as r,
  r as p,
  o as c,
  c as d,
  a as u,
  b as m,
  w as f,
  f as k,
  h as v,
  X as h,
  $ as _,
  jQ as b,
  F as y,
  i as M,
  C as g,
  jR as C,
  jS as w,
  D as T,
  a3 as S,
  em as x,
  N as j,
  dl as E,
  a$ as R,
  ci as Y,
  jT as P,
  jU as D,
  a5 as F,
  jV as W,
  jW as A,
} from "./index-BUIbb6Pa.js";
import { E as O } from "./index-rtKG2tmD.js";
import { _ as H } from "./index.vue_vue_type_style_index_0_lang-CoddPsWR.js";
import I from "./nameIdCell-BWLr8c3b.js";
import { E as L } from "./index-CLVJdR_V.js";
import { _ as U } from "./editRpaTask.vue_vue_type_style_index_0_lang-qriV8oII.js";
import { _ as B } from "./RpaProcessOptions.vue_vue_type_script_setup_true_lang-Y78tQZi4.js";
import { u as K } from "./index-CjqfvICL.js";
const N = { class: "tw-w-full tw-h-full table-box rpa-item-list" },
  $ = { key: 0, class: "tw-flex" },
  z = { key: 1 },
  G = a({
    __name: "ProcessTable",
    emits: ["open"],
    setup(a, { emit: G }) {
      const Q = G,
        V = M(),
        J = M({}),
        X = M(),
        q = M(""),
        {
          loading: Z,
          pagination: ee,
          filters: ae,
          fetchList: te,
          list: ne,
          onSearch: le,
          onPaginationSizeChange: ie,
          onPaginationCurrentChange: se,
          onFiltersChangeByKey: oe,
          listErr: re,
        } = e({
          fetch: async (e) => {
            const { date: a, ...t } = e,
              [n, l] = a || [];
            return (
              ue.isSuperAdmin && void 0 === ae.beMe && (ae.beMe = !0),
              await P({
                ...t,
                detail: !0,
                ...(n
                  ? { startCreateTime: K(n, "YYYY-MM-DD HH:mm:ss").value }
                  : {}),
                ...(l
                  ? { endCreateTime: K(l, "YYYY-MM-DD HH:mm:ss").value }
                  : {}),
              })
            );
          },
          tableName: "processTable",
        }),
        pe = t(),
        ce = () => {
          ue.isSuperAdmin && (ae.beMe = !0);
        };
      n(
        () => ne.value,
        () => {
          var e;
          null == (e = null == ne ? void 0 : ne.value) ||
            e.forEach((e) => {
              J[e.id] = !1;
            });
        },
      );
      const { t: de } = l.useI18n(),
        ue = i(),
        me = g(() => [
          {
            prop: "name",
            label: de("rpaMarket.tip19"),
            minWidth: 160,
            showOverflowTooltip: !1,
            render: ({ row: e }) => F(I, { name: e.name, id: e.workflowId }),
          },
          {
            prop: "source",
            label: de("referral.type"),
            minWidth: 80,
            render: ({ row: e }) =>
              e.source === b.CUSTOM
                ? de("rpaMarket.tip22")
                : e.source === b.MARKET
                  ? de("rpaMarket.tip21")
                  : de("rpaMarket.tip20"),
          },
          { prop: "updateTime", label: de("rpaMarket.tip23"), minWidth: 150 },
          {
            prop: "createTime",
            label: de("rpa.task.list.createTime"),
            minWidth: 150,
          },
          { prop: "createByName", label: de("expan.founder"), minWidth: 120 },
          {
            prop: "operation",
            label: de("base.operation"),
            minWidth: 140,
            fixed: "right",
          },
        ]),
        fe = g(() => {
          const e = [
            {
              el: "select",
              key: "beMe",
              width: "150px",
              options: [
                { value: !0, label: de("rpaMarket.tip7") },
                { value: !1, label: de("rpaMarket.tip8") },
              ],
            },
            {
              el: "input",
              key: "value",
              width: "150px",
              placeholder: de("rpa.task.list.rpaWorkflowId"),
            },
            {
              el: "select",
              key: "source",
              width: "150px",
              placeholder: de("referral.type"),
              options: [
                { label: de("rpaMarket.tip20"), value: b.SELF_BUILD },
                { label: de("rpaMarket.tip22"), value: b.CUSTOM },
                { label: de("rpaMarket.tip21"), value: b.MARKET },
              ],
            },
            {
              el: "datePicker",
              key: "date",
              label: "",
              type: "datetimerange",
              format: "YYYY-MM-DD HH:mm",
              valueFormat: "YYYY-MM-DD HH:mm",
              clearable: !0,
              width: "150px",
              rangeSeparator: de("base.to"),
              startPlaceholder: de("base.startTime"),
              endPlaceholder: de("base.endTime"),
            },
          ];
          return (ue.isSuperAdmin || e.shift(), e);
        }),
        ke = M();
      function ve(e, a, t, n = !0, l = !0) {
        (n && o.emit(W.RUN_RPA_TASK, { isFirst: e, envIds: a, taskId: t }),
          A().getPendingTaskList(),
          pe.push({ name: "taskManage" }));
      }
      function he(e) {
        Y(de("rpaMarket.tip24"), () =>
          (async (e) => {
            0 === (await D(e)).code &&
              (S.success(de("base.delSuccess")), await le());
          })(e),
        );
      }
      return (
        s(() => {
          o.on(r.RPA_CLOSE_EVENT, () => {
            le();
          });
        }),
        (e, a) => {
          const t = p("el-tooltip");
          return (
            c(),
            d(
              y,
              null,
              [
                u("div", N, [
                  m(
                    O,
                    {
                      ref_key: "eTableRef",
                      ref: V,
                      columns: me.value,
                      list: k(ne),
                      listErr: k(re),
                      loading: k(Z),
                      onRefresh: k(le),
                    },
                    {
                      filters: f(() => [
                        m(
                          L,
                          {
                            config: fe.value,
                            labelWidth: 80,
                            "model-value": k(ae),
                            onReset: ce,
                            onSearch: a[0] || (a[0] = (e) => k(le)(!1)),
                            "onField:change": k(oe),
                          },
                          null,
                          8,
                          ["config", "model-value", "onField:change"],
                        ),
                      ]),
                      operation: f(({ row: e }) => {
                        var n, l;
                        return [
                          !0 === (null == (n = k(ae)) ? void 0 : n.beMe) ||
                          void 0 === (null == (l = k(ae)) ? void 0 : l.beMe)
                            ? (c(),
                              d("div", $, [
                                e.formEdit
                                  ? (c(),
                                    v(
                                      t,
                                      {
                                        key: 0,
                                        content: k(de)("rpaOptions.tip8"),
                                        placement: "top",
                                      },
                                      {
                                        default: f(() => [
                                          m(
                                            k(_),
                                            {
                                              link: "",
                                              type: "info",
                                              onClick: (a) =>
                                                (async (e) => {
                                                  var a;
                                                  const t = await C(e.id);
                                                  null == (a = X.value) ||
                                                    a.receiveData(
                                                      e,
                                                      t.data.data,
                                                    );
                                                })(e),
                                            },
                                            {
                                              default: f(() => [
                                                ...(a[1] ||
                                                  (a[1] = [
                                                    u(
                                                      "i",
                                                      {
                                                        class:
                                                          "iconfont icon-configuration",
                                                      },
                                                      null,
                                                      -1,
                                                    ),
                                                  ])),
                                              ]),
                                              _: 1,
                                            },
                                            8,
                                            ["onClick"],
                                          ),
                                        ]),
                                        _: 2,
                                      },
                                      1032,
                                      ["content"],
                                    ))
                                  : e.source !== k(b).CUSTOM
                                    ? (c(),
                                      v(
                                        t,
                                        {
                                          key: 1,
                                          content: k(de)("base.edit"),
                                          placement: "top",
                                        },
                                        {
                                          default: f(() => [
                                            m(
                                              k(_),
                                              {
                                                link: "",
                                                type: "info",
                                                onClick: (a) =>
                                                  ((e) => {
                                                    T.isClient
                                                      ? Q("open", e.workflowId)
                                                      : E();
                                                  })(e),
                                              },
                                              {
                                                default: f(() => [
                                                  ...(a[2] ||
                                                    (a[2] = [
                                                      u(
                                                        "i",
                                                        {
                                                          class:
                                                            "iconfont icon-edit",
                                                        },
                                                        null,
                                                        -1,
                                                      ),
                                                    ])),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["onClick"],
                                            ),
                                          ]),
                                          _: 2,
                                        },
                                        1032,
                                        ["content"],
                                      ))
                                    : h("", !0),
                                m(
                                  t,
                                  {
                                    content: k(de)("rpa.task.list.createTask"),
                                    placement: "top",
                                  },
                                  {
                                    default: f(() => [
                                      m(
                                        k(_),
                                        {
                                          link: "",
                                          type: "info",
                                          onClick: (a) =>
                                            (async (e) => {
                                              var a;
                                              T.isClient
                                                ? null == (a = ke.value) ||
                                                  a.acceptParams(
                                                    !1,
                                                    {
                                                      name: `RPA-Workflow-${R().format("MMDDHHmmss")}`,
                                                      rpaWorkflowId: e.id,
                                                    },
                                                    "implement",
                                                    !0,
                                                  )
                                                : E();
                                            })(e),
                                        },
                                        {
                                          default: f(() => [
                                            ...(a[3] ||
                                              (a[3] = [
                                                u(
                                                  "i",
                                                  {
                                                    class:
                                                      "iconfont icon-Createatask",
                                                  },
                                                  null,
                                                  -1,
                                                ),
                                              ])),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["onClick"],
                                      ),
                                    ]),
                                    _: 2,
                                  },
                                  1032,
                                  ["content"],
                                ),
                                m(
                                  t,
                                  {
                                    content: k(de)("env.env.step.Export"),
                                    placement: "top",
                                  },
                                  {
                                    default: f(() => [
                                      [
                                        k(b).MARKET,
                                        k(b).CUSTOM,
                                        k(b).SELF_BUILD,
                                      ].includes(e.source)
                                        ? h("", !0)
                                        : (c(),
                                          v(
                                            k(_),
                                            {
                                              key: 0,
                                              class:
                                                "before:!tw-bg-transparent",
                                              link: "",
                                              type: "info",
                                              loading: q.value === e.id,
                                              disabled: !!q.value,
                                              onClick: (a) =>
                                                (async (e) => {
                                                  if (!q.value) {
                                                    q.value = e.id;
                                                    try {
                                                      const a = (await w(e.id))
                                                          .data,
                                                        t = `${e.name}.json`;
                                                      (await T.api.userSaveFile(
                                                        {
                                                          data: a,
                                                          filename: t,
                                                          fileType: "json",
                                                          title:
                                                            de(
                                                              "rpaMarket.tip25",
                                                            ),
                                                        },
                                                      )) &&
                                                        S.success(
                                                          de(
                                                            "env.env.step.exportSuccess",
                                                          ),
                                                        );
                                                    } catch (a) {
                                                      x(a);
                                                    } finally {
                                                      await j(() => {
                                                        q.value = "";
                                                      });
                                                    }
                                                  }
                                                })(e),
                                            },
                                            {
                                              default: f(() => [
                                                ...(a[4] ||
                                                  (a[4] = [
                                                    u(
                                                      "i",
                                                      {
                                                        class:
                                                          "iconfont icon-export",
                                                      },
                                                      null,
                                                      -1,
                                                    ),
                                                  ])),
                                              ]),
                                              _: 1,
                                            },
                                            8,
                                            ["loading", "disabled", "onClick"],
                                          )),
                                    ]),
                                    _: 2,
                                  },
                                  1032,
                                  ["content"],
                                ),
                                m(
                                  t,
                                  {
                                    content: k(de)("base.del"),
                                    placement: "top",
                                  },
                                  {
                                    default: f(() => [
                                      e.source !== k(b).CUSTOM
                                        ? (c(),
                                          v(
                                            k(_),
                                            {
                                              key: 0,
                                              ref: "delBtn",
                                              link: "",
                                              type: "info",
                                              onClick: (a) => he(e.id),
                                            },
                                            {
                                              default: f(() => [
                                                ...(a[5] ||
                                                  (a[5] = [
                                                    u(
                                                      "i",
                                                      {
                                                        class:
                                                          "iconfont icon-delete",
                                                      },
                                                      null,
                                                      -1,
                                                    ),
                                                  ])),
                                              ]),
                                              _: 1,
                                            },
                                            8,
                                            ["onClick"],
                                          ))
                                        : h("", !0),
                                    ]),
                                    _: 2,
                                  },
                                  1032,
                                  ["content"],
                                ),
                              ]))
                            : (c(), d("div", z, "--")),
                        ];
                      }),
                      pagination: f(() => [
                        k(ne).length
                          ? (c(),
                            v(
                              H,
                              {
                                key: 0,
                                handleCurrentChange: k(se),
                                handleSizeChange: k(ie),
                                pageable: k(ee),
                              },
                              null,
                              8,
                              [
                                "handleCurrentChange",
                                "handleSizeChange",
                                "pageable",
                              ],
                            ))
                          : h("", !0),
                      ]),
                      _: 1,
                    },
                    8,
                    ["columns", "list", "listErr", "loading", "onRefresh"],
                  ),
                  m(
                    B,
                    {
                      ref_key: "rpaProcessOptionsRef",
                      ref: X,
                      onFetchList: k(te),
                    },
                    null,
                    8,
                    ["onFetchList"],
                  ),
                ]),
                m(
                  U,
                  { ref_key: "editRpaTaskRef", ref: ke, onSubmit: ve },
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
export { G as _ };
