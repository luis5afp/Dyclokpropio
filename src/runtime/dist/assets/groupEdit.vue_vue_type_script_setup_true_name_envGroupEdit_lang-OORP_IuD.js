import {
  d as e,
  v as a,
  G as l,
  at as r,
  r as t,
  q as o,
  o as u,
  h as i,
  w as s,
  x as d,
  b as n,
  e as m,
  t as v,
  i as p,
  du as c,
  D as w,
  E as b,
  A as f,
  dv as g,
} from "./index-BUIbb6Pa.js";
const h = e({
  __name: "groupEdit",
  emits: ["submit"],
  setup(e, { expose: h, emit: V }) {
    const { t: _ } = a.useI18n(),
      k = V;
    l();
    const y = r({
        name: [
          {
            required: !0,
            message: _("env.group.req.nameRule"),
            trigger: "blur",
          },
        ],
      }),
      $ = p(!1),
      q = p({ isView: !1, title: "env.group.createTitle", row: {} }),
      x = p(!1),
      C = p(!1),
      E = p(),
      R = () => {
        E.value.validate(async (e) => {
          if (!e) return;
          let a;
          x.value = !0;
          try {
            (q.value.row.id
              ? (a = await c(q.value.row.id, q.value.row))
              : (w.api.trackEvent({
                  type: f.ENV_CLICK,
                  action: b.CLICK_CREATE_ENV_GROUP,
                }),
                (a = await g(q.value.row))),
              ($.value = !1),
              k("submit", a));
          } catch (l) {
          } finally {
            x.value = !1;
          }
        });
      };
    return (
      h({
        acceptParams: (e) => {
          var a;
          (null == (a = E.value) || a.clearValidate(),
            (C.value = !!e.row.id),
            (q.value = e),
            ($.value = !0));
        },
      }),
      (e, a) => {
        const l = t("el-input"),
          r = t("el-form-item"),
          p = t("el-form"),
          c = t("el-button"),
          w = t("el-dialog"),
          b = o("trim"),
          f = o("prevent-label-click");
        return (
          u(),
          i(
            w,
            {
              modelValue: $.value,
              "onUpdate:modelValue": a[3] || (a[3] = (e) => ($.value = e)),
              title: `${e.$t(q.value.title)}`,
              width: "450px",
              "close-on-click-modal": !1,
              "close-on-press-escape": !1,
              "align-center": !0,
              loading: x.value,
              "append-to-body": "",
            },
            {
              footer: s(() => [
                n(
                  c,
                  {
                    type: "info",
                    onClick: a[2] || (a[2] = (e) => ($.value = !1)),
                  },
                  { default: s(() => [m(v(e.$t("base.cancel")), 1)]), _: 1 },
                ),
                n(
                  c,
                  { type: "primary", onClick: R, loading: x.value },
                  { default: s(() => [m(v(e.$t("base.confirm")), 1)]), _: 1 },
                  8,
                  ["loading"],
                ),
              ]),
              default: s(() => [
                d(
                  (u(),
                  i(
                    p,
                    {
                      ref_key: "ruleFormRef",
                      ref: E,
                      "label-width": "auto",
                      rules: y,
                      disabled: q.value.isView,
                      model: q.value.row,
                      "hide-required-asterisk": q.value.isView,
                      "label-position": "right",
                    },
                    {
                      default: s(() => [
                        n(
                          r,
                          { label: e.$t("env.group.req.name"), prop: "name" },
                          {
                            default: s(() => [
                              d(
                                n(
                                  l,
                                  {
                                    modelValue: q.value.row.name,
                                    "onUpdate:modelValue":
                                      a[0] ||
                                      (a[0] = (e) => (q.value.row.name = e)),
                                    placeholder: e.$t(
                                      "env.group.req.nameHolder",
                                    ),
                                    clearable: "",
                                    maxlength: 50,
                                    "show-word-limit": "",
                                  },
                                  null,
                                  8,
                                  ["modelValue", "placeholder"],
                                ),
                                [[b]],
                              ),
                            ]),
                            _: 1,
                          },
                          8,
                          ["label"],
                        ),
                        n(
                          r,
                          { label: e.$t("base.remark"), prop: "remark" },
                          {
                            default: s(() => [
                              d(
                                n(
                                  l,
                                  {
                                    modelValue: q.value.row.remark,
                                    "onUpdate:modelValue":
                                      a[1] ||
                                      (a[1] = (e) => (q.value.row.remark = e)),
                                    placeholder: e.$t("base.remark"),
                                    clearable: "",
                                    maxlength: 200,
                                    "show-word-limit": "",
                                  },
                                  null,
                                  8,
                                  ["modelValue", "placeholder"],
                                ),
                                [[b]],
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
                    ["rules", "disabled", "model", "hide-required-asterisk"],
                  )),
                  [[f]],
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
export { h as _ };
