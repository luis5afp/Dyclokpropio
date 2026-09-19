import {
  d as e,
  v as a,
  ah as n,
  r as l,
  o as t,
  c as i,
  F as s,
  b as o,
  w as r,
  f as d,
  h as u,
  X as p,
  a as c,
  ab as m,
  e as v,
  t as f,
  $ as g,
  i as h,
  dc as x,
  gr as b,
  g$ as w,
  a3 as _,
  g1 as y,
  ak as k,
  a1 as C,
  C as L,
  eX as E,
  aL as T,
  a5 as $,
} from "./index-BUIbb6Pa.js";
import { E as M } from "./index-CLVJdR_V.js";
import { E as S } from "./index-rtKG2tmD.js";
import { _ as j } from "./index.vue_vue_type_style_index_0_lang-CoddPsWR.js";
import { u as Y } from "./useFetchTable-DUveM-tP.js";
import { _ as N } from "./editExpandGroup.vue_vue_type_script_setup_true_lang-B25t6R8t.js";
import { T as P } from "./TableExtend-CdmYngu2.js";
import { _ as D } from "./configExpandGroup.vue_vue_type_script_setup_true_lang-BFw61P8j.js";
import { s as F } from "./timeZone-D3UW65MQ.js";
import { u as G, c as I } from "./usePermissionGuard-BuK9RLCQ.js";
import { u as H } from "./useMemberSelectPagination-BLP_arcy.js";
import { u as R } from "./index-CjqfvICL.js";
const W = ["onClick"],
  B = ["onClick"],
  O = { class: "content-wrap" },
  z = { class: "title flx-align-center" },
  V = { class: "tips-content" },
  A = { class: "btn-container" },
  K = ["onClick"],
  U = e({
    __name: "groupManage",
    setup(e, { expose: U }) {
      const { t: X } = a.useI18n(),
        Z = h(!1),
        J = h(),
        Q = h(),
        q = h(),
        ee = h([]),
        { hasPermission: ae, guardedFetch: ne } = G({
          permissions: [n.MEMBER_LIST, n.MANAGE_MEMBERS],
        }),
        {
          options: le,
          loading: te,
          loadInitial: ie,
          search: se,
          handlePopupScroll: oe,
          reset: re,
        } = H({
          fetchPage: (e) =>
            ne(() => E(e), { list: [], total: 0 }).then(
              (e) => e ?? { list: [], total: 0 },
            ),
        }),
        de = { show: !0, label: X("expan.createExpandGroup") },
        {
          loading: ue,
          pagination: pe,
          filters: ce,
          list: me,
          fetchList: ve,
          onSearch: fe,
          onPaginationSizeChange: ge,
          onPaginationCurrentChange: he,
          onFiltersChangeByKey: xe,
          listErr: be,
        } = Y({
          fetch: (e) => {
            const { date: a, ...n } = e,
              [l, t] = a || [];
            return x({
              ...n,
              detail: !0,
              ...(l
                ? { startCreateTime: F(R(l, "YYYY-MM-DD HH:mm:ss").value) }
                : {}),
              ...(t
                ? { endCreateTime: F(R(t, "YYYY-MM-DD HH:mm:ss").value) }
                : {}),
            });
          },
          tableName: "groupManage",
        }),
        we = async (e) => {
          var a, n;
          (null == (a = null == e ? void 0 : e.envList) ? void 0 : a.length)
            ? null == (n = null == q ? void 0 : q.value) ||
              n.acceptParams(b.DELETE, e)
            : (await w({ ids: [(null == e ? void 0 : e.id) ?? ""] }),
              _.success(X("base.delSuccess")),
              ve());
        },
        _e = (e) => {
          var a;
          y() || null == (a = Q.value) || a.acceptParams(e);
        },
        ye = () => {
          k({ all: !0, detail: !1 }).then((e) => {
            var a;
            ee.value =
              null == (a = null == e ? void 0 : e.list)
                ? void 0
                : a.map((e) => ({
                    value: (null == e ? void 0 : e.id) ?? "",
                    label: `${(null == e ? void 0 : e.name) ? (null == e ? void 0 : e.name) : "-"} (${e.serialNum})`,
                  }));
          });
        },
        ke = () => {
          ((me.value = []),
            (ce.value = void 0),
            (ce.envId = void 0),
            (ce.createById = void 0),
            (ce.date = void 0),
            (Z.value = !1));
        };
      const Ce = L(() => [
          {
            el: "input",
            key: "value",
            label: "",
            placeholder: X("expan.nameOrRemark"),
            clearable: !0,
          },
          {
            el: "select",
            key: "envId",
            label: "",
            placeholder: X("expan.envList"),
            clearable: !0,
            options: ee.value,
          },
          ...I(ae.value, {
            el: "select",
            key: "createById",
            label: "",
            placeholder: X("expan.founder"),
            filterable: !0,
            remote: !0,
            clearable: !0,
            options: le.value,
            loading: te.value,
            getOptionsFn: ie,
            remoteMethod: se,
            onPopupScroll: oe,
          }),
          {
            el: "datePicker",
            key: "date",
            label: "",
            placeholder: X("env.env.filter.date"),
            clearable: !0,
            type: "datetimerange",
            format: "YYYY-MM-DD HH:mm",
            valueFormat: "YYYY-MM-DD HH:mm",
            rangeSeparator: X("base.to"),
          },
        ]),
        Le = L(() => [
          { prop: "name", label: X("expan.groupName"), minWidth: 150 },
          { prop: "remark", label: X("expan.remark"), minWidth: 100 },
          {
            prop: "extensionsList",
            label: X("expan.expandList"),
            minWidth: 150,
            showOverflowTooltip: !1,
            render: ({ row: e }) => {
              var a, n, l;
              if (!(null == (a = e.extensionsList) ? void 0 : a.length))
                return "--";
              if (e.extensionsList.length <= 2)
                return null ==
                  (l = null == (n = e.extensionsList) ? void 0 : n.map)
                  ? void 0
                  : l.call(n, (a, n) =>
                      $(
                        m,
                        { placement: "top", content: `${a.extensionsName}` },
                        {
                          reference: () =>
                            $(
                              "div",
                              { class: "sle" },
                              {
                                default: () => {
                                  var l;
                                  return `${a.extensionsName}${n !== ((null == (l = e.extensionsList) ? void 0 : l.length) ?? 0) - 1 ? "、" : ""}`;
                                },
                              },
                            ),
                        },
                      ),
                    );
              {
                const a = e.extensionsList
                    .slice(0, 2)
                    .map((e) => e.extensionsName)
                    .join("、"),
                  n = e.extensionsList
                    .map((e) => `${e.extensionsName}`)
                    .join("、");
                return $("div", [
                  $("div", $("div", { class: "sle" }, [a])),
                  $("div", X("base.etc", { N: e.extensionsList.length })),
                  $(
                    "div",
                    $(
                      m,
                      {
                        placement: "top",
                        title: X("expan.expandList"),
                        width: "300",
                        trigger: "click",
                      },
                      {
                        reference: () =>
                          $(
                            g,
                            { link: !0, type: "primary" },
                            { default: () => X("base.view") },
                          ),
                        default: () =>
                          $(
                            "div",
                            { class: "view-more-main" },
                            { default: () => n },
                          ),
                      },
                    ),
                  ),
                ]);
              }
            },
          },
          {
            prop: "envList",
            label: X("expan.bindEnvList"),
            minWidth: 150,
            showOverflowTooltip: !1,
            render: ({ row: e }) => {
              var a, n, l;
              if (!(null == (a = e.envList) ? void 0 : a.length)) return "--";
              if (e.envList.length <= 2)
                return null == (l = null == (n = e.envList) ? void 0 : n.map)
                  ? void 0
                  : l.call(n, (a, n) =>
                      $(
                        m,
                        {
                          placement: "top",
                          content: `${a.name ? a.name : "--"}(${a.serialNum})`,
                        },
                        {
                          reference: () =>
                            $(
                              "div",
                              { class: "sle" },
                              {
                                default: () => {
                                  var l;
                                  return `${a.name ? a.name : "--"}(${a.serialNum})${n !== ((null == (l = e.envList) ? void 0 : l.length) ?? 0) - 1 ? "、" : ""}`;
                                },
                              },
                            ),
                        },
                      ),
                    );
              {
                const a = e.envList
                    .slice(0, 2)
                    .map((e) => (e.name ? e.name : "--") + `(${e.serialNum})`)
                    .join("、"),
                  n = e.envList
                    .map((e) => `${e.name ? e.name : "--"}(${e.serialNum})`)
                    .join("、");
                return $("div", [
                  $("div", $("div", { class: "sle" }, [a])),
                  $("div", X("base.etc", { N: e.envList.length })),
                  $(
                    "div",
                    $(
                      m,
                      {
                        placement: "top",
                        title: X("env.group.resp.envList"),
                        width: "300",
                        trigger: "click",
                      },
                      {
                        reference: () =>
                          $(
                            g,
                            { link: !0, type: "primary" },
                            { default: () => X("base.view") },
                          ),
                        default: () =>
                          $(
                            "div",
                            { class: "view-more-main" },
                            { default: () => n },
                          ),
                      },
                    ),
                  ),
                ]);
              }
            },
          },
          { prop: "createByName", label: X("expan.founder"), minWidth: 100 },
          {
            prop: "createTime",
            label: X("base.createTime"),
            minWidth: 150,
            specialType: T.TIME,
            isTimeZoneChange: !0,
          },
          {
            prop: "operation",
            label: X("base.operation"),
            fixed: "right",
            minWidth: 100,
          },
        ]);
      return (
        U({
          acceptParams: async (e) => {
            (e && (ce.envId = e), ve(), ye(), re(), ie(), (Z.value = !0));
          },
        }),
        (e, a) => {
          const n = l("el-drawer");
          return (
            t(),
            i(
              s,
              null,
              [
                o(
                  n,
                  {
                    modelValue: Z.value,
                    "onUpdate:modelValue":
                      a[1] || (a[1] = (e) => (Z.value = e)),
                    "destroy-on-close": !0,
                    onClose: ke,
                    size: "90%",
                    title: e.$t("expan.expandGroupManage"),
                    class: "expand-group-manage tw-max-w-[1400px]",
                  },
                  {
                    default: r(() => [
                      o(
                        S,
                        {
                          list: d(me),
                          columns: Le.value,
                          loading: d(ue),
                          onRefresh: d(ve),
                          ref_key: "eTableRef",
                          ref: J,
                          listErr: d(be),
                        },
                        {
                          extends: r(() => [
                            o(P, {
                              createProps: de,
                              onOnCreate: a[0] || (a[0] = (e) => _e()),
                            }),
                          ]),
                          filters: r(() => [
                            o(
                              M,
                              {
                                config: Ce.value,
                                "model-value": d(ce),
                                autoSearch: !1,
                                onSearch: d(fe),
                                "onField:change": d(xe),
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
                          operation: r((n) => {
                            var l, h;
                            return [
                              n.row.isDefault
                                ? p("", !0)
                                : (t(),
                                  i(
                                    s,
                                    { key: 0 },
                                    [
                                      c(
                                        "i",
                                        {
                                          class:
                                            "iconfont icon-edit tw-cursor-pointer tw-duration-300 hover:tw-text-main tw-mr-[10px]",
                                          onClick: (e) => _e(n.row),
                                        },
                                        null,
                                        8,
                                        W,
                                      ),
                                      (
                                        null ==
                                        (h =
                                          null ==
                                          (l = null == n ? void 0 : n.row)
                                            ? void 0
                                            : l.envList)
                                          ? void 0
                                          : h.length
                                      )
                                        ? (t(),
                                          i(
                                            "i",
                                            {
                                              key: 1,
                                              class:
                                                "iconfont icon-delete tw-cursor-pointer tw-duration-300 hover:tw-text-main",
                                              onClick: (e) => we(n.row),
                                            },
                                            null,
                                            8,
                                            K,
                                          ))
                                        : (t(),
                                          u(
                                            d(m),
                                            {
                                              key: 0,
                                              "show-arrow": !1,
                                              visible: !!(null == n
                                                ? void 0
                                                : n.row.visible),
                                              width: 300,
                                              placement: "right",
                                              "popper-class": "delete-popover",
                                            },
                                            {
                                              reference: r(() => [
                                                c(
                                                  "i",
                                                  {
                                                    onClick: (e) => {
                                                      return (
                                                        (a = n.row),
                                                        void (
                                                          y() ||
                                                          C({
                                                            message:
                                                              X(
                                                                "expan.delTips1",
                                                              ),
                                                            title:
                                                              X(
                                                                "expan.delTitle",
                                                              ),
                                                            confirmCb:
                                                              async () => {
                                                                await we(a);
                                                              },
                                                          })
                                                        )
                                                      );
                                                      var a;
                                                    },
                                                    class:
                                                      "iconfont icon-delete tw-cursor-pointer tw-duration-300 hover:tw-text-main",
                                                  },
                                                  null,
                                                  8,
                                                  B,
                                                ),
                                              ]),
                                              default: r(() => [
                                                c("div", O, [
                                                  c("div", z, [
                                                    a[2] ||
                                                      (a[2] = c(
                                                        "span",
                                                        null,
                                                        [
                                                          c("i", {
                                                            class:
                                                              "iconfont icon-warning",
                                                          }),
                                                        ],
                                                        -1,
                                                      )),
                                                    v(
                                                      f(e.$t("expan.delTitle")),
                                                      1,
                                                    ),
                                                  ]),
                                                  c("div", V, [
                                                    c(
                                                      "p",
                                                      null,
                                                      f(e.$t("expan.delTips1")),
                                                      1,
                                                    ),
                                                  ]),
                                                  c("div", A, [
                                                    o(
                                                      d(g),
                                                      {
                                                        type: "info",
                                                        onClick: (e) =>
                                                          (n.row.visible = !1),
                                                      },
                                                      {
                                                        default: r(() => [
                                                          v(
                                                            f(
                                                              e.$t(
                                                                "base.cancel",
                                                              ),
                                                            ),
                                                            1,
                                                          ),
                                                        ]),
                                                        _: 1,
                                                      },
                                                      8,
                                                      ["onClick"],
                                                    ),
                                                    o(
                                                      d(g),
                                                      {
                                                        type: "danger",
                                                        onClick: (e) => {
                                                          (we(n.row),
                                                            (n.row.visible =
                                                              !1));
                                                        },
                                                      },
                                                      {
                                                        default: r(() => [
                                                          v(
                                                            f(
                                                              e.$t(
                                                                "base.confirm",
                                                              ),
                                                            ),
                                                            1,
                                                          ),
                                                        ]),
                                                        _: 1,
                                                      },
                                                      8,
                                                      ["onClick"],
                                                    ),
                                                  ]),
                                                ]),
                                              ]),
                                              _: 2,
                                            },
                                            1032,
                                            ["visible"],
                                          )),
                                    ],
                                    64,
                                  )),
                            ];
                          }),
                          pagination: r(() => [
                            d(me).length
                              ? (t(),
                                u(
                                  j,
                                  {
                                    key: 0,
                                    pageable: d(pe),
                                    handleSizeChange: d(ge),
                                    handleCurrentChange: d(he),
                                  },
                                  null,
                                  8,
                                  [
                                    "pageable",
                                    "handleSizeChange",
                                    "handleCurrentChange",
                                  ],
                                ))
                              : p("", !0),
                          ]),
                          _: 1,
                        },
                        8,
                        ["list", "columns", "loading", "onRefresh", "listErr"],
                      ),
                    ]),
                    _: 1,
                  },
                  8,
                  ["modelValue", "title"],
                ),
                o(
                  N,
                  { ref_key: "editExpandGroupRef", ref: Q, onSubmit: d(ve) },
                  null,
                  8,
                  ["onSubmit"],
                ),
                o(
                  D,
                  { ref_key: "configExpandGroupRef", ref: q, onSubmit: d(ve) },
                  null,
                  8,
                  ["onSubmit"],
                ),
              ],
              64,
            )
          );
        }
      );
    },
  });
export { U as _ };
