import { FC } from 'react';

import Player from './Player';

type Props = {
  myUserId: string;
  players: Array<{
    userId: string;
    pickedCard: string;
  }>;
  shown: boolean;
};

const Players: FC<Props> = ({ myUserId, players, shown }) => (
  <div
    className={`
  flex flex-wrap gap-2
  `}
  >
    {players.map((u) => {
      const me = u.userId === myUserId;
      const showThisCard = shown || me;
      return (
        <Player
          key={u.userId}
          userId={u.userId}
          value={u.pickedCard}
          shown={showThisCard}
          me={me}
        />
      );
    })}
  </div>
);

export default Players;
