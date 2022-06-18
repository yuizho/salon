import { API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { LeaveMutation, LeaveMutationVariables } from '../schema';
import { leave } from '../mutations';

export default async (roomId: string, userId: string) => {
  const result = (await API.graphql({
    query: leave,
    variables: {
      room_id: roomId,
      user_id: userId,
    } as LeaveMutationVariables,
  })) as GraphQLResult<LeaveMutation>;
  return result;
};
