import { createStore } from '@stencil/store';

export interface TranslationsData {
  [lang: string]: { [key: string]: string };
}

interface TranslationState {
  translations: TranslationsData;
  language: string;
}

const { state } = createStore<TranslationState>({
  translations: {},
  language: localStorage.getItem('language') || 'en'
});

export const translationState = state;

export async function loadTranslations() {
  const stored = localStorage.getItem('translations');
  if (stored) {
    try {
      state.translations = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored translations', e);
    }
  }

  try {
    const resp = await fetch('/assets/translations.json');
    if (resp.ok) {
      const data = await resp.json();
      state.translations = data;
      localStorage.setItem('translations', JSON.stringify(data));
    }
  } catch (e) {
    console.error('Failed to fetch translations', e);
  }
}

export function setLanguage(lang: string) {
  state.language = lang;
  localStorage.setItem('language', lang);
}

export function t(key: string, def?: string): string {
  const langData = state.translations[state.language] || {};
  return langData[key] ?? def ?? key;
}

if (typeof window !== 'undefined') {
  (window as any)._t = t;
}
