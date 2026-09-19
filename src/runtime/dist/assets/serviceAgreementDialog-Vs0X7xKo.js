import {
  d as e,
  G as o,
  r as l,
  h as n,
  w as t,
  o as a,
  c as r,
  a as s,
  e as i,
  C as u,
  i as c,
  _ as d,
} from "./index-BUIbb6Pa.js";
const p = { key: 0, class: "content" },
  h = { key: 1, class: "content" },
  g = d(
    e({
      __name: "serviceAgreementDialog",
      setup(e, { expose: d }) {
        const g = o(),
          y = u(() => g.language),
          m = c(!1);
        return (
          d({
            acceptParams: () => {
              m.value = !0;
            },
          }),
          (e, o) => {
            const u = l("el-dialog");
            return (
              a(),
              n(
                u,
                {
                  modelValue: m.value,
                  "onUpdate:modelValue": o[0] || (o[0] = (e) => (m.value = e)),
                  title: e.$t("register.serviceAgreement"),
                  width: "800px",
                  "align-center": !0,
                  class: "service-agreement-dialog",
                },
                {
                  default: t(() => [
                    "zh" === y.value
                      ? (a(),
                        r("div", p, [
                          ...(o[1] ||
                            (o[1] = [
                              s(
                                "div",
                                null,
                                "生效日期：【2024】年【05】月【07】日",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  i(
                                    " 本用户服务协议（以下简称“本协议）适用于DICloak服务提供者DICloak Technology Limited（以下称“我们”）以网站、软件客户端以及随技术发展出现的新形态向您提供的各项产品和服务。请您务必审慎阅读、充分理解本协议各条款，特别是免除或者限制有关责任的条款，并选择接受或不接受。限制、免责条款以加粗形式提示您注意。",
                                  ),
                                  s(
                                    "strong",
                                    null,
                                    "除非您阅读并接受本协议所有条款，否则请您不要下裁、安装或使用本软件及相关服务。您的点击同意、下裁、安装、使用、登录、等行为即视为您已阅读并同意本协议的约束。",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  i(
                                    " 您在法律上同意这些条款是具有约束力的规则（“条款”）。您还同意我们的隐私政策、Cookie政策、退款协议，并同意您有责任遵守任何应适用的当地法律，我们的隐私政策、退款协议以及其他协议构成本协议的一部分。我们可能会不时更改这些条款。如果这样做，我们会通过在网站上公布或向您发送电子邮件来通知您任何重大更改。这些条款的新版本不会追溯适用，我们会告诉您新版本条款确切的生效日期，并于发布时列于本协议首部。",
                                  ),
                                  s(
                                    "strong",
                                    null,
                                    "如果更改后仍继续使用DICloak软件及服务，则表示您接受新条款。",
                                  ),
                                  i(
                                    " 我们保留本协议未明确授予的任何和所有权利，包括但不限于系统的任何和所有权利。 ",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  s(
                                    "strong",
                                    null,
                                    "违反本协议任何条款将导致您的帐户被终止。",
                                  ),
                                  i(
                                    " 您同意自行承担使用DICloak软件及服务的风险。",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  s(
                                    "strong",
                                    null,
                                    "如您在签署和接受本协议之前或之后与我们签署了与本服务有关的协议（以下简称“线下协议”）且该线下协议仍然有效的，如线下协议与本协议约定有冲突之处，以线下协议的约定为准；如线下协议未涉及的内容，以本协议的约定为准。",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [s("strong", null, "1.账户条款")],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " 您必须年满18岁才能注册DICloak账户，或您的年龄必须足以在您居住的地方签订有约束力的合同。如果您未满18岁，则未经父母或监护人的同意（代表您同意您将遵守服务条款），您不能使用DICloak产品。 ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " 您需要注册方可使用DICloak，选择帐户名称并设置密码。您的信息将根据可适用的数据保护法以及我们的隐私政策进行收集和披露。所有用户在注册我们的网站或服务时都必须提供真实和准确的信息，请勿使用无效或他人的电子邮件。 ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " 我们保留验证所有用户信息并拒绝任何用户的权利。您应对帐户中的所有活动负责，并对密码保密。您同意将任何未经授权使用您的帐户或任何其他违反安全性的行为立即通知我们。对于他人在您知情或不知情的情况下使用您的密码或帐户给您造成的任何损失，DICloak不承担任何责任。 ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " 您不得将DICloak软件及服务用于任何非法或未经授权的目的。您在使用软件时，不得违反您所在司法管辖区的任何法律（包括但不限于版权法）及其他任何应适用的法律规定。 ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  i(
                                    " 为保障您的账户安全，也为了DICloak更好地为您提供服务，您同意DICloak在提供部分产品及服务之前，采用人脸识别核身验证功能对您的身份进行认证，用于验证操作人是否为账户持有者本人，通过人脸识别结果评估是否为您提供产品或服务。该功能由具有公信力的机构提供核验数据及技术支持。 ",
                                  ),
                                  s(
                                    "strong",
                                    null,
                                    " 您同意并授权DICloak获取、使用您在申请DICloak服务过程中所提供的个人信息（包括姓名、身份证号）及人脸影像数据，并提供给合法存有您信息的第三方合作机构进行比对核验，以核验您的身份。",
                                  ),
                                  i(
                                    "如您不同意本协议的任何内容，或者无法准确理解协议内容的解释，请不要进行后续操作。",
                                  ),
                                  s(
                                    "strong",
                                    null,
                                    "如您点击“确认”、“同意”、“接受”， 则表示您同意DICloak对您进行人脸识别验证。",
                                  ),
                                  i(
                                    " 您已明确知悉，人脸识别在现有技术层面仍存在局限性或不确定性，DICloak提供的识别结果仅供您参考使用，您基于人脸识别结果作出的其他决定或实施的其他行为与DICloak无关，DICloak亦不承担任何责任。 ",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [s("strong", null, "2.禁止行为")],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "您应当遵守任何应适用的法律法规的规定，不得利用DICloak的服务及账户实施包括但不限于以下行为，也不得为以下行为提供便利：",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（1）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一、损害国家荣誉和利益的；",
                                -1,
                              ),
                              s("p", null, "（2）宣扬邪教和封建迷信的；", -1),
                              s(
                                "p",
                                null,
                                "（3）散布谣言，扰乱社会秩序，破坏社会稳定的；",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（4）散布淫秽、色情、赌博、暴力、凶杀、恐怖、骚扰、低俗或者教唆犯罪的；",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（5）侮辱或者诽谤他人，侵害他人合法权益的；",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（6）侵害他人知识产权、商业秘密等合法权利的；",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（7）利用本软件虚构事实、隐瞒真相以误导、欺骗他人的；",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（8）实施博彩、赌博游戏等非法互联网活动的；",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（9）删除或者改变本软件上的所有权利管理电子信息；",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（10）故意避开或者破坏著作权人为保护本软件著作权而采取的技术措施；",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（11）违反国家规定，对计算机信息系统功能进行删除、修改、增加、干扰，造成计算机信息系统不能正常运行；",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（12）未经允许，进入计算机信息网络或者使用计算机信息网络资源；",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（13）未经允许，对计算机信息网络功能进行删除、修改或者增加的；",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（14）未经允许，对计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加；",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（15）破坏本软件系统或网站的正常运行，故意传播计算机病毒等破坏性程序；",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（16）以任何方式进行DICloak产品或乙方授权的管理用户下的子用户倒卖活动；",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（17）其他任何危害计算机信息网络安全的；",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（18）其他违反公序良俗或法律法规禁止的行为。",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " 您承诺，您不会使用任何类型的软件或设备（无论是手动还是自动的）来“爬行”或“蜘蛛化”DICloak的任何部分，也不会对DICloak的任何内容进行拆解或反向工程。 ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [s("strong", null, "3.费用条款")],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  i(
                                    " 请访问我们的付款政策页面，以了解我们的所有服务的价格和最新优惠。DICloak的某些功能是免费的，某些功能只能付费使用。",
                                  ),
                                  s(
                                    "strong",
                                    null,
                                    "如果您同意我们的付款政策并订购相关功能，则您承诺支付相关功能的费用。",
                                  ),
                                  i(
                                    " 所有服务的价格（包括但不限于软件的每月订购计划费用）可能会发生变化。 ",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  s(
                                    "strong",
                                    null,
                                    "我们保留随时或不定期更改或终止本服务（或其任何部分）的权利。DICloak无须就对本服务的任何修改、价格变动、暂停或终止对您或任何第三方承担任何责任。",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [s("strong", null, "4.退款政策")],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  s(
                                    "strong",
                                    null,
                                    "DICloak提供预先充值订阅套餐，同时任何付费服务均不提供退款。请注意，所有付款均为最终付款。",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [s("strong", null, "5.协议终止")],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  s(
                                    "strong",
                                    null,
                                    "本协议将自您接受本使用条款之日起生效，并且有效期为长期，直到任何一方将其终止。DICloak有权随时出于任何原因暂停或终止您的帐户或服务，可能导致您的帐户被停用或删除，或您对帐户的访问被限制，以及帐户中所有内容被删除或清除，DICloak将不承担任何赔偿责任。DICloak保留随时出于任何原因拒绝向任何人提供服务的权利。",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "您可以随时通过官网客服与我们联系，请注意，终止帐户后，可能会立即禁止访问我们网站或服务的某些部分。如有以下情况，我们有权与您终止本协议：",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（1） 您在使用我们的网站或服务时违反了任何适用法律；",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（2） 违反本协议或网站或服务的条款；",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（3） 我们认为您的任何行为在法律上损害我们的商业利益。",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [s("strong", null, "6.知识产权")],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " DICloak网站或产品中的所有的内容、设计、文本、图表、图像、标识、按钮、图标、界面、音频及视频以及以上内容的所有排列组合均为DICloak或其相应内容提供商的专属财产，受可适用的著作权法保护。网站所使用的所有软件为DICloak或其相应的软件供应商的财产，受可适用的著作权法保护和其他相关法律和条约保护。网站用户不得发送/上传任何侵犯他人著作权或其他知识产权的内容至本网站。 ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " DICloak网站或产品使用的所有商标、服务标识和商业名称（统称“标识”）均为DICloak独有。该等标识不得用于任何非DICloak的产品或服务，或任何导致消费者混淆、或以任何方式诋毁或败坏DICloak名声的其他产品或服务上。 ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [s("strong", null, "7.保密和反馈")],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  i(
                                    " 我们重视您的隐私，我们的隐私权政策已纳入本协议，请查看我们的隐私政策，以便您了解我们的隐私惯例。我们收集的所有信息均受我们的隐私政策的约束，通过使用网站或服务，",
                                  ),
                                  s(
                                    "strong",
                                    null,
                                    "您同意我们根据隐私政策对您的信息采取的所有措施。",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  i(
                                    " 您同意对机密信息保密，不得将其用于履行本协议以外的目的，也不得向第三方披露您知道的DICloak机密信息。",
                                  ),
                                  s(
                                    "strong",
                                    null,
                                    "您向我们提供的有关任何DICloak软件或服务的任何建议、信息、想法或反馈，包括但不限于您在使用软件或相关服务时发现的任何错误的报告文档（统称“反馈”），均将归公司所有。您同意在全球范围内将“反馈”中的所有权利，包括但不限于所有权和利益以及相关的知识产权无偿转让给DICloak，并同意协助我们完善和行使这些权利。",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [s("strong", null, "8.免责声明")],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " 我们建议您经常备份数据。您应始终有责任减轻损失。此软件不是容错软件，也不是设计用于或旨在用于任何需要保证安全性能或操作的危险环境中。DICloak不保证包含服务的网站或产品将是无错误的或无中断的，也不承诺该网站或服务或服务器不受任何有害组件的影响。DICloak不对提供的服务是准确，完整或有用的作任何陈述或保证。DICloak并不保证您在任何特定的司法管辖区均合法使用该网站或服务，并且我们特别声明不作任何此类保证。 ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  i(
                                    " 我们不会介入用户之间或用户与任何第三方之间有关使用服务的纠纷。 当您使用服务时，您承诺DICloak将免遭于与此类纠纷和服务有关的任何索赔和要求（不论已知或未知，可疑或意外，公开或未公开）。",
                                  ),
                                  s(
                                    "strong",
                                    null,
                                    "您将自行承担因使用DICloak网站或服务而招致的任何结果，您对因您行为而对任何一方造成的任何损害或损失负全责。",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " 任何使用、测试或评估DICloak的用户都应对DICloak的质量和性能自行承担全部风险。我们对任何形式的损害概不负责，包括但不限于因使用、执行或交付DICloak而造成的直接或间接损害，即使DICloak已被告知存在或可能造成这种损害。 ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  i(
                                    " 某些国家（地区）不允许限制或排除偶发或继发性损害的责任，因此上述限制或排除可能对您不适用。",
                                  ),
                                  s(
                                    "strong",
                                    null,
                                    "在任何情况下，我们的责任均不会超过您为DICloak支付的购买价格。无论您是否接受使用、评估或测试DICloak，上述免责声明和限制均适用。",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [s("strong", null, "9.违约处理")],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  s(
                                    "strong",
                                    null,
                                    " DICloak Technology Limited有权对您使用DICloak及相关服务的情况进行审查和监督。如您违反法律、法规、相关政策、本协议或其他服务条款规定，或经DICloak Technology Limited判断用户的账号数据异常，DICloak Technology Limited有权要求用户改正或直接视情况采取必要的措施（包括但不限于预先警示、拒绝发布、立即停止传输信息、删除内容或评论、短期禁止发布内容或评论、限制用户账号的部分或全部功能、限制/暂停/终止用户在DICloak及相关服务中的活动/权限、终止DICloak及相关服务的授权、强制离线、封停账号、更改或删除用户相关信息内容等），对于因此而造成您无法正常使用账号及相关服务、无法正常获取您账号内资产或其他权益等后果，DICloak Technology Limited不承担任何责任。DICloak Technology Limited有权公告处理结果，且有权根据实际情况决定是否恢复相关账号的使用。对涉嫌违反法律法规、涉嫌违法犯罪的行为，DICloak Technology Limited将保存有关记录，并有权依法向有关主管部门报告、配合有关主管部门调查、向公安机关报案等。对已删除内容，DICloak Technology Limited有权不予恢复。 ",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  s(
                                    "strong",
                                    null,
                                    " 因您违反法律、法规、相关政策、本协议或其他服务条款规定，引起第三方投诉或诉讼索赔的，DICloak Technology Limited有权在收到权利方或者相关方通知的情况下采取一切合法、合理地措施。针对第三方提出的全部权利主张，您应当自行处理并承担全部可能由此引起的法律责任。因您的违法、侵权或违约等行为导致DICloak Technology Limited及其关联方、控制公司、继承公司向任何第三方赔偿或遭受国家机关处罚的，您还应足额赔偿DICloak Technology Limited及其关联方、控制公司、继承公司因此遭受的全部直接和间接损失（包括但不限于经济损失、商誉损失、鉴定费、评估费、公证费、处罚费、律师费、仲裁费、诉讼费、保全费、担保费、差旅费、损害补偿费等费用）。 ",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [s("strong", null, "10.法律及管辖")],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  s(
                                    "strong",
                                    null,
                                    "本协议的成立、生效、履行、解释及争议的解决均应适用中华人民共和国（不包括香港、澳门、台湾地区）法律。若本协议之任何规定因与中华人民共和国的法律抵触而无效或不可执行，则这些条款应在不违反法律的前提下尽可能按照接近本协议原条文目的之原则进行解释和使用，且本协议其它规定仍应具有完整的效力及效果。",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  s(
                                    "strong",
                                    null,
                                    " 本协议签订地为中华人民共和国广东省广州市番禺区。若您与我们发生任何争议，双方应尽量友好协商解决，如协商不成，您同意将争议提交合同签订地人民法院进行诉讼。 ",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [s("strong", null, "11.其他规定")],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "本协议项下我们向您发出的所有通知，我们可按以下任一方式发出：",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（1）通过推送通知、邮件、官网公告等形式发出；",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "（2）向您注册时或者此后变更您信息时向我们提供的电子邮箱发送电子邮件（发出即视为送达）。",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " 如本协议中任何条款因任何原因被判定为完全或部分无效或不具有执行力的，该无效或不具有执行力的条款将被最接近原条款义务的一项有效并可执行的条款所替代，并且本协议的其余条款仍应有效并具有执行力。 ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " DICloak Technology Limited未能或延迟行使本协议规定的任何权利、权力或特权不应视为放弃行使，且任何单一或部分权利、权力或特权的行使不应排除权利、权力或特权的任何其他或进一步的行使或本协议项下任何其他权利、权力或特权的行使。 ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  s(
                                    "strong",
                                    null,
                                    " 您和DICloak Technology Limited均是独立的主体，在任何情况下本协议不构成DICloak Technology Limited及其关联公司对您的任何形式的明示或暗示担保或条件，双方之间亦不构成代理、合伙、合营或雇佣关系。 ",
                                  ),
                                ],
                                -1,
                              ),
                            ])),
                        ]))
                      : (a(),
                        r("div", h, [
                          ...(o[2] ||
                            (o[2] = [
                              s("div", null, "Last updated: May 7, 2024", -1),
                              s(
                                "p",
                                null,
                                [
                                  i(
                                    ' This Terms of Services of DICloak desktop applications and related services (hereinafter referred to as "DICloak", "we" or "us") are established by the user (hereinafter referred to as "you" or "user") and DICloak. ',
                                  ),
                                  s(
                                    "strong",
                                    null,
                                    "Your access, download, and use of any service provided by DICloak means that you have read, understood, and accepted all the terms and conditions stipulated in this Terms of Services, as well as our Privacy Policy. If you do not agree, please do not access DICloak or utilize DICloak services.",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [s("strong", null, "DICloak Services")],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " We provide you virtual browsers configuration file Services, including creating, managing, sharing, and using various browser configuration files in one or several devices, and controlling the browser and device fingerprints by the application. Services are further described on our website. ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " We reserve the right to limit the sales of our Services to anyone, geographic area, or jurisdiction at our discretion. We may exercise this right on a case-by-case basis. ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "We reserve the right to limit the quantities of any Services that we provide.",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "We guarantee the quality of our Services and do everything possible to meet your expectations.",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  s(
                                    "strong",
                                    null,
                                    "Eligibility and Acceptable Use",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " You must meet certain eligibility criteria to use DICloak’s Services. You can browse the DICloak website without registering an account. However, when registering an account, you must be at least 18 years old, or enough to sign a binding contract where you live. You are responsible for your account and all activities on it. To use the application, you need to register an account, select an account name, and set a password. When you do this, the information you provide to us must be accurate and complete. Please do not use invalid or other people’s emails, as this will reduce the security of your account. ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " When accessing or using our Services, you agree that you will not violate any laws or any or any contractual, intellectual property, or other third-party right or commit a tort and that you are solely responsible for all your conduct while using our Services. ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " Do not take any action that infringes or violates the rights of others, violates the law, or violates your contract or legal obligations to anyone; ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " Do not distribute unsolicited or unauthorized advertisements or promotional materials, or any spam or chain letters; do not run mailing lists, list Services, or any types of automatic response or spam emails on or through this site. ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " Do not harm other people's computers. Do not distribute software viruses or any other content (codes, movies, programs) designed to interfere with the normal functions of any software, hardware, or equipment (whether it belongs to Virtual multi login or another party) on the website. We need to ensure our site is secure and the system is operating normally, so don't do anything-most of it boils down to \"don't mess up our system\". ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "Do not try to interfere with the normal operation of the service.",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "Do not use other users' accounts without authorization.",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "Do not damage any system, data, password, or other information of",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " DICloak or other parties, or give unauthorized access to it.Do not take any measures that will impose an unreasonable burden on our infrastructure or third-party providers. (We reserve the right to determine a reasonable price, if you are not sure, please contact us via business@dicloak.com). ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                ' Do not use any type of software or device, whether manual or automatic)other automated tools or interfaces to "crawl" "spider" any part of the site or extract data; Do not disassemble or reverse engineer any aspect of the service to try to access the source code, underlying ideas, or algorithms. ',
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [s("strong", null, "Subscription Plans")],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                ' After installing the application and setting up an application account, you can choose a suitable standard subscription plan. The fees and features of each subscription plan are described on the "Pricing" page of our website at https://www.dicloak.com/pricing. ',
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [s("strong", null, "Renewal, Refund")],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  i(
                                    " Users can renew their subscription in the DICloak application. ",
                                  ),
                                  s(
                                    "strong",
                                    null,
                                    "When you purchase the plan, which means you agree to all our terms of service. If there is no special reason, we will not support any refund. DICloak reserves the right of final interpretation of the refund behavior.",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [s("strong", null, "Disclaimer")],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "The server cannot be accessed (used) or data is lost due to user arrears, non-renewal, or forgotten renewal.",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "The server cannot be accessed (used) or data is lost due to improper user operations or other related behaviors.",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "Inaccessible or data loss due to user's website content or user behavior in violation of the user obligations of this article.",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " Inaccessibility or data loss caused by force irresistible events or other disasters (including third-party distributed denial of service attacks, planned or unplanned maintenance). ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " Causes that are beyond our control and lead to a wide range of Internet transmission failures, such as disasters, man-made sabotage, war-induced telecommunication infrastructure failures, and large-scale network failures caused by hacker attacks. ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " We recommend that users regularly backup data for the sake of data security and the stable operation of the business.DICloak is not obliged to provide any backup data to users. ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  i(
                                    " We don’t oversee what users are using the Services for.DICloak isn’t liable for any damages or losses related to your use of the Services. We don’t become involved in disputes between users, or between users and any third party relating to the use of the Services. ",
                                  ),
                                  s(
                                    "strong",
                                    null,
                                    " When you use the Services, you release DICloak from claims, damages, and demands of every kind—known or unknown, suspected or unsuspected, disclosed or undisclosed—arising out of or in any way related to such disputes and the Services. All content you access through the Services is at your own risk. You’re solely responsible for any resulting damage or loss to any party.",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [s("strong", null, "Payment Method")],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                " We have a variety of options for you to choose to pay for the service. We accept Alipay, WeChat, and other online or local payment methods in some countries. ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  s(
                                    "strong",
                                    null,
                                    "Disclaimer of Third-party Websites",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  i(
                                    " Any links to third-party websites from DICloak Services do not imply endorsement by DICloak of any product, service, information, or disclaimer presented therein, nor does DICloak guarantee the accuracy of the information contained on them. ",
                                  ),
                                  s(
                                    "strong",
                                    null,
                                    "If you suffer loss from using such third-party products and services, DICloak will not be liable for such loss. In addition, since DICloak has no control over the terms of use or privacy policies of third-party websites, you should read and understand those policies carefully.",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [s("strong", null, "Privacy Policy")],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                "Please refer to our Privacy Policy for information about how we collect, use and disclose your personal data.",
                                -1,
                              ),
                              s("p", null, [s("strong", null, "Feedback")], -1),
                              s(
                                "p",
                                null,
                                [
                                  i(
                                    " DICloak owns any feedback, suggestions, ideas, or other information or materials (hereinafter collectively referred to as ”Feedback”) about DICloak or DICloak Services that you provide through email, DICloak Services, or other ways. ",
                                  ),
                                  s(
                                    "strong",
                                    null,
                                    "You hereby transfer all rights, ownership, and interests of the Feedback and all related intellectual property rights to DICloak. You have no right and hereby waive any request for acknowledgment or compensation based on any Feedback, or any modifications based on any Feedback.",
                                  ),
                                  i(
                                    " If the user wants to be paid for the feedback you provide or wants to continue to own or claim rights, then please do not send us feedback. ",
                                  ),
                                ],
                                -1,
                              ),
                              s("p", null, [s("strong", null, "Contacts")], -1),
                              s(
                                "p",
                                null,
                                " If you have questions regarding these Terms, please feel free to contact DICloak for clarification via our Customer Support team at business@dicloak.com. ",
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  s(
                                    "strong",
                                    null,
                                    "Change of this Terms of Use",
                                  ),
                                ],
                                -1,
                              ),
                              s(
                                "p",
                                null,
                                [
                                  i(
                                    " DICloak reserves the right to change the terms of service at any time. We encourage users to check this page frequently to keep abreast of the latest regulations. ",
                                  ),
                                  s(
                                    "strong",
                                    null,
                                    "You acknowledge and agree that it is your responsibility to review these Terms of Services regularly and be aware of changes.",
                                  ),
                                ],
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
    [["__scopeId", "data-v-25bd2bc6"]],
  );
export { g as default };
