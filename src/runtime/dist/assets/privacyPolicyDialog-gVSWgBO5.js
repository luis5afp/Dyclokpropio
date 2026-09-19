import {
  d as e,
  G as o,
  r as l,
  h as n,
  w as t,
  o as a,
  c as r,
  a as i,
  e as s,
  C as u,
  i as p,
  _ as c,
} from "./index-BUIbb6Pa.js";
const d = { key: 0, class: "content" },
  h = { key: 1, class: "content" },
  y = c(
    e({
      __name: "privacyPolicyDialog",
      setup(e, { expose: c }) {
        const y = o(),
          m = u(() => y.language),
          g = p(!1);
        return (
          c({
            acceptParams: () => {
              g.value = !0;
            },
          }),
          (e, o) => {
            const u = l("el-dialog");
            return (
              a(),
              n(
                u,
                {
                  modelValue: g.value,
                  "onUpdate:modelValue": o[0] || (o[0] = (e) => (g.value = e)),
                  title: e.$t("register.privacyAgreement"),
                  width: "800px",
                  "align-center": !0,
                  class: "privacy-policy-dialog",
                },
                {
                  default: t(() => [
                    "zh" === m.value
                      ? (a(),
                        r("div", d, [
                          ...(o[1] ||
                            (o[1] = [
                              i(
                                "div",
                                null,
                                "生效日期：【2024】年【05】月【07】日",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  s(
                                    " 您在开始使用DICloak Technology Limited（以下称“我们”）的产品和服务前，请务必先仔细阅读和理解本政策，特别应重点阅读我们以粗体标识的条款。您同意隐私政策表示您已了解DICloak产品及服务的功能和内容，以及DICloak产品及各功能模块、增值服务运行所需的必要个人信息，并给予相应的收集使用授权，除非您阅读并接受本协议所有条款，否则请您不要下裁、安装或使用DICloak产品及相关服务。",
                                  ),
                                  i(
                                    "strong",
                                    null,
                                    "您的点击同意、下载、安装、使用、登录等行为即视为您已阅读并同意本协议的约束。",
                                  ),
                                  s(
                                    " 本隐私政策为您与我们签署的关于DICloak用户服务协议（无论电子形式或非电子形式）的组成部分。 ",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "本隐私政策将帮助您了解以下内容：",
                                -1,
                              ),
                              i("p", null, "一、适用范围", -1),
                              i("p", null, "二、信息收集及使用", -1),
                              i("p", null, "三、对外提供信息", -1),
                              i("p", null, "四、信息安全", -1),
                              i("p", null, "五、您的权利", -1),
                              i("p", null, "六、信息的存储", -1),
                              i("p", null, "七、政策的更新", -1),
                              i("p", null, "八、未成年人保护", -1),
                              i("p", null, "九、联系我们", -1),
                              i("p", null, "附录", -1),
                              i(
                                "p",
                                null,
                                [i("strong", null, "一、适用范围")],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " 本隐私政策适用于DICloak服务提供者以网站、软件客户端以及随技术发展出现的新形态向您提供的各项产品和服务。除本政策说明的相关信息收集使用活动外，本政策不适用于DICloak合作方及其他第三方向您提供的其他服务，其他服务适用其向您另行说明的个人信息收集使用规则。 ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [i("strong", null, "二、信息收集及使用")],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "在您使用我们的产品/服务时，我们需要/可能需要收集和使用的您的个人信息包括如下两种：",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " 1.为实现向您提供我们产品及/或服务的基本功能，您须授权我们收集、使用的必要的信息。如您拒绝提供相应信息，您将无法正常使用我们的产品及/或服务； ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " 2.为实现向您提供我们产品及/或服务的附加功能，您可选择单独同意或不同意我们收集、使用的信息。如您拒绝提供，您将无法正常使用相关附加功能或无法达到我们拟达到的功能效果，不会影响您使用我们的基本功能。 ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " 我们在此特别提醒您：因我们向您提供的产品功能模块和服务种类众多，且不同用户选择使用的具体产品/服务范围存在差异，故基本/附加功能及对应收集使用的个人信息类型、范围会有所区别，请以具体的产品功能模块和服务功能为准。 ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "我们会为您提供的各项具体功能场景包括但不限于：",
                                -1,
                              ),
                              i("p", null, "1. DICloak产品的功能模块服务", -1),
                              i(
                                "p",
                                null,
                                [
                                  s(
                                    "为了创建DICloak账户您需要至少向我们提供您的",
                                  ),
                                  i(
                                    "strong",
                                    null,
                                    "手机号码或邮箱地址。如果您拒绝提供上述信息，您将无法注册DICloak账户。",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  s(
                                    " 在您使用DICloak产品及服务，或访问DICloak浏览器平台网页时，DICloak浏览器会自动接收并记录的 ",
                                  ),
                                  i(
                                    "strong",
                                    null,
                                    "您的浏览器和计算机上的信息，包括但不限于您的IP地址、浏览器的类型、使用的语言、访问日期和时间、软硬件特征信息及您访问的网页、您的服务日志和操作日志。",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  s(
                                    " 为了确保我们是在为您本人提供服务，我们可能会根据您提供的上述信息校验您的身份。若存在依法需确定您必要身份的场景（包括依法保护未成年人权益、打击电信网络诈骗、为您扣缴税费、行政执法或司法诉讼中相关主体认定）时，",
                                  ),
                                  i(
                                    "strong",
                                    null,
                                    "您可以授权我们提供的人脸识别验证渠道进行验证，",
                                  ),
                                  s(" 验证信息用于上述目的。 "),
                                ],
                                -1,
                              ),
                              i("p", null, "2. 账号认证服务", -1),
                              i(
                                "p",
                                null,
                                [
                                  s(
                                    " 在您使用需要身份认证才能提供的功能或服务时，您可能需要提供",
                                  ),
                                  i(
                                    "strong",
                                    null,
                                    "姓名、身份证号码、电话号码",
                                  ),
                                  s("以证实您的真实身份。"),
                                  i(
                                    "strong",
                                    null,
                                    "您可以拒绝提供，但您将可能无法获得相关服务，但不影响其他功能与服务的正常使用。",
                                  ),
                                ],
                                -1,
                              ),
                              i("p", null, "3. 附加服务", -1),
                              i(
                                "p",
                                null,
                                [
                                  s(
                                    " 您可以选择进一步完善本产品账号信息，可以向我们提供",
                                  ),
                                  i("strong", null, "您的昵称、手机号码"),
                                  s("等以获取更加更加符合您需求的附加服务。"),
                                  i(
                                    "strong",
                                    null,
                                    "您也可以选择不提供，但您将无法获得相关服务，但不影响其他功能与服务的正常使用。",
                                  ),
                                ],
                                -1,
                              ),
                              i("p", null, "4. 帮助您完成支付", -1),
                              i(
                                "p",
                                null,
                                [
                                  s(
                                    " 为完成订单支付，您可能需要提供支付宝账户、微信帐户或选择其他付款方式进行支付。例如，如您选择支付宝进行支付的， ",
                                  ),
                                  i(
                                    "strong",
                                    null,
                                    "我们会将您的DICloak账号、对应的支付宝账户会员名、订单支付相关信息、订单安全相关设备信息及其他反洗钱法律要求的必要信息通过在应用程序中嵌入的支付宝工具开发包（SDK）等方式与支付宝公司共享。",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  s(" 如您选择微信进行支付的，"),
                                  i(
                                    "strong",
                                    null,
                                    "我们会将您的DICloak账号、对应的微信账户会员名、订单支付相关信息、订单安全相关设备信息及其他反洗钱法律要求的必要信息通过在应用程序中嵌入的微信工具开发包（SDK）等方式与微信共享。",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  s(
                                    " 如您选择由其他金融机构为您提供支付服务的 ，",
                                  ),
                                  i(
                                    "strong",
                                    null,
                                    "我们还会将您的包括银行卡号、有效期在内的银行卡支付必要信息与您选择的相应金融机构共享。",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  s(
                                    " 为使我们及时获悉并确认您的支付进度及状态，为您提供售后与争议解决服务，",
                                  ),
                                  i(
                                    "strong",
                                    null,
                                    "您同意我们可与您所选择的交易对象、支付宝公司或您选择的其他金融机构处收集与支付进度相关信息。",
                                  ),
                                ],
                                -1,
                              ),
                              i("p", null, "5. 客服及争议处理", -1),
                              i(
                                "p",
                                null,
                                "当您与我们联系或提出售中、售后、争议纠纷处理申请时，为了保障您的账户及系统安全，我们需要您提供必要的个人信息以核验您的会员身份。",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  s(
                                    " 便于与您联系、尽快帮助您解决问题或记录相关问题的处理方案及结果，我们可能会保存",
                                  ),
                                  i(
                                    "strong",
                                    null,
                                    "您与我们的沟通、通信/通话记录及相关内容（包括账户信息、地址、邮箱、您为了证明相关事实提供的其他信息，或您留下的联系方式信息）。",
                                  ),
                                  s(
                                    "如果您针对具体订单进行咨询、投诉或提供建议的，我们会使用 ",
                                  ),
                                  i("strong", null, "您的账户信息和订单信息。"),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [i("strong", null, "三、对外提供信息")],
                                -1,
                              ),
                              i("p", null, "（一）共享", -1),
                              i(
                                "p",
                                null,
                                [
                                  s(
                                    " 为便于我们与关联公司共同向您提供部分服务，基于DICloak平台账户向您提供产品和服务，推荐您可能感兴趣的信息，识别会员账户异常，保护DICloak关联公司或其他用户或公众的人身财产安全免遭侵害， ",
                                  ),
                                  i(
                                    "strong",
                                    null,
                                    "您的个人信息可能会与我们的关联公司和/或其指定的服务提供商共享。",
                                  ),
                                  s(
                                    " 我们只会共享必要的个人信息，且受本政策中所声明目的的约束，如果我们共享您的敏感个人信息或关联公司改变个人信息的使用及处理目的，将再次征求您的授权同意。 ",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "请注意，您在使用我们服务时自愿共享甚至公开分享的信息，可能会涉及您或他人的个人信息甚至敏感个人信息。请您更加谨慎地考虑并做出决定。",
                                -1,
                              ),
                              i("p", null, "（二）委托处理", -1),
                              i(
                                "p",
                                null,
                                [
                                  i(
                                    "strong",
                                    null,
                                    "我们可能委托授权合作伙伴处理您的个人信息，",
                                  ),
                                  s(
                                    " 以便授权合作伙伴代表我们为您提供某些服务或履行职能。我们仅会出于本政策声明的合法、正当、必要、特定、明确的目的委托其处理您的信息，授权合作伙伴只能接触到其履行职责所需信息，且我们将会通过协议要求其不得将此信息用于其他任何超出委托范围的目的。如果授权合作伙伴将您的信息用于我们未委托的用途，其将单独征得您的同意。 ",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  s("目前，"),
                                  i(
                                    "strong",
                                    null,
                                    "我们委托的授权合作伙伴包括以下类型：",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  i(
                                    "strong",
                                    null,
                                    "1.广告、分析服务类的授权合作伙伴。",
                                  ),
                                  s(
                                    " 我们会在采用行业通用的安全技术前提下，委托这些合作伙伴处理与广告投放、覆盖面和有效性相关的信息。我们不会将您的个人身份信息委托合作伙伴处理。 ",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  i(
                                    "strong",
                                    null,
                                    "2.供应商、服务提供商和其他合作伙伴。",
                                  ),
                                  s(
                                    "我们将信息委托给支持我们业务的供应商、服务提供商和其他合作伙伴处理，这些支持包括受我们委托提供的技术基础设施服务、分析我们服务的使用方式、提供客户服务、支付便利或进行学术研究和调查。 ",
                                  ),
                                ],
                                -1,
                              ),
                              i("p", null, "（三）转让", -1),
                              i(
                                "p",
                                null,
                                " 如果我们因合并、分立、解散、被宣告破产的原因需要转移个人信息的，我们会向您告知接收方的名称或者姓名和联系方式。接收方将继续履行本政策及其他法定义务。接收方变更原先的处理目的、处理方式的，会重新取得您的同意。 ",
                                -1,
                              ),
                              i("p", null, "（四）公开披露", -1),
                              i(
                                "p",
                                null,
                                "我们仅会在以下情况下，公开披露您的个人信息：",
                                -1,
                              ),
                              i("p", null, "（1）已取得您的明确同意；", -1),
                              i(
                                "p",
                                null,
                                "（2）为订立、履行您作为一方当事人的合同所必需，或者按照依法制定的劳动规章制度和依法签订的集体合同实施人力资源管理所必需；",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "（3）为履行法定职责或者法定义务所必需；",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "（4）为应对突发公共卫生事件，或者紧急情况下为保护自然人的生命健康和财产安全所必需；",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "（5）为公共利益实施新闻报道、舆论监督等行为，在合理的范围内处理您的个人/企业信息；",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "（6）法律、行政法规规定的其他情形。 即使在以上情况下，我们也将采用合法、正当的方式，并以明确、合理的目的处理您的个人/企业信息。",
                                -1,
                              ),
                              i("p", null, "四、信息安全", -1),
                              i(
                                "p",
                                null,
                                [
                                  s(
                                    " 我们非常重视您个人/企业信息的安全，将努力采取合理的安全措施（包括技术方面和管理方面）来保护您的个人/企业信息。 ",
                                  ),
                                  i(
                                    "strong",
                                    null,
                                    "尽管已经采取了上述合理有效措施，并已经遵守了相关法律规定要求的标准，但请您理解，由于技术的限制以及可能存在的各种恶意手段，在互联网行业，即便竭尽所能加强安全措施，也不可能始终保证信息百分之百的安全，",
                                  ),
                                  s(
                                    "我们将尽力确保您提供给我们的个人/企业信息的安全性。",
                                  ),
                                  i(
                                    "strong",
                                    null,
                                    "您知悉并理解，您接入我们的服务所用的系统和通讯网络，有可能因我们可控范围外的因素而出现问题。因此，我们强烈建议您采取积极措施保护个人/企业信息的安全，包括但不限于使用复杂密码、定期修改密码、不将自己的账号密码及相关个人/企业信息透露给他人。",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [i("strong", null, "五、您的权利")],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "您可以通过以下方式查阅和管理您的信息，我们会在符合法律法规要求的情形下响应您的请求：",
                                -1,
                              ),
                              i("p", null, "（一）查阅、更正和补充", -1),
                              i(
                                "p",
                                null,
                                "您有权通过官网客服请求查阅、更正和补充您的信息。",
                                -1,
                              ),
                              i("p", null, "（二）删除", -1),
                              i(
                                "p",
                                null,
                                "您可以通过“（一）查阅、更正和补充您的信息”列明的路径删除您的部分信息，或申请注销账户删除您的全部信息。",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "在以下情形中，您可以通过与客服联系向我们提出删除个人信息的请求：",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "1. 如果我们处理个人信息的行为违反法律法规；",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "2. 如果我们收集、使用您的个人信息，却未征得您的明确同意；",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "3. 如果我们处理个人信息的行为严重违反了与您的约定；",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "4. 如果我们的处理目的已实现、无法实现或者为实现处理目的不再必要；",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "5. 如果我们停止提供产品或者服务，或者保存期限已届满。",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " 若我们决定响应您的删除请求，我们还将同时尽可能通知从我们处获得您的个人信息的主体，并要求其及时删除（除非法律法规另有规定，或这些主体已独立获得您的授权）。 ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " 当您或我们协助您删除相关信息后，因为适用的法律和安全技术限制，我们可能无法立即从备份系统中删除相应的信息，我们将安全地存储您的个人信息并限制对其的任何进一步的处理，直到备份可以清除或实现匿名化。 ",
                                -1,
                              ),
                              i("p", null, "（三）改变授权范围", -1),
                              i(
                                "p",
                                null,
                                " 您可以通过客服联系改变或者撤回您授权我们收集和处理您的个人信息的范围，但请注意，对于部分类型的个人信息，例如实现DICloak基本功能所必须的信息或者我们履行法律法规规定的义务所必需的信息，我们可能无法响应您改变授权范围的请求。当您撤回授权后，我们将不再处理相应的个人信息。但您撤回授权的决定，不会影响我们此前基于您的授权而开展的个人信息处理。 ",
                                -1,
                              ),
                              i("p", null, "（四）注销账户", -1),
                              i(
                                "p",
                                null,
                                " 如果您确定不会再使用我们的产品或服务，且您想注销您的账户，您可以通过官网客服联系我们提出您的账户注销请求。在您提出注销请求后，我们会停止为您提供产品或服务，并根据使用法律的要求删除或者匿名化处理您的个人信息。 ",
                                -1,
                              ),
                              i("p", null, "（五）约束信息系统自动决策", -1),
                              i(
                                "p",
                                null,
                                "在某些业务功能中，我们可能仅依据算法在内的非人工自动决策机制做出决定。如果这些决定影响您的合法权益，您可以通过客服联系我们。",
                                -1,
                              ),
                              i("p", null, "（六）响应您的上述请求", -1),
                              i(
                                "p",
                                null,
                                " 对于您或可能的您的监护人、近亲属及其他有权主体向我们提出上述请求，以及中华人民共和国法律与其他适用法律规定的您的相关个人信息权利，您可以通过客服联系我们，我们将在15天内做出答复。 ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " 为保障您的账户安全和您的个人信息安全，您向我们提出上述请求时，我们可能会先验证您的身份（如增加账户核验、要求您提供书面请求或其他合理方式），然后再处理您的请求。 ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " 对于您合理的请求，我们原则上不收取费用，但对多次重复、超出合理限度的请求，我们将酌情收取一定费用。对于与您的身份不直接关联的信息、无合理理由重复申请的信息，或者需要过多技术手段（如需要开发新系统或从根本上改变现行惯例）、给他人合法权益带来风险或者不切实际的请求，我们可能会予以拒绝。 ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [i("strong", null, "六、信息的存储")],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " 我们只会在达成本政策所述目的所需的期限内保留您的个人信息，除非法律有强制的留存要求，例如《中华人民共和国电子商务法》要求商品和服务信息、交易信息保存时间自交易完成之日起不少于三年。 ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "我们判断个人信息的存储期限主要依据以下标准：",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "1. 完成与您相关的交易目的、维护相应交易及业务记录，以应对您可能的查询或投诉；",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "2. 保证我们为您提供服务的安全和质量；",
                                -1,
                              ),
                              i("p", null, "3. 您是否同意更长的留存期间；", -1),
                              i(
                                "p",
                                null,
                                "4. 是否存在关于保留期限的其他特别约定或法律法规规定。",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "在超出保留期间后，我们会根据适用法律的要求删除或匿名化处理您的个人信息。",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "我们已采取符合业界标准、合理可行的安全防护措施保护您的信息，防止个人信息遭到未经授权访问、公开披露、使用、修改、损坏或丢失。",
                                -1,
                              ),
                              i("p", null, "七、未成年人个人信息的保护", -1),
                              i(
                                "p",
                                null,
                                [
                                  s(
                                    " DICloak的服务面向成年人。若您是未满18周岁的未成年人，在使用本产品前，应在您的父母或其他监护人的监护、指导下共同阅读并同意本隐私政策。",
                                  ),
                                  i(
                                    "strong",
                                    null,
                                    "若您是未满14周岁的未成年人的监护人，在使用DICloak及相关服务前，应为您的被监护人阅读并同意本隐私政策。",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "若您是未成年人的监护人，当您对您所监护的未成年人的个人信息有其他疑问时，请通过公司本隐私政策公示的联系方式与我们联系。",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [i("strong", null, "八、隐私政策的变更和修订")],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  i(
                                    "strong",
                                    null,
                                    "为了给您提供更好的服务，DICloak及相关服务将不时更新与变化，我们会适时对本隐私政策进行修订，",
                                  ),
                                  s(
                                    "这些修订构成本隐私政策的一部分并具有等同于本隐私政策的效力，未经您明确同意，我们不会削减您依据当前生效的本隐私政策所应享受的权利。 ",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  s(" 本隐私政策更新后，我们"),
                                  i(
                                    "strong",
                                    null,
                                    "会在DICloak发出更新版本，并通过系统公告、通知或其他我们认为恰当之方式进行提醒您。您在使用DICloak及相关服务时，应当及时查阅了解修改的内容，以便您及时了解本隐私政策的最新版本。",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [i("strong", null, "九、如何联系我们")],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " 如果您对我们的隐私政策及对您个人/企业信息的处理有任何疑问、意见、建议或投诉，请通过官方网站https://www.dicloak.com/与我们联系，我们一般会在15天内对您的反馈作出答复。 ",
                                -1,
                              ),
                              i("p", null, [i("strong", null, "附录")], -1),
                              i(
                                "p",
                                null,
                                "DICloak Technology Limited授权在DICloak中接入的SDK详情",
                                -1,
                              ),
                            ])),
                        ]))
                      : (a(),
                        r("div", h, [
                          ...(o[2] ||
                            (o[2] = [
                              i("div", null, "Last updated: May 7, 2024", -1),
                              i(
                                "p",
                                null,
                                " This is the Privacy Policy of DICloak (“DICloak”). This policy applies to all DICloak software applications, websites and related services. ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " As a general rule, users of our software applications and services are anonymous to us, and we have no feasible ways to identify you. However certain categories of data may be collected while using our applications and services, and some of this information may be considered “personal data” by the law. When we collect personal data, we generally act as a “data controller” as defined in applicable law. The exact categories of data we collect, why we collect it, and your opt-out choices depend on the application or service you use, as is more fully described below. ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "When we post changes to this Privacy Policy, we will include the date when this Policy was last updated.",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  i(
                                    "strong",
                                    null,
                                    "How DICloak Collects Information",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "DICloak may use the following different methods to receive and collect your information:",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " 1. Account registration. When registering a DICloak account, the system will ask you to provide information so that we can record you as the owner of the DICloak product, which will help us provide you with services and information. ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  s(
                                    " 2. Product use, when you visit our website or log in to the DICloak client, we will need enough information to complete your operation, and our server will automatically collect and aggregate information about your visit. ",
                                  ),
                                  i(
                                    "strong",
                                    null,
                                    "The collected information may include the information of the login person's DICloak account, access IP, operating system, browser type, etc.",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " 3. Customer support, you can call or contact us through WeChat, Telegram and other communication channels to request technical assistance on products or information about our products, personal or account information that may be provided to us. ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  i(
                                    "strong",
                                    null,
                                    "Promotion and Marketing Activities",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  s(
                                    " If you decide to provide feedback to DICloak or participate in a promotional campaign, contest, or survey, organized by DICloak or our partners on behalf of DICloak, ",
                                  ),
                                  i(
                                    "strong",
                                    null,
                                    "we may ask for information such as your name, age, phone number, email or postal address.",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  i(
                                    "strong",
                                    null,
                                    "If you agree to receive marketing information from DICloak via email, SMS, or push notifications, we may use third-party technology providers to deliver such messages to you. You can opt-out directly from a marketing email you receive.",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  s(
                                    " If you submit your phone number or email address on an application download page, ",
                                  ),
                                  i(
                                    "strong",
                                    null,
                                    "we may send you a download link or promotional materials via SMS or email for your convenience.",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " We will use this data only to provide the services you have requested and will not retain your data any longer than necessary to fulfill that specific purpose. If you’re not comfortable with us using submitted data for a limited purpose, then don’t provide it to us. ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  i(
                                    "strong",
                                    null,
                                    "WILL YOUR INFORMATION BE SHARED WITH ANYONE",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "We may process or share your data that we hold based on the following legal basis:",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "Consent: We may process your data if you have given us specific consent to use your personal information for a specific purpose.",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "Legitimate Interests: We may process your data when it is reasonably necessary to achieve our legitimate business interests.",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " Performance of a Contract: Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract. ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " Legal Obligations: We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal processes, such as in response to a court order or a subpoena (including in response to public authorities to meet national security or law enforcement requirements). ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " Vital Interests: We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities, or as evidence in litigation in which we are involved. ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "More specifically, we may need to process your data or share your personal information in the following situations:",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company. ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  i(
                                    "strong",
                                    null,
                                    "HOW DO WE KEEP YOUR INFORMATION SAFE",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Website is at your own risk. You should only access the Website within a secure environment. ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [
                                  i(
                                    "strong",
                                    null,
                                    "Purpose of Information Collected by DICloak",
                                  ),
                                ],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "We use this information for certain legitimate business purposes, namely:",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "1.To provide users with subscription services.",
                                -1,
                              ),
                              i("p", null, "2.To process the payment.", -1),
                              i(
                                "p",
                                null,
                                "3.To notify users about any upgrades, service reminders, promotions or other information that user may be interested in.",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " 4.To respond to users' inquiries, and constantly strive to improve our website, products and services based on users' information and feedback. ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "5.For IP positioning and anti-fraud.",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " 6.To identify the identity of the owner of the user account, and use it to accurately track the user account, and assist the technical staff in analyzing and handling the problems that the user may encounter. ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " 7.We attach great importance to protecting user data and protecting user privacy. Without the user's permission, we will never publish any information to other parties, and we will not sell users’ data. ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "8.To understand better how people interact with our applications and services.",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "9.To enhance, modify, customize or otherwise improve our applications and services.",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "10.To prevent security breaches and abuse.",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " In short, this information helps us to improve our products and services. We have no practical way to use this information to identify you personally. We may store this usage data for up to three years. ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [i("strong", null, "Children’s Privacy")],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                " There are no guarantees that children cannot enter our websites or use our applications without parental consent or notification. Therefore, and as provided in our Terms of Use, we require children to include their parents in the download process, and we encourage parents to read this Privacy Policy before allowing their children to use our applications and services. ",
                                -1,
                              ),
                              i("p", null, [i("strong", null, "UPDATE")], -1),
                              i(
                                "p",
                                null,
                                " We may update this privacy notice from time to time. The updated version will be effective as soon as it is accessible.We encourage you to review this privacy notice frequently to be informed of how we are protecting your information. ",
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                [i("strong", null, "CONTACT US ")],
                                -1,
                              ),
                              i(
                                "p",
                                null,
                                "If you have questions or comments about this notice, you may email us at business@dicloak.com.",
                                -1,
                              ),
                            ])),
                        ])),
                  ]),
                  _: 1,
                },
                8,
                ["modelValue", "title"],
              )
            );
          }
        );
      },
    }),
    [["__scopeId", "data-v-4b978d05"]],
  );
export { y as default };
