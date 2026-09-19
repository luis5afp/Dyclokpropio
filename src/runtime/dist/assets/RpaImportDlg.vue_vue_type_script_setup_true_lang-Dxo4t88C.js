import {
  d as e,
  hQ as a,
  v as l,
  k1 as t,
  i as r,
  V as o,
  r as s,
  q as i,
  o as n,
  h as u,
  w as p,
  a as d,
  x as v,
  f as m,
  eZ as c,
  b as f,
  k3 as k,
  e as w,
  t as g,
  C as D,
  a3 as y,
  k4 as N,
  n as x,
} from "./index-BUIbb6Pa.js";
import { E as b } from "./index-UZcsr-ei.js";
const h = { class: "tw-mt-[16px]" },
  _ = ["innerHTML"],
  F = {
    class:
      "tw-w-full tw-text-center tw-text-[var(--text-color-light1)] tw-mt-[10px] tw-text-[14px]",
  },
  j = e({
    __name: "RpaImportDlg",
    setup(e, { expose: j }) {
      const R = a(),
        { t: q } = l.useI18n(),
        C = r(!1),
        { freeRpaCreateTip: T } = t(),
        V = { taskName: "", fileData: void 0, jsonData: "", rpaFileName: "" },
        I = r(o.cloneDeep(V)),
        J = D(() => ({
          taskName: [
            {
              required: !0,
              message: q("rpa.task.req.taskNameHolder"),
              trigger: "blur",
            },
          ],
          fileData: [
            {
              required: !0,
              message: q("env.env.req.fileHolder"),
              trigger: "change",
            },
          ],
        })),
        S = r(""),
        H = q("rpa2.importAutomaScript"),
        A = r(),
        E = r(),
        O = async (e) => {
          const a = new FileReader();
          ((a.onload = (a) => {
            var l, t;
            try {
              const t = null == (l = a.target) ? void 0 : l.result,
                r = JSON.parse(t);
              if ((console.log("解析后的JSON数据:", r), !o.isObject(r)))
                throw new Error("typeError");
              ((I.value.jsonData = t), (I.value.rpaFileName = e.name));
            } catch (r) {
              (console.error("JSON解析失败", r),
                (I.value.jsonData = ""),
                (I.value.rpaFileName = ""),
                (I.value.fileData = void 0),
                null == (t = E.value) || t.delFile(),
                y.warning(q("rpa2.uploadFailedInvalidJson")));
            }
          }),
            (a.onerror = (e) => {
              (console.error("文件读取失败", e),
                y.error(q("rpa2.uploadFailedInvalidJson")));
            }),
            a.readAsText(e));
        },
        U = r(!1);
      async function L() {
        var e;
        try {
          ((U.value = !0),
            await (null == (e = A.value) ? void 0 : e.validate()));
          const a = await N({
            name: I.value.taskName,
            jsonData: I.value.jsonData,
            rpaFileName: I.value.rpaFileName,
          });
          if (!a.id) return void y.error(q("sync.tip68"));
          x.push({
            path: "/rpa/rpaTaskEdit",
            query: {
              taskId: a.id,
              previousRoute: R.name,
              activeCategory: S.value,
            },
          });
        } finally {
          U.value = !1;
        }
      }
      return (
        j({
          async openDialog(e) {
            var a, l;
            (await T()) ||
              ((S.value = e || ""),
              (C.value = !0),
              (I.value = o.cloneDeep(V)),
              (I.value.taskName = "RPA task-" + new Date().getTime()),
              null == (a = E.value) || a.delFile(),
              null == (l = A.value) || l.resetFields());
          },
        }),
        (e, a) => {
          const l = s("el-input"),
            t = s("el-form-item"),
            r = s("el-button"),
            o = s("el-dialog"),
            D = i("prevent-label-click");
          return (
            n(),
            u(
              o,
              {
                title: m(q)("rpa2.importRPAWorkflow"),
                modelValue: C.value,
                "onUpdate:modelValue": a[3] || (a[3] = (e) => (C.value = e)),
                width: "650px",
                "close-on-click-modal": !1,
              },
              {
                footer: p(() => [
                  f(
                    r,
                    {
                      type: "info",
                      onClick: a[2] || (a[2] = (e) => (C.value = !1)),
                    },
                    { default: p(() => [w(g(m(q)("base.cancel")), 1)]), _: 1 },
                  ),
                  f(
                    r,
                    { type: "primary", onClick: L, loading: U.value },
                    { default: p(() => [w(g(m(q)("base.confirm")), 1)]), _: 1 },
                    8,
                    ["loading"],
                  ),
                ]),
                default: p(() => [
                  d("div", h, [
                    v(
                      (n(),
                      u(
                        m(c),
                        {
                          rules: J.value,
                          model: I.value,
                          ref_key: "formRef",
                          ref: A,
                          "label-width": "auto",
                        },
                        {
                          default: p(() => [
                            f(
                              t,
                              {
                                label: m(q)("rpa.task.list.taskName"),
                                prop: "taskName",
                              },
                              {
                                default: p(() => [
                                  f(
                                    l,
                                    {
                                      modelValue: I.value.taskName,
                                      "onUpdate:modelValue":
                                        a[0] ||
                                        (a[0] = (e) => (I.value.taskName = e)),
                                      placeholder: m(q)(
                                        "rpa.task.req.taskNameHolder",
                                      ),
                                      clearable: "",
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
                            f(
                              t,
                              {
                                label: m(q)("rpa2.processFile"),
                                prop: "fileData",
                              },
                              {
                                default: p(() => [
                                  d("div", null, [
                                    d(
                                      "span",
                                      {
                                        class:
                                          "tw-text-[var(--text-color-light1)] tw-leading-[1.2]",
                                        innerHTML: m(H),
                                      },
                                      null,
                                      8,
                                      _,
                                    ),
                                    f(
                                      r,
                                      {
                                        class: "!tw-p-[0] tw-leading-[1.2]",
                                        link: "",
                                        type: "primary",
                                        onClick: m(k),
                                      },
                                      {
                                        default: p(() => [
                                          w(
                                            g(m(q)("rpa2.viewImportTutorial")),
                                            1,
                                          ),
                                        ]),
                                        _: 1,
                                      },
                                      8,
                                      ["onClick"],
                                    ),
                                  ]),
                                  f(
                                    b,
                                    {
                                      ref_key: "eUploadRef",
                                      ref: E,
                                      fileData: I.value.fileData,
                                      "onUpdate:fileData":
                                        a[1] ||
                                        (a[1] = (e) => (I.value.fileData = e)),
                                      accept: ["json"],
                                      "handle-file-upload": O,
                                      fileSize: 5,
                                      class: "tw-w-[100%]",
                                    },
                                    {
                                      "bottom-module": p(() => [
                                        d(
                                          "div",
                                          F,
                                          g(m(q)("rpa2.onlySupportJson")),
                                          1,
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["fileData"],
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
                        ["rules", "model"],
                      )),
                      [[D]],
                    ),
                  ]),
                ]),
                _: 1,
              },
              8,
              ["title", "modelValue"],
            )
          );
        }
      );
    },
  });
export { j as _ };
