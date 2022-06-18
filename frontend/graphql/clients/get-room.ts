import { API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { GetRoomQuery, GetRoomQueryVariables } from '../schema';
import { getRoom } from '../queries';

export default async (roomId: string) => {
  const result = (await API.graphql({
    query: getRoom,
    variables: {
      room_id: roomId,
    } as GetRoomQueryVariables,
  })) as GraphQLResult<GetRoomQuery>;
  return result;
};
