import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';

export interface MenuProps
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  text: string;
  icon: IconProp;
}

export default function Menu({
  text,
  icon,
  style,
  className,
  ...rest
}: MenuProps) {
  return (
    <a
      className={`flex p-7 align-middle ${className}`}
      style={{ borderRadius: 15, backgroundColor: '#1C1C1C', ...style }}
    >
      <FontAwesomeIcon
        icon={icon}
        className='pr-5 self-center'
        size='xl'
      />
      <p>{text}</p>
    </a>
  );
}
