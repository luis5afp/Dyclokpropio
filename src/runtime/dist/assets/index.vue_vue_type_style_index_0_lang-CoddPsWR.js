import { d as e, r as a, o as n, h as t, aJ as r } from "./index-BUIbb6Pa.js";
const g = e({
  __name: "index",
  props: {
    pageable: {},
    handleSizeChange: { type: Function },
    handleCurrentChange: { type: Function },
  },
  setup: (e) => (g, p) => {
    const o = a("el-pagination");
    return (
      n(),
      t(
        o,
        r(g.$attrs, {
          "current-page": e.pageable.pageNo,
          "page-size": e.pageable.pageSize,
          "page-sizes": [10, 20, 50, 100],
          background: !0,
          "pager-count": 5,
          layout: "total,prev,pager,next,sizes,jumper",
          total: e.pageable.total,
          onSizeChange: e.handleSizeChange,
          onCurrentChange: e.handleCurrentChange,
        }),
        null,
        16,
        [
          "current-page",
          "page-size",
          "total",
          "onSizeChange",
          "onCurrentChange",
        ],
      )
    );
  },
});
export { g as _ };
