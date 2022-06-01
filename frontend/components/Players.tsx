import { FC } from 'react';

import Player from './Player';

type Props = {
  myUserId: string;
  players: Array<{
    userId: string;
    pickedCard: string;
  }>;
  shouldOpenCards: boolean;
};

const Players: FC<Props> = ({ myUserId, players, shouldOpenCards }) => (
  <div
    className={`
  flex flex-wrap gap-2
  `}
  >
    {players.map((u) => {
      const isMe = u.userId === myUserId;
      const isShown = shouldOpenCards || isMe;
      return (
        <Player
          key={u.userId}
          userId={u.userId}
          value={u.pickedCard}
          isShown={isShown}
          isMe={isMe}
        />
      );
    })}
  </div>
);

export default Players;
