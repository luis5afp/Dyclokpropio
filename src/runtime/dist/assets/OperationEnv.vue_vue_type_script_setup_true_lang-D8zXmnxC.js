import a from "./RpaSelectEnvTable-DYJ82JBS.js";
import { _ as e } from "./RpaSelectEnvTableDrawer.vue_vue_type_script_setup_true_lang-H9iu7eXj.js";
import {
  d as t,
  v as n,
  jW as s,
  R as l,
  Q as i,
  o as u,
  c as v,
  f as d,
  h as o,
  kl as r,
  X as c,
  F as k,
  i as m,
  km as p,
  em as g,
  N as f,
  kn as L,
  a3 as y,
} from "./index-BUIbb6Pa.js";
const E = t({
  __name: "OperationEnv",
  props: { taskId: {} },
  emits: ["nextPage"],
  setup(t, { emit: E }) {
    let T = t;
    const { t: I } = n.useI18n();
    let _ = s(),
      D = E;
    const { selectEnvMaxNum: w } = l(i());
    let b = m(),
      h = m();
    const x = m(!1),
      S = m(!1),
      M = m("");
    async function R(a, e) {
      var t;
      if (S.value) return !1;
      S.value = !0;
      let n = !1;
      try {
        (await p(T.taskId, { envIdList: a.map((a) => a.id) }),
          null == (t = h.value) || t.emptySelectedList(),
          await O(),
          e && D("nextPage"),
          (n = !0));
      } catch (s) {
        g(s);
      } finally {
        await f(() => {
          S.value = !1;
        });
      }
      return n;
    }
    async function j(a) {
      (await R(a, !1)) && (x.value = !1);
    }
    async function O() {
      var a;
      (await _.getEditTaskData(T.taskId),
        console.log("更新任务数据完成"),
        null == (a = h.value) || a.onSearch(),
        _.getPendingTaskList());
    }
    async function P({ envId: a }) {
      if (!M.value) {
        M.value = a;
        try {
          (await L({ taskId: T.taskId, envId: a }),
            y.success(I("env.env.shareDialog.operatorSuccess")),
            await O());
        } catch (e) {
          g(e);
        } finally {
          await f(() => {
            M.value = "";
          });
        }
      }
    }
    return (t, n) => {
      var s, l;
      return (
        u(),
        v(
          k,
          null,
          [
            d(_).editTaskData.id
              ? (u(),
                o(
                  a,
                  {
                    key: 0,
                    envList: d(_).editTaskData.envList || [],
                    taskId: d(_).editTaskId,
                    isEdit: d(_).isTargetTaskEdit,
                    envMaxLength:
                      (null == (s = d(_).editTaskData) ? void 0 : s.runType) ===
                      d(r).CLOUD
                        ? d(w)
                        : 0,
                    submitLoading: S.value,
                    deleteLoadingEnvId: M.value,
                    ref_key: "rpaSelectEnvTableRef",
                    ref: h,
                    onAddEnv: n[0] || (n[0] = (a) => (x.value = !0)),
                    onDelEnv: P,
                    onSubmit: n[1] || (n[1] = (a) => R(a, !0)),
                  },
                  null,
                  8,
                  [
                    "envList",
                    "taskId",
                    "isEdit",
                    "envMaxLength",
                    "submitLoading",
                    "deleteLoadingEnvId",
                  ],
                ))
              : c("", !0),
            x.value
              ? (u(),
                o(
                  e,
                  {
                    key: 1,
                    modelValue: x.value,
                    "onUpdate:modelValue":
                      n[2] || (n[2] = (a) => (x.value = a)),
                    envMaxLength:
                      (null == (l = d(_).editTaskData) ? void 0 : l.runType) ===
                      d(r).CLOUD
                        ? d(w)
                        : 0,
                    submitLoading: S.value,
                    ref_key: "rpaSelectEnvTableDrawerRef",
                    ref: b,
                    onAddEnv: j,
                  },
                  null,
                  8,
                  ["modelValue", "envMaxLength", "submitLoading"],
                ))
              : c("", !0),
          ],
          64,
        )
      );
    };
  },
});
export { E as _ };
