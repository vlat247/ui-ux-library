import type { DiscoveryEntry, DiscoverySection } from "./types";

export interface DiscoveryQuery {
  section: DiscoverySection;
  q: string;
  category: string;
  type: string;
  sort: "curated" | "recent";
  saved: boolean;
}

export function parseQuery(params: URLSearchParams): DiscoveryQuery {
  return {
    section: params.get("section") === "sites" ? "sites" : "inspiration",
    q: (params.get("q") ?? "").slice(0, 200),
    category: (params.get("category") ?? "all").slice(0, 60),
    type: ["video", "design", "interactive"].includes(params.get("type") ?? "")
      ? params.get("type")! : "all",
    sort: params.get("sort") === "recent" ? "recent" : "curated",
    saved: params.get("saved") === "1",
  };
}

export function queryString(query: DiscoveryQuery): string {
  const params = new URLSearchParams();
  params.set("section", query.section);
  if (query.q) params.set("q", query.q);
  if (query.category !== "all") params.set("category", query.category);
  if (query.type !== "all" && query.section === "inspiration") params.set("type", query.type);
  if (query.sort !== "curated") params.set("sort", query.sort);
  if (query.saved) params.set("saved", "1");
  return `?${params}`;
}

export function filterEntries(entries: readonly DiscoveryEntry[], query: DiscoveryQuery, savedIds: readonly string[]): DiscoveryEntry[] {
  const terms = query.q.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return entries.filter((entry) => {
    if (entry.section !== query.section) return false;
    if (query.category !== "all" && entry.category !== query.category) return false;
    if (query.section === "inspiration" && query.type !== "all" && entry.kind !== query.type) return false;
    if (query.saved && !savedIds.includes(entry.id)) return false;
    const text = [entry.title, entry.description, entry.sourceLabel, entry.sourceUrl, entry.creator ?? "", ...entry.tags].join(" ").toLocaleLowerCase();
    return terms.every((term) => text.includes(term));
  }).sort((a, b) => query.sort === "recent"
    ? b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id)
    : a.curatedOrder - b.curatedOrder || a.id.localeCompare(b.id));
}
