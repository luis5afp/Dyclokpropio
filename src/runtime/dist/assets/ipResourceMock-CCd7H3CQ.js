import {
  dZ as e,
  cX as t,
  al as o,
  dT as n,
  dU as i,
  d_ as a,
  bc as r,
  cv as s,
  am as c,
  e2 as d,
  e0 as u,
} from "./index-BUIbb6Pa.js";
const p = async () =>
    (await n.get(i("/v1/ip-resource/statistics"), {}, { noLoading: !0 })).data,
  y = async (e = {}, t) =>
    (
      await n.get(i("/v1/ip-resource/dynamic-resource"), e, {
        noLoading: !0,
        ...(t ? { signal: t } : {}),
      })
    ).data,
  m = async () =>
    (
      await n.post(i("/v1/ip-resource/dynamic-resource/sync"), void 0, {
        noLoading: !0,
      })
    ).data,
  l = async (r) => {
    if (
      r.mode === e.FIXED_SESSION &&
      void 0 !== r.sessionMinutes &&
      (!Number.isInteger(r.sessionMinutes) || r.sessionMinutes <= 0)
    )
      throw new TypeError("sessionMinutes must be a positive integer");
    const s = {
      type: a.SOCKS5,
      proxySettingType: o.IP_RESOURCE,
      ipSourceType: t.DYNAMIC_IP_RESOURCE,
      ...(r.remark ? { remark: r.remark } : {}),
      ...(r.proxyGroupId ? { proxyGroupId: r.proxyGroupId } : {}),
      contentJson: {
        model: r.mode,
        ...(r.mode === e.FIXED_SESSION && void 0 !== r.sessionMinutes
          ? { sessionTimeout: r.sessionMinutes }
          : {}),
        ...(r.countryCode ? { country: r.countryCode } : {}),
        ...(r.stateCode ? { state: r.stateCode } : {}),
        ...(r.cityCode ? { city: r.cityCode } : {}),
      },
    };
    return (await n.post(i("/v1/proxy"), s)).data;
  },
  I = async (e) =>
    (
      await n.post(i("/v1/ip-resource/dynamic-proxies/check"), e, {
        noLoading: !0,
      })
    ).data,
  A = async (e) =>
    (await n.get(i("/v1/ip-resource/static-resources"), e, { noLoading: !0 }))
      .data,
  S = async (e, t) =>
    (
      await n.put(
        i(`/v1/ip-resource/static-resources/${e}/auto-renew`),
        { enabled: t },
        { noLoading: !0 },
      )
    ).data,
  g = async (e, t) => {
    const { staticType: o, regionId: a, ...r } = e;
    return (
      await n.post(i("/v1/ip-resource/calc_cost"), r, {
        noLoading: !0,
        ...(t ? { signal: t } : {}),
      })
    ).data;
  },
  f = async (e) => {
    const { staticType: t, regionId: o, ...a } = e;
    return (await n.post(i("/v1/ip-resource/submit"), a)).data;
  },
  T = (e) => JSON.parse(JSON.stringify(e)),
  w = (e) => Number(e.toFixed(2)),
  P = {
    trafficPackages: [
      { id: "traffic-10", trafficGb: 10, price: 35 },
      { id: "traffic-50", trafficGb: 50, price: 160 },
      { id: "traffic-100", trafficGb: 100, price: 300 },
      { id: "traffic-200", trafficGb: 200, price: 560 },
    ],
    minTrafficGb: 10,
    maxTrafficGb: 2e3,
    protocols: [a.HTTP, a.SOCKS5],
    modes: [e.RANDOM, e.FIXED_SESSION],
    sessionMinutes: [1, 5, 10, 30, 60],
    countries: [
      {
        code: "US",
        name: "美国",
        regions: [
          {
            code: "US-CA",
            name: "California",
            cities: [
              { code: "LAX", name: "Los Angeles" },
              { code: "SFO", name: "San Francisco" },
            ],
          },
          {
            code: "US-NY",
            name: "New York",
            cities: [{ code: "NYC", name: "New York City" }],
          },
        ],
      },
      {
        code: "DE",
        name: "德国",
        regions: [
          {
            code: "DE-HE",
            name: "Hessen",
            cities: [{ code: "FRA", name: "Frankfurt" }],
          },
        ],
      },
      {
        code: "NL",
        name: "荷兰",
        regions: [
          {
            code: "NL-NH",
            name: "North Holland",
            cities: [{ code: "AMS", name: "Amsterdam" }],
          },
        ],
      },
    ],
  },
  C = [
    { id: "residential", name: "住宅静态 IP" },
    { id: "datacenter", name: "数据中心静态 IP" },
  ],
  v = {
    residential: {
      countries: [
        { code: "US", name: "美国 · 加利福尼亚" },
        { code: "DE", name: "德国 · 法兰克福" },
        { code: "NL", name: "荷兰 · 阿姆斯特丹" },
      ],
      protocols: [a.HTTP, a.SOCKS5],
      durations: [
        { id: "7d", days: 7, unitPrice: 3.99 },
        { id: "30d", days: 30, unitPrice: 4.99 },
        { id: "90d", days: 90, unitPrice: 11.99 },
      ],
      inventory: 128,
    },
    datacenter: {
      countries: [
        { code: "US", name: "美国 · 弗吉尼亚" },
        { code: "GB", name: "英国 · 伦敦" },
        { code: "SG", name: "新加坡" },
      ],
      protocols: [a.HTTP, a.SOCKS5],
      durations: [
        { id: "7d", days: 7, unitPrice: 2.49 },
        { id: "30d", days: 30, unitPrice: 3.99 },
        { id: "90d", days: 90, unitPrice: 8.99 },
      ],
      inventory: 86,
    },
  },
  N = [
    {
      id: "dynamic-us-01",
      name: "美国店铺固定会话代理",
      protocol: a.SOCKS5,
      mode: e.FIXED_SESSION,
      sessionMinutes: 5,
      countryCode: "US",
      region: "California",
      city: "Los Angeles",
      status: d.AVAILABLE,
      environmentCount: 3,
      connection: {
        type: c.Socks5,
        host: "198.51.100.42",
        port: 1080,
        userName: "paraturbo_dynamic_us",
        passwd: "mock-password",
        ipType: s.IpAPI,
        ipAddrType: r.IPV4,
      },
    },
    {
      id: "dynamic-de-01",
      name: "德国动态代理",
      protocol: a.HTTP,
      mode: e.RANDOM,
      countryCode: "DE",
      region: "Hessen",
      city: "Frankfurt",
      status: d.AVAILABLE,
      environmentCount: 1,
      connection: {
        type: c.Http,
        host: "203.0.113.18",
        port: 8e3,
        userName: "paraturbo_dynamic_de",
        passwd: "mock-password",
        ipType: s.IpAPI,
        ipAddrType: r.IPV4,
      },
    },
    {
      id: "dynamic-nl-01",
      name: "荷兰固定会话代理",
      protocol: a.SOCKS5,
      mode: e.FIXED_SESSION,
      sessionMinutes: 10,
      countryCode: "NL",
      region: "North Holland",
      city: "Amsterdam",
      status: d.AVAILABLE,
      environmentCount: 0,
      connection: {
        type: c.Socks5,
        host: "192.0.2.25",
        port: 1080,
        userName: "paraturbo_dynamic_nl",
        passwd: "mock-password",
        ipType: s.IpAPI,
        ipAddrType: r.IPV4,
      },
    },
  ],
  D = [
    {
      id: "static-us-01",
      proxyTypeId: "residential",
      ip: "104.21.32.18",
      countryCode: "US",
      countryName: "美国",
      region: "California",
      protocol: a.SOCKS5,
      status: d.AVAILABLE,
      expireTime: "2026-08-13 14:32",
      remainingDays: 29,
      environmentCount: 3,
      autoRenew: !0,
      connection: {
        type: c.Socks5,
        host: "104.21.32.18",
        port: 1080,
        userName: "paraturbo_static_us",
        passwd: "mock-password",
        ipType: s.IpAPI,
        ipAddrType: r.IPV4,
      },
    },
    {
      id: "static-de-01",
      proxyTypeId: "residential",
      ip: "185.199.109.153",
      countryCode: "DE",
      countryName: "德国",
      region: "Frankfurt",
      protocol: a.SOCKS5,
      status: d.EXPIRING_SOON,
      expireTime: "2026-07-21 10:21",
      remainingDays: 6,
      environmentCount: 2,
      autoRenew: !0,
      connection: {
        type: c.Socks5,
        host: "185.199.109.153",
        port: 1080,
        userName: "paraturbo_static_de",
        passwd: "mock-password",
        ipType: s.IpAPI,
        ipAddrType: r.IPV4,
      },
    },
    {
      id: "static-nl-01",
      proxyTypeId: "datacenter",
      ip: "188.72.126.87",
      countryCode: "NL",
      countryName: "荷兰",
      region: "Amsterdam",
      protocol: a.HTTP,
      status: d.EXPIRED,
      expireTime: "2026-07-10 16:45",
      remainingDays: -5,
      environmentCount: 0,
      autoRenew: !1,
      connection: {
        type: c.Http,
        host: "188.72.126.87",
        port: 8e3,
        userName: "paraturbo_static_nl",
        passwd: "mock-password",
        ipType: s.IpAPI,
        ipAddrType: r.IPV4,
      },
    },
    {
      id: "static-gb-01",
      proxyTypeId: "datacenter",
      ip: "203.0.113.45",
      countryCode: "GB",
      countryName: "英国",
      region: "London",
      protocol: a.HTTP,
      status: d.AVAILABLE,
      expireTime: "2026-09-12 09:30",
      remainingDays: 59,
      environmentCount: 1,
      autoRenew: !1,
      connection: {
        type: c.Http,
        host: "203.0.113.45",
        port: 8e3,
        userName: "paraturbo_static_gb",
        passwd: "mock-password",
        ipType: s.IpAPI,
        ipAddrType: r.IPV4,
      },
    },
  ],
  E = (e) => {
    if (null == e ? void 0 : e.aborted)
      throw new DOMException("The request was aborted", "AbortError");
  },
  b = (() => {
    let e = 18.6,
      t = 100;
    const o = T(N),
      n = T(D),
      i = new Map(),
      p = (e, o) => {
        const n = {
          ...e,
          quoteId: "mock-quote-" + ++t,
          expiresAt: new Date(Date.now() + 9e5).toISOString(),
          payChannels: [
            { value: "BANK_CARD", label: "银行卡" },
            { value: "PAYPAL", label: "PayPal" },
            { value: "USDT", label: "USDT" },
          ],
        };
        return (i.set(n.quoteId, { quote: n, ...o }), T(n));
      };
    return {
      getIpResourceSummaryApi: async () => ({
        dynamicTrafficGb: e,
        lastSyncTime: "刚刚同步",
        staticAvailableCount: n.filter((e) => e.status === d.AVAILABLE).length,
        staticExpiringCount: n.filter((e) => e.status === d.EXPIRING_SOON)
          .length,
        staticExpiredCount: n.filter((e) => e.status === d.EXPIRED).length,
      }),
      getDynamicProxyListApi: async (e) => {
        const t = e.pageNo || 1,
          n = e.pageSize || 20,
          i = (t - 1) * n;
        return { list: T(o.slice(i, i + n)), total: o.length };
      },
      getDynamicCatalogApi: async () => T(P),
      quoteDynamicTrafficApi: async (e, t) => {
        E(t);
        const o = P.trafficPackages.find((t) => t.id === e.packageId),
          n = (null == o ? void 0 : o.trafficGb) || e.trafficGb || 0,
          i = e.unitPrice ?? (null == o ? void 0 : o.price) ?? w(3.2 * n),
          a = 50 === n ? 10 : 0,
          r = Math.max(0, i - a),
          s = e.useWallet ? Math.min(80, r) : 0,
          c = w(r - s);
        return p(
          {
            productName: `${n}GB 动态代理流量`,
            originalAmount: i,
            discountAmount: a,
            walletBalance: 80,
            walletDeductionAmount: s,
            paymentAmount: c,
            totalAmount: c,
          },
          { trafficGb: n },
        );
      },
      createDynamicTrafficOrderApi: async (o) => {
        const n = i.get(o.quoteId);
        return (
          (null == n ? void 0 : n.trafficGb) && (e = w(e + n.trafficGb)),
          { orderId: "mock-order-" + ++t, payStatus: "PAID" }
        );
      },
      createDynamicProxyApi: async (e) => {
        const n = e.protocol === a.SOCKS5 ? c.Socks5 : c.Http,
          i = {
            ...e,
            id: "dynamic-mock-" + ++t,
            status: d.AVAILABLE,
            environmentCount: 0,
            connection: {
              type: n,
              host: "198.51.100." + (t % 255),
              port: e.protocol === a.SOCKS5 ? 1080 : 8e3,
              userName: `paraturbo_mock_${t}`,
              passwd: "mock-password",
              ipType: s.IpAPI,
              ipAddrType: r.IPV4,
            },
          };
        return (o.unshift(i), T(i));
      },
      getStaticProxyTypesApi: async () => T(C),
      getStaticCatalogApi: async (e) => {
        const t = v[e.proxyTypeId];
        if (!t) throw new Error(`Unknown mock proxy type: ${e.proxyTypeId}`);
        return T(t);
      },
      getStaticIpListApi: async (e) => {
        const t = n.filter(
            (t) =>
              (!e.status || t.status === e.status) &&
              (!e.countryCode || t.countryCode === e.countryCode) &&
              !(e.ip && !t.ip.includes(e.ip)),
          ),
          o = e.pageNo || 1,
          i = e.pageSize || 20,
          a = (o - 1) * i,
          r = new Map(n.map((e) => [e.countryCode, e.countryName]));
        return {
          list: T(t.slice(a, a + i)),
          total: t.length,
          countryOptions: Array.from(r, ([e, t]) => ({ code: e, name: t })),
        };
      },
      quoteStaticIpApi: async (e, t) => {
        var o;
        E(t);
        const n = v[e.proxyTypeId],
          i =
            (null == n
              ? void 0
              : n.durations.find((t) => t.id === e.durationId)) ??
            (e.durationDays && void 0 !== e.unitPrice
              ? {
                  id: e.durationId,
                  days: e.durationDays,
                  unitPrice: e.unitPrice,
                }
              : void 0);
        if (!n || !i) throw new Error("Unknown mock static IP configuration");
        const a = w(i.unitPrice * e.quantity),
          r = e.useWallet ? Math.min(10, a) : 0,
          s = w(a - r);
        return p(
          {
            productName: `${e.quantity} 个${(null == (o = C.find((t) => t.id === e.proxyTypeId)) ? void 0 : o.name) || "静态 IP"}`,
            originalAmount: a,
            discountAmount: 0,
            walletBalance: 80,
            walletDeductionAmount: r,
            paymentAmount: s,
            totalAmount: s,
          },
          { staticSelection: T(e) },
        );
      },
      createStaticIpOrderApi: async (e) => {
        var o, r, s;
        const c = null == (o = i.get(e.quoteId)) ? void 0 : o.staticSelection;
        if (c)
          for (let i = 0; i < c.quantity; i += 1)
            n.unshift({
              id: "static-mock-" + ++t,
              proxyTypeId: c.proxyTypeId,
              ip: "198.51.100." + (t % 255),
              countryCode: c.countryCode,
              countryName:
                (null ==
                (s =
                  null == (r = v[c.proxyTypeId])
                    ? void 0
                    : r.countries.find((e) => e.code === c.countryCode))
                  ? void 0
                  : s.name) || c.countryCode,
              protocol: c.protocol || a.HTTP,
              status: d.ALLOCATING,
              expireTime: "--",
              remainingDays: 0,
              environmentCount: 0,
              autoRenew: !1,
            });
        return { orderId: "mock-order-" + ++t, payStatus: "PAID" };
      },
      quoteStaticIpRenewApi: async (e, t, o) => {
        var i;
        E(o);
        const a = n.find((t) => t.id === e),
          r = a
            ? ((null == (i = v[a.proxyTypeId])
                ? void 0
                : i.durations.find((e) => e.id === t.durationId)) ??
              (t.durationDays && void 0 !== t.unitPrice
                ? {
                    id: t.durationId,
                    days: t.durationDays,
                    unitPrice: t.unitPrice,
                  }
                : void 0))
            : void 0;
        if (!a || !r) throw new Error("Unknown mock renewal configuration");
        const s = r.unitPrice,
          c = t.useWallet ? Math.min(80, s) : 0,
          d = w(s - c);
        return p(
          {
            productName: `续费静态 IP ${a.ip}`,
            originalAmount: s,
            discountAmount: 0,
            walletBalance: 80,
            walletDeductionAmount: c,
            paymentAmount: d,
            totalAmount: d,
          },
          { renewId: e, durationId: t.durationId, durationDays: r.days },
        );
      },
      createStaticIpRenewOrderApi: async (e, o) => {
        var a, r;
        const s = n.find((t) => t.id === e),
          c = i.get(o.quoteId),
          u =
            s && (null == c ? void 0 : c.durationId)
              ? ((null ==
                (r =
                  null == (a = v[s.proxyTypeId])
                    ? void 0
                    : a.durations.find((e) => e.id === c.durationId))
                  ? void 0
                  : r.days) ?? c.durationDays)
              : void 0;
        return (
          s &&
            u &&
            ((s.remainingDays = Math.max(s.remainingDays, 0) + u),
            (s.status = d.AVAILABLE),
            (s.expireTime = `续费后 ${u} 天`)),
          { orderId: "mock-order-" + ++t, payStatus: "PAID" }
        );
      },
      updateStaticIpAutoRenewApi: async (e, t) => {
        const o = n.find((t) => t.id === e);
        if (!o) throw new Error(`Unknown mock static IP: ${e}`);
        o.autoRenew = t;
      },
      getSelectableIpResourcesApi: async () => [
        ...o
          .filter((e) => e.connection)
          .map((e) => ({
            resourceId: e.id,
            resourceType: u.DYNAMIC_PROXY,
            name: e.name,
            protocol: e.protocol,
            status: e.status,
            countryCode: e.countryCode,
            region: e.region,
            city: e.city,
            mode: e.mode,
            sessionMinutes: e.sessionMinutes,
            bindable: e.status === d.AVAILABLE,
            connection: T(e.connection),
          })),
        ...n
          .filter((e) => e.connection)
          .map((e) => ({
            resourceId: e.id,
            resourceType: u.STATIC_IP,
            name: `${e.countryName}静态IP-${e.ip}`,
            protocol: e.protocol,
            status: e.status,
            countryCode: e.countryCode,
            region: e.region,
            exitIp: e.ip,
            expireTime: e.expireTime,
            remainingDays: e.remainingDays,
            bindable: e.status === d.AVAILABLE,
            unbindableReason:
              e.status === d.AVAILABLE ? void 0 : "该资源当前不可绑定",
            connection: T(e.connection),
          })),
      ],
    };
  })().getDynamicCatalogApi;
export {
  I as a,
  y as b,
  l as c,
  p as d,
  g as e,
  m as f,
  A as g,
  b as m,
  f as s,
  S as u,
};
