import { useRouter } from 'next/router';
import { FC } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import openRoom from '../../graphql/clients/open-room';
import { NETWORK_ERROR } from '../../graphql/error-message';
import { appState } from '../../states/app';
import { myState } from '../../states/me';
import Button from '../atoms/Button';

type Props = {
  onClick: () => void;
};

export const Component: FC<Props> = ({ onClick }) => (
  <div className="flex flex-col space-y-3 border rounded p-8 ">
    <p className="text-slate-700 text-xl font-semibold">
      Salonはログイン不要の無料Webプランニングポーカーサービスです
    </p>
    <p className="text-slate-600">
      プランニングポーカーを開始するには部屋を作成してください。作成した部屋は約30分間有効です。
    </p>
    <Button text="部屋を作成する" onClick={onClick} />
  </div>
);

const Container: FC = () => {
  const router = useRouter();
  const setApp = useSetRecoilState(appState);
  const [, setMe] = useRecoilState(myState);

  const createRoom = async () => {
    try {
      const result = await openRoom();
      const roomId = result.data?.openRoom.room_id ?? '';
      const userId = result.data?.openRoom.user_id ?? '';
      setMe({ roomId, userId });

      router.push(`/rooms/${roomId}`);
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
      onClick={() => {
        createRoom();
      }}
    />
  );
};

export default Container;
