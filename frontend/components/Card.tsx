import { FC } from 'react';
import styles from './Card.module.css';

type Props = {
  value: string;
};

const Card: FC<Props> = ({ value }) => (
  <div key={value} className={styles.card}>
    {value}
  </div>
);

export default Card;
