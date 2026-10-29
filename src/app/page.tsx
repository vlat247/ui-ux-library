import { seedEntries } from "@/content/entries";
import { DiscoveryApp } from "@/features/discovery/discovery-app";
import { parseQuery } from "@/features/discovery/query";

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (typeof value === "string") query.set(key, value);
  return <DiscoveryApp initialEntries={seedEntries} initialQuery={parseQuery(query)} />;
}
