import { FC, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Status } from '../../graphql/schema';
import Card from '../atoms/Card';
import User from '../atoms/User';
import ModalDialog from '../molecules/ModalDialog';
import { myState } from '../../states/me';
import { appState } from '../../states/app';
import { NETWORK_ERROR } from '../../graphql/error-message';
import kick from '../../graphql/clients/kick';
import { pokerState } from '../../states/poker';

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
}) => (
  <div key={userId} className="flex flex-col items-center gap-2 p-2 w-20">
    <User
      me={me}
      onClick={() => {
        setOpenKickDialog(true);
      }}
      clickable={kickable}
    />
    <Card value={value} shown={shown} choosable={false} chosen={status === Status.CHOSEN} />
    <ModalDialog
      message="選択したユーザを部屋から退出させます。よろしいですか？"
      onClickOK={onKick}
      open={openKickDialog}
      setOpen={setOpenKickDialog}
    />
  </div>
);

const Container: FC<Props> = ({ userId, status, value, shown, me }) => {
  const [myRecoilState] = useRecoilState(myState);
  const [openKickDialog, setOpenKickDialog] = useState(false);
  const poker = useRecoilValue(pokerState);
  const setApp = useSetRecoilState(appState);

  const kickThisUser = async () => {
    setApp((app) => ({ ...app, loading: true }));
    try {
      await kick(myRecoilState.roomId, myRecoilState.userId, userId);
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
      userId={userId}
      status={status}
      value={value}
      shown={shown}
      me={me}
      kickable={poker.state !== 'KICKED' && !me}
      onKick={() => kickThisUser()}
      openKickDialog={openKickDialog}
      setOpenKickDialog={setOpenKickDialog}
    />
  );
};

export default Container;
