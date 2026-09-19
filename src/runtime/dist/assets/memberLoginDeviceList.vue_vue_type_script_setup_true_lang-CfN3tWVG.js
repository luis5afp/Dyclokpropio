import { _ as e } from "./update-null-Bg1S0RIt.js";
import {
  d as l,
  v as a,
  i as t,
  V as o,
  r as i,
  q as n,
  o as r,
  h as s,
  w as u,
  a as c,
  b as d,
  f as p,
  hr as g,
  c as v,
  F as m,
  z as f,
  t as w,
  X as h,
  e as y,
  x as V,
  aq as x,
  hq as b,
  C,
  a1 as _,
  hN as k,
  a3 as D,
  hO as N,
} from "./index-BUIbb6Pa.js";
import { _ as S } from "./index.vue_vue_type_style_index_0_lang-CoddPsWR.js";
import { u as U } from "./useFetchTable-DUveM-tP.js";
import L from "./loginDeviceCard-D3aK8BRa.js";
import { s as j } from "./timeZone-D3UW65MQ.js";
const z = { class: "tw-flex tw-flex-col tw-h-[70vh]" },
  A = { class: "tw-flex tw-mb-[10px] tw-gap-[4px]" },
  Y = { class: "tw-flex tw-mb-[20px] tw-gap-[4px]" },
  T = { class: "ig-item" },
  O = { key: 0, class: "iconfont icon-check" },
  B = {
    class: "tw-flex tw-justify-between tw-items-center tw-w-full tw-mb-[10px]",
  },
  M = {
    key: 0,
    class:
      "tw-flex tw-items-center tw-text-[14px] tw-text-[var(--text-color-base)]",
  },
  F = { class: "tw-flex tw-items-center tw-gap-[6px]" },
  I = { class: "tw-flex tw-ml-auto" },
  q = { key: 1, class: "tw-flex-1 c-flex tw-flex-col tw-py-[20px]" },
  E = l({
    __name: "memberLoginDeviceList",
    setup(l, { expose: E }) {
      let P = new AbortController(),
        {
          onPaginationCurrentChange: H,
          onPaginationSizeChange: K,
          pagination: Q,
          fetchList: X,
          list: Z,
          loading: $,
        } = U({
          fetch: (e) => {
            const l = { ...e, userId: ve.value, ...fe() };
            return ((P = new AbortController()), b(l, P.signal));
          },
          tableName: "memberLoginDeviceList",
        }),
        { t: G } = a.useI18n(),
        J = t(!1);
      const R = t(!1),
        W = t(new Set()),
        ee = C(() => W.value.size > 0),
        le = C(() =>
          ee.value ? G("org.loginVerify.tip31") : G("org.loginVerify.tip11"),
        ),
        ae = C(() => Z.value.map((e) => e.id).filter(Boolean)),
        te = C(() => ae.value.filter((e) => W.value.has(e)).length),
        oe = C(() => ae.value.length > 0 && te.value === ae.value.length),
        ie = C(() => te.value > 0 && !oe.value);
      function ne(e) {
        const l = new Set(W.value);
        (ae.value.forEach((a) => {
          e ? l.add(a) : l.delete(a);
        }),
          (W.value = l));
      }
      function re() {
        W.value = new Set();
      }
      function se(e) {
        (re(), P.abort(), e());
      }
      function ue() {
        const e = Array.from(W.value),
          l = e.length > 0;
        _({
          title: G(l ? "org.loginVerify.tip8" : "org.loginVerify.tip12"),
          message: G(l ? "org.loginVerify.tip14" : "org.loginVerify.tip13"),
          center: !0,
          confirmCb: async () => {
            (await k(ve.value, l ? { ids: e } : fe()),
              D.success(G("env.env.shareDialog.operatorSuccess")),
              (W.value = new Set()),
              X());
          },
        });
      }
      const ce = {
          loginStatus: void 0,
          ipAddress: void 0,
          positionVal: "",
          loginTime: [void 0, void 0],
          igVal: "country",
          pcUserName: "",
          igOptions: [
            { value: "country", label: G("org.loginVerify.tip29") },
            { value: "city", label: G("org.loginVerify.tip30") },
          ],
        },
        de = t([new Date(2e3, 1, 1, 0, 0, 0), new Date(2e3, 2, 1, 23, 59, 59)]),
        pe = t(G("org.loginVerify.tip29")),
        ge = t({ ...o.cloneDeep(ce) });
      let ve = t("");
      function me() {
        ((ge.value = { ...o.cloneDeep(ce) }), X());
      }
      function fe() {
        const {
          loginStatus: e,
          ipAddress: l,
          positionVal: a,
          igVal: t,
          loginTime: o,
          deviceName: i,
          pcUserName: n,
        } = ge.value;
        return {
          loginStatus: e,
          ipAddress: l,
          deviceName: i,
          pcUserName: n,
          country: a && "country" === t ? a.trim() : void 0,
          city: a && "city" === t ? a.trim() : void 0,
          startLoginTime: o && o[0] ? j(o[0]) : void 0,
          endLoginTime: o && o[1] ? j(o[1]) : void 0,
        };
      }
      function we(e) {
        _({
          title: G("org.loginVerify.tip8"),
          message: G("org.loginVerify.tip14"),
          center: !0,
          confirmCb: async () => {
            (await N(ve.value, e.id),
              D.success(G("env.env.shareDialog.operatorSuccess")),
              X());
          },
        });
      }
      return (
        E({
          openDialog: async (e) => {
            try {
              ((ve.value = e),
                re(),
                (J.value = !0),
                (R.value = !0),
                (Z.value = []),
                (ge.value = { ...o.cloneDeep(ce) }),
                await X());
            } finally {
              R.value = !1;
            }
          },
        }),
        (l, a) => {
          const t = i("el-input"),
            o = i("el-option"),
            b = i("el-select"),
            C = i("el-button"),
            _ = i("el-dropdown-item"),
            k = i("el-dropdown-menu"),
            D = i("el-dropdown"),
            N = i("el-date-picker"),
            U = i("el-checkbox"),
            j = i("el-tooltip"),
            E = i("el-scrollbar"),
            P = i("el-dialog"),
            ae = n("loading");
          return (
            r(),
            s(
              P,
              {
                modelValue: p(J),
                "onUpdate:modelValue":
                  a[7] || (a[7] = (e) => (x(J) ? (J.value = e) : (J = e))),
                "align-center": !0,
                "close-on-click-modal": !1,
                "close-on-press-escape": !1,
                "destroy-on-close": "",
                "show-close": !0,
                title: p(G)("org.loginVerify.tip21"),
                "before-close": se,
                width: "720px",
              },
              {
                default: u(() => [
                  c("div", z, [
                    c("div", A, [
                      d(
                        t,
                        {
                          modelValue: ge.value.deviceName,
                          "onUpdate:modelValue":
                            a[0] || (a[0] = (e) => (ge.value.deviceName = e)),
                          placeholder: p(G)("org.loginVerify.tip18"),
                          class: "tw-flex-grow tw-basis-1/6",
                          clearable: "",
                          onBlur: p(X),
                        },
                        null,
                        8,
                        ["modelValue", "placeholder", "onBlur"],
                      ),
                      d(
                        t,
                        {
                          modelValue: ge.value.pcUserName,
                          "onUpdate:modelValue":
                            a[1] || (a[1] = (e) => (ge.value.pcUserName = e)),
                          placeholder: p(G)("org.loginVerify.pcUserName"),
                          class:
                            "input-group tw-flex-grow tw-basis-1/6 el-input--prefix el-input--suffix",
                          onBlur: p(X),
                          clearable: "",
                        },
                        null,
                        8,
                        ["modelValue", "placeholder", "onBlur"],
                      ),
                      d(
                        b,
                        {
                          modelValue: ge.value.loginStatus,
                          "onUpdate:modelValue":
                            a[2] || (a[2] = (e) => (ge.value.loginStatus = e)),
                          placeholder: p(G)("org.loginVerify.tip24"),
                          class: "tw-flex-grow tw-basis-1/6",
                          clearable: "",
                          onChange: p(X),
                        },
                        {
                          default: u(() => [
                            d(
                              o,
                              {
                                label: p(G)("org.loginVerify.tip2"),
                                value: p(g).OFFLINE,
                              },
                              null,
                              8,
                              ["label", "value"],
                            ),
                            d(
                              o,
                              {
                                label: p(G)("org.loginVerify.tip3"),
                                value: p(g).ONLINE,
                              },
                              null,
                              8,
                              ["label", "value"],
                            ),
                          ]),
                          _: 1,
                        },
                        8,
                        ["modelValue", "placeholder", "onChange"],
                      ),
                      d(
                        t,
                        {
                          class:
                            "tw-flex-grow tw-basis-1/6 el-input--prefix el-input--suffix",
                          modelValue: ge.value.ipAddress,
                          "onUpdate:modelValue":
                            a[3] || (a[3] = (e) => (ge.value.ipAddress = e)),
                          placeholder: l.$t("org.loginVerify.tip26"),
                          maxlength: "20",
                          onChange: p(X),
                        },
                        null,
                        8,
                        ["modelValue", "placeholder", "onChange"],
                      ),
                    ]),
                    c("div", Y, [
                      d(
                        t,
                        {
                          modelValue: ge.value.positionVal,
                          "onUpdate:modelValue":
                            a[5] || (a[5] = (e) => (ge.value.positionVal = e)),
                          placeholder: pe.value,
                          class: "input-group tw-flex-grow tw-basis-1/6",
                          onChange: p(X),
                        },
                        {
                          prefix: u(() => [
                            ...(a[8] ||
                              (a[8] = [
                                c(
                                  "i",
                                  { class: "iconfont icon-search" },
                                  null,
                                  -1,
                                ),
                              ])),
                          ]),
                          suffix: u(() => [
                            d(
                              D,
                              {
                                "v-model": ge.value.igVal,
                                placement: "bottom-end",
                                "popper-class": "ig-menu",
                                trigger: "click",
                                onCommand:
                                  a[4] ||
                                  (a[4] = (e) => {
                                    return (
                                      (l = e),
                                      (ge.value.igVal = l),
                                      (pe.value = G(
                                        "country" === l
                                          ? "org.loginVerify.tip29"
                                          : "org.loginVerify.tip30",
                                      )),
                                      void (ge.value.positionVal && X())
                                    );
                                    var l;
                                  }),
                              },
                              {
                                dropdown: u(() => [
                                  d(
                                    k,
                                    { style: { width: "100%" } },
                                    {
                                      default: u(() => [
                                        (r(!0),
                                        v(
                                          m,
                                          null,
                                          f(
                                            ge.value.igOptions,
                                            (e) => (
                                              r(),
                                              s(
                                                _,
                                                {
                                                  key: e.value,
                                                  command: e.value,
                                                },
                                                {
                                                  default: u(() => [
                                                    c("div", T, [
                                                      c(
                                                        "span",
                                                        null,
                                                        w(e.label),
                                                        1,
                                                      ),
                                                      ge.value.igVal === e.value
                                                        ? (r(), v("i", O))
                                                        : h("", !0),
                                                    ]),
                                                  ]),
                                                  _: 2,
                                                },
                                                1032,
                                                ["command"],
                                              )
                                            ),
                                          ),
                                          128,
                                        )),
                                      ]),
                                      _: 1,
                                    },
                                  ),
                                ]),
                                default: u(() => [
                                  d(
                                    C,
                                    { class: "ig-btn", link: "", type: "info" },
                                    {
                                      default: u(() => [
                                        ...(a[9] ||
                                          (a[9] = [
                                            c(
                                              "i",
                                              { class: "iconfont icon-screen" },
                                              null,
                                              -1,
                                            ),
                                          ])),
                                      ]),
                                      _: 1,
                                    },
                                  ),
                                ]),
                                _: 1,
                              },
                              8,
                              ["v-model"],
                            ),
                          ]),
                          _: 1,
                        },
                        8,
                        ["modelValue", "placeholder", "onChange"],
                      ),
                      d(
                        N,
                        {
                          modelValue: ge.value.loginTime,
                          "onUpdate:modelValue":
                            a[6] || (a[6] = (e) => (ge.value.loginTime = e)),
                          class: "tw-flex-grow tw-basis-2/6",
                          type: "daterange",
                          size: "default",
                          clearable: "",
                          "default-time": de.value,
                          "end-placeholder": p(G)("org.loginVerify.tip28"),
                          "start-placeholder": p(G)("org.loginVerify.tip28"),
                          "range-separator": "-",
                          format: "YYYY-MM-DD",
                          "value-format": "YYYY-MM-DD HH:mm:ss",
                          onChange: p(X),
                          onClear: p(X),
                        },
                        null,
                        8,
                        [
                          "modelValue",
                          "default-time",
                          "end-placeholder",
                          "start-placeholder",
                          "onChange",
                          "onClear",
                        ],
                      ),
                    ]),
                    c("div", B, [
                      p(Z).length
                        ? (r(),
                          v("div", M, [
                            d(
                              U,
                              {
                                "model-value": oe.value,
                                indeterminate: ie.value,
                                onChange: ne,
                              },
                              {
                                default: u(() => [
                                  y(w(p(G)("org.loginVerify.tip32")), 1),
                                ]),
                                _: 1,
                              },
                              8,
                              ["model-value", "indeterminate"],
                            ),
                            a[10] ||
                              (a[10] = c(
                                "div",
                                {
                                  class:
                                    "tw-mx-[20px] tw-h-[18px] tw-w-[1px] tw-bg-[var(--border-color-light1)]",
                                },
                                null,
                                -1,
                              )),
                            c("div", F, [
                              c(
                                "span",
                                null,
                                w(
                                  p(G)("org.loginVerify.tip33", {
                                    num: W.value.size,
                                  }),
                                ),
                                1,
                              ),
                              ee.value
                                ? (r(),
                                  s(
                                    j,
                                    {
                                      key: 0,
                                      content: p(G)("org.loginVerify.tip34"),
                                      placement: "top",
                                    },
                                    {
                                      default: u(() => [
                                        c("i", {
                                          class:
                                            "iconfont icon-close tw-cursor-pointer tw-text-[16px] tw-text-[var(--border-color-light3)] hover:tw-text-[var(--text-color-base)]",
                                          onClick: re,
                                        }),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["content"],
                                  ))
                                : h("", !0),
                            ]),
                          ]))
                        : h("", !0),
                      c("div", I, [
                        d(
                          C,
                          { onClick: me },
                          {
                            default: u(() => [y(w(p(G)("base.reset")), 1)]),
                            _: 1,
                          },
                        ),
                        p(Z).length
                          ? (r(),
                            s(
                              C,
                              { key: 0, type: "primary", onClick: ue },
                              { default: u(() => [y(w(le.value), 1)]), _: 1 },
                            ))
                          : h("", !0),
                      ]),
                    ]),
                    p(Z).length
                      ? V(
                          (r(),
                          s(
                            E,
                            {
                              key: 0,
                              class: "tw-flex-1",
                              "view-class":
                                "tw-h-[auto] tw-grid tw-gay tw-gap-y-[15px]",
                            },
                            {
                              default: u(() => [
                                (r(!0),
                                v(
                                  m,
                                  null,
                                  f(
                                    p(Z),
                                    (e) => (
                                      r(),
                                      s(
                                        L,
                                        {
                                          key: e.id,
                                          "device-data": e,
                                          isMember: !0,
                                          selectable: !0,
                                          "model-value": W.value.has(e.id),
                                          "onUpdate:modelValue": (l) =>
                                            (function (e, l) {
                                              const a = W.value;
                                              (l ? a.add(e) : a.delete(e),
                                                (W.value = new Set(a)));
                                            })(e.id, l),
                                          onDownLine: we,
                                        },
                                        null,
                                        8,
                                        [
                                          "device-data",
                                          "model-value",
                                          "onUpdate:modelValue",
                                        ],
                                      )
                                    ),
                                  ),
                                  128,
                                )),
                              ]),
                              _: 1,
                            },
                          )),
                          [[ae, p($)]],
                        )
                      : V(
                          (r(),
                          v("div", q, [
                            a[11] || (a[11] = c("img", { src: e }, null, -1)),
                            c(
                              "div",
                              null,
                              w(p(G)("components.table.noData")),
                              1,
                            ),
                          ])),
                          [[ae, R.value]],
                        ),
                    d(
                      S,
                      {
                        handleCurrentChange: p(H),
                        handleSizeChange: p(K),
                        pageable: p(Q),
                        "pager-count": 2,
                        class: "tw-mt-[20px]",
                        layout: "sizes, prev, pager, next,total, jumper",
                      },
                      null,
                      8,
                      ["handleCurrentChange", "handleSizeChange", "pageable"],
                    ),
                  ]),
                ]),
                _: 1,
              },
              8,
              ["modelValue", "title"],
            )
          );
        }
      );
    },
  });
export { E as _ };
