import {
  d as e,
  v as a,
  r as l,
  o,
  h as t,
  f as s,
  w as i,
  b as r,
  e as u,
  t as c,
  i as n,
  ac as d,
  a3 as v,
} from "./index-BUIbb6Pa.js";
import { c as m } from "./ipResourceMock-CCd7H3CQ.js";
import { _ as y } from "./DynamicProxyForm.vue_vue_type_script_setup_true_lang-BLDcp8Iw.js";
import { _ as p } from "./DynamicTrafficGate.vue_vue_type_script_setup_true_lang-3aGxeuRD.js";
const f = e({
  __name: "DynamicProxyDialog",
  emits: ["success"],
  setup(e, { expose: f, emit: _ }) {
    const g = _,
      { t: b } = a.useI18n(),
      w = n(!1),
      x = n(!1),
      k = n(),
      R = n(),
      C = n(!1),
      D = async () => {
        var e, a;
        const l = await (null == (e = k.value) ? void 0 : e.validate()),
          o = null == (a = k.value) ? void 0 : a.getValue();
        if (l && o) {
          x.value = !0;
          try {
            (await m(o),
              v.success(b("ipResource.createSuccess")),
              (w.value = !1),
              g("success"));
          } catch (t) {
            console.error("[ipResource] failed to create dynamic proxy", {
              countryCode: o.countryCode,
              mode: o.mode,
              error: t,
            });
          } finally {
            x.value = !1;
          }
        }
      };
    return (
      f({
        open: async () => {
          var e, a;
          ((w.value = !0),
            (C.value = !1),
            await d(),
            await (null == (e = R.value) ? void 0 : e.loadSummary()),
            await d(),
            C.value && (await (null == (a = k.value) ? void 0 : a.reset())));
        },
      }),
      (e, a) => {
        const n = l("el-button"),
          d = l("el-dialog");
        return (
          o(),
          t(
            d,
            {
              modelValue: w.value,
              "onUpdate:modelValue": a[2] || (a[2] = (e) => (w.value = e)),
              title: s(b)("ipResource.createDynamicProxy"),
              width: "620px",
              "align-center": "",
              "close-on-click-modal": !1,
            },
            {
              footer: i(() => [
                r(
                  n,
                  {
                    disabled: x.value,
                    onClick: a[1] || (a[1] = (e) => (w.value = !1)),
                  },
                  { default: i(() => [u(c(s(b)("base.cancel")), 1)]), _: 1 },
                  8,
                  ["disabled"],
                ),
                r(
                  n,
                  {
                    type: "primary",
                    disabled: !C.value,
                    loading: x.value,
                    onClick: D,
                  },
                  {
                    default: i(() => [u(c(s(b)("ipResource.create")), 1)]),
                    _: 1,
                  },
                  8,
                  ["disabled", "loading"],
                ),
              ]),
              default: i(() => [
                r(
                  p,
                  {
                    ref_key: "dynamicTrafficGateRef",
                    ref: R,
                    "auto-load": !1,
                    onAvailabilityChange: a[0] || (a[0] = (e) => (C.value = e)),
                  },
                  {
                    default: i(() => [
                      r(y, { ref_key: "dynamicFormRef", ref: k }, null, 512),
                    ]),
                    _: 1,
                  },
                  512,
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
});
export { f as _ };
