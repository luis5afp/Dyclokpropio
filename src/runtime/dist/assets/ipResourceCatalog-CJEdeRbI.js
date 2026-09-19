import { dT as t, dU as e, dZ as a, d_ as i } from "./index-BUIbb6Pa.js";
import { m as s } from "./ipResourceMock-CCd7H3CQ.js";
const n = async (a, i = {}, s) => {
    const n = { noLoading: !0, ...(s ? { signal: s } : {}) };
    return (await t.get(e(a), i, n)).data.list || [];
  },
  c = (t) =>
    t
      .filter((t) => "number" == typeof t.durationDays && t.durationDays > 0)
      .map((t) => ({
        id: t.id,
        days: t.durationDays,
        unitPrice: t.unitPrice,
        version: t.version,
        currency: t.currency,
      })),
  r = (t, e, a) => {
    const i = t.get(e);
    if (i) return i;
    const s = a().catch((a) => {
      throw (t.delete(e), a);
    });
    return (t.set(e, s), s);
  },
  o = ((t) => {
    const e = new Map(),
      s = new Map(),
      n = new Map(),
      o = new Map(),
      y = new Map(),
      g = () => r(s, "static", t.getStaticIpRegions);
    return {
      getStaticTypes: () =>
        r(e, "all", async () =>
          (await t.getStaticIpTypes()).map((t) => ({
            id: t.type,
            name: t.name,
            staticType: t.type,
            staticId: t.staticId,
            totalIps: t.totalIps,
            validIps: t.validIps,
          })),
        ),
      getStaticRegions: g,
      getStaticPurchaseCatalog: async () => ({
        countries: (await g()).map((t) => ({ code: t.regionId, name: t.name })),
        protocols: [i.SOCKS5],
        durations: [],
        inventory: 0,
      }),
      getStaticPurchaseDurations: async (e) => {
        const a = await t.getPrices({
          businessType: "STATIC_PURCHASE",
          staticType: "static",
          regionId: e,
        });
        return c(a);
      },
      getStaticRenewCatalog: async (e, a) => {
        const s = await t.getPrices({
          businessType: "STATIC_RENEWAL",
          resourceId: e,
          regionId: a,
        });
        return {
          countries: [],
          protocols: [i.SOCKS5],
          durations: c(s),
          inventory: 0,
        };
      },
      getStaticInventory: (e) => t.getStaticIpInventory(e),
      getDynamicProxyCatalog: async () => {
        const e = await r(n, "all", t.getDynamicCountries);
        return {
          trafficPackages: [],
          minTrafficGb: 0,
          maxTrafficGb: 0,
          protocols: [i.HTTP, i.SOCKS5],
          modes: [a.RANDOM, a.FIXED_SESSION],
          sessionMinutes: [1, 3, 5, 10, 30],
          countries: e.map((t) => ({ ...t })),
        };
      },
      getDynamicBaseCatalog: async () => {
        const [e, a, i] = await Promise.all([
          t.getMockDynamicCatalog(),
          r(n, "all", t.getDynamicCountries),
          t.getPrices({ businessType: "DYNAMIC_PURCHASE" }),
        ]);
        return {
          ...e,
          trafficPackages: i
            .filter((t) => "number" == typeof t.trafficGb && t.trafficGb > 0)
            .map((t) => ({
              id: t.id,
              trafficGb: t.trafficGb,
              price: t.unitPrice,
              version: t.version,
              currency: t.currency,
            })),
          countries: a.map((t) => ({ ...t })),
        };
      },
      getDynamicStates: (e) =>
        r(o, e, () => t.getDynamicStates({ countryCode: e })),
      getDynamicCities: (e, a) =>
        r(y, `${e}:${a}`, () =>
          t.getDynamicCities({ countryCode: e, stateCode: a }),
        ),
    };
  })({
    getPrices: async (t, e) => n("/v1/ip-resource/prices", t, e),
    getStaticIpTypes: async (t) => n("/v1/ip-resource/static-types", {}, t),
    getStaticIpRegions: async (t) =>
      n("/v1/ip-resource/static-regions", { staticType: "static" }, t),
    getStaticIpInventory: async (a, i) => {
      const s = { noLoading: !0, ...(i ? { signal: i } : {}) };
      return (await t.get(e("/v1/ip-resource/static-inventory"), a, s)).data;
    },
    getDynamicCountries: async (t) =>
      n("/v1/ip-resource/dynamic-regions/countries", {}, t),
    getDynamicStates: async (t, e) =>
      n("/v1/ip-resource/dynamic-regions/states", t, e),
    getDynamicCities: async (t, e) =>
      n("/v1/ip-resource/dynamic-regions/cities", t, e),
    getMockDynamicCatalog: s,
  });
export { o as i };
