/* eslint-disable no-await-in-loop */
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { myState } from '../states/me';
import { usersState } from '../states/users';
import { appState } from '../states/app';
import { NETWORK_ERROR } from '../graphql/error-message';
import { roomState } from '../states/room';
import getRoom from '../graphql/clients/get-room';
import join from '../graphql/clients/join';

const getRoomWithRetry = async (roomId: string) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const i of [1, 2, 3, 4]) {
    const room = await getRoom(roomId);
    if (room.data?.getRoom.is_opened) {
      return room;
    }
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 1000 * i));
  }
  const room = await getRoom(roomId);
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
          const joinned = await join(roomId);
          setMe({
            roomId,
            userId: joinned.data?.join.user_id ?? '',
            userToken: joinned.data?.join.user_token ?? '',
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
          room = await getRoom(roomId);
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
