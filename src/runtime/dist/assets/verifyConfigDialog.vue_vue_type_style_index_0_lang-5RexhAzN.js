import {
  d as e,
  i as a,
  hn as l,
  v as o,
  at as t,
  hx as r,
  r as i,
  q as s,
  o as u,
  h as c,
  w as n,
  x as d,
  b as v,
  f as w,
  a as m,
  c as f,
  F as p,
  t as b,
  X as h,
  O as g,
  e as x,
  C as y,
  em as k,
  N as V,
  V as C,
  ac as _,
  hy as A,
  hz as E,
  g6 as U,
  hA as q,
  hB as L,
} from "./index-BUIbb6Pa.js";
import { b as O } from "./browser-DEPKJqf2.js";
const Q = { class: "tw-flex" },
  D = { class: "tw-text-[var(--text-color-light1)]" },
  F = { class: "tw-text-[var(--text-color-light1)]" },
  N = {
    class:
      "tw-h-[220px] tw-w-[100%] tw-mt-[10px] c-flex tw-rounded-[12px] tw-bg-[var(--table-tr-bg-color)]",
  },
  R = {
    class:
      "tw-p-[8px] tw-rounded-[12px] tw-border tw-border-solid tw-border-[var(--border-color-light1)]",
  },
  T = ["src"],
  I = e({
    __name: "verifyConfigDialog",
    props: { isUser: { type: Boolean } },
    emits: ["submit"],
    setup(e, { expose: I, emit: M }) {
      const j = a({
          title: "",
          type: l.EMAIL,
          row: {
            id: "",
            name: "",
            passwd: "",
            checkEmail: !1,
            email: "",
            check2fa: !1,
            secret2fa: "",
            everyLogin: !1,
            interval: 7,
            verifyCode: "",
            loginValidate: !1,
            googleAuthQr: "",
          },
        }),
        B = e,
        $ = a(!1),
        z = a();
      let { t: H } = o.useI18n();
      const P = y(() => j.value.type === l.EMAIL),
        W = y(() => j.value.type === l.TWOFA),
        X = a(""),
        G = a(!1),
        J = a(!1),
        K = t({
          email: [
            {
              validator: (e, a, l) => {
                a
                  ? r.test(a)
                    ? l()
                    : l(new Error(H("login.userNameRule")))
                  : l(new Error(H("login.userName")));
              },
            },
          ],
          verifyCode: [
            { required: !0, message: H("org.member.req.verifyCodeHolder") },
          ],
        }),
        S = M;
      function Y() {
        $.value = !1;
      }
      async function Z() {
        var e;
        if (!G.value) {
          if (
            j.value.row[P.value ? "checkEmail" : "check2fa"] &&
            (await (null == (e = z.value) ? void 0 : e.validate()), W.value)
          ) {
            G.value = !0;
            try {
              await (B.isUser ? q : L)({
                secret2fa: j.value.row.secret2fa,
                verifyCode: j.value.row.verifyCode,
              });
            } catch (a) {
              return void k(a);
            } finally {
              await V(() => {
                G.value = !1;
              });
            }
          }
          (S("submit", C.cloneDeep(j.value.row)), ($.value = !1));
        }
      }
      async function ee() {
        if (!J.value) {
          J.value = !0;
          try {
            let a = await ((e = j.value.row.id), B.isUser ? A(e) : E(e));
            ((j.value.row.googleAuthQr = a.googleAuthQr),
              (X.value = await O.toDataURL(j.value.row.googleAuthQr)),
              (j.value.row.secret2fa = a.secret2fa));
          } catch (a) {
            k(a);
          } finally {
            await V(() => {
              J.value = !1;
            });
          }
          var e;
        }
      }
      async function ae() {
        U(j.value.row.secret2fa);
      }
      return (
        I({
          acceptParams: async function (e) {
            var a;
            (await (null == (a = z.value) ? void 0 : a.resetFields()),
              _(async () => {
                ((j.value = e),
                  (X.value = await O.toDataURL(j.value.row.googleAuthQr)),
                  ($.value = !0));
              }));
          },
        }),
        (e, a) => {
          const l = i("el-switch"),
            o = i("el-form-item"),
            t = i("el-input"),
            r = i("el-form"),
            y = i("el-button"),
            k = i("el-dialog"),
            V = s("loading"),
            C = s("prevent-label-click");
          return (
            u(),
            c(
              k,
              {
                modelValue: $.value,
                "onUpdate:modelValue": a[4] || (a[4] = (e) => ($.value = e)),
                "label-width": "auto",
                "label-position": "right",
                title: j.value.title,
                width: "700px",
                "close-on-click-modal": !1,
                "close-on-press-escape": !1,
                "align-center": !0,
                class: "verify-dialog",
              },
              {
                footer: n(() => [
                  v(
                    y,
                    { type: "info", onClick: Y },
                    { default: n(() => [x(b(e.$t("base.cancel")), 1)]), _: 1 },
                  ),
                  v(
                    y,
                    { type: "primary", loading: G.value, onClick: Z },
                    { default: n(() => [x(b(e.$t("base.confirm")), 1)]), _: 1 },
                    8,
                    ["loading"],
                  ),
                ]),
                default: n(() => [
                  d(
                    (u(),
                    c(
                      r,
                      {
                        ref_key: "formRef",
                        ref: z,
                        "label-width": "auto",
                        "label-position": "right",
                        model: j.value.row,
                        style: { "max-width": "600px" },
                        rules: K,
                      },
                      {
                        default: n(() => [
                          v(
                            o,
                            { label: w(H)("rpa.task.list.onOff") },
                            {
                              default: n(() => [
                                m("div", Q, [
                                  v(
                                    l,
                                    {
                                      class: "tw-mr-[15px]",
                                      modelValue:
                                        j.value.row[
                                          P.value ? "checkEmail" : "check2fa"
                                        ],
                                      "onUpdate:modelValue":
                                        a[0] ||
                                        (a[0] = (e) =>
                                          (j.value.row[
                                            P.value ? "checkEmail" : "check2fa"
                                          ] = e)),
                                    },
                                    null,
                                    8,
                                    ["modelValue"],
                                  ),
                                ]),
                              ]),
                              _: 1,
                            },
                            8,
                            ["label"],
                          ),
                          P.value &&
                          j.value.row[P.value ? "checkEmail" : "check2fa"]
                            ? (u(),
                              f(
                                p,
                                { key: 0 },
                                [
                                  v(
                                    o,
                                    {
                                      label: w(H)("login.emailLabel"),
                                      prop: "email",
                                    },
                                    {
                                      default: n(() => [
                                        v(
                                          t,
                                          {
                                            modelValue: j.value.row.email,
                                            "onUpdate:modelValue":
                                              a[1] ||
                                              (a[1] = (e) =>
                                                (j.value.row.email = e)),
                                            placeholder: w(H)("login.userName"),
                                          },
                                          null,
                                          8,
                                          ["modelValue", "placeholder"],
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["label"],
                                  ),
                                  m(
                                    "div",
                                    D,
                                    b(w(H)("org.member.req.emailTip")),
                                    1,
                                  ),
                                ],
                                64,
                              ))
                            : h("", !0),
                          W.value &&
                          j.value.row[P.value ? "checkEmail" : "check2fa"]
                            ? (u(),
                              f(
                                p,
                                { key: 1 },
                                [
                                  v(
                                    o,
                                    { label: w(H)("org.member.req.Operation") },
                                    {
                                      default: n(() => [
                                        m(
                                          "div",
                                          F,
                                          b(
                                            w(H)("org.member.req.OperationTip"),
                                          ),
                                          1,
                                        ),
                                        m("div", N, [
                                          m("div", R, [
                                            m(
                                              "img",
                                              {
                                                class:
                                                  "tw-w-[163px] tw-h-[163px]",
                                                src: X.value,
                                              },
                                              null,
                                              8,
                                              T,
                                            ),
                                          ]),
                                        ]),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["label"],
                                  ),
                                  v(
                                    o,
                                    { label: w(H)("env.env.req.accountTwoFA") },
                                    {
                                      default: n(() => [
                                        v(
                                          t,
                                          {
                                            class: "tw-flex-1",
                                            modelValue: j.value.row.secret2fa,
                                            "onUpdate:modelValue":
                                              a[2] ||
                                              (a[2] = (e) =>
                                                (j.value.row.secret2fa = e)),
                                            disabled: "",
                                          },
                                          null,
                                          8,
                                          ["modelValue"],
                                        ),
                                        m(
                                          "div",
                                          {
                                            onClick: ae,
                                            class:
                                              "tw-cursor-pointer c-flex tw-ml-[8px] tw-h-[40px] tw-w-[40px] tw-bg-[var(--input-dis-br-color)] tw-rounded-[8px] tw-border tw-border-solid tw-border-[var(--text-color-light3)] hover:tw-bg-[var(--btn-info-hover-color)]",
                                          },
                                          [
                                            ...(a[5] ||
                                              (a[5] = [
                                                m(
                                                  "i",
                                                  {
                                                    class:
                                                      "iconfont icon-copy tw-text-black",
                                                  },
                                                  null,
                                                  -1,
                                                ),
                                              ])),
                                          ],
                                        ),
                                        d(
                                          (u(),
                                          f(
                                            "div",
                                            {
                                              onClick: ee,
                                              class: g([
                                                {
                                                  "tw-pointer-events-none tw-opacity-60":
                                                    J.value,
                                                },
                                                "tw-cursor-pointer c-flex tw-ml-[8px] tw-h-[40px] tw-w-[40px] tw-bg-[var(--input-dis-br-color)] tw-rounded-[8px] tw-border tw-border-solid tw-border-[var(--text-color-light3)] hover:tw-bg-[var(--btn-info-hover-color)]",
                                              ]),
                                            },
                                            [
                                              ...(a[6] ||
                                                (a[6] = [
                                                  m(
                                                    "i",
                                                    {
                                                      class:
                                                        "iconfont icon-reset tw-text-black",
                                                    },
                                                    null,
                                                    -1,
                                                  ),
                                                ])),
                                            ],
                                            2,
                                          )),
                                          [[V, J.value]],
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["label"],
                                  ),
                                  v(
                                    o,
                                    {
                                      label: w(H)("org.member.req.verifyCode"),
                                      prop: "verifyCode",
                                    },
                                    {
                                      default: n(() => [
                                        v(
                                          t,
                                          {
                                            modelValue: j.value.row.verifyCode,
                                            "onUpdate:modelValue":
                                              a[3] ||
                                              (a[3] = (e) =>
                                                (j.value.row.verifyCode = e)),
                                            modelModifiers: { trim: !0 },
                                            placeholder:
                                              w(H)("rpa.task.req.enter"),
                                          },
                                          null,
                                          8,
                                          ["modelValue", "placeholder"],
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["label"],
                                  ),
                                ],
                                64,
                              ))
                            : h("", !0),
                        ]),
                        _: 1,
                      },
                      8,
                      ["model", "rules"],
                    )),
                    [[C]],
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
export { I as _ };
