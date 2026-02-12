import { FC } from 'react';
import { Trans } from 'react-i18next';
import Frame from '../components/templates/Frame';

const NotFound: FC = () => (
  <Frame>
    <div className='space-y-6 border rounded p-8 text-slate-600'>
      <Trans
        i18nKey='not_found'
        components={[
          // use a tag intentionally here to run leave process by leave hooks
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a key='top' href='/' className='underline'>
            dummy
          </a>,
        ]}
      />
    </div>
  </Frame>
);

export default NotFound;
