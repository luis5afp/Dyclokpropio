import e from "./envSegmentedTabs-B8OKb7JK.js";
import {
  d as l,
  v as a,
  hQ as o,
  ah as t,
  R as r,
  P as n,
  aa as i,
  be as s,
  ac as E,
  dg as u,
  r as p,
  o as v,
  c as d,
  b as _,
  X as g,
  h as R,
  w as c,
  a as m,
  O as N,
  t as O,
  f as T,
  $ as b,
  e as y,
  dy as I,
  i as A,
  C as M,
  hR as P,
  hS as h,
  hT as k,
  em as S,
  N as f,
  hU as w,
  hV as G,
  hW as V,
  eX as L,
  hX as C,
  aL as x,
  a5 as D,
  ab as B,
  ak as Y,
  a9 as U,
  eR as X,
  ao as $,
  c_ as F,
} from "./index-BUIbb6Pa.js";
import { E as W } from "./index-CLVJdR_V.js";
import { E as H } from "./index-rtKG2tmD.js";
import { _ as j } from "./index.vue_vue_type_style_index_0_lang-CoddPsWR.js";
import { u as K } from "./useFetchTable-DUveM-tP.js";
import { e as q } from "./country-flag.esm-Bg8BdAZu.js";
import { g as Z } from "./system-DtbAsiCM.js";
import { _ as z } from "./envShareManageList.vue_vue_type_style_index_0_lang-CxJ0BEO-.js";
import { _ as Q } from "./envTransferLogList.vue_vue_type_style_index_0_lang-BlNXFBQB.js";
import { s as J, g as ee } from "./timeZone-D3UW65MQ.js";
import { u as le } from "./common-_BPSz0Vp.js";
import { u as ae, c as oe } from "./usePermissionGuard-BuK9RLCQ.js";
import { u as te } from "./useMemberSelectPagination-BLP_arcy.js";
import { u as re } from "./index-CjqfvICL.js";
import "./index.vue_vue_type_script_setup_true_lang-8hqXqXGq.js";
import "./TableFieldDialog-BI1BUo05.js";
import "./sortable.esm-DneA_jWz.js";
import "./LazyRow.vue_vue_type_script_setup_true_lang-C9dK0oMf.js";
import "./batchOperationBar.vue_vue_type_script_setup_true_lang-Dy5lyCwg.js";
const ne = { class: "table-box logs" },
  ie = { key: 0, class: "tw-flex-1 tw-h-0" },
  se = { key: 1, class: "tw-flex-1 tw-h-0" },
  Ee = { class: "tw-flex" },
  ue = { class: "tw-max-w-[350px]" },
  pe = { class: "tw-text-textColor-700 tw-text-[13px] tw-whitespace-pre-line" },
  ve = {
    key: 0,
    class:
      "tw-text-[14px] tw-flex tw-items-center tw-ml-[8px] tw-leading-[1.2] tw-text-[var(--text-color-light1)]",
  },
  de = l({
    __name: "logs",
    setup(l) {
      const { t: de } = a.useI18n(),
        _e = o(),
        { tagColorList: ge } = I(),
        Re = A([]),
        ce = A([]),
        me = A([]),
        Ne = A([]),
        Oe = A([]),
        Te = A("LOGIN_LOG"),
        { hasPermission: be, guardedFetch: ye } = ae({
          permissions: [t.MEMBER_LIST, t.MANAGE_MEMBERS],
        }),
        {
          options: Ie,
          loading: Ae,
          loadInitial: Me,
          search: Pe,
          handlePopupScroll: he,
        } = te({
          fetchPage: (e) =>
            ye(() => L(e), { list: [], total: 0 }).then(
              (e) => e ?? { list: [], total: 0 },
            ),
        }),
        { hasPermission: ke, guardedFetch: Se } = ae({
          permissions: [
            t.ENVIRONMENT_LIST,
            t.GET_ENVIRONMENT,
            t.VIEW_OPENED_PROFILE,
            t.RESTORE_LIST,
          ],
        }),
        { guardedFetch: fe } = ae({
          permissions: [t.EDITING_ENVIRONMENT, t.PROXY_LIST],
        }),
        { guardedFetch: we } = ae({
          permissions: [
            t.ENVIRONMENT_LIST,
            t.CREATE_AN_ENVIRONMENT,
            t.EDITING_ENVIRONMENT,
            t.BATCH_IMPORT_ENVIRONMENT,
            t.BATCH_CREATE_ENVIRONMENT,
            t.CLONE_ENV,
            t.LIST_GROUP,
            t.MANAGE_MEMBERS,
          ],
        }),
        { guardedFetch: Ge } = ae({ permissions: [t.MEMBER_GROUPING] }),
        Ve = A(),
        Le = A(),
        {
          loading: Ce,
          pagination: xe,
          filters: De,
          list: Be,
          fetchList: Ye,
          onSearch: Ue,
          onPaginationSizeChange: Xe,
          onPaginationCurrentChange: $e,
          onFiltersChangeByKey: Fe,
          listErr: We,
        } = K({
          fetch: (e) => {
            var l, a;
            const { date: o, ...t } = e,
              [r, n] = o || [];
            let i;
            switch (Te.value) {
              case "LOGIN_LOG":
                ((i = V),
                  null == t || delete t.keyword,
                  null == t || delete t.envId,
                  null == t || delete t.value,
                  null == t || delete t.businessType,
                  null == t || delete t.operationType);
                break;
              case "BROWSER_LOG":
                ((i = G),
                  null == t || delete t.type,
                  null == t || delete t.value,
                  null == t || delete t.businessType,
                  null == t || delete t.operationType);
                break;
              case "TRANSFER_OF_ENVIRONMENTAL":
                return (
                  null == (l = Le.value) || l.acceptParams(),
                  Promise.resolve([])
                );
              case "SHAREMANAGE":
                return (
                  null == (a = Ve.value) || a.acceptParams(),
                  Promise.resolve([])
                );
              default:
                ((i = w),
                  null == t || delete t.keyword,
                  null == t || delete t.envId,
                  null == t || delete t.type);
            }
            return i
              ? i({
                  detail: !0,
                  ...t,
                  ...(r
                    ? { startCreateTime: J(re(r, "YYYY-MM-DD HH:mm:ss").value) }
                    : {}),
                  ...(n
                    ? { endCreateTime: J(re(n, "YYYY-MM-DD HH:mm:ss").value) }
                    : {}),
                })
              : Promise.resolve([]);
          },
          tableName: "logs",
        }),
        He = le(),
        { tagList: je } = r(He);
      n(() => {
        var e, l, a, o;
        if (null == (e = null == _e ? void 0 : _e.query) ? void 0 : e.type)
          switch (
            null == (l = null == _e ? void 0 : _e.query) ? void 0 : l.type
          ) {
            case "history":
              ((Te.value = "BROWSER_LOG"),
                (De.envId =
                  (null == (a = null == _e ? void 0 : _e.query)
                    ? void 0
                    : a.envId) ?? void 0));
              break;
            case "record":
              ((Te.value = "OPERATION_RECORD"),
                (De.businessType = i.ENV),
                (De.value =
                  (null == (o = null == _e ? void 0 : _e.query)
                    ? void 0
                    : o.envId) ?? void 0));
          }
        else
          Te.value = s(t.LOGIN_LOG)
            ? "LOGIN_LOG"
            : s(t.OPERATION_RECORD)
              ? "OPERATION_RECORD"
              : "BROWSER_LOG";
        E(() => {
          Ye();
        });
      });
      const Ke = M(() =>
          [
            {
              label: de("org.logs.loginLogs"),
              value: "LOGIN_LOG",
              show: s(t.LOGIN_LOG),
            },
            {
              label: de("org.logs.operationRecord"),
              value: "OPERATION_RECORD",
              show: s(t.OPERATION_RECORD),
            },
            {
              label: de("org.logs.browseLogs"),
              value: "BROWSER_LOG",
              show: s(t.BROWSER_LOG),
            },
            {
              label: de("env.env.envShareManage"),
              value: "SHAREMANAGE",
              show: s(t.ENV_SHARE_LOG),
            },
            {
              label: de("env.env.envTransferLog"),
              value: "TRANSFER_OF_ENVIRONMENTAL",
              show: s(t.ENV_TRANSFER_LOG),
            },
          ].filter((e) => e.show),
        ),
        qe = (e) => {
          ((Te.value = e),
            E(() => {
              Ue();
            }));
        };
      let Ze = ge.value.reduce((e, l) => ((e[l.code] = l.color), e), {});
      const ze = (e, l) => {
          ("businessType" === e && (delete De.operationType, delete De.value),
            Fe(e, l));
        },
        Qe = async () =>
          Se(async () => {
            await Y({ all: !0, detail: !1 }).then((e) => {
              var l, a;
              ((Re.value =
                null == (l = null == e ? void 0 : e.list)
                  ? void 0
                  : l.map((e) => ({
                      value: (null == e ? void 0 : e.id) ?? "",
                      label: `${(null == e ? void 0 : e.name) ? (null == e ? void 0 : e.name) : "-"} (${e.serialNum})`,
                    }))),
                (ce.value =
                  null == (a = null == e ? void 0 : e.list)
                    ? void 0
                    : a.map((e) => ({
                        value: (null == e ? void 0 : e.serialNum) ?? "",
                        label: `${(null == e ? void 0 : e.name) ? (null == e ? void 0 : e.name) : "-"} (${e.serialNum})`,
                      }))));
            });
          }),
        Je = async () =>
          fe(async () => {
            await F({ all: !0, detail: !1 }).then((e) => {
              var l;
              me.value =
                null == (l = null == e ? void 0 : e.list)
                  ? void 0
                  : l.map((e) => ({
                      value: `${e.host}:${e.port}`,
                      label: `${e.host}:${e.port}`,
                    }));
            });
          }),
        el = async () =>
          we(async () => {
            await $({ all: !0, detail: !1 }).then((e) => {
              var l;
              Ne.value =
                null == (l = null == e ? void 0 : e.list)
                  ? void 0
                  : l.map((e) => ({
                      value: (null == e ? void 0 : e.name) ?? "",
                      label: e.name ?? "",
                    }));
            });
          }),
        ll = async () =>
          Ge(async () => {
            await Z({ all: !0, detail: !1 }).then((e) => {
              var l;
              Oe.value =
                null == (l = null == e ? void 0 : e.list)
                  ? void 0
                  : l.map((e) => ({
                      value: (null == e ? void 0 : e.name) ?? "",
                      label: e.name ?? "",
                    }));
            });
          }),
        al = M(() => {
          let e = [
            {
              key: i.ENV,
              value: U.CREATE_ENV,
              label: de("env.env.createTitle"),
            },
            { key: i.ENV, value: U.EXPORT_ENV, label: de("env.env.exportEnv") },
            {
              key: i.ENV,
              value: U.UPDATE_ENV,
              label: de("env.env.batchUpdate"),
            },
            { key: i.ENV, value: U.EDIT_ENV, label: de("env.env.editTitle") },
            {
              key: i.ENV,
              value: U.OPEN_ENV,
              label: de("env.env.shareDialog.shareAuth1"),
            },
            {
              key: i.ENV,
              value: U.CLOSE_ENV,
              label: de("env.env.closeDialog.title"),
            },
            {
              key: i.ENV,
              value: U.COMMAND_CLOSE_ENV,
              label: de("env.env.closeDialog.allBtnText2"),
            },
            {
              key: i.ENV,
              value: U.BATCH_COOKIE_ENCRYPT_RESTORE,
              label: de("env.cookie.cookieAction"),
            },
            {
              key: i.ENV,
              value: U.TRANSFER_ENV,
              label: de("env.env.transferDialog.transferEnv"),
            },
            { key: i.ENV, value: U.CLEAR_CACHE, label: de("base.clearCache") },
            {
              key: i.ENV,
              value: U.DELETE_ENV,
              label: de("org.logs.deleteEnv"),
            },
            {
              key: i.ENV,
              value: U.THOROUGH_DELETE_ENV,
              label: de("org.logs.thoroughDeleteEnv"),
            },
            {
              key: i.ENV,
              value: U.RECOVERY_ENV,
              label: de("org.logs.recoverEnv"),
            },
            {
              key: i.ENV,
              value: U.CLONE_ENV,
              label: de("env.env.clone.cloneEnv"),
            },
            { key: i.ENV, value: U.SHARE_ENV, label: de("org.logs.shareEnv") },
            {
              key: i.ENV,
              value: U.CANCEL_SHARE_ENV,
              label: de("org.logs.cancelShareEnv"),
            },
            {
              key: i.ENV,
              value: U.ENV_CUSTOM_NUMBER,
              label: de("env.env.req.edit_custom_id"),
            },
            {
              key: i.ENV,
              value: U.SET_ENV_GROUP,
              label: de("base.batchGroup"),
            },
            {
              key: i.ENV_GROUP,
              value: U.CREATE_ENV_GROUP,
              label: de("env.group.createTitle"),
            },
            {
              key: i.ENV_GROUP,
              value: U.EDIT_ENV_GROUP,
              label: de("env.group.editTitle"),
            },
            {
              key: i.ENV_GROUP,
              value: U.DELETE_ENV_GROUP,
              label: de("org.logs.deleteEnvGroup"),
            },
            {
              key: i.PROXY,
              value: U.CREATE_PROXY,
              label: de("proxy.proxy.list.create"),
            },
            {
              key: i.PROXY,
              value: U.EDIT_PROXY,
              label: de("env.env.req.editEnvProxy"),
            },
            {
              key: i.PROXY,
              value: U.DELETE_PROXY,
              label: de("org.logs.deleteProxy"),
            },
            {
              key: i.PROXY,
              value: U.EXPORT_PROXY,
              label: de("org.logs.exportProxy"),
            },
            {
              key: i.PROXY,
              value: U.BATCH_UPDATE_PROXY,
              label: de("env.env.batchUpdate"),
            },
            {
              key: i.MEMBER,
              value: U.CREATE_MEMBER,
              label: de("org.member.createTitle"),
            },
            {
              key: i.MEMBER,
              value: U.EDIT_MEMBER,
              label: de("org.member.editTitle"),
            },
            {
              key: i.MEMBER,
              value: U.DELETE_MEMBER,
              label: de("org.logs.deleteMember"),
            },
            {
              key: i.MEMBER,
              value: U.EXPORT_MEMBER,
              label: de("org.member.exportMembers"),
            },
            {
              key: i.MEMBER_GROUP,
              value: U.CREATE_MEMBER_GROUP,
              label: de("system.role.createTitle"),
            },
            {
              key: i.MEMBER_GROUP,
              value: U.EDIT_MEMBER_GROUP,
              label: de("system.role.editTitle"),
            },
            {
              key: i.MEMBER_GROUP,
              value: U.DELETE_MEMBER_GROUP,
              label: de("org.logs.deleteMemberGroup"),
            },
            {
              key: i.ENV_TAG,
              value: U.CREATE_ENV_TAG,
              label: de("env.tag.createTag"),
            },
            {
              key: i.ENV_TAG,
              value: U.EDIT_ENV_TAG,
              label: de("env.tag.editTag"),
            },
            {
              key: i.ENV_TAG,
              value: U.DELETE_ENV_TAG,
              label: de("env.tag.deleteTag"),
            },
            {
              key: i.EXTENSION,
              value: U.CREATE_EXTENSION,
              label: de("expan.tip1"),
            },
            {
              key: i.EXTENSION,
              value: U.ENABLE_EXTENSION,
              label: de("expan.enableExtension"),
            },
            {
              key: i.EXTENSION,
              value: U.STOP_EXTENSION,
              label: de("expan.stopExtension"),
            },
            {
              key: i.EXTENSION,
              value: U.EDIT_EXTENSION,
              label: de("expan.tip60"),
            },
            {
              key: i.EXTENSION,
              value: U.UPGRADE_EXTENSION,
              label: de("expan.upgradeExtension"),
            },
            {
              key: i.EXTENSION,
              value: U.DELETE_EXTENSION,
              label: de("expan.deleteExtension"),
            },
            {
              key: i.ENV_SYNC,
              value: U.OPEN_ENV_SYNC,
              label: de("rpaMarket.tip28"),
            },
            {
              key: i.ENV_SYNC,
              value: U.CLOSE_ENV_SYNC,
              label: de("rpaMarket.tip29"),
            },
            {
              key: i.RPA_TASK,
              value: U.CREATE_RPA_TASK,
              label: de("org.logs.createRpaTask"),
            },
            {
              key: i.RPA_TASK,
              value: U.EDIT_RPA_TASK,
              label: de("org.logs.editRpaTask"),
            },
            {
              key: i.RPA_TASK,
              value: U.RUN_RPA_TASK,
              label: de("org.logs.runRpaTask"),
            },
            {
              key: i.MEMBER_API,
              value: U.CREATE_MEMBER_API,
              label: de("org.apiCreateMember.apiUrlCreate"),
            },
            {
              key: i.MEMBER_API,
              value: U.EDIT_MEMBER_API,
              label: de("org.logs.editApiLink"),
            },
            {
              key: i.MEMBER_API,
              value: U.DELETE_MEMBER_API,
              label: de("org.logs.deleteApiLink"),
            },
            {
              key: i.AI_SPIDER,
              value: U.RUN_TASK_AI_SPIDER,
              label: de("org.logs.runAICrawlerTask"),
            },
            {
              key: i.AI_SPIDER,
              value: U.DOWNLOAD_AI_SPIDER,
              label: de("org.logs.downloadAICrawlerData"),
            },
            {
              key: i.OPEN_API,
              value: U.CREATE_KEY_OPEN_API,
              label: de("org.logs.generateApiKey"),
            },
            {
              key: i.OPEN_API,
              value: U.RESET_KEY_OPEN_API,
              label: de("org.logs.resetApiKey"),
            },
            {
              key: i.OPEN_API,
              value: U.EDIT_PORT_OPEN_API,
              label: de("org.logs.editApiPort"),
            },
          ];
          return (null == De ? void 0 : De.businessType)
            ? ((null == e
                ? void 0
                : e.filter((e) => e.key === De.businessType)) ?? [])
            : e;
        }),
        ol = M(() => {
          let e = {};
          return (
            al.value.forEach((l) => {
              e[l.value] = null == l ? void 0 : l.label;
            }),
            e
          );
        }),
        tl = M(() => {
          if (De.businessType) {
            let e = [];
            switch (De.businessType) {
              case i.ENV:
                e = ce.value;
                break;
              case i.PROXY:
                e = me.value;
                break;
              case i.ENV_GROUP:
                e = Ne.value;
                break;
              case i.MEMBER:
                e = Ie.value;
                break;
              case i.MEMBER_GROUP:
                e = Oe.value;
                break;
              case i.ENV_TAG:
                e = je.value.map((e) => ({
                  value: e.tagName,
                  label: e.tagName,
                  tagStyle: e.tagStyle,
                }));
            }
            return e;
          }
          return [];
        }),
        rl = M(() => {
          if (De.businessType) {
            let e = "";
            switch (De.businessType) {
              case i.ENV:
                e = de("org.logs.envNameOrId");
                break;
              case i.PROXY:
                e = de("org.logs.proxyAddressOrId");
                break;
              case i.ENV_GROUP:
                e = de("org.logs.envGroupNameOrId");
                break;
              case i.MEMBER:
                e = de("org.member.req.user");
                break;
              case i.MEMBER_GROUP:
                e = de("org.logs.memberGroupNameOrId");
                break;
              case i.ENV_TAG:
                e = de("env.tag.tagName");
                break;
              case i.EXTENSION:
                e = de("expan.expandName");
                break;
              case i.RPA_TASK:
                e = de("rpa.task.list.rpaWorkflowId");
                break;
              case i.MEMBER_API:
                e = de("org.logs.apiLink");
                break;
              case i.AI_SPIDER:
                e = de("org.logs.crawlerUrlTemplate");
            }
            return e;
          }
          return "";
        }),
        nl = M(() => {
          let e = {
            el: [i.EXTENSION, i.RPA_TASK, i.MEMBER_API, i.AI_SPIDER].includes(
              De.businessType,
            )
              ? "input"
              : "select",
          };
          switch (De.businessType) {
            case i.ENV:
              e.getOptionsFn = Qe;
              break;
            case i.PROXY:
              e.getOptionsFn = Je;
              break;
            case i.ENV_GROUP:
              e.getOptionsFn = el;
              break;
            case i.MEMBER:
              ((e.getOptionsFn = Me),
                (e.filterable = !0),
                (e.remote = !0),
                (e.remoteMethod = Pe),
                (e.onPopupScroll = he),
                (e.loading = Ae.value));
              break;
            case i.MEMBER_GROUP:
              e.getOptionsFn = ll;
              break;
            case i.ENV_TAG:
              e.getOptionsFn = () => He.getTagList(!0);
          }
          return e;
        }),
        il = {
          [i.ENV]: () =>
            s([
              t.ENVIRONMENT_LIST,
              t.GET_ENVIRONMENT,
              t.VIEW_OPENED_PROFILE,
              t.RESTORE_LIST,
            ]),
          [i.PROXY]: () => s([t.PROXY_LIST]),
          [i.ENV_GROUP]: () => s([t.LIST_GROUP]),
          [i.MEMBER]: () => s([t.MEMBER_LIST, t.MANAGE_MEMBERS]),
          [i.MEMBER_GROUP]: () => s(t.MEMBER_GROUPING),
          [i.ENV_TAG]: () => s(t.ENV_TAG_USE),
          [i.EXTENSION]: () => !0,
          [i.ENV_SYNC]: () => s(t.SYNCHRONIZER),
          [i.RPA_TASK]: () => s(t.RPA_TASK_MANAGE),
          [i.MEMBER_API]: () => s([t.MEMBER_LIST, t.MANAGE_MEMBERS]),
          [i.AI_SPIDER]: () => s(t.AI_CRWLER),
          [i.OPEN_API]: () => s(u.OPEN_API),
        },
        sl = [
          { value: i.ENV, label: de("org.logs.profile") },
          { value: i.PROXY, label: de("proxy.proxy.word") },
          { value: i.ENV_GROUP, label: de("env.group.word") },
          { value: i.MEMBER, label: de("org.member.word") },
          { value: i.MEMBER_GROUP, label: de("system.role.word") },
          { value: i.ENV_TAG, label: de("env.tag.tag") },
          { value: i.EXTENSION, label: de("expan.extension") },
          { value: i.ENV_SYNC, label: de("sync.tip1") },
          { value: i.RPA_TASK, label: de("menu.rpa.taskManage") },
          { value: i.MEMBER_API, label: de("org.logs.memberApiLink") },
          { value: i.AI_SPIDER, label: de("crawler.ai_crawler") },
          { value: i.OPEN_API, label: de("menu.openapi.top") },
        ],
        El = M(() =>
          sl.filter((e) => {
            const l = il[e.value];
            return !l || l();
          }),
        ),
        ul = M(() => [
          {
            el: "input",
            key: "deviceName",
            label: de("org.loginVerify.tip18"),
            placeholder: de("org.loginVerify.tip18"),
            width: "150px",
            isPackUp: !0,
          },
          {
            el: "input",
            key: "ip",
            label: de("org.loginVerify.tip26"),
            placeholder: de("org.loginVerify.tip26"),
            width: "150px",
            isPackUp: !0,
          },
          {
            el: "input",
            key: "country",
            label: de("org.loginVerify.tip29"),
            placeholder: de("org.loginVerify.tip29"),
            width: "150px",
            isPackUp: !0,
          },
          ...oe(be.value, {
            el: "select",
            key: "memberId",
            label: "",
            placeholder:
              "OPERATION_RECORD" === Te.value
                ? de("org.logs.operationMember")
                : de("org.logs.member"),
            filterable: !0,
            remote: !0,
            clearable: !0,
            options: Ie.value,
            loading: Ae.value,
            getOptionsFn: Me,
            remoteMethod: Pe,
            onPopupScroll: he,
          }),
          ...("LOGIN_LOG" === Te.value
            ? [
                {
                  el: "select",
                  key: "type",
                  label: "",
                  placeholder: de("org.logs.operateType"),
                  clearable: !0,
                  options: [
                    {
                      value: C.ENTER_ORG,
                      label: de("org.logs.loginCurrentTeam"),
                    },
                    {
                      value: C.EXIT_ORG,
                      label: de("org.logs.loginOutCurrentTeam"),
                    },
                  ],
                },
              ]
            : []),
          ...oe("BROWSER_LOG" === Te.value && ke.value, {
            el: "select",
            key: "envId",
            label: "",
            placeholder: de("org.logs.operateEnv"),
            filterable: !1,
            clearable: !0,
            options: Re.value,
            getOptionsFn: Qe,
          }),
          ...("OPERATION_RECORD" === Te.value
            ? [
                {
                  el: "select",
                  key: "businessType",
                  label: "",
                  placeholder: de("org.logs.operationOn"),
                  clearable: !0,
                  options: El.value,
                },
                ...((null == De ? void 0 : De.businessType) && rl.value
                  ? [
                      {
                        key: "value",
                        label: "",
                        placeholder: rl.value,
                        clearable: !0,
                        options: tl.value,
                        ...nl.value,
                      },
                    ]
                  : []),
                {
                  el: "select",
                  key: "operationType",
                  label: "",
                  placeholder: de("org.logs.operateType"),
                  clearable: !0,
                  options: al.value,
                },
              ]
            : []),
          {
            el: "datePicker",
            key: "date",
            label: ["OPERATION_RECORD", "LOGIN_LOG"].includes(Te.value)
              ? de("org.logs.operateTime")
              : de("org.logs.viewTime"),
            placeholder: de("base.createTime"),
            type: "datetimerange",
            timeFormat: "HH:mm",
            format: "YYYY-MM-DD HH:mm",
            dateFormat: "YYYY-MM-DD",
            clearable: !0,
            rangeSeparator: de("base.to"),
            startPlaceholder: de("base.startTime"),
            endPlaceholder: de("base.endTime"),
            width: "150px",
            isPackUp: "OPERATION_RECORD" === Te.value,
          },
          ...("BROWSER_LOG" === Te.value
            ? [
                {
                  el: "input",
                  key: "keyword",
                  label: de("org.logs.keyword"),
                  clearable: !0,
                  placeholder: de("org.logs.keyword"),
                  width: "150px",
                  isPackUp: !0,
                },
              ]
            : []),
        ]),
        pl = (e, l, a, o) => {
          switch (null == e ? void 0 : e.businessType) {
            case i.ENV_TAG:
              return D(
                X,
                {
                  color: Ze[a.type],
                  class: "default-style tw-text-white tw-max-w-full",
                },
                D("div", { class: "tw-truncate" }, a.name),
              );
            case i.EXTENSION:
              let t = {
                LOCAL: de("expan.tip23"),
                GOOGLE: de("expan.tip57"),
                DICLOAK: "DICloak",
              };
              return D("div", `${a.name}(${t[a.type]})`);
            case i.RPA_TASK:
              return D(
                "div",
                `${de("rpaMarket.tip19")}: ${a.name} (id: ${a.id})`,
              );
            case i.MEMBER:
              const r = {
                SELF:
                  e.operationType === U.CREATE_MEMBER
                    ? de("org.logs.manualCreate")
                    : de("org.logs.manualEdit"),
                LOCAL_API: "Local API",
                HTTP_API: "Http API",
              };
              return D(
                "div",
                {
                  class: "sle",
                  style: { display: "inline-block", maxWidth: "100%" },
                },
                {
                  default: () => {
                    const e = a.memberCreateType,
                      l = e ? `(${r[e]})` : "";
                    return `${a.name || "--"} ${l}`;
                  },
                },
              );
            default:
              return D(
                "span",
                {
                  class: "sle",
                  style: { display: "inline-block", maxWidth: "100%" },
                },
                {
                  default: () =>
                    `${a.name || "--"} ${a.id ? `(${a.id})` : ""}${o !== ((null == l ? void 0 : l.length) ?? 0) - 1 ? "、" : ""}`,
                },
              );
          }
        },
        vl = M(() => [
          ...("LOGIN_LOG" === Te.value
            ? [
                {
                  prop: "createTime",
                  label: de("org.logs.operateTime"),
                  minWidth: 160,
                  specialType: x.TIME,
                  isTimeZoneChange: !0,
                  formatter: (e) => ee(e.createTime),
                },
                {
                  prop: "type",
                  label: de("org.logs.operateType"),
                  minWidth: 160,
                  render: ({ row: e }) => {
                    let l = e;
                    if (!(null == l ? void 0 : l.type)) return D("span", "--");
                    const a = {
                      [C.ENTER_ORG]: de("org.logs.loginCurrentTeam"),
                      [C.EXIT_ORG]: de("org.logs.loginOutCurrentTeam"),
                    };
                    return D("div", a[l.type]);
                  },
                },
                {
                  prop: "memberName",
                  label: de("org.logs.member"),
                  minWidth: 150,
                },
                {
                  prop: "ip",
                  label: de("org.logs.ipInfo"),
                  minWidth: 180,
                  render: ({ row: e }) => {
                    var l, a, o;
                    let t = e;
                    return D("div", [
                      D("div", t.ip),
                      D("div", { class: "flx-align-center" }, [
                        D(q, {
                          style: { margin: "-0.5em -0.9em -0.6em -0.7em" },
                          country:
                            null == (l = null == t ? void 0 : t.ipInfo)
                              ? void 0
                              : l.countryCode,
                        }),
                        D(
                          "span",
                          { class: "m-l-4 tw-flex-1 tw-truncate" },
                          `${null == (a = t.ipInfo) ? void 0 : a.countryCode}-${null == (o = t.ipInfo) ? void 0 : o.country}`,
                        ),
                      ]),
                    ]);
                  },
                },
                {
                  prop: "deviceName",
                  label: de("org.loginVerify.tip18"),
                  minWidth: 150,
                },
                { prop: "os", label: de("org.logs.operateUa"), minWidth: 150 },
                {
                  prop: "appVersion",
                  label: de("org.loginVerify.tip19"),
                  minWidth: 150,
                },
              ]
            : []),
          ...("OPERATION_RECORD" === Te.value
            ? [
                {
                  prop: "createTime",
                  label: de("org.logs.operateTime"),
                  specialType: x.TIME,
                  isTimeZoneChange: !0,
                },
                {
                  prop: "businessType",
                  label: de("org.logs.operationType"),
                  render: ({ row: e }) => {
                    let l = e;
                    return (null == l ? void 0 : l.operationType)
                      ? D(
                          "span",
                          de(
                            `${ol.value[null == l ? void 0 : l.operationType]}`,
                          ),
                        )
                      : "--";
                  },
                },
                {
                  prop: "operationInfo",
                  label: de("org.logs.operationOn"),
                  showOverflowTooltip: !1,
                  minWidth: "200",
                  render: ({ row: e }) => {
                    var l, a, o, t, r, n;
                    let i = e;
                    if (
                      !(null ==
                      (a =
                        null == (l = null == i ? void 0 : i.operationInfo)
                          ? void 0
                          : l.arr)
                        ? void 0
                        : a.length)
                    )
                      return "--";
                    let s =
                      null == (o = null == i ? void 0 : i.operationInfo)
                        ? void 0
                        : o.arr;
                    if (!(null == s ? void 0 : s.length))
                      return D("span", {}, "--");
                    if (s.length <= 2)
                      return null == (t = null == s ? void 0 : s.map)
                        ? void 0
                        : t.call(s, (l, a) =>
                            D(
                              B,
                              {
                                placement: "top",
                                width: "unset",
                                popperStyle: {
                                  textAlign: "center",
                                  maxWidth: "50%",
                                },
                              },
                              {
                                default: () => pl(e, s, l, a),
                                reference: () => pl(e, s, l, a),
                              },
                            ),
                          );
                    {
                      const e =
                          null ==
                          (n =
                            null == (r = null == s ? void 0 : s.slice(0, 2))
                              ? void 0
                              : r.map(
                                  (e) => `${e.name} ${e.id ? `(${e.id})` : ""}`,
                                ))
                            ? void 0
                            : n.join("、"),
                        l = s
                          .map((e) => `${e.name} ${e.id ? `(${e.id})` : ""}`)
                          .join("、");
                      return D("div", [
                        D("div", D("div", { class: "sle" }, [e])),
                        D("div", de("base.etc", { N: s.length })),
                        D(
                          "div",
                          D(
                            B,
                            {
                              placement: "top",
                              title: de("org.logs.details"),
                              trigger: "click",
                              width: "unset",
                              popperStyle: {
                                textAlign: "center",
                                maxWidth: "50%",
                              },
                            },
                            {
                              reference: () =>
                                D(
                                  b,
                                  { link: !0, type: "primary" },
                                  { default: () => de("base.view") },
                                ),
                              default: () =>
                                D(
                                  "div",
                                  { class: "view-more-main" },
                                  { default: () => l },
                                ),
                            },
                          ),
                        ),
                      ]);
                    }
                  },
                },
                { prop: "memberName", label: de("org.logs.operationMember") },
              ]
            : []),
          ...("BROWSER_LOG" === Te.value
            ? [
                {
                  prop: "time",
                  label: de("org.logs.viewTime"),
                  minWidth: 150,
                  specialType: x.TIME,
                  isTimeZoneChange: !0,
                },
                {
                  prop: "title",
                  label: de("org.logs.viewTitle"),
                  minWidth: 150,
                },
                {
                  prop: "url",
                  label: de("org.logs.viewUrl"),
                  minWidth: 150,
                  showOverflowTooltip: !1,
                  render: ({ row: e }) => {
                    let l = e;
                    return D(
                      B,
                      {
                        placement: "top",
                        content: l.url,
                        width: "initial",
                        popperStyle: {
                          textAlign: "left",
                          maxWidth: "50%",
                          wordBreak: "break-all",
                          overflowWrap: "break-word",
                          whiteSpace: "normal",
                        },
                      },
                      {
                        reference: () =>
                          D(
                            b,
                            {
                              link: !0,
                              type: "info",
                              class: "table-btn-sel",
                              onClick: () => {
                                return (
                                  (e = l.url ?? ""),
                                  void window.openUrl(e)
                                );
                                var e;
                              },
                            },
                            { default: () => l.url },
                          ),
                      },
                    );
                  },
                },
                {
                  prop: "envName",
                  label: de("org.logs.operateEnv"),
                  minWidth: 150,
                  render: ({ row: e }) => {
                    let l = e;
                    return D(
                      "div",
                      { class: "tw-truncate" },
                      `${l.envName} (${l.serialNum})`,
                    );
                  },
                },
                {
                  prop: "memberName",
                  label: de("org.logs.member"),
                  minWidth: 150,
                },
              ]
            : []),
          ...(["OPERATION_RECORD", "BROWSER_LOG"].includes(Te.value)
            ? [
                {
                  prop: "ipInfo",
                  width: 220,
                  label: de("org.logs.ipInfo"),
                  render: ({ row: e }) => {
                    var l, a, o;
                    let t = e;
                    return (null == t ? void 0 : t.ipInfo)
                      ? D("div", [
                          D("div", t.ip),
                          D("div", { class: "flx-align-center" }, [
                            D(q, {
                              style: { margin: "-0.5em -0.9em -0.6em -0.7em" },
                              country:
                                null == (l = null == t ? void 0 : t.ipInfo)
                                  ? void 0
                                  : l.countryCode,
                            }),
                            D(
                              "span",
                              { class: "m-l-4 tw-flex-1 tw-truncate" },
                              `${null == (a = t.ipInfo) ? void 0 : a.countryCode}-${null == (o = t.ipInfo) ? void 0 : o.country}`,
                            ),
                          ]),
                        ])
                      : "--";
                  },
                },
                {
                  prop: "deviceName",
                  width: 220,
                  label: de("org.loginVerify.tip18"),
                },
              ]
            : []),
        ]),
        dl = A(!1);
      return (l, a) => {
        const o = p("el-tooltip");
        return (
          v(),
          d("div", ne, [
            _(
              e,
              {
                modelValue: Te.value,
                "onUpdate:modelValue": a[0] || (a[0] = (e) => (Te.value = e)),
                options: Ke.value,
                class: "tw-mb-[2px]",
                style: { "align-self": "flex-start" },
                onChange: qe,
              },
              null,
              8,
              ["modelValue", "options"],
            ),
            "SHAREMANAGE" === Te.value
              ? (v(),
                d("div", ie, [
                  _(
                    z,
                    { ref_key: "envShareManageListRef", ref: Ve },
                    null,
                    512,
                  ),
                ]))
              : g("", !0),
            "TRANSFER_OF_ENVIRONMENTAL" === Te.value
              ? (v(),
                d("div", se, [
                  _(
                    Q,
                    { ref_key: "envTransferLogListRef", ref: Le },
                    null,
                    512,
                  ),
                ]))
              : g("", !0),
            ["SHAREMANAGE", "TRANSFER_OF_ENVIRONMENTAL"].includes(Te.value)
              ? g("", !0)
              : (v(),
                R(
                  H,
                  {
                    key: 2,
                    list: T(Be),
                    columns: vl.value,
                    loading: T(Ce),
                    listErr: T(We),
                    onRefresh: T(Ye),
                  },
                  {
                    extends: c(() => [
                      m("div", Ee, [
                        _(
                          T(b),
                          {
                            type: "primary",
                            loading: dl.value,
                            onClick:
                              a[1] ||
                              (a[1] = (e) =>
                                (async () => {
                                  if (dl.value) return;
                                  const { date: e, ...l } = De,
                                    [a, o] = e || [],
                                    t = Object.fromEntries(
                                      Object.entries(l).filter(
                                        ([e, l]) => null != l && "" !== l,
                                      ),
                                    ),
                                    r = {
                                      detail: !0,
                                      ...(a
                                        ? {
                                            startCreateTime: J(
                                              re(a, "YYYY-MM-DD HH:mm:ss")
                                                .value,
                                            ),
                                          }
                                        : {}),
                                      ...(o
                                        ? {
                                            endCreateTime: J(
                                              re(o, "YYYY-MM-DD HH:mm:ss")
                                                .value,
                                            ),
                                          }
                                        : {}),
                                      ...t,
                                      all: !0,
                                      time_zone:
                                        Intl.DateTimeFormat().resolvedOptions()
                                          .timeZone,
                                    };
                                  dl.value = !0;
                                  try {
                                    switch (Te.value) {
                                      case "LOGIN_LOG":
                                        await k({
                                          ...r,
                                          fileName: `${de("org.logs.loginLogFileName")}-${re(Date.now(), "YYYYMMDD").value}`,
                                        });
                                        break;
                                      case "OPERATION_RECORD":
                                        await h({
                                          ...r,
                                          fileName: `${de("org.logs.operateLogFileName")}-${re(Date.now(), "YYYYMMDD").value}`,
                                        });
                                        break;
                                      case "BROWSER_LOG":
                                        await P({
                                          ...r,
                                          fileName: `${de("org.logs.browseLogFileName")}-${re(Date.now(), "YYYYMMDD").value}`,
                                        });
                                    }
                                  } catch (n) {
                                    S(n);
                                  } finally {
                                    await f(() => {
                                      dl.value = !1;
                                    });
                                  }
                                })()),
                          },
                          {
                            default: c(() => [
                              y(O(T(de)("env.env.step.Export")) + " ", 1),
                              _(
                                o,
                                { placement: "top" },
                                {
                                  content: c(() => [
                                    m("div", ue, [
                                      m(
                                        "div",
                                        pe,
                                        O(T(de)("org.logs.limitExportNumber")),
                                        1,
                                      ),
                                    ]),
                                  ]),
                                  default: c(() => [
                                    a[2] ||
                                      (a[2] = m(
                                        "i",
                                        {
                                          class:
                                            "iconfont tw-align-bottom icon-help-circle1 tw-pl-[4px] tw-text-[20px] tw-duration-300 tw-cursor-pointer",
                                        },
                                        null,
                                        -1,
                                      )),
                                  ]),
                                  _: 1,
                                },
                              ),
                            ]),
                            _: 1,
                          },
                          8,
                          ["loading"],
                        ),
                      ]),
                    ]),
                    filters: c(() => [
                      _(
                        W,
                        {
                          config: ul.value,
                          "model-value": T(De),
                          onSearch: T(Ue),
                          "auto-search": !1,
                          "onField:change": ze,
                        },
                        null,
                        8,
                        ["config", "model-value", "onSearch"],
                      ),
                    ]),
                    pagination: c(() => [
                      m(
                        "div",
                        {
                          class: N(
                            "b-flex " +
                              (["BROWSER_LOG", "OPERATION_RECORD"].includes(
                                Te.value,
                              )
                                ? "tw-w-full"
                                : ""),
                          ),
                        },
                        [
                          ["BROWSER_LOG", "OPERATION_RECORD"].includes(Te.value)
                            ? (v(),
                              d("div", ve, [
                                a[3] ||
                                  (a[3] = m(
                                    "i",
                                    {
                                      class:
                                        "iconfont icon-tips tw-pr-[4px] tw-text-[20px]",
                                    },
                                    null,
                                    -1,
                                  )),
                                m(
                                  "span",
                                  null,
                                  O(
                                    T(de)(
                                      "OPERATION_RECORD" === Te.value
                                        ? "org.logs.operationDataTip"
                                        : "org.logs.dataTip",
                                    ),
                                  ),
                                  1,
                                ),
                              ]))
                            : g("", !0),
                          T(Be).length
                            ? (v(),
                              R(
                                j,
                                {
                                  key: 1,
                                  pageable: T(xe),
                                  handleSizeChange: T(Xe),
                                  handleCurrentChange: T($e),
                                },
                                null,
                                8,
                                [
                                  "pageable",
                                  "handleSizeChange",
                                  "handleCurrentChange",
                                ],
                              ))
                            : g("", !0),
                        ],
                        2,
                      ),
                    ]),
                    _: 1,
                  },
                  8,
                  ["list", "columns", "loading", "listErr", "onRefresh"],
                )),
          ])
        );
      };
    },
  });
export { de as default };
