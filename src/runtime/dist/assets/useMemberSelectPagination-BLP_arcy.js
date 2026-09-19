import { C as a, i as e } from "./index-BUIbb6Pa.js";
function l(l) {
  const u = l.pageSize ?? 50,
    t = e([]),
    v = e(!1),
    o = e(0),
    n = e(""),
    i = e(0);
  let r = 0;
  const s = a(() => i.value > 0 && i.value * u < o.value),
    c = a(() => v.value && 0 === t.value.length),
    p = l.mapOption ?? ((a) => ({ value: a.id ?? "", label: a.name ?? "" })),
    d = (a, e) => {
      const l = new Map(a.map((a) => [a.value, a]));
      return (e.forEach((a) => l.set(a.value, a)), Array.from(l.values()));
    },
    m = async (a, e, s) => {
      var c, m;
      v.value = !0;
      try {
        const v = await l.fetchPage({
          ...(null == (c = l.baseParams) ? void 0 : c.call(l)),
          all: !1,
          detail: !1,
          pageNo: a,
          pageSize: u,
          user: n.value || void 0,
        });
        if (s !== r) return;
        const f = (
          (null == (m = l.filterMembers) ? void 0 : m.call(l, v.list)) ?? v.list
        ).map(p);
        ((t.value = d(e ? [] : t.value, f)),
          (o.value = v.total),
          (i.value = a));
      } catch {
      } finally {
        s === r && (v.value = !1);
      }
    },
    f = async () => {
      i.value > 0 || v.value || (await m(1, !0, r));
    },
    h = async () => {
      v.value ||
        (0 !== i.value ? s.value && (await m(i.value + 1, !1, r)) : await f());
    };
  return {
    options: t,
    loading: c,
    total: o,
    keyword: n,
    hasMore: s,
    loadInitial: f,
    loadMore: h,
    search: async (a) => {
      ((r += 1),
        (n.value = a.trim()),
        (i.value = 0),
        (o.value = 0),
        (t.value = []),
        await m(1, !0, r));
    },
    handlePopupScroll: async ({ scrollTop: a }) => {
      if (!s.value || v.value) return;
      const e = 32 * t.value.length;
      a >= Math.max(0, e - 274 - 160) && (await h());
    },
    reset: () => {
      ((r += 1),
        (t.value = []),
        (v.value = !1),
        (o.value = 0),
        (n.value = ""),
        (i.value = 0));
    },
  };
}
export { l as u };
