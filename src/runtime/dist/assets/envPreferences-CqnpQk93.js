import { u as e, d as t, a as r } from "./useEnvEdit-B6M5ajw7.js";
import {
  d as a,
  v as l,
  G as o,
  R as i,
  i as u,
  V as n,
  P as s,
  r as p,
  q as v,
  o as c,
  c as _,
  b as d,
  w as m,
  x as g,
  h as y,
  f,
  a as w,
  e as j,
  t as x,
  C as b,
  bV as h,
  ac as R,
  as as S,
  bN as P,
  bW as T,
  a3 as V,
  bb as E,
  _ as I,
} from "./index-BUIbb6Pa.js";
import q from "./index-C1USGHg9.js";
import A from "./index-Cl4ZyFim.js";
import D from "./index-BFrckwEl.js";
import "./timezone-BMz8A6Hf.js";
import "./index-UZcsr-ei.js";
import "./groupEdit.vue_vue_type_script_setup_true_name_envGroupEdit_lang-OORP_IuD.js";
import "./BindAccount.vue_vue_type_script_setup_true_lang-ctBeT3Be.js";
import "./Tip.vue_vue_type_script_setup_true_lang-DBJcGLEl.js";
import "./envEditProxyForm-BbH2PHWU.js";
import "./proxyEditV2-PrFoTQ5r.js";
import "./ipResourceMock-CCd7H3CQ.js";
import "./index.vue_vue_type_script_setup_true_lang-CIPUEjpB.js";
import "./index.vue_vue_type_script_setup_true_lang-A7OAkZwm.js";
import "./CustomRadioGroup-Dk-imFdD.js";
import "./editProxySoftDlg.vue_vue_type_script_setup_true_lang-D9otwVyq.js";
import "./proxySoftItem-B7tAwO_8.js";
import "./envProxyItems-DIhzCyp-.js";
import "./proxyCheckButton-qJacjpSf.js";
import "./proxyUtil-OnkkuXcX.js";
import "./envAutoInputProxy.vue_vue_type_script_setup_true_lang-CKSB7kpP.js";
import "./proxyApiExtraction-CcAfvVt-.js";
import "./proxyProviderAvailability-Dl68x0Bx.js";
import "./ProxyGroupSelect.vue_vue_type_script_setup_true_lang-CTswbFOC.js";
import "./envSerialNums-BjlyggGT.js";
import "./ParaturboProxyConfig.vue_vue_type_script_setup_true_lang-DnrGQZKb.js";
import "./DynamicProxyForm.vue_vue_type_script_setup_true_lang-BLDcp8Iw.js";
import "./ipResourceCatalog-CJEdeRbI.js";
import "./IpCountryFlag.vue_vue_type_script_setup_true_lang-DgLdnpgH.js";
import "./country-flag.esm-Bg8BdAZu.js";
import "./IpResourceSelector.vue_vue_type_script_setup_true_lang-Dxuw76Sd.js";
import "./DynamicTrafficGate.vue_vue_type_script_setup_true_lang-3aGxeuRD.js";
import "./IpResourcePurchaseDialog.vue_vue_type_script_setup_true_lang-DcxcArWP.js";
import "./envSegmentedTabs-B8OKb7JK.js";
import "./DynamicTrafficPurchase.vue_vue_type_script_setup_true_lang-BAxyvPun.js";
import "./ipResourcePayment-DW1eNDIC.js";
import "./payDialog.vue_vue_type_style_index_0_lang-BmKrLnEo.js";
import "./browser-DEPKJqf2.js";
import "./IpPurchaseImportantNotice.vue_vue_type_script_setup_true_lang-umWhcEQR.js";
import "./IpPurchaseCheckoutFooter.vue_vue_type_script_setup_true_lang-Boqn4piK.js";
import "./IpPurchaseOrderSummary.vue_vue_type_script_setup_true_lang-CQmGRhje.js";
import "./paySelect-CHLWtiLZ.js";
import "./StaticIpPurchase.vue_vue_type_script_setup_true_lang-Cjw6R1ER.js";
import "./TxtFilePreview.vue_vue_type_style_index_0_lang-BM2kh_uA.js";
import "./index-rtKG2tmD.js";
import "./timeZone-D3UW65MQ.js";
import "./TableFieldDialog-BI1BUo05.js";
import "./sortable.esm-DneA_jWz.js";
import "./LazyRow.vue_vue_type_script_setup_true_lang-C9dK0oMf.js";
import "./index.vue_vue_type_style_index_0_lang-CoddPsWR.js";
import "./ImportInstructions.vue_vue_type_script_setup_true_lang-B6-YEbCB.js";
import "./changEnvTagBtn-Ct3P2QWE.js";
import "./common-_BPSz0Vp.js";
import "./SocialMediaFileList-B9K8zyg5.js";
import "./SocialAccountAssignmentDialog-BpJPUyF5.js";
import "./envAddAcceptLangDialog.vue_vue_type_script_setup_true_name_envAddAcceptLangDialog_lang-DdcOzUN-.js";
import "./envEditFontDialog-BAmKs9Pq.js";
import "./BrowserSelection-DT8JdE4_.js";
import "./ua-CJ8LtZXg.js";
import "./TlsCipherSuiteSelector.vue_vue_type_script_setup_true_lang-Bm0jmwwi.js";
import "./expansionDefaulAvatar-BAAgU78a.js";
import "./index-C6tOf3zW.js";
import "./system-DtbAsiCM.js";
import "./fixedUrlsFormItem.vue_vue_type_script_setup_true_lang-J-frhu2d.js";
import "./oneWaySync-C7I0Josw.js";
import "./accessLimitCard-CVpkvN01.js";
const C = { class: "tw-w-[80%] tw-h-full tw-flex tw-flex-col" },
  F = { class: "tw-mt-[10px]" },
  L = I(
    a({
      __name: "envPreferences",
      setup(a) {
        const { t: I, locale: L } = l.useI18n(),
          O = u(),
          k = u(),
          G = u(),
          $ = u(["0", "1", "2"]),
          B = u([]),
          M = u([]),
          N = b(() =>
            Reflect.get(
              {
                zh: "125px",
                en: "180px",
                vi: "160px",
                ru: "170px",
                pt: "200px",
                es: "180px",
              },
              L.value,
            ),
          ),
          U = ["basic", "fingerprint", "senior", "proxy"],
          { getDefaultBatchExtendConfig: W } = e({
            isEdit: u(!1),
            isSingle: u(!1),
          }),
          z = o(),
          { personalPreference: H } = i(z),
          J = u(W()),
          Y = u(),
          K =
            /^[\-\+]?(0(\.\d{1,6})?|([1-9](\d)?)(\.\d{1,6})?|1[0-7]\d{1}(\.\d{1,6})?|180|180\.0{1,6})$/,
          X = /^\d+$/,
          Z =
            /^((25[0-5]\.|2[0-4]\d\.|1\d{2}\.|[1-9]?\d\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d))$/,
          Q = u({ row: n.cloneDeep(t), uaTypeArr: ["all"] });
        let ee = u(!0);
        const te = b(() => {
          var e, t, r, a;
          return {
            ...(null == (e = O.value) ? void 0 : e.urlsRules),
            ...(null == (t = k.value) ? void 0 : t.proxyRules),
            os: [
              {
                validator: (e, t, r) => {
                  var a, l, o, i, u;
                  t &&
                  ((null == (a = t.windows) ? void 0 : a.length) ||
                    (null == (l = t.mac) ? void 0 : l.length) ||
                    (null == (o = t.android) ? void 0 : o.length) ||
                    (null == (i = t.ios) ? void 0 : i.length) ||
                    (null == (u = t.linux) ? void 0 : u.length))
                    ? r()
                    : r(new Error(I("env.env.req.osRule1")));
                },
              },
            ],
            ua: [
              {
                required: !0,
                validator: (e, t, r) => {
                  var a;
                  0 !== (null == (a = Q.value.uaTypeArr) ? void 0 : a.length)
                    ? r()
                    : r(new Error(I("env.env.req.uaTypeRule")));
                },
              },
            ],
            browserVersionId: [
              {
                required: !0,
                message: I("env.env.req.editBrowserVersionTip1"),
              },
            ],
            extensionsGroupId: [{ required: !0, message: I("expan.tip46") }],
            "extend.acceptLang": [
              {
                validator: (e, t, r) => {
                  "custom" === J.value.acceptLangType &&
                  E(J.value.acceptLangValue)
                    ? r(new Error(I("env.env.req.acceptLangRule")))
                    : r();
                },
              },
            ],
            "extend.geo": [
              {
                validator: (e, t, r) => {
                  var a, l, o;
                  if (
                    "custom" !== J.value.geoSubType ||
                    "disable" === J.value.geoType
                  )
                    return void r();
                  const i = J.value.geoValue;
                  (console.log(i, "val"),
                    E(i.longitude) || E(i.latitude) || E(i.accuracy)
                      ? r(new Error(I("env.env.req.geoRule1")))
                      : !i.longitude ||
                          K.test(
                            null == (a = i.longitude) ? void 0 : a.toString(),
                          )
                        ? !i.latitude ||
                          K.test(
                            null == (l = i.latitude) ? void 0 : l.toString(),
                          )
                          ? !i.accuracy ||
                            X.test(
                              null == (o = i.accuracy) ? void 0 : o.toString(),
                            )
                            ? r()
                            : r(new Error(I("env.env.req.geoRule4")))
                          : r(new Error(I("env.env.req.geoRule3")))
                        : r(new Error(I("env.env.req.geoRule2"))));
                },
                trigger: "change",
              },
            ],
            "extend.webrtcValue": [
              {
                validator: (e, t, r) => {
                  if ("replace" !== J.value.webrtcType) return void r();
                  if (J.value.webrtcUseRandomInternalIp) return void r();
                  if (J.value.webrtcSyncProxyIpFlag) return void r();
                  const a = J.value.webrtcValue;
                  a
                    ? !a || Z.test(a)
                      ? r()
                      : r(new Error(I("env.env.req.webrtcRule2")))
                    : r(new Error(I("env.env.req.webrtcRule1")));
                },
                trigger: "blur",
              },
            ],
            "extend.ratio": [
              {
                validator: (e, t, r) => {
                  "custom" !== J.value.ratioType ||
                  "custom" !== J.value.ratioValue ||
                  (J.value.ratioWidth && J.value.ratioHeight)
                    ? r()
                    : r(I("env.env.req.ratioInputPlaceholder"));
                },
              },
            ],
            "extend.windowRatio": [
              {
                validator: (e, t, r) => {
                  "custom" !== J.value.windowRatioType ||
                  "custom" !== J.value.windowRatioValue ||
                  (J.value.windowWidth && J.value.windowHeight)
                    ? r()
                    : r(I("env.env.req.ratioInputPlaceholder"));
                },
              },
            ],
            "extend.port": [
              {
                validator: (e, t, r) => {
                  "1" !== J.value.portType ||
                  !J.value.portValue ||
                  ((J.value.portValue = J.value.portValue
                    .replace("，", ",")
                    .replace(/\s/g, "")
                    .replace(/[^0-9, ]/g, "")),
                  J.value.portValue
                    .split(",")
                    .every((e) => Number(e) >= 1 && Number(e) <= 65535))
                    ? r()
                    : r(I("env.env.req.portRule"));
                },
                trigger: "blur",
              },
            ],
            "extend.webglRender": [
              {
                validator: (e, t, r) => {
                  "custom" !== J.value.webGLMetadataType || J.value.webglRender
                    ? r()
                    : r(I("env.env.req.webglRenderRule"));
                },
                trigger: "change",
              },
            ],
            "extend.webglManufacturer": [
              {
                validator: (e, t, r) => {
                  "custom" !== J.value.webGLMetadataType ||
                  J.value.webglManufacturer
                    ? r()
                    : r(I("env.env.req.webglManufacturerRule"));
                },
                trigger: "change",
              },
            ],
            "envDataSync.roleIds": [
              {
                required:
                  null ==
                  (a = null == (r = Q.value.row) ? void 0 : r.envDataSync)
                    ? void 0
                    : a.status,
                message: I("setting.versionLimitTip12"),
              },
            ],
          };
        });
        s(() => {
          !(async function () {
            var e;
            ((ee.value = !0),
              (B.value = [{ value: "all", label: I("env.env.req.allUaType") }]),
              r.forEach((e) => {
                B.value.push({ value: `${e}`, label: `UA ${e}` });
              }),
              await z.getPersonalPreference(),
              Object.assign(
                Q.value.row,
                h(n.omitBy(H.value.row ?? {}, n.isNull), n.cloneDeep(t)),
              ),
              Object.assign(
                J.value,
                h(
                  n.omitBy(H.value.extendConfig ?? {}, n.isNull),
                  n.cloneDeep(J.value),
                ),
              ));
            try {
              const e = JSON.parse(Q.value.row.uaType || '["all"]');
              Array.isArray(e)
                ? (Q.value.uaTypeArr = e)
                : (Q.value.uaTypeArr = [e]);
            } catch (a) {
              Q.value.uaTypeArr = ["all"];
            }
            (await R(),
              await (null == (e = k.value)
                ? void 0
                : e.ensureBrowserVersionId()),
              (ee.value = !1),
              console.log(J.value, "extendConfig"));
          })();
        });
        const re = (e) => {
            $.value = e;
          },
          ae = u(!1);
        async function le() {
          var e;
          try {
            ae.value = !0;
            let [t] = await S(G.value.validate()),
              [r] = await S(k.value.validateAccountList());
            if (t || r)
              return (
                R(async () => {
                  await P(200);
                  const e = document.querySelectorAll(".el-form-item__error");
                  if (null == e ? void 0 : e.length) {
                    const t = e[0],
                      r = T(t, "el-collapse-item");
                    if (r && !r.classList.contains("is-active")) {
                      const e = r.querySelector("button");
                      e && (e.click(), await P(200));
                    }
                    t.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                      inline: "center",
                    });
                  }
                }),
                V.warning(I("env.env.req.pleaseCheck"))
              );
            const a = await (null == (e = Y.value)
              ? void 0
              : e.handleExtendConfig());
            let l = { row: Q.value.row, extendConfig: a };
            (await z.setPersonalPreference(JSON.stringify(l)),
              V.success(I("setting.SaveSuccess")));
          } finally {
            ae.value = !1;
          }
        }
        function oe() {
          (Object.assign(Q.value.row, n.cloneDeep(t)),
            Object.assign(J.value, W()),
            (Q.value.row.browserVersionId = "134"),
            (Q.value.uaTypeArr = ["all"]),
            V.success(I("setting.envPreferences.resetDefault")));
        }
        return (e, t) => {
          const r = p("el-collapse-item"),
            a = p("el-collapse"),
            l = p("el-form"),
            o = p("el-scrollbar"),
            i = p("el-button"),
            u = v("prevent-label-click");
          return (
            c(),
            _("div", C, [
              d(
                o,
                { class: "tw-pr-[10px]" },
                {
                  default: m(() => [
                    g(
                      (c(),
                      y(
                        l,
                        {
                          rules: te.value,
                          ref_key: "formRef",
                          ref: G,
                          "label-width": N.value,
                          model: Q.value.row,
                          "inline-message": "",
                          "validate-on-rule-change": !1,
                          class: "envEditV2Form tw-pb-[20px]",
                          "label-position": "right",
                          "scroll-to-error": !0,
                        },
                        {
                          default: m(() => [
                            d(
                              a,
                              {
                                id: "envEditV2Collapse",
                                modelValue: $.value,
                                "onUpdate:modelValue":
                                  t[2] || (t[2] = (e) => ($.value = e)),
                                onChange: re,
                              },
                              {
                                default: m(() => [
                                  d(
                                    r,
                                    {
                                      id: U[0],
                                      title: e.$t("env.env.step.basic1"),
                                      name: "0",
                                    },
                                    {
                                      default: m(() => [
                                        d(
                                          q,
                                          {
                                            ref_key: "envEditBasicFormV2Ref",
                                            ref: k,
                                            modelValue: Q.value,
                                            "onUpdate:modelValue":
                                              t[0] ||
                                              (t[0] = (e) => (Q.value = e)),
                                            "is-single": !0,
                                            "is-preference": !0,
                                            envGroupOptions: M.value,
                                            uaTypeOptions: B.value,
                                          },
                                          null,
                                          8,
                                          [
                                            "modelValue",
                                            "envGroupOptions",
                                            "uaTypeOptions",
                                          ],
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["id", "title"],
                                  ),
                                  d(
                                    r,
                                    {
                                      id: U[1],
                                      title: e.$t("env.env.step.fingerprint1"),
                                      name: "1",
                                    },
                                    {
                                      default: m(() => [
                                        d(
                                          A,
                                          {
                                            ref_key: "envFingerprintFormV2Ref",
                                            ref: Y,
                                            batchData: Q.value,
                                            "batch-drawer-props-row":
                                              Q.value.row,
                                            envGroupOptions: M.value,
                                            batchExtendConfig: J.value,
                                            isMore: !0,
                                            isShowAll: !0,
                                            "is-batch": !0,
                                            isPreference: !0,
                                            uaTypeOptions: B.value,
                                            mainFormRef: G.value,
                                            formRef: G.value,
                                          },
                                          null,
                                          8,
                                          [
                                            "batchData",
                                            "batch-drawer-props-row",
                                            "envGroupOptions",
                                            "batchExtendConfig",
                                            "uaTypeOptions",
                                            "mainFormRef",
                                            "formRef",
                                          ],
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["id", "title"],
                                  ),
                                  d(
                                    r,
                                    {
                                      id: U[2],
                                      title: e.$t("env.env.step.extend"),
                                      name: "2",
                                    },
                                    {
                                      default: m(() => [
                                        d(
                                          D,
                                          {
                                            ref_key: "envSeniorV2Ref",
                                            ref: O,
                                            modelValue: Q.value.row,
                                            "onUpdate:modelValue":
                                              t[1] ||
                                              (t[1] = (e) => (Q.value.row = e)),
                                            isSingle: !0,
                                            isPreference: !0,
                                            "disable-browser-config-confirm":
                                              f(ee),
                                          },
                                          null,
                                          8,
                                          [
                                            "modelValue",
                                            "disable-browser-config-confirm",
                                          ],
                                        ),
                                      ]),
                                      _: 1,
                                    },
                                    8,
                                    ["id", "title"],
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
                        ["rules", "label-width", "model"],
                      )),
                      [[u]],
                    ),
                  ]),
                  _: 1,
                },
              ),
              w("div", F, [
                d(
                  i,
                  { type: "primary", onClick: le, loading: ae.value },
                  {
                    default: m(() => [
                      j(x(e.$t("setting.envPreferences.save")), 1),
                    ]),
                    _: 1,
                  },
                  8,
                  ["loading"],
                ),
                d(
                  i,
                  {
                    type: "info",
                    class: "button-info-pro",
                    link: "",
                    onClick: oe,
                  },
                  {
                    default: m(() => [
                      j(x(e.$t("env.env.req.reset_defaults")), 1),
                    ]),
                    _: 1,
                  },
                ),
              ]),
            ])
          );
        };
      },
    }),
    [["__scopeId", "data-v-553fca21"]],
  );
export { L as default };
