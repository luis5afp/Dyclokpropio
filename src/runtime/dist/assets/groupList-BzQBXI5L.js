import {
  d as e,
  v as a,
  G as i,
  be as t,
  ah as n,
  q as l,
  o as r,
  c as s,
  b as o,
  w as m,
  f as p,
  h as u,
  X as d,
  x as v,
  $ as c,
  a as b,
  i as g,
  a1 as f,
  a5 as h,
  dh as w,
  C as _,
  af as L,
  gp as y,
  ao as k,
  eX as x,
  ad as j,
  aL as C,
  ab as E,
  ak as T,
} from "./index-BUIbb6Pa.js";
import { E as N } from "./index-CLVJdR_V.js";
import { E as S } from "./index-rtKG2tmD.js";
import { T as P } from "./TableExtend-CdmYngu2.js";
import { _ as O } from "./index.vue_vue_type_style_index_0_lang-CoddPsWR.js";
import { u as R } from "./useFetchTable-DUveM-tP.js";
import { _ as I } from "./groupEdit.vue_vue_type_script_setup_true_name_envGroupEdit_lang-OORP_IuD.js";
import { u as G, c as F } from "./usePermissionGuard-BuK9RLCQ.js";
import { u as M } from "./useMemberSelectPagination-BLP_arcy.js";
import W from "./nameIdCell-BWLr8c3b.js";
import "./index.vue_vue_type_script_setup_true_lang-8hqXqXGq.js";
import "./timeZone-D3UW65MQ.js";
import "./TableFieldDialog-BI1BUo05.js";
import "./sortable.esm-DneA_jWz.js";
import "./LazyRow.vue_vue_type_script_setup_true_lang-C9dK0oMf.js";
const $ = { class: "table-box" },
  D = e({
    __name: "groupList",
    setup(e) {
      const { t: D } = a.useI18n();
      i();
      const q = _(() => j().currentPlan),
        z = g([]),
        A = g(),
        B = { show: t(n.CREATE_GROUP), label: D("env.group.createBtn") },
        U = g(!1),
        { hasPermission: J, guardedFetch: K } = G({
          permissions: [n.MEMBER_LIST, n.MANAGE_MEMBERS],
        }),
        {
          options: V,
          loading: X,
          loadInitial: Z,
          handlePopupScroll: H,
        } = M({
          fetchPage: (e) =>
            K(() => x(e), { list: [], total: 0 }).then(
              (e) => e ?? { list: [], total: 0 },
            ),
        }),
        {
          loading: Q,
          pagination: Y,
          filters: ee,
          list: ae,
          fetchList: ie,
          onSearch: te,
          listErr: ne,
          onPaginationSizeChange: le,
          onPaginationCurrentChange: re,
          onFiltersChangeByKey: se,
        } = R({
          fetch: (e) => {
            const a = JSON.parse(JSON.stringify(e));
            return ((a.detail = !0), k(a));
          },
          tableName: "envGroupList",
        }),
        oe = async () => {
          const e = await T({ all: !0, detail: !1 });
          z.value = e.list.map((e) => ({ value: e.id, label: e.name }));
        },
        me = _(() => [
          {
            el: "inputGroup",
            key: "inputGroup",
            label: "",
            clearable: !0,
            igOptions: [
              { value: "name", label: D("env.group.req.name") },
              { value: "remark", label: D("base.remark") },
            ],
          },
          {
            el: "select",
            key: "envId",
            label: "",
            placeholder: D("env.group.req.envName"),
            filterable: !0,
            clearable: !0,
            options: z.value,
            getOptionsFn: oe,
          },
          ...F(J.value, {
            el: "select",
            key: "memberId",
            label: "",
            placeholder: D("env.group.req.memberName"),
            filterable: !1,
            clearable: !0,
            options: V.value,
            loading: X.value,
            getOptionsFn: Z,
            onPopupScroll: H,
          }),
        ]),
        pe = () => {
          ((ee.name = void 0),
            (ee.envName = void 0),
            (ee.memberName = void 0),
            (ee.remark = void 0));
        },
        ue = () => {
          var e, a;
          ((null == (e = null == q ? void 0 : q.value)
            ? void 0
            : e.timeLimit) ?? 0) < 0
            ? L()
            : null == (a = A.value) ||
              a.acceptParams({
                title: "env.group.createTitle",
                row: { name: void 0, memberIds: void 0, remark: void 0 },
              });
        },
        de = async (e) => {
          var a;
          ((null == (a = null == q ? void 0 : q.value)
            ? void 0
            : a.timeLimit) ?? 0) < 0
            ? L()
            : (await y(e, U.value), te());
        },
        ve = _(() => [
          {
            prop: "name",
            label: D("env.group.resp.name"),
            fixed: "left",
            minWidth: 170,
            showOverflowTooltip: !1,
            render: ({ row: e }) => h(W, { name: e.name, id: e.id }),
          },
          { prop: "remark", label: D("base.remark"), minWidth: 120 },
          {
            prop: "envList",
            label: D("env.group.resp.envList"),
            minWidth: 150,
            render: ({ row: e }) => {
              var a;
              if (!e.envList) return h("span", "--");
              if (e.envList.length <= 2)
                return h(
                  "span",
                  null == (a = e.envList)
                    ? void 0
                    : a.map((e) => e.name || `--(${e.serialNum})`).join("、"),
                );
              {
                const a = e.envList
                    .slice(0, 2)
                    .map((e) => e.name || `--(${e.serialNum})`)
                    .join("、"),
                  i = e.envList
                    .map(
                      (e) =>
                        `${e.name} (${D("env.group.resp.num")}：${e.serialNum})`,
                    )
                    .join("、");
                return h("div", { class: "tw-flex tw-items-center" }, [
                  h(
                    "div",
                    { class: "tw-truncate tw-max-w-[150px]" },
                    h("span", [a, D("base.etc", { N: e.envList.length })]),
                  ),
                  h(
                    "div",
                    { class: "tw-flex-shrink-0 tw-ml-[4px]" },
                    h(
                      E,
                      {
                        placement: "top",
                        title: D("env.group.resp.envList"),
                        width: "300",
                        trigger: "click",
                      },
                      {
                        reference: () =>
                          h(
                            c,
                            { link: !0, type: "primary" },
                            { default: () => D("base.view") },
                          ),
                        default: () =>
                          h(
                            "div",
                            { class: "view-more-main" },
                            { default: () => i },
                          ),
                      },
                    ),
                  ),
                ]);
              }
            },
          },
          {
            prop: "memberList",
            label: D("env.group.resp.memberList"),
            minWidth: 150,
            render: ({ row: e }) => {
              var a;
              if (!e.memberList) return h("span");
              if (e.memberList.length <= 2)
                return h(
                  "span",
                  { class: "tw-truncate" },
                  null == (a = e.memberList)
                    ? void 0
                    : a.map((e) => e.memberName).join("、"),
                );
              {
                const a = e.memberList
                    .slice(0, 2)
                    .map((e) => e.memberName)
                    .join("、"),
                  i = e.memberList.map((e) => e.memberName).join("、");
                return h("div", { class: "tw-flex tw-items-center" }, [
                  h(
                    "div",
                    { class: "tw-truncate tw-max-w-[150px]" },
                    h("span", [a, D("base.etc", { N: e.memberList.length })]),
                  ),
                  h(
                    "div",
                    { class: "tw-flex-shrink-0 tw-ml-[4px]" },
                    h(
                      E,
                      {
                        placement: "top",
                        title: D("env.group.resp.memberList"),
                        width: "300",
                        trigger: "click",
                      },
                      {
                        reference: () =>
                          h(
                            c,
                            { link: !0, type: "primary" },
                            { default: () => D("base.view") },
                          ),
                        default: () =>
                          h(
                            "div",
                            { class: "view-more-main" },
                            { default: () => i },
                          ),
                      },
                    ),
                  ),
                ]);
              }
            },
          },
          {
            prop: "createTime",
            label: D("base.createTime"),
            minWidth: 120,
            specialType: C.TIME,
            isTimeZoneChange: !0,
          },
          {
            prop: "operation",
            label: D("base.operation"),
            fixed: "right",
            width: 120,
          },
        ]);
      return (
        ie(),
        (e, a) => {
          const i = l("auth");
          return (
            r(),
            s("div", $, [
              o(
                S,
                {
                  list: p(ae),
                  columns: ve.value,
                  loading: p(Q),
                  onRefresh: p(ie),
                  listErr: p(ne),
                },
                {
                  extends: m(() => [o(P, { createProps: B, onOnCreate: ue })]),
                  filters: m(() => [
                    o(
                      N,
                      {
                        config: me.value,
                        labelWidth: 80,
                        "model-value": p(ee),
                        autoSearch: !1,
                        onSearch: p(te),
                        onReset: pe,
                        "onField:change": p(se),
                      },
                      null,
                      8,
                      ["config", "model-value", "onSearch", "onField:change"],
                    ),
                  ]),
                  operation: m((e) => [
                    e.row.isDefault
                      ? d("", !0)
                      : v(
                          (r(),
                          u(
                            p(c),
                            {
                              key: 0,
                              link: "",
                              type: "info",
                              onClick: (a) =>
                                (async (e) => {
                                  var a, i;
                                  if (
                                    ((null == (a = null == q ? void 0 : q.value)
                                      ? void 0
                                      : a.timeLimit) ?? 0) < 0
                                  )
                                    return void L();
                                  const t = e.memberList
                                    ? e.memberList.map((e) => e.memberId)
                                    : [];
                                  null == (i = A.value) ||
                                    i.acceptParams({
                                      title: "env.group.editTitle",
                                      row: { ...e, memberIds: t },
                                    });
                                })(e.row),
                            },
                            {
                              default: m(() => [
                                ...(a[0] ||
                                  (a[0] = [
                                    b(
                                      "i",
                                      { class: "iconfont icon-edit" },
                                      null,
                                      -1,
                                    ),
                                  ])),
                              ]),
                              _: 1,
                            },
                            8,
                            ["onClick"],
                          )),
                          [[i, p(n).EDIT_GROUPS]],
                        ),
                    e.row.isDefault
                      ? d("", !0)
                      : v(
                          (r(),
                          u(
                            p(c),
                            {
                              key: 1,
                              link: "",
                              type: "info",
                              onClick: (a) => {
                                return (
                                  (i = e.row.id),
                                  (U.value = !1),
                                  void f({
                                    title: D("base.delTitle"),
                                    message: () =>
                                      h("div", [
                                        h("div", D("env.group.delHint")),
                                        h("div", [
                                          h(w, {
                                            modelValue: U.value,
                                            "onUpdate:modelValue": (e) => {
                                              U.value = e;
                                            },
                                            label: D("env.group.delOption"),
                                          }),
                                        ]),
                                      ]),
                                    confirmCb: async () => {
                                      await de(i);
                                    },
                                  })
                                );
                                var i;
                              },
                            },
                            {
                              default: m(() => [
                                ...(a[1] ||
                                  (a[1] = [
                                    b(
                                      "i",
                                      { class: "iconfont icon-delete" },
                                      null,
                                      -1,
                                    ),
                                  ])),
                              ]),
                              _: 1,
                            },
                            8,
                            ["onClick"],
                          )),
                          [[i, p(n).DELETE_GROUP]],
                        ),
                  ]),
                  pagination: m(() => [
                    p(ae).length
                      ? (r(),
                        u(
                          O,
                          {
                            key: 0,
                            pageable: p(Y),
                            handleSizeChange: p(le),
                            handleCurrentChange: p(re),
                          },
                          null,
                          8,
                          [
                            "pageable",
                            "handleSizeChange",
                            "handleCurrentChange",
                          ],
                        ))
                      : d("", !0),
                  ]),
                  _: 1,
                },
                8,
                ["list", "columns", "loading", "onRefresh", "listErr"],
              ),
              o(I, { ref_key: "editRef", ref: A, onSubmit: p(ie) }, null, 8, [
                "onSubmit",
              ]),
            ])
          );
        }
      );
    },
  });
export { D as default };
