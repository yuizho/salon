import { FC } from 'react';

type Props = {
  text: string;
  onClick: () => void;
  glow?: boolean;
};

export const Component: FC<Props> = ({ text, onClick, glow }) => (
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
      shadow-md
      bg-white
      w-full
      hover:border-2
      active:shadow-none
      active:border
      active:border-slate-300
    `}
      onClick={onClick}
    >
      {text}
    </button>
  </div>
);

const Container: FC<Props> = ({ text, onClick, glow = false }) => (
  <Component text={text} onClick={onClick} glow={glow} />
);

export default Container;
