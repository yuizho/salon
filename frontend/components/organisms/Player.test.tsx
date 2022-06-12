import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { Status } from '../../graphql/schema';

import Player from './Player';

describe('Player', () => {
  test('snapshot', () => {
    const { asFragment } = render(
      <RecoilRoot>
        <Player
          userId="xxx"
          status={Status.CHOOSING}
          value="XS"
          shown={false}
          me={false}
        />
      </RecoilRoot>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
