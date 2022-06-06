import { FC } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import Button from '../../../components/atoms/Button';
import Hands from '../../../components/organisms/Hands';
import Players from '../../../components/organisms/Players';
import Frame from '../../../components/templates/Frame';
import { Status } from '../../../graphql/schema';
import useJoin from '../../../hooks/use-join';
import useSubscription from '../../../hooks/use-subscription';
import { myState } from '../../../states/me';
import { pokerState } from '../../../states/poker';
import { usersState } from '../../../states/users';

const Rooms: FC = (): JSX.Element => {
  useJoin();
  useSubscription();
  const [me] = useRecoilState(myState);
  const [users] = useRecoilState(usersState);
  const poker = useRecoilValue(pokerState);

  return (
    <Frame>
      <div className="flex flex-col space-y-10">
        <div className="flex flex-col space-y-6 border rounded p-8">
          <Players
            myUserId={me.userId}
            players={users
              .filter((u) => u.status !== Status.LEAVED)
              .map((u) => ({ userId: u.userId, pickedCard: u.pickedCard }))}
            shown={poker.shown}
          />
          <Button text="Reset" onClick={() => {}} />
        </div>
        <div className="flex justify-center">
          <Hands
            values={['0', '1', '2', '3', '5', '8', '13', '21', '34', '55']}
          />
        </div>
      </div>
    </Frame>
  );
};

export default Rooms;
