# ME - CYNOOPS Legacy App

Digital registration card for rescue dog teams. The `_old` directory contains the original single-page web app that collects handler information, tracks multiple dogs, and provides quick ways to share those records in the field.

## How the App Is Used
1. Enter the handler profile (name, phone, organisation, unit, notes) and switch between edit/read-only modes via the header controls.
2. Add each working dog, capture its characteristics, division specialties, and indication style, and keep details synced through the per-dog modal editor.
3. Once the profile has at least a name and phone number, use the QR or print actions in the header to distribute the data on-scene without retyping it.

## Feature Breakdown

### Handler Profile & Local Persistence
- Profile form captures the handler’s contact info, organisation (pre-defined list plus “Other”), unit information, and free-form notes (`src/components/app/profile/AppProfile.tsx`).
- Data is mirrored to `localStorage` as the user types so refreshing the page restores the latest values (`src/store/AppState.ts`).
- The edit/view toggle in the header swaps between input fields and read-only text to minimize accidental changes (`src/components/app/root/AppRoot.tsx`).

### Dog Roster Management
- “Add Dog” inserts a blank dog entry and immediately opens its modal editor so new teams can fill out details without scrolling (`src/components/app/root/AppRoot.tsx` and `src/components/app/dog/AppDog.tsx`).
- Each dog stores name, age, breed, sex, castration status, free-form notes, and one or more divisions (Mantrailing, Area, Rubble, Avalanche, Water) with an indication style (Barking, Recall/Refind, Passive, Other).
- Deleting a dog asks for confirmation before removing it from state/localStorage (`src/components/app/dog/AppDog.tsx`).

### QR Code Generation
- The QR icon in the header stays disabled until the profile contains a name and phone number; this prevents sharing incomplete cards (`src/components/app/root/AppRoot.tsx`).
- When activated, the app serializes the full profile and dog list into JSON, feeds it to the `qrcode-generator` library, and displays the SVG output inside a modal dialog for easy scanning on any device.
- Clicking outside the dialog closes it, keeping the QR overlay lightweight for mobile use.

### Printable Registration Card
- The print icon follows the same completion guard as the QR feature.
- Clicking it opens a new window with a compact HTML template (profile summary plus an unordered list of dogs, formatted for A6 paper) and immediately triggers `window.print()` (`src/components/app/root/AppRoot.tsx`).
- This pathway enables teams to hand out a physical copy whenever digital sharing is not practical.

### Multilingual Interface
- Translations for English, German, and French live in `src/assets/translations.json` and load on startup (`src/global/app.ts`).
- The footer language selector updates the UI instantly and stores the chosen locale in `localStorage`, while the translation JSON is cached locally for offline use (`src/store/Translations.ts`).

### Offline-Friendly Data Storage
- All critical state (profile, dogs, translations, preferred language) persists in the browser via `localStorage`, so the tool keeps working without a network connection and survives page reloads (`src/store/AppState.ts`, `src/store/Translations.ts`).
- No remote database is required; the QR code and print flows rely solely on local data.

### Hosting & Distribution
- Deployment targets Firebase Hosting site `com-cynoops-me`; `firebase.json` serves the built `www` directory and rewrites every route to `index.html`, enabling client-side routing.
- `.firebaserc` maps the local project to the Firebase site, so `firebase deploy` publishes the legacy build to https://com-cynoops-me.web.app/ (or the configured custom domain).

### Progressive Web App Touches
- `src/index.html` references a web manifest (`src/manifest.json`) and the icon set under `src/assets/icon`, enabling “Add to Home Screen” behaviour with standalone display mode.
- Icons for editing, viewing, QR generation, and printing reside in `src/assets/icons`, keeping the interface self-explanatory even without text labels.

## Key Takeaways
- The legacy app is a self-contained, offline-capable registration card focused on field usability.
- It offers three distribution channels for the same data set: on-screen read-only view, scannable QR code, and printable summary.
- Firebase Hosting plus a pre-built `www` output keeps deployment simple while translations and local persistence make day-to-day use friendly for international teams.

---

## React + Tailwind Rebuild (current work)
The root of this repository now contains a mobile-first React + Vite implementation that mirrors the legacy behaviour while using TailwindCSS for styling and localStorage for offline readiness.

### Commands
1. `npm install`
2. `npm run dev` – start the Vite dev server on http://localhost:5173
3. `npm run build` – type-check and create a production build under `dist/`
4. `npm run preview` – serve the production build locally for smoke tests
