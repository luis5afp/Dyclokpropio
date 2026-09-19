import { C as e, c5 as i, iW as n, iX as t, V as l } from "./index-BUIbb6Pa.js";
function u(e, i = !1, n, t = !0) {
  var l, u, m;
  if (n) return 0;
  if (!e) return 0;
  let a = (t && Reflect.get(e.discount || {}, i ? 360 : 30)) || 1,
    v = 0;
  if (e.costConfig.fixedMonth) v = e.costConfig.fixedMonthPrice * a;
  else {
    let n = i ? 360 : 30;
    v =
      ((null ==
      (m =
        null == (u = null == (l = e.costConfig) ? void 0 : l.durationMonthPrice)
          ? void 0
          : u.find((e) => e.duration == n))
        ? void 0
        : m.price) || 0) * a;
  }
  return v.toFixed(2);
}
function m(e, i = !1) {
  return 1 !== (Reflect.get(e.discount || {}, i ? 360 : 30) || 1);
}
const a = (u, m) => {
  let a = e(() => {
      var e;
      return ((null == (e = u.value) ? void 0 : e.type) || i.Free) == i.Free;
    }),
    v = e(() => {
      var e, i;
      return a.value ||
        !(null == (e = u.value.initConfig) ? void 0 : e.unlimited)
        ? u.value.envLimit
        : (null == (i = u.value.initConfig) ? void 0 : i.unlimited) &
            n.EnvLimit1
          ? -1
          : u.value.envLimit || 0;
    }),
    r = e(() => {
      var e;
      return a.value ||
        !(null == (e = u.value.initConfig) ? void 0 : e.unlimited)
        ? u.value.memberLimit
        : u.value.initConfig.unlimited & n.MemberLimit
          ? -1
          : u.value.memberLimit || 0;
    }),
    o = e(() => {
      var e;
      return a.value ||
        !(null == (e = u.value.initConfig) ? void 0 : e.unlimited)
        ? u.value.openLimit
        : u.value.initConfig.unlimited & n.OpenLimit
          ? -1
          : u.value.openLimit || 0;
    }),
    p = e(() => {
      var e, i, n;
      if (a.value || !u.value.extendConfig)
        return { min: v.value > 0 ? v.value : 0, max: null, step: 1 };
      let r = u.value.extendConfig;
      if (r.envType == t.UNIT)
        return {
          min: l.max([u.value.envLimit, r.envNumber]),
          max: r.envUpperLimit || 0,
          step: r.envNumber || 1,
        };
      {
        let t = r.envStep || [],
          a = {
            min: l.max([
              null == (e = t[0]) ? void 0 : e.step,
              v.value > 0 ? v.value : 0,
            ]),
            max:
              (null == (i = u.value.extendConfig) ? void 0 : i.envUpperLimit) ||
              0,
            step: (null == (n = t[0]) ? void 0 : n.step) || 10,
          },
          o = m.envLimit || 0;
        return (
          t.forEach((e) => {
            o >= e.min && o < e.max && (a.step = e.step);
          }),
          a
        );
      }
    }),
    d = e(() => {
      var e, i;
      if (a.value || !u.value.extendConfig)
        return { min: r.value > 0 ? r.value : 0, max: null, step: 1 };
      let n = u.value.extendConfig;
      if (n.memberType === t.UNIT)
        return {
          min: r.value > 0 ? r.value : 1,
          max: n.memberUpperLimit,
          step: 1,
        };
      {
        let t = n.memberStep || [],
          u = {
            min: l.max([
              null == (e = t[0]) ? void 0 : e.step,
              r.value > 0 ? r.value : 0,
            ]),
            max: l.max(t.map((e) => e.max)),
            step: (null == (i = t[0]) ? void 0 : i.step) || 10,
          },
          a = m.memberLimit || 0;
        return (
          t.forEach((e) => {
            a >= e.min && a < e.max && (u.step = e.step);
          }),
          u
        );
      }
    }),
    x = e(() => {
      var e, i;
      if (a.value || !u.value.extendConfig)
        return { min: o.value > 0 ? o.value : 0, max: null, step: 1 };
      let n = u.value.extendConfig;
      if (n.openEnvType === t.UNIT)
        return {
          min: l.max([n.openEnvNumber, o.value]),
          max: n.openEnvUpperLimit,
          step: n.openEnvNumber,
        };
      let v = n.openEnvStep || [],
        r = {
          min: l.max([
            null == (e = v[0]) ? void 0 : e.step,
            o.value > 0 ? o.value : 0,
          ]),
          max: l.max(v.map((e) => e.max)),
          step: (null == (i = v[0]) ? void 0 : i.step) || 10,
        },
        p = m.openLimit || 0;
      return (
        v.forEach((e) => {
          p >= e.min && p < e.max && (r.step = e.step);
        }),
        r
      );
    }),
    f = e(() => ({
      envLimit: u.value.extendConfig.envType === t.UNIT,
      openLimit: u.value.extendConfig.openEnvType === t.UNIT,
      memberLimit: u.value.extendConfig.memberType === t.UNIT,
    })),
    s = e(() => {
      var e, i, n;
      return {
        envLimit:
          (!a.value &&
            (null == (e = u.value.extendConfig) ? void 0 : e.extendEnv)) ||
          0,
        openLimit:
          (!a.value &&
            (null == (i = u.value.extendConfig) ? void 0 : i.extendOpenEnv)) ||
          0,
        memberLimit:
          (!a.value &&
            (null == (n = u.value.extendConfig) ? void 0 : n.extendMember)) ||
          0,
      };
    });
  return {
    envLimitNumType: v,
    memberLimitNumType: r,
    openLimitNumType: o,
    envLimitGradientPrice: p,
    memberLimitGradientPrice: d,
    openLimitGradientPrice: x,
    GradientMap: f,
    isFree: a,
    extendMap: s,
  };
};
export { u as g, m as s, a as u };
