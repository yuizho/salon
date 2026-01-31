import { generateClient } from 'aws-amplify/api';
import { join } from '../mutations';
import { JoinMutation, JoinMutationVariables } from '../schema';

const client = generateClient();

export default async (roomId: string) => {
  const result = await client.graphql({
    query: join,
    variables: {
      room_id: roomId,
    } as JoinMutationVariables,
  });
  return result as { data: JoinMutation };
};
