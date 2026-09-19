import {
  d as e,
  v as l,
  aQ as a,
  R as n,
  at as o,
  V as u,
  ad as t,
  r as v,
  q as s,
  o as r,
  h as i,
  w as d,
  x as c,
  b as p,
  a as m,
  t as b,
  f,
  f5 as g,
  c as y,
  F as h,
  z as I,
  e as V,
  C as _,
  i as k,
  f6 as x,
  c7 as $,
  c8 as w,
  f7 as C,
  a3 as O,
  ao as U,
  _ as E,
} from "./index-BUIbb6Pa.js";
const D = { class: "clone-tips tw-ml-[5px]" },
  L = E(
    e({
      __name: "envCloneDialog",
      emits: ["submit"],
      setup(e, { expose: E, emit: L }) {
        const P = _(() => ({
            number: 1,
            groupIds: [],
            remark: "",
            typeOption: F.value.length ? F.value : [g.fingerprintAndProxy],
            envId: "",
          })),
          { t: R } = l.useI18n(),
          q = L,
          A = a(),
          { envCloneLastTypeOption: F } = n(A),
          G = k(),
          H = k({}),
          N = k(!1),
          T = k([]),
          j = o({ ...u.cloneDeep(P.value) }),
          z = k(0),
          Q = k(!1),
          { currentPlanConfig: B } = t(),
          J = k(!1),
          K = () => {
            var e;
            B.envLimit > 0 &&
            ((null == j ? void 0 : j.number) ?? 0) >
              ((null == (e = null == H ? void 0 : H.value)
                ? void 0
                : e.envLimit) ?? 0) -
                (H.value.envUsage ?? 0)
              ? $(
                  R("env.env.createEvn.hint"),
                  R("env.env.openLimit.btnText"),
                  w,
                )
              : G.value.validate(async (e) => {
                  var l;
                  if (e)
                    try {
                      ((Q.value = !0),
                        await C(j.envId ?? "", {
                          ...j,
                          type:
                            (null == (l = j.typeOption)
                              ? void 0
                              : l.reduce((e, l) => e + l, 0)) ?? 0,
                        }),
                        (F.value = j.typeOption ?? []),
                        O.success(
                          R("env.env.clone.successNum", { num: j.number }),
                        ),
                        q("submit"),
                        M());
                    } catch (a) {
                    } finally {
                      Q.value = !1;
                    }
                });
          },
          M = () => {
            var e;
            (null == (e = G.value) || e.resetFields(),
              Object.assign(j, u.cloneDeep(P.value)),
              (N.value = !1));
          },
          S = async (e) => {
            const l = await U({ all: !0, detail: !1 });
            ((T.value = l.list.map((e) => ({ value: e.id, label: e.name }))),
              e &&
                e.length &&
                e.forEach((e) => {
                  T.value.find((l) => l.value === e.id) ||
                    T.value.push({ value: e.id, label: e.name });
                }));
          },
          W = o({
            groupIds: [
              { required: !0, message: R("env.env.clone.envGroupHolder") },
            ],
          });
        return (
          E({
            acceptParams: async (e, l) => {
              try {
                ((J.value = !0), (N.value = !0));
                const a = await x(e);
                ((z.value = a.serialNum),
                  (j.groupIds = a.groupIds),
                  (j.remark = a.remark),
                  (j.envId = a.id),
                  (H.value = l),
                  S(a.groups ?? []));
              } finally {
                J.value = !1;
              }
            },
          }),
          (e, l) => {
            const a = v("el-form-item"),
              n = v("el-checkbox"),
              o = v("el-checkbox-group"),
              u = v("el-input-number"),
              t = v("el-option"),
              _ = v("el-select"),
              k = v("el-input"),
              x = v("el-form"),
              $ = v("el-button"),
              w = v("el-dialog"),
              C = s("loadingV2"),
              O = s("trim"),
              U = s("prevent-label-click");
            return (
              r(),
              i(
                w,
                {
                  modelValue: N.value,
                  "onUpdate:modelValue": l[4] || (l[4] = (e) => (N.value = e)),
                  title: e.$t("env.env.clone.cloneEnv"),
                  "close-on-click-modal": !1,
                  "close-on-press-escape": !1,
                  "align-center": !0,
                  onClose: M,
                  width: "700px",
                },
                {
                  footer: d(() => [
                    p(
                      $,
                      { type: "info", onClick: M },
                      {
                        default: d(() => [V(b(e.$t("base.cancel")), 1)]),
                        _: 1,
                      },
                    ),
                    p(
                      $,
                      { type: "primary", onClick: K, loading: Q.value },
                      {
                        default: d(() => [V(b(e.$t("base.confirm")), 1)]),
                        _: 1,
                      },
                      8,
                      ["loading"],
                    ),
                  ]),
                  default: d(() => [
                    c(
                      (r(),
                      i(
                        x,
                        {
                          ref_key: "ruleFormRef",
                          ref: G,
                          "label-position": "right",
                          model: j,
                          rules: W,
                          "label-width": "auto",
                        },
                        {
                          default: d(() => [
                            p(
                              a,
                              { label: e.$t("env.env.clone.serialNum") },
                              {
                                default: d(() => [
                                  m("div", null, b(z.value), 1),
                                  m(
                                    "p",
                                    D,
                                    b(e.$t("env.env.clone.cloneTips")),
                                    1,
                                  ),
                                ]),
                                _: 1,
                              },
                              8,
                              ["label"],
                            ),
                            p(
                              a,
                              { label: e.$t("env.env.clone.moreEnvInfo") },
                              {
                                default: d(() => [
                                  c(
                                    (r(),
                                    i(
                                      o,
                                      {
                                        modelValue: j.typeOption,
                                        "onUpdate:modelValue":
                                          l[0] ||
                                          (l[0] = (e) => (j.typeOption = e)),
                                      },
                                      {
                                        default: d(() => [
                                          p(
                                            n,
                                            {
                                              value: f(g).fingerprintAndProxy,
                                              label: e.$t(
                                                "env.env.clone.cloneInfo1",
                                              ),
                                            },
                                            null,
                                            8,
                                            ["value", "label"],
                                          ),
                                          p(
                                            n,
                                            {
                                              value: f(g).accountInfo,
                                              label: e.$t(
                                                "env.env.clone.cloneInfo2",
                                              ),
                                            },
                                            null,
                                            8,
                                            ["value", "label"],
                                          ),
                                          p(
                                            n,
                                            {
                                              value: f(g).CookieAndData,
                                              label: e.$t(
                                                "env.env.clone.cloneInfo3",
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
                                    )),
                                    [[C, J.value]],
                                  ),
                                ]),
                                _: 1,
                              },
                              8,
                              ["label"],
                            ),
                            p(
                              a,
                              {
                                label: e.$t("env.env.clone.cloneEnvCount"),
                                required: !0,
                              },
                              {
                                default: d(() => [
                                  c(
                                    p(
                                      u,
                                      {
                                        modelValue: j.number,
                                        "onUpdate:modelValue":
                                          l[1] ||
                                          (l[1] = (e) => (j.number = e)),
                                        min: 1,
                                        max: 200,
                                        precision: 0,
                                        "value-on-clear": 1,
                                        "controls-position": "right",
                                        style: { "max-width": "110px" },
                                      },
                                      null,
                                      8,
                                      ["modelValue"],
                                    ),
                                    [[C, J.value]],
                                  ),
                                ]),
                                _: 1,
                              },
                              8,
                              ["label"],
                            ),
                            p(
                              a,
                              {
                                label: e.$t("env.env.clone.envGroup"),
                                prop: "groupIds",
                              },
                              {
                                default: d(() => [
                                  c(
                                    (r(),
                                    i(
                                      _,
                                      {
                                        filterable: "",
                                        clearable: "",
                                        modelValue: j.groupIds,
                                        "onUpdate:modelValue":
                                          l[2] ||
                                          (l[2] = (e) => (j.groupIds = e)),
                                        placeholder: e.$t(
                                          "env.env.clone.envGroupHolder",
                                        ),
                                        multiple: "",
                                        "collapse-tags": "",
                                        "collapse-tags-tooltip": "",
                                        "max-collapse-tags": 2,
                                      },
                                      {
                                        default: d(() => [
                                          (r(!0),
                                          y(
                                            h,
                                            null,
                                            I(
                                              T.value,
                                              (e) => (
                                                r(),
                                                i(
                                                  t,
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
                                    )),
                                    [[C, J.value]],
                                  ),
                                ]),
                                _: 1,
                              },
                              8,
                              ["label"],
                            ),
                            p(
                              a,
                              { label: e.$t("env.env.clone.envRemark") },
                              {
                                default: d(() => [
                                  c(
                                    p(
                                      k,
                                      {
                                        modelValue: j.remark,
                                        "onUpdate:modelValue":
                                          l[3] ||
                                          (l[3] = (e) => (j.remark = e)),
                                        placeholder: e.$t(
                                          "env.env.clone.envRemarkHolder",
                                        ),
                                        clearable: "",
                                        maxlength: 100,
                                        "show-word-limit": "",
                                      },
                                      null,
                                      8,
                                      ["modelValue", "placeholder"],
                                    ),
                                    [[C, J.value], [O]],
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
                      [[U]],
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
    [["__scopeId", "data-v-1c674503"]],
  );
export { L as default };
