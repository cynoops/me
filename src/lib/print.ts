import { DogProfile, HandlerProfile } from "../types";
import { Translations } from "../i18n";

const formatOrganisation = (profile: HandlerProfile) => {
  if (profile.organisation === "other" || !profile.organisation) {
    return profile.organisationOther;
  }

  return profile.organisation;
};

export const buildPrintMarkup = (
  profile: HandlerProfile,
  dogs: DogProfile[],
  translations: Translations,
) => {
  const styles = `
    @page {
      size: A4;
      margin: 12mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: Inter, Arial, sans-serif;
      font-size: 12px;
      margin: 0 auto;
      width: 180mm;
      color: #0f172a;
      padding: 8mm;
      background: #f8fafc;
    }
    h1 { font-size: 20px; margin-bottom: 4px; }
    h2 { font-size: 15px; margin: 16px 0 8px; }
    .card { border: 1px solid #cbd5f5; border-radius: 12px; padding: 16px; margin-bottom: 12px; background: #fff; }
    .muted { color: #475569; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; }
    .dogs { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
    .dogs li { padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
    .dogs li:last-child { border-bottom: none; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 6px; }
    .grid-item { font-size: 12px; }
    strong { color: #0f172a; }
    @media print {
      body { background: #fff; }
    }
  `;

  const organisation = formatOrganisation(profile) || "—";

  const dogItems = dogs
    .map(
      (dog) => `
        <li>
          <strong>${dog.name || translations.dogs.name}</strong> — ${
        dog.breed || translations.dogs.breed
      }<br />
          ${translations.dogs.age}: ${dog.age || "—"} |
          ${translations.dogs.sex}: ${
        translations.dogs.sexOptions[dog.sex]
      } |
          ${translations.dogs.castrated}: ${
        dog.castrated
          ? translations.dogs.castrationOptions.yes
          : translations.dogs.castrationOptions.no
      }<br />
          ${translations.dogs.divisions}: ${
        dog.divisions
          .map((division) => translations.divisions[division])
          .join(", ") || "—"
      }<br />
          ${translations.dogs.indication}: ${
        translations.indications[dog.indication]
      }<br />
          ${translations.dogs.notes}: ${dog.notes || "—"}
        </li>
      `,
    )
    .join("");

  return `<!doctype html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${translations.app.title}</title>
      <style>${styles}</style>
    </head>
    <body>
      <section class="card">
        <h1>${translations.app.title}</h1>
        <p class="muted">${translations.app.tagline}</p>
        <p><strong>${translations.profile.name}:</strong> ${profile.name ||
    "—"}</p>
        <p><strong>${translations.profile.phone}:</strong> ${profile.phone ||
    "—"}</p>
        <p><strong>${translations.profile.organisation}:</strong> ${organisation}</p>
        <p><strong>${translations.profile.unit}:</strong> ${profile.unit || "—"}</p>
        <p><strong>${translations.profile.notes}:</strong> ${profile.notes || "—"}</p>
      </section>
      <section class="card">
        <h2>${translations.dogs.title}</h2>
        <ul class="dogs">${dogItems || `<li>${translations.dogs.empty}</li>`}</ul>
      </section>
      <script>
        (function () {
          const trigger = () => {
            window.focus();
            window.print();
          };

          if (document.readyState === "complete") {
            trigger();
          } else {
            window.addEventListener("load", trigger, { once: true });
          }
        })();
      </script>
    </body>
  </html>`;
};
