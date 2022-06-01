import { FC } from 'react';
import Card from './Card';
import User from './User';

type Props = {
  userId: string;
  value: string;
  isShown: boolean;
  isMe: boolean;
};

const Player: FC<Props> = ({
  userId, value, isShown, isMe,
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
    <User isMe={isMe} />
    <Card value={value} isShown={isShown} isChoosable={false} />
  </div>
);

export default Player;
