/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRoom = /* GraphQL */ `
  query GetRoom($room_id: String!) {
    getRoom(room_id: $room_id) {
      items {
        room_id
        user_id
        status
        picked_card
        operated_at
      }
      expiration_unix_timestamp
      is_opened
    }
  }
`;
