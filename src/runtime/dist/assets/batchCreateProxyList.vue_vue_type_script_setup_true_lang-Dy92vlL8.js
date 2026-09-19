import { E as e } from "./index-rtKG2tmD.js";
import {
  d as o,
  v as t,
  i as l,
  V as a,
  r as n,
  o as r,
  c as s,
  a as p,
  b as c,
  w as i,
  ax as u,
  f as d,
  O as y,
  t as v,
  F as x,
  e as f,
  h as m,
  X as I,
  as as w,
  an as h,
  C as b,
  cj as g,
  _ as k,
} from "./index-BUIbb6Pa.js";
import { e as C } from "./country-flag.esm-Bg8BdAZu.js";
const P = { class: "country-wrapper" },
  _ = { class: "country-item" },
  q = { key: 0, class: "country-text" },
  L = { class: "country-item" },
  R = { class: "country-box" },
  j = { key: 0, class: "country-text" },
  D = k(
    o({
      __name: "PoxyIpColumnItem",
      props: { data: { default: () => ({}) } },
      emits: ["update:data"],
      setup(e, { expose: o, emit: k }) {
        let D = e,
          E = k;
        const { t: F } = t.useI18n();
        let U = l("icon-Reexecute"),
          A = l(""),
          N = l(a.cloneDeep(D.data)),
          { checkProxyResult: S, checkProxyFromApp: T } = g();
        async function W() {
          let e = null;
          J();
          let [o] = await w(T(a.cloneDeep(D.data), h.Custom, "", "global", !1));
          e = o;
          let t = S.value;
          return (
            S.value.success &&
              (N.value.proxyIpInfo ||
                (N.value.proxyIpInfo = {
                  countryCode: "",
                  country: "",
                  ip: "",
                  connect: !1,
                }),
              (N.value.proxyIpInfo.countryCode = t.countryCode),
              (N.value.proxyIpInfo.country = t.country),
              (N.value.proxyIpInfo.ip = t.ip),
              (N.value.proxyIpInfo.connect = !0),
              z("icon-detectionsuccessful", "var(--primary-color-light1)")),
            console.log(t, "newCheckProxyResult"),
            (!e && t.success) ||
              ((N.value.proxyIpInfo.connect = !1),
              z("icon-detectionfailed", "var(--danger-color)")),
            E("update:data", N.value),
            t
          );
        }
        function z(e, o) {
          ((U.value = e), (A.value = o));
        }
        const H = b(() =>
          "icon-Reexecute" == U.value
            ? F("proxy.proxy.list.ipCheck")
            : "icon-detectionfailed" == U.value
              ? F("proxy.proxy.list.ipCheckErr")
              : "icon-detectionsuccessful" == U.value
                ? F("proxy.proxy.list.ipCheckSuccess")
                : F("proxy.proxy.list.status.ing"),
        );
        let J = () => {
          z(
            "icon-opening dic-animate-spin tw-animate-spin",
            "var(--btn-success-color)",
          );
        };
        return (
          o({ handleDetection: W }),
          (e, o) => {
            var t, l, a, w, h, b, g;
            const k = n("el-tooltip");
            return (
              r(),
              s("div", P, [
                p("div", _, [
                  c(
                    k,
                    { effect: "dark", content: H.value, placement: "top" },
                    {
                      default: i(() => [
                        p(
                          "i",
                          {
                            class: y([
                              "iconfont",
                              "icon-successful",
                              d(U),
                              "m-r-4",
                            ]),
                            style: u({ color: d(A), cursor: "pointer" }),
                            onClick: o[0] || (o[0] = () => W()),
                          },
                          null,
                          6,
                        ),
                      ]),
                      _: 1,
                    },
                    8,
                    ["content"],
                  ),
                  (null == (t = d(N).proxyIpInfo) ? void 0 : t.ip)
                    ? (r(),
                      s(
                        "div",
                        q,
                        v(null == (l = d(N).proxyIpInfo) ? void 0 : l.ip),
                        1,
                      ))
                    : (r(), s(x, { key: 1 }, [f("--")], 64)),
                ]),
                p("div", L, [
                  p("div", R, [
                    (null == (a = d(N).proxyIpInfo) ? void 0 : a.countryCode)
                      ? (r(),
                        m(
                          d(C),
                          {
                            key: 0,
                            country:
                              null == (w = d(N).proxyIpInfo)
                                ? void 0
                                : w.countryCode,
                            size: "small",
                            style: { transform: "scale(0.4)" },
                          },
                          null,
                          8,
                          ["country"],
                        ))
                      : I("", !0),
                  ]),
                  (null == (h = d(N).proxyIpInfo) ? void 0 : h.country)
                    ? (r(),
                      s(
                        "div",
                        j,
                        v(
                          (null == (b = d(N).proxyIpInfo)
                            ? void 0
                            : b.countryCode) +
                            "-" +
                            (null == (g = d(N).proxyIpInfo)
                              ? void 0
                              : g.country),
                        ),
                        1,
                      ))
                    : (r(), s(x, { key: 1 }, [f("--")], 64)),
                ]),
              ])
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-1174613e"]],
  ),
  E = { class: "tw-flex tw-flex-col tw-w-full" },
  F = { class: "tw-flex tw-items-center tw-mb-[16px] tw-gap-[16px]" },
  U = { class: "tw-text-[14px] tw-text-[var(--el-header-text-color-regular)]" },
  A = { class: "tw-h-full tw-min-h-[300px]" },
  N = o({
    __name: "batchCreateProxyList",
    props: { proxyList: {} },
    emits: ["update:proxyList"],
    setup(o, { expose: a, emit: u }) {
      let { t: y } = t.useI18n(),
        x = o,
        I = l(),
        h = u,
        g = b({
          get: () => x.proxyList,
          set: (e) => {
            h("update:proxyList", e);
          },
        });
      const k = l(new Map()),
        C = l(!1),
        P = b(() => [
          { prop: "type", label: y("env.env.req.proxyType") },
          { prop: "host", label: y("env.env.req.proxyHost"), minWidth: 100 },
          { prop: "port", label: y("env.env.req.proxyPort") },
          { prop: "userName", label: y("env.env.req.proxyUserName") },
          { prop: "ipAddrType", label: y("env.env.req.ipProtocol") },
          { prop: "passwd", label: y("env.env.req.proxyPasswd") },
          {
            prop: "exitIp",
            minWidth: 150,
            label: y("proxy.proxy.list.ouputIP"),
          },
          { prop: "remark", label: y("base.remark") },
        ]);
      let _ = (e, o) => {
        o && (e ? k.value.set(o, e) : k.value.delete(o));
      };
      async function q() {
        if (C.value) return;
        C.value = !0;
        let e = [];
        k.value.forEach((o) => {
          o && e.push(null == o ? void 0 : o.handleDetection());
        });
        let o = new Promise((e) => {
          I.value = e;
        });
        (await w(Promise.race([Promise.all(e), o])),
          (C.value = !1),
          console.log(x.proxyList));
      }
      return (
        a({ terminationResolve: I }),
        (o, t) => {
          const l = n("el-button");
          return (
            r(),
            s("div", E, [
              p("div", F, [
                c(
                  l,
                  {
                    type: "primary",
                    plain: "",
                    onClick: q,
                    disabled: C.value || !d(g).length,
                    loading: C.value,
                  },
                  {
                    default: i(() => [f(v(d(y)("org.logs.checkProxy")), 1)]),
                    _: 1,
                  },
                  8,
                  ["disabled", "loading"],
                ),
                p(
                  "div",
                  U,
                  v(d(y)("proxy.proxy.batchCreate.added_proxies")) +
                    " " +
                    v(d(g).length),
                  1,
                ),
              ]),
              p("div", A, [
                c(
                  e,
                  { columns: P.value, list: d(g), showFilterSlot: !1 },
                  {
                    exitIp: i((e) => [
                      (r(),
                      m(
                        D,
                        {
                          key: e.row.id,
                          ref: (o) => d(_)(o, e.row.id),
                          data: e.row,
                          "onUpdate:data": [
                            (o) => (e.row = o),
                            (o) =>
                              (function (e, o) {
                                const t = g.value.findIndex(
                                  (e) => e.id === o.row.id,
                                );
                                if (-1 !== t) {
                                  const o = [...g.value];
                                  ((o[t] = e),
                                    console.log(g.value, "list.value "),
                                    (g.value = o));
                                }
                              })(o, e),
                          ],
                        },
                        null,
                        8,
                        ["data", "onUpdate:data"],
                      )),
                    ]),
                    _: 1,
                  },
                  8,
                  ["columns", "list"],
                ),
              ]),
            ])
          );
        }
      );
    },
  });
export { N as _ };
