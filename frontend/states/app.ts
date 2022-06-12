import { atom } from 'recoil';

export type App = {
  loading: boolean;
};

export const appState = atom({
  key: 'appState',
  default: { loading: false } as App,
});
