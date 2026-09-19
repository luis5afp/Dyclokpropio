import {
  d as e,
  v as a,
  dL as s,
  r as l,
  o as t,
  h as o,
  w as c,
  a as n,
  t as d,
  b as i,
  e as u,
  C as r,
  n as m,
  H as p,
  ev as v,
  _ as f,
} from "./index-BUIbb6Pa.js";
import {
  g,
  a as _,
  b,
  c as k,
} from "./guide-cookie-encrypt-en-light-Br-7UCuE.js";
const y = { class: "container" },
  h = { class: "text" },
  x = ["src"],
  C = f(
    e({
      __name: "GuideEncryptDialog",
      props: {
        modelValue: { type: Boolean, default: !1 },
        message: { default: "" },
        title: { default: "" },
      },
      emits: ["update:modelValue", "cancel", "confirm"],
      setup(e, { emit: f }) {
        const { locale: C } = a.useI18n(),
          { themeMode: V } = s(),
          j = r(() => "dark" === V.value),
          w = r(() => (C.value === v.ZH ? (j.value ? g : _) : j.value ? b : k)),
          H = f,
          I = (e) => {
            (e(), H("cancel"));
          },
          $ = () => {
            (H("confirm"), m.push(p));
          };
        return (a, s) => {
          const r = l("el-button"),
            m = l("el-dialog");
          return (
            t(),
            o(
              m,
              {
                "model-value": e.modelValue,
                title: e.title,
                width: "700px",
                "close-on-click-modal": !0,
                "close-on-press-escape": !0,
                "before-close": I,
              },
              {
                footer: c(() => [
                  i(
                    r,
                    {
                      type: "info",
                      onClick: s[0] || (s[0] = () => H("cancel")),
                    },
                    {
                      default: c(() => [u(d(a.$t("env.env.btnClose")), 1)]),
                      _: 1,
                    },
                  ),
                  i(
                    r,
                    { type: "primary", onClick: $ },
                    {
                      default: c(() => [u(d(a.$t("env.cookie.operation")), 1)]),
                      _: 1,
                    },
                  ),
                ]),
                default: c(() => [
                  n("div", y, [
                    n("div", h, d(e.message), 1),
                    n("img", { class: "cover", src: w.value }, null, 8, x),
                  ]),
                ]),
                _: 1,
              },
              8,
              ["model-value", "title"],
            )
          );
        };
      },
    }),
    [["__scopeId", "data-v-64d0bdee"]],
  );
export { C as default };
