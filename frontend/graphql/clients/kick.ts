import { API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { kick } from '../mutations';
import { KickMutation, RefreshTableMutationVariables } from '../schema';

export default async (roomId: string, userId: string, userToken: string, kickedUserId: string) => {
  const result = (await API.graphql({
    query: kick,
    variables: {
      room_id: roomId,
      user_id: userId,
      user_token: userToken,
      kicked_user_id: kickedUserId,
    } as RefreshTableMutationVariables,
  })) as GraphQLResult<KickMutation>;
  return result;
};
