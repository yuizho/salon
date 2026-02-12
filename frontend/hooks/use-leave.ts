import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import leave from '../graphql/clients/leave';
import { myState } from '../states/me';

const useLeave = () => {
  const me = useAtomValue(myState);

  useEffect(() => {
    if (me.userId) {
      const handleWindowClose = (event: Event) => {
        event.preventDefault();
        (async () => {
          try {
            await leave(me.roomId, me.userId, me.userToken);
          } catch (e) {
            console.error(e);
          }
        })();
        return '';
      };
      window.addEventListener('beforeunload', handleWindowClose);

      return () => {
        window.removeEventListener('beforeunload', handleWindowClose);
      };
    }
    return () => {};
  }, [me]);
};

export default useLeave;
