import type { Lang } from "@/lib/i18n";

type L = Record<Lang, string>;
export type NavChild = { slug: string; label: L; summary: string };
export type NavSection = { slug: string; label: L; lead: string; children: NavChild[] };

export const NAV: NavSection[] = [
  { slug: "about", label: { en: "About OAG", fr: "À propos du BVG", pt: "Sobre o GAG" }, lead: "OAG is an independent assurance office supporting accountability, good corporate governance and value for money across ECOWAS Institutions.", children: [
    { slug: "mandate", label: { en: "Mandate", fr: "Mandat", pt: "Mandato" }, summary: "The Office’s mandate and institutional basis." },
    { slug: "role-responsibilities", label: { en: "Role and responsibilities", fr: "Rôle et responsabilités", pt: "Papel e responsabilidades" }, summary: "The Office’s role, responsibilities and scope." },
    { slug: "leadership", label: { en: "Leadership", fr: "Direction", pt: "Liderança" }, summary: "Leadership profiles and related publications." },
    { slug: "strategy", label: { en: "Strategic plan", fr: "Plan stratégique", pt: "Plano estratégico" }, summary: "Priorities and outcomes for the current cycle." },
    { slug: "organizational-structure", label: { en: "Organizational structure", fr: "Structure organisationnelle", pt: "Estrutura organizacional" }, summary: "An interactive view of the Office’s structure." },
    { slug: "audit-approach", label: { en: "Audit approach", fr: "Approche d’audit", pt: "Abordagem de auditoria" }, summary: "The audit journey from planning to closure." },
    { slug: "governance", label: { en: "Governance", fr: "Gouvernance", pt: "Governação" }, summary: "Governance arrangements and institutional documents." },
    { slug: "contact", label: { en: "Contact", fr: "Contact", pt: "Contacto" }, summary: "Contact channels for the Office." },
  ] },
  { slug: "audit", label: { en: "Audit & Assurance", fr: "Audit et assurance", pt: "Auditoria e garantia" }, lead: "Financial, compliance and performance audits that strengthen institutional accountability.", children: [
    { slug: "programme", label: { en: "Audit programme", fr: "Programme d’audit", pt: "Programa de auditoria" }, summary: "Planned and ongoing engagements by institution." },
    { slug: "recommendations", label: { en: "Recommendations", fr: "Recommandations", pt: "Recomendações" }, summary: "Follow-up and implementation status." },
    { slug: "methodology", label: { en: "Methodology", fr: "Méthodologie", pt: "Metodologia" }, summary: "Standards and professional practice we apply." },
  ] },
  { slug: "transparency", label: { en: "Transparency", fr: "Transparence", pt: "Transparência" }, lead: "Open information on findings, implementation progress and institutional performance.", children: [
    { slug: "dashboard", label: { en: "Transparency dashboard", fr: "Tableau de transparence", pt: "Painel de transparência" }, summary: "Key public indicators at a glance." },
    { slug: "activity", label: { en: "Audit activity", fr: "Activité d’audit", pt: "Atividade de auditoria" }, summary: "Audit volume, types and recurring themes." },
    { slug: "recommendations", label: { en: "Recommendations", fr: "Recommandations", pt: "Recomendações" }, summary: "How recommendations are progressing." },
    { slug: "institutions", label: { en: "Institutional coverage", fr: "Couverture institutionnelle", pt: "Cobertura institucional" }, summary: "Published audit information by institution." },
    { slug: "map", label: { en: "ECOWAS audit map", fr: "Carte d’audit CEDEAO", pt: "Mapa de auditoria CEDEAO" }, summary: "Audit activity across Member States." },
  ] },
  { slug: "publications", label: { en: "Publications", fr: "Publications", pt: "Publicações" }, lead: "Audit reports, annual reports and guidance from the Office.", children: [
    { slug: "reports", label: { en: "Audit reports", fr: "Rapports d’audit", pt: "Relatórios de auditoria" }, summary: "Final reports by year and institution." },
    { slug: "annual", label: { en: "Annual reports", fr: "Rapports annuels", pt: "Relatórios anuais" }, summary: "The Office’s yearly account of its work." },
  ] },
  { slug: "knowledge", label: { en: "Knowledge", fr: "Savoirs", pt: "Conhecimento" }, lead: "Insights, guidance and learning resources on public-sector audit.", children: [
    { slug: "insights", label: { en: "Insights", fr: "Analyses", pt: "Análises" }, summary: "Themes and lessons drawn from audit work." },
  ] },
  { slug: "news", label: { en: "News & Media", fr: "Actualités et médias", pt: "Notícias e media" }, lead: "Approved announcements, statements, speeches, events and media from the Office.", children: [
    { slug: "latest", label: { en: "Latest", fr: "Dernières", pt: "Recentes" }, summary: "The most recent approved OAG news." },
    { slug: "press-releases", label: { en: "Press releases", fr: "Communiqués", pt: "Comunicados" }, summary: "Official announcements." },
    { slug: "statements", label: { en: "Statements", fr: "Déclarations", pt: "Declarações" }, summary: "Formal statements of the Office." },
    { slug: "speeches", label: { en: "Speeches", fr: "Discours", pt: "Discursos" }, summary: "Remarks by OAG leadership." },
    { slug: "events", label: { en: "Events", fr: "Événements", pt: "Eventos" }, summary: "Upcoming and past events." },
    { slug: "photos", label: { en: "Photos", fr: "Photos", pt: "Fotos" }, summary: "Approved photo galleries." },
    { slug: "videos", label: { en: "Videos", fr: "Vidéos", pt: "Vídeos" }, summary: "Approved video content." },
    { slug: "resources", label: { en: "Media resources", fr: "Ressources médias", pt: "Recursos de media" }, summary: "Logos and press materials." },
    { slug: "newsletter", label: { en: "Newsletter", fr: "Lettre d’information", pt: "Boletim" }, summary: "Newsletter availability." },
    { slug: "archive", label: { en: "Archive", fr: "Archives", pt: "Arquivo" }, summary: "Browse past news by year." },
  ] },
  { slug: "opportunities", label: { en: "Opportunities", fr: "Opportunités", pt: "Oportunidades" }, lead: "Careers, procurement notices and partnerships.", children: [
    { slug: "careers", label: { en: "Careers", fr: "Carrières", pt: "Carreiras" }, summary: "Open roles and internships." },
    { slug: "procurement", label: { en: "Procurement", fr: "Marchés publics", pt: "Aquisições" }, summary: "Tenders and expressions of interest." },
  ] },
  { slug: "integrityline", label: { en: "IntegrityLine", fr: "IntegrityLine", pt: "IntegrityLine" }, lead: "A confidential channel to report concerns about fraud, waste or misconduct.", children: [
    { slug: "report", label: { en: "Make a report", fr: "Faire un signalement", pt: "Fazer uma denúncia" }, summary: "Submit a concern securely and confidentially." },
    { slug: "track", label: { en: "Track a report", fr: "Suivre un signalement", pt: "Acompanhar denúncia" }, summary: "Check status and message investigators." },
    { slug: "protection", label: { en: "Whistleblower protection", fr: "Protection des lanceurs d’alerte", pt: "Proteção de denunciantes" }, summary: "How your identity and rights are protected." },
  ] },
];

