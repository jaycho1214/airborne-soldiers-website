import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
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
  href,
  ref,
  ...rest
}: MenuProps) {
  return (
    <Link
      {...rest}
      href={href ?? '#'}
      className={`flex p-7 align-middle ${className}`}
      style={{ borderRadius: 15, backgroundColor: '#1C1C1C', ...style }}
    >
      <FontAwesomeIcon
        icon={icon}
        className='pr-5 self-center'
        size='xl'
        color='white'
      />
      <p className='text-white'>{text}</p>
    </Link>
  );
}
