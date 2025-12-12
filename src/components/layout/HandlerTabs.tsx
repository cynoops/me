import clsx from "clsx";

export type HandlerTab = {
  id: string;
  label: string;
};

type Props = {
  tabs: HandlerTab[];
  activeId: string;
  onSelect: (id: string) => void;
};

export const HandlerTabs = ({ tabs, activeId, onSelect }: Props) => {
  return (
    <nav className="mx-auto mt-4 w-full max-w-4xl px-4" aria-label="Handler tabs">
      <div className="flex flex-wrap gap-2 overflow-x-auto rounded-2xl border border-grey-dark bg-white p-2 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={clsx(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              tab.id === activeId
                ? "bg-brand text-white"
                : "bg-grey text-brand hover:bg-grey-dark hover:text-white",
            )}
            onClick={() => onSelect(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};
