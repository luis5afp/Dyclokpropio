import {
  d as e,
  v as t,
  hQ as a,
  u as s,
  jr as c,
  be as n,
  ah as u,
  r as l,
  o as r,
  c as i,
  b as o,
  w as p,
  f as _,
  h as w,
  a as y,
  t as v,
  X as m,
  i as h,
  C as f,
} from "./index-BUIbb6Pa.js";
import { _ as d } from "./DynamicIpResource.vue_vue_type_script_setup_true_lang-Cc8KGxdj.js";
import { _ as x } from "./StaticIpResource.vue_vue_type_script_setup_true_lang-DI08fwkR.js";
import { _ as b } from "./DynamicTrafficPurchase.vue_vue_type_script_setup_true_lang-BAxyvPun.js";
import { _ as R } from "./StaticIpPurchase.vue_vue_type_script_setup_true_lang-Cjw6R1ER.js";
import { _ as g } from "./IpResourcePurchaseDialog.vue_vue_type_script_setup_true_lang-DcxcArWP.js";
const k = {
    class:
      "tw-flex tw-h-full tw-flex-col tw-px-2 tw-pt-3 tw-text-[var(--text-color-base)]",
  },
  j = {
    key: 4,
    class:
      "tw-flex-1 tw-min-h-0 tw-mt-3 tw-rounded-lg tw-bg-[var(--bg-base)] tw-flex tw-items-center tw-justify-center",
  },
  q = { class: "tw-text-[var(--text-color-light2)]" },
  P = e({
    __name: "index",
    setup(e) {
      const { t: P } = t.useI18n(),
        D = a(),
        I = s(),
        S = c(D.query),
        C = h(S.type),
        E = n(u.VIEW_ORDER_RECORDS),
        B = f(() => {
          const e = c(D.query);
          return E || "purchase" !== e.action
            ? e
            : { ...e, action: "overview" };
        }),
        H = h(),
        O = async (e) => {
          const t = "static" === e ? "static" : "dynamic",
            a = { ...D.query, type: t };
          (delete a.action, await I.replace({ query: a }));
        },
        T = () => {
          var e;
          E && (null == (e = H.value) || e.open(C.value));
        },
        L = async () => {
          await I.push("/plan/planList");
        },
        Q = async () => {
          const e = { ...D.query };
          (delete e.action, await I.replace({ query: e }));
        },
        V = async () => {
          await Q();
        },
        W = (e) => {
          var t;
          null == (t = H.value) || t.open("static", e);
        };
      return (e, t) => {
        const a = l("el-tab-pane"),
          s = l("el-tabs");
        return (
          r(),
          i("div", k, [
            o(
              s,
              {
                "model-value": C.value,
                class:
                  "tw-flex-none [&_.el-tabs__content]:tw-hidden [&_.el-tabs__header]:tw-m-0",
                onTabChange: O,
              },
              {
                default: p(() => [
                  o(
                    a,
                    { label: _(P)("ipResource.static"), name: "static" },
                    null,
                    8,
                    ["label"],
                  ),
                  o(
                    a,
                    { label: _(P)("ipResource.dynamic"), name: "dynamic" },
                    null,
                    8,
                    ["label"],
                  ),
                ]),
                _: 1,
              },
              8,
              ["model-value"],
            ),
            "dynamic" === B.value.type && "overview" === B.value.action
              ? (r(),
                w(d, {
                  key: 0,
                  class: "tw-flex-1 tw-min-h-0 tw-mt-3",
                  onPurchase: T,
                  onPurchaseHistory: L,
                }))
              : "static" === B.value.type && "overview" === B.value.action
                ? (r(),
                  w(x, {
                    key: 1,
                    class: "tw-flex-1 tw-min-h-0 tw-mt-3",
                    onPurchase: T,
                    onPurchaseHistory: L,
                    onRenew: W,
                  }))
                : "dynamic" === B.value.type && "purchase" === B.value.action
                  ? (r(),
                    w(b, {
                      key: 2,
                      class: "tw-flex-1 tw-min-h-0 tw-mt-5",
                      onBack: Q,
                      onSuccess: V,
                    }))
                  : "static" === B.value.type && "purchase" === B.value.action
                    ? (r(),
                      w(R, {
                        key: 3,
                        class: "tw-flex-1 tw-min-h-0 tw-mt-5",
                        onBack: Q,
                        onSuccess: V,
                      }))
                    : (r(),
                      i("div", j, [
                        y(
                          "span",
                          q,
                          v(
                            "dynamic" === C.value
                              ? _(P)("ipResource.dynamic")
                              : _(P)("ipResource.static"),
                          ),
                          1,
                        ),
                      ])),
            _(E)
              ? (r(),
                w(
                  g,
                  {
                    key: 5,
                    ref_key: "purchaseDialogRef",
                    ref: H,
                    onSuccess: V,
                  },
                  null,
                  512,
                ))
              : m("", !0),
          ])
        );
      };
    },
  });
export { P as _ };
