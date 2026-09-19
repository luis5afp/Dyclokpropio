import {
  d as e,
  v as a,
  r as t,
  q as l,
  o as s,
  h as i,
  w as p,
  a as o,
  x as r,
  c,
  t as n,
  b as u,
  e as d,
  f as m,
  hk as v,
  X as w,
  i as x,
  C as f,
  hl as b,
  g6 as _,
  ev as h,
  D as g,
  _ as k,
} from "./index-BUIbb6Pa.js";
import { _ as y } from "./createApiParamsComp.vue_vue_type_style_index_0_lang-DR8Q4JPa.js";
import "./index-rtKG2tmD.js";
import "./timeZone-D3UW65MQ.js";
import "./TableFieldDialog-BI1BUo05.js";
import "./sortable.esm-DneA_jWz.js";
import "./LazyRow.vue_vue_type_script_setup_true_lang-C9dK0oMf.js";
const E = { class: "tw-flex tw-justify-center" },
  A = ["src"],
  j = { class: "tw-text-[16px]" },
  C = { class: "tw-flex tw-flex-row tw-w-full tw-items-center tw-mb-[20px]" },
  B = {
    class:
      "tw-flex tw-bg-[var(--card-base-bg-color)] tw-p-[8px_12px] tw-rounded-[8px] tw-mr-[10px] tw-w-0 tw-flex-1",
  },
  D = { class: "tw-break-all" },
  M = { class: "c-flex tw-w-full" },
  U = k(
    e({
      __name: "createApiResDialog",
      setup(e, { expose: k }) {
        const { t: U, locale: V } = a.useI18n(),
          z = x(!1),
          T = x({ prefix: "", token: "", id: "" }),
          Z = x(!1),
          F = x(!1),
          H = f(
            () =>
              T.value.prefix +
              "?token=" +
              T.value.token +
              (Z.value ? "" : "&id=" + T.value.id),
          ),
          I = () => {
            _(H.value);
          },
          L = () => {
            let e = Z.value
              ? V.value === h.ZH
                ? "https://help.dicloak.com/zh/%e5%9b%a2%e9%98%9f%e7%ae%a1%e7%90%86-api%e5%88%9b%e5%bb%ba%e6%88%90%e5%91%98/#nav5"
                : "https://help.dicloak.com/api-create-member/#nav5"
              : V.value === h.ZH
                ? "https://help.dicloak.com/zh/%E5%9B%A2%E9%98%9F%E7%AE%A1%E7%90%86-api%E5%88%9B%E5%BB%BA%E6%88%90%E5%91%98/"
                : "https://help.dicloak.com/api-create-member/";
            g.api.openUrl(e);
          };
        return (
          k({
            openDialog: async (e) => {
              try {
                if (
                  ((z.value = !0),
                  (F.value = !0),
                  (Z.value = e.isEditApi),
                  e.isEditApi)
                ) {
                  const a = await b();
                  ((e.prefix = a.domain), (e.token = a.token));
                }
                T.value = e;
              } finally {
                F.value = !1;
              }
            },
          }),
          (e, a) => {
            const x = t("el-button"),
              f = t("el-dialog"),
              b = l("loadingV2");
            return (
              s(),
              i(
                f,
                {
                  modelValue: z.value,
                  "onUpdate:modelValue": a[0] || (a[0] = (e) => (z.value = e)),
                  width: "650px",
                  "close-on-click-modal": !1,
                  "close-on-press-escape": !1,
                  "align-center": !0,
                  "body-class": "tw-max-h-[80vh] tw-overflow-y-auto",
                },
                {
                  header: p(() => [
                    o("div", E, [
                      Z.value
                        ? w("", !0)
                        : (s(),
                          c(
                            "img",
                            {
                              key: 0,
                              class: "tw-w-[16px] tw-mr-[4px]",
                              src: m(v),
                            },
                            null,
                            8,
                            A,
                          )),
                      o(
                        "span",
                        j,
                        n(
                          Z.value
                            ? m(U)("org.apiCreateMember.editedApiUrl")
                            : m(U)("org.apiCreateMember.createdApiUrl"),
                        ),
                        1,
                      ),
                    ]),
                  ]),
                  default: p(() => [
                    o("div", C, [
                      r(
                        (s(),
                        c("div", B, [
                          a[1] ||
                            (a[1] = o(
                              "span",
                              {
                                class:
                                  "tw-mr-[8px] tw-text-[var(--text-color-light1)]",
                              },
                              "GET: ",
                              -1,
                            )),
                          o("span", D, n(H.value), 1),
                        ])),
                        [[b, F.value]],
                      ),
                      u(
                        x,
                        {
                          plain: "",
                          type: "primary",
                          onClick: I,
                          disabled: F.value,
                        },
                        {
                          default: p(() => [
                            a[2] ||
                              (a[2] = o(
                                "i",
                                {
                                  class:
                                    "iconfont icon-copy tw-mr-[4px] tw-text-[16px]",
                                },
                                null,
                                -1,
                              )),
                            d(" " + n(e.$t("openapi.tip18")), 1),
                          ]),
                          _: 1,
                        },
                        8,
                        ["disabled"],
                      ),
                    ]),
                    u(y, { "is-edit-api": Z.value }, null, 8, ["is-edit-api"]),
                    o("div", M, [
                      u(
                        x,
                        {
                          class: "tw-mt-[6px] tw-text-[14px]",
                          type: "primary",
                          link: "",
                          onClick: L,
                        },
                        {
                          default: p(() => [
                            d(n(m(U)("org.apiCreateMember.viewTutorial")), 1),
                          ]),
                          _: 1,
                        },
                      ),
                    ]),
                  ]),
                  _: 1,
                },
                8,
                ["modelValue"],
              )
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-1f644b90"]],
  );
export { U as default };
