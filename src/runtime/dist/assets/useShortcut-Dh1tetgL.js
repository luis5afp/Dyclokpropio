import { P as t, fz as e, fA as n, ag as o } from "./index-BUIbb6Pa.js";
function r(t, e, n) {
  return t.length
    ? "one" === e && 1 !== t.length
      ? (n.onMultiple(), "multiple")
      : (n.action(t), "handled")
    : (n.onEmpty(), "empty");
}
function l() {
  return Array.from(
    document.querySelectorAll(".el-overlay, .el-drawer__container"),
  ).some((t) => {
    const e = window.getComputedStyle(t);
    return "none" !== e.display && "hidden" !== e.visibility;
  });
}
function a(r, a, i = {}) {
  const s = navigator.platform.toLowerCase().includes("mac") ? "mac" : "win",
    c = r[s],
    u = (function (t, e, n = {}) {
      return (o) => {
        var r, l;
        if (
          o.repeat ||
          !1 === (null == (r = n.enabled) ? void 0 : r.call(n)) ||
          (function (t) {
            var e, n;
            const o = t,
              r = null == o ? void 0 : o.closest;
            if (!r) return !1;
            if (r.call(o, '[contenteditable]:not([contenteditable="false"])'))
              return !0;
            const l = r.call(o, "input, textarea, select");
            if (!l) return !1;
            if (
              "input" !== (null == (e = l.tagName) ? void 0 : e.toLowerCase())
            )
              return !0;
            const a = (
              (null == (n = l.getAttribute) ? void 0 : n.call(l, "type")) ||
              "text"
            ).toLowerCase();
            return "checkbox" !== a && "radio" !== a;
          })(o.target) ||
          (null == (l = n.hasBlockingOverlay) ? void 0 : l.call(n))
        )
          return;
        const a = Object.entries(t).find(([, t]) =>
          (function (t, e) {
            const n = e.toLowerCase().split("+"),
              o = n.pop();
            return (
              t.key.toLowerCase() === o &&
              t.ctrlKey === n.includes("ctrl") &&
              t.metaKey === n.includes("command") &&
              t.shiftKey === n.includes("shift") &&
              t.altKey === n.includes("alt")
            );
          })(o, t),
        );
        if (!a) return;
        const i = e[a[0]];
        i && (o.preventDefault(), o.stopPropagation(), i());
      };
    })(c, a, { ...i, hasBlockingOverlay: i.hasBlockingOverlay ?? l }),
    d = (function (t, e) {
      let n = !1;
      const o = e;
      return {
        start() {
          n || (t.addEventListener("keydown", o, !0), (n = !0));
        },
        stop() {
          n && (t.removeEventListener("keydown", o, !0), (n = !1));
        },
      };
    })(window, u);
  return (
    t(d.start),
    e(d.start),
    n(d.stop),
    o(d.stop),
    { platform: s, keys: c }
  );
}
export { r as d, a as u };
