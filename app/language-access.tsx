"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Locale = "en" | "es" | "zh" | "vi" | "tl" | "ar";
const languages: Array<[Locale, string]> = [
  ["en", "English"],
  ["es", "Español"],
  ["zh", "中文"],
  ["vi", "Tiếng Việt"],
  ["tl", "Tagalog"],
  ["ar", "العربية"],
];
const copy: Record<Locale, Record<string, string>> = {
  en: {},
  es: {
    language: "Idioma", close: "Cerrar", interpreter: "Solicitar un intérprete",
    welcome: "BIENVENIDO A NeighborWell", start: "Comience con lo que necesita hoy.",
    intro: "No necesita saber el nombre de un programa ni completar una solicitud larga. NeighborWell le ayuda a comprender sus opciones, elegir el próximo paso y mantener el control de su información.",
    find: "Encontrar posible apoyo →", example: "Ver una situación de ejemplo",
    noAccount: "No se requiere una cuenta para esta primera revisión · Aproximadamente 3 minutos",
    yours: "Su historia le pertenece.", private: "Sus respuestas permanecen privadas durante esta revisión. NeighborWell pedirá permiso antes de crear un registro o compartir información.",
    talk: "Hablar con una persona →", matters: "Díganos qué es importante", mattersText: "Seleccione sus necesidades o use sus propias palabras.",
    matches: "Revise las posibles opciones", matchesText: "Vea por qué cada opción podría servirle.",
    choose: "Elija qué sucede", chooseText: "Nada continúa sin su autorización.",
    urgent: "¿Necesita ayuda urgente o prefiere no usar un formulario?", human: "Contactar apoyo humano",
    help: "¿Con qué le gustaría recibir ayuda?", select: "Seleccione todas las áreas importantes. Esto no es una decisión de elegibilidad.", back: "← Atrás",
  },
  zh: {
    language: "语言", close: "关闭", interpreter: "申请口译员", welcome: "欢迎使用 NeighborWell",
    start: "从您今天需要的帮助开始。", intro: "您无需知道项目名称，也不必填写冗长申请。NeighborWell 帮助您了解选择、决定下一步，并掌控自己的信息。",
    find: "查找可能的支持 →", example: "查看示例情况", noAccount: "首次查询无需账户 · 大约 3 分钟",
    yours: "您的故事由您掌控。", private: "本次查询期间，您的回答将保持私密。NeighborWell 在建立记录或分享任何信息前会征得您的同意。",
    talk: "与工作人员交谈 →", matters: "告诉我们什么最重要", mattersText: "选择需求或用您自己的话说明。",
    matches: "查看可能匹配的服务", matchesText: "了解每个选项可能适合您的原因。", choose: "决定接下来做什么", chooseText: "未经您同意，不会继续任何操作。",
    urgent: "需要紧急帮助或不想填写表格？", human: "联系人工支持", help: "您希望在哪些方面获得帮助？", select: "请选择所有相关领域。这不是资格决定。", back: "← 返回",
  },
  vi: {
    language: "Ngôn ngữ", close: "Đóng", interpreter: "Yêu cầu thông dịch viên", welcome: "CHÀO MỪNG ĐẾN NeighborWell",
    start: "Bắt đầu với điều quý vị cần hôm nay.", intro: "Quý vị không cần biết tên chương trình hoặc điền đơn dài. NeighborWell giúp quý vị hiểu các lựa chọn, chọn bước tiếp theo và kiểm soát thông tin của mình.",
    find: "Tìm hỗ trợ phù hợp →", example: "Xem tình huống mẫu", noAccount: "Không cần tài khoản cho lần kiểm tra đầu tiên · Khoảng 3 phút",
    yours: "Câu chuyện của quý vị thuộc về quý vị.", private: "Câu trả lời được giữ riêng tư trong lần kiểm tra này. NeighborWell sẽ xin phép trước khi tạo hồ sơ hoặc chia sẻ thông tin.",
    talk: "Nói chuyện với một người →", matters: "Cho chúng tôi biết điều quan trọng", mattersText: "Chọn nhu cầu hoặc dùng lời của quý vị.", matches: "Xem các lựa chọn phù hợp", matchesText: "Xem lý do mỗi lựa chọn có thể phù hợp.", choose: "Chọn điều sẽ xảy ra", chooseText: "Không có gì tiếp tục nếu chưa có sự đồng ý của quý vị.", urgent: "Cần trợ giúp khẩn cấp hoặc không muốn dùng biểu mẫu?", human: "Liên hệ hỗ trợ trực tiếp", help: "Quý vị muốn được giúp về điều gì?", select: "Chọn tất cả lĩnh vực quan trọng. Đây không phải quyết định đủ điều kiện.", back: "← Quay lại",
  },
  tl: {
    language: "Wika", close: "Isara", interpreter: "Humiling ng interpreter", welcome: "MALIGAYANG PAGDATING SA NeighborWell",
    start: "Magsimula sa kailangan mo ngayon.", intro: "Hindi mo kailangang malaman ang pangalan ng programa o punan ang mahabang aplikasyon. Tutulungan ka ng NeighborWell na maunawaan ang mga pagpipilian, pumili ng susunod na hakbang, at kontrolin ang iyong impormasyon.",
    find: "Maghanap ng posibleng suporta →", example: "Tingnan ang halimbawang sitwasyon", noAccount: "Walang account na kailangan sa unang pagsusuri · Mga 3 minuto",
    yours: "Sa iyo ang iyong kuwento.", private: "Mananatiling pribado ang iyong mga sagot. Hihingi muna ng pahintulot ang NeighborWell bago gumawa ng rekord o magbahagi.", talk: "Makipag-usap sa isang tao →", matters: "Sabihin kung ano ang mahalaga", mattersText: "Pumili ng pangangailangan o gumamit ng sariling salita.", matches: "Suriin ang posibleng tugma", matchesText: "Tingnan kung bakit maaaring angkop ang bawat opsyon.", choose: "Piliin ang mangyayari", chooseText: "Walang magpapatuloy nang wala ka.", urgent: "Kailangan ng agarang tulong o ayaw gumamit ng form?", human: "Makipag-ugnayan sa taong tutulong", help: "Saan mo gustong humingi ng tulong?", select: "Piliin ang lahat ng mahalaga. Hindi ito desisyon sa pagiging kwalipikado.", back: "← Bumalik",
  },
  ar: {
    language: "اللغة", close: "إغلاق", interpreter: "طلب مترجم", welcome: "مرحبًا بك في NeighborWell",
    start: "ابدأ بما تحتاج إليه اليوم.", intro: "لا تحتاج إلى معرفة اسم البرنامج أو إكمال طلب طويل. تساعدك NeighborWell على فهم الخيارات واختيار الخطوة التالية والتحكم في معلوماتك.",
    find: "البحث عن دعم محتمل ←", example: "عرض مثال", noAccount: "لا يلزم حساب لهذا الفحص الأول · نحو 3 دقائق",
    yours: "قصتك ملك لك.", private: "تبقى إجاباتك خاصة خلال هذا الفحص. ستطلب NeighborWell إذنك قبل إنشاء سجل أو مشاركة أي معلومات.", talk: "التحدث مع شخص ←", matters: "أخبرنا بما يهمك", mattersText: "اختر احتياجاتك أو استخدم كلماتك الخاصة.", matches: "راجع الخيارات المحتملة", matchesText: "اعرف لماذا قد يناسبك كل خيار.", choose: "اختر ما سيحدث", chooseText: "لن يحدث شيء دون موافقتك.", urgent: "هل تحتاج إلى مساعدة عاجلة أو تفضل عدم استخدام نموذج؟", human: "الاتصال بالدعم البشري", help: "ما نوع المساعدة التي تريدها؟", select: "اختر كل المجالات المهمة. هذا ليس قرار أهلية.", back: "رجوع →",
  },
};

