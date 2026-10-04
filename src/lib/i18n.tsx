import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "fr" | "pt";
export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "pt", label: "Português" },
];

const dict = {
  en: {
    org: "Office of the Auditor General",
    orgSub: "ECOWAS Institutions",
    heroOver: "Design System · Version 1.0",
    heroTitle: "Accountability, made legible.",
    heroLead: "The foundation for every digital touchpoint of the OAG — from public audit reports to internal intelligence dashboards. One language of type, colour, data and motion.",
    explore: "Explore components",
    principles: "Read the principles",
    nav: { about: "About", audits: "Audits", publications: "Publications", institutions: "Institutions", news: "News", contact: "Contact" },
    search: "Search reports, institutions, recommendations…",
  },
  fr: {
    org: "Bureau du Vérificateur Général",
    orgSub: "Institutions de la CEDEAO",
    heroOver: "Système de design · Version 1.0",
    heroTitle: "La redevabilité, rendue lisible.",
    heroLead: "Le socle de chaque point de contact numérique du BVG — des rapports d’audit publics aux tableaux de bord d’intelligence internes. Un seul langage de typographie, de couleur, de données et de mouvement.",
    explore: "Explorer les composants",
    principles: "Lire les principes",
    nav: { about: "À propos", audits: "Audits", publications: "Publications", institutions: "Institutions", news: "Actualités", contact: "Contact" },
    search: "Rechercher des rapports, institutions, recommandations…",
  },
  pt: {
    org: "Gabinete do Auditor-Geral",
    orgSub: "Instituições da CEDEAO",
    heroOver: "Sistema de design · Versão 1.0",
    heroTitle: "Responsabilização, tornada legível.",
    heroLead: "A base de cada ponto de contacto digital do GAG — dos relatórios de auditoria públicos aos painéis internos de inteligência. Uma única linguagem de tipografia, cor, dados e movimento.",
    explore: "Explorar componentes",
    principles: "Ler os princípios",
    nav: { about: "Sobre", audits: "Auditorias", publications: "Publicações", institutions: "Instituições", news: "Notícias", contact: "Contacto" },
    search: "Pesquisar relatórios, instituições, recomendações…",
  },
};

type Dict = typeof dict.en;
const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({ lang: "en", setLang: () => {}, t: dict.en });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  return <Ctx.Provider value={{ lang, setLang, t: dict[lang] }}>{children}</Ctx.Provider>;
}
export const useI18n = () => useContext(Ctx);
