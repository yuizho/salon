import Head from 'next/head';
import { FC } from 'react';
import Hands from '../../../components/organisms/Hands';
import PokerTable from '../../../components/organisms/PokerTable';
import Frame from '../../../components/templates/Frame';
import useExpirationCheck from '../../../hooks/use-expiraion-check';
import useJoin from '../../../hooks/use-join';
import useLeave from '../../../hooks/use-leave';
import useSubscription from '../../../hooks/use-subscription';

const Rooms: FC = (): JSX.Element => {
  useJoin();
  useSubscription();
  useLeave();
  useExpirationCheck();

  return (
    <>
      <Head>
        <title>Salon Room</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Frame>
        <div className="flex flex-col space-y-6">
          <PokerTable />
          <div className="flex justify-center">
            <Hands values={['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89']} />
          </div>
        </div>
      </Frame>
    </>
  );
};

export default Rooms;
