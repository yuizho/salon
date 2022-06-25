import { FC } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import * as Sentry from '@sentry/nextjs';
import pick from '../../graphql/clients/pick';
import { NETWORK_ERROR } from '../../graphql/error-message';
import { Status } from '../../graphql/schema';
import { appState } from '../../states/app';
import { myState } from '../../states/me';
import { pokerState } from '../../states/poker';
import { usersState } from '../../states/users';
import Card from '../atoms/Card';

type Props = {
  values: Array<string>;
};

type ComponentProps = Props & {
  glow: boolean;
  choosable: boolean;
  onClick: (pickedCard: string) => Promise<boolean>;
};

export const Component: FC<ComponentProps> = ({ values, glow, choosable, onClick }) => (
  <div className="flex flex-wrap justify-center gap-2">
    {values.map((v) => (
      <Card
        key={v}
        value={v}
        shown
        choosable={choosable}
        onClick={onClick}
        chosen={false}
        glow={glow}
      />
    ))}
  </div>
);

const Container: FC<Props> = ({ values }) => {
  const [me] = useRecoilState(myState);
  const setUsers = useSetRecoilState(usersState);
  const poker = useRecoilValue(pokerState);
  const setApp = useSetRecoilState(appState);

  const onClickCard = (roomId: string, userId: string) => async (pickedCard: string) => {
    setApp((app) => ({ ...app, loading: true }));

    // update user state before sending request to GraphQL API
    // to show the result of user operation as soon as possible.
    setUsers((currentUsers) => {
      const users = [
        ...currentUsers.filter((u) => u.userId !== userId),
        {
          userId,
          status: Status.CHOSEN,
          pickedCard,
        },
      ];
      users.sort((a, b) => (a.userId > b.userId ? 1 : -1));
      return users;
    });

    try {
      const result = await pick(roomId, userId, me.userToken, pickedCard);
      return result.data?.pick.user_id === userId ?? false;
    } catch (e) {
      Sentry.captureException(e);
      setApp((app) => ({
        ...app,
        loading: false,
        errorMessage: NETWORK_ERROR,
      }));
      return false;
    }
  };

  return (
    <Component
      values={values}
      glow={poker.state === 'CHOOSING'}
      choosable={poker.state !== 'KICKED'}
      onClick={onClickCard(me.roomId, me.userId)}
    />
  );
};

export default Container;
