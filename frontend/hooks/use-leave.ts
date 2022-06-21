import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import leave from '../graphql/clients/leave';
import { myState } from '../states/me';

const useLeave = () => {
  const [me] = useRecoilState(myState);

  useEffect(() => {
    if (me.userId) {
      const handleWindowClose = (event: Event) => {
        event.preventDefault();
        (async () => {
          // TODO: error handling
          await leave(me.roomId, me.userId, me.userToken);
          console.log('leaved!!!!!');
        })();
        console.log('window close is handled');
        return '';
      };
      console.log('configured onbeforeunload');
      window.addEventListener('beforeunload', handleWindowClose);

      return () => {
        console.log('deconfigured onbeforeunload');
        window.removeEventListener('beforeunload', handleWindowClose);
      };
    }
    return () => {};
  }, [me]);
};

export default useLeave;
