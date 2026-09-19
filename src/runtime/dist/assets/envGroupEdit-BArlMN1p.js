import {
  d as e,
  v as l,
  i as a,
  ez as u,
  r as s,
  q as t,
  o as r,
  c as o,
  F as i,
  b as d,
  w as n,
  x as p,
  h as v,
  f as c,
  X as m,
  aj as b,
  be as f,
  ah as g,
  a as _,
  e as h,
  t as w,
  z as y,
  at as I,
  f8 as k,
  f9 as V,
  fa as x,
  a3 as E,
  _ as T,
} from "./index-BUIbb6Pa.js";
import $ from "./envSerialNums-BjlyggGT.js";
import { _ as P } from "./groupEdit.vue_vue_type_script_setup_true_name_envGroupEdit_lang-OORP_IuD.js";
const R = { class: "tw-truncate" },
  G = T(
    e({
      __name: "envGroupEdit",
      emits: ["submit"],
      setup(e, { expose: T, emit: G }) {
        const N = G,
          q = a(!1),
          { t: C } = l.useI18n(),
          j = a({ isView: !1, groupList: [], serialNums: [], ids: [] });
        let A = a();
        const D = a(!1);
        let U = a();
        const z = a(),
          F = a({ groupIds: [], updateType: u.APPEND }),
          L = I({ groupIds: [{ required: !0, trigger: "blur" }] }),
          S = a(!1),
          B = a(!1);
        function H() {
          var e;
          (A.value.blur(),
            null == (e = U.value) ||
              e.acceptParams({
                title: "env.group.createTitle",
                row: { name: void 0, memberIds: void 0, remark: void 0 },
              }));
        }
        function O(e) {
          var l;
          (j.value.groupList.unshift({ label: e.name, value: e.id }),
            null == (l = F.value.groupIds) || l.push(e.id));
        }
        const X = () => {
            z.value.validate(async (e) => {
              var l, a, u, s, t;
              if (e)
                try {
                  ((D.value = !0),
                    S.value
                      ? await k({
                          ids: null == (l = j.value) ? void 0 : l.ids,
                          groupIds: F.value.groupIds,
                          updateType: F.value.updateType,
                        })
                      : 1 ===
                          (null == (u = null == (a = j.value) ? void 0 : a.ids)
                            ? void 0
                            : u.length)
                        ? await V(
                            j.value.ids[0],
                            { groupIds: F.value.groupIds },
                            !0,
                          )
                        : await x({
                            ids: null == (s = j.value) ? void 0 : s.ids,
                            groupIds: F.value.groupIds,
                          }).then(() => {}),
                    E.success(C("env.env.shareDialog.operatorSuccess")),
                    N("submit"),
                    (q.value = !1),
                    null == (t = z.value) || t.resetFields());
                } finally {
                  D.value = !1;
                }
            });
          },
          J = () => {
            var e;
            ((q.value = !1), null == (e = z.value) || e.resetFields());
          };
        return (
          T({
            acceptParams: (e) => {
              ((j.value = e),
                (F.value.groupIds = e.groupIds),
                (S.value = e.isBatch),
                (F.value.updateType = u.APPEND),
                (q.value = !0));
            },
            handelInit: (e) => {
              B.value = e;
            },
          }),
          (e, l) => {
            const a = s("el-form-item"),
              I = s("el-radio"),
              k = s("el-radio-group"),
              V = s("el-option"),
              x = s("el-select"),
              E = s("el-form"),
              T = s("el-button"),
              G = s("el-dialog"),
              N = t("loadingV2"),
              K = t("prevent-label-click");
            return (
              r(),
              o(
                i,
                null,
                [
                  d(
                    G,
                    {
                      modelValue: q.value,
                      "onUpdate:modelValue":
                        l[2] || (l[2] = (e) => (q.value = e)),
                      title: e.$t("base.batchGroup"),
                      width: "600px",
                      "close-on-click-modal": !1,
                      "close-on-press-escape": !1,
                      "align-center": !0,
                    },
                    {
                      footer: n(() => [
                        d(
                          T,
                          { type: "info", onClick: J },
                          {
                            default: n(() => [h(w(e.$t("base.cancel")), 1)]),
                            _: 1,
                          },
                        ),
                        d(
                          T,
                          {
                            type: "primary",
                            onClick: X,
                            loading: D.value,
                            disabled: B.value,
                          },
                          {
                            default: n(() => [h(w(e.$t("base.confirm")), 1)]),
                            _: 1,
                          },
                          8,
                          ["loading", "disabled"],
                        ),
                      ]),
                      default: n(() => [
                        p(
                          (r(),
                          v(
                            E,
                            {
                              ref_key: "envGroupEditRef",
                              ref: z,
                              "label-width": "auto",
                              "label-position": "right",
                              rules: L,
                              disabled: j.value.isView,
                              "hide-required-asterisk": j.value.isView,
                              model: F.value,
                            },
                            {
                              default: n(() => [
                                d(
                                  a,
                                  { label: e.$t("env.group.moveGroupTitle") },
                                  {
                                    default: n(() => [
                                      d(
                                        $,
                                        { serialNums: j.value.serialNums },
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
                                S.value
                                  ? (r(),
                                    v(
                                      a,
                                      {
                                        key: 0,
                                        label: e.$t(
                                          "env.env.batchRemark.updateType",
                                        ),
                                      },
                                      {
                                        default: n(() => [
                                          d(
                                            k,
                                            {
                                              modelValue: F.value.updateType,
                                              "onUpdate:modelValue":
                                                l[0] ||
                                                (l[0] = (e) =>
                                                  (F.value.updateType = e)),
                                              size: "medium",
                                            },
                                            {
                                              default: n(() => [
                                                d(
                                                  I,
                                                  {
                                                    label: e.$t(
                                                      "env.env.batchRemark.append",
                                                    ),
                                                    value: c(u).APPEND,
                                                  },
                                                  null,
                                                  8,
                                                  ["label", "value"],
                                                ),
                                                d(
                                                  I,
                                                  {
                                                    label: e.$t(
                                                      "env.env.batchRemark.cover",
                                                    ),
                                                    value: c(u).COVER,
                                                  },
                                                  null,
                                                  8,
                                                  ["label", "value"],
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
                                    ))
                                  : m("", !0),
                                d(
                                  a,
                                  {
                                    label: e.$t("env.group.word"),
                                    prop: "groupIds",
                                    rules: [
                                      {
                                        required: !0,
                                        message: e.$t(
                                          "org.member.req.envGroupIdsHolder",
                                        ),
                                        trigger: "blur",
                                      },
                                    ],
                                  },
                                  {
                                    default: n(() => [
                                      p(
                                        (r(),
                                        v(
                                          x,
                                          {
                                            ref_key: "envGroupInputRef",
                                            ref: A,
                                            "popper-class": "tw-max-w-[370px]",
                                            modelValue: F.value.groupIds,
                                            "onUpdate:modelValue":
                                              l[1] ||
                                              (l[1] = (e) =>
                                                (F.value.groupIds = e)),
                                            placeholder:
                                              e.$t("base.selectHolder"),
                                            multiple: "",
                                            filterable: "",
                                            "collapse-tags": "",
                                            "collapse-tags-tooltip": "",
                                            "max-collapse-tags": 2,
                                          },
                                          b(
                                            {
                                              default: n(() => [
                                                (r(!0),
                                                o(
                                                  i,
                                                  null,
                                                  y(
                                                    j.value.groupList,
                                                    (e) => (
                                                      r(),
                                                      v(
                                                        V,
                                                        {
                                                          class: "tw-w-inherit",
                                                          key: e.value,
                                                          label: e.label,
                                                          value: e.value,
                                                        },
                                                        {
                                                          default: n(() => [
                                                            _(
                                                              "span",
                                                              R,
                                                              w(e.label),
                                                              1,
                                                            ),
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
                                              _: 2,
                                            },
                                            [
                                              c(f)(c(g).CREATE_GROUP)
                                                ? {
                                                    name: "footer",
                                                    fn: n(() => [
                                                      _(
                                                        "div",
                                                        {
                                                          class:
                                                            "tw-text-[14px] tw-text-[var(--btn-primary-link-color)] tw-flex tw-items-center tw-cursor-pointer",
                                                          onClick: H,
                                                        },
                                                        [
                                                          l[3] ||
                                                            (l[3] = _(
                                                              "i",
                                                              {
                                                                class:
                                                                  "iconfont icon-plus",
                                                              },
                                                              null,
                                                              -1,
                                                            )),
                                                          h(
                                                            w(
                                                              c(C)(
                                                                "env.group.createBtn",
                                                              ),
                                                            ),
                                                            1,
                                                          ),
                                                        ],
                                                      ),
                                                    ]),
                                                    key: "0",
                                                  }
                                                : void 0,
                                            ],
                                          ),
                                          1032,
                                          ["modelValue", "placeholder"],
                                        )),
                                        [[N, B.value]],
                                      ),
                                    ]),
                                    _: 1,
                                  },
                                  8,
                                  ["label", "rules"],
                                ),
                              ]),
                              _: 1,
                            },
                            8,
                            [
                              "rules",
                              "disabled",
                              "hide-required-asterisk",
                              "model",
                            ],
                          )),
                          [[K]],
                        ),
                      ]),
                      _: 1,
                    },
                    8,
                    ["modelValue", "title"],
                  ),
                  d(
                    P,
                    { ref_key: "groupEditRef", ref: U, onSubmit: O },
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
    [["__scopeId", "data-v-e3f87010"]],
  );
export { G as default };
