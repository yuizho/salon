import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import ModalDialog from './ModalDialog';

describe('ModalDialog', () => {
  test('snapshot', () => {
    const { asFragment } = render(
      <RecoilRoot>
        <ModalDialog
          message="メッセージ"
          onClickOK={() => console.log('foo')}
          open={true}
          setOpen={() => console.log('bar')}
        />
      </RecoilRoot>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
