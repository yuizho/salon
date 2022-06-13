import { atom } from 'recoil';

export type App = {
  loading: boolean;
  errorMessage: string | null;
};

export const appState = atom({
  key: 'appState',
  default: { loading: false, errorMessage: null } as App,
});
