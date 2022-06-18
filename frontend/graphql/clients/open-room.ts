import { API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { OpenRoomMutation } from '../schema';
import { openRoom } from '../mutations';

export default async () => {
  const result = (await API.graphql({
    query: openRoom,
  })) as GraphQLResult<OpenRoomMutation>;
  return result;
};
