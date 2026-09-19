import {
  d as e,
  ag as l,
  r as a,
  o,
  h as t,
  w as s,
  a as n,
  b as u,
  c as d,
  F as i,
  z as c,
  e as r,
  t as p,
  i as v,
  dM as m,
  dN as f,
  _ as b,
} from "./index-BUIbb6Pa.js";
const _ = b(
  e({
    __name: "envEditFontDialog",
    emits: ["submit"],
    setup(e, { expose: b, emit: _ }) {
      const g = _,
        h = v(!1),
        y = v([]),
        V = v(m),
        x = () => {
          (g("submit", y.value), (h.value = !1));
        },
        k = v();
      function q() {
        ((k.value = new MutationObserver(() => {
          document.querySelectorAll(".el-popper").forEach((e) => {
            e.classList.add("font-edit-popper");
          });
        })),
          k.value.observe(document.body, { childList: !0, subtree: !0 }));
      }
      function F() {
        (document.querySelectorAll(".font-edit-popper").forEach((e) => {
          e.classList.remove("font-edit-popper");
        }),
          k.value && (k.value.disconnect(), (k.value = null)));
      }
      return (
        l(() => {
          F();
        }),
        b({
          openDialog: (e, l) => {
            ((y.value = e), (V.value = l ? f(l) : m), (h.value = !0));
          },
        }),
        (e, l) => {
          const v = a("el-option"),
            m = a("el-select"),
            f = a("el-button"),
            b = a("el-dialog");
          return (
            o(),
            t(
              b,
              {
                modelValue: h.value,
                "onUpdate:modelValue": l[2] || (l[2] = (e) => (h.value = e)),
                title: e.$t("env.env.req.editFontTitle"),
                "close-on-click-modal": !1,
                "close-on-press-escape": !1,
                "align-center": !0,
                width: "550px",
                onOpen: q,
                onClosed: F,
              },
              {
                footer: s(() => [
                  u(
                    f,
                    {
                      type: "info",
                      onClick: l[1] || (l[1] = (e) => (h.value = !1)),
                    },
                    { default: s(() => [r(p(e.$t("base.cancel")), 1)]), _: 1 },
                  ),
                  u(
                    f,
                    { type: "primary", onClick: x },
                    { default: s(() => [r(p(e.$t("base.confirm")), 1)]), _: 1 },
                  ),
                ]),
                default: s(() => [
                  n("div", null, [
                    u(
                      m,
                      {
                        modelValue: y.value,
                        "onUpdate:modelValue":
                          l[0] || (l[0] = (e) => (y.value = e)),
                        placeholder: e.$t("env.env.req.editFontHolder"),
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
                          d(
                            i,
                            null,
                            c(
                              V.value,
                              (e) => (
                                o(),
                                t(v, { key: e, label: e, value: e }, null, 8, [
                                  "label",
                                  "value",
                                ])
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
  }),
  [["__scopeId", "data-v-dfa302b5"]],
);
export { _ as default };
