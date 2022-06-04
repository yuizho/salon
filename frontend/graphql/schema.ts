/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Operation = {
  __typename: "Operation",
  event_id: string,
  room_id: string,
  user_id: string,
  op_type: OperationType,
  operated_at: string,
  picked_card?: string | null,
  kicked_user_id?: string | null,
};

export enum OperationType {
  OPEN_ROOM = "OPEN_ROOM",
  JOIN = "JOIN",
  LEAVE = "LEAVE",
  PICK = "PICK",
  REFRESH_TABLE = "REFRESH_TABLE",
  HEARTBEAT = "HEARTBEAT",
  KICK = "KICK",
}


export enum Status {
  CHOOSING = "CHOOSING",
  CHOSEN = "CHOSEN",
  LEAVED = "LEAVED",
}


export type User = {
  __typename: "User",
  room_id: string,
  user_id: string,
  status: Status,
  picked_card?: string | null,
  operated_at: string,
};

export type Room = {
  __typename: "Room",
  items:  Array<User >,
  expiration_unix_timestamp: number,
  is_opened: boolean,
};

export type OpenRoomMutation = {
  openRoom:  {
    __typename: "Operation",
    event_id: string,
    room_id: string,
    user_id: string,
    op_type: OperationType,
    operated_at: string,
    picked_card?: string | null,
    kicked_user_id?: string | null,
  },
};

export type JoinMutationVariables = {
  room_id: string,
};

export type JoinMutation = {
  join:  {
    __typename: "Operation",
    event_id: string,
    room_id: string,
    user_id: string,
    op_type: OperationType,
    operated_at: string,
    picked_card?: string | null,
    kicked_user_id?: string | null,
  },
};

export type LeaveMutationVariables = {
  room_id: string,
  user_id: string,
};

export type LeaveMutation = {
  leave:  {
    __typename: "Operation",
    event_id: string,
    room_id: string,
    user_id: string,
    op_type: OperationType,
    operated_at: string,
    picked_card?: string | null,
    kicked_user_id?: string | null,
  },
};

export type PickMutationVariables = {
  room_id: string,
  user_id: string,
  picked_card: string,
};

export type PickMutation = {
  pick:  {
    __typename: "Operation",
    event_id: string,
    room_id: string,
    user_id: string,
    op_type: OperationType,
    operated_at: string,
    picked_card?: string | null,
    kicked_user_id?: string | null,
  },
};

export type RefreshTableMutationVariables = {
  room_id: string,
  user_id: string,
};

export type RefreshTableMutation = {
  refreshTable:  {
    __typename: "Operation",
    event_id: string,
    room_id: string,
    user_id: string,
    op_type: OperationType,
    operated_at: string,
    picked_card?: string | null,
    kicked_user_id?: string | null,
  },
};

export type KickMutationVariables = {
  room_id: string,
  user_id: string,
  kicked_user_id: string,
};

export type KickMutation = {
  kick:  {
    __typename: "Operation",
    event_id: string,
    room_id: string,
    user_id: string,
    op_type: OperationType,
    operated_at: string,
    picked_card?: string | null,
    kicked_user_id?: string | null,
  },
};

export type UpdateUserMutationVariables = {
  room_id: string,
  user_id: string,
  status: Status,
  picked_card?: string | null,
  operated_at: string,
};

export type UpdateUserMutation = {
  updateUser:  {
    __typename: "User",
    room_id: string,
    user_id: string,
    status: Status,
    picked_card?: string | null,
    operated_at: string,
  },
};

export type GetRoomQueryVariables = {
  room_id: string,
};

export type GetRoomQuery = {
  getRoom:  {
    __typename: "Room",
    items:  Array< {
      __typename: "User",
      room_id: string,
      user_id: string,
      status: Status,
      picked_card?: string | null,
      operated_at: string,
    } >,
    expiration_unix_timestamp: number,
    is_opened: boolean,
  },
};

export type OnUpdateUserSubscriptionVariables = {
  room_id: string,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    room_id: string,
    user_id: string,
    status: Status,
    picked_card?: string | null,
    operated_at: string,
  } | null,
};
