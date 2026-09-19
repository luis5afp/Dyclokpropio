import {
  d as e,
  v as a,
  o as r,
  c as n,
  b as l,
  f as s,
  w as t,
  h as o,
  X as i,
  f0 as m,
  C as f,
  i as v,
  eX as d,
  aL as p,
  a5 as c,
  f1 as g,
} from "./index-BUIbb6Pa.js";
import { E as h } from "./index-CLVJdR_V.js";
import { E as u } from "./index-rtKG2tmD.js";
import { _ as b } from "./index.vue_vue_type_style_index_0_lang-CoddPsWR.js";
import { u as D } from "./useFetchTable-DUveM-tP.js";
import { s as T } from "./timeZone-D3UW65MQ.js";
import { u as I } from "./useMemberSelectPagination-BLP_arcy.js";
import { u as Y } from "./index-CjqfvICL.js";
const y = { class: "tw-h-full tw-flex tw-flex-col" },
  E = e({
    __name: "envTransferLogList",
    setup(e, { expose: E }) {
      const { t: k } = a.useI18n(),
        P = v(!1),
        {
          options: C,
          loading: M,
          loadInitial: x,
          handlePopupScroll: S,
        } = I({ fetchPage: d }),
        {
          loading: _,
          pagination: N,
          filters: j,
          list: w,
          fetchList: H,
          onSearch: F,
          onPaginationSizeChange: R,
          onPaginationCurrentChange: L,
          onFiltersChangeByKey: O,
          listErr: $,
        } = D({
          fetch: (e) => {
            const { date: a, ...r } = e,
              [n, l] = a || [];
            return m({
              ...r,
              detail: !0,
              ...(n
                ? { startCreateTime: T(Y(n, "YYYY-MM-DD HH:mm:ss").value) }
                : {}),
              ...(l
                ? { endCreateTime: T(Y(l, "YYYY-MM-DD HH:mm:ss").value) }
                : {}),
            });
          },
          tableName: "envTransferLogDrawer",
        }),
        z = f(() => [
          {
            el: "input",
            key: "serialNum",
            label: "",
            placeholder: k("env.env.transferDialog.transferEnvOfId"),
            clearable: !0,
          },
          {
            el: "input",
            key: "remark",
            label: "",
            placeholder: k("env.env.transferDialog.transferRemark"),
            clearable: !0,
          },
          {
            el: "input",
            key: "teamId",
            label: k("env.env.shareDialog.shareEmailTeamId"),
            isPackUp: !0,
            placeholder: k("env.env.shareDialog.shareEmailTeamId"),
            clearable: !0,
          },
          {
            el: "select",
            key: "createById",
            label: k("env.env.shareDialog.operator"),
            placeholder: k("env.env.shareDialog.operator"),
            filterable: !1,
            clearable: !0,
            isPackUp: !0,
            options: C.value,
            loading: M.value,
            getOptionsFn: x,
            onPopupScroll: S,
          },
          {
            el: "datePicker",
            key: "date",
            label: k("env.env.transferDialog.transferTime"),
            placeholder: k("env.env.filter.date"),
            startPlaceholder: k("env.env.transferDialog.transferTime"),
            endPlaceholder: k("env.env.transferDialog.transferTime"),
            type: "datetimerange",
            format: "YYYY-MM-DD HH:mm",
            valueFormat: "YYYY-MM-DD HH:mm",
            clearable: !0,
            isPackUp: !0,
            rangeSeparator: k("base.to"),
          },
        ]),
        B = f(() => [
          {
            prop: "environmentName",
            label: k("env.env.transferDialog.transferEnv"),
            render: ({ row: e }) =>
              c(
                "div",
                { class: "sle" },
                `${e.environmentName} (${e.serialNum})`,
              ),
          },
          { prop: "remark", label: k("env.env.transferDialog.transferRemark") },
          {
            prop: "transferTeamId",
            label: k("env.env.transferDialog.transferTeam"),
            render: ({ row: e }) =>
              c("div", {}, [
                c(
                  "div",
                  (e.transferEmail ? k("login.email") : k("header.orgName")) +
                    ": ",
                ),
                c(
                  "div",
                  {},
                  e.transferEmail ? e.transferEmail : e.transferTeamId,
                ),
                e.transferEmail &&
                  c("div", `(${k("header.orgName")}: ${e.transferTeamId})`),
              ]),
          },
          {
            prop: "transferInfo",
            label: k("env.env.transferDialog.transferMoreInfo"),
            render: ({ row: e }) =>
              e.transferInfo
                ? c("div", {}, [
                    e.transferInfo.includes(g.NAME)
                      ? c("div", {}, k("env.env.req.name"))
                      : null,
                    e.transferInfo.includes(g.REMARK)
                      ? c("div", {}, k("env.env.req.remark"))
                      : null,
                    e.transferInfo.includes(g.PROXY)
                      ? c("div", {}, k("env.env.proxyInfo"))
                      : null,
                  ])
                : c("span", "--"),
          },
          { prop: "createByName", label: k("env.env.shareDialog.operator") },
          {
            prop: "createTime",
            label: k("env.env.transferDialog.transferTime"),
            minWidth: 100,
            specialType: p.TIME,
            isTimeZoneChange: !0,
          },
        ]);
      return (
        E({
          acceptParams: async () => {
            (F(), (P.value = !0));
          },
        }),
        (e, a) => (
          r(),
          n("div", y, [
            l(
              u,
              {
                list: s(w),
                columns: B.value,
                loading: s(_),
                onRefresh: s(H),
                listErr: s($),
              },
              {
                filters: t(() => [
                  l(
                    h,
                    {
                      config: z.value,
                      "model-value": s(j),
                      onSearch: s(F),
                      "onField:change": s(O),
                      autoSearch: !1,
                    },
                    null,
                    8,
                    ["config", "model-value", "onSearch", "onField:change"],
                  ),
                ]),
                pagination: t(() => [
                  s(w).length
                    ? (r(),
                      o(
                        b,
                        {
                          key: 0,
                          pageable: s(N),
                          handleSizeChange: s(R),
                          handleCurrentChange: s(L),
                        },
                        null,
                        8,
                        ["pageable", "handleSizeChange", "handleCurrentChange"],
                      ))
                    : i("", !0),
                ]),
                _: 1,
              },
              8,
              ["list", "columns", "loading", "onRefresh", "listErr"],
            ),
          ])
        )
      );
    },
  });
export { E as _ };
