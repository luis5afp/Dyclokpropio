import {
  d as a,
  G as e,
  g as l,
  m as t,
  M as o,
  s,
  r as n,
  o as r,
  h as i,
  w as u,
  a as c,
  b as d,
  e as p,
  t as m,
  i as f,
  D as v,
  E as _,
  A as w,
  j as g,
  k as E,
  l as R,
  n as h,
  H as C,
  _ as y,
  v as O,
  p as b,
  q as A,
  c as k,
  x as I,
  y as T,
  F as x,
  z as V,
  f as $,
  B as D,
  C as G,
  I as N,
  J as P,
  K as U,
  L as H,
  N as W,
} from "./index-BUIbb6Pa.js";
import { u as M, a as K, e as L } from "./teamSwitchOpenApiGuard-D0EbJhLx.js";
const j = {
    class: "m-t-12",
    style: { display: "flex", color: "var(--warning-color)" },
  },
  B = y(
    a({
      __name: "CreateOrgDrawer",
      setup(a, { expose: y }) {
        const O = e(),
          b = M(),
          A = f(""),
          k = f(!1),
          I = f(!1),
          T = () => {
            k.value = !0;
          };
        l(() => {
          t.off(o.OPEN_CREATE_ORG_DRAWER, T);
        });
        const x = async () => {
          if (A.value) {
            I.value = !0;
            try {
              (v.api.trackEvent({
                type: w.OTHER_CLICK,
                action: _.CLICK_CREATE_TEAM,
                params: { name: A.value },
              }),
                await g({ name: A.value }),
                b.invalidate());
              const a = (await E()).data;
              if (!a || !a.user) return;
              const e = O.formatUserInfo(
                a.user,
                a.loginMember,
                a.isBindEmail,
                a.thirdUserInfoList,
              );
              (O.setUserInfo(e),
                await R(),
                await h.push(C),
                (k.value = !1),
                window.location.reload());
            } catch (a) {
              console.error(a);
            } finally {
              I.value = !1;
            }
          }
        };
        return (
          y({
            acceptParams: () => {
              k.value = !0;
            },
          }),
          t.on(o.OPEN_CREATE_ORG_DRAWER, T),
          l(() => {
            (s.commit("closeMitt", o.OPEN_CREATE_ORG_DRAWER),
              t.off(o.OPEN_CREATE_ORG_DRAWER));
          }),
          (a, e) => {
            const l = n("el-input"),
              t = n("el-button"),
              o = n("el-dialog");
            return (
              r(),
              i(
                o,
                {
                  modelValue: k.value,
                  "onUpdate:modelValue": e[2] || (e[2] = (a) => (k.value = a)),
                  title: a.$t("org.org.createTitle"),
                  width: "450px",
                  "close-on-click-modal": !1,
                  "close-on-press-escape": !1,
                  "align-center": !0,
                },
                {
                  footer: u(() => [
                    d(
                      t,
                      {
                        type: "info",
                        onClick: e[1] || (e[1] = (a) => (k.value = !1)),
                      },
                      {
                        default: u(() => [p(m(a.$t("base.cancel")), 1)]),
                        _: 1,
                      },
                    ),
                    d(
                      t,
                      { type: "primary", onClick: x, loading: I.value },
                      {
                        default: u(() => [p(m(a.$t("base.confirm")), 1)]),
                        _: 1,
                      },
                      8,
                      ["loading"],
                    ),
                  ]),
                  default: u(() => [
                    c("div", null, [
                      d(
                        l,
                        {
                          modelValue: A.value,
                          "onUpdate:modelValue":
                            e[0] || (e[0] = (a) => (A.value = a)),
                          placeholder: a.$t("org.org.req.nameHolder"),
                          maxlength: "20",
                          "show-word-limit": "",
                        },
                        null,
                        8,
                        ["modelValue", "placeholder"],
                      ),
                    ]),
                    c("div", j, [
                      e[3] ||
                        (e[3] = c(
                          "span",
                          { class: "icon-warn-wrap m-r-8 m-t-2" },
                          [c("i", { class: "iconfont icon-warning" })],
                          -1,
                        )),
                      p(" " + m(a.$t("org.org.createHint")), 1),
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
    [["__scopeId", "data-v-039fcbaa"]],
  ),
  S = y(
    a({
      __name: "ChangeOrgDrawer",
      setup(a) {
        const s = e(),
          { t: v } = O.useI18n(),
          _ = K(),
          w = M(),
          { stopKoaServer: g, updateOpenapiConfigFn: E } = b(),
          R = f(""),
          y = f(!1),
          j = f(!1),
          S = G(() => w.list),
          q = f(),
          F = async () => {
            var a;
            ((y.value = !0),
              await w.load().catch(() => {}),
              S.value.length &&
                (R.value =
                  (null == (a = S.value.find((a) => a.id === s.userInfo.orgId))
                    ? void 0
                    : a.id) || S.value[0].id));
          };
        l(() => {
          t.off(o.OPEN_CHANGE_ORG_DRAWER, F);
        });
        const z = () => {
            var a;
            (null == (a = q.value) || a.acceptParams(), N.close());
          },
          J = async () => {
            if (R.value && !j.value) {
              (P(), w.invalidate(), (j.value = !0));
              try {
                (await L(() => g({ updateConfig: !1 })),
                  await U(R.value),
                  (s.userInfo.orgId = ""),
                  E("", 0, !1, ""),
                  (y.value = !1),
                  await _.closeMultipleTab(),
                  await h.push(C),
                  window.location.reload());
              } catch (a) {
                (console.error("切换团队失败", a), H(v("message.api.unknown")));
              } finally {
                await W(() => {
                  j.value = !1;
                });
              }
            }
          };
        return (
          t.on(o.OPEN_CHANGE_ORG_DRAWER, F),
          (a, e) => {
            const l = n("el-option"),
              t = n("el-select"),
              o = n("el-form-item"),
              s = n("el-form"),
              f = n("el-button"),
              v = n("el-dialog"),
              _ = A("prevent-label-click");
            return (
              r(),
              k(
                x,
                null,
                [
                  d(
                    v,
                    {
                      modelValue: y.value,
                      "onUpdate:modelValue":
                        e[2] || (e[2] = (a) => (y.value = a)),
                      title: `${a.$t("header.changeOrg")}`,
                      width: "550px",
                      "close-on-click-modal": !1,
                      "close-on-press-escape": !1,
                      "align-center": !0,
                      "show-close": !1,
                    },
                    {
                      footer: u(() => [
                        d(
                          f,
                          { type: "info", onClick: $(D) },
                          {
                            default: u(() => [p(m(a.$t("header.logout")), 1)]),
                            _: 1,
                          },
                          8,
                          ["onClick"],
                        ),
                        d(
                          f,
                          { type: "primary", loading: j.value, onClick: J },
                          {
                            default: u(() => [p(m(a.$t("base.confirm")), 1)]),
                            _: 1,
                          },
                          8,
                          ["loading"],
                        ),
                      ]),
                      default: u(() => [
                        I(
                          (r(),
                          i(
                            s,
                            {
                              "label-position": "right",
                              onSubmit:
                                e[1] || (e[1] = T(() => {}, ["prevent"])),
                            },
                            {
                              default: u(() => [
                                d(
                                  o,
                                  { label: a.$t("header.selectTeam") },
                                  {
                                    default: u(() => [
                                      d(
                                        t,
                                        {
                                          modelValue: R.value,
                                          "onUpdate:modelValue":
                                            e[0] ||
                                            (e[0] = (a) => (R.value = a)),
                                        },
                                        {
                                          empty: u(() => [
                                            p(
                                              m(a.$t("header.createTeamTip2")),
                                              1,
                                            ),
                                          ]),
                                          footer: u(() => [
                                            c(
                                              "div",
                                              {
                                                class:
                                                  "tw-text-[14px] tw-text-[var(--btn-primary-link-color)] tw-flex tw-items-center tw-cursor-pointer",
                                                onClick: z,
                                              },
                                              [
                                                e[3] ||
                                                  (e[3] = c(
                                                    "i",
                                                    {
                                                      class:
                                                        "iconfont icon-plus",
                                                    },
                                                    null,
                                                    -1,
                                                  )),
                                                p(
                                                  m(a.$t("header.createTeam")),
                                                  1,
                                                ),
                                              ],
                                            ),
                                          ]),
                                          default: u(() => [
                                            (r(!0),
                                            k(
                                              x,
                                              null,
                                              V(
                                                S.value,
                                                (a) => (
                                                  r(),
                                                  i(
                                                    l,
                                                    {
                                                      key: a.id,
                                                      label: a.name,
                                                      value: a.id,
                                                    },
                                                    null,
                                                    8,
                                                    ["label", "value"],
                                                  )
                                                ),
                                              ),
                                              128,
                                            )),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["modelValue"],
                                      ),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                              ]),
                              _: 1,
                            },
                          )),
                          [[_]],
                        ),
                      ]),
                      _: 1,
                    },
                    8,
                    ["modelValue", "title"],
                  ),
                  d(B, { ref_key: "createOrgDrawerRef", ref: q }, null, 512),
                ],
                64,
              )
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-885f59a8"]],
  );
export { S as default };
