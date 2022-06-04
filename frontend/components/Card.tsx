import { FC } from 'react';
import pattern from '../public/intersecting-circles.svg';

type Props = {
  value: string;
  shown: boolean;
  choosable: boolean;
};

const Card: FC<Props> = ({ value, shown, choosable }) => (
  <div>{shown ? show(value, choosable) : hide(value, choosable)}</div>
);

const baseClassNames = `
flex
items-center justify-center
w-16 h-20
rounded border
bg-white
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

const show = (value: string, choosable: boolean) => (
  <div
    key={value}
    className={`
      ${baseClassNames}
      ${choosable ? chooableClassNames : unchoosableClassnames} 
      font-bold text-2xl
    `}
  >
    {value}
  </div>
);

const hide = (value: string, choooable: boolean) => (
  <div
    key={value}
    className={`
    ${baseClassNames}
    ${choooable ? chooableClassNames : unchoosableClassnames} 
    `}
    style={{ backgroundImage: `url(${pattern})` }}
  />
);

export default Card;
