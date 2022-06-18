import { API } from 'aws-amplify';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Observable } from 'zen-observable-ts';
import { OnUpdateUserSubscription } from '../schema';
import { onUpdateUser } from '../subscriptions';

export type SubscriptionValue = {
  value: {
    data: OnUpdateUserSubscription;
  };
};

export default (roomId: string) =>
  API.graphql({
    query: onUpdateUser,
    variables: {
      room_id: roomId,
    },
  }) as Observable<SubscriptionValue>;
