export type Locale = "en" | "de" | "fr";

export type HandlerProfile = {
  name: string;
  phone: string;
  organisation: string;
  organisationOther: string;
  unit: string;
  notes: string;
};

export type DogSex = "male" | "female" | "unknown";
export type DogIndication = "barking" | "recall" | "passive" | "other";
export type DogDivision =
  | "mantrailing"
  | "area"
  | "rubble"
  | "avalanche"
  | "water";

export type DogProfile = {
  id: string;
  name: string;
  age: string;
  breed: string;
  sex: DogSex;
  castrated: boolean;
  divisions: DogDivision[];
  indication: DogIndication;
  notes: string;
};
