/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC } from 'react';
import { RiUserFill, RiUserLine } from 'react-icons/ri';

type Props = {
  me: boolean;
  clickable: boolean;
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

export const Component: FC<Props> = ({ me, clickable, onClick }) => (
  <div
    className={`
      flex
      flex-col
      items-center
      w-20
    `}
    onClick={
      clickable
        ? () => {
            onClick();
          }
        : () => {}
    }
  >
    <div
      className={`
        flex
        items-center justify-center
        h-14
        w-14
        rounded-full
        border
        bg-white
        ${clickable ? clickableUsesr : 'border-slate-400'}
      `}
    >
      <div className="relative text-slate-600">
        <div className="text-3xl">{me ? <RiUserFill /> : <RiUserLine />}</div>
      </div>
    </div>
  </div>
);

const Container: FC<Props> = ({ me, clickable, onClick }) => (
  <Component me={me} clickable={clickable} onClick={onClick} />
);

export default Container;
