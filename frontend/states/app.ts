import { atom } from 'jotai';

export type App = {
  loading: boolean;
  errorMessage: string | null;
  language: 'ja' | 'en';
};

export const appState = atom<App>({
  loading: false,
  errorMessage: null,
  language: 'ja',
});
