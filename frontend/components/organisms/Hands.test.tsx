import { render } from '@testing-library/react';
import { Provider } from 'jotai';

import Hands from './Hands';

describe('Hands', () => {
  test('snapshot', () => {
    const { asFragment } = render(
      <Provider>
        <Hands values={['1', '2', '3']} />
      </Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
