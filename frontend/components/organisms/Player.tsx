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

export const Component: FC<Props> = ({
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

const Container: FC<Props> = ({
  userId, status, value, shown, me,
}) => (
  <Component
    userId={userId}
    status={status}
    value={value}
    shown={shown}
    me={me}
  />
);

export default Container;
