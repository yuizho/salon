import { selector } from 'recoil';
import { Status } from '../graphql/schema';
import { appState } from './app';
import { myState } from './me';
import { User, usersState } from './users';

export type Poker = {
  state: PokerState;
};

export type PokerState =
  | 'LOADING'
  | 'KICKED'
  | 'ALONE'
  | 'EVERYONE_CHOSEN'
  | 'CHOOSING'
  | 'WAITING_OTHERS';

const isKicked = (users: Array<User>, myUserId: string) => {
  const active = users
    .filter((user) => user.status !== Status.LEAVED)
    .some((user) => user.userId === myUserId);

  return !active;
};

const isAlone = (users: Array<User>, myUserId: string) =>
  users.filter((user) => user.status !== Status.LEAVED).every((user) => user.userId === myUserId);

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
    const app = get(appState);

    let state: PokerState;
    if (app.loading || users.length === 0) {
      state = 'LOADING';
    } else if (isKicked(users, me.userId)) {
      state = 'KICKED';
    } else if (isAlone(users, me.userId)) {
      state = 'ALONE';
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
