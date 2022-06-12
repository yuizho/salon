import { FC, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import API, { GraphQLResult } from '@aws-amplify/api';
import { RefreshTableMutation, RefreshTableMutationVariables, Status } from '../../graphql/schema';
import { Poker, PokerState, pokerState } from '../../states/poker';
import { User, usersState } from '../../states/users';
import { Me, myState } from '../../states/me';
import Button from '../atoms/Button';

import Players from './Players';
import { refreshTable } from '../../graphql/mutations';
import ModalDialog from '../molecules/ModalDialog';
import Message from '../atoms/Message';
import { appState } from '../../states/app';

type ComponentProps = {
  me: Me;
  users: Array<User>;
  poker: Poker;
  onReset: () => void;
  openResetDialog: boolean;
  setOpenResetDialog: (b: boolean) => void;
  message: string;
};

// TODO: error handling
const mutateRefreshTable = async (roomId: string, userId: string) =>
  API.graphql({
    query: refreshTable,
    variables: {
      room_id: roomId,
      user_id: userId,
    } as RefreshTableMutationVariables,
  }) as GraphQLResult<RefreshTableMutation>;

const getMessageByPokerState = (state: PokerState) => {
  if (state === 'CHOOSING') {
    return 'カードを選択してください。';
  }
  if (state === 'WAITING_OTHERS') {
    return '他のユーザがカードを選択中です……';
  }
  if (state === 'EVERYONE_CHOSEN') {
    return '全員がカードを選択しました。次のプランニングポーカーを始めるにはResetボタンを押してください。';
  }
  if (state === 'KICKED') {
    return '他のユーザによって部屋からキックされました。再度入室する場合はブラウザを更新してください。';
  }
  return 'Loading……';
};

export const Component: FC<ComponentProps> = ({
  me,
  users,
  poker,
  onReset,
  openResetDialog,
  setOpenResetDialog,
  message,
}) => (
  <div className="flex flex-col space-y-6 border rounded p-8">
    <Message message={message} />
    <Players
      myUserId={me.userId}
      players={users.filter((u) => u.status !== Status.LEAVED)}
      shown={poker.state === 'EVERYONE_CHOSEN'}
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
  const setApp = useSetRecoilState(appState);

  const refresh = async () => {
    setApp((app) => ({ ...app, loading: true }));
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
      message={getMessageByPokerState(poker.state)}
    />
  );
};

export default Container;
