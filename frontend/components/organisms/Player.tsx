import { FC, useState } from 'react';
import API, { GraphQLResult } from '@aws-amplify/api';
import { useRecoilState } from 'recoil';
import { kick } from '../../graphql/mutations';
import {
  KickMutation,
  RefreshTableMutationVariables,
  Status,
} from '../../graphql/schema';
import Card from '../atoms/Card';
import User from '../atoms/User';
import ModalDialog from '../molecules/ModalDialog';
import { myState } from '../../states/me';

type Props = {
  userId: string;
  status: Status;
  value: string;
  shown: boolean;
  me: boolean;
};

type ComponentProps = Props & {
  onKick: () => void;
  openKickDialog: boolean;
  setOpenKickDialog: (b: boolean) => void;
};

// TODO: error handling
const mutateKick = async (
  roomId: string,
  userId: string,
  kickedUserId: string,
) => API.graphql({
  query: kick,
  variables: {
    room_id: roomId,
    user_id: userId,
    kicked_user_id: kickedUserId,
  } as RefreshTableMutationVariables,
}) as GraphQLResult<KickMutation>;

export const Component: FC<ComponentProps> = ({
  userId,
  status,
  value,
  shown,
  me,
  onKick,
  openKickDialog,
  setOpenKickDialog,
}) => (
  <div
    key={userId}
    className={`
      flex
      flex-col
      items-center
      gap-2
      p-2
      w-24
  `}
  >
    <User
      me={me}
      onClick={() => {
        setOpenKickDialog(true);
      }}
    />
    <Card
      value={value}
      shown={shown}
      choosable={false}
      chosen={status === Status.CHOSEN}
    />
    <ModalDialog
      message="選択したユーザを部屋から退出させます。よろしいですか？"
      onClickOK={onKick}
      open={openKickDialog}
      setOpen={setOpenKickDialog}
    />
  </div>
);

const Container: FC<Props> = ({
  userId, status, value, shown, me,
}) => {
  const [myRecoilState] = useRecoilState(myState);
  const [openKickDialog, setOpenKickDialog] = useState(false);

  const kickThisUser = async () => {
    await mutateKick(myRecoilState.roomId, myRecoilState.userId, userId);
  };

  return (
    <Component
      userId={userId}
      status={status}
      value={value}
      shown={shown}
      me={me}
      onKick={() => kickThisUser()}
      openKickDialog={openKickDialog}
      setOpenKickDialog={setOpenKickDialog}
    />
  );
};

export default Container;
