import { API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { LeaveMutation, LeaveMutationVariables } from '../schema';
import { leave } from '../mutations';

export default async (roomId: string, userId: string, userToken: string) => {
  const result = (await API.graphql({
    query: leave,
    variables: {
      room_id: roomId,
      user_id: userId,
      user_token: userToken,
    } as LeaveMutationVariables,
  })) as GraphQLResult<LeaveMutation>;
  return result;
};
