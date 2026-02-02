import { render } from '@testing-library/react';
import { Provider } from 'jotai';
import Header from './Header';

describe('Header', () => {
  test('snapshot', () => {
    const { asFragment } = render(
      <Provider>
        <Header />
      </Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
