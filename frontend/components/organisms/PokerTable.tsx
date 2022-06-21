import { FC, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Status } from '../../graphql/schema';
import { Poker, PokerState, pokerState as pokerRecoilState } from '../../states/poker';
import { User, usersState } from '../../states/users';
import { Me, myState } from '../../states/me';
import Button from '../atoms/Button';

import Players from './Players';
import ModalDialog from '../molecules/ModalDialog';
import Message from '../atoms/Message';
import { appState } from '../../states/app';
import { NETWORK_ERROR } from '../../graphql/error-message';
import refresh from '../../graphql/clients/refresh';

type ComponentProps = {
  me: Me;
  users: Array<User>;
  poker: Poker;
  onReset: () => void;
  openResetDialog: boolean;
  setOpenResetDialog: (b: boolean) => void;
  pokerState: PokerState;
};

const getMessageByPokerState = (state: PokerState) => {
  if (state === 'KICKED') {
    return '他のユーザによって部屋からキックされました。再度入室する場合はブラウザを更新してください。';
  }
  if (state === 'ALONE') {
    return 'この部屋のURLを共有して、メンバーを招待しましょう！';
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
        clickable={poker.state !== 'KICKED'}
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

  const refreshPoker = async () => {
    setApp((app) => ({ ...app, loading: true }));
    try {
      await refresh(me.roomId, me.userId, me.userToken);
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
      onReset={() => refreshPoker()}
      openResetDialog={openResetDialog}
      setOpenResetDialog={setOpenResetDialog}
      pokerState={poker.state}
    />
  );
};

export default Container;
