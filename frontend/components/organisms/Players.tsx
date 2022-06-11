import { FC } from 'react';
import { Status } from '../../graphql/schema';

import Player from './Player';

type Props = {
  myUserId: string;
  players: Array<{
    userId: string;
    status: Status;
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
          status={u.status}
          value={u.pickedCard}
          shown={showThisCard}
          me={me}
        />
      );
    })}
  </div>
);

export default Players;
