import {
  d as e,
  v as l,
  P as a,
  dV as t,
  dW as s,
  r as i,
  o,
  c as u,
  b as d,
  f as c,
  w as n,
  a as m,
  t as p,
  F as r,
  e as b,
  h as V,
  z as f,
  dX as w,
  X as g,
  _ as L,
} from "./index-BUIbb6Pa.js";
const h = {
    class:
      "tw-rounded-[8px] tw-bg-[var(--card-base-bg-color)] tw-p-[20px] tw-w-full access-limit-card",
  },
  k = { class: "tw-flex tw-items-center" },
  v = {
    class: "tw-pl-2 tip tw-leading-[1] tw-text-[var(--text-color-light1)]",
  },
  x = L(
    e({
      __name: "accessLimitCard",
      props: { modelValue: {} },
      setup(e) {
        let { t: L } = l.useI18n();
        const x = e;
        function _() {
          let e = x.modelValue.urlList
            .split("\n")
            .filter((e) => "" !== e.trim());
          x.modelValue.urlList = e.map((e) => e.trim()).join("\n");
        }
        return (
          a(() => {
            let e = x.modelValue.quickSelectionType,
              l = x.modelValue.urlList ?? "";
            if (e) {
              const a = [];
              for (const i in t)
                if (t.hasOwnProperty(i)) {
                  const o = t[i];
                  (e & o) === o &&
                    (a.push(o),
                    (l = l
                      .split("\n")
                      .filter((e) => e !== s[t[o]])
                      .join("\n")));
                }
              ((x.modelValue.quickSelectionOption = a),
                (x.modelValue.urlList = l));
            }
          }),
          (l, a) => {
            const s = i("el-switch"),
              x = i("el-form-item"),
              y = i("el-radio"),
              $ = i("el-radio-group"),
              q = i("el-checkbox"),
              R = i("el-checkbox-group"),
              S = i("el-input");
            return (
              o(),
              u("div", h, [
                d(
                  x,
                  {
                    label: c(L)("setting.accessLimit"),
                    "label-position": "left",
                    "label-width": "auto",
                  },
                  {
                    default: n(() => [
                      m("div", k, [
                        d(
                          s,
                          {
                            modelValue: e.modelValue.status,
                            "onUpdate:modelValue":
                              a[0] || (a[0] = (l) => (e.modelValue.status = l)),
                          },
                          null,
                          8,
                          ["modelValue"],
                        ),
                        m("div", v, p(l.$t("setting.accessLimitTip2")), 1),
                      ]),
                    ]),
                    _: 1,
                  },
                  8,
                  ["label"],
                ),
                e.modelValue.status
                  ? (o(),
                    u(
                      r,
                      { key: 0 },
                      [
                        d(
                          x,
                          {
                            label: l.$t("setting.accessLimitLabel1"),
                            "label-position": "left",
                            "label-width": "auto",
                          },
                          {
                            default: n(() => [
                              d(
                                $,
                                {
                                  modelValue: e.modelValue.type,
                                  "onUpdate:modelValue":
                                    a[1] ||
                                    (a[1] = (l) => (e.modelValue.type = l)),
                                },
                                {
                                  default: n(() => [
                                    d(
                                      y,
                                      {
                                        class:
                                          "tw-whitespace-break-spaces tw-leading-[1.2]",
                                        value: 1,
                                        size: "large",
                                      },
                                      {
                                        default: n(() => [
                                          b(
                                            p(
                                              l.$t("setting.accessLimitRadio1"),
                                            ),
                                            1,
                                          ),
                                        ]),
                                        _: 1,
                                      },
                                    ),
                                    d(
                                      y,
                                      {
                                        class:
                                          "tw-whitespace-break-spaces tw-leading-[1.2]",
                                        value: 2,
                                        size: "large",
                                      },
                                      {
                                        default: n(() => [
                                          b(
                                            p(
                                              l.$t("setting.accessLimitRadio2"),
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
                                ["modelValue"],
                              ),
                            ]),
                            _: 1,
                          },
                          8,
                          ["label"],
                        ),
                        1 === e.modelValue.type
                          ? (o(),
                            V(
                              x,
                              {
                                key: 0,
                                "label-width": "auto",
                                label: l.$t("env.env.req.quickSelection"),
                                "label-position": "left",
                              },
                              {
                                default: n(() => [
                                  d(
                                    R,
                                    {
                                      modelValue:
                                        e.modelValue.quickSelectionOption,
                                      "onUpdate:modelValue":
                                        a[2] ||
                                        (a[2] = (l) =>
                                          (e.modelValue.quickSelectionOption =
                                            l)),
                                    },
                                    {
                                      default: n(() => [
                                        (o(!0),
                                        u(
                                          r,
                                          null,
                                          f(
                                            c(w),
                                            (e, a) => (
                                              o(),
                                              V(
                                                q,
                                                {
                                                  key: e,
                                                  label: l.$t(e),
                                                  value: c(t)[a],
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
                          : g("", !0),
                        d(
                          x,
                          {
                            prop: "accessLimitConfigVal.urlList",
                            "label-width": "auto",
                            label: l.$t("setting.accessLimitLabel2"),
                            "label-position": "left",
                          },
                          {
                            default: n(() => [
                              d(
                                S,
                                {
                                  modelValue: e.modelValue.urlList,
                                  "onUpdate:modelValue":
                                    a[3] ||
                                    (a[3] = (l) => (e.modelValue.urlList = l)),
                                  autosize: { minRows: 2, maxRows: 5 },
                                  placeholder: c(L)(
                                    "setting.accessLimitRules1",
                                  ),
                                  autocomplete: "off",
                                  class: "tw-max-w-[500px]",
                                  spellcheck: "false",
                                  style: { width: "100%" },
                                  type: "textarea",
                                  onBlur: _,
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
                      ],
                      64,
                    ))
                  : g("", !0),
              ])
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-ebbb8b07"]],
  );
export { x as default };
