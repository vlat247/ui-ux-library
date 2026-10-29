"use client";

import Image from "next/image";
import { PlayIcon } from "@radix-ui/react-icons";
import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { DiscoveryEntry } from "./types";

export function ArtPreview({ entry }: { entry: DiscoveryEntry }) {
  return <div className={`art-preview art-${entry.art}`} style={{ "--preview-color": entry.color } as CSSProperties} aria-hidden="true">
    <div className="art-shape art-shape-one" /><div className="art-shape art-shape-two" /><div className="art-shape art-shape-three" />
    <div className="art-wordmark">{entry.title}</div><span className="art-domain">{entry.sourceLabel}</span>
  </div>;
}

export function EntryPreview({ entry, controls = false }: { entry: DiscoveryEntry; controls?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([target]) => { if (!target.isIntersecting) video.pause(); });
    observer.observe(video);
    const pause = () => { if (document.hidden) video.pause(); };
    document.addEventListener("visibilitychange", pause);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", pause); video.pause(); };
  }, [entry.id]);
  return <div className={`entry-preview${controls ? " preview-full" : ""}`}
    onPointerEnter={(event) => {
      if (!controls && event.pointerType === "mouse" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) void videoRef.current?.play().catch(() => undefined);
    }} onPointerLeave={() => { if (!controls) videoRef.current?.pause(); }}>
    {entry.previewVideo ? <video ref={videoRef} src={entry.previewVideo} poster={entry.previewImage} muted={!controls} loop playsInline controls={controls} preload="none" aria-label={`${entry.title} motion study`} />
      : entry.previewImage ? <Image src={entry.previewImage} alt={`${entry.title} preview`} width={900} height={600} /> : <ArtPreview entry={entry} />}
    {!controls && entry.previewVideo && <span className="preview-play"><PlayIcon /> <span>Motion study</span></span>}
    {!controls && entry.original && <span className="preview-original">Original</span>}
  </div>;
}
