import {
  v as e,
  ly as n,
  D as a,
  lz as t,
  i,
  a3 as s,
  a5 as o,
} from "./index-BUIbb6Pa.js";
function r(r) {
  const l = i(!1),
    u = i(!1),
    { t: p } = e.useI18n();
  function w() {
    var e;
    n(a.isClient) && (null == (e = r.value) || e.acceptParams());
  }
  return {
    handlePreLoginLineError: function (e) {
      return (
        !!n(a.isClient) &&
        !!t(e) &&
        (l.value
          ? (u.value ||
              ((u.value = !0),
              s({
                type: "warning",
                duration: 6e3,
                showClose: !0,
                message: o(
                  "span",
                  { class: "tw-inline-flex tw-items-center tw-gap-x-1" },
                  [
                    o("span", null, p("preLoginLineDiagnosis.weakGuidePrefix")),
                    o(
                      "button",
                      {
                        class:
                          "tw-text-main tw-underline tw-cursor-pointer tw-bg-transparent tw-border-0 tw-p-0",
                        type: "button",
                        onClick: () => {
                          ((u.value = !1), w());
                        },
                      },
                      p("preLoginLineDiagnosis.weakGuideAction"),
                    ),
                  ],
                ),
                onClose: () => {
                  u.value = !1;
                },
              })),
            !0)
          : ((l.value = !0), w(), !0))
      );
    },
    openDiagnosis: w,
  };
}
export { r as u };
