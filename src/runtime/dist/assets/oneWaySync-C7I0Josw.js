import {
  d as e,
  v as a,
  P as l,
  r as t,
  o as s,
  c as n,
  h as o,
  X as d,
  b as c,
  w as i,
  a as u,
  t as r,
  e as p,
  f as m,
  F as v,
  z as y,
  C as b,
  i as w,
  ad as x,
  _ as S,
} from "./index-BUIbb6Pa.js";
import { _ as V } from "./Tip.vue_vue_type_script_setup_true_lang-DBJcGLEl.js";
const _ = { class: "tw-pt-[12px] tw-pb-[12px]" },
  D = { key: 1 },
  f = { class: "tw-text-[var(--label-content-color)] tw-text-[14px]" },
  g = {
    class:
      "tw-text-[var(--label-content-color)] tw-text-[14px] tw-whitespace-nowrap",
  },
  h = { class: "tw-truncate" },
  I = S(
    e({
      __name: "oneWaySync",
      props: {
        modelValue: {},
        roleList: {},
        canUse: { type: Boolean },
        hidDivider: { type: Boolean },
      },
      setup(e) {
        let { t: S } = a.useI18n();
        const I = b(() => x().planTooltipContentText),
          U = e,
          W = w([]);
        return (
          l(() => {
            var e;
            ((U.modelValue.envDataSync &&
              "null" !== U.modelValue.envDataSync) ||
              (U.modelValue.envDataSync = { status: !1, roleIds: [] }),
              (W.value = U.roleList.filter((e) => "SUPER_ADMIN" === e.code)),
              0 ===
                (null == (e = U.modelValue.envDataSync.roleIds)
                  ? void 0
                  : e.length) &&
                (U.modelValue.envDataSync.roleIds = W.value.map((e) => e.id)));
          }),
          (a, l) => {
            var b;
            const w = t("el-divider"),
              x = t("el-switch"),
              W = t("el-tooltip"),
              k = t("el-option"),
              L = t("el-select"),
              T = t("el-form-item");
            return (
              s(),
              n("div", _, [
                e.hidDivider
                  ? d("", !0)
                  : (s(), o(w, { key: 0, class: "tw-mt-[0px]" })),
                U.modelValue.envDataSync
                  ? (s(),
                    n("div", D, [
                      c(
                        W,
                        {
                          content: I.value,
                          disabled: U.canUse,
                          placement: "top",
                        },
                        {
                          default: i(() => [
                            c(
                              x,
                              {
                                class: "tw-pr-2",
                                modelValue: U.modelValue.envDataSync.status,
                                "onUpdate:modelValue":
                                  l[0] ||
                                  (l[0] = (e) =>
                                    (U.modelValue.envDataSync.status = e)),
                                disabled: !U.canUse,
                              },
                              null,
                              8,
                              ["modelValue", "disabled"],
                            ),
                          ]),
                          _: 1,
                        },
                        8,
                        ["content", "disabled"],
                      ),
                      u("span", f, r(a.$t("setting.oneWaySyncDesc")), 1),
                    ]))
                  : d("", !0),
                (null == (b = U.modelValue.envDataSync) ? void 0 : b.status)
                  ? (s(),
                    o(
                      T,
                      {
                        key: 2,
                        class: "tw-flex tw-mt-[12px] !tw-mb-0",
                        id: "envDataSyncRoleIdsFormItem",
                        prop: "envDataSync.roleIds",
                        "inline-message": !1,
                        "label-width": "auto",
                      },
                      {
                        label: i(() => [
                          u(
                            "span",
                            g,
                            r(a.$t("setting.oneWaySyncWhiteList")),
                            1,
                          ),
                          c(
                            V,
                            { text: a.$t("setting.oneWaySyncWhiteListTip") },
                            null,
                            8,
                            ["text"],
                          ),
                        ]),
                        default: i(() => [
                          c(
                            W,
                            {
                              content: I.value,
                              disabled: U.canUse,
                              placement: "top",
                            },
                            {
                              default: i(() => [
                                c(
                                  L,
                                  {
                                    modelValue:
                                      U.modelValue.envDataSync.roleIds,
                                    "onUpdate:modelValue":
                                      l[1] ||
                                      (l[1] = (e) =>
                                        (U.modelValue.envDataSync.roleIds = e)),
                                    "max-collapse-tags": 2,
                                    class: "tw-max-w-[500px] select-pro",
                                    "collapse-tags": "",
                                    "collapse-tags-tooltip": "",
                                    multiple: "",
                                    disabled: !U.canUse,
                                    onChange:
                                      l[2] ||
                                      (l[2] = (e) => {
                                        return (
                                          (a = e),
                                          (l = U.modelValue.envDataSync),
                                          (t = "roleIds"),
                                          void ("all" === a[a.length - 1]
                                            ? (l[t] = ["all"])
                                            : a.includes("all") &&
                                              a.length > 1 &&
                                              (l[t] = a.filter(
                                                (e) => "all" !== e,
                                              )))
                                        );
                                        var a, l, t;
                                      }),
                                  },
                                  {
                                    default: i(() => [
                                      c(
                                        k,
                                        {
                                          key: "all",
                                          label: a.$t(
                                            "org.member.req.allGroup",
                                          ),
                                          value: "all",
                                        },
                                        {
                                          default: i(() => [
                                            p(
                                              r(
                                                m(S)("org.member.req.allGroup"),
                                              ),
                                              1,
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["label"],
                                      ),
                                      (s(!0),
                                      n(
                                        v,
                                        null,
                                        y(
                                          e.roleList,
                                          (e) => (
                                            s(),
                                            o(
                                              k,
                                              {
                                                key: e.id,
                                                label: e.name,
                                                value: e.id,
                                                class: "tw-w-inherit",
                                              },
                                              {
                                                default: i(() => [
                                                  u("span", h, r(e.name), 1),
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
                                  ["modelValue", "disabled"],
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
                    ))
                  : d("", !0),
              ])
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-cf068a8b"]],
  );
export { I as default };
