import { DogDivision, DogIndication, DogSex } from "./types";

export const ORGANISATIONS = [
  { id: "drv", name: "DRV" },
  { id: "drk", name: "DRK" },
  { id: "asb", name: "ASB" },
  { id: "dlrg", name: "DLRG" },
  { id: "brh", name: "BRH" },
  { id: "bzrh", name: "BZRH" },
  { id: "malteser", name: "Malteser" },
  { id: "johanniter", name: "Johanniter" },
] as const;

export const getOrganisationLabel = (id: string) =>
  ORGANISATIONS.find((organisation) => organisation.id === id)?.name;

export const DIVISIONS: DogDivision[] = [
  "mantrailing",
  "area",
  "rubble",
  "avalanche",
  "water",
];

export const INDICATIONS: DogIndication[] = [
  "barking",
  "recall",
  "passive",
  "other",
];

export const SEX_OPTIONS: DogSex[] = ["male", "female", "unknown"];
