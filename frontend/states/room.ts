import { atom } from 'recoil';

export type Room = {
  expirationUnixTimestamp: number;
};

export const roomState = atom({
  key: 'roomState',
  default: { expirationUnixTimestamp: 0 } as Room,
});
