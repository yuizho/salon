import { API } from 'aws-amplify';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Observable } from 'zen-observable-ts';
import { OnUpdateUserSubscription } from '../graphql/schema';
import { onUpdateUser } from '../graphql/subscriptions';
import { usersState } from '../states/users';

type SubscriptionValue = {
  value: {
    data: OnUpdateUserSubscription;
  };
};

const setupSubscription = (roomId: string) => API.graphql({
  query: onUpdateUser,
  variables: {
    room_id: roomId,
  },
}) as Observable<SubscriptionValue>;

const useSubscription = () => {
  const router = useRouter();
  const setUsers = useSetRecoilState(usersState);

  useEffect(() => {
    if (!router.isReady) {
      return () => {};
    }

    const roomId = router.query.roomId as string;

    // TODO: check roomId

    const subscription = setupSubscription(roomId).subscribe({
      next: ({ value }: SubscriptionValue) => {
        const item = value.data.onUpdateUser;
        if (item) {
          setUsers((currentUsers) => [
            ...currentUsers.filter((u) => u.userId !== item.user_id),
            {
              userId: item.user_id,
              status: item.status,
              pickedCard: item.picked_card ?? '',
            },
          ]);
        }
      },
      error: ({ error }) => console.warn(error),
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, setUsers]);
};

export default useSubscription;
