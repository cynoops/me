import { useEffect, useState } from "react";
import { DIVISIONS, INDICATIONS, SEX_OPTIONS } from "../../constants";
import { DogProfile } from "../../types";
import { Modal } from "../shared/Modal";

type DogLabels = typeof import("../../assets/translations.json")["en"]["dogs"];
type DivisionLabels =
  typeof import("../../assets/translations.json")["en"]["divisions"];
type IndicationLabels =
  typeof import("../../assets/translations.json")["en"]["indications"];
type ModalLabels =
  typeof import("../../assets/translations.json")["en"]["modal"];

type Props = {
  dog: DogProfile | null;
  open: boolean;
  onClose: () => void;
  onSave: (dog: DogProfile) => void;
  dogLabels: DogLabels;
  modalLabels: ModalLabels;
  divisionLabels: DivisionLabels;
  indicationLabels: IndicationLabels;
};

export const DogModal = ({
  dog,
  open,
  onClose,
  onSave,
  dogLabels,
  modalLabels,
  divisionLabels,
  indicationLabels,
}: Props) => {
  const [draft, setDraft] = useState<DogProfile | null>(dog);

  useEffect(() => {
    setDraft(dog);
  }, [dog]);

  if (!dog || !draft) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(draft);
  };

  const updateField = <K extends keyof DogProfile>(
    key: K,
    value: DogProfile[K],
  ) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const toggleDivision = (division: (typeof DIVISIONS)[number]) => {
    if (!draft) return;
    const exists = draft.divisions.includes(division);
    updateField(
      "divisions",
      exists
        ? draft.divisions.filter((entry) => entry !== division)
        : [...draft.divisions, division],
    );
  };

  return (
    <Modal open={open} onClose={onClose} title={modalLabels.title} widthClass="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={dogLabels.name}
            value={draft.name}
            onChange={(value) => updateField("name", value)}
          />
          <Input
            label={dogLabels.age}
            value={draft.age}
            onChange={(value) => updateField("age", value)}
          />
          <Input
            label={dogLabels.breed}
            value={draft.breed}
            onChange={(value) => updateField("breed", value)}
          />
          <label className="grid gap-1 text-sm font-medium">
            <span>{dogLabels.sex}</span>
            <select
              className="rounded-lg border border-grey-dark bg-grey-light px-3 py-2 text-base shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
              value={draft.sex}
              onChange={(event) =>
                updateField("sex", event.target.value as DogProfile["sex"])
              }
            >
              {SEX_OPTIONS.map((sex) => (
                <option key={sex} value={sex}>
                  {dogLabels.sexOptions[sex]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium">
            <span>{dogLabels.castrated}</span>
            <select
              className="rounded-lg border border-grey-dark bg-grey-light px-3 py-2 text-base shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
              value={draft.castrated ? "yes" : "no"}
              onChange={(event) =>
                updateField("castrated", event.target.value === "yes")
              }
            >
              <option value="yes">{dogLabels.castrationOptions.yes}</option>
              <option value="no">{dogLabels.castrationOptions.no}</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium">
            <span>{dogLabels.indication}</span>
            <select
              className="rounded-lg border border-grey-dark bg-grey-light px-3 py-2 text-base shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
              value={draft.indication}
              onChange={(event) =>
                updateField(
                  "indication",
                  event.target.value as DogProfile["indication"],
                )
              }
            >
              {INDICATIONS.map((indication) => (
                <option key={indication} value={indication}>
                  {indicationLabels[indication]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <p className="text-sm font-medium text-brand">
            {dogLabels.divisions}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DIVISIONS.map((division) => {
              const selected = draft.divisions.includes(division);
              return (
                <button
                  key={division}
                  type="button"
                  onClick={() => toggleDivision(division)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    selected
                      ? "border-brand bg-brand text-brand-text"
                      : "border-grey-dark bg-grey-light text-brand"
                  }`}
                >
                  {divisionLabels[division]}
                </button>
              );
            })}
          </div>
        </div>
        <label className="grid gap-1 text-sm font-medium text-brand">
          <span>{dogLabels.notes}</span>
          <textarea
            className="min-h-[80px] rounded-lg border border-grey-dark bg-grey-light px-3 py-2 text-base shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
            value={draft.notes}
            onChange={(event) => updateField("notes", event.target.value)}
          />
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            className="rounded-full border border-grey-dark px-4 py-2 text-sm font-semibold text-grey-text"
            onClick={onClose}
          >
            {modalLabels.cancel}
          </button>
          <button
            type="submit"
            className="rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-secondary-text hover:bg-secondary-dark"
          >
            {modalLabels.save}
          </button>
        </div>
      </form>
    </Modal>
  );
};

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const Input = ({ label, value, onChange }: InputProps) => (
  <label className="grid gap-1 text-sm font-medium text-brand">
    <span>{label}</span>
    <input
      className="rounded-lg border border-grey-dark bg-grey-light px-3 py-2 text-base shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </label>
);
