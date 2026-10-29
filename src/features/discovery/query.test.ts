import { strict as assert } from "node:assert";
import { test } from "node:test";
import { filterEntries, parseQuery, queryString } from "./query";
import type { DiscoveryEntry } from "./types";

const entry = (id: string, overrides: Partial<DiscoveryEntry> = {}): DiscoveryEntry => ({
  id, slug: id, title: id, description: "Expressive typography and motion", section: "inspiration",
  kind: "video", category: "Motion", tags: ["kinetic"], sourceUrl: "https://example.com", sourceLabel: "Example",
  art: "type", color: "#cc88ff", publishedAt: "2026-10-29", curatedOrder: 0, ...overrides,
});

test("search combines category, type, favorites, and all search terms", () => {
  const entries = [entry("wanted"), entry("unsaved"), entry("other", { kind: "design" }), entry("site", { section: "sites" })];
  const query = parseQuery(new URLSearchParams("q=kinetic+example.com&category=Motion&type=video&saved=1"));
  assert.deepEqual(filterEntries(entries, query, ["wanted", "other", "site"]).map((item) => item.id), ["wanted"]);
  assert.deepEqual(filterEntries(entries, query, []), []);
});

test("curated and recent ordering remain deterministic", () => {
  const entries = [entry("b", { curatedOrder: 2 }), entry("a", { curatedOrder: 1, publishedAt: "2026-10-28" }), entry("c", { curatedOrder: 2 })];
  const query = parseQuery(new URLSearchParams());
  assert.deepEqual(filterEntries(entries, query, []).map((item) => item.id), ["a", "b", "c"]);
  assert.deepEqual(filterEntries(entries, { ...query, sort: "recent" }, []).map((item) => item.id), ["b", "c", "a"]);
});

test("query parsing constrains unknown values and preserves valid shareable state", () => {
  const invalid = parseQuery(new URLSearchParams("section=admin&type=unknown&sort=popular&saved=true"));
  assert.equal(invalid.section, "inspiration");
  assert.equal(invalid.type, "all");
  assert.equal(invalid.sort, "curated");
  assert.equal(invalid.saved, false);
  const query = parseQuery(new URLSearchParams("section=sites&q=fonts&category=Typography&saved=1&sort=recent"));
  assert.deepEqual(parseQuery(new URLSearchParams(queryString(query))), query);
});
