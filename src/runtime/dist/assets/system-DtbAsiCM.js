import { dT as a, dU as s } from "./index-BUIbb6Pa.js";
const t = async (t) =>
    (await a.list(s("/v1/system/role"), t, { noLoading: !0, isRetry: !0 }))
      .data,
  e = async (t) => await a.get(s(`/v1/system/role/${t}`)),
  i = async (t) => await a.post(s("/v1/system/role"), t),
  o = async (t, e) => await a.put(s(`/v1/system/role/${t}`), e),
  n = async (t, e) =>
    await a.delete(s(`/v1/system/role/${t}?new_role_id=${e}`)),
  y = async (t) =>
    (await a.list(s("/v1/system/module"), t, { noLoading: !0 })).data,
  l = async () =>
    (await a.list(s("/v1/system/role/list_manager"), {}, { noLoading: !0 }))
      .data.list;
export { l as a, y as b, i as c, e as d, n as e, t as g, o as u };
