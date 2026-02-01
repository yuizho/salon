import { render } from '@testing-library/react';
import { Provider } from 'jotai';
import { Status } from '../../graphql/schema';

import Player from './Player';

describe('Player', () => {
  test('snapshot', () => {
    const { asFragment } = render(
      <Provider>
        <Player userId="xxx" status={Status.CHOOSING} value="XS" shown={false} me={false} />
      </Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
