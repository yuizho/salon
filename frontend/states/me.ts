import { atom } from 'recoil';

export type Me = {
  roomId: string;
  userId: string;
};

export const myState = atom({
  key: 'myState',
  default: { roomId: '', userId: '' } as Me,
});
