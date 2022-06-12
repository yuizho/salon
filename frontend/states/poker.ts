import { selector } from 'recoil';
import { Status } from '../graphql/schema';
import { myState } from './me';
import { User, usersState } from './users';

export type Poker = {
  state: PokerState;
};

type PokerState = 'KICKED' | 'EVERYONE_CHOSEN' | 'CHOOSING' | 'WAITING_OTHERS';

const isKicked = (users: Array<User>, myUserId: string) => {
  const active = users
    .filter((user) => user.status !== Status.LEAVED)
    .some((user) => user.userId === myUserId);

  return !active;
};

const isEveryoneChosen = (users: Array<User>) =>
  users
    .filter((user) => user.status !== Status.LEAVED)
    .every((user) => user.status === Status.CHOSEN);

const isChoosing = (users: Array<User>, myUserId: string) =>
  users.filter((user) => user.status === Status.CHOOSING).some((user) => user.userId === myUserId);

export const pokerState = selector({
  key: 'pokerState',
  get: ({ get }) => {
    const users = get(usersState);
    const me = get(myState);

    let state: PokerState;
    if (isKicked(users, me.userId)) {
      state = 'KICKED';
    } else if (isEveryoneChosen(users)) {
      state = 'EVERYONE_CHOSEN';
    } else if (isChoosing(users, me.userId)) {
      state = 'CHOOSING';
    } else {
      state = 'WAITING_OTHERS';
    }

    return { state } as Poker;
  },
});
