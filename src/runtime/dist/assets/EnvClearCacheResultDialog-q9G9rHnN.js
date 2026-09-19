import {
  d as e,
  v as l,
  r as s,
  o as a,
  h as c,
  w as o,
  a as r,
  b as t,
  f as n,
  bg as u,
  t as i,
  c as v,
  F as p,
  z as d,
  e as h,
  X as F,
  i as f,
  C as S,
  _ as g,
} from "./index-BUIbb6Pa.js";
const m = () => ({
    localSuccess: [],
    localFail: [],
    serverSuccess: [],
    serverFail: [],
  }),
  y = (e) => {
    const l = [
        {
          key: "local",
          total: e.localSuccess.length + e.localFail.length,
          success: e.localSuccess.length,
          fail: e.localFail.length,
          hasFailure: e.localFail.length > 0,
        },
        {
          key: "server",
          total: e.serverSuccess.length + e.serverFail.length,
          success: e.serverSuccess.length,
          fail: e.serverFail.length,
          hasFailure: e.serverFail.length > 0,
        },
      ],
      s = ((e) => {
        const l = new Set([
            ...e.localSuccess,
            ...e.localFail,
            ...e.serverSuccess,
            ...e.serverFail,
          ]),
          s = new Set([...e.localFail, ...e.serverFail]);
        return {
          total: l.size,
          success: Array.from(l).filter((e) => !s.has(e)).length,
          fail: s.size,
        };
      })(e);
    return { ...s, scopes: l };
  },
  _ = { class: "clear-cache-result" },
  b = { class: "result-heading" },
  k = { class: "success-icon" },
  w = { class: "scope-section" },
  x = { class: "scope-panel" },
  C = { class: "scope-main" },
  j = { class: "scope-name" },
  z = { class: "scope-stats" },
  D = { class: "scope-state" },
  E = { class: "is-success" },
  T = { class: "scope-state" },
  V = { class: "is-fail" },
  A = { key: 0, class: "failure-reason" },
  I = { class: "failure-detail" },
  O = { class: "result-footer" },
  P = g(
    e({
      __name: "EnvClearCacheResultDialog",
      setup(e, { expose: g }) {
        const { t: m } = l.useI18n(),
          P = f(!1),
          R = f({
            localSuccess: [],
            localFail: [],
            serverSuccess: [],
            serverFail: [],
          }),
          M = f(),
          U = S(() => y(R.value)),
          X = S(() => ({
            local: m("env.cache.localDevice"),
            server: m("env.cache.cloudEnvironment"),
          })),
          q = S(() => [
            ...U.value.scopes.map((e) => ({
              key: e.key,
              label: X.value[e.key],
              success: e.success,
              fail: e.fail,
            })),
          ]),
          B = S(() =>
            Array.from(
              new Set([...R.value.localFail, ...R.value.serverFail]),
            ).sort((e, l) => e - l),
          ),
          G = S(() => B.value.join(", ")),
          H = () => {
            P.value = !1;
          },
          J = () => {
            var e;
            (null == (e = M.value) || e.call(M),
              (M.value = void 0),
              (R.value = {
                localSuccess: [],
                localFail: [],
                serverSuccess: [],
                serverFail: [],
              }));
          };
        return (
          g({
            acceptParams: (e) => {
              var l;
              ((R.value = {
                localSuccess: [...(l = e.result).localSuccess],
                localFail: [...l.localFail],
                serverSuccess: [...l.serverSuccess],
                serverFail: [...l.serverFail],
              }),
                (M.value = e.closeCallback),
                (P.value = !0));
            },
          }),
          (e, l) => {
            const f = s("el-icon"),
              S = s("el-tooltip"),
              g = s("el-button"),
              y = s("el-dialog");
            return (
              a(),
              c(
                y,
                {
                  modelValue: P.value,
                  "onUpdate:modelValue": l[0] || (l[0] = (e) => (P.value = e)),
                  width: "600px",
                  "align-center": !0,
                  "close-on-click-modal": !1,
                  "close-on-press-escape": !1,
                  class: "clear-cache-result-dialog",
                  "append-to-body": "",
                  onClosed: J,
                },
                {
                  default: o(() => [
                    r("div", _, [
                      r("div", b, [
                        r("span", k, [
                          t(f, null, { default: o(() => [t(n(u))]), _: 1 }),
                        ]),
                        r("div", null, [
                          r(
                            "h2",
                            null,
                            i(n(m)("env.cache.clearResultTitle")),
                            1,
                          ),
                        ]),
                      ]),
                      r("section", w, [
                        r("div", x, [
                          (a(!0),
                          v(
                            p,
                            null,
                            d(
                              q.value,
                              (e) => (
                                a(),
                                v("div", { key: e.key, class: "scope-row" }, [
                                  r("div", C, [r("span", j, i(e.label), 1)]),
                                  r("div", z, [
                                    r("span", D, [
                                      h(i(n(m)("env.cache.success")) + " ", 1),
                                      r("span", E, i(e.success), 1),
                                      h(" " + i(n(m)("env.cache.unit")), 1),
                                    ]),
                                    r("span", T, [
                                      h(i(n(m)("env.cache.fail")) + " ", 1),
                                      r("span", V, i(e.fail), 1),
                                      h(" " + i(n(m)("env.cache.unit")), 1),
                                    ]),
                                  ]),
                                ])
                              ),
                            ),
                            128,
                          )),
                        ]),
                        U.value.fail > 0
                          ? (a(),
                            v("p", A, [
                              r(
                                "span",
                                null,
                                i(n(m)("env.cache.clearFailureTip")),
                                1,
                              ),
                              t(
                                S,
                                {
                                  content: G.value,
                                  placement: "top",
                                  "popper-class":
                                    "!tw-max-w-[320px] !tw-break-words",
                                },
                                {
                                  default: o(() => [
                                    r(
                                      "span",
                                      I,
                                      i(n(m)("env.cache.clearFailureDetail")),
                                      1,
                                    ),
                                  ]),
                                  _: 1,
                                },
                                8,
                                ["content"],
                              ),
                            ]))
                          : F("", !0),
                      ]),
                      r("div", O, [
                        t(
                          g,
                          { type: "info", class: "close-button", onClick: H },
                          {
                            default: o(() => [
                              h(i(n(m)("promotion.close")), 1),
                            ]),
                            _: 1,
                          },
                        ),
                      ]),
                    ]),
                  ]),
                  _: 1,
                },
                8,
                ["modelValue"],
              )
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-71c8da7f"]],
  ),
  R = Object.freeze(
    Object.defineProperty({ __proto__: null, default: P }, Symbol.toStringTag, {
      value: "Module",
    }),
  );
export { P as E, R as a, m as c };
