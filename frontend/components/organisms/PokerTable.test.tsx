import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { Status } from '../../graphql/schema';
import PokerTable from './PokerTable';

describe('PokerTable', () => {
  test('snapshot', () => {
    const { asFragment } = render(
      <RecoilRoot>
        <PokerTable />
      </RecoilRoot>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
