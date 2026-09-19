import {
  d as e,
  cX as l,
  v as o,
  P as a,
  c_ as t,
  g as r,
  r as s,
  o as u,
  c as n,
  b as i,
  f as c,
  w as p,
  F as d,
  z as v,
  h as y,
  d$ as I,
  a as m,
  e0 as f,
  X as T,
  t as w,
  i as _,
  C,
  e1 as S,
  am as b,
  e2 as R,
  d_ as g,
  e3 as A,
} from "./index-BUIbb6Pa.js";
import { g as x } from "./ipResourceMock-CCd7H3CQ.js";
import { _ as P } from "./IpCountryFlag.vue_vue_type_script_setup_true_lang-DgLdnpgH.js";
const E = { class: "tw-w-full tw-text-[var(--text-color-base)]" },
  h = { class: "tw-inline-flex tw-min-w-0 tw-items-center tw-gap-1" },
  V = { class: "tw-truncate" },
  O = { class: "tw-flex tw-items-center tw-justify-between tw-gap-4" },
  U = { class: "tw-inline-flex tw-min-w-0 tw-items-center tw-gap-1" },
  N = { class: "tw-truncate" },
  L = { key: 0, class: "tw-text-xs tw-text-[var(--danger-color)]" },
  k = e({
    __name: "IpResourceSelector",
    props: {
      modelValue: {},
      currentLabel: {},
      sourceTypes: {
        default: () => [l.DYNAMIC_IP_RESOURCE, l.STATIC_IP_RESOURCE],
      },
    },
    emits: ["update:modelValue", "select"],
    setup(e, { emit: k }) {
      const j = e,
        B = k,
        { t: M, locale: F } = o.useI18n(),
        X = _([]),
        Y = _(!1),
        z = _(""),
        D = C(() => j.sourceTypes);
      let K = 0;
      const J = C(() => {
          if (
            j.modelValue &&
            !X.value.some((e) => e.resourceId === j.modelValue)
          )
            return {
              resourceId: j.modelValue,
              resourceType: f.STATIC_IP,
              name: j.currentLabel || j.modelValue,
              protocol: g.SOCKS5,
              status: R.UNAVAILABLE,
              countryCode: "",
              bindable: !1,
              unbindableReason: M("ipResource.resourceUnavailable"),
              connection: {},
            };
        }),
        $ = C(() => (J.value ? [J.value, ...X.value] : X.value)),
        q = (e) => {
          const l = [e.countryCode, e.region, e.city]
            .filter(Boolean)
            .join(" / ");
          return S({
            sourceLabel:
              l ||
              (e.resourceType === f.STATIC_IP
                ? M("ipResource.static")
                : M("ipResource.dynamic")),
            ip: e.exitIp,
          });
        },
        G = (e) => {
          const l = $.value.find((l) => l.resourceId === e);
          return (null == l ? void 0 : l.resourceType) === f.STATIC_IP
            ? ""
            : (null == l ? void 0 : l.countryCode) || "";
        },
        H = (e) => {
          var l;
          return (
            e.port ??
            (Number(null == (l = e.proxyApiInfo) ? void 0 : l.port) || void 0)
          );
        },
        Q = (e, o) => {
          var a, t, r, s, u, n;
          if (!e.id) return;
          const i =
              e.host ||
              (null == (a = e.proxyApiInfo) ? void 0 : a.ip) ||
              (null == (t = e.proxyIpInfo) ? void 0 : t.ip) ||
              "",
            c =
              o || e.ipSourceType === l.STATIC_IP_RESOURCE
                ? f.STATIC_IP
                : f.DYNAMIC_PROXY;
          return {
            resourceId: (null == o ? void 0 : o.id) || e.id,
            resourceType: c,
            name: (null == o ? void 0 : o.ip) || i || e.id,
            protocol: g.SOCKS5,
            status: R.AVAILABLE,
            countryCode: o
              ? ""
              : (null == (r = e.proxyIpInfo) ? void 0 : r.countryCode) || "",
            region: o
              ? A(o.regionName, F.value)
              : null == (s = e.proxyIpInfo)
                ? void 0
                : s.region,
            city: null == (u = e.proxyIpInfo) ? void 0 : u.city,
            exitIp:
              (null == o ? void 0 : o.ip) ||
              (null == (n = e.contentJson) ? void 0 : n.ip),
            bindable: !0,
            connection: {
              type: b.Socks5,
              host: i,
              port: H(e),
              userName: e.userName,
              passwd: e.passwd,
              ipType: e.ipType,
              ipAddrType: e.ipAddrType,
            },
          };
        },
        W = async () => {
          const e = [];
          let l = 1;
          for (;;) {
            const o = await x({ pageNo: l, pageSize: 100 }),
              a = o.list || [];
            if (
              (e.push(...a),
              !a.length ||
                a.length < 100 ||
                (o.total > 0 && e.length >= o.total))
            )
              return e;
            l += 1;
          }
        },
        Z = (e) => {
          (B("update:modelValue", e),
            B(
              "select",
              $.value.find((l) => l.resourceId === e),
            ));
        };
      return (
        a(async () => {
          const e = ++K;
          Y.value = !0;
          try {
            const o = D.value.includes(l.STATIC_IP_RESOURCE),
              [a, r] = await Promise.all([
                t({ all: !0, detail: !0, ipSourceTypes: D.value }),
                o ? W() : Promise.resolve([]),
              ]);
            if (e !== K) return;
            const s = a.list
                .filter((e) => e.ipSourceType !== l.STATIC_IP_RESOURCE)
                .map((e) => Q(e))
                .filter((e) => Boolean(e)),
              u = new Map(
                a.list
                  .filter(
                    (e) => e.ipSourceType === l.STATIC_IP_RESOURCE && e.id,
                  )
                  .map((e) => [e.id, e]),
              ),
              n = r
                .map((e) => {
                  const l = u.get(e.proxyId);
                  return l ? Q(l, e) : void 0;
                })
                .filter((e) => Boolean(e));
            ((X.value = [...s, ...n]),
              j.modelValue &&
                B(
                  "select",
                  $.value.find((e) => e.resourceId === j.modelValue),
                ));
          } catch (o) {
            if (e !== K) return;
            (console.error(
              "[ipResource] failed to load selectable resources",
              o,
            ),
              (z.value = M("ipResource.loadFailed")));
          } finally {
            e === K && (Y.value = !1);
          }
        }),
        r(() => {
          K += 1;
        }),
        (l, o) => {
          const a = s("el-option"),
            t = s("el-select"),
            r = s("el-alert");
          return (
            u(),
            n("div", E, [
              i(
                t,
                {
                  "model-value": e.modelValue,
                  class: "tw-w-full",
                  filterable: "",
                  loading: Y.value,
                  placeholder: c(M)("ipResource.selectResource"),
                  onChange: Z,
                },
                {
                  label: p(({ label: e, value: l }) => [
                    m("span", h, [
                      i(P, { "country-code": G(String(l)) }, null, 8, [
                        "country-code",
                      ]),
                      m("span", V, w(e), 1),
                    ]),
                  ]),
                  default: p(() => [
                    (u(!0),
                    n(
                      d,
                      null,
                      v(
                        $.value,
                        (e) => (
                          u(),
                          y(
                            a,
                            {
                              key: e.resourceId,
                              label: q(e),
                              value: e.resourceId,
                              disabled: !c(I)(e),
                            },
                            {
                              default: p(() => [
                                m("div", O, [
                                  m("span", U, [
                                    e.resourceType !== c(f).STATIC_IP
                                      ? (u(),
                                        y(
                                          P,
                                          {
                                            key: 0,
                                            "country-code": e.countryCode,
                                          },
                                          null,
                                          8,
                                          ["country-code"],
                                        ))
                                      : T("", !0),
                                    m("span", N, w(q(e)), 1),
                                  ]),
                                  c(I)(e)
                                    ? T("", !0)
                                    : (u(),
                                      n(
                                        "span",
                                        L,
                                        w(
                                          e.unbindableReason ||
                                            c(M)(
                                              "ipResource.resourceUnavailable",
                                            ),
                                        ),
                                        1,
                                      )),
                                ]),
                              ]),
                              _: 2,
                            },
                            1032,
                            ["label", "value", "disabled"],
                          )
                        ),
                      ),
                      128,
                    )),
                  ]),
                  _: 1,
                },
                8,
                ["model-value", "loading", "placeholder"],
              ),
              z.value
                ? (u(),
                  y(
                    r,
                    {
                      key: 0,
                      class: "tw-mt-2",
                      closable: !1,
                      title: z.value,
                      type: "error",
                      "show-icon": "",
                    },
                    null,
                    8,
                    ["title"],
                  ))
                : T("", !0),
            ])
          );
        }
      );
    },
  });
export { k as _ };
