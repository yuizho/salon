import { generateClient } from 'aws-amplify/api';
import { getRoom } from '../queries';
import { GetRoomQuery, GetRoomQueryVariables } from '../schema';

const client = generateClient();

export default async (roomId: string) => {
  const result = await client.graphql({
    query: getRoom,
    variables: {
      room_id: roomId,
    } as GetRoomQueryVariables,
  });
  // Cast to match previous return type expectation if needed, or let inference work
  return result as { data: GetRoomQuery };
};
