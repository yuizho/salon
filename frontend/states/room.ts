import { atom } from 'jotai';

export type Room = {
  expirationUnixTimestamp: number;
};

export const roomState = atom<Room>({ expirationUnixTimestamp: 0 });