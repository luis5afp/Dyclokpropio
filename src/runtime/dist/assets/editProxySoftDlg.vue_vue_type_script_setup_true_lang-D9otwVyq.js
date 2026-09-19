import {
  d as e,
  v as t,
  i as l,
  am as a,
  r as o,
  q as s,
  o as n,
  h as r,
  aq as i,
  f as u,
  w as c,
  x as f,
  b as p,
  a as d,
  t as v,
  e as w,
  C as x,
} from "./index-BUIbb6Pa.js";
import m from "./proxySoftItem-B7tAwO_8.js";
import { T as y } from "./proxyUtil-OnkkuXcX.js";
const b = { class: "c-flex tw-text-[18px] tw-relative" },
  _ = { class: "tw-flex tw-items-baseline tw-mt-[10px]" },
  g = { class: "tw-text-[var(--warning-color)] tw-flex-1" },
  h = e({
    __name: "editProxySoftDlg",
    setup(e, { expose: h }) {
      let { t: k } = t.useI18n(),
        S = l(a.IPFLY),
        q = l(!1),
        C = l();
      function j() {
        var e;
        (null == (e = C.value) || e.submit(), (q.value = !1));
      }
      let I = x(() => y[S.value]);
      function P() {
        var e;
        null == (e = C.value) || e.handleRestoreDefault();
      }
      return (
        h({
          show: (e) => {
            var t;
            ((S.value = e),
              null == (t = C.value) || t.initModel(),
              (q.value = !0));
          },
        }),
        (e, t) => {
          const l = o("el-button"),
            a = o("el-form"),
            x = o("el-dialog"),
            y = s("prevent-label-click");
          return (
            n(),
            r(
              x,
              {
                title: u(I),
                "close-on-click-modal": !1,
                "close-on-press-escape": !1,
                "align-center": !0,
                width: "550",
                modelValue: u(q),
                "onUpdate:modelValue":
                  t[1] || (t[1] = (e) => (i(q) ? (q.value = e) : (q = e))),
              },
              {
                header: c(() => [
                  d("div", b, [
                    w(v(u(I)) + " ", 1),
                    p(
                      l,
                      {
                        class: "tw-absolute tw-right-[32px] button-info-pro",
                        type: "info",
                        link: "",
                        onClick: P,
                      },
                      {
                        default: c(() => [
                          t[2] ||
                            (t[2] = d(
                              "i",
                              {
                                class:
                                  "iconfont icon-restoredefault tw-mr-[4px]",
                              },
                              null,
                              -1,
                            )),
                          w(v(u(k)("env.env.req.reset_defaults")), 1),
                        ]),
                        _: 1,
                      },
                    ),
                  ]),
                ]),
                footer: c(() => [
                  p(
                    l,
                    {
                      type: "info",
                      onClick:
                        t[0] ||
                        (t[0] = (e) => (i(q) ? (q.value = !1) : (q = !1))),
                    },
                    { default: c(() => [w(v(u(k)("base.cancel")), 1)]), _: 1 },
                  ),
                  p(
                    l,
                    { type: "primary", onClick: j },
                    { default: c(() => [w(v(u(k)("base.confirm")), 1)]), _: 1 },
                  ),
                ]),
                default: c(() => [
                  f(
                    (n(),
                    r(
                      a,
                      { "label-position": "top" },
                      {
                        default: c(() => [
                          p(
                            m,
                            {
                              ref_key: "proxySoftRef",
                              ref: C,
                              "show-top": !1,
                              type: u(S),
                            },
                            null,
                            8,
                            ["type"],
                          ),
                        ]),
                        _: 1,
                      },
                    )),
                    [[y]],
                  ),
                  d("div", _, [
                    t[3] ||
                      (t[3] = d(
                        "div",
                        {
                          class:
                            "tw-w-[16px] c-flex tw-h-[16px] tw-rounded-[50%] tw-bg-[var(--warning-color)] tw-mr-[8px]",
                        },
                        [
                          d("i", {
                            class: "iconfont icon-warning tw-text-[13px]",
                          }),
                        ],
                        -1,
                      )),
                    d("div", g, v(u(k)("env.env.req.editSoftProxyTip")), 1),
                  ]),
                ]),
                _: 1,
              },
              8,
              ["title", "modelValue"],
            )
          );
        }
      );
    },
  });
export { h as _ };
