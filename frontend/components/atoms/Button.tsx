import { FC } from 'react';

type Props = {
  text: string;
  onClick: () => void;
};

export const Component: FC<Props> = ({ text, onClick }) => (
  <button
    type="button"
    className={`
      py-2 px-4
      font-semibold
      border-slate-400
      text-slate-600
      border
      rounded
      shadow-md
      bg-white
      w-full
      sm:w-auto
      sm:text-sm
      hover:border-2
      active:shadow-none
      active:border
      active:border-slate-300
    `}
    onClick={onClick}
  >
    {text}
  </button>
);

const Container: FC<Props> = ({ text, onClick }) => (
  <Component text={text} onClick={onClick} />
);

export default Container;
