import { API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { pick } from '../mutations';
import { PickMutation, PickMutationVariables } from '../schema';

export default async (roomId: string, userId: string, pickedCard: string) => {
  const result = (await API.graphql({
    query: pick,
    variables: {
      room_id: roomId,
      user_id: userId,
      picked_card: pickedCard,
    } as PickMutationVariables,
  })) as GraphQLResult<PickMutation>;
  return result;
};
