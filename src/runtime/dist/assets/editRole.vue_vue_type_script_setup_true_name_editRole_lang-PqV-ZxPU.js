import {
  d as e,
  v as l,
  at as a,
  bb as o,
  i as t,
  r as s,
  q as r,
  o as u,
  h as d,
  w as n,
  x as i,
  b as m,
  a as c,
  t as v,
  e as p,
  f as w,
  c as f,
  F as g,
  z as y,
  X as h,
  V as b,
  D as I,
  E as _,
  A as V,
} from "./index-BUIbb6Pa.js";
import { a as E, u as k, c as M, b as q } from "./system-DtbAsiCM.js";
const C = { style: { color: "var(--text-color-light1)" } },
  x = e({
    __name: "editRole",
    emits: ["submit"],
    setup(e, { expose: x, emit: O }) {
      const { t: R } = l.useI18n(),
        A = O,
        S = a({
          name: [{ required: !0, message: R("system.role.req.nameHolder") }],
          moduleIds: [
            {
              required: !0,
              validator: (e, l, a) => {
                if (
                  !U.value.row.moduleIds ||
                  !U.value.row.moduleIds.length ||
                  (1 === U.value.row.moduleIds.length &&
                    !U.value.row.moduleIds[0])
                )
                  return void a(new Error(R("system.role.req.moduleIdsRule1")));
                const t = JSON.parse(JSON.stringify(L.value));
                (U.value.row.moduleIds.forEach((e) => {
                  t[e] && delete t[e];
                }),
                  o(t)
                    ? a()
                    : a(new Error(R("system.role.req.moduleIdsRule2"))));
              },
            },
          ],
          allowManageIds: [{ required: !0, message: R("base.selectHolder") }],
        }),
        $ = t([{ id: "all", name: R("system.role.allAccounts") }]),
        N = { multiple: !0 },
        J = t(!1),
        U = t({ isView: !1, title: "system.role.createTitle", row: {} }),
        T = t([]),
        P = t(!1),
        K = t([]),
        L = t({}),
        j = t([]),
        D = t(!1),
        F = (e) => {
          let l = [...e.toString().split(",")],
            a = 0 == b.difference(K.value, l).length;
          !a && (null == l || l.push(...K.value));
          const o = [...new Set(l)];
          ((U.value.row.moduleIds = o), !a && (j.value = o));
        },
        H = (e) =>
          e && e.length
            ? e.map((e) => {
                const l = { value: e.id, label: e.name };
                return (e.children && (l.children = H(e.children)), l);
              })
            : [];
      function z(e, l, a) {
        if (!0 === l.readonly) {
          const o = [...a, l.id];
          if (l.children && Array.isArray(l.children) && l.children.length > 0)
            for (const a of l.children) z(e, a, o);
          else e.push(o);
        }
      }
      const B = async () => {
        try {
          D.value = !0;
          const e = await q({ all: !0, detail: !1 });
          ((K.value = []),
            (T.value = H(e.list)),
            (K.value = (function (e) {
              const l = [];
              for (const a of e) !0 === a.readonly && z(l, a, []);
              return l;
            })(e.list)
              .toString()
              .split(",")),
            (L.value = K.value.reduce((e, l) => ({ ...e, [l]: !0 }), {})));
        } finally {
          D.value = !1;
        }
      };
      async function G() {
        let e = await E();
        (($.value = e),
          $.value.unshift({ id: "all", name: R("system.role.allAccounts") }));
      }
      function X(e) {
        "all" === e[e.length - 1]
          ? (U.value.row.allowManageIds = ["all"])
          : e.includes("all") &&
            e.length > 1 &&
            (U.value.row.allowManageIds = e.filter((e) => "all" !== e));
      }
      const Q = t(),
        W = () => {
          Q.value.validate(async (e) => {
            if (e) {
              ((P.value = !0),
                (U.value.row.moduleIds = b.uniq([
                  ...(U.value.row.moduleIds || []),
                  "1818170410820718594",
                  "100763762247598085",
                ])));
              try {
                (U.value.row.id
                  ? (I.api.trackEvent({
                      type: V.TEAM_CLICK,
                      action: _.CLICK_EDIT_MEMBER_GROUP,
                    }),
                    await k(U.value.row.id, U.value.row))
                  : (I.api.trackEvent({
                      type: V.TEAM_CLICK,
                      action: _.CLICK_CREATE_MEMBER_GROUP,
                    }),
                    await M(U.value.row)),
                  (J.value = !1),
                  A("submit"));
              } catch (l) {
              } finally {
                P.value = !1;
              }
            }
          });
        };
      return (
        x({
          acceptParams: async (e) => {
            var l;
            if (
              ((J.value = !0),
              await Promise.all([B(), G()]),
              e.row.moduleIds && e.row.moduleIds.length)
            ) {
              const l = JSON.parse(JSON.stringify(L.value));
              (e.row.moduleIds.forEach((e) => {
                l[e] && delete l[e];
              }),
                Object.keys(l).forEach((l) => {
                  var a;
                  return null == (a = e.row.moduleIds) ? void 0 : a.push(l);
                }));
            } else e.row.moduleIds = JSON.parse(JSON.stringify(K.value));
            ((j.value = JSON.parse(JSON.stringify(e.row.moduleIds))),
              (U.value = e),
              null == (l = Q.value) || l.resetFields());
          },
        }),
        (e, l) => {
          const a = s("el-input"),
            o = s("el-form-item"),
            t = s("el-tooltip"),
            b = s("el-cascader-panel"),
            I = s("el-checkbox"),
            _ = s("el-option"),
            V = s("el-select"),
            E = s("el-form"),
            k = s("el-button"),
            M = s("el-dialog"),
            q = r("loading"),
            x = r("prevent-label-click");
          return (
            u(),
            d(
              M,
              {
                modelValue: J.value,
                "onUpdate:modelValue": l[6] || (l[6] = (e) => (J.value = e)),
                title: `${e.$t(U.value.title)}`,
                width: "800px",
                "close-on-click-modal": !1,
                "close-on-press-escape": !1,
                "align-center": !0,
                loading: P.value,
              },
              {
                footer: n(() => [
                  m(
                    k,
                    {
                      type: "info",
                      onClick: l[5] || (l[5] = (e) => (J.value = !1)),
                    },
                    { default: n(() => [p(v(e.$t("base.cancel")), 1)]), _: 1 },
                  ),
                  m(
                    k,
                    { type: "primary", onClick: W, loading: P.value },
                    { default: n(() => [p(v(e.$t("base.confirm")), 1)]), _: 1 },
                    8,
                    ["loading"],
                  ),
                ]),
                default: n(() => [
                  i(
                    (u(),
                    d(
                      E,
                      {
                        ref_key: "ruleFormRef",
                        ref: Q,
                        "label-position": "top",
                        rules: S,
                        disabled: U.value.isView,
                        model: U.value.row,
                        "hide-required-asterisk": U.value.isView,
                      },
                      {
                        default: n(() => [
                          m(
                            o,
                            {
                              label: e.$t("system.role.req.name"),
                              prop: "name",
                            },
                            {
                              default: n(() => [
                                m(
                                  a,
                                  {
                                    modelValue: U.value.row.name,
                                    "onUpdate:modelValue":
                                      l[0] ||
                                      (l[0] = (e) => (U.value.row.name = e)),
                                    placeholder: e.$t("system.role.req.name"),
                                    clearable: "",
                                    maxlength: "20",
                                    "show-word-limit": "",
                                    disabled:
                                      !!U.value.row.code &&
                                      ["ADMIN", "OPERATE"].includes(
                                        U.value.row.code,
                                      ),
                                  },
                                  null,
                                  8,
                                  ["modelValue", "placeholder", "disabled"],
                                ),
                              ]),
                              _: 1,
                            },
                            8,
                            ["label"],
                          ),
                          m(
                            o,
                            { label: e.$t("base.remark"), prop: "remark" },
                            {
                              default: n(() => [
                                m(
                                  a,
                                  {
                                    modelValue: U.value.row.remark,
                                    "onUpdate:modelValue":
                                      l[1] ||
                                      (l[1] = (e) => (U.value.row.remark = e)),
                                    placeholder: e.$t("base.remark"),
                                    clearable: "",
                                    type: "textarea",
                                    autosize: { minRows: 2, maxRows: 5 },
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
                          m(
                            o,
                            { prop: "moduleIds" },
                            {
                              label: n(() => [
                                c(
                                  "span",
                                  null,
                                  v(e.$t("system.role.req.moduleIds")),
                                  1,
                                ),
                                c(
                                  "span",
                                  C,
                                  "（" +
                                    v(e.$t("system.role.req.moduleIdsHint")) +
                                    "）",
                                  1,
                                ),
                              ]),
                              default: n(() => [
                                i(
                                  (u(),
                                  d(
                                    b,
                                    {
                                      modelValue: j.value,
                                      "onUpdate:modelValue":
                                        l[2] || (l[2] = (e) => (j.value = e)),
                                      options: T.value,
                                      props: N,
                                      onChange: F,
                                      style: { width: "100%" },
                                    },
                                    {
                                      default: n(({ data: e }) => [
                                        m(
                                          t,
                                          {
                                            effect: "dark",
                                            content: e.label,
                                            placement: "top",
                                          },
                                          {
                                            default: n(() => [
                                              c("span", null, v(e.label), 1),
                                            ]),
                                            _: 2,
                                          },
                                          1032,
                                          ["content"],
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["modelValue", "options"],
                                  )),
                                  [[q, D.value]],
                                ),
                              ]),
                              _: 1,
                            },
                          ),
                          m(
                            I,
                            {
                              class: "tw-mb-[10px]",
                              modelValue: U.value.row.allowManage,
                              "onUpdate:modelValue":
                                l[3] ||
                                (l[3] = (e) => (U.value.row.allowManage = e)),
                            },
                            {
                              default: n(() => [
                                p(v(e.$t("system.role.req.managerEnable")), 1),
                              ]),
                              _: 1,
                            },
                            8,
                            ["modelValue"],
                          ),
                          U.value.row.allowManage
                            ? (u(),
                              d(
                                o,
                                {
                                  key: 0,
                                  label: w(R)("system.role.managerAccount"),
                                  prop: "allowManageIds",
                                },
                                {
                                  default: n(() => [
                                    m(
                                      V,
                                      {
                                        modelValue: U.value.row.allowManageIds,
                                        "onUpdate:modelValue":
                                          l[4] ||
                                          (l[4] = (e) =>
                                            (U.value.row.allowManageIds = e)),
                                        multiple: "",
                                        "collapse-tags": "",
                                        "collapse-tags-tooltip": "",
                                        "max-collapse-tags": 2,
                                        onChange: X,
                                      },
                                      {
                                        default: n(() => [
                                          (u(!0),
                                          f(
                                            g,
                                            null,
                                            y(
                                              $.value,
                                              (e) => (
                                                u(),
                                                d(
                                                  _,
                                                  {
                                                    key: e.id,
                                                    label: e.name,
                                                    value: e.id,
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
                                      ["modelValue"],
                                    ),
                                  ]),
                                  _: 1,
                                },
                                8,
                                ["label"],
                              ))
                            : h("", !0),
                        ]),
                        _: 1,
                      },
                      8,
                      ["rules", "disabled", "model", "hide-required-asterisk"],
                    )),
                    [[x]],
                  ),
                ]),
                _: 1,
              },
              8,
              ["modelValue", "title", "loading"],
            )
          );
        }
      );
    },
  });
export { x as _ };
