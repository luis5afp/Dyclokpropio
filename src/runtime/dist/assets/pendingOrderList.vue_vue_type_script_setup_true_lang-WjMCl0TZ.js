import {
  d as e,
  v as a,
  ad as t,
  r as n,
  o as l,
  c as i,
  b as s,
  f as o,
  aq as r,
  w as p,
  a as c,
  h as d,
  X as m,
  j7 as u,
  t as h,
  eh as g,
  c5 as y,
  eo as w,
  O as v,
  e as C,
  j8 as f,
  i as T,
  C as b,
  iW as x,
  a5 as L,
  $ as P,
  a1 as O,
  j9 as _,
  a3 as M,
  ev as N,
} from "./index-BUIbb6Pa.js";
import { u as W } from "./useFetchTable-DUveM-tP.js";
import { _ as $ } from "./index.vue_vue_type_style_index_0_lang-CoddPsWR.js";
import { E as A } from "./index-rtKG2tmD.js";
const S = { class: "tw-h-[100%]" },
  R = ["src"],
  k = { key: 1, class: "tw-flex tw-items-center" },
  E = { key: 0, class: "tw-truncate" },
  j = { key: 1 },
  F = { key: 2, class: "tw-truncate" },
  U = e({
    __name: "pendingOrderList",
    setup(e, { expose: U }) {
      let { t: z, locale: D } = a.useI18n();
      const {
        loading: X,
        pagination: B,
        list: I,
        fetchList: V,
        onSearch: q,
        onPaginationSizeChange: H,
        listErr: J,
        onPaginationCurrentChange: Y,
      } = W({ fetch: () => f(), tableName: "pendingOrderList" });
      let Z = T(!1),
        G = t();
      const K = b(() => [
        { prop: "createTime", label: z("base.createTime"), minWidth: 180 },
        {
          prop: "status",
          label: z("rpa.task.list.status"),
          width: "120",
          render: () => z("walletRecharge.pendingPayment"),
        },
        {
          prop: "payMethod",
          label: z("cost.plan.list.payType"),
          minWidth: 150,
        },
        {
          prop: "payment",
          label: z("cost.plan.list.payAmount"),
          minWidth: 150,
          render: ee,
        },
        { prop: "orderNo", label: z("cost.plan.list.orderNo"), minWidth: 220 },
        {
          prop: "content",
          label: z("cost.plan.list.orderCont"),
          minWidth: 300,
        },
        {
          prop: "operation",
          label: z("base.operation"),
          fixed: "right",
          align: "center",
          minWidth: 170,
          render: ({ row: e }) =>
            L(
              P,
              {
                plain: !0,
                type: "primary",
                onClick: () => {
                  return (
                    (a = e.id),
                    void O({
                      title: z("walletRecharge.confirmCancelOrder"),
                      message: z("walletRecharge.refundBalanceOnCancel"),
                      customClass:
                        D.value === N.ZH
                          ? "!tw-min-w-[450px]"
                          : "!tw-min-w-[400px]",
                      confirmCb: async () => {
                        (await _(a),
                          M.success(z("env.env.shareDialog.operatorSuccess")),
                          V(),
                          G.getWalletInfoFn());
                      },
                    })
                  );
                  var a;
                },
              },
              z("walletRecharge.cancelOrder"),
            ),
        },
      ]);
      function Q(e) {
        let a = Number(e.unlimited ?? 0);
        return (
          (a & x.OpenLimit || e.planType !== y.XPlan
            ? ""
            : `，${z("cost.plan.list.xContentDec", { openLimit: e.openLimit })}`) +
          (a & x.EnvLimit1 || e.planType === y.XPlan
            ? ""
            : "，" +
              (e.envLimit +
                " " +
                z("cost.plan.dialog.unit") +
                z("cost.plan.card.envCount"))) +
          (a & x.MemberLimit || e.planType === y.XPlan
            ? ""
            : "，" +
              (e.memberLimit +
                " " +
                z("cost.plan.dialog.unit") +
                z("cost.plan.card.memberCount"))) +
          ([y.Free, y.CUSTOM_PLAN].includes(e.prePlanType) && 0 !== e.lifeTime
            ? `，${z("cost.plan.list.purchaseDays", { lifeTime: e.lifeTime })}`
            : "")
        );
      }
      const ee = ({ row: e }) => {
        let a =
          e.payMethod === w.WALLET
            ? ((null == e ? void 0 : e.walletPayment) ?? 0)
            : ((null == e ? void 0 : e.payment) ?? 0);
        return L("div", [
          L("div", `$${(a <= 0 ? 0 : a).toFixed(2)}`),
          e.payMethod == w.COMBO &&
            L(
              "div",
              { class: "tw-text-[var(--text-light4)]" },
              `(${z("walletRecharge.wallet")} -$${e.walletPayment.toFixed(2)})`,
            ),
        ]);
      };
      return (
        U({
          open: function () {
            ((Z.value = !0), G.getWalletInfoFn(), q());
          },
        }),
        (e, a) => {
          const t = n("el-drawer");
          return (
            l(),
            i("div", null, [
              s(
                t,
                {
                  modelValue: o(Z),
                  "onUpdate:modelValue":
                    a[0] || (a[0] = (e) => (r(Z) ? (Z.value = e) : (Z = e))),
                  title: o(z)("walletRecharge.pendingActivationOrder"),
                  size: "80%",
                },
                {
                  default: p(() => [
                    c("div", S, [
                      s(
                        A,
                        {
                          list: o(I),
                          listErr: o(J),
                          columns: K.value,
                          loading: o(X),
                          onRefresh: o(V),
                          conditionsSlot: !1,
                        },
                        {
                          payMethod: p(({ row: e }) => [
                            c("div", null, [
                              e.payMethod !== o(w).WALLET
                                ? (l(),
                                  i(
                                    "div",
                                    {
                                      key: 0,
                                      class: v(
                                        `${e.payMethod === o(w).COMBO && "tw-mb-[6px]"} tw-flex tw-items-center`,
                                      ),
                                    },
                                    [
                                      c(
                                        "img",
                                        { class: "tw-mr-[8px]", src: e.logo },
                                        null,
                                        8,
                                        R,
                                      ),
                                      C(h(e.label), 1),
                                    ],
                                    2,
                                  ))
                                : m("", !0),
                              e.payMethod !== o(w).PAY
                                ? (l(),
                                  i("div", k, [
                                    a[1] ||
                                      (a[1] = c(
                                        "i",
                                        {
                                          class:
                                            "iconfont icon-Wallet tw-text-[var(--btn-primary-link-color)] tw-mr-[8px]",
                                        },
                                        null,
                                        -1,
                                      )),
                                    C(
                                      " " + h(o(z)("walletRecharge.wallet")),
                                      1,
                                    ),
                                  ]))
                                : m("", !0),
                            ]),
                          ]),
                          content: p(({ row: e }) => [
                            o(u)(e.type)
                              ? (l(),
                                i("div", E, h(e.orderContentTxt || "--"), 1))
                              : e.type === o(g).PLAN_RENEW
                                ? (l(),
                                  i(
                                    "div",
                                    j,
                                    h(
                                      `${e.planType === o(y).CUSTOM_PLAN ? o(z)("enum.PlanType.CUSTOM_PLAN") : e.planName}，${o(z)("cost.plan.list.renewalDays", { lifeTime: e.lifeTime })}`,
                                    ),
                                    1,
                                  ))
                                : (l(),
                                  i("div", F, [
                                    c(
                                      "span",
                                      null,
                                      h(
                                        `${o(z)("cost.plan.dialog.changeTo")} ${e.planType === o(y).CUSTOM_PLAN ? o(z)("enum.PlanType.CUSTOM_PLAN") : e.planName}`,
                                      ),
                                      1,
                                    ),
                                    c("span", null, h(Q(e)), 1),
                                  ])),
                          ]),
                          pagination: p(() => [
                            o(I).length
                              ? (l(),
                                d(
                                  $,
                                  {
                                    key: 0,
                                    pageable: o(B),
                                    handleSizeChange: o(H),
                                    handleCurrentChange: o(Y),
                                  },
                                  null,
                                  8,
                                  [
                                    "pageable",
                                    "handleSizeChange",
                                    "handleCurrentChange",
                                  ],
                                ))
                              : m("", !0),
                          ]),
                          _: 1,
                        },
                        8,
                        ["list", "listErr", "columns", "loading", "onRefresh"],
                      ),
                    ]),
                  ]),
                  _: 1,
                },
                8,
                ["modelValue", "title"],
              ),
            ])
          );
        }
      );
    },
  });
export { U as _ };
