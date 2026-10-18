"use client";

import { useRef, type ReactNode } from "react";
import { Maximize2, X } from "lucide-react";
import { trackEngagement } from "@/lib/track-engagement";

// The card stays compact; the full case study opens in a native modal dialog, so opening one
// project never reflows the rest of the grid. <dialog> gives focus trapping and Esc for free.
export function ProjectDialog({
  projectId,
  title,
  cover,
  summary,
  footer,
  children,
}: {
  projectId: number;
  title: string;
  cover: ReactNode;
  summary: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = `project-dialog-title-${projectId}`;

  const open = () => {
    dialogRef.current?.showModal();
    trackEngagement({ type: "project_open", projectId });
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button type="button" className="work-cover-button" onClick={open} tabIndex={-1} aria-hidden="true">
        {cover}
      </button>
      {summary}
      <div className="work-card-footer">
        <button type="button" className="work-open-button" onClick={open} aria-haspopup="dialog">
          <Maximize2 size={15} aria-hidden="true" /> View case study <span className="visually-hidden">for {title}</span>
        </button>
        {footer}
      </div>

      <dialog
        ref={dialogRef}
        className="project-dialog"
        aria-labelledby={titleId}
        onClick={(event) => {
          // A click on the backdrop lands on the <dialog> itself, not its content.
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="project-dialog-inner">
          <button type="button" className="project-dialog-close icon-button" onClick={close} aria-label="Close case study">
            <X size={18} aria-hidden="true" />
          </button>
          {cover}
          <h3 id={titleId} className="project-dialog-title">{title}</h3>
          {children}
        </div>
      </dialog>
    </>
  );
}
