import {
  d as e,
  v as l,
  G as a,
  at as r,
  i as o,
  r as t,
  q as u,
  o as i,
  c as s,
  F as d,
  b as n,
  w as p,
  x as v,
  h as m,
  a as c,
  t as b,
  f as g,
  z as w,
  e as f,
  X as h,
  eU as I,
  C as y,
  bQ as _,
  h$ as G,
  a3 as x,
  L as k,
  ig as q,
  ih as V,
  ib as E,
  ao as M,
  ic as R,
  id as $,
  _ as A,
} from "./index-BUIbb6Pa.js";
import { g as C } from "./system-DtbAsiCM.js";
import j from "./createApiResDialog-BltSan3K.js";
import "./createApiParamsComp.vue_vue_type_style_index_0_lang-DR8Q4JPa.js";
import "./index-rtKG2tmD.js";
import "./timeZone-D3UW65MQ.js";
import "./TableFieldDialog-BI1BUo05.js";
import "./sortable.esm-DneA_jWz.js";
import "./LazyRow.vue_vue_type_script_setup_true_lang-C9dK0oMf.js";
const T = { class: "tw-flex tw-justify-center tw-mb-[15px]" },
  U = {
    class: "tw-text-[var(--text-color-light1)] tw-leading-[1.1] tw-mt-[5px]",
  },
  D = { key: 0, class: "flx-align-center" },
  H = { key: 1, class: "tw-truncate" },
  S = {
    key: 0,
    class: "tw-text-[var(--text-color-light1)] tw-leading-[1.1] tw-mt-[5px]",
  },
  F = {
    class: "tw-text-[var(--text-color-light1)] tw-leading-[1.1] tw-mt-[5px]",
  },
  z = { key: 0, class: "tw-text-[var(--text-color-light1)] tw-leading-[1.1]" },
  N = A(
    e({
      __name: "memberEditForApi",
      emits: ["submit"],
      setup(e, { expose: A, emit: N }) {
        const { t: J } = l.useI18n(),
          L = N,
          P = a(),
          O = r({
            roleId: [
              { required: !0, message: J("org.member.req.roleIdHolder") },
            ],
            authority: [
              { required: !0, message: J("org.member.req.authorityHolder") },
            ],
            envGroupIds: [
              { required: !0, message: J("org.member.req.envGroupIdsHint") },
            ],
          }),
          K = o(!1),
          Q = o({
            isView: !1,
            title: J("org.apiCreateMember.apiUrlCreate"),
            row: {},
          }),
          W = o([]),
          X = o(),
          Z = o([]),
          B = o([]),
          Y = o([]),
          ee = o(!1),
          le = o(!1),
          ae = o(void 0),
          re = o(),
          oe = o({ envGroupIds: y(() => te()) }),
          te = () => {
            if (!Q.value.row.authority) return !1;
            return [I.Manager, I.Member].includes(Q.value.row.authority);
          },
          ue = (e) => {
            if (0 === e.length) return void (Q.value.row.envGroupIds = e);
            "all" === e[e.length - 1]
              ? (Q.value.row.envGroupIds = ["all"])
              : e.includes("all")
                ? (Q.value.row.envGroupIds = e.filter((e) => "all" !== e))
                : (Q.value.row.envGroupIds = e);
          },
          ie = () => {
            X.value.validate(async (e) => {
              var l, a, r;
              if (e)
                if (
                  !te() ||
                  (Q.value.row.envGroupIds &&
                    (null == (l = Q.value.row.envGroupIds) ? void 0 : l.length))
                ) {
                  ee.value = !0;
                  try {
                    const e = JSON.parse(JSON.stringify(Q.value.row));
                    if (
                      ((
                        null == (a = e.envGroupIds) ? void 0 : a.includes("all")
                      )
                        ? ((e.envGroupIds = []), (e.allEnvGroup = !0))
                        : (e.allEnvGroup = !1),
                      Q.value.row.id)
                    )
                      await q(Q.value.row.id, e);
                    else {
                      const l = await V({
                        envGroupIds: e.envGroupIds,
                        roleId: e.roleId,
                        authority: e.authority,
                        apiRemark: e.apiRemark,
                      });
                      0 === l.code &&
                        (null == (r = re.value) || r.openDialog(l.data));
                    }
                    ((K.value = !1), L("submit"));
                  } catch (o) {
                  } finally {
                    ee.value = !1;
                  }
                } else k(J("org.member.req.envGroupIdsHint"));
              else x.warning(J("org.member.req.memberEditErrorTip"));
            });
          };
        return (
          A({
            acceptParams: (e) => {
              var l;
              ((le.value = !!e.row.id),
                (ae.value = void 0),
                (async () => {
                  const e = await C({ all: !0, detail: !1 }),
                    l = [];
                  (e.list.forEach((e) => {
                    e.code !== E.SuperAdmin &&
                      l.push({ value: e.id, label: e.name });
                  }),
                    (W.value = l));
                })(),
                (() => {
                  const e = P.userInfo.authority,
                    l = [];
                  (_($, ["SUPER_ADMIN"]).forEach((a) => {
                    e === I.SuperAdmin
                      ? l.push(a)
                      : e === I.Admin
                        ? [I.Manager, I.Member].includes(a.value) && l.push(a)
                        : e === I.Manager &&
                          [I.Member].includes(a.value) &&
                          l.push(a);
                  }),
                    (B.value = l));
                })(),
                null == (l = X.value) || l.resetFields(),
                le.value ||
                  P.userInfo.authority !== I.Manager ||
                  (e.row.managerId = P.userInfo.memberId),
                le.value && e.row.allEnvGroup && (e.row.envGroupIds = ["all"]),
                (Q.value = e),
                (async () => {
                  const e = await M({ all: !0, detail: !1 });
                  Z.value = e.list.map((e) => ({ value: e.id, label: e.name }));
                  let l = !0;
                  if (P.isManager) {
                    let e = await R(P.userInfo.memberId);
                    l =
                      le.value && !e.allEnvGroup
                        ? Q.value.row.allEnvGroup
                        : !!e.allEnvGroup;
                  }
                  l &&
                    Z.value.unshift({
                      value: "all",
                      label: J("org.member.req.allGroup"),
                    });
                })(),
                (K.value = !0));
            },
            openEditApi: async function () {
              var e;
              null == (e = re.value) ||
                e.openDialog({ prefix: "", token: "", isEditApi: !0 });
            },
          }),
          (Y.value = _(G)),
          (e, l) => {
            const a = t("Warning"),
              r = t("el-icon"),
              o = t("el-tooltip"),
              y = t("el-option"),
              _ = t("el-select"),
              G = t("el-form-item"),
              x = t("el-radio"),
              k = t("el-radio-group"),
              q = t("el-input"),
              V = t("el-form"),
              E = t("el-button"),
              M = t("el-dialog"),
              R = u("prevent-label-click");
            return (
              i(),
              s(
                d,
                null,
                [
                  n(
                    M,
                    {
                      modelValue: K.value,
                      "onUpdate:modelValue":
                        l[5] || (l[5] = (e) => (K.value = e)),
                      title: `${e.$t(Q.value.title)}`,
                      width: "550px",
                      "close-on-click-modal": !1,
                      "close-on-press-escape": !1,
                      "align-center": !0,
                      class: "org-dialog",
                    },
                    {
                      footer: p(() => [
                        n(
                          E,
                          {
                            type: "info",
                            onClick: l[4] || (l[4] = (e) => (K.value = !1)),
                          },
                          {
                            default: p(() => [f(b(e.$t("base.cancel")), 1)]),
                            _: 1,
                          },
                        ),
                        n(
                          E,
                          { type: "primary", onClick: ie, loading: ee.value },
                          {
                            default: p(() => [f(b(J("base.confirm")), 1)]),
                            _: 1,
                          },
                          8,
                          ["type", "loading"],
                        ),
                      ]),
                      default: p(() => [
                        v(
                          (i(),
                          m(
                            V,
                            {
                              ref_key: "ruleFormRef",
                              ref: X,
                              "label-width": "auto",
                              "label-position": "right",
                              rules: O,
                              disabled: Q.value.isView,
                              model: Q.value.row,
                              "hide-required-asterisk": Q.value.isView,
                            },
                            {
                              default: p(() => [
                                c("div", T, [
                                  c(
                                    "span",
                                    U,
                                    b(
                                      g(J)(
                                        "org.apiCreateMember.apiUrlCreateDesc",
                                      ),
                                    ),
                                    1,
                                  ),
                                ]),
                                oe.value.envGroupIds
                                  ? (i(),
                                    m(
                                      G,
                                      {
                                        key: 0,
                                        label: e.$t(
                                          "org.member.req.envGroupIds",
                                        ),
                                        prop: "envGroupIds",
                                      },
                                      {
                                        default: p(() => [
                                          n(
                                            _,
                                            {
                                              modelValue:
                                                Q.value.row.envGroupIds,
                                              "onUpdate:modelValue":
                                                l[0] ||
                                                (l[0] = (e) =>
                                                  (Q.value.row.envGroupIds =
                                                    e)),
                                              placeholder: e.$t(
                                                "org.member.req.envGroupIdsHolder",
                                              ),
                                              clearable: "",
                                              filterable: "",
                                              multiple: "",
                                              collapseTags: "",
                                              collapseTagsTooltip: "",
                                              "max-collapse-tags": 2,
                                              onChange: ue,
                                            },
                                            {
                                              default: p(() => [
                                                (i(!0),
                                                s(
                                                  d,
                                                  null,
                                                  w(
                                                    Z.value,
                                                    (l) => (
                                                      i(),
                                                      m(
                                                        y,
                                                        {
                                                          key: l.value,
                                                          label: l.label,
                                                          value: l.value,
                                                        },
                                                        {
                                                          default: p(() => [
                                                            "all" === l.value
                                                              ? (i(),
                                                                s("div", D, [
                                                                  f(
                                                                    b(l.label) +
                                                                      " ",
                                                                    1,
                                                                  ),
                                                                  n(
                                                                    o,
                                                                    {
                                                                      effect:
                                                                        "dark",
                                                                      content:
                                                                        e.$t(
                                                                          "org.member.req.allGroupTips",
                                                                        ),
                                                                      placement:
                                                                        "top",
                                                                    },
                                                                    {
                                                                      default:
                                                                        p(
                                                                          () => [
                                                                            n(
                                                                              r,
                                                                              {
                                                                                size: 16,
                                                                                class:
                                                                                  "m-l-8",
                                                                              },
                                                                              {
                                                                                default:
                                                                                  p(
                                                                                    () => [
                                                                                      n(
                                                                                        a,
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
                                                                    ["content"],
                                                                  ),
                                                                ]))
                                                              : (i(),
                                                                s(
                                                                  "span",
                                                                  H,
                                                                  b(l.label),
                                                                  1,
                                                                )),
                                                          ]),
                                                          _: 2,
                                                        },
                                                        1032,
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
                                          le.value
                                            ? h("", !0)
                                            : (i(),
                                              s(
                                                "div",
                                                S,
                                                b(
                                                  g(J)(
                                                    "org.member.req.envGroupIdsHolderTip",
                                                  ),
                                                ),
                                                1,
                                              )),
                                        ]),
                                        _: 1,
                                      },
                                      8,
                                      ["label"],
                                    ))
                                  : h("", !0),
                                n(
                                  G,
                                  {
                                    label: e.$t("org.member.req.roleId"),
                                    prop: "roleId",
                                  },
                                  {
                                    default: p(() => [
                                      n(
                                        _,
                                        {
                                          modelValue: Q.value.row.roleId,
                                          "onUpdate:modelValue":
                                            l[1] ||
                                            (l[1] = (e) =>
                                              (Q.value.row.roleId = e)),
                                          placeholder: e.$t(
                                            "org.member.req.roleIdHolder",
                                          ),
                                          clearable: "",
                                          filterable: "",
                                        },
                                        {
                                          default: p(() => [
                                            (i(!0),
                                            s(
                                              d,
                                              null,
                                              w(
                                                W.value,
                                                (e) => (
                                                  i(),
                                                  m(
                                                    y,
                                                    {
                                                      key: e.value,
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
                                      c(
                                        "div",
                                        F,
                                        b(g(J)("org.member.req.roleIdTip")),
                                        1,
                                      ),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                n(
                                  G,
                                  {
                                    label: e.$t("org.member.req.authority"),
                                    prop: "authority",
                                  },
                                  {
                                    default: p(() => [
                                      n(
                                        k,
                                        {
                                          modelValue: Q.value.row.authority,
                                          "onUpdate:modelValue":
                                            l[2] ||
                                            (l[2] = (e) =>
                                              (Q.value.row.authority = e)),
                                        },
                                        {
                                          default: p(() => [
                                            c("div", null, [
                                              (i(!0),
                                              s(
                                                d,
                                                null,
                                                w(
                                                  B.value,
                                                  (e) => (
                                                    i(),
                                                    m(
                                                      x,
                                                      {
                                                        key: e.value,
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
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["modelValue"],
                                      ),
                                      Q.value.row.authority === g(I).Admin
                                        ? (i(),
                                          s(
                                            "div",
                                            z,
                                            b(
                                              g(J)(
                                                "org.member.req.memberStatusChooseTip",
                                              ),
                                            ),
                                            1,
                                          ))
                                        : h("", !0),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label"],
                                ),
                                n(
                                  G,
                                  {
                                    label: e.$t("base.remark"),
                                    prop: "remark",
                                  },
                                  {
                                    default: p(() => [
                                      n(
                                        q,
                                        {
                                          type: "textarea",
                                          autosize: { minRows: 2, maxRows: 5 },
                                          modelValue: Q.value.row.apiRemark,
                                          "onUpdate:modelValue":
                                            l[3] ||
                                            (l[3] = (e) =>
                                              (Q.value.row.apiRemark = e)),
                                          placeholder: e.$t("base.remark"),
                                          clearable: "",
                                          maxlength: "100",
                                          "show-word-limit": "",
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
                            [
                              "rules",
                              "disabled",
                              "model",
                              "hide-required-asterisk",
                            ],
                          )),
                          [[R]],
                        ),
                      ]),
                      _: 1,
                    },
                    8,
                    ["modelValue", "title"],
                  ),
                  n(
                    j,
                    { ref_key: "createApiResDialogRef", ref: re },
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
    [["__scopeId", "data-v-8b22407b"]],
  );
export { N as default };
