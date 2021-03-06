/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const openRoom = /* GraphQL */ `
  mutation OpenRoom {
    openRoom {
      room_id
      user_id
      user_token
    }
  }
`;
export const join = /* GraphQL */ `
  mutation Join($room_id: String!) {
    join(room_id: $room_id) {
      room_id
      user_id
      user_token
    }
  }
`;
export const leave = /* GraphQL */ `
  mutation Leave($room_id: String!, $user_id: String!, $user_token: String!) {
    leave(room_id: $room_id, user_id: $user_id, user_token: $user_token) {
      room_id
      user_id
    }
  }
`;
export const pick = /* GraphQL */ `
  mutation Pick(
    $room_id: String!
    $user_id: String!
    $picked_card: String!
    $user_token: String!
  ) {
    pick(
      room_id: $room_id
      user_id: $user_id
      picked_card: $picked_card
      user_token: $user_token
    ) {
      room_id
      user_id
    }
  }
`;
export const refreshTable = /* GraphQL */ `
  mutation RefreshTable(
    $room_id: String!
    $user_id: String!
    $user_token: String!
  ) {
    refreshTable(
      room_id: $room_id
      user_id: $user_id
      user_token: $user_token
    ) {
      room_id
      user_id
    }
  }
`;
export const kick = /* GraphQL */ `
  mutation Kick(
    $room_id: String!
    $user_id: String!
    $kicked_user_id: String!
    $user_token: String!
  ) {
    kick(
      room_id: $room_id
      user_id: $user_id
      kicked_user_id: $kicked_user_id
      user_token: $user_token
    ) {
      room_id
      user_id
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $room_id: String!
    $user_id: String!
    $status: Status!
    $picked_card: String
    $operated_at: AWSDateTime!
  ) {
    updateUser(
      room_id: $room_id
      user_id: $user_id
      status: $status
      picked_card: $picked_card
      operated_at: $operated_at
    ) {
      room_id
      user_id
      status
      picked_card
      operated_at
    }
  }
`;
