"use client";

import { useState, type ReactNode } from "react";

const filename = "2026_ICLSalinas_Resume.pdf";

export function ResumeDownloadLink({ children, className }: { children: ReactNode; className: string }) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [failed, setFailed] = useState(false);

  async function download() {
    if (busy) return;
    setBusy(true);
    setNotice("Preparing your resume download…");
    setFailed(false);
    try {
      const response = await fetch("/api/track-download", { cache: "no-store" });
      if (!response.ok) throw new Error("Download unavailable");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice("Resume download started.");
    } catch (error) {
      console.error("Resume download failed", error);
      setNotice("Resume download is temporarily unavailable. Please try again.");
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="resume-download-control">
      <button className={className} type="button" onClick={download} disabled={busy}>{children}</button>
      {notice && <span role={failed ? "alert" : "status"} className={`download-notice${failed ? " download-notice-error" : ""}`}>{notice}</span>}
    </span>
  );
}
