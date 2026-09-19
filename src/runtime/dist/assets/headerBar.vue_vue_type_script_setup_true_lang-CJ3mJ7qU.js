import {
  d as e,
  hQ as s,
  v as a,
  i as t,
  l1 as o,
  l2 as l,
  l3 as r,
  P as n,
  ag as c,
  r as i,
  c as w,
  O as u,
  b as d,
  h as m,
  a as g,
  F as v,
  z as h,
  X as f,
  C as p,
  t as x,
  o as b,
} from "./index-BUIbb6Pa.js";
import y from "./changeLangDropdown-BSfyP-Xg.js";
const k = ["href"],
  j = { class: "tw-flex tw-gap-8 tw-items-center" },
  E = ["href"],
  L = e({
    __name: "headerBar",
    setup(e) {
      const L = s(),
        T = p(() => L.meta.isAds),
        _ = a.useI18n(),
        I = t(r() ? o : l),
        { t: $ } = _,
        z = [
          { href: `${I.value}/download`, text: $("sso.download") },
          { href: `${I.value}/pricing`, text: $("sso.pricing") },
        ],
        A = p(() => (T.value ? [] : z)),
        B = t(!1),
        C = () => {
          const e =
            document.documentElement.scrollTop || document.body.scrollTop;
          B.value = e > 50;
        };
      return (
        n(() => {
          window.addEventListener("scroll", C);
        }),
        c(() => {
          window.removeEventListener("scroll", C);
        }),
        (e, s) => {
          const a = i("ThemeImage");
          return (
            b(),
            w(
              "div",
              {
                class: u(
                  "tw-flex tw-h-[72px] tw-w-full tw-items-center tw-justify-between tw-mx-auto" +
                    (B.value ? " tw-bg-[#111111]/80 tw-backdrop-blur-sm" : ""),
                ),
              },
              [
                T.value
                  ? (b(),
                    m(a, {
                      key: 1,
                      alt: "logo",
                      src: "@/assets/images/login-logo.svg",
                    }))
                  : (b(),
                    w(
                      "a",
                      { key: 0, href: I.value },
                      [
                        d(a, {
                          alt: "logo",
                          src: "@/assets/images/login-logo.svg",
                        }),
                      ],
                      8,
                      k,
                    )),
                g("div", j, [
                  (b(!0),
                  w(
                    v,
                    null,
                    h(
                      A.value,
                      (e, s) => (
                        b(),
                        w(
                          "a",
                          {
                            key: s,
                            href: e.href,
                            class: "tw-text-[14px] hover:tw-text-main",
                          },
                          x(e.text),
                          9,
                          E,
                        )
                      ),
                    ),
                    128,
                  )),
                  T.value ? f("", !0) : (b(), m(y, { key: 0 })),
                ]),
              ],
              2,
            )
          );
        }
      );
    },
  });
export { L as _ };
