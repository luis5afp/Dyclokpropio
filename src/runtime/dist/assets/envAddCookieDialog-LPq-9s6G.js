import {
  d as e,
  v as o,
  r as a,
  q as l,
  o as t,
  h as r,
  w as i,
  x as s,
  b as n,
  a as d,
  e as u,
  t as c,
  i as m,
  at as p,
} from "./index-BUIbb6Pa.js";
const v = e({
  __name: "envAddCookieDialog",
  emits: ["submit"],
  setup(e, { expose: v, emit: h }) {
    const { t: f } = o.useI18n(),
      k = h,
      C = m(!1),
      b = p({ otherCookie: "" }),
      _ = m(),
      x = () => {
        _.value.validate(async (e) => {
          if (e)
            try {
              (k("submit", b.otherCookie), (C.value = !1));
            } catch (o) {}
        });
      },
      y = p({
        otherCookie: [
          {
            validator: (e, o, a) => {
              if (o)
                if (
                  o.startsWith("[") ||
                  o.startsWith("{") ||
                  o.endsWith("]") ||
                  o.endsWith("}")
                )
                  try {
                    (JSON.parse(o), a());
                  } catch (l) {
                    a(new Error(f("env.env.req.cookieRule")));
                  }
                else a(new Error(f("env.env.req.cookieRule")));
              else a();
            },
          },
        ],
      });
    return (
      v({
        openDialog: (e) => {
          ((b.otherCookie = e || ""), (C.value = !0));
        },
      }),
      (e, o) => {
        const m = a("el-input"),
          p = a("el-form-item"),
          v = a("el-form"),
          h = a("el-button"),
          f = a("el-dialog"),
          k = l("prevent-label-click");
        return (
          t(),
          r(
            f,
            {
              modelValue: C.value,
              "onUpdate:modelValue": o[2] || (o[2] = (e) => (C.value = e)),
              title: e.$t("env.env.req.addOtherCookieTitle"),
              "close-on-click-modal": !1,
              "close-on-press-escape": !1,
              "align-center": !0,
              width: "500px",
              draggable: "",
            },
            {
              footer: i(() => [
                n(
                  h,
                  { onClick: o[1] || (o[1] = (e) => (C.value = !1)) },
                  { default: i(() => [u(c(e.$t("base.cancel")), 1)]), _: 1 },
                ),
                n(
                  h,
                  { type: "primary", onClick: x },
                  { default: i(() => [u(c(e.$t("base.confirm")), 1)]), _: 1 },
                ),
              ]),
              default: i(() => [
                s(
                  (t(),
                  r(
                    v,
                    { ref_key: "ruleFormRef", ref: _, model: b, rules: y },
                    {
                      default: i(() => [
                        n(
                          p,
                          { prop: "otherCookie" },
                          {
                            default: i(() => [
                              n(
                                m,
                                {
                                  type: "textarea",
                                  autosize: { minRows: 5, maxRows: 5 },
                                  modelValue: b.otherCookie,
                                  "onUpdate:modelValue":
                                    o[0] || (o[0] = (e) => (b.otherCookie = e)),
                                  placeholder: e.$t(
                                    "env.env.req.addOtherCookieHolder",
                                  ),
                                  clearable: "",
                                },
                                null,
                                8,
                                ["modelValue", "placeholder"],
                              ),
                            ]),
                            _: 1,
                          },
                        ),
                      ]),
                      _: 1,
                    },
                    8,
                    ["model", "rules"],
                  )),
                  [[k]],
                ),
                o[3] || (o[3] = d("div", null, null, -1)),
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
export { v as default };
