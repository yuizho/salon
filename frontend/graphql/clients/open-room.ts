import { generateClient } from 'aws-amplify/api';
import { openRoom } from '../mutations';
import { OpenRoomMutation } from '../schema';

const client = generateClient();

export default async () => {
  const result = await client.graphql({
    query: openRoom,
  });
  return result as { data: OpenRoomMutation };
};
