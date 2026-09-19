import {
  d as e,
  v as a,
  ag as l,
  r as o,
  q as s,
  o as t,
  h as n,
  f as u,
  w as r,
  a as i,
  x as c,
  e as p,
  t as d,
  i as m,
  V as v,
} from "./index-BUIbb6Pa.js";
const x = { class: "c-flex tw-flex-col" },
  f = {
    class: "tw-h-[80px] tw-w-[100%]",
    "element-loading-background": "transparent",
  },
  w = { class: "tw-mb-[30px]" },
  g = { class: "tw-text-main" },
  y = e({
    __name: "uploadStateBox",
    setup(e, { expose: y }) {
      const h = m(!1);
      let V,
        _ = m(0),
        I = m(0);
      function b() {
        if (_.value < I.value - 1) {
          _.value += 1;
          const e = v.random(500, 700);
          V = setTimeout(b, e);
        } else (clearTimeout(V), (V = null));
      }
      let { t: k } = a.useI18n();
      return (
        l(() => {
          V && (clearInterval(V), (V = null));
        }),
        y({
          showDialog: function (e) {
            ((I.value = e), (_.value = 0), (h.value = !0), b());
          },
          closeDialog: function () {
            ((_.value = I.value), (h.value = !1), clearInterval(V), (V = null));
          },
        }),
        (e, a) => {
          const l = o("el-dialog"),
            m = s("loading");
          return (
            t(),
            n(
              l,
              {
                modelValue: h.value,
                "onUpdate:modelValue": a[0] || (a[0] = (e) => (h.value = e)),
                "destroy-on-close": !0,
                title: u(k)("proxy.proxy.import.result"),
                width: "480",
                "close-on-click-modal": !1,
                "close-on-press-escape": !1,
              },
              {
                default: r(() => [
                  i("div", x, [
                    c(i("div", f, null, 512), [[m, !0]]),
                    i("div", w, [
                      p(d(u(k)("proxy.proxy.import.importing")) + "(", 1),
                      i("span", g, d(u(_)), 1),
                      p(
                        "/" +
                          d(u(I)) +
                          "), " +
                          d(u(k)("proxy.proxy.import.pleaseWait")),
                        1,
                      ),
                    ]),
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
  });
export { y as _ };
