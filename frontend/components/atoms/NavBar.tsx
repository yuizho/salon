import Link from 'next/link';
import { FC } from 'react';
import { BsGithub } from 'react-icons/bs';
import LanguageToggle from './LanguageToggle';

export const Component: FC = () => (
  <nav className='flex justify-between flex-wrap py-4 px-6 border-b'>
    <div className='flex items-center flex-shrink-0 text-slate-800'>
      {/* use a tag intentionally here to run leave process by leave hooks */}
      {/* eslint-disable @next/next/no-html-link-for-pages */}
      <a className='font-bold text-2xl tracking-tight' href='/'>
        Salon
      </a>
    </div>
    <div className='flex items-center flex-shrink-0 space-x-4'>
      <LanguageToggle />
      <div className='text-slate-600 text-xl'>
        <Link
          href='https://github.com/yuizho/salon'
          target='_blank'
          rel='noopener noreferrer'
        >
          <BsGithub />
        </Link>
      </div>
    </div>
  </nav>
);

const Container: FC = () => <Component />;

export default Container;
