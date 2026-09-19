import { aZ as t, a_ as e, a$ as i } from "./index-BUIbb6Pa.js";
var n,
  r,
  s,
  o = { exports: {} };
const a = e(
  (o.exports =
    ((n = "minute"),
    (r = /[+-]\d\d(?::?\d\d)?/g),
    (s = /([+-]|\d\d)/g),
    function (t, e, i) {
      var o = e.prototype;
      ((i.utc = function (t) {
        return new e({ date: t, utc: !0, args: arguments });
      }),
        (o.utc = function (t) {
          var e = i(this.toDate(), { locale: this.$L, utc: !0 });
          return t ? e.add(this.utcOffset(), n) : e;
        }),
        (o.local = function () {
          return i(this.toDate(), { locale: this.$L, utc: !1 });
        }));
      var a = o.parse;
      o.parse = function (t) {
        (t.utc && (this.$u = !0),
          this.$utils().u(t.$offset) || (this.$offset = t.$offset),
          a.call(this, t));
      };
      var u = o.init;
      o.init = function () {
        if (this.$u) {
          var t = this.$d;
          ((this.$y = t.getUTCFullYear()),
            (this.$M = t.getUTCMonth()),
            (this.$D = t.getUTCDate()),
            (this.$W = t.getUTCDay()),
            (this.$H = t.getUTCHours()),
            (this.$m = t.getUTCMinutes()),
            (this.$s = t.getUTCSeconds()),
            (this.$ms = t.getUTCMilliseconds()));
        } else u.call(this);
      };
      var f = o.utcOffset;
      o.utcOffset = function (t, e) {
        var i = this.$utils().u;
        if (i(t))
          return this.$u ? 0 : i(this.$offset) ? f.call(this) : this.$offset;
        if (
          "string" == typeof t &&
          null ===
            (t = (function (t) {
              void 0 === t && (t = "");
              var e = t.match(r);
              if (!e) return null;
              var i = ("" + e[0]).match(s) || ["-", 0, 0],
                n = i[0],
                o = 60 * +i[1] + +i[2];
              return 0 === o ? 0 : "+" === n ? o : -o;
            })(t))
        )
          return this;
        var o = Math.abs(t) <= 16 ? 60 * t : t;
        if (0 === o) return this.utc(e);
        var a = this.clone();
        if (e) return ((a.$offset = o), (a.$u = !1), a);
        var u = this.$u
          ? this.toDate().getTimezoneOffset()
          : -1 * this.utcOffset();
        return (
          ((a = this.local().add(o + u, n)).$offset = o),
          (a.$x.$localOffset = u),
          a
        );
      };
      var c = o.format;
      ((o.format = function (t) {
        var e = t || (this.$u ? "YYYY-MM-DDTHH:mm:ss[Z]" : "");
        return c.call(this, e);
      }),
        (o.valueOf = function () {
          var t = this.$utils().u(this.$offset)
            ? 0
            : this.$offset +
              (this.$x.$localOffset || this.$d.getTimezoneOffset());
          return this.$d.valueOf() - 6e4 * t;
        }),
        (o.isUTC = function () {
          return !!this.$u;
        }),
        (o.toISOString = function () {
          return this.toDate().toISOString();
        }),
        (o.toString = function () {
          return this.toDate().toUTCString();
        }));
      var h = o.toDate;
      o.toDate = function (t) {
        return "s" === t && this.$offset
          ? i(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate()
          : h.call(this);
      };
      var m = o.diff;
      o.diff = function (t, e, n) {
        if (t && this.$u === t.$u) return m.call(this, t, e, n);
        var r = this.local(),
          s = i(t).local();
        return m.call(r, s, e, n);
      };
    })),
);
var u = { exports: {} };
u.exports = (function () {
  var t = { year: 0, month: 1, day: 2, hour: 3, minute: 4, second: 5 },
    e = {};
  return function (i, n, r) {
    var s,
      o = function (t, i, n) {
        void 0 === n && (n = {});
        var r = new Date(t);
        return (function (t, i) {
          void 0 === i && (i = {});
          var n = i.timeZoneName || "short",
            r = t + "|" + n,
            s = e[r];
          return (
            s ||
              ((s = new Intl.DateTimeFormat("en-US", {
                hour12: !1,
                timeZone: t,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZoneName: n,
              })),
              (e[r] = s)),
            s
          );
        })(i, n).formatToParts(r);
      },
      a = function (e, i) {
        for (var n = o(e, i), s = [], a = 0; a < n.length; a += 1) {
          var u = n[a],
            f = u.type,
            c = u.value,
            h = t[f];
          h >= 0 && (s[h] = parseInt(c, 10));
        }
        var m = s[3],
          l = 24 === m ? 0 : m,
          $ =
            s[0] +
            "-" +
            s[1] +
            "-" +
            s[2] +
            " " +
            l +
            ":" +
            s[4] +
            ":" +
            s[5] +
            ":000",
          v = +e;
        return (r.utc($).valueOf() - (v -= v % 1e3)) / 6e4;
      },
      u = n.prototype;
    ((u.tz = function (t, e) {
      void 0 === t && (t = s);
      var i,
        n = this.utcOffset(),
        o = this.toDate(),
        a = o.toLocaleString("en-US", { timeZone: t }),
        u = Math.round((o - new Date(a)) / 1e3 / 60),
        f = 15 * -Math.round(o.getTimezoneOffset() / 15) - u;
      if (Number(f)) {
        if (
          ((i = r(a, { locale: this.$L })
            .$set("millisecond", this.$ms)
            .utcOffset(f, !0)),
          e)
        ) {
          var c = i.utcOffset();
          i = i.add(n - c, "minute");
        }
      } else i = this.utcOffset(0, e);
      return ((i.$x.$timezone = t), i);
    }),
      (u.offsetName = function (t) {
        var e = this.$x.$timezone || r.tz.guess(),
          i = o(this.valueOf(), e, { timeZoneName: t }).find(function (t) {
            return "timezonename" === t.type.toLowerCase();
          });
        return i && i.value;
      }));
    var f = u.startOf;
    ((u.startOf = function (t, e) {
      if (!this.$x || !this.$x.$timezone) return f.call(this, t, e);
      var i = r(this.format("YYYY-MM-DD HH:mm:ss:SSS"), { locale: this.$L });
      return f.call(i, t, e).tz(this.$x.$timezone, !0);
    }),
      (r.tz = function (t, e, i) {
        var n = i && e,
          o = i || e || s,
          u = a(+r(), o);
        if ("string" != typeof t) return r(t).tz(o);
        var f = (function (t, e, i) {
            var n = t - 60 * e * 1e3,
              r = a(n, i);
            if (e === r) return [n, e];
            var s = a((n -= 60 * (r - e) * 1e3), i);
            return r === s
              ? [n, r]
              : [t - 60 * Math.min(r, s) * 1e3, Math.max(r, s)];
          })(r.utc(t, n).valueOf(), u, o),
          c = f[0],
          h = f[1],
          m = r(c).utcOffset(h);
        return ((m.$x.$timezone = o), m);
      }),
      (r.tz.guess = function () {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
      }),
      (r.tz.setDefault = function (t) {
        s = t;
      }));
  };
})();
const f = e(u.exports),
  c = "Asia/Shanghai";
(i.extend(a), i.extend(f));
const h = [
  "YYYY-MM-DD HH:mm:ss",
  "YYYY/MM/DD HH:mm:ss",
  "YYYY-MM-DD",
  "YYYY/MM/DD",
  "YYYY-MM-DDTHH:mm:ss",
  "YYYY-MM-DDTHH:mm:ss",
];
function m({ timeStr: t, targetTimeZone: e }, n = c) {
  try {
    const r = (function (t) {
        for (const e of h) if (i(t, e, !0).isValid()) return e;
        throw new Error("未知时间格式");
      })(t),
      s = i.tz(t, r, n);
    return s.tz(e).format(r);
  } catch (s) {
    return t;
  }
}
function l(t) {
  return m({
    targetTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timeStr: t,
  });
}
function $(t) {
  let e = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return m({ targetTimeZone: c, timeStr: t }, e);
}
export { m as a, l as g, $ as s };
