import {
  d as e,
  v as a,
  G as t,
  u as s,
  ag as i,
  r as l,
  o as n,
  c as r,
  a as o,
  t as u,
  f as c,
  b as d,
  h as v,
  w as f,
  e as p,
  X as m,
  F as w,
  z as y,
  is as g,
  it as _,
  C as I,
  i as x,
  iu as h,
  iv as k,
  em as b,
  N as C,
  k as B,
  hJ as T,
  hK as D,
  hL as E,
  iw as j,
  ix as A,
  iy as U,
  a1 as $,
  iz as L,
  a3 as R,
  O as S,
  ci as N,
  iA as V,
  el as P,
  _ as K,
} from "./index-BUIbb6Pa.js";
import { _ as M } from "./ResetPasswordDialog.vue_vue_type_script_setup_true_name_ResetPasswordDialog_lang-Ce8FZ9od.js";
import { R as O, a as G } from "./realNameVerificationDlg-DTVh9pwh.js";
import z from "./loginDeviceCard-D3aK8BRa.js";
import { _ as F } from "./AccountSecurityConfig.vue_vue_type_script_setup_true_lang-Bd_fsFqO.js";
import "./country-flag.esm-Bg8BdAZu.js";
import "./timeZone-D3UW65MQ.js";
import "./TruncateText.vue_vue_type_script_setup_true_lang-wXc_gDkK.js";
import "./loginVerifyDialog.vue_vue_type_style_index_0_lang-gaNi40et.js";
import "./verifyConfigDialog.vue_vue_type_style_index_0_lang-5RexhAzN.js";
import "./browser-DEPKJqf2.js";
import "./operationVerificationDialog.vue_vue_type_script_setup_true_lang-CFKmge30.js";
const q = { class: "tw-h-fit tw-pb-[60px]" },
  J = { class: "personal-info-container tw-h-full" },
  Q = { id: "MyInfo" },
  X = { class: "form-warp" },
  Y = { class: "form-item" },
  Z = { class: "label" },
  H = { class: "value" },
  W = { class: "form-item" },
  ee = { class: "label" },
  ae = { class: "value" },
  te = { class: "form-item" },
  se = { class: "label" },
  ie = { class: "account-list" },
  le = ["src"],
  ne = { class: "name" },
  re = { key: 0, class: "email" },
  oe = { key: 1, class: "google" },
  ue = ["src"],
  ce = { class: "tw-mr-[8px]" },
  de = { id: "AccountSecurity" },
  ve = { class: "form-item" },
  fe = { class: "label" },
  pe = { class: "tw-flex tw-items-center tw-text-[14px]" },
  me = {
    class:
      "tw-mr-[8px] tw-flex tw-text-[var(--text-color-light1)] tw-items-center",
  },
  we = { class: S(["tw-ml-[6px]", "tw-text-[var(--text-color-base)]"]) },
  ye = { class: "form-item" },
  ge = { class: "label" },
  _e = { class: "form-item" },
  Ie = { class: "label" },
  xe = { class: "tw-grid tw-gap-[18px] tw-grid-cols-2" },
  he = {
    key: 0,
    class:
      "tw-bg-[var(--card-base-bg-color)] tw-rounded-[16px] tw-p-[20px] tw-relative tw-text-[14px] tw-w-[320px] tw-text-[var(--text-color-base)]",
  },
  ke = {
    class:
      "tw-fixed tw-h-[70px] tw-bottom-0 tw-w-full tw-pb-[16px] tw-flex tw-items-center",
  },
  be = K(
    e({
      __name: "accountInfo",
      setup(e) {
        const S = a.useI18n(),
          { t: K } = S,
          be = t(),
          Ce = I(() => be.userInfo),
          Be = s(),
          Te = x(),
          De = x([]),
          Ee = x(!1),
          je = x(!1),
          Ae = x(null);
        function Ue(e) {
          var a, t;
          return null ==
            (t = null == (a = Ce.value) ? void 0 : a.thirdUserInfoList)
            ? void 0
            : t.find((a) => a.type === e);
        }
        const $e = x(null),
          Le = () => {
            var e;
            null == (e = $e.value) || e.openDialog();
          };
        let Re;
        const Se = x(""),
          Ne = async (e) => {
            if (null === Ae.value) {
              (null !== Re && clearInterval(Re), (Ae.value = e));
              try {
                await h({ type: k.BIND, authType: e }).then((e) => {
                  (window.openUrl(e.redirectUri),
                    (Se.value = (null == e ? void 0 : e.state) ?? ""),
                    (Re = setInterval(async () => {
                      await (async (e) => {
                        if (e)
                          try {
                            await A(e).then(async (e) => {
                              switch (e.status) {
                                case U.BIND:
                                  (await Pe(),
                                    null !== Re && clearInterval(Re));
                                  break;
                                case U.ERROR:
                                  null !== Re && clearInterval(Re);
                              }
                            });
                          } catch (a) {
                            null !== Re && clearInterval(Re);
                          }
                      })(Se.value);
                    }, 5e3)));
                });
              } catch (a) {
                (null !== Re && clearInterval(Re), b(a));
              } finally {
                await C(() => {
                  Ae.value = null;
                });
              }
            }
          };
        function Ve() {
          var e;
          Ce.value.userAdditional.idCard
            ? G(!1, Ce.value.userAdditional)
            : null == (e = Te.value) || e.acceptParams();
        }
        async function Pe() {
          const e = await B(),
            a = T(e);
          if (!a) return;
          D(E.TOKEN_STATE, a.user.expiredTime);
          const t = be.formatUserInfo(
            a.user,
            a.loginMember,
            a.isBindEmail,
            a.thirdUserInfoList,
            a.userAdditional,
          );
          be.setUserInfo(t);
        }
        async function Ke() {
          try {
            Ee.value = !0;
            let e = await j();
            De.value = e.list;
          } catch (e) {
          } finally {
            Ee.value = !1;
          }
        }
        async function Me(e) {
          $({
            title: K("org.loginVerify.tip8"),
            message: K("org.loginVerify.tip14"),
            center: !0,
            confirmCb: async () => {
              (await L(e.id),
                R.success(K("env.env.shareDialog.operatorSuccess")),
                Ke());
            },
          });
        }
        return (
          Ke(),
          i(() => {
            null !== Re && clearInterval(Re);
          }),
          (e, a) => {
            const t = l("el-divider"),
              s = l("el-button"),
              i = l("ThemeImage"),
              I = l("el-skeleton"),
              x = l("el-scrollbar");
            return (
              n(),
              r("div", q, [
                o("div", J, [
                  o("div", Q, u(c(K)("userInfo.myInfo")), 1),
                  d(t, { class: "tw-mb-[19px] tw-mt-[12px]" }),
                  o("div", X, [
                    o("div", Y, [
                      o("div", Z, u(e.$t("userInfo.email")), 1),
                      o(
                        "div",
                        H,
                        u(
                          Ce.value.isBindEmail
                            ? Ce.value.email
                            : e.$t("userInfo.unBound"),
                        ),
                        1,
                      ),
                      Ce.value.isBindEmail
                        ? m("", !0)
                        : (n(),
                          v(
                            s,
                            { key: 0, link: "", type: "primary", onClick: Le },
                            {
                              default: f(() => [
                                p(u(e.$t("userInfo.goBind")), 1),
                              ]),
                              _: 1,
                            },
                          )),
                    ]),
                    o("div", W, [
                      o("div", ee, u(e.$t("userInfo.passwd")), 1),
                      o(
                        "div",
                        ae,
                        u(
                          Ce.value.isBindEmail
                            ? "********"
                            : e.$t("userInfo.unSettings"),
                        ),
                        1,
                      ),
                      d(
                        s,
                        {
                          class: "tw-ml-[8px]",
                          link: "",
                          type: "primary",
                          onClick: Le,
                        },
                        {
                          default: f(() => [
                            p(
                              u(
                                Ce.value.isBindEmail
                                  ? e.$t("userInfo.reset")
                                  : e.$t("userInfo.changePassword"),
                              ),
                              1,
                            ),
                          ]),
                          _: 1,
                        },
                      ),
                    ]),
                    o("div", te, [
                      o("div", se, u(e.$t("userInfo.quickLogin")), 1),
                      o("div", ie, [
                        (n(!0),
                        r(
                          w,
                          null,
                          y(c(_), (a, t) => {
                            var i, l, y;
                            return (
                              n(),
                              r("div", { class: "item tw-group", key: t }, [
                                Ue(a.type)
                                  ? (n(),
                                    r(
                                      w,
                                      { key: 0 },
                                      [
                                        o(
                                          "img",
                                          {
                                            class: "tw-w-[16px] tw-h-[16px]",
                                            src: a.logoImg,
                                          },
                                          null,
                                          8,
                                          le,
                                        ),
                                        o(
                                          "span",
                                          ne,
                                          u(
                                            null == (i = Ue(a.type))
                                              ? void 0
                                              : i.nickName,
                                          ),
                                          1,
                                        ),
                                        a.type !== c(g).TELEGRAM
                                          ? (n(),
                                            r(
                                              "span",
                                              re,
                                              "(" +
                                                u(
                                                  null == (l = Ue(a.type))
                                                    ? void 0
                                                    : l.email,
                                                ) +
                                                ")",
                                              1,
                                            ))
                                          : m("", !0),
                                        (Ce.value.thirdUserInfoList &&
                                          (null ==
                                          (y = Ce.value.thirdUserInfoList)
                                            ? void 0
                                            : y.length) > 1) ||
                                        Ce.value.isBindEmail
                                          ? (n(),
                                            v(
                                              s,
                                              {
                                                key: 1,
                                                link: "",
                                                type: "danger",
                                                onClick: (e) =>
                                                  (async (e) => {
                                                    try {
                                                      await N(
                                                        K(
                                                          "userInfo.unBindGoogleTips",
                                                          {
                                                            third: e
                                                              .toLowerCase()
                                                              .replace(
                                                                /^(.)/,
                                                                (e, a) =>
                                                                  a.toUpperCase(),
                                                              ),
                                                          },
                                                        ),
                                                        async () =>
                                                          await V({
                                                            authType: e,
                                                          }).then(async () => {
                                                            await B().then(
                                                              (e) => {
                                                                const a = T(e);
                                                                if (!a) return;
                                                                D(
                                                                  E.TOKEN_STATE,
                                                                  a.user
                                                                    .expiredTime,
                                                                );
                                                                const t =
                                                                  be.formatUserInfo(
                                                                    a.user,
                                                                    a.loginMember,
                                                                    a.isBindEmail,
                                                                    a.thirdUserInfoList,
                                                                  );
                                                                (be.setUserInfo(
                                                                  t,
                                                                ),
                                                                  P(
                                                                    K(
                                                                      "userInfo.unBindSuccess",
                                                                    ),
                                                                  ));
                                                              },
                                                            );
                                                          }),
                                                        {
                                                          isIcon: !0,
                                                          title: K(
                                                            "userInfo.unBindTitle",
                                                          ),
                                                          confirmText: K(
                                                            "userInfo.unBindBtnText",
                                                          ),
                                                        },
                                                      );
                                                    } catch (a) {}
                                                  })(a.type),
                                              },
                                              {
                                                default: f(() => [
                                                  p(
                                                    u(e.$t("userInfo.unBind")),
                                                    1,
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["onClick"],
                                            ))
                                          : m("", !0),
                                      ],
                                      64,
                                    ))
                                  : (n(),
                                    r("div", oe, [
                                      o(
                                        "img",
                                        {
                                          class:
                                            "tw-w-[16px] tw-h-[16px] t m-r-6",
                                          src: a.logoImg,
                                        },
                                        null,
                                        8,
                                        ue,
                                      ),
                                      o(
                                        "span",
                                        ce,
                                        u(e.$t("userInfo.unBound")),
                                        1,
                                      ),
                                      d(
                                        s,
                                        {
                                          class: "before:!tw-bg-transparent",
                                          link: "",
                                          type: "primary",
                                          loading: Ae.value === a.type,
                                          disabled: null !== Ae.value,
                                          onClick: (e) => Ne(a.type),
                                        },
                                        {
                                          default: f(() => [
                                            p(u(e.$t("userInfo.goBind")), 1),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["loading", "disabled", "onClick"],
                                      ),
                                    ])),
                              ])
                            );
                          }),
                          128,
                        )),
                      ]),
                    ]),
                    o("div", de, u(c(K)("userInfo.accountSecurity")), 1),
                    d(t, { class: "tw-mb-[19px] tw-mt-[12px]" }),
                    o("div", ve, [
                      o("div", fe, u(c(K)("userInfo.real_name")), 1),
                      o("div", pe, [
                        o("div", me, [
                          Ce.value.userAdditional.idCard
                            ? (n(),
                              v(i, {
                                key: 1,
                                src: "@/assets/images/shield-active.svg",
                              }))
                            : (n(),
                              v(i, {
                                key: 0,
                                src: "@/assets/images/shield.svg",
                              })),
                          o(
                            "div",
                            we,
                            u(
                              Ce.value.userAdditional.idCard
                                ? c(K)("userInfo.authenticated")
                                : c(K)("userInfo.not_authenticated"),
                            ),
                            1,
                          ),
                        ]),
                        d(
                          s,
                          { link: "", type: "primary", onClick: Ve },
                          {
                            default: f(() => [
                              p(
                                u(
                                  Ce.value.userAdditional.idCard
                                    ? c(K)("userInfo.details")
                                    : c(K)("userInfo.authentication"),
                                ),
                                1,
                              ),
                            ]),
                            _: 1,
                          },
                        ),
                      ]),
                    ]),
                    o("div", ye, [
                      o("div", ge, u(c(K)("org.org.VERIFY")), 1),
                      d(F),
                    ]),
                    o("div", _e, [
                      o("div", Ie, u(c(K)("org.loginVerify.tip6")), 1),
                      d(
                        x,
                        {
                          "view-class": "tw-max-w-[944px]",
                          "max-height": "600px",
                        },
                        {
                          default: f(() => [
                            o("div", xe, [
                              Ee.value
                                ? (n(),
                                  r("div", he, [
                                    d(I, { animated: "", rows: 2 }),
                                  ]))
                                : m("", !0),
                              (n(!0),
                              r(
                                w,
                                null,
                                y(
                                  De.value.slice(0, 4),
                                  (e) => (
                                    n(),
                                    v(
                                      z,
                                      {
                                        key: e.id,
                                        deviceData: e,
                                        onDownLine: Me,
                                      },
                                      null,
                                      8,
                                      ["deviceData"],
                                    )
                                  ),
                                ),
                                128,
                              )),
                              De.value.length > 4 && !je.value
                                ? (n(),
                                  v(
                                    s,
                                    {
                                      key: 1,
                                      type: "primary",
                                      link: "",
                                      class:
                                        "tw-col-span-1 tw-justify-normal tw-w-fit",
                                      onClick:
                                        a[0] || (a[0] = (e) => (je.value = !0)),
                                    },
                                    {
                                      default: f(() => [
                                        p(u(c(K)("org.loginVerify.tip7")), 1),
                                      ]),
                                      _: 1,
                                    },
                                  ))
                                : m("", !0),
                              je.value
                                ? (n(!0),
                                  r(
                                    w,
                                    { key: 2 },
                                    y(
                                      De.value.slice(4),
                                      (e) => (
                                        n(),
                                        v(
                                          z,
                                          {
                                            key: e.id,
                                            deviceData: e,
                                            onDownLine: Me,
                                          },
                                          null,
                                          8,
                                          ["deviceData"],
                                        )
                                      ),
                                    ),
                                    128,
                                  ))
                                : m("", !0),
                            ]),
                          ]),
                          _: 1,
                        },
                      ),
                    ]),
                  ]),
                  o("div", ke, [
                    d(
                      s,
                      {
                        type: "info",
                        onClick: a[1] || (a[1] = (e) => c(Be).back()),
                        style: { "max-width": "120px" },
                      },
                      {
                        default: f(() => [p(u(e.$t("userInfo.back")), 1)]),
                        _: 1,
                      },
                    ),
                  ]),
                  d(M, { ref_key: "resetPasswordRef", ref: $e }, null, 512),
                  d(
                    O,
                    { onSubmit: Pe, ref_key: "realNameRef", ref: Te },
                    null,
                    512,
                  ),
                ]),
              ])
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-b6461f85"]],
  );
export { be as default };
