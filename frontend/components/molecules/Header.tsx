import { FC } from 'react';
import { useRecoilState } from 'recoil';
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
  const [app, setApp] = useRecoilState(appState);

  return (
    <Component message={app.errorMessage} onClose={() => setApp({ ...app, errorMessage: null })} />
  );
};

export default Container;
