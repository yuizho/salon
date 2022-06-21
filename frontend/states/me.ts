import { atom } from 'recoil';

export type Me = {
  roomId: string;
  userId: string;
  userToken: string;
};

export const myState = atom({
  key: 'myState',
  default: { roomId: '', userId: '', userToken: '' } as Me,
});
