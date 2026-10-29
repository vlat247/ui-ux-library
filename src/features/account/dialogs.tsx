"use client";

import { ArrowTopRightIcon, CheckCircledIcon, ExitIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Dialog } from "@/components/dialog";
import { authClient } from "@/lib/auth-client";
import type { CurrentUser, Submission } from "@/features/discovery/types";

export function AuthDialog({ open, onClose, onAuthenticated, googleEnabled, onGoogleRedirect }: {
  open: boolean; onClose: () => void; onAuthenticated: () => Promise<void>; googleEnabled: boolean; onGoogleRedirect?: () => void;
}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setError(""); setPending(true);
    try {
      const credentials = { email: String(values.get("email")).trim(), password: String(values.get("password")) };
      const result = mode === "signup"
        ? await authClient.signUp.email({ ...credentials, name: String(values.get("name")).trim() })
        : await authClient.signIn.email(credentials);
      if (result.error) throw new Error(result.error.message ?? "Could not sign in. Please try again.");
      await onAuthenticated();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Connection failed. Please try again."); }
    finally { setPending(false); }
  }

  return <Dialog open={open} onClose={onClose} title={mode === "signup" ? "Create your account" : "Welcome back"}>
    <p className="dialog-description">Save the things you love. Share your next good find.</p>
    <button className="button google-button" type="button" disabled={!googleEnabled || pending} onClick={async () => {
      setError(""); setPending(true);
      try {
        onGoogleRedirect?.();
        const result = await authClient.signIn.social({ provider: "google", callbackURL: window.location.href });
        if (result.error) throw new Error(result.error.message ?? "Google sign-in failed.");
      } catch (reason) { setError(reason instanceof Error ? reason.message : "Google sign-in failed."); setPending(false); }
    }}><span className="google-letter" aria-hidden="true">G</span> Continue with Google</button>
    {!googleEnabled && <p className="field-note">Google is unavailable in this local preview. You can continue with email.</p>}
    <div className="form-divider"><span>or use email</span></div>
    <form onSubmit={submit} className="form-stack">
      {mode === "signup" && <label>Your name<input name="name" autoComplete="name" minLength={2} maxLength={80} required placeholder="Your name" /></label>}
      <label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
      <label>Password<input name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={8} maxLength={128} required placeholder="At least 8 characters" /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary" disabled={pending}>{pending ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}</button>
    </form>
    <p className="form-footer">{mode === "signup" ? "Already have an account?" : "New to the library?"} <button type="button" className="text-button" onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(""); }}>{mode === "signup" ? "Sign in" : "Create an account"}</button></p>
  </Dialog>;
}

export function SubmitDialog({ open, onClose, onSubmitted }: { open: boolean; onClose: () => void; onSubmitted: () => void }) {
  const requestGeneration = useRef(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const generation = ++requestGeneration.current;
    setPending(true); setError("");
    try {
      const response = await fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Your link could not be submitted.");
      if (generation === requestGeneration.current) { setSuccess(true); onSubmitted(); }
    } catch (reason) { if (generation === requestGeneration.current) setError(reason instanceof Error ? reason.message : "Connection failed. Please try again."); }
    finally { if (generation === requestGeneration.current) setPending(false); }
  }
  return <Dialog open={open} onClose={() => { requestGeneration.current++; onClose(); setPending(false); setSuccess(false); setError(""); }} title={success ? "A good find. Thank you." : "Share a good find"}>
    {success ? <div className="submission-success"><CheckCircledIcon /><h3>Submitted for review</h3><p>Your link is in the owner’s review queue. It will appear in the library after approval.</p><button type="button" className="button button-primary" onClick={() => { onClose(); setSuccess(false); }}>Back to browsing</button></div>
      : <><p className="dialog-description">A useful resource, a thoughtful interaction, a detail worth sharing.</p>
        <form className="form-stack" onSubmit={submit}>
          <label>Link<input name="url" type="url" required maxLength={2048} placeholder="https://…" /></label>
          <label>Title<input name="title" required minLength={3} maxLength={120} placeholder="What is it called?" /></label>
          <div className="form-columns"><label>Collection<select name="section"><option value="inspiration">Inspiration</option><option value="sites">Useful Sites</option></select></label>
            <label>Category<input name="category" required minLength={2} maxLength={60} placeholder="e.g. Motion" /></label></div>
          <label>What makes it worth a look?<textarea name="description" required minLength={10} maxLength={1200} rows={3} placeholder="A little context for the collection…" /></label>
          <p className="field-note">All submissions are reviewed before publication. Share the original source when possible.</p>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary" disabled={pending}>{pending ? "Submitting…" : "Submit for review"}</button>
        </form></>}
  </Dialog>;
}

export function AccountDialog({ open, onClose, user, isOwner, onSignedOut }: {
  open: boolean; onClose: () => void; user: CurrentUser; isOwner: boolean; onSignedOut: () => void;
}) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch("/api/submissions").then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not load submissions.");
      if (!cancelled) { setSubmissions(data.submissions); setError(""); }
    }).catch((reason: Error) => { if (!cancelled) setError(reason.message); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [open]);
  return <Dialog open={open} onClose={onClose} title="Your library account">
    <div className="account-identity"><span className="avatar avatar-large">{user.name.slice(0, 1).toUpperCase()}</span><div><strong>{user.name}</strong><p>{user.email}</p></div></div>
    {isOwner && <a href="/review" className="button button-secondary">Review submissions <ArrowTopRightIcon /></a>}
    <h3 className="account-section-heading">{isOwner ? "Recent submissions" : "Your submissions"}</h3>
    {error ? <p className="form-error" role="alert">{error}</p> : loading ? <p className="field-note" role="status">Loading submissions…</p> : submissions.length ? <ul className="account-submissions">{submissions.map((item) => <li key={item.id}><div><strong>{item.title}</strong><span>{new Date(item.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}</span></div><span className={`submission-status status-${item.status}`}>{item.status}</span></li>)}</ul>
      : <p className="field-note account-empty">Your submitted links will appear here with their review status.</p>}
    <button type="button" className="button button-secondary signout-button" disabled={pending} onClick={async () => {
      setPending(true);
      try { const result = await authClient.signOut(); if (result.error) throw new Error(result.error.message); onSignedOut(); onClose(); }
      catch (reason) { setError(reason instanceof Error ? reason.message : "Could not sign out."); }
      finally { setPending(false); }
    }}><ExitIcon />{pending ? "Signing out…" : "Sign out"}</button>
  </Dialog>;
}
