import { GraphQLResult } from '@aws-amplify/api';
import { API } from 'aws-amplify';
import { FC } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { NETWORK_ERROR } from '../../graphql/error-message';
import { pick } from '../../graphql/mutations';
import { PickMutation, PickMutationVariables, Status } from '../../graphql/schema';
import { appState } from '../../states/app';
import { myState } from '../../states/me';
import { usersState } from '../../states/users';
import Card from '../atoms/Card';

type Props = {
  values: Array<string>;
};

type ComponentProps = Props & {
  onClick: (pickedCard: string) => Promise<boolean>;
};

const mutatePick = async (roomId: string, userId: string, pickedCard: string) => {
  const result = (await API.graphql({
    query: pick,
    variables: {
      room_id: roomId,
      user_id: userId,
      picked_card: pickedCard,
    } as PickMutationVariables,
  })) as GraphQLResult<PickMutation>;
  return result;
};

export const Component: FC<ComponentProps> = ({ values, onClick }) => (
  <div
    className={`
  flex flex-wrap gap-1
`}
  >
    {values.map((v) => (
      <Card key={v} value={v} shown choosable onClick={onClick} chosen={false} />
    ))}
  </div>
);

const Container: FC<Props> = ({ values }) => {
  const [me] = useRecoilState(myState);
  const setUsers = useSetRecoilState(usersState);
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
      const result = await mutatePick(roomId, userId, pickedCard);
      return result.data?.pick.user_id === userId ?? false;
    } catch (e) {
      setApp((app) => ({
        ...app,
        loading: false,
        errorMessage: NETWORK_ERROR,
      }));
      return false;
    }
  };

  return <Component values={values} onClick={onClickCard(me.roomId, me.userId)} />;
};

export default Container;
