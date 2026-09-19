import {
  d as e,
  v as a,
  G as l,
  r as t,
  o,
  c as r,
  F as i,
  b as s,
  w as n,
  a as p,
  e as u,
  t as c,
  ax as m,
  h as v,
  f as y,
  X as d,
  i as f,
  C as x,
  ev as g,
  js as h,
  jt as w,
  fe as D,
  a5 as b,
  ju as C,
} from "./index-BUIbb6Pa.js";
import { u as _ } from "./useFetchTable-DUveM-tP.js";
import { E } from "./index-rtKG2tmD.js";
import { _ as B } from "./index.vue_vue_type_style_index_0_lang-CoddPsWR.js";
const k =
    "https://tj-gin.oss-us-west-1.aliyuncs.com/static/files/DICloak%E5%AF%BC%E5%85%A5%E4%BB%A3%E7%90%86%E6%A8%A1%E6%9D%BF.xlsx",
  $ =
    "https://tj-gin.oss-us-west-1.aliyuncs.com/static/files/Import%20IP%20template%20with%20DICloak.xlsx",
  j =
    "https://tj-gin.oss-us-west-1.aliyuncs.com/static/files/%D0%98%D0%BC%D0%BF%D0%BE%D1%80%D1%82%20%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%B0%20IP%20%D1%81%20DICloak.xlsx",
  z = { class: "upload-filename" },
  F = { class: "upload-action", type: "primary" },
  I = { style: { color: "var(--primary-color)" } },
  S = { style: { color: "var(--danger-color)" } },
  T = e({
    __name: "proxyImport",
    emits: ["submit"],
    setup(e, { expose: T, emit: P }) {
      const { t: V } = a.useI18n(),
        U = l(),
        A = x(() => U.language),
        N = P,
        L = f(1),
        R = f({
          title: "",
          fileSize: 5,
          fileType: [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ],
        }),
        W = f(""),
        q = f(),
        G = f(!1),
        H = f(!1),
        J = f(!1),
        O = f(),
        X = f([]),
        Z = f([]),
        K = f(0),
        M = f(0),
        Q = f(),
        {
          fetchList: Y,
          pagination: ee,
          listErr: ae,
          onPaginationSizeChange: le,
          onPaginationCurrentChange: te,
        } = _({
          fetch: (e) => {
            const { pageNo: a, pageSize: l } = e;
            return new Promise((e, t) => {
              ((Z.value = X.value.slice((a - 1) * l, a * l)),
                e({
                  list: X.value.slice((a - 1) * l, a * l),
                  total: X.value.length,
                }));
            });
          },
          tableName: "proxyImport",
        }),
        oe = x(() => [
          { prop: "line", label: V("proxy.proxy.import.line"), minWidth: 150 },
          {
            prop: "errorType",
            label: V("proxy.proxy.import.errorType"),
            minWidth: 150,
            render: ({ row: e }) => b("span", V(C[e.errorType])),
          },
        ]),
        re = () => {
          switch (A.value) {
            case g.ZH:
              window.openUrl(k);
              break;
            case g.RU:
              window.openUrl(j);
              break;
            case g.EN:
            case g.VI:
            case g.PT:
            default:
              window.openUrl($);
          }
        },
        ie = async () => {
          await pe();
        },
        se = () => {
          (Q.value.clearFiles(),
            (W.value = ""),
            (q.value = void 0),
            (H.value = !1));
        },
        ne = () => {
          (Q.value.clearFiles(),
            N("submit", K.value),
            (W.value = ""),
            (q.value = void 0),
            (ee.pageNo = 1),
            (K.value = 0),
            (M.value = 0),
            (X.value = []),
            (J.value = !1));
        };
      T({
        acceptParams: (e) => {
          H.value = !0;
        },
      });
      const pe = async (e) => {
          let a = new FormData();
          a.append("file", q.value);
          try {
            G.value = !0;
            const e = await h(a);
            ((X.value = e.errorList),
              (K.value = e.success),
              (M.value = e.error),
              Y(),
              (H.value = !1),
              (J.value = !0));
          } catch (l) {
            ((W.value = ""), (q.value = void 0), Q.value.clearFiles());
          } finally {
            G.value = !1;
          }
        },
        ue = (e) => {
          Q.value.clearFiles();
          const a = e[0];
          ((a.uid = w()), Q.value.handleStart(a));
        },
        ce = (e) => {
          const a = R.value.fileType.includes(e.type),
            l = e.size / 1024 / 1024 < R.value.fileSize;
          return (
            a ||
              D({
                title: V("logout.title"),
                message: V("proxy.proxy.import.fileTypeError"),
                type: "warning",
              }),
            l ||
              setTimeout(() => {
                D({
                  title: V("logout.title"),
                  message: V("proxy.proxy.import.fileSizeError", {
                    fileSize: R.value.fileSize,
                  }),
                  type: "warning",
                });
              }, 0),
            a && l
          );
        },
        me = (e) => {
          ((W.value = e.name), (q.value = e.raw));
        };
      return (e, a) => {
        const l = t("el-upload"),
          f = t("el-button"),
          x = t("el-dialog");
        return (
          o(),
          r(
            i,
            null,
            [
              s(
                x,
                {
                  modelValue: H.value,
                  "onUpdate:modelValue": a[0] || (a[0] = (e) => (H.value = e)),
                  title: e.$t("proxy.proxy.import.batch"),
                  width: "560",
                  center: "",
                  "align-center": "",
                },
                {
                  footer: n(() => [
                    s(
                      f,
                      { type: "info", onClick: se },
                      {
                        default: n(() => [u(c(e.$t("base.cancel")), 1)]),
                        _: 1,
                      },
                    ),
                    s(
                      f,
                      { type: "primary", onClick: ie, loading: G.value },
                      {
                        default: n(() => [u(c(e.$t("base.confirm")), 1)]),
                        _: 1,
                      },
                      8,
                      ["loading"],
                    ),
                  ]),
                  default: n(() => [
                    p("span", null, [
                      u(c(e.$t("proxy.proxy.import.tip1")) + " ", 1),
                      p(
                        "span",
                        {
                          style: {
                            color: "var(--primary-color)",
                            cursor: "pointer",
                          },
                          onClick: re,
                        },
                        c(e.$t("proxy.proxy.import.template")),
                        1,
                      ),
                      u(" ，" + c(e.$t("proxy.proxy.import.tip2")), 1),
                    ]),
                    p(
                      "div",
                      {
                        class: "upload-wrapper",
                        style: m(
                          "justify-content: " +
                            (W.value ? "space-between" : "center"),
                        ),
                      },
                      [
                        p("div", z, c(W.value), 1),
                        s(
                          l,
                          {
                            action: "#",
                            class: "upload",
                            limit: L.value,
                            "on-exceed": ue,
                            "http-request": pe,
                            "auto-upload": !1,
                            "before-upload": ce,
                            "on-change": me,
                            "show-file-list": !1,
                            ref_key: "upload",
                            ref: Q,
                          },
                          {
                            trigger: n(() => [
                              a[2] ||
                                (a[2] = p(
                                  "i",
                                  { class: "iconfont icon-import m-r-4" },
                                  null,
                                  -1,
                                )),
                              p(
                                "div",
                                F,
                                c(e.$t("proxy.proxy.import.uploadExcel")),
                                1,
                              ),
                            ]),
                            _: 1,
                          },
                          8,
                          ["limit"],
                        ),
                      ],
                      4,
                    ),
                  ]),
                  _: 1,
                },
                8,
                ["modelValue", "title"],
              ),
              s(
                x,
                {
                  modelValue: J.value,
                  "onUpdate:modelValue": a[1] || (a[1] = (e) => (J.value = e)),
                  title: e.$t("proxy.proxy.import.result"),
                  width: "700",
                  center: "",
                },
                {
                  footer: n(() => [
                    s(
                      f,
                      {
                        type: "info",
                        onClick: ne,
                        style: { flex: "0 0 230px", "margin-left": "0px" },
                      },
                      {
                        default: n(() => [
                          u(c(e.$t("cost.plan.dialog.close")), 1),
                        ]),
                        _: 1,
                      },
                    ),
                  ]),
                  default: n(() => [
                    p("div", null, [
                      u(c(e.$t("message.success")) + " ", 1),
                      p("span", I, c(K.value), 1),
                      u(
                        " " +
                          c(e.$t("proxy.proxy.import.item")) +
                          "，" +
                          c(e.$t("proxy.proxy.import.fail")) +
                          " ",
                        1,
                      ),
                      p("span", S, c(M.value), 1),
                      u(" " + c(e.$t("proxy.proxy.import.item")), 1),
                    ]),
                    Z.value.length
                      ? (o(),
                        v(
                          E,
                          {
                            key: 0,
                            list: Z.value,
                            listErr: y(ae),
                            columns: oe.value,
                            ref_key: "etableRef",
                            ref: O,
                            class: "import-result-table",
                          },
                          {
                            pagination: n(() => [
                              X.value.length
                                ? (o(),
                                  v(
                                    B,
                                    {
                                      key: 0,
                                      "pager-count": 2,
                                      pageable: y(ee),
                                      handleSizeChange: y(le),
                                      handleCurrentChange: y(te),
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
                          ["list", "listErr", "columns"],
                        ))
                      : d("", !0),
                  ]),
                  _: 1,
                },
                8,
                ["modelValue", "title"],
              ),
            ],
            64,
          )
        );
      };
    },
  });
export { T as _ };
