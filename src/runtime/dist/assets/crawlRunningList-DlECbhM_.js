const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "./jszip.min-BhKzWq9v.js",
      "./index-BUIbb6Pa.js",
      "./index-DL8dDO_o.css",
    ]),
) => i.map((i) => d[i]);
import {
  d as e,
  v as t,
  Q as a,
  R as n,
  S as s,
  i as l,
  T as r,
  U as i,
  V as o,
  W as c,
  g as u,
  r as p,
  f as m,
  o as d,
  c as w,
  a as v,
  t as f,
  b as g,
  w as h,
  h as y,
  X as k,
  Y as _,
  Z as b,
  $ as x,
  e as C,
  F as j,
  a0 as L,
  C as S,
  a1 as T,
  a2 as D,
  a3 as N,
  a4 as O,
  I as $,
  a5 as I,
  a6 as E,
  a7 as J,
  a8 as P,
  a9 as z,
  aa as M,
  ab as R,
  _ as F,
} from "./index-BUIbb6Pa.js";
import { E as B } from "./index-rtKG2tmD.js";
import { u as U } from "./useFetchTable-DUveM-tP.js";
import { _ as A } from "./index.vue_vue_type_style_index_0_lang-CoddPsWR.js";
import W from "./resultCard-C8cRDgmf.js";
import { s as H } from "./util-Cx7pBhYb.js";
import "./timeZone-D3UW65MQ.js";
import "./TableFieldDialog-BI1BUo05.js";
import "./sortable.esm-DneA_jWz.js";
import "./LazyRow.vue_vue_type_script_setup_true_lang-C9dK0oMf.js";
import "./purify.es-LiQUsk4V.js";
import "./config-52pM5gru.js";
const V = { key: 0, class: "tw-h-full crawl-container-list" },
  Z = { class: "tw-text-[14px] tw-my-[12px]" },
  q = ["href", "onClick"],
  K = { key: 1 },
  Q = { class: "tw-w-[16px] tw-flex" },
  X = F(
    e({
      __name: "crawlRunningList",
      emits: ["rollBack"],
      setup(e, { expose: F, emit: X }) {
        let { t: Y } = t.useI18n(),
          G = X,
          ee = a(),
          { crawlerTaskList: te } = n(ee);
        const ae = {
            "tpl-search-to-mindmap": s.Html,
            "tpl-search-to-report": s.Html,
            "tpl-search-to-slides": s.Html,
            "tpl-company-researcher": s.Markdown,
            "tpl-github-analyzer": s.Markdown,
            "tpl-deal-finder": s.Markdown,
            "tpl-content-optimizer": s.Markdown,
            "tpl-marketing-copywriter": s.Markdown,
            "tpl-competitor-analysis": s.Markdown,
            "tpl-review-analyzer": s.Markdown,
            "tpl-hacker-news-scraper": s.Json,
          },
          {
            list: ne,
            fetchList: se,
            pagination: le,
            onPaginationSizeChange: re,
            onPaginationCurrentChange: ie,
            loading: oe,
          } = U({
            fetch: async (e) => {
              var t;
              const a = await L(e);
              return (
                (a.list =
                  null == (t = a.list)
                    ? void 0
                    : t.map((e) => {
                        if (e.taskData) {
                          const t = JSON.parse(e.taskData || "{}");
                          e.contentType =
                            ae[null == t ? void 0 : t.tpl_id] || s.Json;
                        }
                        return e;
                      })),
                a
              );
            },
          });
        let { crawlerMarketList: ce } = n(a());
        const ue = l(null),
          pe = l({
            [r.Execute]: Y("rpa.task.list.execution"),
            [r.Fail]: Y("rpa2.failNum"),
            [r.Pending]: Y("crawler.queued"),
            [r.Success]: Y("rpa2.successNum"),
          }),
          me = l({
            [r.Execute]: i.Execute,
            [r.Fail]: i.Warning,
            [r.Pending]: i.Pending,
            [r.Success]: i.Success,
          });
        let de = S(() => [
            {
              prop: "taskData",
              label: Y("crawler.form.website"),
              showOverflowTooltip: !1,
              render: ({ row: e }) => {
                try {
                  let t = JSON.parse(e.taskData);
                  if (t.name) return t.name;
                  let a = t.urls,
                    n = a.slice(0, 2);
                  return (
                    a.length > 2 && n.push(`${Y("base.etc", { N: a.length })}`),
                    I(
                      R,
                      {
                        placement: "top",
                        popperClass:
                          "!tw-max-w-[400px] !tw-w-fit tw-whitespace-pre-wrap",
                        content: a.join("\n"),
                      },
                      {
                        reference: () =>
                          I(
                            "div",
                            {
                              class:
                                "url-display-container tw-text-sm tw-leading-5 tw-whitespace-pre-wrap",
                            },
                            n.map((e) =>
                              I("div", { class: "tw-line-clamp-2" }, e),
                            ),
                          ),
                      },
                    )
                  );
                } catch (t) {
                  return "--";
                }
              },
            },
            {
              prop: "environmentList",
              label: Y("rpa2.environment"),
              showOverflowTooltip: !1,
              render: ({ row: e }) => {
                var t, a, n;
                if (!(null == (t = e.environmentList) ? void 0 : t.length))
                  return I("span", {}, Y("crawler.public_env"));
                if (e.environmentList.length <= 2)
                  return null ==
                    (n = null == (a = e.environmentList) ? void 0 : a.map)
                    ? void 0
                    : n.call(a, (t, a) =>
                        I(
                          R,
                          {
                            placement: "top",
                            popperClass: "!tw-max-w-[200px] !tw-min-w-fit",
                            content: `${t.name}(${t.serialNum})`,
                          },
                          {
                            reference: () =>
                              I(
                                "div",
                                { class: "sle" },
                                {
                                  default: () => {
                                    var n;
                                    return `${t.name}(${t.serialNum})${a !== ((null == (n = e.environmentList) ? void 0 : n.length) ?? 0) - 1 ? "、" : ""}`;
                                  },
                                },
                              ),
                          },
                        ),
                      );
                {
                  const t = e.environmentList
                      .slice(0, 2)
                      .map((e) => e.name + `(${e.serialNum})`)
                      .join("、"),
                    a = e.environmentList
                      .map((e) => `${e.name}(${e.serialNum})`)
                      .join("、");
                  return I("div", [
                    I("div", I("div", { class: "sle" }, [t])),
                    I("div", Y("base.etc", { N: e.environmentList.length })),
                    I(
                      "div",
                      I(
                        R,
                        {
                          placement: "top",
                          title: Y("env.group.resp.envList"),
                          width: "300",
                          trigger: "click",
                        },
                        {
                          reference: () =>
                            I(
                              x,
                              { link: !0, type: "primary" },
                              { default: () => Y("base.view") },
                            ),
                          default: () =>
                            I(
                              "div",
                              { class: "view-more-main" },
                              { default: () => a },
                            ),
                        },
                      ),
                    ),
                  ]);
                }
              },
            },
            { prop: "status", label: Y("rpa2.runResult") },
            { prop: "runTime", label: Y("rpa2.runTime"), isTimeZoneChange: !0 },
            { prop: "operation", label: Y("base.operation") },
          ]),
          we = l(!1);
        async function ve() {
          (await se(), (we.value = !!le.total));
        }
        const fe = l(!1),
          ge = l(!1),
          he = l(null),
          ye = o.debounce(
            async (e) => {
              var t, a, n;
              if (
                (null == (t = e.environmentList) ? void 0 : t.length) > 1 ||
                (null ==
                (n =
                  null == (a = JSON.parse(e.taskData || "{}"))
                    ? void 0
                    : a.urls)
                  ? void 0
                  : n.length) > 1
              )
                T({
                  title: Y("env.env.shareDialog.operatorTips"),
                  message: Y("crawler.multi_page_results"),
                  showCancelButton: !0,
                  confirmButtonText: Y("update.download"),
                  confirmCb: async () => {
                    e.resultUrl && D(e.resultUrl);
                  },
                });
              else if (e.resultUrl) {
                if (!fe.value) {
                  fe.value = !0;
                  try {
                    O(!0);
                    const t = await ke(e.resultUrl);
                    ((he.value = t),
                      console.log(he.value, "parsedResult.value"),
                      (ge.value = !0),
                      $({
                        title: "",
                        message: () =>
                          I("div", [
                            he.value
                              ? Object.entries(he.value).map(([t, a]) =>
                                  I(W, {
                                    result:
                                      "string" == typeof a ? { [t]: a } : a,
                                    contentType: e.contentType,
                                  }),
                                )
                              : [],
                          ]),
                        showCancelButton: !1,
                        showConfirmButton: !1,
                        autofocus: !1,
                        customClass:
                          "el-message-hid-box__btns crawler-preview-box tw-max-w-[80vw] content-fit",
                      }));
                  } catch (s) {
                    console.error("解析失败:", s);
                  } finally {
                    (E(!0), (fe.value = !1));
                  }
                }
              } else N.warning("没有可查看的结果");
            },
            500,
            { leading: !0 },
          ),
          ke = async (e) => {
            try {
              const a = await fetch(e);
              if (!a.ok)
                throw new Error(`下载失败: ${a.status} ${a.statusText}`);
              const n = await a.arrayBuffer(),
                s = new (
                  await J(
                    () => import("./jszip.min-BhKzWq9v.js").then((e) => e.j),
                    __vite__mapDeps([0, 1, 2]),
                    import.meta.url,
                  )
                ).default(),
                l = await s.loadAsync(n),
                r = {};
              for (const [e, i] of Object.entries(l.files))
                if (!i.dir) {
                  const a = await i.async("string");
                  if (e.endsWith(".json"))
                    try {
                      const t = JSON.parse(a);
                      r[e] = t;
                    } catch (t) {
                      (console.warn(`解析文件 ${e} 失败:`, t), (r[e] = a));
                    }
                  else r[e] = a;
                }
              return r;
            } catch (a) {
              throw new Error(`处理压缩包失败: ${a}`);
            }
          };
        function _e() {
          ue.value && (clearInterval(ue.value), (ue.value = null));
        }
        function be(e) {
          let t = (function (e) {
            try {
              return JSON.parse(e.taskData || "{}");
            } catch (t) {
              return {};
            }
          })(e);
          return !t.tpl_id || ce.value.find((e) => e.tplId === t.tpl_id);
        }
        return (
          ve(),
          c(
            () => te.value,
            () => {
              ee.getUseCrawlerList.every((e) =>
                [r.Success, r.Fail].includes(e.status),
              )
                ? _e()
                : (se(),
                  ue.value ||
                    (ue.value = setInterval(() => {
                      se(!0);
                    }, 3e3)));
            },
            { immediate: !0, deep: !0 },
          ),
          u(() => {
            _e();
          }),
          F({ getCrawlerTaskListPage1: ve }),
          (e, t) => {
            const a = p("el-tooltip");
            return m(we)
              ? (d(),
                w("div", V, [
                  v("div", Z, f(m(Y)("rpa2.runRecord")), 1),
                  g(
                    B,
                    {
                      columns: m(de),
                      list: m(ne),
                      showFilterSlot: !1,
                      loading: m(oe),
                    },
                    {
                      operation: h(({ row: e }) => [
                        [m(r).Fail, m(r).Success].includes(e.status)
                          ? (d(),
                            w(
                              j,
                              { key: 0 },
                              [
                                e.status === m(r).Success
                                  ? (d(),
                                    y(
                                      a,
                                      {
                                        key: 0,
                                        placement: "top",
                                        content: m(Y)("crawler.download_data", {
                                          type: e.contentType || "JSON",
                                        }),
                                      },
                                      {
                                        default: h(() => [
                                          g(
                                            m(x),
                                            { link: "" },
                                            {
                                              default: h(() => [
                                                v(
                                                  "a",
                                                  {
                                                    href: e.resultUrl,
                                                    onClick: (t) =>
                                                      (function (e) {
                                                        let t = JSON.parse(
                                                          e.taskData,
                                                        );
                                                        P({
                                                          businessType:
                                                            M.AI_SPIDER,
                                                          operationType:
                                                            z.DOWNLOAD_AI_SPIDER,
                                                          operationInfo: {
                                                            arr: [
                                                              {
                                                                name: t.name
                                                                  ? t.name
                                                                  : (
                                                                      t.urls ??
                                                                      []
                                                                    ).join(","),
                                                                id: "",
                                                              },
                                                            ],
                                                          },
                                                        });
                                                      })(e),
                                                  },
                                                  [
                                                    ...(t[0] ||
                                                      (t[0] = [
                                                        v(
                                                          "i",
                                                          {
                                                            class:
                                                              "iconfont icon-Download",
                                                          },
                                                          null,
                                                          -1,
                                                        ),
                                                      ])),
                                                  ],
                                                  8,
                                                  q,
                                                ),
                                              ]),
                                              _: 2,
                                            },
                                            1024,
                                          ),
                                        ]),
                                        _: 2,
                                      },
                                      1032,
                                      ["content"],
                                    ))
                                  : k("", !0),
                                be(e)
                                  ? (d(),
                                    y(
                                      a,
                                      {
                                        key: 1,
                                        placement: "top",
                                        content: m(Y)("rpa2.rerun"),
                                      },
                                      {
                                        default: h(() => [
                                          g(
                                            m(x),
                                            {
                                              link: "",
                                              onClick: (t) =>
                                                (function (e) {
                                                  (G("rollBack", {
                                                    taskDataStr: e.taskData,
                                                    envList: e.environmentList,
                                                  }),
                                                    H());
                                                })(e),
                                            },
                                            {
                                              default: h(() => [
                                                ...(t[1] ||
                                                  (t[1] = [
                                                    v(
                                                      "i",
                                                      {
                                                        class:
                                                          "iconfont icon-reset tw-mr-[8px]",
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
                                  : k("", !0),
                              ],
                              64,
                            ))
                          : (d(), w("div", K, "--")),
                      ]),
                      status: h(({ row: e }) => [
                        v("div", Q, [
                          (d(),
                          y(_(m(b)(me.value[e.status])), {
                            class: "tw-inline-block tw-mr-[8px]",
                          })),
                          v("div", null, f(pe.value[e.status]), 1),
                        ]),
                        e.status === m(r).Success
                          ? (d(),
                            y(
                              m(x),
                              {
                                key: 0,
                                class: "tw-ml-[24px]",
                                type: "primary",
                                onClick: (t) => m(ye)(e),
                                link: "",
                              },
                              {
                                default: h(() => [
                                  C(f(m(Y)("crawler.preview")), 1),
                                ]),
                                _: 1,
                              },
                              8,
                              ["onClick"],
                            ))
                          : k("", !0),
                      ]),
                      pagination: h(() => [
                        m(ne).length
                          ? (d(),
                            y(
                              A,
                              {
                                key: 0,
                                handleCurrentChange: m(ie),
                                handleSizeChange: m(re),
                                "page-sizes": [10, 20, 50, 100],
                                pageable: m(le),
                              },
                              null,
                              8,
                              [
                                "handleCurrentChange",
                                "handleSizeChange",
                                "pageable",
                              ],
                            ))
                          : k("", !0),
                      ]),
                      _: 1,
                    },
                    8,
                    ["columns", "list", "loading"],
                  ),
                ]))
              : k("", !0);
          }
        );
      },
    }),
    [["__scopeId", "data-v-e8895955"]],
  );
export { X as default };
