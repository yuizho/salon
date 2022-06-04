import { FC } from 'react';
import Card from '../atoms/Card';

type Props = {
  values: Array<string>;
};

const Hands: FC<Props> = ({ values }) => (
  <div
    className={`
    flex flex-wrap gap-1
  `}
  >
    {values.map((v) => (
      <Card key={v} value={v} shown choosable />
    ))}
  </div>
);

export default Hands;
