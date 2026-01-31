import { generateClient } from 'aws-amplify/api';
import { refreshTable } from '../mutations';
import { RefreshTableMutation, RefreshTableMutationVariables } from '../schema';

const client = generateClient();

export default async (roomId: string, userId: string, userToken: string) => {
  const result = await client.graphql({
    query: refreshTable,
    variables: {
      room_id: roomId,
      user_id: userId,
      user_token: userToken,
    } as RefreshTableMutationVariables,
  });
  return result as { data: RefreshTableMutation };
};
