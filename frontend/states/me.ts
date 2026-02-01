import { atom } from 'jotai';

export type Me = {
  roomId: string;
  userId: string;
  userToken: string;
};

export const myState = atom<Me>({ roomId: '', userId: '', userToken: '' });
