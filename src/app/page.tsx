import { siteConfig } from "@/lib/site";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{siteConfig.name}</h1>
      <p className="mt-4 max-w-xl leading-7 text-muted">
        Shaders, reusable design presets, and curated inspiration for people
        and coding agents.
      </p>
      <p className="mt-8 border-t border-line pt-6 text-sm leading-6 text-muted">
        Project foundation. The interface and first collection will follow the
        product brief.
      </p>
    </main>
  );
}
