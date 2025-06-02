import { createStore } from '@stencil/store';

export interface IProfile {
  name: string;
  phone: string;
  organisation: string | null;
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

const loadProfileFromLocalStorage = () => {
  const profileData = localStorage.getItem('profile');
  if (profileData) {
    try {
      state.profile = JSON.parse(profileData) as IProfile;
    } catch (error) {
      console.error('Failed to parse profile from localStorage:', error);
      return null;
    }
  } else {
    state.profile = {
      name: '',
      phone: '',
      organisation: null,
      unitName: '',
      notes: '',
    }
  }
};
loadProfileFromLocalStorage();

const loadDogsFromLocalStorage = () => {
  const dogsData = localStorage.getItem('dogs');
  if (dogsData) {
    try {
      state.dogs = JSON.parse(dogsData) as IDog[];
    } catch (error) {
      console.error('Failed to parse dogs from localStorage:', error);
      return null;
    }
  }
  return null;
};
loadDogsFromLocalStorage();

onChange('profile', (newProfile) => {
  localStorage.setItem('profile', JSON.stringify(newProfile));
});
onChange('dogs', (newDogs) => {
  localStorage.setItem('dogs', JSON.stringify(newDogs));
});

export { state as appState, onChange as onAppStateChange };