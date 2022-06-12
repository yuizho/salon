import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import Header from './Header';

describe('Header', () => {
  test('snapshot', () => {
    const { asFragment } = render(
      <RecoilRoot>
        <Header />
      </RecoilRoot>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
