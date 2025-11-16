import { DogProfile, HandlerProfile } from "../types";

export const emptyProfile = (): HandlerProfile => ({
  name: "",
  phone: "",
  organisation: "",
  organisationOther: "",
  unit: "",
  notes: "",
});

const fallbackId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const createDogProfile = (): DogProfile => ({
  id: fallbackId(),
  name: "",
  age: "",
  breed: "",
  sex: "unknown",
  castrated: false,
  divisions: [],
  indication: "barking",
  notes: "",
});
