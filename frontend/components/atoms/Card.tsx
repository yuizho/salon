/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { FC } from 'react';

type Props = {
  value: string;
  shown: boolean;
  choosable: boolean;
  // eslint-disable-next-line react/require-default-props
  onClick?: (pickedCard: string) => Promise<boolean> | null;
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

const Card: FC<Props> = ({
  value, shown, choosable, onClick = null,
}) => {
  const handleClick = () => {
    if (choosable && onClick !== null) {
      onClick(value);
    }
  };

  return (
    <div>
      {shown ? (
        <div
          key={value}
          className={`
      ${baseClassNames}
      ${choosable ? chooableClassNames : ''}
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
          `}
          style={{ backgroundImage: 'url(/intersecting-circles.svg)' }}
          onClick={handleClick}
        />
      )}
    </div>
  );
};

export default Card;
