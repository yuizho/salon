/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC } from 'react';

type Props = {
  me: boolean;
  onClick: () => void;
};

const clickableUsesr = `
border-slate-400
shadow-md
hover:cursor-pointer
hover:border-2
active:animate-none
active:shadow-none
active:border
active:border-slate-300
`;

export const Component: FC<Props> = ({ me, onClick }) => (
  <div
    className={`
      flex
      flex-col
      items-center
      w-20
    `}
    onClick={
      me
        ? () => {}
        : () => {
          onClick();
        }
    }
  >
    <div
      className={`
        flex
        items-center justify-center
        h-16
        w-16
        rounded-full
        border
        bg-white
        ${me ? 'border-slate-400' : clickableUsesr}
      `}
    >
      <div className="relative">
        <svg
          className="h-10 w-10 text-slate-600"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <circle cx="12" cy="7" r="4" />
          <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
        </svg>
        {me ? (
          <div
            className={`
          absolute
          bottom-8
          left-1/2 -translate-x-1/2
          select-none
          text-slate-600
          text-md
          font-semibold
        `}
          >
            you
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  </div>
);

const Container: FC<Props> = ({ me, onClick }) => (
  <Component me={me} onClick={onClick} />
);

export default Container;
