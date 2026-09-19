import {
  d as t,
  v as e,
  c as a,
  a as i,
  t as o,
  f as s,
  F as r,
  z as l,
  i as n,
  C as c,
  o as p,
} from "./index-BUIbb6Pa.js";
const w = {
    class:
      "tw-rounded-lg tw-border tw-border-[var(--dialog-border-color)] tw-bg-[var(--bg-light1)] tw-px-4 tw-py-3 tw-text-sm tw-text-[var(--text-color-light2)]",
    "aria-labelledby": "ip-purchase-important-notice-title",
  },
  u = { class: "tw-flex tw-items-start tw-justify-between tw-gap-4" },
  d = {
    id: "ip-purchase-important-notice-title",
    class:
      "tw-min-w-0 tw-font-medium tw-leading-5 tw-text-[var(--text-color-base)]",
  },
  v = ["aria-expanded"],
  m = {
    id: "ip-purchase-important-notice-content",
    class: "tw-mt-1 tw-leading-5",
  },
  b = { key: 0, class: "tw-m-0 tw-grid tw-list-none tw-gap-2 tw-p-0" },
  h = {
    key: 1,
    class: "tw-m-0 tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap",
  },
  g = t({
    __name: "IpPurchaseImportantNotice",
    setup(t) {
      const { t: g } = e.useI18n(),
        x = n(!1),
        f = c(() => g("ipResource.purchaseImportantNoticeContent").split("\n"));
      return (t, e) => (
        p(),
        a("section", w, [
          i("div", u, [
            i("h3", d, o(s(g)("ipResource.purchaseImportantNoticeTitle")), 1),
            i(
              "button",
              {
                type: "button",
                class:
                  "tw-shrink-0 tw-border-0 tw-bg-transparent tw-p-0 tw-leading-5 tw-text-[var(--primary-color)] hover:tw-text-[var(--primary-color-light1)] focus-visible:tw-rounded focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-[var(--primary-color)]",
                "aria-expanded": x.value,
                "aria-controls": "ip-purchase-important-notice-content",
                onClick: e[0] || (e[0] = (t) => (x.value = !x.value)),
              },
              o(
                x.value
                  ? s(g)("ipResource.purchaseImportantNoticeClose")
                  : s(g)("ipResource.purchaseImportantNoticeOpen"),
              ),
              9,
              v,
            ),
          ]),
          i("div", m, [
            x.value
              ? (p(),
                a("ol", b, [
                  (p(!0),
                  a(
                    r,
                    null,
                    l(
                      f.value,
                      (t, e) => (
                        p(),
                        a("li", { key: e }, "(" + o(e + 1) + ") " + o(t), 1)
                      ),
                    ),
                    128,
                  )),
                ]))
              : (p(), a("p", h, "(1) " + o(f.value[0]), 1)),
          ]),
        ])
      );
    },
  });
export { g as _ };
