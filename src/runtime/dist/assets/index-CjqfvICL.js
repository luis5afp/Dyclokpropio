import { C as t, f as e } from "./index-BUIbb6Pa.js";
function n(t) {
  return "function" == typeof t ? t() : e(t);
}
"undefined" != typeof WorkerGlobalScope && (globalThis, WorkerGlobalScope);
const o =
    /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[T\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/i,
  r =
    /[YMDHhms]o|\[([^\]]+)\]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a{1,2}|A{1,2}|m{1,2}|s{1,2}|Z{1,2}|SSS/g;
function a(t, e, n, o) {
  let r = t < 12 ? "AM" : "PM";
  return (
    o && (r = r.split("").reduce((t, e) => t + `${e}.`, "")),
    n ? r.toLowerCase() : r
  );
}
function l(t) {
  const e = ["th", "st", "nd", "rd"],
    n = t % 100;
  return t + (e[(n - 20) % 10] || e[n] || e[0]);
}
function s(e, s = "HH:mm:ss", d = {}) {
  return t(() =>
    (function (t, e, n = {}) {
      var o;
      const s = t.getFullYear(),
        d = t.getMonth(),
        i = t.getDate(),
        c = t.getHours(),
        u = t.getMinutes(),
        S = t.getSeconds(),
        g = t.getMilliseconds(),
        f = t.getDay(),
        D = null != (o = n.customMeridiem) ? o : a,
        M = {
          Yo: () => l(s),
          YY: () => String(s).slice(-2),
          YYYY: () => s,
          M: () => d + 1,
          Mo: () => l(d + 1),
          MM: () => `${d + 1}`.padStart(2, "0"),
          MMM: () => t.toLocaleDateString(n.locales, { month: "short" }),
          MMMM: () => t.toLocaleDateString(n.locales, { month: "long" }),
          D: () => String(i),
          Do: () => l(i),
          DD: () => `${i}`.padStart(2, "0"),
          H: () => String(c),
          Ho: () => l(c),
          HH: () => `${c}`.padStart(2, "0"),
          h: () => `${c % 12 || 12}`.padStart(1, "0"),
          ho: () => l(c % 12 || 12),
          hh: () => `${c % 12 || 12}`.padStart(2, "0"),
          m: () => String(u),
          mo: () => l(u),
          mm: () => `${u}`.padStart(2, "0"),
          s: () => String(S),
          so: () => l(S),
          ss: () => `${S}`.padStart(2, "0"),
          SSS: () => `${g}`.padStart(3, "0"),
          d: () => f,
          dd: () => t.toLocaleDateString(n.locales, { weekday: "narrow" }),
          ddd: () => t.toLocaleDateString(n.locales, { weekday: "short" }),
          dddd: () => t.toLocaleDateString(n.locales, { weekday: "long" }),
          A: () => D(c, u),
          AA: () => D(c, u, !1, !0),
          a: () => D(c, u, !0),
          aa: () => D(c, u, !0, !0),
        };
      return e.replace(r, (t, e) => {
        var n, o;
        return null !=
          (o = null != e ? e : null == (n = M[t]) ? void 0 : n.call(M))
          ? o
          : t;
      });
    })(
      (function (t) {
        if (null === t) return new Date(Number.NaN);
        if (void 0 === t) return new Date();
        if (t instanceof Date) return new Date(t);
        if ("string" == typeof t && !/Z$/i.test(t)) {
          const e = t.match(o);
          if (e) {
            const t = e[2] - 1 || 0,
              n = (e[7] || "0").substring(0, 3);
            return new Date(
              e[1],
              t,
              e[3] || 1,
              e[4] || 0,
              e[5] || 0,
              e[6] || 0,
              n,
            );
          }
        }
        return new Date(t);
      })(n(e)),
      n(s),
      d,
    ),
  );
}
export { s as u };
