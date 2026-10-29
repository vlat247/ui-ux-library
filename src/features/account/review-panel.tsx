"use client";

import { ArrowTopRightIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from "react";
import { AuthDialog } from "@/features/account/dialogs";
import type { CurrentUser, Submission } from "@/features/discovery/types";

type Identity = {
  user: CurrentUser | null;
  isOwner: boolean;
  googleEnabled: boolean;
};
type ReviewFilter = Submission["status"] | "all";
type Decision = "approved" | "rejected";

const filters: { value: ReviewFilter; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "all", label: "All" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const dateFormat = new Intl.DateTimeFormat("en", {
  year: "numeric", month: "short", day: "numeric", timeZone: "Asia/Almaty",
});

async function requestJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, { cache: "no-store", ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "The request could not be completed. Please try again.");
  return data as T;
}

function errorMessage(reason: unknown) {
  return reason instanceof Error ? reason.message : "Connection failed. Please try again.";
}

export function ReviewPanel() {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [identityError, setIdentityError] = useState("");
  const [listError, setListError] = useState("");
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<ReviewFilter>("pending");
  const [pendingAction, setPendingAction] = useState<{ id: string; status: Decision } | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [authOpen, setAuthOpen] = useState(false);

  const loadReview = useCallback(async (signal?: AbortSignal) => {
    try {
      const me = await requestJson<Identity>("/api/me", { signal });
      if (signal?.aborted) return;
      setIdentity(me);
      setIdentityError("");

      if (!me.user || !me.isOwner) {
        setSubmissions([]);
        setListError("");
        return;
      }

      try {
        const data = await requestJson<{ submissions: Submission[] }>("/api/submissions", { signal });
        if (signal?.aborted) return;
        setSubmissions(data.submissions);
        setListError("");
      } catch (reason) {
        if (!signal?.aborted) setListError(errorMessage(reason));
      }
    } catch (reason) {
      if (signal?.aborted) return;
      setIdentity(null);
      setSubmissions([]);
      setIdentityError(errorMessage(reason));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadReview(controller.signal);
    return () => controller.abort();
  }, [loadReview]);

  async function refresh() {
    setLoading(true);
    setAnnouncement("");
    await loadReview();
  }

  async function review(item: Submission, status: Decision) {
    if (pendingAction || loading) return;
    setPendingAction({ id: item.id, status });
    setActionErrors((previous) => ({ ...previous, [item.id]: "" }));
    setAnnouncement("");

    try {
      const data = await requestJson<{ submission: Submission }>(`/api/submissions/${encodeURIComponent(item.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setSubmissions((previous) => previous.map((entry) => entry.id === item.id ? data.submission : entry));
      setAnnouncement(`${status === "approved" ? "Approved" : "Rejected"}: ${item.title}.`);

      try {
        const updated = await requestJson<{ submissions: Submission[] }>("/api/submissions");
        setSubmissions(updated.submissions);
        setListError("");
      } catch {
        setListError("Your decision was saved, but the list could not refresh. Refresh to check the latest submissions.");
      }
    } catch (reason) {
      setActionErrors((previous) => ({ ...previous, [item.id]: errorMessage(reason) }));
    } finally {
      setPendingAction(null);
    }
  }

  const visibleSubmissions = submissions.filter((item) => filter === "all" || item.status === filter);
  const owner = Boolean(identity?.user && identity.isOwner);

  return (
    <>
      <div className="review-page-heading">
        <div>
          <h1>Review submissions</h1>
          <p>Only approved links appear in the library.</p>
        </div>
        {owner && (
          <button className="button button-secondary" type="button" disabled={loading || Boolean(pendingAction)} onClick={() => void refresh()}>
            <ReloadIcon aria-hidden="true" /> {loading ? "Refreshing…" : "Refresh"}
          </button>
        )}
      </div>

      {loading && !identity && !identityError && <p className="review-loading" role="status">Checking access…</p>}

      {identityError && (
        <div className="review-access-state">
          <h2>Could not check your account</h2>
          <p role="alert">{identityError}</p>
          <button className="button button-secondary" type="button" disabled={loading} onClick={() => void refresh()}>
            {loading ? "Trying again…" : "Try again"}
          </button>
        </div>
      )}

      {identity && !identity.user && (
        <div className="review-access-state">
          <h2>Sign in to review submissions</h2>
          <p>This page is available to the library owner.</p>
          <button className="button button-primary" type="button" onClick={() => setAuthOpen(true)}>Sign in</button>
        </div>
      )}

      {identity?.user && !identity.isOwner && (
        <div className="review-access-state">
          <h2>Owner access required</h2>
          <p>You’re signed in as {identity.user.email}. Only the library owner can review and publish submitted links.</p>
        </div>
      )}

      {owner && (
        <section aria-label="Submitted links">
          <div className="review-toolbar" role="group" aria-label="Filter submissions">
            {filters.map((option) => {
              const count = option.value === "all" ? submissions.length : submissions.filter((item) => item.status === option.value).length;
              return (
                <button className="review-filter" key={option.value} type="button" aria-pressed={filter === option.value} onClick={() => setFilter(option.value)}>
                  {option.label} <span>{count}</span>
                </button>
              );
            })}
          </div>

          {announcement && <p className="review-feedback" role="status">{announcement}</p>}
          {listError && <p className="review-error" role="alert">{listError}</p>}

          {loading && !submissions.length && <p className="review-loading" role="status">Loading submissions…</p>}
          {!loading && !listError && !visibleSubmissions.length && (
            <div className="review-empty">
              <h2>{filter === "pending" ? "No links waiting for review" : filter === "all" ? "No submissions yet" : `No ${filter} submissions`}</h2>
              <p>{filter === "pending" ? "New submissions will appear here for your approval." : "Submitted links appear here with their review status."}</p>
            </div>
          )}

          <ul className="review-submissions" aria-busy={loading || Boolean(pendingAction)}>
            {visibleSubmissions.map((item) => (
              <li className="review-card" key={item.id}>
                <div className="review-card-heading">
                  <h2>{item.title}</h2>
                  <span className={`review-status review-status-${item.status}`}>{item.status}</span>
                </div>
                <div className="review-metadata">
                  <span>{item.section === "sites" ? "Useful Sites" : "Inspiration"}</span>
                  <span>{item.category}</span>
                  <time dateTime={item.createdAt}>{dateFormat.format(new Date(item.createdAt))}</time>
                </div>
                <p className="review-description">{item.description}</p>
                <a className="review-source" href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`Open source for ${item.title}`}>
                  {item.url} <ArrowTopRightIcon aria-hidden="true" />
                </a>
                <div className="review-card-footer">
                  <div className="review-author">
                    <span>Submitted by {item.userName || "a library member"}</span>
                    {item.userEmail && <span>{item.userEmail}</span>}
                  </div>
                  <div className="review-actions">
                    {item.status !== "rejected" && (
                      <button className="button button-secondary" type="button" disabled={loading || Boolean(pendingAction)} onClick={() => void review(item, "rejected")}>
                        {pendingAction?.id === item.id && pendingAction.status === "rejected" ? "Rejecting…" : "Reject"}
                      </button>
                    )}
                    {item.status !== "approved" && (
                      <button className="button button-primary" type="button" disabled={loading || Boolean(pendingAction)} onClick={() => void review(item, "approved")}>
                        {pendingAction?.id === item.id && pendingAction.status === "approved" ? "Approving…" : "Approve"}
                      </button>
                    )}
                  </div>
                </div>
                {actionErrors[item.id] && <p className="review-error review-action-error" role="alert">{actionErrors[item.id]}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} googleEnabled={identity?.googleEnabled ?? false} onAuthenticated={async () => {
        await refresh();
        setAuthOpen(false);
      }} />
    </>
  );
}
