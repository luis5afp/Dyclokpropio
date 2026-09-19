import {
  d as e,
  R as l,
  aW as t,
  v as a,
  i as o,
  P as n,
  r as c,
  q as s,
  o as u,
  c as i,
  h as r,
  w as d,
  b as p,
  f as m,
  b9 as v,
  e as f,
  t as V,
  a as w,
  X as h,
  F as b,
  z as L,
  x as _,
  dw as x,
  be as y,
  ah as k,
  C as g,
  d7 as E,
} from "./index-BUIbb6Pa.js";
import { _ as $ } from "./Tip.vue_vue_type_script_setup_true_lang-DBJcGLEl.js";
const A = { id: "envV2AddAccountBox", class: "tw-mb-[20px]" },
  U = { class: "envV2-input-layout" },
  B = { class: "tw-w-full tw-flex tw-flex-col tw-gap-y-5" },
  S = {
    class:
      "tw-rounded-[8px] tw-bg-[var(--card-base-bg-color)] tw-p-[20px] tw-w-full",
  },
  q = { class: "account-item-main tw-flex tw-flex-col tw-gap-y-[24px]" },
  N = { class: "s-flex tw-gap-x-2" },
  P = ["alt", "src"],
  T = e({
    __name: "BindAccount",
    props: {
      modelValue: {},
      isEdit: { type: Boolean },
      isBatch: { type: Boolean },
      isShare: { type: Boolean },
      isUpdate: { type: Boolean },
      isBulkImport: { type: Boolean },
      isSingle: { type: Boolean },
      batchData: {},
      importData: {},
      isShowUrl: { type: Boolean, default: !0 },
      isShowAccount: { type: Boolean, default: !0 },
      isPreference: { type: Boolean, default: !1 },
    },
    emits: ["checkStep"],
    setup(e, { expose: T, emit: I }) {
      const { listingLinkAccounts: C } = l(t()),
        R = e,
        { t: W } = a.useI18n();
      let H = I,
        z = o(R.modelValue);
      const M = o([]),
        O = o(new Map());
      let D = (e, l) => {
        O.value.set(l, e);
      };
      function F(e, l, t) {
        const a = e.field.split("url.")[1],
          o = z.value.accountList[a];
        o.platform && (o.platform !== x.OTHER || o.url)
          ? o.platform !== x.OTHER || !o.url || o.url.startsWith("http")
            ? t()
            : t(new Error(W("env.env.req.accountCorrectPlatformLinkRule")))
          : t(new Error(W("env.env.req.accountPlatformLinkHolder")));
      }
      n(() => {
        C.value.forEach((e) => {
          M.value.push({
            value: e.value,
            label: "other" === e.value ? W("envV2.tip19") : e.value,
            logo: e.logo,
          });
        });
      });
      let j = g(() =>
        z.value.accountList.reduce(
          (e, l, t) => ({ ...e, [`url.${t}`]: [{ validator: F }] }),
          {},
        ),
      );
      const Z = () => {
        var e;
        z.value &&
          (z.value.accountList || (z.value.accountList = []),
          (null == (e = z.value.accountList) ? void 0 : e.length) >= 50
            ? E(W("env.env.req.addAccountLimit", { N: 50 }))
            : z.value.accountList.unshift({
                platform: void 0,
                url: void 0,
                userName: void 0,
                passwd: void 0,
                remark: void 0,
              }));
      };
      return (
        T({
          validateAccountList: function () {
            let e = [];
            return (
              O.value.forEach((l) => {
                l && e.push(null == l ? void 0 : l.validate());
              }),
              Promise.all(e)
            );
          },
          addAccount: Z,
        }),
        (l, t) => {
          var a;
          const o = c("el-button"),
            n = c("el-form-item"),
            g = c("el-option"),
            E = c("el-select"),
            T = c("el-input"),
            I = c("Warning"),
            C = c("el-icon"),
            W = c("el-tooltip"),
            F = c("el-form"),
            X = s("prevent-label-click");
          return (
            u(),
            i("div", A, [
              R.isShowAccount
                ? (u(),
                  r(
                    n,
                    { key: 0 },
                    {
                      label: d(() => [
                        w("div", U, [
                          w("div", null, [
                            f(V(l.$t("envV2.tip2")) + " ", 1),
                            p($, { text: l.$t("envV2.tip12") }, null, 8, [
                              "text",
                            ]),
                          ]),
                        ]),
                      ]),
                      default: d(() => [
                        p(
                          o,
                          {
                            id: "envV2AddAccountBtn",
                            icon: m(v),
                            type: "primary",
                            onClick: Z,
                          },
                          {
                            default: d(() => [
                              f(V(l.$t("env.env.req.addAccount")), 1),
                            ]),
                            _: 1,
                          },
                          8,
                          ["icon"],
                        ),
                      ]),
                      _: 1,
                    },
                  ))
                : h("", !0),
              (null == (a = m(z).accountList) ? void 0 : a.length)
                ? (u(),
                  r(
                    n,
                    {
                      key: 1,
                      class: "envEditV2-not-mb-0 tw-mt-[-16px]",
                      label: " ",
                      prop: "accountList",
                    },
                    {
                      default: d(() => [
                        w("div", B, [
                          (u(!0),
                          i(
                            b,
                            null,
                            L(
                              m(z).accountList,
                              (a, c) => (
                                u(),
                                i(
                                  "div",
                                  {
                                    key: c,
                                    class: "s-flex tw-gap-x-2 tw-w-full",
                                  },
                                  [
                                    w("div", S, [
                                      _(
                                        (u(),
                                        r(
                                          F,
                                          {
                                            ref_for: !0,
                                            ref: (e) => m(D)(e, c),
                                            model: m(z).accountList[c],
                                            rules: m(j),
                                            class: "tw-w-[100%]",
                                            "hide-required-asterisk": "",
                                            "label-position": "left",
                                            "label-width": "110px",
                                          },
                                          {
                                            default: d(() => [
                                              w("div", q, [
                                                p(
                                                  n,
                                                  {
                                                    label: l.$t("envV2.tip9"),
                                                    class:
                                                      "envEditV2-not-mb-0 !tw-items-center",
                                                    prop: "platform",
                                                  },
                                                  {
                                                    default: d(() => [
                                                      p(
                                                        E,
                                                        {
                                                          modelValue:
                                                            m(z).accountList[c]
                                                              .platform,
                                                          "onUpdate:modelValue":
                                                            (e) =>
                                                              (m(z).accountList[
                                                                c
                                                              ].platform = e),
                                                          placeholder: l.$t(
                                                            "env.env.req.accountPlatformHolder",
                                                          ),
                                                          filterable: "",
                                                        },
                                                        {
                                                          default: d(() => [
                                                            (u(!0),
                                                            i(
                                                              b,
                                                              null,
                                                              L(
                                                                M.value,
                                                                (e) => (
                                                                  u(),
                                                                  r(
                                                                    g,
                                                                    {
                                                                      key: e.value,
                                                                      label:
                                                                        e.label,
                                                                      value:
                                                                        e.value,
                                                                      onChange:
                                                                        (e) =>
                                                                          (m(
                                                                            z,
                                                                          ).accountList[
                                                                            c
                                                                          ].url =
                                                                            void 0),
                                                                    },
                                                                    {
                                                                      default:
                                                                        d(
                                                                          () => [
                                                                            w(
                                                                              "div",
                                                                              N,
                                                                              [
                                                                                w(
                                                                                  "img",
                                                                                  {
                                                                                    alt: e.label,
                                                                                    src: e.logo,
                                                                                    class:
                                                                                      "tw-rounded-[3px] tw-w-[22px] tw-h-[22px]",
                                                                                  },
                                                                                  null,
                                                                                  8,
                                                                                  P,
                                                                                ),
                                                                                w(
                                                                                  "span",
                                                                                  null,
                                                                                  V(
                                                                                    e.label,
                                                                                  ),
                                                                                  1,
                                                                                ),
                                                                              ],
                                                                            ),
                                                                          ],
                                                                        ),
                                                                      _: 2,
                                                                    },
                                                                    1032,
                                                                    [
                                                                      "label",
                                                                      "value",
                                                                      "onChange",
                                                                    ],
                                                                  )
                                                                ),
                                                              ),
                                                              128,
                                                            )),
                                                          ]),
                                                          _: 2,
                                                        },
                                                        1032,
                                                        [
                                                          "modelValue",
                                                          "onUpdate:modelValue",
                                                          "placeholder",
                                                        ],
                                                      ),
                                                    ]),
                                                    _: 2,
                                                  },
                                                  1032,
                                                  ["label"],
                                                ),
                                                m(z).accountList[c].platform
                                                  ? (u(),
                                                    i(
                                                      b,
                                                      { key: 0 },
                                                      [
                                                        m(z).accountList[c]
                                                          .platform ===
                                                        m(x).OTHER
                                                          ? (u(),
                                                            r(
                                                              n,
                                                              {
                                                                key: 0,
                                                                label: l.$t(
                                                                  "env.env.req.accountPlatformLink",
                                                                ),
                                                                prop:
                                                                  "url." + c,
                                                                class:
                                                                  "envEditV2-not-mb-0",
                                                              },
                                                              {
                                                                default: d(
                                                                  () => [
                                                                    p(
                                                                      T,
                                                                      {
                                                                        modelValue:
                                                                          m(z)
                                                                            .accountList[
                                                                            c
                                                                          ].url,
                                                                        "onUpdate:modelValue":
                                                                          (e) =>
                                                                            (m(
                                                                              z,
                                                                            ).accountList[
                                                                              c
                                                                            ].url =
                                                                              e),
                                                                        placeholder:
                                                                          l.$t(
                                                                            "env.env.req.accountPlatformLinkHolder",
                                                                          ),
                                                                        clearable:
                                                                          "",
                                                                      },
                                                                      null,
                                                                      8,
                                                                      [
                                                                        "modelValue",
                                                                        "onUpdate:modelValue",
                                                                        "placeholder",
                                                                      ],
                                                                    ),
                                                                  ],
                                                                ),
                                                                _: 2,
                                                              },
                                                              1032,
                                                              ["label", "prop"],
                                                            ))
                                                          : h("", !0),
                                                        e.isSingle &&
                                                        !e.isPreference
                                                          ? (u(),
                                                            i(
                                                              b,
                                                              { key: 1 },
                                                              [
                                                                p(
                                                                  n,
                                                                  {
                                                                    label:
                                                                      l.$t(
                                                                        "envV2.tip10",
                                                                      ),
                                                                    class:
                                                                      "envEditV2-not-mb-0",
                                                                    prop: "userName",
                                                                  },
                                                                  {
                                                                    default: d(
                                                                      () => [
                                                                        p(
                                                                          T,
                                                                          {
                                                                            modelValue:
                                                                              m(
                                                                                z,
                                                                              )
                                                                                .accountList[
                                                                                c
                                                                              ]
                                                                                .userName,
                                                                            "onUpdate:modelValue":
                                                                              (
                                                                                e,
                                                                              ) =>
                                                                                (m(
                                                                                  z,
                                                                                ).accountList[
                                                                                  c
                                                                                ].userName =
                                                                                  e),
                                                                            placeholder:
                                                                              l.$t(
                                                                                "envV2.tip21",
                                                                              ),
                                                                            clearable:
                                                                              "",
                                                                            maxlength: 100,
                                                                          },
                                                                          null,
                                                                          8,
                                                                          [
                                                                            "modelValue",
                                                                            "onUpdate:modelValue",
                                                                            "placeholder",
                                                                          ],
                                                                        ),
                                                                      ],
                                                                    ),
                                                                    _: 2,
                                                                  },
                                                                  1032,
                                                                  ["label"],
                                                                ),
                                                                p(
                                                                  n,
                                                                  {
                                                                    label:
                                                                      l.$t(
                                                                        "envV2.tip11",
                                                                      ),
                                                                    class:
                                                                      "envEditV2-not-mb-0",
                                                                  },
                                                                  {
                                                                    default: d(
                                                                      () => [
                                                                        R.isShare
                                                                          ? (u(),
                                                                            r(
                                                                              T,
                                                                              {
                                                                                key: 1,
                                                                                modelValue:
                                                                                  m(
                                                                                    z,
                                                                                  )
                                                                                    .accountList[
                                                                                    c
                                                                                  ]
                                                                                    .passwd,
                                                                                "onUpdate:modelValue":
                                                                                  (
                                                                                    e,
                                                                                  ) =>
                                                                                    (m(
                                                                                      z,
                                                                                    ).accountList[
                                                                                      c
                                                                                    ].passwd =
                                                                                      e),
                                                                                placeholder:
                                                                                  l.$t(
                                                                                    "envV2.tip22",
                                                                                  ),
                                                                                clearable:
                                                                                  "",
                                                                                maxlength: 100,
                                                                                type: "password",
                                                                              },
                                                                              null,
                                                                              8,
                                                                              [
                                                                                "modelValue",
                                                                                "onUpdate:modelValue",
                                                                                "placeholder",
                                                                              ],
                                                                            ))
                                                                          : (u(),
                                                                            r(
                                                                              T,
                                                                              {
                                                                                key: 0,
                                                                                modelValue:
                                                                                  m(
                                                                                    z,
                                                                                  )
                                                                                    .accountList[
                                                                                    c
                                                                                  ]
                                                                                    .passwd,
                                                                                "onUpdate:modelValue":
                                                                                  (
                                                                                    e,
                                                                                  ) =>
                                                                                    (m(
                                                                                      z,
                                                                                    ).accountList[
                                                                                      c
                                                                                    ].passwd =
                                                                                      e),
                                                                                placeholder:
                                                                                  l.$t(
                                                                                    "envV2.tip21",
                                                                                  ),
                                                                                "show-password":
                                                                                  !e.isEdit ||
                                                                                  m(
                                                                                    y,
                                                                                  )(
                                                                                    m(
                                                                                      k,
                                                                                    )
                                                                                      .VIEW_ENVIRONMENT_PASSWD,
                                                                                  ),
                                                                                clearable:
                                                                                  "",
                                                                                maxlength: 100,
                                                                                type: "password",
                                                                              },
                                                                              null,
                                                                              8,
                                                                              [
                                                                                "modelValue",
                                                                                "onUpdate:modelValue",
                                                                                "placeholder",
                                                                                "show-password",
                                                                              ],
                                                                            )),
                                                                      ],
                                                                    ),
                                                                    _: 2,
                                                                  },
                                                                  1032,
                                                                  ["label"],
                                                                ),
                                                                p(
                                                                  n,
                                                                  {
                                                                    label: l.$t(
                                                                      "env.env.req.accountTwoFA",
                                                                    ),
                                                                    class:
                                                                      "envEditV2-not-mb-0",
                                                                  },
                                                                  {
                                                                    default: d(
                                                                      () => [
                                                                        R.isShare
                                                                          ? (u(),
                                                                            r(
                                                                              T,
                                                                              {
                                                                                key: 1,
                                                                                modelValue:
                                                                                  m(
                                                                                    z,
                                                                                  )
                                                                                    .accountList[
                                                                                    c
                                                                                  ]
                                                                                    .secret,
                                                                                "onUpdate:modelValue":
                                                                                  (
                                                                                    e,
                                                                                  ) =>
                                                                                    (m(
                                                                                      z,
                                                                                    ).accountList[
                                                                                      c
                                                                                    ].secret =
                                                                                      e),
                                                                                modelModifiers:
                                                                                  {
                                                                                    trim: !0,
                                                                                  },
                                                                                placeholder:
                                                                                  l.$t(
                                                                                    "envV2.tip22",
                                                                                  ),
                                                                                type: "password",
                                                                                maxlength: 100,
                                                                                onInput:
                                                                                  (
                                                                                    e,
                                                                                  ) =>
                                                                                    (m(
                                                                                      z,
                                                                                    ).accountList[
                                                                                      c
                                                                                    ].secret =
                                                                                      m(
                                                                                        z,
                                                                                      ).accountList[
                                                                                        c
                                                                                      ].secret.replace(
                                                                                        /[^a-zA-Z0-9]/g,
                                                                                        "",
                                                                                      )),
                                                                              },
                                                                              {
                                                                                suffix:
                                                                                  d(
                                                                                    () => [
                                                                                      p(
                                                                                        W,
                                                                                        {
                                                                                          content:
                                                                                            l.$t(
                                                                                              "env.env.req.accountTwoFATip",
                                                                                            ),
                                                                                          placement:
                                                                                            "bottom",
                                                                                          "popper-class":
                                                                                            "tw-w-[200px]",
                                                                                        },
                                                                                        {
                                                                                          default:
                                                                                            d(
                                                                                              () => [
                                                                                                p(
                                                                                                  C,
                                                                                                  {
                                                                                                    class:
                                                                                                      "tw-cursor-pointer",
                                                                                                    size: "16",
                                                                                                  },
                                                                                                  {
                                                                                                    default:
                                                                                                      d(
                                                                                                        () => [
                                                                                                          p(
                                                                                                            I,
                                                                                                          ),
                                                                                                        ],
                                                                                                      ),
                                                                                                    _: 1,
                                                                                                  },
                                                                                                ),
                                                                                              ],
                                                                                            ),
                                                                                          _: 1,
                                                                                        },
                                                                                        8,
                                                                                        [
                                                                                          "content",
                                                                                        ],
                                                                                      ),
                                                                                    ],
                                                                                  ),
                                                                                _: 1,
                                                                              },
                                                                              8,
                                                                              [
                                                                                "modelValue",
                                                                                "onUpdate:modelValue",
                                                                                "placeholder",
                                                                                "onInput",
                                                                              ],
                                                                            ))
                                                                          : (u(),
                                                                            r(
                                                                              T,
                                                                              {
                                                                                key: 0,
                                                                                modelValue:
                                                                                  m(
                                                                                    z,
                                                                                  )
                                                                                    .accountList[
                                                                                    c
                                                                                  ]
                                                                                    .secret,
                                                                                "onUpdate:modelValue":
                                                                                  (
                                                                                    e,
                                                                                  ) =>
                                                                                    (m(
                                                                                      z,
                                                                                    ).accountList[
                                                                                      c
                                                                                    ].secret =
                                                                                      e),
                                                                                modelModifiers:
                                                                                  {
                                                                                    trim: !0,
                                                                                  },
                                                                                placeholder:
                                                                                  l.$t(
                                                                                    "envV2.tip22",
                                                                                  ),
                                                                                "show-password":
                                                                                  !e.isEdit ||
                                                                                  m(
                                                                                    y,
                                                                                  )(
                                                                                    m(
                                                                                      k,
                                                                                    )
                                                                                      .VIEW_ENVIRONMENT_PASSWD,
                                                                                  ),
                                                                                type: "password",
                                                                                maxlength: 100,
                                                                                onInput:
                                                                                  (
                                                                                    e,
                                                                                  ) =>
                                                                                    (m(
                                                                                      z,
                                                                                    ).accountList[
                                                                                      c
                                                                                    ].secret =
                                                                                      m(
                                                                                        z,
                                                                                      ).accountList[
                                                                                        c
                                                                                      ].secret.replace(
                                                                                        /[^a-zA-Z0-9]/g,
                                                                                        "",
                                                                                      )),
                                                                              },
                                                                              {
                                                                                suffix:
                                                                                  d(
                                                                                    () => [
                                                                                      p(
                                                                                        W,
                                                                                        {
                                                                                          content:
                                                                                            l.$t(
                                                                                              "env.env.req.accountTwoFATip",
                                                                                            ),
                                                                                          placement:
                                                                                            "top",
                                                                                          "popper-class":
                                                                                            "tw-w-[200px]",
                                                                                        },
                                                                                        {
                                                                                          default:
                                                                                            d(
                                                                                              () => [
                                                                                                p(
                                                                                                  C,
                                                                                                  {
                                                                                                    class:
                                                                                                      "tw-cursor-pointer",
                                                                                                    size: "16",
                                                                                                  },
                                                                                                  {
                                                                                                    default:
                                                                                                      d(
                                                                                                        () => [
                                                                                                          p(
                                                                                                            I,
                                                                                                          ),
                                                                                                        ],
                                                                                                      ),
                                                                                                    _: 1,
                                                                                                  },
                                                                                                ),
                                                                                              ],
                                                                                            ),
                                                                                          _: 1,
                                                                                        },
                                                                                        8,
                                                                                        [
                                                                                          "content",
                                                                                        ],
                                                                                      ),
                                                                                    ],
                                                                                  ),
                                                                                _: 1,
                                                                              },
                                                                              8,
                                                                              [
                                                                                "modelValue",
                                                                                "onUpdate:modelValue",
                                                                                "placeholder",
                                                                                "show-password",
                                                                                "onInput",
                                                                              ],
                                                                            )),
                                                                      ],
                                                                    ),
                                                                    _: 2,
                                                                  },
                                                                  1032,
                                                                  ["label"],
                                                                ),
                                                                p(
                                                                  n,
                                                                  {
                                                                    label:
                                                                      l.$t(
                                                                        "envV2.tip23",
                                                                      ),
                                                                    class:
                                                                      "envEditV2-not-mb-0",
                                                                  },
                                                                  {
                                                                    default: d(
                                                                      () => [
                                                                        p(
                                                                          T,
                                                                          {
                                                                            modelValue:
                                                                              m(
                                                                                z,
                                                                              )
                                                                                .accountList[
                                                                                c
                                                                              ]
                                                                                .remark,
                                                                            "onUpdate:modelValue":
                                                                              (
                                                                                e,
                                                                              ) =>
                                                                                (m(
                                                                                  z,
                                                                                ).accountList[
                                                                                  c
                                                                                ].remark =
                                                                                  e),
                                                                            placeholder:
                                                                              l.$t(
                                                                                "envV2.tip22",
                                                                              ),
                                                                            clearable:
                                                                              "",
                                                                          },
                                                                          null,
                                                                          8,
                                                                          [
                                                                            "modelValue",
                                                                            "onUpdate:modelValue",
                                                                            "placeholder",
                                                                          ],
                                                                        ),
                                                                      ],
                                                                    ),
                                                                    _: 2,
                                                                  },
                                                                  1032,
                                                                  ["label"],
                                                                ),
                                                              ],
                                                              64,
                                                            ))
                                                          : h("", !0),
                                                      ],
                                                      64,
                                                    ))
                                                  : h("", !0),
                                              ]),
                                            ]),
                                            _: 2,
                                          },
                                          1032,
                                          ["model", "rules"],
                                        )),
                                        [[X]],
                                      ),
                                    ]),
                                    p(
                                      W,
                                      {
                                        content: l.$t("envV2.deleteAccount"),
                                        placement: "top",
                                      },
                                      {
                                        default: d(() => [
                                          p(
                                            o,
                                            {
                                              class: "account-item-remove",
                                              link: "",
                                              type: "info",
                                              onClick: (e) =>
                                                ((e) => {
                                                  z.value &&
                                                    (z.value.accountList ||
                                                      (z.value.accountList =
                                                        []),
                                                    z.value.accountList
                                                      .length <= e ||
                                                      (O.value.delete(e),
                                                      z.value.accountList.splice(
                                                        e,
                                                        1,
                                                      ),
                                                      H("checkStep")));
                                                })(c),
                                            },
                                            {
                                              default: d(() => [
                                                ...(t[0] ||
                                                  (t[0] = [
                                                    w(
                                                      "i",
                                                      {
                                                        class:
                                                          "iconfont icon-remove",
                                                      },
                                                      null,
                                                      -1,
                                                    ),
                                                  ])),
                                              ]),
                                              _: 1,
                                            },
                                            8,
                                            ["onClick"],
                                          ),
                                        ]),
                                        _: 2,
                                      },
                                      1032,
                                      ["content"],
                                    ),
                                  ],
                                )
                              ),
                            ),
                            128,
                          )),
                        ]),
                      ]),
                      _: 1,
                    },
                  ))
                : h("", !0),
            ])
          );
        }
      );
    },
  });
export { T as _ };
