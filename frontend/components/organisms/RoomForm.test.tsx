import { render } from '@testing-library/react';
import { Provider } from 'jotai';

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
      <Provider>
        <RoomForm />
      </Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
