import { FC } from 'react';
import { useAtom } from 'jotai';
import { appState } from '../../states/app';
import ErrorAlert from '../atoms/ErrorAlert';
import NavBar from '../atoms/NavBar';

type ComponentProps = {
  message: string | null;
  onClose: () => void;
};

export const Component: FC<ComponentProps> = ({ message, onClose }) => (
  <>
    <NavBar />
    <ErrorAlert message={message} onClose={onClose} />
  </>
);

const Container: FC = () => {
  const [app, setApp] = useAtom(appState);

  return (
    <Component message={app.errorMessage} onClose={() => setApp({ ...app, errorMessage: null })} />
  );
};

export default Container;
