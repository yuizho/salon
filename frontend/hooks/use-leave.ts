import { API } from 'aws-amplify';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { GraphQLResult } from '@aws-amplify/api';
import { LeaveMutation, LeaveMutationVariables } from '../graphql/schema';
import { leave } from '../graphql/mutations';
import { myState } from '../states/me';

const mutateLeave = async (roomId: string, userId: string) => {
  const result = (await API.graphql({
    query: leave,
    variables: {
      room_id: roomId,
      user_id: userId,
    } as LeaveMutationVariables,
  })) as GraphQLResult<LeaveMutation>;
  return result;
};

const useLeave = () => {
  const [me] = useRecoilState(myState);

  useEffect(() => {
    if (me.userId) {
      const handleWindowClose = (event: Event) => {
        event.preventDefault();
        (async () => {
          // TODO: error handling
          await mutateLeave(me.roomId, me.userId);
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
