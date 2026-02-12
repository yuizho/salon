import * as Sentry from '@sentry/nextjs';
import { useAtomValue, useSetAtom } from 'jotai';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import kick from '../../graphql/clients/kick';
import { NETWORK_ERROR } from '../../graphql/error-message';
import { Status } from '../../graphql/schema';
import { appState } from '../../states/app';
import { myState } from '../../states/me';
import { pokerState } from '../../states/poker';
import Card from '../atoms/Card';
import User from '../atoms/User';
import ModalDialog from '../molecules/ModalDialog';

type Props = {
  userId: string;
  status: Status;
  value: string;
  shown: boolean;
  me: boolean;
};

type ComponentProps = Props & {
  kickable: boolean;
  onKick: () => void;
  openKickDialog: boolean;
  setOpenKickDialog: (b: boolean) => void;
  t: any;
};

export const Component: FC<ComponentProps> = ({
  userId,
  status,
  value,
  shown,
  me,
  kickable,
  onKick,
  openKickDialog,
  setOpenKickDialog,
  t,
}) => (
  <div key={userId} className='flex flex-col items-center gap-2 p-2 w-20'>
    <User
      me={me}
      onClick={() => {
        setOpenKickDialog(true);
      }}
      clickable={kickable}
    />
    <Card
      value={value}
      shown={shown}
      choosable={false}
      chosen={status === Status.CHOSEN}
    />
    <ModalDialog
      message={t('player.kick_confirm')}
      onClickOK={onKick}
      open={openKickDialog}
      setOpen={setOpenKickDialog}
    />
  </div>
);

const Container: FC<Props> = ({ userId, status, value, shown, me }) => {
  const myStateValue = useAtomValue(myState);
  const [openKickDialog, setOpenKickDialog] = useState(false);
  const poker = useAtomValue(pokerState);
  const setApp = useSetAtom(appState);
  const { t } = useTranslation();

  const kickThisUser = async () => {
    setApp((app) => ({ ...app, loading: true }));
    try {
      await kick(
        myStateValue.roomId,
        myStateValue.userId,
        myStateValue.userToken,
        userId,
      );
    } catch (e) {
      Sentry.captureException(e);
      setApp((app) => ({
        ...app,
        loading: false,
        errorMessage: NETWORK_ERROR,
      }));
    }
  };

  return (
    <Component
      userId={userId}
      status={status}
      value={value}
      shown={shown}
      me={me}
      kickable={poker.state !== 'KICKED' && !me}
      onKick={() => kickThisUser()}
      openKickDialog={openKickDialog}
      setOpenKickDialog={setOpenKickDialog}
      t={t}
    />
  );
};

export default Container;
