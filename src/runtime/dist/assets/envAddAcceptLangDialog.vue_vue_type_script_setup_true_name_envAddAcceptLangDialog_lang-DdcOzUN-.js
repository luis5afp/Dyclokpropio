import {
  d as e,
  G as a,
  v as l,
  r as u,
  o,
  h as t,
  w as s,
  a as n,
  b as d,
  c as v,
  F as c,
  z as i,
  e as p,
  t as r,
  i as m,
  bU as g,
  bT as b,
  d7 as f,
  C as h,
} from "./index-BUIbb6Pa.js";
const _ = e({
  __name: "envAddAcceptLangDialog",
  emits: ["submit"],
  setup(e, { expose: _, emit: V }) {
    const x = a(),
      T = h(() => x.language),
      { t: k } = l.useI18n(),
      y = V,
      L = m(!1),
      $ = m([]),
      q = m([]),
      z = m({}),
      C = () => {
        if (!$.value) return void f(k("env.env.req.addLanguageRule"));
        const e = $.value.map((e) => ({ value: e, label: z.value[e] }));
        (y("submit", e), (L.value = !1));
      };
    return (
      _({
        openDialog: () => {
          ((q.value = []),
            g.data.forEach((e) => {
              e.accept &&
                q.value.push({
                  label:
                    e["zh" === (null == T ? void 0 : T.value) ? "zh" : "en"],
                  value: e.code,
                });
            }),
            (z.value = b(q.value)),
            ($.value = []),
            (L.value = !0));
        },
      }),
      (e, a) => {
        const l = u("el-option"),
          m = u("el-select"),
          g = u("el-button"),
          b = u("el-dialog");
        return (
          o(),
          t(
            b,
            {
              modelValue: L.value,
              "onUpdate:modelValue": a[2] || (a[2] = (e) => (L.value = e)),
              title: e.$t("env.env.req.addLanguageTitle"),
              "close-on-click-modal": !1,
              "close-on-press-escape": !1,
              "align-center": !0,
              width: "500px",
            },
            {
              footer: s(() => [
                d(
                  g,
                  {
                    type: "info",
                    onClick: a[1] || (a[1] = (e) => (L.value = !1)),
                  },
                  { default: s(() => [p(r(e.$t("base.cancel")), 1)]), _: 1 },
                ),
                d(
                  g,
                  { type: "primary", onClick: C },
                  { default: s(() => [p(r(e.$t("base.confirm")), 1)]), _: 1 },
                ),
              ]),
              default: s(() => [
                n("div", null, [
                  d(
                    m,
                    {
                      modelValue: $.value,
                      "onUpdate:modelValue":
                        a[0] || (a[0] = (e) => ($.value = e)),
                      placeholder: e.$t("env.env.req.addLanguageHolder"),
                      filterable: "",
                      clearable: "",
                      multiple: "",
                      collapseTags: "",
                      collapseTagsTooltip: "",
                      "max-collapse-tags": 2,
                    },
                    {
                      default: s(() => [
                        (o(!0),
                        v(
                          c,
                          null,
                          i(
                            q.value,
                            (e) => (
                              o(),
                              t(
                                l,
                                {
                                  key: e.value,
                                  label: e.label,
                                  value: e.value,
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
                    ["modelValue", "placeholder"],
                  ),
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
export { _ };
