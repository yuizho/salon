import { FC } from 'react';
import Frame from '../components/templates/Frame';

const NotFound: FC = (): JSX.Element => (
  <Frame>
    <div className="flex flex-col space-y-6 border rounded p-8">
      指定された部屋はクローズされました
    </div>
  </Frame>
);

export default NotFound;
