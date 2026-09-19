import {
  d as t,
  P as e,
  ag as n,
  c as s,
  O as i,
  a as r,
  t as a,
  i as o,
  C as l,
  o as u,
} from "./index-BUIbb6Pa.js";
function h(t, e) {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
const c = (t, e, n) => (n > e ? e : n < t ? t : n);
const d = {},
  p = (t) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t);
const m = (t) => /^0[^.\s]+$/u.test(t);
function f(t) {
  let e;
  return () => (void 0 === e && (e = t()), e);
}
const g = (t) => t,
  y = (t, e) => (n) => e(t(n)),
  v = (...t) => t.reduce(y),
  b = (t, e, n) => {
    const s = e - t;
    return 0 === s ? 1 : (n - t) / s;
  };
class w {
  constructor() {
    this.subscriptions = [];
  }
  add(t) {
    var e, n;
    return (
      (e = this.subscriptions),
      (n = t),
      -1 === e.indexOf(n) && e.push(n),
      () => h(this.subscriptions, t)
    );
  }
  notify(t, e, n) {
    const s = this.subscriptions.length;
    if (s)
      if (1 === s) this.subscriptions[0](t, e, n);
      else
        for (let i = 0; i < s; i++) {
          const s = this.subscriptions[i];
          s && s(t, e, n);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const T = (t) => 1e3 * t,
  M = (t) => t / 1e3;
function S(t, e) {
  return e ? t * (1e3 / e) : 0;
}
const A = (t, e, n) =>
  (((1 - 3 * n + 3 * e) * t + (3 * n - 6 * e)) * t + 3 * e) * t;
function x(t, e, n, s) {
  if (t === e && n === s) return g;
  const i = (e) =>
    (function (t, e, n, s, i) {
      let r,
        a,
        o = 0;
      do {
        ((a = e + (n - e) / 2),
          (r = A(a, s, i) - t),
          r > 0 ? (n = a) : (e = a));
      } while (Math.abs(r) > 1e-7 && ++o < 12);
      return a;
    })(e, 0, 1, t, n);
  return (t) => (0 === t || 1 === t ? t : A(i(t), e, s));
}
const V = (t) => (e) => (e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2),
  k = (t) => (e) => 1 - t(1 - e),
  C = x(0.33, 1.53, 0.69, 0.99),
  F = k(C),
  P = V(F),
  B = (t) =>
    (t *= 2) < 1 ? 0.5 * F(t) : 0.5 * (2 - Math.pow(2, -10 * (t - 1))),
  R = (t) => 1 - Math.sin(Math.acos(t)),
  E = k(R),
  D = V(R),
  O = x(0.42, 0, 1, 1),
  I = x(0, 0, 0.58, 1),
  N = x(0.42, 0, 0.58, 1),
  K = (t) => Array.isArray(t) && "number" != typeof t[0];
function j(t, e) {
  return K(t)
    ? t[
        ((t, e, n) => {
          const s = e - t;
          return ((((n - t) % s) + s) % s) + t;
        })(0, t.length, e)
      ]
    : t;
}
const W = (t) => Array.isArray(t) && "number" == typeof t[0],
  L = {
    linear: g,
    easeIn: O,
    easeInOut: N,
    easeOut: I,
    circIn: R,
    circInOut: D,
    circOut: E,
    backIn: F,
    backInOut: P,
    backOut: C,
    anticipate: B,
  },
  $ = (t) => {
    if (W(t)) {
      t.length;
      const [e, n, s, i] = t;
      return x(e, n, s, i);
    }
    return "string" == typeof t ? L[t] : t;
  },
  Y = [
    "setup",
    "read",
    "resolveKeyframes",
    "preUpdate",
    "update",
    "preRender",
    "render",
    "postRender",
  ];
function U(t, e) {
  let n = !1,
    s = !0;
  const i = { delta: 0, timestamp: 0, isProcessing: !1 },
    r = () => (n = !0),
    a = Y.reduce(
      (t, e) => (
        (t[e] = (function (t) {
          let e = new Set(),
            n = new Set(),
            s = !1,
            i = !1;
          const r = new WeakSet();
          let a = { delta: 0, timestamp: 0, isProcessing: !1 };
          function o(e) {
            (r.has(e) && (l.schedule(e), t()), e(a));
          }
          const l = {
            schedule: (t, i = !1, a = !1) => {
              const o = a && s ? e : n;
              return (i && r.add(t), o.has(t) || o.add(t), t);
            },
            cancel: (t) => {
              (n.delete(t), r.delete(t));
            },
            process: (t) => {
              ((a = t),
                s
                  ? (i = !0)
                  : ((s = !0),
                    ([e, n] = [n, e]),
                    e.forEach(o),
                    e.clear(),
                    (s = !1),
                    i && ((i = !1), l.process(t))));
            },
          };
          return l;
        })(r)),
        t
      ),
      {},
    ),
    {
      setup: o,
      read: l,
      resolveKeyframes: u,
      preUpdate: h,
      update: c,
      preRender: p,
      render: m,
      postRender: f,
    } = a,
    g = () => {
      const r = d.useManualTiming ? i.timestamp : performance.now();
      ((n = !1),
        d.useManualTiming ||
          (i.delta = s ? 1e3 / 60 : Math.max(Math.min(r - i.timestamp, 40), 1)),
        (i.timestamp = r),
        (i.isProcessing = !0),
        o.process(i),
        l.process(i),
        u.process(i),
        h.process(i),
        c.process(i),
        p.process(i),
        m.process(i),
        f.process(i),
        (i.isProcessing = !1),
        n && e && ((s = !1), t(g)));
    };
  return {
    schedule: Y.reduce((e, r) => {
      const o = a[r];
      return (
        (e[r] = (e, r = !1, a = !1) => (
          n || ((n = !0), (s = !0), i.isProcessing || t(g)),
          o.schedule(e, r, a)
        )),
        e
      );
    }, {}),
    cancel: (t) => {
      for (let e = 0; e < Y.length; e++) a[Y[e]].cancel(t);
    },
    state: i,
    steps: a,
  };
}
const {
  schedule: X,
  cancel: q,
  state: _,
} = U(
  "undefined" != typeof requestAnimationFrame ? requestAnimationFrame : g,
  !0,
);
let z;
function Z() {
  z = void 0;
}
const H = {
    now: () => (
      void 0 === z &&
        H.set(
          _.isProcessing || d.useManualTiming ? _.timestamp : performance.now(),
        ),
      z
    ),
    set: (t) => {
      ((z = t), queueMicrotask(Z));
    },
  },
  G = (t) => (e) => "string" == typeof e && e.startsWith(t),
  J = G("--"),
  Q = G("var(--"),
  tt = (t) => !!Q(t) && et.test(t.split("/*")[0].trim()),
  et =
    /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function nt(t) {
  return "string" == typeof t && t.split("/*")[0].includes("var(--");
}
const st = {
    test: (t) => "number" == typeof t,
    parse: parseFloat,
    transform: (t) => t,
  },
  it = { ...st, transform: (t) => c(0, 1, t) },
  rt = { ...st, default: 1 },
  at = (t) => Math.round(1e5 * t) / 1e5,
  ot = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
const lt =
    /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,
  ut = (t, e) => (n) =>
    Boolean(
      ("string" == typeof n && lt.test(n) && n.startsWith(t)) ||
        (e &&
          !(function (t) {
            return null == t;
          })(n) &&
          Object.prototype.hasOwnProperty.call(n, e)),
    ),
  ht = (t, e, n) => (s) => {
    if ("string" != typeof s) return s;
    const [i, r, a, o] = s.match(ot);
    return {
      [t]: parseFloat(i),
      [e]: parseFloat(r),
      [n]: parseFloat(a),
      alpha: void 0 !== o ? parseFloat(o) : 1,
    };
  },
  ct = { ...st, transform: (t) => Math.round(((t) => c(0, 255, t))(t)) },
  dt = {
    test: ut("rgb", "red"),
    parse: ht("red", "green", "blue"),
    transform: ({ red: t, green: e, blue: n, alpha: s = 1 }) =>
      "rgba(" +
      ct.transform(t) +
      ", " +
      ct.transform(e) +
      ", " +
      ct.transform(n) +
      ", " +
      at(it.transform(s)) +
      ")",
  };
const pt = {
    test: ut("#"),
    parse: function (t) {
      let e = "",
        n = "",
        s = "",
        i = "";
      return (
        t.length > 5
          ? ((e = t.substring(1, 3)),
            (n = t.substring(3, 5)),
            (s = t.substring(5, 7)),
            (i = t.substring(7, 9)))
          : ((e = t.substring(1, 2)),
            (n = t.substring(2, 3)),
            (s = t.substring(3, 4)),
            (i = t.substring(4, 5)),
            (e += e),
            (n += n),
            (s += s),
            (i += i)),
        {
          red: parseInt(e, 16),
          green: parseInt(n, 16),
          blue: parseInt(s, 16),
          alpha: i ? parseInt(i, 16) / 255 : 1,
        }
      );
    },
    transform: dt.transform,
  },
  mt = (t) => ({
    test: (e) =>
      "string" == typeof e && e.endsWith(t) && 1 === e.split(" ").length,
    parse: parseFloat,
    transform: (e) => `${e}${t}`,
  }),
  ft = mt("deg"),
  gt = mt("%"),
  yt = mt("px"),
  vt = mt("vh"),
  bt = mt("vw"),
  wt = (() => ({
    ...gt,
    parse: (t) => gt.parse(t) / 100,
    transform: (t) => gt.transform(100 * t),
  }))(),
  Tt = {
    test: ut("hsl", "hue"),
    parse: ht("hue", "saturation", "lightness"),
    transform: ({ hue: t, saturation: e, lightness: n, alpha: s = 1 }) =>
      "hsla(" +
      Math.round(t) +
      ", " +
      gt.transform(at(e)) +
      ", " +
      gt.transform(at(n)) +
      ", " +
      at(it.transform(s)) +
      ")",
  },
  Mt = {
    test: (t) => dt.test(t) || pt.test(t) || Tt.test(t),
    parse: (t) =>
      dt.test(t) ? dt.parse(t) : Tt.test(t) ? Tt.parse(t) : pt.parse(t),
    transform: (t) =>
      "string" == typeof t
        ? t
        : t.hasOwnProperty("red")
          ? dt.transform(t)
          : Tt.transform(t),
    getAnimatableNone: (t) => {
      const e = Mt.parse(t);
      return ((e.alpha = 0), Mt.transform(e));
    },
  },
  St =
    /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
const At = "number",
  xt = "color",
  Vt =
    /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function kt(t) {
  const e = t.toString(),
    n = [],
    s = { color: [], number: [], var: [] },
    i = [];
  let r = 0;
  const a = e
    .replace(
      Vt,
      (t) => (
        Mt.test(t)
          ? (s.color.push(r), i.push(xt), n.push(Mt.parse(t)))
          : t.startsWith("var(")
            ? (s.var.push(r), i.push("var"), n.push(t))
            : (s.number.push(r), i.push(At), n.push(parseFloat(t))),
        ++r,
        "${}"
      ),
    )
    .split("${}");
  return { values: n, split: a, indexes: s, types: i };
}
function Ct(t) {
  return kt(t).values;
}
function Ft(t) {
  const { split: e, types: n } = kt(t),
    s = e.length;
  return (t) => {
    let i = "";
    for (let r = 0; r < s; r++)
      if (((i += e[r]), void 0 !== t[r])) {
        const e = n[r];
        i += e === At ? at(t[r]) : e === xt ? Mt.transform(t[r]) : t[r];
      }
    return i;
  };
}
const Pt = (t) =>
  "number" == typeof t ? 0 : Mt.test(t) ? Mt.getAnimatableNone(t) : t;
const Bt = {
  test: function (t) {
    var e, n;
    return (
      isNaN(t) &&
      "string" == typeof t &&
      ((null == (e = t.match(ot)) ? void 0 : e.length) || 0) +
        ((null == (n = t.match(St)) ? void 0 : n.length) || 0) >
        0
    );
  },
  parse: Ct,
  createTransformer: Ft,
  getAnimatableNone: function (t) {
    const e = Ct(t);
    return Ft(t)(e.map(Pt));
  },
};
function Rt(t, e, n) {
  return (
    n < 0 && (n += 1),
    n > 1 && (n -= 1),
    n < 1 / 6
      ? t + 6 * (e - t) * n
      : n < 0.5
        ? e
        : n < 2 / 3
          ? t + (e - t) * (2 / 3 - n) * 6
          : t
  );
}
function Et(t, e) {
  return (n) => (n > 0 ? e : t);
}
const Dt = (t, e, n) => t + (e - t) * n,
  Ot = (t, e, n) => {
    const s = t * t,
      i = n * (e * e - s) + s;
    return i < 0 ? 0 : Math.sqrt(i);
  },
  It = [pt, dt, Tt];
function Nt(t) {
  const e = ((n = t), It.find((t) => t.test(n)));
  var n;
  if (!Boolean(e)) return !1;
  let s = e.parse(t);
  return (
    e === Tt &&
      (s = (function ({ hue: t, saturation: e, lightness: n, alpha: s }) {
        ((t /= 360), (n /= 100));
        let i = 0,
          r = 0,
          a = 0;
        if ((e /= 100)) {
          const s = n < 0.5 ? n * (1 + e) : n + e - n * e,
            o = 2 * n - s;
          ((i = Rt(o, s, t + 1 / 3)),
            (r = Rt(o, s, t)),
            (a = Rt(o, s, t - 1 / 3)));
        } else i = r = a = n;
        return {
          red: Math.round(255 * i),
          green: Math.round(255 * r),
          blue: Math.round(255 * a),
          alpha: s,
        };
      })(s)),
    s
  );
}
const Kt = (t, e) => {
    const n = Nt(t),
      s = Nt(e);
    if (!n || !s) return Et(t, e);
    const i = { ...n };
    return (t) => (
      (i.red = Ot(n.red, s.red, t)),
      (i.green = Ot(n.green, s.green, t)),
      (i.blue = Ot(n.blue, s.blue, t)),
      (i.alpha = Dt(n.alpha, s.alpha, t)),
      dt.transform(i)
    );
  },
  jt = new Set(["none", "hidden"]);
function Wt(t, e) {
  return (n) => Dt(t, e, n);
}
function Lt(t) {
  return "number" == typeof t
    ? Wt
    : "string" == typeof t
      ? tt(t)
        ? Et
        : Mt.test(t)
          ? Kt
          : Ut
      : Array.isArray(t)
        ? $t
        : "object" == typeof t
          ? Mt.test(t)
            ? Kt
            : Yt
          : Et;
}
function $t(t, e) {
  const n = [...t],
    s = n.length,
    i = t.map((t, n) => Lt(t)(t, e[n]));
  return (t) => {
    for (let e = 0; e < s; e++) n[e] = i[e](t);
    return n;
  };
}
function Yt(t, e) {
  const n = { ...t, ...e },
    s = {};
  for (const i in n)
    void 0 !== t[i] && void 0 !== e[i] && (s[i] = Lt(t[i])(t[i], e[i]));
  return (t) => {
    for (const e in s) n[e] = s[e](t);
    return n;
  };
}
const Ut = (t, e) => {
  const n = Bt.createTransformer(e),
    s = kt(t),
    i = kt(e);
  return s.indexes.var.length === i.indexes.var.length &&
    s.indexes.color.length === i.indexes.color.length &&
    s.indexes.number.length >= i.indexes.number.length
    ? (jt.has(t) && !i.values.length) || (jt.has(e) && !s.values.length)
      ? (function (t, e) {
          return jt.has(t) ? (n) => (n <= 0 ? t : e) : (n) => (n >= 1 ? e : t);
        })(t, e)
      : v(
          $t(
            (function (t, e) {
              const n = [],
                s = { color: 0, var: 0, number: 0 };
              for (let i = 0; i < e.values.length; i++) {
                const r = e.types[i],
                  a = t.indexes[r][s[r]],
                  o = t.values[a] ?? 0;
                ((n[i] = o), s[r]++);
              }
              return n;
            })(s, i),
            i.values,
          ),
          n,
        )
    : Et(t, e);
};
function Xt(t, e, n) {
  if ("number" == typeof t && "number" == typeof e && "number" == typeof n)
    return Dt(t, e, n);
  return Lt(t)(t, e);
}
const qt = (t) => {
    const e = ({ timestamp: e }) => t(e);
    return {
      start: (t = !0) => X.update(e, t),
      stop: () => q(e),
      now: () => (_.isProcessing ? _.timestamp : H.now()),
    };
  },
  _t = (t, e, n = 10) => {
    let s = "";
    const i = Math.max(Math.round(e / n), 2);
    for (let r = 0; r < i; r++)
      s += Math.round(1e4 * t(r / (i - 1))) / 1e4 + ", ";
    return `linear(${s.substring(0, s.length - 2)})`;
  },
  zt = 2e4;
function Zt(t) {
  let e = 0;
  let n = t.next(e);
  for (; !n.done && e < zt; ) ((e += 50), (n = t.next(e)));
  return e >= zt ? 1 / 0 : e;
}
function Ht(t, e = 100, n) {
  const s = n({ ...t, keyframes: [0, e] }),
    i = Math.min(Zt(s), zt);
  return {
    type: "keyframes",
    ease: (t) => s.next(i * t).value / e,
    duration: M(i),
  };
}
function Gt(t, e, n) {
  const s = Math.max(e - 5, 0);
  return S(n - t(s), e - s);
}
const Jt = 100,
  Qt = 10,
  te = 1,
  ee = 0,
  ne = 800,
  se = 0.3,
  ie = 0.3,
  re = { granular: 0.01, default: 2 },
  ae = { granular: 0.005, default: 0.5 },
  oe = 0.01,
  le = 10,
  ue = 0.05,
  he = 1,
  ce = 0.001;
function de({
  duration: t = ne,
  bounce: e = se,
  velocity: n = ee,
  mass: s = te,
}) {
  let i,
    r,
    a = 1 - e;
  ((a = c(ue, he, a)),
    (t = c(oe, le, M(t))),
    a < 1
      ? ((i = (e) => {
          const s = e * a,
            i = s * t,
            r = s - n,
            o = me(e, a),
            l = Math.exp(-i);
          return ce - (r / o) * l;
        }),
        (r = (e) => {
          const s = e * a * t,
            r = s * n + n,
            o = Math.pow(a, 2) * Math.pow(e, 2) * t,
            l = Math.exp(-s),
            u = me(Math.pow(e, 2), a);
          return ((-i(e) + ce > 0 ? -1 : 1) * ((r - o) * l)) / u;
        }))
      : ((i = (e) => Math.exp(-e * t) * ((e - n) * t + 1) - 0.001),
        (r = (e) => Math.exp(-e * t) * (t * t * (n - e)))));
  const o = (function (t, e, n) {
    let s = n;
    for (let i = 1; i < pe; i++) s -= t(s) / e(s);
    return s;
  })(i, r, 5 / t);
  if (((t = T(t)), isNaN(o)))
    return { stiffness: Jt, damping: Qt, duration: t };
  {
    const e = Math.pow(o, 2) * s;
    return { stiffness: e, damping: 2 * a * Math.sqrt(s * e), duration: t };
  }
}
const pe = 12;
function me(t, e) {
  return t * Math.sqrt(1 - e * e);
}
const fe = ["duration", "bounce"],
  ge = ["stiffness", "damping", "mass"];
function ye(t, e) {
  return e.some((e) => void 0 !== t[e]);
}
function ve(t = ie, e = se) {
  const n =
    "object" != typeof t
      ? { visualDuration: t, keyframes: [0, 1], bounce: e }
      : t;
  let { restSpeed: s, restDelta: i } = n;
  const r = n.keyframes[0],
    a = n.keyframes[n.keyframes.length - 1],
    o = { done: !1, value: r },
    {
      stiffness: l,
      damping: u,
      mass: h,
      duration: d,
      velocity: p,
      isResolvedFromDuration: m,
    } = (function (t) {
      let e = {
        velocity: ee,
        stiffness: Jt,
        damping: Qt,
        mass: te,
        isResolvedFromDuration: !1,
        ...t,
      };
      if (!ye(t, ge) && ye(t, fe))
        if (t.visualDuration) {
          const n = t.visualDuration,
            s = (2 * Math.PI) / (1.2 * n),
            i = s * s,
            r = 2 * c(0.05, 1, 1 - (t.bounce || 0)) * Math.sqrt(i);
          e = { ...e, mass: te, stiffness: i, damping: r };
        } else {
          const n = de(t);
          ((e = { ...e, ...n, mass: te }), (e.isResolvedFromDuration = !0));
        }
      return e;
    })({ ...n, velocity: -M(n.velocity || 0) }),
    f = p || 0,
    g = u / (2 * Math.sqrt(l * h)),
    y = a - r,
    v = M(Math.sqrt(l / h)),
    b = Math.abs(y) < 5;
  let w;
  if (
    (s || (s = b ? re.granular : re.default),
    i || (i = b ? ae.granular : ae.default),
    g < 1)
  ) {
    const t = me(v, g);
    w = (e) => {
      const n = Math.exp(-g * v * e);
      return (
        a - n * (((f + g * v * y) / t) * Math.sin(t * e) + y * Math.cos(t * e))
      );
    };
  } else if (1 === g) w = (t) => a - Math.exp(-v * t) * (y + (f + v * y) * t);
  else {
    const t = v * Math.sqrt(g * g - 1);
    w = (e) => {
      const n = Math.exp(-g * v * e),
        s = Math.min(t * e, 300);
      return (
        a - (n * ((f + g * v * y) * Math.sinh(s) + t * y * Math.cosh(s))) / t
      );
    };
  }
  const S = {
    calculatedDuration: (m && d) || null,
    next: (t) => {
      const e = w(t);
      if (m) o.done = t >= d;
      else {
        let n = 0 === t ? f : 0;
        g < 1 && (n = 0 === t ? T(f) : Gt(w, t, e));
        const r = Math.abs(n) <= s,
          l = Math.abs(a - e) <= i;
        o.done = r && l;
      }
      return ((o.value = o.done ? a : e), o);
    },
    toString: () => {
      const t = Math.min(Zt(S), zt),
        e = _t((e) => S.next(t * e).value, t, 30);
      return t + "ms " + e;
    },
    toTransition: () => {},
  };
  return S;
}
function be({
  keyframes: t,
  velocity: e = 0,
  power: n = 0.8,
  timeConstant: s = 325,
  bounceDamping: i = 10,
  bounceStiffness: r = 500,
  modifyTarget: a,
  min: o,
  max: l,
  restDelta: u = 0.5,
  restSpeed: h,
}) {
  const c = t[0],
    d = { done: !1, value: c },
    p = (t) =>
      void 0 === o
        ? l
        : void 0 === l || Math.abs(o - t) < Math.abs(l - t)
          ? o
          : l;
  let m = n * e;
  const f = c + m,
    g = void 0 === a ? f : a(f);
  g !== f && (m = g - c);
  const y = (t) => -m * Math.exp(-t / s),
    v = (t) => g + y(t),
    b = (t) => {
      const e = y(t),
        n = v(t);
      ((d.done = Math.abs(e) <= u), (d.value = d.done ? g : n));
    };
  let w, T;
  const M = (t) => {
    var e;
    ((e = d.value), (void 0 !== o && e < o) || (void 0 !== l && e > l)) &&
      ((w = t),
      (T = ve({
        keyframes: [d.value, p(d.value)],
        velocity: Gt(v, t, d.value),
        damping: i,
        stiffness: r,
        restDelta: u,
        restSpeed: h,
      })));
  };
  return (
    M(0),
    {
      calculatedDuration: null,
      next: (t) => {
        let e = !1;
        return (
          T || void 0 !== w || ((e = !0), b(t), M(t)),
          void 0 !== w && t >= w ? T.next(t - w) : (!e && b(t), d)
        );
      },
    }
  );
}
function we(t, e, { clamp: n = !0, ease: s, mixer: i } = {}) {
  const r = t.length;
  if ((e.length, 1 === r)) return () => e[0];
  if (2 === r && e[0] === e[1]) return () => e[1];
  const a = t[0] === t[1];
  t[0] > t[r - 1] && ((t = [...t].reverse()), (e = [...e].reverse()));
  const o = (function (t, e, n) {
      const s = [],
        i = n || d.mix || Xt,
        r = t.length - 1;
      for (let a = 0; a < r; a++) {
        let n = i(t[a], t[a + 1]);
        if (e) {
          const t = Array.isArray(e) ? e[a] || g : e;
          n = v(t, n);
        }
        s.push(n);
      }
      return s;
    })(e, s, i),
    l = o.length,
    u = (n) => {
      if (a && n < t[0]) return e[0];
      let s = 0;
      if (l > 1) for (; s < t.length - 2 && !(n < t[s + 1]); s++);
      const i = b(t[s], t[s + 1], n);
      return o[s](i);
    };
  return n ? (e) => u(c(t[0], t[r - 1], e)) : u;
}
function Te(t, e) {
  const n = t[t.length - 1];
  for (let s = 1; s <= e; s++) {
    const i = b(0, e, s);
    t.push(Dt(n, 1, i));
  }
}
function Me(t) {
  const e = [0];
  return (Te(e, t.length - 1), e);
}
function Se({
  duration: t = 300,
  keyframes: e,
  times: n,
  ease: s = "easeInOut",
}) {
  const i = K(s) ? s.map($) : $(s),
    r = { done: !1, value: e[0] },
    a = (function (t, e) {
      return t.map((t) => t * e);
    })(n && n.length === e.length ? n : Me(e), t),
    o = we(a, e, {
      ease: Array.isArray(i)
        ? i
        : ((l = e), (u = i), l.map(() => u || N).splice(0, l.length - 1)),
    });
  var l, u;
  return {
    calculatedDuration: t,
    next: (e) => ((r.value = o(e)), (r.done = e >= t), r),
  };
}
ve.applyToOptions = (t) => {
  const e = Ht(t, 100, ve);
  return (
    (t.ease = e.ease),
    (t.duration = T(e.duration)),
    (t.type = "keyframes"),
    t
  );
};
const Ae = (t) => null !== t;
function xe(t, { repeat: e, repeatType: n = "loop" }, s, i = 1) {
  const r = t.filter(Ae),
    a = i < 0 || (e && "loop" !== n && e % 2 == 1) ? 0 : r.length - 1;
  return a && void 0 !== s ? s : r[a];
}
const Ve = { decay: be, inertia: be, tween: Se, keyframes: Se, spring: ve };
function ke(t) {
  "string" == typeof t.type && (t.type = Ve[t.type]);
}
class Ce {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((t) => {
      this.resolve = t;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  then(t, e) {
    return this.finished.then(t, e);
  }
}
const Fe = (t) => t / 100;
class Pe extends Ce {
  constructor(t) {
    (super(),
      (this.state = "idle"),
      (this.startTime = null),
      (this.isStopped = !1),
      (this.currentTime = 0),
      (this.holdTime = null),
      (this.playbackSpeed = 1),
      (this.stop = () => {
        var t, e;
        const { motionValue: n } = this.options;
        (n && n.updatedAt !== H.now() && this.tick(H.now()),
          (this.isStopped = !0),
          "idle" !== this.state &&
            (this.teardown(),
            null == (e = (t = this.options).onStop) || e.call(t)));
      }),
      (this.options = t),
      this.initAnimation(),
      this.play(),
      !1 === t.autoplay && this.pause());
  }
  initAnimation() {
    const { options: t } = this;
    ke(t);
    const {
      type: e = Se,
      repeat: n = 0,
      repeatDelay: s = 0,
      repeatType: i,
      velocity: r = 0,
    } = t;
    let { keyframes: a } = t;
    const o = e || Se;
    o !== Se &&
      "number" != typeof a[0] &&
      ((this.mixKeyframes = v(Fe, Xt(a[0], a[1]))), (a = [0, 100]));
    const l = o({ ...t, keyframes: a });
    ("mirror" === i &&
      (this.mirroredGenerator = o({
        ...t,
        keyframes: [...a].reverse(),
        velocity: -r,
      })),
      null === l.calculatedDuration && (l.calculatedDuration = Zt(l)));
    const { calculatedDuration: u } = l;
    ((this.calculatedDuration = u),
      (this.resolvedDuration = u + s),
      (this.totalDuration = this.resolvedDuration * (n + 1) - s),
      (this.generator = l));
  }
  updateTime(t) {
    const e = Math.round(t - this.startTime) * this.playbackSpeed;
    null !== this.holdTime
      ? (this.currentTime = this.holdTime)
      : (this.currentTime = e);
  }
  tick(t, e = !1) {
    const {
      generator: n,
      totalDuration: s,
      mixKeyframes: i,
      mirroredGenerator: r,
      resolvedDuration: a,
      calculatedDuration: o,
    } = this;
    if (null === this.startTime) return n.next(0);
    const {
      delay: l = 0,
      keyframes: u,
      repeat: h,
      repeatType: d,
      repeatDelay: p,
      type: m,
      onUpdate: f,
      finalKeyframe: g,
    } = this.options;
    (this.speed > 0
      ? (this.startTime = Math.min(this.startTime, t))
      : this.speed < 0 &&
        (this.startTime = Math.min(t - s / this.speed, this.startTime)),
      e ? (this.currentTime = t) : this.updateTime(t));
    const y = this.currentTime - l * (this.playbackSpeed >= 0 ? 1 : -1),
      v = this.playbackSpeed >= 0 ? y < 0 : y > s;
    ((this.currentTime = Math.max(y, 0)),
      "finished" === this.state &&
        null === this.holdTime &&
        (this.currentTime = s));
    let b = this.currentTime,
      w = n;
    if (h) {
      const t = Math.min(this.currentTime, s) / a;
      let e = Math.floor(t),
        n = t % 1;
      (!n && t >= 1 && (n = 1), 1 === n && e--, (e = Math.min(e, h + 1)));
      (Boolean(e % 2) &&
        ("reverse" === d
          ? ((n = 1 - n), p && (n -= p / a))
          : "mirror" === d && (w = r)),
        (b = c(0, 1, n) * a));
    }
    const T = v ? { done: !1, value: u[0] } : w.next(b);
    i && (T.value = i(T.value));
    let { done: M } = T;
    v ||
      null === o ||
      (M =
        this.playbackSpeed >= 0
          ? this.currentTime >= s
          : this.currentTime <= 0);
    const S =
      null === this.holdTime &&
      ("finished" === this.state || ("running" === this.state && M));
    return (
      S && m !== be && (T.value = xe(u, this.options, g, this.speed)),
      f && f(T.value),
      S && this.finish(),
      T
    );
  }
  then(t, e) {
    return this.finished.then(t, e);
  }
  get duration() {
    return M(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: t = 0 } = this.options || {};
    return this.duration + M(t);
  }
  get time() {
    return M(this.currentTime);
  }
  set time(t) {
    var e;
    ((t = T(t)),
      (this.currentTime = t),
      null === this.startTime ||
      null !== this.holdTime ||
      0 === this.playbackSpeed
        ? (this.holdTime = t)
        : this.driver &&
          (this.startTime = this.driver.now() - t / this.playbackSpeed),
      null == (e = this.driver) || e.start(!1));
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(t) {
    this.updateTime(H.now());
    const e = this.playbackSpeed !== t;
    ((this.playbackSpeed = t), e && (this.time = M(this.currentTime)));
  }
  play() {
    var t, e;
    if (this.isStopped) return;
    const { driver: n = qt, startTime: s } = this.options;
    (this.driver || (this.driver = n((t) => this.tick(t))),
      null == (e = (t = this.options).onPlay) || e.call(t));
    const i = this.driver.now();
    ("finished" === this.state
      ? (this.updateFinished(), (this.startTime = i))
      : null !== this.holdTime
        ? (this.startTime = i - this.holdTime)
        : this.startTime || (this.startTime = s ?? i),
      "finished" === this.state &&
        this.speed < 0 &&
        (this.startTime += this.calculatedDuration),
      (this.holdTime = null),
      (this.state = "running"),
      this.driver.start());
  }
  pause() {
    ((this.state = "paused"),
      this.updateTime(H.now()),
      (this.holdTime = this.currentTime));
  }
  complete() {
    ("running" !== this.state && this.play(),
      (this.state = "finished"),
      (this.holdTime = null));
  }
  finish() {
    var t, e;
    (this.notifyFinished(),
      this.teardown(),
      (this.state = "finished"),
      null == (e = (t = this.options).onComplete) || e.call(t));
  }
  cancel() {
    var t, e;
    ((this.holdTime = null),
      (this.startTime = 0),
      this.tick(0),
      this.teardown(),
      null == (e = (t = this.options).onCancel) || e.call(t));
  }
  teardown() {
    ((this.state = "idle"),
      this.stopDriver(),
      (this.startTime = this.holdTime = null));
  }
  stopDriver() {
    this.driver && (this.driver.stop(), (this.driver = void 0));
  }
  sample(t) {
    return ((this.startTime = 0), this.tick(t, !0));
  }
  attachTimeline(t) {
    var e;
    return (
      this.options.allowFlatten &&
        ((this.options.type = "keyframes"),
        (this.options.ease = "linear"),
        this.initAnimation()),
      null == (e = this.driver) || e.stop(),
      t.observe(this)
    );
  }
}
const Be = (t) => (180 * t) / Math.PI,
  Re = (t) => {
    const e = Be(Math.atan2(t[1], t[0]));
    return De(e);
  },
  Ee = {
    x: 4,
    y: 5,
    translateX: 4,
    translateY: 5,
    scaleX: 0,
    scaleY: 3,
    scale: (t) => (Math.abs(t[0]) + Math.abs(t[3])) / 2,
    rotate: Re,
    rotateZ: Re,
    skewX: (t) => Be(Math.atan(t[1])),
    skewY: (t) => Be(Math.atan(t[2])),
    skew: (t) => (Math.abs(t[1]) + Math.abs(t[2])) / 2,
  },
  De = (t) => ((t %= 360) < 0 && (t += 360), t),
  Oe = (t) => Math.sqrt(t[0] * t[0] + t[1] * t[1]),
  Ie = (t) => Math.sqrt(t[4] * t[4] + t[5] * t[5]),
  Ne = {
    x: 12,
    y: 13,
    z: 14,
    translateX: 12,
    translateY: 13,
    translateZ: 14,
    scaleX: Oe,
    scaleY: Ie,
    scale: (t) => (Oe(t) + Ie(t)) / 2,
    rotateX: (t) => De(Be(Math.atan2(t[6], t[5]))),
    rotateY: (t) => De(Be(Math.atan2(-t[2], t[0]))),
    rotateZ: Re,
    rotate: Re,
    skewX: (t) => Be(Math.atan(t[4])),
    skewY: (t) => Be(Math.atan(t[1])),
    skew: (t) => (Math.abs(t[1]) + Math.abs(t[4])) / 2,
  };
function Ke(t) {
  return t.includes("scale") ? 1 : 0;
}
function je(t, e) {
  if (!t || "none" === t) return Ke(e);
  const n = t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let s, i;
  if (n) ((s = Ne), (i = n));
  else {
    const e = t.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    ((s = Ee), (i = e));
  }
  if (!i) return Ke(e);
  const r = s[e],
    a = i[1].split(",").map(We);
  return "function" == typeof r ? r(a) : a[r];
}
function We(t) {
  return parseFloat(t.trim());
}
const Le = [
    "transformPerspective",
    "x",
    "y",
    "z",
    "translateX",
    "translateY",
    "translateZ",
    "scale",
    "scaleX",
    "scaleY",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skew",
    "skewX",
    "skewY",
  ],
  $e = (() => new Set(Le))(),
  Ye = (t) => t === st || t === yt,
  Ue = new Set(["x", "y", "z"]),
  Xe = Le.filter((t) => !Ue.has(t));
const qe = {
  width: ({ x: t }, { paddingLeft: e = "0", paddingRight: n = "0" }) =>
    t.max - t.min - parseFloat(e) - parseFloat(n),
  height: ({ y: t }, { paddingTop: e = "0", paddingBottom: n = "0" }) =>
    t.max - t.min - parseFloat(e) - parseFloat(n),
  top: (t, { top: e }) => parseFloat(e),
  left: (t, { left: e }) => parseFloat(e),
  bottom: ({ y: t }, { top: e }) => parseFloat(e) + (t.max - t.min),
  right: ({ x: t }, { left: e }) => parseFloat(e) + (t.max - t.min),
  x: (t, { transform: e }) => je(e, "x"),
  y: (t, { transform: e }) => je(e, "y"),
};
((qe.translateX = qe.x), (qe.translateY = qe.y));
const _e = new Set();
let ze = !1,
  Ze = !1,
  He = !1;
function Ge() {
  if (Ze) {
    const t = Array.from(_e).filter((t) => t.needsMeasurement),
      e = new Set(t.map((t) => t.element)),
      n = new Map();
    (e.forEach((t) => {
      const e = (function (t) {
        const e = [];
        return (
          Xe.forEach((n) => {
            const s = t.getValue(n);
            void 0 !== s &&
              (e.push([n, s.get()]), s.set(n.startsWith("scale") ? 1 : 0));
          }),
          e
        );
      })(t);
      e.length && (n.set(t, e), t.render());
    }),
      t.forEach((t) => t.measureInitialState()),
      e.forEach((t) => {
        t.render();
        const e = n.get(t);
        e &&
          e.forEach(([e, n]) => {
            var s;
            null == (s = t.getValue(e)) || s.set(n);
          });
      }),
      t.forEach((t) => t.measureEndState()),
      t.forEach((t) => {
        void 0 !== t.suspendedScrollY && window.scrollTo(0, t.suspendedScrollY);
      }));
  }
  ((Ze = !1), (ze = !1), _e.forEach((t) => t.complete(He)), _e.clear());
}
function Je() {
  _e.forEach((t) => {
    (t.readKeyframes(), t.needsMeasurement && (Ze = !0));
  });
}
class Qe {
  constructor(t, e, n, s, i, r = !1) {
    ((this.state = "pending"),
      (this.isAsync = !1),
      (this.needsMeasurement = !1),
      (this.unresolvedKeyframes = [...t]),
      (this.onComplete = e),
      (this.name = n),
      (this.motionValue = s),
      (this.element = i),
      (this.isAsync = r));
  }
  scheduleResolve() {
    ((this.state = "scheduled"),
      this.isAsync
        ? (_e.add(this), ze || ((ze = !0), X.read(Je), X.resolveKeyframes(Ge)))
        : (this.readKeyframes(), this.complete()));
  }
  readKeyframes() {
    const {
      unresolvedKeyframes: t,
      name: e,
      element: n,
      motionValue: s,
    } = this;
    if (null === t[0]) {
      const i = null == s ? void 0 : s.get(),
        r = t[t.length - 1];
      if (void 0 !== i) t[0] = i;
      else if (n && e) {
        const s = n.readValue(e, r);
        null != s && (t[0] = s);
      }
      (void 0 === t[0] && (t[0] = r), s && void 0 === i && s.set(t[0]));
    }
    !(function (t) {
      for (let e = 1; e < t.length; e++) t[e] ?? (t[e] = t[e - 1]);
    })(t);
  }
  setFinalKeyframe() {}
  measureInitialState() {}
  renderEndStyles() {}
  measureEndState() {}
  complete(t = !1) {
    ((this.state = "complete"),
      this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, t),
      _e.delete(this));
  }
  cancel() {
    "scheduled" === this.state && (_e.delete(this), (this.state = "pending"));
  }
  resume() {
    "pending" === this.state && this.scheduleResolve();
  }
}
const tn = f(() => void 0 !== window.ScrollTimeline),
  en = {};
function nn(t, e) {
  const n = f(t);
  return () => en[e] ?? n();
}
const sn = nn(() => {
    try {
      document
        .createElement("div")
        .animate({ opacity: 0 }, { easing: "linear(0, 1)" });
    } catch (t) {
      return !1;
    }
    return !0;
  }, "linearEasing"),
  rn = ([t, e, n, s]) => `cubic-bezier(${t}, ${e}, ${n}, ${s})`,
  an = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    circIn: rn([0, 0.65, 0.55, 1]),
    circOut: rn([0.55, 0, 1, 0.45]),
    backIn: rn([0.31, 0.01, 0.66, -0.59]),
    backOut: rn([0.33, 1.53, 0.69, 0.99]),
  };
function on(t, e) {
  return t
    ? "function" == typeof t
      ? sn()
        ? _t(t, e)
        : "ease-out"
      : W(t)
        ? rn(t)
        : Array.isArray(t)
          ? t.map((t) => on(t, e) || an.easeOut)
          : an[t]
    : void 0;
}
function ln(
  t,
  e,
  n,
  {
    delay: s = 0,
    duration: i = 300,
    repeat: r = 0,
    repeatType: a = "loop",
    ease: o = "easeOut",
    times: l,
  } = {},
  u = void 0,
) {
  const h = { [e]: n };
  l && (h.offset = l);
  const c = on(o, i);
  Array.isArray(c) && (h.easing = c);
  const d = {
    delay: s,
    duration: i,
    easing: Array.isArray(c) ? "linear" : c,
    fill: "both",
    iterations: r + 1,
    direction: "reverse" === a ? "alternate" : "normal",
  };
  u && (d.pseudoElement = u);
  return t.animate(h, d);
}
function un(t) {
  return "function" == typeof t && "applyToOptions" in t;
}
class hn extends Ce {
  constructor(t) {
    if (
      (super(),
      (this.finishedTime = null),
      (this.isStopped = !1),
      (this.manualStartTime = null),
      !t)
    )
      return;
    const {
      element: e,
      name: n,
      keyframes: s,
      pseudoElement: i,
      allowFlatten: r = !1,
      finalKeyframe: a,
      onComplete: o,
    } = t;
    ((this.isPseudoElement = Boolean(i)),
      (this.allowFlatten = r),
      (this.options = t),
      t.type);
    const l = (function ({ type: t, ...e }) {
      return un(t) && sn()
        ? t.applyToOptions(e)
        : (e.duration ?? (e.duration = 300), e.ease ?? (e.ease = "easeOut"), e);
    })(t);
    ((this.animation = ln(e, n, s, l, i)),
      !1 === l.autoplay && this.animation.pause(),
      (this.animation.onfinish = () => {
        if (((this.finishedTime = this.time), !i)) {
          const t = xe(s, this.options, a, this.speed);
          (this.updateMotionValue
            ? this.updateMotionValue(t)
            : (function (t, e, n) {
                ((t) => t.startsWith("--"))(e)
                  ? t.style.setProperty(e, n)
                  : (t.style[e] = n);
              })(e, n, t),
            this.animation.cancel());
        }
        (null == o || o(), this.notifyFinished());
      }));
  }
  play() {
    this.isStopped ||
      ((this.manualStartTime = null),
      this.animation.play(),
      "finished" === this.state && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    var t, e;
    null == (e = (t = this.animation).finish) || e.call(t);
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch (t) {}
  }
  stop() {
    if (this.isStopped) return;
    this.isStopped = !0;
    const { state: t } = this;
    "idle" !== t &&
      "finished" !== t &&
      (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(),
      this.isPseudoElement || this.cancel());
  }
  commitStyles() {
    var t, e, n;
    const s = null == (t = this.options) ? void 0 : t.element;
    !this.isPseudoElement &&
      (null == s ? void 0 : s.isConnected) &&
      (null == (n = (e = this.animation).commitStyles) || n.call(e));
  }
  get duration() {
    var t, e;
    const n =
      (null ==
      (e = null == (t = this.animation.effect) ? void 0 : t.getComputedTiming)
        ? void 0
        : e.call(t).duration) || 0;
    return M(Number(n));
  }
  get iterationDuration() {
    const { delay: t = 0 } = this.options || {};
    return this.duration + M(t);
  }
  get time() {
    return M(Number(this.animation.currentTime) || 0);
  }
  set time(t) {
    ((this.manualStartTime = null),
      (this.finishedTime = null),
      (this.animation.currentTime = T(t)));
  }
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(t) {
    (t < 0 && (this.finishedTime = null), (this.animation.playbackRate = t));
  }
  get state() {
    return null !== this.finishedTime ? "finished" : this.animation.playState;
  }
  get startTime() {
    return this.manualStartTime ?? Number(this.animation.startTime);
  }
  set startTime(t) {
    this.manualStartTime = this.animation.startTime = t;
  }
  attachTimeline({ timeline: t, observe: e }) {
    var n;
    return (
      this.allowFlatten &&
        (null == (n = this.animation.effect) ||
          n.updateTiming({ easing: "linear" })),
      (this.animation.onfinish = null),
      t && tn() ? ((this.animation.timeline = t), g) : e(this)
    );
  }
}
const cn = { anticipate: B, backInOut: P, circInOut: D };
function dn(t) {
  "string" == typeof t.ease && t.ease in cn && (t.ease = cn[t.ease]);
}
class pn extends hn {
  constructor(t) {
    (dn(t),
      ke(t),
      super(t),
      void 0 !== t.startTime && (this.startTime = t.startTime),
      (this.options = t));
  }
  updateMotionValue(t) {
    const {
      motionValue: e,
      onUpdate: n,
      onComplete: s,
      element: i,
      ...r
    } = this.options;
    if (!e) return;
    if (void 0 !== t) return void e.set(t);
    const a = new Pe({ ...r, autoplay: !1 }),
      o = Math.max(10, H.now() - this.startTime),
      l = c(0, 10, o - 10);
    (e.setWithVelocity(
      a.sample(Math.max(0, o - l)).value,
      a.sample(o).value,
      l,
    ),
      a.stop());
  }
}
const mn = (t, e) =>
  "zIndex" !== e &&
  (!("number" != typeof t && !Array.isArray(t)) ||
    !(
      "string" != typeof t ||
      (!Bt.test(t) && "0" !== t) ||
      t.startsWith("url(")
    ));
function fn(t) {
  ((t.duration = 0), (t.type = "keyframes"));
}
const gn = new Set(["opacity", "clipPath", "filter", "transform"]),
  yn = f(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
class vn extends Ce {
  constructor({
    autoplay: t = !0,
    delay: e = 0,
    type: n = "keyframes",
    repeat: s = 0,
    repeatDelay: i = 0,
    repeatType: r = "loop",
    keyframes: a,
    name: o,
    motionValue: l,
    element: u,
    ...h
  }) {
    var c;
    (super(),
      (this.stop = () => {
        var t, e;
        (this._animation &&
          (this._animation.stop(),
          null == (t = this.stopTimeline) || t.call(this)),
          null == (e = this.keyframeResolver) || e.cancel());
      }),
      (this.createdAt = H.now()));
    const d = {
        autoplay: t,
        delay: e,
        type: n,
        repeat: s,
        repeatDelay: i,
        repeatType: r,
        name: o,
        motionValue: l,
        element: u,
        ...h,
      },
      p = (null == u ? void 0 : u.KeyframeResolver) || Qe;
    ((this.keyframeResolver = new p(
      a,
      (t, e, n) => this.onKeyframesResolved(t, e, d, !n),
      o,
      l,
      u,
    )),
      null == (c = this.keyframeResolver) || c.scheduleResolve());
  }
  onKeyframesResolved(t, e, n, s) {
    var i, r;
    this.keyframeResolver = void 0;
    const {
      name: a,
      type: o,
      velocity: l,
      delay: u,
      isHandoff: h,
      onUpdate: c,
    } = n;
    ((this.resolvedAt = H.now()),
      (function (t, e, n, s) {
        const i = t[0];
        if (null === i) return !1;
        if ("display" === e || "visibility" === e) return !0;
        const r = t[t.length - 1],
          a = mn(i, e),
          o = mn(r, e);
        return (
          !(!a || !o) &&
          ((function (t) {
            const e = t[0];
            if (1 === t.length) return !0;
            for (let n = 0; n < t.length; n++) if (t[n] !== e) return !0;
          })(t) ||
            (("spring" === n || un(n)) && s))
        );
      })(t, a, o, l) ||
        ((!d.instantAnimations && u) || null == c || c(xe(t, n, e)),
        (t[0] = t[t.length - 1]),
        fn(n),
        (n.repeat = 0)));
    const p = {
        startTime: s
          ? this.resolvedAt && this.resolvedAt - this.createdAt > 40
            ? this.resolvedAt
            : this.createdAt
          : void 0,
        finalKeyframe: e,
        ...n,
        keyframes: t,
      },
      m =
        !h &&
        (function (t) {
          var e;
          const {
            motionValue: n,
            name: s,
            repeatDelay: i,
            repeatType: r,
            damping: a,
            type: o,
          } = t;
          if (
            !(
              (null == (e = null == n ? void 0 : n.owner)
                ? void 0
                : e.current) instanceof HTMLElement
            )
          )
            return !1;
          const { onUpdate: l, transformTemplate: u } = n.owner.getProps();
          return (
            yn() &&
            s &&
            gn.has(s) &&
            ("transform" !== s || !u) &&
            !l &&
            !i &&
            "mirror" !== r &&
            0 !== a &&
            "inertia" !== o
          );
        })(p),
      f =
        null == (r = null == (i = p.motionValue) ? void 0 : i.owner)
          ? void 0
          : r.current,
      y = m ? new pn({ ...p, element: f }) : new Pe(p);
    (y.finished
      .then(() => {
        this.notifyFinished();
      })
      .catch(g),
      this.pendingTimeline &&
        ((this.stopTimeline = y.attachTimeline(this.pendingTimeline)),
        (this.pendingTimeline = void 0)),
      (this._animation = y));
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(t, e) {
    return this.finished.finally(t).then(() => {});
  }
  get animation() {
    var t;
    return (
      this._animation ||
        (null == (t = this.keyframeResolver) || t.resume(),
        (He = !0),
        Je(),
        Ge(),
        (He = !1)),
      this._animation
    );
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(t) {
    this.animation.time = t;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(t) {
    this.animation.speed = t;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(t) {
    return (
      this._animation
        ? (this.stopTimeline = this.animation.attachTimeline(t))
        : (this.pendingTimeline = t),
      () => this.stop()
    );
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    var t;
    (this._animation && this.animation.cancel(),
      null == (t = this.keyframeResolver) || t.cancel());
  }
}
class bn {
  constructor(t) {
    ((this.stop = () => this.runAll("stop")),
      (this.animations = t.filter(Boolean)));
  }
  get finished() {
    return Promise.all(this.animations.map((t) => t.finished));
  }
  getAll(t) {
    return this.animations[0][t];
  }
  setAll(t, e) {
    for (let n = 0; n < this.animations.length; n++) this.animations[n][t] = e;
  }
  attachTimeline(t) {
    const e = this.animations.map((e) => e.attachTimeline(t));
    return () => {
      e.forEach((t, e) => {
        (t && t(), this.animations[e].stop());
      });
    };
  }
  get time() {
    return this.getAll("time");
  }
  set time(t) {
    this.setAll("time", t);
  }
  get speed() {
    return this.getAll("speed");
  }
  set speed(t) {
    this.setAll("speed", t);
  }
  get state() {
    return this.getAll("state");
  }
  get startTime() {
    return this.getAll("startTime");
  }
  get duration() {
    return wn(this.animations, "duration");
  }
  get iterationDuration() {
    return wn(this.animations, "iterationDuration");
  }
  runAll(t) {
    this.animations.forEach((e) => e[t]());
  }
  play() {
    this.runAll("play");
  }
  pause() {
    this.runAll("pause");
  }
  cancel() {
    this.runAll("cancel");
  }
  complete() {
    this.runAll("complete");
  }
}
function wn(t, e) {
  let n = 0;
  for (let s = 0; s < t.length; s++) {
    const i = t[s][e];
    null !== i && i > n && (n = i);
  }
  return n;
}
class Tn extends bn {
  then(t, e) {
    return this.finished.finally(t).then(() => {});
  }
}
const Mn = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function Sn(t, e, n = 1) {
  const [s, i] = (function (t) {
    const e = Mn.exec(t);
    if (!e) return [,];
    const [, n, s, i] = e;
    return [`--${n ?? s}`, i];
  })(t);
  if (!s) return;
  const r = window.getComputedStyle(e).getPropertyValue(s);
  if (r) {
    const t = r.trim();
    return p(t) ? parseFloat(t) : t;
  }
  return tt(i) ? Sn(i, e, n + 1) : i;
}
const An = { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
  xn = { type: "keyframes", duration: 0.8 },
  Vn = { type: "keyframes", ease: [0.25, 0.1, 0.35, 1], duration: 0.3 },
  kn = (t, { keyframes: e }) =>
    e.length > 2
      ? xn
      : $e.has(t)
        ? t.startsWith("scale")
          ? {
              type: "spring",
              stiffness: 550,
              damping: 0 === e[1] ? 2 * Math.sqrt(550) : 30,
              restSpeed: 10,
            }
          : An
        : Vn,
  Cn = (t) => null !== t;
function Fn(t, e) {
  if ((null == t ? void 0 : t.inherit) && e) {
    const { inherit: n, ...s } = t;
    return { ...e, ...s };
  }
  return t;
}
function Pn(t, e) {
  const n =
    (null == t ? void 0 : t[e]) ?? (null == t ? void 0 : t.default) ?? t;
  return n !== t ? Fn(n, t) : n;
}
const Bn =
  (t, e, n, s = {}, i, r) =>
  (a) => {
    const o = Pn(s, t) || {},
      l = o.delay || s.delay || 0;
    let { elapsed: u = 0 } = s;
    u -= T(l);
    const h = {
      keyframes: Array.isArray(n) ? n : [null, n],
      ease: "easeOut",
      velocity: e.getVelocity(),
      ...o,
      delay: -u,
      onUpdate: (t) => {
        (e.set(t), o.onUpdate && o.onUpdate(t));
      },
      onComplete: () => {
        (a(), o.onComplete && o.onComplete());
      },
      name: t,
      motionValue: e,
      element: r ? void 0 : i,
    };
    ((function ({
      when: t,
      delay: e,
      delayChildren: n,
      staggerChildren: s,
      staggerDirection: i,
      repeat: r,
      repeatType: a,
      repeatDelay: o,
      from: l,
      elapsed: u,
      ...h
    }) {
      return !!Object.keys(h).length;
    })(o) || Object.assign(h, kn(t, h)),
      h.duration && (h.duration = T(h.duration)),
      h.repeatDelay && (h.repeatDelay = T(h.repeatDelay)),
      void 0 !== h.from && (h.keyframes[0] = h.from));
    let c = !1;
    if (
      ((!1 === h.type || (0 === h.duration && !h.repeatDelay)) &&
        (fn(h), 0 === h.delay && (c = !0)),
      (d.instantAnimations ||
        d.skipAnimations ||
        (null == i ? void 0 : i.shouldSkipAnimations)) &&
        ((c = !0), fn(h), (h.delay = 0)),
      (h.allowFlatten = !o.type && !o.ease),
      c && !r && void 0 !== e.get())
    ) {
      const t = (function (t, { repeat: e, repeatType: n = "loop" }) {
        const s = t.filter(Cn);
        return s[e && "loop" !== n && e % 2 == 1 ? 0 : s.length - 1];
      })(h.keyframes, o);
      if (void 0 !== t)
        return void X.update(() => {
          (h.onUpdate(t), h.onComplete());
        });
    }
    return o.isSync ? new Pe(h) : new vn(h);
  };
function Rn(t) {
  const e = [{}, {}];
  return (
    null == t ||
      t.values.forEach((t, n) => {
        ((e[0][n] = t.get()), (e[1][n] = t.getVelocity()));
      }),
    e
  );
}
function En(t, e, n, s) {
  if ("function" == typeof e) {
    const [i, r] = Rn(s);
    e = e(void 0 !== n ? n : t.custom, i, r);
  }
  if (
    ("string" == typeof e && (e = t.variants && t.variants[e]),
    "function" == typeof e)
  ) {
    const [i, r] = Rn(s);
    e = e(void 0 !== n ? n : t.custom, i, r);
  }
  return e;
}
const Dn = new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...Le,
]);
class On {
  constructor(t, e = {}) {
    ((this.canTrackVelocity = null),
      (this.events = {}),
      (this.updateAndNotify = (t) => {
        var e;
        const n = H.now();
        if (
          (this.updatedAt !== n && this.setPrevFrameValue(),
          (this.prev = this.current),
          this.setCurrent(t),
          this.current !== this.prev &&
            (null == (e = this.events.change) || e.notify(this.current),
            this.dependents))
        )
          for (const s of this.dependents) s.dirty();
      }),
      (this.hasAnimated = !1),
      this.setCurrent(t),
      (this.owner = e.owner));
  }
  setCurrent(t) {
    var e;
    ((this.current = t),
      (this.updatedAt = H.now()),
      null === this.canTrackVelocity &&
        void 0 !== t &&
        (this.canTrackVelocity = ((e = this.current), !isNaN(parseFloat(e)))));
  }
  setPrevFrameValue(t = this.current) {
    ((this.prevFrameValue = t), (this.prevUpdatedAt = this.updatedAt));
  }
  onChange(t) {
    return this.on("change", t);
  }
  on(t, e) {
    this.events[t] || (this.events[t] = new w());
    const n = this.events[t].add(e);
    return "change" === t
      ? () => {
          (n(),
            X.read(() => {
              this.events.change.getSize() || this.stop();
            }));
        }
      : n;
  }
  clearListeners() {
    for (const t in this.events) this.events[t].clear();
  }
  attach(t, e) {
    ((this.passiveEffect = t), (this.stopPassiveEffect = e));
  }
  set(t) {
    this.passiveEffect
      ? this.passiveEffect(t, this.updateAndNotify)
      : this.updateAndNotify(t);
  }
  setWithVelocity(t, e, n) {
    (this.set(e),
      (this.prev = void 0),
      (this.prevFrameValue = t),
      (this.prevUpdatedAt = this.updatedAt - n));
  }
  jump(t, e = !0) {
    (this.updateAndNotify(t),
      (this.prev = t),
      (this.prevUpdatedAt = this.prevFrameValue = void 0),
      e && this.stop(),
      this.stopPassiveEffect && this.stopPassiveEffect());
  }
  dirty() {
    var t;
    null == (t = this.events.change) || t.notify(this.current);
  }
  addDependent(t) {
    (this.dependents || (this.dependents = new Set()), this.dependents.add(t));
  }
  removeDependent(t) {
    this.dependents && this.dependents.delete(t);
  }
  get() {
    return this.current;
  }
  getPrevious() {
    return this.prev;
  }
  getVelocity() {
    const t = H.now();
    if (
      !this.canTrackVelocity ||
      void 0 === this.prevFrameValue ||
      t - this.updatedAt > 30
    )
      return 0;
    const e = Math.min(this.updatedAt - this.prevUpdatedAt, 30);
    return S(parseFloat(this.current) - parseFloat(this.prevFrameValue), e);
  }
  start(t) {
    return (
      this.stop(),
      new Promise((e) => {
        ((this.hasAnimated = !0),
          (this.animation = t(e)),
          this.events.animationStart && this.events.animationStart.notify());
      }).then(() => {
        (this.events.animationComplete &&
          this.events.animationComplete.notify(),
          this.clearAnimation());
      })
    );
  }
  stop() {
    (this.animation &&
      (this.animation.stop(),
      this.events.animationCancel && this.events.animationCancel.notify()),
      this.clearAnimation());
  }
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  destroy() {
    var t, e;
    (null == (t = this.dependents) || t.clear(),
      null == (e = this.events.destroy) || e.notify(),
      this.clearListeners(),
      this.stop(),
      this.stopPassiveEffect && this.stopPassiveEffect());
  }
}
function In(t, e) {
  return new On(t, e);
}
function Nn(t, e, n) {
  t.hasValue(e) ? t.getValue(e).set(n) : t.addValue(e, In(n));
}
function Kn(t) {
  return ((t) => Array.isArray(t))(t) ? t[t.length - 1] || 0 : t;
}
function jn(t, e) {
  const n = (function (t, e) {
    const n = t.getProps();
    return En(n, e, n.custom, t);
  })(t, e);
  let { transitionEnd: s = {}, transition: i = {}, ...r } = n || {};
  r = { ...r, ...s };
  for (const a in r) {
    Nn(t, a, Kn(r[a]));
  }
}
const Wn = (t) => Boolean(t && t.getVelocity);
function Ln(t, e) {
  const n = t.getValue("willChange");
  if (((s = n), Boolean(Wn(s) && s.add))) return n.add(e);
  if (!n && d.WillChange) {
    const n = new d.WillChange("auto");
    (t.addValue("willChange", n), n.add(e));
  }
  var s;
}
function $n(t) {
  return t.replace(/([A-Z])/g, (t) => `-${t.toLowerCase()}`);
}
const Yn = "data-" + $n("framerAppearId");
function Un(t) {
  return t.props[Yn];
}
function Xn({ protectedKeys: t, needsAnimating: e }, n) {
  const s = t.hasOwnProperty(n) && !0 !== e[n];
  return ((e[n] = !1), s);
}
function qn(t, e, { delay: n = 0, transitionOverride: s, type: i } = {}) {
  let { transition: r, transitionEnd: a, ...o } = e;
  const l = t.getDefaultTransition();
  r = r ? Fn(r, l) : l;
  const u = null == r ? void 0 : r.reduceMotion;
  s && (r = s);
  const h = [],
    c = i && t.animationState && t.animationState.getState()[i];
  for (const d in o) {
    const e = t.getValue(d, t.latestValues[d] ?? null),
      s = o[d];
    if (void 0 === s || (c && Xn(c, d))) continue;
    const i = { delay: n, ...Pn(r || {}, d) },
      a = e.get();
    if (
      void 0 !== a &&
      !e.isAnimating &&
      !Array.isArray(s) &&
      s === a &&
      !i.velocity
    )
      continue;
    let l = !1;
    if (window.MotionHandoffAnimation) {
      const e = Un(t);
      if (e) {
        const t = window.MotionHandoffAnimation(e, d, X);
        null !== t && ((i.startTime = t), (l = !0));
      }
    }
    Ln(t, d);
    const p = u ?? t.shouldReduceMotion;
    e.start(Bn(d, e, s, p && Dn.has(d) ? { type: !1 } : i, t, l));
    const m = e.animation;
    m && h.push(m);
  }
  if (a) {
    const e = () =>
      X.update(() => {
        a && jn(t, a);
      });
    h.length ? Promise.all(h).then(e) : e();
  }
  return h;
}
const _n = (t) => (e) => e.test(t),
  zn = [st, yt, gt, ft, bt, vt, { test: (t) => "auto" === t, parse: (t) => t }],
  Zn = (t) => zn.find(_n(t));
function Hn(t) {
  return "number" == typeof t
    ? 0 === t
    : null === t || "none" === t || "0" === t || m(t);
}
const Gn = new Set(["brightness", "contrast", "saturate", "opacity"]);
function Jn(t) {
  const [e, n] = t.slice(0, -1).split("(");
  if ("drop-shadow" === e) return t;
  const [s] = n.match(ot) || [];
  if (!s) return t;
  const i = n.replace(s, "");
  let r = Gn.has(e) ? 1 : 0;
  return (s !== n && (r *= 100), e + "(" + r + i + ")");
}
const Qn = /\b([a-z-]*)\(.*?\)/gu,
  ts = {
    ...Bt,
    getAnimatableNone: (t) => {
      const e = t.match(Qn);
      return e ? e.map(Jn).join(" ") : t;
    },
  },
  es = { ...st, transform: Math.round },
  ns = {
    borderWidth: yt,
    borderTopWidth: yt,
    borderRightWidth: yt,
    borderBottomWidth: yt,
    borderLeftWidth: yt,
    borderRadius: yt,
    borderTopLeftRadius: yt,
    borderTopRightRadius: yt,
    borderBottomRightRadius: yt,
    borderBottomLeftRadius: yt,
    width: yt,
    maxWidth: yt,
    height: yt,
    maxHeight: yt,
    top: yt,
    right: yt,
    bottom: yt,
    left: yt,
    inset: yt,
    insetBlock: yt,
    insetBlockStart: yt,
    insetBlockEnd: yt,
    insetInline: yt,
    insetInlineStart: yt,
    insetInlineEnd: yt,
    padding: yt,
    paddingTop: yt,
    paddingRight: yt,
    paddingBottom: yt,
    paddingLeft: yt,
    paddingBlock: yt,
    paddingBlockStart: yt,
    paddingBlockEnd: yt,
    paddingInline: yt,
    paddingInlineStart: yt,
    paddingInlineEnd: yt,
    margin: yt,
    marginTop: yt,
    marginRight: yt,
    marginBottom: yt,
    marginLeft: yt,
    marginBlock: yt,
    marginBlockStart: yt,
    marginBlockEnd: yt,
    marginInline: yt,
    marginInlineStart: yt,
    marginInlineEnd: yt,
    fontSize: yt,
    backgroundPositionX: yt,
    backgroundPositionY: yt,
    ...{
      rotate: ft,
      rotateX: ft,
      rotateY: ft,
      rotateZ: ft,
      scale: rt,
      scaleX: rt,
      scaleY: rt,
      scaleZ: rt,
      skew: ft,
      skewX: ft,
      skewY: ft,
      distance: yt,
      translateX: yt,
      translateY: yt,
      translateZ: yt,
      x: yt,
      y: yt,
      z: yt,
      perspective: yt,
      transformPerspective: yt,
      opacity: it,
      originX: wt,
      originY: wt,
      originZ: yt,
    },
    zIndex: es,
    fillOpacity: it,
    strokeOpacity: it,
    numOctaves: es,
  },
  ss = {
    ...ns,
    color: Mt,
    backgroundColor: Mt,
    outlineColor: Mt,
    fill: Mt,
    stroke: Mt,
    borderColor: Mt,
    borderTopColor: Mt,
    borderRightColor: Mt,
    borderBottomColor: Mt,
    borderLeftColor: Mt,
    filter: ts,
    WebkitFilter: ts,
  },
  is = (t) => ss[t];
function rs(t, e) {
  let n = is(t);
  return (
    n !== ts && (n = Bt),
    n.getAnimatableNone ? n.getAnimatableNone(e) : void 0
  );
}
const as = new Set(["auto", "none", "0"]);
class os extends Qe {
  constructor(t, e, n, s, i) {
    super(t, e, n, s, i, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, element: e, name: n } = this;
    if (!e || !e.current) return;
    super.readKeyframes();
    for (let o = 0; o < t.length; o++) {
      let n = t[o];
      if ("string" == typeof n && ((n = n.trim()), tt(n))) {
        const s = Sn(n, e.current);
        (void 0 !== s && (t[o] = s),
          o === t.length - 1 && (this.finalKeyframe = n));
      }
    }
    if ((this.resolveNoneKeyframes(), !Dn.has(n) || 2 !== t.length)) return;
    const [s, i] = t,
      r = Zn(s),
      a = Zn(i);
    if (nt(s) !== nt(i) && qe[n]) this.needsMeasurement = !0;
    else if (r !== a)
      if (Ye(r) && Ye(a))
        for (let o = 0; o < t.length; o++) {
          const e = t[o];
          "string" == typeof e && (t[o] = parseFloat(e));
        }
      else qe[n] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: t, name: e } = this,
      n = [];
    for (let s = 0; s < t.length; s++) (null === t[s] || Hn(t[s])) && n.push(s);
    n.length &&
      (function (t, e, n) {
        let s,
          i = 0;
        for (; i < t.length && !s; ) {
          const e = t[i];
          ("string" == typeof e &&
            !as.has(e) &&
            kt(e).values.length &&
            (s = t[i]),
            i++);
        }
        if (s && n) for (const r of e) t[r] = rs(n, s);
      })(t, n, e);
  }
  measureInitialState() {
    const { element: t, unresolvedKeyframes: e, name: n } = this;
    if (!t || !t.current) return;
    ("height" === n && (this.suspendedScrollY = window.pageYOffset),
      (this.measuredOrigin = qe[n](
        t.measureViewportBox(),
        window.getComputedStyle(t.current),
      )),
      (e[0] = this.measuredOrigin));
    const s = e[e.length - 1];
    void 0 !== s && t.getValue(n, s).jump(s, !1);
  }
  measureEndState() {
    var t;
    const { element: e, name: n, unresolvedKeyframes: s } = this;
    if (!e || !e.current) return;
    const i = e.getValue(n);
    i && i.jump(this.measuredOrigin, !1);
    const r = s.length - 1,
      a = s[r];
    ((s[r] = qe[n](e.measureViewportBox(), window.getComputedStyle(e.current))),
      null !== a && void 0 === this.finalKeyframe && (this.finalKeyframe = a),
      (null == (t = this.removedTransforms) ? void 0 : t.length) &&
        this.removedTransforms.forEach(([t, n]) => {
          e.getValue(t).set(n);
        }),
      this.resolveNoneKeyframes());
  }
}
const ls = new Set(["opacity", "clipPath", "filter", "transform"]);
const us = (t, e) => (e && "number" == typeof t ? e.transform(t) : t),
  { schedule: hs } = U(queueMicrotask, !1);
function cs(t) {
  return "object" == typeof (e = t) && null !== e && "ownerSVGElement" in t;
  var e;
}
const ds = [...zn, Mt, Bt],
  ps = () => ({ x: { min: 0, max: 0 }, y: { min: 0, max: 0 } }),
  ms = new WeakMap();
const fs = [
  "initial",
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit",
];
function gs(t) {
  return (
    (null !== (e = t.animate) &&
      "object" == typeof e &&
      "function" == typeof e.start) ||
    fs.some((e) =>
      (function (t) {
        return "string" == typeof t || Array.isArray(t);
      })(t[e]),
    )
  );
  var e;
}
const ys = { current: null },
  vs = { current: !1 },
  bs = "undefined" != typeof window;
const ws = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete",
];
let Ts = {};
class Ms {
  scrapeMotionValuesFromProps(t, e, n) {
    return {};
  }
  constructor(
    {
      parent: t,
      props: e,
      presenceContext: n,
      reducedMotionConfig: s,
      skipAnimations: i,
      blockInitialAnimation: r,
      visualState: a,
    },
    o = {},
  ) {
    ((this.current = null),
      (this.children = new Set()),
      (this.isVariantNode = !1),
      (this.isControllingVariants = !1),
      (this.shouldReduceMotion = null),
      (this.shouldSkipAnimations = !1),
      (this.values = new Map()),
      (this.KeyframeResolver = Qe),
      (this.features = {}),
      (this.valueSubscriptions = new Map()),
      (this.prevMotionValues = {}),
      (this.hasBeenMounted = !1),
      (this.events = {}),
      (this.propEventSubscriptions = {}),
      (this.notifyUpdate = () => this.notify("Update", this.latestValues)),
      (this.render = () => {
        this.current &&
          (this.triggerBuild(),
          this.renderInstance(
            this.current,
            this.renderState,
            this.props.style,
            this.projection,
          ));
      }),
      (this.renderScheduledAt = 0),
      (this.scheduleRender = () => {
        const t = H.now();
        this.renderScheduledAt < t &&
          ((this.renderScheduledAt = t), X.render(this.render, !1, !0));
      }));
    const { latestValues: l, renderState: u } = a;
    ((this.latestValues = l),
      (this.baseTarget = { ...l }),
      (this.initialValues = e.initial ? { ...l } : {}),
      (this.renderState = u),
      (this.parent = t),
      (this.props = e),
      (this.presenceContext = n),
      (this.depth = t ? t.depth + 1 : 0),
      (this.reducedMotionConfig = s),
      (this.skipAnimationsConfig = i),
      (this.options = o),
      (this.blockInitialAnimation = Boolean(r)),
      (this.isControllingVariants = gs(e)),
      (this.isVariantNode = (function (t) {
        return Boolean(gs(t) || t.variants);
      })(e)),
      this.isVariantNode && (this.variantChildren = new Set()),
      (this.manuallyAnimateOnMount = Boolean(t && t.current)));
    const { willChange: h, ...c } = this.scrapeMotionValuesFromProps(
      e,
      {},
      this,
    );
    for (const d in c) {
      const t = c[d];
      void 0 !== l[d] && Wn(t) && t.set(l[d]);
    }
  }
  mount(t) {
    var e, n;
    if (this.hasBeenMounted)
      for (const s in this.initialValues)
        (null == (e = this.values.get(s)) || e.jump(this.initialValues[s]),
          (this.latestValues[s] = this.initialValues[s]));
    ((this.current = t),
      ms.set(t, this),
      this.projection && !this.projection.instance && this.projection.mount(t),
      this.parent &&
        this.isVariantNode &&
        !this.isControllingVariants &&
        (this.removeFromVariantTree = this.parent.addVariantChild(this)),
      this.values.forEach((t, e) => this.bindToMotionValue(e, t)),
      "never" === this.reducedMotionConfig
        ? (this.shouldReduceMotion = !1)
        : "always" === this.reducedMotionConfig
          ? (this.shouldReduceMotion = !0)
          : (vs.current ||
              (function () {
                if (((vs.current = !0), bs))
                  if (window.matchMedia) {
                    const t = window.matchMedia("(prefers-reduced-motion)"),
                      e = () => (ys.current = t.matches);
                    (t.addEventListener("change", e), e());
                  } else ys.current = !1;
              })(),
            (this.shouldReduceMotion = ys.current)),
      (this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1),
      null == (n = this.parent) || n.addChild(this),
      this.update(this.props, this.presenceContext),
      (this.hasBeenMounted = !0));
  }
  unmount() {
    var t;
    (this.projection && this.projection.unmount(),
      q(this.notifyUpdate),
      q(this.render),
      this.valueSubscriptions.forEach((t) => t()),
      this.valueSubscriptions.clear(),
      this.removeFromVariantTree && this.removeFromVariantTree(),
      null == (t = this.parent) || t.removeChild(this));
    for (const e in this.events) this.events[e].clear();
    for (const e in this.features) {
      const t = this.features[e];
      t && (t.unmount(), (t.isMounted = !1));
    }
    this.current = null;
  }
  addChild(t) {
    (this.children.add(t),
      this.enteringChildren ?? (this.enteringChildren = new Set()),
      this.enteringChildren.add(t));
  }
  removeChild(t) {
    (this.children.delete(t),
      this.enteringChildren && this.enteringChildren.delete(t));
  }
  bindToMotionValue(t, e) {
    if (
      (this.valueSubscriptions.has(t) && this.valueSubscriptions.get(t)(),
      e.accelerate && ls.has(t) && this.current instanceof HTMLElement)
    ) {
      const {
          factory: n,
          keyframes: s,
          times: i,
          ease: r,
          duration: a,
        } = e.accelerate,
        o = new hn({
          element: this.current,
          name: t,
          keyframes: s,
          times: i,
          ease: r,
          duration: T(a),
        }),
        l = n(o);
      return void this.valueSubscriptions.set(t, () => {
        (l(), o.cancel());
      });
    }
    const n = $e.has(t);
    n && this.onBindTransform && this.onBindTransform();
    const s = e.on("change", (e) => {
      ((this.latestValues[t] = e),
        this.props.onUpdate && X.preRender(this.notifyUpdate),
        n && this.projection && (this.projection.isTransformDirty = !0),
        this.scheduleRender());
    });
    let i;
    ("undefined" != typeof window &&
      window.MotionCheckAppearSync &&
      (i = window.MotionCheckAppearSync(this, t, e)),
      this.valueSubscriptions.set(t, () => {
        (s(), i && i(), e.owner && e.stop());
      }));
  }
  sortNodePosition(t) {
    return this.current && this.sortInstanceNodePosition && this.type === t.type
      ? this.sortInstanceNodePosition(this.current, t.current)
      : 0;
  }
  updateFeatures() {
    let t = "animation";
    for (t in Ts) {
      const e = Ts[t];
      if (!e) continue;
      const { isEnabled: n, Feature: s } = e;
      if (
        (!this.features[t] &&
          s &&
          n(this.props) &&
          (this.features[t] = new s(this)),
        this.features[t])
      ) {
        const e = this.features[t];
        e.isMounted ? e.update() : (e.mount(), (e.isMounted = !0));
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  measureViewportBox() {
    return this.current
      ? this.measureInstanceViewportBox(this.current, this.props)
      : { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
  }
  getStaticValue(t) {
    return this.latestValues[t];
  }
  setStaticValue(t, e) {
    this.latestValues[t] = e;
  }
  update(t, e) {
    ((t.transformTemplate || this.props.transformTemplate) &&
      this.scheduleRender(),
      (this.prevProps = this.props),
      (this.props = t),
      (this.prevPresenceContext = this.presenceContext),
      (this.presenceContext = e));
    for (let n = 0; n < ws.length; n++) {
      const e = ws[n];
      this.propEventSubscriptions[e] &&
        (this.propEventSubscriptions[e](),
        delete this.propEventSubscriptions[e]);
      const s = t["on" + e];
      s && (this.propEventSubscriptions[e] = this.on(e, s));
    }
    ((this.prevMotionValues = (function (t, e, n) {
      for (const s in e) {
        const i = e[s],
          r = n[s];
        if (Wn(i)) t.addValue(s, i);
        else if (Wn(r)) t.addValue(s, In(i, { owner: t }));
        else if (r !== i)
          if (t.hasValue(s)) {
            const e = t.getValue(s);
            !0 === e.liveStyle ? e.jump(i) : e.hasAnimated || e.set(i);
          } else {
            const e = t.getStaticValue(s);
            t.addValue(s, In(void 0 !== e ? e : i, { owner: t }));
          }
      }
      for (const s in n) void 0 === e[s] && t.removeValue(s);
      return e;
    })(
      this,
      this.scrapeMotionValuesFromProps(t, this.prevProps || {}, this),
      this.prevMotionValues,
    )),
      this.handleChildMotionValue && this.handleChildMotionValue());
  }
  getProps() {
    return this.props;
  }
  getVariant(t) {
    return this.props.variants ? this.props.variants[t] : void 0;
  }
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode
      ? this
      : this.parent
        ? this.parent.getClosestVariantNode()
        : void 0;
  }
  addVariantChild(t) {
    const e = this.getClosestVariantNode();
    if (e)
      return (
        e.variantChildren && e.variantChildren.add(t),
        () => e.variantChildren.delete(t)
      );
  }
  addValue(t, e) {
    const n = this.values.get(t);
    e !== n &&
      (n && this.removeValue(t),
      this.bindToMotionValue(t, e),
      this.values.set(t, e),
      (this.latestValues[t] = e.get()));
  }
  removeValue(t) {
    this.values.delete(t);
    const e = this.valueSubscriptions.get(t);
    (e && (e(), this.valueSubscriptions.delete(t)),
      delete this.latestValues[t],
      this.removeValueFromRenderState(t, this.renderState));
  }
  hasValue(t) {
    return this.values.has(t);
  }
  getValue(t, e) {
    if (this.props.values && this.props.values[t]) return this.props.values[t];
    let n = this.values.get(t);
    return (
      void 0 === n &&
        void 0 !== e &&
        ((n = In(null === e ? void 0 : e, { owner: this })),
        this.addValue(t, n)),
      n
    );
  }
  readValue(t, e) {
    let n =
      void 0 === this.latestValues[t] && this.current
        ? (this.getBaseTargetFromProps(this.props, t) ??
          this.readValueFromInstance(this.current, t, this.options))
        : this.latestValues[t];
    var s;
    return (
      null != n &&
        ("string" == typeof n && (p(n) || m(n))
          ? (n = parseFloat(n))
          : ((s = n), !ds.find(_n(s)) && Bt.test(e) && (n = rs(t, e))),
        this.setBaseTarget(t, Wn(n) ? n.get() : n)),
      Wn(n) ? n.get() : n
    );
  }
  setBaseTarget(t, e) {
    this.baseTarget[t] = e;
  }
  getBaseTarget(t) {
    var e;
    const { initial: n } = this.props;
    let s;
    if ("string" == typeof n || "object" == typeof n) {
      const i = En(
        this.props,
        n,
        null == (e = this.presenceContext) ? void 0 : e.custom,
      );
      i && (s = i[t]);
    }
    if (n && void 0 !== s) return s;
    const i = this.getBaseTargetFromProps(this.props, t);
    return void 0 === i || Wn(i)
      ? void 0 !== this.initialValues[t] && void 0 === s
        ? void 0
        : this.baseTarget[t]
      : i;
  }
  on(t, e) {
    return (
      this.events[t] || (this.events[t] = new w()),
      this.events[t].add(e)
    );
  }
  notify(t, ...e) {
    this.events[t] && this.events[t].notify(...e);
  }
  scheduleRenderMicrotask() {
    hs.render(this.render);
  }
}
class Ss extends Ms {
  constructor() {
    (super(...arguments), (this.KeyframeResolver = os));
  }
  sortInstanceNodePosition(t, e) {
    return 2 & t.compareDocumentPosition(e) ? 1 : -1;
  }
  getBaseTargetFromProps(t, e) {
    const n = t.style;
    return n ? n[e] : void 0;
  }
  removeValueFromRenderState(t, { vars: e, style: n }) {
    (delete e[t], delete n[t]);
  }
  handleChildMotionValue() {
    this.childSubscription &&
      (this.childSubscription(), delete this.childSubscription);
    const { children: t } = this.props;
    Wn(t) &&
      (this.childSubscription = t.on("change", (t) => {
        this.current && (this.current.textContent = `${t}`);
      }));
  }
}
const As = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective",
  },
  xs = Le.length;
function Vs(t, e, n) {
  const { style: s, vars: i, transformOrigin: r } = t;
  let a = !1,
    o = !1;
  for (const l in e) {
    const t = e[l];
    if ($e.has(l)) a = !0;
    else if (J(l)) i[l] = t;
    else {
      const e = us(t, ns[l]);
      l.startsWith("origin") ? ((o = !0), (r[l] = e)) : (s[l] = e);
    }
  }
  if (
    (e.transform ||
      (a || n
        ? (s.transform = (function (t, e, n) {
            let s = "",
              i = !0;
            for (let r = 0; r < xs; r++) {
              const a = Le[r],
                o = t[a];
              if (void 0 === o) continue;
              let l = !0;
              if ("number" == typeof o)
                l = o === (a.startsWith("scale") ? 1 : 0);
              else {
                const t = parseFloat(o);
                l = a.startsWith("scale") ? 1 === t : 0 === t;
              }
              if (!l || n) {
                const t = us(o, ns[a]);
                (l || ((i = !1), (s += `${As[a] || a}(${t}) `)),
                  n && (e[a] = t));
              }
            }
            return (
              (s = s.trim()),
              n ? (s = n(e, i ? "" : s)) : i && (s = "none"),
              s
            );
          })(e, t.transform, n))
        : s.transform && (s.transform = "none")),
    o)
  ) {
    const { originX: t = "50%", originY: e = "50%", originZ: n = 0 } = r;
    s.transformOrigin = `${t} ${e} ${n}`;
  }
}
function ks(t, { style: e, vars: n }, s, i) {
  const r = t.style;
  let a;
  for (a in e) r[a] = e[a];
  for (a in (null == i || i.applyProjectionStyles(r, s), n))
    r.setProperty(a, n[a]);
}
function Cs(t, e) {
  return e.max === e.min ? 0 : (t / (e.max - e.min)) * 100;
}
const Fs = {
    correct: (t, e) => {
      if (!e.target) return t;
      if ("string" == typeof t) {
        if (!yt.test(t)) return t;
        t = parseFloat(t);
      }
      return `${Cs(t, e.target.x)}% ${Cs(t, e.target.y)}%`;
    },
  },
  Ps = {
    correct: (t, { treeScale: e, projectionDelta: n }) => {
      const s = t,
        i = Bt.parse(t);
      if (i.length > 5) return s;
      const r = Bt.createTransformer(t),
        a = "number" != typeof i[0] ? 1 : 0,
        o = n.x.scale * e.x,
        l = n.y.scale * e.y;
      ((i[0 + a] /= o), (i[1 + a] /= l));
      const u = Dt(o, l, 0.5);
      return (
        "number" == typeof i[2 + a] && (i[2 + a] /= u),
        "number" == typeof i[3 + a] && (i[3 + a] /= u),
        r(i)
      );
    },
  },
  Bs = {
    borderRadius: {
      ...Fs,
      applyTo: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
      ],
    },
    borderTopLeftRadius: Fs,
    borderTopRightRadius: Fs,
    borderBottomLeftRadius: Fs,
    borderBottomRightRadius: Fs,
    boxShadow: Ps,
  };
function Rs(t, { layout: e, layoutId: n }) {
  return (
    $e.has(t) ||
    t.startsWith("origin") ||
    ((e || void 0 !== n) && (!!Bs[t] || "opacity" === t))
  );
}
function Es(t, e, n) {
  var s;
  const i = t.style,
    r = null == e ? void 0 : e.style,
    a = {};
  if (!i) return a;
  for (const o in i)
    (Wn(i[o]) ||
      (r && Wn(r[o])) ||
      Rs(o, t) ||
      void 0 !==
        (null == (s = null == n ? void 0 : n.getValue(o))
          ? void 0
          : s.liveStyle)) &&
      (a[o] = i[o]);
  return a;
}
class Ds extends Ss {
  constructor() {
    (super(...arguments), (this.type = "html"), (this.renderInstance = ks));
  }
  readValueFromInstance(t, e) {
    var n, s;
    if ($e.has(e))
      return (null == (n = this.projection) ? void 0 : n.isProjecting)
        ? Ke(e)
        : ((t, e) => {
            const { transform: n = "none" } = getComputedStyle(t);
            return je(n, e);
          })(t, e);
    {
      const n = ((s = t), window.getComputedStyle(s)),
        i = (J(e) ? n.getPropertyValue(e) : n[e]) || 0;
      return "string" == typeof i ? i.trim() : i;
    }
  }
  measureInstanceViewportBox(t, { transformPagePoint: e }) {
    return (function (t, e) {
      return (function ({ top: t, left: e, right: n, bottom: s }) {
        return { x: { min: e, max: n }, y: { min: t, max: s } };
      })(
        (function (t, e) {
          if (!e) return t;
          const n = e({ x: t.left, y: t.top }),
            s = e({ x: t.right, y: t.bottom });
          return { top: n.y, left: n.x, bottom: s.y, right: s.x };
        })(t.getBoundingClientRect(), e),
      );
    })(t, e);
  }
  build(t, e, n) {
    Vs(t, e, n.transformTemplate);
  }
  scrapeMotionValuesFromProps(t, e, n) {
    return Es(t, e, n);
  }
}
class Os extends Ms {
  constructor() {
    (super(...arguments), (this.type = "object"));
  }
  readValueFromInstance(t, e) {
    if (
      (function (t, e) {
        return t in e;
      })(e, t)
    ) {
      const n = t[e];
      if ("string" == typeof n || "number" == typeof n) return n;
    }
  }
  getBaseTargetFromProps() {}
  removeValueFromRenderState(t, e) {
    delete e.output[t];
  }
  measureInstanceViewportBox() {
    return { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
  }
  build(t, e) {
    Object.assign(t.output, e);
  }
  renderInstance(t, { output: e }) {
    Object.assign(t, e);
  }
  sortInstanceNodePosition() {
    return 0;
  }
}
const Is = { offset: "stroke-dashoffset", array: "stroke-dasharray" },
  Ns = { offset: "strokeDashoffset", array: "strokeDasharray" };
const Ks = ["offsetDistance", "offsetPath", "offsetRotate", "offsetAnchor"];
function js(
  t,
  {
    attrX: e,
    attrY: n,
    attrScale: s,
    pathLength: i,
    pathSpacing: r = 1,
    pathOffset: a = 0,
    ...o
  },
  l,
  u,
  h,
) {
  if ((Vs(t, o, u), l))
    return void (t.style.viewBox && (t.attrs.viewBox = t.style.viewBox));
  ((t.attrs = t.style), (t.style = {}));
  const { attrs: c, style: d } = t;
  (c.transform && ((d.transform = c.transform), delete c.transform),
    (d.transform || c.transformOrigin) &&
      ((d.transformOrigin = c.transformOrigin ?? "50% 50%"),
      delete c.transformOrigin),
    d.transform &&
      ((d.transformBox = (null == h ? void 0 : h.transformBox) ?? "fill-box"),
      delete c.transformBox));
  for (const p of Ks) void 0 !== c[p] && ((d[p] = c[p]), delete c[p]);
  (void 0 !== e && (c.x = e),
    void 0 !== n && (c.y = n),
    void 0 !== s && (c.scale = s),
    void 0 !== i &&
      (function (t, e, n = 1, s = 0, i = !0) {
        t.pathLength = 1;
        const r = i ? Is : Ns;
        ((t[r.offset] = "" + -s), (t[r.array] = `${e} ${n}`));
      })(c, i, r, a, !1));
}
const Ws = new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust",
]);
class Ls extends Ss {
  constructor() {
    (super(...arguments),
      (this.type = "svg"),
      (this.isSVGTag = !1),
      (this.measureInstanceViewportBox = ps));
  }
  getBaseTargetFromProps(t, e) {
    return t[e];
  }
  readValueFromInstance(t, e) {
    if ($e.has(e)) {
      const t = is(e);
      return (t && t.default) || 0;
    }
    return ((e = Ws.has(e) ? e : $n(e)), t.getAttribute(e));
  }
  scrapeMotionValuesFromProps(t, e, n) {
    return (function (t, e, n) {
      const s = Es(t, e, n);
      for (const i in t)
        (Wn(t[i]) || Wn(e[i])) &&
          (s[
            -1 !== Le.indexOf(i)
              ? "attr" + i.charAt(0).toUpperCase() + i.substring(1)
              : i
          ] = t[i]);
      return s;
    })(t, e, n);
  }
  build(t, e, n) {
    js(t, e, this.isSVGTag, n.transformTemplate, n.style);
  }
  renderInstance(t, e, n, s) {
    !(function (t, e, n, s) {
      ks(t, e, void 0, s);
      for (const i in e.attrs)
        t.setAttribute(Ws.has(i) ? i : $n(i), e.attrs[i]);
    })(t, e, 0, s);
  }
  mount(t) {
    var e;
    ((this.isSVGTag =
      "string" == typeof (e = t.tagName) && "svg" === e.toLowerCase()),
      super.mount(t));
  }
}
function $s(t) {
  return "object" == typeof t && !Array.isArray(t);
}
function Ys(t, e, n, s) {
  return null == t
    ? []
    : "string" == typeof t && $s(e)
      ? (function (t, e, n) {
          if (null == t) return [];
          if (t instanceof EventTarget) return [t];
          if ("string" == typeof t) {
            let s = document;
            e && (s = e.current);
            const i = (null == n ? void 0 : n[t]) ?? s.querySelectorAll(t);
            return i ? Array.from(i) : [];
          }
          return Array.from(t).filter((t) => null != t);
        })(t, n, s)
      : t instanceof NodeList
        ? Array.from(t)
        : Array.isArray(t)
          ? t.filter((t) => null != t)
          : [t];
}
function Us(t, e, n) {
  return t * (e + 1);
}
function Xs(t, e, n, s) {
  return "number" == typeof e
    ? e
    : e.startsWith("-") || e.startsWith("+")
      ? Math.max(0, t + parseFloat(e))
      : "<" === e
        ? n
        : e.startsWith("<")
          ? Math.max(0, n + parseFloat(e.slice(1)))
          : (s.get(e) ?? t);
}
function qs(t, e, n, s, i, r) {
  !(function (t, e, n) {
    for (let s = 0; s < t.length; s++) {
      const i = t[s];
      i.at > e && i.at < n && (h(t, i), s--);
    }
  })(t, i, r);
  for (let a = 0; a < e.length; a++)
    t.push({ value: e[a], at: Dt(i, r, s[a]), easing: j(n, a) });
}
function _s(t, e) {
  for (let n = 0; n < t.length; n++) t[n] = t[n] / (e + 1);
}
function zs(t, e) {
  return t.at === e.at
    ? null === t.value
      ? 1
      : null === e.value
        ? -1
        : 0
    : t.at - e.at;
}
function Zs(t, e) {
  return (!e.has(t) && e.set(t, {}), e.get(t));
}
function Hs(t, e) {
  return (e[t] || (e[t] = []), e[t]);
}
function Gs(t) {
  return Array.isArray(t) ? t : [t];
}
function Js(t, e) {
  return t && t[e] ? { ...t, ...t[e] } : { ...t };
}
const Qs = (t) => "number" == typeof t,
  ti = (t) => t.every(Qs);
function ei(t) {
  const e = {
      presenceContext: null,
      props: {},
      visualState: {
        renderState: {
          transform: {},
          transformOrigin: {},
          style: {},
          vars: {},
          attrs: {},
        },
        latestValues: {},
      },
    },
    n =
      cs(t) &&
      !(function (t) {
        return cs(t) && "svg" === t.tagName;
      })(t)
        ? new Ls(e)
        : new Ds(e);
  (n.mount(t), ms.set(t, n));
}
function ni(t) {
  const e = new Os({
    presenceContext: null,
    props: {},
    visualState: { renderState: { output: {} }, latestValues: {} },
  });
  (e.mount(t), ms.set(t, e));
}
function si(t, e, n, s) {
  const i = [];
  if (
    (function (t, e) {
      return Wn(t) || "number" == typeof t || ("string" == typeof t && !$s(e));
    })(t, e)
  )
    i.push(
      (function (t, e, n) {
        const s = Wn(t) ? t : In(t);
        return (s.start(Bn("", s, e, n)), s.animation);
      })(t, ($s(e) && e.default) || e, (n && n.default) || n),
    );
  else {
    if (null == t) return i;
    const r = Ys(t, e, s),
      a = r.length;
    for (let t = 0; t < a; t++) {
      const s = r[t],
        o = s instanceof Element ? ei : ni;
      ms.has(s) || o(s);
      const l = ms.get(s),
        u = { ...n };
      ("delay" in u &&
        "function" == typeof u.delay &&
        (u.delay = u.delay(t, a)),
        i.push(...qn(l, { ...e, transition: u }, {})));
    }
  }
  return i;
}
function ii(t, e, n) {
  const s = [],
    i = (function (t, { defaultTransition: e = {}, ...n } = {}, s, i) {
      const r = e.duration || 0.3,
        a = new Map(),
        o = new Map(),
        l = {},
        u = new Map();
      let h = 0,
        c = 0,
        d = 0;
      for (let p = 0; p < t.length; p++) {
        const n = t[p];
        if ("string" == typeof n) {
          u.set(n, c);
          continue;
        }
        if (!Array.isArray(n)) {
          u.set(n.name, Xs(c, n.at, h, u));
          continue;
        }
        let [a, m, f = {}] = n;
        void 0 !== f.at && (c = Xs(c, f.at, h, u));
        let g = 0;
        const y = (t, n, s, a = 0, o = 0) => {
          const l = Gs(t),
            {
              delay: u = 0,
              times: h = Me(l),
              type: p = e.type || "keyframes",
              repeat: m,
              repeatType: f,
              repeatDelay: y = 0,
              ...v
            } = n;
          let { ease: b = e.ease || "easeOut", duration: w } = n;
          const M = "function" == typeof u ? u(a, o) : u,
            S = l.length,
            A = un(p) ? p : null == i ? void 0 : i[p || "keyframes"];
          if (S <= 2 && A) {
            let t = 100;
            if (2 === S && ti(l)) {
              const e = l[1] - l[0];
              t = Math.abs(e);
            }
            const n = { ...e, ...v };
            void 0 !== w && (n.duration = T(w));
            const s = Ht(n, t, A);
            ((b = s.ease), (w = s.duration));
          }
          w ?? (w = r);
          const x = c + M;
          1 === h.length && 0 === h[0] && (h[1] = 1);
          const V = h.length - l.length;
          if ((V > 0 && Te(h, V), 1 === l.length && l.unshift(null), m)) {
            w = Us(w, m);
            const t = [...l],
              e = [...h];
            b = Array.isArray(b) ? [...b] : [b];
            const n = [...b];
            for (let s = 0; s < m; s++) {
              l.push(...t);
              for (let i = 0; i < t.length; i++)
                (h.push(e[i] + (s + 1)),
                  b.push(0 === i ? "linear" : j(n, i - 1)));
            }
            _s(h, m);
          }
          const k = x + w;
          (qs(s, l, b, h, x, k),
            (g = Math.max(M + w, g)),
            (d = Math.max(k, d)));
        };
        if (Wn(a)) y(m, f, Hs("default", Zs(a, o)));
        else {
          const t = Ys(a, m, s, l),
            e = t.length;
          for (let n = 0; n < e; n++) {
            const s = Zs(t[n], o);
            for (const t in m) y(m[t], Js(f, t), Hs(t, s), n, e);
          }
        }
        ((h = c), (c += g));
      }
      return (
        o.forEach((t, s) => {
          for (const i in t) {
            const r = t[i];
            r.sort(zs);
            const o = [],
              l = [],
              u = [];
            for (let t = 0; t < r.length; t++) {
              const { at: e, value: n, easing: s } = r[t];
              (o.push(n), l.push(b(0, d, e)), u.push(s || "easeOut"));
            }
            (0 !== l[0] &&
              (l.unshift(0), o.unshift(o[0]), u.unshift("easeInOut")),
              1 !== l[l.length - 1] && (l.push(1), o.push(null)),
              a.has(s) || a.set(s, { keyframes: {}, transition: {} }));
            const h = a.get(s);
            h.keyframes[i] = o;
            const { type: c, ...p } = e;
            h.transition[i] = { ...p, duration: d, ease: u, times: l, ...n };
          }
        }),
        a
      );
    })(
      t.map((t) => {
        if (Array.isArray(t) && "function" == typeof t[0]) {
          const e = t[0],
            n = In(0);
          return (
            n.on("change", e),
            1 === t.length
              ? [n, [0, 1]]
              : 2 === t.length
                ? [n, [0, 1], t[1]]
                : [n, t[1], t[2]]
          );
        }
        return t;
      }),
      e,
      n,
      { spring: ve },
    );
  return (
    i.forEach(({ keyframes: t, transition: e }, n) => {
      s.push(...si(n, t, e));
    }),
    s
  );
}
const ri = (function (t = {}) {
    const { scope: e, reduceMotion: n } = t;
    return function (t, s, i) {
      let r,
        a = [];
      if (((o = t), Array.isArray(o) && o.some(Array.isArray)))
        a = ii(t, void 0 !== n ? { reduceMotion: n, ...s } : s, e);
      else {
        const { onComplete: o, ...l } = i || {};
        ("function" == typeof o && (r = o),
          (a = si(t, s, void 0 !== n ? { reduceMotion: n, ...l } : l, e)));
      }
      var o;
      const l = new Tn(a);
      return (
        r && l.finished.then(r),
        e &&
          (e.animations.push(l),
          l.finished.then(() => {
            h(e.animations, l);
          })),
        l
      );
    };
  })(),
  ai = t({
    __name: "typewriterEffect",
    props: {
      words: {},
      typingSpeed: { default: 100 },
      deletingSpeed: { default: 50 },
      delayBetweenWords: { default: 1e3 },
      className: {},
      cursorClassName: {},
    },
    setup(t) {
      const h = t,
        c = o(""),
        d = o(!1),
        p = o(0),
        m = o(null),
        f = o(null),
        g = l(() => {
          var t;
          return (null == (t = h.words[p.value]) ? void 0 : t.text) || "";
        }),
        y = l(() => {
          var t;
          return (null == (t = h.words[p.value]) ? void 0 : t.className) || "";
        });
      let v;
      const b = () => {
        !d.value && c.value.length < g.value.length
          ? (v = window.setTimeout(() => {
              ((c.value += g.value[c.value.length]), b());
            }, h.typingSpeed))
          : d.value && c.value.length > 0
            ? (v = window.setTimeout(() => {
                ((c.value = c.value.slice(0, -1)), b());
              }, h.deletingSpeed))
            : d.value || c.value.length !== g.value.length
              ? d.value &&
                0 === c.value.length &&
                ((d.value = !1),
                (p.value = (p.value + 1) % h.words.length),
                b())
              : (v = window.setTimeout(() => {
                  ((d.value = !0), b());
                }, h.delayBetweenWords));
      };
      return (
        e(() => {
          (b(),
            m.value && ri(m.value, { opacity: [0, 1] }, { duration: 0.3 }),
            f.value &&
              ri(
                f.value,
                { opacity: [0, 1] },
                { duration: 0.8, repeat: 1 / 0 },
              ));
        }),
        n(() => {
          clearTimeout(v);
        }),
        (e, n) => (
          u(),
          s(
            "div",
            { class: i(t.className) },
            [
              r(
                "span",
                { ref_key: "textElement", ref: m, class: i(y.value) },
                a(c.value),
                3,
              ),
              r(
                "span",
                {
                  ref_key: "cursorElement",
                  ref: f,
                  class: i(t.cursorClassName),
                },
                "|",
                2,
              ),
            ],
            2,
          )
        )
      );
    },
  });
export { ai as _ };
