import { atom } from 'jotai';

export type App = {
  loading: boolean;
  errorMessage: string | null;
};

export const appState = atom<App>({ loading: false, errorMessage: null });
