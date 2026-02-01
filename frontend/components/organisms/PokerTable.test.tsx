import { render } from '@testing-library/react';
import { Provider } from 'jotai';
import { Status } from '../../graphql/schema';
import PokerTable from './PokerTable';

describe('PokerTable', () => {
  test('snapshot', () => {
    const { asFragment } = render(
      <Provider>
        <PokerTable />
      </Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
