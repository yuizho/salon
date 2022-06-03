import { FC } from 'react';

type Props = {
  isMe: boolean;
};

const clickableUsesr = `
border-black/50 shadow-md
hover:cursor-pointer
hover:border-blue-600
hover:border-2
active:animate-none
active:shadow-none
active:border
active:border-blue-600/25
`;

const User: FC<Props> = ({ isMe }) => (
  <div
    className={`
      flex
      flex-col
      items-center
      w-20
    `}
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
        ${isMe ? 'border-black/25' : clickableUsesr}
      `}
    >
      <div className="relative">
        <svg
          className="h-10 w-10 text-black/75"
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
        {isMe ? (
          <div
            className={`
          absolute
          bottom-8
          left-1/2 -translate-x-1/2
          select-none
          text-black/75
          text-md
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

export default User;
