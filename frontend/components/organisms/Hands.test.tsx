import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import Hands from './Hands';

describe('Hands', () => {
  test('snapshot', () => {
    const { asFragment } = render(
      <RecoilRoot>
        <Hands values={['1', '2', '3']} />
      </RecoilRoot>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
