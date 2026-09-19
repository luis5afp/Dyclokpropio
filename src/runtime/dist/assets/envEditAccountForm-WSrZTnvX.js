import {
  d as e,
  v as t,
  R as l,
  aW as a,
  i as o,
  P as n,
  W as u,
  r as s,
  q as c,
  o as r,
  c as i,
  h as d,
  w as p,
  a as v,
  b as m,
  e as f,
  t as h,
  F as _,
  z as w,
  x as L,
  f as g,
  dw as V,
  X as k,
  be as y,
  ah as b,
  C as q,
  d7 as U,
  _ as x,
} from "./index-BUIbb6Pa.js";
import { _ as $ } from "./fixedUrlsFormItem.vue_vue_type_script_setup_true_lang-J-frhu2d.js";
import "./Tip.vue_vue_type_script_setup_true_lang-DBJcGLEl.js";
const E = { class: "m-r-8 tw-text-right" },
  A = { class: "account-container" },
  B = { class: "account-item-main" },
  I = { class: "account-platform-option" },
  S = ["src", "alt"],
  P = { class: "tw-flex tw-gap-x-1 tw-w-full" },
  N = { class: "tw-w-[110px]" },
  T = { class: "tw-flex-1" },
  H = x(
    e({
      __name: "envEditAccountForm",
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
      },
      emits: ["checkStep"],
      setup(e, { expose: x, emit: H }) {
        const { t: R } = t.useI18n(),
          { listingLinkAccounts: D } = l(a()),
          C = e;
        let W = o(C.modelValue);
        const F = o([]);
        function z(e) {
          if (e.url) {
            const t = e.url.match(/^(https?):\/\//);
            if (t) return t[1];
          }
          return e.protocol || "https";
        }
        function M(e) {
          return e.url ? e.url.replace(/^https?:\/\//, "") : "";
        }
        (n(() => {
          D.value.forEach((e) => {
            F.value.push({
              value: e.value,
              label:
                "other" === e.value ? R("env.env.req.customPlatform") : e.value,
              logo: e.logo,
            });
          });
        }),
          u(
            () => [C.isBatch, C.isSingle, C.isBulkImport],
            () => {
              var e;
              (C.isBatch
                ? (W.value = C.batchData)
                : C.isBulkImport
                  ? (W.value = C.importData)
                  : (W.value = C.modelValue),
                (null == (e = W.value) ? void 0 : e.accountList) &&
                  W.value.accountList.forEach((e) => {
                    if (e.url) {
                      const t = e.url.match(/^(https?):\/\//);
                      t
                        ? (e.protocol = t[1])
                        : ((e.protocol = "https"),
                          C.isEdit && (e.url = `https://${e.url}`));
                    } else e.protocol = "https";
                  }));
            },
            { immediate: !0 },
          ));
        let O = H;
        function j(e, t, l) {
          const a = e.field.split("url.")[1],
            o = W.value.accountList[a];
          o.platform && (o.platform !== V.OTHER || o.url)
            ? l()
            : l(new Error(R("env.env.req.accountPlatformLinkHolder")));
        }
        let Z = q(() =>
            W.value.accountList.reduce(
              (e, t, l) => ({ ...e, [`url.${l}`]: [{ validator: j }] }),
              {
                platform: [
                  {
                    required: !0,
                    message: R("env.env.req.accountListRule"),
                    trigger: "change",
                  },
                ],
              },
            ),
          ),
          X = {
            urls: [
              {
                validator: (e, t, l) => {
                  if (t && t.length) {
                    for (let e = 0; e < t.length; e++) {
                      if (!t[e])
                        return void l(new Error(R("env.env.req.urlsRule")));
                      if (
                        !t[e].startsWith("http") &&
                        !t[e].startsWith("chrome")
                      )
                        return void l(
                          new Error(R("env.env.req.urlsCorrectRule")),
                        );
                    }
                    l();
                  } else l();
                },
              },
            ],
          };
        const G = o(new Map());
        let J = (e, t) => {
          G.value.set(t, e);
        };
        const K = () => {
          var e;
          W.value &&
            (W.value.accountList || (W.value.accountList = []),
            (null == (e = W.value.accountList) ? void 0 : e.length) >= 50
              ? U(R("env.env.req.addAccountLimit", { N: 50 }))
              : (W.value.accountList.unshift({
                  platform: void 0,
                  url: void 0,
                  userName: void 0,
                  passwd: void 0,
                  remark: void 0,
                }),
                (W.value.accountList[0].protocol = "https")));
        };
        return (
          x({
            validateAccountList: function () {
              let e = [];
              return (
                G.value.forEach((t) => {
                  t && e.push(null == t ? void 0 : t.validate());
                }),
                Promise.all(e)
              );
            },
            addAccount: K,
            urlsRules: X,
          }),
          (t, l) => {
            const a = s("el-button"),
              o = s("el-col"),
              n = s("el-option"),
              u = s("el-select"),
              q = s("el-form-item"),
              U = s("el-row"),
              x = s("el-input"),
              H = s("Warning"),
              R = s("el-icon"),
              D = s("el-tooltip"),
              j = s("el-form"),
              X = c("prevent-label-click");
            return (
              r(),
              i("div", null, [
                C.isShowAccount
                  ? (r(),
                    d(
                      q,
                      { key: 0, prop: "accountList" },
                      {
                        label: p(() => [
                          v("span", E, h(t.$t("env.env.req.accountList")), 1),
                        ]),
                        default: p(() => [
                          v("div", A, [
                            m(
                              a,
                              { type: "primary", plain: "", onClick: K },
                              {
                                default: p(() => [
                                  l[1] ||
                                    (l[1] = v(
                                      "i",
                                      { class: "iconfont icon-plus" },
                                      null,
                                      -1,
                                    )),
                                  f(" " + h(t.$t("env.env.req.addAccount")), 1),
                                ]),
                                _: 1,
                              },
                            ),
                            (r(!0),
                            i(
                              _,
                              null,
                              w(
                                g(W).accountList,
                                (s, c) => (
                                  r(),
                                  i("div", { class: "account-item", key: c }, [
                                    L(
                                      (r(),
                                      d(
                                        j,
                                        {
                                          ref_for: !0,
                                          ref: (e) => g(J)(e, c),
                                          rules: g(Z),
                                          model: g(W).accountList[c],
                                          class: "tw-w-[100%]",
                                        },
                                        {
                                          default: p(() => [
                                            v("div", B, [
                                              m(
                                                U,
                                                { gutter: 5 },
                                                {
                                                  default: p(() => [
                                                    m(
                                                      o,
                                                      { span: 24 },
                                                      {
                                                        default: p(() => [
                                                          f(
                                                            h(
                                                              t.$t(
                                                                "env.env.req.accountPlatform",
                                                              ),
                                                            ),
                                                            1,
                                                          ),
                                                        ]),
                                                        _: 1,
                                                      },
                                                    ),
                                                    m(
                                                      o,
                                                      { span: 24 },
                                                      {
                                                        default: p(() => [
                                                          m(
                                                            q,
                                                            {
                                                              prop: "platform",
                                                            },
                                                            {
                                                              default: p(() => [
                                                                m(
                                                                  u,
                                                                  {
                                                                    modelValue:
                                                                      g(W)
                                                                        .accountList[
                                                                        c
                                                                      ]
                                                                        .platform,
                                                                    "onUpdate:modelValue":
                                                                      (e) =>
                                                                        (g(
                                                                          W,
                                                                        ).accountList[
                                                                          c
                                                                        ].platform =
                                                                          e),
                                                                    placeholder:
                                                                      t.$t(
                                                                        "env.env.req.accountPlatformHolder",
                                                                      ),
                                                                    filterable:
                                                                      "",
                                                                  },
                                                                  {
                                                                    default: p(
                                                                      () => [
                                                                        (r(!0),
                                                                        i(
                                                                          _,
                                                                          null,
                                                                          w(
                                                                            F.value,
                                                                            (
                                                                              e,
                                                                            ) => (
                                                                              r(),
                                                                              d(
                                                                                n,
                                                                                {
                                                                                  key: e.value,
                                                                                  label:
                                                                                    e.label,
                                                                                  value:
                                                                                    e.value,
                                                                                  onChange:
                                                                                    (
                                                                                      e,
                                                                                    ) =>
                                                                                      (g(
                                                                                        W,
                                                                                      ).accountList[
                                                                                        c
                                                                                      ].url =
                                                                                        void 0),
                                                                                },
                                                                                {
                                                                                  default:
                                                                                    p(
                                                                                      () => [
                                                                                        v(
                                                                                          "div",
                                                                                          I,
                                                                                          [
                                                                                            v(
                                                                                              "img",
                                                                                              {
                                                                                                src: e.logo,
                                                                                                alt: e.label,
                                                                                              },
                                                                                              null,
                                                                                              8,
                                                                                              S,
                                                                                            ),
                                                                                            v(
                                                                                              "span",
                                                                                              null,
                                                                                              h(
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
                                                                      ],
                                                                    ),
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
                                                            1024,
                                                          ),
                                                        ]),
                                                        _: 2,
                                                      },
                                                      1024,
                                                    ),
                                                  ]),
                                                  _: 2,
                                                },
                                                1024,
                                              ),
                                              g(W).accountList[c].platform ===
                                              g(V).OTHER
                                                ? (r(),
                                                  d(
                                                    U,
                                                    { key: 0, gutter: 5 },
                                                    {
                                                      default: p(() => [
                                                        m(
                                                          o,
                                                          { span: 24 },
                                                          {
                                                            default: p(() => [
                                                              f(
                                                                h(
                                                                  t.$t(
                                                                    "env.env.req.accountPlatformLink",
                                                                  ),
                                                                ),
                                                                1,
                                                              ),
                                                            ]),
                                                            _: 1,
                                                          },
                                                        ),
                                                        m(
                                                          o,
                                                          { span: 24 },
                                                          {
                                                            default: p(() => [
                                                              m(
                                                                q,
                                                                {
                                                                  prop:
                                                                    "url." + c,
                                                                },
                                                                {
                                                                  default: p(
                                                                    () => [
                                                                      v(
                                                                        "div",
                                                                        P,
                                                                        [
                                                                          v(
                                                                            "div",
                                                                            N,
                                                                            [
                                                                              m(
                                                                                u,
                                                                                {
                                                                                  "model-value":
                                                                                    z(
                                                                                      g(
                                                                                        W,
                                                                                      )
                                                                                        .accountList[
                                                                                        c
                                                                                      ],
                                                                                    ),
                                                                                  style:
                                                                                    {
                                                                                      width:
                                                                                        "110px",
                                                                                    },
                                                                                  onChange:
                                                                                    (
                                                                                      e,
                                                                                    ) =>
                                                                                      (function (
                                                                                        e,
                                                                                        t,
                                                                                      ) {
                                                                                        const l =
                                                                                            W
                                                                                              .value
                                                                                              .accountList[
                                                                                              t
                                                                                            ],
                                                                                          a =
                                                                                            M(
                                                                                              l,
                                                                                            );
                                                                                        ((l.protocol =
                                                                                          e),
                                                                                          (l.url =
                                                                                            a
                                                                                              ? e +
                                                                                                "://" +
                                                                                                a
                                                                                              : void 0));
                                                                                      })(
                                                                                        e,
                                                                                        c,
                                                                                      ),
                                                                                },
                                                                                {
                                                                                  default:
                                                                                    p(
                                                                                      () => [
                                                                                        m(
                                                                                          n,
                                                                                          {
                                                                                            label:
                                                                                              "http://",
                                                                                            value:
                                                                                              "http",
                                                                                          },
                                                                                        ),
                                                                                        m(
                                                                                          n,
                                                                                          {
                                                                                            label:
                                                                                              "https://",
                                                                                            value:
                                                                                              "https",
                                                                                          },
                                                                                        ),
                                                                                      ],
                                                                                    ),
                                                                                  _: 1,
                                                                                },
                                                                                8,
                                                                                [
                                                                                  "model-value",
                                                                                  "onChange",
                                                                                ],
                                                                              ),
                                                                            ],
                                                                          ),
                                                                          v(
                                                                            "div",
                                                                            T,
                                                                            [
                                                                              m(
                                                                                x,
                                                                                {
                                                                                  "model-value":
                                                                                    M(
                                                                                      g(
                                                                                        W,
                                                                                      )
                                                                                        .accountList[
                                                                                        c
                                                                                      ],
                                                                                    ),
                                                                                  placeholder:
                                                                                    t.$t(
                                                                                      "env.env.req.accountPlatformLinkHolder",
                                                                                    ),
                                                                                  clearable:
                                                                                    "",
                                                                                  onInput:
                                                                                    (
                                                                                      e,
                                                                                    ) =>
                                                                                      (function (
                                                                                        e,
                                                                                        t,
                                                                                      ) {
                                                                                        const l =
                                                                                          W
                                                                                            .value
                                                                                            .accountList[
                                                                                            t
                                                                                          ];
                                                                                        let a =
                                                                                            l.protocol ||
                                                                                            "https",
                                                                                          o =
                                                                                            e;
                                                                                        if (
                                                                                          o
                                                                                        ) {
                                                                                          const e =
                                                                                            o.match(
                                                                                              /^(https?):\/\//,
                                                                                            );
                                                                                          e &&
                                                                                            ((a =
                                                                                              e[1]),
                                                                                            (o =
                                                                                              o.substring(
                                                                                                e[0]
                                                                                                  .length,
                                                                                              )),
                                                                                            (l.protocol =
                                                                                              a));
                                                                                        }
                                                                                        l.url =
                                                                                          o
                                                                                            ? a +
                                                                                              "://" +
                                                                                              o
                                                                                            : void 0;
                                                                                      })(
                                                                                        e,
                                                                                        c,
                                                                                      ),
                                                                                  onPaste:
                                                                                    (
                                                                                      e,
                                                                                    ) =>
                                                                                      (function (
                                                                                        e,
                                                                                        t,
                                                                                      ) {
                                                                                        var l;
                                                                                        const a =
                                                                                            (null ==
                                                                                            (l =
                                                                                              e.clipboardData)
                                                                                              ? void 0
                                                                                              : l.getData(
                                                                                                  "text",
                                                                                                )) ||
                                                                                            "",
                                                                                          o =
                                                                                            a.match(
                                                                                              /^(https?):\/\//,
                                                                                            );
                                                                                        if (
                                                                                          o
                                                                                        ) {
                                                                                          e.preventDefault();
                                                                                          const l =
                                                                                              o[1],
                                                                                            n =
                                                                                              a.substring(
                                                                                                o[0]
                                                                                                  .length,
                                                                                              ),
                                                                                            u =
                                                                                              W
                                                                                                .value
                                                                                                .accountList[
                                                                                                t
                                                                                              ];
                                                                                          ((u.protocol =
                                                                                            l),
                                                                                            (u.url =
                                                                                              n
                                                                                                ? l +
                                                                                                  "://" +
                                                                                                  n
                                                                                                : void 0));
                                                                                        }
                                                                                      })(
                                                                                        e,
                                                                                        c,
                                                                                      ),
                                                                                  onBlur:
                                                                                    (
                                                                                      e,
                                                                                    ) =>
                                                                                      (function (
                                                                                        e,
                                                                                        t,
                                                                                      ) {
                                                                                        const l =
                                                                                          W
                                                                                            .value
                                                                                            .accountList[
                                                                                            t
                                                                                          ];
                                                                                        if (
                                                                                          !l.url
                                                                                        )
                                                                                          return;
                                                                                        const a =
                                                                                          l.url.match(
                                                                                            /^https?:\/\/(https?:\/\/.*)$/,
                                                                                          );
                                                                                        if (
                                                                                          a
                                                                                        ) {
                                                                                          const e =
                                                                                            a[1].match(
                                                                                              /^(https?):\/\//,
                                                                                            );
                                                                                          (e &&
                                                                                            (l.protocol =
                                                                                              e[1]),
                                                                                            (l.url =
                                                                                              a[1]));
                                                                                        }
                                                                                      })(
                                                                                        0,
                                                                                        c,
                                                                                      ),
                                                                                  class:
                                                                                    "tw-w-full",
                                                                                },
                                                                                null,
                                                                                8,
                                                                                [
                                                                                  "model-value",
                                                                                  "placeholder",
                                                                                  "onInput",
                                                                                  "onPaste",
                                                                                  "onBlur",
                                                                                ],
                                                                              ),
                                                                            ],
                                                                          ),
                                                                        ],
                                                                      ),
                                                                    ],
                                                                  ),
                                                                  _: 2,
                                                                },
                                                                1032,
                                                                ["prop"],
                                                              ),
                                                            ]),
                                                            _: 2,
                                                          },
                                                          1024,
                                                        ),
                                                      ]),
                                                      _: 2,
                                                    },
                                                    1024,
                                                  ))
                                                : k("", !0),
                                              e.isSingle
                                                ? (r(),
                                                  i(
                                                    _,
                                                    { key: 1 },
                                                    [
                                                      m(
                                                        U,
                                                        { gutter: 5 },
                                                        {
                                                          default: p(() => [
                                                            m(
                                                              o,
                                                              { span: 24 },
                                                              {
                                                                default: p(
                                                                  () => [
                                                                    f(
                                                                      h(
                                                                        t.$t(
                                                                          "env.env.req.accountUserName",
                                                                        ),
                                                                      ),
                                                                      1,
                                                                    ),
                                                                  ],
                                                                ),
                                                                _: 1,
                                                              },
                                                            ),
                                                            m(
                                                              o,
                                                              { span: 24 },
                                                              {
                                                                default: p(
                                                                  () => [
                                                                    m(
                                                                      q,
                                                                      {
                                                                        prop: "userName",
                                                                      },
                                                                      {
                                                                        default:
                                                                          p(
                                                                            () => [
                                                                              m(
                                                                                x,
                                                                                {
                                                                                  modelValue:
                                                                                    g(
                                                                                      W,
                                                                                    )
                                                                                      .accountList[
                                                                                      c
                                                                                    ]
                                                                                      .userName,
                                                                                  "onUpdate:modelValue":
                                                                                    (
                                                                                      e,
                                                                                    ) =>
                                                                                      (g(
                                                                                        W,
                                                                                      ).accountList[
                                                                                        c
                                                                                      ].userName =
                                                                                        e),
                                                                                  placeholder:
                                                                                    t.$t(
                                                                                      "env.env.req.accountUserNameHolder",
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
                                                                      1024,
                                                                    ),
                                                                  ],
                                                                ),
                                                                _: 2,
                                                              },
                                                              1024,
                                                            ),
                                                          ]),
                                                          _: 2,
                                                        },
                                                        1024,
                                                      ),
                                                      m(
                                                        U,
                                                        { gutter: 5 },
                                                        {
                                                          default: p(() => [
                                                            m(
                                                              o,
                                                              { span: 24 },
                                                              {
                                                                default: p(
                                                                  () => [
                                                                    f(
                                                                      h(
                                                                        t.$t(
                                                                          "env.env.req.accountPasswd",
                                                                        ),
                                                                      ),
                                                                      1,
                                                                    ),
                                                                  ],
                                                                ),
                                                                _: 1,
                                                              },
                                                            ),
                                                            m(
                                                              o,
                                                              { span: 24 },
                                                              {
                                                                default: p(
                                                                  () => [
                                                                    m(
                                                                      q,
                                                                      null,
                                                                      {
                                                                        default:
                                                                          p(
                                                                            () => [
                                                                              C.isShare
                                                                                ? (r(),
                                                                                  d(
                                                                                    x,
                                                                                    {
                                                                                      key: 1,
                                                                                      type: "password",
                                                                                      modelValue:
                                                                                        g(
                                                                                          W,
                                                                                        )
                                                                                          .accountList[
                                                                                          c
                                                                                        ]
                                                                                          .passwd,
                                                                                      "onUpdate:modelValue":
                                                                                        (
                                                                                          e,
                                                                                        ) =>
                                                                                          (g(
                                                                                            W,
                                                                                          ).accountList[
                                                                                            c
                                                                                          ].passwd =
                                                                                            e),
                                                                                      placeholder:
                                                                                        t.$t(
                                                                                          "env.env.req.accountPasswdHolder",
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
                                                                                  ))
                                                                                : (r(),
                                                                                  d(
                                                                                    x,
                                                                                    {
                                                                                      key: 0,
                                                                                      type: "password",
                                                                                      "show-password":
                                                                                        !e.isEdit ||
                                                                                        g(
                                                                                          y,
                                                                                        )(
                                                                                          g(
                                                                                            b,
                                                                                          )
                                                                                            .VIEW_ENVIRONMENT_PASSWD,
                                                                                        ),
                                                                                      modelValue:
                                                                                        g(
                                                                                          W,
                                                                                        )
                                                                                          .accountList[
                                                                                          c
                                                                                        ]
                                                                                          .passwd,
                                                                                      "onUpdate:modelValue":
                                                                                        (
                                                                                          e,
                                                                                        ) =>
                                                                                          (g(
                                                                                            W,
                                                                                          ).accountList[
                                                                                            c
                                                                                          ].passwd =
                                                                                            e),
                                                                                      placeholder:
                                                                                        t.$t(
                                                                                          "env.env.req.accountPasswdHolder",
                                                                                        ),
                                                                                      clearable:
                                                                                        "",
                                                                                      maxlength: 100,
                                                                                    },
                                                                                    null,
                                                                                    8,
                                                                                    [
                                                                                      "show-password",
                                                                                      "modelValue",
                                                                                      "onUpdate:modelValue",
                                                                                      "placeholder",
                                                                                    ],
                                                                                  )),
                                                                            ],
                                                                          ),
                                                                        _: 2,
                                                                      },
                                                                      1024,
                                                                    ),
                                                                  ],
                                                                ),
                                                                _: 2,
                                                              },
                                                              1024,
                                                            ),
                                                          ]),
                                                          _: 2,
                                                        },
                                                        1024,
                                                      ),
                                                      m(
                                                        U,
                                                        { gutter: 5 },
                                                        {
                                                          default: p(() => [
                                                            m(
                                                              o,
                                                              { span: 24 },
                                                              {
                                                                default: p(
                                                                  () => [
                                                                    f(
                                                                      h(
                                                                        t.$t(
                                                                          "env.env.req.accountTwoFA",
                                                                        ),
                                                                      ),
                                                                      1,
                                                                    ),
                                                                  ],
                                                                ),
                                                                _: 1,
                                                              },
                                                            ),
                                                            m(
                                                              o,
                                                              { span: 24 },
                                                              {
                                                                default: p(
                                                                  () => [
                                                                    m(
                                                                      q,
                                                                      null,
                                                                      {
                                                                        default:
                                                                          p(
                                                                            () => [
                                                                              C.isShare
                                                                                ? (r(),
                                                                                  d(
                                                                                    x,
                                                                                    {
                                                                                      key: 1,
                                                                                      type: "password",
                                                                                      modelValue:
                                                                                        g(
                                                                                          W,
                                                                                        )
                                                                                          .accountList[
                                                                                          c
                                                                                        ]
                                                                                          .secret,
                                                                                      "onUpdate:modelValue":
                                                                                        (
                                                                                          e,
                                                                                        ) =>
                                                                                          (g(
                                                                                            W,
                                                                                          ).accountList[
                                                                                            c
                                                                                          ].secret =
                                                                                            e),
                                                                                      modelModifiers:
                                                                                        {
                                                                                          trim: !0,
                                                                                        },
                                                                                      placeholder:
                                                                                        t.$t(
                                                                                          "env.env.req.accountTwoFAHolder",
                                                                                        ),
                                                                                      onInput:
                                                                                        (
                                                                                          e,
                                                                                        ) =>
                                                                                          (g(
                                                                                            W,
                                                                                          ).accountList[
                                                                                            c
                                                                                          ].secret =
                                                                                            g(
                                                                                              W,
                                                                                            ).accountList[
                                                                                              c
                                                                                            ].secret.replace(
                                                                                              /[^a-zA-Z0-9]/g,
                                                                                              "",
                                                                                            )),
                                                                                    },
                                                                                    {
                                                                                      suffix:
                                                                                        p(
                                                                                          () => [
                                                                                            m(
                                                                                              D,
                                                                                              {
                                                                                                content:
                                                                                                  t.$t(
                                                                                                    "env.env.req.accountTwoFATip",
                                                                                                  ),
                                                                                                placement:
                                                                                                  "bottom",
                                                                                                "popper-class":
                                                                                                  "tw-w-[200px]",
                                                                                              },
                                                                                              {
                                                                                                default:
                                                                                                  p(
                                                                                                    () => [
                                                                                                      m(
                                                                                                        R,
                                                                                                        {
                                                                                                          size: "16",
                                                                                                          class:
                                                                                                            "tw-cursor-pointer",
                                                                                                        },
                                                                                                        {
                                                                                                          default:
                                                                                                            p(
                                                                                                              () => [
                                                                                                                m(
                                                                                                                  H,
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
                                                                                : (r(),
                                                                                  d(
                                                                                    x,
                                                                                    {
                                                                                      key: 0,
                                                                                      type: "password",
                                                                                      "show-password":
                                                                                        !e.isEdit ||
                                                                                        g(
                                                                                          y,
                                                                                        )(
                                                                                          g(
                                                                                            b,
                                                                                          )
                                                                                            .VIEW_ENVIRONMENT_PASSWD,
                                                                                        ),
                                                                                      modelValue:
                                                                                        g(
                                                                                          W,
                                                                                        )
                                                                                          .accountList[
                                                                                          c
                                                                                        ]
                                                                                          .secret,
                                                                                      "onUpdate:modelValue":
                                                                                        (
                                                                                          e,
                                                                                        ) =>
                                                                                          (g(
                                                                                            W,
                                                                                          ).accountList[
                                                                                            c
                                                                                          ].secret =
                                                                                            e),
                                                                                      modelModifiers:
                                                                                        {
                                                                                          trim: !0,
                                                                                        },
                                                                                      placeholder:
                                                                                        t.$t(
                                                                                          "env.env.req.accountTwoFAHolder",
                                                                                        ),
                                                                                      maxlength: 100,
                                                                                      onInput:
                                                                                        (
                                                                                          e,
                                                                                        ) =>
                                                                                          (g(
                                                                                            W,
                                                                                          ).accountList[
                                                                                            c
                                                                                          ].secret =
                                                                                            g(
                                                                                              W,
                                                                                            ).accountList[
                                                                                              c
                                                                                            ].secret.replace(
                                                                                              /[^a-zA-Z0-9]/g,
                                                                                              "",
                                                                                            )),
                                                                                    },
                                                                                    {
                                                                                      suffix:
                                                                                        p(
                                                                                          () => [
                                                                                            m(
                                                                                              D,
                                                                                              {
                                                                                                content:
                                                                                                  t.$t(
                                                                                                    "env.env.req.accountTwoFATip",
                                                                                                  ),
                                                                                                placement:
                                                                                                  "bottom",
                                                                                                "popper-class":
                                                                                                  "tw-w-[200px]",
                                                                                              },
                                                                                              {
                                                                                                default:
                                                                                                  p(
                                                                                                    () => [
                                                                                                      m(
                                                                                                        R,
                                                                                                        {
                                                                                                          size: "16",
                                                                                                          class:
                                                                                                            "tw-cursor-pointer",
                                                                                                        },
                                                                                                        {
                                                                                                          default:
                                                                                                            p(
                                                                                                              () => [
                                                                                                                m(
                                                                                                                  H,
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
                                                                                      "show-password",
                                                                                      "modelValue",
                                                                                      "onUpdate:modelValue",
                                                                                      "placeholder",
                                                                                      "onInput",
                                                                                    ],
                                                                                  )),
                                                                            ],
                                                                          ),
                                                                        _: 2,
                                                                      },
                                                                      1024,
                                                                    ),
                                                                  ],
                                                                ),
                                                                _: 2,
                                                              },
                                                              1024,
                                                            ),
                                                          ]),
                                                          _: 2,
                                                        },
                                                        1024,
                                                      ),
                                                      m(
                                                        U,
                                                        { gutter: 5 },
                                                        {
                                                          default: p(() => [
                                                            m(
                                                              o,
                                                              { span: 24 },
                                                              {
                                                                default: p(
                                                                  () => [
                                                                    f(
                                                                      h(
                                                                        t.$t(
                                                                          "env.env.req.accountRemark",
                                                                        ),
                                                                      ),
                                                                      1,
                                                                    ),
                                                                  ],
                                                                ),
                                                                _: 1,
                                                              },
                                                            ),
                                                            m(
                                                              o,
                                                              { span: 24 },
                                                              {
                                                                default: p(
                                                                  () => [
                                                                    m(
                                                                      q,
                                                                      null,
                                                                      {
                                                                        default:
                                                                          p(
                                                                            () => [
                                                                              m(
                                                                                x,
                                                                                {
                                                                                  modelValue:
                                                                                    g(
                                                                                      W,
                                                                                    )
                                                                                      .accountList[
                                                                                      c
                                                                                    ]
                                                                                      .remark,
                                                                                  "onUpdate:modelValue":
                                                                                    (
                                                                                      e,
                                                                                    ) =>
                                                                                      (g(
                                                                                        W,
                                                                                      ).accountList[
                                                                                        c
                                                                                      ].remark =
                                                                                        e),
                                                                                  placeholder:
                                                                                    t.$t(
                                                                                      "env.env.req.accountRemarkHolder",
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
                                                                      1024,
                                                                    ),
                                                                  ],
                                                                ),
                                                                _: 2,
                                                              },
                                                              1024,
                                                            ),
                                                          ]),
                                                          _: 2,
                                                        },
                                                        1024,
                                                      ),
                                                    ],
                                                    64,
                                                  ))
                                                : k("", !0),
                                            ]),
                                          ]),
                                          _: 2,
                                        },
                                        1032,
                                        ["rules", "model"],
                                      )),
                                      [[X]],
                                    ),
                                    m(
                                      a,
                                      {
                                        class: "account-item-remove",
                                        link: "",
                                        type: "info",
                                        onClick: (e) =>
                                          ((e) => {
                                            W.value &&
                                              (W.value.accountList ||
                                                (W.value.accountList = []),
                                              W.value.accountList.length <= e ||
                                                (G.value.delete(e),
                                                W.value.accountList.splice(
                                                  e,
                                                  1,
                                                ),
                                                O("checkStep")));
                                          })(c),
                                      },
                                      {
                                        default: p(() => [
                                          ...(l[2] ||
                                            (l[2] = [
                                              v(
                                                "i",
                                                {
                                                  class: "iconfont icon-remove",
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
                                  ])
                                ),
                              ),
                              128,
                            )),
                          ]),
                        ]),
                        _: 1,
                      },
                    ))
                  : k("", !0),
                !C.isUpdate && C.isShowUrl
                  ? (r(),
                    d(
                      $,
                      {
                        key: 1,
                        modelValue: g(W).fixedUrls,
                        "onUpdate:modelValue":
                          l[0] || (l[0] = (e) => (g(W).fixedUrls = e)),
                      },
                      null,
                      8,
                      ["modelValue"],
                    ))
                  : k("", !0),
              ])
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-c51a2423"]],
  );
export { H as default };
