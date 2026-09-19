import {
  d as a,
  r as e,
  o as l,
  h as s,
  w as t,
  a as o,
  O as n,
  ai as c,
  e as i,
  t as u,
  X as d,
  i as v,
  _ as m,
} from "./index-BUIbb6Pa.js";
const p = { class: "action-message-wrap" },
  r = { class: "title" },
  b = { class: "btn-wrap" },
  x = m(
    a({
      __name: "ActionDialog",
      setup(a, { expose: m }) {
        const x = v(!1),
          f = v({
            icon: "",
            closeBtnText: "",
            submitBtnText: "",
            closeCallback: () => {},
            submitCallback: () => {},
          }),
          k = () => {
            (f.value.closeCallback(), (x.value = !1));
          },
          _ = () => {
            (f.value.submitCallback(), (x.value = !1));
          };
        return (
          m({
            acceptParams: (a) => {
              ((f.value = a), (x.value = !0));
            },
          }),
          (a, v) => {
            const m = e("el-button"),
              C = e("el-dialog");
            return (
              l(),
              s(
                C,
                {
                  modelValue: x.value,
                  "onUpdate:modelValue": v[0] || (v[0] = (a) => (x.value = a)),
                  width: "550px",
                  "close-on-click-modal": !1,
                  "close-on-press-escape": !1,
                  "align-center": !0,
                  class: "action-message-dialog",
                  onClose: k,
                },
                {
                  default: t(() => [
                    o("div", p, [
                      o("div", r, [
                        o("span", null, [
                          o(
                            "i",
                            { class: n(`iconfont ${f.value.icon}`) },
                            null,
                            2,
                          ),
                        ]),
                        c(
                          a.$slots,
                          "title-content",
                          { class: "title-content" },
                          void 0,
                          !0,
                        ),
                      ]),
                      c(a.$slots, "content", {}, void 0, !0),
                      o("div", b, [
                        f.value.closeBtnText
                          ? (l(),
                            s(
                              m,
                              { key: 0, type: "info", onClick: k },
                              {
                                default: t(() => [
                                  i(u(f.value.closeBtnText), 1),
                                ]),
                                _: 1,
                              },
                            ))
                          : d("", !0),
                        f.value.submitBtnText
                          ? (l(),
                            s(
                              m,
                              { key: 1, type: "primary", onClick: _ },
                              {
                                default: t(() => [
                                  i(u(f.value.submitBtnText), 1),
                                ]),
                                _: 1,
                              },
                            ))
                          : d("", !0),
                      ]),
                    ]),
                  ]),
                  _: 3,
                },
                8,
                ["modelValue"],
              )
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-2af099ff"]],
  );
export { x as A };
