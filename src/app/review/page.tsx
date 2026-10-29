import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { ReviewPanel } from "@/features/account/review-panel";
import "./review.css";

export const metadata: Metadata = {
  title: "Review submissions",
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return (
    <div className="review-page">
      <header className="review-site-header">
        <div className="review-header-inner">
          <Link className="review-brand" href="/">ui-ux-library</Link>
          <Link className="review-back-link" href="/">
            <ArrowLeftIcon aria-hidden="true" /> Back to library
          </Link>
        </div>
      </header>
      <main className="review-main">
        <ReviewPanel />
      </main>
    </div>
  );
}
