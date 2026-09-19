import {
  d as e,
  v as t,
  W as a,
  r as l,
  o as s,
  c as o,
  F as n,
  b as r,
  w as i,
  a as c,
  t as u,
  f as p,
  z as d,
  e as v,
  X as m,
  i as g,
  C as f,
  I as k,
  _ as h,
} from "./index-BUIbb6Pa.js";
import { A as x } from "./ActionDialog-Dgihq2Lx.js";
const y = { class: "progress-container" },
  b = { class: "progress-text" },
  w = {
    style: {
      background: "var(--card-base-bg-color)",
      "border-radius": "8px",
      "margin-top": "22px",
      padding: "24px",
    },
  },
  _ = { key: 0, style: { "margin-top": "16px" } },
  R = {
    style: { "max-height": "200px", "overflow-y": "auto", "margin-top": "8px" },
  },
  B = { key: 0 },
  T = h(
    e({
      __name: "ConvertEnvDialog",
      props: {
        modelValue: { type: Boolean, default: !1 },
        percentage: { default: 0 },
        message: { default: "Processing, Please wait..." },
        title: { default: "During the environmental transformation" },
        status: { default: "" },
        convertResults: { default: null },
        shouldBreak: { type: Boolean },
      },
      emits: ["update:modelValue", "cancel", "complete", "clear"],
      setup(e, { emit: h }) {
        const { t: T } = t.useI18n(),
          C = e,
          D = g(),
          I = f(() => Math.floor(C.percentage / 10)),
          P = f(() => 100 === C.percentage),
          A = f(() => {
            var e;
            const t =
                (null == (e = C.convertResults) ? void 0 : e.failed) ?? [],
              a = new Map();
            for (const l of t) {
              const e = l.extraInfo ?? T("env.cookie.failReason.unknownIssue"),
                t = a.get(e) ?? [];
              (l.serialNum && t.push(l.serialNum.toString()), a.set(e, t));
            }
            return Array.from(a.entries()).map(([e, t]) => ({
              reason: e,
              envs: t,
            }));
          }),
          V = h,
          j = (e) => {
            P.value
              ? e()
              : k
                  .confirm(
                    T("env.cookie.suspendTitle"),
                    T("env.env.shareDialog.operatorTips"),
                    {
                      confirmButtonText: T("rpa2.confirm_button"),
                      cancelButtonText: T("base.cancel"),
                      type: "warning",
                    },
                  )
                  .then(() => {
                    V("cancel");
                  })
                  .catch(() => {});
          },
          E = async () => {
            var e;
            (await new Promise((e) => setTimeout(e, 1e3)),
              k.close(),
              null == (e = D.value) ||
                e.acceptParams({
                  icon: "icon-success-prompt",
                  closeBtnText: T("promotion.close"),
                  submitCallback: () => {},
                  closeCallback: () => {
                    V("clear");
                  },
                }),
              V("complete"));
          };
        return (
          a(
            () => C.percentage,
            (e) => {
              e >= 100 && E();
            },
          ),
          a(
            () => C.shouldBreak,
            (e) => {
              e && E();
            },
          ),
          (t, a) => {
            const g = l("el-progress"),
              f = l("el-dialog");
            return (
              s(),
              o(
                n,
                null,
                [
                  r(
                    f,
                    {
                      "model-value": e.modelValue,
                      title: e.title,
                      width: "500px",
                      "close-on-click-modal": !1,
                      "close-on-press-escape": !1,
                      "before-close": j,
                    },
                    {
                      default: i(() => [
                        c("div", y, [
                          c("div", b, u(e.message), 1),
                          r(
                            g,
                            {
                              percentage: e.percentage,
                              "text-inside": !0,
                              "stroke-width": 26,
                              striped: "",
                              "striped-flow": "",
                              duration: I.value,
                            },
                            null,
                            8,
                            ["percentage", "duration"],
                          ),
                        ]),
                      ]),
                      _: 1,
                    },
                    8,
                    ["model-value", "title"],
                  ),
                  r(
                    x,
                    { ref_key: "actionDialogRef", ref: D },
                    {
                      "title-content": i(() => [
                        v(u(p(T)("env.cookie.resultTitle")), 1),
                      ]),
                      content: i(() => {
                        var t, a, l, r;
                        return [
                          c("div", w, [
                            c(
                              "p",
                              null,
                              u(
                                p(T)("env.cookie.resultContent", {
                                  total:
                                    (null == (t = e.convertResults)
                                      ? void 0
                                      : t.total.length) ?? 0,
                                  success:
                                    (null == (a = e.convertResults)
                                      ? void 0
                                      : a.success.length) ?? 0,
                                  fail:
                                    (null == (l = e.convertResults)
                                      ? void 0
                                      : l.failed.length) ?? 0,
                                }),
                              ),
                              1,
                            ),
                            (
                              null == (r = e.convertResults)
                                ? void 0
                                : r.failed.length
                            )
                              ? (s(),
                                o("div", _, [
                                  c(
                                    "strong",
                                    null,
                                    u(p(T)("env.cookie.failEnv")),
                                    1,
                                  ),
                                  c("ul", R, [
                                    (s(!0),
                                    o(
                                      n,
                                      null,
                                      d(
                                        A.value,
                                        (e) => (
                                          s(),
                                          o(
                                            "li",
                                            {
                                              key: e.reason,
                                              style: {
                                                "margin-bottom": "12px",
                                              },
                                            },
                                            [
                                              c("div", null, [
                                                c(
                                                  "strong",
                                                  null,
                                                  u(e.reason),
                                                  1,
                                                ),
                                                (s(!0),
                                                o(
                                                  n,
                                                  null,
                                                  d(
                                                    e.envs,
                                                    (t, a) => (
                                                      s(),
                                                      o("span", { key: t }, [
                                                        v(u(t), 1),
                                                        a < e.envs.length - 1
                                                          ? (s(),
                                                            o("span", B, "、"))
                                                          : m("", !0),
                                                      ])
                                                    ),
                                                  ),
                                                  128,
                                                )),
                                              ]),
                                            ],
                                          )
                                        ),
                                      ),
                                      128,
                                    )),
                                  ]),
                                ]))
                              : m("", !0),
                          ]),
                        ];
                      }),
                      _: 1,
                    },
                    512,
                  ),
                ],
                64,
              )
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-adf524b4"]],
  );
export { T as default };
