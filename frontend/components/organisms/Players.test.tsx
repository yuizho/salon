import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { Status } from '../../graphql/schema';

import Players from './Players';

describe('Players', () => {
  test('snapshot', () => {
    const { asFragment } = render(
      <RecoilRoot>
        <Players
          myUserId="xxx"
          players={[
            { userId: 'xxx', status: Status.CHOSEN, pickedCard: 'XL' },
            { userId: 'yyy', status: Status.CHOSEN, pickedCard: 'S' },
            { userId: 'zzz', status: Status.CHOSEN, pickedCard: 'M' },
          ]}
          shown={true}
        />
      </RecoilRoot>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
