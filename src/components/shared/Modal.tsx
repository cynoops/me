import clsx from "clsx";
import { ReactNode, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  widthClass?: string;
};

export const Modal = ({
  open,
  onClose,
  title,
  children,
  widthClass = "max-w-lg",
}: Props) => {
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center px-4 py-8">
      <div
        className="absolute inset-0 bg-[rgba(0,31,63,0.65)]"
        onClick={onClose}
        role="presentation"
      />
      <div
        className={clsx(
          "relative w-full rounded-2xl bg-white shadow-xl",
          widthClass,
        )}
        role="dialog"
      >
        <div className="flex items-start justify-between border-b border-grey-dark px-4 py-3">
          {title ? (
            <h3 className="text-lg font-semibold text-brand">{title}</h3>
          ) : (
            <span />
          )}
          <button
            className="rounded-full px-2 py-1 text-grey-text hover:bg-grey"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto px-4 py-4">{children}</div>
      </div>
    </div>
  );
};
