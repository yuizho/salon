import { generateClient } from 'aws-amplify/api';
import { LeaveMutation, LeaveMutationVariables } from '../schema';
import { leave } from '../mutations';

const client = generateClient();

export default async (roomId: string, userId: string, userToken: string) => {
  const result = await client.graphql({
    query: leave,
    variables: {
      room_id: roomId,
      user_id: userId,
      user_token: userToken,
    } as LeaveMutationVariables,
  });
  return result as { data: LeaveMutation };
};