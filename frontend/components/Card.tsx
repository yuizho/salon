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
rounded border border-black/50
shadow-xl
`;

const chooableClassNames = `
hover:animate-bounce hover:cursor-pointer
`;

const shown = (value: string, isChoosable: boolean) => (
  <div
    key={value}
    className={`
      ${baseClassNames}
      ${isChoosable ? chooableClassNames : ''} 
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
    ${isChoosable ? chooableClassNames : ''} 
    `}
    style={{ backgroundImage: `url(${pattern})` }}
  />
);

export default Card;
