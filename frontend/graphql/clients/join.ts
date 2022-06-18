import { API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { JoinMutation, JoinMutationVariables } from '../schema';
import { join } from '../mutations';

export default async (roomId: string) => {
  const result = (await API.graphql({
    query: join,
    variables: {
      room_id: roomId,
    } as JoinMutationVariables,
  })) as GraphQLResult<JoinMutation>;
  return result;
};
