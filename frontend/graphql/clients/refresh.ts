import { API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { refreshTable } from '../mutations';
import { RefreshTableMutation, RefreshTableMutationVariables } from '../schema';

export default async (roomId: string, userId: string, userToken: string) => {
  const result = (await API.graphql({
    query: refreshTable,
    variables: {
      room_id: roomId,
      user_id: userId,
      user_token: userToken,
    } as RefreshTableMutationVariables,
  })) as GraphQLResult<RefreshTableMutation>;
  return result;
};
