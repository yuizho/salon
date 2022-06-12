import { FC, useState } from 'react';
import ErrorAlert from '../atoms/ErrorAlert';
import NavBar from '../atoms/NavBar';

type ComponentProps = {
  message: string;
  error: boolean;
  onClose: () => void;
};

export const Component: FC<ComponentProps> = ({ message, error, onClose }) => (
  <>
    <NavBar />
    <ErrorAlert message={message} error={error} onClose={onClose} />
  </>
);

const Container: FC = () => {
  // TODO: use recoil states
  const [error, setError] = useState(false);
  const [message] = useState('error hoge');

  return <Component message={message} error={error} onClose={() => setError(false)} />;
};

export default Container;
