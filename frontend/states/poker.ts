import { selector } from 'recoil';
import { Status } from '../graphql/schema';
import { usersState } from './users';

export type Poker = {
  shown: boolean;
};

export const pokerState = selector({
  key: 'pokerState',
  get: ({ get }) => {
    const users = get(usersState);
    const shown = users
      .filter((user) => user.status !== Status.LEAVED)
      .every((user) => user.status === Status.CHOSEN);

    return { shown } as Poker;
  },
});
