import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
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
