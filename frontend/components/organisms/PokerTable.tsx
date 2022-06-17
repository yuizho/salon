import { FC, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import API, { GraphQLResult } from '@aws-amplify/api';
import { RefreshTableMutation, RefreshTableMutationVariables, Status } from '../../graphql/schema';
import { Poker, PokerState, pokerState as pokerRecoilState } from '../../states/poker';
import { User, usersState } from '../../states/users';
import { Me, myState } from '../../states/me';
import Button from '../atoms/Button';

import Players from './Players';
import { refreshTable } from '../../graphql/mutations';
import ModalDialog from '../molecules/ModalDialog';
import Message from '../atoms/Message';
import { appState } from '../../states/app';
import { NETWORK_ERROR } from '../../graphql/error-message';

type ComponentProps = {
  me: Me;
  users: Array<User>;
  poker: Poker;
  onReset: () => void;
  openResetDialog: boolean;
  setOpenResetDialog: (b: boolean) => void;
  pokerState: PokerState;
};

const mutateRefreshTable = async (roomId: string, userId: string) => {
  const result = (await API.graphql({
    query: refreshTable,
    variables: {
      room_id: roomId,
      user_id: userId,
    } as RefreshTableMutationVariables,
  })) as GraphQLResult<RefreshTableMutation>;
  return result;
};

const getMessageByPokerState = (state: PokerState) => {
  if (state === 'KICKED') {
    return '他のユーザによって部屋からキックされました。再度入室する場合はブラウザを更新してください。';
  }
  return '';
};

export const Component: FC<ComponentProps> = ({
  me,
  users,
  poker,
  onReset,
  openResetDialog,
  setOpenResetDialog,
  pokerState,
}) => {
  const message = getMessageByPokerState(poker.state);

  return (
    <div
      className={`flex flex-col space-y-6 border rounded p-8 ${
        pokerState === 'LOADING' && 'animate-pulse'
      }`}
    >
      <div hidden={!message}>
        <Message message={message} />
      </div>
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
        glow={poker.state === 'EVERYONE_CHOSEN'}
      />
      <ModalDialog
        message="全員カードを未選択の状態にリセットします。よろしいですか？"
        onClickOK={onReset}
        open={openResetDialog}
        setOpen={setOpenResetDialog}
      />
    </div>
  );
};

const Container: FC = () => {
  const [me] = useRecoilState(myState);
  const [users] = useRecoilState(usersState);
  const poker = useRecoilValue(pokerRecoilState);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const setApp = useSetRecoilState(appState);

  const refresh = async () => {
    setApp((app) => ({ ...app, loading: true }));
    try {
      await mutateRefreshTable(me.roomId, me.userId);
    } catch (e) {
      setApp((app) => ({
        ...app,
        loading: false,
        errorMessage: NETWORK_ERROR,
      }));
    }
  };

  return (
    <Component
      me={me}
      users={users}
      poker={poker}
      onReset={() => refresh()}
      openResetDialog={openResetDialog}
      setOpenResetDialog={setOpenResetDialog}
      pokerState={poker.state}
    />
  );
};

export default Container;
