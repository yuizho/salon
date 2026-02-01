import { render } from '@testing-library/react';
import { Provider } from 'jotai';

import RoomForm from './RoomForm';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: {},
    asPath: '',
    route: '/',
  }),
}));

describe('RoomForm', () => {
  test('snapshot', () => {
    const { asFragment } = render(
      <Provider>
        <RoomForm />
      </Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
