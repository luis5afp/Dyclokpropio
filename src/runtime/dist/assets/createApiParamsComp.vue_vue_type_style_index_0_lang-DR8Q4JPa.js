import {
  d as e,
  v as r,
  i,
  o as a,
  c as t,
  F as p,
  a as s,
  t as d,
  f as o,
  b as m,
  C as n,
} from "./index-BUIbb6Pa.js";
import { E as l } from "./index-rtKG2tmD.js";
const c = {
    class:
      "tw-text-[14px] tw-text-[var(--btn-info-text-color)] tw-mb-[10px] tw-block",
  },
  u = { class: "e-table-container" },
  g = e({
    __name: "createApiParamsComp",
    props: { isEditApi: { type: Boolean } },
    setup(e) {
      const g = e,
        { t: b } = r.useI18n(),
        M = i([
          {
            label: b("org.apiCreateMember.params.key"),
            prop: "field",
            width: 120,
          },
          {
            label: b("org.apiCreateMember.params.type"),
            prop: "type",
            width: 100,
          },
          {
            label: b("org.apiCreateMember.params.required"),
            prop: "required",
            width: 120,
          },
          {
            label: b("org.apiCreateMember.params.desc"),
            prop: "description",
            minWidth: 100,
          },
        ]),
        _ = i([
          {
            field: "name",
            type: "String",
            required: "NO",
            description: b("org.apiCreateMember.params.descMap.name"),
          },
          {
            field: "env_group_ids",
            type: "String",
            required: "NO",
            description: b(
              "org.apiCreateMember.params.editDescMap.env_group_ids",
            ),
          },
          {
            field: "account",
            type: "String",
            required: "NO",
            description: b("org.apiCreateMember.params.descMap.account"),
          },
          {
            field: "password",
            type: "String",
            required: "NO",
            description: b("org.apiCreateMember.params.descMap.password"),
          },
          {
            field: "remark",
            type: "String",
            required: "NO",
            description: b("org.apiCreateMember.params.descMap.remark"),
          },
          {
            field: "expiry_mode",
            type: "String",
            required: "NO",
            description: b("org.apiCreateMember.params.descMap.expiry_mode"),
          },
          {
            field: "days",
            type: "String",
            required: "NO",
            description: b("org.apiCreateMember.params.descMap.days"),
          },
          {
            field: "time_zone",
            type: "String",
            required: "NO",
            description: b("org.apiCreateMember.params.descMap.time_zone"),
          },
        ]),
        f = i([
          {
            field: "member_id",
            type: "String",
            required: "YES",
            description: b("org.apiCreateMember.params.editDescMap.member_id"),
          },
          {
            field: "token",
            type: "String",
            required: "YES",
            description: b("org.apiCreateMember.params.editDescMap.token"),
          },
          {
            field: "env_group_ids",
            type: "String",
            required: "NO",
            description: b(
              "org.apiCreateMember.params.editDescMap.env_group_ids",
            ),
          },
          {
            field: "status",
            type: "String",
            required: "NO",
            description: b("org.apiCreateMember.params.editDescMap.status"),
          },
          {
            field: "password",
            type: "String",
            required: "NO",
            description: b("org.apiCreateMember.params.editDescMap.passwd"),
          },
          {
            field: "disuse_enable",
            type: "Boolean",
            required: "NO",
            description: b(
              "org.apiCreateMember.params.editDescMap.disuse_enable",
            ),
          },
          {
            field: "time_zone",
            type: "String",
            required: "NO",
            description: b(
              "org.apiCreateMember.params.editDescMap.disuse_enable_time_zone",
            ),
          },
          {
            field: "disuse_time",
            type: "String",
            required: "NO",
            description: b(
              "org.apiCreateMember.params.editDescMap.disuse_enable_time",
            ),
          },
        ]),
        y = n(() => (g.isEditApi ? f.value : _.value));
      return (e, r) => (
        a(),
        t(
          p,
          null,
          [
            s("span", c, d(o(b)("org.apiCreateMember.apiUrlParams")) + ": ", 1),
            s("div", u, [
              m(
                l,
                {
                  ref: "ETableRef",
                  columns: M.value,
                  list: y.value,
                  "selected-list-show-filter": !0,
                },
                null,
                8,
                ["columns", "list"],
              ),
            ]),
          ],
          64,
        )
      );
    },
  });
export { g as _ };
