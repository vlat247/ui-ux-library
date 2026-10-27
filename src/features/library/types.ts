/** Initial metadata contract; export formats and agent delivery are still open. */
export type LibraryItemKind = "gradient" | "shader" | "design-preset";

/** Serializable metadata only. Keep rendering code in src/registry. */
export interface LibraryItem {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly kind: LibraryItemKind;
  readonly tags: readonly string[];
}
