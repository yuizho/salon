import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import RoomForm from './RoomForm';

describe('RoomForm', () => {
  test('snapshot', () => {
    const { asFragment } = render(
      <RecoilRoot>
        <RoomForm />
      </RecoilRoot>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
