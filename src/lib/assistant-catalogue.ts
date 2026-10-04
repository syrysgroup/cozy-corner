import { publicDocuments, type LibraryDoc } from "@/lib/library-data";

export type AssistantMatch = {
  document: LibraryDoc;
  section: LibraryDoc["sections"][number] | null;
  matchedIn: string;
};

/** Demo-only keyword lookup; it deliberately uses only the public catalogue export. */
export function searchAssistantCatalogue(query: string): AssistantMatch[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter((term) => term.length > 1);
  if (!terms.length) return [];

  return publicDocuments
    .map((document) => {
      const section = document.sections.find((item) => terms.some((term) => item.text.toLowerCase().includes(term)));
      const matchedIn = document.title.toLowerCase().includes(terms.find((term) => document.title.toLowerCase().includes(term)) ?? "")
        ? "Title"
        : document.ref.toLowerCase().includes(terms.find((term) => document.ref.toLowerCase().includes(term)) ?? "")
          ? "Reference"
          : section
            ? section.kind
            : document.topics.some((topic) => terms.some((term) => topic.toLowerCase().includes(term)))
              ? "Topic"
              : document.institution.toLowerCase().includes(terms.find((term) => document.institution.toLowerCase().includes(term)) ?? "")
                ? "Institution"
                : "Summary";
      const haystack = [document.title, document.ref, document.institution, document.summary, ...document.topics, ...document.sections.map((item) => item.text)].join(" ").toLowerCase();
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
      return { document, section, matchedIn, score };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || b.document.year - a.document.year)
    .slice(0, 5)
    .map(({ document, section, matchedIn }) => ({ document, section, matchedIn }));
}

export function isCitationList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}