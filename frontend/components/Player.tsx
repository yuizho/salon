import { FC } from 'react';
import Card from './Card';
import User from './User';

type Props = {
  userId: string;
  value: string;
  shown: boolean;
  me: boolean;
};

const Player: FC<Props> = ({
  userId, value, shown, me,
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
    <Card value={value} shown={shown} choosable={false} />
  </div>
);

export default Player;
