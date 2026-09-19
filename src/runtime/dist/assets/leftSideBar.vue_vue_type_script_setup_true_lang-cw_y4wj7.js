import { _ as t } from "./typewriterEffect.vue_vue_type_script_setup_true_lang-G-DpXigX.js";
import {
  d as a,
  hQ as s,
  ev as e,
  G as n,
  c as o,
  a as r,
  t as l,
  b as i,
  h as w,
  l4 as u,
  X as c,
  C as m,
  o as p,
} from "./index-BUIbb6Pa.js";
const d = "" + new URL("sso-banner-BzNv-6Kb.png", import.meta.url).href,
  h = {
    class:
      "tw-w-full tw-flex tw-flex-col tw-items-start tw-justify-center tw-gap-4 tw-relative tw--translate-y-12",
  },
  f = { class: "tw-text-[42px] tw-font-bold" },
  x = { class: "tw-opacity-80 tw-text-[18px]" },
  _ = a({
    __name: "leftSideBar",
    setup(a) {
      const _ = s(),
        g = m(() => _.meta.isAds),
        y = {
          [e.EN]: [
            "Multi-account",
            "Airdrops",
            "Automation",
            "Marketplaces",
            "Anonymity",
            "Account share",
          ],
          [e.ZH]: ["多账号管理", "空投", "自动化", "市场", "匿名", "账号共享"],
          [e.PT]: [
            "Multiaccounting",
            "Airdrops",
            "Automação",
            "Marketplaces",
            "Anonimato",
            "Compartilhamento de contas",
          ],
          [e.RU]: [
            "Мультиаккаунта",
            "Аирдропов",
            "Автоматизации",
            "Маркетплейсов",
            "Анонимности",
            "Общего доступа к аккаунтам",
          ],
          [e.VI]: [
            "Quản lý nhiều tài khoản",
            "Airdrops",
            "Tự động hóa",
            "Thị trường",
            "Ẩn danh",
            "Chia sẻ tài khoản",
          ],
        },
        A = n(),
        v = m(() => y[A.language].map((t) => ({ text: t })));
      return (a, s) => (
        p(),
        o("div", h, [
          s[0] ||
            (s[0] = r(
              "img",
              {
                src: d,
                alt: "sso-banner",
                class:
                  "tw-absolute tw-transform tw--translate-x-20 tw--translate-y-20 tw-z-[-10] tw-blur-sm",
              },
              null,
              -1,
            )),
          r("h1", f, l(a.$t("sso.title")), 1),
          i(
            t,
            {
              words: v.value,
              className: "tw-text-[42px] tw-font-medium tw-text-main",
            },
            null,
            8,
            ["words"],
          ),
          r("h2", x, l(a.$t("sso.description")), 1),
          g.value ? c("", !0) : (p(), w(u, { key: 0, class: "tw-mt-4" })),
        ])
      );
    },
  });
export { _ };
