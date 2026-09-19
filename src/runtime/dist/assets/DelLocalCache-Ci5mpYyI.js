import { C as a } from "./index-C6tOf3zW.js";
import { d as e, P as l, o, h as s, aJ as t } from "./index-BUIbb6Pa.js";
import "./Tip.vue_vue_type_script_setup_true_lang-DBJcGLEl.js";
import "./CustomRadioGroup-Dk-imFdD.js";
const u = e({
  __name: "DelLocalCache",
  props: { modelValue: {}, isGlobal: { type: Boolean } },
  setup(e) {
    const u = e;
    return (
      l(() => {
        u.modelValue.localDataConfig.dataType ||
          (u.modelValue.localDataConfig.dataType = []);
      }),
      (e, l) => (
        o(),
        s(
          a,
          t(
            {
              modelValue: u.modelValue,
              "onUpdate:modelValue": l[0] || (l[0] = (a) => (u.modelValue = a)),
              isGlobal: u.isGlobal,
            },
            e.$attrs,
          ),
          null,
          16,
          ["modelValue", "isGlobal"],
        )
      )
    );
  },
});
export { u as default };
