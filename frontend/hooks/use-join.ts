import { API } from 'aws-amplify';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { GraphQLResult } from '@aws-amplify/api';
import {
  GetRoomQuery,
  GetRoomQueryVariables,
  JoinMutation,
  JoinMutationVariables,
} from '../graphql/schema';
import { join } from '../graphql/mutations';
import { getRoom } from '../graphql/queries';
import { myState } from '../states/me';
import { usersState } from '../states/users';

const queryGetRoom = async (roomId: string) =>
  API.graphql({
    query: getRoom,
    variables: {
      room_id: roomId,
    } as GetRoomQueryVariables,
  }) as GraphQLResult<GetRoomQuery>;

const mutateJoin = async (roomId: string) =>
  API.graphql({
    query: join,
    variables: {
      room_id: roomId,
    } as JoinMutationVariables,
  }) as GraphQLResult<JoinMutation>;

const useJoin = () => {
  const router = useRouter();

  const [, setMe] = useRecoilState(myState);
  const [, setUsers] = useRecoilState(usersState);

  useEffect(() => {
    const execute = async () => {
      const roomId = router.query.roomId as string;

      // TODO: check roomId

      try {
        const joinned = await mutateJoin(roomId);
        setMe({
          roomId,
          userId: joinned.data?.join.user_id ?? '',
        });
      } catch (e) {
        console.error(e);
        return;
      }

      try {
        const room = await queryGetRoom(roomId);
        if (!room.data?.getRoom.is_opened) {
          // TODO: store error state
          router.push('/');
          return;
        }

        const users =
          room.data?.getRoom.items.map((item) => ({
            userId: item.user_id,
            status: item.status,
            pickedCard: item.picked_card ?? '',
          })) || [];

        setUsers(users);
      } catch (e) {
        console.error(e);
      }
    };

    if (router.isReady) {
      execute();
    }

    // cleanup
    return () => {};
  }, [router, setMe, setUsers]);
};

export default useJoin;