const LanguageContext = createContext({ locale: "en" as Locale, t: (key: string, fallback: string) => fallback });
export const useLanguage = () => useContext(LanguageContext);

export default function LanguageAccess({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const stored = window.localStorage.getItem("neighborwell-language") as Locale | null;
    const browser = navigator.language.split("-")[0] as Locale;
    const preferred = languages.some(([id]) => id === stored) ? stored! : languages.some(([id]) => id === browser) ? browser : "en";
    const timer = window.setTimeout(() => setLocale(preferred), 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("neighborwell-language", locale);
  }, [locale]);
  const t = (key: string, fallback: string) => copy[locale][key] ?? fallback;
  const chooseLocale = (id: Locale) => {
    setLocale(id);
    window.dispatchEvent(new CustomEvent("neighborwell-language-change", { detail: id }));
    setOpen(false);
  };
  return <LanguageContext.Provider value={{ locale, t }}>
    {children}
    <aside className={`language-access ${open ? "open" : ""}`} aria-label={t("language", "Language access")}>
      <button className="language-trigger" onClick={() => setOpen(!open)} aria-expanded={open}>文/Aa · {languages.find(([id]) => id === locale)?.[1]}</button>
      {open && <div className="language-panel">
        <header><b>{t("language", "Choose your language")}</b><button onClick={() => setOpen(false)} aria-label={t("close", "Close")}>×</button></header>
        <div>{languages.map(([id, label]) => <button key={id} lang={id} className={locale === id ? "active" : ""} onClick={() => chooseLocale(id)}>{label}{locale === id ? " ✓" : ""}</button>)}</div>
        <a className="interpreter" href="tel:211">{t("interpreter", "Request an interpreter")}</a>
        <small>Language preference does not change eligibility or consent.</small>
      </div>}
    </aside>
  </LanguageContext.Provider>;
}
