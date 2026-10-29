"use client";

import {
  ArrowRightIcon, ArrowTopRightIcon, BookmarkFilledIcon, BookmarkIcon, CheckIcon,
  ChevronDownIcon, ChevronRightIcon, Cross2Icon, ExternalLinkIcon, GitHubLogoIcon,
  GlobeIcon, GridIcon, HeartIcon, Link2Icon, MagnifyingGlassIcon, MixerHorizontalIcon,
  PlusIcon, ResetIcon, VideoIcon,
} from "@radix-ui/react-icons";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Dialog } from "@/components/dialog";
import { AccountDialog, AuthDialog, SubmitDialog } from "@/features/account/dialogs";
import { EntryPreview } from "./preview";
import { filterEntries, parseQuery, queryString, type DiscoveryQuery } from "./query";
import type { CurrentUser, DiscoveryEntry, DiscoverySection } from "./types";

type Me = { user: CurrentUser | null; isOwner: boolean; googleEnabled: boolean };
type PendingAction = { kind: "save"; id: string } | { kind: "submit" } | { kind: "saved" } | null;
const kindLabels = { design: "Design", video: "Motion", interactive: "Interactive", website: "Resource" };
const intentKey = "library:auth-intent";

function takeAuthIntent(): PendingAction {
  try {
    const stored = sessionStorage.getItem(intentKey);
    sessionStorage.removeItem(intentKey);
    if (!stored) return null;
    const { action, createdAt } = JSON.parse(stored);
    if (typeof createdAt !== "number" || Date.now() - createdAt > 600_000) return null;
    if (action?.kind === "submit" || action?.kind === "saved") return { kind: action.kind };
    if (action?.kind === "save" && typeof action.id === "string" && action.id.length <= 200) return { kind: "save", id: action.id };
  } catch { /* Browsing still works when storage is unavailable. */ }
  return null;
}

async function persistFavorite(id: string, saved: boolean) {
  const response = await fetch("/api/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ entryId: id, saved }) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Could not update your saved collection.");
}

async function loadAccount() {
  const response = await fetch("/api/me", { cache: "no-store" });
  if (!response.ok) throw new Error("Your account could not be loaded. Please try again.");
  const account: Me = await response.json();
  let ids: string[] = [];
  if (account.user) {
    const favorites = await fetch("/api/favorites", { cache: "no-store" });
    if (!favorites.ok) throw new Error("Your saved collection could not be loaded.");
    const data = await favorites.json();
    ids = data.ids;
  }
  return { account, ids };
}

