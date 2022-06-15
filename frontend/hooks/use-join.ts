/* eslint-disable no-await-in-loop */
import { API } from 'aws-amplify';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
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
import { appState } from '../states/app';
import { NETWORK_ERROR } from '../graphql/error-message';
import { roomState } from '../states/room';

const queryGetRoom = async (roomId: string) => {
  const result = (await API.graphql({
    query: getRoom,
    variables: {
      room_id: roomId,
    } as GetRoomQueryVariables,
  })) as GraphQLResult<GetRoomQuery>;
  return result;
};

const mutateJoin = async (roomId: string) => {
  const result = (await API.graphql({
    query: join,
    variables: {
      room_id: roomId,
    } as JoinMutationVariables,
  })) as GraphQLResult<JoinMutation>;
  return result;
};

const getRoomWithRetry = async (roomId: string) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const i of [1, 2, 3, 4]) {
    const room = await queryGetRoom(roomId);
    if (room.data?.getRoom.is_opened) {
      return room;
    }
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000 * i));
  }
  const room = await queryGetRoom(roomId);
  return room;
};

const useJoin = () => {
  const router = useRouter();

  const [me, setMe] = useRecoilState(myState);
  const [, setUsers] = useRecoilState(usersState);
  const [, setRoom] = useRecoilState(roomState);
  const setApp = useSetRecoilState(appState);

  useEffect(() => {
    const execute = async () => {
      const roomId = router.query.roomId as string;

      if (!/^[0-9a-zA-Z]+$/.test(roomId) || roomId.length > 30) {
        router.push('/404');
        return;
      }

      const isCalledByCreatingRoomOperation = !!me.userId;
      if (!isCalledByCreatingRoomOperation) {
        setApp((app) => ({ ...app, loading: true }));
        try {
          const joinned = await mutateJoin(roomId);
          setMe({
            roomId,
            userId: joinned.data?.join.user_id ?? '',
          });
        } catch (e) {
          setApp((app) => ({
            ...app,
            loading: false,
            errorMessage: NETWORK_ERROR,
          }));
          return;
        }
      }

      try {
        let room;
        if (isCalledByCreatingRoomOperation) {
          //  the room data might not be saved in database yet.
          room = await getRoomWithRetry(roomId);
        } else {
          room = await queryGetRoom(roomId);
        }
        if (!room.data?.getRoom.is_opened) {
          router.push('/404');
          return;
        }

        setRoom({ expirationUnixTimestamp: room.data?.getRoom.expiration_unix_timestamp ?? 0 });

        const users =
          room.data?.getRoom.items.map((item) => ({
            userId: item.user_id,
            status: item.status,
            pickedCard: item.picked_card ?? '',
          })) || [];

        setUsers(users);
      } catch (e) {
        setApp((app) => ({
          ...app,
          loading: false,
          errorMessage: NETWORK_ERROR,
        }));
      }
    };

    if (router.isReady) {
      execute();
    }

    // cleanup
    return () => {};
  }, [router, me, setMe, setUsers, setRoom, setApp]);
};

export default useJoin;
