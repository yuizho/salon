import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import roomSubscription, { SubscriptionValue } from '../graphql/clients/room-subscription';
import { NETWORK_ERROR } from '../graphql/error-message';
import { appState } from '../states/app';
import { usersState } from '../states/users';

const useSubscription = () => {
  const router = useRouter();
  const setUsers = useSetRecoilState(usersState);
  const setApp = useSetRecoilState(appState);

  useEffect(() => {
    if (!router.isReady) {
      return () => {};
    }

    const roomId = router.query.roomId as string;

    if (!/^[0-9a-zA-Z]+$/.test(roomId) || roomId.length > 30) {
      return () => {};
    }

    const subscription = roomSubscription(roomId).subscribe({
      next: ({ value }: SubscriptionValue) => {
        const item = value.data.onUpdateUser;
        if (item) {
          setUsers((currentUsers) => {
            const users = [
              ...currentUsers.filter((u) => u.userId !== item.user_id),
              {
                userId: item.user_id,
                status: item.status,
                pickedCard: item.picked_card ?? '',
              },
            ];
            users.sort((a, b) => (a.userId > b.userId ? 1 : -1));
            return users;
          });
        }
        setApp((app) => ({ ...app, loading: false }));
      },
      error: ({ error }) => {
        console.warn(error);
        setApp((app) => ({
          ...app,
          loading: false,
          errorMessage: NETWORK_ERROR,
        }));
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, setUsers, setApp]);
};

export default useSubscription;
