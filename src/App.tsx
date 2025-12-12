import { useEffect, useMemo, useState } from "react";
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
import { HandlerTabs } from "./components/layout/HandlerTabs";
import { QrScannerModal } from "./components/qr/QrScannerModal";
import { Modal } from "./components/shared/Modal";

type Mode = "edit" | "view";

type SharedHandler = {
  id: string;
  profile: HandlerProfile;
  dogs: DogProfile[];
};

type HandlerView = SharedHandler & {
  label: string;
  editable: boolean;
};

const PROFILE_KEY = "me-profile";
const DOGS_KEY = "me-dogs";
const SCANNED_HANDLERS_KEY = "me-scanned-handlers";

const AppShell = () => {
  const [profile, setProfile] = usePersistentState<HandlerProfile>(
    PROFILE_KEY,
    emptyProfile,
  );
  const [dogs, setDogs] = usePersistentState<DogProfile[]>(DOGS_KEY, []);
  const [mode, setMode] = useState<Mode>("view");
  const [activeDogId, setActiveDogId] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showRemoveHandlerConfirm, setShowRemoveHandlerConfirm] = useState(false);
  const [scannedHandlers, setScannedHandlers] = usePersistentState<
    SharedHandler[]
  >(SCANNED_HANDLERS_KEY, []);
  const [activeHandlerId, setActiveHandlerId] = useState<string>("me");
  const [scanError, setScanError] = useState<string | null>(null);

  const { translations, locale, setLocale } = useTranslation();

  const generateId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const handlerTabs: HandlerView[] = useMemo(
    () => [
      {
        id: "me",
        label: translations.tabs.me,
        profile,
        dogs,
        editable: mode === "edit",
      },
      ...scannedHandlers.map((handler) => ({
        ...handler,
        label:
          handler.profile.name.trim() || translations.tabs.unnamedHandler,
        editable: false,
      })),
    ],
    [dogs, mode, profile, scannedHandlers, translations.tabs],
  );

  useEffect(() => {
    if (!handlerTabs.some((tab) => tab.id === activeHandlerId)) {
      setActiveHandlerId("me");
    }
  }, [activeHandlerId, handlerTabs]);

  const activeHandler =
    handlerTabs.find((tab) => tab.id === activeHandlerId) ?? handlerTabs[0];

  const shareReady =
    activeHandler.profile.name.trim().length > 0 &&
    activeHandler.profile.phone.trim().length > 0;

  const activeDog = useMemo(
    () =>
      activeHandler.id === "me"
        ? dogs.find((dog) => dog.id === activeDogId) ?? null
        : null,
    [activeDogId, activeHandler.id, dogs],
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

  const handleRemoveActiveHandler = () => {
    if (isOwnProfile) return;

    setScannedHandlers((prev) =>
      prev.filter((handler) => handler.id !== activeHandler.id),
    );
    setActiveHandlerId("me");
    setShowRemoveHandlerConfirm(false);
  };

  const confirmRemoveHandler = () => {
    if (isOwnProfile) return;
    setShowRemoveHandlerConfirm(true);
  };

  const handlePrint = () => {
    if (!shareReady) return;
    const printWindow = window.open("", "_blank", "noopener");
    if (!printWindow) return;

    const markup = buildPrintMarkup(
      activeHandler.profile,
      activeHandler.dogs,
      translations,
    );
    printWindow.document.open();
    printWindow.document.write(markup);
    printWindow.document.close();
    printWindow.focus();
  };

  const handleScanPayload = (payload: string) => {
    setScanError(null);
    try {
      const parsed = JSON.parse(payload) as {
        profile?: HandlerProfile;
        dogs?: DogProfile[];
      };

      if (!parsed.profile || !parsed.dogs) {
        throw new Error("Invalid payload");
      }

      const existing = scannedHandlers.find(
        (handler) =>
          handler.profile.name === parsed.profile?.name &&
          handler.profile.phone === parsed.profile?.phone,
      );

      if (existing) {
        setScannedHandlers((prev) =>
          prev.map((handler) =>
            handler.id === existing.id
              ? { ...handler, profile: parsed.profile!, dogs: parsed.dogs! }
              : handler,
          ),
        );
        setActiveHandlerId(existing.id);
      } else {
        const id = generateId();
        setScannedHandlers((prev) => [
          ...prev,
          { id, profile: parsed.profile!, dogs: parsed.dogs! },
        ]);
        setActiveHandlerId(id);
      }

      setShowScanner(false);
    } catch (error) {
      console.error("Invalid QR payload", error);
      setScanError(translations.messages.scanInvalid);
    }
  };

  const activeProfile = activeHandler.profile;
  const activeDogs = activeHandler.dogs;
  const isOwnProfile = activeHandler.id === "me";
  const isEditingActive = isOwnProfile && mode === "edit";

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
      <HandlerTabs
        tabs={handlerTabs.map(({ id, label }) => ({ id, label }))}
        activeId={activeHandler.id}
        onSelect={setActiveHandlerId}
      />
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6">
        <ProfileSection
          profile={activeProfile}
          onChange={isOwnProfile ? handleProfileChange : () => {}}
          isEditing={isEditingActive}
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
          dogs={activeDogs}
          labels={translations.dogs}
          divisionLabels={translations.divisions}
          indicationLabels={translations.indications}
          onAdd={isOwnProfile ? handleAddDog : () => {}}
          onEdit={isOwnProfile ? handleEditDog : () => {}}
          onDelete={isOwnProfile ? handleDeleteDog : () => {}}
          isEditing={isEditingActive}
        />
        {!isOwnProfile ? (
          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-full border border-error-light px-4 py-2 text-sm font-semibold text-error hover:bg-error-light/10"
              onClick={confirmRemoveHandler}
            >
              {translations.handlers.remove}
            </button>
          </div>
        ) : null}
      </main>
      <AppFooter
        locale={locale}
        onChange={setLocale}
        label={translations.footer.language}
        scanLabel={translations.footer.scanQr}
        onScan={() => {
          setScanError(null);
          setShowScanner(true);
        }}
      />
      <DogModal
        dog={activeDog}
        open={Boolean(activeDog) && isOwnProfile}
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
        profile={activeProfile}
        dogs={activeDogs}
        title={translations.header.shareQr}
        description={translations.app.tagline}
      />
      <QrScannerModal
        open={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleScanPayload}
        title={translations.scanner.title}
        description={translations.scanner.description}
        errorMessage={
          scanError ?? translations.messages.scanPermission
        }
      />
      <Modal
        open={showRemoveHandlerConfirm}
        onClose={() => setShowRemoveHandlerConfirm(false)}
        title={translations.handlers.remove}
      >
        <div className="flex flex-col gap-4">
          <p className="text-base text-brand">{translations.messages.deleteHandler}</p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded-full border border-grey-dark px-4 py-2 text-sm font-semibold text-grey-text"
              onClick={() => setShowRemoveHandlerConfirm(false)}
            >
              {translations.modal.cancel}
            </button>
            <button
              type="button"
              className="rounded-full bg-error px-5 py-2 text-sm font-semibold text-white hover:bg-error-dark"
              onClick={handleRemoveActiveHandler}
            >
              {translations.handlers.remove}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const App = () => (
  <TranslationProvider>
    <AppShell />
  </TranslationProvider>
);

export default App;
