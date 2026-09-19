import e from "./RpaSelectEnvTable-DYJ82JBS.js";
import {
  d as a,
  jW as t,
  v as l,
  i as s,
  r as n,
  o,
  h as i,
  w as d,
  b as r,
  aq as c,
  f as u,
  a as p,
  c as v,
  e as m,
  t as f,
  X as b,
  ap as w,
  a3 as g,
} from "./index-BUIbb6Pa.js";
const h = { class: "b-flex" },
  x = { class: "tw-text-black" },
  L = { key: 0, class: "tw-flex tw-items-center" },
  k = { class: "tw-pl-[5px]" },
  _ = a({
    __name: "RpaSelectEnvTableDrawer",
    props: { envMaxLength: {}, submitLoading: { type: Boolean, default: !1 } },
    emits: ["update:modelValue", "addEnv"],
    setup(a, { emit: _ }) {
      let y = a,
        C = _,
        S = s(),
        V = t(),
        { t: E } = l.useI18n(),
        M = s(
          (V.editTaskData.envList || []).map((e) => ({ id: e.envId, ...e })),
        );
      function O() {
        var e;
        null == (e = S.value) || e.emptySelectedList();
      }
      function T() {
        y.submitLoading ||
          (y.envMaxLength && M.value.length > y.envMaxLength
            ? g.warning(
                E("crawler.form.select_env_error", { N: y.envMaxLength }),
              )
            : C("addEnv", M.value));
      }
      function $(e) {
        y.submitLoading || e();
      }
      function j() {
        w().showOrHideChat(!1);
      }
      return (t, l) => {
        const s = n("el-button"),
          g = n("el-drawer");
        return (
          o(),
          i(
            g,
            {
              modelValue: t.$attrs.drawer,
              "onUpdate:modelValue":
                l[2] || (l[2] = (e) => (t.$attrs.drawer = e)),
              title: u(E)("rpa2.add"),
              size: "60%",
              "close-on-click-modal": !1,
              "close-on-press-escape": !1,
              "body-class": "!tw-pt-0 !tw-pb-0",
              "footer-class": "!tw-pb-[16px]",
              "before-close": $,
              onOpened: j,
              onClosed:
                l[3] ||
                (l[3] = () => {
                  (u(w)().showOrHideChat(!0), t.$emit("update:modelValue", !1));
                }),
            },
            {
              footer: d(() => {
                var e;
                return [
                  p("div", h, [
                    p("div", x, [
                      u(M).length
                        ? (o(),
                          v("div", L, [
                            m(f(null == (e = u(M)) ? void 0 : e.length), 1),
                            p("span", k, f(u(E)("base.selected")), 1),
                            p("i", {
                              class:
                                "iconfont tw-ml-[4px] tw-mt-[2px] icon-close tw-text-[var(--border-color-light3)] hover:tw-text-black",
                              onClick: O,
                            }),
                          ]))
                        : b("", !0),
                    ]),
                    p("div", null, [
                      r(
                        s,
                        {
                          type: "info",
                          disabled: a.submitLoading,
                          onClick:
                            l[1] ||
                            (l[1] = (e) => (
                              t.$emit("update:modelValue", !1),
                              u(w)().showOrHideChat(!0)
                            )),
                        },
                        {
                          default: d(() => [m(f(u(E)("base.cancel")), 1)]),
                          _: 1,
                        },
                        8,
                        ["disabled"],
                      ),
                      r(
                        s,
                        {
                          type: "primary",
                          loading: a.submitLoading,
                          onClick: T,
                        },
                        {
                          default: d(() => [m(f(u(E)("rpa2.confirm")), 1)]),
                          _: 1,
                        },
                        8,
                        ["loading"],
                      ),
                    ]),
                  ]),
                ];
              }),
              default: d(() => [
                r(
                  e,
                  {
                    isDrawer: "",
                    envMaxLength: 3,
                    envSelectedList: u(M),
                    "onUpdate:envSelectedList":
                      l[0] || (l[0] = (e) => (c(M) ? (M.value = e) : (M = e))),
                    isCrossPageSelection: !0,
                    ref_key: "rpaSelectEnvTableRef",
                    ref: S,
                  },
                  null,
                  8,
                  ["envSelectedList"],
                ),
              ]),
              _: 1,
            },
            8,
            ["modelValue", "title"],
          )
        );
      };
    },
  });
export { _ };
