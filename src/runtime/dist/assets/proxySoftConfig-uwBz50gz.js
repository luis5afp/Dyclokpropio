import { E as t } from "./index-90lhaiW6.js";
import { _ as e } from "./proxySoftContent.vue_vue_type_script_setup_true_lang-BH1G_AGZ.js";
import {
  d as a,
  aW as o,
  R as r,
  i as s,
  o as i,
  c as n,
  b as l,
  w as v,
  a as d,
  t as m,
  f as p,
  C as c,
  am as u,
  _ as f,
} from "./index-BUIbb6Pa.js";
import { i as x } from "./proxyProviderAvailability-Dl68x0Bx.js";
import "./proxySoftItem-B7tAwO_8.js";
import "./envProxyItems-DIhzCyp-.js";
import "./proxyCheckButton-qJacjpSf.js";
import "./proxyUtil-OnkkuXcX.js";
const y = { class: "tw-pt-[20px] tw-h-full" },
  w = {
    class:
      "tw-mt-[24px] tw-pt-[24px] tw-border-t-[1px] tw-border-[var(--border-color-base)] tw-mr-[20px] tw-text-[14px] tw-text-themeColor7",
  },
  _ = { class: "" },
  b = { class: "tw-mt-[24px]" },
  h = f(
    a({
      __name: "proxySoftConfig",
      setup(a) {
        var f;
        const h = o(),
          { nodeMavenSwitch: P } = r(h);
        let I = c(() =>
          [
            { name: "IPFLY", code: u.IPFLY, href: "#IPFLY" },
            { name: "NodeMaven", code: u.NODE_MAVEN, href: "#NODE_MAVEN" },
            { name: "922S5", code: u.S5PROXY, href: "#S5PROXY" },
            { name: "IPRoyal", code: u.IPROYAL, href: "#IPROYAL" },
          ].filter((t) => !x(t.code) && (P.value || t.code !== u.NODE_MAVEN)),
        );
        const S = s(null == (f = I.value[0]) ? void 0 : f.code),
          L = s(!1),
          A = s();
        async function N() {
          var t;
          try {
            ((L.value = !0),
              await (null == (t = A.value) ? void 0 : t.totalSubmit()));
          } finally {
            L.value = !1;
          }
        }
        function O(t) {
          var e;
          S.value =
            (null == (e = I.value.find((e) => e.href == t))
              ? void 0
              : e.code) || u.IPFLY;
        }
        return (a, o) => (
          i(),
          n("div", y, [
            l(
              t,
              {
                stepArray: p(I),
                "show-bottom-btn": !0,
                onConfirm: N,
                submitLoading: L.value,
                onClickAnchor: O,
              },
              {
                anchorBottom: v(() => [
                  d("div", w, [
                    d("div", _, [
                      d(
                        "div",
                        null,
                        m(a.$t("env.env.req.comingSoon")) + ":",
                        1,
                      ),
                      o[0] ||
                        (o[0] = d(
                          "div",
                          { class: "tw-my-[12px]" },
                          "BrightData",
                          -1,
                        )),
                      o[1] || (o[1] = d("div", null, "Oxylabs", -1)),
                    ]),
                    d("div", b, [
                      d(
                        "div",
                        null,
                        m(a.$t("env.env.req.waitingOnline")) + ":",
                        1,
                      ),
                      o[2] ||
                        (o[2] = d(
                          "div",
                          { class: "tw-my-[12px]" },
                          "IPHTML",
                          -1,
                        )),
                      o[3] ||
                        (o[3] = d(
                          "div",
                          { class: "tw-mb-[12px]" },
                          "Rolaip",
                          -1,
                        )),
                      o[4] || (o[4] = d("div", null, "Kookey", -1)),
                    ]),
                  ]),
                ]),
                default: v(() => [
                  l(
                    e,
                    {
                      activeName: S.value,
                      ref_key: "proxySoftContentRef",
                      ref: A,
                    },
                    null,
                    8,
                    ["activeName"],
                  ),
                ]),
                _: 1,
              },
              8,
              ["stepArray", "submitLoading"],
            ),
          ])
        );
      },
    }),
    [["__scopeId", "data-v-51085aa8"]],
  );
export { h as default };
