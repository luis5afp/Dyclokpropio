import {
  aE as t,
  be as a,
  ah as s,
  e7 as e,
  e8 as i,
} from "./index-BUIbb6Pa.js";
const g = t("common", {
  state: () => ({ tagList: [] }),
  actions: {
    async getTagList(t = !1) {
      const a = await i({ all: !0 }, t);
      this.tagList = a.list;
    },
    async createTag(t, i) {
      if (!a(s.ENV_TAG_EDIT)) return;
      const g = await e({ tagName: t, tagStyle: i });
      return (this.tagList.push({ id: g, tagName: t, tagStyle: i }), g);
    },
  },
});
export { g as u };
