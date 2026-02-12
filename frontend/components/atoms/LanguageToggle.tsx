import { useAtom } from 'jotai';
import { FC } from 'react';
import { appState } from '../../states/app';

export const Component: FC<{
  language: 'ja' | 'en';
  onToggle: (lang: 'ja' | 'en') => void;
}> = ({ language, onToggle }) => (
  <div className='flex items-center space-x-2 text-sm font-medium'>
    <button
      type='button'
      className={`px-2 py-1 rounded ${
        language === 'ja'
          ? 'bg-slate-200 text-slate-800'
          : 'text-slate-500 hover:text-slate-800'
      }`}
      onClick={() => onToggle('ja')}
    >
      JP
    </button>
    <span className='text-slate-300'>|</span>
    <button
      type='button'
      className={`px-2 py-1 rounded ${
        language === 'en'
          ? 'bg-slate-200 text-slate-800'
          : 'text-slate-500 hover:text-slate-800'
      }`}
      onClick={() => onToggle('en')}
    >
      EN
    </button>
  </div>
);

const Container: FC = () => {
  const [app, setApp] = useAtom(appState);

  const onToggle = (lang: 'ja' | 'en') => {
    setApp((prev) => ({ ...prev, language: lang }));
  };

  return <Component language={app.language} onToggle={onToggle} />;
};

export default Container;
