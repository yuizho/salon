import { FC } from 'react';
import pattern from '../public/intersecting-circles.svg';

type Props = {
  value: string;
  isShown?: boolean;
  isChoosable?: boolean;
};

// TODO: this is sample module
const Card: FC<Props> = ({ value, isShown = true, isChoosable = true }) => (isShown ? shown(value, isChoosable) : hidden(value, isChoosable));

const baseClassNames = `
flex
items-center justify-center
w-16 h-20
rounded border
`;

const chooableClassNames = `
border-black/50
shadow-md
hover:animate-bounce
hover:cursor-pointer
hover:border-2
active:animate-none
active:shadow-none
active:border
active:border-black/25
`;

const unchoosableClassnames = `
border-black/25
`;

const shown = (value: string, isChoosable: boolean) => (
  <div
    key={value}
    className={`
      ${baseClassNames}
      ${isChoosable ? chooableClassNames : unchoosableClassnames} 
      font-bold text-2xl
    `}
  >
    {value}
  </div>
);

const hidden = (value: string, isChoosable: boolean) => (
  <div
    key={value}
    className={`
    ${baseClassNames}
    ${isChoosable ? chooableClassNames : unchoosableClassnames} 
    `}
    style={{ backgroundImage: `url(${pattern})` }}
  />
);

export default Card;
