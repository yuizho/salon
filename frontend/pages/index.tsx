import { FC } from 'react';
import RoomForm from '../components/organisms/RoomForm';
import Frame from '../components/templates/Frame';

const Home: FC = (): JSX.Element => (
  <Frame>
    <main className="flex flex-col gap-5">
      <p className="text-slate-700 text-lg font-semibold px-1">
        Salonはログイン不要の無料Webプランニングポーカーサービスです
      </p>
      <RoomForm />
    </main>
  </Frame>
);

export default Home;
