/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($room_id: String!) {
    onUpdateUser(room_id: $room_id) {
      room_id
      user_id
      status
      picked_card
      operated_at
    }
  }
`;
