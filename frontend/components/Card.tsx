import { FC } from 'react';
import styles from './Card.module.css';

type Props = {
  value: string;
};

// TODO: this is sample module
const Card: FC<Props> = ({ value }) => (
  <div key={value} className={styles.card}>
    {value}
  </div>
);

export default Card;