/** Primary navigation excludes destinations already in the utility bar (Opportunities, Contact, ECOWAS Institutions). */
export const MAIN_NAV = NAV.filter((s) => s.slug !== "opportunities");

export const STANDALONE: Record<string, { title: string; lead: string }> = {
  contact: { title: "Contact", lead: "Reach the Office of the Auditor General of ECOWAS Institutions." },
  privacy: { title: "Privacy", lead: "How we collect, use and protect personal information." },
  accessibility: { title: "Accessibility", lead: "Our commitment to WCAG 2.2 AA and how to request support." },
  terms: { title: "Terms of use", lead: "Conditions for using this website and its content." },
};

export const UI: Record<Lang, { search: string; menu: string; close: string; skip: string; home: string; utility: [string, string][] }> = {
  en: { search: "Search", menu: "Menu", close: "Close", skip: "Skip to content", home: "Home", utility: [["ECOWAS Institutions", "/institutions"], ["Opportunities", "/opportunities"], ["Contact", "/contact"]] },
  fr: { search: "Rechercher", menu: "Menu", close: "Fermer", skip: "Aller au contenu", home: "Accueil", utility: [["Institutions de la CEDEAO", "/institutions"], ["Opportunités", "/opportunities"], ["Contact", "/contact"]] },
  pt: { search: "Pesquisar", menu: "Menu", close: "Fechar", skip: "Ir para o conteúdo", home: "Início", utility: [["Instituições da CEDEAO", "/institutions"], ["Oportunidades", "/opportunities"], ["Contacto", "/contact"]] },
};

