import { E as e } from "./index-rtKG2tmD.js";
import {
  d as o,
  v as l,
  r as t,
  o as r,
  h as a,
  f as s,
  w as p,
  a as i,
  b as n,
  X as u,
  e as v,
  t as c,
  ax as _,
  ds as m,
  i as d,
  C,
  V as x,
  _ as f,
} from "./index-BUIbb6Pa.js";
import { _ as w } from "./index.vue_vue_type_style_index_0_lang-CoddPsWR.js";
import { e as y } from "./transformExcel-Cy_3yjj_.js";
import "./timeZone-D3UW65MQ.js";
import "./TableFieldDialog-BI1BUo05.js";
import "./sortable.esm-DneA_jWz.js";
import "./LazyRow.vue_vue_type_script_setup_true_lang-C9dK0oMf.js";
const g = { class: "tw-flex-col tw-h-fit" },
  E = { class: "min-table tw-w-[100%]" },
  I = { class: "tw-flex tw-items-center tw-justify-between tw-w-full" },
  S = { class: "tw-text-main" },
  O = { class: "tw-text-[var(--danger-color)]" },
  T = { class: "tw-mt-[10px]" },
  R = f(
    o({
      __name: "uploadResTable",
      emits: ["close"],
      setup(o, { expose: f, emit: R }) {
        let { t: N } = l.useI18n(),
          X = {
            SUCCESS: "--",
            NOT_NAME: N("env.env.req.importCodeValue.NOT_NAME"),
            REPEAT_NAME: N("env.env.req.importCodeValue.REPEAT_NAME"),
            NOT_GROUP: N("env.env.req.importCodeValue.NOT_GROUP"),
            FIX_UA: N("env.env.req.importCodeValue.FIX_UA"),
            FIX_COOKIE: N("env.env.req.importCodeValue.FIX_COOKIE"),
            FIX_ACCOUNT_FILL_COOKIE: N(
              "env.env.req.importCodeValue.FIX_ACCOUNT_FILL_COOKIE",
            ),
            NOT_SELECT_PROXY: N("env.env.req.importCodeValue.NOT_SELECT_PROXY"),
            FIX_PROXY_TYPE: N("env.env.req.importCodeValue.FIX_PROXY_TYPE"),
            FIX_PROXY: N("env.env.req.importCodeValue.FIX_PROXY"),
            FIX_IP_CHECK_TYPE: N(
              "env.env.req.importCodeValue.FIX_IP_CHECK_TYPE",
            ),
            FIX_ACCOUNT_PLATFORM: N(
              "env.env.req.importCodeValue.FIX_ACCOUNT_PLATFORM",
            ),
            FIX_URL: N("env.env.req.importCodeValue.FIX_URL"),
            FIX_RESOLUTION: N("env.env.req.importCodeValue.FIX_RESOLUTION"),
            ENV_NAME_LIMIT: N("env.env.req.importCodeValue.ENV_NAME_LIMIT"),
            REMARK_LIMIT: N("env.env.req.importCodeValue.REMARK_LIMIT"),
          },
          b = d();
        const F = d(!1),
          h = d([]),
          U = R;
        let V = d({ pageNo: 1, pageSize: 20, total: 0 });
        const P = C(() => {
            const e = (V.value.pageNo - 1) * V.value.pageSize;
            return h.value.slice(e, e + V.value.pageSize);
          }),
          A = C(() => h.value.filter((e) => e.result !== m.SUCCESS).length),
          L = C(() => h.value.filter((e) => e.result === m.SUCCESS).length),
          q = [
            {
              prop: "line",
              label: N("proxy.proxy.import.line"),
              fixed: "left",
              width: 80,
              align: "center",
            },
            {
              prop: "state",
              label: N("proxy.proxy.import.result"),
              fixed: "left",
              width: 200,
            },
            {
              prop: "Reason",
              label: N("proxy.proxy.import.errorType"),
              fixed: "left",
              showOverflowTooltip: !0,
              render: ({ row: e }) => Reflect.get(X, e.result) || "--",
            },
          ];
        function M(e) {
          var o;
          ((V.value.pageSize = e),
            null == (o = b.value) || o.element.setScrollTop(0));
        }
        function Y(e) {
          var o;
          ((V.value.pageNo = e),
            null == (o = b.value) || o.element.setScrollTop(0));
        }
        function j() {
          let e = [
            [
              N("proxy.proxy.import.line"),
              N("proxy.proxy.import.result"),
              N("proxy.proxy.import.errorType"),
            ],
          ];
          (h.value.forEach((o) => {
            e.push([
              o.line,
              o.result === m.SUCCESS
                ? N("message.success")
                : N("proxy.proxy.import.fail"),
              Reflect.get(X, o.result),
            ]);
          }),
            y(e, "Batch import results.xlsx"));
        }
        function K() {
          ((F.value = !1), U("close", h.value));
        }
        return (
          f({
            showDialog: function (e) {
              h.value = [];
              let o = x.cloneDeep(e);
              ((h.value = o.list),
                (V.value.total = o.total),
                (V.value.pageNo = 1),
                (V.value.pageSize = 20),
                (F.value = !0));
            },
            closeDialog: function () {
              F.value = !1;
            },
          }),
          (o, l) => {
            const d = t("el-button"),
              C = t("el-dialog");
            return (
              r(),
              a(
                C,
                {
                  modelValue: F.value,
                  "onUpdate:modelValue": l[0] || (l[0] = (e) => (F.value = e)),
                  title: s(N)("proxy.proxy.import.result"),
                  width: "680",
                  class: "upload-res-table-wrapper",
                  "close-on-click-modal": !1,
                  "close-on-press-escape": !1,
                  "show-close": !1,
                  "destroy-on-close": "",
                },
                {
                  footer: p(() => [
                    i("div", T, [
                      n(
                        d,
                        { onClick: K },
                        {
                          default: p(() => [v(c(s(N)("promotion.close")), 1)]),
                          _: 1,
                        },
                      ),
                    ]),
                  ]),
                  default: p(() => [
                    i("div", g, [
                      i("div", E, [
                        n(
                          e,
                          {
                            list: P.value,
                            columns: q,
                            height: "360",
                            ref_key: "tableRef",
                            ref: b,
                          },
                          {
                            state: p((e) => [
                              i(
                                "div",
                                {
                                  class:
                                    "tw-p-[8px] tw-py-[4px] tw-rounded-[30px] tw-w-fit tw-flex tw-h-[25px] tw-items-center",
                                  style: _({
                                    backgroundColor:
                                      e.row.result === s(m).SUCCESS
                                        ? "rgba(21, 231, 176, 0.14)"
                                        : "rgba(234, 54, 45, 0.14)",
                                  }),
                                },
                                [
                                  i(
                                    "div",
                                    {
                                      class:
                                        "tw-h-[6px] tw-w-[6px] tw-rounded-[50%] tw-mr-[6px] tw-bg-[var(--primary-color)] tw-bg-opacity-85",
                                      style: _({
                                        background:
                                          e.row.result === s(m).SUCCESS
                                            ? "var(--primary-color)"
                                            : "var(--danger-color)",
                                      }),
                                    },
                                    null,
                                    4,
                                  ),
                                  i(
                                    "div",
                                    {
                                      style: _({
                                        color:
                                          e.row.result === s(m).SUCCESS
                                            ? "rgba(21, 231, 176, 0.85)"
                                            : "rgba(234, 54, 45, 0.85)",
                                      }),
                                    },
                                    c(
                                      e.row.result === s(m).SUCCESS
                                        ? s(N)("message.success")
                                        : s(N)("proxy.proxy.import.fail"),
                                    ),
                                    5,
                                  ),
                                ],
                                4,
                              ),
                            ]),
                            filters: p(() => [
                              i("div", I, [
                                i("div", null, [
                                  v(c(s(N)("message.success")) + ": ", 1),
                                  i("span", S, c(L.value + " "), 1),
                                  v(
                                    c(s(N)("proxy.proxy.import.item")) +
                                      " / " +
                                      c(s(N)("proxy.proxy.import.fail")) +
                                      ": ",
                                    1,
                                  ),
                                  i("span", O, c(A.value + " "), 1),
                                  v(c(s(N)("proxy.proxy.import.item")), 1),
                                ]),
                                n(
                                  d,
                                  {
                                    class: "button-info-pro",
                                    link: "",
                                    type: "info",
                                    onClick: j,
                                  },
                                  {
                                    default: p(() => [
                                      l[1] ||
                                        (l[1] = i(
                                          "i",
                                          {
                                            class:
                                              "iconfont icon-Download tw-mr-[4px]",
                                          },
                                          null,
                                          -1,
                                        )),
                                      v(" " + c(s(N)("update.download")), 1),
                                    ]),
                                    _: 1,
                                  },
                                ),
                              ]),
                            ]),
                            pagination: p(() => [
                              h.value.length
                                ? (r(),
                                  a(
                                    w,
                                    {
                                      key: 0,
                                      pageable: s(V),
                                      handleSizeChange: M,
                                      handleCurrentChange: Y,
                                      "pager-count": 3,
                                    },
                                    null,
                                    8,
                                    ["pageable"],
                                  ))
                                : u("", !0),
                            ]),
                            _: 1,
                          },
                          8,
                          ["list"],
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
    [["__scopeId", "data-v-f7c213c7"]],
  );
export { R as default };
