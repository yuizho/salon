import { FC } from 'react';
import Card from './Card';
import User from './User';

type Props = {
  isShown: boolean;
  isMe: boolean;
};

const Player: FC<Props> = ({ isShown, isMe }) => (
  <div
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
    <Card value="XS" isShown={isShown} isChoosable={false} />
  </div>
);

export default Player;