async function loadEntries(): Promise<DiscoveryEntry[]> {
  const response = await fetch("/api/entries", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not refresh the collection.");
  return (await response.json()).entries;
}

function BookmarkButton({ entry, saved, pending, onToggle, className = "" }: { entry: DiscoveryEntry; saved: boolean; pending: boolean; onToggle: (id: string) => void; className?: string }) {
  return <button type="button" className={`icon-button bookmark-button ${saved ? "is-saved" : ""} ${className}`} aria-label={`${saved ? "Unsave" : "Save"} ${entry.title}`} aria-pressed={saved} disabled={pending} onClick={() => onToggle(entry.id)}>
    {saved ? <BookmarkFilledIcon /> : <BookmarkIcon />}
  </button>;
}

export function DiscoveryApp({ initialEntries, initialQuery }: { initialEntries: DiscoveryEntry[]; initialQuery: DiscoveryQuery }) {
  const [entries, setEntries] = useState(initialEntries);
  const [query, setQuery] = useState(initialQuery);
  const [me, setMe] = useState<Me>({ user: null, isOwner: false, googleEnabled: false });
  const [sessionLoading, setSessionLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savingIds, setSavingIds] = useState<string[]>([]);
  const [dialog, setDialog] = useState<"auth" | "submit" | "account" | null>(null);
  const [detail, setDetail] = useState<DiscoveryEntry | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [connectionError, setConnectionError] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const refreshAccount = useCallback(async () => {
    const { account, ids } = await loadAccount();
    setMe(account);
    setSavedIds(ids);
    return account;
  }, []);

  useEffect(() => {
    let active = true;
    loadAccount().then(async ({ account, ids }) => {
      if (!active) return;
      setMe(account); setSavedIds(ids);
      const action = takeAuthIntent();
      if (!account.user || !action) return;
      if (action.kind === "submit") setDialog("submit");
      if (action.kind === "saved") {
        const next = { ...parseQuery(new URLSearchParams(window.location.search)), saved: true };
        setQuery(next); window.history.replaceState(null, "", `${window.location.pathname}${queryString(next)}`);
      }
      if (action.kind === "save") {
        await persistFavorite(action.id, true);
        if (active) { setSavedIds([...new Set([...ids, action.id])]); setNotice("Added to your saved collection"); }
      }
    }).catch((reason: Error) => { if (active) setConnectionError(reason.message); }).finally(() => { if (active) setSessionLoading(false); });
    loadEntries().then((data) => { if (active) setEntries(data); }).catch((reason: Error) => { if (active) setConnectionError(reason.message); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const pop = () => setQuery(parseQuery(new URLSearchParams(window.location.search)));
    const keyboard = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("popstate", pop); window.addEventListener("keydown", keyboard);
    return () => { window.removeEventListener("popstate", pop); window.removeEventListener("keydown", keyboard); };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 4200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function updateQuery(update: Partial<DiscoveryQuery>, push = false) {
    const next = { ...query, ...update };
    setQuery(next);
    const url = `${window.location.pathname}${queryString(next)}`;
    if (push) window.history.pushState(null, "", url); else window.history.replaceState(null, "", url);
  }

  function switchSection(section: DiscoverySection) { setExpanded(null); updateQuery({ section, category: "all", type: "all", q: "" }, true); }
  function collapseRow(row: Element | null) {
    row?.querySelector<HTMLButtonElement>(".site-row-trigger")?.focus();
    setExpanded(null);
  }
  function openSubmit() {
    if (me.user) setDialog("submit");
    else { setPendingAction({ kind: "submit" }); setDialog("auth"); }
  }

  async function saveEntry(id: string, desired: boolean) {
    setSavingIds((current) => [...current, id]);
    try {
      await persistFavorite(id, desired);
      setSavedIds((current) => desired ? [...new Set([...current, id])] : current.filter((value) => value !== id));
      setNotice(desired ? "Added to your saved collection" : "Removed from your saved collection");
    } catch (reason) { setNotice(reason instanceof Error ? reason.message : "Could not save this item."); }
    finally { setSavingIds((current) => current.filter((value) => value !== id)); }
  }

  function toggleSave(id: string) {
    if (!me.user) { setPendingAction({ kind: "save", id }); setDialog("auth"); return; }
    void saveEntry(id, !savedIds.includes(id));
  }

  function toggleSaved() {
    if (!me.user && !query.saved) { setPendingAction({ kind: "saved" }); setDialog("auth"); }
    else updateQuery({ saved: !query.saved });
  }

  async function authenticated() {
    const account = await refreshAccount();
    if (!account.user) throw new Error("Your session could not be confirmed. Please try again.");
    setSessionLoading(false); setConnectionError(""); setDialog(null);
    if (pendingAction?.kind === "save") await saveEntry(pendingAction.id, true);
    if (pendingAction?.kind === "submit") setDialog("submit");
    if (pendingAction?.kind === "saved") updateQuery({ saved: true });
    setPendingAction(null);
  }

  const categories = useMemo(() => [...new Set(entries.filter((entry) => entry.section === query.section).map((entry) => entry.category))], [entries, query.section]);
  const visibleEntries = useMemo(() => filterEntries(entries, query, savedIds), [entries, query, savedIds]);
  const activeFilters = Boolean(query.q || query.category !== "all" || query.type !== "all" || query.saved);
  const sectionEntries = entries.filter((entry) => entry.section === query.section);

  return <div className="library-app">
    <a href="#collection" className="skip-link">Skip to collection</a>
    <aside className="sidebar">
      <Link href="/" className="wordmark" aria-label="ui-ux-library home"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>ui/ux<span className="wordmark-sub">library</span></span></Link>
      <div className="sidebar-content"><p className="nav-label">Explore the collection</p>
        <nav aria-label="Main navigation">
          <Link prefetch={false} href="/?section=inspiration" className={`nav-item${query.section === "inspiration" ? " active" : ""}`} aria-current={query.section === "inspiration" ? "page" : undefined} onClick={(event) => { event.preventDefault(); switchSection("inspiration"); }}><GridIcon /><span>Inspiration</span><ChevronRightIcon className="nav-chevron" /></Link>
          <Link prefetch={false} href="/?section=sites" className={`nav-item${query.section === "sites" ? " active" : ""}`} aria-current={query.section === "sites" ? "page" : undefined} onClick={(event) => { event.preventDefault(); switchSection("sites"); }}><Link2Icon /><span>Useful Sites</span><ChevronRightIcon className="nav-chevron" /></Link>
        </nav>
        <div className="sidebar-divider" /><p className="nav-label">Your collection</p>
        <button type="button" className={`nav-item saved-nav${query.saved ? " selected" : ""}`} onClick={toggleSaved}><BookmarkIcon /><span>Saved finds</span>{me.user && <span className="nav-count">{savedIds.length}</span>}</button>
        <button type="button" className="nav-item" onClick={openSubmit}><PlusIcon /><span>Submit a link</span></button>
      </div>
      <div className="sidebar-bottom"><div className="curation-note"><span className="curation-icon"><HeartIcon /></span><p>Good work deserves<br />to be discovered.</p></div><a className="project-link" href="https://github.com/vlat247/ui-ux-library" target="_blank" rel="noreferrer"><GitHubLogoIcon /> Follow the project <ArrowTopRightIcon /></a></div>
    </aside>
    <div className="workspace">
      <header className="topbar"><div className="breadcrumb"><span>Library</span><ChevronRightIcon /><span>{query.section === "sites" ? "Useful Sites" : "Inspiration"}</span></div>
        <div className="topbar-actions"><button className="button button-secondary submit-top" type="button" onClick={openSubmit}><PlusIcon /> Submit a link</button>
          <button className={me.user ? "account-button" : "button button-primary"} disabled={sessionLoading} type="button" onClick={() => setDialog(me.user ? "account" : "auth")}>{me.user ? <><span className="avatar">{me.user.name.slice(0, 1).toUpperCase()}</span><span className="account-name">{me.user.name.split(" ")[0]}</span><ChevronDownIcon /></> : sessionLoading ? "Loading…" : "Sign in"}</button></div>
      </header>
      <main className="main-content" id="collection">
        <div className="collection-heading"><div><div className="section-context"><span className="section-symbol">{query.section === "sites" ? <GlobeIcon /> : <GridIcon />}</span><span>{query.section === "sites" ? "Resources, thoughtfully collected" : "Design, motion & interaction"}</span></div>
          <h1>{query.section === "sites" ? "Useful Sites" : "Inspiration"}<span className="heading-period">.</span></h1>
          <p>{query.section === "sites" ? "A few good places to get you somewhere interesting." : "Good ideas. Thoughtful details. Something to come back to."}</p>
        </div><div className="collection-note"><span className="collection-count">{sectionEntries.length.toString().padStart(2, "0")}</span><span>curated finds<br />and counting</span></div></div>
        <div className="collection-toolbar"><div className="search-field"><MagnifyingGlassIcon /><input ref={searchRef} type="search" aria-label={`Search ${query.section === "sites" ? "Useful Sites" : "Inspiration"}`} placeholder="Search the collection…" value={query.q} onChange={(event) => updateQuery({ q: event.target.value })} /><kbd>⌘ K</kbd></div>
          <div className="toolbar-selects">{query.section === "inspiration" && <div className="select-control"><VideoIcon /><select aria-label="Filter content type" value={query.type} onChange={(event) => updateQuery({ type: event.target.value })}><option value="all">All formats</option><option value="video">Motion</option><option value="design">Design</option><option value="interactive">Interactive</option></select><ChevronDownIcon /></div>}
            <div className="select-control sort-control"><MixerHorizontalIcon /><select aria-label="Sort collection" value={query.sort} onChange={(event) => updateQuery({ sort: event.target.value as "curated" | "recent" })}><option value="curated">Curated</option><option value="recent">Recently added</option></select><ChevronDownIcon /></div></div>
        </div>
        <div className="filter-bar"><div className="category-filters" aria-label="Category filters"><button type="button" className={`filter-chip${query.category === "all" ? " active" : ""}`} aria-pressed={query.category === "all"} onClick={() => updateQuery({ category: "all" })}>All finds</button>{categories.map((category) => <button type="button" key={category} className={`filter-chip${query.category === category ? " active" : ""}`} aria-pressed={query.category === category} onClick={() => updateQuery({ category })}>{category}</button>)}</div>
          <button type="button" className={`saved-toggle${query.saved ? " active" : ""}`} aria-label="Filter saved finds" aria-pressed={query.saved} onClick={toggleSaved}>{query.saved ? <BookmarkFilledIcon /> : <BookmarkIcon />}<span>Saved</span></button></div>
        {connectionError && <div className="connection-message" role="status"><span>{connectionError}</span><button type="button" className="text-button" onClick={() => { Promise.all([refreshAccount(), loadEntries().then(setEntries)]).then(() => { setConnectionError(""); setSessionLoading(false); }).catch((reason: Error) => setConnectionError(reason.message)); }}>Retry connection</button></div>}
        <div className="results-meta"><span>{query.saved && sessionLoading ? "Loading saved finds…" : `${visibleEntries.length} ${query.section === "sites" ? "resources" : "finds"}${query.saved ? " in your saved collection" : " to explore"}`}</span>{activeFilters && <button type="button" className="text-button clear-filters" onClick={() => updateQuery({ q: "", category: "all", type: "all", saved: false })}><ResetIcon /> Clear filters</button>}</div>
        {query.saved && sessionLoading ? <div className="empty-state" role="status"><p>Loading your saved collection…</p></div> : visibleEntries.length === 0 ? <div className="empty-state"><div className="empty-state-icon">{query.saved ? <BookmarkIcon /> : <MagnifyingGlassIcon />}</div><h2>{query.saved && !me.user ? "Your next favorite is out there." : query.saved ? "Make room for a good find." : "Nothing here. Something nearby?"}</h2><p>{query.saved ? me.user ? "Save a few references, then come back to them here." : "Sign in to keep a collection of the things you love." : "Try a different search or clear your filters to see the collection."}</p><button type="button" className="button button-secondary" onClick={() => query.saved && !me.user ? setDialog("auth") : updateQuery({ q: "", category: "all", type: "all", saved: false })}>{query.saved && !me.user ? "Sign in" : "Explore all finds"}<ArrowRightIcon /></button></div>
          : query.section === "inspiration" ? <div className="inspiration-grid">{visibleEntries.map((entry) => <article className="inspiration-card" key={entry.id}>
            <div className="card-media"><button type="button" className="preview-button" onClick={() => setDetail(entry)} aria-label={`Preview ${entry.title}`}><EntryPreview entry={entry} /></button><BookmarkButton entry={entry} saved={savedIds.includes(entry.id)} pending={sessionLoading || savingIds.includes(entry.id)} onToggle={toggleSave} className="card-bookmark" />{entry.kind === "interactive" && <span className="preview-kind"><ExternalLinkIcon /> Interactive</span>}</div>
            <div className="card-title-row"><button type="button" className="card-title" onClick={() => setDetail(entry)}>{entry.title}</button><button type="button" className="card-open" onClick={() => setDetail(entry)} aria-label={`Open ${entry.title}`}><ArrowTopRightIcon /></button></div><div className="card-meta"><span>{entry.creator ?? entry.sourceLabel}</span><span>{kindLabels[entry.kind]}</span></div>
          </article>)}</div>
            : <div className="sites-list">{visibleEntries.map((entry) => <article key={entry.id} className={`site-row${expanded === entry.id ? " is-expanded" : ""}`}
              onPointerEnter={(event) => { if (event.pointerType === "mouse") setExpanded(entry.id); }}
              onPointerLeave={(event) => { if (event.pointerType === "mouse" && !event.currentTarget.contains(document.activeElement)) setExpanded(null); }}
              onFocusCapture={(event) => { if (event.target.matches(":focus-visible")) setExpanded(entry.id); }}
              onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setExpanded(null); }}
              onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); collapseRow(event.currentTarget); } }}>
              <div className="site-row-head"><button type="button" className="site-row-trigger" aria-expanded={expanded === entry.id} aria-controls={`site-${entry.id}`} onClick={() => setExpanded(entry.id)}><span className="site-monogram" style={{ "--preview-color": entry.color } as CSSProperties}>{entry.title.slice(0, 1)}</span><span className="site-name">{entry.title}</span><span className="site-summary">{entry.description}</span><span className="site-category">{entry.category}</span></button><BookmarkButton entry={entry} saved={savedIds.includes(entry.id)} pending={sessionLoading || savingIds.includes(entry.id)} onToggle={toggleSave} /><a className="icon-button row-visit" href={entry.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Visit ${entry.title}`}><ArrowTopRightIcon /></a></div>
              <div className="site-row-body" id={`site-${entry.id}`} inert={expanded !== entry.id}><div className="site-row-body-inner"><div className="site-cover"><EntryPreview entry={entry} /></div><div className="site-context"><span className="site-domain">{entry.sourceLabel}</span><div className="site-context-title"><h2>{entry.title}</h2><button type="button" className="icon-button" aria-label={`Collapse ${entry.title}`} onClick={(event) => collapseRow(event.currentTarget.closest(".site-row"))}><Cross2Icon /></button></div><p>{entry.description}</p><div className="site-tags">{entry.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a className="button button-secondary" href={entry.sourceUrl} target="_blank" rel="noreferrer">Visit website <ArrowTopRightIcon /></a></div></div></div>
            </article>)}</div>}
        <footer className="collection-footer"><span>A growing collection. A human point of view.</span><button type="button" className="text-button" onClick={openSubmit}>Know something good? <ArrowTopRightIcon /></button></footer>
      </main>
    </div>
    <AuthDialog open={dialog === "auth"} onClose={() => { setDialog(null); setPendingAction(null); }} onAuthenticated={authenticated} googleEnabled={me.googleEnabled} onGoogleRedirect={() => { try { if (pendingAction) sessionStorage.setItem(intentKey, JSON.stringify({ action: pendingAction, createdAt: Date.now() })); else sessionStorage.removeItem(intentKey); } catch { /* Storage is optional. */ } }} />
    <SubmitDialog open={dialog === "submit"} onClose={() => setDialog(null)} onSubmitted={() => setNotice("Link received. You can track its status in your account.")} />
    {me.user && <AccountDialog open={dialog === "account"} onClose={() => setDialog(null)} user={me.user} isOwner={me.isOwner} onSignedOut={() => { setMe({ user: null, isOwner: false, googleEnabled: me.googleEnabled }); setSavedIds([]); setNotice("You’re signed out."); }} />}
    <Dialog open={detail !== null} onClose={() => setDetail(null)} title={detail?.title ?? "Preview"} wide>
      {detail && <div className="detail-view"><EntryPreview entry={detail} controls /><div className="detail-description"><span className="detail-category">{kindLabels[detail.kind]} · {detail.category}</span><p>{detail.description}</p><div className="detail-footer"><div><strong>{detail.creatorUrl ? <a href={detail.creatorUrl} target="_blank" rel="noreferrer">{detail.creator ?? detail.sourceLabel} ↗</a> : detail.creator ?? detail.sourceLabel}</strong><span>{detail.original ? "An original library study" : detail.sourceLabel}</span></div><div className="detail-actions"><button type="button" className="button button-secondary" disabled={savingIds.includes(detail.id)} onClick={() => toggleSave(detail.id)}>{savedIds.includes(detail.id) ? <CheckIcon /> : <BookmarkIcon />}{savedIds.includes(detail.id) ? "Saved" : "Save find"}</button>{!detail.original && <a className="button button-primary" href={detail.sourceUrl} target="_blank" rel="noreferrer">Visit source <ArrowTopRightIcon /></a>}</div></div>{!detail.previewVideo && !detail.previewImage && <p className="cover-note">Illustrated cover. Open the source to explore the original work.</p>}</div></div>}
    </Dialog>
    {notice && <div className="toast" role="status"><CheckIcon /><span>{notice}</span><button type="button" className="icon-button" aria-label="Dismiss notification" onClick={() => setNotice("")}><Cross2Icon /></button></div>}
  </div>;
}
