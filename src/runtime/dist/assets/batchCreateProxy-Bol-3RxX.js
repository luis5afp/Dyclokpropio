import {
  d as e,
  v as a,
  i as t,
  cv as r,
  am as l,
  bQ as s,
  bS as o,
  cR as p,
  r as i,
  q as u,
  o as n,
  c,
  a as d,
  b as v,
  w as x,
  e as m,
  t as w,
  f as y,
  x as b,
  h as f,
  F as _,
  z as h,
  aq as g,
  at as k,
  a3 as C,
  as as R,
  jg as T,
  a1 as S,
  n as j,
  _ as L,
} from "./index-BUIbb6Pa.js";
import { p as U } from "./proxyUtil-OnkkuXcX.js";
import { _ as P } from "./batchCreateProxyList.vue_vue_type_script_setup_true_lang-Dy92vlL8.js";
import { _ as V } from "./index.vue_vue_type_script_setup_true_lang-A7OAkZwm.js";
import "./index-rtKG2tmD.js";
import "./timeZone-D3UW65MQ.js";
import "./TableFieldDialog-BI1BUo05.js";
import "./sortable.esm-DneA_jWz.js";
import "./LazyRow.vue_vue_type_script_setup_true_lang-C9dK0oMf.js";
import "./country-flag.esm-Bg8BdAZu.js";
import "./index.vue_vue_type_script_setup_true_lang-CIPUEjpB.js";
const I = { class: "tw-flex tw-flex-col tw-h-full tw-relative" },
  $ = {
    class:
      "tw-p-[24px] tw-h-full tw-flex tw-flex-col tw-bg-[var(--table-tr-bg-color)] tw-border-[var(--border-color-base)] tw-rounded-[12px] tw-overflow-y-auto tw-mb-[60px] tw-mt-[30px]",
  },
  q = { class: "tw-flex tw-gap-[16px] tw-mb-[24px]" },
  D = { class: "tw-flex-[3]" },
  N = { class: "tw-flex tw-flex-col tw-h-full" },
  z = { class: "tw-flex tw-gap-[16px]" },
  H = {
    class:
      "tw-flex-[2] tw-border tw-border-[var(--bg-light5)] tw-bg-[var(--primary-color-light7)] tw-p-[16px] tw-rounded-[8px]",
  },
  J = { class: "tw-text-[12px] tw-whitespace-pre-wrap" },
  O = {
    class:
      "tw-text-[12px] tw-text-[var(--el-button-hover-bg-color2)] tw-mt-[16px] tw-whitespace-pre-wrap",
  },
  F = {
    class:
      "tw-mt-[25px] tw-absolute tw-bottom-0 tw-right-[100px] tw-flex tw-justify-end tw-z-10 tw-bg-[var(--bg-base)] tw-w-full",
  },
  M = L(
    e({
      __name: "batchCreateProxy",
      setup(e) {
        let { t: L } = a.useI18n(),
          M = [
            L("proxy.proxy.batchCreate.supported"),
            L("proxy.proxy.batchCreate.proxy_types"),
            L("proxy.proxy.batchCreate.input_format"),
            L("proxy.proxy.batchCreate.default_type"),
            L("proxy.proxy.batchCreate.ipv4_ipv6"),
          ],
          A = [
            "192.168.0.1:8000{Remark}".replace("Remark", L("base.remark")),
            "192.168.0.1:8000:Username:Password{Remark}".replace(
              "Remark",
              L("base.remark"),
            ),
            "Username:Password@192.168.0.1:8000{Remark}".replace(
              "Remark",
              L("base.remark"),
            ),
            "http://192.168.0.1:8000:Username:Password{Remark}".replace(
              "Remark",
              L("base.remark"),
            ),
            "socks5://Username:Password@192.168.0.1:8000{Remark}".replace(
              "Remark",
              L("base.remark"),
            ),
            "http://[2001:db2:2de:0:0:0:0:e12]:8000:Username:Password{Remark}".replace(
              "Remark",
              L("base.remark") +
                L("proxy.proxy.batchCreate.input_example.IPv6_tip"),
            ),
          ],
          B = M.reduce((e, a) => e + "\n" + a),
          E = A.reduce((e, a) => e + "\n" + a),
          K = t(""),
          Q = t({ proxyListStr: "", type: l.Socks5, ipType: r.IpAPI }),
          Z = t(new Date().getTime()),
          G = t(),
          W = t([]),
          X = t(!1),
          Y = s(o, [l.Ssh]).filter((e) => ![...p, l.NonUse].includes(e.value)),
          ee = t(),
          ae = k([
            {
              validator: (e, a, t) => {
                var r, l, s, o;
                let p = Q.value.proxyListStr.split("\n");
                if (p.filter((e) => e).length) {
                  let e = [];
                  for (let [a, r] of p.entries())
                    if (r) {
                      let l = U(r, { defaultType: Q.value.type });
                      if (!l)
                        return (
                          (W.value = []),
                          (K.value = JSON.stringify(Q.value)),
                          (Z.value = new Date().getTime()),
                          void t(
                            new Error(
                              L("proxy.proxy.batchCreate.format_error", {
                                num: a + 1,
                              }),
                            ),
                          )
                        );
                      e.push({ ...l, ipType: Q.value.ipType, id: a + 1 });
                    }
                  K.value !== JSON.stringify(Q.value) &&
                    (null ==
                      (l =
                        null == (r = G.value)
                          ? void 0
                          : r.terminationResolve) || l.call(r),
                    (K.value = JSON.stringify(Q.value)),
                    (W.value = e));
                } else
                  (null ==
                    (o =
                      null == (s = G.value) ? void 0 : s.terminationResolve) ||
                    o.call(s),
                    (K.value = ""),
                    (W.value = []));
                ((Z.value = new Date().getTime()), t());
              },
              trigger: "blur",
            },
          ]);
        function te(e) {
          var a;
          null == (a = ee.value) || a.validate();
        }
        async function re() {
          if (!W.value.length) return;
          if (W.value.length > 500)
            return void C.error(L("proxy.proxy.batchCreate.batchCreateErr"));
          if (X.value) return;
          X.value = !0;
          let [e, a] = await R(T(W.value));
          (!e &&
            a &&
            (await S({
              dangerouslyUseHTMLString: !0,
              type: "success",
              title: L("env.env.shareDialog.operatorSuccess"),
              message: `<div>${L("proxy.proxy.batchCreate.creation_success", { num1: `<span class="tw-text-[var(--btn-primary-color)]">${a.success}</span>`, num2: `<span class="tw-text-[var(--btn-primary-color)]">${a.repeat}</span>` })}</div>`,
              showCancelButton: !1,
              showClose: !1,
              closeOnClickModal: !1,
            }),
            j.back()),
            (X.value = !1));
        }
        return (e, a) => {
          const t = i("ArrowLeft"),
            r = i("el-icon"),
            l = i("el-option"),
            s = i("el-select"),
            o = i("el-form-item"),
            p = i("el-input"),
            k = i("el-form"),
            C = i("el-button"),
            R = u("prevent-label-click");
          return (
            n(),
            c("div", I, [
              d(
                "div",
                {
                  class:
                    "tw-w-fit tw-absolute tw-text-[14px] tw-flex tw-items-center tw-cursor-pointer",
                  onClick: a[0] || (a[0] = (a) => e.$router.back()),
                },
                [
                  v(r, null, { default: x(() => [v(t)]), _: 1 }),
                  m(" " + w(y(L)("errorPage.goBack")), 1),
                ],
              ),
              d("div", $, [
                d("div", q, [
                  d("div", D, [
                    b(
                      (n(),
                      f(
                        k,
                        {
                          ref_key: "proxyFormRef",
                          ref: ee,
                          model: y(Q),
                          disabled: y(X),
                          "label-position": "right",
                          "inline-message": !0,
                          class: "tw-h-full",
                        },
                        {
                          default: x(() => [
                            d("div", N, [
                              d("div", z, [
                                v(
                                  o,
                                  {
                                    class: "tw-flex-1",
                                    label: y(L)("env.env.req.proxyType"),
                                  },
                                  {
                                    default: x(() => [
                                      v(
                                        s,
                                        {
                                          modelValue: y(Q).type,
                                          "onUpdate:modelValue":
                                            a[1] ||
                                            (a[1] = (e) => (y(Q).type = e)),
                                          placeholder: e.$t(
                                            "env.env.req.proxyTypeHolder",
                                          ),
                                          onChange:
                                            a[2] || (a[2] = (e) => te()),
                                        },
                                        {
                                          default: x(() => [
                                            (n(!0),
                                            c(
                                              _,
                                              null,
                                              h(
                                                y(Y),
                                                (e) => (
                                                  n(),
                                                  f(
                                                    l,
                                                    {
                                                      key: e.label,
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
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                v(
                                  o,
                                  {
                                    class: "tw-flex-1",
                                    label: y(L)("env.env.req.proxyIpType"),
                                  },
                                  {
                                    default: x(() => [
                                      v(
                                        V,
                                        {
                                          modelValue: y(Q).ipType,
                                          "onUpdate:modelValue":
                                            a[3] ||
                                            (a[3] = (e) => (y(Q).ipType = e)),
                                          placeholder: e.$t(
                                            "env.env.req.proxyIpTypeHolder",
                                          ),
                                          onChange:
                                            a[4] || (a[4] = (e) => te()),
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
                              v(
                                o,
                                {
                                  class: "tw-flex-1 proxy-textarea-wrapper",
                                  rules: y(ae),
                                  prop: "proxyListStr",
                                },
                                {
                                  default: x(() => [
                                    v(
                                      p,
                                      {
                                        modelValue: y(Q).proxyListStr,
                                        "onUpdate:modelValue":
                                          a[5] ||
                                          (a[5] = (e) =>
                                            (y(Q).proxyListStr = e)),
                                        type: "textarea",
                                        autosize: !0,
                                        placeholder: y(L)(
                                          "proxy.proxy.batchCreate.input_prompt",
                                        ),
                                      },
                                      null,
                                      8,
                                      ["modelValue", "placeholder"],
                                    ),
                                  ]),
                                  _: 1,
                                },
                                8,
                                ["rules"],
                              ),
                            ]),
                          ]),
                          _: 1,
                        },
                        8,
                        ["model", "disabled"],
                      )),
                      [[R]],
                    ),
                  ]),
                  d("div", H, [
                    d("div", J, w(y(B)), 1),
                    d("div", O, w(y(E)), 1),
                  ]),
                ]),
                (n(),
                f(
                  P,
                  {
                    key: y(Z),
                    class: "tw-flex-1",
                    "proxy-list": y(W),
                    "onUpdate:proxyList":
                      a[6] || (a[6] = (e) => (g(W) ? (W.value = e) : (W = e))),
                    ref_key: "batchCreateProxyListRef",
                    ref: G,
                  },
                  null,
                  8,
                  ["proxy-list"],
                )),
              ]),
              d("div", F, [
                v(
                  C,
                  { onClick: a[7] || (a[7] = (a) => e.$router.back()) },
                  { default: x(() => [m(w(y(L)("base.cancel")), 1)]), _: 1 },
                ),
                v(
                  C,
                  {
                    type: "primary",
                    disabled: !y(W).length,
                    loading: y(X),
                    onClick: re,
                  },
                  { default: x(() => [m(w(y(L)("base.confirm")), 1)]), _: 1 },
                  8,
                  ["disabled", "loading"],
                ),
              ]),
            ])
          );
        };
      },
    }),
    [["__scopeId", "data-v-631605cd"]],
  );
export { M as default };
