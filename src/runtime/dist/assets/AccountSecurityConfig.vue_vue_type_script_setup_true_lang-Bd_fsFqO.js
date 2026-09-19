import { _ as e } from "./loginVerifyDialog.vue_vue_type_style_index_0_lang-gaNi40et.js";
import {
  d as a,
  R as t,
  G as s,
  v as l,
  P as i,
  r as o,
  o as r,
  c as n,
  a as u,
  f as v,
  h as g,
  t as c,
  b as f,
  w as d,
  e as p,
  i as y,
  hp as m,
  hu as x,
  O as w,
} from "./index-BUIbb6Pa.js";
const _ = { class: "tw-flex tw-items-center tw-text-[14px]" },
  h = {
    class:
      "tw-mr-[8px] tw-flex tw-text-[var(--text-color-light1)] tw-items-center",
  },
  V = { class: w(["tw-ml-[6px]", "tw-text-[var(--text-color-base)]"]) },
  I = a({
    __name: "AccountSecurityConfig",
    setup(a) {
      let w = y(),
        { userInfo: I } = t(s()),
        { t: b } = l.useI18n(),
        k = y(),
        R = s();
      async function j() {
        var e;
        null == (e = w.value) ||
          e.acceptParams(
            { row: k.value, title: b("org.org.VERIFY"), type: m.VERIFY },
            !0,
          );
      }
      async function C() {
        ((k.value = await x(I.value.id)),
          "boolean" != typeof k.value.everyLogin && (k.value.everyLogin = !0),
          !k.value.interval && (k.value.interval = 7),
          (k.value.id = R.userInfo.id));
      }
      return (
        i(() => {
          C();
        }),
        (a, t) => {
          var s, l;
          const i = o("ThemeImage"),
            y = o("el-button");
          return (
            r(),
            n("div", null, [
              u("div", _, [
                u("div", h, [
                  (null == (s = v(k)) ? void 0 : s.loginValidate)
                    ? (r(),
                      g(i, {
                        key: 1,
                        src: "@/assets/images/shield-active.svg",
                      }))
                    : (r(),
                      g(i, { key: 0, src: "@/assets/images/shield.svg" })),
                  u(
                    "div",
                    V,
                    c(
                      (null == (l = v(k)) ? void 0 : l.loginValidate)
                        ? v(b)("org.org.open")
                        : v(b)("org.org.notOpen"),
                    ),
                    1,
                  ),
                ]),
                f(
                  y,
                  { link: "", type: "primary", onClick: j },
                  {
                    default: d(() => [p(c(v(b)("org.loginVerify.tip25")), 1)]),
                    _: 1,
                  },
                ),
              ]),
              f(
                e,
                { ref_key: "loginVerifyDialogRef", ref: w, onSubmit: C },
                null,
                512,
              ),
            ])
          );
        }
      );
    },
  });
export { I as _ };
