import { generateClient } from 'aws-amplify/api';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Observable } from 'zen-observable-ts';
import { OnUpdateUserSubscription } from '../schema';
import { onUpdateUser } from '../subscriptions';

const client = generateClient();

export type SubscriptionValue = {
  data: OnUpdateUserSubscription;
};

export default (roomId: string) =>
  client.graphql({
    query: onUpdateUser,
    variables: {
      room_id: roomId,
    },
  }) as unknown as Observable<SubscriptionValue>;
