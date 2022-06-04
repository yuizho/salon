import { FC } from 'react';
import pattern from '../../public/intersecting-circles.svg';

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

const show = (value: string, choosable: boolean) => (
  <div
    key={value}
    className={`
      ${baseClassNames}
      ${choosable ? chooableClassNames : ''} 
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
    ${choooable ? chooableClassNames : ''} 
    `}
    style={{ backgroundImage: `url(${pattern})` }}
  />
);

export default Card;
