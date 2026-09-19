import {
  d as e,
  i as l,
  hn as a,
  v as o,
  G as t,
  at as s,
  r,
  q as i,
  h as d,
  w as u,
  b as n,
  f as v,
  x as c,
  o as m,
  y as f,
  b7 as p,
  c as b,
  t as y,
  e as g,
  hC as h,
  hD as _,
  hE as w,
  l6 as V,
  hK as k,
  hL as C,
  n as I,
  H as A,
  D as T,
  l7 as L,
  l8 as x,
  em as E,
  N as F,
  _ as q,
} from "./index-BUIbb6Pa.js";
const O = { key: 0 },
  U = q(
    e({
      __name: "openLoginVerifyDialog",
      setup(e, { expose: q }) {
        const U = l(!1),
          W = l(a.TWOFA);
        let { t: M } = o.useI18n();
        const D = l(0);
        let H = null,
          K = l({ email: "", verifyCode: "", code: "" });
        const R = l(),
          S = l(),
          N = t(),
          P = l(!1),
          $ = s({
            code: [{ required: !0, message: M("register.codeRule") }],
            verifyCode: [
              { required: !0, message: M("org.member.req.verifyCodeHolder") },
            ],
          }),
          j = l();
        function G() {
          U.value = !1;
        }
        const Y = l();
        async function z() {
          D.value ||
            ((D.value = h),
            (H = setInterval(() => {
              D.value > 0 ? D.value-- : H && (clearInterval(H), (H = null));
            }, 1e3)),
            await _({ email: j.value.email, type: w.VALID_EMAIL }));
        }
        async function B() {
          var e, l, o;
          if (P.value) return;
          W.value === a.TWOFA
            ? await (null == (e = R.value) ? void 0 : e.validate())
            : await (null == (l = S.value) ? void 0 : l.validate());
          let t = {
            passwd: j.value.passwd,
            email: j.value.account,
            deviceId: j.value.deviceId,
            verifyCode: W.value === a.TWOFA ? K.value.verifyCode : K.value.code,
            validateType: W.value,
          };
          P.value = !0;
          try {
            let e = await V(t);
            if (!e || !e.token || !e.user) return;
            (null == (o = Y.value) || o.call(Y),
              k(C.TOKEN_STATE, e.user.expiredTime),
              N.setToken(e.token));
            const l = N.formatUserInfo(e.user, e.loginMember);
            (N.setUserInfo(l),
              await I.push(A),
              window.location.reload(),
              T.isClient && L(x(), M("login.successHint")),
              (U.value = !1));
          } catch (s) {
            E(s);
          } finally {
            await F(() => {
              P.value = !1;
            });
          }
        }
        return (
          q({
            acceptParams: function (e, l) {
              var o, t;
              (l && (Y.value = l),
                null == (o = R.value) || o.resetFields(),
                null == (t = S.value) || t.resetFields(),
                (U.value = !0),
                (j.value = e),
                (K.value.email = e.email),
                (W.value = e.check2fa ? a.TWOFA : a.EMAIL));
            },
          }),
          (e, l) => {
            const o = r("el-input"),
              t = r("el-form-item"),
              s = r("el-form"),
              h = r("el-tab-pane"),
              _ = r("el-button"),
              w = r("el-tabs"),
              V = r("el-dialog"),
              k = i("prevent-label-click");
            return (
              m(),
              d(
                V,
                {
                  modelValue: U.value,
                  "onUpdate:modelValue": l[6] || (l[6] = (e) => (U.value = e)),
                  "align-center": !0,
                  "close-on-click-modal": !1,
                  "close-on-press-escape": !1,
                  title: v(M)("org.org.VERIFY"),
                  class: "openLoginVer",
                  "label-position": "right",
                  "label-width": "auto",
                  width: "600px",
                },
                {
                  footer: u(() => [
                    n(
                      _,
                      { type: "info", onClick: G },
                      {
                        default: u(() => [g(y(v(M)("base.cancel")), 1)]),
                        _: 1,
                      },
                    ),
                    n(
                      _,
                      { type: "primary", loading: P.value, onClick: B },
                      {
                        default: u(() => [g(y(v(M)("base.confirm")), 1)]),
                        _: 1,
                      },
                      8,
                      ["loading"],
                    ),
                  ]),
                  default: u(() => [
                    n(
                      w,
                      {
                        modelValue: W.value,
                        "onUpdate:modelValue":
                          l[5] || (l[5] = (e) => (W.value = e)),
                        class: "login-verify-tabs",
                      },
                      {
                        default: u(() => {
                          var e, r;
                          return [
                            n(
                              h,
                              {
                                disabled: !(null == (e = j.value)
                                  ? void 0
                                  : e.check2fa),
                                label: v(M)(`org.member.${v(a).TWOFA}`),
                                name: v(a).TWOFA,
                              },
                              {
                                default: u(() => [
                                  c(
                                    (m(),
                                    d(
                                      s,
                                      {
                                        ref_key: "formRef1",
                                        ref: R,
                                        model: v(K),
                                        rules: $,
                                        class: "tw-mt-[15px]",
                                        "label-position": "right",
                                        "label-width": "auto",
                                        onSubmit:
                                          l[1] ||
                                          (l[1] = f(() => {}, ["prevent"])),
                                      },
                                      {
                                        default: u(() => [
                                          n(
                                            t,
                                            {
                                              label: v(M)(
                                                "org.member.req.verifyCode",
                                              ),
                                              prop: "verifyCode",
                                              required: "",
                                            },
                                            {
                                              default: u(() => [
                                                n(
                                                  o,
                                                  {
                                                    modelValue: v(K).verifyCode,
                                                    "onUpdate:modelValue":
                                                      l[0] ||
                                                      (l[0] = (e) =>
                                                        (v(K).verifyCode = e)),
                                                    placeholder:
                                                      v(M)(
                                                        "rpa.task.req.enter",
                                                      ),
                                                    onKeydown: p(B, ["enter"]),
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
                                        ]),
                                        _: 1,
                                      },
                                      8,
                                      ["model", "rules"],
                                    )),
                                    [[k]],
                                  ),
                                ]),
                                _: 1,
                              },
                              8,
                              ["disabled", "label", "name"],
                            ),
                            n(
                              h,
                              {
                                disabled: !(null == (r = j.value)
                                  ? void 0
                                  : r.checkEmail),
                                label: v(M)(`org.member.${v(a).EMAIL}`),
                                name: v(a).EMAIL,
                              },
                              {
                                default: u(() => [
                                  c(
                                    (m(),
                                    d(
                                      s,
                                      {
                                        ref_key: "formRef2",
                                        ref: S,
                                        model: v(K),
                                        rules: $,
                                        class: "tw-mt-[15px]",
                                        "label-position": "right",
                                        "label-width": "auto",
                                        onSubmit:
                                          l[4] ||
                                          (l[4] = f(() => {}, ["prevent"])),
                                      },
                                      {
                                        default: u(() => [
                                          n(
                                            t,
                                            { label: v(M)("login.emailLabel") },
                                            {
                                              default: u(() => [
                                                n(
                                                  o,
                                                  {
                                                    modelValue: v(K).email,
                                                    "onUpdate:modelValue":
                                                      l[2] ||
                                                      (l[2] = (e) =>
                                                        (v(K).email = e)),
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
                                          n(
                                            t,
                                            {
                                              label: v(M)("login.emailLabel"),
                                              prop: "code",
                                              required: "",
                                            },
                                            {
                                              default: u(() => [
                                                n(
                                                  o,
                                                  {
                                                    modelValue: v(K).code,
                                                    "onUpdate:modelValue":
                                                      l[3] ||
                                                      (l[3] = (e) =>
                                                        (v(K).code = e)),
                                                    placeholder:
                                                      v(M)("register.code"),
                                                    onKeydown: p(B, ["enter"]),
                                                  },
                                                  {
                                                    suffix: u(() => [
                                                      D.value > 0
                                                        ? (m(),
                                                          b(
                                                            "span",
                                                            O,
                                                            y(D.value) +
                                                              "s" +
                                                              y(
                                                                v(M)(
                                                                  "resetPassword.resendCodeHint",
                                                                ),
                                                              ),
                                                            1,
                                                          ))
                                                        : (m(),
                                                          d(
                                                            _,
                                                            {
                                                              key: 1,
                                                              link: "",
                                                              type: "primary",
                                                              onClick: z,
                                                            },
                                                            {
                                                              default: u(() => [
                                                                g(
                                                                  y(
                                                                    v(M)(
                                                                      "register.sendCode",
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
                                      ["model", "rules"],
                                    )),
                                    [[k]],
                                  ),
                                ]),
                                _: 1,
                              },
                              8,
                              ["disabled", "label", "name"],
                            ),
                          ];
                        }),
                        _: 1,
                      },
                      8,
                      ["modelValue"],
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
    }),
    [["__scopeId", "data-v-7f8549c5"]],
  );
export { U as default };
