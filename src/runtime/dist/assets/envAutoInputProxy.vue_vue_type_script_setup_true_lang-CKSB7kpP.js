import {
  d as e,
  v as t,
  r as s,
  o as a,
  h as o,
  dD as p,
  dE as n,
  w as l,
  a as r,
  b as i,
  b7 as c,
  y as u,
  t as d,
  e as w,
  f as m,
  i as y,
  am as x,
  a3 as f,
} from "./index-BUIbb6Pa.js";
import { p as v } from "./proxyUtil-OnkkuXcX.js";
const b = { class: "tw-flex tw-items-center" },
  h = { class: "s-flex tw-w-full tw-gap-x-[12px]" },
  P = { class: "tw-w-full" },
  T = { class: "tw-flex" },
  k = e({
    __name: "envAutoInputProxy",
    props: { callback: { type: Function } },
    emits: ["reset"],
    setup(e, { expose: k, emit: g }) {
      const E = y(""),
        U = e,
        { t: $ } = t.useI18n(),
        _ = () => {
          f({
            message: `${$("openEnvTip.tip9")} http://192.168.0.1:8000:Username:Password ${$("openEnvTip.tip15")} \n socks5://Username:Password@192.168.0.1:8000`,
            grouping: !0,
            type: "warning",
            customClass: "tw-whitespace-pre-line",
          });
        },
        C = () => {
          let e = E.value;
          if (!e) return _();
          const t = v(e, { defaultType: x.Placeholder });
          if (!t) return _();
          let s = {
            proxyType: t.type,
            proxyHost: t.host || "",
            proxyPort: t.port || "",
            proxyUserName: t.userName || "",
            proxyPasswd: t.passwd || "",
          };
          (U.callback(s),
            f({
              message: $("openEnvTip.tip13"),
              grouping: !0,
              type: "success",
            }));
        };
      function I() {
        E.value = "";
        let e = {
          proxyType: x.Placeholder,
          proxyHost: "",
          proxyPort: "",
          proxyUserName: "",
          proxyPasswd: "",
        };
        U.callback(e);
      }
      return (
        k({
          setAutoInputContent: (e) => {
            E.value = e;
          },
        }),
        (e, t) => {
          const y = s("el-tooltip"),
            x = s("el-input"),
            f = s("el-button"),
            v = s("el-form-item");
          return (
            a(),
            o(
              v,
              p(n(e.$attrs)),
              {
                label: l(() => [
                  r("div", b, [
                    w(d(m($)("openEnvTip.tip8")) + " ", 1),
                    i(
                      y,
                      {
                        content: `${m($)("openEnvTip.tip14")}\n          http://192.168.0.1:8000:Username:Password\n          socks5://Username:Password@192.168.0.1:8000\n          http://[2a03:c005:bd2e:00a1:2d4c:2cbd:4253:e2bc]:8000`,
                        placement: "top",
                        "popper-class": "tw-whitespace-pre-line",
                      },
                      {
                        default: l(() => [
                          ...(t[1] ||
                            (t[1] = [
                              r(
                                "i",
                                {
                                  class:
                                    "iconfont icon-help-circle1 tw-cursor-pointer tw-text-subText tw-duration-300 hover:tw-text-black tw-pl-[2px]",
                                },
                                null,
                                -1,
                              ),
                            ])),
                        ]),
                        _: 1,
                      },
                      8,
                      ["content"],
                    ),
                  ]),
                ]),
                default: l(() => [
                  r("div", h, [
                    r("div", P, [
                      i(
                        x,
                        {
                          modelValue: E.value,
                          "onUpdate:modelValue":
                            t[0] || (t[0] = (e) => (E.value = e)),
                          modelModifiers: { trim: !0 },
                          placeholder: e.$t("openEnvTip.tip12"),
                          class: "tw-w-full",
                          onKeydown: c(u(C, ["prevent"]), ["enter"]),
                        },
                        null,
                        8,
                        ["modelValue", "placeholder", "onKeydown"],
                      ),
                    ]),
                    r("div", T, [
                      i(
                        f,
                        { type: "primary", plain: "", onClick: C },
                        {
                          default: l(() => [
                            r("span", null, d(e.$t("openEnvTip.tip10")), 1),
                          ]),
                          _: 1,
                        },
                      ),
                      i(
                        f,
                        {
                          type: "info",
                          class: "button-info-pro",
                          onClick: I,
                          link: "",
                        },
                        {
                          default: l(() => [
                            r("span", null, d(e.$t("base.reset")), 1),
                          ]),
                          _: 1,
                        },
                      ),
                    ]),
                  ]),
                ]),
                _: 1,
              },
              16,
            )
          );
        }
      );
    },
  });
export { k as _ };
