"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

// Submit button for a CMS form; asks first when `confirm` is set (deletes).
export function ConfirmSubmit({ children, confirm, formAction, className }: { children: ReactNode; confirm?: string; formAction?: (form: FormData) => void | Promise<void>; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} formAction={formAction} disabled={pending} aria-disabled={pending}
      onClick={(event) => { if (confirm && !window.confirm(confirm)) event.preventDefault(); }}>
      {pending ? "Saving…" : children}
    </button>
  );
}
