import {
  d as e,
  cO as l,
  v as o,
  r as a,
  o as r,
  c as s,
  b as t,
  f as n,
  w as p,
  a as i,
  cR as d,
  h as u,
  am as c,
  bS as x,
  X as m,
  O as y,
  bM as f,
  i as v,
  dF as b,
  _ as g,
} from "./index-BUIbb6Pa.js";
const w = { class: "tw-flex tw-w-full" },
  C = g(
    e({
      __name: "envProxyItems",
      props: { basicConfig: {}, isEnvEditV2: { type: Boolean } },
      emits: ["onPaste"],
      setup(e, { expose: g }) {
        const { generateFeedbackErrorMessage: C } = l();
        let h = e,
          { t: V } = o.useI18n();
        const P = (e) => {
          var l, o, a, r, s, t;
          let n = e.clipboardData.getData("text/plain");
          e.preventDefault();
          const p = ((e) => {
            let l;
            if (b.test(e)) return { ip: e };
            if (e.includes(":") && e.includes("."))
              return (
                (l = e.split(":")),
                { ip: l[0], port: l[1], username: l[2], password: l[3] }
              );
            if (e.includes(":")) {
              const o = e.match(/^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}/i) || [],
                a = o.length ? o[0] : e;
              return (
                (l = (e.split(a)[1] || "").split(":")),
                { ip: a, port: l[1], username: l[2], password: l[3] }
              );
            }
            return { ip: e };
          })(n);
          ((h.basicConfig.proxyHost =
            null == (l = p.ip) ? void 0 : l.replace(/[\s\r\n]/g, "")),
            Number(p.port) &&
              (h.basicConfig.proxyPort = Number(
                null == (o = p.port) ? void 0 : o.replace(/[\s\r\n]/g, ""),
              )),
            (null == (a = p.username) ? void 0 : a.replace(/[\s\r\n]/g, "")) &&
              (h.basicConfig.proxyUserName =
                null == (r = p.username) ? void 0 : r.replace(/[\s\r\n]/g, "")),
            (null == (s = p.password) ? void 0 : s.replace(/[\s\r\n]/g, "")) &&
              (h.basicConfig.proxyPasswd =
                null == (t = p.password)
                  ? void 0
                  : t.replace(/[\s\r\n]/g, "")));
        };
        return (
          g({
            rules: v({
              proxyHost: [
                {
                  required: !0,
                  validator: (e, l, o) => {
                    l ? o() : o(new Error(V("env.env.req.proxyHostRule")));
                  },
                },
              ],
              proxyPort: [
                {
                  required: !0,
                  validator: (e, l, o) => {
                    l ? o() : o(new Error(V("env.env.req.proxyPortRule")));
                  },
                },
              ],
            }),
          }),
          (l, o) => {
            const v = a("el-option"),
              b = a("el-select"),
              g = a("el-form-item"),
              C = a("el-input");
            return (
              r(),
              s("div", null, [
                t(
                  g,
                  { label: n(V)("env.env.req.host_port") },
                  {
                    default: p(() => {
                      var a, s;
                      return [
                        i("div", w, [
                          n(d).includes(e.basicConfig.proxyType) &&
                          !n(h).isEnvEditV2
                            ? (r(),
                              u(
                                g,
                                {
                                  key: 0,
                                  class: "tw-flex-[2] tw-mr-[8px] !tw-mb-[0px]",
                                  style: { "margin-bottom": "0 !important" },
                                  prop: "proxyType",
                                },
                                {
                                  default: p(() => [
                                    t(
                                      b,
                                      {
                                        modelValue: e.basicConfig.proxyTypeSoft,
                                        "onUpdate:modelValue":
                                          o[0] ||
                                          (o[0] = (l) =>
                                            (e.basicConfig.proxyTypeSoft = l)),
                                        placeholder: l.$t(
                                          "env.env.req.proxyTypeHolder",
                                        ),
                                        filterable: "",
                                      },
                                      {
                                        default: p(() => [
                                          t(
                                            v,
                                            {
                                              label: n(V)(n(x).SOCKS5),
                                              value: n(c).Socks5,
                                            },
                                            null,
                                            8,
                                            ["label", "value"],
                                          ),
                                          t(
                                            v,
                                            {
                                              label: n(V)(n(x).HTTP),
                                              value: n(c).Http,
                                            },
                                            null,
                                            8,
                                            ["label", "value"],
                                          ),
                                        ]),
                                        _: 1,
                                      },
                                      8,
                                      ["modelValue", "placeholder"],
                                    ),
                                  ]),
                                  _: 1,
                                },
                              ))
                            : m("", !0),
                          n(d).includes(e.basicConfig.proxyType) &&
                          n(h).isEnvEditV2
                            ? (r(),
                              u(
                                g,
                                {
                                  key: 1,
                                  class: "tw-flex-[2] tw-mr-[8px]",
                                  style: { "margin-bottom": "0 !important" },
                                  prop: "proxyType",
                                  required: "",
                                },
                                {
                                  default: p(() => [
                                    t(
                                      b,
                                      {
                                        modelValue: e.basicConfig.proxyTypeSoft,
                                        "onUpdate:modelValue":
                                          o[1] ||
                                          (o[1] = (l) =>
                                            (e.basicConfig.proxyTypeSoft = l)),
                                        placeholder: l.$t(
                                          "env.env.req.proxyTypeHolder",
                                        ),
                                        filterable: "",
                                      },
                                      {
                                        default: p(() => [
                                          t(
                                            v,
                                            {
                                              label: n(V)(n(x).SOCKS5),
                                              value: n(c).Socks5,
                                            },
                                            null,
                                            8,
                                            ["label", "value"],
                                          ),
                                          t(
                                            v,
                                            {
                                              label: n(V)(n(x).HTTP),
                                              value: n(c).Http,
                                            },
                                            null,
                                            8,
                                            ["label", "value"],
                                          ),
                                        ]),
                                        _: 1,
                                      },
                                      8,
                                      ["modelValue", "placeholder"],
                                    ),
                                  ]),
                                  _: 1,
                                },
                              ))
                            : m("", !0),
                          t(
                            g,
                            {
                              class: y(
                                n(f)(
                                  n(h).isEnvEditV2 &&
                                    !n(d).includes(e.basicConfig.proxyType)
                                    ? "tw-flex-[4]"
                                    : "tw-flex-[2]",
                                ),
                              ),
                              prop: "proxyHost",
                              style: {
                                width: "100%",
                                "margin-bottom": "0 !important",
                              },
                            },
                            {
                              default: p(() => [
                                t(
                                  C,
                                  {
                                    modelValue: e.basicConfig.proxyHost,
                                    "onUpdate:modelValue":
                                      o[2] ||
                                      (o[2] = (l) =>
                                        (e.basicConfig.proxyHost = l)),
                                    modelModifiers: { trim: !0 },
                                    maxlength: 100,
                                    placeholder: l.$t("env.env.req.proxyHost"),
                                    class: "proxy-host",
                                    clearable: "",
                                    onBlur:
                                      o[3] ||
                                      (o[3] = () => {
                                        var l;
                                        return (e.basicConfig.proxyHost =
                                          null == (l = e.basicConfig.proxyHost)
                                            ? void 0
                                            : l.replace(/[\r\n]+/g, ""));
                                      }),
                                    onPaste: P,
                                  },
                                  null,
                                  8,
                                  ["modelValue", "placeholder"],
                                ),
                              ]),
                              _: 1,
                            },
                            8,
                            ["class"],
                          ),
                          o[9] ||
                            (o[9] = i(
                              "div",
                              {
                                class:
                                  "tw-w-[22px] tw-h-[42px] c-flex tw-text-[var(--default-white-50)]",
                              },
                              ":",
                              -1,
                            )),
                          t(
                            g,
                            {
                              class: y(
                                n(f)(
                                  (null == (a = n(h)) ? void 0 : a.isEnvEditV2)
                                    ? "envV2-proxy__port"
                                    : "",
                                  (null == (s = n(h))
                                    ? void 0
                                    : s.isEnvEditV2) &&
                                    n(d).includes(e.basicConfig.proxyType)
                                    ? "tw-flex-1"
                                    : "tw-flex-[2]",
                                ),
                              ),
                              prop: "proxyPort",
                              style: {
                                width: "100%",
                                "margin-bottom": "0 !important",
                              },
                            },
                            {
                              default: p(() => [
                                t(
                                  C,
                                  {
                                    modelValue: e.basicConfig.proxyPort,
                                    "onUpdate:modelValue":
                                      o[4] ||
                                      (o[4] = (l) =>
                                        (e.basicConfig.proxyPort = l)),
                                    modelModifiers: { number: !0, trim: !0 },
                                    maxlength: 5,
                                    placeholder: l.$t("env.env.req.proxyPort"),
                                    class: "proxy-port",
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
                            ["class"],
                          ),
                        ]),
                      ];
                    }),
                    _: 1,
                  },
                  8,
                  ["label"],
                ),
                t(
                  g,
                  {
                    label: l.$t("env.env.req.proxyUserName"),
                    prop: "proxyUserName",
                  },
                  {
                    default: p(() => [
                      t(
                        C,
                        {
                          modelValue: e.basicConfig.proxyUserName,
                          "onUpdate:modelValue":
                            o[5] ||
                            (o[5] = (l) => (e.basicConfig.proxyUserName = l)),
                          modelModifiers: { trim: !0 },
                          maxlength: 300,
                          placeholder: l.$t("env.env.req.proxyUserNameHolder"),
                          clearable: "",
                          onBlur:
                            o[6] ||
                            (o[6] = () => {
                              var l;
                              return (e.basicConfig.proxyUserName =
                                null == (l = e.basicConfig.proxyUserName)
                                  ? void 0
                                  : l.replace(/[\r\n]+/g, ""));
                            }),
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
                t(
                  g,
                  {
                    label: l.$t("env.env.req.proxyPasswd"),
                    prop: "proxyPasswd",
                  },
                  {
                    default: p(() => [
                      t(
                        C,
                        {
                          modelValue: e.basicConfig.proxyPasswd,
                          "onUpdate:modelValue":
                            o[7] ||
                            (o[7] = (l) => (e.basicConfig.proxyPasswd = l)),
                          modelModifiers: { trim: !0 },
                          maxlength: 100,
                          placeholder: l.$t("env.env.req.proxyPasswdHolder"),
                          clearable: "",
                          "show-password": "",
                          type: "password",
                          onBlur:
                            o[8] ||
                            (o[8] = () => {
                              var l;
                              return (e.basicConfig.proxyPasswd =
                                null == (l = e.basicConfig.proxyPasswd)
                                  ? void 0
                                  : l.replace(/[\r\n]+/g, ""));
                            }),
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
              ])
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-4a4654d2"]],
  );
export { C as default };
