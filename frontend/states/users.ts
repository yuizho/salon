import { atom } from 'jotai';
import { Status } from '../graphql/schema';

export type User = {
  userId: string;
  status: Status;
  pickedCard: string;
};

export const usersState = atom<Array<User>>([]);