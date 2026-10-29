"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { useEffect, useId, useRef, type ReactNode } from "react";

export function Dialog({ open, onClose, title, children, wide = false }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog?.open) dialog?.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open]);
  return (
    <dialog ref={ref} className={`dialog${wide ? " dialog-wide" : ""}`} aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        const bounds = ref.current?.getBoundingClientRect();
        if (event.target === ref.current && bounds && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) onClose();
      }}>
      <div className="dialog-heading"><h2 id={titleId}>{title}</h2><button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog"><Cross2Icon /></button></div>
      {open ? children : null}
    </dialog>
  );
}
