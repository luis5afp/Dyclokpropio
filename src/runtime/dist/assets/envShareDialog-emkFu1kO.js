import {
  d as e,
  eY as a,
  v as l,
  at as s,
  V as r,
  r as t,
  q as o,
  o as n,
  h as i,
  w as d,
  x as u,
  b as v,
  e as p,
  t as m,
  f as c,
  a as h,
  C as g,
  i as b,
  g8 as f,
  L as w,
  ci as _,
  D,
  E as V,
  A as k,
  g9 as y,
  ga as T,
  gb as x,
  _ as $,
} from "./index-BUIbb6Pa.js";
import { _ as E } from "./Tip.vue_vue_type_script_setup_true_lang-DBJcGLEl.js";
const I = { class: "envV2-input-layout" },
  C = { class: "tw-leading-[1.3] tw-text-[var(--text-color-light1)]" },
  j = $(
    e({
      __name: "envShareDialog",
      emits: ["submit"],
      setup(e, { expose: $, emit: j }) {
        const N = {
            ids: void 0,
            teamId: "",
            passwd: "",
            remark: "",
            shareEnvTypes: [a.OPEN],
          },
          O = b(""),
          { t: S } = l.useI18n(),
          A = j,
          R = b(),
          U = b(!1),
          q = s({ ...r.cloneDeep(N) }),
          F = b(!1),
          H = g(
            () =>
              "1." +
              S("env.env.shareDialog.shareTip1") +
              "\n \n2." +
              S("env.env.shareDialog.shareTip2"),
          ),
          L = () => {
            R.value.validate(async (e) => {
              if (e)
                try {
                  F.value = !0;
                  const e = await f(q.teamId);
                  if (
                    (console.log(e), e.orgs.length > 1 && e.email && e.register)
                  )
                    return w(S("env.env.shareDialog.shareTip7"));
                  let a = S("env.env.shareDialog.confirmShareContent");
                  (e.email &&
                    !e.register &&
                    (a = S("env.env.shareDialog.shareTip3")),
                    (e.orgs.length >= 1 ||
                      (e.email && e.register && 1 === e.orgs.length)) &&
                      (a = S("env.env.shareDialog.shareTip4")),
                    await _(
                      a,
                      async () => {
                        var e;
                        (D.api.trackEvent({
                          type: k.ENV_CLICK,
                          action: V.CLICK_SHARE_ENV,
                          params: {
                            ids: null == (e = q.ids) ? void 0 : e.join(","),
                          },
                        }),
                          await y({
                            ...q,
                            passwd: T((null == q ? void 0 : q.passwd) ?? ""),
                          }),
                          A("submit"),
                          M());
                      },
                      {
                        isIcon: !0,
                        showTips: !0,
                        title: S("env.env.shareDialog.confirmShareTitle"),
                        successMsg: S("env.env.shareDialog.shareSuccessMsg"),
                      },
                    ));
                } finally {
                  F.value = !1;
                }
            });
          },
          M = () => {
            var e;
            (null == (e = R.value) || e.resetFields(),
              Object.assign(q, r.cloneDeep(N)),
              (O.value = ""),
              (U.value = !1));
          },
          P = s({
            teamId: [
              {
                required: !0,
                message: S("env.env.shareDialog.shareObjectTips"),
              },
            ],
            passwd: [
              {
                required: !0,
                message: ((K = "login.passwordRule"), g(() => x(K))),
                trigger: "blur",
              },
            ],
          });
        var K;
        return (
          $({
            acceptParams: async (e) => {
              ((q.ids = e.map((e) => (null == e ? void 0 : e.id) ?? "") ?? []),
                (O.value = e
                  .map((e) => (null == e ? void 0 : e.serialNum) ?? "")
                  .join("、")),
                (U.value = !0));
            },
          }),
          (e, l) => {
            const s = t("el-form-item"),
              r = t("el-checkbox"),
              g = t("el-checkbox-group"),
              b = t("el-input"),
              f = t("el-form"),
              w = t("el-button"),
              _ = t("el-dialog"),
              D = o("trim"),
              V = o("prevent-label-click");
            return (
              n(),
              i(
                _,
                {
                  modelValue: U.value,
                  "onUpdate:modelValue": l[4] || (l[4] = (e) => (U.value = e)),
                  title: e.$t("env.env.shareEnv"),
                  "close-on-click-modal": !1,
                  "close-on-press-escape": !1,
                  "align-center": !0,
                  close: M,
                  width: "650px",
                },
                {
                  footer: d(() => [
                    v(
                      w,
                      { type: "info", onClick: M },
                      {
                        default: d(() => [p(m(e.$t("base.cancel")), 1)]),
                        _: 1,
                      },
                    ),
                    v(
                      w,
                      { type: "primary", onClick: L, loading: F.value },
                      {
                        default: d(() => [p(m(e.$t("base.confirm")), 1)]),
                        _: 1,
                      },
                      8,
                      ["loading"],
                    ),
                  ]),
                  default: d(() => [
                    u(
                      (n(),
                      i(
                        f,
                        {
                          ref_key: "ruleFormRef",
                          ref: R,
                          class: "envShareDialogForm",
                          "label-position": "right",
                          model: q,
                          rules: P,
                          "label-width": "auto",
                        },
                        {
                          default: d(() => [
                            v(
                              s,
                              { label: e.$t("env.env.clone.serialNum") },
                              { default: d(() => [p(m(O.value), 1)]), _: 1 },
                              8,
                              ["label"],
                            ),
                            v(
                              s,
                              { label: e.$t("env.env.shareDialog.shareAuth") },
                              {
                                default: d(() => [
                                  v(
                                    g,
                                    {
                                      modelValue: q.shareEnvTypes,
                                      "onUpdate:modelValue":
                                        l[0] ||
                                        (l[0] = (e) => (q.shareEnvTypes = e)),
                                    },
                                    {
                                      default: d(() => [
                                        v(
                                          r,
                                          {
                                            value: c(a).OPEN,
                                            label: e.$t(
                                              "env.env.shareDialog.shareAuth1",
                                            ),
                                            disabled: "",
                                          },
                                          null,
                                          8,
                                          ["value", "label"],
                                        ),
                                        v(
                                          r,
                                          {
                                            value: c(a).EDIT,
                                            label: e.$t(
                                              "env.env.shareDialog.shareAuth2",
                                            ),
                                          },
                                          null,
                                          8,
                                          ["value", "label"],
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["modelValue"],
                                  ),
                                ]),
                                _: 1,
                              },
                              8,
                              ["label"],
                            ),
                            v(
                              s,
                              {
                                label: e.$t("env.env.shareDialog.sharedTeam"),
                                prop: "teamId",
                              },
                              {
                                label: d(() => [
                                  h("div", I, [
                                    h("div", null, [
                                      p(
                                        m(
                                          c(S)(
                                            "env.env.shareDialog.shareObject",
                                          ),
                                        ) + " ",
                                        1,
                                      ),
                                      v(E, { text: H.value }, null, 8, [
                                        "text",
                                      ]),
                                    ]),
                                  ]),
                                ]),
                                default: d(() => [
                                  v(
                                    b,
                                    {
                                      modelValue: q.teamId,
                                      "onUpdate:modelValue":
                                        l[1] || (l[1] = (e) => (q.teamId = e)),
                                      modelModifiers: { trim: !0 },
                                      placeholder: e.$t(
                                        "env.env.shareDialog.shareObjectTips",
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
                              8,
                              ["label"],
                            ),
                            v(
                              s,
                              {
                                prop: "passwd",
                                label: e.$t("env.env.pwdCheck"),
                              },
                              {
                                default: d(() => [
                                  v(
                                    b,
                                    {
                                      type: "passwd",
                                      modelValue: q.passwd,
                                      "onUpdate:modelValue":
                                        l[2] || (l[2] = (e) => (q.passwd = e)),
                                      placeholder: e.$t("env.env.pwdCheckHint"),
                                      "show-password": "",
                                      clearable: "",
                                      autocomplete: "new-password",
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
                            v(
                              s,
                              {
                                label: e.$t("env.env.shareDialog.sharedRemark"),
                                class: "tw-mb-[4px]",
                              },
                              {
                                default: d(() => [
                                  u(
                                    v(
                                      b,
                                      {
                                        modelValue: q.remark,
                                        "onUpdate:modelValue":
                                          l[3] ||
                                          (l[3] = (e) => (q.remark = e)),
                                        placeholder: e.$t(
                                          "env.env.req.remarkHolder",
                                        ),
                                        clearable: "",
                                        maxlength: 500,
                                        "show-word-limit": "",
                                      },
                                      null,
                                      8,
                                      ["modelValue", "placeholder"],
                                    ),
                                    [[D]],
                                  ),
                                ]),
                                _: 1,
                              },
                              8,
                              ["label"],
                            ),
                            v(
                              s,
                              { label: " " },
                              {
                                default: d(() => [
                                  h(
                                    "div",
                                    C,
                                    m(
                                      c(S)(
                                        "env.env.shareDialog.sharedRemarkTip",
                                      ),
                                    ),
                                    1,
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
                      [[V]],
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
    [["__scopeId", "data-v-3b6df1c5"]],
  );
export { j as default };
