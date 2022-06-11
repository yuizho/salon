import { FC } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import API, { GraphQLResult } from '@aws-amplify/api';
import {
  RefreshTableMutation,
  RefreshTableMutationVariables,
  Status,
} from '../../graphql/schema';
import { Poker, pokerState } from '../../states/poker';
import { User, usersState } from '../../states/users';
import { Me, myState } from '../../states/me';
import Button from '../atoms/Button';

import Players from './Players';
import { refreshTable } from '../../graphql/mutations';

type ComponentProps = {
  me: Me;
  users: Array<User>;
  poker: Poker;
  onReset: () => void;
};

const mutateRefreshTable = async (roomId: string, userId: string) => API.graphql({
  query: refreshTable,
  variables: {
    room_id: roomId,
    user_id: userId,
  } as RefreshTableMutationVariables,
}) as GraphQLResult<RefreshTableMutation>;

export const Component: FC<ComponentProps> = ({
  me,
  users,
  poker,
  onReset,
}) => (
  <div className="flex flex-col space-y-6 border rounded p-8">
    <Players
      myUserId={me.userId}
      players={users
        .filter((u) => u.status !== Status.LEAVED)
        .map((u) => ({ userId: u.userId, pickedCard: u.pickedCard }))}
      shown={poker.shown}
    />
    <Button text="Reset" onClick={onReset} />
  </div>
);

const Container: FC = () => {
  const [me] = useRecoilState(myState);
  const [users] = useRecoilState(usersState);
  const poker = useRecoilValue(pokerState);

  const refresh = async () => {
    await mutateRefreshTable(me.roomId, me.userId);
    console.log('refreshed!!!');
  };

  return (
    <Component me={me} users={users} poker={poker} onReset={() => refresh()} />
  );
};

export default Container;
