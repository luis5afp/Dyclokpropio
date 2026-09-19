import {
  d as e,
  v as a,
  dw as l,
  i as t,
  f2 as s,
  r as c,
  q as o,
  o as r,
  c as n,
  F as i,
  b as u,
  w as d,
  a as v,
  x as p,
  h as m,
  f,
  t as h,
  dS as b,
  e as w,
  X as O,
  at as y,
  a3 as _,
  f3 as g,
  f4 as C,
  D as L,
  _ as S,
} from "./index-BUIbb6Pa.js";
import x from "./envSerialNums-BjlyggGT.js";
import { E as $, c as k } from "./EnvClearCacheResultDialog-q9G9rHnN.js";
const I = { class: "form-container" },
  T = { class: "radios-wrapper" },
  A = { style: { color: "var(--text-color-base)", "max-width": "545px" } },
  E = { style: { color: "var(--text-color-base)", "max-width": "545px" } },
  M = { class: "custom-clear" },
  N = { class: "m-t-12 tw-flex tw-items-center", style: { display: "flex" } },
  D = { class: "tw-leading-[1.2]" },
  V = { class: "tw-w-full tw-flex" },
  B = S(
    e({
      __name: "envClearCacheDialog",
      props: { isOtherMemberOpenEnv: { type: Boolean } },
      emits: ["submit"],
      setup(e, { expose: S, emit: B }) {
        const F = B,
          { t: P } = a.useI18n(),
          U = { isView: !1, rows: [], ids: [], serialNums: [] },
          R = {
            clearType: l.LOCAL,
            clearLocalOption: [],
            clearServerOption: [],
          },
          j = k(),
          q = t(!1),
          H = t(!1),
          G = t(s(U)),
          J = t(s(R)),
          X = t(s(j)),
          z = t(),
          K = t(),
          Q = y({ clearType: [{ required: !0, message: "" }] }),
          W = t(!1),
          Y = () => {
            z.value.validate(async (e) => {
              var a;
              if (e)
                try {
                  H.value = !0;
                  const {
                    clearType: e,
                    clearLocalOption: t,
                    clearServerOption: s,
                  } = J.value;
                  if (e === l.LOCAL)
                    await Z(b.Cookie + b.History + b.Media + b.AccountPwd);
                  else if (e === l.ALL)
                    (await Z(b.Cookie + b.History + b.Media + b.AccountPwd),
                      await ee(b.Cookie + b.LocalStorage + b.IndexedDB));
                  else {
                    const e = t.length,
                      a = s.length;
                    if (e + a === 0)
                      return _({
                        message: P("env.cache.clearCacheRule2"),
                        type: "warning",
                      });
                    if (e) {
                      const e = t.reduce((e, a) => e + a, 0);
                      await Z(e);
                    }
                    if (a) {
                      const e = s.reduce((e, a) => e + a, 0);
                      await ee(e);
                    }
                  }
                  ((q.value = !1),
                    W.value && F("submit"),
                    null == (a = K.value) ||
                      a.acceptParams({ result: X.value, closeCallback: le }));
                } finally {
                  H.value = !1;
                }
            });
          },
          Z = async (e) => {
            const a = G.value.rows.map(async (a) => {
              const l = await window.ipcRenderer.invoke(g, {
                clearTypes: e,
                id: a.id,
              });
              "success" === (null == l ? void 0 : l.msg) ||
              "skip" === (null == l ? void 0 : l.msg)
                ? X.value.localSuccess.push(a.serialNum)
                : X.value.localFail.push(a.serialNum);
            });
            await Promise.all(a);
          },
          ee = async (e) => {
            try {
              const a = G.value.ids,
                l = G.value.rows,
                t = l[0].orgId,
                s = [],
                c = [],
                o = [{ promise: C({ ids: a, type: e }), failIds: a }];
              for (const p of l) {
                const a = JSON.parse(p.ossDataConfig ?? "{}"),
                  { indexed_db: l, local_storage: t } = a;
                (e & b.LocalStorage &&
                  (null == t ? void 0 : t.enable) &&
                  c.push(p.id),
                  e & b.IndexedDB &&
                    (null == l ? void 0 : l.enable) &&
                    s.push(p.id));
              }
              (e & b.LocalStorage &&
                c.length &&
                o.push({
                  promise: L.api.clearEnvServerCacheForLocalStorage(c, t),
                  failIds: c,
                }),
                e & b.IndexedDB &&
                  s.length &&
                  o.push({
                    promise: L.api.clearEnvServerCacheForIndexedDB(s, t),
                    failIds: s,
                  }),
                console.log(
                  "ids",
                  a,
                  "ossClearIdsForIndexedDB",
                  s,
                  "ossClearIdsForLocalStorage",
                  c,
                ));
              const r = await Promise.allSettled(o.map((e) => e.promise));
              console.log("clearServerCache res: ", r);
              const n = new Set(X.value.serverSuccess),
                i = new Set(X.value.serverFail),
                u = (e) => {
                  const a = new Set(e);
                  return l.reduce((e, l) => {
                    if (!a.has(l.id)) return e;
                    const t = Number(l.serialNum);
                    return (Number.isFinite(t) && e.push(t), e);
                  }, []);
                },
                d = (e = []) => {
                  e.forEach((e) => {
                    i.has(e) || n.add(e);
                  });
                },
                v = (e = []) => {
                  e.forEach((e) => {
                    (n.delete(e), i.add(e));
                  });
                };
              (r.forEach((e, a) => {
                if (0 === a && "fulfilled" === e.status) {
                  const l = e.value;
                  return l
                    ? (d(l.successSerialNumIds), void v(l.failSerialNumIds))
                    : void v(u(o[a].failIds));
                }
                "rejected" === e.status && v(u(o[a].failIds));
              }),
                (X.value.serverSuccess = Array.from(n)),
                (X.value.serverFail = Array.from(i)));
            } catch (a) {}
          },
          ae = () => {
            ((q.value = !1), le());
          },
          le = () => {
            ((G.value = s(U)), (X.value = k()), (J.value = s(R)));
          };
        return (
          S({
            acceptParams: (e, a = !1) => {
              ((q.value = !0), (G.value.rows = e), (W.value = a));
              let l = [],
                t = [];
              (e.forEach((e) => {
                (l.push(e.serialNum), t.push(e.id));
              }),
                (G.value.serialNums = l),
                (G.value.ids = t));
            },
          }),
          (a, t) => {
            const s = c("el-form-item"),
              y = c("el-tooltip"),
              _ = c("el-radio"),
              g = c("el-radio-group"),
              C = c("el-checkbox"),
              L = c("el-checkbox-group"),
              S = c("el-form"),
              k = c("el-button"),
              B = c("el-dialog"),
              F = o("prevent-label-click");
            return (
              r(),
              n(
                i,
                null,
                [
                  u(
                    B,
                    {
                      modelValue: q.value,
                      "onUpdate:modelValue":
                        t[3] || (t[3] = (e) => (q.value = e)),
                      "align-center": !0,
                      "close-on-click-modal": !1,
                      "close-on-press-escape": !1,
                      title: a.$t("base.clearCache"),
                      class: "clear-cache-dialog-wrapper",
                      width: "600px",
                    },
                    {
                      footer: d(() => [
                        v("div", V, [
                          u(
                            k,
                            { class: "tw-flex-1", type: "info", onClick: ae },
                            {
                              default: d(() => [w(h(a.$t("base.cancel")), 1)]),
                              _: 1,
                            },
                          ),
                          u(
                            k,
                            {
                              class: "tw-flex-1",
                              type: "primary",
                              onClick: Y,
                              loading: H.value,
                            },
                            {
                              default: d(() => [w(h(a.$t("base.confirm")), 1)]),
                              _: 1,
                            },
                            8,
                            ["loading"],
                          ),
                        ]),
                      ]),
                      default: d(() => [
                        v("div", I, [
                          p(
                            (r(),
                            m(
                              S,
                              {
                                ref_key: "envClearCacheForm",
                                ref: z,
                                model: J.value,
                                rules: Q,
                                "label-position": "right",
                                "label-width": "auto",
                              },
                              {
                                default: d(() => [
                                  u(
                                    s,
                                    { label: a.$t("env.group.moveGroupTitle") },
                                    {
                                      default: d(() => [
                                        u(
                                          x,
                                          { serialNums: G.value.serialNums },
                                          null,
                                          8,
                                          ["serialNums"],
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["label"],
                                  ),
                                  u(
                                    s,
                                    { label: a.$t("env.cache.clearType") },
                                    {
                                      default: d(() => [
                                        u(
                                          g,
                                          {
                                            modelValue: J.value.clearType,
                                            "onUpdate:modelValue":
                                              t[0] ||
                                              (t[0] = (e) =>
                                                (J.value.clearType = e)),
                                            class: "clear-cache-type-radios",
                                            style: { flex: "1" },
                                          },
                                          {
                                            default: d(() => [
                                              v("div", T, [
                                                (r(),
                                                m(
                                                  _,
                                                  {
                                                    key: f(l).LOCAL,
                                                    value: f(l).LOCAL,
                                                    border: "",
                                                  },
                                                  {
                                                    default: d(() => [
                                                      v(
                                                        "span",
                                                        null,
                                                        h(
                                                          a.$t(
                                                            "env.cache.clearLocal",
                                                          ),
                                                        ),
                                                        1,
                                                      ),
                                                      u(
                                                        y,
                                                        { placement: "top" },
                                                        {
                                                          content: d(() => [
                                                            v("div", A, [
                                                              v(
                                                                "div",
                                                                null,
                                                                h(
                                                                  a.$t(
                                                                    "env.cache.clearLocalCacheTips1",
                                                                  ),
                                                                ),
                                                                1,
                                                              ),
                                                              v(
                                                                "div",
                                                                null,
                                                                h(
                                                                  a.$t(
                                                                    "env.cache.clearLocalCacheTips2",
                                                                  ),
                                                                ),
                                                                1,
                                                              ),
                                                            ]),
                                                          ]),
                                                          default: d(() => [
                                                            t[4] ||
                                                              (t[4] = v(
                                                                "span",
                                                                null,
                                                                [
                                                                  v("i", {
                                                                    class:
                                                                      "iconfont icon-tips",
                                                                  }),
                                                                ],
                                                                -1,
                                                              )),
                                                          ]),
                                                          _: 1,
                                                        },
                                                      ),
                                                    ]),
                                                    _: 1,
                                                  },
                                                  8,
                                                  ["value"],
                                                )),
                                                u(
                                                  y,
                                                  {
                                                    content: a.$t(
                                                      "env.cache.closeMemberEnvTip",
                                                    ),
                                                    placement: "top",
                                                    disabled:
                                                      !e.isOtherMemberOpenEnv,
                                                  },
                                                  {
                                                    default: d(() => [
                                                      (r(),
                                                      m(
                                                        _,
                                                        {
                                                          key: f(l).ALL,
                                                          value: f(l).ALL,
                                                          disabled:
                                                            e.isOtherMemberOpenEnv,
                                                          border: "",
                                                        },
                                                        {
                                                          default: d(() => [
                                                            v(
                                                              "span",
                                                              null,
                                                              h(
                                                                a.$t(
                                                                  "env.cache.clearAll",
                                                                ),
                                                              ),
                                                              1,
                                                            ),
                                                            u(
                                                              y,
                                                              {
                                                                placement:
                                                                  "top",
                                                                disabled:
                                                                  e.isOtherMemberOpenEnv,
                                                              },
                                                              {
                                                                content: d(
                                                                  () => [
                                                                    v(
                                                                      "div",
                                                                      E,
                                                                      [
                                                                        v(
                                                                          "div",
                                                                          null,
                                                                          h(
                                                                            a.$t(
                                                                              "env.cache.clearAllCacheTips1",
                                                                            ),
                                                                          ),
                                                                          1,
                                                                        ),
                                                                        v(
                                                                          "div",
                                                                          null,
                                                                          h(
                                                                            a.$t(
                                                                              "env.cache.clearAllCacheTips2",
                                                                            ),
                                                                          ),
                                                                          1,
                                                                        ),
                                                                      ],
                                                                    ),
                                                                  ],
                                                                ),
                                                                default: d(
                                                                  () => [
                                                                    t[5] ||
                                                                      (t[5] = v(
                                                                        "span",
                                                                        null,
                                                                        [
                                                                          v(
                                                                            "i",
                                                                            {
                                                                              class:
                                                                                "iconfont icon-tips",
                                                                            },
                                                                          ),
                                                                        ],
                                                                        -1,
                                                                      )),
                                                                  ],
                                                                ),
                                                                _: 1,
                                                              },
                                                              8,
                                                              ["disabled"],
                                                            ),
                                                          ]),
                                                          _: 1,
                                                        },
                                                        8,
                                                        ["value", "disabled"],
                                                      )),
                                                    ]),
                                                    _: 1,
                                                  },
                                                  8,
                                                  ["content", "disabled"],
                                                ),
                                                (r(),
                                                m(
                                                  _,
                                                  {
                                                    key: f(l).CUSTOM,
                                                    value: f(l).CUSTOM,
                                                    border: "",
                                                  },
                                                  {
                                                    default: d(() => [
                                                      v(
                                                        "span",
                                                        null,
                                                        h(
                                                          a.$t(
                                                            "env.cache.clearCustom",
                                                          ),
                                                        ),
                                                        1,
                                                      ),
                                                    ]),
                                                    _: 1,
                                                  },
                                                  8,
                                                  ["value"],
                                                )),
                                              ]),
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
                                  J.value.clearType === f(l).CUSTOM
                                    ? (r(),
                                      m(
                                        s,
                                        {
                                          key: 0,
                                          label: "-",
                                          class: "form-item-label-hidden",
                                        },
                                        {
                                          default: d(() => [
                                            v("div", M, [
                                              u(
                                                s,
                                                {
                                                  label: a.$t(
                                                    "env.cache.clearLocal2",
                                                  ),
                                                  "label-width": "120px",
                                                  prop: "clearLocalOption",
                                                  "label-position": "left",
                                                },
                                                {
                                                  default: d(() => [
                                                    u(
                                                      L,
                                                      {
                                                        modelValue:
                                                          J.value
                                                            .clearLocalOption,
                                                        "onUpdate:modelValue":
                                                          t[1] ||
                                                          (t[1] = (e) =>
                                                            (J.value.clearLocalOption =
                                                              e)),
                                                      },
                                                      {
                                                        default: d(() => [
                                                          u(
                                                            C,
                                                            {
                                                              value:
                                                                f(b).Cookie,
                                                              name: "clearLocalOption",
                                                            },
                                                            {
                                                              default: d(() => [
                                                                ...(t[6] ||
                                                                  (t[6] = [
                                                                    w(
                                                                      " Cookie",
                                                                      -1,
                                                                    ),
                                                                  ])),
                                                              ]),
                                                              _: 1,
                                                            },
                                                            8,
                                                            ["value"],
                                                          ),
                                                          u(
                                                            C,
                                                            {
                                                              value:
                                                                f(b)
                                                                  .LocalStorage,
                                                              name: "clearLocalOption",
                                                            },
                                                            {
                                                              default: d(() => [
                                                                ...(t[7] ||
                                                                  (t[7] = [
                                                                    w(
                                                                      " Local Storage",
                                                                      -1,
                                                                    ),
                                                                  ])),
                                                              ]),
                                                              _: 1,
                                                            },
                                                            8,
                                                            ["value"],
                                                          ),
                                                          u(
                                                            C,
                                                            {
                                                              value:
                                                                f(b).IndexedDB,
                                                              name: "clearLocalOption",
                                                            },
                                                            {
                                                              default: d(() => [
                                                                ...(t[8] ||
                                                                  (t[8] = [
                                                                    w(
                                                                      " IndexedDB",
                                                                      -1,
                                                                    ),
                                                                  ])),
                                                              ]),
                                                              _: 1,
                                                            },
                                                            8,
                                                            ["value"],
                                                          ),
                                                          u(
                                                            C,
                                                            {
                                                              value:
                                                                f(b).AccountPwd,
                                                              name: "clearLocalOption",
                                                            },
                                                            {
                                                              default: d(() => [
                                                                w(
                                                                  h(
                                                                    a.$t(
                                                                      "env.env.req.accountAndPwd",
                                                                    ),
                                                                  ),
                                                                  1,
                                                                ),
                                                              ]),
                                                              _: 1,
                                                            },
                                                            8,
                                                            ["value"],
                                                          ),
                                                          u(
                                                            C,
                                                            {
                                                              value:
                                                                f(b).History,
                                                              name: "clearLocalOption",
                                                            },
                                                            {
                                                              default: d(() => [
                                                                w(
                                                                  h(
                                                                    a.$t(
                                                                      "env.cache.history",
                                                                    ),
                                                                  ),
                                                                  1,
                                                                ),
                                                              ]),
                                                              _: 1,
                                                            },
                                                            8,
                                                            ["value"],
                                                          ),
                                                          u(
                                                            C,
                                                            {
                                                              value: f(b).Media,
                                                              name: "clearLocalOption",
                                                            },
                                                            {
                                                              default: d(() => [
                                                                w(
                                                                  h(
                                                                    a.$t(
                                                                      "env.cache.media",
                                                                    ),
                                                                  ),
                                                                  1,
                                                                ),
                                                              ]),
                                                              _: 1,
                                                            },
                                                            8,
                                                            ["value"],
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
                                              u(
                                                s,
                                                {
                                                  label: a.$t(
                                                    "env.cache.clearServer",
                                                  ),
                                                  prop: "clearServerOption",
                                                  "label-position": "left",
                                                  "label-width": "120px",
                                                },
                                                {
                                                  default: d(() => [
                                                    u(
                                                      y,
                                                      {
                                                        content: a.$t(
                                                          "env.cache.closeMemberEnvTip",
                                                        ),
                                                        placement: "top",
                                                        disabled:
                                                          !e.isOtherMemberOpenEnv,
                                                      },
                                                      {
                                                        default: d(() => [
                                                          u(
                                                            L,
                                                            {
                                                              modelValue:
                                                                J.value
                                                                  .clearServerOption,
                                                              "onUpdate:modelValue":
                                                                t[2] ||
                                                                (t[2] = (e) =>
                                                                  (J.value.clearServerOption =
                                                                    e)),
                                                              disabled:
                                                                e.isOtherMemberOpenEnv,
                                                            },
                                                            {
                                                              default: d(() => [
                                                                u(
                                                                  C,
                                                                  {
                                                                    value:
                                                                      f(b)
                                                                        .Cookie,
                                                                    name: "clearServerOption",
                                                                  },
                                                                  {
                                                                    default: d(
                                                                      () => [
                                                                        ...(t[9] ||
                                                                          (t[9] =
                                                                            [
                                                                              w(
                                                                                " Cookie",
                                                                                -1,
                                                                              ),
                                                                            ])),
                                                                      ],
                                                                    ),
                                                                    _: 1,
                                                                  },
                                                                  8,
                                                                  ["value"],
                                                                ),
                                                                u(
                                                                  C,
                                                                  {
                                                                    value:
                                                                      f(b)
                                                                        .LocalStorage,
                                                                    name: "clearServerOption",
                                                                  },
                                                                  {
                                                                    default: d(
                                                                      () => [
                                                                        t[11] ||
                                                                          (t[11] =
                                                                            v(
                                                                              "span",
                                                                              null,
                                                                              "Local Storage",
                                                                              -1,
                                                                            )),
                                                                        u(
                                                                          y,
                                                                          {
                                                                            content:
                                                                              a.$t(
                                                                                "env.cache.clearServerCacheTips",
                                                                              ),
                                                                            disabled:
                                                                              e.isOtherMemberOpenEnv,
                                                                            placement:
                                                                              "top",
                                                                          },
                                                                          {
                                                                            default:
                                                                              d(
                                                                                () => [
                                                                                  ...(t[10] ||
                                                                                    (t[10] =
                                                                                      [
                                                                                        v(
                                                                                          "span",
                                                                                          {
                                                                                            style:
                                                                                              {
                                                                                                "margin-left":
                                                                                                  "4px",
                                                                                              },
                                                                                          },
                                                                                          [
                                                                                            v(
                                                                                              "i",
                                                                                              {
                                                                                                class:
                                                                                                  "iconfont icon-tips",
                                                                                              },
                                                                                            ),
                                                                                          ],
                                                                                          -1,
                                                                                        ),
                                                                                      ])),
                                                                                ],
                                                                              ),
                                                                            _: 1,
                                                                          },
                                                                          8,
                                                                          [
                                                                            "content",
                                                                            "disabled",
                                                                          ],
                                                                        ),
                                                                      ],
                                                                    ),
                                                                    _: 1,
                                                                  },
                                                                  8,
                                                                  ["value"],
                                                                ),
                                                                u(
                                                                  C,
                                                                  {
                                                                    value:
                                                                      f(b)
                                                                        .IndexedDB,
                                                                    name: "clearServerOption",
                                                                  },
                                                                  {
                                                                    default: d(
                                                                      () => [
                                                                        t[13] ||
                                                                          (t[13] =
                                                                            v(
                                                                              "span",
                                                                              null,
                                                                              "IndexedDB",
                                                                              -1,
                                                                            )),
                                                                        u(
                                                                          y,
                                                                          {
                                                                            content:
                                                                              a.$t(
                                                                                "env.cache.clearServerCacheTips",
                                                                              ),
                                                                            disabled:
                                                                              e.isOtherMemberOpenEnv,
                                                                            placement:
                                                                              "top",
                                                                          },
                                                                          {
                                                                            default:
                                                                              d(
                                                                                () => [
                                                                                  ...(t[12] ||
                                                                                    (t[12] =
                                                                                      [
                                                                                        v(
                                                                                          "span",
                                                                                          {
                                                                                            style:
                                                                                              {
                                                                                                "margin-left":
                                                                                                  "4px",
                                                                                              },
                                                                                          },
                                                                                          [
                                                                                            v(
                                                                                              "i",
                                                                                              {
                                                                                                class:
                                                                                                  "iconfont icon-tips",
                                                                                              },
                                                                                            ),
                                                                                          ],
                                                                                          -1,
                                                                                        ),
                                                                                      ])),
                                                                                ],
                                                                              ),
                                                                            _: 1,
                                                                          },
                                                                          8,
                                                                          [
                                                                            "content",
                                                                            "disabled",
                                                                          ],
                                                                        ),
                                                                      ],
                                                                    ),
                                                                    _: 1,
                                                                  },
                                                                  8,
                                                                  ["value"],
                                                                ),
                                                                u(
                                                                  C,
                                                                  {
                                                                    value:
                                                                      f(b)
                                                                        .AccountPwd,
                                                                    name: "clearLocalOption",
                                                                  },
                                                                  {
                                                                    default: d(
                                                                      () => [
                                                                        w(
                                                                          h(
                                                                            a.$t(
                                                                              "env.env.req.accountAndPwd",
                                                                            ),
                                                                          ),
                                                                          1,
                                                                        ),
                                                                      ],
                                                                    ),
                                                                    _: 1,
                                                                  },
                                                                  8,
                                                                  ["value"],
                                                                ),
                                                              ]),
                                                              _: 1,
                                                            },
                                                            8,
                                                            [
                                                              "modelValue",
                                                              "disabled",
                                                            ],
                                                          ),
                                                        ]),
                                                        _: 1,
                                                      },
                                                      8,
                                                      ["content", "disabled"],
                                                    ),
                                                  ]),
                                                  _: 1,
                                                },
                                                8,
                                                ["label"],
                                              ),
                                            ]),
                                          ]),
                                          _: 1,
                                        },
                                      ))
                                    : O("", !0),
                                  u(
                                    s,
                                    {
                                      label: "-",
                                      class: "form-item-label-hidden",
                                    },
                                    {
                                      default: d(() => [
                                        v("div", N, [
                                          t[14] ||
                                            (t[14] = v(
                                              "span",
                                              {
                                                class:
                                                  "icon-warn-wrap m-r-8 m-t-2",
                                              },
                                              [
                                                v("i", {
                                                  class:
                                                    "iconfont icon-warning",
                                                }),
                                              ],
                                              -1,
                                            )),
                                          v(
                                            "span",
                                            D,
                                            h(a.$t("env.cache.clearTips")),
                                            1,
                                          ),
                                        ]),
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
                            [[F]],
                          ),
                        ]),
                      ]),
                      _: 1,
                    },
                    8,
                    ["modelValue", "title"],
                  ),
                  u(
                    $,
                    { ref_key: "clearCacheResultDialogRef", ref: K },
                    null,
                    512,
                  ),
                ],
                64,
              )
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-e2286518"]],
  );
export { B as default };
