import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import RoomForm from './RoomForm';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

import { useRouter } from 'next/router';

describe('RoomForm', () => {
  test('snapshot', () => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });

    const { asFragment } = render(
      <RecoilRoot>
        <RoomForm />
      </RecoilRoot>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
