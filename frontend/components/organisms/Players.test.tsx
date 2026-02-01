import { render } from '@testing-library/react';
import { Provider } from 'jotai';
import { Status } from '../../graphql/schema';

import Players from './Players';

describe('Players', () => {
  test('snapshot', () => {
    const { asFragment } = render(
      <Provider>
        <Players
          myUserId="xxx"
          players={[
            { userId: 'xxx', status: Status.CHOSEN, pickedCard: 'XL' },
            { userId: 'yyy', status: Status.CHOSEN, pickedCard: 'S' },
            { userId: 'zzz', status: Status.CHOSEN, pickedCard: 'M' },
          ]}
          shown={true}
        />
      </Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
