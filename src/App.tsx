import { useMemo, useState } from "react";
import { TranslationProvider, useTranslation } from "./i18n";
import { usePersistentState } from "./hooks/usePersistentState";
import { HandlerProfile, DogProfile } from "./types";
import { createDogProfile, emptyProfile } from "./state/defaults";
import { AppHeader } from "./components/layout/AppHeader";
import { ProfileSection } from "./components/profile/ProfileSection";
import { DogSection } from "./components/dogs/DogSection";
import { AppFooter } from "./components/layout/AppFooter";
import { DogModal } from "./components/dogs/DogModal";
import { QrModal } from "./components/qr/QrModal";
import { buildPrintMarkup } from "./lib/print";

type Mode = "edit" | "view";

const PROFILE_KEY = "me-profile";
const DOGS_KEY = "me-dogs";

const AppShell = () => {
  const [profile, setProfile] = usePersistentState<HandlerProfile>(
    PROFILE_KEY,
    emptyProfile,
  );
  const [dogs, setDogs] = usePersistentState<DogProfile[]>(DOGS_KEY, []);
  const [mode, setMode] = useState<Mode>("view");
  const [activeDogId, setActiveDogId] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);

  const { translations, locale, setLocale } = useTranslation();

  const shareReady =
    profile.name.trim().length > 0 && profile.phone.trim().length > 0;

  const activeDog = useMemo(
    () => dogs.find((dog) => dog.id === activeDogId) ?? null,
    [activeDogId, dogs],
  );

  const handleProfileChange = (next: HandlerProfile) => setProfile(next);

  const handleAddDog = () => {
    const newDog = createDogProfile();
    setDogs((prev) => [...prev, newDog]);
    setActiveDogId(newDog.id);
  };

  const handleEditDog = (id: string) => setActiveDogId(id);

  const handleSaveDog = (updated: DogProfile) => {
    setDogs((prev) =>
      prev.map((dog) => (dog.id === updated.id ? updated : dog)),
    );
    setActiveDogId(null);
  };

  const handleDeleteDog = (id: string) => {
    if (!window.confirm(translations.messages.deleteDog)) {
      return;
    }
    setDogs((prev) => prev.filter((dog) => dog.id !== id));
  };

  const closeDogModal = () => setActiveDogId(null);

  const handlePrint = () => {
    if (!shareReady) return;
    const printWindow = window.open("", "_blank", "noopener");
    if (!printWindow) return;

    const markup = buildPrintMarkup(profile, dogs, translations);
    printWindow.document.open();
    printWindow.document.write(markup);
    printWindow.document.close();
    printWindow.focus();
  };

  return (
    <>
      <AppHeader
        mode={mode}
        onModeChange={setMode}
        modeLabels={{
          edit: translations.header.edit,
          view: translations.header.view,
        }}
        shareDisabledMessage={shareReady ? "" : translations.messages.profileIncomplete}
        shareAction={{
          label: translations.header.shareQr,
          onClick: () => setShowQr(true),
          disabled: !shareReady,
          tooltip: translations.messages.profileIncomplete,
        }}
        printAction={{
          label: translations.header.print,
          onClick: handlePrint,
          disabled: !shareReady,
          tooltip: translations.messages.profileIncomplete,
        }}
      >
        <h1 className="text-xl font-bold text-brand">{translations.app.title}</h1>
        <p className="text-sm text-grey-text">{translations.app.tagline}</p>
      </AppHeader>
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6">
        <ProfileSection
          profile={profile}
          onChange={handleProfileChange}
          isEditing={mode === "edit"}
          labels={{
            title: translations.profile.title,
            name: translations.profile.name,
            phone: translations.profile.phone,
            organisation: translations.profile.organisation,
            organisationOther: translations.profile.organisationOther,
            unit: translations.profile.unit,
            notes: translations.profile.notes,
          }}
        />
        <DogSection
          dogs={dogs}
          labels={translations.dogs}
          divisionLabels={translations.divisions}
          indicationLabels={translations.indications}
          onAdd={handleAddDog}
          onEdit={handleEditDog}
          onDelete={handleDeleteDog}
          isEditing={mode === "edit"}
        />
      </main>
      <AppFooter
        locale={locale}
        onChange={setLocale}
        label={translations.footer.language}
      />
      <DogModal
        dog={activeDog}
        open={Boolean(activeDog)}
        onClose={closeDogModal}
        onSave={handleSaveDog}
        dogLabels={translations.dogs}
        modalLabels={translations.modal}
        divisionLabels={translations.divisions}
        indicationLabels={translations.indications}
      />
      <QrModal
        open={showQr}
        onClose={() => setShowQr(false)}
        profile={profile}
        dogs={dogs}
        title={translations.header.shareQr}
        description={translations.app.tagline}
      />
    </>
  );
};

const App = () => (
  <TranslationProvider>
    <AppShell />
  </TranslationProvider>
);

export default App;
