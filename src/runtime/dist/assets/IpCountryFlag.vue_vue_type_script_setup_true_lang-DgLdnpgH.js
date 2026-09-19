import { e as t } from "./country-flag.esm-Bg8BdAZu.js";
import {
  d as e,
  o as n,
  c as a,
  b as o,
  f as s,
  X as r,
} from "./index-BUIbb6Pa.js";
const l = {
    key: 0,
    class:
      "tw-relative tw-inline-flex tw-h-[21px] tw-w-[21px] tw-flex-none tw-overflow-hidden tw-align-middle tw-text-[0] tw-leading-none",
    "aria-hidden": "true",
  },
  w = e({
    __name: "IpCountryFlag",
    props: { countryCode: {} },
    setup: (e) => (w, i) =>
      e.countryCode
        ? (n(),
          a("span", l, [
            o(
              s(t),
              {
                country: e.countryCode,
                size: "big",
                class:
                  "!tw-absolute !tw-left-1/2 !tw-top-1/2 !tw-m-0 !tw-origin-center !tw-scale-[0.4] !tw--translate-x-1/2 !tw--translate-y-1/2",
              },
              null,
              8,
              ["country"],
            ),
          ]))
        : r("", !0),
  });
export { w as _ };
