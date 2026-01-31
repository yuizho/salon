import { generateClient } from 'aws-amplify/api';
import { pick } from '../mutations';
import { PickMutation, PickMutationVariables } from '../schema';

const client = generateClient();

export default async (
  roomId: string,
  userId: string,
  userToken: string,
  pickedCard: string,
) => {
  const result = await client.graphql({
    query: pick,
    variables: {
      room_id: roomId,
      user_id: userId,
      user_token: userToken,
      picked_card: pickedCard,
    } as PickMutationVariables,
  });
  return result as { data: PickMutation };
};
