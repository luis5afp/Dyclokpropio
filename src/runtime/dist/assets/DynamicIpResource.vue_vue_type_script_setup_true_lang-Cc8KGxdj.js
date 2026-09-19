import {
  d as t,
  v as e,
  be as a,
  ah as s,
  P as l,
  g as r,
  r as i,
  o,
  c as n,
  a as c,
  t as u,
  f as p,
  b as w,
  w as v,
  e as d,
  jh as m,
  h as y,
  X as f,
  ji as x,
  b9 as _,
  i as b,
} from "./index-BUIbb6Pa.js";
import { g } from "./DynamicTrafficPurchase.vue_vue_type_script_setup_true_lang-BAxyvPun.js";
import { _ as h } from "./DynamicProxyDialog.vue_vue_type_script_setup_true_lang-PmDjw-OT.js";
import { _ as R } from "./DynamicIpEmptyGuide.vue_vue_type_script_setup_true_lang-CRlR0RGG.js";
import { f as k } from "./ipResourceMock-CCd7H3CQ.js";
const C = {
    class:
      "tw-flex tw-h-full tw-min-h-0 tw-flex-col tw-gap-3 tw-overflow-hidden tw-pb-3 tw-text-[var(--text-color-base)]",
  },
  E = {
    class:
      "tw-flex tw-min-h-[116px] tw-flex-wrap tw-items-center tw-justify-between tw-gap-4 tw-rounded-[10px] tw-border tw-border-[var(--border-color-base)] tw-bg-[var(--bg-base)] tw-px-[22px] tw-py-5 tw-shadow-[0_1px_3px_rgb(15_23_42_/_4%)]",
  },
  D = { class: "tw-flex tw-min-w-0 tw-items-center tw-gap-8" },
  j = { class: "tw-text-[13px] tw-text-[var(--text-color-light2)]" },
  T = { class: "tw-mt-1 tw-flex tw-items-baseline tw-gap-2" },
  I = { class: "tw-text-3xl tw-font-semibold tw-text-[var(--primary-color)]" },
  P = { class: "tw-text-[13px] tw-text-[var(--text-color-light2)]" },
  S = { class: "tw-mt-2 tw-flex tw-items-center tw-gap-2" },
  F = { class: "tw-text-sm tw-font-medium tw-text-[var(--text-color-base)]" },
  G = { class: "tw-flex tw-items-center tw-gap-2" },
  A = t({
    __name: "DynamicIpResource",
    emits: ["purchase", "purchaseHistory"],
    setup(t, { emit: A }) {
      const H = A,
        { t: O } = e.useI18n(),
        B = b(),
        M = b(!1),
        X = b(!1),
        q = b(""),
        V = a(s.CREATE_PROXY),
        W = a(s.VIEW_ORDER_RECORDS),
        Y = b();
      let z;
      const J = async () => {
          ((M.value = !0), (q.value = ""));
          try {
            B.value = await g();
          } catch (t) {
            (console.error("[ipResource] failed to load dynamic summary", t),
              (q.value = O("ipResource.loadFailed")));
          } finally {
            M.value = !1;
          }
        },
        K = async () => {
          var t, e, a;
          if (!X.value) {
            ((X.value = !0), (q.value = ""));
            try {
              const s = await k();
              ((B.value = {
                dynamicTrafficGb: s.remainingFlowGb,
                lastSyncTime: s.lastSyncTime || void 0,
                staticAvailableCount:
                  (null == (t = B.value) ? void 0 : t.staticAvailableCount) ??
                  0,
                staticExpiringCount:
                  (null == (e = B.value) ? void 0 : e.staticExpiringCount) ?? 0,
                staticExpiredCount:
                  (null == (a = B.value) ? void 0 : a.staticExpiredCount) ?? 0,
              }),
                s.syncFailed &&
                  (q.value = s.syncMessage || O("ipResource.loadFailed")));
            } catch (s) {
              (console.error("[ipResource] failed to sync dynamic resource", s),
                (q.value = O("ipResource.loadFailed")));
            } finally {
              X.value = !1;
            }
          }
        },
        L = () => {
          var t;
          V && (null == (t = Y.value) || t.open());
        },
        N = () => {
          J();
        };
      return (
        l(() => {
          ((async () => {
            (await J(), await K());
          })(),
            (z = setInterval(() => {
              K();
            }, 3e5)));
        }),
        r(() => {
          z && clearInterval(z);
        }),
        (t, e) => {
          var a;
          const s = i("el-skeleton-item"),
            l = i("el-skeleton"),
            r = i("el-button"),
            b = i("el-alert");
          return (
            o(),
            n("div", C, [
              c("section", E, [
                c("div", D, [
                  c("div", null, [
                    c("div", j, u(p(O)("ipResource.trafficBalance")), 1),
                    w(
                      l,
                      { loading: M.value, animated: "" },
                      {
                        template: v(() => [
                          w(s, { variant: "text", class: "!tw-h-8 !tw-w-24" }),
                        ]),
                        default: v(() => {
                          var t;
                          return [
                            c("div", T, [
                              c(
                                "span",
                                I,
                                u(
                                  (null == (t = B.value)
                                    ? void 0
                                    : t.dynamicTrafficGb) ?? 0,
                                ),
                                1,
                              ),
                              e[2] ||
                                (e[2] = c(
                                  "span",
                                  {
                                    class:
                                      "tw-text-sm tw-text-[var(--text-color-light2)]",
                                  },
                                  "GB",
                                  -1,
                                )),
                            ]),
                          ];
                        }),
                        _: 1,
                      },
                      8,
                      ["loading"],
                    ),
                  ]),
                  e[3] ||
                    (e[3] = c(
                      "div",
                      {
                        class:
                          "tw-h-12 tw-w-px tw-bg-[var(--border-color-base)]",
                      },
                      null,
                      -1,
                    )),
                  c("div", null, [
                    c("div", P, u(p(O)("ipResource.lastSync")), 1),
                    c("div", S, [
                      c(
                        "span",
                        F,
                        u(
                          (null == (a = B.value) ? void 0 : a.lastSyncTime) ||
                            "--",
                        ),
                        1,
                      ),
                      w(
                        r,
                        {
                          link: "",
                          type: "primary",
                          class:
                            "!tw-bg-transparent before:!tw-bg-transparent hover:!tw-bg-transparent focus:!tw-bg-transparent active:!tw-bg-transparent disabled:!tw-bg-transparent [&.is-loading]:!tw-bg-transparent",
                          icon: p(m),
                          loading: X.value,
                          onClick: K,
                        },
                        {
                          default: v(() => [d(u(p(O)("tabs.refresh")), 1)]),
                          _: 1,
                        },
                        8,
                        ["icon", "loading"],
                      ),
                    ]),
                  ]),
                ]),
                c("div", G, [
                  p(W)
                    ? (o(),
                      y(
                        r,
                        {
                          key: 0,
                          link: "",
                          type: "primary",
                          onClick: e[0] || (e[0] = (t) => H("purchaseHistory")),
                        },
                        {
                          default: v(() => [
                            d(u(p(O)("ipResource.purchaseHistory")), 1),
                          ]),
                          _: 1,
                        },
                      ))
                    : f("", !0),
                  p(W)
                    ? (o(),
                      y(
                        r,
                        {
                          key: 1,
                          type: "primary",
                          icon: p(x),
                          onClick: e[1] || (e[1] = (t) => H("purchase")),
                        },
                        {
                          default: v(() => [
                            d(u(p(O)("ipResource.purchaseTraffic")), 1),
                          ]),
                          _: 1,
                        },
                        8,
                        ["icon"],
                      ))
                    : f("", !0),
                  p(V)
                    ? (o(),
                      y(
                        r,
                        { key: 2, icon: p(_), onClick: L },
                        {
                          default: v(() => [
                            d(u(p(O)("ipResource.createDynamicProxy")), 1),
                          ]),
                          _: 1,
                        },
                        8,
                        ["icon"],
                      ))
                    : f("", !0),
                ]),
              ]),
              q.value
                ? (o(),
                  y(
                    b,
                    {
                      key: 0,
                      closable: !1,
                      title: q.value,
                      type: "error",
                      "show-icon": "",
                    },
                    null,
                    8,
                    ["title"],
                  ))
                : f("", !0),
              w(R, { class: "tw-min-h-0 tw-flex-1 tw-overflow-auto" }),
              p(V)
                ? (o(),
                  y(
                    h,
                    {
                      key: 1,
                      ref_key: "dynamicProxyDialogRef",
                      ref: Y,
                      onSuccess: N,
                    },
                    null,
                    512,
                  ))
                : f("", !0),
            ])
          );
        }
      );
    },
  });
export { A as _ };
