import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface BoxProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export default function Box({ children, className, style, ...rest }: BoxProps) {
  return (
    <div
      {...rest}
      className={`flex flex-col justify-center align-middle mx-5 rounded-3xl bg-black border-[0.8px] ${className}`}
      style={{ backgroundColor: '#000000', ...style }}
    >
      {children}
    </div>
  );
}
