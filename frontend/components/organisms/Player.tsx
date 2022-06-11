import { FC } from 'react';
import { Status } from '../../graphql/schema';
import Card from '../atoms/Card';
import User from '../atoms/User';

type Props = {
  userId: string;
  status: Status;
  value: string;
  shown: boolean;
  me: boolean;
};

const Player: FC<Props> = ({
  userId, status, value, shown, me,
}) => (
  <div
    key={userId}
    className={`
      flex
      flex-col
      items-center
      gap-2
      p-2
      w-24
  `}
  >
    <User me={me} />
    <Card
      value={value}
      shown={shown}
      choosable={false}
      chosen={status === Status.CHOSEN}
    />
  </div>
);

export default Player;
