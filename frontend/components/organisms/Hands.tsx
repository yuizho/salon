import { GraphQLResult } from '@aws-amplify/api';
import { API } from 'aws-amplify';
import { FC } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { pick } from '../../graphql/mutations';
import {
  PickMutation,
  PickMutationVariables,
  Status,
} from '../../graphql/schema';
import { myState } from '../../states/me';
import { usersState } from '../../states/users';
import Card from '../atoms/Card';

type Props = {
  values: Array<string>;
};

const mutatePick = async (
  roomId: string,
  userId: string,
  pickedCard: string,
) => {
  try {
    const result = (await API.graphql({
      query: pick,
      variables: {
        room_id: roomId,
        user_id: userId,
        picked_card: pickedCard,
      } as PickMutationVariables,
    })) as GraphQLResult<PickMutation>;

    return result.data?.pick.user_id === userId ?? false;
  } catch (e) {
    // TODO: error handling
    console.error(e);
    return false;
  }
};

const Hands: FC<Props> = ({ values }) => {
  const [me] = useRecoilState(myState);
  const setUsers = useSetRecoilState(usersState);

  const onClickCard = (roomId: string, userId: string) => (pickedCard: string) => {
    // update user state before sending request to GraphQL API
    // to show the result of user operation as soon as possible.
    setUsers((currentUsers) => [
      ...currentUsers.filter((u) => u.userId !== userId),
      {
        userId,
        status: Status.CHOSEN,
        pickedCard,
      },
    ]);

    mutatePick(roomId, userId, pickedCard);
  };

  return (
    <div
      className={`
    flex flex-wrap gap-1
  `}
    >
      {values.map((v) => (
        <Card
          key={v}
          value={v}
          shown
          choosable
          onClick={onClickCard(me.roomId, me.userId, v)}
        />
      ))}
    </div>
  );
};

export default Hands;
