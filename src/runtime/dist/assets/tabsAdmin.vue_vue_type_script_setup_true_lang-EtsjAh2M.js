import {
  d as t,
  k5 as e,
  r as l,
  o as a,
  c as s,
  a as i,
  t as n,
  b as d,
  w as u,
  f as p,
  e as c,
  C as o,
} from "./index-BUIbb6Pa.js";
import { _ as r } from "./tipButton.vue_vue_type_script_setup_true_lang-D61jtuVu.js";
const w = { class: "" },
  m = { class: "tw-mt-6" },
  b = { class: "tw-text-[14px]" },
  f = { class: "tw-grid tw-grid-cols-2 tw-gap-3 tw-mt-3" },
  y = { class: "tw-mt-6" },
  _ = { class: "tw-text-[14px]" },
  x = { class: "tw-mt-3 s-flex tw-gap-x-2" },
  v = { class: "tw-text-subText tw-text-[14px]" },
  g = t({
    __name: "tabsAdmin",
    props: { setLoading: {} },
    setup(t) {
      const g = e(),
        h = o(() => g.state && g.selectEnv.length > 1),
        C = o(() =>
          g.website.split("\n").filter((t) => !!t && t.startsWith("http")),
        );
      return (e, o) => {
        const $ = l("el-button"),
          k = l("el-input"),
          T = l("el-switch");
        return (
          a(),
          s("div", w, [
            i("div", m, [
              i("h4", b, n(e.$t("sync.tip56")), 1),
              i("div", f, [
                d(r, null, {
                  default: u(() => [
                    d(
                      $,
                      {
                        disabled: !h.value,
                        class: "c-flex tw-w-full !tw-m-0",
                        plain: "",
                        type: "primary",
                        onClick:
                          o[0] ||
                          (o[0] = (e) => p(g).syncUnifiedTab(t.setLoading)),
                      },
                      { default: u(() => [c(n(e.$t("sync.tip57")), 1)]), _: 1 },
                      8,
                      ["disabled"],
                    ),
                  ]),
                  _: 1,
                }),
                d(r, null, {
                  default: u(() => [
                    d(
                      $,
                      {
                        disabled: !h.value,
                        class: "c-flex tw-w-full !tw-m-0",
                        plain: "",
                        type: "primary",
                        onClick:
                          o[1] ||
                          (o[1] = (e) => p(g).syncCloseOtherTab(t.setLoading)),
                      },
                      { default: u(() => [c(n(e.$t("sync.tip58")), 1)]), _: 1 },
                      8,
                      ["disabled"],
                    ),
                  ]),
                  _: 1,
                }),
                d(r, null, {
                  default: u(() => [
                    d(
                      $,
                      {
                        disabled: !h.value,
                        class: "c-flex tw-w-full !tw-m-0",
                        plain: "",
                        type: "primary",
                        onClick:
                          o[2] ||
                          (o[2] = (e) =>
                            p(g).syncCloseCurrentTab(t.setLoading)),
                      },
                      { default: u(() => [c(n(e.$t("sync.tip59")), 1)]), _: 1 },
                      8,
                      ["disabled"],
                    ),
                  ]),
                  _: 1,
                }),
                d(r, null, {
                  default: u(() => [
                    d(
                      $,
                      {
                        disabled: !h.value,
                        class: "c-flex tw-w-full !tw-m-0",
                        plain: "",
                        type: "primary",
                        onClick:
                          o[3] ||
                          (o[3] = (e) => p(g).syncCloseBlankTab(t.setLoading)),
                      },
                      { default: u(() => [c(n(e.$t("sync.tip60")), 1)]), _: 1 },
                      8,
                      ["disabled"],
                    ),
                  ]),
                  _: 1,
                }),
              ]),
            ]),
            i("div", y, [
              i("h4", _, n(e.$t("sync.tip63")), 1),
              d(
                k,
                {
                  modelValue: p(g).website,
                  "onUpdate:modelValue":
                    o[4] || (o[4] = (t) => (p(g).website = t)),
                  placeholder: e.$t("sync.tip65"),
                  rows: { minRows: 2, maxRows: 5 },
                  class: "tw-mt-3 tw-break-all",
                  resize: "none",
                  type: "textarea",
                },
                null,
                8,
                ["modelValue", "placeholder"],
              ),
              i("div", x, [
                d(r, null, {
                  default: u(() => [
                    d(
                      T,
                      {
                        modelValue: p(g).currentTabOpenSiteState,
                        "onUpdate:modelValue":
                          o[5] ||
                          (o[5] = (t) => (p(g).currentTabOpenSiteState = t)),
                        disabled: !h.value,
                      },
                      null,
                      8,
                      ["modelValue", "disabled"],
                    ),
                  ]),
                  _: 1,
                }),
                i("p", v, n(e.$t("sync.tip64")), 1),
              ]),
              d(r, null, {
                default: u(() => [
                  d(
                    $,
                    {
                      disabled: !h.value || !C.value.length,
                      class: "tw-mt-3 tw-w-full",
                      type: "primary",
                      onClick:
                        o[6] ||
                        (o[6] = (e) =>
                          p(g).syncOpenWebsite(C.value, t.setLoading)),
                    },
                    { default: u(() => [c(n(e.$t("sync.tip63")), 1)]), _: 1 },
                    8,
                    ["disabled"],
                  ),
                ]),
                _: 1,
              }),
            ]),
          ])
        );
      };
    },
  });
export { g as _ };
