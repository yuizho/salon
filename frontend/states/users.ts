import { atom } from 'recoil';
import { Status } from '../graphql/schema';

export type User = {
  userId: string;
  status: Status;
  pickedCard: string;
};

export const usersState = atom({
  key: 'usersState',
  default: [] as Array<User>,
});
