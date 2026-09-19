import {
  aE as e,
  aF as a,
  d as l,
  v as r,
  G as t,
  aQ as o,
  aW as u,
  at as s,
  hw as i,
  hY as n,
  hx as d,
  i as m,
  C as v,
  W as p,
  r as c,
  q as b,
  o as w,
  c as g,
  F as h,
  b as f,
  f as y,
  w as k,
  x as E,
  h as x,
  a as q,
  t as I,
  X as T,
  z as _,
  g6 as V,
  e as M,
  hZ as R,
  eU as G,
  h_ as $,
  bQ as A,
  h$ as S,
  i0 as D,
  cE as C,
  i1 as H,
  V as U,
  a3 as L,
  L as P,
  a5 as N,
  dh as O,
  I as Z,
  ga as F,
  i2 as j,
  i3 as z,
  i4 as B,
  i5 as Y,
  i6 as K,
  i7 as W,
  D as X,
  E as J,
  A as Q,
  i8 as ee,
  i9 as ae,
  ia as le,
  ib as re,
  ao as te,
  ic as oe,
  id as ue,
  eX as se,
  ie,
  _ as ne,
} from "./index-BUIbb6Pa.js";
import { g as de } from "./system-DtbAsiCM.js";
import { T as me } from "./timezone-BMz8A6Hf.js";
import { a as ve } from "./timeZone-D3UW65MQ.js";
import { u as pe } from "./useMemberSelectPagination-BLP_arcy.js";
import {
  _ as ce,
  s as be,
  m as we,
  b as ge,
} from "./MemberEnvGroupDailyAccessDialog.vue_vue_type_script_setup_true_name_MemberEnvGroupDailyAccessDialog_lang-Do1rLGCx.js";
var he = ((e) => (
  (e.status = "STATUS"),
  (e.remark = "REMARK"),
  (e.authority = "AUTHORITY"),
  (e.manager = "MANAGER"),
  (e.group = "GROUP"),
  (e.del = "DELETE"),
  e
))(he || {});
const fe = e({
    id: "memberEdit",
    state: () => ({ disuseEnable: !1, timezone: "Asia/Singapore" }),
    actions: {
      updateValue(e) {
        ((this.disuseEnable = e.disuseEnable), (this.timezone = e.timezone));
      },
    },
    persist: a("member-edit"),
  }),
  ye = {
    key: 0,
    class: "tw-text-[var(--text-color-light1)] tw-leading-[25px]",
  },
  ke = { class: "tw-flex tw-w-full" },
  Ee = { class: "tw-text-[var(--text-color-light1)] tw-leading-[25px]" },
  xe = {
    class: "tw-text-[var(--text-color-light1)] tw-leading-[1.1] tw-mt-[5px]",
  },
  qe = { class: "tw-flex tw-w-full" },
  Ie = { key: 0, class: "m-t-12 tw-flex tw-items-center" },
  Te = { class: "tw-leading-[1.2] tw-text-[var(--text-color-light1)]" },
  _e = { key: 0, class: "flx-align-center" },
  Ve = { key: 1, class: "tw-truncate" },
  Me = {
    key: 0,
    class: "tw-text-[var(--text-color-light1)] tw-leading-[1.1] tw-mt-[5px]",
  },
  Re = {
    key: 1,
    class: "tw-mt-[6px] tw-flex tw-w-full tw-items-center tw-gap-[8px]",
  },
  Ge = { key: 0, class: "tw-text-[var(--text-color-light1)] tw-leading-[1.1]" },
  $e = {
    key: 0,
    class: "tw-text-[var(--text-color-light1)] tw-leading-[25px]",
  },
  Ae = {
    key: 0,
    class:
      "tw-text-[var(--text-color-light1)] tw-leading-[1.1] tw-mt-[5px] tw-w-full",
  },
  Se = { class: "tw-flex tw-flex-wrap tw-gap-[8px]" },
  De = {
    key: 0,
    class: "tw-text-[var(--text-color-light1)] tw-leading-[1.1] tw-mt-[5px]",
  },
  Ce = { key: 0, class: "m-t-12", style: { display: "flex" } },
  He = ne(
    l({
      __name: "memberEdit",
      emits: ["submit", "batchSubmit"],
      setup(e, { expose: a, emit: ne }) {
        const { t: He } = r.useI18n(),
          Ue = ne,
          Le = t(),
          Pe = fe();
        o();
        const Ne = u(),
          Oe = s({
            name: [{ required: !1 }],
            roleId: [
              { required: !0, message: He("org.member.req.roleIdHolder") },
            ],
            email: [
              {
                validator: (e, a, l) => {
                  var r, t;
                  return (
                    null ==
                    (t =
                      null == (r = null == Fe ? void 0 : Fe.value)
                        ? void 0
                        : r.row)
                      ? void 0
                      : t.id
                  )
                    ? l()
                    : a
                      ? void (n.test(a) || !ma.value
                          ? d.test(a) || !va.value
                            ? l()
                            : l(new Error(He("org.member.req.emailHolder")))
                          : l(
                              new Error(
                                He("org.member.req.usernameFormatError"),
                              ),
                            ))
                      : ma.value
                        ? void l(
                            new Error(He("env.env.req.accountUserNameHolder")),
                          )
                        : void l(new Error(He("org.member.req.emailHolder")));
                },
              },
            ],
            passwd: [
              {
                validator: (e, a, l) => {
                  a
                    ? i.test(a)
                      ? l()
                      : l(new Error(He("org.member.req.passwordFormatError")))
                    : l(new Error(He("env.env.req.accountPasswdHolder")));
                },
              },
            ],
            batchRemarkType: [
              { required: !0, message: He("env.env.batchRemark.requiredTips") },
            ],
            authority: [
              { required: !0, message: He("org.member.req.authorityHolder") },
            ],
            managerId: [
              { required: !1, message: He("org.member.req.managerIdHolder") },
            ],
            envGroupIds: [
              { required: !0, message: He("org.member.req.envGroupIdsHint") },
            ],
            status: [
              {
                required: !1,
                message: He("org.member.req.editMemberStatusTip"),
              },
            ],
            disuseEnable: [{ required: !1, trigger: "change" }],
            disuseTime: [
              {
                required: !0,
                message: He("org.member.req.disuseDatePickerTip"),
                trigger: "blur",
              },
            ],
            timeZone: [
              {
                required: !0,
                message: He("org.member.req.disuseTimeZonePickerTip"),
              },
            ],
            expiryTime: [{ required: !0, message: He("rpa.task.req.enter") }],
          }),
          Ze = m(!1),
          Fe = m({
            isView: !1,
            title: "org.member.createTitle",
            row: {},
            rows: [],
          }),
          je = m(),
          ze = m([]),
          {
            options: Be,
            loading: Ye,
            loadInitial: Ke,
            search: We,
            handlePopupScroll: Xe,
            reset: Je,
          } = pe({
            fetchPage: se,
            baseParams: () => ({ authority: G.Manager }),
            filterMembers: (e) => e.filter((e) => e.id !== Fe.value.row.id),
          }),
          Qe = m([]),
          ea = m([]),
          aa = m(),
          la = m(!1),
          ra = m(0),
          ta = m([]),
          oa = m([]),
          ua = m(!1),
          sa = m(!1),
          ia = m(!1),
          na = m([new Date(), new Date()]),
          da = m(void 0),
          ma = v(() => Fe.value.row.type === ie.INTERNAL),
          va = v(() => Fe.value.row.type === ie.EXTERNAL),
          pa = v(() => Fe.value.row.status === C.ENABLED),
          ca = v(() => {
            var e;
            return null == (e = Fe.value.rows)
              ? void 0
              : e.map((e) => e.name).join(",");
          }),
          ba = v(() => {
            const e = new Set((Fe.value.row.envGroupIds ?? []).map(String));
            return Qe.value
              .filter((a) => "all" !== a.value && e.has(String(a.value)))
              .map((e) => ({ id: String(e.value), name: e.label }));
          }),
          wa = v(
            () =>
              Ne.getOpenEnvRuleFeatureEnable &&
              Le.userInfo.authority === G.SuperAdmin &&
              sa.value &&
              !ia.value &&
              !Fe.value.isView &&
              Va(),
          ),
          ga = v(() => {
            const e = Fe.value.row.envGroupIds ?? [];
            return 0 === e.length || e.includes("all");
          }),
          ha = m([
            { value: 1 / 24, label: `1 ${He("cost.plan.card.hours")}` },
            { value: 30, label: `30 ${He("cost.plan.dialog.day")}` },
            { value: 90, label: `90 ${He("cost.plan.dialog.day")}` },
            { value: 180, label: `180 ${He("cost.plan.dialog.day")}` },
            { value: 360, label: `360 ${He("cost.plan.dialog.day")}` },
          ]),
          fa = m({
            names: v(() => ia.value),
            name: v(() => !ia.value),
            interiorEmail: v(() => ma.value),
            externalEmail: v(() => va.value),
            password: v(() => ma.value && !sa.value),
            roleId: v(
              () =>
                (!_a(Fe.value.row.authority) && !ia.value) ||
                da.value === he.group,
            ),
            batchRemark: v(() => ia.value && da.value === he.remark),
            remark: v(() => da.value === he.remark || !ia.value),
            authority: v(
              () =>
                da.value === he.authority ||
                (!_a(Fe.value.row.authority) && !ia.value),
            ),
            managerId: v(() => Ma()),
            envGroupIds: v(() => Va()),
            status: v(
              () =>
                da.value === he.status ||
                (sa.value && !_a(Fe.value.row.authority) && !ia.value),
            ),
            disuseEnable: v(() => pa.value && !_a(Fe.value.row.authority)),
            disuseTime: v(() => pa.value && Fe.value.row.disuseEnable),
            timeZone: v(() => pa.value && Fe.value.row.disuseEnable),
            expiryMode: v(() => {
              var e, a;
              return (
                pa.value &&
                !ia.value &&
                (!(null == (e = je.value) ? void 0 : e.lastLoginTime) ||
                  (null == (a = je.value) ? void 0 : a.expiryMode) ===
                    $.LONGIN_START)
              );
            }),
          });
        p(
          () => [ia.value, da.value],
          (e) => {
            const a = e[0],
              l = e[1];
            a
              ? l === he.status &&
                (Oe.status = [
                  {
                    required: !0,
                    message: He("org.member.req.editMemberStatusTip"),
                  },
                ])
              : (Oe.status = [
                  {
                    required: !1,
                    message: He("org.member.req.editMemberStatusTip"),
                  },
                ]);
          },
        );
        const ya = v(() => {
            const e = [];
            return (
              me.data.forEach((a) => {
                "local" !== a.value &&
                  e.push({ label: `${a.tz} ${a.gmt}`, value: a.gmt });
              }),
              e
            );
          }),
          ka = v(() =>
            me.data
              .filter((e) => "local" !== e.value)
              .map((e) => ({ label: `${e.tz} ${e.gmt}`, value: e.value })),
          ),
          Ea = (e) => {
            const a = new Date();
            return (
              a.setDate(a.getDate() - 1),
              a.setHours(0, 0, 0, 0),
              e.getTime() < a.getTime()
            );
          },
          xa = async () => {
            const e = await de({ all: !0, detail: !1 }),
              a = [];
            if (
              (e.list.forEach((e) => {
                e.code !== re.SuperAdmin &&
                  a.push({ value: e.id, label: e.name });
              }),
              sa.value && Fe.value.row.roleId)
            ) {
              e.list.find((e) => e.id === Fe.value.row.roleId) ||
                a.push({
                  value: Fe.value.row.roleId,
                  label: Fe.value.row.roleName,
                });
            }
            ze.value = a;
          },
          qa = (e) => {
            e && Ke();
          },
          Ia = async () => {
            const e = await te({ all: !0, detail: !1 });
            Qe.value = e.list.map((e) => ({ value: e.id, label: e.name }));
            let a = !0;
            if (Le.isManager) {
              let e = await oe(Le.userInfo.memberId);
              a =
                sa.value && !e.allEnvGroup
                  ? Fe.value.row.allEnvGroup
                  : !!e.allEnvGroup;
            }
            a &&
              Qe.value.unshift({
                value: "all",
                label: He("org.member.req.allGroup"),
              });
          },
          Ta = () => {
            const e = Le.userInfo.authority,
              a = [];
            (A(ue, ["SUPER_ADMIN"]).forEach((l) => {
              e === G.SuperAdmin
                ? a.push(l)
                : e === G.Admin
                  ? [G.Manager, G.Member].includes(l.value) && a.push(l)
                  : e === G.Manager &&
                    [G.Member].includes(l.value) &&
                    a.push(l);
            }),
              (ta.value = a));
          },
          _a = (e) => e === G.SuperAdmin,
          Va = () => {
            if (!Fe.value.row.authority) return !1;
            const e = [G.Manager, G.Member].includes(Fe.value.row.authority);
            return !(!ia.value || da.value !== he.authority || !e) || e;
          },
          Ma = () =>
            ia.value
              ? da.value === he.manager
              : Fe.value.row.authority === G.Member && !ia.value,
          Ra = (e) => {
            if (0 === e.length) Fe.value.row.envGroupIds = e;
            else {
              "all" === e[e.length - 1]
                ? (Fe.value.row.envGroupIds = ["all"])
                : e.includes("all")
                  ? (Fe.value.row.envGroupIds = e.filter((e) => "all" !== e))
                  : (Fe.value.row.envGroupIds = e);
            }
            ea.value = be(ba.value, ea.value);
          },
          Ga = async () => {
            var e, a, l, r, t, o;
            if (!Ne.getOpenEnvRuleFeatureEnable) return;
            ((ea.value = be(ba.value, ea.value)),
              null == (e = aa.value) || e.open());
            const u = Fe.value.row.id;
            if (!u || la.value) return;
            const s = ++ra.value;
            (null == (a = aa.value) || a.setLoading(!0),
              null == (l = aa.value) || l.setLoadFailed(!1));
            try {
              const e = await D(u);
              if (s !== ra.value || Fe.value.row.id !== u) return;
              const a = e.openRule || [],
                l = a.some((e) => e.openEnvRule);
              ((Fe.value.row.openEnvRule = l),
                (ea.value = we(ba.value, a)),
                (la.value = !0),
                null == (r = aa.value) || r.replaceRules(ea.value));
            } catch (i) {
              if (s !== ra.value) return;
              (console.error(
                "[MemberOpenRule] Failed to load member open rules:",
                i,
              ),
                null == (t = aa.value) || t.setLoadFailed(!0));
            } finally {
              s === ra.value && (null == (o = aa.value) || o.setLoading(!1));
            }
          },
          $a = (e) => {
            ea.value = e;
          };
        const Aa = () => {
            const e =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
              a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
              l = "0123456789";
            let r =
              a[Math.floor(52 * Math.random())] +
              l[Math.floor(10 * Math.random())];
            for (let t = 0; t < 10; t++) r += e[Math.floor(62 * Math.random())];
            Fe.value.row.passwd = r
              .split("")
              .sort(() => Math.random() - 0.5)
              .join("");
          },
          Sa = m(),
          Da = m(!1),
          Ca = () => {
            Sa.value.validate(async (e) => {
              var a, r, t;
              if (!e)
                return void L.warning(He("org.member.req.memberEditErrorTip"));
              if (
                Va() &&
                (!Fe.value.row.envGroupIds ||
                  !(null == (a = Fe.value.row.envGroupIds) ? void 0 : a.length))
              )
                return void P(He("org.member.req.envGroupIdsHint"));
              Da.value = !1;
              const o = ia.value
                ? da.value === he.authority || da.value === he.group
                : sa.value &&
                  ((u = je.value),
                  (s = Fe.value.row),
                  u.roleId !== s.roleId ||
                    u.authority !== s.authority ||
                    u.allEnvGroup !== s.allEnvGroup ||
                    [...(u.envGroupIds || [])].sort().join(",") !==
                      [...(s.envGroupIds || [])].sort().join(","));
              var u, s, i;
              if (_a(Le.userInfo.authority) && o) {
                Da.value = !0;
                try {
                  const e = N(
                    l({
                      setup() {
                        const e = m(!0);
                        return (
                          p(e, (e) => {
                            Da.value = e;
                          }),
                          () => {
                            var a;
                            return N("div", [
                              N(
                                "p",
                                {},
                                He(
                                  ia.value
                                    ? "org.member.req.forceLogoutBatchMsg"
                                    : "org.member.req.forceLogoutSingleMsg",
                                  ia.value
                                    ? {
                                        count:
                                          (null == (a = Fe.value.rows)
                                            ? void 0
                                            : a.length) ?? 0,
                                      }
                                    : { name: Fe.value.row.name ?? "" },
                                ),
                              ),
                              N("div", { class: "tw-mt-[10px]" }, [
                                N(O, {
                                  modelValue: e.value,
                                  "onUpdate:modelValue": (a) => {
                                    e.value = a;
                                  },
                                  label: He(
                                    ia.value
                                      ? "org.member.req.forceLogoutBatchCheckbox"
                                      : "org.member.req.forceLogoutSingleCheckbox",
                                  ),
                                }),
                              ]),
                            ]);
                          }
                        );
                      },
                    }),
                  );
                  await Z.confirm(e, He("org.member.req.forceLogoutTitle"), {
                    confirmButtonText: He("org.member.req.forceLogoutSaveBtn"),
                    cancelButtonText: He("base.cancel"),
                    type: "warning",
                    closeOnClickModal: !1,
                    closeOnPressEscape: !1,
                  });
                } catch {
                  return;
                }
              }
              ua.value = !0;
              try {
                const e = JSON.parse(JSON.stringify(Fe.value.row));
                if (
                  ((null == (r = e.envGroupIds) ? void 0 : r.includes("all"))
                    ? ((e.envGroupIds = []), (e.allEnvGroup = !0))
                    : (e.allEnvGroup = !1),
                  ma.value && !sa.value && (e.passwd = F(e.passwd)),
                  e.name || (e.name = e.email),
                  Ne.getOpenEnvRuleFeatureEnable)
                )
                  if (!ia.value && sa.value) {
                    const a = be(ba.value, ea.value);
                    Object.assign(
                      e,
                      ge({
                        isEdit: sa.value,
                        ruleInfoLoaded: la.value,
                        detailOpenEnvRule: Fe.value.row.openEnvRule,
                        allEnvGroup: !!e.allEnvGroup,
                        rules: a,
                      }),
                    );
                  } else ia.value || (delete e.openEnvRule, delete e.openRule);
                else (delete e.openEnvRule, delete e.openRule);
                if (ia.value) {
                  const {
                    remark: a = "",
                    batchRemarkType: l,
                    status: r,
                    disuseEnable: t = !1,
                    disuseTime: o = "",
                    timeZone: u,
                    authority: s,
                    envGroupIds: n,
                    allEnvGroup: d,
                    roleId: m,
                    managerId: v,
                  } = e;
                  let p,
                    c = [];
                  if (
                    (Fe.value.rows && (c = Fe.value.rows.map((e) => e.id)),
                    0 === c.length)
                  )
                    return;
                  switch (da.value) {
                    case he.status:
                      p = await W(c, {
                        status: r,
                        disuseEnable: t,
                        disuseTime: o,
                        timeZone: u,
                      });
                      break;
                    case he.authority:
                      p = await K(c, {
                        authority: s,
                        envGroupIds: n,
                        allEnvGroup: d,
                      });
                      break;
                    case he.group:
                      p = await Y(c, { roleId: m });
                      break;
                    case he.manager:
                      p = await B(c, { managerId: v });
                      break;
                    case he.remark:
                      p = await z(c, { remark: a, type: l });
                      break;
                    case he.del:
                      p = await j(c);
                  }
                  (Ue("batchSubmit"),
                    (i = (null == p ? void 0 : p.code) ?? -1),
                    L(
                      0 === i
                        ? {
                            type: "success",
                            message: He("sync.tip67"),
                            plain: !0,
                          }
                        : { type: "error", message: He("sync.tip68") },
                    ));
                } else if (Fe.value.row.id)
                  (X.api.trackEvent({
                    type: Q.TEAM_CLICK,
                    action: J.CLICK_EDIT_MEMBER,
                  }),
                    await ee(Fe.value.row.id, e));
                else if (
                  (X.api.trackEvent({
                    type: Q.TEAM_CLICK,
                    action: J.CLICK_CREATE_MEMBER,
                  }),
                  await ae(e),
                  await Ha(e),
                  ma.value)
                ) {
                  let e = He("org.member.copyAccountPassword", {
                    account: Fe.value.row.email,
                    password: Fe.value.row.passwd,
                  });
                  return (
                    V(e, !1, He("org.member.createSuccessAndCopy"), 8e3),
                    (Ze.value = !1),
                    void Ue("submit")
                  );
                }
                if (((Ze.value = !1), Ue("submit"), Da.value)) {
                  const e = ia.value
                    ? null == (t = Fe.value.rows)
                      ? void 0
                      : t.map((e) => e.id).filter(Boolean)
                    : [Fe.value.row.id];
                  e.length && (await le(e));
                }
              } catch (n) {
              } finally {
                ua.value = !1;
              }
            });
          },
          Ha = async (e) => {
            const a = { disuseEnable: e.disuseEnable, timezone: e.timeZone };
            Pe.updateValue(a);
          };
        return (
          a({
            acceptParams: async (e) => {
              var a;
              ((sa.value = !!e.row.id),
                (ia.value = !1),
                (da.value = void 0),
                (ea.value = []),
                (la.value = !1),
                (ra.value += 1),
                xa(),
                Je(),
                Ke(),
                Ta(),
                null == (a = Sa.value) || a.resetFields(),
                sa.value ||
                  Le.userInfo.authority !== G.Manager ||
                  (e.row.managerId = Le.userInfo.memberId),
                sa.value && e.row.allEnvGroup && (e.row.envGroupIds = ["all"]),
                e.row.expiryTime || (e.row.expiryTime = 30),
                (e.row.timeZone = e.row.timeZone ?? "Asia/Singapore"),
                (Fe.value = e),
                (je.value = U.cloneDeep(e.row)),
                Ia(),
                (Ze.value = !0));
            },
            batchAcceptParams: (e) => {
              var a, l, r;
              switch (
                ((ia.value = !0),
                (da.value = e.batchEditType),
                (ea.value = []),
                (la.value = !1),
                (ra.value += 1),
                (Fe.value = {
                  isView: e.isView,
                  title: e.title,
                  row: {},
                  rows: e.rows,
                }),
                e.batchEditType)
              ) {
                case he.authority:
                  (Ia(),
                    Ta(),
                    (Fe.value.row.authority =
                      null ==
                      (l =
                        null == (a = ta.value)
                          ? void 0
                          : a[ta.value.length - 1])
                        ? void 0
                        : l.value));
                  break;
                case he.group:
                  xa();
                  break;
                case he.manager:
                  (Je(), Ke());
                  break;
                case he.status:
                  ((Fe.value.row.status = C.ENABLED),
                    (Fe.value.row.timeZone = "Asia/Singapore"));
                  break;
                case he.remark:
                  Fe.value.row.batchRemarkType = R.COVER;
              }
              (null == (r = Sa.value) || r.clearValidate(), (Ze.value = !0));
            },
          }),
          (oa.value = A(S)),
          (e, a) => {
            const l = c("el-form-item"),
              r = c("el-input"),
              t = c("el-tooltip"),
              o = c("el-option"),
              u = c("el-select"),
              s = c("el-button"),
              i = c("Warning"),
              n = c("el-icon"),
              d = c("el-radio"),
              m = c("el-radio-group"),
              v = c("el-switch"),
              p = c("el-input-number"),
              A = c("el-date-picker"),
              S = c("el-form"),
              D = c("el-dialog"),
              C = b("prevent-label-click");
            return (
              w(),
              g(
                h,
                null,
                [
                  f(
                    D,
                    {
                      modelValue: Ze.value,
                      "onUpdate:modelValue":
                        a[18] || (a[18] = (e) => (Ze.value = e)),
                      title: y(He)(Fe.value.title),
                      width: "600px",
                      "close-on-click-modal": !1,
                      "close-on-press-escape": !1,
                      "align-center": !0,
                      class: "org-dialog",
                    },
                    {
                      footer: k(() => [
                        f(
                          s,
                          {
                            type: "info",
                            onClick: a[17] || (a[17] = (e) => (Ze.value = !1)),
                          },
                          {
                            default: k(() => [M(I(e.$t("base.cancel")), 1)]),
                            _: 1,
                          },
                        ),
                        f(
                          s,
                          {
                            type:
                              ia.value && da.value === he.del
                                ? "danger"
                                : "primary",
                            onClick: Ca,
                            loading: ua.value,
                          },
                          {
                            default: k(() => [
                              M(
                                I(
                                  ia.value && da.value === he.del
                                    ? He("base.confirmDelBtn")
                                    : He("base.confirm"),
                                ),
                                1,
                              ),
                            ]),
                            _: 1,
                          },
                          8,
                          ["type", "loading"],
                        ),
                      ]),
                      default: k(() => [
                        E(
                          (w(),
                          x(
                            S,
                            {
                              ref_key: "ruleFormRef",
                              ref: Sa,
                              "label-width": "auto",
                              "label-position": "right",
                              rules: Oe,
                              disabled: Fe.value.isView,
                              model: Fe.value.row,
                              "hide-required-asterisk": Fe.value.isView,
                            },
                            {
                              default: k(() => {
                                var c, b;
                                return [
                                  fa.value.names
                                    ? (w(),
                                      x(
                                        l,
                                        {
                                          key: 0,
                                          label: e.$t(
                                            "org.logs.operationMember",
                                          ),
                                          prop: "names",
                                        },
                                        {
                                          default: k(() => [
                                            q("span", null, I(ca.value), 1),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["label"],
                                      ))
                                    : T("", !0),
                                  fa.value.name
                                    ? (w(),
                                      x(
                                        l,
                                        {
                                          key: 1,
                                          label: e.$t("org.member.req.name"),
                                          prop: "name",
                                        },
                                        {
                                          default: k(() => [
                                            f(
                                              r,
                                              {
                                                modelValue: Fe.value.row.name,
                                                "onUpdate:modelValue":
                                                  a[0] ||
                                                  (a[0] = (e) =>
                                                    (Fe.value.row.name = e)),
                                                placeholder: e.$t(
                                                  "org.member.req.nameHolder",
                                                ),
                                                clearable: "",
                                                maxlength: "20",
                                                "show-word-limit": "",
                                              },
                                              null,
                                              8,
                                              ["modelValue", "placeholder"],
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["label"],
                                      ))
                                    : T("", !0),
                                  fa.value.interiorEmail
                                    ? (w(),
                                      x(
                                        l,
                                        {
                                          key: 2,
                                          label: e.$t(
                                            "env.env.req.accountUserName",
                                          ),
                                          prop: "email",
                                          required: !0,
                                        },
                                        {
                                          default: k(() => [
                                            f(
                                              r,
                                              {
                                                modelValue: Fe.value.row.email,
                                                "onUpdate:modelValue":
                                                  a[1] ||
                                                  (a[1] = (e) =>
                                                    (Fe.value.row.email = e)),
                                                modelModifiers: { trim: !0 },
                                                placeholder: e.$t(
                                                  "env.env.req.accountUserNameHolder",
                                                ),
                                                clearable: "",
                                                maxlength: 20,
                                                disabled: sa.value,
                                                "show-word-limit": "",
                                              },
                                              null,
                                              8,
                                              [
                                                "modelValue",
                                                "placeholder",
                                                "disabled",
                                              ],
                                            ),
                                            sa.value
                                              ? T("", !0)
                                              : (w(),
                                                g(
                                                  "div",
                                                  ye,
                                                  I(
                                                    y(He)(
                                                      "org.member.req.UsernameTip",
                                                    ),
                                                  ),
                                                  1,
                                                )),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["label"],
                                      ))
                                    : T("", !0),
                                  fa.value.password
                                    ? (w(),
                                      x(
                                        l,
                                        {
                                          key: 3,
                                          label: e.$t(
                                            "env.env.req.accountPasswd",
                                          ),
                                          prop: "passwd",
                                          required: !0,
                                        },
                                        {
                                          default: k(() => [
                                            q("div", ke, [
                                              f(
                                                r,
                                                {
                                                  modelValue:
                                                    Fe.value.row.passwd,
                                                  "onUpdate:modelValue":
                                                    a[2] ||
                                                    (a[2] = (e) =>
                                                      (Fe.value.row.passwd =
                                                        e)),
                                                  modelModifiers: { trim: !0 },
                                                  placeholder:
                                                    e.$t("login.password"),
                                                  clearable: "",
                                                  type: "password",
                                                  disabled: sa.value,
                                                  maxlength: 25,
                                                  "show-password": "",
                                                  class: "tw-flex-1",
                                                },
                                                null,
                                                8,
                                                [
                                                  "modelValue",
                                                  "placeholder",
                                                  "disabled",
                                                ],
                                              ),
                                              f(
                                                t,
                                                {
                                                  content: y(He)(
                                                    "org.member.req.randomPwd",
                                                  ),
                                                  placement: "top",
                                                },
                                                {
                                                  default: k(() => [
                                                    q(
                                                      "p",
                                                      {
                                                        class:
                                                          "tw-text-black tw-whitespace-nowrap tw-cursor-pointer tw-duration-300 tw-h-[38px] tw-text-[20px] hover:tw-text-main tw-px-[12px] tw-flex tw-items-center",
                                                        onClick: Aa,
                                                      },
                                                      [
                                                        ...(a[19] ||
                                                          (a[19] = [
                                                            q(
                                                              "i",
                                                              {
                                                                class:
                                                                  "iconfont icon-Reexecute tw-mr-1 tw-text-[18px]",
                                                              },
                                                              null,
                                                              -1,
                                                            ),
                                                          ])),
                                                      ],
                                                    ),
                                                  ]),
                                                  _: 1,
                                                },
                                                8,
                                                ["content"],
                                              ),
                                            ]),
                                            q(
                                              "div",
                                              Ee,
                                              I(
                                                y(He)(
                                                  "org.member.req.newPasswordTip",
                                                ),
                                              ),
                                              1,
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["label"],
                                      ))
                                    : T("", !0),
                                  fa.value.roleId
                                    ? (w(),
                                      x(
                                        l,
                                        {
                                          key: 4,
                                          label: e.$t("org.member.req.roleId"),
                                          prop: "roleId",
                                        },
                                        {
                                          default: k(() => [
                                            f(
                                              u,
                                              {
                                                modelValue: Fe.value.row.roleId,
                                                "onUpdate:modelValue":
                                                  a[3] ||
                                                  (a[3] = (e) =>
                                                    (Fe.value.row.roleId = e)),
                                                placeholder: e.$t(
                                                  "org.member.req.roleIdHolder",
                                                ),
                                                clearable: "",
                                                filterable: "",
                                              },
                                              {
                                                default: k(() => [
                                                  (w(!0),
                                                  g(
                                                    h,
                                                    null,
                                                    _(
                                                      ze.value,
                                                      (e) => (
                                                        w(),
                                                        x(
                                                          o,
                                                          {
                                                            key: e.label,
                                                            label: e.label,
                                                            value: e.value,
                                                          },
                                                          null,
                                                          8,
                                                          ["label", "value"],
                                                        )
                                                      ),
                                                    ),
                                                    128,
                                                  )),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["modelValue", "placeholder"],
                                            ),
                                            q(
                                              "div",
                                              xe,
                                              I(
                                                y(He)(
                                                  "org.member.req.roleIdTip",
                                                ),
                                              ),
                                              1,
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["label"],
                                      ))
                                    : T("", !0),
                                  fa.value.externalEmail
                                    ? (w(),
                                      x(
                                        l,
                                        {
                                          key: 5,
                                          label: e.$t("org.member.req.email"),
                                          prop: "email",
                                          required: !(null ==
                                          (b =
                                            null == (c = Fe.value)
                                              ? void 0
                                              : c.row)
                                            ? void 0
                                            : b.id),
                                        },
                                        {
                                          default: k(() => [
                                            q("div", qe, [
                                              f(
                                                r,
                                                {
                                                  class: "tw-flex-1",
                                                  modelValue:
                                                    Fe.value.row.email,
                                                  "onUpdate:modelValue":
                                                    a[4] ||
                                                    (a[4] = (e) =>
                                                      (Fe.value.row.email = e)),
                                                  placeholder: e.$t(
                                                    "org.member.req.emailHolder",
                                                  ),
                                                  clearable: "",
                                                  disabled: sa.value,
                                                },
                                                null,
                                                8,
                                                [
                                                  "modelValue",
                                                  "placeholder",
                                                  "disabled",
                                                ],
                                              ),
                                              sa.value
                                                ? (w(),
                                                  x(
                                                    s,
                                                    {
                                                      key: 0,
                                                      type: "primary",
                                                      class: "tw-ml-[10px]",
                                                      onClick:
                                                        a[5] ||
                                                        (a[5] = (e) =>
                                                          y(V)(
                                                            Fe.value.row.email,
                                                          )),
                                                    },
                                                    {
                                                      default: k(() => [
                                                        M(
                                                          I(
                                                            y(He)(
                                                              "openapi.tip18",
                                                            ),
                                                          ),
                                                          1,
                                                        ),
                                                      ]),
                                                      _: 1,
                                                    },
                                                  ))
                                                : T("", !0),
                                            ]),
                                            !sa.value && va.value
                                              ? (w(),
                                                g("div", Ie, [
                                                  a[20] ||
                                                    (a[20] = q(
                                                      "span",
                                                      {
                                                        class:
                                                          "icon-warn-wrap m-r-8",
                                                      },
                                                      [
                                                        q("i", {
                                                          class:
                                                            "iconfont icon-warning",
                                                        }),
                                                      ],
                                                      -1,
                                                    )),
                                                  q(
                                                    "span",
                                                    Te,
                                                    I(
                                                      e.$t(
                                                        "org.member.req.editHint",
                                                      ),
                                                    ),
                                                    1,
                                                  ),
                                                ]))
                                              : T("", !0),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["label", "required"],
                                      ))
                                    : T("", !0),
                                  fa.value.envGroupIds
                                    ? (w(),
                                      x(
                                        l,
                                        {
                                          key: 6,
                                          label: e.$t(
                                            "org.member.req.envGroupIds",
                                          ),
                                          prop: "envGroupIds",
                                        },
                                        {
                                          default: k(() => [
                                            f(
                                              u,
                                              {
                                                modelValue:
                                                  Fe.value.row.envGroupIds,
                                                "onUpdate:modelValue":
                                                  a[6] ||
                                                  (a[6] = (e) =>
                                                    (Fe.value.row.envGroupIds =
                                                      e)),
                                                placeholder: e.$t(
                                                  "org.member.req.envGroupIdsHolder",
                                                ),
                                                clearable: "",
                                                filterable: "",
                                                multiple: "",
                                                collapseTags: "",
                                                collapseTagsTooltip: "",
                                                "max-collapse-tags": 2,
                                                onChange: Ra,
                                              },
                                              {
                                                default: k(() => [
                                                  (w(!0),
                                                  g(
                                                    h,
                                                    null,
                                                    _(
                                                      Qe.value,
                                                      (a) => (
                                                        w(),
                                                        x(
                                                          o,
                                                          {
                                                            key: a.label,
                                                            label: a.label,
                                                            value: a.value,
                                                          },
                                                          {
                                                            default: k(() => [
                                                              "all" === a.value
                                                                ? (w(),
                                                                  g("div", _e, [
                                                                    M(
                                                                      I(
                                                                        a.label,
                                                                      ) + " ",
                                                                      1,
                                                                    ),
                                                                    f(
                                                                      t,
                                                                      {
                                                                        effect:
                                                                          "dark",
                                                                        content:
                                                                          e.$t(
                                                                            "org.member.req.allGroupTips",
                                                                          ),
                                                                        placement:
                                                                          "top",
                                                                      },
                                                                      {
                                                                        default:
                                                                          k(
                                                                            () => [
                                                                              f(
                                                                                n,
                                                                                {
                                                                                  size: 16,
                                                                                  class:
                                                                                    "m-l-8",
                                                                                },
                                                                                {
                                                                                  default:
                                                                                    k(
                                                                                      () => [
                                                                                        f(
                                                                                          i,
                                                                                        ),
                                                                                      ],
                                                                                    ),
                                                                                  _: 1,
                                                                                },
                                                                              ),
                                                                            ],
                                                                          ),
                                                                        _: 1,
                                                                      },
                                                                      8,
                                                                      [
                                                                        "content",
                                                                      ],
                                                                    ),
                                                                  ]))
                                                                : (w(),
                                                                  g(
                                                                    "span",
                                                                    Ve,
                                                                    I(a.label),
                                                                    1,
                                                                  )),
                                                            ]),
                                                            _: 2,
                                                          },
                                                          1032,
                                                          ["label", "value"],
                                                        )
                                                      ),
                                                    ),
                                                    128,
                                                  )),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["modelValue", "placeholder"],
                                            ),
                                            sa.value
                                              ? T("", !0)
                                              : (w(),
                                                g(
                                                  "div",
                                                  Me,
                                                  I(
                                                    y(He)(
                                                      "org.member.req.envGroupIdsHolderTip",
                                                    ),
                                                  ),
                                                  1,
                                                )),
                                            wa.value
                                              ? (w(),
                                                g("div", Re, [
                                                  f(
                                                    s,
                                                    {
                                                      link: "",
                                                      type: "primary",
                                                      class:
                                                        "!tw-h-auto !tw-p-0",
                                                      disabled: ga.value,
                                                      onClick: Ga,
                                                    },
                                                    {
                                                      default: k(() => [
                                                        M(
                                                          I(
                                                            y(He)(
                                                              "org.member.req.envGroupDailyAccessAction",
                                                            ),
                                                          ),
                                                          1,
                                                        ),
                                                      ]),
                                                      _: 1,
                                                    },
                                                    8,
                                                    ["disabled"],
                                                  ),
                                                ]))
                                              : T("", !0),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["label"],
                                      ))
                                    : T("", !0),
                                  fa.value.batchRemark
                                    ? (w(),
                                      x(
                                        l,
                                        {
                                          key: 7,
                                          label: e.$t(
                                            "env.env.batchRemark.updateType",
                                          ),
                                          prop: "batchRemarkType",
                                        },
                                        {
                                          default: k(() => [
                                            f(
                                              m,
                                              {
                                                modelValue:
                                                  Fe.value.row.batchRemarkType,
                                                "onUpdate:modelValue":
                                                  a[7] ||
                                                  (a[7] = (e) =>
                                                    (Fe.value.row.batchRemarkType =
                                                      e)),
                                              },
                                              {
                                                default: k(() => [
                                                  f(
                                                    d,
                                                    { value: y(R).COVER },
                                                    {
                                                      default: k(() => [
                                                        M(
                                                          I(
                                                            e.$t(
                                                              "env.env.batchRemark.cover",
                                                            ),
                                                          ),
                                                          1,
                                                        ),
                                                      ]),
                                                      _: 1,
                                                    },
                                                    8,
                                                    ["value"],
                                                  ),
                                                  f(
                                                    d,
                                                    { value: y(R).APPEND },
                                                    {
                                                      default: k(() => [
                                                        M(
                                                          I(
                                                            e.$t(
                                                              "env.env.batchRemark.append",
                                                            ),
                                                          ),
                                                          1,
                                                        ),
                                                      ]),
                                                      _: 1,
                                                    },
                                                    8,
                                                    ["value"],
                                                  ),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["modelValue"],
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["label"],
                                      ))
                                    : T("", !0),
                                  fa.value.authority
                                    ? (w(),
                                      x(
                                        l,
                                        {
                                          key: 8,
                                          label: e.$t(
                                            "org.member.req.authority",
                                          ),
                                          prop: "authority",
                                        },
                                        {
                                          default: k(() => [
                                            f(
                                              m,
                                              {
                                                modelValue:
                                                  Fe.value.row.authority,
                                                "onUpdate:modelValue":
                                                  a[8] ||
                                                  (a[8] = (e) =>
                                                    (Fe.value.row.authority =
                                                      e)),
                                              },
                                              {
                                                default: k(() => [
                                                  q("div", null, [
                                                    (w(!0),
                                                    g(
                                                      h,
                                                      null,
                                                      _(
                                                        ta.value,
                                                        (e) => (
                                                          w(),
                                                          x(
                                                            d,
                                                            {
                                                              key: e.label,
                                                              label: e.label,
                                                              value: e.value,
                                                            },
                                                            null,
                                                            8,
                                                            ["label", "value"],
                                                          )
                                                        ),
                                                      ),
                                                      128,
                                                    )),
                                                  ]),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["modelValue"],
                                            ),
                                            Fe.value.row.authority ===
                                            y(G).Admin
                                              ? (w(),
                                                g(
                                                  "div",
                                                  Ge,
                                                  I(
                                                    y(He)(
                                                      "org.member.req.memberStatusChooseTip",
                                                    ),
                                                  ),
                                                  1,
                                                ))
                                              : T("", !0),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["label"],
                                      ))
                                    : T("", !0),
                                  fa.value.managerId
                                    ? (w(),
                                      x(
                                        l,
                                        {
                                          key: 9,
                                          label: e.$t(
                                            "org.member.req.managerId",
                                          ),
                                          prop: "managerId",
                                        },
                                        {
                                          default: k(() => [
                                            f(
                                              u,
                                              {
                                                modelValue:
                                                  Fe.value.row.managerId,
                                                "onUpdate:modelValue":
                                                  a[9] ||
                                                  (a[9] = (e) =>
                                                    (Fe.value.row.managerId =
                                                      e)),
                                                placeholder: e.$t(
                                                  "org.member.req.managerIdHolder",
                                                ),
                                                loading: y(Ye),
                                                clearable: "",
                                                filterable: "",
                                                remote: "",
                                                "remote-method": y(We),
                                                onVisibleChange: qa,
                                                onPopupScroll: y(Xe),
                                              },
                                              {
                                                default: k(() => [
                                                  (w(!0),
                                                  g(
                                                    h,
                                                    null,
                                                    _(
                                                      y(Be),
                                                      (e) => (
                                                        w(),
                                                        x(
                                                          o,
                                                          {
                                                            key: e.label,
                                                            label: e.label,
                                                            value: e.value,
                                                          },
                                                          null,
                                                          8,
                                                          ["label", "value"],
                                                        )
                                                      ),
                                                    ),
                                                    128,
                                                  )),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              [
                                                "modelValue",
                                                "placeholder",
                                                "loading",
                                                "remote-method",
                                                "onPopupScroll",
                                              ],
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["label"],
                                      ))
                                    : T("", !0),
                                  fa.value.remark
                                    ? (w(),
                                      x(
                                        l,
                                        {
                                          key: 10,
                                          label: e.$t("base.remark"),
                                          prop: "remark",
                                        },
                                        {
                                          default: k(() => [
                                            f(
                                              r,
                                              {
                                                type: "textarea",
                                                autosize: {
                                                  minRows: 2,
                                                  maxRows: 5,
                                                },
                                                modelValue: Fe.value.row.remark,
                                                "onUpdate:modelValue":
                                                  a[10] ||
                                                  (a[10] = (e) =>
                                                    (Fe.value.row.remark = e)),
                                                placeholder:
                                                  e.$t("base.remark"),
                                                clearable: "",
                                                maxlength: "100",
                                                "show-word-limit": "",
                                              },
                                              null,
                                              8,
                                              ["modelValue", "placeholder"],
                                            ),
                                            Fe.value.row.batchRemarkType ===
                                            y(R).COVER
                                              ? (w(),
                                                g(
                                                  "div",
                                                  $e,
                                                  I(
                                                    y(He)(
                                                      "org.member.req.batchEditRemark",
                                                    ),
                                                  ),
                                                  1,
                                                ))
                                              : T("", !0),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["label"],
                                      ))
                                    : T("", !0),
                                  fa.value.status
                                    ? (w(),
                                      x(
                                        l,
                                        {
                                          key: 11,
                                          label: e.$t("org.member.req.status"),
                                          prop: "status",
                                        },
                                        {
                                          default: k(() => [
                                            f(
                                              m,
                                              {
                                                modelValue: Fe.value.row.status,
                                                "onUpdate:modelValue":
                                                  a[11] ||
                                                  (a[11] = (e) =>
                                                    (Fe.value.row.status = e)),
                                              },
                                              {
                                                default: k(() => [
                                                  (w(!0),
                                                  g(
                                                    h,
                                                    null,
                                                    _(
                                                      oa.value,
                                                      (e) => (
                                                        w(),
                                                        x(
                                                          d,
                                                          {
                                                            key: e.label,
                                                            label: e.label,
                                                            value: e.value,
                                                          },
                                                          null,
                                                          8,
                                                          ["label", "value"],
                                                        )
                                                      ),
                                                    ),
                                                    128,
                                                  )),
                                                ]),
                                                _: 1,
                                              },
                                              8,
                                              ["modelValue"],
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["label"],
                                      ))
                                    : T("", !0),
                                  fa.value.disuseEnable
                                    ? (w(),
                                      x(
                                        l,
                                        {
                                          key: 12,
                                          label: y(He)(
                                            "org.member.req.disuseEnable",
                                          ),
                                          prop: "disuseEnable",
                                        },
                                        {
                                          default: k(() => [
                                            f(
                                              v,
                                              {
                                                class: "tw-mr-[15px]",
                                                modelValue:
                                                  Fe.value.row.disuseEnable,
                                                "onUpdate:modelValue":
                                                  a[12] ||
                                                  (a[12] = (e) =>
                                                    (Fe.value.row.disuseEnable =
                                                      e)),
                                              },
                                              null,
                                              8,
                                              ["modelValue"],
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ["label"],
                                      ))
                                    : T("", !0),
                                  fa.value.disuseTime
                                    ? (w(),
                                      g(
                                        h,
                                        { key: 13 },
                                        [
                                          fa.value.expiryMode
                                            ? (w(),
                                              x(
                                                l,
                                                {
                                                  key: 0,
                                                  label: y(He)(
                                                    "org.member.req.expireMode",
                                                  ),
                                                },
                                                {
                                                  default: k(() => [
                                                    f(
                                                      u,
                                                      {
                                                        modelValue:
                                                          Fe.value.row
                                                            .expiryMode,
                                                        "onUpdate:modelValue":
                                                          a[13] ||
                                                          (a[13] = (e) =>
                                                            (Fe.value.row.expiryMode =
                                                              e)),
                                                        placeholder:
                                                          e.$t(
                                                            "base.selectHolder",
                                                          ),
                                                        class: "m-t-5",
                                                        filterable: "",
                                                      },
                                                      {
                                                        default: k(() => [
                                                          f(
                                                            o,
                                                            {
                                                              label: y(He)(
                                                                "org.member.req.expireModeImmediate",
                                                              ),
                                                              value:
                                                                y($).INSTANT,
                                                            },
                                                            null,
                                                            8,
                                                            ["label", "value"],
                                                          ),
                                                          f(
                                                            o,
                                                            {
                                                              label: y(He)(
                                                                "org.member.req.expireModeAfterFirstLogin",
                                                              ),
                                                              value:
                                                                y($)
                                                                  .LONGIN_START,
                                                            },
                                                            null,
                                                            8,
                                                            ["label", "value"],
                                                          ),
                                                        ]),
                                                        _: 1,
                                                      },
                                                      8,
                                                      [
                                                        "modelValue",
                                                        "placeholder",
                                                      ],
                                                    ),
                                                  ]),
                                                  _: 1,
                                                },
                                                8,
                                                ["label"],
                                              ))
                                            : T("", !0),
                                          Fe.value.row.expiryMode ===
                                          y($).LONGIN_START
                                            ? (w(),
                                              x(
                                                l,
                                                {
                                                  key: 1,
                                                  label: y(He)(
                                                    "org.member.req.expireDays",
                                                  ),
                                                  prop: "expiryTime",
                                                },
                                                {
                                                  default: k(() => [
                                                    f(
                                                      p,
                                                      {
                                                        modelValue:
                                                          Fe.value.row
                                                            .expiryTime,
                                                        "onUpdate:modelValue":
                                                          a[14] ||
                                                          (a[14] = (e) =>
                                                            (Fe.value.row.expiryTime =
                                                              e)),
                                                        modelModifiers: {
                                                          number: !0,
                                                        },
                                                        type: "number",
                                                        placeholder:
                                                          e.$t(
                                                            "rpa.task.req.enter",
                                                          ),
                                                        clearable: "",
                                                        min: 1,
                                                        max: 999,
                                                        controls: !1,
                                                        precision: 0,
                                                        class:
                                                          "tw-w-[30%] tw-mr-[8px]",
                                                      },
                                                      null,
                                                      8,
                                                      [
                                                        "modelValue",
                                                        "placeholder",
                                                      ],
                                                    ),
                                                    q(
                                                      "div",
                                                      null,
                                                      I(
                                                        y(He)(
                                                          "cost.plan.card.days",
                                                        ),
                                                      ),
                                                      1,
                                                    ),
                                                    Fe.value.row.expiryTime
                                                      ? (w(),
                                                        g(
                                                          "div",
                                                          Ae,
                                                          I(
                                                            y(He)(
                                                              "org.member.req.expireExample",
                                                              {
                                                                days: Fe.value
                                                                  .row
                                                                  .expiryTime,
                                                              },
                                                            ),
                                                          ),
                                                          1,
                                                        ))
                                                      : T("", !0),
                                                  ]),
                                                  _: 1,
                                                },
                                                8,
                                                ["label"],
                                              ))
                                            : (w(),
                                              g(
                                                h,
                                                { key: 2 },
                                                [
                                                  f(
                                                    l,
                                                    {
                                                      label: y(He)(
                                                        "org.member.req.enableDuration",
                                                      ),
                                                    },
                                                    {
                                                      default: k(() => [
                                                        q("div", Se, [
                                                          (w(!0),
                                                          g(
                                                            h,
                                                            null,
                                                            _(
                                                              ha.value,
                                                              (e) => (
                                                                w(),
                                                                g(
                                                                  "div",
                                                                  {
                                                                    key: e.value,
                                                                  },
                                                                  [
                                                                    f(
                                                                      s,
                                                                      {
                                                                        onClick:
                                                                          (a) =>
                                                                            (function (
                                                                              e,
                                                                            ) {
                                                                              var a;
                                                                              const l =
                                                                                  (
                                                                                    e,
                                                                                  ) =>
                                                                                    e <
                                                                                    10
                                                                                      ? `0${e}`
                                                                                      : `${e}`,
                                                                                r =
                                                                                  Fe
                                                                                    .value
                                                                                    .row
                                                                                    .timeZone ||
                                                                                  "Asia/Singapore",
                                                                                t =
                                                                                  H(),
                                                                                o =
                                                                                  new Date(
                                                                                    t.getTime() +
                                                                                      24 *
                                                                                        e *
                                                                                        60 *
                                                                                        60 *
                                                                                        1e3,
                                                                                  ),
                                                                                u = `${o.getFullYear()}-${l(o.getMonth() + 1)}-${l(o.getDate())} ${l(o.getHours())}:${l(o.getMinutes())}:00`,
                                                                                s =
                                                                                  ve(
                                                                                    {
                                                                                      timeStr:
                                                                                        u,
                                                                                      targetTimeZone:
                                                                                        r,
                                                                                    },
                                                                                  );
                                                                              ((Fe.value.row.disuseTime =
                                                                                s),
                                                                                null ==
                                                                                  (a =
                                                                                    Sa.value) ||
                                                                                  a.validateField(
                                                                                    "disuseTime",
                                                                                  ));
                                                                            })(
                                                                              e.value,
                                                                            ),
                                                                        plain:
                                                                          "",
                                                                      },
                                                                      {
                                                                        default:
                                                                          k(
                                                                            () => [
                                                                              M(
                                                                                I(
                                                                                  e.label,
                                                                                ),
                                                                                1,
                                                                              ),
                                                                            ],
                                                                          ),
                                                                        _: 2,
                                                                      },
                                                                      1032,
                                                                      [
                                                                        "onClick",
                                                                      ],
                                                                    ),
                                                                  ],
                                                                )
                                                              ),
                                                            ),
                                                            128,
                                                          )),
                                                        ]),
                                                      ]),
                                                      _: 1,
                                                    },
                                                    8,
                                                    ["label"],
                                                  ),
                                                  f(
                                                    l,
                                                    {
                                                      class:
                                                        "el-from-disuse-time",
                                                      label: e.$t(
                                                        "org.member.req.disuseTime",
                                                      ),
                                                      prop: "disuseTime",
                                                    },
                                                    {
                                                      default: k(() => [
                                                        f(
                                                          A,
                                                          {
                                                            modelValue:
                                                              Fe.value.row
                                                                .disuseTime,
                                                            "onUpdate:modelValue":
                                                              a[15] ||
                                                              (a[15] = (e) =>
                                                                (Fe.value.row.disuseTime =
                                                                  e)),
                                                            "default-time":
                                                              na.value[0],
                                                            "disabled-date": Ea,
                                                            placeholder: e.$t(
                                                              "org.member.req.disuseDatePickerPlaceholder",
                                                            ),
                                                            "popper-class":
                                                              "effective-time-date-picker",
                                                            class:
                                                              "!tw-border-0",
                                                            format:
                                                              "YYYY-MM-DD HH:mm",
                                                            "time-format":
                                                              "HH:mm:00",
                                                            type: "datetime",
                                                            "value-format":
                                                              "YYYY-MM-DD HH:mm:00",
                                                          },
                                                          null,
                                                          8,
                                                          [
                                                            "modelValue",
                                                            "default-time",
                                                            "placeholder",
                                                          ],
                                                        ),
                                                        fa.value.disuseTime
                                                          ? (w(),
                                                            g(
                                                              "div",
                                                              De,
                                                              I(
                                                                y(He)(
                                                                  "org.member.req.disuseTip3",
                                                                ),
                                                              ),
                                                              1,
                                                            ))
                                                          : T("", !0),
                                                      ]),
                                                      _: 1,
                                                    },
                                                    8,
                                                    ["label"],
                                                  ),
                                                  f(
                                                    l,
                                                    {
                                                      label: e.$t(
                                                        "org.member.req.timeZone",
                                                      ),
                                                      prop: "timeZone",
                                                    },
                                                    {
                                                      default: k(() => [
                                                        f(
                                                          u,
                                                          {
                                                            modelValue:
                                                              Fe.value.row
                                                                .timeZone,
                                                            "onUpdate:modelValue":
                                                              a[16] ||
                                                              (a[16] = (e) =>
                                                                (Fe.value.row.timeZone =
                                                                  e)),
                                                            placeholder:
                                                              e.$t(
                                                                "base.selectHolder",
                                                              ),
                                                            class: "m-t-5",
                                                            filterable: "",
                                                          },
                                                          {
                                                            default: k(() => [
                                                              (w(!0),
                                                              g(
                                                                h,
                                                                null,
                                                                _(
                                                                  ya.value,
                                                                  (e) => (
                                                                    w(),
                                                                    x(
                                                                      o,
                                                                      {
                                                                        key: e.label,
                                                                        label:
                                                                          e.label,
                                                                        value:
                                                                          e.value,
                                                                      },
                                                                      null,
                                                                      8,
                                                                      [
                                                                        "label",
                                                                        "value",
                                                                      ],
                                                                    )
                                                                  ),
                                                                ),
                                                                128,
                                                              )),
                                                            ]),
                                                            _: 1,
                                                          },
                                                          8,
                                                          [
                                                            "modelValue",
                                                            "placeholder",
                                                          ],
                                                        ),
                                                      ]),
                                                      _: 1,
                                                    },
                                                    8,
                                                    ["label"],
                                                  ),
                                                ],
                                                64,
                                              )),
                                        ],
                                        64,
                                      ))
                                    : T("", !0),
                                ];
                              }),
                              _: 1,
                            },
                            8,
                            [
                              "rules",
                              "disabled",
                              "model",
                              "hide-required-asterisk",
                            ],
                          )),
                          [[C]],
                        ),
                        ia.value && da.value === y(he).del
                          ? (w(),
                            g("div", Ce, [
                              a[21] ||
                                (a[21] = q(
                                  "span",
                                  { class: "icon-warn-wrap m-r-8 m-t-2" },
                                  [q("i", { class: "iconfont icon-warning" })],
                                  -1,
                                )),
                              q(
                                "span",
                                null,
                                I(e.$t("org.member.req.delTips")),
                                1,
                              ),
                            ]))
                          : T("", !0),
                      ]),
                      _: 1,
                    },
                    8,
                    ["modelValue", "title"],
                  ),
                  f(
                    ce,
                    {
                      ref_key: "dailyAccessDialogRef",
                      ref: aa,
                      rules: ea.value,
                      "timezone-options": ka.value,
                      onConfirm: $a,
                    },
                    null,
                    8,
                    ["rules", "timezone-options"],
                  ),
                ],
                64,
              )
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-20a10cfc"]],
  ),
  Ue = Object.freeze(
    Object.defineProperty(
      { __proto__: null, default: He },
      Symbol.toStringTag,
      { value: "Module" },
    ),
  );
export { he as B, He as M, Ue as m, fe as u };
