import {
  d as e,
  v as l,
  i as a,
  ag as o,
  r as i,
  q as t,
  o as r,
  h as s,
  w as d,
  x as u,
  f as n,
  b as m,
  c as p,
  t as f,
  e as v,
  aq as c,
  d7 as y,
  hC as b,
  hD as g,
  hE as C,
  as as h,
  hM as V,
  em as _,
  N as w,
} from "./index-BUIbb6Pa.js";
const k = { key: 0 },
  x = e({
    __name: "operationVerificationDialog",
    setup(e, { expose: x }) {
      let { t: I } = l.useI18n(),
        q = a(!1),
        D = a({ email: "", verifyCode: "" }),
        L = a({
          verifyCode: [
            { required: !0, message: I("register.codeRule"), trigger: "blur" },
          ],
        });
      const M = a(0),
        P = a(!1);
      let R,
        U = null;
      function A() {
        q.value = !1;
      }
      async function E() {
        if (P.value) return;
        P.value = !0;
        let [e] = await h(V(D.value));
        try {
          if (e) return void _(e);
          ((q.value = !1), null == R || R());
        } finally {
          await w(() => {
            P.value = !1;
          });
        }
      }
      return (
        o(() => {
          U && (clearInterval(U), (U = null));
        }),
        x({
          openDialog: function (e, l) {
            ((D.value.email = e),
              (D.value.verifyCode = ""),
              (q.value = !0),
              (R = l));
          },
        }),
        (e, l) => {
          const a = i("el-input"),
            o = i("el-form-item"),
            h = i("el-button"),
            V = i("el-form"),
            _ = i("el-dialog"),
            w = t("prevent-label-click");
          return (
            r(),
            s(
              _,
              {
                modelValue: n(q),
                "onUpdate:modelValue":
                  l[3] || (l[3] = (e) => (c(q) ? (q.value = e) : (q = e))),
                "label-width": "auto",
                "label-position": "right",
                title: n(I)("org.loginVerify.tip10"),
                width: "600px",
                "close-on-click-modal": !1,
                "close-on-press-escape": !1,
                "align-center": !0,
              },
              {
                footer: d(() => [
                  m(
                    h,
                    { type: "info", onClick: A },
                    {
                      default: d(() => [v(f(n(I)("base.previousStep")), 1)]),
                      _: 1,
                    },
                  ),
                  m(
                    h,
                    {
                      type: "primary",
                      disabled: !n(D).verifyCode,
                      loading: P.value,
                      onClick: E,
                    },
                    { default: d(() => [v(f(n(I)("base.confirm")), 1)]), _: 1 },
                    8,
                    ["disabled", "loading"],
                  ),
                ]),
                default: d(() => [
                  u(
                    (r(),
                    s(
                      V,
                      {
                        "label-width": "auto",
                        ref: "formRef",
                        rules: n(L),
                        "label-position": "right",
                        model: n(D),
                        style: { "max-width": "600px" },
                      },
                      {
                        default: d(() => [
                          m(
                            o,
                            { label: n(I)("login.emailLabel") },
                            {
                              default: d(() => [
                                m(
                                  a,
                                  {
                                    modelValue: n(D).email,
                                    "onUpdate:modelValue":
                                      l[0] || (l[0] = (e) => (n(D).email = e)),
                                    disabled: "",
                                  },
                                  null,
                                  8,
                                  ["modelValue"],
                                ),
                              ]),
                              _: 1,
                            },
                            8,
                            ["label"],
                          ),
                          m(
                            o,
                            {
                              label: n(I)("login.emailCodeLabel"),
                              prop: "verifyCode",
                            },
                            {
                              default: d(() => [
                                m(
                                  a,
                                  {
                                    modelValue: n(D).verifyCode,
                                    "onUpdate:modelValue":
                                      l[2] ||
                                      (l[2] = (e) => (n(D).verifyCode = e)),
                                    modelModifiers: { trim: !0 },
                                    placeholder: n(I)("rpa.task.req.enter"),
                                  },
                                  {
                                    append: d(() => [
                                      M.value > 0
                                        ? (r(),
                                          p(
                                            "span",
                                            k,
                                            f(M.value) +
                                              "s" +
                                              f(
                                                n(I)(
                                                  "resetPassword.resendCodeHint",
                                                ),
                                              ),
                                            1,
                                          ))
                                        : (r(),
                                          s(
                                            h,
                                            {
                                              key: 1,
                                              onClick:
                                                l[1] ||
                                                (l[1] = (e) => {
                                                  D.value.email
                                                    ? ((M.value = b),
                                                      (U = setInterval(() => {
                                                        M.value > 0
                                                          ? M.value--
                                                          : U &&
                                                            (clearInterval(U),
                                                            (U = null));
                                                      }, 1e3)),
                                                      g({
                                                        email: D.value.email,
                                                        type: C.VALID_EMAIL,
                                                      }))
                                                    : y(
                                                        I(
                                                          "resetPassword.userNameRule",
                                                        ),
                                                      );
                                                }),
                                              type: "primary",
                                            },
                                            {
                                              default: d(() => [
                                                v(
                                                  f(
                                                    n(I)(
                                                      "resetPassword.sendCode",
                                                    ),
                                                  ),
                                                  1,
                                                ),
                                              ]),
                                              _: 1,
                                            },
                                          )),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["modelValue", "placeholder"],
                                ),
                              ]),
                              _: 1,
                            },
                            8,
                            ["label"],
                          ),
                        ]),
                        _: 1,
                      },
                      8,
                      ["rules", "model"],
                    )),
                    [[w]],
                  ),
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
export { x as _ };
