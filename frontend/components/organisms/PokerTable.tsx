import { FC, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import API, { GraphQLResult } from '@aws-amplify/api';
import {
  RefreshTableMutation,
  RefreshTableMutationVariables,
  Status,
} from '../../graphql/schema';
import { Poker, pokerState } from '../../states/poker';
import { User, usersState } from '../../states/users';
import { Me, myState } from '../../states/me';
import Button from '../atoms/Button';

import Players from './Players';
import { refreshTable } from '../../graphql/mutations';
import ModalDialog from '../molecules/ModalDialog';

type ComponentProps = {
  me: Me;
  users: Array<User>;
  poker: Poker;
  onReset: () => void;
  openResetDialog: boolean;
  setOpenResetDialog: (b: boolean) => void;
};

// TODO: error handling
const mutateRefreshTable = async (roomId: string, userId: string) => API.graphql({
  query: refreshTable,
  variables: {
    room_id: roomId,
    user_id: userId,
  } as RefreshTableMutationVariables,
}) as GraphQLResult<RefreshTableMutation>;

export const Component: FC<ComponentProps> = ({
  me,
  users,
  poker,
  onReset,
  openResetDialog,
  setOpenResetDialog,
}) => (
  <div className="flex flex-col space-y-6 border rounded p-8">
    <Players
      myUserId={me.userId}
      players={users.filter((u) => u.status !== Status.LEAVED)}
      shown={poker.shown}
    />
    <Button
      text="Reset"
      onClick={() => {
        setOpenResetDialog(true);
      }}
    />
    <ModalDialog
      message="全員カードを未選択の状態にリセットします。よろしいですか？"
      onClickOK={onReset}
      open={openResetDialog}
      setOpen={setOpenResetDialog}
    />
  </div>
);

const Container: FC = () => {
  const [me] = useRecoilState(myState);
  const [users] = useRecoilState(usersState);
  const poker = useRecoilValue(pokerState);
  const [openResetDialog, setOpenResetDialog] = useState(false);

  const refresh = async () => {
    await mutateRefreshTable(me.roomId, me.userId);
  };

  return (
    <Component
      me={me}
      users={users}
      poker={poker}
      onReset={() => refresh()}
      openResetDialog={openResetDialog}
      setOpenResetDialog={setOpenResetDialog}
    />
  );
};

export default Container;
