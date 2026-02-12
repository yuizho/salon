import { useAtomValue, useSetAtom } from 'jotai';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import refresh from '../../graphql/clients/refresh';
import { NETWORK_ERROR } from '../../graphql/error-message';
import { Status } from '../../graphql/schema';
import { appState } from '../../states/app';
import { Me, myState } from '../../states/me';
import {
  Poker,
  PokerState,
  pokerState as pokerAtom,
} from '../../states/poker';
import { User, usersState } from '../../states/users';
import Button from '../atoms/Button';
import Message from '../atoms/Message';
import ModalDialog from '../molecules/ModalDialog';
import Players from './Players';

type ComponentProps = {
  me: Me;
  users: Array<User>;
  poker: Poker;
  onReset: () => void;
  openResetDialog: boolean;
  setOpenResetDialog: (b: boolean) => void;
  pokerState: PokerState;
  t?: any;
};

const getMessageByPokerState = (state: PokerState) => {
  if (state === 'KICKED') {
    return 'poker_table.kicked_message';
  }
  if (state === 'ALONE') {
    return 'poker_table.alone_message';
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
  t = (k: any) => k,
}) => {
  const messageKey = getMessageByPokerState(poker.state);
  const message = messageKey ? t(messageKey) : '';

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
        text={t('poker_table.reset_button')}
        onClick={() => {
          setOpenResetDialog(true);
        }}
        glow={poker.state === 'EVERYONE_CHOSEN'}
        clickable={poker.state !== 'KICKED'}
      />
      <ModalDialog
        message={t('poker_table.reset_confirm')}
        onClickOK={onReset}
        open={openResetDialog}
        setOpen={setOpenResetDialog}
      />
    </div>
  );
};

const Container: FC = () => {
  const me = useAtomValue(myState);
  const users = useAtomValue(usersState);
  const poker = useAtomValue(pokerAtom);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const setApp = useSetAtom(appState);
  const { t } = useTranslation();

  const refreshPoker = async () => {
    setApp((app) => ({ ...app, loading: true }));
    try {
      await refresh(me.roomId, me.userId, me.userToken);
    } catch (e) {
      console.error(e);
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
      t={t}
    />
  );
};

export default Container;
