export type DiscoverySection = "inspiration" | "sites";
export type EntryKind = "design" | "video" | "interactive" | "website";
export type PreviewArt = "orbit" | "ribbon" | "type" | "mesh" | "grid" | "stack";

export interface DiscoveryEntry {
  id: string;
  slug: string;
  title: string;
  description: string;
  section: DiscoverySection;
  kind: EntryKind;
  category: string;
  tags: string[];
  sourceUrl: string;
  sourceLabel: string;
  creator?: string;
  creatorUrl?: string;
  previewImage?: string;
  previewVideo?: string;
  art: PreviewArt;
  color: string;
  publishedAt: string;
  curatedOrder: number;
  original?: boolean;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

export interface Submission {
  id: string;
  title: string;
  url: string;
  description: string;
  section: DiscoverySection;
  category: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  userId: string;
  userName?: string;
  userEmail?: string;
}
