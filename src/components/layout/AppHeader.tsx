import clsx from "clsx";
import { ReactNode } from "react";

type Mode = "edit" | "view";

type HeaderAction = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
};

type Props = {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  shareDisabledMessage: string;
  shareAction: HeaderAction;
  printAction: HeaderAction;
  children?: ReactNode;
  modeLabels: { edit: string; view: string };
};

export const AppHeader = ({
  mode,
  onModeChange,
  modeLabels,
  shareAction,
  printAction,
  shareDisabledMessage,
  children,
}: Props) => {
  const renderModeButton = (current: Mode, label: string) => (
    <button
      key={current}
      onClick={() => onModeChange(current)}
      className={clsx(
        "rounded-full px-4 py-1 text-sm font-semibold transition-colors",
        mode === current
          ? "bg-brand text-brand-text shadow"
          : "bg-grey-light text-brand hover:bg-brand-extraLight",
      )}
      type="button"
    >
      {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-grey-dark bg-grey backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {children}
          {shareDisabledMessage ? (
            <p className="text-xs text-grey-text">{shareDisabledMessage}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            {renderModeButton("edit", modeLabels.edit)}
            {renderModeButton("view", modeLabels.view)}
          </div>
          <div className="flex gap-2">
            <ActionButton {...shareAction} />
            <ActionButton {...printAction} />
          </div>
        </div>
      </div>
    </header>
  );
};

const ActionButton = ({ label, onClick, disabled, tooltip }: HeaderAction) => (
  <button
    type="button"
    className={clsx(
      "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
      disabled
        ? "bg-grey-dark text-grey-text opacity-60"
        : "bg-secondary text-secondary-text hover:bg-secondary-dark",
    )}
    disabled={disabled}
    onClick={onClick}
    title={disabled ? tooltip : undefined}
  >
    {label}
  </button>
);
