import { Locale } from "../../types";
import { supportedLocales } from "../../i18n";

type Props = {
  locale: Locale;
  onChange: (locale: Locale) => void;
  label: string;
};

export const AppFooter = ({ locale, onChange, label }: Props) => {
  return (
    <footer className="mt-8 border-t border-grey-dark bg-grey-light">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 text-sm text-grey-text">
        <span>&copy; {new Date().getFullYear()} CYNOOPS</span>
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
    </footer>
  );
};