export const SEARCH_CATEGORIES = ["All", "Audits", "Reports", "Recommendations", "Institutions", "Publications", "News", "Opportunities", "Knowledge"] as const;
export type SearchCategory = (typeof SEARCH_CATEGORIES)[number];
export type SearchItem = { title: string; category: Exclude<SearchCategory, "All">; meta: string; href: string };

/* Sample index, to be replaced by the connected search service. */
export const SEARCH_INDEX: SearchItem[] = [
  { title: "Financial audit of the ECOWAS Commission, 2025", category: "Audits", meta: "OAG/FA/2025/014 · Completed", href: "/audit/programme" },
  { title: "Performance audit: regional health procurement", category: "Audits", meta: "OAG/PA/2025/006 · In progress", href: "/audit/programme" },
  { title: "Annual Report of the Auditor General 2025", category: "Reports", meta: "PDF · 3.2 MB", href: "/publications/annual" },
  { title: "Compliance report: ECOWAS Bank for Investment and Development", category: "Reports", meta: "PDF · 1.8 MB", href: "/publications/reports" },
  { title: "Strengthen asset register reconciliation", category: "Recommendations", meta: "Partially implemented · Commission", href: "/audit/recommendations" },
  { title: "Formalise procurement approval thresholds", category: "Recommendations", meta: "Implemented · WAHO", href: "/audit/recommendations" },
  { title: "ECOWAS Court of Justice", category: "Institutions", meta: "Abuja, Nigeria", href: "/transparency/institutions" },
  { title: "West African Health Organisation (WAHO)", category: "Institutions", meta: "Bobo-Dioulasso, Burkina Faso", href: "/transparency/institutions" },
  { title: "Guide to audit follow-up for institutions", category: "Publications", meta: "Guidance · 2025", href: "/publications/reports" },
  { title: "News & Media newsroom", category: "News", meta: "OAG newsroom", href: "/news" },
  { title: "Careers at the OAG", category: "Opportunities", meta: "Professional opportunities", href: "/opportunities/careers" },
  { title: "Call for tenders: audit analytics platform", category: "Opportunities", meta: "Procurement · Open", href: "/opportunities/procurement" },
  { title: "Five lessons from three years of recommendation tracking", category: "Knowledge", meta: "Insight · 8 min read", href: "/knowledge/insights" },
];

export const POPULAR_SEARCHES = ["Annual report 2025", "Recommendations status", "Procurement notices", "IntegrityLine"];

export const ECOWAS_LINKS: [string, string][] = [
  ["ECOWAS Commission", "https://ecowas.int"],
  ["ECOWAS Parliament", "https://parl.ecowas.int"],
  ["ECOWAS Court of Justice", "https://www.courtecowas.org"],
  ["West African Health Organisation", "https://www.wahooas.org"],
];
