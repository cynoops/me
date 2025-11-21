import clsx from "clsx";
import { ReactNode, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  widthClass?: string;
  bodyClassName?: string;
  fullScreen?: boolean;
};

export const Modal = ({
  open,
  onClose,
  title,
  children,
  widthClass = "max-w-lg",
  bodyClassName,
  fullScreen = false,
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
    <div
      className={clsx(
        "fixed inset-0 z-30 flex",
        fullScreen ? "items-stretch justify-center" : "items-center justify-center px-4 py-8",
      )}
    >
      <div
        className="absolute inset-0 bg-[rgba(0,31,63,0.65)]"
        onClick={onClose}
        role="presentation"
      />
      <div
        className={clsx(
          "relative w-full bg-white shadow-xl",
          fullScreen ? "flex h-full max-w-none flex-col rounded-none" : "flex flex-col rounded-2xl",
          !fullScreen && widthClass,
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
        <div
          className={clsx(
            fullScreen
              ? "flex-1 overflow-auto px-4 py-4 sm:px-6 sm:py-6"
              : "max-h-[80vh] overflow-y-auto px-4 py-4",
            bodyClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
