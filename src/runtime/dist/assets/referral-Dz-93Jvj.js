import { dT as a, dU as s } from "./index-BUIbb6Pa.js";
var t = ((a) => (
    (a.PAYPAL = "PAYPAL"),
    (a.ALIPAY = "ALIPAY"),
    (a.DICWALLET = "DICWALLET"),
    (a.USDT = "USDT"),
    a
  ))(t || {}),
  i = ((a) => ((a.PAYPAL = "PayPal"), (a.ALIPAY = "Alipay"), a))(i || {}),
  A = ((a) => (
    (a.Init = "INIT"),
    (a.NotPass = "NOT_PASS"),
    (a.Pass = "PASS"),
    (a.Processing = "PROCESSING"),
    a
  ))(A || {}),
  P = ((a) => (
    (a.UserInvitation = "USER_INVITATION"),
    (a.Withdrawal = "WITHDRAWAL"),
    a
  ))(P || {});
const n = async () => (await a.get(s("/v1/user/invite/detail"))).data,
  I = async (t) => (await a.post(s("/v1/user/invite/cash"), t)).data,
  L = async (t) =>
    (await a.list(s("/v1/user/invite/list/cash"), t, { noLoading: !0 })).data;
export { P as L, A as U, t as W, i as a, I as b, n as c, L as g };
