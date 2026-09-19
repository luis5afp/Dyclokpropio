import {
  d as e,
  i as t,
  bP as n,
  W as a,
  r as l,
  o as r,
  c as o,
  O as s,
  f as d,
  bM as u,
  a as i,
  t as v,
  X as p,
  h as f,
  w as c,
  b as g,
  e as y,
  dr as w,
  _,
} from "./index-BUIbb6Pa.js";
const T = { key: 0 },
  x = { class: "preview-main" },
  m = { key: 0 },
  C = { key: 1 },
  b = { key: 0 },
  $ = { key: 1 },
  h = { key: 2 },
  q = { key: 3 },
  O = { key: 4 },
  k = { key: 5 },
  L = { key: 0 },
  V = { key: 1, style: { "overflow-wrap": "anywhere" } },
  P = { key: 0 },
  S = { key: 0 },
  B = { key: 0 },
  G = { key: 0 },
  I = { key: 0 },
  M = _(
    e({
      __name: "envConfigPreview",
      props: {
        showTitle: { type: Boolean },
        extendConfig: {},
        batchExtendConfig: {},
        drawerProps: {},
        batchDrawerProps: {},
        extendConfigOptionTrans: {},
        isBatch: { type: Boolean },
        isSingle: { type: Boolean },
        isBulkImport: { type: Boolean },
        importExtendConfig: {},
        importDrawerPropsRow: {},
        className: {},
      },
      emits: ["openNewFingerprint"],
      setup(e, { expose: _ }) {
        let M = e,
          N = t(M.drawerProps),
          R = t(M.batchExtendConfig),
          E = t(null);
        const W = n();
        return (
          a(
            () => [M.isBatch, M.isSingle, M.isBulkImport],
            () => {
              var e;
              (M.isBatch
                ? ((N.value = M.batchDrawerProps),
                  (R.value = M.batchExtendConfig))
                : M.isBulkImport
                  ? ((N.value = M.importDrawerPropsRow),
                    (R.value = M.importExtendConfig))
                  : ((N.value = M.drawerProps), (R.value = M.extendConfig)),
                null == (e = E.value) || e.scrollTo({ top: 0 }));
            },
            { immediate: !0 },
          ),
          _({
            refreshFingerprint: (e) => {
              R.value = e;
            },
          }),
          (t, n) => {
            var a;
            const _ = l("el-col"),
              D = l("el-row");
            return (
              r(),
              o(
                "div",
                {
                  ref_key: "previewContainer",
                  ref: E,
                  class: s(
                    d(u)(
                      "preview-container",
                      (null == (a = d(M)) ? void 0 : a.className) || "",
                    ),
                  ),
                },
                [
                  e.showTitle
                    ? (r(),
                      o("h4", T, [
                        i("span", null, v(t.$t("env.env.preview.title")), 1),
                      ]))
                    : p("", !0),
                  i("div", x, [
                    d(N).browserVersionId
                      ? (r(),
                        f(
                          D,
                          { key: 0, gutter: 5 },
                          {
                            default: c(() => [
                              g(
                                _,
                                { span: 9 },
                                {
                                  default: c(() => [
                                    y(v(t.$t("env.env.req.browser")), 1),
                                  ]),
                                  _: 1,
                                },
                              ),
                              g(
                                _,
                                { span: 15, class: "tw-text-left" },
                                {
                                  default: c(() => [
                                    y(
                                      v(
                                        d(W).getBrowserNameById(
                                          d(W).browserList.length > 1
                                            ? d(N).browserVersionId
                                            : "",
                                        ),
                                      ),
                                      1,
                                    ),
                                  ]),
                                  _: 1,
                                },
                              ),
                            ]),
                            _: 1,
                          },
                        ))
                      : p("", !0),
                    d(N).serialNum
                      ? (r(),
                        f(
                          D,
                          { key: 1, gutter: 5 },
                          {
                            default: c(() => [
                              g(
                                _,
                                { span: 9 },
                                {
                                  default: c(() => [
                                    y(v(t.$t("env.env.req.name")), 1),
                                  ]),
                                  _: 1,
                                },
                              ),
                              g(
                                _,
                                {
                                  span: 15,
                                  class: "tw-text-left",
                                  style: {
                                    "word-break": "break-all",
                                    "white-space": "normal",
                                  },
                                },
                                {
                                  default: c(() => [
                                    y(
                                      v(d(N).name) +
                                        "(" +
                                        v(d(N).serialNum) +
                                        ") ",
                                      1,
                                    ),
                                  ]),
                                  _: 1,
                                },
                              ),
                            ]),
                            _: 1,
                          },
                        ))
                      : p("", !0),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.os")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var n,
                                  a,
                                  l,
                                  s,
                                  u,
                                  i,
                                  f,
                                  c,
                                  g,
                                  y,
                                  _,
                                  T,
                                  x,
                                  L,
                                  V,
                                  P,
                                  S,
                                  B,
                                  G,
                                  I;
                                return [
                                  e.isSingle
                                    ? (r(),
                                      o("div", m, v(d(w)[d(N).uaOs] || "-"), 1))
                                    : (r(),
                                      o("div", C, [
                                        (
                                          null ==
                                          (a =
                                            null == (n = d(N).os)
                                              ? void 0
                                              : n.windows)
                                            ? void 0
                                            : a.length
                                        )
                                          ? (r(),
                                            o(
                                              "div",
                                              b,
                                              v(
                                                t.$t(
                                                  "env.env.req.osLabelWindows",
                                                ),
                                              ),
                                              1,
                                            ))
                                          : p("", !0),
                                        (
                                          null ==
                                          (s =
                                            null == (l = d(N).os)
                                              ? void 0
                                              : l.mac)
                                            ? void 0
                                            : s.length
                                        )
                                          ? (r(),
                                            o(
                                              "div",
                                              $,
                                              v(t.$t("env.env.req.osLabelMac")),
                                              1,
                                            ))
                                          : p("", !0),
                                        (
                                          null ==
                                          (i =
                                            null == (u = d(N).os)
                                              ? void 0
                                              : u.android)
                                            ? void 0
                                            : i.length
                                        )
                                          ? (r(),
                                            o(
                                              "div",
                                              h,
                                              v(
                                                t.$t(
                                                  "env.env.req.osLabelAndroid",
                                                ),
                                              ),
                                              1,
                                            ))
                                          : p("", !0),
                                        (
                                          null ==
                                          (c =
                                            null == (f = d(N).os)
                                              ? void 0
                                              : f.ios)
                                            ? void 0
                                            : c.length
                                        )
                                          ? (r(),
                                            o(
                                              "div",
                                              q,
                                              v(t.$t("env.env.req.osLabelIos")),
                                              1,
                                            ))
                                          : p("", !0),
                                        (
                                          null ==
                                          (y =
                                            null == (g = d(N).os)
                                              ? void 0
                                              : g.linux)
                                            ? void 0
                                            : y.length
                                        )
                                          ? (r(),
                                            o(
                                              "div",
                                              O,
                                              v(
                                                t.$t(
                                                  "env.env.req.osLabelLinux",
                                                ),
                                              ),
                                              1,
                                            ))
                                          : p("", !0),
                                        (null ==
                                        (T =
                                          null == (_ = d(N).os)
                                            ? void 0
                                            : _.windows)
                                          ? void 0
                                          : T.length) ||
                                        (null ==
                                        (L =
                                          null == (x = d(N).os)
                                            ? void 0
                                            : x.mac)
                                          ? void 0
                                          : L.length) ||
                                        (null ==
                                        (P =
                                          null == (V = d(N).os)
                                            ? void 0
                                            : V.android)
                                          ? void 0
                                          : P.length) ||
                                        (null ==
                                        (B =
                                          null == (S = d(N).os)
                                            ? void 0
                                            : S.ios)
                                          ? void 0
                                          : B.length) ||
                                        (null ==
                                        (I =
                                          null == (G = d(N).os)
                                            ? void 0
                                            : G.linux)
                                          ? void 0
                                          : I.length)
                                          ? p("", !0)
                                          : (r(), o("div", k, " - ")),
                                      ])),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.ua")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => [
                                e.isSingle
                                  ? p("", !0)
                                  : (r(),
                                    o(
                                      "div",
                                      L,
                                      v(
                                        "random" === d(N).uaCreateType
                                          ? t.$t("env.env.req.random")
                                          : t.$t("env.env.req.fixed"),
                                      ),
                                      1,
                                    )),
                                (!e.isSingle &&
                                  "fixed" === d(N).uaCreateType) ||
                                e.isSingle
                                  ? (r(), o("div", V, v(d(N).ua || "-"), 1))
                                  : p("", !0),
                              ]),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("proxy.proxy.word")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => [
                                y(
                                  v(
                                    t.$t(`enum.ProxyWay.${d(N).proxyWay}`) +
                                      ("SELECT_EXIST" ===
                                      (!e.isSingle && d(N).proxyWay)
                                        ? "-" +
                                          t.$t(
                                            `env.env.req.${d(N).proxyOwnType}`,
                                          )
                                        : ""),
                                  ),
                                  1,
                                ),
                              ]),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.acceptLang")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t = e.extendConfigOptionTrans.acceptLang)
                                        ? void 0
                                        : t[d(R).acceptLangType]) ||
                                        d(R).acceptLangType,
                                    ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.lang")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t = e.extendConfigOptionTrans.lang)
                                        ? void 0
                                        : t[d(R).langType]) || d(R).langType,
                                    ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.timezone")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t = e.extendConfigOptionTrans.timezone)
                                        ? void 0
                                        : t[d(R).timezoneType]) ||
                                        d(R).timezoneType,
                                    ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.geo")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t, n;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t = e.extendConfigOptionTrans.geo)
                                        ? void 0
                                        : t[d(R).geoType]) || d(R).geoType,
                                    ) +
                                      " - " +
                                      v(
                                        (null ==
                                        (n = e.extendConfigOptionTrans.geoSub)
                                          ? void 0
                                          : n[d(R).geoSubType]) ||
                                          d(R).geoSubType,
                                      ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.font")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var n;
                                return [
                                  i(
                                    "div",
                                    null,
                                    v(
                                      (null ==
                                      (n = e.extendConfigOptionTrans.font)
                                        ? void 0
                                        : n[d(R).fontType]) || d(R).fontType,
                                    ),
                                    1,
                                  ),
                                  "custom" === d(R).fontType &&
                                  d(R).fontValue.length
                                    ? (r(),
                                      o(
                                        "div",
                                        P,
                                        v(
                                          `${d(R).fontValue.slice(0, 4).join(", ")} ${t.$t("base.etc", { N: d(R).fontValue.length })}`,
                                        ),
                                        1,
                                      ))
                                    : p("", !0),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.webrtc")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  i(
                                    "div",
                                    null,
                                    v(
                                      (null ==
                                      (t = e.extendConfigOptionTrans.webrtc)
                                        ? void 0
                                        : t[d(R).webrtcType]) ||
                                        d(R).webrtcType,
                                    ),
                                    1,
                                  ),
                                  "replace" === d(R).webrtcType
                                    ? (r(), o("div", S, v(d(R).webrtcValue), 1))
                                    : p("", !0),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.canvas")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t = e.extendConfigOptionTrans.canvas)
                                        ? void 0
                                        : t[d(R).canvasType]) ||
                                        d(R).canvasType,
                                    ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.ScreenResolution")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t = e.extendConfigOptionTrans.ratio)
                                        ? void 0
                                        : t[d(R).ratioType]) || d(R).ratioType,
                                    ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.windowSize")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t =
                                        e.extendConfigOptionTrans.windowRatio)
                                        ? void 0
                                        : t[d(R).windowRatioType]) ||
                                        d(R).windowRatioType,
                                    ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.mediadevice")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t = e.extendConfigOptionTrans.webGLImage)
                                        ? void 0
                                        : t[d(R).mediadeviceType]) ||
                                        d(R).mediadeviceType,
                                    ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.WebGLImage")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t = e.extendConfigOptionTrans.webGLImage)
                                        ? void 0
                                        : t[d(R).webGLImageType]) ||
                                        d(R).webGLImageType,
                                    ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.webGLMetadata")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      null ==
                                        (t =
                                          e.extendConfigOptionTrans
                                            .webGLMetadata)
                                        ? void 0
                                        : t[d(R).webGLMetadataType],
                                    ) + " ",
                                    1,
                                  ),
                                  "custom" === d(R).webGLMetadataType
                                    ? (r(),
                                      o(
                                        "div",
                                        B,
                                        v(
                                          d(R).webglManufacturer +
                                            " " +
                                            d(R).webglRender,
                                        ),
                                        1,
                                      ))
                                    : p("", !0),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.WebGPU")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t = e.extendConfigOptionTrans.webGPU)
                                        ? void 0
                                        : t[d(R).webGPUType]) ||
                                        d(R).webGPUType,
                                    ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.AudioContext")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t =
                                        e.extendConfigOptionTrans.audioContext)
                                        ? void 0
                                        : t[d(R).audioContextType]) ||
                                        d(R).audioContextType,
                                    ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.ClientRects")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t =
                                        e.extendConfigOptionTrans.clientRects)
                                        ? void 0
                                        : t[d(R).clientRectsType]) ||
                                        d(R).clientRectsType,
                                    ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.SpeechVoices")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t =
                                        e.extendConfigOptionTrans.speechVoices)
                                        ? void 0
                                        : t[d(R).speechVoicesType]) ||
                                        d(R).speechVoicesType,
                                    ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.DeviceMemory")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t, n;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t =
                                        e.extendConfigOptionTrans.deviceMemory)
                                        ? void 0
                                        : t[d(R).deviceMemoryType]) ||
                                        (null ==
                                        (n =
                                          e.extendConfigOptionTrans
                                            .deviceMemory)
                                          ? void 0
                                          : n[d(R).deviceMemoryValue]) ||
                                        d(R).deviceMemoryValue + " GB",
                                    ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(
                                  v(t.$t("env.env.req.HardwareConcurrency")),
                                  1,
                                ),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var n, a;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (n =
                                        e.extendConfigOptionTrans
                                          .hardwareConcurrency)
                                        ? void 0
                                        : n[d(R).hardwareConcurrencyType]) ||
                                        (null ==
                                        (a =
                                          e.extendConfigOptionTrans
                                            .hardwareConcurrency)
                                          ? void 0
                                          : a[d(R).hardwareConcurrencyValue]) ||
                                        d(R).hardwareConcurrencyValue +
                                          " " +
                                          t.$t("env.env.req.nucleus"),
                                    ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("org.loginVerify.tip18")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      null ==
                                        (t =
                                          e.extendConfigOptionTrans.deviceName)
                                        ? void 0
                                        : t[d(R).deviceNameType],
                                    ) + " ",
                                    1,
                                  ),
                                  "custom" === d(R).deviceNameType
                                    ? (r(),
                                      o("div", G, v(d(R).deviceNameValue), 1))
                                    : p("", !0),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.macAddress")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t = e.extendConfigOptionTrans.mac)
                                        ? void 0
                                        : t[d(R).macType]) || d(R).macType,
                                    ) + " ",
                                    1,
                                  ),
                                  "custom" === d(R).macType
                                    ? (r(), o("div", I, v(d(R).macValue), 1))
                                    : p("", !0),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.DoNotTrack")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t = e.extendConfigOptionTrans.track)
                                        ? void 0
                                        : t[d(R).trackType]) || d(R).trackType,
                                    ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.Battery")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t = e.extendConfigOptionTrans.battery)
                                        ? void 0
                                        : t[d(R).batteryType]) ||
                                        d(R).batteryType,
                                    ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(v(t.$t("env.env.req.PortScanProtection")), 1),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t = e.extendConfigOptionTrans.port)
                                        ? void 0
                                        : t[d(R).portType]) || d(R).portType,
                                    ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                    g(
                      D,
                      { gutter: 5 },
                      {
                        default: c(() => [
                          g(
                            _,
                            { span: 9 },
                            {
                              default: c(() => [
                                y(
                                  v(t.$t("env.env.req.HardwareAcceleration")),
                                  1,
                                ),
                              ]),
                              _: 1,
                            },
                          ),
                          g(
                            _,
                            { span: 15, class: "tw-text-left" },
                            {
                              default: c(() => {
                                var t;
                                return [
                                  y(
                                    v(
                                      (null ==
                                      (t = e.extendConfigOptionTrans.accelerate)
                                        ? void 0
                                        : t[d(R).accelerateType]) ||
                                        d(R).accelerateType,
                                    ),
                                    1,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                          ),
                        ]),
                        _: 1,
                      },
                    ),
                  ]),
                ],
                2,
              )
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-eb31e601"]],
  );
export { M as default };
