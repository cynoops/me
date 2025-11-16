import { DogProfile } from "../../types";

type Props = {
  dog: DogProfile;
  labels: typeof import("../../assets/translations.json")["en"]["dogs"];
  divisionLabels: typeof import("../../assets/translations.json")["en"]["divisions"];
  indicationLabels: typeof import("../../assets/translations.json")["en"]["indications"];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  readonly: boolean;
};

export const DogCard = ({
  dog,
  labels,
  divisionLabels,
  indicationLabels,
  onEdit,
  onDelete,
  readonly,
}: Props) => {
  return (
    <article className="rounded-2xl border border-grey-dark bg-grey p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-brand">
            {dog.name || labels.name}
          </h3>
          <p className="text-sm text-grey-text">
            {dog.breed || labels.breed}
          </p>
        </div>
        {!readonly ? (
          <div className="flex gap-2">
            <button
              className="rounded-full border border-brand px-3 py-1 text-sm font-semibold text-brand hover:bg-brand-extraLight"
              onClick={() => onEdit(dog.id)}
              type="button"
            >
              {labels.edit}
            </button>
            <button
              className="rounded-full border border-error-light px-3 py-1 text-sm font-semibold text-error"
              onClick={() => onDelete(dog.id)}
              type="button"
            >
              {labels.delete}
            </button>
          </div>
        ) : null}
      </div>
      <dl className="mt-3 grid grid-cols-1 gap-3 text-sm text-grey-text sm:grid-cols-2">
        <InfoItem label={labels.age} value={dog.age} />
        <InfoItem
          label={labels.sex}
          value={labels.sexOptions[dog.sex]}
        />
        <InfoItem
          label={labels.castrated}
          value={
            dog.castrated
              ? labels.castrationOptions.yes
              : labels.castrationOptions.no
          }
        />
        <InfoItem
          label={labels.indication}
          value={indicationLabels[dog.indication]}
        />
      </dl>
      <div className="mt-3">
        <p className="text-xs uppercase tracking-wide text-grey-text">
          {labels.divisions}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {dog.divisions.length
            ? dog.divisions.map((division) => (
                <span
                  key={division}
                  className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand"
                >
                  {divisionLabels[division]}
                </span>
              ))
            : "—"}
        </div>
      </div>
      {dog.notes ? (
        <div className="mt-3 border-t border-grey-dark pt-3 text-sm text-grey-text">
          <p className="text-xs uppercase tracking-wide text-grey-text">
            {labels.notes}
          </p>
          <p className="whitespace-pre-line">{dog.notes}</p>
        </div>
      ) : null}
    </article>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-xs uppercase tracking-wide text-grey-text">{label}</dt>
    <dd className="text-base font-semibold text-brand">{value || "—"}</dd>
  </div>
);
