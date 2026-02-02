import { render } from '@testing-library/react';
import { Provider } from 'jotai';

import ModalDialog from './ModalDialog';

describe('ModalDialog', () => {
  test('snapshot', () => {
    const { asFragment } = render(
      <Provider>
        <ModalDialog
          message='メッセージ'
          onClickOK={() => console.log('foo')}
          open={true}
          setOpen={() => console.log('bar')}
        />
      </Provider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
