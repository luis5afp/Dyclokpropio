import {
  d as e,
  v as l,
  ee as a,
  R as o,
  ad as n,
  W as t,
  V as i,
  eh as u,
  as as s,
  iZ as p,
  r as d,
  q as c,
  o as r,
  c as v,
  F as y,
  b as m,
  w as f,
  x as g,
  h as C,
  a as h,
  t as T,
  X as w,
  f as b,
  i_ as P,
  z as _,
  O as k,
  e4 as M,
  e as D,
  j1 as A,
  i as $,
  C as E,
  at as R,
  ja as x,
  a3 as S,
  iY as V,
  ac as j,
  _ as I,
} from "./index-BUIbb6Pa.js";
import { _ as F } from "./payDialog.vue_vue_type_style_index_0_lang-BmKrLnEo.js";
import { u as L, a as N } from "./useCostDetail-pWH6e-Lu.js";
import U from "./paySelect-CHLWtiLZ.js";
import B from "./walletPaymentSelect-r4JXYpuJ.js";
import "./browser-DEPKJqf2.js";
import "./walletRechargeDlg-BfDzblZH.js";
const W = { class: "renew-summary-card skeleton-color-pro" },
  q = { class: "summary-item" },
  O = { class: "summary-item" },
  z = { class: "summary-item summary-item-highlight" },
  G = { key: 0 },
  K = { class: "time-group-btn" },
  X = ["onClick"],
  Y = { class: "coupon-code-row" },
  Z = { key: 0 },
  H = { class: "total-pay-wrap" },
  J = { class: "total-pay-price skeleton-color-pro" },
  Q = { class: "high-light-price" },
  ee = { key: 0, class: "tw-ml-[6px] discount-text" },
  le = I(
    e({
      __name: "renewDialog",
      emits: ["submit"],
      setup(e, { expose: I, emit: le }) {
        const ae = $(),
          oe = $(!1),
          ne = $(!1),
          te = $(),
          {
            handleCheckCode: ie,
            checkCodeRes: ue,
            codeCanUse: se,
            canUseCode: pe,
            getCouponCodeTip: de,
            getCouponCodeTipColor: ce,
          } = L();
        let { t: re } = l.useI18n();
        const ve = {
          monthPrice: null,
          lifeTime: 30,
          payType: a.WECHAT_PAY,
          planType: null,
          couponCode: "",
          planConfigId: "",
          payMethodConfig: { pay: !0, wallet: !0 },
        };
        let { payList: ye } = o(n());
        const me = $(),
          fe = E(() => {
            var e;
            return Object.keys(
              (null == (e = Ce.value) ? void 0 : e.discount) || {},
            ).map((e) => {
              var l, a, o, n, t, i, u, s, p, d, c;
              let r,
                v =
                  ((null == (l = ue.value) ? void 0 : l.result) === V.SUCCESS &&
                    (null == (a = ue.value) ? void 0 : a.discountType) ===
                      A.PERCENTAGE &&
                    (null == (o = ue.value) ? void 0 : o.discountValue)) ||
                  0,
                y = (null == (n = ue.value) ? void 0 : n.usedValidate)
                  ? (
                      null == (t = ue.value.usedRule)
                        ? void 0
                        : t.lifeTime.includes(Number(e))
                    )
                    ? v
                    : 0
                  : v,
                m = Ce.value.discount[e] || 1;
              if (y <= 0) r = m;
              else
                switch (null == (i = ue.value) ? void 0 : i.discountStrategy) {
                  case "EXCLUSIVE":
                    r = 1 - y;
                    break;
                  case "BEST_OF":
                    r = Math.min(m, 1 - y);
                    break;
                  case "STACKABLE":
                    r =
                      (null == (u = ge.value) ? void 0 : u.joinActivity) &&
                      (null == (s = ge.value) ? void 0 : s.userJoinActivity)
                        ? m
                        : (null == (p = ge.value) ? void 0 : p.joinDiscount) &&
                            "STACKABLE" ===
                              (null == (d = ue.value)
                                ? void 0
                                : d.discountStrategy) &&
                            2 ===
                              (null == (c = ue.value)
                                ? void 0
                                : c.stackableDiscountTypes)
                          ? 1 - (1 - m + y)
                          : 1 - y;
                    break;
                  default:
                    r = m;
                }
              return { value: Number(e), label: e, discount: r };
            });
          }),
          ge = $({ memberMonthPrice: 0 }),
          Ce = $(),
          he = le,
          Te = R({ ...ve }),
          we = $(!1),
          be = $({}),
          Pe = $(0),
          _e = $(!1),
          { newPayMethod: ke, showTopUp: Me } = N(ge, Te.payMethodConfig, _e),
          De = E(
            () =>
              !(!Te.couponCode || !ue.value) &&
              pe(n().currentPlan.planConfigId, Te.lifeTime),
          ),
          Ae = E(() => ({
            payMethodConfig: [
              {
                validator(e, l, a) {
                  Te.payMethodConfig.pay || Te.payMethodConfig.wallet
                    ? a()
                    : a(new Error(re("walletRecharge.selectPaymentMethod")));
                },
              },
            ],
          }));
        (t(
          () => Te.payMethodConfig.pay,
          (e) => {
            e &&
              j(() => {
                var e;
                null ==
                  (e = document.querySelector(
                    ".wallet-payment-select-wrapper2 .pay-group-btn",
                  )) || e.scrollIntoView({ behavior: "smooth" });
              });
          },
          { deep: !0 },
        ),
          t(
            () => Te.lifeTime,
            () => {
              Te.couponCode && ue.value && (se.value = De.value);
            },
          ));
        I({
          acceptParams: async () => {
            var e;
            try {
              ((we.value = !0),
                (oe.value = !0),
                await n().getPayListFn(),
                (Te.payMethodConfig.pay = !0),
                (Te.payMethodConfig.wallet = !0),
                (Te.couponCode = ""),
                ye.value[0] && (Te.payType = ye.value[0].payType),
                (ue.value = void 0),
                null == (e = me.value) || e.checkProxy(),
                await $e());
            } finally {
              we.value = !1;
            }
          },
        });
        const $e = async () => {
            (await x().then((e) => {
              ((Ce.value = e),
                (Te.planType = e.planType),
                (Te.monthPrice = e.monthPrice),
                (be.value = e.giveDays || {}));
            }),
              await Re());
          },
          Ee = async (e) => {
            let l = i.cloneDeep(Te.payType);
            Te.payType = e;
            let [a] = await s(Re());
            a && (Te.payType = l);
          },
          Re = i.throttle(
            async () => {
              _e.value = !0;
              const e = Date.now();
              Pe.value = e;
              let l = ye.value.find((e) => e.payType === Te.payType),
                a = {
                  orderType: u.PLAN_RENEW,
                  lifeTime: Te.lifeTime,
                  payType: Te.payType,
                  ...((null == l ? void 0 : l.currency)
                    ? { currency: null == l ? void 0 : l.currency }
                    : {}),
                  planConfigId: n().currentPlan.planConfigId,
                  payMethod: ke.value,
                };
              De.value && (a.couponCode = Te.couponCode);
              let [, o] = await s(p(a));
              e == Pe.value && ((_e.value = !1), o && (ge.value = o));
            },
            300,
            { trailing: !0 },
          ),
          xe = $(!1),
          Se = async () => {
            var e, l, a, o, t, i, s, p;
            try {
              if (
                (await (null == (e = ae.value) ? void 0 : e.validate()),
                (xe.value = !0),
                !Te.payMethodConfig.pay && !Te.payMethodConfig.wallet)
              )
                return void S.warning(re("walletRecharge.selectPaymentMethod"));
              (await Ie(), await n().getPayListFn());
              let d = ye.value.find((e) => e.payType === Te.payType),
                c = {
                  orderType: u.PLAN_RENEW,
                  lifeTime: null == Te ? void 0 : Te.lifeTime,
                  payType: null == Te ? void 0 : Te.payType,
                  planType: null == Te ? void 0 : Te.planType,
                  rate:
                    null == (l = null == ge ? void 0 : ge.value)
                      ? void 0
                      : l.rate,
                  rateAmount:
                    null == (a = null == ge ? void 0 : ge.value)
                      ? void 0
                      : a.rateAmount,
                  ...((null == d ? void 0 : d.currency)
                    ? { currency: null == d ? void 0 : d.currency }
                    : {}),
                  payChannel: null == d ? void 0 : d.payChannel,
                  payment:
                    ((null == (o = null == ge ? void 0 : ge.value)
                      ? void 0
                      : o.rateAmount) ?? 0) <= 0
                      ? 0
                      : ((null == (t = null == ge ? void 0 : ge.value)
                          ? void 0
                          : t.payment) ?? 0),
                  planConfigId: n().currentPlan.planConfigId,
                  payMethod: ke.value,
                  couponCode: "",
                  walletBalance:
                    null == (i = null == ge ? void 0 : ge.value)
                      ? void 0
                      : i.walletBalance,
                  walletDeductionAmount:
                    null == (s = null == ge ? void 0 : ge.value)
                      ? void 0
                      : s.walletDeductionAmount,
                };
              (De.value && (c.couponCode = Te.couponCode),
                null == (p = null == te ? void 0 : te.value) ||
                  p.acceptParams(c));
            } finally {
              xe.value = !1;
            }
          },
          Ve = () => {
            je();
          },
          je = () => {
            var e;
            (null == (e = ae.value) || e.resetFields(),
              (oe.value = !1),
              he("submit"));
          };
        async function Ie() {
          Te.couponCode = Te.couponCode.replace(/[^a-zA-Z0-9]/g, "");
          const e = n().currentPlan.planConfigId;
          (await ie(Te.couponCode, e), (se.value = pe(e, Te.lifeTime)), Re());
        }
        function Fe(e) {
          return isNaN(e) || 1 === e || 0 === e
            ? ""
            : `-${e < 0 ? 100 : Math.round(100 * (100 - 100 * e)) / 100}%`;
        }
        return (e, l) => {
          const a = d("el-input"),
            o = d("el-form"),
            n = d("el-button"),
            t = d("el-dialog"),
            u = c("loadingV2"),
            p = c("prevent-label-click");
          return (
            r(),
            v(
              y,
              null,
              [
                m(
                  t,
                  {
                    modelValue: oe.value,
                    "onUpdate:modelValue":
                      l[1] || (l[1] = (e) => (oe.value = e)),
                    "align-center": !0,
                    "close-on-click-modal": !1,
                    "close-on-press-escape": !1,
                    loading: ne.value,
                    title: e.$t("cost.plan.dialog.planRenewal"),
                    class: "plan-renew-dialog",
                    width: "810px",
                  },
                  {
                    footer: f(() => [
                      m(
                        n,
                        { type: "info", onClick: je },
                        {
                          default: f(() => [D(T(e.$t("base.cancel")), 1)]),
                          _: 1,
                        },
                      ),
                      m(
                        n,
                        {
                          disabled: b(Me) || we.value,
                          type: "primary",
                          loading: xe.value,
                          onClick: Se,
                        },
                        {
                          default: f(() => [D(T(e.$t("base.confirm")), 1)]),
                          _: 1,
                        },
                        8,
                        ["disabled", "loading"],
                      ),
                    ]),
                    default: f(() => [
                      g(
                        (r(),
                        C(
                          o,
                          {
                            ref_key: "ruleFormRef",
                            ref: ae,
                            model: Te,
                            rules: Ae.value,
                            "label-position": "top",
                            "label-width": "100px",
                          },
                          {
                            default: f(() => {
                              var o, n, t, p, d, c;
                              return [
                                g(
                                  (r(),
                                  v("div", W, [
                                    h("div", q, [
                                      h(
                                        "span",
                                        null,
                                        T(
                                          e.$t("cost.plan.card.planMonthlyFee"),
                                        ),
                                        1,
                                      ),
                                      h(
                                        "strong",
                                        null,
                                        "$" +
                                          T(
                                            (
                                              (null == Te
                                                ? void 0
                                                : Te.monthPrice) ?? 0
                                            ).toFixed(2),
                                          ),
                                        1,
                                      ),
                                    ]),
                                    h("div", O, [
                                      h(
                                        "span",
                                        null,
                                        T(e.$t("cost.plan.card.currentPlan")) +
                                          " " +
                                          T(
                                            e.$t("cost.plan.dialog.expireDate"),
                                          ),
                                        1,
                                      ),
                                      h(
                                        "strong",
                                        null,
                                        T(
                                          (null == (o = Ce.value)
                                            ? void 0
                                            : o.expireDate) || "--",
                                        ),
                                        1,
                                      ),
                                    ]),
                                    h("div", z, [
                                      h(
                                        "span",
                                        null,
                                        T(
                                          e.$t("cost.plan.dialog.planRenewal"),
                                        ) +
                                          " " +
                                          T(
                                            e.$t("cost.plan.dialog.expireDate"),
                                          ),
                                        1,
                                      ),
                                      h(
                                        "strong",
                                        null,
                                        T(
                                          (null == (n = ge.value)
                                            ? void 0
                                            : n.expireDate) || "--",
                                        ),
                                        1,
                                      ),
                                      be.value[Te.lifeTime]
                                        ? (r(),
                                          v(
                                            "em",
                                            G,
                                            T(
                                              e.$t(
                                                "cost.plan.dialog.moreDaysAdded",
                                                { days: be.value[Te.lifeTime] },
                                              ),
                                            ),
                                            1,
                                          ))
                                        : w("", !0),
                                    ]),
                                  ])),
                                  [[u, { isLoading: we.value, theme: "info" }]],
                                ),
                                m(
                                  b(P),
                                  {
                                    label: e.$t(
                                      "cost.plan.dialog.planUsagePeriod",
                                    ),
                                    class: "life-time",
                                    prop: "lifeTime",
                                  },
                                  {
                                    default: f(() => [
                                      h("div", K, [
                                        (r(!0),
                                        v(
                                          y,
                                          null,
                                          _(
                                            fe.value,
                                            (l) => (
                                              r(),
                                              v(
                                                "button",
                                                {
                                                  key: l.value,
                                                  class: k(
                                                    Te.lifeTime === l.value
                                                      ? "active"
                                                      : "",
                                                  ),
                                                  onClick: (e) =>
                                                    (async (e, l) => {
                                                      e.preventDefault();
                                                      let a = i.cloneDeep(
                                                        Te.lifeTime,
                                                      );
                                                      Te.lifeTime = l;
                                                      let [o] = await s(Re());
                                                      o && (Te.lifeTime = a);
                                                    })(e, l.value),
                                                },
                                                [
                                                  g(
                                                    h(
                                                      "span",
                                                      { class: "discount-tag" },
                                                      T(Fe(l.discount)),
                                                      513,
                                                    ),
                                                    [[M, Fe(l.discount)]],
                                                  ),
                                                  h(
                                                    "span",
                                                    null,
                                                    T(l.label) +
                                                      " " +
                                                      T(
                                                        e.$t(
                                                          "cost.plan.dialog.day",
                                                        ),
                                                      ),
                                                    1,
                                                  ),
                                                ],
                                                10,
                                                X,
                                              )
                                            ),
                                          ),
                                          128,
                                        )),
                                      ]),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                m(
                                  b(P),
                                  {
                                    label: b(re)("cost.plan.dialog.couponCode"),
                                  },
                                  {
                                    default: f(() => [
                                      h("div", Y, [
                                        m(
                                          a,
                                          {
                                            modelValue: Te.couponCode,
                                            "onUpdate:modelValue":
                                              l[0] ||
                                              (l[0] = (e) =>
                                                (Te.couponCode = e)),
                                            placeholder:
                                              b(re)("rpa.task.req.enter"),
                                            class: "coupon-code-input",
                                            onBlur: Ie,
                                          },
                                          null,
                                          8,
                                          ["modelValue", "placeholder"],
                                        ),
                                        b(ue)
                                          ? (r(),
                                            v(
                                              "div",
                                              {
                                                key: 0,
                                                class: k([
                                                  b(ce)(),
                                                  "coupon-code-tip",
                                                ]),
                                              },
                                              [
                                                D(T(b(de)()) + " ", 1),
                                                b(ue).discountType ===
                                                  b(A).PERCENTAGE && De.value
                                                  ? (r(),
                                                    v(
                                                      "span",
                                                      Z,
                                                      "(" +
                                                        T(
                                                          b(re)(
                                                            "cost.plan.dialog.couponCodeTip3",
                                                            {
                                                              num:
                                                                Math.round(
                                                                  1e4 *
                                                                    b(ue)
                                                                      .discountValue,
                                                                ) / 100,
                                                            },
                                                          ),
                                                        ) +
                                                        ")",
                                                      1,
                                                    ))
                                                  : w("", !0),
                                              ],
                                              2,
                                            ))
                                          : w("", !0),
                                      ]),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                h("div", H, [
                                  h("div", null, [
                                    h(
                                      "span",
                                      null,
                                      T(e.$t("cost.plan.list.payAmount")),
                                      1,
                                    ),
                                  ]),
                                  g(
                                    (r(),
                                    v("div", J, [
                                      h(
                                        "span",
                                        Q,
                                        "$" +
                                          T(
                                            (
                                              ((null == (t = ge.value)
                                                ? void 0
                                                : t.payment) ?? 0) +
                                              ((null == (p = ge.value)
                                                ? void 0
                                                : p.walletDeductionAmount) ?? 0)
                                            ).toFixed(2),
                                          ),
                                        1,
                                      ),
                                      (
                                        null == (d = ge.value)
                                          ? void 0
                                          : d.discountPrice
                                      )
                                        ? (r(),
                                          v(
                                            "span",
                                            ee,
                                            T(
                                              e.$t(
                                                "cost.plan.dialog.discounted",
                                              ),
                                            ) +
                                              " $" +
                                              T(
                                                (
                                                  (null == (c = ge.value)
                                                    ? void 0
                                                    : c.discountPrice) ?? 0
                                                ).toFixed(2),
                                              ),
                                            1,
                                          ))
                                        : w("", !0),
                                    ])),
                                    [
                                      [
                                        u,
                                        { isLoading: we.value, theme: "info" },
                                      ],
                                    ],
                                  ),
                                ]),
                                m(
                                  b(P),
                                  { label: b(re)("cost.plan.list.payType") },
                                  {
                                    default: f(() => [
                                      m(
                                        B,
                                        {
                                          payMethodConfig: Te.payMethodConfig,
                                          costDetail: ge.value,
                                          showTopUp: b(Me),
                                          onRefresh: b(Re),
                                        },
                                        null,
                                        8,
                                        [
                                          "payMethodConfig",
                                          "costDetail",
                                          "showTopUp",
                                          "onRefresh",
                                        ],
                                      ),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                Te.payMethodConfig.pay
                                  ? (r(),
                                    C(
                                      b(P),
                                      {
                                        key: 0,
                                        label: e.$t(
                                          "walletRecharge.paymentChannel",
                                        ),
                                        class:
                                          "!tw-mb-0 wallet-payment-select-wrapper2",
                                      },
                                      {
                                        default: f(() => [
                                          m(
                                            U,
                                            {
                                              activePayType: Te.payType,
                                              onChangePay: Ee,
                                              ref_key: "paySelectRef",
                                              ref: me,
                                            },
                                            null,
                                            8,
                                            ["activePayType"],
                                          ),
                                        ]),
                                        _: 1,
                                      },
                                      8,
                                      ["label"],
                                    ))
                                  : w("", !0),
                              ];
                            }),
                            _: 1,
                          },
                          8,
                          ["model", "rules"],
                        )),
                        [[p]],
                      ),
                    ]),
                    _: 1,
                  },
                  8,
                  ["modelValue", "loading", "title"],
                ),
                m(
                  F,
                  { ref_key: "PayDialogRef", ref: te, onConfirmPay: Ve },
                  null,
                  512,
                ),
              ],
              64,
            )
          );
        };
      },
    }),
    [["__scopeId", "data-v-ec92ee8f"]],
  );
export { le as default };
