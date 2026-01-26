import { generateClient } from 'aws-amplify/api';
import { OpenRoomMutation } from '../schema';
import { openRoom } from '../mutations';

const client = generateClient();

export default async () => {
  const result = await client.graphql({
    query: openRoom,
  });
  return result as { data: OpenRoomMutation };
};