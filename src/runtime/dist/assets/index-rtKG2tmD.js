import {
  V as e,
  C as l,
  i as t,
  d as a,
  v as o,
  aK as n,
  o as s,
  h as i,
  Y as r,
  a5 as d,
  aL as u,
  aM as c,
  aN as p,
  aO as v,
  aP as f,
  W as m,
  P as y,
  g as h,
  aQ as w,
  G as g,
  ag as b,
  r as x,
  q as S,
  c as C,
  F as k,
  a as L,
  ai as F,
  x as B,
  ax as I,
  f as $,
  X as _,
  b as T,
  aR as N,
  aJ as K,
  w as D,
  z as E,
  aj as M,
  t as R,
  e as O,
  aS as A,
  ac as H,
  aT as W,
  aU as j,
  a3 as z,
  _ as P,
} from "./index-BUIbb6Pa.js";
import { g as G } from "./timeZone-D3UW65MQ.js";
import { n as V, T as q, s as Z, r as U } from "./TableFieldDialog-BI1BUo05.js";
import { _ as J } from "./LazyRow.vue_vue_type_script_setup_true_lang-C9dK0oMf.js";
function Q(e) {
  return "number" == typeof e && Number.isFinite(e)
    ? e
    : "string" == typeof e && /^\d+(\.\d+)?(?:px)?$/.test(e.trim())
      ? Number.parseFloat(e)
      : void 0;
}
const X = a({
    __name: "TableColumn",
    props: { column: {} },
    setup(e) {
      const { t: l } = o.useI18n(),
        t = n(),
        a = new Map(),
        f =
          "undefined" == typeof document
            ? null
            : document.createElement("canvas").getContext("2d");
      if (f) {
        const e = document.body
          ? getComputedStyle(document.body).fontFamily
          : "Arial";
        f.font = `400 14px ${e}`;
      }
      const m = (e, t) => {
          if (e.enumMap) {
            const a = t.row[e.prop];
            let o = e.enumMap[a] || a;
            return (o.startsWith("enum.") && (o = l(o)), o);
          }
          return p(v(t.row, e.prop));
        },
        y = (e) => {
          const l = String(e.label ?? "");
          let o = a.get(l);
          void 0 === o &&
            ((o =
              (null == f ? void 0 : f.measureText(l).width) ??
              14 * Array.from(l).length),
            a.set(l, o));
          const n = Boolean(e.headerRender || t[`${e.prop}Header`]),
            s = (function (e, l, t) {
              const a = { ...e };
              if (t || void 0 === e.label || null === e.label || "" === e.label)
                return a;
              const o =
                  Number(Boolean(e.sortable)) +
                  Number(Array.isArray(e.filters)),
                n = Math.max(80, Math.ceil(l + 24 + 28 * o));
              return void 0 !== e.width
                ? ((a.width = Math.max(Q(e.width) ?? 0, n)), a)
                : ((a.minWidth = Math.max(Q(e.minWidth) ?? 0, n)), a);
            })(e, o, n);
          return d(
            c,
            {
              ...s,
              align: e.align ?? "left",
              showOverflowTooltip:
                e.showOverflowTooltip ?? "operation" !== e.prop,
            },
            {
              default: (l) => {
                if (e._children) return e._children.map((e) => y(e));
                if (e.render) return e.render(l);
                if (t[e.prop]) return t[e.prop](l);
                if (e.specialType && e.specialType === u.TIME) {
                  const t = (e.isTimeZoneChange ? G(m(e, l)) : m(e, l)).split(
                    " ",
                  );
                  if (2 === t.length)
                    return d(
                      "div",
                      {
                        style: `color: ${e.color || "var(--text-color-base)"}`,
                      },
                      [
                        d(
                          "div",
                          {
                            style: "overflow: hidden; text-overflow: ellipsis;",
                          },
                          t[0],
                        ),
                        d(
                          "div",
                          {
                            style: "overflow: hidden; text-overflow: ellipsis;",
                          },
                          t[1],
                        ),
                      ],
                    );
                }
                if (e.isTimeZoneChange) {
                  const t = G(m(e, l));
                  return d(
                    "span",
                    { style: `color: ${e.color || "var(--text-color-base)"}` },
                    d(
                      "div",
                      { style: "overflow: hidden; text-overflow: ellipsis;" },
                      t,
                    ),
                  );
                }
                return d(
                  "span",
                  { style: `color: ${e.color || "var(--text-color-base)"}` },
                  m(e, l),
                );
              },
              header: () =>
                e.headerRender
                  ? e.headerRender(e)
                  : t[`${e.prop}Header`]
                    ? t[`${e.prop}Header`]({ row: e })
                    : e.label,
            },
          );
        };
      return (l, t) => (s(), i(r(y(e.column))));
    },
  }),
  Y = { class: "table-card" },
  ee = { class: "extends" },
  le = { class: "filters" },
  te = { class: "table-other" },
  ae = { class: "card table-main" },
  oe = { class: "table-empty" },
  ne = { class: "tw-flex tw-items-center" },
  se = { class: "table-footer" },
  ie = { class: "tw-w-full tw-flex tw-justify-end tw-flex-1" },
  re = P(
    a({
      __name: "index",
      props: {
        columns: { default: () => [] },
        list: { default: () => [] },
        border: { type: Boolean, default: !1 },
        toolButton: { type: Boolean, default: !0 },
        rowKey: { default: "id" },
        loading: { type: Boolean, default: !1 },
        listErr: { type: Boolean, default: !1 },
        authorityCode: { default: "admin" },
        isCrossPageSelection: { type: Boolean, default: !1 },
        selectedList: { default: () => [] },
        conditionBoxPosition: { default: "unset" },
        cellClassName: { default: "" },
        headerRowClassName: { default: "" },
        emptyText: { default: void 0 },
        customFixed: { type: Boolean, default: !1 },
        customFixedData: { default: () => [] },
        defaultHiddenFieldKeys: { default: () => [] },
        customFieldIsGlobal: { type: Boolean, default: !1 },
        emptyBtnOptions: {},
        showFilterSlot: { type: Boolean, default: !0 },
        conditionsSlot: { type: Boolean, default: !0 },
        tableName: { default: "" },
        selectedListShowFilter: { type: Boolean, default: !1 },
        isScrollTop: { type: Boolean, default: !0 },
        size: {},
        width: {},
        height: {},
        maxHeight: {},
        fit: { type: Boolean },
        stripe: { type: Boolean },
        context: {},
        showHeader: { type: Boolean },
        showSummary: { type: Boolean },
        sumText: {},
        summaryMethod: {},
        rowClassName: {},
        rowStyle: {},
        cellStyle: {},
        headerRowStyle: {},
        headerCellClassName: {},
        headerCellStyle: {},
        highlightCurrentRow: { type: Boolean },
        currentRowKey: {},
        expandRowKeys: {},
        defaultExpandAll: { type: Boolean },
        defaultSort: {},
        tooltipEffect: {},
        tooltipOptions: {},
        spanMethod: {},
        selectOnIndeterminate: { type: Boolean },
        indent: {},
        treeProps: {},
        lazy: { type: Boolean },
        load: {},
        className: {},
        style: {},
        tableLayout: {},
        scrollbarAlwaysOn: { type: Boolean },
        flexible: { type: Boolean },
        showOverflowTooltip: { type: [Boolean, Object] },
        tooltipFormatter: {},
        appendFilterPanelTo: {},
        scrollbarTabindex: {},
      },
      emits: [
        "update:selectedList",
        "refresh",
        "sortChange",
        "updateFieldListFn",
      ],
      setup(a, { expose: n, emit: d }) {
        const { t: u } = o.useI18n(),
          c = f(),
          p = a,
          v = l((e) => {
            let l = c.loadingCount.api,
              t = c.loadingCount.page;
            return p.loading && !(l || t);
          }),
          P = t(null),
          G = () => {
            var e, l;
            if (P.value) return;
            let t = c.loadingCount.api,
              a = c.loadingCount.page;
            if (t || a) return;
            const o =
              null == (l = null == (e = ve.value) ? void 0 : e.$el)
                ? void 0
                : l.querySelector(".el-table__body-wrapper");
            o &&
              (P.value = A.service({
                target: o,
                lock: !0,
                text: u("components.table.elementLoadingText"),
                background: "var(--el-mask-color)",
              }));
          },
          Q = () => {
            var e;
            (null == (e = P.value) || e.close(), (P.value = null));
          };
        (m(
          () => v.value,
          (e) => {
            e ? H(() => G()) : Q();
          },
        ),
          y(() => {
            v.value && G();
          }),
          h(() => {
            Q();
          }));
        const re = t(p.selectedList),
          de = t(!1),
          ue = t();
        let ce = w();
        const pe = d,
          ve = t(),
          fe = g(),
          me = t(null),
          ye = t(!1),
          he = (e) => {
            "Shift" === e.key && (ye.value = !0);
          },
          we = (e) => {
            "Shift" === e.key && (ye.value = !1);
          };
        function ge(e, l) {
          const t = e.findIndex((e) => e[p.rowKey] === l[p.rowKey]);
          if ((Le(e, l), -1 === t)) return void (me.value = null);
          if (!ye.value || null === me.value) {
            const e = p.list.findIndex((e) => e[p.rowKey] === l[p.rowKey]);
            return void (-1 !== e && (me.value = e));
          }
          const a = p.list.findIndex((e) => e[p.rowKey] === l[p.rowKey]);
          if (-1 === a) return;
          const o = Math.min(me.value, a),
            n = Math.max(me.value, a);
          (H(() => {
            var e;
            for (let l = o + 1; l <= n - 1; l++) {
              const t = p.list[l];
              if (!t) continue;
              !!xe.value.find((e) => e[p.rowKey] === t[p.rowKey]) ||
                null == (e = ve.value) ||
                e.toggleRowSelection(t, !0);
            }
          }),
            (me.value = a));
        }
        (y(() => {
          (window.addEventListener("keydown", he),
            window.addEventListener("keyup", we));
        }),
          b(() => {
            (window.removeEventListener("keydown", he),
              window.removeEventListener("keyup", we),
              Q());
          }));
        const {
            selectionChangeAll: be,
            selectedList: xe,
            selectedListIds: Se,
            isSelected: Ce,
            selectionChange: ke,
            selectionItemChange: Le,
            delSelectedItem: Fe,
          } = ((a = "id", o, n, s, i) => {
            const r = t(!1),
              d = t([]),
              u = l(() => d.value.map((e) => e[a]));
            return {
              isSelected: r,
              selectedList: d,
              selectedListIds: u,
              selectionChangeAll: (l) => {
                if (!n) return;
                let t = e.uniqBy(l, "id"),
                  i = e.cloneDeep(d.value);
                (t.length
                  ? t.forEach((e) => {
                      -1 === d.value.findIndex((l) => l[a] === e[a]) &&
                        d.value.push(e);
                    })
                  : ((d.value.length = 0),
                    d.value.push(
                      ...e.differenceWith(i, o(), (e, l) => e[a] === l[a]),
                    )),
                  (s.value = d.value),
                  (r.value = d.value.length > 0));
              },
              selectionChange: (e) => {
                n ||
                  (e.length ? (r.value = !0) : (r.value = !1),
                  (d.value = e),
                  (s.value = d.value));
              },
              selectionItemChange: (e, l) => {
                if (!n) return;
                const t = d.value.findIndex((e) => e[a] === l[a]);
                (-1 === t ? d.value.push(l) : d.value.splice(t, 1),
                  (s.value = d.value),
                  (r.value = d.value.length > 0));
              },
              delSelectedItem: (e) => {
                r.value &&
                  ((d.value = d.value.filter((l) => l.id !== e)),
                  0 === d.value.length &&
                    ((r.value = !1), i.value.clearSelection()));
              },
            };
          })(p.rowKey, () => p.list, p.isCrossPageSelection, re, ve),
          Be = t(p.columns);
        (m(
          () => p.columns,
          () => {
            p.customFixed ? Ne() : (Be.value = p.columns);
          },
        ),
          m(
            () => p.loading,
            () => {
              p.loading &&
                p.isScrollTop &&
                H(() => {
                  var e;
                  null == (e = ve.value) || e.setScrollTop(0);
                });
            },
          ));
        const Ie = l(() =>
          Be.value.map((e) => {
            let l = ce.tableHeaderWidthMap[p.tableName] ?? {};
            return (
              p.tableName &&
                p.border &&
                l[e.prop] &&
                e.prop &&
                "operation" !== e.prop &&
                (e.width = l[e.prop].width),
              e
            );
          }),
        );
        function $e() {
          var e;
          (console.log("清空选择", xe.value),
            (xe.value.length = 0),
            null == (e = ve.value) || e.clearSelection(),
            (me.value = null));
        }
        m(
          () => p.list,
          () => {
            me.value = null;
          },
        );
        p.isCrossPageSelection &&
          m(
            () => p.list,
            () => {
              var e;
              ((xe.value = p.selectedList),
                null == (e = ve.value) || e.clearSelection(),
                xe.value.forEach((e) => {
                  var l, t;
                  p.list.find((l) => l[p.rowKey] === e[p.rowKey]) &&
                    (null == (l = ve.value) || l.toggleRowSelection(e, !1),
                    null == (t = ve.value) || t.toggleRowSelection(e, !0));
                }));
            },
          );
        const _e = (e) =>
            e.map((e, l) => {
              const t = Object.values(j);
              return (e.type && t.includes(e.type)) ||
                (e.prop && t.includes(e.prop))
                ? {
                    id: l,
                    key: e.prop ?? e.type,
                    checked: !0,
                    label: e.label || "",
                    disabled: !0,
                    freeze: !0,
                  }
                : {
                    id: l,
                    key: e.prop ?? e.type,
                    checked: W(e.prop ?? e.type, p.defaultHiddenFieldKeys),
                    label: e.label || "",
                    disabled: !!e.fixed,
                    freeze: !1,
                  };
            }),
          Te = t(V(_e(p.columns))),
          Ne = () => {
            const l = _e(p.columns);
            let t = V(l);
            (p.customFixed &&
              p.customFixedData.length > 0 &&
              (t = U(l, e.cloneDeep(p.customFixedData))),
              !t.find((e) => e.key == j.Selection) &&
                t.unshift({
                  id: 0,
                  key: j.Selection,
                  checked: !0,
                  label: "",
                  disabled: !0,
                  freeze: !0,
                }),
              (Te.value = t),
              Ke(Te.value));
          },
          Ke = async (l, t = !1) => {
            (console.log(l, "handleFieldDialogConfirm"),
              (Te.value = V(e.cloneDeep(l))));
            const a = new Map(p.columns.map((e) => [e.prop ?? e.type, e])),
              o = new Map(Te.value.map((e) => [e.key, e])),
              n = [];
            (Te.value.map((e) => {
              const l = o.has(e.key),
                t = a.get(e.key);
              if (l) {
                const l = o.get(e.key);
                return Z(l) && t ? n.push(t) : void 0;
              }
              return t && n.push(t);
            }),
              (Be.value = [...n]),
              Be.value.forEach((e) => {
                "left" === e.fixed && delete e.fixed;
              }));
            let s = Be.value.find((e) => e.type !== j.Selection);
            (s && (s.fixed = "left"), t && pe("updateFieldListFn", l));
          };
        function De(e, l, t, a) {
          if ((a.preventDefault(), t.resizable)) {
            if (
              ((t.minWidth || t.width) < e
                ? (t.width = e)
                : (t.width = t.minWidth),
              p.border && p.tableName)
            ) {
              let e = ce.tableHeaderWidthMap[p.tableName] ?? {};
              ((e[t.property] = { width: t.width }),
                (ce.tableHeaderWidthMap[p.tableName] = e));
            }
          } else t.width = l;
        }
        m(
          () => p.customFixedData,
          () => {
            p.customFixed && Ne();
          },
          { immediate: !0, deep: !0 },
        );
        return (
          n({
            element: ve,
            clearSelection: () => {
              ve.value.clearSelection();
            },
            handleOpenFieldDialog: async () => {
              var e;
              "EnvList" === p.tableName && fe.isGlobalEnvTitleConfigApplied
                ? z.warning(u("setting.profileFieldConfigTip3"))
                : (await (null == (e = ue.value)
                    ? void 0
                    : e.changeFieldList()),
                  (de.value = !0));
            },
            isSelected: Ce,
            selectedList: xe,
            selectedListIds: Se,
            watchSelectList: (e, l) => {
              m(() => re.value, e, l);
            },
            selectItem: (e) => {
              var l;
              (null == (l = ve.value) || l.clearSelection(),
                e.forEach((e) => {
                  var l, t;
                  const a = p.list.find((l) => l[p.rowKey] === e);
                  a &&
                    (null == (l = ve.value) || l.toggleRowSelection(a, !1),
                    null == (t = ve.value) || t.toggleRowSelection(a, !0));
                }));
            },
            selectionChange: ke,
            delSelectedItem: Fe,
            emptySelectedList: $e,
            sortTable: function (e, l, t) {
              var a;
              Be.value.find((l) => l.prop === e)
                ? null == (a = ve.value) || a.sort(e, l)
                : null == t || t();
            },
            changeFieldList: () => {
              var e;
              return null == (e = ue.value)
                ? void 0
                : e.updateEnvCustomTitleFn();
            },
            changeLastClickedIndex: (e) => {
              ((me.value = e), console.log("lastClickedIndex", me.value));
            },
          }),
          (e, l) => {
            const t = x("el-table-column"),
              o = x("ThemeImage"),
              n = x("el-button"),
              d = S("auth");
            return (
              s(),
              C(
                k,
                null,
                [
                  L("div", Y, [F(e.$slots, "tableCard", {}, void 0, !0)]),
                  a.showFilterSlot
                    ? B(
                        (s(),
                        C(
                          "div",
                          {
                            key: 0,
                            style: I({
                              display:
                                !a.conditionsSlot ||
                                (a.selectedListShowFilter && $(xe).length)
                                  ? "none"
                                  : "flex",
                            }),
                            class: "table-extend tw-h-fit",
                          },
                          [
                            L("div", ee, [
                              F(
                                e.$slots,
                                "extends",
                                { selectedList: $(xe), selectedListIds: $(Se) },
                                void 0,
                                !0,
                              ),
                            ]),
                            L("div", le, [
                              F(
                                e.$slots,
                                "filters",
                                {
                                  searchCb: $e,
                                  selectedList: $(xe),
                                  selectedListIds: $(Se),
                                },
                                void 0,
                                !0,
                              ),
                            ]),
                          ],
                          4,
                        )),
                        [[d, a.authorityCode]],
                      )
                    : _("", !0),
                  L("div", te, [
                    F(
                      e.$slots,
                      "tableOther",
                      {
                        clearSelectionFn: $e,
                        isSelected: $(Ce),
                        selectedList: $(xe),
                        selectedListIds: $(Se),
                      },
                      void 0,
                      !0,
                    ),
                  ]),
                  B(
                    (s(),
                    C("div", ae, [
                      T(
                        $(N),
                        K(
                          {
                            ref_key: "tableRef",
                            ref: ve,
                            border: a.border,
                            "cell-class-name": a.cellClassName,
                            "row-class-name": p.rowClassName,
                            "header-row-class-name": a.headerRowClassName,
                            data: a.list,
                            "row-key": a.rowKey,
                            "tooltip-options": {
                              effect: "customized",
                              popperClass: "table-overflow-tooltip",
                            },
                          },
                          e.$attrs,
                          {
                            onSelect: ge,
                            onSelectAll: $(be),
                            onSelectionChange: $(ke),
                            onHeaderDragend: De,
                            onSortChange:
                              l[1] || (l[1] = (l) => e.$emit("sortChange", l)),
                          },
                        ),
                        {
                          append: D(() => [
                            F(e.$slots, "append", {}, void 0, !0),
                          ]),
                          empty: D(() => [
                            L("div", oe, [
                              a.listErr
                                ? F(
                                    e.$slots,
                                    "error",
                                    { key: 1 },
                                    () => [
                                      T(o, {
                                        alt: "notData",
                                        src: "@/assets/images/notData.png",
                                      }),
                                      L(
                                        "div",
                                        null,
                                        R(e.$t("components.table.errData")),
                                        1,
                                      ),
                                      T(
                                        n,
                                        {
                                          type: "primary",
                                          onClick:
                                            l[0] ||
                                            (l[0] = (l) => e.$emit("refresh")),
                                        },
                                        {
                                          default: D(() => [
                                            O(
                                              R(
                                                e.$t(
                                                  "components.table.retryBtn",
                                                ),
                                              ),
                                              1,
                                            ),
                                          ]),
                                          _: 1,
                                        },
                                      ),
                                    ],
                                    !0,
                                  )
                                : F(
                                    e.$slots,
                                    "empty",
                                    { key: 0 },
                                    () => [
                                      T(o, {
                                        alt: "notData",
                                        src: "@/assets/images/notData.png",
                                      }),
                                      L(
                                        "div",
                                        null,
                                        R(
                                          a.emptyText ??
                                            e.$t("components.table.noData"),
                                        ),
                                        1,
                                      ),
                                      a.emptyBtnOptions
                                        ? (s(),
                                          i(
                                            n,
                                            {
                                              key: 0,
                                              class: "tw-mt-2",
                                              type: "primary",
                                              onClick:
                                                a.emptyBtnOptions.callback,
                                            },
                                            {
                                              default: D(() => [
                                                O(R(a.emptyBtnOptions.text), 1),
                                              ]),
                                              _: 1,
                                            },
                                            8,
                                            ["onClick"],
                                          ))
                                        : _("", !0),
                                    ],
                                    !0,
                                  ),
                            ]),
                          ]),
                          default: D(() => [
                            F(e.$slots, "default", {}, void 0, !0),
                            (s(!0),
                            C(
                              k,
                              null,
                              E(
                                Ie.value,
                                (l) => (
                                  s(),
                                  C(
                                    k,
                                    { key: l.label },
                                    [
                                      "selection" == l.type || "index" == l.type
                                        ? (s(),
                                          i(
                                            t,
                                            K(
                                              {
                                                key: 0,
                                                align: l.align ?? "center",
                                                "reserve-selection":
                                                  "selection" == l.type,
                                              },
                                              { ref_for: !0 },
                                              l,
                                            ),
                                            null,
                                            16,
                                            ["align", "reserve-selection"],
                                          ))
                                        : _("", !0),
                                      "expand" == l.type
                                        ? (s(),
                                          i(
                                            t,
                                            K(
                                              {
                                                key: 1,
                                                "label-class-name": "tableItem",
                                                align: l.align ?? "left",
                                              },
                                              { ref_for: !0 },
                                              l,
                                              { "min-width": "300" },
                                            ),
                                            {
                                              default: D((t) => [
                                                l.render
                                                  ? (s(),
                                                    i(
                                                      r(l.render),
                                                      { key: 0, row: t.row },
                                                      null,
                                                      8,
                                                      ["row"],
                                                    ))
                                                  : F(
                                                      e.$slots,
                                                      l.type,
                                                      { key: 1, row: t.row },
                                                      void 0,
                                                      !0,
                                                    ),
                                              ]),
                                              _: 2,
                                            },
                                            1040,
                                            ["align"],
                                          ))
                                        : _("", !0),
                                      l.prop
                                        ? (s(),
                                          i(
                                            X,
                                            { key: 2, column: l },
                                            M({ _: 2 }, [
                                              E(Object.keys(e.$slots), (l) => ({
                                                name: l,
                                                fn: D((t) => [
                                                  T(
                                                    J,
                                                    null,
                                                    {
                                                      default: D(() => [
                                                        F(
                                                          e.$slots,
                                                          l,
                                                          {
                                                            row: t.row,
                                                            index: t.$index,
                                                          },
                                                          void 0,
                                                          !0,
                                                        ),
                                                      ]),
                                                      _: 2,
                                                    },
                                                    1024,
                                                  ),
                                                ]),
                                              })),
                                            ]),
                                            1032,
                                            ["column"],
                                          ))
                                        : _("", !0),
                                    ],
                                    64,
                                  )
                                ),
                              ),
                              128,
                            )),
                          ]),
                          _: 3,
                        },
                        16,
                        [
                          "border",
                          "cell-class-name",
                          "row-class-name",
                          "header-row-class-name",
                          "data",
                          "row-key",
                          "onSelectAll",
                          "onSelectionChange",
                        ],
                      ),
                      L("div", ne, [
                        L("div", se, [
                          F(
                            e.$slots,
                            "tableFooter",
                            {
                              isSelected: $(Ce),
                              selectedList: $(xe),
                              selectedListIds: $(Se),
                            },
                            void 0,
                            !0,
                          ),
                        ]),
                        L("div", ie, [
                          F(
                            e.$slots,
                            "pagination",
                            { isSelected: $(Ce) },
                            void 0,
                            !0,
                          ),
                        ]),
                      ]),
                      a.customFixed
                        ? (s(),
                          i(
                            q,
                            {
                              key: 0,
                              modelValue: de.value,
                              "onUpdate:modelValue":
                                l[2] || (l[2] = (e) => (de.value = e)),
                              fieldList: Te.value.filter((e) => e.key),
                              isGlobal: a.customFieldIsGlobal,
                              ref_key: "tableFieldDialogRef",
                              ref: ue,
                              onConfirm: l[3] || (l[3] = (e) => Ke(e, !0)),
                            },
                            null,
                            8,
                            ["modelValue", "fieldList", "isGlobal"],
                          ))
                        : _("", !0),
                    ])),
                    [[d, a.authorityCode]],
                  ),
                ],
                64,
              )
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-768ee060"]],
  );
export { re as E };
