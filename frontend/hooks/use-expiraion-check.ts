import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { roomState } from '../states/room';

const useExpirationCheck = () => {
  const router = useRouter();
  const [room] = useRecoilState(roomState);

  useEffect(() => {
    if (!router.isReady) {
      return () => {};
    }

    const timerId = setInterval(() => {
      const now = Math.trunc(Date.now() / 1000);
      if (room.expirationUnixTimestamp > 0 && now > room.expirationUnixTimestamp) {
        router.push('/404');
      }
    }, 2000);

    return () => {
      clearInterval(timerId);
    };
  }, [router, room]);
};

export default useExpirationCheck;
