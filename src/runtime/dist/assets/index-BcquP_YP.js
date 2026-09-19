import e from "./scrape-PD-LD4jf.js";
import t from "./crawlRunningList-DlECbhM_.js";
import {
  d as r,
  P as s,
  Q as a,
  n as i,
  g as l,
  o,
  c as p,
  a as u,
  t as n,
  b as _,
  i as c,
  _ as m,
} from "./index-BUIbb6Pa.js";
import { _ as w } from "./crawlerMarket.vue_vue_type_script_setup_true_lang-BbnNsoNk.js";
import "./util-Cx7pBhYb.js";
import "./index-rtKG2tmD.js";
import "./timeZone-D3UW65MQ.js";
import "./TableFieldDialog-BI1BUo05.js";
import "./sortable.esm-DneA_jWz.js";
import "./LazyRow.vue_vue_type_script_setup_true_lang-C9dK0oMf.js";
import "./useFetchTable-DUveM-tP.js";
import "./index.vue_vue_type_style_index_0_lang-CoddPsWR.js";
import "./index-CLVJdR_V.js";
import "./index.vue_vue_type_script_setup_true_lang-8hqXqXGq.js";
import "./proxyUtil-OnkkuXcX.js";
import "./usePermissionGuard-BuK9RLCQ.js";
import "./warningTipBox-D4J3yDX4.js";
import "./rpaRule-swm8xZfZ.js";
import "./marketForm.vue_vue_type_script_setup_true_lang-PR0LMXZZ.js";
import "./newRpaProcessOptionsForm.vue_vue_type_script_setup_true_lang-BLtJw3M5.js";
import "./index.vue_vue_type_script_setup_true_lang-CIPUEjpB.js";
import "./resultCard-C8cRDgmf.js";
import "./purify.es-LiQUsk4V.js";
import "./config-52pM5gru.js";
import "./crawlerMarketCard-D9mhIOow.js";
const v = { class: "crawler-wrapper tw-h-full tw-overflow-y-auto" },
  x = { class: "tw-space-y-2 tw-text-center tw-mb-[12px]", id: "ai-crawler" },
  d = {
    class: "tw-font-medium tw-text-[var(--text-color-base)] tw-text-[16px]",
  },
  f = { class: "tw-text-[var(--text-color-base)] tw-text-[14px]" },
  j = { class: "tw-w-full tw-rounded-lg tw-h-full" },
  g = {
    class:
      "tw-max-w-[1000px] tw-mx-auto tw-flex tw-flex-col tw-h-full tw-px-[30px]",
  },
  y = m(
    r({
      __name: "index",
      setup(r) {
        let m = c(),
          y = c();
        function R({ taskDataStr: e, envList: t }) {
          var r;
          try {
            let s = JSON.parse(e);
            null == (r = m.value) || r.handleSetForm(s, t);
          } catch (s) {}
        }
        function k() {
          var e;
          null == (e = y.value) || e.getCrawlerTaskListPage1();
        }
        return (
          s(() => {
            (a().setCurrentPage(i.currentRoute.value.name),
              a().removeDoneCrawlerTask(),
              a().setSelectEnvMaxNum());
          }),
          l(() => {
            (a().setCurrentPage(""), a().closeEditMarket());
          }),
          (r, s) => (
            o(),
            p("div", v, [
              u("div", x, [
                u("div", d, n(r.$t("crawler.ai_crawler")), 1),
                u("p", f, n(r.$t("crawler.ai_crawler_desc")), 1),
              ]),
              u("div", j, [
                u("div", g, [
                  _(e, { ref_key: "scrapeRef", ref: m, onRun: k }, null, 512),
                  _(w),
                  _(
                    t,
                    {
                      class: "tw-flex-1",
                      onRollBack: R,
                      ref_key: "crawlRunningListRef",
                      ref: y,
                    },
                    null,
                    512,
                  ),
                ]),
              ]),
            ])
          )
        );
      },
    }),
    [["__scopeId", "data-v-f5d1897f"]],
  );
export { y as default };
