import { Locale } from "../../types";
import { supportedLocales } from "../../i18n";

type Props = {
  locale: Locale;
  onChange: (locale: Locale) => void;
  label: string;
  scanLabel?: string;
  onScan?: () => void;
};

export const AppFooter = ({
  locale,
  onChange,
  label,
  scanLabel,
  onScan,
}: Props) => {
  return (
    <footer className="mt-8 border-t border-grey-dark bg-grey-light">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-4 text-sm text-grey-text sm:flex-row sm:items-center sm:justify-between">
        <span>&copy; {new Date().getFullYear()} CYNOOPS</span>
        <div className="flex flex-wrap items-center gap-3">
          {onScan && scanLabel ? (
            <button
              type="button"
              onClick={onScan}
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
            >
              {scanLabel}
            </button>
          ) : null}
          <label className="flex items-center gap-2">
            <span>{label}</span>
            <select
              className="rounded-md border border-grey-dark bg-white px-2 py-1 text-sm"
              value={locale}
              onChange={(event) => onChange(event.target.value as Locale)}
            >
              {supportedLocales.map((code) => (
                <option key={code} value={code}>
                  {code.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </footer>
  );
};
