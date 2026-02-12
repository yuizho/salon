import * as Sentry from '@sentry/nextjs';
import { useAtom, useSetAtom } from 'jotai';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import openRoom from '../../graphql/clients/open-room';
import { NETWORK_ERROR } from '../../graphql/error-message';
import { appState } from '../../states/app';
import { myState } from '../../states/me';
import Button from '../atoms/Button';

type Props = {
  onClick: () => void;
  t: any;
};

export const Component: FC<Props> = ({ onClick, t }) => (
  <div className='flex flex-col space-y-3 border rounded p-8 '>
    <h1 className='text-slate-700 text-xl font-semibold'>
      {t('room_form.hero_title')}
    </h1>
    <p className='text-slate-600'>{t('room_form.hero_description')}</p>
    <Button text={t('room_form.create_room_button')} onClick={onClick} />
  </div>
);

const Container: FC = () => {
  const router = useRouter();
  const setApp = useSetAtom(appState);
  const [, setMe] = useAtom(myState);
  const { t } = useTranslation();

  const createRoom = async () => {
    try {
      const result = await openRoom();
      const roomId = result.data?.openRoom.room_id ?? '';
      const userId = result.data?.openRoom.user_id ?? '';
      const userToken = result.data?.openRoom.user_token ?? '';
      setMe({ roomId, userId, userToken });

      router.push(`/rooms/${roomId}`);
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
      onClick={() => {
        createRoom();
      }}
      t={t}
    />
  );
};

export default Container;
