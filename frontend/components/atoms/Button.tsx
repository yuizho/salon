import { FC } from 'react';

type Props = {
  text: string;
  glow?: boolean;
  clickable?: boolean;
  onClick: () => void;
};

export const Component: FC<Props> = ({ text, glow, clickable, onClick }) => (
  <div className="relative w-full">
    {glow && <div className="absolute inset-0 bg-cyan-300 blur rounded-lg  animate-pulse" />}
    <button
      type="button"
      className={`
      relative
      py-2 px-4
      font-semibold
      border-slate-400
      text-slate-600
      border
      rounded
      bg-white
      w-full
      ${
        clickable
          ? 'shadow-md hover:border-2 active:shadow-none active:border active:border-slate-300'
          : 'cursor-default'
      }
    `}
      onClick={clickable ? onClick : () => {}}
    >
      {text}
    </button>
  </div>
);

const Container: FC<Props> = ({ text, glow = false, clickable = true, onClick }) => (
  <Component text={text} glow={glow} clickable={clickable} onClick={onClick} />
);

export default Container;
