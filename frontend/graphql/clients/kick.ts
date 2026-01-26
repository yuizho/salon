import { generateClient } from 'aws-amplify/api';
import { kick } from '../mutations';
import { KickMutation, RefreshTableMutationVariables } from '../schema';

const client = generateClient();

export default async (roomId: string, userId: string, userToken: string, kickedUserId: string) => {
  const result = await client.graphql({
    query: kick,
    variables: {
      room_id: roomId,
      user_id: userId,
      user_token: userToken,
      kicked_user_id: kickedUserId,
    } as RefreshTableMutationVariables,
  });
  return result as { data: KickMutation };
};