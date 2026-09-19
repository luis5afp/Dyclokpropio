import {
  d as e,
  r as a,
  o,
  c as s,
  a as l,
  F as n,
  z as t,
  t as c,
  f as i,
  b as r,
  aq as u,
  w as d,
  e as m,
  i as v,
  _ as p,
} from "./index-BUIbb6Pa.js";
const w = { class: "capture-container" },
  f = { class: "source-selector" },
  g = ["onClick"],
  y = ["src"],
  b = p(
    e({
      __name: "test",
      setup(e) {
        let p = v(),
          b = v(2480),
          k = v(),
          C = v("");
        async function _() {
          try {
            ((p.value = await window.DIC.api.getDesktopSources()),
              console.log("Available sources:", p.value));
          } catch (e) {
            console.error("Error capturing sources:", e);
          }
        }
        async function h(e) {
          try {
            const a = {
              audio: !1,
              video: {
                mandatory: {
                  chromeMediaSource: "desktop",
                  chromeMediaSourceId: e.id,
                },
              },
            };
            C.value = e.thumbnail;
            const o = await navigator.mediaDevices.getUserMedia(a);
            (console.log(o),
              (k.value.srcObject = o),
              k.value.play(),
              console.log("Streaming source:", e.name));
          } catch (a) {
            console.error("Error streaming source:", a);
          }
        }
        async function D(e) {
          let a = await window.DIC.api.getWindowByPid(b.value);
          (console.log(a, "res"), h(a));
        }
        async function I() {
          let e = await window.DIC.api.windowTest(b.value);
          console.log(e);
        }
        return (e, v) => {
          const M = a("el-input"),
            S = a("el-button");
          return (
            o(),
            s("div", w, [
              v[3] || (v[3] = l("h2", null, "窗口视频捕获", -1)),
              l("div", f, [
                (o(!0),
                s(
                  n,
                  null,
                  t(
                    i(p),
                    (e) => (
                      o(),
                      s(
                        "button",
                        { key: e.id, onClick: (a) => h(e) },
                        c(e.name),
                        9,
                        g,
                      )
                    ),
                  ),
                  128,
                )),
              ]),
              l(
                "video",
                { ref_key: "videoElement", ref: k, autoplay: "" },
                null,
                512,
              ),
              l("img", { class: "tw-w-[300px]", src: i(C) }, null, 8, y),
              l("button", { onClick: _ }, "获取窗口列表"),
              r(
                M,
                {
                  modelValue: i(b),
                  "onUpdate:modelValue":
                    v[0] || (v[0] = (e) => (u(b) ? (b.value = e) : (b = e))),
                  modelModifiers: { number: !0 },
                },
                null,
                8,
                ["modelValue"],
              ),
              r(
                S,
                { onClick: D },
                {
                  default: d(() => [
                    ...(v[1] || (v[1] = [m("获取窗口列表", -1)])),
                  ]),
                  _: 1,
                },
              ),
              r(
                S,
                { onClick: I },
                {
                  default: d(() => [...(v[2] || (v[2] = [m("测试", -1)]))]),
                  _: 1,
                },
              ),
            ])
          );
        };
      },
    }),
    [["__scopeId", "data-v-b213e3fe"]],
  );
export { b as default };
