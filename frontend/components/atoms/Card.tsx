/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { FC } from 'react';

type Props = {
  value: string;
  shown: boolean;
  choosable: boolean;
  chosen: boolean;
  glow?: boolean;
  onClick?: (pickedCard: string) => Promise<boolean>;
};

const baseClassNames = `
flex
items-center justify-center
w-16 h-20
border-slate-400
rounded border
text-slate-600
select-none
bg-white
`;

const chooableClassNames = `
shadow-md
hover:cursor-pointer
hover:border-2
active:shadow-none
active:border
active:border-slate-300
`;

const Card: FC<Props> = ({ value, shown, choosable, chosen, glow = false, onClick = null }) => {
  const handleClick = () => {
    if (choosable && onClick !== null) {
      onClick(value);
    }
  };

  return (
    <div className="relative">
      {glow && <div className="w-16 h-20 absolute bg-cyan-300 blur rounded-lg  animate-pulse" />}
      <div className="relative">
        {shown ? (
          <div
            key={value}
            className={`
      ${baseClassNames}
      ${choosable ? chooableClassNames : ''}
      ${chosen && !shown ? 'animate-bounce' : ''}
      font-bold text-2xl
    `}
            onClick={handleClick}
          >
            {value}
          </div>
        ) : (
          <div
            key={value}
            className={`
            ${baseClassNames}
            ${choosable ? chooableClassNames : ''}
            ${chosen && !shown ? 'animate-bounce' : ''}
          `}
            style={{ backgroundImage: 'url(/intersecting-circles.svg)' }}
            onClick={handleClick}
          />
        )}
      </div>
    </div>
  );
};

export default Card;
