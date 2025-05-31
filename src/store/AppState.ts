import { createStore } from '@stencil/store';

export interface IProfile {
  name: string;
  phone: string;
  organisation: string;
  unitName: string;
  notes: string;
}

export interface IDog {
  name: string;
  age: number;
  breed: string;
  sex: 'm' | 'f';
  division: 'mantrailing' | 'area' | 'rubble' | 'avalanche' | 'water',
  indication: 'bark' | 'recall-refind' | 'passive' | 'other',
  notes: string;
  castrated: boolean;
}

interface AppState {
  mode: 'edit' | 'view' | 'code',
  profile: IProfile | null,
  dogs: IDog[] | [],
}

const { state, onChange } = createStore<AppState>({
  mode: 'view',
  profile: null,
  dogs: [],
});

const loadProfileFromLocalStorage = (): IProfile | null => {
  const profileData = localStorage.getItem('profile');
  if (profileData) {
    try {
      state.profile = JSON.parse(profileData) as IProfile;
      console.log(state.profile);
    } catch (error) {
      console.error('Failed to parse profile from localStorage:', error);
      return null;
    }
  }
  return null;
};
loadProfileFromLocalStorage();

const loadDogsFromLocalStorage = (): IDog[] | [] => {
  const dogsData = localStorage.getItem('dogs');
  if (dogsData) {
    try {
      state.dogs = JSON.parse(dogsData) as IDog[];
      console.log(state.dogs);
    } catch (error) {
      console.error('Failed to parse dogs from localStorage:', error);
      return null;
    }
  }
  return null;
};
loadDogsFromLocalStorage();

onChange('mode', (newMode) => {
  console.log(`App mode changed to: ${newMode}`);
});
onChange('profile', (newProfile) => {
  console.log(`Profile updated:`, newProfile);
  localStorage.setItem('profile', JSON.stringify(newProfile));
});
onChange('dogs', (newDogs) => {
  console.log(`Dogs list updated:`, newDogs);
  localStorage.setItem('dogs', JSON.stringify(newDogs));
});

export { state as appState, onChange as onAppStateChange };