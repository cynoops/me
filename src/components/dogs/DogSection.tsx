import { DogProfile } from "../../types";
import { DogCard } from "./DogCard";

type DogLabels = typeof import("../../assets/translations.json")["en"]["dogs"];
type DivisionLabels =
  typeof import("../../assets/translations.json")["en"]["divisions"];
type IndicationLabels =
  typeof import("../../assets/translations.json")["en"]["indications"];

type Props = {
  dogs: DogProfile[];
  labels: DogLabels;
  divisionLabels: DivisionLabels;
  indicationLabels: IndicationLabels;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
};

export const DogSection = ({
  dogs,
  labels,
  divisionLabels,
  indicationLabels,
  onAdd,
  onEdit,
  onDelete,
  isEditing,
}: Props) => {
  return (
    <section className="rounded-3xl border border-grey-dark bg-white p-4 shadow-md sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-brand">{labels.title}</h2>
        {isEditing ? (
          <button
            type="button"
            className="rounded-full bg-tertiary px-4 py-2 text-sm font-semibold text-tertiary-text hover:bg-tertiary-light"
            onClick={onAdd}
          >
            {labels.add}
          </button>
        ) : null}
      </div>
      {dogs.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-grey-dark bg-grey px-4 py-8 text-center text-sm text-grey-text">
          {labels.empty}
        </p>
      ) : (
        <div className="grid gap-4">
          {dogs.map((dog) => (
            <DogCard
              key={dog.id}
              dog={dog}
              labels={labels}
              divisionLabels={divisionLabels}
              indicationLabels={indicationLabels}
              onEdit={onEdit}
              onDelete={onDelete}
              readonly={!isEditing}
            />
          ))}
        </div>
      )}
    </section>
  );
};
